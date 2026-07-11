import type { AppSettings, LocationInfo, SavedEvent } from "./types";

// Small typed localStorage wrapper. Every read is guarded for SSR (no
// `window`) and corrupt/missing data, so callers never need try/catch.

const KEYS = {
  settings: "loci.settings.v1",
  locations: "loci.locations.v1",
  activeLocation: "loci.activeLocation.v1",
  savedEvents: "loci.savedEvents.v1",
  onboarded: "loci.onboarded.v1",
} as const;

export const DEFAULT_SETTINGS: AppSettings = {
  units: "imperial",
  theme: "system",
  newsCategory: "top",
  eventRadiusMiles: 25,
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...(JSON.parse(raw) as object) } as T;
  } catch {
    return fallback;
  }
}

function readRaw<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or disabled — fail silently, app still works in-memory
  }
}

export const storage = {
  getSettings(): AppSettings {
    return read(KEYS.settings, DEFAULT_SETTINGS);
  },
  setSettings(settings: AppSettings) {
    write(KEYS.settings, settings);
  },

  getLocations(): LocationInfo[] {
    return readRaw<LocationInfo[]>(KEYS.locations, []);
  },
  setLocations(locations: LocationInfo[]) {
    write(KEYS.locations, locations);
  },

  getActiveLocationId(): string | null {
    return readRaw<string | null>(KEYS.activeLocation, null);
  },
  setActiveLocationId(id: string) {
    write(KEYS.activeLocation, id);
  },

  getSavedEvents(): SavedEvent[] {
    return readRaw<SavedEvent[]>(KEYS.savedEvents, []);
  },
  setSavedEvents(events: SavedEvent[]) {
    write(KEYS.savedEvents, events);
  },

  getOnboarded(): boolean {
    return readRaw<boolean>(KEYS.onboarded, false);
  },
  setOnboarded(value: boolean) {
    write(KEYS.onboarded, value);
  },
};
