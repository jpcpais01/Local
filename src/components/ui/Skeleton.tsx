import type { CSSProperties } from "react";

export function Skeleton({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return <div className={`animate-pulse rounded-lg bg-surface-2 ${className}`} style={style} />;
}

export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 space-y-3">
      <div className="flex items-center gap-2.5">
        <Skeleton className="h-9 w-9 rounded-xl" />
        <Skeleton className="h-4 w-32" />
      </div>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-3" style={{ width: `${90 - i * 15}%` }} />
      ))}
    </div>
  );
}
