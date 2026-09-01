# Product Requirements Document (PRD)
## GullyGigs — Cooperative Gig Services Platform

**Version:** 1.0 · **Owner:** Product Lead · **Status:** Draft

---

## 1. Summary

GullyGigs is a mobile-first platform connecting households/communities with verified local service providers (cleaning, cooking, repairs, tutoring, caregiving, events), structured as a worker-owned cooperative. Phase 1 goal: validate the model in one pilot city across 3 service categories.

## 2. Goals

- Enable households to book trustworthy, verified local service providers in under 3 minutes.
- Give service providers a fair-pay, ownership-based alternative to extractive gig platforms.
- Prove that community-based trust verification increases booking confidence over star ratings alone.

## 3. Non-Goals (Phase 1)

- Enterprise/B2B service bookings
- Full on-chain equity ledger
- Cross-border/multi-country operation

## 4. User Stories

### Household/Community Client
- As a client, I want to search for a service by category and location so I can quickly find someone available near me.
- As a client, I want to see a provider's verification level (ID, background check, community vouches) so I feel safe inviting them into my home.
- As a client, I want transparent, upfront pricing so there are no surprise charges.
- As a client, I want to rate and review a provider after service completion.

### Service Provider (Co-op Member)
- As a provider, I want to set my availability and service radius so I control my working hours.
- As a provider, I want to see exactly how much commission is taken and why, so I trust the platform.
- As a provider, I want to track my patronage points and projected dividend so I understand my ownership stake.
- As a provider, I want a clear path to become a full voting co-op member after my probation period.

### Community Verifier
- As a verifier (e.g., RWA admin), I want to vouch for a known local worker so they can be verified faster.
- As a verifier, I want to see my vouching history and its impact on platform trust so I understand my role.

### Co-op Admin/Board
- As an admin, I want to see aggregate metrics (bookings, GMV, commission collected, community fund balance) on a dashboard.
- As an admin, I want to publish RFCs and track voting outcomes on policy changes.

## 5. Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR1 | User registration/login via phone OTP | Must-have |
| FR2 | Service category browse & search with location filter | Must-have |
| FR3 | Booking flow: select provider, time slot, confirm, pay | Must-have |
| FR4 | Multi-layer verification: ID upload, background check API, community vouch count | Must-have |
| FR5 | In-app payments with escrow-style hold until service completion | Must-have |
| FR6 | Bi-directional ratings and review system | Must-have |
| FR7 | Provider earnings dashboard (per-job breakdown, commission shown) | Must-have |
| FR8 | Worker equity/patronage points dashboard | Should-have (Phase 2) |
| FR9 | Community reinvestment fund public tracker | Should-have (Phase 2) |
| FR10 | Governance voting module for policy RFCs | Could-have (Phase 3) |
| FR11 | Dispute resolution flow (flag job, admin mediation) | Must-have |
| FR12 | Multilingual UI support | Should-have |

## 6. Non-Functional Requirements

- **Performance:** Booking flow must complete in ≤5 API calls, page loads <2s on 3G.
- **Security:** All PII encrypted at rest and in transit; background-check data isolated per compliance requirements.
- **Availability:** 99.5% uptime target for booking and payments services.
- **Accessibility:** WCAG 2.1 AA compliance for web app; low-bandwidth mode for mobile.
- **Scalability:** Architecture must support expansion to additional cities/categories without redesign.

## 7. Success Metrics

| Metric | Phase 1 Target |
|---|---|
| Verified providers onboarded | 200 |
| Monthly active clients | 1,000 |
| Booking completion rate | ≥85% |
| Average commission | ≤12% |
| Client trust score (post-service survey) | ≥4.3/5 |
| Provider satisfaction with earnings transparency | ≥80% positive |

## 8. Open Questions

- What is the exact probation period before a provider becomes a full voting member?
- Which third-party verification vendor best balances cost, coverage, and turnaround time in the pilot region?
- Should community verifiers be compensated (fee or recognition-based) for vouching?

## 9. Dependencies

See RAID Log (`/pm/RAID_Log.md`) and WBS (`/pm/Milestone_Roadmap_WBS.md`) for cross-referenced dependencies and risks.
