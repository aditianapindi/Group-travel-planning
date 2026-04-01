"use client";

import { useState } from "react";
import { formatDateRange, type DateOption } from "@/lib/holidays";

type Participant = {
  id: string;
  name: string;
  rsvp: string;
  budget_min: number | null;
  budget_max: number | null;
  destination_votes: string[];
  date_votes: DateOption[];
};

export function VoteResults({
  participants,
  destinations,
  dateOptions,
  isOrganizer,
  tripId,
  tripStatus,
  manageKey,
  onLocked,
}: {
  participants: Participant[];
  destinations: string[];
  dateOptions?: DateOption[];
  isOrganizer: boolean;
  tripId: string;
  tripStatus: string;
  manageKey?: string;
  onLocked?: () => void;
}) {
  const yesParticipants = participants.filter((p) => p.rsvp === "yes");

  // Tally destination votes
  const voteCounts = destinations.map((dest) => ({
    destination: dest,
    count: yesParticipants.filter((p) => p.destination_votes.includes(dest)).length,
  }));
  voteCounts.sort((a, b) => b.count - a.count);

  const maxVotes = Math.max(...voteCounts.map((v) => v.count), 1);

  // Who's responded
  const responded = participants.map((p) => ({
    id: p.id,
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

      {/* Date vote tally */}
      {dateOptions && dateOptions.length > 0 && (
        <section aria-labelledby="dates-heading">
          <h2 id="dates-heading" className="text-sm font-medium text-ink mb-3">
            Dates
          </h2>
          <div className="flex flex-col gap-2">
            {dateOptions.map((option) => {
              const count = yesParticipants.filter((p) =>
                p.date_votes?.some((dv) => dv.start === option.start)
              ).length;
              const maxDateVotes = Math.max(
                ...dateOptions.map((o) =>
                  yesParticipants.filter((p) => p.date_votes?.some((dv) => dv.start === o.start)).length
                ),
                1
              );
              return (
                <div key={option.start} className="flex items-center gap-3">
                  <span className="text-sm text-ink w-28 truncate">{formatDateRange(option.start, option.end)}</span>
                  <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${maxDateVotes > 0 ? (count / maxDateVotes) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm text-secondary w-6 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Who's responded */}
      <section aria-labelledby="responses-heading">
        <h2 id="responses-heading" className="text-sm font-medium text-ink mb-3">
          Responses
        </h2>
        <div className="flex flex-wrap gap-2">
          {responded.map((p) => (
            <span
              key={p.id}
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

      {/* Organizer insights — budget + vote edge cases */}
      {isOrganizer && tripStatus === "collecting" && yesParticipants.length >= 1 && (
        <OrganizerInsights participants={yesParticipants} voteCounts={voteCounts} />
      )}

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
  const [confirming, setConfirming] = useState(false);
  const [locking, setLocking] = useState(false);
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState(false);

  async function handleLock() {
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
    setConfirming(false);
    onLocked?.();
  }

  if (locked) {
    return (
      <div className="rounded-xl bg-primary/5 border border-primary/20 px-4 py-3" role="status">
        <p className="text-sm text-primary font-medium">Trip locked. Ready for planning.</p>
      </div>
    );
  }

  if (confirming) {
    return (
      <div className="rounded-xl border border-border bg-white px-4 py-4 flex flex-col gap-3">
        <p className="text-sm text-ink font-medium">Lock this trip?</p>
        <p className="text-sm text-secondary">Voting will close and you can generate a plan. This can&apos;t be undone.</p>
        <div className="flex gap-2">
          <button
            onClick={() => setConfirming(false)}
            disabled={locking}
            className="flex-1 rounded-lg border border-border text-secondary font-medium py-2.5 min-h-[44px] hover:border-ink hover:text-ink transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleLock}
            disabled={locking}
            aria-busy={locking}
            className="flex-1 rounded-lg bg-primary text-white font-medium py-2.5 min-h-[44px] hover:bg-primary-hover transition-colors disabled:opacity-40"
          >
            {locking ? "Locking..." : "Yes, lock it"}
          </button>
        </div>
        {error && (
          <p role="alert" className="text-sm text-error">
            Failed to lock. Check your connection and try again.
          </p>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="w-full rounded-lg border-2 border-primary text-primary font-medium py-3 min-h-[48px] hover:bg-primary hover:text-white transition-colors"
    >
      Lock trip — close voting
    </button>
  );
}

function OrganizerInsights({
  participants,
  voteCounts,
}: {
  participants: { budget_min: number | null; budget_max: number | null; name: string }[];
  voteCounts: { destination: string; count: number }[];
}) {
  const insights: { type: "warn" | "info"; text: string }[] = [];

  // Budget analysis
  const withBudget = participants.filter((p) => p.budget_min != null && p.budget_max != null);
  const withoutBudget = participants.filter((p) => p.budget_min == null || p.budget_max == null);

  if (withBudget.length >= 2) {
    const overlapMin = Math.max(...withBudget.map((p) => p.budget_min!));
    const overlapMax = Math.min(...withBudget.map((p) => p.budget_max!));

    if (overlapMin > overlapMax) {
      // Find the person with lowest max and highest min to show the gap
      const lowestMax = Math.min(...withBudget.map((p) => p.budget_max!));
      const highestMin = Math.max(...withBudget.map((p) => p.budget_min!));
      insights.push({
        type: "warn",
        text: `Budgets don\u2019t overlap \u2014 one person caps at \u20B9${lowestMax.toLocaleString("en-IN")} but another starts at \u20B9${highestMin.toLocaleString("en-IN")}. You may need to discuss this with the group before locking.`,
      });
    }
  }

  if (withoutBudget.length > 0 && withBudget.length > 0) {
    const names = withoutBudget.map((p) => p.name).join(", ");
    insights.push({
      type: "info",
      text: `${names} didn\u2019t share a budget. The overlap is based on ${withBudget.length} ${withBudget.length === 1 ? "person" : "people"}.`,
    });
  }

  // Vote tie detection
  if (voteCounts.length >= 2 && voteCounts[0].count === voteCounts[1].count && voteCounts[0].count > 0) {
    insights.push({
      type: "info",
      text: `${voteCounts[0].destination} and ${voteCounts[1].destination} are tied. The plan will use ${voteCounts[0].destination} \u2014 wait for more votes or lock if you\u2019re happy with it.`,
    });
  }

  if (insights.length === 0) return null;

  return (
    <section className="flex flex-col gap-2">
      {insights.map((insight, i) => (
        <div
          key={i}
          className={`rounded-xl px-4 py-3 text-sm ${
            insight.type === "warn"
              ? "bg-red-50 text-error"
              : "bg-surface text-secondary"
          }`}
        >
          {insight.text}
        </div>
      ))}
    </section>
  );
}
