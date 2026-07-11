"use client";

import { useOnThisDay, useNearbyLandmarks } from "@/hooks/useWikipedia";
import { Card, CardHeader } from "@/components/ui/Card";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/States";
import { BookOpenText, MapPinned } from "lucide-react";

export default function AlmanacPage() {
  const today = new Date();
  const { data: events, loading, error, reload } = useOnThisDay(today);
  const { data: landmarks } = useNearbyLandmarks(8000);

  const dateLabel = today.toLocaleDateString("en-US", { month: "long", day: "numeric" });

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-6 space-y-4">
      <div>
        <h1 className="text-xl font-bold">Almanac</h1>
        <p className="text-sm text-fg-muted">On this day, {dateLabel} — and notable spots nearby</p>
      </div>

      {loading && !events && (
        <div className="space-y-3">
          <CardSkeleton lines={2} />
          <CardSkeleton lines={2} />
          <CardSkeleton lines={2} />
        </div>
      )}

      {error && <ErrorState onRetry={reload} />}

      {events && (
        <Card>
          <CardHeader title={`On This Day — ${dateLabel}`} icon={<BookOpenText size={17} className="text-cat-almanac" />} />
          <ul className="divide-y divide-border">
            {events.slice(0, 12).map((e, i) => (
              <li key={i} className="flex gap-3 p-4">
                {e.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={e.thumbnail}
                    alt=""
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-surface-2 shrink-0 flex items-center justify-center text-cat-almanac font-bold text-sm">
                    {e.year}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-cat-almanac">{e.year}</p>
                  <p className="text-sm text-fg leading-snug mt-0.5">
                    {e.text}
                    {e.url && (
                      <a
                        href={e.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand ml-1.5 whitespace-nowrap"
                      >
                        Read more →
                      </a>
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {landmarks && landmarks.length > 0 && (
        <Card>
          <CardHeader title="Notable spots near you" icon={<MapPinned size={17} className="text-cat-almanac" />} />
          <ul className="divide-y divide-border">
            {landmarks.slice(0, 6).map((l) => (
              <li key={l.pageid} className="flex gap-3 p-4">
                {l.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={l.thumbnail} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" loading="lazy" />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-surface-2 shrink-0" />
                )}
                <div className="min-w-0">
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold hover:text-cat-almanac"
                  >
                    {l.title}
                  </a>
                  {l.extract && <p className="text-xs text-fg-muted line-clamp-2 mt-0.5">{l.extract}</p>}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
