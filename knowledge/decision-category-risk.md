# Decision Note: Category Risk in Group Travel Planning

**Date**: March 28, 2026
**Status**: Open — needs thesis selection before PRD

---

## The Risk

Trip planning is the highest-failure vertical in travel. ~300 startups have died. ~700 have tried. PhocusWire published "Why you should never consider a travel planning startup." No standalone group travel planning app has achieved venture-scale success.

### 5 Reasons Startups Die Here

1. **Research-to-booking leakage** — Users plan on your tool, book on Booking.com/MakeMyTrip. Expedia study: consumers visit ~38 sites before booking. Planning tool is one of 38.

2. **Planning is perceived as free** — Google Sheets is free. WhatsApp is free. Revenue lives at booking (commissions) and during-trip (experiences, expenses). Planning sits in the value chain's dead zone.

3. **Infrequent use = no habit** — Average American takes 3 trips/year. Group trips maybe 1-2. Can't build daily habit or justify subscription on something used twice a year.

4. **WhatsApp gravity** — WhatsApp is terrible for planning but everyone is already there. Asking 6 people to download a new app is harder than dealing with WhatsApp's chaos. "Good enough" beats "better but requires effort."

5. **Group adoption is social, not product** — Organizer loves the app, but 5-7 others didn't choose it. They check once, respond late, go back to WhatsApp. Competing with human inertia, not other apps.

---

## What Survivors Did Differently

| Company | Revenue | Strategy |
|---------|---------|----------|
| **Splitwise** | ~$25M ARR | Solved a *financial* pain point (splitting), not planning. Pain recurs during AND after trip. Doesn't require simultaneous group usage. |
| **Wanderlog** | $1M ARR, 5 people | Stayed tiny. Monetized *during-trip* features (offline, route optimization). Affiliate commissions. Never tried to be a platform. |
| **Holidify** | ~$400K | Content-first (SEO), bootstrapped, near-zero burn. Agent marketplace, not a planning tool. |

None succeeded by being a "group trip planning app."

---

## 5 Possible Theses for "Why Different"

**Thesis A: "Real problem, better execution."**
Every dead startup said this. Problem IS real (59% tension, 37% budget barrier, 16-18hr organizer burden). But real problem ≠ viable business. 300 startups failed at it.

**Thesis B: "Capture the booking, not just planning."**
Solves leakage in theory. In practice: needs hotel/flight inventory partnerships, price parity with OTAs, consumer credit card trust. Cold start on top of cold start.

**Thesis C: "Work with WhatsApp, not against it."**
Most interesting angle. Tool lives inside WhatsApp — bot, shared link, mini-app. Solves adoption friction. India-native (WhatsApp dominant, Business API exists). But constrains UX severely.

**Thesis D: "Monetize during/after trip, not during planning."**
Following Wanderlog/Splitwise pattern. Planning free. During trip: offline access, live expense splitting, real-time itinerary. After trip: settle expenses. Question: enough revenue on 1-2 trips/year?

**Thesis E: "This is a case study, not a startup."**
Most pragmatic. Not raising money — demonstrating product thinking. Acknowledging category risk and having clear-eyed thesis is more impressive than ignoring it. But still needs one of A-D as the actual product thesis.

**Initial lean**: C + D combined — WhatsApp-native entry point (solves adoption) + free planning + monetize during-trip features and expense settlement (follows only proven revenue pattern).

---

## What This Means for the PRD

- Must have a "Why Now / Why Different" section that addresses category risk head-on
- Product thesis must explain why this won't be failure #301
- Feature prioritization should favor during/after-trip features over planning-only features
- Adoption strategy must account for WhatsApp gravity, not ignore it
- Business model must follow Splitwise/Wanderlog pattern, not "build and they'll pay"

---

## Open Questions (validate in interviews)

- [ ] Would users book inside a planning tool, or always go to OTAs? (leakage test)
- [ ] Would users' friends actually download a separate app? (adoption test)
- [ ] What would they pay for — and when in the trip lifecycle? (WTP timing)
- [ ] Is WhatsApp-native viable, or too constraining? (channel test)
- [ ] How many group trips/year? Is frequency enough to sustain engagement? (habit test)
