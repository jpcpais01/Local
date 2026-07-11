"use client";

import { useState } from "react";
import { LocateFixed, Loader2, MapPin, Search } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { searchLocations } from "@/lib/geocode";
import type { LocationInfo } from "@/lib/types";

const HIGHLIGHTS = [
  { emoji: "🌤️", text: "Live weather, air quality & UV" },
  { emoji: "🎟️", text: "Local events with calendar export" },
  { emoji: "📰", text: "Headlines from your area" },
  { emoji: "🧭", text: "Landmarks & spots worth exploring" },
  { emoji: "🛡️", text: "Safety alerts — storms, quakes & AQI" },
  { emoji: "🌅", text: "Golden hour & moon phase" },
  { emoji: "📜", text: "On this day in history" },
];

export function Onboarding() {
  const { addLocation, requestCurrentLocation, locationStatus, locationError } = useApp();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationInfo[]>([]);
  const [searching, setSearching] = useState(false);

  const onSearch = (value: string) => {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    setSearching(true);
    searchLocations(value)
      .then(setResults)
      .catch(() => setResults([]))
      .finally(() => setSearching(false));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 safe-top safe-bottom">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-3">
          <div className="h-14 w-14 rounded-2xl bg-accent flex items-center justify-center mx-auto">
            <MapPin size={28} className="text-accent-fg" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome to Loci</h1>
          <p className="text-sm text-fg-muted">
            Everything happening around you — weather, events, news, and a few surprises.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-2">
          {HIGHLIGHTS.map((h) => (
            <li
              key={h.text}
              className="flex items-center gap-3 text-sm bg-surface border border-border rounded-xl px-3.5 py-2.5"
            >
              <span className="text-lg leading-none">{h.emoji}</span>
              <span className="text-fg-muted">{h.text}</span>
            </li>
          ))}
        </ul>

        <div className="space-y-3">
          <button
            onClick={requestCurrentLocation}
            disabled={locationStatus === "loading"}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-accent text-accent-fg font-medium py-3 disabled:opacity-70"
          >
            {locationStatus === "loading" ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <LocateFixed size={18} />
            )}
            Use my current location
          </button>
          {locationError && <p className="text-xs text-cat-safety text-center">{locationError}</p>}

          <div className="flex items-center gap-3 text-xs text-fg-subtle">
            <div className="h-px flex-1 bg-border" />
            or
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle" />
            <input
              value={query}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search city, town, or ZIP..."
              className="w-full rounded-xl border border-border bg-surface pl-9 pr-3 py-3 text-sm outline-none focus:ring-2 focus:ring-brand/40"
            />
            {searching && (
              <Loader2
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-fg-subtle"
              />
            )}
          </div>

          {results.length > 0 && (
            <ul className="space-y-1 rounded-xl border border-border bg-surface p-1.5 max-h-56 overflow-y-auto">
              {results.map((r) => (
                <li key={r.id}>
                  <button
                    onClick={() => addLocation(r, true)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-surface-2 text-sm"
                  >
                    {r.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="text-center text-[11px] text-fg-subtle">
          Your location stays on this device. Nothing is tracked or shared.
        </p>
      </div>
    </div>
  );
}
