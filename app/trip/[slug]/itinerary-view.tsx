"use client";

import { useState, useEffect } from "react";
import { generateGoogleCalendarUrl, generateIcsContent } from "@/lib/calendar";
import { formatDateRange, type DateOption } from "@/lib/holidays";

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
  winningDate,
  tripSlug,
}: {
  itinerary: Itinerary;
  isOrganizer: boolean;
  organizerName?: string;
  winningDate?: DateOption | null;
  tripSlug?: string;
}) {
  // Track selected option per slot: { "1-0": 0, "1-1": 2 } = day 1 slot 0 → option 0
  const [selections, setSelections] = useState<Record<string, number>>({});
  // Day 1 expanded by default, rest collapsed
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>(
    () => ({ 0: true })
  );

  function toggleDay(dayIdx: number) {
    setExpandedDays((prev) => ({ ...prev, [dayIdx]: !prev[dayIdx] }));
  }

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

  // Compute per-day summary (activity count + cost)
  function getDaySummary(day: Day, dayIdx: number) {
    let total = 0;
    let parseable = true;
    day.slots.forEach((slot, slotIdx) => {
      const selectedIdx = selections[`${dayIdx}-${slotIdx}`] ?? 0;
      const option = slot.options[selectedIdx] ?? slot.options[0];
      const cost = parseCost(option.estimatedCost);
      if (cost !== null) total += cost;
      else parseable = false;
    });
    const count = day.slots.length;
    const costStr = parseable ? `~₹${total.toLocaleString("en-IN")}` : "";
    return { count, costStr };
  }

  return (
    <section className="mt-6" aria-labelledby="itinerary-heading">
      <div className="mb-4">
        <h2 id="itinerary-heading" className="font-heading text-2xl text-ink">
          {itinerary.destination}
        </h2>
        <p className="text-sm text-secondary mt-0.5">
          {itinerary.groupSize} people
          {itinerary.budgetRange && (
            <> · ₹{itinerary.budgetRange.min.toLocaleString("en-IN")}-{itinerary.budgetRange.max.toLocaleString("en-IN")}/person</>
          )}
          {" · "}{itinerary.days.length} days
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {itinerary.days.map((day, dayIdx) => {
          const isExpanded = expandedDays[dayIdx] ?? false;
          const summary = getDaySummary(day, dayIdx);

          return (
            <div key={day.day} className="rounded-xl border border-border bg-white overflow-hidden">
              {/* Day header - always visible, tappable */}
              <button
                type="button"
                onClick={() => toggleDay(dayIdx)}
                className="w-full flex items-center justify-between px-4 py-3 min-h-[48px] text-left hover:bg-surface/50 transition-colors"
                aria-expanded={isExpanded}
                aria-controls={`day-${dayIdx}-content`}
              >
                <div>
                  <span className="text-sm font-medium text-ink">
                    Day {day.day}
                  </span>
                  <span className="text-sm text-secondary ml-1.5">
                    {day.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted">
                    {summary.count} activities{summary.costStr ? ` · ${summary.costStr}` : ""}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className={`text-muted transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  >
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>

              {/* Day content - collapsible */}
              {isExpanded && (
                <div id={`day-${dayIdx}-content`} className="px-4 pb-4 flex flex-col gap-2.5 border-t border-border/50">
                  {day.slots.map((slot, slotIdx) => {
                    const selectedIdx = getSelected(dayIdx, slotIdx);
                    const selectedOption = slot.options[selectedIdx] ?? slot.options[0];

                    return (
                      <div key={slotIdx} className="pt-2.5">
                        {/* Time + activity name + cost on one line */}
                        <div className="flex items-baseline justify-between gap-2">
                          <div className="flex items-baseline gap-1.5 min-w-0">
                            <span className="text-xs text-muted shrink-0">{slot.time}</span>
                            <span className="text-sm font-medium text-ink truncate">{selectedOption.name}</span>
                          </div>
                          <span className="text-xs font-medium text-primary whitespace-nowrap">
                            {selectedOption.estimatedCost}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-secondary mt-0.5 ml-0">
                          {selectedOption.description}
                        </p>

                        {/* Option pills - only if multiple options */}
                        {slot.options.length > 1 && (
                          <div className="flex flex-wrap gap-1 mt-1.5" role="radiogroup" aria-label={`Options for ${slot.label}`}>
                            {slot.options.map((option, optIdx) => (
                              <button
                                key={optIdx}
                                role="radio"
                                aria-checked={optIdx === selectedIdx}
                                onClick={() => selectOption(dayIdx, slotIdx, optIdx)}
                                disabled={!isOrganizer}
                                className={`rounded-full border px-3 py-1 text-xs min-h-[32px] transition-all ${
                                  optIdx === selectedIdx
                                    ? "bg-primary text-white border-primary"
                                    : isOrganizer
                                      ? "bg-surface text-ink border-border hover:border-ink cursor-pointer"
                                      : "bg-surface text-secondary border-border"
                                }`}
                              >
                                {option.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Trip cost summary */}
      <TripSummary
        itinerary={itinerary}
        selections={selections}
        isOrganizer={isOrganizer}
        organizerName={organizerName}
        winningDate={winningDate}
        tripSlug={tripSlug}
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
  winningDate,
  tripSlug,
}: {
  itinerary: Itinerary;
  selections: Record<string, number>;
  isOrganizer: boolean;
  organizerName?: string;
  winningDate?: DateOption | null;
  tripSlug?: string;
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

        {/* Calendar links moved to trip-view (shown after lock, before itinerary) */}
      </div>
    </div>
  );
}

export function CalendarLinks({
  tripName,
  destination,
  startDate,
  endDate,
  groupSize,
  budgetRange,
  tripSlug,
}: {
  tripName: string;
  destination: string;
  startDate: string;
  endDate: string;
  groupSize: number;
  budgetRange: { min: number; max: number } | null;
  tripSlug?: string;
}) {
  const [tripUrl, setTripUrl] = useState(tripSlug ? `/trip/${tripSlug}` : "");

  useEffect(() => {
    if (tripSlug) {
      setTripUrl(`${window.location.origin}/trip/${tripSlug}`);
    }
  }, [tripSlug]);

  const description = [
    `${groupSize} people`,
    budgetRange
      ? `Budget: ₹${budgetRange.min.toLocaleString("en-IN")}–${budgetRange.max.toLocaleString("en-IN")}/person`
      : null,
    tripUrl ? `Plan: ${tripUrl}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const googleUrl = generateGoogleCalendarUrl({
    title: tripName,
    startDate,
    endDate,
    description,
    location: destination,
  });

  function downloadIcs() {
    const ics = generateIcsContent({
      title: tripName,
      startDate,
      endDate,
      description,
      location: destination,
    });
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tripName.replace(/\s+/g, "-").toLowerCase()}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mt-3 pt-3 border-t border-primary/10">
      <p className="text-xs text-secondary mb-2">
        {formatDateRange(startDate, endDate)} · {destination}
      </p>
      <div className="flex gap-2">
        <a
          href={googleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-lg border border-border bg-white text-ink text-sm font-medium py-2.5 min-h-[44px] inline-flex items-center justify-center hover:border-primary transition-colors"
        >
          Add to Google Calendar
        </a>
        <button
          onClick={downloadIcs}
          className="flex-1 rounded-lg border border-border bg-white text-ink text-sm font-medium py-2.5 min-h-[44px] inline-flex items-center justify-center hover:border-primary transition-colors"
        >
          Download .ics
        </button>
      </div>
    </div>
  );
}
