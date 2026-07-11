import type { SunTimes } from "@/lib/astronomy";
import { formatTimeAtOffset } from "@/lib/astronomy";
import { Sunrise, Sunset, CloudSun, Moon as MoonIcon } from "lucide-react";

function TimeTile({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-3.5 flex items-center gap-3">
      <span className="shrink-0" style={{ color }}>
        {icon}
      </span>
      <div>
        <p className="text-xs text-fg-muted">{label}</p>
        <p className="text-base font-semibold tabular-nums">{value}</p>
      </div>
    </div>
  );
}

export function TimesGrid({ times, utcOffsetSeconds }: { times: SunTimes; utcOffsetSeconds: number }) {
  const t = (d: Date | null) => formatTimeAtOffset(d, utcOffsetSeconds);

  return (
    <div className="grid grid-cols-2 gap-2.5">
      <TimeTile icon={<CloudSun size={18} />} label="Blue hour (AM)" value={t(times.civilDawn)} color="#4d6fb0" />
      <TimeTile icon={<CloudSun size={18} />} label="Golden hour (AM)" value={t(times.blueHourMorningEnd)} color="#f6a35e" />
      <TimeTile icon={<Sunrise size={18} />} label="Sunrise" value={t(times.sunrise)} color="#f59e0b" />
      <TimeTile icon={<MoonIcon size={18} />} label="Solar noon" value={t(times.solarNoon)} color="#60a5fa" />
      <TimeTile icon={<Sunset size={18} />} label="Sunset" value={t(times.sunset)} color="#f97316" />
      <TimeTile icon={<CloudSun size={18} />} label="Golden hour (PM)" value={t(times.goldenHourEveningStart)} color="#f6a35e" />
      <TimeTile icon={<CloudSun size={18} />} label="Blue hour (PM)" value={t(times.blueHourEveningStart)} color="#4d6fb0" />
      <TimeTile icon={<MoonIcon size={18} />} label="Night begins" value={t(times.astronomicalDusk)} color="#4338ca" />
    </div>
  );
}
