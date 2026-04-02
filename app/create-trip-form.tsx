"use client";

import { useRef, useState } from "react";
import { createTrip } from "./actions";
import { getUpcomingLongWeekends, formatDateRange, type DateOption } from "@/lib/holidays";

const longWeekends = getUpcomingLongWeekends();

export function CreateTripForm() {
  const [destinations, setDestinations] = useState<string[]>([""]);
  const [selectedDates, setSelectedDates] = useState<DateOption[]>([]);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [dateError, setDateError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const destinationRefs = useRef<(HTMLInputElement | null)[]>([]);

  function toggleDate(option: DateOption) {
    setSelectedDates((prev) =>
      prev.some((d) => d.start === option.start)
        ? prev.filter((d) => d.start !== option.start)
        : prev.length < 3 ? [...prev, option] : prev
    );
  }

  function addCustomDate() {
    setDateError(null);
    if (!customStart || !customEnd) {
      setDateError("Pick both a start and end date.");
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    if (customStart < today) {
      setDateError("Start date can't be in the past.");
      return;
    }
    if (customEnd <= customStart) {
      setDateError("End date must be after start date.");
      return;
    }
    if (selectedDates.length >= 3) {
      setDateError("Maximum 3 date options.");
      return;
    }
    // Check for duplicate
    if (selectedDates.some((d) => d.start === customStart && d.end === customEnd)) {
      setDateError("These dates are already added.");
      return;
    }
    const startD = new Date(customStart + "T00:00:00");
    const endD = new Date(customEnd + "T00:00:00");
    const days = Math.round((endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const label = formatDateRange(customStart, customEnd);
    setSelectedDates((prev) => [...prev, { start: customStart, end: customEnd, label, days }]);
    setCustomStart("");
    setCustomEnd("");
  }

  function addDestination() {
    if (destinations.length < 6) {
      const next = [...destinations, ""];
      setDestinations(next);
      // Focus the new input after render
      requestAnimationFrame(() => {
        destinationRefs.current[next.length - 1]?.focus();
      });
    }
  }

  function updateDestination(index: number, value: string) {
    const updated = [...destinations];
    updated[index] = value;
    setDestinations(updated);
  }

  function removeDestination(index: number) {
    if (destinations.length > 1) {
      const next = destinations.filter((_, i) => i !== index);
      setDestinations(next);
      // Focus the previous input or first one
      requestAnimationFrame(() => {
        const focusIdx = Math.min(index, next.length - 1);
        destinationRefs.current[focusIdx]?.focus();
      });
    }
  }

  async function handleSubmit(formData: FormData) {
    setError(null);
    setSubmitting(true);

    const filled = destinations.filter((d) => d.trim());
    if (filled.length < 2) {
      setError("Add at least 2 destinations to vote on.");
      setSubmitting(false);
      return;
    }

    formData.set("destinations", filled.join(","));
    formData.set("dateOptions", JSON.stringify(selectedDates));

    try {
      await createTrip(formData);
    } catch (e) {
      // Next.js redirect() throws a special error — don't treat it as a failure
      if (e instanceof Error && e.message.includes("NEXT_REDIRECT")) return;
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-border bg-white px-3 py-2.5 text-ink text-base placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary";

  return (
    <form
      action={handleSubmit}
      className="flex flex-col gap-6"
      aria-label="Create a new trip"
      noValidate
    >
      {/* Trip name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-ink mb-1.5">
          Trip name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="off"
          placeholder="Goa October Trip"
          maxLength={80}
          aria-required="true"
          className={inputClass}
        />
      </div>

      {/* Your name */}
      <div>
        <label htmlFor="createdBy" className="block text-sm font-medium text-ink mb-1.5">
          Your name
        </label>
        <input
          id="createdBy"
          name="createdBy"
          type="text"
          required
          autoComplete="given-name"
          placeholder="Aditi"
          aria-required="true"
          className={inputClass}
        />
      </div>

      {/* Destination options */}
      <fieldset>
        <legend className="block text-sm font-medium text-ink mb-1.5">
          Where to? <span className="text-muted font-normal">(add options to vote on)</span>
        </legend>
        <div className="flex flex-col gap-2" role="list">
          {destinations.map((dest, i) => (
            <div key={i} className="flex gap-2 items-center" role="listitem">
              <input
                ref={(el) => { destinationRefs.current[i] = el; }}
                type="text"
                value={dest}
                onChange={(e) => updateDestination(i, e.target.value)}
                placeholder={i === 0 ? "Goa" : i === 1 ? "Manali" : "Another option"}
                aria-label={`Destination option ${i + 1}`}
                className={`flex-1 ${inputClass.replace("w-full ", "")}`}
              />
              {destinations.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDestination(i)}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center text-muted hover:text-ink transition-colors"
                  aria-label={`Remove destination option ${i + 1}`}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
        {destinations.length < 6 && (
          <button
            type="button"
            onClick={addDestination}
            className="mt-2 text-sm text-primary hover:text-primary-hover transition-colors underline underline-offset-2 min-h-[44px] inline-flex items-center"
          >
            + Add option
          </button>
        )}
      </fieldset>

      {/* Date options — long weekends as wrapping pills */}
      {longWeekends.length > 0 && (
        <fieldset>
          <legend className="block text-sm font-medium text-ink mb-1.5">
            When? <span className="text-muted font-normal">(pick up to 3)</span>
          </legend>
          <div className="flex flex-wrap gap-1.5">
            {longWeekends.map((option) => {
              const selected = selectedDates.some((d) => d.start === option.start);
              return (
                <button
                  key={option.start}
                  type="button"
                  role="checkbox"
                  aria-checked={selected}
                  onClick={() => toggleDate(option)}
                  className={`rounded-full border px-3 py-2 text-sm min-h-[40px] transition-colors ${
                    selected
                      ? "bg-primary text-white border-primary"
                      : "bg-white border-border text-ink hover:border-primary"
                  }`}
                >
                  {formatDateRange(option.start, option.end)} <span className={selected ? "text-white/70" : "text-muted"}>{option.days}d</span>
                </button>
              );
            })}
          </div>
          {/* Show holiday names for selected dates */}
          {selectedDates.filter(d => longWeekends.some(lw => lw.start === d.start)).length > 0 && (
            <div className="mt-2 flex flex-col gap-0.5">
              {selectedDates
                .map(d => longWeekends.find(lw => lw.start === d.start))
                .filter(Boolean)
                .map(lw => (
                  <p key={lw!.start} className="text-xs text-secondary">
                    {formatDateRange(lw!.start, lw!.end)}: {lw!.label}
                  </p>
                ))
              }
            </div>
          )}
        </fieldset>
      )}

      {/* Custom date input — compact inline */}
      <div>
        <p className="text-sm text-secondary mb-1.5">
          {longWeekends.length > 0 ? "Or add your own dates" : "Add dates"}
        </p>
        <div className="flex gap-2 items-center">
          <input
            id="customStart"
            type="date"
            value={customStart}
            onChange={(e) => { setCustomStart(e.target.value); setDateError(null); }}
            min={new Date().toISOString().slice(0, 10)}
            aria-label="Start date"
            className={`flex-1 min-w-0 ${inputClass.replace("w-full ", "")}`}
          />
          <span className="text-sm text-muted">to</span>
          <input
            id="customEnd"
            type="date"
            value={customEnd}
            onChange={(e) => { setCustomEnd(e.target.value); setDateError(null); }}
            min={customStart || new Date().toISOString().slice(0, 10)}
            aria-label="End date"
            className={`flex-1 min-w-0 ${inputClass.replace("w-full ", "")}`}
          />
          <button
            type="button"
            onClick={addCustomDate}
            disabled={selectedDates.length >= 3}
            className="rounded-lg bg-primary text-white text-sm font-medium px-4 py-2.5 min-h-[44px] hover:bg-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
        {dateError && (
          <p role="alert" className="text-xs text-error mt-1">{dateError}</p>
        )}
      </div>

      {/* Selected dates — removable pills */}
      {selectedDates.length > 0 && (
        <div className="flex flex-wrap gap-1.5 -mt-3">
          {selectedDates.map((d) => (
            <span
              key={d.start}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary text-xs px-2.5 py-1"
            >
              {formatDateRange(d.start, d.end)} · {d.days}d
              <button
                type="button"
                onClick={() => setSelectedDates((prev) => prev.filter((s) => s.start !== d.start))}
                className="ml-0.5 hover:text-error transition-colors"
                aria-label={`Remove ${d.label}`}
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Voting deadline */}
      <div>
        <label htmlFor="deadlineDays" className="block text-sm font-medium text-ink mb-1.5">
          Voting deadline <span className="text-muted font-normal">(optional)</span>
        </label>
        <select
          id="deadlineDays"
          name="deadlineDays"
          className={inputClass}
        >
          <option value="">No deadline</option>
          <option value="1">24 hours</option>
          <option value="2">2 days</option>
          <option value="3">3 days</option>
          <option value="7">1 week</option>
        </select>
      </div>

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
        {submitting ? "Creating..." : "Create trip & get share link"}
      </button>
    </form>
  );
}
