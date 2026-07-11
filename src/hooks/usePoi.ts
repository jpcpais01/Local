"use client";

import { useApp } from "@/context/AppContext";
import { useAsyncData } from "./useAsyncData";

export interface Place {
  id: string;
  name: string;
  category: string;
  icon: string;
  lat: number;
  lon: number;
  distanceKm: number;
  address: string | null;
}

export function usePoi(radiusMeters = 3000) {
  const { activeLocation } = useApp();

  return useAsyncData<{ places: Place[] }>(
    async () => {
      const params = new URLSearchParams({
        lat: String(activeLocation!.lat),
        lon: String(activeLocation!.lon),
        radius: String(radiusMeters),
      });
      const res = await fetch(`/api/poi?${params}`);
      if (!res.ok) throw new Error("Failed to load nearby places");
      return res.json();
    },
    [activeLocation?.id, radiusMeters],
    { enabled: !!activeLocation }
  );
}
