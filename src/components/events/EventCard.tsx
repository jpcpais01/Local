"use client";

import { useState } from "react";
import { CalendarPlus, Check, ExternalLink, MapPin, Ticket } from "lucide-react";
import type { EventItem } from "@/hooks/useEvents";
import { useApp } from "@/context/AppContext";
import { downloadIcs } from "@/lib/ics";
import { formatEventDate } from "@/lib/format";
import { Card } from "@/components/ui/Card";

export function EventCard({ event }: { event: EventItem }) {
  const { isEventSaved, saveEvent, unsaveEvent } = useApp();
  const saved = isEventSaved(event.id);
  const [imgError, setImgError] = useState(false);

  const dateLabel = event.dateTime
    ? formatEventDate(event.dateTime)
    : event.date
      ? new Date(event.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
      : "Date TBA";

  const priceLabel =
    event.priceMin != null
      ? `${event.currency === "USD" ? "$" : (event.currency ?? "") + " "}${event.priceMin}${
          event.priceMax && event.priceMax !== event.priceMin ? `–${event.priceMax}` : ""
        }`
      : null;

  const toggleSave = () => {
    if (saved) {
      unsaveEvent(event.id);
    } else {
      saveEvent({
        id: event.id,
        name: event.name,
        start: event.dateTime ?? event.date ?? new Date().toISOString(),
        venue: event.venueName ?? undefined,
        url: event.url,
        imageUrl: event.image ?? undefined,
        savedAt: new Date().toISOString(),
      });
    }
  };

  const addToCalendar = () => {
    downloadIcs({
      uid: event.id,
      title: event.name,
      start: new Date(event.dateTime ?? event.date ?? Date.now()),
      location: [event.venueName, event.venueAddress, event.venueCity].filter(Boolean).join(", "),
      description: event.genre ?? event.segment ?? undefined,
      url: event.url,
    });
  };

  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="aspect-[16/9] bg-surface-2 relative">
        {event.image && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.image}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Ticket size={28} className="text-fg-subtle" strokeWidth={1.5} />
          </div>
        )}
        {event.genre && (
          <span className="absolute top-2 left-2 text-[11px] font-medium bg-black/60 text-white px-2 py-1 rounded-full backdrop-blur-sm">
            {event.genre}
          </span>
        )}
        <button
          onClick={toggleSave}
          aria-label={saved ? "Remove from saved" : "Save event"}
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white"
        >
          {saved ? <Check size={16} /> : <span className="text-lg leading-none -mt-0.5">+</span>}
        </button>
      </div>
      <div className="p-3.5 flex-1 flex flex-col gap-1.5">
        <p className="text-xs font-medium text-cat-events">{dateLabel}</p>
        <h4 className="font-semibold leading-snug line-clamp-2">{event.name}</h4>
        {event.venueName && (
          <p className="text-xs text-fg-muted flex items-center gap-1 truncate">
            <MapPin size={12} className="shrink-0" /> {event.venueName}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto pt-2">
          {priceLabel ? (
            <span className="text-xs font-medium text-fg-muted">From {priceLabel}</span>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-3">
            <button
              onClick={addToCalendar}
              aria-label="Add to calendar"
              className="text-fg-muted hover:text-cat-events"
            >
              <CalendarPlus size={16} />
            </button>
            <a href={event.url} target="_blank" rel="noopener noreferrer" className="text-fg-muted hover:text-cat-events">
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
}
