"use client";

import type { SunTimes } from "@/lib/astronomy";
import { minutesOfDayAtOffset } from "@/lib/astronomy";

interface Segment {
  label: string;
  start: number;
  end: number;
  color: string;
}

const NIGHT = "#0d1229";
const ASTRO = "#1b2a5e";
const NAUTICAL = "#2f4a8c";
const BLUE = "#4d6fb0";
const GOLDEN = "#f6a35e";
const DAY = "#8ecbff";

export function SunTimeline({ times, utcOffsetSeconds }: { times: SunTimes; utcOffsetSeconds: number }) {
  const m = (d: Date | null) => minutesOfDayAtOffset(d, utcOffsetSeconds);

  const bounds = {
    astroDawn: m(times.astronomicalDawn) ?? 300,
    nauticalDawn: m(times.nauticalDawn) ?? 330,
    civilDawn: m(times.civilDawn) ?? 360,
    blueHourMorningEnd: m(times.blueHourMorningEnd) ?? 375,
    goldenHourMorningEnd: m(times.goldenHourMorningEnd) ?? 420,
    goldenHourEveningStart: m(times.goldenHourEveningStart) ?? 1020,
    blueHourEveningStart: m(times.blueHourEveningStart) ?? 1065,
    civilDusk: m(times.civilDusk) ?? 1080,
    nauticalDusk: m(times.nauticalDusk) ?? 1110,
    astroDusk: m(times.astronomicalDusk) ?? 1140,
  };

  const segments: Segment[] = [
    { label: "Night", start: 0, end: bounds.astroDawn, color: NIGHT },
    { label: "Astronomical twilight", start: bounds.astroDawn, end: bounds.nauticalDawn, color: ASTRO },
    { label: "Nautical twilight", start: bounds.nauticalDawn, end: bounds.civilDawn, color: NAUTICAL },
    { label: "Blue hour", start: bounds.civilDawn, end: bounds.blueHourMorningEnd, color: BLUE },
    { label: "Golden hour", start: bounds.blueHourMorningEnd, end: bounds.goldenHourMorningEnd, color: GOLDEN },
    { label: "Day", start: bounds.goldenHourMorningEnd, end: bounds.goldenHourEveningStart, color: DAY },
    { label: "Golden hour", start: bounds.goldenHourEveningStart, end: bounds.blueHourEveningStart, color: GOLDEN },
    { label: "Blue hour", start: bounds.blueHourEveningStart, end: bounds.civilDusk, color: BLUE },
    { label: "Nautical twilight", start: bounds.civilDusk, end: bounds.nauticalDusk, color: NAUTICAL },
    { label: "Astronomical twilight", start: bounds.nauticalDusk, end: bounds.astroDusk, color: ASTRO },
    { label: "Night", start: bounds.astroDusk, end: 1440, color: NIGHT },
  ].filter((s) => s.end > s.start);

  const nowMinutes = (() => {
    const now = new Date();
    const shifted = new Date(now.getTime() + utcOffsetSeconds * 1000);
    return shifted.getUTCHours() * 60 + shifted.getUTCMinutes();
  })();

  return (
    <div className="space-y-2">
      <div className="relative h-10 rounded-xl overflow-hidden flex">
        {segments.map((s, i) => (
          <div
            key={i}
            style={{ flexGrow: s.end - s.start, backgroundColor: s.color }}
            title={s.label}
          />
        ))}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_4px_rgba(0,0,0,0.5)]"
          style={{ left: `${(nowMinutes / 1440) * 100}%` }}
        />
      </div>
      <div className="flex justify-between text-[11px] text-fg-subtle px-0.5">
        <span>12 AM</span>
        <span>6 AM</span>
        <span>12 PM</span>
        <span>6 PM</span>
        <span>12 AM</span>
      </div>
    </div>
  );
}
