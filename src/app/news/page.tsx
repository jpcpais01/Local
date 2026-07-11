"use client";

import { useState } from "react";
import { useNews } from "@/hooks/useNews";
import { useApp } from "@/context/AppContext";
import { ArticleCard } from "@/components/news/ArticleCard";
import { CategoryTabs } from "@/components/ui/CategoryTabs";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { Newspaper } from "lucide-react";

const CATEGORIES = [
  { id: "top", label: "Top" },
  { id: "local", label: "Local" },
  { id: "business", label: "Business" },
  { id: "technology", label: "Tech" },
  { id: "entertainment", label: "Entertainment" },
  { id: "health", label: "Health" },
  { id: "sports", label: "Sports" },
  { id: "weather", label: "Weather" },
];

export default function NewsPage() {
  const [category, setCategory] = useState("top");
  const { data, loading, error, reload } = useNews(category);
  const { activeLocation } = useApp();

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-6 space-y-4">
      <div>
        <h1 className="text-xl font-bold">News</h1>
        <p className="text-sm text-fg-muted">Headlines for {activeLocation?.city}</p>
      </div>

      <CategoryTabs options={CATEGORIES} value={category} onChange={setCategory} colorVar="--color-cat-news" />

      {loading && !data && (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} lines={2} />
          ))}
        </div>
      )}

      {error && <ErrorState onRetry={reload} message="Couldn't load news right now." />}

      {data && data.articles.length === 0 && (
        <EmptyState
          icon={<Newspaper size={32} strokeWidth={1.5} />}
          title="No headlines found"
          description="Try a different category."
        />
      )}

      {data && data.articles.length > 0 && (
        <div className="space-y-3">
          {data.articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
