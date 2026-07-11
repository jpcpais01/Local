"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BOTTOM_NAV_ITEMS, MORE_PAGE_ITEMS } from "@/lib/nav";

export function BottomNav() {
  const pathname = usePathname();
  const isMoreActive = MORE_PAGE_ITEMS.some((i) => pathname.startsWith(i.href));

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-surface/90 backdrop-blur-lg safe-bottom">
      <ul className="grid grid-cols-5">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const active =
            item.href === "/more" ? isMoreActive : pathname === item.href;
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex flex-col items-center justify-center gap-1 py-2.5 relative"
              >
                <Icon
                  size={22}
                  strokeWidth={active ? 2.4 : 1.8}
                  style={{ color: active ? `var(${item.colorVar})` : "var(--fg-subtle)" }}
                />
                <span
                  className="text-[10.5px] font-medium"
                  style={{ color: active ? "var(--fg)" : "var(--fg-subtle)" }}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
