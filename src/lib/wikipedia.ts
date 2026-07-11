// Wikipedia/Wikimedia REST + Action APIs — free, keyless, CORS-enabled.
// Used for "Explore nearby" landmarks and the "On This Day" almanac.

export interface NearbyPlace {
  pageid: number;
  title: string;
  extract: string;
  thumbnail: string | null;
  distanceMeters: number;
  lat: number;
  lon: number;
  url: string;
}

export async function fetchNearbyLandmarks(
  lat: number,
  lon: number,
  radiusMeters = 8000
): Promise<NearbyPlace[]> {
  const params = new URLSearchParams({
    action: "query",
    generator: "geosearch",
    ggscoord: `${lat}|${lon}`,
    ggsradius: String(Math.min(radiusMeters, 10000)),
    ggslimit: "24",
    prop: "extracts|pageimages|coordinates",
    exintro: "1",
    explaintext: "1",
    exchars: "300",
    piprop: "thumbnail",
    pithumbsize: "400",
    format: "json",
    origin: "*",
  });
  const res = await fetch(`https://en.wikipedia.org/w/api.php?${params}`);
  if (!res.ok) throw new Error("Wikipedia geosearch failed");
  const data = await res.json();
  const pages = data.query?.pages ?? {};
  const list: NearbyPlace[] = Object.values(pages).map((p) => {
    const page = p as {
      pageid: number;
      title: string;
      extract?: string;
      thumbnail?: { source: string };
      coordinates?: { lat: number; lon: number; dist?: number }[];
    };
    const coord = page.coordinates?.[0];
    return {
      pageid: page.pageid,
      title: page.title,
      extract: page.extract ?? "",
      thumbnail: page.thumbnail?.source ?? null,
      distanceMeters: coord?.dist ?? 0,
      lat: coord?.lat ?? lat,
      lon: coord?.lon ?? lon,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, "_"))}`,
    };
  });
  return list.sort((a, b) => a.distanceMeters - b.distanceMeters);
}

export interface OnThisDayEvent {
  year: number;
  text: string;
  pageTitle: string | null;
  thumbnail: string | null;
  url: string | null;
}

export async function fetchOnThisDay(month: number, day: number): Promise<OnThisDayEvent[]> {
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  const res = await fetch(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${mm}/${dd}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error("On this day fetch failed");
  const data = await res.json();
  interface RawEvent {
    year: number;
    text: string;
    pages?: { title: string; thumbnail?: { source: string }; content_urls?: { desktop?: { page: string } } }[];
  }
  return (data.events ?? []).map((e: RawEvent) => {
    const page = e.pages?.[0];
    return {
      year: e.year,
      text: e.text,
      pageTitle: page?.title ?? null,
      thumbnail: page?.thumbnail?.source ?? null,
      url: page?.content_urls?.desktop?.page ?? null,
    };
  });
}
