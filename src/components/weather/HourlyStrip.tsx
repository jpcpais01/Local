"use client";

import { useApp } from "@/context/AppContext";
import { useWeather } from "@/hooks/useWeather";
import { formatTemp } from "@/lib/units";
import { formatHourLabel } from "@/lib/format";
import { findCurrentHourIndex } from "@/lib/astronomy";
import { WeatherIcon } from "./WeatherIcon";
import { Card, CardHeader } from "@/components/ui/Card";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { Clock } from "lucide-react";

export function HourlyStrip() {
  const { settings } = useApp();
  const { data, loading } = useWeather();

  if (loading && !data) return <CardSkeleton />;
  if (!data) return null;

  const idx = findCurrentHourIndex(data.hourly.time, data.utcOffsetSeconds);
  const slice = Array.from({ length: 24 }, (_, i) => idx + i).filter(
    (i) => i < data.hourly.time.length
  );

  return (
    <Card>
      <CardHeader title="Hourly forecast" icon={<Clock size={17} className="text-cat-weather" />} />
      <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 pb-4 pt-1">
        {slice.map((i) => {
          const isNow = i === idx;
          return (
            <div key={i} className="flex flex-col items-center gap-1.5 shrink-0 w-12">
              <span className="text-xs text-fg-muted">
                {isNow ? "Now" : formatHourLabel(data.hourly.time[i])}
              </span>
              <WeatherIcon code={data.hourly.weatherCode[i]} size={22} />
              <span className="text-sm font-medium tabular-nums">
                {formatTemp(data.hourly.temperature[i], settings.units, false)}
              </span>
              {data.hourly.precipitationProbability[i] > 15 && (
                <span className="text-[10px] text-cat-weather font-medium">
                  {data.hourly.precipitationProbability[i]}%
                </span>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
