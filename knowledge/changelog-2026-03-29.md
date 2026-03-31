# Changelog — March 29, 2026

## Session Summary
Research deepening: competitive landscape updates, planning lead times & organizer patterns research, experiences marketplace integration thesis, Google Form-ready survey.

---

## New Files Created

### `artifacts/survey-google-form-ready.md`
- Reformatted trimmed 9-question survey for direct copy-paste into Google Forms
- Each question has: question text, type label (all Multiple Choice), answer options as bullets
- 4 sections matching Google Form section structure

### `research/planning-lead-times-and-organizer-patterns.md`
- Full sourced research on planning windows by trip type (weekend: 1-7 days, domestic family: 4-8 weeks, international group: 3-6 months, India festival: gap between ideal 2-3 months and actual <1 week, milestone: 4-6 months)
- Serial organizer persona: role is fixed/not rotating (academic sources), gendered (69% US mothers handle booking), 71% find it stressful, 10+ hours/trip admin burden
- Product implications: where to intercept, organizer as target user, primary research gaps
- Sources: Hopper 2023, Club Wyndham 2024, Expedia Q4 2024, MakeMyTrip/Skift 2023, CivicScience 2024, KAYAK 2018, Fardous et al. 2019, ScienceDirect 2021, and others

### `insights/organizer-persona-and-planning-windows.md`
- Synthesized insight connecting organizer persona + planning windows + product implications
- Key finding: retention problem is not seasonal — it's low-frequency, high-intent. Organizer is the link between trips.

---

## Files Updated

### `research/competitive-landscape.md`
| Change | Details |
|--------|---------|
| New section: "The Good Enough Stack: ChatGPT + Google Docs" | Full analysis of AI + shared doc as informal competitor — what it is, why it matters (zero friction, free, habitual), what it gets wrong (no structure, single-author, no state management), strategic implication |
| New section: "Tier 6: Experiences Marketplaces (Integration Partners)" | Klook ($417M rev, NYSE IPO), Viator (8% commission, proven by AvoSquado), GetYourGuide. Framed as affiliate partners, not competitors. Key insight: experiences leak less than hotels/flights |
| Updated combo table | Added "Good enough default" row: ChatGPT → Google Doc/Sheet → WhatsApp + Splitwise |
| Updated "What NOBODY does well" | Added #7: Planning-phase timing — no app intercepts at the right moment |
| New note under Key Competitive Insights | "The real competitor isn't an app" — cross-reference to Good Enough Stack section |

### `research/competitor-viability-and-business-models.md`
| Change | Details |
|--------|---------|
| Added Klook to funding/status table | $1B+ funding, $417M revenue (2024), 1,900 employees, NYSE IPO (KLK). Sources: SEC filing Nov 2025, Getlatka, Crunchbase |
| New point #6 under "What This Means for Product Strategy" | Experiences marketplaces as monetization integration layer — captures during-trip revenue (Thesis D) without hotel/flight inventory partnerships |
| Added 4 sources | SEC filing, Getlatka, Crunchbase (Klook), Bloomberg/Reuters |

### `research/user-segments-analysis.md`
| Change | Details |
|--------|---------|
| Enriched Organizer Persona section (#5) | Added: role fixedness (Fardous et al. 2019, ScienceDirect 2021), gender data (CivicScience 2024), time burden (SquadTrip), stress stats (CivicScience), cultural recognition (KAYAK MVP Planner, Bustle Planner vs Venmo Friend), frequency inference (2-3 groups/year, UNVERIFIED) |
| Added 3 validation assumptions | Serial organizer frequency, planning triggers, role rotation |

### `research/user-pain-points-secondary.md`
| Change | Details |
|--------|---------|
| Expanded Organizer Burnout section (#4) | Added 5 sourced data points: 71% stress (CivicScience), 10+ hrs/trip (SquadTrip), role stickiness (academic), financial burden, counter-intuitive finding that longer planning = more stress |

### `artifacts/interview-guide-trimmed.md`
| Change | Details |
|--------|---------|
| Expanded Q11 | Now probes cross-group organizing ("How many different groups have you planned for in the past 2 years?") |
| Added Q13 | Planning triggers and timing — tests lead times and death zone |
| Updated question count | 13 → 14 |

### `knowledge/decision-category-risk.md`
| Change | Details |
|--------|---------|
| New subsection D.1 under Thesis D | Activity/experience affiliate commissions as more defensible revenue path — why experiences leak less, three available affiliate programs, strategic advantage of group intent data |
| D.1 Risks | Commission unit economics concern, marketplace disintermediation risk, Klook Kreator Shops as watch item (partial substitute for organizer curation role) |
| Updated "Initial lean" | Now references D.1 as thesis strengthener |
| Added 3 interview questions | Experience leakage test, discovery channel test, affiliate UX test |

---

## Key Themes This Session

1. **The real competitor is behavior, not apps** — ChatGPT + Google Docs + WhatsApp is the baseline to beat
2. **The serial organizer is real and targetable** — fixed role, gendered, stressed, likely 2-3 groups/year
3. **Planning windows vary 100x** — 1 day (weekend) to 6 months (international). Product value concentrates in 3-6 month window
4. **Experiences > hotels/flights for monetization** — lower leakage, no comparison-shopping, group intent data is a competitive advantage
5. **India festival travel gap** — should plan 2-3 months ahead, actually plans <1 week. Nudge feature opportunity.
