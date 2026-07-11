"use client";

import { WeatherHero } from "@/components/weather/WeatherHero";
import { HourlyStrip } from "@/components/weather/HourlyStrip";
import { DailyForecast } from "@/components/weather/DailyForecast";
import { AqiUvCards } from "@/components/weather/AqiUvCards";
import { DetailsGrid } from "@/components/weather/DetailsGrid";
import { TeasersRow } from "@/components/home/TeasersRow";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 pt-4 pb-6">
      <div className="lg:grid lg:grid-cols-3 lg:gap-4 lg:items-start space-y-4 lg:space-y-0">
        <div className="lg:col-span-2 space-y-4">
          <WeatherHero />
          <HourlyStrip />
          <div className="lg:hidden">
            <TeasersRow />
          </div>
          <DailyForecast />
        </div>
        <div className="space-y-4">
          <AqiUvCards />
          <div className="hidden lg:block space-y-3">
            <TeasersRow columns={1} />
          </div>
          <DetailsGrid />
        </div>
      </div>
    </div>
  );
}
