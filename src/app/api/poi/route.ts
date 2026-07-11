import { NextRequest, NextResponse } from "next/server";
import { haversineKm } from "@/lib/geo";

// Proxies the Overpass API (OpenStreetMap) for nearby points of interest.
// Free, keyless. Proxied server-side both to keep one consistent egress IP
// (Overpass rate-limits by IP) and because query bodies are easier to POST
// from a server than to coax through a client fetch reliably.

export const runtime = "nodejs";

const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

function categorize(tags: Record<string, string>): { category: string; icon: string } {
  if (tags.amenity === "restaurant" || tags.amenity === "fast_food")
    return { category: "Restaurant", icon: "utensils" };
  if (tags.amenity === "cafe") return { category: "Cafe", icon: "coffee" };
  if (tags.amenity === "bar" || tags.amenity === "pub") return { category: "Bar", icon: "beer" };
  if (tags.amenity === "library") return { category: "Library", icon: "book" };
  if (tags.amenity === "cinema") return { category: "Cinema", icon: "clapperboard" };
  if (tags.amenity === "theatre") return { category: "Theatre", icon: "drama" };
  if (tags.amenity === "marketplace") return { category: "Market", icon: "shopping-basket" };
  if (tags.leisure === "park" || tags.leisure === "garden")
    return { category: "Park", icon: "trees" };
  if (tags.leisure === "fitness_centre") return { category: "Gym", icon: "dumbbell" };
  if (tags.leisure === "playground") return { category: "Playground", icon: "baby" };
  if (tags.tourism === "museum") return { category: "Museum", icon: "landmark" };
  if (tags.tourism === "gallery") return { category: "Gallery", icon: "image" };
  if (tags.tourism === "attraction") return { category: "Attraction", icon: "sparkles" };
  if (tags.tourism === "viewpoint") return { category: "Viewpoint", icon: "mountain" };
  if (tags.shop === "mall" || tags.shop === "supermarket")
    return { category: "Shopping", icon: "shopping-cart" };
  return { category: "Place", icon: "map-pin" };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));
  const radius = Math.min(Number(searchParams.get("radius") ?? 3000), 8000);

  if (!lat || !lon) {
    return NextResponse.json({ error: "Missing lat/lon" }, { status: 400 });
  }

  const query = `
    [out:json][timeout:25];
    (
      node["amenity"~"^(restaurant|cafe|bar|pub|library|cinema|theatre|marketplace)$"]["name"](around:${radius},${lat},${lon});
      node["leisure"~"^(park|garden|fitness_centre|playground)$"]["name"](around:${radius},${lat},${lon});
      node["tourism"~"^(museum|gallery|attraction|viewpoint)$"]["name"](around:${radius},${lat},${lon});
      way["leisure"="park"]["name"](around:${radius},${lat},${lon});
      node["shop"~"^(mall|supermarket)$"]["name"](around:${radius},${lat},${lon});
    );
    out center 60;
  `;

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: query,
        next: { revalidate: 1800 },
      });
      if (!res.ok) continue;
      const data = await res.json();
      const elements: OverpassElement[] = data.elements ?? [];

      const places = elements
        .filter((e) => e.tags?.name)
        .map((e) => {
          const plat = e.lat ?? e.center?.lat ?? lat;
          const plon = e.lon ?? e.center?.lon ?? lon;
          const meta = categorize(e.tags!);
          return {
            id: `${e.type}/${e.id}`,
            name: e.tags!.name,
            category: meta.category,
            icon: meta.icon,
            lat: plat,
            lon: plon,
            distanceKm: haversineKm(lat, lon, plat, plon),
            address: [e.tags!["addr:housenumber"], e.tags!["addr:street"]]
              .filter(Boolean)
              .join(" ") || null,
          };
        })
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, 50);

      return NextResponse.json(
        { places },
        { headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" } }
      );
    } catch {
      continue; // try next mirror
    }
  }

  return NextResponse.json({ error: "All Overpass mirrors failed" }, { status: 502 });
}
