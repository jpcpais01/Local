// Generates a downloadable .ics file client-side so saved events can be
// added to any calendar app — no backend or API needed.

function toIcsDate(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export interface IcsEvent {
  uid: string;
  title: string;
  start: Date;
  end?: Date;
  location?: string;
  description?: string;
  url?: string;
}

export function buildIcs(event: IcsEvent): string {
  const end = event.end ?? new Date(event.start.getTime() + 60 * 60 * 1000);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Loci//Local Events//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${event.uid}@loci.app`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(event.start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:${escapeIcs(event.title)}`,
    event.location ? `LOCATION:${escapeIcs(event.location)}` : undefined,
    event.description ? `DESCRIPTION:${escapeIcs(event.description)}` : undefined,
    event.url ? `URL:${event.url}` : undefined,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);
  return lines.join("\r\n");
}

function escapeIcs(text: string): string {
  return text.replace(/[\\,;]/g, (m) => "\\" + m).replace(/\n/g, "\\n");
}

export function downloadIcs(event: IcsEvent) {
  const ics = buildIcs(event);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${event.title.replace(/[^a-z0-9]/gi, "_").slice(0, 40)}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
