"use client";

import { useState } from "react";
import { AlertTriangle, ChevronDown } from "lucide-react";
import type { WeatherAlert } from "@/lib/safety";
import { formatRelativeTime } from "@/lib/format";

const SEVERITY_COLOR: Record<string, string> = {
  Extreme: "#dc2626",
  Severe: "#ea580c",
  Moderate: "#ca8a04",
  Minor: "#65a30d",
  Unknown: "#6b7280",
};

export function AlertCard({ alert }: { alert: WeatherAlert }) {
  const [open, setOpen] = useState(false);
  const color = SEVERITY_COLOR[alert.severity] ?? SEVERITY_COLOR.Unknown;

  return (
    <div
      className="rounded-2xl border card-shadow overflow-hidden"
      style={{ borderColor: `color-mix(in oklab, ${color} 40%, var(--border))` }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start gap-3 p-4 text-left"
        style={{ backgroundColor: `color-mix(in oklab, ${color} 8%, var(--surface))` }}
      >
        <AlertTriangle size={20} className="shrink-0 mt-0.5" style={{ color }} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
              style={{ backgroundColor: color, color: "white" }}
            >
              {alert.severity}
            </span>
            <span className="text-xs text-fg-muted">{alert.event}</span>
          </div>
          <p className="font-semibold mt-1 leading-snug">{alert.headline}</p>
          <p className="text-xs text-fg-muted mt-1">
            {alert.areaDesc.split(";").slice(0, 2).join(", ")} · expires{" "}
            {formatRelativeTime(new Date(alert.expires))}
          </p>
        </div>
        <ChevronDown
          size={16}
          className="shrink-0 mt-1 text-fg-subtle transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
        />
      </button>
      {open && (
        <div className="p-4 pt-0 space-y-3 text-sm text-fg-muted">
          <p className="whitespace-pre-line">{alert.description}</p>
          {alert.instruction && (
            <div className="rounded-xl bg-surface-2 p-3">
              <p className="font-medium text-fg mb-1">What to do</p>
              <p className="whitespace-pre-line">{alert.instruction}</p>
            </div>
          )}
          <p className="text-xs text-fg-subtle">Source: {alert.senderName}</p>
        </div>
      )}
    </div>
  );
}
