"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav";
import { MapPin } from "lucide-react";

export function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 border-r border-border h-screen sticky top-0 p-4">
      <Link href="/" className="flex items-center gap-2 px-2 py-3 mb-2">
        <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
          <MapPin size={18} className="text-accent-fg" strokeWidth={2.5} />
        </div>
        <span className="font-bold text-lg tracking-tight">Loci</span>
      </Link>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors"
              style={{
                backgroundColor: active
                  ? `color-mix(in oklab, var(${item.colorVar}) 12%, transparent)`
                  : "transparent",
              }}
            >
              <Icon
                size={19}
                strokeWidth={active ? 2.3 : 1.8}
                style={{ color: active ? `var(${item.colorVar})` : "var(--fg-muted)" }}
              />
              <span
                className="text-sm font-medium"
                style={{ color: active ? "var(--fg)" : "var(--fg-muted)" }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <p className="text-[11px] text-fg-subtle px-3 pb-1">
        Weather, air quality &amp; more via Open-Meteo · News via Google News · Places via
        Wikipedia &amp; OpenStreetMap
      </p>
    </aside>
  );
}
