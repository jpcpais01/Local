"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { LocationPicker } from "@/components/layout/LocationPicker";
import { Card, CardHeader } from "@/components/ui/Card";
import { downloadIcs } from "@/lib/ics";
import { storage } from "@/lib/storage";
import {
  Ruler,
  Radar,
  Download,
  MapPin,
  Star,
  Trash2,
  CalendarDays,
  Info,
  RotateCcw,
  Plus,
} from "lucide-react";

export default function SettingsPage() {
  const {
    settings,
    updateSettings,
    locations,
    activeLocation,
    setActiveLocationId,
    removeLocation,
    savedEvents,
    unsaveEvent,
  } = useApp();
  const { canInstall, installed, promptInstall } = useInstallPrompt();
  const [pickerOpen, setPickerOpen] = useState(false);

  const resetAllData = () => {
    if (!confirm("Clear all saved locations, settings, and saved events from this device?")) return;
    storage.setLocations([]);
    storage.setSavedEvents([]);
    storage.setSettings({ units: "imperial", theme: "system", newsCategory: "top", eventRadiusMiles: 25 });
    window.location.reload();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pt-4 pb-6 space-y-4">
      <div>
        <h1 className="text-xl font-bold">Settings</h1>
        <p className="text-sm text-fg-muted">Units, locations, and saved items</p>
      </div>

      <Card>
        <CardHeader title="Preferences" icon={<Ruler size={17} className="text-brand" />} />
        <div className="px-4 pb-4 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium">Units</span>
            <SegmentedControl
              value={settings.units}
              onChange={(v) => updateSettings({ units: v })}
              options={[
                { id: "imperial", label: "°F, mph" },
                { id: "metric", label: "°C, km/h" },
              ]}
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium">Theme</span>
            <SegmentedControl
              value={settings.theme}
              onChange={(v) => updateSettings({ theme: v })}
              options={[
                { id: "system", label: "System" },
                { id: "light", label: "Light" },
                { id: "dark", label: "Dark" },
              ]}
            />
          </div>
          <div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-sm font-medium flex items-center gap-1.5">
                <Radar size={14} /> Event search radius
              </span>
              <span className="text-sm text-fg-muted tabular-nums">{settings.eventRadiusMiles} mi</span>
            </div>
            <input
              type="range"
              min={5}
              max={100}
              step={5}
              value={settings.eventRadiusMiles}
              onChange={(e) => updateSettings({ eventRadiusMiles: Number(e.target.value) })}
              className="w-full accent-[var(--cat-events)]"
            />
          </div>
        </div>
      </Card>

      {!installed && (
        <Card className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
            <Download size={18} className="text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">Install Loci</p>
            <p className="text-xs text-fg-muted">Add to your home screen for a full-screen, app-like experience.</p>
          </div>
          {canInstall ? (
            <button
              onClick={promptInstall}
              className="text-sm font-medium bg-accent text-accent-fg px-3.5 py-2 rounded-xl shrink-0"
            >
              Install
            </button>
          ) : (
            <span className="text-xs text-fg-subtle shrink-0 max-w-[8rem] text-right">
              Use your browser&apos;s &quot;Add to Home Screen&quot;
            </span>
          )}
        </Card>
      )}

      <Card>
        <CardHeader
          title="Saved locations"
          icon={<MapPin size={17} className="text-brand" />}
          action={
            <button
              onClick={() => setPickerOpen(true)}
              className="flex items-center gap-1 text-sm font-medium text-brand"
            >
              <Plus size={15} /> Add
            </button>
          }
        />
        {locations.length === 0 ? (
          <p className="px-4 pb-4 text-sm text-fg-muted">No saved locations yet.</p>
        ) : (
          <ul className="px-2 pb-2">
            {locations.map((loc) => (
              <li key={loc.id} className="flex items-center gap-1 group">
                <button
                  onClick={() => setActiveLocationId(loc.id)}
                  className="flex-1 flex items-center gap-2 text-left px-3 py-2.5 rounded-xl hover:bg-surface-2"
                >
                  <Star
                    size={14}
                    className={activeLocation?.id === loc.id ? "text-accent fill-accent" : "text-fg-subtle"}
                  />
                  <span className="text-sm">{loc.label}</span>
                </button>
                <button
                  onClick={() => removeLocation(loc.id)}
                  className="p-2 text-fg-subtle hover:text-cat-safety"
                  aria-label={`Remove ${loc.label}`}
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <CardHeader title="Saved events" icon={<CalendarDays size={17} className="text-cat-events" />} />
        {savedEvents.length === 0 ? (
          <p className="px-4 pb-4 text-sm text-fg-muted">No saved events yet — save one from the Events tab.</p>
        ) : (
          <ul className="px-2 pb-2">
            {savedEvents.map((e) => (
              <li key={e.id} className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-surface-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{e.name}</p>
                  <p className="text-xs text-fg-muted">{new Date(e.start).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</p>
                </div>
                <button
                  onClick={() =>
                    downloadIcs({
                      uid: e.id,
                      title: e.name,
                      start: new Date(e.start),
                      location: e.venue,
                      url: e.url,
                    })
                  }
                  className="p-2 text-fg-subtle hover:text-cat-events"
                  aria-label="Download calendar file"
                >
                  <Download size={14} />
                </button>
                <button
                  onClick={() => unsaveEvent(e.id)}
                  className="p-2 text-fg-subtle hover:text-cat-safety"
                  aria-label="Remove"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <CardHeader title="About Loci" icon={<Info size={17} className="text-fg-muted" />} />
        <div className="px-4 pb-4 text-sm text-fg-muted space-y-2">
          <p>
            Loci is powered entirely by free, public data sources: Open-Meteo (weather &amp; air
            quality), Google News, Ticketmaster Discovery, OpenStreetMap/Overpass, Wikipedia, USGS
            Earthquakes, and the National Weather Service.
          </p>
          <p>Golden hour, blue hour, and moon phase are calculated locally on your device — no API needed.</p>
          <p className="text-xs text-fg-subtle">Your location and preferences are stored only in this browser.</p>
        </div>
      </Card>

      <button
        onClick={resetAllData}
        className="w-full flex items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-medium text-cat-safety hover:bg-surface-2"
      >
        <RotateCcw size={15} /> Reset all data on this device
      </button>

      <LocationPicker open={pickerOpen} onClose={() => setPickerOpen(false)} />
    </div>
  );
}
