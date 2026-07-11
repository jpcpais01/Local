"use client";

import { useApp } from "@/context/AppContext";
import { useWeather } from "@/hooks/useWeather";
import { formatTemp, formatSpeed } from "@/lib/units";
import { weatherLabel, WeatherIcon } from "./WeatherIcon";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/States";
import { Droplets, Wind } from "lucide-react";

export function WeatherHero() {
  const { settings } = useApp();
  const { data, loading, error, reload } = useWeather();

  if (loading && !data) return <CardSkeleton lines={2} />;
  if (error) return <div className="rounded-2xl border border-border bg-surface"><ErrorState onRetry={reload} /></div>;
  if (!data) return null;

  const { current, daily } = data;
  const todayHigh = daily.tempMax[0];
  const todayLow = daily.tempMin[0];

  return (
    <div className="rounded-2xl border border-border bg-surface card-shadow p-6 relative overflow-hidden animate-fade-in">
      <div
        className="absolute -top-16 -right-16 h-56 w-56 rounded-full opacity-[0.12] blur-2xl"
        style={{ background: "var(--cat-weather)" }}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-fg-muted">{weatherLabel(current.weatherCode)}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-6xl font-bold tracking-tight tabular-nums">
              {formatTemp(current.temperature, settings.units, false)}
            </span>
          </div>
          <p className="text-sm text-fg-muted mt-1">
            Feels like {formatTemp(current.apparentTemperature, settings.units)} · H{" "}
            {formatTemp(todayHigh, settings.units)} · L {formatTemp(todayLow, settings.units)}
          </p>
        </div>
        <WeatherIcon code={current.weatherCode} isDay={current.isDay} size={64} />
      </div>

      <div className="relative flex items-center gap-5 mt-5 pt-4 border-t border-border">
        <div className="flex items-center gap-1.5 text-sm text-fg-muted">
          <Droplets size={15} />
          {current.humidity}%
        </div>
        <div className="flex items-center gap-1.5 text-sm text-fg-muted">
          <Wind size={15} />
          {formatSpeed(current.windSpeed, settings.units)}
        </div>
        {current.precipitation > 0 && (
          <div className="flex items-center gap-1.5 text-sm text-fg-muted">
            💧 {current.precipitation} mm now
          </div>
        )}
      </div>
    </div>
  );
}
