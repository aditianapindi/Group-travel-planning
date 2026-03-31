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

#### D.1: Activity/Experience Affiliate Commissions — A More Defensible Revenue Path

The research-to-booking leakage that killed ~300 planning startups is primarily a **hotels and flights** problem. Experiences may behave differently:

**Why experiences leak less than accommodation:**
- **No comparison-shopping habit** — Nobody opens 38 tabs to price-compare a "street food walking tour in Jaipur." The experience is unique to the marketplace, the price is fixed, and the user books where they discover it. Hotels and flights are commoditized; experiences are not.
- **Lower price sensitivity** — A $40 tour vs. a $42 tour doesn't trigger the same switching behavior as a $300/night vs. $250/night hotel. The stakes are lower per transaction, so the effort to comparison-shop doesn't justify itself.
- **Discovery is the bottleneck, not price** — For activities, the hard part is finding the right one, not finding the cheapest one. A planning tool that surfaces relevant experiences at the right moment in the itinerary IS the value.

**Three affiliate/API programs available today:**
- **Viator** (TripAdvisor-owned): 8% standard commission, well-documented API. Already proven by AvoSquado (400K+ activities integrated). [Source: Viator affiliate program, public; AvoSquado app listing]
- **Klook**: Commission-based affiliate program, strong Asia-Pacific inventory, expanding India. $417M revenue in 2024, $1B+ raised, filing for NYSE IPO. [Source: Klook revenue/funding UNVERIFIED against public filings — Klook is private. IPO filing reported by Bloomberg/Reuters 2024-2025. Crunchbase lists $720M+ through Series E.]
- **GetYourGuide**: Commission-based affiliate, strong European inventory, $680M+ raised. [Source: Crunchbase]

**The strategic advantage a group planning tool has:**
A group planning tool knows what 6 people have already agreed on — destination, dates, budget range, activity preferences, group composition (families vs. friends, ages, dietary needs). This is **richer intent signal than any individual search on Klook or Viator**. An individual searching "things to do in Bali" gets generic results. A planning tool that knows "4 couples, mid-budget, agreed on Bali, Oct 15-22, two members are vegetarian, group voted for cultural experiences over beaches" can surface hyper-relevant activities with high conversion probability. The platform becomes a qualified lead source for experiences marketplaces, not just a referral link.

**How this strengthens C+D combined thesis:**
WhatsApp-native entry (Thesis C) solves adoption. Free planning removes friction. Activity affiliate commissions (Thesis D.1) provide revenue without requiring users to book hotels/flights through the tool — sidestepping the leakage problem that killed predecessors. The tool earns revenue on the transactions that are *least likely to leak*, while letting users book accommodation wherever they want.

#### D.1 Risks

- **Commission rates may not sustain** — 8% on a $40 tour = $3.20 per booking. Need high volume per trip or high group sizes to generate meaningful revenue. For a group of 6 booking 3-4 activities: ~$40-75 per trip. At 1-2 trips/year per group, this is thin. Must model whether this scales or remains supplementary.
- **Marketplace disintermediation** — If Klook/Viator build their own group planning features, they cut out the middleman. Low risk today (their focus is individual discovery + booking), but worth monitoring.
- **🔍 Watch: Klook Kreator Shops** — Klook's Kreator program lets creators build curated "shops" of bookable activities as packaged itineraries. If creators start selling packaged group itineraries with pre-selected, bookable activities, this is a **partial substitute for the organizer role** our product relieves. The organizer's value is "I researched and curated the plan for the group." A Kreator Shop does the same thing, with a booking layer attached. This doesn't kill the coordination/voting/budget features, but it weakens the itinerary curation value prop. Monitor Kreator adoption and whether group-oriented packages emerge. [Source: Klook Kreator program — public, launched 2024]

**Thesis E: "This is a case study, not a startup."**
Most pragmatic. Not raising money — demonstrating product thinking. Acknowledging category risk and having clear-eyed thesis is more impressive than ignoring it. But still needs one of A-D as the actual product thesis.

**Initial lean**: C + D combined — WhatsApp-native entry point (solves adoption) + free planning + monetize during-trip features and expense settlement (follows only proven revenue pattern). D.1 (activity affiliate commissions) strengthens this thesis: experiences leak less than hotels/flights, and group intent data is a competitive advantage over individual search on any marketplace.

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
- [ ] Would your group book activities/tours inside the planning tool, or go to Klook/Viator directly? (experience leakage test)
- [ ] How do you currently discover activities at your destination — search, recommendations, or figure it out on arrival? (discovery channel test)
- [ ] Would curated activity suggestions based on your group's preferences feel helpful or spammy? (affiliate UX test)
