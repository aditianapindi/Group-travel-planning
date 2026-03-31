export default function Loading() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-secondary">Loading...</p>
      </div>
    </main>
  );
}
