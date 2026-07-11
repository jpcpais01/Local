"use client";

import { ExternalLink, MapPinned } from "lucide-react";
import type { Spot } from "@/lib/spots";
import { useApp } from "@/context/AppContext";
import { formatDistance } from "@/lib/units";
import { PoiIcon } from "./PoiIcon";
import { Card } from "@/components/ui/Card";

export function SpotCard({ spot }: { spot: Spot }) {
  const { settings } = useApp();
  const mapsUrl = `https://www.openstreetmap.org/?mlat=${spot.lat}&mlon=${spot.lon}#map=18/${spot.lat}/${spot.lon}`;

  return (
    <Card className="overflow-hidden flex flex-col">
      {spot.thumbnail ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={spot.thumbnail} alt="" className="w-full h-32 object-cover" loading="lazy" />
      ) : (
        <div className="w-full h-20 bg-surface-2 flex items-center justify-center">
          <PoiIcon icon={spot.icon} size={26} className="text-fg-subtle" />
        </div>
      )}
      <div className="p-3.5 flex-1 flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-xs text-fg-muted">
          <PoiIcon icon={spot.icon} size={13} />
          <span>{spot.category}</span>
          <span>·</span>
          <span>{formatDistance(spot.distanceKm, settings.units)}</span>
        </div>
        <h4 className="font-semibold leading-snug line-clamp-1">{spot.name}</h4>
        {spot.extract && <p className="text-sm text-fg-muted line-clamp-2">{spot.extract}</p>}
        {spot.address && <p className="text-sm text-fg-muted line-clamp-1">{spot.address}</p>}
        <div className="flex items-center gap-3 mt-auto pt-1.5">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-brand flex items-center gap-1"
          >
            <MapPinned size={13} /> Directions
          </a>
          {spot.url && (
            <a
              href={spot.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-fg-muted flex items-center gap-1"
            >
              <ExternalLink size={13} /> Learn more
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}
