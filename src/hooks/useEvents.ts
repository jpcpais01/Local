"use client";

import { useApp } from "@/context/AppContext";
import { useAsyncData } from "./useAsyncData";

export interface EventItem {
  id: string;
  name: string;
  url: string;
  image: string | null;
  date: string | null;
  time: string | null;
  dateTime: string | null;
  segment: string | null;
  genre: string | null;
  venueName: string | null;
  venueCity: string | null;
  venueAddress: string | null;
  priceMin: number | null;
  priceMax: number | null;
  currency: string | null;
}

interface EventsResponse {
  configured: boolean;
  events: EventItem[];
  error?: string;
}

export function useEvents(category: string = "all") {
  const { activeLocation, settings } = useApp();

  return useAsyncData<EventsResponse>(
    async () => {
      const params = new URLSearchParams({
        lat: String(activeLocation!.lat),
        lon: String(activeLocation!.lon),
        radius: String(settings.eventRadiusMiles),
        category,
      });
      const res = await fetch(`/api/events?${params}`);
      if (!res.ok) throw new Error("Failed to load events");
      return res.json();
    },
    [activeLocation?.id, settings.eventRadiusMiles, category],
    { enabled: !!activeLocation }
  );
}
