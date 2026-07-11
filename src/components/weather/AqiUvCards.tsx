"use client";

import Link from "next/link";
import { useAirQuality, useWeather } from "@/hooks/useWeather";
import { getAqiMeta, getUvMeta } from "@/lib/weatherCodes";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Wind, Sun } from "lucide-react";

export function AqiUvCards() {
  const { data: aq, loading: aqLoading } = useAirQuality();
  const { data: weather } = useWeather();

  const aqiMeta = getAqiMeta(aq?.usAqi);
  const uv = weather?.current.uvIndex ?? null;
  const uvMeta = getUvMeta(uv);

  return (
    <div className="grid grid-cols-2 gap-3">
      <Link href="/safety">
        <Card className="p-4 h-full">
          <div className="flex items-center gap-2 text-fg-muted text-xs font-medium uppercase tracking-wide">
            <Wind size={14} /> Air Quality
          </div>
          {aqLoading && !aq ? (
            <Skeleton className="h-8 w-16 mt-2" />
          ) : (
            <>
              <p className="text-3xl font-bold mt-1.5 tabular-nums" style={{ color: `var(${aqiMeta.colorVar})` }}>
                {aq?.usAqi ?? "—"}
              </p>
              <p className="text-xs mt-0.5 font-medium" style={{ color: `var(${aqiMeta.colorVar})` }}>
                {aqiMeta.label}
              </p>
            </>
          )}
        </Card>
      </Link>

      <Card className="p-4 h-full">
        <div className="flex items-center gap-2 text-fg-muted text-xs font-medium uppercase tracking-wide">
          <Sun size={14} /> UV Index
        </div>
        {!weather ? (
          <Skeleton className="h-8 w-16 mt-2" />
        ) : (
          <>
            <p className="text-3xl font-bold mt-1.5 tabular-nums" style={{ color: `var(${uvMeta.colorVar})` }}>
              {uv != null ? Math.round(uv) : "—"}
            </p>
            <p className="text-xs mt-0.5 font-medium" style={{ color: `var(${uvMeta.colorVar})` }}>
              {uvMeta.label}
            </p>
          </>
        )}
      </Card>
    </div>
  );
}
