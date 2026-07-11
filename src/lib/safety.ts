// Safety Center data sources — all free, keyless, CORS-enabled:
// USGS Earthquake Catalog + National Weather Service Alerts (api.weather.gov, US-only).

import { haversineKm } from "./geo";

export interface EarthquakeEvent {
  id: string;
  magnitude: number;
  place: string;
  time: number; // epoch ms
  url: string;
  distanceKm: number;
  tsunami: boolean;
  alert: string | null;
}

export async function fetchEarthquakes(
  lat: number,
  lon: number,
  radiusKm = 300
): Promise<EarthquakeEvent[]> {
  const start = new Date(Date.now() - 30 * 86400000).toISOString();
  const params = new URLSearchParams({
    format: "geojson",
    latitude: String(lat),
    longitude: String(lon),
    maxradiuskm: String(radiusKm),
    minmagnitude: "2.0",
    orderby: "time",
    limit: "25",
    starttime: start,
  });
  const res = await fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?${params}`);
  if (!res.ok) throw new Error("Earthquake fetch failed");
  const data = await res.json();
  return (data.features ?? []).map(
    (f: {
      id: string;
      properties: { mag: number; place: string; time: number; url: string; tsunami: number; alert: string | null };
      geometry: { coordinates: [number, number, number] };
    }) => ({
      id: f.id,
      magnitude: f.properties.mag,
      place: f.properties.place,
      time: f.properties.time,
      url: f.properties.url,
      distanceKm: haversineKm(lat, lon, f.geometry.coordinates[1], f.geometry.coordinates[0]),
      tsunami: f.properties.tsunami === 1,
      alert: f.properties.alert,
    })
  );
}

export interface WeatherAlert {
  id: string;
  event: string;
  headline: string;
  severity: string;
  urgency: string;
  areaDesc: string;
  description: string;
  instruction: string | null;
  effective: string;
  expires: string;
  senderName: string;
}

export async function fetchWeatherAlerts(lat: number, lon: number): Promise<WeatherAlert[]> {
  try {
    const res = await fetch(`https://api.weather.gov/alerts/active?point=${lat},${lon}`, {
      headers: { Accept: "application/geo+json" },
    });
    if (!res.ok) return []; // outside US coverage or transient error — degrade gracefully
    const data = await res.json();
    return (data.features ?? []).map(
      (f: {
        id: string;
        properties: {
          event: string;
          headline: string;
          severity: string;
          urgency: string;
          areaDesc: string;
          description: string;
          instruction: string | null;
          effective: string;
          expires: string;
          senderName: string;
        };
      }) => ({
        id: f.id,
        event: f.properties.event,
        headline: f.properties.headline,
        severity: f.properties.severity,
        urgency: f.properties.urgency,
        areaDesc: f.properties.areaDesc,
        description: f.properties.description,
        instruction: f.properties.instruction,
        effective: f.properties.effective,
        expires: f.properties.expires,
        senderName: f.properties.senderName,
      })
    );
  } catch {
    return [];
  }
}
