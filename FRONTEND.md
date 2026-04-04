
## PrintGuard Frontend Source of Truth

This file defines the frontend product intent, page ownership, visual direction, interaction rules, and implementation constraints for PrintGuard.

Use this file as the primary project-specific frontend guide before planning, refactoring, or building UI work.

This frontend is for an industrial additive-manufacturing monitoring system, not a generic startup dashboard.
PrintGuard is used to monitor multiple 3D printers and camera feeds, detect failures such as spaghetti, warping, stringing, and detachment, and support fast operator intervention with minimal cognitive load.

The UI must feel credible for:
- HBCU makerspaces
- engineering lab managers
- technician/operators
- small print farms
- industrial monitoring workflows

The frontend must support daily repeated use without fatigue.

---

## Product Intent

PrintGuard exists to help operators:
- see fleet health quickly
- detect failures early
- trust the system’s actions
- intervene fast when needed
- manage many printers without overload
- review history and performance without cluttering daily operations

The interface should feel:
- calm by default
- serious and industrial
- operationally trustworthy
- easy to scan in seconds
- familiar to engineers and lab supervisors
- spacious without wasting screen real estate

This is not a greenfield redesign.
Preserve the existing frontend routes, page flow, core features, and recognizable product shell wherever possible.
Prefer refinement over replacement.

---

## Preserve What Already Works

Do not start over unless a specific section is structurally limiting progress.

Preserve where possible:
- current route structure
- current core page set
- current mental model
- current feature flow
- reusable components that already work
- existing page purposes

This project is an industrialization/refinement pass, not a total reinvention.

If replacing a major section, explain:
1. what currently limits the design
2. why reuse is not sufficient
3. what the replacement improves

---

## Core Frontend Priorities

### 1. Live operations come first
The main dashboard is for real-time status and triage.
It is not the place for secondary reporting.

### 2. Low cognitive load
Operators should not need to hunt for meaning.
The interface should communicate:
- what is healthy
- what needs attention
- what is critical
- what action should happen next

### 3. Progressive disclosure
Overview pages show summary + next action.
Detail pages show deeper context.
Analytics and longer-horizon reporting live on their own page.

### 4. Status-driven visual hierarchy
Healthy/default states should recede visually.
Warnings and failures should stand out clearly.

### 5. Fast navigation
The UI should support quick lookup, section jumping, and in-context actions.

---

## Required Pages

Keep these pages:
- Dashboard
- Alerts
- History
- Fleet
- Settings

Add this page:
- Analytics
  - acceptable label alternatives: Insights, Operations Insights, Performance

---

## Page Ownership Rules

### Dashboard owns:
- active printers
- paused printers
- warning printers
- failure / incident count
- immediate issues needing attention
- fleet snapshot
- recent activity
- backend / camera / serial summary
- fast entry into triage workflows

### Alerts owns:
- incident review
- active warnings
- confirmed failures
- explainable alert detail
- resolution actions
- false-positive handling if available

### History owns:
- lookup
- filtering
- sorting
- comparison
- past incidents / jobs / outcomes
- review workflows

### Fleet owns:
- printer administration
- quick editing of printer metadata
- printer naming
- location/lab assignment
- device/camera associations
- connection health visibility
- quick monitor entry

### Settings owns:
- account/profile
- alert preferences
- lab preferences
- thresholds/defaults
- system behavior configuration

### Analytics owns:
- filament saved
- time saved
- waste prevented
- utilization trends
- fleet performance
- lab comparisons
- historical efficiency reporting

Do not place filament saved or time saved back on the Dashboard as top-priority live KPIs.

---

## Dashboard Rules

The Dashboard must answer this immediately:
- What is happening now?
- What needs action?
- Which printer should I inspect first?

### Required dashboard section order
1. Page header
2. Sticky in-page section nav
3. Operational overview metrics
4. Attention Needed
5. Fleet Status
6. Recent Activity
7. Connectivity / System Health

### Dashboard section details

#### Page header
Should include:
- page title
- optional lab/location context
- global system status if important
- lightweight context, not visual clutter

#### Sticky in-page section nav
Use a compact sticky bar below the header.
It should jump to sections like:
- Overview
- Attention Needed
- Fleet Status
- Recent Activity
- Connectivity

It should:
- stay compact
- support smooth scroll
- highlight active section
- help operators move quickly without extra searching

#### Operational overview metrics
These should be separate, clearly spaced metric tiles:
- Active
- Paused
- Warnings
- Failures / Incidents

Each metric gets its own sectioned tile.
Do not crowd multiple meanings into one card.
Do not include analytics-style savings metrics here.

#### Attention Needed
This section should surface the most important current problems.
Examples:
- confirmed failures
- camera offline
- serial disconnect
- printers paused by system
- unresolved incidents

This section should be more visually prominent than standard healthy fleet tiles.

#### Fleet Status
This should show a calmer overview of printers.
Healthy printers must not compete visually with unhealthy ones.

Each printer item should support:
- printer name
- current state
- current job if available
- last seen / last frame
- quick monitor access
- issue label if relevant
- quick actions if appropriate

#### Recent Activity
A lightweight feed or structured list of:
- recent detections
- recent pauses
- recent clears/resolutions
- notable backend/device events

#### Connectivity / System Health
Summarize:
- backend state
- camera health summary
- serial/device communication summary
- anything important to trust in the system pipeline

Because PrintGuard depends on local inference, multi-camera feeds, and direct serial control, the frontend must surface enough system health to make the interface feel trustworthy and operationally real.

---

## Alerts Page Rules

The Alerts page is an incident-response page, not a generic log.

Preferred structure:
1. Header
2. Sticky actions/filter bar or section nav
3. Active Warnings
4. Confirmed Failures
5. Resolved Incidents
6. Selected Incident Detail

Each alert item should ideally show:
- printer
- lab/location
- failure type
- timestamp
- confidence if available
- resolution state
- quick action access

Selected incident detail should emphasize explainability:
- visual evidence / annotated frame if available
- what was detected
- confidence progression if available
- what action the system took
- what the operator can do next

If the system supports false-positive review, keep it frictionless.

The page should help build trust in AI decisions, not obscure them.

---

## History Page Rules

The History page is for review, lookup, and comparison.

Use:
- sticky filter/action bar
- search
- date range filter
- printer filter
- status filter
- failure-type filter
- sortable table columns

Keep rows clean and highly legible.
Use muted status styling.
Do not overload the table with oversized colorful badges.

Use row expansion, side drawers, or detail panels for deeper context rather than stuffing every column with extra data.

---

## Fleet Page Rules

Fleet is the correct page for quick editing of printer identity and configuration-related information.

This is where users should be able to quickly update:
- printer display name
- location / lab
- labels or notes
- machine type/model
- camera assignment if applicable
- operational metadata that makes sense in context

Quick edit must be lightweight and in-context:
- side drawer preferred
- modal acceptable if simple
- avoid full-page detours for minor edits

Fleet should also expose operationally important hardware health:
- camera health
- serial/device health
- last heartbeat
- last frame / last seen
- state
- monitor/open actions

This page should feel like fleet administration for a real operations environment.

---

## Settings Page Rules

Settings should feel structured and enterprise-like.

Recommended sections:
- Profile
- Notifications
- Lab Preferences
- Alert Thresholds
- Detection Defaults
- System Defaults

Use compact sticky in-page section navigation.

Avoid:
- random isolated cards
- inconsistent widths
- oversized empty sections
- settings spread across too many unrelated layouts

---

## Analytics Page Rules

Analytics is where non-daily metrics live.

This page owns:
- filament saved
- time saved
- waste prevented
- utilization
- failure trends
- fleet performance
- comparison across labs or printer groups
- historical operational reporting

This page should feel more reflective and analytical than urgent.

Recommended section nav:
- Savings
- Utilization
- Failure Trends
- Fleet Performance
- Comparisons

Do not let this page’s metrics leak back into the live Dashboard hierarchy.

---

## Visual Direction

The visual language should feel industrial, desaturated, and physically grounded.

### Default visual behavior
Healthy/default UI should be calm and mostly neutral.
The operator should not feel visually shouted at when everything is normal.

### Status emphasis behavior
Only abnormal situations should gain strong visual attention.

### General palette direction
Use:
- warm/light industrial neutrals
- concrete-like surfaces
- soft graphite text
- restrained borders
- one muted accent for interactive controls

Avoid:
- bright neon palettes
- startup-style glossy SaaS colors
- red as the brand color
- every card competing for attention

### Status colors
Use status colors semantically:
- healthy / normal: muted neutral, optional subtle green support
- paused: muted steel blue
- warning: muted amber / sulfur
- failure / critical: fired clay / muted industrial red
- offline / disconnected: dark neutral with strong label, escalate to red when urgently actionable

Healthy printers should not all be visually “active.”
Abnormal printers should break the visual calm.

---

## Typography

Use a clean, screen-legible, professional type system.

Rules:
- prioritize readability over personality
- keep headings strong but not oversized
- use tabular numerals for aligned metrics/tables
- keep labels concise
- support dense data without visual jitter

---

## Spacing and Density

The UI should feel spacious, but not empty.

The problem to solve is not “make everything huge.”
The problem to solve is “reduce content overload and competing emphasis.”

### Spacing rules
- use a consistent spacing scale
- sections should have more breathing room between them
- components inside a section can be tighter
- separate major page regions clearly
- avoid stacking several equally loud sections without visual reset

### Density rules
- preserve enough data density for operational scanning
- do not waste screen space with giant decorative padding
- design for practical use on real work monitors
- favor structured grouping over excessive whitespace

---

## Navigation Rules

### Global navigation
Use the persistent left sidebar as the main navigation.
Keep it stable and predictable.

### Page-level navigation
For longer pages, include a small sticky section bar below the page header.
This is required where it improves quick lookup.

Use section nav on:
- Dashboard
- Settings
- Analytics

For shorter/operational pages, use a sticky actions/filter bar instead of forced anchor navigation.

Prefer action/filter bar on:
- History
- Fleet
- Alerts when more useful than section anchors

---

## Component Standards

Refactor toward a shared component language.

Core reusable components should include:
- status badge
- metric tile
- section header
- sticky section nav
- sticky action/filter bar
- printer row/card
- incident row
- quick edit drawer
- searchable/filterable table
- connection health indicator
- empty state
- warning banner
- contextual detail drawer/panel

All shared components should follow the same:
- spacing system
- border treatment
- radius treatment
- shadow/elevation restraint
- typography scale
- color semantics

Do not introduce many one-off variants unless there is a strong reason.

---

## State and Status Logic

Status styling should reflect real meaning.

### Healthy / nominal
- quiet
- neutral
- minimal emphasis

### Paused
- clear but not alarming
- muted steel/blue treatment

### Warning
- noticeable but not as strong as critical
- muted amber/yellow

### Failure / critical
- strongest emphasis
- fired-clay / muted red
- use text + icon + color together

### Offline / disconnected
- clear and explicit
- may use dark neutral + strong wording
- escalate visually if it blocks monitoring/intervention

Do not rely on color alone for critical meaning.
Pair critical states with:
- icon
- label
- clear wording

---

## Explainability and Trust

Where AI decisions are shown, the UI should help the operator trust the system.

Prefer to show:
- what was detected
- where it was detected
- why the system acted
- what action was taken
- what the operator can do now

If available, support:
- annotated frames
- confidence progressions
- action logs
- clear incident state

The interface should reduce “black box” anxiety.

---

## Hardware and Monitoring Trust Signals

PrintGuard is not just a software dashboard.
It is tied to:
- cameras
- inference
- serial control
- physical printers

The frontend should expose enough trust signals that the operator knows:
- the camera feed is healthy
- the system is still seeing frames
- the backend is live
- the device link is healthy
- the action pipeline is working

Connection or sensor-health indicators should feel useful, not noisy.

---

## Accessibility and Usability Rules

The frontend must be accessible and practical in bright lab environments and prolonged use.

Requirements:
- strong text contrast
- clear hierarchy
- labels that do not rely only on color
- keyboard-friendly interactions where possible
- predictable focus behavior
- readable table densities
- no tiny critical controls
- no ambiguous alert meaning

Critical alerts must be understandable through:
- wording
- iconography
- color
- structure

---

## Implementation Preferences

When refactoring:
1. audit current frontend structure first
2. identify existing reusable components before adding new ones
3. refactor shared primitives/tokens first
4. preserve working route structure
5. avoid unnecessary rewrites
6. move metrics to the correct page instead of stuffing more onto Dashboard
7. improve hierarchy before adding new complexity
8. keep code changes coherent and reusable

Preferred sequence:
1. theme/tokens
2. shared UI primitives
3. app shell/page headers
4. Dashboard
5. Fleet
6. Alerts
7. History
8. Settings
9. Analytics page
10. consistency polish

---

## Do Not

- do not restart the frontend from scratch by default
- do not use red as the dominant product color
- do not make healthy states loud
- do not crowd Dashboard with analytics reporting
- do not remove operationally useful information just to look minimal
- do not turn every page into a wall of cards
- do not create random one-off styling patterns
- do not force page section nav where a filter/action bar is better
- do not make the interface feel like a class project or generic startup SaaS
- do not ignore the existing mental model users already understand

---

## Definition of Success

The frontend work is successful when:
- the product still clearly feels like PrintGuard
- the current routes and mental model are preserved
- the UI feels industrial, calm, and credible
- the Dashboard is easier to scan and focused on daily operations
- filament/time saved are on Analytics, not competing with live KPIs
- sections breathe more and feel less congested
- quick lookup/navigation feels natural
- Fleet supports in-context printer editing
- Alerts feel explainable and actionable
- healthy states recede and abnormal states stand out
- the interface feels like something a lab manager or plant supervisor would trust daily