// Pure, dependency-free astronomical calculations (NOAA solar algorithm + a
// synodic-month moon phase model). No network calls — computed on-device so
// the Sky tab works instantly and offline.

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;

function dayOfYear(date: Date): number {
  const start = Date.UTC(date.getUTCFullYear(), 0, 1);
  const cur = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.floor((cur - start) / 86400000) + 1;
}

function normalizeDeg(deg: number): number {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

// Computes solar transit (local solar noon, as a real UTC instant) plus the
// declination terms needed for hour-angle math. Every sunrise/sunset-family
// time is then derived as transit ± a hour-angle offset (below), rather than
// each being independently re-anchored to a UTC calendar day — anchoring
// each event separately is what the NOAA reference formula literally does,
// but it silently breaks (by up to 24h) whenever the event's true UTC
// instant falls on a different UTC calendar day than the one chosen for N,
// which happens routinely away from Greenwich. Deriving everything relative
// to a single correctly-anchored transit instant sidesteps that entirely.
function solarTransit(date: Date, lon: number): { transit: Date; sinDec: number; cosDec: number } {
  const lngHour = lon / 15;
  // Shift by longitude (a proxy for local solar time) so the day-of-year
  // used below matches the calendar day at this place, not wherever `date`
  // itself happens to be instantiated relative to UTC.
  const localDate = new Date(date.getTime() + lngHour * 3600000);
  const N = dayOfYear(localDate);

  const t = N + (12 - lngHour) / 24;
  const M = 0.9856 * t - 3.289;
  let L = M + 1.916 * Math.sin(M * RAD) + 0.02 * Math.sin(2 * M * RAD) + 282.634;
  L = normalizeDeg(L);

  let RA = DEG * Math.atan(0.91764 * Math.tan(L * RAD));
  RA = normalizeDeg(RA);
  const Lquadrant = Math.floor(L / 90) * 90;
  const RAquadrant = Math.floor(RA / 90) * 90;
  RA = RA + (Lquadrant - RAquadrant);
  RA /= 15;

  const sinDec = 0.39782 * Math.sin(L * RAD);
  const cosDec = Math.cos(Math.asin(sinDec));

  const T = RA - 0.06571 * t - 6.622;
  // Transit is a single periodic event (once per ~24h), and dayStartMs was
  // already chosen to be the correct calendar day via the longitude shift
  // above — so, unlike the old per-event rise/set formula, wrapping here is
  // safe: it just picks the right representative within that known-correct
  // day rather than discarding cross-day information.
  const UT = (((T - lngHour) % 24) + 24) % 24;
  const dayStartMs = Date.UTC(localDate.getUTCFullYear(), localDate.getUTCMonth(), localDate.getUTCDate());

  return { transit: new Date(dayStartMs + UT * 3600000), sinDec, cosDec };
}

// Returns when the sun crosses `zenithDeg` relative to transit, in whichever
// direction `rising` indicates. Returns null if the sun never reaches that
// angle that day (polar day/night).
function eventTime(
  transit: Date,
  lat: number,
  sinDec: number,
  cosDec: number,
  zenithDeg: number,
  rising: boolean
): Date | null {
  const cosH =
    (Math.cos(zenithDeg * RAD) - sinDec * Math.sin(lat * RAD)) / (cosDec * Math.cos(lat * RAD));
  if (cosH > 1 || cosH < -1) return null;

  const hourAngleHours = (DEG * Math.acos(cosH)) / 15;
  const offsetMs = hourAngleHours * 3600000;
  return new Date(transit.getTime() + (rising ? -offsetMs : offsetMs));
}

export interface SunTimes {
  astronomicalDawn: Date | null;
  nauticalDawn: Date | null;
  civilDawn: Date | null;
  blueHourMorningEnd: Date | null;
  sunrise: Date | null;
  goldenHourMorningEnd: Date | null;
  solarNoon: Date | null;
  goldenHourEveningStart: Date | null;
  sunset: Date | null;
  blueHourEveningStart: Date | null;
  civilDusk: Date | null;
  nauticalDusk: Date | null;
  astronomicalDusk: Date | null;
  dayLengthMinutes: number | null;
}

export function getSunTimes(date: Date, lat: number, lon: number): SunTimes {
  const { transit, sinDec, cosDec } = solarTransit(date, lon);
  const at = (zenithDeg: number, rising: boolean) =>
    eventTime(transit, lat, sinDec, cosDec, zenithDeg, rising);

  const sunrise = at(90.833, true);
  const sunset = at(90.833, false);

  return {
    astronomicalDawn: at(108, true),
    nauticalDawn: at(102, true),
    civilDawn: at(96, true),
    blueHourMorningEnd: at(94, true),
    sunrise,
    goldenHourMorningEnd: at(84, true),
    solarNoon: transit,
    goldenHourEveningStart: at(84, false),
    sunset,
    blueHourEveningStart: at(94, false),
    civilDusk: at(96, false),
    nauticalDusk: at(102, false),
    astronomicalDusk: at(108, false),
    dayLengthMinutes:
      sunrise && sunset ? (sunset.getTime() - sunrise.getTime()) / 60000 : null,
  };
}

export interface MoonPhase {
  phase: number; // 0..1
  age: number; // days since new moon
  illumination: number; // 0..100
  name: string;
  emoji: string;
}

const SYNODIC_MONTH = 29.53058867;
// A known new moon reference instant: 2000-01-06 18:14 UTC
const REF_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14, 0);

export function getMoonPhase(date: Date): MoonPhase {
  const daysSinceRef = (date.getTime() - REF_NEW_MOON) / 86400000;
  let age = daysSinceRef % SYNODIC_MONTH;
  if (age < 0) age += SYNODIC_MONTH;
  const phase = age / SYNODIC_MONTH;
  const illumination = (1 - Math.cos(2 * Math.PI * phase)) / 2;

  let name: string;
  let emoji: string;
  if (phase < 0.02 || phase >= 0.98) {
    name = "New Moon";
    emoji = "🌑";
  } else if (phase < 0.24) {
    name = "Waxing Crescent";
    emoji = "🌒";
  } else if (phase < 0.26) {
    name = "First Quarter";
    emoji = "🌓";
  } else if (phase < 0.49) {
    name = "Waxing Gibbous";
    emoji = "🌔";
  } else if (phase < 0.51) {
    name = "Full Moon";
    emoji = "🌕";
  } else if (phase < 0.74) {
    name = "Waning Gibbous";
    emoji = "🌖";
  } else if (phase < 0.76) {
    name = "Last Quarter";
    emoji = "🌗";
  } else {
    name = "Waning Crescent";
    emoji = "🌘";
  }

  return { phase, age, illumination: illumination * 100, name, emoji };
}

// Format a UTC Date as local clock time at a given place, using that place's
// UTC offset (from the weather API) rather than the browser's timezone —
// so times are correct even when checking a location far from the user.
export function formatTimeAtOffset(date: Date | null, utcOffsetSeconds: number): string {
  if (!date) return "—";
  const shifted = new Date(date.getTime() + utcOffsetSeconds * 1000);
  let h = shifted.getUTCHours();
  const m = shifted.getUTCMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m.toString().padStart(2, "0")} ${ampm}`;
}

// Minutes since local midnight at a place, using its UTC offset (not the
// browser's timezone) — used to position events on a 24h timeline bar.
export function minutesOfDayAtOffset(date: Date | null, utcOffsetSeconds: number): number | null {
  if (!date) return null;
  const shifted = new Date(date.getTime() + utcOffsetSeconds * 1000);
  return shifted.getUTCHours() * 60 + shifted.getUTCMinutes();
}

// Open-Meteo's hourly/daily `time` strings are naive local wall-clock values
// for the queried place (e.g. "2026-07-10T20:00"), with no UTC offset in the
// string. Parsing them with `new Date(...)` interprets them in the *browser's*
// timezone instead, which silently gives the wrong instant whenever the
// viewer isn't in the same timezone as the place being viewed. These helpers
// work on the raw strings / a shifted "location time" Date instead, so the
// comparison never depends on the browser's timezone.
export function findCurrentHourIndex(hourlyTimes: string[], utcOffsetSeconds: number): number {
  const nowAtLocation = new Date(Date.now() + utcOffsetSeconds * 1000);
  const nowKey = nowAtLocation.toISOString().slice(0, 13); // "YYYY-MM-DDTHH", in location wall-clock terms
  const idx = hourlyTimes.findIndex((t) => t.slice(0, 13) >= nowKey);
  return idx === -1 ? 0 : idx;
}

export function minutesToDuration(mins: number | null): string {
  if (mins == null) return "—";
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  return `${h}h ${m}m`;
}
