"use client";

import { useState } from "react";

type Option = {
  name: string;
  description: string;
  estimatedCost: string;
  why: string;
};

type Slot = {
  time: string;
  label: string;
  options: Option[];
};

type Day = {
  day: number;
  title: string;
  slots: Slot[];
};

type Itinerary = {
  destination: string;
  groupSize: number;
  budgetRange: { min: number; max: number } | null;
  days: Day[];
};

export function GenerateButton({
  tripId,
  manageKey,
  onGenerated,
}: {
  tripId: string;
  manageKey: string;
  onGenerated: (itinerary: Itinerary) => void;
}) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId, manageKey }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to generate.");
        setGenerating(false);
        return;
      }

      const itinerary = await res.json();
      onGenerated(itinerary);
    } catch {
      setError("Something went wrong. Try again.");
    }

    setGenerating(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleGenerate}
        disabled={generating}
        aria-busy={generating}
        className="w-full rounded-lg bg-primary text-white font-medium py-3 min-h-[48px] hover:bg-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {generating ? "Generating plan..." : "Generate itinerary for your group"}
      </button>
      {error && (
        <p role="alert" className="text-sm text-error">{error}</p>
      )}
    </div>
  );
}

export function ItineraryView({
  itinerary,
  isOrganizer,
  organizerName,
}: {
  itinerary: Itinerary;
  isOrganizer: boolean;
  organizerName?: string;
}) {
  // Track selected option per slot: { "1-0": 0, "1-1": 2 } = day 1 slot 0 → option 0
  const [selections, setSelections] = useState<Record<string, number>>({});

  function selectOption(dayIdx: number, slotIdx: number, optionIdx: number) {
    if (!isOrganizer) return;
    setSelections((prev) => ({
      ...prev,
      [`${dayIdx}-${slotIdx}`]: optionIdx,
    }));
  }

  function getSelected(dayIdx: number, slotIdx: number): number {
    return selections[`${dayIdx}-${slotIdx}`] ?? 0;
  }

  return (
    <section className="mt-6" aria-labelledby="itinerary-heading">
      <div className="mb-5">
        <h2 id="itinerary-heading" className="font-heading text-2xl text-ink">
          {itinerary.destination}
        </h2>
        <p className="text-sm text-secondary mt-0.5">
          {itinerary.groupSize} people
          {itinerary.budgetRange && (
            <> · ₹{itinerary.budgetRange.min.toLocaleString("en-IN")}–{itinerary.budgetRange.max.toLocaleString("en-IN")}/person</>
          )}
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {itinerary.days.map((day, dayIdx) => (
          <div key={day.day}>
            <h3 className="text-sm font-medium text-ink mb-4">
              Day {day.day} — {day.title}
            </h3>
            <div className="flex flex-col gap-5">
              {day.slots.map((slot, slotIdx) => {
                const selectedIdx = getSelected(dayIdx, slotIdx);
                const selectedOption = slot.options[selectedIdx] ?? slot.options[0];

                return (
                  <div key={slotIdx}>
                    {/* Time + label */}
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-xs text-muted">{slot.time}</span>
                      <span className="text-sm text-secondary">{slot.label}</span>
                    </div>

                    {/* Option pills */}
                    {slot.options.length > 1 && (
                      <div className="flex flex-wrap gap-1.5 mb-2" role="radiogroup" aria-label={`Options for ${slot.label}`}>
                        {slot.options.map((option, optIdx) => (
                          <button
                            key={optIdx}
                            role="radio"
                            aria-checked={optIdx === selectedIdx}
                            onClick={() => selectOption(dayIdx, slotIdx, optIdx)}
                            disabled={!isOrganizer}
                            className={`rounded-full border px-4 py-2 text-sm min-h-[40px] transition-all ${
                              optIdx === selectedIdx
                                ? "bg-primary text-white border-primary"
                                : isOrganizer
                                  ? "bg-white text-ink border-border hover:border-ink cursor-pointer"
                                  : "bg-white text-secondary border-border"
                            }`}
                          >
                            {option.name}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Selected option detail card — Airbnb-style shadow, no border */}
                    <div className="rounded-xl bg-white px-4 py-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.04)]">
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-sm font-medium text-ink">
                          {selectedOption.name}
                        </p>
                        <span className="text-xs font-medium text-primary whitespace-nowrap">
                          {selectedOption.estimatedCost}
                        </span>
                      </div>
                      <p className="text-sm text-secondary mt-1.5 leading-relaxed">
                        {selectedOption.description}
                      </p>
                      <p className="text-xs text-muted mt-2">
                        {selectedOption.why}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Trip cost summary */}
      <TripSummary
        itinerary={itinerary}
        selections={selections}
        isOrganizer={isOrganizer}
        organizerName={organizerName}
      />
    </section>
  );
}

function parseCost(costStr: string): number | null {
  // Handles: "₹500/person", "₹2,500/person", "₹0/person", "Free"
  if (!costStr) return null;
  if (costStr.toLowerCase().includes("free")) return 0;
  const match = costStr.replace(/,/g, "").match(/(\d+)/);
  return match ? parseInt(match[1]) : null;
}

function TripSummary({
  itinerary,
  selections,
  isOrganizer,
  organizerName,
}: {
  itinerary: Itinerary;
  selections: Record<string, number>;
  isOrganizer: boolean;
  organizerName?: string;
}) {
  // Compute total from selected options
  let total = 0;
  let parseable = true;

  itinerary.days.forEach((day, dayIdx) => {
    day.slots.forEach((slot, slotIdx) => {
      const selectedIdx = selections[`${dayIdx}-${slotIdx}`] ?? 0;
      const option = slot.options[selectedIdx] ?? slot.options[0];
      const cost = parseCost(option.estimatedCost);
      if (cost !== null) {
        total += cost;
      } else {
        parseable = false;
      }
    });
  });

  const budgetMin = itinerary.budgetRange?.min;
  const budgetMax = itinerary.budgetRange?.max;
  const withinBudget = budgetMax ? total <= budgetMax : null;

  return (
    <div className="mt-8 flex flex-col gap-4">
      {/* Cost estimate */}
      {parseable && (
        <div className="rounded-xl bg-surface px-4 py-4">
          <p className="text-sm font-medium text-ink">
            Estimated total: ~₹{total.toLocaleString("en-IN")}/person
          </p>
          {budgetMin != null && budgetMax != null && (
            <p className={`text-sm mt-1 ${withinBudget ? "text-secondary" : "text-error"}`}>
              {withinBudget
                ? `Within your group\u2019s ₹${budgetMin.toLocaleString("en-IN")}\u2013${budgetMax.toLocaleString("en-IN")} budget.`
                : `Above your group\u2019s ₹${budgetMax.toLocaleString("en-IN")} budget \u2014 consider swapping some options.`}
            </p>
          )}
        </div>
      )}

      {/* What's next */}
      <div className="rounded-xl bg-primary/5 border border-primary/20 px-4 py-4">
        <p className="text-sm font-medium text-primary">What&apos;s next?</p>
        {isOrganizer ? (
          <p className="text-sm text-ink mt-1.5">
            Share this plan with your group. Toggle between options above to customize, then start booking.
          </p>
        ) : (
          <p className="text-sm text-ink mt-1.5">
            The plan is ready! Reach out to {organizerName ?? "the organizer"} to finalize details and start booking.
          </p>
        )}
      </div>
    </div>
  );
}
