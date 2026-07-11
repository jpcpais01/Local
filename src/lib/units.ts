import type { UnitsPref } from "./types";

export function celsiusTo(units: UnitsPref, c: number): number {
  return units === "imperial" ? (c * 9) / 5 + 32 : c;
}

export function formatTemp(c: number | null | undefined, units: UnitsPref, withUnit = true): string {
  if (c == null || Number.isNaN(c)) return "—";
  const v = Math.round(celsiusTo(units, c));
  return withUnit ? `${v}°${units === "imperial" ? "F" : "C"}` : `${v}°`;
}

export function kmToUnit(km: number, units: UnitsPref): number {
  return units === "imperial" ? km * 0.621371 : km;
}

export function formatDistance(km: number, units: UnitsPref): string {
  const v = kmToUnit(km, units);
  const unitLabel = units === "imperial" ? "mi" : "km";
  if (v < 0.1) return `< 0.1 ${unitLabel}`;
  const rounded = v < 10 ? Math.round(v * 10) / 10 : Math.round(v);
  return `${rounded} ${unitLabel}`;
}

export function kmhToUnit(kmh: number, units: UnitsPref): number {
  return units === "imperial" ? kmh * 0.621371 : kmh;
}

export function formatSpeed(kmh: number | null | undefined, units: UnitsPref): string {
  if (kmh == null) return "—";
  return `${Math.round(kmhToUnit(kmh, units))} ${units === "imperial" ? "mph" : "km/h"}`;
}

export function mmToUnit(mm: number, units: UnitsPref): number {
  return units === "imperial" ? mm / 25.4 : mm;
}

export function formatPrecip(mm: number | null | undefined, units: UnitsPref): string {
  if (mm == null) return "—";
  const v = mmToUnit(mm, units);
  return `${v.toFixed(units === "imperial" ? 2 : 1)} ${units === "imperial" ? "in" : "mm"}`;
}
