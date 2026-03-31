import { CreateTripForm } from "./create-trip-form";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col px-4 py-12 max-w-lg mx-auto w-full">
      <div className="mb-10">
        <h1 className="font-heading text-4xl text-ink">Nod</h1>
        <p className="mt-2 text-secondary">
          Get everyone&apos;s nod on where to go, when, and what to spend — in 5
          minutes, not 50 messages.
        </p>
      </div>

      <CreateTripForm />
    </main>
  );
}
