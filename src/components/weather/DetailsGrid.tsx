"use client";

import { useApp } from "@/context/AppContext";
import { useWeather } from "@/hooks/useWeather";
import { formatSpeed, formatPrecip } from "@/lib/units";
import { degToCompass } from "@/lib/format";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { Wind, Gauge, Droplets, CloudRain, Navigation } from "lucide-react";

function Tile({
  icon,
  label,
  value,
  sub,
  wide,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  wide?: boolean;
}) {
  return (
    <div className={`rounded-2xl border border-border bg-surface p-4 space-y-1.5 ${wide ? "col-span-2" : ""}`}>
      <div className="flex items-center gap-2 text-fg-muted text-xs font-medium uppercase tracking-wide">
        {icon} {label}
      </div>
      <p className="text-xl font-semibold tabular-nums">{value}</p>
      {sub && <p className="text-xs text-fg-muted">{sub}</p>}
    </div>
  );
}

export function DetailsGrid() {
  const { settings } = useApp();
  const { data, loading } = useWeather();

  if (loading && !data)
    return (
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} lines={1} />
        ))}
      </div>
    );
  if (!data) return null;

  const { current } = data;

  return (
    <div className="grid grid-cols-2 gap-3">
      <Tile
        icon={<Wind size={14} />}
        label="Wind"
        value={formatSpeed(current.windSpeed, settings.units)}
        sub={`${degToCompass(current.windDirection)} · gusts ${formatSpeed(current.windGusts, settings.units)}`}
      />
      <Tile icon={<Droplets size={14} />} label="Humidity" value={`${current.humidity}%`} />
      <Tile
        icon={<Gauge size={14} />}
        label="Pressure"
        value={`${Math.round(current.pressure)}`}
        sub="hPa"
      />
      <Tile
        icon={<CloudRain size={14} />}
        label="Precipitation"
        value={formatPrecip(current.precipitation, settings.units)}
        sub="last hour"
      />
      <Tile icon={<Navigation size={14} />} label="Cloud Cover" value={`${current.cloudCover}%`} wide />
    </div>
  );
}
