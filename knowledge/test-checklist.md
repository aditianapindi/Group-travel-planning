# Browser Test Checklist — nod.sunforged.work

Test on mobile (primary) and desktop. ~8 minutes total.

## Priority 1 — Breaks the demo if wrong

- [ ] **Happy path**: Create trip with dates selected → share link → respond as participant in incognito → lock → generate itinerary → see calendar links (3 min)
- [ ] **Google Calendar**: Tap "Add to Google Calendar" after lock → opens with correct trip name, dates, location? (30 sec)
- [ ] **ICS download**: Tap "Download .ics" → file downloads, opens in calendar app with correct details? (30 sec)
- [ ] **Realtime**: Open organizer tab + incognito participant tab → participant submits → organizer view updates without refresh? (1 min)

## Priority 2 — Confusing if wrong

- [ ] **Organizer vote**: Create trip → organizer form shows pre-filled name, no RSVP, "You're the organizer" message? (30 sec)
- [ ] **Motivation block**: Open trip link as participant (no ?key=) → shows names of who responded + deadline consequence? (30 sec)
- [ ] **Deadline passed**: Use a trip with expired deadline → form hidden, "Voting has closed" message shown? (30 sec)
- [ ] **Share buttons**: Copy link → full URL copied? WhatsApp → opens with trip name + link? iMessage → same? (1 min)

## Already verified by code (skip)

Cases 3, 4, 5, 17, 18, 19, 22, 23, 24, 25, 26, 35, 41, 43 — all pass. Long trip name fixed (maxLength=80, break-words CSS).
