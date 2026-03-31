"use client";

import { useState, useRef } from "react";
import { getSupabase } from "@/lib/supabase";

type Participant = {
  id: string;
  trip_id: string;
  name: string;
  rsvp: string;
  budget_min: number | null;
  budget_max: number | null;
  destination_votes: string[];
  headcount: number;
  has_kids: boolean;
  group_type: string;
  created_at: string;
};

export function ParticipantForm({
  tripId,
  destinations,
  onSubmit,
}: {
  tripId: string;
  destinations: string[];
  onSubmit: (participant: Participant) => void;
}) {
  const [name, setName] = useState("");
  const [rsvp, setRsvp] = useState<"yes" | "maybe" | "no">("yes");
  const [votes, setVotes] = useState<string[]>([]);
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [headcount, setHeadcount] = useState(1);
  const [hasKids, setHasKids] = useState(false);
  const [groupType, setGroupType] = useState("mixed");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

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

    setSubmitting(true);

    const db = getSupabase();
    if (!db) {
      setError("Connection error. Try again.");
      setSubmitting(false);
      return;
    }

    const { data, error: dbError } = await db
      .from("participants")
      .insert({
        trip_id: tripId,
        name: name.trim(),
        rsvp,
        budget_min: budgetMin ? parseInt(budgetMin) : null,
        budget_max: budgetMax ? parseInt(budgetMax) : null,
        destination_votes: votes,
        headcount,
        has_kids: hasKids,
        group_type: groupType,
      })
      .select()
      .single();

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
      {/* Name */}
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

      {/* RSVP */}
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

      {/* Headcount — only if attending */}
      {showDetails && (
        <div>
          <label htmlFor="headcount" className="block text-sm font-medium text-ink mb-1.5">
            How many people are you bringing? <span className="text-muted font-normal">(including yourself)</span>
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
            <span className="text-lg font-medium text-ink w-8 text-center" aria-live="polite">{headcount}</span>
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
      )}

      {/* Group composition — only if headcount > 1 */}
      {showDetails && headcount > 1 && (
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

      {/* Budget — only if attending */}
      {showDetails && (
        <fieldset>
          <legend className="block text-sm font-medium text-ink mb-2">
            Budget range <span className="text-muted font-normal">(anonymous, per person)</span>
          </legend>
          <div className="flex gap-2 items-center">
            <div className="flex-1">
              <label htmlFor="budget-min" className="sr-only">Minimum budget</label>
              <input
                id="budget-min"
                type="number"
                inputMode="numeric"
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
                value={budgetMax}
                onChange={(e) => setBudgetMax(e.target.value)}
                placeholder="Max ₹"
                className={inputClass}
              />
            </div>
          </div>
        </fieldset>
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
        {submitting ? "Submitting..." : "Submit your nod"}
      </button>
    </form>
  );
}
