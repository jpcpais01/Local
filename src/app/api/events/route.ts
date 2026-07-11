import { NextRequest, NextResponse } from "next/server";

// Proxies the Ticketmaster Discovery API (free tier: ~5,000 req/day, no
// credit card required — https://developer.ticketmaster.com). The key is
// kept server-side via the TICKETMASTER_API_KEY env var. If it's not
// configured, we return a typed "not configured" response so the UI can
// show setup instructions instead of a generic error.

export const runtime = "nodejs";

interface TmImage {
  url: string;
  width: number;
  ratio?: string;
}
interface TmEvent {
  id: string;
  name: string;
  url: string;
  images?: TmImage[];
  dates?: { start?: { localDate?: string; localTime?: string; dateTime?: string } };
  classifications?: { segment?: { name?: string }; genre?: { name?: string } }[];
  priceRanges?: { min?: number; max?: number; currency?: string }[];
  _embedded?: {
    venues?: {
      name?: string;
      city?: { name?: string };
      state?: { stateCode?: string };
      address?: { line1?: string };
      location?: { latitude?: string; longitude?: string };
    }[];
  };
}

function pickImage(images?: TmImage[]): string | null {
  if (!images?.length) return null;
  const wide = images.filter((i) => (i.ratio ?? "16_9") === "16_9");
  const pool = wide.length ? wide : images;
  return pool.sort((a, b) => b.width - a.width)[0]?.url ?? images[0].url;
}

export async function GET(req: NextRequest) {
  const apiKey = process.env.TICKETMASTER_API_KEY;
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const radius = searchParams.get("radius") ?? "25";
  const category = searchParams.get("category"); // music, sports, arts, family, etc.

  if (!lat || !lon) {
    return NextResponse.json({ error: "Missing lat/lon" }, { status: 400 });
  }

  if (!apiKey) {
    return NextResponse.json({ configured: false, events: [] }, { status: 200 });
  }

  const params = new URLSearchParams({
    apikey: apiKey,
    latlong: `${lat},${lon}`,
    radius,
    unit: "miles",
    sort: "date,asc",
    size: "40",
  });
  if (category && category !== "all") params.set("classificationName", category);

  try {
    const res = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?${params}`, {
      next: { revalidate: 900 },
    });

    if (res.status === 404) {
      // Ticketmaster 404s when zero results match — treat as an empty list
      return NextResponse.json({ configured: true, events: [] });
    }
    if (!res.ok) throw new Error(`Upstream ${res.status}`);

    const data = await res.json();
    const raw: TmEvent[] = data?._embedded?.events ?? [];

    const events = raw.map((e) => {
      const venue = e._embedded?.venues?.[0];
      const price = e.priceRanges?.[0];
      return {
        id: e.id,
        name: e.name,
        url: e.url,
        image: pickImage(e.images),
        date: e.dates?.start?.localDate ?? null,
        time: e.dates?.start?.localTime ?? null,
        dateTime: e.dates?.start?.dateTime ?? null,
        segment: e.classifications?.[0]?.segment?.name ?? null,
        genre: e.classifications?.[0]?.genre?.name ?? null,
        venueName: venue?.name ?? null,
        venueCity: venue?.city?.name ?? null,
        venueAddress: venue?.address?.line1 ?? null,
        priceMin: price?.min ?? null,
        priceMax: price?.max ?? null,
        currency: price?.currency ?? null,
      };
    });

    return NextResponse.json(
      { configured: true, events },
      { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600" } }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch events" },
      { status: 502 }
    );
  }
}
