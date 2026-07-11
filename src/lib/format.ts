const COMPASS = [
  "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
  "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW",
];

export function degToCompass(deg: number): string {
  return COMPASS[Math.round(deg / 22.5) % 16];
}

export function formatRelativeTime(from: Date | number): string {
  const date = typeof from === "number" ? new Date(from) : from;
  const diffSec = Math.round((date.getTime() - Date.now()) / 1000);

  const units: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.345, "week"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ];

  let value = diffSec;
  let unitLabel: Intl.RelativeTimeFormatUnit = "second";
  for (const [amount, name] of units) {
    unitLabel = name;
    if (Math.abs(value) < amount) break;
    value = value / amount;
  }
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  return rtf.format(Math.round(value), unitLabel);
}

export function formatDayLabel(dateStr: string, index: number): string {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

export function formatMonthDay(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Formats an Open-Meteo naive local timestamp ("2026-07-10T20:00") directly
// from its string parts — deliberately avoids `new Date(...)`, which would
// parse it in the browser's timezone rather than the queried place's.
export function formatHourLabel(isoLocal: string): string {
  const hourStr = isoLocal.slice(11, 13);
  let h = parseInt(hourStr, 10) % 24;
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h} ${ampm}`;
}

export function formatClockTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function formatEventDate(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const isTomorrow = d.toDateString() === tomorrow.toDateString();

  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (isToday) return `Today · ${time}`;
  if (isTomorrow) return `Tomorrow · ${time}`;
  return `${d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · ${time}`;
}
