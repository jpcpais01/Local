import type { MoonPhase } from "@/lib/astronomy";
import { Card } from "@/components/ui/Card";

export function MoonCard({ moon }: { moon: MoonPhase }) {
  return (
    <Card className="p-5 flex items-center gap-5">
      <div className="text-6xl leading-none">{moon.emoji}</div>
      <div className="flex-1">
        <p className="font-semibold text-lg">{moon.name}</p>
        <p className="text-sm text-fg-muted">{moon.illumination.toFixed(0)}% illuminated</p>
        <p className="text-sm text-fg-muted">Day {moon.age.toFixed(1)} of the lunar cycle</p>
        <div className="h-1.5 rounded-full bg-surface-2 mt-2 overflow-hidden">
          <div
            className="h-full rounded-full bg-cat-sky"
            style={{ width: `${moon.illumination}%` }}
          />
        </div>
      </div>
    </Card>
  );
}
