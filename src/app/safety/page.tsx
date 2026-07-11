"use client";

import { useWeatherAlerts, useEarthquakes } from "@/hooks/useSafety";
import { useAirQuality } from "@/hooks/useWeather";
import { getAqiMeta } from "@/lib/weatherCodes";
import { AlertCard } from "@/components/safety/AlertCard";
import { EarthquakeList } from "@/components/safety/EarthquakeList";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { Card } from "@/components/ui/Card";
import { ShieldCheck, Wind } from "lucide-react";

export default function SafetyPage() {
  const { data: alerts, loading: alertsLoading } = useWeatherAlerts();
  const { data: quakes, loading: quakesLoading } = useEarthquakes(300);
  const { data: aq } = useAirQuality();

  const aqiMeta = getAqiMeta(aq?.usAqi);
  const hasAqiConcern = aq?.usAqi != null && aq.usAqi > 100;

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-6 space-y-4">
      <div>
        <h1 className="text-xl font-bold">Safety Center</h1>
        <p className="text-sm text-fg-muted">Weather alerts, earthquakes & air quality, all in one place</p>
      </div>

      {alertsLoading && !alerts && <CardSkeleton lines={2} />}

      {alerts && alerts.length === 0 && quakes && quakes.filter((q) => q.magnitude >= 3.5).length === 0 && !hasAqiConcern && (
        <Card className="p-5 flex items-center gap-3">
          <ShieldCheck size={28} className="text-cat-explore shrink-0" />
          <div>
            <p className="font-semibold">All clear</p>
            <p className="text-sm text-fg-muted">No active weather alerts or notable seismic activity nearby.</p>
          </div>
        </Card>
      )}

      {alerts && alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((a) => (
            <AlertCard key={a.id} alert={a} />
          ))}
        </div>
      )}

      {hasAqiConcern && (
        <Card className="p-4 flex items-start gap-3" style={{ borderColor: `var(${aqiMeta.colorVar})` }}>
          <Wind size={20} className="shrink-0 mt-0.5" style={{ color: `var(${aqiMeta.colorVar})` }} />
          <div>
            <p className="font-semibold">
              Air quality: {aqiMeta.label} ({aq?.usAqi})
            </p>
            <p className="text-sm text-fg-muted mt-0.5">{aqiMeta.advice}</p>
          </div>
        </Card>
      )}

      {quakesLoading && !quakes ? <CardSkeleton lines={4} /> : quakes && <EarthquakeList quakes={quakes} />}

      <p className="text-xs text-fg-subtle text-center pt-2">
        Weather alerts cover the United States (National Weather Service). Earthquake data from USGS worldwide.
      </p>
    </div>
  );
}
