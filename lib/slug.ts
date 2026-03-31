export function generateSlug(tripName: string): string {
  const base = tripName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 30);

  const random = Math.random().toString(36).slice(2, 6);
  return `${base}-${random}`;
}
