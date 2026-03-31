"use client";

type Participant = {
  rsvp: string;
  budget_min: number | null;
  budget_max: number | null;
  headcount?: number;
};

export function StatusBar({
  participants,
  deadline,
  status,
}: {
  participants: Participant[];
  deadline: string | null;
  status: string;
}) {
  const yesParticipants = participants.filter((p) => p.rsvp === "yes");
  const yesCount = yesParticipants.length;
  const totalHeadcount = yesParticipants.reduce((sum, p) => sum + (p.headcount || 1), 0);
  const maybeCount = participants.filter((p) => p.rsvp === "maybe").length;
  const totalCount = participants.length;

  // Budget overlap — only from "yes" respondents with budget data
  const budgets = participants
    .filter((p) => p.rsvp === "yes" && p.budget_min != null && p.budget_max != null)
    .map((p) => ({ min: p.budget_min!, max: p.budget_max! }));

  const budgetOverlap =
    budgets.length >= 2
      ? {
          min: Math.max(...budgets.map((b) => b.min)),
          max: Math.min(...budgets.map((b) => b.max)),
        }
      : null;

  const hasOverlap = budgetOverlap && budgetOverlap.min <= budgetOverlap.max;

  // Deadline
  let deadlineText: string | null = null;
  let deadlineUrgent = false;
  if (deadline) {
    const diff = new Date(deadline).getTime() - Date.now();
    if (diff <= 0) {
      deadlineText = "Voting closed";
    } else if (diff < 86400000) {
      const hours = Math.ceil(diff / 3600000);
      deadlineText = `${hours}h left to vote`;
      deadlineUrgent = true;
    } else {
      const deadlineDate = new Date(deadline);
      const dayName = deadlineDate.toLocaleDateString("en-IN", { weekday: "long" });
      deadlineText = `Votes close ${dayName}`;
    }
  }

  if (totalCount === 0 && !deadline) return null;

  return (
    <div
      className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-secondary mb-6 pb-4 border-b border-border"
      role="status"
      aria-label="Trip status"
    >
      {totalCount > 0 && (
        <span>
          <strong className="text-ink">{yesCount}</strong> in{totalHeadcount > yesCount && (
            <> ({totalHeadcount} people)</>
          )}
          {maybeCount > 0 && (
            <> · <strong className="text-ink">{maybeCount}</strong> maybe</>
          )}
        </span>
      )}

      {hasOverlap && (
        <span>
          Budget: <strong className="text-ink">
            ₹{budgetOverlap.min.toLocaleString("en-IN")}–{budgetOverlap.max.toLocaleString("en-IN")}
          </strong>
        </span>
      )}

      {budgetOverlap && !hasOverlap && (
        <span className="text-error">No budget overlap</span>
      )}

      {deadlineText && <span className={deadlineUrgent ? "text-primary font-medium" : ""}>{deadlineText}</span>}

      {status === "locked" && (
        <span className="font-medium text-ink">Locked</span>
      )}
    </div>
  );
}
