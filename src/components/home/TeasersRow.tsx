"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { useWeather } from "@/hooks/useWeather";
import { useEvents } from "@/hooks/useEvents";
import { useNews } from "@/hooks/useNews";
import { useEarthquakes, useWeatherAlerts } from "@/hooks/useSafety";
import { getSunTimes, formatTimeAtOffset } from "@/lib/astronomy";
import { formatEventDate } from "@/lib/format";
import { CalendarDays, Newspaper, Sunset, ShieldAlert, ChevronRight } from "lucide-react";

function TeaserCard({
  href,
  icon,
  colorVar,
  label,
  title,
  subtitle,
}: {
  href: string;
  icon: React.ReactNode;
  colorVar: string;
  label: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3.5 hover:bg-surface-2 transition-colors"
    >
      <div
        className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `color-mix(in oklab, var(${colorVar}) 15%, transparent)` }}
      >
        <span style={{ color: `var(${colorVar})` }}>{icon}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wide text-fg-subtle">{label}</p>
        <p className="text-sm font-medium truncate">{title}</p>
        {subtitle && <p className="text-xs text-fg-muted truncate">{subtitle}</p>}
      </div>
      <ChevronRight size={16} className="text-fg-subtle shrink-0" />
    </Link>
  );
}

export function TeasersRow({ columns = 2 }: { columns?: 1 | 2 }) {
  const { activeLocation } = useApp();
  const { data: weather } = useWeather();
  const { data: eventsRes } = useEvents("all");
  const { data: newsRes } = useNews("top");
  const { data: quakes } = useEarthquakes(300);
  const { data: alerts } = useWeatherAlerts();

  const sunset = useMemo(() => {
    if (!activeLocation || !weather) return null;
    const times = getSunTimes(new Date(), activeLocation.lat, activeLocation.lon);
    return times.sunset ? formatTimeAtOffset(times.sunset, weather.utcOffsetSeconds) : null;
  }, [activeLocation, weather]);

  const nextEvent = eventsRes?.events?.[0];
  const topHeadline = newsRes?.articles?.[0];
  const alertCount = (alerts?.length ?? 0) + (quakes?.filter((q) => q.magnitude >= 3.5).length ?? 0);

  return (
    <div className={`grid grid-cols-1 ${columns === 2 ? "sm:grid-cols-2" : ""} gap-3`}>
      {sunset && (
        <TeaserCard
          href="/sky"
          icon={<Sunset size={19} />}
          colorVar="--color-cat-sky"
          label="Sunset today"
          title={sunset}
          subtitle="See golden hour & moon phase"
        />
      )}
      {nextEvent && (
        <TeaserCard
          href="/events"
          icon={<CalendarDays size={19} />}
          colorVar="--color-cat-events"
          label="Next up nearby"
          title={nextEvent.name}
          subtitle={nextEvent.dateTime ? formatEventDate(nextEvent.dateTime) : nextEvent.venueName ?? undefined}
        />
      )}
      {topHeadline && (
        <TeaserCard
          href="/news"
          icon={<Newspaper size={19} />}
          colorVar="--color-cat-news"
          label="Top headline"
          title={topHeadline.title}
          subtitle={topHeadline.source}
        />
      )}
      <TeaserCard
        href="/safety"
        icon={<ShieldAlert size={19} />}
        colorVar="--color-cat-safety"
        label="Safety Center"
        title={alertCount > 0 ? `${alertCount} active alert${alertCount === 1 ? "" : "s"}` : "All clear"}
        subtitle="Weather, quakes & air quality"
      />
    </div>
  );
}
