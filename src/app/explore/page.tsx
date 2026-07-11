"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { List, Map as MapIcon, Compass } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useNearbyLandmarks } from "@/hooks/useWikipedia";
import { usePoi } from "@/hooks/usePoi";
import { landmarksToSpots, poisToSpots, matchesFilter, EXPLORE_FILTERS, type Spot } from "@/lib/spots";
import { SpotCard } from "@/components/explore/SpotCard";
import { CategoryTabs } from "@/components/ui/CategoryTabs";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/States";

const NearbyMap = dynamic(
  () => import("@/components/explore/NearbyMap").then((m) => m.NearbyMap),
  { ssr: false, loading: () => <div className="h-full w-full rounded-2xl bg-surface-2 animate-pulse" /> }
);

export default function ExplorePage() {
  const { activeLocation } = useApp();
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState<"list" | "map">("list");

  const { data: landmarkData, loading: landmarksLoading } = useNearbyLandmarks(8000);
  const { data: poiData, loading: poiLoading } = usePoi(3000);

  const spots: Spot[] = useMemo(() => {
    const landmarks = landmarkData ? landmarksToSpots(landmarkData) : [];
    const pois = poiData ? poisToSpots(poiData.places) : [];
    return [...landmarks, ...pois].sort((a, b) => a.distanceKm - b.distanceKm);
  }, [landmarkData, poiData]);

  const filtered = spots.filter((s) => matchesFilter(s, filter));
  const loading = landmarksLoading && poiLoading && spots.length === 0;

  return (
    <div className="max-w-6xl mx-auto px-4 pt-4 pb-6 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Explore</h1>
          <p className="text-sm text-fg-muted">Landmarks, parks & spots nearby</p>
        </div>
        <div className="flex items-center rounded-full border border-border p-0.5 shrink-0">
          <button
            onClick={() => setView("list")}
            className="p-1.5 rounded-full"
            style={{ backgroundColor: view === "list" ? "var(--surface-2)" : "transparent" }}
            aria-label="List view"
          >
            <List size={16} />
          </button>
          <button
            onClick={() => setView("map")}
            className="p-1.5 rounded-full"
            style={{ backgroundColor: view === "map" ? "var(--surface-2)" : "transparent" }}
            aria-label="Map view"
          >
            <MapIcon size={16} />
          </button>
        </div>
      </div>

      <CategoryTabs options={[...EXPLORE_FILTERS]} value={filter} onChange={setFilter} colorVar="--color-cat-explore" />

      {view === "map" && activeLocation ? (
        <div className="h-[65vh] rounded-2xl overflow-hidden border border-border">
          <NearbyMap center={{ lat: activeLocation.lat, lon: activeLocation.lon }} spots={filtered} />
        </div>
      ) : (
        <>
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} lines={2} />
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <EmptyState
              icon={<Compass size={32} strokeWidth={1.5} />}
              title="Nothing found nearby"
              description="Try a different category or check back later."
            />
          )}

          {filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((spot) => (
                <SpotCard key={spot.id} spot={spot} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
