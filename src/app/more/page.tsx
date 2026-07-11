import Link from "next/link";
import { MORE_PAGE_ITEMS } from "@/lib/nav";
import { ChevronRight, MapPin } from "lucide-react";

export default function MorePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-6 space-y-4">
      <div>
        <h1 className="text-xl font-bold">More</h1>
        <p className="text-sm text-fg-muted">Safety, sky watching, history & preferences</p>
      </div>

      <div className="rounded-2xl border border-border bg-surface divide-y divide-border overflow-hidden">
        {MORE_PAGE_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 p-4 hover:bg-surface-2">
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `color-mix(in oklab, var(${item.colorVar}) 15%, transparent)` }}
              >
                <Icon size={19} style={{ color: `var(${item.colorVar})` }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{item.label}</p>
                {item.description && <p className="text-xs text-fg-muted truncate">{item.description}</p>}
              </div>
              <ChevronRight size={16} className="text-fg-subtle shrink-0" />
            </Link>
          );
        })}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-4 flex items-start gap-3">
        <MapPin size={18} className="text-accent shrink-0 mt-0.5" />
        <p className="text-xs text-fg-muted leading-relaxed">
          Loci runs entirely on free, public data: Open-Meteo (weather &amp; air quality),
          Google News, Ticketmaster Discovery, OpenStreetMap/Overpass, Wikipedia, USGS, and the
          National Weather Service. Your location is stored only on this device.
        </p>
      </div>
    </div>
  );
}
