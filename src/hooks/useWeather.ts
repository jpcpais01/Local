"use client";

import { useAsyncData } from "./useAsyncData";
import { fetchWeather, fetchAirQuality } from "@/lib/weather";
import { useApp } from "@/context/AppContext";

export function useWeather() {
  const { activeLocation } = useApp();
  return useAsyncData(
    () => fetchWeather(activeLocation!.lat, activeLocation!.lon),
    [activeLocation?.id],
    { enabled: !!activeLocation }
  );
}

export function useAirQuality() {
  const { activeLocation } = useApp();
  return useAsyncData(
    () => fetchAirQuality(activeLocation!.lat, activeLocation!.lon),
    [activeLocation?.id],
    { enabled: !!activeLocation }
  );
}
