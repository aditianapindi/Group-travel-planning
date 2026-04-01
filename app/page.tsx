import { CreateTripForm } from "./create-trip-form";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col px-4 py-12 max-w-lg mx-auto w-full">
      <div className="mb-10">
        <h1 className="font-heading text-5xl text-ink">Nod</h1>
        <p className="mt-1 text-lg text-secondary font-medium">
          Group trips, decided.
        </p>
        <p className="mt-4 text-sm text-secondary leading-relaxed">
          Stop the 50-message chaos. Share a link with your group — everyone
          votes on where to go and submits their budget in 30 seconds. You lock
          the plan.
        </p>
        <div className="mt-4 flex gap-4 text-xs text-muted">
          <span><strong className="text-ink">1.</strong> Create a trip</span>
          <span><strong className="text-ink">2.</strong> Share the link</span>
          <span><strong className="text-ink">3.</strong> Lock the plan</span>
        </div>
      </div>

      <CreateTripForm />
    </main>
  );
}
