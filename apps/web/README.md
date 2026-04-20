# Event Package Builder - Frontend

A multi-step wizard that guides employers through selecting a provider, choosing a plan, configuring dynamic options and add-ons, reviewing pricing, and submitting an event package estimate.

Built with **React 19**, **TypeScript**, **Vite**, **TanStack Query**, and **shadcn/ui**.

---

## Getting Started

```bash
# From the monorepo root
npm install
npm run dev
```

The web app runs at `http://localhost:5173` and expects the API at `http://localhost:3002`.

---

## Production Build

```bash
# From the monorepo root
npm run build

This runs TypeScript type-checking (`tsc -b`) followed by `vite build`, producing an optimized bundle in `apps/web/dist/`.

To preview the production build locally:

```bash
npm run start --workspace=apps/api
npm run preview --workspace=apps/web
```

The preview server serves the built assets at `http://localhost:4173`.

For deployment, serve the `apps/web/dist/` directory with any static file server.

---

## Architecture Overview

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + TypeScript |
| Bundler | Vite |
| Server State | TanStack React Query |
| Local State | `useReducer` (wizard state machine) |
| UI Components | shadcn/ui (Radix primitives) |
| Styling | Tailwind CSS |
| HTTP Client | Fetch API with typed wrappers |

### Component Structure

```
src/
├── api/              # Typed API client (providers, plans, estimates)
├── components/
│   ├── ui/           # shadcn/ui primitives (Button, Card, Dialog, etc.)
│   ├── utils/        # ErrorBoundary, ErrorFallback
│   └── wizard/       # Main wizard flow
│       ├── Wizard.tsx           # Step router
│       ├── StepIndicator.tsx    # Progress bar
│       ├── useWizard.tsx        # Navigation logic
│       ├── wizardReducer.ts     # State machine (actions + state)
│       └── steps/
│           ├── selection/       # Step 1: Provider + Plan selection
│           ├── configuration/   # Step 2: Options, add-ons, pricing
│           ├── review/          # Step 3: Summary + submit
│           └── status/          # Step 4: Confirmation
├── hooks/            # React Query hooks (useProviders, usePlans, useEstimate)
├── lib/              # Utilities (formatCents, cn)
└── types/            # Shared TypeScript interfaces
```

### State Management

The wizard uses a **reducer + React Query** architecture:

- **`wizardReducer`** manages local UI state: current step, selected provider/plan, option selections, add-on selections, pricing snapshot, and finalisation result.
- **React Query** manages server state: providers list, plans list, and the current estimate, each with appropriate cache/stale times.
- **`useConfigurationSync`** bridges both layers with a debounced (300ms) sync that pushes local selections to the server via `PUT /estimate` whenever options or add-ons change.

---

## Decisions, Tradeoffs & Next Steps

### Key Decisions

1. **Reducer over global state library**: The wizard flow is self-contained and linear. A `useReducer` with explicit actions (`SET_OPTION`, `SWITCH_PLAN`, `SELECT_PLAN`, etc.) provides predictable state transitions without the overhead of Redux/Zustand. If the app grew to multiple independent features, a global store would be reconsidered.

2. **React Query for server state**: Separating server-state caching from UI state keeps concerns clean. Query invalidation on mutations, optimistic updates with rollback on `PUT /estimate`, and configurable stale times (30s for estimates, 5min for providers) give a responsive feel without over-fetching.

3. **Debounced sync instead of submit-on-change**: Firing a `PUT /estimate` on every radio click would flood the API. A 300ms debounce batches rapid changes into a single request. The tradeoff is a brief delay before pricing updates, which is acceptable for this use case.

4. **Adaptive option rendering**: Rather than a one-size-fits-all form, options are rendered based on their value count: multi-value options get radio groups, single-value options get an auto-selected badge, and zero-value (unknown) options get a warning fallback. This keeps the UI honest about what is actually configurable.

5. **shadcn/ui for primitives**: Radix-based components provide accessible defaults (keyboard navigation, focus trapping in dialogs, proper ARIA roles) out of the box, reducing the surface area for accessibility bugs.

### Tradeoffs

- **No persistent form state across sessions**: If the user closes the tab, local wizard state is lost. The server-side estimate persists, but local selections must be re-derived. With more time, syncing reducer state to `sessionStorage` or rehydrating from the estimate response would improve resilience.
- **No optimistic UI on finalise**: The finalise action waits for the server response before transitioning to step 4. An optimistic transition could feel snappier but risks showing a false "confirmed" state if the server rejects.
- **Single estimate assumption**: The current flow assumes one active estimate at a time (matching the API design). Multi-estimate support would require parameterised queries and a selection mechanism.

### Next Steps

- **Persist wizard state** to `sessionStorage` for tab-close resilience
- **Add end-to-end tests** with Playwright covering the full wizard flow
- **Add unit/integration tests** (see [Test Coverage](#test-coverage-future-development) section)
- **Improve focus management** on step transitions for better screen reader support
- **Add animation/transitions** between steps for a polished feel
- **Add plan comparison as a first-class feature** (currently behind a dialog)

---

## Ambiguous Scenarios - Decisions & Reasoning

### 1. Stale Pricing

**Scenario**: The user configures an estimate, steps away, and returns. Meanwhile, server-side prices have changed.

**Decision**: Detect and alert, don't silently update.

When options change, we capture a `localPricingSnapshot` of the current estimate pricing. On the next server response, we compare the snapshot total against the new total. If they differ, a prominent alert is displayed:

> *"Price Updated: The total changed from €5,000 to €5,500."*

This alert uses `aria-live="polite"` so screen readers announce the change. The user can review the updated breakdown before proceeding. We chose **transparency over silent correction** because price changes affect purchasing decisions, and surprising users at the review step would erode trust.

**Tradeoff**: We compare totals only, not line-item changes. A more granular diff ("base price changed, add-on X increased") would be more informative but adds complexity. With more time, a line-item diff would be the next improvement.

### 2. Partial Selection Preservation on Plan Switch

**Scenario**: User selects Plan A with `seating_type: reserved`, then switches to Plan B which has `seating_type` but with different allowed values.

**Decision**: Preserve compatible selections, warn about lost ones, and require confirmation.

When the user clicks "Switch Plan," a dialog opens showing available alternatives. Before confirming, we compute:
- **Compatible selections**: option codes that exist in the new plan with the same selected value still valid.
- **Lost selections**: options where the code doesn't exist or the selected value isn't in the new plan's allowed values.

If selections will be lost, an alert shows: *"N of your current selections will be cleared because they're not available in the new plan."* The user must explicitly confirm the switch.

**Reasoning**: Silently clearing everything is frustrating if 4 of 5 options are compatible. Silently preserving incompatible values would cause server-side validation errors. The warning strikes a balance: users keep what works and are informed about what doesn't.

### 3. Single-Value Options

**Scenario**: An option group has only one allowed value (e.g., `priority_level` with only `"1": Standard`).

**Decision**: Auto-select and display as a non-interactive badge labeled "(auto-selected)."

**Reasoning**: This approach is transparent ("you're getting Standard priority, it's the only option"). The required indicator is still shown to communicate it's a mandatory field, but no interaction is needed.

### 4. Unknown Option Codes

**Scenario**: The API returns an option code the UI doesn't have a friendly label for (e.g., `catering_license_tier`).

**Decision**: Degrade gracefully, never crash.

For **known codes**, we maintain a label map (`constants.ts`) that provides friendly names ("Seating Type," "Food Package") and value labels ("Reserved Seating," "Full Catering"). For **unknown codes**, the `formatOptionCode` helper converts underscores to spaces and title-cases the result: `catering_license_tier` → "Catering License Tier."

**Reasoning**: The fallback ensures new codes are still usable without a frontend deployment. The label map is an enhancement layer, not a requirement.

---

## Product Reasoning

### Information Hierarchy

The wizard uses progressive disclosure to prevent information overload:

1. **Step 1 (Selection)**: Provider cards surface the most decision-relevant info first: name, location, and logo. Plans show name, base price, and key constraints (approval required, minimum participants, lead time) as badges so users can compare at a glance.
2. **Step 2 (Configuration)**: Options are grouped by category with required fields well marked. The pricing sidebar stays visible alongside the form so users always see cost implications.
3. **Step 3 (Review)**: A clean summary of all selections with pricing breakdown. Blockers (validation errors) are surfaced as a destructive alert list above the submit button.
4. **Step 4 (Status)**: Minimal confirmation card with status and a "Start Over" action.

### Error Recovery

Error recovery follows the principle of **preserving user work**:

- **Network errors on `PUT /estimate`**: React Query's optimistic update rolls back the local cache on failure. The user's local selections in the reducer remain intact. An error alert is shown with a message, and the user can retry by changing any option (which re-triggers sync) or clicking submit again.
- **Render errors**: The `ErrorBoundary` wrapping the wizard catches unexpected crashes, shows a fallback card with a "Try Again" button, and logs the error to the console.
- **Empty/missing data**: Each component handles its empty state (skeleton loaders for loading, "No providers available" for empty, null-safe rendering for missing fields).

---

## Accessibility

Accessibility is treated as a first-class requirement throughout the application.

### Keyboard Navigation

- All interactive elements (buttons, radio inputs, checkboxes, dialog controls) are reachable via **Tab** and operable via **Enter/Space**.
- `RadioGroup` components (provider selector, option groups) support **Arrow key** navigation between options.
- Dialogs (plan switch, plan comparison) can be dismissed with **Escape** and trap focus while open.

### Screen Reader Support

- **ARIA live regions**: The pricing breakdown section uses `aria-live="polite"` to announce price changes as the user modifies selections. The stale pricing alert also uses `aria-live="polite"` to announce price drift.
- **Validation errors**: Required field errors use `role="alert"` for immediate screen reader announcement and are associated with their input via `aria-describedby`.
- **Decorative icons**: All icons (AlertTriangle, Clock, etc.) use `aria-hidden="true"` to prevent screen reader noise.
- **Screen-reader-only text**: Uses `sr-only` class for supplementary context (e.g., status badges in the step indicator).

### Form Semantics

- Option groups use `RadioGroup` with proper `Label` associations and `aria-required` attributes for required fields.
- Add-ons use `Checkbox` components with explicit `FieldLabel` wrappers.
- Required fields display a visual asterisk with `aria-hidden="true"`.
- Error messages are linked to inputs via `aria-describedby` with unique error IDs.

### Provider & Progress Indicators

- The provider selector uses `role="radiogroup"` with `aria-label="Select a provider"`.
- Each provider item has `aria-checked` to communicate selection state.
- The step indicator uses `aria-label="Progress"` and marks the current step with `aria-current="step"`.

### Testing Tools & Known Gaps

**Tools used**:
- Manual keyboard navigation testing across all steps
- Browser DevTools accessibility tree inspection
- Radix UI provides built-in WCAG compliance for Dialog, RadioGroup, and Checkbox primitives

**Known gaps**:
- Focus is not programmatically moved on step transitions (documented above as a next step)
- No automated accessibility testing suite is integrated yet. This would be added alongside the test coverage initiative
- Color contrast has not been audited with a dedicated tool; the shadcn/ui defaults are generally compliant but a formal audit is pending

---

## Test Coverage (Future Development)

The frontend does not currently include automated tests. This section outlines the testing strategy to be implemented as a priority next step.

### Planned Testing Layers

| Layer | Tool | Coverage Target |
|-------|------|-----------------|
| Unit Tests | Vitest + React Testing Library | Individual components, helpers, reducer logic |
| Integration Tests | Vitest + React Testing Library | Multi-component flows (wizard step transitions, API interactions) |
| End-to-End Tests | Playwright | Full user journeys from provider selection to finalisation |
| Accessibility Tests | axe-core + Vitest | Automated WCAG compliance checks on every component |

### Priority Test Cases

**Unit tests**:
- `wizardReducer`: Verify all action types produce correct state transitions (especially `SWITCH_PLAN` with compatible/incompatible selections)
- `findCompatibleSelections` / `findLostSelections`: Edge cases for plan switching logic
- `formatOptionCode` / `formatOptionLabel`: Fallback behavior for unknown codes
- `formatCents`: Currency formatting edge cases (zero, negative, different currencies)

**Integration tests**:
- Provider selection → plan list loading → plan selection → step transition
- Option changes → debounced sync → pricing update
- Plan switch dialog → compatibility warning → selection preservation
- Validation blockers → submit button disabled → blocker list displayed
- Error states: network failure → error alert → retry → recovery

**E2E tests**:
- Complete happy path: select provider → select plan → configure options → review → submit → status confirmation
- Plan switch mid-configuration with selection preservation
- Edge cases: empty provider, null logo, zero-price add-on, single-value option
- Stale pricing detection flow
