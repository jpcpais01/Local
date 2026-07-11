import { NextRequest, NextResponse } from "next/server";

// Proxies the SeatGeek Platform API (free, self-serve — no app review, just
// create an account at seatgeek.com/account/develop and grab a client_id).
// This replaced Ticketmaster here specifically because Ticketmaster's key
// requires a manual approval step that can take a while / get rejected;
// SeatGeek's client_id is issued instantly. The key is still kept
// server-side via the SEATGEEK_CLIENT_ID env var. If it's not configured, we
// return a typed "not configured" response so the UI can show setup
// instructions instead of a generic error.
//
// Docs: https://seatgeek.github.io/

export const runtime = "nodejs";

interface SgPerformer {
  name?: string;
  image?: string;
}
interface SgTaxonomy {
  name?: string;
}
interface SgVenue {
  name?: string;
  city?: string;
  address?: string;
}
interface SgEvent {
  id: number;
  title: string;
  url: string;
  type?: string;
  datetime_local?: string;
  datetime_utc?: string;
  performers?: SgPerformer[];
  taxonomies?: SgTaxonomy[];
  venue?: SgVenue;
  stats?: { lowest_price?: number; highest_price?: number };
}

function toIsoUtc(datetimeUtc: string | undefined): string | null {
  if (!datetimeUtc) return null;
  return datetimeUtc.endsWith("Z") ? datetimeUtc : `${datetimeUtc}Z`;
}

export async function GET(req: NextRequest) {
  const clientId = process.env.SEATGEEK_CLIENT_ID;
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const radius = searchParams.get("radius") ?? "25";
  const category = searchParams.get("category"); // concert, sports, theater, comedy, family

  if (!lat || !lon) {
    return NextResponse.json({ error: "Missing lat/lon" }, { status: 400 });
  }

  if (!clientId) {
    return NextResponse.json({ configured: false, events: [] }, { status: 200 });
  }

  const params = new URLSearchParams({
    client_id: clientId,
    lat,
    lon,
    range: `${radius}mi`,
    per_page: "40",
    sort: "datetime_local.asc",
  });
  if (category && category !== "all") params.set("taxonomies.name", category);

  try {
    const res = await fetch(`https://api.seatgeek.com/2/events?${params}`, {
      next: { revalidate: 900 },
    });
    if (!res.ok) throw new Error(`Upstream ${res.status}`);

    const data = await res.json();
    const raw: SgEvent[] = data?.events ?? [];

    const events = raw.map((e) => {
      const dateTime = toIsoUtc(e.datetime_utc);
      return {
        id: String(e.id),
        name: e.title,
        url: e.url,
        image: e.performers?.[0]?.image ?? null,
        date: e.datetime_local?.slice(0, 10) ?? null,
        time: e.datetime_local?.slice(11, 16) ?? null,
        dateTime,
        segment: e.taxonomies?.[0]?.name ?? e.type ?? null,
        genre: e.taxonomies?.[1]?.name ?? null,
        venueName: e.venue?.name ?? null,
        venueCity: e.venue?.city ?? null,
        venueAddress: e.venue?.address ?? null,
        priceMin: e.stats?.lowest_price ?? null,
        priceMax: e.stats?.highest_price ?? null,
        currency: e.stats?.lowest_price != null ? "USD" : null,
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
