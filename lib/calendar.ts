import type { DateOption } from "./holidays";

export function generateGoogleCalendarUrl({
  title,
  startDate,
  endDate,
  description,
  location,
}: {
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;
  description: string;
  location: string;
}): string {
  // Google Calendar uses YYYYMMDD format for all-day events
  const start = startDate.replace(/-/g, "");
  // End date is exclusive in Google Calendar, so add 1 day
  const endExclusive = new Date(endDate + "T00:00:00");
  endExclusive.setDate(endExclusive.getDate() + 1);
  const end = endExclusive.toISOString().slice(0, 10).replace(/-/g, "");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${start}/${end}`,
    details: description,
    location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function generateIcsContent({
  title,
  startDate,
  endDate,
  description,
  location,
}: {
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  location: string;
}): string {
  const start = startDate.replace(/-/g, "");
  // End date is exclusive in ICS for all-day events
  const endExclusive = new Date(endDate + "T00:00:00");
  endExclusive.setDate(endExclusive.getDate() + 1);
  const end = endExclusive.toISOString().slice(0, 10).replace(/-/g, "");

  // Escape special chars for ICS
  const esc = (s: string) => s.replace(/[,;\\]/g, (m) => `\\${m}`).replace(/\n/g, "\\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Nod//Group Trips//EN",
    "BEGIN:VEVENT",
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${esc(title)}`,
    `DESCRIPTION:${esc(description)}`,
    `LOCATION:${esc(location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function getWinningDate(
  participants: { rsvp: string; date_votes: DateOption[] }[],
  dateOptions: DateOption[]
): DateOption | null {
  if (!dateOptions || dateOptions.length === 0) return null;

  const yesParticipants = participants.filter((p) => p.rsvp === "yes");
  if (yesParticipants.length === 0) return null;

  let best: DateOption | null = null;
  let bestCount = 0;

  for (const option of dateOptions) {
    const count = yesParticipants.filter((p) =>
      p.date_votes?.some((dv) => dv.start === option.start)
    ).length;
    if (count > bestCount) {
      bestCount = count;
      best = option;
    }
  }

  return best;
}
