import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  type LucideIcon,
} from "lucide-react";
import { getWeatherMeta, type WeatherCategory } from "@/lib/weatherCodes";

const ICONS: Record<WeatherCategory, { day: LucideIcon; night: LucideIcon }> = {
  clear: { day: Sun, night: Moon },
  "partly-cloudy": { day: CloudSun, night: CloudMoon },
  cloudy: { day: Cloud, night: Cloud },
  fog: { day: CloudFog, night: CloudFog },
  drizzle: { day: CloudDrizzle, night: CloudDrizzle },
  rain: { day: CloudRain, night: CloudRain },
  snow: { day: CloudSnow, night: CloudSnow },
  showers: { day: CloudRain, night: CloudRain },
  thunderstorm: { day: CloudLightning, night: CloudLightning },
};

const COLORS: Record<WeatherCategory, string> = {
  clear: "#f59e0b",
  "partly-cloudy": "#60a5fa",
  cloudy: "#94a3b8",
  fog: "#94a3b8",
  drizzle: "#38bdf8",
  rain: "#3b82f6",
  snow: "#93c5fd",
  showers: "#3b82f6",
  thunderstorm: "#a855f7",
};

export function WeatherIcon({
  code,
  isDay = true,
  size = 24,
  className = "",
}: {
  code: number;
  isDay?: boolean;
  size?: number;
  className?: string;
}) {
  const meta = getWeatherMeta(code);
  const Icon = isDay ? ICONS[meta.category].day : ICONS[meta.category].night;
  return <Icon size={size} className={className} style={{ color: COLORS[meta.category] }} strokeWidth={1.8} />;
}

export function weatherLabel(code: number): string {
  return getWeatherMeta(code).label;
}
