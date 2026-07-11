"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, MapPin, Settings } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { LocationPicker } from "./LocationPicker";

export function TopBar() {
  const { activeLocation, ready } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 px-4 py-3 md:py-4 border-b border-border bg-bg/85 backdrop-blur-lg safe-top">
        <div className="md:hidden flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-accent flex items-center justify-center shrink-0">
            <MapPin size={15} className="text-accent-fg" strokeWidth={2.5} />
          </div>
          <span className="font-bold tracking-tight">Loci</span>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex-1 md:flex-initial flex items-center gap-1.5 min-w-0 md:ml-0 justify-end md:justify-start"
        >
          <MapPin size={15} className="text-accent shrink-0 hidden md:block" />
          <span className="text-sm font-medium truncate max-w-[55vw] md:max-w-xs">
            {ready ? activeLocation?.label ?? "Set your location" : "Loading…"}
          </span>
          <ChevronDown size={15} className="text-fg-subtle shrink-0" />
        </button>

        <Link
          href="/settings"
          className="hidden md:flex h-9 w-9 items-center justify-center rounded-full hover:bg-surface-2 text-fg-muted"
          aria-label="Settings"
        >
          <Settings size={18} />
        </Link>
      </header>

      <LocationPicker open={open} onClose={() => setOpen(false)} />
    </>
  );
}
