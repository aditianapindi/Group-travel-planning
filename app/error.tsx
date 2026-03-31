"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 max-w-lg mx-auto w-full text-center">
      <h1 className="font-heading text-2xl text-ink">Something went wrong</h1>
      <p className="mt-2 text-sm text-secondary">
        An unexpected error occurred. Try refreshing the page.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-lg bg-primary text-white font-medium px-6 py-3 min-h-[48px] hover:bg-primary-hover transition-colors"
      >
        Try again
      </button>
    </main>
  );
}
