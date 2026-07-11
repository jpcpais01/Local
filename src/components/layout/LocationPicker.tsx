"use client";

import { useEffect, useState } from "react";
import { LocateFixed, Search, Star, Trash2, Loader2 } from "lucide-react";
import { Sheet } from "@/components/ui/Sheet";
import { useApp } from "@/context/AppContext";
import { searchLocations } from "@/lib/geocode";
import type { LocationInfo } from "@/lib/types";

export function LocationPicker({ open, onClose }: { open: boolean; onClose: () => void }) {
  const {
    locations,
    activeLocation,
    setActiveLocationId,
    addLocation,
    removeLocation,
    requestCurrentLocation,
    locationStatus,
    locationError,
  } = useApp();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationInfo[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setSearching(true);
    const t = setTimeout(() => {
      searchLocations(query)
        .then(setResults)
        .catch(() => setResults([]))
        .finally(() => setSearching(false));
    }, 350);
    return () => clearTimeout(t);
  }, [query]);

  const pick = (loc: LocationInfo) => {
    addLocation(loc, true);
    setQuery("");
    setResults([]);
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title="Choose a location">
      <div className="space-y-4">
        <button
          onClick={requestCurrentLocation}
          disabled={locationStatus === "loading"}
          className="w-full flex items-center gap-3 rounded-xl border border-border px-4 py-3 hover:bg-surface-2 transition-colors disabled:opacity-60"
        >
          {locationStatus === "loading" ? (
            <Loader2 size={18} className="animate-spin text-brand" />
          ) : (
            <LocateFixed size={18} className="text-brand" />
          )}
          <span className="text-sm font-medium">Use my current location</span>
        </button>
        {locationError && <p className="text-xs text-cat-safety -mt-2">{locationError}</p>}

        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city, town, or ZIP..."
            className="w-full rounded-xl border border-border bg-bg pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/40"
          />
          {searching && (
            <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-fg-subtle" />
          )}
        </div>

        {results.length > 0 && (
          <ul className="space-y-1">
            {results.map((r) => (
              <li key={r.id}>
                <button
                  onClick={() => pick(r)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-surface-2 text-sm"
                >
                  {r.label}
                </button>
              </li>
            ))}
          </ul>
        )}

        {locations.length > 0 && (
          <div>
            <p className="text-xs font-medium text-fg-subtle uppercase tracking-wide px-1 mb-2">
              Saved places
            </p>
            <ul className="space-y-1">
              {locations.map((loc) => (
                <li key={loc.id} className="flex items-center gap-1 group">
                  <button
                    onClick={() => {
                      setActiveLocationId(loc.id);
                      onClose();
                    }}
                    className="flex-1 flex items-center gap-2 text-left px-3 py-2 rounded-lg hover:bg-surface-2"
                  >
                    <Star
                      size={14}
                      className={
                        activeLocation?.id === loc.id ? "text-accent fill-accent" : "text-fg-subtle"
                      }
                    />
                    <span className="text-sm">{loc.label}</span>
                  </button>
                  <button
                    onClick={() => removeLocation(loc.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-fg-subtle hover:text-cat-safety transition-opacity"
                    aria-label={`Remove ${loc.label}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Sheet>
  );
}
