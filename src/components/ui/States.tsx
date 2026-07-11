import type { ReactNode } from "react";
import { AlertTriangle, Inbox, MapPin } from "lucide-react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6 gap-3">
      <div className="text-fg-subtle">{icon ?? <Inbox size={32} strokeWidth={1.5} />}</div>
      <div>
        <p className="font-medium text-fg">{title}</p>
        {description && <p className="text-sm text-fg-muted mt-1 max-w-xs">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function ErrorState({
  message = "Something went wrong loading this.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-6 gap-3">
      <AlertTriangle size={28} strokeWidth={1.5} className="text-cat-safety" />
      <p className="text-sm text-fg-muted max-w-xs">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm font-medium text-brand hover:underline underline-offset-4"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function NoLocationState() {
  return (
    <EmptyState
      icon={<MapPin size={32} strokeWidth={1.5} />}
      title="Set a location to get started"
      description="Loci needs a place to show you what's happening nearby."
    />
  );
}
