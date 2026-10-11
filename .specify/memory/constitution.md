<!--
Sync Impact Report
- Version change: unversioned template → 1.0.0
- Modified principles: none (initial adoption)
- Added sections: Design System Constraints; Development Workflow and Quality Gates
- Removed sections: none
- Follow-up TODOs: TODO(RATIFICATION_DATE): original adoption date was not supplied.
-->
# Quran Reading Sanctuary Constitution

## Core Principles

### I. Design Tokens Are the Single Source of Truth

All visual values MUST originate from the approved design-token layer. The application MUST use
the Sacred Emerald Teal, Warm Antique Champagne Gold, Deep Forest Cypress, Deep Charcoal Olive,
and specified light and dark surfaces and borders. Components MUST consume named tokens rather
than duplicate literal values. This preserves the Serene Quranic Sanctuary identity and makes
theme changes consistent and auditable.

### II. Quranic Reading Takes Precedence

Quranic text MUST use Noto Serif, `dir="rtl"`, `line-height: 2.3`, and enabled `kern`, `calt`,
and `liga` font features. The reading column MUST be centered and no wider than 720px. Ayah
blocks MUST retain 32px bottom padding. UI and translation text MUST use Plus Jakarta Sans;
Ayah medallions MUST use Eastern Arabic numerals while UI indexes and time trackers MUST use
Western Arabic numerals. These rules protect readable, respectful Quran presentation.

### III. Accessibility Is Non-Negotiable

Every interactive control MUST provide a minimum 44 by 44 CSS-pixel target, keyboard access,
an accessible name, visible focus indication, and WCAG AAA contrast for text and meaningful UI
states. Directionality, language, active recitation state, and playback state MUST be exposed
semantically to assistive technology. Accessibility acceptance checks are required for every
new or changed interactive component.

### IV. Component States Are Consistent and Testable

Reusable UI components MUST be typed, modular React components with explicit state inputs.
Ayah medallions MUST render the specified layered 45-degree rounded-square Khatim Sulayman
form, gold inactive styling, Eastern Arabic number, and the gold-highlighted emerald-glow active
state. Active Ayah cards MUST use the soft emerald tint and 2px gold left border. Floating audio
controls MUST remain fixed at the bottom and expose their playback and timeline states. Shared
behavior prevents visual and accessibility drift across screens.

### V. Calm Performance and Motion

Visual effects MUST support, not obstruct, reading. The floating audio island MAY use its
specified 85% opacity and 16px backdrop blur only when content remains legible and controls
remain responsive; a usable opaque fallback MUST be provided when backdrop filtering is
unavailable or reduced transparency is requested. Animation and active-state glow MUST respect
user motion preferences. No visual effect may reduce the readability of Quranic text.

## Design System Constraints

The canonical palette is Primary `#0D5C46`, Secondary `#C5A059`, Secondary Highlight
`#E6C875`, Tertiary `#1E3B32`, Neutral `#1A2420`, and muted text `#3F4944`. Light mode uses
canvas `#F9FAF8`, surface `#FFFFFF`, and border `#E5EAE3`; dark mode uses canvas `#0A1A15`,
surface `#12231E`, and border `#1C332B`. Layout spacing MUST use a 4px grid.

Ayah cards MUST use soft borders and the defined active-recitation treatment. The floating audio
bar MUST be a bottom island with gold border and scrubber elements. Any variation requires a
documented accessibility and design review before adoption.

## Development Workflow and Quality Gates

Before implementation, work MUST identify the affected tokens, reading semantics, component
states, and accessibility acceptance criteria. Changes to shared tokens or reusable components
MUST include focused tests or documented manual verification for default, active, keyboard, RTL,
light-mode, and dark-mode states as applicable. Reviews MUST confirm token reuse, typed public
interfaces, contrast, target size, and the 720px reading-width constraint.

## Governance

This constitution supersedes conflicting project conventions for the Quran reading experience.
Amendments MUST state the affected principle or constraint, rationale, compatibility impact, and
required migration work. Maintainers MUST approve an amendment before it is merged.

Constitution versions use semantic versioning: MAJOR for removed or incompatible governance,
MINOR for new or materially expanded principles or sections, and PATCH for non-semantic
clarifications. Every implementation review MUST verify compliance with the Core Principles and
the relevant quality gates. Exceptions MUST be time-bounded, documented with rationale, and
approved by maintainers before release.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): original adoption date unknown |
**Last Amended**: 2026-09-20
