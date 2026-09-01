# Master Build Prompt — GullyGigs Cooperative Gig Services Platform
*A single, detailed prompt/spec you can hand to a design team, dev team, or AI builder to construct the full product.*

---

## 0. How to Use This Document

This is a **master build prompt**. Every section below is written so it can be lifted directly into a design brief, engineering ticket, or AI code-generation prompt. Read top to bottom for the full picture; jump to any numbered section for a standalone spec.

---

## 1. Project Vision (One Paragraph)

Build **GullyGigs**, a hybrid (online + offline) cooperative gig-services super-app that connects verified customers with verified workers across household, skilled-trade, professional, medical, event, and emergency service categories. The platform must feel **fast, trustworthy, and alive** — glassmorphic, animated, real-time — while enforcing rigorous identity verification (Aadhaar/DigiLocker), transparent pricing, worker accountability grading, and a cooperative fee structure that benefits both sides.

---

## 2. Authentication & Identity Verification

### 2.1 Login/Signup Flow
- Phone number + OTP as the primary login (fast, low-friction).
- Optional email as secondary contact.
- Mandatory **role selection at signup**: "I'm looking for help" (Customer) vs "I offer a service" (Worker). No shared/generic accounts — each role gets a structurally separate profile schema, dashboard, and permissions, even if the same phone number is later linked to both (e.g., someone who is both a customer and a part-time worker should be able to switch profiles, not merge them).

### 2.2 Government ID Verification
- **DigiLocker API integration** for pulling verified Aadhaar/PAN/driving license data with user consent (OAuth-style consent flow — never store raw Aadhaar number, only DigiLocker's verified token/reference and masked last-4-digits).
- **Aadhaar-based eKYC** as fallback/alternate verification path where DigiLocker isn't used, via UIDAI-compliant OTP-based eKYC (never store biometric data; store only verification status + hashed reference ID).
- Verification produces a **tiered badge**: Unverified → ID Verified → ID + Background Check Verified → Community Vouched (for workers).
- Customers get a lighter verification tier (ID Verified is usually sufficient) since risk exposure is asymmetric — workers enter homes, so worker verification is stricter.

### 2.3 Data Handling Principles
- Store only what's needed (data minimization) — masked ID numbers, verification status flags, not raw scanned documents beyond the verification window.
- Encrypt all PII at rest (AES-256) and in transit (TLS 1.3).
- Separate verification data into an isolated microservice/database, accessible only by the verification service — not joined directly with booking/chat data.

---

## 3. Profile Structures (Two Distinct Schemas)

### 3.1 Customer Profile
- Name, phone (verified), optional email
- Address(es) — saved locations for offline bookings
- ID verification tier
- Payment methods on file
- Booking history
- Saved/favorite workers
- Ratings given
- Premium membership status

### 3.2 Worker Profile
- Name, phone (verified), ID verification tier, background-check status
- Service category + subcategories offered (multi-select)
- Skill badges / certifications (uploadable proof, e.g., trade certificates)
- Portfolio (photos/samples — especially relevant for painters, tailors, photographers, editors)
- **One-Click Slide Presentation Deck:** auto-compiles a worker's top-rated jobs, verified badges, and gallery images into a downloadable slide deck — useful for pitching bulk/recurring clients (RWAs, event planners, corporate housekeeping contracts) outside the standard single-booking flow.
- Availability calendar + service radius (for offline work) or "remote-only" toggle (for online work)
- Pay rate (hourly/per-project/per-visit — configurable per category)
- Security deposit status (see Section 8)
- Patronage points / co-op equity status (per prior cooperative-governance design)
- Cumulative rating, badge tier (Bronze/Silver/Gold/Platinum — accountability grading, see Section 7)
- Community vouch count and vouch sources

---

## 4. Service Categories & Subcategories

Each top-level category must support **subcategory selection at both the worker profile level (what they offer) and the booking flow level (what the customer needs)** — this is the "specification" step you described (e.g., cook selects "North Indian," "Baking," "Meal Prep"; customer selects the same when booking).

| Category | Example Subcategories |
|---|---|
| **Study/Tutoring** | School subjects (by grade/board), competitive exam prep, language learning, music/art lessons, advanced university-level subjects (e.g., abstract algebra, group theory), technical/software training |
| **Cleaning** | Deep cleaning, regular housekeeping, sofa/carpet cleaning, post-construction cleaning |
| **Mechanical** | Vehicle repair, appliance repair, AC/refrigerator servicing |
| **Househelp** | Daily chores, laundry, dishwashing, live-in help |
| **Cook** | North Indian, South Indian, Continental, Baking, Diet-specific meal prep, event catering |
| **Skilled Home Trades** | Tailoring, painting (wall/art), plumbing, carpentry, electrical, welding, masonry |
| **Photographer/Editor** | Event photography, portrait, product photography, video editing, photo retouching |
| **Delivery Persons** | Local parcel delivery, grocery delivery, document courier |
| **Technical Assistance** | Computer/laptop repair, networking setup, smart-home installation, IT support, micro-electronics & hardware diagnostics (breadboard/DMM/circuit-level analysis), custom PC builds |
| **Logistics & Supply Chain** | Packing/moving, warehousing help, transport coordination |
| **Engineering & Medical Assistance** | Site engineering support, nursing assistance, physiotherapy, lab sample pickup |
| **Beauty & Wellness** | Salon-at-home, spa, massage therapy, makeup artist |
| **Dietician** | Diet planning, nutrition consultation, meal-plan follow-up |
| **Caregiving & Pet Care** | Elder care, pet walking/sitting/grooming, veterinary assistance coordination |
| **Infant Daycare** | Babysitting, nanny services, infant care specialists |
| **Events & Hospitality** | Event staffing, waitstaff, decoration, anchor/host services |
| **Food Services** | Home-based tiffin services, bulk food prep, catering staff |

**Subcategory data model:** each subcategory should carry its own micro-schema of "specification fields" — e.g., Tutoring → {subject, grade level, board, online/offline}; Plumbing → {issue type: leak/installation/inspection, urgency}; Cook → {cuisine, meal type, dietary restrictions}. This drives both the booking form and the worker-matching filter.

---

## 5. Hybrid Mode: Online vs Offline Work

- At booking, customer selects **Online** (e.g., tutoring session, video editing, remote tech support, dietician consult) or **Offline** (physical presence required — cleaning, cooking, repairs, caregiving, etc.).
- **Online jobs**: matching is skill/category/availability-based, location-agnostic; delivered via in-app video/chat/file-sharing tools.
- **Offline jobs**: matching runs a **proximity-first ranking algorithm** — workers within the customer's service radius are prioritized and shown first, with distance clearly displayed; only if no nearby workers are available/verified does the radius expand automatically (with a clear "expanding search radius..." UI state).
- Some categories can toggle between modes per booking (e.g., a tutor might offer both online and in-home tutoring) — worker profile should indicate which modes they support per subcategory.
- **Virtual Triage (Pre-Booking AR/Video):** for offline technical jobs (plumbing, electrical, appliance repair), let the customer record a short 15-second video or use an AR "circle the problem area" tool before a worker accepts — so the worker arrives knowing the issue and bringing the right tools/parts the first time. This should feed into the booking's job description (Section 6) as an attached media clip.

---

## 6. Booking Workflow (Step-by-Step)

1. **Select category → subcategory → specification fields** (as defined in Section 4).
2. **Select mode**: Online / Offline (with offline auto-showing nearby workers first).
3. **Enter job basic details**: description, preferred date/time, duration estimate, location (for offline).
4. **Set/confirm pay rate**: hourly, per-project, or platform-suggested rate range based on category/subcategory + local market data.
5. **Community Bounties ("Sidequests")** *(optional, alternate entry point)*: instead of a single customer booking alone, multiple customers can pool funds toward one job — e.g., neighbors splitting the cost to hire someone to clean a shared park or common area. Pooled bounty jobs appear on a dedicated **"Bounty Board" UI** for workers, showing total pooled amount, number of contributors, and job scope, separate from the regular single-customer job feed.
6. **Working hours**: define expected hours or duration; recurring bookings (e.g., daily cook, weekly cleaner) get a schedule template.
7. **Security & agreement**: for long-term/recurring engagements, generate a lightweight digital agreement (terms of engagement, cancellation policy, payment schedule) — e-signed in-app.
8. **Review platform fee + worker security deposit disclosure** (see Section 8) before confirming.
9. **Confirm & pay** (escrow-style hold until job marked complete by both parties — for bounty jobs, funds are held from all contributors until completion is confirmed).

---

## 7. Rating, Review & Accountability Grading

- **Bi-directional ratings** (customer rates worker, worker rates customer) after every job — prevents one-sided accountability.
- **Grading tiers** for workers (e.g., Bronze → Silver → Gold → Platinum) based on: cumulative rating average, number of completed jobs, dispute rate, punctuality score, verification tier, community vouch count.
- Higher tiers unlock: higher visibility in search ranking, lower platform fee percentage (reward loyalty), eligibility for premium/high-value bookings.
- Grading should be **transparent and appealable** — workers can see exactly why their tier changed, consistent with the platform's transparency principle (ties into the algorithmic-governance USP from earlier docs).

---

## 8. Fees, Security Deposits & Transparency

- **Customer side**: small platform/booking fee shown upfront at checkout (flat or % — must be disclosed before payment confirmation, never hidden or added silently).
- **Worker side**:
  - Small **refundable security deposit** at onboarding (proportional to category risk level — e.g., higher for in-home caregiving, lower for delivery) — held to cover cancellation/no-show penalties, refunded on good standing.
  - **Platform fee** taken as a percentage of each completed job (kept low — 8–12% per the cooperative model) — always shown as a line item, never bundled invisibly into the price.
- A **transparency ledger** view (for both sides) showing exactly: job value → platform fee → worker payout, and for workers, a running deposit balance.
- **"Skill Swap" / Timebanking Module** *(optional alternate payment path)*: users who are verified as **both** a Customer and a Worker can opt to exchange services using **Platform Time Credits** instead of cash — e.g., a tutor gives 2 hours of tutoring to earn credits redeemable toward a mechanic's help, bypassing fiat for that transaction. This still runs through the same escrow/completion-confirmation flow and the same rating system, and platform fee logic should still apply in credit form (e.g., a small credit-based service fee) so the co-op fee model stays consistent even for non-cash exchanges. Frame this as a community-reinforcing feature, not a way to avoid platform accountability.

---

## 9. Emergency SOS Page

- Dedicated, always-accessible **SOS button** (persistent floating button or fixed nav icon, red/urgent color coding) for time-critical needs: ambulance dispatch coordination, urgent plumbing/electrical (e.g., gas leak, flooding), urgent caregiving gaps, or general safety emergencies during an active booking.
- SOS flow: one-tap trigger → auto-shares live location → immediately surfaces nearest available emergency-tagged workers/services **and** relevant local emergency numbers (ambulance, police, fire) as a fallback — the app should never claim to replace emergency services, only supplement/expedite access.
- Live status tracking once an SOS request is accepted (similar to ride-hailing "driver en route" experience) — visible to the requester and, optionally, a designated emergency contact.

---

## 10. Customer Care / Support Page

- Separate from SOS — this is for **non-emergency issues**: worker misconduct reports, billing disputes, account issues, general help finding the right service.
- Multi-channel: in-app chat with support agent, ticket system with status tracking, FAQ/knowledge base, and a clear escalation path for serious complaints (e.g., ill-treatment reports get flagged for priority human review, not just chatbot triage).
- All misconduct reports should feed into the worker's accountability record (Section 9) after review — this is how "grading system follows" ties back to real accountability.

---

## 11. Interactive Worker-Fetch / Search Results Page

This is the platform's centerpiece screen — described as needing to be visually alive, not static.

- **Loading state**: an animated, blinking/pulsing skeleton-loader (glassmorphic cards with a soft shimmer/blink animation) while workers are being fetched based on customer filters — should feel premium and responsive, not like a spinner stalling the user.
- **Filters**: rating, price range, working hours/availability, security deposit status, verification tier, distance/nearby-first (for offline), category-specific specification match.
- **Sort options**: price (low-high/high-low), rating, distance, experience (years/jobs completed), availability (soonest first).
- **Result cards**: glassmorphic card design (see Section 13) showing photo, name, badge tier, star rating + review count, verification icons, starting price, distance (if offline), and a quick "View Profile" / "Book Now" CTA.
- Real-time re-filtering: as the customer adjusts filters/sort, cards should animate reflow (not full page reload) for a smooth, app-like feel.

---

## 12. Chatbot, Feedback, and Premium Membership

### 12.1 In-App Chatbot
- Assists with platform navigation ("how do I book a plumber"), category recommendations based on described problem ("my sink is leaking" → routes to Plumbing subcategory), and general FAQs.
- Escalates to human customer care for anything involving disputes, safety, or account/payment issues rather than attempting to resolve those itself.

### 12.2 Feedback & Suggestions Page
- Simple structured feedback form (post-job prompts + a general "suggest a feature/category" page) — feeds directly into product roadmap prioritization, and for governance-relevant changes, into the RFC process described in the cooperative governance docs.

### 12.3 Referral Program
- Every customer (and worker) gets a unique referral code/link, shareable via WhatsApp/SMS/social.
- When a referred person **signs up and completes verification** (and, for referred workers, completes their first job), the referrer earns **Referral Points** added directly to their profile — visible on a "My Referrals" tracker showing status (invited → verified → active) for each referral.
- Referral Points accumulate and can be **redeemed as a discount on Premium Membership** — e.g., every X points = a % off the next billing cycle, or enough points = a free month. Define a clear, published points-to-discount table so it feels transparent, not arbitrary (consistent with the platform's overall transparency principle).
- Optional bonus: extra points for referring a **worker** specifically (since worker supply is often the harder side of the marketplace to grow), and a small bonus for the referred person too (double-sided referral incentive) to boost conversion.
- Referral Points should **never expire silently** — show expiry clearly if any is set, and notify users before points lapse.
- Leaderboard/recognition for top referrers (ties into the gamification pointer in Section 16) — non-monetary badges like "Community Builder" alongside the point-based rewards.

### 12.4 Premium Membership (Motivating, Tiered Design)
Premium should feel like an obvious upgrade, not just "pay more for less friction." Structure it in visible tiers with a mix of convenience, savings, and status/access perks:

**Customer Premium (e.g., "GullyGigs Plus")**
- Zero or reduced platform booking fee (vs standard fee for free-tier customers)
- Priority matching — your booking request reaches top-rated/Platinum workers first
- Verified Platinum-tier worker access for categories that restrict top workers to premium customers only during high-demand periods
- Free/priority SOS response handling (faster dispatch queue — never gating the SOS *feature* itself, only queue priority)
- Discounted rates on recurring bookings (e.g., daily cook, weekly cleaner subscriptions)
- Free cancellation/rescheduling up to a higher limit per month
- Exclusive access to premium-only categories/add-ons: e.g., **same-day emergency home repairs, premium event staffing packages, dedicated relationship manager for long-term/live-in worker arrangements**
- Redeemable referral-point discounts stack on top of the membership price
- Early access to new service categories as they roll out in new cities

**Worker Premium (e.g., "GullyGigs Pro")**
- Lower platform commission at qualifying volume (reward loyalty, on top of the standard co-op commission structure)
- Enhanced profile visibility ("Featured" placement in search results)
- Early access to high-value/premium-customer bookings
- Faster payout cycles (e.g., instant payout vs standard 24-hour hold)
- Access to skill-upgrade workshops/certifications funded partly via the community reinvestment fund

**Guardrail:** Premium must never gate core safety/trust features — verification, SOS access itself, dispute resolution, and basic booking must remain free for every user. Premium buys convenience, priority, and savings, not safety.

---

## 13. Notifications & Live Work Tracking

- Push notifications for: booking confirmed, worker en route (offline jobs), work started, work completed, payment released, rating reminder, dispute status updates.
- **Live status tracking** during an active offline job: worker location (shared only during active job window, not persistently), estimated time to completion, and a visible "work in progress" timeline — mirrors the trust/safety expectations customers have from ride-hailing apps, applied to in-home services.
- Workers also get live updates relevant to them: customer instructions/updates, payment release confirmation, and any customer-side changes to the booking.

---

## 14. Privacy: Shared Information Boundaries

- Customers and workers should see enough to **feel connected and confident** — first name, photo, rating, verification badges, general area (not exact home address until booking is confirmed) — without exposing deep personal information (full address before confirmation, ID numbers, financial details, or unrelated personal data) to each other.
- Exact address/contact details are revealed only after a booking is confirmed and only for the duration needed to fulfill that job.

---

## 15. UI/UX Design Direction

### 15.1 Visual Language
- **Glassmorphism** as the primary design language: frosted-glass translucent panels (backdrop-filter: blur), soft drop shadows, subtle gradient backgrounds (deep blues/teals with warm accent gradients for a "trustworthy but warm" feel), thin light-colored borders (1px, low-opacity white) to define card edges against the blurred background.
- Rounded corners throughout (12–20px radius) for a soft, approachable feel appropriate to a household-services context.
- Dark-mode-friendly by default — glassmorphism reads especially well on darker backgrounds with vibrant accent colors popping through the translucency.

### 15.2 Color & Typography
- Primary accent: a trustworthy blue/teal (safety, verification) paired with a warm amber/coral accent (for CTAs, SOS, urgency) — deliberate contrast so emergency/urgent elements (SOS button) visually stand apart from routine UI.
- Typography: clean geometric sans-serif for headers (confidence, modernity), slightly rounded sans-serif for body text (approachability); support for regional scripts (Devanagari, etc.) for multilingual UI.

### 15.3 Motion & Micro-interactions
- Skeleton-loading shimmer/blink animation on the worker-search page (Section 11) — this should feel alive, using a soft pulsing opacity animation on glass cards, not a generic spinner.
- Smooth card-reflow animations when filters/sort change.
- Subtle scale/glow micro-interactions on button press (especially booking confirmation and SOS button, which should have a distinct "pulse" animation to draw attention when idle-visible).
- Progress-bar/timeline animation for live work tracking (Section 13) — animated dot moving along a path, similar to delivery-tracking UI patterns.
- **Verification Shine:** ID Verified / background-check badges get a periodic, subtle metallic shimmer sweep (not constant, just often enough to catch the eye) to reinforce a sense of trust and legitimacy without being distracting.
- **"Vouch" Ripple:** the Community Vouched counter on a worker's profile plays a soft ripple/pulse effect whenever a new vouch is registered in real time — makes community trust-building feel visible and rewarding rather than a static number.

### 15.4 Page-by-Page Design Notes
- **Home/Discovery**: glassmorphic category tiles with icons, search bar with location context, personalized "recommended for you" row.
- **Search/Results**: as detailed in Section 11 — the most animation-heavy page in the app.
- **Worker Profile**: glass card header with photo/badges over a soft gradient background, tabs for portfolio/reviews/availability.
- **Booking Flow**: step-based wizard UI (progress indicator at top), glass panels per step, clear fee transparency panel before final confirmation.
- **SOS Page**: intentionally high-contrast and simple — glassmorphism minimized here in favor of clarity and speed; large tap targets, minimal text, immediate action.
- **Dashboard (Worker/Customer)**: glass widget cards for earnings/bookings/ratings, with data visualizations (simple bar/line charts) for trends.

---

## 16. Extra Pointers / Additional Recommendations

- **Insurance layer**: consider optional liability/accident micro-insurance for high-risk offline categories (mechanical, home trades, caregiving) — strengthens trust and differentiates further from informal markets.
- **Multilingual & voice input**: given the household-services audience often includes workers less comfortable with English text-heavy UIs, prioritize voice-based booking/search input and regional language support early, not as an afterthought.
- **Offline-first data sync**: workers in low-connectivity areas should be able to view/accept bookings and mark job status with local caching + sync-when-online behavior, not require constant connectivity.
- **AI-assisted matching**: beyond filters, use a lightweight recommendation model that learns from past bookings (category preference, price sensitivity, preferred worker traits) to proactively surface good matches, especially for repeat/recurring service needs.
- **Dispute resolution transparency**: publish anonymized dispute-resolution outcome statistics periodically (ties into the platform's overall transparency/cooperative-governance ethos from the product docs).
- **Gamification for workers**: badge milestones (e.g., "50 jobs completed," "Community Champion" for high vouch counts) to reinforce the grading/accountability system positively, not just punitively.
- **Accessibility**: ensure the app is usable for elderly customers (common for caregiving/medical-assistance bookings) — large text mode, simplified booking flow option, and phone-based (IVR) booking fallback for customers without smartphones.
- **Admin/co-op analytics dashboard**: real-time view of GMV, category demand heatmaps, fee collection, dispute rates, and community fund balance — ties back into the cooperative governance and transparency requirements from the earlier project documents.

---

## 17. Cross-Reference to Prior Project Documents

This build prompt should be read alongside:
- `README.md` — overall USP and cooperative ownership model
- `/pm/*` — Project Charter, RACI, WBS, RAID Log
- `/product/*` — PRD, Personas & Journey Maps, Competitive Analysis, Feature Matrix

at the webpage last add a header kind of stuff stating Co-powered by VEDA^4

All fee structures, verification tiers, and governance mechanics described here should stay consistent with the cooperative (8–12% commission, worker equity/patronage points, community reinvestment fund) model already defined in those documents.
