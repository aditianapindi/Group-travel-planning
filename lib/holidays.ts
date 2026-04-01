// 2026 Indian national holidays + computed long weekends
// Only includes windows of 3+ days (holiday adjacent to weekend)

export type DateOption = {
  start: string; // YYYY-MM-DD
  end: string;
  label: string;
  days: number;
};

export function getUpcomingLongWeekends(): DateOption[] {
  const today = new Date().toISOString().slice(0, 10);

  const allWindows: DateOption[] = [
    { start: "2026-01-24", end: "2026-01-26", label: "Republic Day", days: 3 },
    { start: "2026-03-28", end: "2026-03-30", label: "Holi weekend", days: 3 },
    { start: "2026-04-10", end: "2026-04-14", label: "Mahavir Jayanti + Good Friday + Ambedkar Jayanti", days: 5 },
    { start: "2026-05-01", end: "2026-05-03", label: "May Day weekend", days: 3 },
    { start: "2026-08-14", end: "2026-08-17", label: "Independence Day", days: 4 },
    { start: "2026-10-02", end: "2026-10-05", label: "Gandhi Jayanti + Dussehra", days: 4 },
    { start: "2026-10-20", end: "2026-10-25", label: "Diwali week", days: 6 },
    { start: "2026-11-14", end: "2026-11-16", label: "Children's Day weekend", days: 3 },
    { start: "2026-12-25", end: "2027-01-01", label: "Christmas to New Year", days: 8 },
  ];

  return allWindows.filter((w) => w.start >= today);
}

export function formatDateRange(start: string, end: string): string {
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  const sMonth = s.toLocaleDateString("en-IN", { month: "short" });
  const eMonth = e.toLocaleDateString("en-IN", { month: "short" });
  const sDay = s.getDate();
  const eDay = e.getDate();

  if (sMonth === eMonth) {
    return `${sMonth} ${sDay}–${eDay}`;
  }
  return `${sMonth} ${sDay} – ${eMonth} ${eDay}`;
}
