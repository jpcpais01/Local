import { type CSSProperties, type ReactNode } from "react";

export function Card({
  children,
  className = "",
  as: As = "div",
  style,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
  style?: CSSProperties;
}) {
  return (
    <As
      className={`rounded-2xl border border-border bg-surface card-shadow ${className}`}
      style={style}
    >
      {children}
    </As>
  );
}

export function CardHeader({
  title,
  subtitle,
  icon,
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 p-4 pb-2">
      <div className="flex items-center gap-2.5 min-w-0">
        {icon && <span className="shrink-0">{icon}</span>}
        <div className="min-w-0">
          <h3 className="font-semibold text-fg leading-tight truncate">{title}</h3>
          {subtitle && <p className="text-xs text-fg-muted mt-0.5 truncate">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
