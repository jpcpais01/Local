import type { NearbyPlace } from "./wikipedia";
import type { Place } from "@/hooks/usePoi";

export interface Spot {
  id: string;
  name: string;
  category: string;
  icon: string;
  lat: number;
  lon: number;
  distanceKm: number;
  source: "landmark" | "poi";
  thumbnail: string | null;
  url: string | null;
  extract: string | null;
  address: string | null;
}

export function landmarksToSpots(places: NearbyPlace[]): Spot[] {
  return places.map((p) => ({
    id: `wiki-${p.pageid}`,
    name: p.title,
    category: "Landmark",
    icon: "landmark",
    lat: p.lat,
    lon: p.lon,
    distanceKm: p.distanceMeters / 1000,
    source: "landmark",
    thumbnail: p.thumbnail,
    url: p.url,
    extract: p.extract,
    address: null,
  }));
}

export function poisToSpots(places: Place[]): Spot[] {
  return places.map((p) => ({
    id: `poi-${p.id}`,
    name: p.name,
    category: p.category,
    icon: p.icon,
    lat: p.lat,
    lon: p.lon,
    distanceKm: p.distanceKm,
    source: "poi",
    thumbnail: null,
    url: null,
    extract: null,
    address: p.address,
  }));
}

export const EXPLORE_FILTERS = [
  { id: "all", label: "All" },
  { id: "landmark", label: "Landmarks" },
  { id: "food", label: "Food & Drink" },
  { id: "park", label: "Parks" },
  { id: "culture", label: "Culture" },
  { id: "shopping", label: "Shopping" },
] as const;

export function matchesFilter(spot: Spot, filter: string): boolean {
  if (filter === "all") return true;
  if (filter === "landmark") return spot.source === "landmark";
  if (filter === "food") return ["Restaurant", "Cafe", "Bar"].includes(spot.category);
  if (filter === "park") return ["Park", "Playground"].includes(spot.category);
  if (filter === "culture")
    return ["Museum", "Gallery", "Theatre", "Cinema", "Library"].includes(spot.category);
  if (filter === "shopping") return ["Shopping", "Market"].includes(spot.category);
  return true;
}
