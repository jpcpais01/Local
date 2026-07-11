// WMO weather interpretation codes used by Open-Meteo.
// https://open-meteo.com/en/docs

export type WeatherCategory =
  | "clear"
  | "partly-cloudy"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "showers"
  | "thunderstorm";

export interface WeatherMeta {
  label: string;
  category: WeatherCategory;
}

const CODES: Record<number, WeatherMeta> = {
  0: { label: "Clear sky", category: "clear" },
  1: { label: "Mostly clear", category: "clear" },
  2: { label: "Partly cloudy", category: "partly-cloudy" },
  3: { label: "Overcast", category: "cloudy" },
  45: { label: "Fog", category: "fog" },
  48: { label: "Rime fog", category: "fog" },
  51: { label: "Light drizzle", category: "drizzle" },
  53: { label: "Drizzle", category: "drizzle" },
  55: { label: "Dense drizzle", category: "drizzle" },
  56: { label: "Freezing drizzle", category: "drizzle" },
  57: { label: "Freezing drizzle", category: "drizzle" },
  61: { label: "Light rain", category: "rain" },
  63: { label: "Rain", category: "rain" },
  65: { label: "Heavy rain", category: "rain" },
  66: { label: "Freezing rain", category: "rain" },
  67: { label: "Freezing rain", category: "rain" },
  71: { label: "Light snow", category: "snow" },
  73: { label: "Snow", category: "snow" },
  75: { label: "Heavy snow", category: "snow" },
  77: { label: "Snow grains", category: "snow" },
  80: { label: "Light showers", category: "showers" },
  81: { label: "Showers", category: "showers" },
  82: { label: "Violent showers", category: "showers" },
  85: { label: "Snow showers", category: "snow" },
  86: { label: "Heavy snow showers", category: "snow" },
  95: { label: "Thunderstorm", category: "thunderstorm" },
  96: { label: "Thunderstorm w/ hail", category: "thunderstorm" },
  99: { label: "Thunderstorm w/ hail", category: "thunderstorm" },
};

export function getWeatherMeta(code: number): WeatherMeta {
  return CODES[code] ?? { label: "Unknown", category: "cloudy" };
}

export function getAqiMeta(aqi: number | null | undefined): {
  label: string;
  colorVar: string;
  advice: string;
} {
  if (aqi == null) return { label: "—", colorVar: "--aqi-unknown", advice: "" };
  if (aqi <= 50)
    return { label: "Good", colorVar: "--aqi-good", advice: "Air quality is great — enjoy the outdoors." };
  if (aqi <= 100)
    return {
      label: "Moderate",
      colorVar: "--aqi-moderate",
      advice: "Acceptable air quality. Unusually sensitive people should consider reducing prolonged exertion.",
    };
  if (aqi <= 150)
    return {
      label: "Unhealthy for Sensitive Groups",
      colorVar: "--aqi-sensitive",
      advice: "Sensitive groups should reduce prolonged outdoor exertion.",
    };
  if (aqi <= 200)
    return {
      label: "Unhealthy",
      colorVar: "--aqi-unhealthy",
      advice: "Everyone may begin to experience health effects. Limit outdoor exertion.",
    };
  if (aqi <= 300)
    return {
      label: "Very Unhealthy",
      colorVar: "--aqi-very-unhealthy",
      advice: "Health alert: everyone may experience more serious effects. Avoid outdoor exertion.",
    };
  return {
    label: "Hazardous",
    colorVar: "--aqi-hazardous",
    advice: "Health warning of emergency conditions. Stay indoors.",
  };
}

export function getUvMeta(uv: number | null | undefined): { label: string; colorVar: string } {
  if (uv == null) return { label: "—", colorVar: "--uv-low" };
  if (uv < 3) return { label: "Low", colorVar: "--uv-low" };
  if (uv < 6) return { label: "Moderate", colorVar: "--uv-moderate" };
  if (uv < 8) return { label: "High", colorVar: "--uv-high" };
  if (uv < 11) return { label: "Very High", colorVar: "--uv-very-high" };
  return { label: "Extreme", colorVar: "--uv-extreme" };
}
