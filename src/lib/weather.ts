// Open-Meteo: free, keyless, CORS-enabled forecast + air-quality data.
// https://open-meteo.com

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  isDay: boolean;
  precipitation: number;
  weatherCode: number;
  cloudCover: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  uvIndex: number | null;
}

export interface HourlyWeather {
  time: string[];
  temperature: number[];
  precipitationProbability: number[];
  weatherCode: number[];
  uvIndex: number[];
}

export interface DailyWeather {
  time: string[];
  weatherCode: number[];
  tempMax: number[];
  tempMin: number[];
  sunrise: string[];
  sunset: string[];
  uvIndexMax: number[];
  precipitationProbabilityMax: number[];
  precipitationSum: number[];
  windSpeedMax: number[];
}

export interface WeatherResponse {
  timezone: string;
  utcOffsetSeconds: number;
  current: CurrentWeather;
  hourly: HourlyWeather;
  daily: DailyWeather;
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherResponse> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m",
    hourly: "temperature_2m,precipitation_probability,weather_code,uv_index",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max,precipitation_sum,wind_speed_10m_max",
    timezone: "auto",
    forecast_days: "8",
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error("Weather fetch failed");
  const d = await res.json();

  const currentHourIdx = d.hourly.time.indexOf(d.current.time?.slice(0, 13) + ":00") as number;

  return {
    timezone: d.timezone,
    utcOffsetSeconds: d.utc_offset_seconds,
    current: {
      temperature: d.current.temperature_2m,
      apparentTemperature: d.current.apparent_temperature,
      humidity: d.current.relative_humidity_2m,
      isDay: d.current.is_day === 1,
      precipitation: d.current.precipitation,
      weatherCode: d.current.weather_code,
      cloudCover: d.current.cloud_cover,
      pressure: d.current.pressure_msl,
      windSpeed: d.current.wind_speed_10m,
      windDirection: d.current.wind_direction_10m,
      windGusts: d.current.wind_gusts_10m,
      uvIndex: currentHourIdx >= 0 ? d.hourly.uv_index[currentHourIdx] : null,
    },
    hourly: {
      time: d.hourly.time,
      temperature: d.hourly.temperature_2m,
      precipitationProbability: d.hourly.precipitation_probability,
      weatherCode: d.hourly.weather_code,
      uvIndex: d.hourly.uv_index,
    },
    daily: {
      time: d.daily.time,
      weatherCode: d.daily.weather_code,
      tempMax: d.daily.temperature_2m_max,
      tempMin: d.daily.temperature_2m_min,
      sunrise: d.daily.sunrise,
      sunset: d.daily.sunset,
      uvIndexMax: d.daily.uv_index_max,
      precipitationProbabilityMax: d.daily.precipitation_probability_max,
      precipitationSum: d.daily.precipitation_sum,
      windSpeedMax: d.daily.wind_speed_10m_max,
    },
  };
}

export interface AirQuality {
  usAqi: number | null;
  pm2_5: number | null;
  pm10: number | null;
  ozone: number | null;
  no2: number | null;
  so2: number | null;
  co: number | null;
}

export async function fetchAirQuality(lat: number, lon: number): Promise<AirQuality> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: "us_aqi,pm2_5,pm10,ozone,nitrogen_dioxide,sulphur_dioxide,carbon_monoxide",
  });
  const res = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${params}`);
  if (!res.ok) throw new Error("Air quality fetch failed");
  const d = await res.json();
  return {
    usAqi: d.current?.us_aqi ?? null,
    pm2_5: d.current?.pm2_5 ?? null,
    pm10: d.current?.pm10 ?? null,
    ozone: d.current?.ozone ?? null,
    no2: d.current?.nitrogen_dioxide ?? null,
    so2: d.current?.sulphur_dioxide ?? null,
    co: d.current?.carbon_monoxide ?? null,
  };
}
