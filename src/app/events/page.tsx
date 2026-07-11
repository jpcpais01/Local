"use client";

import { useState } from "react";
import { useEvents } from "@/hooks/useEvents";
import { useApp } from "@/context/AppContext";
import { EventCard } from "@/components/events/EventCard";
import { EventsNotConfigured } from "@/components/events/NotConfigured";
import { CategoryTabs } from "@/components/ui/CategoryTabs";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { CalendarX2 } from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "Music", label: "Music" },
  { id: "Sports", label: "Sports" },
  { id: "Arts & Theatre", label: "Arts & Theatre" },
  { id: "Film", label: "Film" },
  { id: "Family", label: "Family" },
];

export default function EventsPage() {
  const [category, setCategory] = useState("all");
  const { data, loading, error, reload } = useEvents(category);
  const { savedEvents } = useApp();

  return (
    <div className="max-w-6xl mx-auto px-4 pt-4 pb-6 space-y-4">
      <div>
        <h1 className="text-xl font-bold">Events</h1>
        <p className="text-sm text-fg-muted">Concerts, sports, and things to do nearby</p>
      </div>

      <CategoryTabs options={CATEGORIES} value={category} onChange={setCategory} colorVar="--color-cat-events" />

      {savedEvents.length > 0 && (
        <div className="rounded-2xl border border-border bg-surface p-3.5">
          <p className="text-xs font-medium text-fg-subtle uppercase tracking-wide mb-2">
            Saved ({savedEvents.length})
          </p>
          <ul className="space-y-1">
            {savedEvents.slice(0, 5).map((e) => (
              <li key={e.id} className="text-sm truncate">
                <a href={e.url} target="_blank" rel="noopener noreferrer" className="hover:text-cat-events">
                  {e.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {loading && !data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} lines={2} />
          ))}
        </div>
      )}

      {error && <ErrorState onRetry={reload} message="Couldn't load events. Check your connection and try again." />}

      {data && !data.configured && <EventsNotConfigured />}

      {data && data.configured && data.events.length === 0 && (
        <EmptyState
          icon={<CalendarX2 size={32} strokeWidth={1.5} />}
          title="No events found nearby"
          description="Try a different category or widen your search radius in Settings."
        />
      )}

      {data && data.configured && data.events.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
