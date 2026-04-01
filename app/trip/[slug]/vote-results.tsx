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
    <div className="mt-6 flex flex-col gap-3">
      {/* Votes + Dates in a grid */}
      <div className={`grid gap-3 ${dateOptions && dateOptions.length > 0 ? "grid-cols-2" : "grid-cols-1"}`}>
        {/* Destination votes */}
        <section className="rounded-xl border border-border bg-white px-4 py-3" aria-labelledby="votes-heading">
          <div className="flex items-center gap-1.5 mb-2.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <h2 id="votes-heading" className="text-xs font-medium text-ink">Where</h2>
          </div>
          <div className="flex flex-col gap-2">
            {voteCounts.map(({ destination, count }, i) => (
              <div key={destination}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm ${i === 0 && count > 0 ? "font-medium text-ink" : "text-secondary"}`}>{destination}</span>
                  <span className={`text-xs ${i === 0 && count > 0 ? "font-medium text-primary" : "text-muted"}`}>{count}</span>
                </div>
                <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${i === 0 && count > 0 ? "bg-primary" : "bg-border"}`}
                    style={{ width: `${maxVotes > 0 ? (count / maxVotes) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Date votes */}
        {dateOptions && dateOptions.length > 0 && (
          <section className="rounded-xl border border-border bg-white px-4 py-3" aria-labelledby="dates-heading">
            <div className="flex items-center gap-1.5 mb-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-primary" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M3 10h18M8 2v4M16 2v4" />
              </svg>
              <h2 id="dates-heading" className="text-xs font-medium text-ink">When</h2>
            </div>
            <div className="flex flex-col gap-2">
              {dateOptions.map((option, i) => {
                const count = yesParticipants.filter((p) =>
                  p.date_votes?.some((dv) => dv.start === option.start)
                ).length;
                const maxDateVotes = Math.max(
                  ...dateOptions.map((o) =>
                    yesParticipants.filter((p) => p.date_votes?.some((dv) => dv.start === o.start)).length
                  ),
                  1
                );
                const isLeading = i === 0 || count === maxDateVotes;
                return (
                  <div key={option.start}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm ${isLeading && count > 0 ? "font-medium text-ink" : "text-secondary"}`}>
                        {formatDateRange(option.start, option.end)}
                      </span>
                      <span className={`text-xs ${isLeading && count > 0 ? "font-medium text-primary" : "text-muted"}`}>{count}</span>
                    </div>
                    <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${isLeading && count > 0 ? "bg-primary" : "bg-border"}`}
                        style={{ width: `${maxDateVotes > 0 ? (count / maxDateVotes) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Who's responded - compact */}
      <section className="rounded-xl border border-border bg-white px-4 py-3" aria-labelledby="responses-heading">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
            <h2 id="responses-heading" className="text-xs font-medium text-ink">{responded.length} responded</h2>
          </div>
          <div className="flex flex-wrap gap-1.5 justify-end">
            {responded.map((p) => (
              <span
                key={p.id}
                className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs ${
                  p.rsvp === "yes"
                    ? "border-primary/30 bg-primary/5 text-primary"
                    : p.rsvp === "maybe"
                      ? "border-border text-secondary"
                      : "border-border text-muted line-through"
                }`}
              >
                {p.name}
                {p.rsvp === "maybe" && (
                  <span className="ml-0.5 text-muted" aria-label="maybe">?</span>
                )}
              </span>
            ))}
          </div>
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
