import { KeyRound } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function EventsNotConfigured() {
  return (
    <Card className="p-6 text-center space-y-3">
      <div className="h-12 w-12 rounded-full bg-cat-events/15 flex items-center justify-center mx-auto">
        <KeyRound size={22} className="text-cat-events" />
      </div>
      <h3 className="font-semibold">Add a free Ticketmaster key to see events</h3>
      <p className="text-sm text-fg-muted max-w-sm mx-auto">
        Loci uses the Ticketmaster Discovery API for local concerts, sports, and shows — it&apos;s
        free (no credit card) for up to 5,000 requests/day.
      </p>
      <ol className="text-sm text-left max-w-sm mx-auto text-fg-muted list-decimal list-inside space-y-1">
        <li>
          Get a free key at{" "}
          <a
            href="https://developer.ticketmaster.com/products-and-docs/apis/getting-started/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand underline underline-offset-2"
          >
            developer.ticketmaster.com
          </a>
        </li>
        <li>
          Add it as <code className="text-xs bg-surface-2 px-1.5 py-0.5 rounded">TICKETMASTER_API_KEY</code> in
          your <code className="text-xs bg-surface-2 px-1.5 py-0.5 rounded">.env.local</code> (or Vercel
          project env vars)
        </li>
        <li>Restart the app — events will appear automatically</li>
      </ol>
    </Card>
  );
}
