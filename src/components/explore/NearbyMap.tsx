"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import type { Spot } from "@/lib/spots";

export function NearbyMap({
  center,
  spots,
  onSelect,
}: {
  center: { lat: number; lon: number };
  spots: Spot[];
  onSelect?: (spot: Spot) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const layerRef = useRef<import("leaflet").LayerGroup | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = await import("leaflet");
      if (cancelled || !containerRef.current) return;

      if (!mapRef.current) {
        const map = L.map(containerRef.current, {
          zoomControl: false,
          attributionControl: true,
        }).setView([center.lat, center.lon], 14);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        L.control.zoom({ position: "bottomright" }).addTo(map);

        mapRef.current = map;
        layerRef.current = L.layerGroup().addTo(map);
      } else {
        mapRef.current.setView([center.lat, center.lon], mapRef.current.getZoom());
      }

      const layer = layerRef.current!;
      layer.clearLayers();

      const youIcon = L.divIcon({
        className: "",
        html: `<div style="width:16px;height:16px;border-radius:50%;background:var(--brand);border:3px solid white;box-shadow:0 0 0 1px rgba(0,0,0,0.2)"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });
      L.marker([center.lat, center.lon], { icon: youIcon, zIndexOffset: 1000 })
        .addTo(layer)
        .bindTooltip("You are here");

      spots.forEach((spot) => {
        const color = spot.source === "landmark" ? "#d97706" : "#16a34a";
        const icon = L.divIcon({
          className: "",
          html: `<div style="width:26px;height:26px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.35)"></div>`,
          iconSize: [26, 26],
          iconAnchor: [13, 26],
        });
        const marker = L.marker([spot.lat, spot.lon], { icon }).addTo(layer);
        marker.bindTooltip(spot.name, { direction: "top", offset: [0, -24] });
        marker.on("click", () => onSelect?.(spot));
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [center.lat, center.lon, spots, onSelect]);

  useEffect(() => {
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className="h-full w-full rounded-2xl z-0" />;
}
