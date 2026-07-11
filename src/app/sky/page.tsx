"use client";

import { useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { useWeather } from "@/hooks/useWeather";
import { getSunTimes, getMoonPhase, minutesToDuration } from "@/lib/astronomy";
import { SunTimeline } from "@/components/sky/SunTimeline";
import { TimesGrid } from "@/components/sky/TimesGrid";
import { MoonCard } from "@/components/sky/MoonCard";
import { Card, CardHeader } from "@/components/ui/Card";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { Clock3, Sparkles } from "lucide-react";

export default function SkyPage() {
  const { activeLocation } = useApp();
  const { data: weather, loading } = useWeather();

  const times = useMemo(
    () => (activeLocation ? getSunTimes(new Date(), activeLocation.lat, activeLocation.lon) : null),
    [activeLocation]
  );
  const moon = useMemo(() => getMoonPhase(new Date()), []);

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-6 space-y-4">
      <div>
        <h1 className="text-xl font-bold">Sky &amp; Golden Hour</h1>
        <p className="text-sm text-fg-muted">
          Perfect timing for photos, walks, and stargazing — computed for your exact spot
        </p>
      </div>

      {loading && !weather ? (
        <CardSkeleton lines={3} />
      ) : (
        weather &&
        times && (
          <>
            <Card className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Clock3 size={16} className="text-cat-sky" />
                Today&apos;s light
              </div>
              <SunTimeline times={times} utcOffsetSeconds={weather.utcOffsetSeconds} />
              <p className="text-sm text-fg-muted">
                {minutesToDuration(times.dayLengthMinutes)} of daylight today
              </p>
            </Card>

            <TimesGrid times={times} utcOffsetSeconds={weather.utcOffsetSeconds} />

            <MoonCard moon={moon} />

            <Card>
              <CardHeader
                title="Why golden & blue hour matter"
                icon={<Sparkles size={17} className="text-cat-sky" />}
              />
              <p className="px-4 pb-4 text-sm text-fg-muted leading-relaxed">
                <strong className="text-fg">Golden hour</strong> is the warm, soft light shortly
                after sunrise and before sunset — ideal for portraits and landscapes.{" "}
                <strong className="text-fg">Blue hour</strong> is the cool, moody twilight just
                before sunrise and after sunset, great for city and skyline shots. Times above are
                calculated locally from your coordinates — no external API needed.
              </p>
            </Card>
          </>
        )
      )}
    </div>
  );
}
