"use client";

import { useApp } from "@/context/AppContext";
import { useAsyncData } from "./useAsyncData";
import { fetchNearbyLandmarks, fetchOnThisDay } from "@/lib/wikipedia";

export function useNearbyLandmarks(radiusMeters = 8000) {
  const { activeLocation } = useApp();
  return useAsyncData(
    () => fetchNearbyLandmarks(activeLocation!.lat, activeLocation!.lon, radiusMeters),
    [activeLocation?.id, radiusMeters],
    { enabled: !!activeLocation }
  );
}

export function useOnThisDay(date: Date = new Date()) {
  return useAsyncData(
    () => fetchOnThisDay(date.getMonth() + 1, date.getDate()),
    [date.getMonth(), date.getDate()]
  );
}
