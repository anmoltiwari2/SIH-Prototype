# Contributing to GullyGigs

Thank you for considering a contribution to GullyGigs — a cooperative platform, which means contributions can be technical **and** governance-related.

## Ways to Contribute

1. **Code** — bug fixes, features, performance, tests, documentation.
2. **Design** — UX flows, accessibility improvements, design system components.
3. **Product/Policy RFCs** — proposals that affect commission structure, verification rules, or governance mechanics must go through the RFC process below, since they affect co-op members directly.
4. **Community Verification Network** — non-technical contributors can help pilot the trust-verification process in their locality.

## Development Workflow

1. Fork the repository and clone your fork.
2. Create a feature branch: `git checkout -b feature/short-description`
3. Install dependencies: `npm install`
4. Make your changes, following the coding standards below.
5. Write or update tests for any behavior change.
6. Run the full test suite: `npm test`
7. Commit using [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat: add community verifier onboarding flow`
   - `fix: correct commission calculation rounding`
   - `docs: update API spec for booking-service`
8. Push your branch and open a Pull Request using `PULL_REQUEST_TEMPLATE.md`.

## Coding Standards

- **JavaScript/TypeScript**: ESLint + Prettier configs in repo root; run `npm run lint` before pushing.
- **Commits**: one logical change per commit; keep messages in imperative mood.
- **Tests**: minimum 80% coverage on new service code; unit tests required, integration tests strongly encouraged for API endpoints.
- **API changes**: must update the corresponding OpenAPI spec under `/docs/engineering/api-specs`.
- **Security-sensitive changes** (auth, payments, verification): require review from at least 2 maintainers.

## RFC Process (for Product/Governance Changes)

Because GullyGigs is a worker-owned cooperative, changes that affect **commission rates, ranking/matching algorithm logic, verification criteria, or dividend calculations** cannot be merged through normal code review alone:

1. Open an RFC issue using the `rfc` label, describing the change and its impact on members.
2. Allow a minimum 7-day comment period for co-op member feedback.
3. The change goes to a member vote per the quorum rules in `/docs/governance/bylaws.md`.
4. Only after approval can the implementing PR be merged.

## Pull Request Review

- At least 1 maintainer approval required for standard changes.
- At least 2 maintainer approvals for security/payment/auth-related changes.
- CI checks (lint, test, build) must pass before merge.
- PRs should be scoped narrowly — prefer several small PRs over one large one.

## Code of Conduct

Be respectful, assume good intent, and remember contributors include both engineers and non-technical co-op members. Harassment, discrimination, or exclusionary behavior will not be tolerated.

## Questions?

Open a discussion thread or reach out to the maintainers listed in `README.md`.
