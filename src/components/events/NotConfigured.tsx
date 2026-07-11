import { KeyRound } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function EventsNotConfigured() {
  return (
    <Card className="p-6 text-center space-y-3">
      <div className="h-12 w-12 rounded-full bg-cat-events/15 flex items-center justify-center mx-auto">
        <KeyRound size={22} className="text-cat-events" />
      </div>
      <h3 className="font-semibold">Add a free SeatGeek client ID to see events</h3>
      <p className="text-sm text-fg-muted max-w-sm mx-auto">
        Loci uses the SeatGeek Platform API for local concerts, sports, and shows — it&apos;s free,
        self-serve, and issued instantly (no app review, no credit card, unlike some ticketing
        APIs).
      </p>
      <ol className="text-sm text-left max-w-sm mx-auto text-fg-muted list-decimal list-inside space-y-1">
        <li>
          Create a free account and grab your client ID at{" "}
          <a
            href="https://seatgeek.com/account/develop"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand underline underline-offset-2"
          >
            seatgeek.com/account/develop
          </a>
        </li>
        <li>
          Add it as <code className="text-xs bg-surface-2 px-1.5 py-0.5 rounded">SEATGEEK_CLIENT_ID</code> in
          your <code className="text-xs bg-surface-2 px-1.5 py-0.5 rounded">.env.local</code> (or Vercel
          project env vars)
        </li>
        <li>Restart the app — events will appear automatically</li>
      </ol>
    </Card>
  );
}
