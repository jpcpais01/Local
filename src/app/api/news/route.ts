import { NextRequest, NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";

// Proxies Google News' public RSS search feed and normalizes it to JSON.
// No API key required. Google News RSS doesn't send CORS headers, so this
// route exists purely to fetch it server-side for the browser client.

export const runtime = "nodejs";

const CATEGORY_KEYWORDS: Record<string, string> = {
  top: "",
  local: "local news",
  sports: "sports",
  business: "business economy",
  technology: "technology",
  entertainment: "entertainment",
  health: "health",
  weather: "weather",
};

interface RawItem {
  title?: string;
  link?: string;
  pubDate?: string;
  description?: string;
  source?: { "#text"?: string; "@_url"?: string } | string;
}

function stripHtml(input: string): string {
  return input
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city")?.trim();
  const region = searchParams.get("region")?.trim() ?? "";
  const category = searchParams.get("category") ?? "top";

  if (!city) {
    return NextResponse.json({ error: "Missing city" }, { status: 400 });
  }

  const place = region ? `${city} ${region}` : city;
  const keyword = CATEGORY_KEYWORDS[category] ?? "";
  const query = keyword ? `"${place}" ${keyword}` : `"${place}"`;

  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(
    query
  )}&hl=en-US&gl=US&ceid=US:en`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; LociApp/1.0)" },
      next: { revalidate: 600 },
    });
    if (!res.ok) throw new Error(`Upstream ${res.status}`);
    const xml = await res.text();

    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
    const parsed = parser.parse(xml);
    const items: RawItem[] = parsed?.rss?.channel?.item
      ? Array.isArray(parsed.rss.channel.item)
        ? parsed.rss.channel.item
        : [parsed.rss.channel.item]
      : [];

    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

    const articles = items.slice(0, 30).map((item, i) => {
      const rawTitle = String(item.title ?? "");
      const title = stripHtml(rawTitle);
      const sourceObj = item.source;
      const source =
        typeof sourceObj === "string"
          ? sourceObj
          : sourceObj?.["#text"] ?? rawTitle.split(" - ").pop() ?? "News";

      // Google News RSS descriptions are usually just "<title> <source>"
      // re-wrapped in HTML — not a real excerpt. Drop it when redundant.
      const rawSummary = item.description ? stripHtml(item.description) : "";
      const summary = normalize(rawSummary).startsWith(normalize(title)) ? "" : rawSummary;

      return {
        id: `${i}-${item.link ?? rawTitle}`,
        title,
        link: item.link ?? "#",
        source,
        publishedAt: item.pubDate ?? null,
        summary,
      };
    });

    return NextResponse.json(
      { articles, query: place, category },
      { headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1800" } }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch news" },
      { status: 502 }
    );
  }
}
