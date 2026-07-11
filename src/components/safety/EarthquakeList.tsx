"use client";

import { useApp } from "@/context/AppContext";
import type { EarthquakeEvent } from "@/lib/safety";
import { formatDistance } from "@/lib/units";
import { formatRelativeTime } from "@/lib/format";
import { Card, CardHeader } from "@/components/ui/Card";
import { Activity } from "lucide-react";

function magColor(mag: number): string {
  if (mag >= 5) return "#dc2626";
  if (mag >= 4) return "#ea580c";
  if (mag >= 3) return "#ca8a04";
  return "#65a30d";
}

export function EarthquakeList({ quakes }: { quakes: EarthquakeEvent[] }) {
  const { settings } = useApp();

  return (
    <Card>
      <CardHeader
        title="Recent earthquakes"
        subtitle="Past 30 days · magnitude 2.0+"
        icon={<Activity size={17} className="text-cat-safety" />}
      />
      {quakes.length === 0 ? (
        <p className="px-4 pb-4 text-sm text-fg-muted">No recent earthquakes nearby.</p>
      ) : (
        <ul className="px-2 pb-2">
          {quakes.slice(0, 12).map((q) => (
            <li key={q.id}>
              <a
                href={q.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-2"
              >
                <span
                  className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 tabular-nums"
                  style={{ backgroundColor: magColor(q.magnitude) }}
                >
                  {q.magnitude.toFixed(1)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{q.place}</p>
                  <p className="text-xs text-fg-muted">
                    {formatDistance(q.distanceKm, settings.units)} away ·{" "}
                    {formatRelativeTime(new Date(q.time))}
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
