import { NextRequest, NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";
import { getNewsLocale } from "@/lib/newsLocales";
import { getCategoryKeyword } from "@/lib/newsCategories";

// Proxies Google News' public RSS search feed and normalizes it to JSON.
// No API key required. Google News RSS doesn't send CORS headers, so this
// route exists purely to fetch it server-side for the browser client.

export const runtime = "nodejs";

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
  const countryCode = searchParams.get("countryCode")?.trim() ?? "";
  const category = searchParams.get("category") ?? "top";

  if (!city) {
    return NextResponse.json({ error: "Missing city" }, { status: 400 });
  }

  // Search the place's own Google News edition rather than always forcing
  // the US English one — this is what actually surfaces real local coverage
  // for cities outside the US, and it also scopes results to that country's
  // press, which sidesteps same-named-city collisions across countries
  // (e.g. Lisbon, Portugal vs. Lisbon, Ohio).
  const { hl, gl, ceid } = getNewsLocale(countryCode);

  // Quote multi-word city names to keep them together, but otherwise use
  // separate (implicit-AND) terms rather than one forced exact phrase —
  // combining "city region" into a single quoted phrase (e.g. `"Lisbon
  // Lisboa"`) rarely matches any real article verbatim, so Google News was
  // falling back to loosely-related junk (wire-service earthquake bulletins
  // that happen to namedrop the city) instead of real local coverage.
  const cityTerm = /\s/.test(city) ? `"${city}"` : city;
  const keyword = getCategoryKeyword(category, hl);
  const query = [cityTerm, region, keyword].filter(Boolean).join(" ");

  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(
    query
  )}&hl=${hl}&gl=${gl}&ceid=${ceid}`;

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
      { articles, query, category },
      { headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1800" } }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch news" },
      { status: 502 }
    );
  }
}
