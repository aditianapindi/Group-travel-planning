"use client";

import { useState, useRef } from "react";
import { getSupabase } from "@/lib/supabase";
import { formatDateRange, type DateOption } from "@/lib/holidays";

type Participant = {
  id: string;
  trip_id: string;
  name: string;
  rsvp: string;
  budget_min: number | null;
  budget_max: number | null;
  destination_votes: string[];
  date_votes: DateOption[];
  response_token: string | null;
  headcount: number;
  has_kids: boolean;
  group_type: string;
  created_at: string;
};

export function ParticipantForm({
  tripId,
  destinations,
  dateOptions,
  onSubmit,
  organizerName,
  existingParticipant,
}: {
  tripId: string;
  destinations: string[];
  dateOptions?: DateOption[];
  onSubmit: (participant: Participant) => void;
  organizerName?: string;
  existingParticipant?: Participant | null;
}) {
  const isEdit = !!existingParticipant;
  const [name, setName] = useState(organizerName ?? existingParticipant?.name ?? "");
  const [rsvp, setRsvp] = useState<"yes" | "maybe" | "no">((existingParticipant?.rsvp as "yes" | "maybe" | "no") ?? "yes");
  const [votes, setVotes] = useState<string[]>(existingParticipant?.destination_votes ?? []);
  const [dateVotes, setDateVotes] = useState<string[]>(
    existingParticipant?.date_votes?.map((d) => d.start) ?? []
  );
  const [budgetMin, setBudgetMin] = useState(existingParticipant?.budget_min?.toString() ?? "");
  const [budgetMax, setBudgetMax] = useState(existingParticipant?.budget_max?.toString() ?? "");
  const [headcount, setHeadcount] = useState(existingParticipant?.headcount ?? 1);
  const [hasKids, setHasKids] = useState(existingParticipant?.has_kids ?? false);
  const [groupType, setGroupType] = useState(existingParticipant?.group_type ?? "mixed");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function toggleDateVote(startDate: string) {
    setDateVotes((prev) =>
      prev.includes(startDate)
        ? prev.filter((d) => d !== startDate)
        : [...prev, startDate]
    );
  }

  function toggleVote(dest: string) {
    setVotes((prev) =>
      prev.includes(dest)
        ? prev.filter((v) => v !== dest)
        : [...prev, dest]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Enter your name.");
      return;
    }

    if (rsvp === "yes" && votes.length === 0) {
      setError("Vote for at least one destination.");
      return;
    }

    if (rsvp === "yes" && dateOptions && dateOptions.length > 0 && dateVotes.length === 0) {
      setError("Pick at least one date that works for you.");
      return;
    }

    // Budget validation (M5)
    const minVal = budgetMin ? parseInt(budgetMin) : null;
    const maxVal = budgetMax ? parseInt(budgetMax) : null;
    if (minVal !== null && minVal < 0) {
      setError("Budget can\u2019t be negative.");
      return;
    }
    if (maxVal !== null && maxVal < 0) {
      setError("Budget can\u2019t be negative.");
      return;
    }
    if (minVal !== null && maxVal !== null && minVal > maxVal) {
      setError("Budget minimum can\u2019t be more than maximum.");
      return;
    }
    // Name length limit (M3)
    if (name.trim().length > 50) {
      setError("Name must be 50 characters or less.");
      return;
    }

    setSubmitting(true);

    const db = getSupabase();
    if (!db) {
      setError("Connection error. Try again.");
      setSubmitting(false);
      return;
    }

    const payload = {
      trip_id: tripId,
      name: name.trim(),
      rsvp,
      budget_min: budgetMin ? parseInt(budgetMin) : null,
      budget_max: budgetMax ? parseInt(budgetMax) : null,
      destination_votes: votes,
      date_votes: dateOptions?.filter((d) => dateVotes.includes(d.start)) ?? [],
      headcount,
      has_kids: hasKids,
      group_type: groupType,
    };

    let data: Participant | null = null;
    let dbError: unknown = null;

    if (isEdit && existingParticipant) {
      // Update existing response
      const result = await db
        .from("participants")
        .update(payload)
        .eq("id", existingParticipant.id)
        .eq("response_token", existingParticipant.response_token)
        .select()
        .single();
      data = result.data;
      dbError = result.error;
    } else {
      // New response — generate token
      const token = crypto.randomUUID();
      const result = await db
        .from("participants")
        .insert({ ...payload, response_token: token })
        .select()
        .single();
      data = result.data;
      dbError = result.error;
    }

    if (dbError || !data) {
      setError("Failed to submit. Try again.");
      setSubmitting(false);
      return;
    }

    onSubmit(data);
  }

  const showDetails = rsvp === "yes" || rsvp === "maybe";

  const inputClass =
    "w-full rounded-lg border border-border bg-white px-3 py-2.5 text-ink text-base placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary";

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 mt-6"
      aria-label="Join this trip"
    >
      {/* Name — hidden for organizer (pre-filled) */}
      {!organizerName && (
        <div>
          <label htmlFor="participant-name" className="block text-sm font-medium text-ink mb-1.5">
            Your name
          </label>
          <input
            id="participant-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="given-name"
            aria-required="true"
            className={inputClass}
          />
        </div>
      )}

      {/* RSVP — hidden for organizer (always yes) */}
      {!organizerName ? (
        <fieldset>
          <legend className="block text-sm font-medium text-ink mb-2">
            Are you in?
          </legend>
          <div className="flex gap-2" role="radiogroup">
            {(["yes", "maybe", "no"] as const).map((option) => (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={rsvp === option}
                onClick={() => setRsvp(option)}
                className={`flex-1 rounded-md border px-3 py-2.5 text-sm font-medium min-h-[44px] transition-colors ${
                  rsvp === option
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-secondary border-border hover:border-primary"
                }`}
              >
                {option === "yes" ? "Yes" : option === "maybe" ? "Maybe" : "No"}
              </button>
            ))}
          </div>
        </fieldset>
      ) : (
        <p className="text-sm text-secondary">
          You&apos;re the organizer — just vote on your preferences below.
        </p>
      )}

      {/* Destination votes — only if attending */}
      {showDetails && (
        <fieldset>
          <legend className="block text-sm font-medium text-ink mb-2">
            Vote for destinations <span className="text-muted font-normal">(pick any)</span>
          </legend>
          <div className="flex flex-wrap gap-2" role="group">
            {destinations.map((dest) => (
              <button
                key={dest}
                type="button"
                role="checkbox"
                aria-checked={votes.includes(dest)}
                onClick={() => toggleVote(dest)}
                className={`rounded-full border px-4 py-2.5 text-sm font-medium min-h-[44px] transition-colors ${
                  votes.includes(dest)
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-secondary border-border hover:border-primary"
                }`}
              >
                {dest}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {/* Date votes — only if attending and dates exist */}
      {showDetails && dateOptions && dateOptions.length > 0 && (
        <fieldset>
          <legend className="block text-sm font-medium text-ink mb-2">
            When works for you? <span className="text-muted font-normal">(pick any)</span>
          </legend>
          <div className="flex flex-col gap-1.5">
            {dateOptions.map((option) => {
              const selected = dateVotes.includes(option.start);
              return (
                <button
                  key={option.start}
                  type="button"
                  role="checkbox"
                  aria-checked={selected}
                  onClick={() => toggleDateVote(option.start)}
                  className={`flex items-center justify-between rounded-lg border px-3 py-2.5 text-left min-h-[44px] transition-colors ${
                    selected
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-secondary border-border hover:border-primary"
                  }`}
                >
                  <span className="text-sm font-medium">
                    {formatDateRange(option.start, option.end)}
                    <span className={`ml-1.5 font-normal ${selected ? "text-white/70" : "text-muted"}`}>{option.days}d</span>
                  </span>
                  <span className={`text-xs ml-2 text-right ${selected ? "text-white/70" : "text-muted"}`}>{option.label}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {/* Budget — only if attending */}
      {showDetails && (
        <fieldset>
          <legend className="block text-sm font-medium text-ink mb-1.5">
            Your total trip budget <span className="text-muted font-normal">(per person, anonymous)</span>
          </legend>
          <p className="text-xs text-muted mb-2">Include travel, stay, food, and activities.</p>
          <div className="flex gap-2 items-center">
            <div className="flex-1">
              <label htmlFor="budget-min" className="sr-only">Minimum budget</label>
              <input
                id="budget-min"
                type="number"
                inputMode="numeric"
                min="0"
                value={budgetMin}
                onChange={(e) => setBudgetMin(e.target.value)}
                placeholder="Min ₹"
                className={inputClass}
              />
            </div>
            <span className="text-muted" aria-hidden="true">–</span>
            <div className="flex-1">
              <label htmlFor="budget-max" className="sr-only">Maximum budget</label>
              <input
                id="budget-max"
                type="number"
                inputMode="numeric"
                min="0"
                value={budgetMax}
                onChange={(e) => setBudgetMax(e.target.value)}
                placeholder="Max ₹"
                className={inputClass}
              />
            </div>
          </div>
        </fieldset>
      )}

      {/* More details — collapsible, optional */}
      {showDetails && (
        <details className="group">
          <summary className="text-sm text-secondary cursor-pointer hover:text-ink transition-colors list-none flex items-center gap-1.5">
            <span className="text-muted group-open:rotate-90 transition-transform">&#9654;</span>
            More details <span className="text-muted font-normal">(optional)</span>
          </summary>
          <div className="flex flex-col gap-5 mt-4 pl-0">
            {/* Headcount */}
            <div>
              <label htmlFor="headcount" className="block text-sm font-medium text-ink mb-1.5">
                How many people? <span className="text-muted font-normal">(including yourself)</span>
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setHeadcount(Math.max(1, headcount - 1))}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md border border-border text-ink hover:border-primary transition-colors"
                  aria-label="Decrease headcount"
                >
                  −
                </button>
                <span className="text-sm font-medium text-ink w-8 text-center" aria-live="polite">{headcount}</span>
                <button
                  type="button"
                  onClick={() => setHeadcount(Math.min(10, headcount + 1))}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md border border-border text-ink hover:border-primary transition-colors"
                  aria-label="Increase headcount"
                >
                  +
                </button>
              </div>
            </div>

            {/* Group composition — only if headcount > 1 */}
            {headcount > 1 && (
              <>
                <fieldset>
                  <legend className="block text-sm font-medium text-ink mb-2">
                    Your group is
                  </legend>
                  <div className="flex flex-wrap gap-2" role="radiogroup">
                    {([
                      { value: "family", label: "Family" },
                      { value: "couples", label: "Couple" },
                      { value: "all-women", label: "All women" },
                      { value: "all-men", label: "All men" },
                      { value: "mixed", label: "Mixed" },
                    ] as const).map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={groupType === option.value}
                        onClick={() => setGroupType(option.value)}
                        className={`rounded-full border px-4 py-2 text-sm min-h-[40px] transition-colors ${
                          groupType === option.value
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-secondary border-border hover:border-primary"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="block text-sm font-medium text-ink mb-2">
                    Any kids?
                  </legend>
                  <div className="flex gap-2" role="radiogroup">
                    <button
                      type="button"
                      role="radio"
                      aria-checked={hasKids}
                      onClick={() => setHasKids(true)}
                      className={`flex-1 rounded-md border px-3 py-2.5 text-sm font-medium min-h-[44px] transition-colors ${
                        hasKids
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-secondary border-border hover:border-primary"
                      }`}
                    >
                      Yes, with kids
                    </button>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={!hasKids}
                      onClick={() => setHasKids(false)}
                      className={`flex-1 rounded-md border px-3 py-2.5 text-sm font-medium min-h-[44px] transition-colors ${
                        !hasKids
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-secondary border-border hover:border-primary"
                      }`}
                    >
                      Adults only
                    </button>
                  </div>
                </fieldset>
              </>
            )}
          </div>
        </details>
      )}

      {/* Error */}
      {error && (
        <p role="alert" className="text-sm text-error bg-red-50 rounded-md px-3 py-2.5">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        aria-busy={submitting}
        className="w-full rounded-lg bg-primary text-white font-medium py-3 min-h-[48px] hover:bg-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {submitting ? "Saving..." : isEdit ? "Update your response" : "Submit your nod"}
      </button>
    </form>
  );
}
