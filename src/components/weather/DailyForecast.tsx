"use client";

import { useApp } from "@/context/AppContext";
import { useWeather } from "@/hooks/useWeather";
import { formatTemp } from "@/lib/units";
import { WeatherIcon, weatherLabel } from "./WeatherIcon";
import { Card, CardHeader } from "@/components/ui/Card";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { formatDayLabel } from "@/lib/format";
import { CalendarRange } from "lucide-react";

export function DailyForecast() {
  const { settings } = useApp();
  const { data, loading } = useWeather();

  if (loading && !data) return <CardSkeleton lines={5} />;
  if (!data) return null;

  const allLows = data.daily.tempMin;
  const allHighs = data.daily.tempMax;
  const min = Math.min(...allLows);
  const max = Math.max(...allHighs);
  const span = Math.max(max - min, 1);

  return (
    <Card>
      <CardHeader title="8-day forecast" icon={<CalendarRange size={17} className="text-cat-weather" />} />
      <ul className="px-2 pb-2">
        {data.daily.time.map((day, i) => {
          const low = allLows[i];
          const high = allHighs[i];
          const leftPct = ((low - min) / span) * 100;
          const widthPct = ((high - low) / span) * 100;
          return (
            <li
              key={day}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-2 transition-colors"
            >
              <span className="w-16 text-sm font-medium shrink-0">{formatDayLabel(day, i)}</span>
              <div className="w-7 shrink-0 flex justify-center" title={weatherLabel(data.daily.weatherCode[i])}>
                <WeatherIcon code={data.daily.weatherCode[i]} size={20} />
              </div>
              {data.daily.precipitationProbabilityMax[i] > 15 ? (
                <span className="w-9 text-[11px] text-cat-weather text-right shrink-0">
                  {data.daily.precipitationProbabilityMax[i]}%
                </span>
              ) : (
                <span className="w-9 shrink-0" />
              )}
              <span className="w-9 text-sm text-fg-muted text-right tabular-nums shrink-0">
                {formatTemp(low, settings.units, false)}
              </span>
              <div className="flex-1 h-1.5 rounded-full bg-surface-2 relative min-w-12">
                <div
                  className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 to-orange-400"
                  style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                />
              </div>
              <span className="w-9 text-sm font-medium text-right tabular-nums shrink-0">
                {formatTemp(high, settings.units, false)}
              </span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
