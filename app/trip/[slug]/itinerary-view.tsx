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

              {/* Day content - clean timeline */}
              {isExpanded && (
                <div id={`day-${dayIdx}-content`} className="pb-3 border-t border-border/50">
                  {day.slots.map((slot, slotIdx) => {
                    const selectedIdx = getSelected(dayIdx, slotIdx);
                    const selectedOption = slot.options[selectedIdx] ?? slot.options[0];
                    const hasAlts = slot.options.length > 1;

                    return (
                      <div key={slotIdx} className="flex gap-3 px-4 py-2.5 border-b border-border/30 last:border-b-0">
                        {/* Time column */}
                        <span className="text-xs text-muted w-14 shrink-0 pt-0.5">{slot.time}</span>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="text-sm font-medium text-ink truncate">{selectedOption.name}</span>
                            <span className="text-xs text-primary whitespace-nowrap">{selectedOption.estimatedCost}</span>
                          </div>

                          {/* Alternatives - compact inline */}
                          {hasAlts && (
                            <div className="flex gap-1 mt-1" role="radiogroup" aria-label={`Options for ${slot.label}`}>
                              {slot.options.filter((_, i) => i !== selectedIdx).map((option, i) => (
                                <button
                                  key={i}
                                  role="radio"
                                  aria-checked={false}
                                  onClick={() => {
                                    const realIdx = slot.options.indexOf(option);
                                    selectOption(dayIdx, slotIdx, realIdx);
                                  }}
                                  disabled={!isOrganizer}
                                  className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
                                    isOrganizer
                                      ? "text-secondary hover:text-primary hover:bg-primary/5 cursor-pointer"
                                      : "text-muted"
                                  }`}
                                >
                                  or {option.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
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

function parseCost(costStr: string): number {
  // Handles: "₹500/person", "₹2,500/person", "₹0/person", "Free", "Included", "Varies"
  if (!costStr) return 0;
  const lower = costStr.toLowerCase();
  if (lower.includes("free") || lower.includes("included") || lower.includes("covered")) return 0;
  const match = costStr.replace(/,/g, "").match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
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

  itinerary.days.forEach((day, dayIdx) => {
    day.slots.forEach((slot, slotIdx) => {
      const selectedIdx = selections[`${dayIdx}-${slotIdx}`] ?? 0;
      const option = slot.options[selectedIdx] ?? slot.options[0];
      total += parseCost(option.estimatedCost);
    });
  });

  const budgetMin = itinerary.budgetRange?.min;
  const budgetMax = itinerary.budgetRange?.max;
  const withinBudget = budgetMax ? total <= budgetMax : null;

  return (
    <div className="mt-8 flex flex-col gap-4">
      {/* Cost estimate */}
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

      {/* Share bar + booking links are in trip-view.tsx below the itinerary */}
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
    <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3">
      <div className="flex items-center gap-2">
        {/* Calendar icon */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-primary shrink-0" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3 10h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <div>
          <p className="text-sm font-medium text-ink">{formatDateRange(startDate, endDate)}</p>
          <p className="text-xs text-muted">{destination}</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <a
          href={googleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-border px-3 py-1.5 text-xs text-ink hover:border-primary hover:text-primary transition-colors min-h-[36px] inline-flex items-center"
          title="Add to Google Calendar"
        >
          {/* Google icon */}
          <svg width="14" height="14" viewBox="0 0 24 24" className="mr-1.5" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </a>
        <button
          onClick={downloadIcs}
          className="rounded-lg border border-border px-3 py-1.5 text-xs text-ink hover:border-primary hover:text-primary transition-colors min-h-[36px] inline-flex items-center"
          title="Download .ics file"
        >
          {/* Download icon */}
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="mr-1.5" aria-hidden="true">
            <path d="M8 2v8m0 0l-3-3m3 3l3-3M3 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          .ics
        </button>
      </div>
    </div>
  );
}
