# RAID Log — GullyGigs Platform
*(Risks, Assumptions, Issues, Dependencies)*

**Last Updated:** August 2026
**Legend — Impact/Likelihood:** L = Low, M = Medium, H = High

---

## Risks

| ID | Risk | Impact | Likelihood | Mitigation | Owner |
|---|---|---|---|---|---|
| R1 | Regulatory ambiguity around gig-worker classification could force restructuring of the equity/member model | H | M | Early legal review; design equity model as "cooperative member," not "employee," from day one | Legal/Compliance |
| R2 | Low initial worker sign-up limits service availability at launch | H | M | Partner with existing informal worker groups/unions for initial onboarding | Marketing Lead |
| R3 | Community vouching process could be gamed (fake vouches) | M | M | Cap vouches per verifier, weight by verifier trust score, add ID cross-check | Engineering Lead |
| R4 | Payment gateway compliance delays (KYC for escrow accounts) | H | L | Start gateway compliance process in Phase 0, in parallel with build | Engineering Lead |
| R5 | Lower commission (8–12%) may not cover operating costs at low volume | H | M | Model break-even volume before launch; keep community fund % adjustable early on | Co-op Board |
| R6 | Competing gig platforms undercut pricing during pilot to disrupt adoption | M | M | Emphasize non-price USPs (equity, trust, governance) in marketing | Marketing Lead |
| R7 | Data privacy breach involving background-check or personal data | H | L | Third-party verification data isolated; encryption at rest/in transit; regular audits | Engineering Lead |

## Assumptions

| ID | Assumption | Validation Plan |
|---|---|---|
| A1 | Target pilot city has sufficient smartphone penetration among service workers | Local survey before Phase 1 kickoff |
| A2 | A compliant third-party verification/background-check provider is available in the pilot region | Vendor evaluation in Phase 0 |
| A3 | Cooperative legal registration can be completed within project timeline | Confirm with legal counsel by end of Phase 0 |
| A4 | Households will accept community-vouching as a meaningful trust signal (not just star ratings) | User research/interviews during Discovery phase |
| A5 | Workers are willing to accept probation period before becoming voting co-op members | Validate via early provider interviews |

## Issues

| ID | Issue | Status | Resolution Plan | Owner |
|---|---|---|---|---|
| I1 | *(example)* No finalized legal entity type for cooperative registration yet | Open | Engage cooperative law specialist; target resolution by Week 3 | Legal/Compliance |
| I2 | *(example)* Undecided which payment gateway supports escrow-style holds in target market | Open | Complete vendor comparison by Week 2 | Engineering Lead |

*(Add real issues as they arise during execution — this log should be treated as a living document.)*

## Dependencies

| ID | Dependency | Depends On | Impacts | Status |
|---|---|---|---|---|
| D1 | MVP Launch (M4) | Verification Service (5.1) + Payment Integration (5.3) complete | Go-live date | Not started |
| D2 | Dividend/Equity features going public | Cooperative Registration (8.1) complete | M5 milestone | Not started |
| D3 | All engineering workstreams | Database Schema & ERD (4.2) finalized | All of Section 4–6 in WBS | Not started |
| D4 | Community Verifier Network | Community Vouching Module (5.2) built + at least 1 pilot RWA partner signed | M6 milestone | Not started |
| D5 | Governance Voting Module | Legal bylaws finalized (defines quorum/voting rules) | M7 milestone | Not started |

---

**Review Cadence:** This RAID log should be reviewed weekly during active phases and updated by the Project/Product Lead, with critical risks (H impact) escalated to the Co-op Board immediately upon identification.
