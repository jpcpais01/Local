"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AppSettings, LocationInfo, SavedEvent } from "@/lib/types";
import { DEFAULT_SETTINGS, storage } from "@/lib/storage";
import { reverseGeocode } from "@/lib/geocode";

export type LocationStatus = "idle" | "loading" | "ready" | "denied" | "error";

interface AppContextValue {
  ready: boolean;
  activeLocation: LocationInfo | null;
  locations: LocationInfo[];
  setActiveLocationId: (id: string) => void;
  addLocation: (loc: LocationInfo, makeActive?: boolean) => void;
  removeLocation: (id: string) => void;
  requestCurrentLocation: () => void;
  locationStatus: LocationStatus;
  locationError: string | null;

  settings: AppSettings;
  updateSettings: (patch: Partial<AppSettings>) => void;

  savedEvents: SavedEvent[];
  saveEvent: (e: SavedEvent) => void;
  unsaveEvent: (id: string) => void;
  isEventSaved: (id: string) => boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [locations, setLocations] = useState<LocationInfo[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [savedEvents, setSavedEvents] = useState<SavedEvent[]>([]);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [locationError, setLocationError] = useState<string | null>(null);

  // Load persisted state once on mount (client only)
  useEffect(() => {
    setLocations(storage.getLocations());
    setActiveId(storage.getActiveLocationId());
    setSettings(storage.getSettings());
    setSavedEvents(storage.getSavedEvents());
    setReady(true);
  }, []);

  // Apply theme to <html>
  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    const apply = () => {
      const isDark =
        settings.theme === "dark" ||
        (settings.theme === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      root.classList.toggle("dark", isDark);
    };
    apply();
    if (settings.theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }
  }, [settings.theme, ready]);

  const addLocation = useCallback((loc: LocationInfo, makeActive = true) => {
    setLocations((prev) => {
      const withoutDup = prev.filter((l) => l.id !== loc.id);
      const next = [...withoutDup, loc];
      storage.setLocations(next);
      return next;
    });
    if (makeActive) {
      setActiveId(loc.id);
      storage.setActiveLocationId(loc.id);
    }
  }, []);

  const removeLocation = useCallback((id: string) => {
    setLocations((prev) => {
      const next = prev.filter((l) => l.id !== id);
      storage.setLocations(next);
      return next;
    });
    setActiveId((cur) => {
      if (cur !== id) return cur;
      const remaining = storage.getLocations().filter((l) => l.id !== id);
      const nextActive = remaining[0]?.id ?? null;
      if (nextActive) storage.setActiveLocationId(nextActive);
      return nextActive;
    });
  }, []);

  const setActiveLocationId = useCallback((id: string) => {
    setActiveId(id);
    storage.setActiveLocationId(id);
  }, []);

  const requestCurrentLocation = useCallback(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setLocationStatus("error");
      setLocationError("Geolocation isn't supported by this browser.");
      return;
    }
    setLocationStatus("loading");
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const loc = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
          addLocation(loc, true);
          setLocationStatus("ready");
        } catch {
          // Reverse geocode failed — still usable with raw coordinates
          const fallback: LocationInfo = {
            id: `${pos.coords.latitude.toFixed(4)},${pos.coords.longitude.toFixed(4)}`,
            label: "Current location",
            city: "Current location",
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            isCurrent: true,
          };
          addLocation(fallback, true);
          setLocationStatus("ready");
        }
      },
      (err) => {
        setLocationStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error");
        setLocationError(
          err.code === err.PERMISSION_DENIED
            ? "Location access was denied. You can search for a place instead."
            : "Couldn't get your location. Try searching for a place instead."
        );
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 }
    );
  }, [addLocation]);

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      storage.setSettings(next);
      return next;
    });
  }, []);

  const saveEvent = useCallback((e: SavedEvent) => {
    setSavedEvents((prev) => {
      const next = [...prev.filter((x) => x.id !== e.id), e];
      storage.setSavedEvents(next);
      return next;
    });
  }, []);

  const unsaveEvent = useCallback((id: string) => {
    setSavedEvents((prev) => {
      const next = prev.filter((x) => x.id !== id);
      storage.setSavedEvents(next);
      return next;
    });
  }, []);

  const isEventSaved = useCallback(
    (id: string) => savedEvents.some((e) => e.id === id),
    [savedEvents]
  );

  const activeLocation = useMemo(
    () => locations.find((l) => l.id === activeId) ?? null,
    [locations, activeId]
  );

  const value: AppContextValue = {
    ready,
    activeLocation,
    locations,
    setActiveLocationId,
    addLocation,
    removeLocation,
    requestCurrentLocation,
    locationStatus,
    locationError,
    settings,
    updateSettings,
    savedEvents,
    saveEvent,
    unsaveEvent,
    isEventSaved,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
