"use client";

import { useState } from "react";

type Participant = {
  id: string;
  name: string;
  rsvp: string;
  budget_min: number | null;
  budget_max: number | null;
  destination_votes: string[];
};

export function VoteResults({
  participants,
  destinations,
  isOrganizer,
  tripId,
  tripStatus,
  manageKey,
  onLocked,
}: {
  participants: Participant[];
  destinations: string[];
  isOrganizer: boolean;
  tripId: string;
  tripStatus: string;
  manageKey?: string;
  onLocked?: () => void;
}) {
  const yesParticipants = participants.filter((p) => p.rsvp === "yes");

  // Tally votes
  const voteCounts = destinations.map((dest) => ({
    destination: dest,
    count: yesParticipants.filter((p) => p.destination_votes.includes(dest)).length,
  }));
  voteCounts.sort((a, b) => b.count - a.count);

  const maxVotes = Math.max(...voteCounts.map((v) => v.count), 1);

  // Who's responded
  const responded = participants.map((p) => ({
    name: p.name,
    rsvp: p.rsvp,
  }));

  return (
    <div className="mt-6 flex flex-col gap-6">
      {/* Vote tally */}
      <section aria-labelledby="votes-heading">
        <h2 id="votes-heading" className="text-sm font-medium text-ink mb-3">
          Votes
        </h2>
        <div className="flex flex-col gap-2">
          {voteCounts.map(({ destination, count }) => (
            <div key={destination} className="flex items-center gap-3">
              <span className="text-sm text-ink w-24 truncate">{destination}</span>
              <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${maxVotes > 0 ? (count / maxVotes) * 100 : 0}%` }}
                />
              </div>
              <span className="text-sm text-secondary w-6 text-right">{count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Who's responded */}
      <section aria-labelledby="responses-heading">
        <h2 id="responses-heading" className="text-sm font-medium text-ink mb-3">
          Responses
        </h2>
        <div className="flex flex-wrap gap-2">
          {responded.map((p) => (
            <span
              key={p.name}
              className={`inline-flex items-center rounded-full border px-3 py-1.5 text-sm ${
                p.rsvp === "yes"
                  ? "border-primary/30 bg-primary/5 text-primary"
                  : p.rsvp === "maybe"
                    ? "border-border text-secondary"
                    : "border-border text-muted line-through"
              }`}
            >
              {p.name}
              {p.rsvp === "maybe" && (
                <span className="ml-1 text-muted" aria-label="maybe">?</span>
              )}
            </span>
          ))}
        </div>
      </section>

      {/* Organizer next step — collecting phase only */}
      {isOrganizer && tripStatus === "collecting" && (
        yesParticipants.length >= 2 ? (
          <LockButton tripId={tripId} manageKey={manageKey!} onLocked={onLocked} />
        ) : (
          <div className="rounded-xl bg-surface px-4 py-3">
            <p className="text-sm text-secondary">
              <strong className="text-ink">{yesParticipants.length} of 2</strong> confirmations needed to lock the trip.
              {yesParticipants.length === 0
                ? " Share the link and wait for responses."
                : " Need 1 more person to say yes."}
            </p>
          </div>
        )
      )}
    </div>
  );
}

function LockButton({
  tripId,
  manageKey,
  onLocked,
}: {
  tripId: string;
  manageKey: string;
  onLocked?: () => void;
}) {
  const [locking, setLocking] = useState(false);
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState(false);

  async function handleLock() {
    if (!confirm("Lock this trip? Voting will close and you can generate a plan.")) {
      return;
    }

    setLocking(true);
    setError(false);

    const { getSupabase } = await import("@/lib/supabase");
    const db = getSupabase();

    const { error: dbError } = await db
      .from("trips")
      .update({ status: "locked" })
      .eq("id", tripId)
      .eq("manage_key", manageKey);

    if (dbError) {
      setError(true);
      setLocking(false);
      return;
    }

    setLocked(true);
    setLocking(false);
    onLocked?.();
  }

  if (locked) {
    return (
      <div className="rounded-xl bg-primary/5 border border-primary/20 px-4 py-3" role="status">
        <p className="text-sm text-primary font-medium">Trip locked. Ready for planning.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleLock}
        disabled={locking}
        aria-busy={locking}
        className="w-full rounded-lg border-2 border-primary text-primary font-medium py-3 min-h-[48px] hover:bg-primary hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {locking ? "Locking..." : "Lock trip — close voting"}
      </button>
      {error && (
        <p role="alert" className="text-sm text-error">
          Failed to lock. Check your connection and try again.
        </p>
      )}
    </div>
  );
}
