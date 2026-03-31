"use client";

import { useRef, useState } from "react";
import { createTrip } from "./actions";

export function CreateTripForm() {
  const [destinations, setDestinations] = useState<string[]>([""]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const destinationRefs = useRef<(HTMLInputElement | null)[]>([]);

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

    try {
      await createTrip(formData);
    } catch (e) {
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
