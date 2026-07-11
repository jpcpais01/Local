# Loci

Everything happening around you — weather, events, news, and a few
surprises — in one fast, installable, mobile-first app.

Built with Next.js 16 (App Router) + TypeScript + Tailwind CSS v4, designed
to deploy to Vercel's free tier and run on entirely free data sources.

## Features

**Home dashboard** — live weather, hourly & 8-day forecast, air quality
(US AQI), UV index, wind/humidity/pressure, and a "what's happening around
you" summary that pulls in the next event, top headline, sunset time, and
safety status.

**Events** — concerts, sports, and shows nearby, filterable by category,
with one-tap save and `.ics` calendar export.

**News** — local headlines from Google News, filterable by category
(local, business, tech, entertainment, health, sports, weather).

**Explore** — nearby landmarks (with photos & summaries from Wikipedia)
and points of interest (restaurants, cafes, parks, museums, shopping from
OpenStreetMap), in both list and interactive map views.

**Three surprise features:**

1. 🛡️ **Safety Center** — active NWS severe weather alerts, recent nearby
   earthquakes (USGS), and air-quality health warnings, all in one place.
2. 🌅 **Sky & Golden Hour** — sunrise, sunset, golden hour, blue hour, and
   moon phase, calculated locally on-device with real astronomical formulas
   (no API call needed).
3. 📜 **Almanac ("On This Day")** — a daily history digest from Wikipedia,
   paired with notable landmarks near you.

Plus: multiple saved locations, imperial/metric units, light/dark/system
theme, and an installable PWA with offline app-shell caching.

## Data sources (all free)

| Source | Used for | API key needed? |
|---|---|---|
| [Open-Meteo](https://open-meteo.com) | Weather, air quality, geocoding | No |
| [Google News](https://news.google.com) RSS | Local headlines | No |
| [Wikipedia](https://www.wikipedia.org) | Nearby landmarks, On This Day | No |
| [OpenStreetMap](https://www.openstreetmap.org) / Overpass | Points of interest, map tiles | No |
| [USGS](https://earthquake.usgs.gov) | Earthquakes | No |
| [National Weather Service](https://www.weather.gov/documentation/services-web-api) | Severe weather alerts (US only) | No |
| [BigDataCloud](https://www.bigdatacloud.com/free-api/free-reverse-geocode-to-city-api) | Reverse geocoding | No |
| [SeatGeek Platform API](https://seatgeek.com/build) | Local events | **Yes — free, instant** |

Sunrise/sunset/golden hour/moon phase are computed locally with standard
astronomical formulas — no network call at all.

Everything except events works out of the box with zero configuration.
Events use the SeatGeek Platform API, chosen specifically because its free
client ID is self-serve and issued instantly — no app-review process like
some ticketing APIs require. Without one, the Events tab shows setup
instructions instead of failing.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app will ask for
your location (or let you search for one) on first load.

### Optional: enable Events

1. Create a free account and grab a client ID at [seatgeek.com/account/develop](https://seatgeek.com/account/develop)
   — no app review, no credit card, issued instantly.
2. Copy `.env.example` to `.env.local` and set `SEATGEEK_CLIENT_ID`.
3. Restart the dev server.

## Deploying to Vercel

1. Push this repo to GitHub (or GitLab/Bitbucket).
2. Import it in [Vercel](https://vercel.com/new) — it auto-detects Next.js,
   no config needed.
3. Optionally add the `SEATGEEK_CLIENT_ID` environment variable in the
   Vercel project settings to enable Events.
4. Deploy.

No other setup, database, or paid service is required.

## Project structure

```
src/
  app/                 # Routes (App Router) — one folder per tab, plus /api
  app/api/             # Server routes: news (RSS proxy), events (SeatGeek
                        # proxy, keeps the client ID server-side), poi (Overpass proxy)
  components/          # UI, grouped by feature area
  context/AppContext.tsx  # Location, settings, saved events (localStorage-backed)
  hooks/               # Data-fetching hooks per feature
  lib/                 # Framework-free logic: astronomy, geocoding, units,
                        # formatting, ICS export, weather/safety/wikipedia clients
```

## Notes on performance

- Weather, air quality, and location APIs are fetched client-side directly
  from their CORS-enabled endpoints — no server hop.
- News, events, and POI data go through lightweight API routes (to hide the
  SeatGeek client ID and to parse/proxy XML), cached at the edge via
  `Cache-Control`/`revalidate`.
- Sun/moon calculations run entirely on-device.
- The service worker caches the app shell and static assets for fast repeat
  loads and basic offline support.
