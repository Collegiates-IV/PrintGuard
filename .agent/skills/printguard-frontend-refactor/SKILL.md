---
name: printguard-frontend-refactor
description: Refactor and implement the PrintGuard frontend as an industrial additive-manufacturing monitoring interface. Use this for frontend planning or coding tasks involving dashboard layout, page hierarchy, spacing, color palette, component refactors, fleet management, alerts, history, settings, analytics, design-system work, or preserving and improving the existing UI without restarting it.
---

# PrintGuard Frontend Refactor Skill

## Mission

Refactor the existing PrintGuard frontend into a calm, professional, industrial-grade monitoring tool for additive manufacturing labs and print farms.

This is **not** a greenfield redesign.
Preserve the existing product’s routes, page structure, reusable components, core features, and mental model wherever possible.
Prefer **incremental improvement, reuse, and refinement** over unnecessary rewrites.
Do not “start over” unless a specific section is structurally limiting the redesign and truly needs replacement.

The result should feel like software used daily by lab managers, engineers, and printer monitoring staff:
- fast to scan
- low cognitive load
- highly actionable
- spatially organized
- visually restrained
- trustworthy during incidents
- easy to use repeatedly without fatigue

## Read First

Before planning or editing, inspect and understand the current frontend.

Read, in this order when available:
1. `FRONTEND.md`
2. `SKILLS.md`
3. `CLAUDE.md`
4. `README.md`
5. any design tokens, theme files, shared UI primitives, route definitions, layout files, and page components
6. any user-provided plan or prompt for the current task

If there is a conflict between generic frontend habits and project-specific instructions, follow the project-specific instructions.

## Core Product Truths

PrintGuard is not a generic SaaS dashboard.
It is an **industrial monitoring and intervention system** for real 3D printers, real failures, real waste prevention, and real lab operations.

The frontend must reflect:
- multi-printer monitoring
- AI-based failure detection
- quick anomaly recognition
- operator confidence and trust
- clear separation between live operational status and longer-horizon analytics
- real-world daily use by professionals

## Non-Negotiable Constraints

1. Preserve the current page set unless explicitly told otherwise:
   - Dashboard
   - Alerts
   - History
   - Fleet
   - Settings

2. Add a dedicated analytics-style page for non-daily metrics:
   - Analytics
   - Insights
   - Operations Insights
   - Performance

3. Keep daily-use operational metrics on the Dashboard:
   - Active
   - Paused
   - Warning
   - Failure / incident count
   - recent issues
   - fleet status
   - connectivity / system health

4. Move non-daily metrics off the Dashboard and into the Analytics page:
   - filament saved
   - time saved
   - waste prevented
   - historical utilization
   - trend reporting
   - efficiency metrics

5. Do not reintroduce those secondary metrics as top-priority Dashboard KPIs.

6. Do not overuse red.
   Red is reserved for critical failure, severe interruption, or truly urgent states.

7. Do not make the interface flashy, trendy, neon-heavy, or consumer-app-like.

8. Do not remove useful information just to look minimal.
   Reduce overload by improving hierarchy, grouping, spacing, and page ownership.

## Design Philosophy

Design for **3-second understanding**.

An operator should be able to open a page and quickly answer:
- what is healthy?
- what needs attention?
- what should I click first?
- what action can I take immediately?

Use **progressive disclosure**:
- overview pages show operational summaries and next actions
- detail pages show richer context and controls
- diagnostics and analytics live where they belong

Healthy systems should recede visually.
Abnormal states should stand out clearly.

## Visual System

Use an industrial, desaturated, physically grounded visual language.

### Palette rules

Default interface:
- calm neutrals
- soft warm gray / concrete gray / graphite
- subtle surfaces and borders
- dark text, never harsh black on harsh white
- low-noise backgrounds

State colors:
- healthy / nominal: neutral baseline, optionally subtle green support
- paused / manual hold: muted steel blue
- warning: muted amber / sulfur / industrial yellow
- failure / critical: fired-clay / muted industrial red
- offline / disconnected: dark neutral with explicit labeling, escalate only when urgent

### Styling rules

- use restrained borders and light elevation
- avoid heavy glows
- avoid bright gradients
- avoid overly rounded playful cards
- avoid saturated badges everywhere
- emphasize state only when meaningful
- section spacing should be generous enough to reduce overload
- intra-section spacing can be tighter and consistent

## Typography and Density

- prioritize legibility over personality
- use one strong UI type system consistently
- use tabular numerals where values align or update
- keep headings useful and structured, not oversized
- make tables and metrics stable and scan-friendly

## Navigation Rules

Keep the persistent left sidebar as the primary app navigation.

For longer pages, add a compact sticky in-page section navigation bar below the page header.
This bar should:
- scroll to sections
- highlight the active section
- improve quick lookup
- remain visually compact

Use this on pages like:
- Dashboard
- Settings
- Analytics / Operations Insights

For shorter or more operational pages, use a sticky action/filter bar instead of forced section anchors.
Use this on pages like:
- Fleet
- History
- Alerts (if section anchors are not useful)

## Page-by-Page Requirements

### Dashboard

Dashboard is for **live operations**, not secondary reporting.

It should answer:
- what is happening now?
- what needs action?
- which printer should I inspect first?

Required structure:
1. page header
2. sticky in-page navigation with sections such as:
   - Overview
   - Attention Needed
   - Fleet Status
   - Recent Activity
   - Connectivity
3. operational metric tiles, each in its own clearly separated panel:
   - Active
   - Paused
   - Warnings
   - Failures / incidents
4. attention-needed section for actionable issues
5. calmer fleet snapshot section
6. recent activity / detections section
7. connectivity / backend / camera / serial health summary

Dashboard rules:
- separate each major section vertically
- do not create a wall of equally loud cards
- healthy printers should not visually compete with failing printers
- keep savings/efficiency reporting off this page

### Alerts

Alerts should feel like an incident review and response workspace.

Prefer an action-oriented structure:
- active warnings
- confirmed failures
- resolved incidents
- selected incident detail

For each alert show:
- printer
- location / lab if available
- failure type
- timestamp
- confidence
- status
- quick action options

For selected incident detail, emphasize explainability:
- annotated frame or visual evidence if available
- confidence progression if available
- what triggered the intervention
- what action was taken
- next operator actions

This page should build trust, not feel like a vague log.

### History

History is for lookup, filtering, comparison, and review.

Use:
- sticky top filter/action bar
- search
- date range filter
- printer filter
- status filter
- failure-type filter
- sortable columns

Keep it structured and calm.
Do not overload rows with visual noise.
Use row expansion or side drawers for deeper detail.

### Fleet

Fleet is the correct place for quick printer administration.

This page should support:
- quick editing of printer names
- quick editing of location / lab / notes / labels
- camera assignment and basic metadata editing if present
- clear display of current machine state
- camera health
- serial / connection health
- last heartbeat / last frame / last seen

Implement quick edit through a drawer, side panel, or lightweight modal so operators do not lose context.

Fleet should feel like operational administration, not analytics.

### Settings

Settings should be structured and enterprise-like.

Use section-based organization such as:
- Profile
- Notifications
- Lab Preferences
- Alert Thresholds
- AI / detection behavior if applicable
- Defaults / system behavior

Use sticky in-page navigation here.
Avoid random card piles.
Keep form layouts clean and consistent.

### Analytics / Operations Insights

Create a separate page for longer-horizon reporting and performance review.

This page owns:
- filament saved
- time saved
- waste prevented
- utilization
- failure trends
- fleet performance comparisons
- lab comparisons
- historical efficiency metrics

This page is not for triage.
It should feel analytical and review-oriented, not urgent.

Use sticky in-page navigation with sections such as:
- Savings
- Utilization
- Failure Trends
- Fleet Performance
- Comparisons

## Component Rules

Build or refactor toward a consistent component system.

Key reusable components:
- status badge
- metric tile
- section header
- sticky section nav
- sticky action/filter bar
- printer card / printer row
- incident row
- quick edit drawer
- searchable / filterable table
- connection health indicator
- warning banner
- empty state
- contextual side panel / detail drawer

All components must share:
- spacing rules
- border rules
- radius rules
- typography scale
- state color semantics

## Preservation Requirement

Preserve the existing routes, page structure, and reusable components wherever possible.

This refactor should build on the current frontend rather than restart it.
Avoid “starting over” unless a specific section is structurally limiting the redesign and truly needs replacement.
Prefer incremental improvement, reuse, and refinement over unnecessary rewrites.

The goal is to evolve the current PrintGuard UI into a more industrial, spacious, and operationally mature system without breaking:
- the existing mental model
- the route structure
- the working feature flow
- the recognizable product shell

If you replace a route, major component, or page structure, explain why the existing one is insufficient.

## Working Method

When invoked for **planning**:
1. inspect the current codebase first
2. identify existing routes, layouts, shared components, theme files, and design-system primitives
3. map the user’s requested changes to the current code, not to an imagined rewrite
4. produce a phased implementation plan with:
   - current-state findings
   - what to preserve
   - what to refactor
   - what to add
   - affected files/components/routes
   - risks and dependencies
   - validation criteria

When invoked for **implementation**:
1. make the smallest high-leverage changes first
2. refactor shared tokens/components before page-by-page duplication
3. preserve working code whenever practical
4. keep changes coherent and scoped
5. after changes, self-review for:
   - route preservation
   - component reuse
   - status-color correctness
   - spacing and hierarchy
   - readability
   - accessibility
   - responsiveness
   - consistency across pages

## Priority Order

Preferred execution order:
1. audit current frontend structure
2. establish theme and design tokens
3. refactor shared UI primitives
4. refactor app shell and page headers
5. refactor Dashboard
6. refactor Fleet and Alerts
7. refactor History and Settings
8. add Analytics / Operations Insights page
9. polish consistency and quality checks

## Do Not

- do not start from scratch by default
- do not turn the whole app red
- do not make healthy states visually loud
- do not put filament saved and time saved back on the Dashboard as top-level live KPIs
- do not force anchor nav on pages where a sticky filter/action bar is better
- do not make the UI feel like a generic startup SaaS product
- do not sacrifice usability for aesthetics
- do not remove useful operational information just to reduce visual density
- do not introduce random spacing, inconsistent card styles, or ad hoc component variants
- do not make changes without grounding them in the current code structure

## Definition of Success

The refactor is successful when:
- the app still clearly feels like PrintGuard
- the current UI is preserved and upgraded rather than replaced
- the palette feels industrial, restrained, and credible
- the Dashboard is easier to scan and focused on live operations
- analytics/savings metrics live on their own page
- sections breathe more and feel less congested
- long pages support fast section jumping
- Fleet supports quick in-context printer editing
- alerts feel explainable and actionable
- the interface feels trustworthy for daily professional use
- the result is easier to navigate like second nature