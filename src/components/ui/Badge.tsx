import type { ReactNode } from "react";

export function Badge({
  children,
  colorVar,
  className = "",
}: {
  children: ReactNode;
  colorVar?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
      style={
        colorVar
          ? {
              backgroundColor: `color-mix(in oklab, var(${colorVar}) 15%, transparent)`,
              color: `var(${colorVar})`,
            }
          : undefined
      }
    >
      {children}
    </span>
  );
}
