import type { LocationInfo } from "./types";

// Both APIs below are free, keyless, and CORS-enabled for direct browser use:
// - Open-Meteo Geocoding: place search by name
// - BigDataCloud client reverse-geocode: coordinates -> place name

export function makeLocationId(lat: number, lon: number): string {
  return `${lat.toFixed(4)},${lon.toFixed(4)}`;
}

interface OpenMeteoGeoResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  country_code?: string;
  admin1?: string;
}

export async function searchLocations(query: string): Promise<LocationInfo[]> {
  if (!query.trim()) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    query
  )}&count=8&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Location search failed");
  const data = await res.json();
  const results: OpenMeteoGeoResult[] = data.results ?? [];
  return results.map((r) => ({
    id: makeLocationId(r.latitude, r.longitude),
    label: [r.name, r.admin1, r.country].filter(Boolean).join(", "),
    city: r.name,
    region: r.admin1,
    country: r.country,
    countryCode: r.country_code,
    lat: r.latitude,
    lon: r.longitude,
  }));
}

export async function reverseGeocode(lat: number, lon: number): Promise<LocationInfo> {
  const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Reverse geocode failed");
  const data = await res.json();
  const city: string =
    data.city || data.locality || data.principalSubdivision || "Current location";
  const region: string | undefined = data.principalSubdivision;
  const country: string | undefined = data.countryName;
  return {
    id: makeLocationId(lat, lon),
    label: [city, region, country].filter(Boolean).join(", "),
    city,
    region,
    country,
    countryCode: data.countryCode,
    lat,
    lon,
    isCurrent: true,
  };
}
