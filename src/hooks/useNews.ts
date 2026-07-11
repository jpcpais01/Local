"use client";

import { useApp } from "@/context/AppContext";
import { useAsyncData } from "./useAsyncData";

export interface Article {
  id: string;
  title: string;
  link: string;
  source: string;
  publishedAt: string | null;
  summary: string;
}

interface NewsResponse {
  articles: Article[];
  query: string;
  category: string;
}

export function useNews(category: string = "top") {
  const { activeLocation } = useApp();

  return useAsyncData<NewsResponse>(
    async () => {
      const params = new URLSearchParams({
        city: activeLocation!.city,
        region: activeLocation!.region ?? "",
        countryCode: activeLocation!.countryCode ?? "",
        category,
      });
      const res = await fetch(`/api/news?${params}`);
      if (!res.ok) throw new Error("Failed to load news");
      return res.json();
    },
    [activeLocation?.id, category],
    { enabled: !!activeLocation }
  );
}
