export interface LocationInfo {
  id: string; // `${lat.toFixed(4)},${lon.toFixed(4)}`
  label: string; // "Austin, Texas"
  city: string;
  region?: string;
  country?: string;
  countryCode?: string;
  lat: number;
  lon: number;
  isCurrent?: boolean; // came from device geolocation
}

export type ThemePref = "system" | "light" | "dark";
export type UnitsPref = "imperial" | "metric";

export interface AppSettings {
  units: UnitsPref;
  theme: ThemePref;
  newsCategory: string;
  eventRadiusMiles: number;
}

export interface SavedEvent {
  id: string;
  name: string;
  start: string; // ISO
  end?: string;
  venue?: string;
  url?: string;
  imageUrl?: string;
  savedAt: string;
}
