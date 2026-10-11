# Implementation Plan: Quran Reading Platform

**Branch**: `001-quran-reading-platform` | **Date**: 2026-09-20 | **Spec**: [spec.md](./spec.md)

## Summary

Replace the starter screen with a guest-first Quran reading platform. Ship a reviewed, versioned
Uthmani Hafs content bundle and one attributed English translation; implement Surah/Juz discovery,
reading, search, bookmarks, resume, and English/Arabic UI localization. Use browser-local guest
state; exclude authentication, synchronization, and runtime content APIs from the MVP.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19, modern evergreen browsers

**Primary Dependencies**: React 19 and Vite 8; add TypeScript, Vitest, React Testing Library, and
Playwright during implementation. Use native browser storage and Web Share/Clipboard fallbacks.

**Storage**: Versioned namespaced `localStorage` guest state containing canonical verse references,
reading position, and non-sensitive preferences. Quran content is immutable static data.

**Testing**: Vitest + React Testing Library for units/components; Playwright for keyboard, RTL,
mobile, and persistence workflows; manual token/contrast review.

**Target Platform**: Responsive web application on current Chrome, Edge, Firefox, and Safari;
minimum 320 CSS-pixel viewport and 400% zoom reflow.

**Project Type**: Single-page web application

**Performance Goals**: At least 90% of requested Surah/Juz opens usable within 3 seconds on a
typical mobile connection.

**Constraints**: Uthmani Hafs integrity; one attributed English translation; guest-only storage;
720px reader, 44px controls, AAA contrast, Arabic RTL and English LTR semantics; no backend.

**Scale/Scope**: 114 Surahs, 30 Juz, all verses, and one English translation; four stories and
19 functional requirements in the portfolio MVP.

## Constitution Check

| Gate | Status | Design response |
|---|---|---|
| Tokens are the visual source of truth | PASS | Define named theme tokens and consume them in all feature components. |
| Quranic reading rules are preserved | PASS | Arabic uses `lang="ar" dir="rtl"`, Noto Serif, 2.3 line-height, Eastern numerals, and a 720px column. |
| Accessibility is non-negotiable | PASS | Keyboard operation, 44px targets, visible focus, semantic status messages, and contrast checks are acceptance gates. |
| Components have explicit states | PASS | Reader, card, medallion, search, and persistence states are typed with loading, empty, error, active, and disabled variants. |
| Motion supports reading | PASS | Glass and motion enhancements have opaque/reduced-motion fallbacks and never obscure Quran text. |

**Post-design re-check**: PASS. Static content, canonical verse identity, logical CSS, and the UI
contract satisfy every constitution gate without an exception.

## Project Structure

### Documentation (this feature)

```text
specs/001-quran-reading-platform/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/ui-contracts.md
└── tasks.md                    # Created later by speckit-tasks
```

### Source Code (repository root)

```text
src/
├── app/                         # Shell, routes, providers, localization
├── components/                  # Shared UI and Quran reading components
├── features/                    # Home, browser, reader, search, bookmarks, settings
├── content/                     # Bundle, manifest, content validators
├── lib/                         # Formatting, normalization, storage, sharing
├── styles/                      # Theme tokens and responsive styles
├── types/                       # Domain and UI contracts
└── main.tsx

tests/
├── unit/
├── integration/
├── contract/
└── e2e/
```

**Structure Decision**: Keep the existing single Vite application. Migrate starter entry points to
TypeScript; organize product behavior by feature while isolating immutable content, shared UI, and
typed domain contracts.

## Complexity Tracking

No constitution violations or complexity exceptions require justification.
