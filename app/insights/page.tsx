import { getSupabase } from "@/lib/supabase";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Group Insights — Nod",
  description: "What we're learning from how groups plan trips together.",
};

type Participant = {
  rsvp: string;
  budget_min: number | null;
  budget_max: number | null;
  destination_votes: string[];
  trip_id: string;
};

type Trip = {
  id: string;
  status: string;
  destinations: string[];
  created_at: string;
};

export default async function InsightsPage() {
  const db = getSupabase();

  const { data: trips } = await db
    .from("trips")
    .select("id, status, destinations, created_at")
    .order("created_at", { ascending: false });

  const { data: participants } = await db
    .from("participants")
    .select("rsvp, budget_min, budget_max, destination_votes, trip_id");

  const allTrips = (trips ?? []) as Trip[];
  const allParticipants = (participants ?? []) as Participant[];

  // Core metrics
  const totalTrips = allTrips.length;
  const totalParticipants = allParticipants.length;
  const avgGroupSize = totalTrips > 0
    ? (totalParticipants / totalTrips).toFixed(1)
    : "0";

  // Funnel
  const collecting = allTrips.filter(t => t.status === "collecting").length;
  const locked = allTrips.filter(t => t.status === "locked").length;
  const planned = allTrips.filter(t => t.status === "planned").length;
  const completionRate = totalTrips > 0
    ? Math.round((planned / totalTrips) * 100)
    : 0;

  // RSVP distribution
  const yesCount = allParticipants.filter(p => p.rsvp === "yes").length;
  const maybeCount = allParticipants.filter(p => p.rsvp === "maybe").length;
  const noCount = allParticipants.filter(p => p.rsvp === "no").length;
  const yesRate = totalParticipants > 0
    ? Math.round((yesCount / totalParticipants) * 100)
    : 0;

  // Budget insights
  const withBudget = allParticipants.filter(p => p.budget_min != null && p.budget_max != null);
  const avgBudgetMin = withBudget.length > 0
    ? Math.round(withBudget.reduce((s, p) => s + p.budget_min!, 0) / withBudget.length)
    : null;
  const avgBudgetMax = withBudget.length > 0
    ? Math.round(withBudget.reduce((s, p) => s + p.budget_max!, 0) / withBudget.length)
    : null;

  // Top destinations
  const destCounts: Record<string, number> = {};
  allParticipants.forEach(p => {
    (p.destination_votes ?? []).forEach(d => {
      destCounts[d] = (destCounts[d] || 0) + 1;
    });
  });
  const topDestinations = Object.entries(destCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxDestVotes = topDestinations[0]?.[1] ?? 1;

  return (
    <main className="flex-1 px-4 py-8 max-w-lg mx-auto w-full">
      <div className="mb-6">
        <h1 className="font-heading text-2xl text-ink">Group Insights</h1>
        <p className="text-sm text-secondary mt-1">
          What we're learning from how groups plan trips together.
        </p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <MetricCard label="Trips created" value={totalTrips.toString()} />
        <MetricCard label="Participants" value={totalParticipants.toString()} />
        <MetricCard label="Avg group size" value={avgGroupSize} />
        <MetricCard label="Commitment rate" value={`${yesRate}%`} subtitle="said yes" />
      </div>

      {/* Trip funnel */}
      <div className="rounded-xl border border-border bg-white px-4 py-3 mb-4">
        <div className="flex items-center gap-1.5 mb-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          <h2 className="text-xs font-medium text-ink">Trip funnel</h2>
        </div>
        <div className="flex flex-col gap-2">
          <FunnelBar label="Collecting votes" count={collecting} total={totalTrips} />
          <FunnelBar label="Locked" count={locked} total={totalTrips} />
          <FunnelBar label="Plan generated" count={planned} total={totalTrips} />
        </div>
        {completionRate > 0 && (
          <p className="text-xs text-secondary mt-2">
            {completionRate}% of trips reach a generated plan.
          </p>
        )}
      </div>

      {/* RSVP breakdown */}
      <div className="rounded-xl border border-border bg-white px-4 py-3 mb-4">
        <div className="flex items-center gap-1.5 mb-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
          </svg>
          <h2 className="text-xs font-medium text-ink">RSVP breakdown</h2>
        </div>
        <div className="flex gap-3">
          <RsvpStat label="Yes" count={yesCount} total={totalParticipants} color="text-primary" />
          <RsvpStat label="Maybe" count={maybeCount} total={totalParticipants} color="text-secondary" />
          <RsvpStat label="No" count={noCount} total={totalParticipants} color="text-muted" />
        </div>
      </div>

      {/* Budget insights */}
      {avgBudgetMin !== null && avgBudgetMax !== null && (
        <div className="rounded-xl border border-border bg-white px-4 py-3 mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M2 10h20" />
            </svg>
            <h2 className="text-xs font-medium text-ink">Average budget range</h2>
          </div>
          <p className="text-sm text-ink">
            ₹{avgBudgetMin.toLocaleString("en-IN")} - ₹{avgBudgetMax.toLocaleString("en-IN")}
            <span className="text-xs text-muted ml-1">per person</span>
          </p>
          <p className="text-xs text-secondary mt-1">
            Based on {withBudget.length} responses with budget data.
          </p>
        </div>
      )}

      {/* Top destinations */}
      {topDestinations.length > 0 && (
        <div className="rounded-xl border border-border bg-white px-4 py-3 mb-4">
          <div className="flex items-center gap-1.5 mb-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <h2 className="text-xs font-medium text-ink">Top destinations</h2>
          </div>
          <div className="flex flex-col gap-2">
            {topDestinations.map(([dest, count], i) => (
              <div key={dest}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm ${i === 0 ? "font-medium text-ink" : "text-secondary"}`}>{dest}</span>
                  <span className={`text-xs ${i === 0 ? "font-medium text-primary" : "text-muted"}`}>{count} votes</span>
                </div>
                <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${i === 0 ? "bg-primary" : "bg-border"}`}
                    style={{ width: `${(count / maxDestVotes) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collective intelligence note */}
      <div className="rounded-xl bg-primary/5 border border-primary/20 px-4 py-3">
        <p className="text-sm font-medium text-primary">Why this matters</p>
        <p className="text-sm text-ink mt-1">
          Every trip teaches Nod what groups actually want. Budget ranges reveal real spending comfort.
          Destination votes surface hidden preferences. RSVP patterns show who commits and who hesitates.
          This is group intelligence that no individual AI prompt can access.
        </p>
      </div>
    </main>
  );
}

function MetricCard({ label, value, subtitle }: { label: string; value: string; subtitle?: string }) {
  return (
    <div className="rounded-xl border border-border bg-white px-4 py-3">
      <p className="text-2xl font-heading text-ink">{value}</p>
      <p className="text-xs text-secondary">
        {label}{subtitle && <span className="text-muted ml-1">{subtitle}</span>}
      </p>
    </div>
  );
}

function FunnelBar({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-secondary">{label}</span>
        <span className="text-xs text-muted">{count}</span>
      </div>
      <div className="h-1.5 bg-surface rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function RsvpStat({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex-1 text-center">
      <p className={`text-lg font-heading ${color}`}>{pct}%</p>
      <p className="text-xs text-muted">{label} ({count})</p>
    </div>
  );
}
