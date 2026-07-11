"use client";

import { useApp } from "@/context/AppContext";
import { useAsyncData } from "./useAsyncData";
import { fetchEarthquakes, fetchWeatherAlerts } from "@/lib/safety";

export function useEarthquakes(radiusKm = 300) {
  const { activeLocation } = useApp();
  return useAsyncData(
    () => fetchEarthquakes(activeLocation!.lat, activeLocation!.lon, radiusKm),
    [activeLocation?.id, radiusKm],
    { enabled: !!activeLocation }
  );
}

export function useWeatherAlerts() {
  const { activeLocation } = useApp();
  return useAsyncData(
    () => fetchWeatherAlerts(activeLocation!.lat, activeLocation!.lon),
    [activeLocation?.id],
    { enabled: !!activeLocation }
  );
}
