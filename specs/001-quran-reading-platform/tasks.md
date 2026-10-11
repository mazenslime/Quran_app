---
description: "Implementation tasks for Quran Reading Platform"
---

# Tasks: Quran Reading Platform

**Input**: Design documents from `/specs/001-quran-reading-platform/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-contracts.md,
quickstart.md

**Tests**: Test tasks are included because the plan and constitution require focused verification
of shared components, RTL, keyboard, persistence, and responsive states.

**Organization**: Tasks are grouped by user story so each increment remains independently testable.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Convert the starter project into the planned typed, testable application foundation.

- [X] T001 Update `package.json` and `package-lock.json` with TypeScript, Vitest, React Testing Library, and Playwright dependencies and scripts.
- [X] T002 [P] Create TypeScript and test configuration in `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`, and `playwright.config.ts`.
- [X] T003 [P] Create the planned directories in `src/app/`, `src/components/`, `src/content/`, `src/features/`, `src/lib/`, `src/styles/`, `src/types/`, and `tests/`.
- [X] T004 Migrate the entry point from `src/main.jsx` to `src/main.tsx` and replace `src/App.jsx` with typed application-shell entry points.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish canonical content, state, visual tokens, and accessibility behavior that all stories require.

**⚠️ CRITICAL**: Complete this phase before beginning user-story implementation.

- [X] T005 Create domain types in `src/types/quran.ts` and `src/types/guest-state.ts` for `verseKey`, Surah, Juz, Verse, Translation, Bookmark, Reading Position, and User Preference.
- [X] T006 Create the versioned content manifest and approved Uthmani Hafs/English content bundle in `src/content/manifest.ts` and `src/content/quran-bundle.ts`; record source, licence, attribution, retrieval date, and hash.
- [X] T007 Implement bundle validation in `src/content/validate-content.ts`, enforcing `number` as "Integer, unique, 1–114", Juz `number` as "Integer, unique, 1–30", unique `{surahNumber}:{ayahNumber}` verse keys, and Surah verse-count agreement.
- [X] T008 [P] Implement content selectors and canonical verse-key navigation in `src/content/selectors.ts`, including Juz `startVerseKey`, inclusive ranges, adjacent verses, and unavailable-content recovery.
- [X] T009 [P] Implement Arabic search normalization in `src/lib/arabic-normalization.ts` and search-result types in `src/types/search.ts`; remove diacritics and normalize common variants only for matching.
- [X] T010 Implement validated guest-state persistence in `src/lib/guest-storage.ts` using `quran-reader:guest-state:v1`; enforce "Unique valid verse keys", `locale` "`en` or `ar`", `theme` "`light`, `dark`, or `system`", and invalid-position fallback to `1:1`.
- [X] T011 Implement application state, locale/direction, theme, live-status, and storage-error providers in `src/app/AppProviders.tsx` and `src/app/app-state.tsx`.
- [X] T012 Create tokenized global styling and accessible primitives in `src/styles/tokens.css`, `src/styles/global.css`, `src/components/ui/Button.tsx`, `src/components/ui/SkipLink.tsx`, and `src/components/ui/StatusMessage.tsx` with 44px targets, visible focus, and AAA token pairs.

**Checkpoint**: Canonical data, persistence, and shared accessibility infrastructure are ready.

---

## Phase 3: User Story 1 - Find and Open Quran Content (Priority: P1) 🎯 MVP

**Goal**: Let a visitor browse all Surahs/Juz in supported orders and open the selected location.

**Independent Test**: Locate any of 114 Surahs, inspect metadata, change browse order, search a
Surah name/number, and open a Surah or Juz without a personal account.

- [X] T013 [P] [US1] Add content-selector unit tests in `tests/unit/content/selectors.test.ts` for valid/invalid verse keys, 114 Surahs, 30 Juz, Juz start positions, and browse orders.
- [X] T014 [P] [US1] Add browser-navigation contract tests in `tests/contract/quran-browser.contract.test.tsx` for Surah, Juz, and invalid-content recovery in `contracts/ui-contracts.md`.
- [X] T015 [US1] Implement route/location state and Quran-browser navigation in `src/app/routes.tsx` and `src/features/quran-browser/quran-navigation.ts`.
- [X] T016 [P] [US1] Implement Surah list, metadata, name/number filtering, and Mushaf/Juz/revelation selectors in `src/features/quran-browser/SurahList.tsx` and `src/features/quran-browser/surah-list.css`.
- [X] T017 [P] [US1] Implement Juz list and range summary in `src/features/quran-browser/JuzList.tsx` and `src/features/quran-browser/juz-list.css` using valid `startVerseKey` values.
- [X] T018 [US1] Compose the Quran browser screen and accessible unavailable-content/empty states in `src/features/quran-browser/QuranBrowserPage.tsx`.
- [X] T019 [US1] Add end-to-end browse/open coverage in `tests/e2e/quran-browser.spec.ts` for every browse order, Surah open, Juz open, and keyboard navigation.

**Checkpoint**: User Story 1 is independently usable and testable.

---

## Phase 4: User Story 2 - Read and Navigate Verses (Priority: P1)

**Goal**: Deliver a comfortable, configurable Quran reading experience with direct verse navigation.

**Independent Test**: Open a Surah, navigate directly and sequentially among verses, change reader
settings, and verify Arabic/English semantics without relying on personal data.

- [X] T020 [P] [US2] Add reader component tests in `tests/integration/reader/ReaderPage.test.tsx` covering verse order, direct navigation, RTL/LTR semantics, settings, and unavailable translation.
- [X] T021 [P] [US2] Add visual/accessibility tests in `tests/contract/reader-accessibility.contract.test.tsx` for 720px width, 4px grid, 32px Ayah spacing, 44px controls, focus, and text direction.
- [X] T022 [P] [US2] Implement Quranic typography, theme, and responsive reader styles in `src/styles/reader.css` and `src/styles/themes.css` using named tokens only.
- [X] T023 [P] [US2] Implement typed Ayah medallion and Ayah card states in `src/components/quran/AyahMedallion.tsx`, `src/components/quran/AyahCard.tsx`, and `src/components/quran/ayah-card.css`.
- [X] T024 [US2] Implement the reader page, adjacent/direct navigation, and semantic verse order in `src/features/reader/ReaderPage.tsx` and `src/features/reader/reader-navigation.ts`.
- [X] T025 [US2] Implement reader settings for text size, translation visibility, light/dark/system theme, and English/Arabic interface locale in `src/features/settings/ReaderSettings.tsx`.
- [X] T026 [US2] Integrate location state with the reader and browser in `src/app/App.tsx` and `src/app/routes.tsx`.
- [X] T027 [US2] Add end-to-end reader coverage in `tests/e2e/reader.spec.ts` for direct/adjacent navigation, translation visibility, theme, RTL, 320px, and 400% zoom reflow.

**Checkpoint**: User Story 2 is independently usable by opening a known reader location.

---

## Phase 5: User Story 3 - Search and Examine a Verse (Priority: P1)

**Goal**: Let visitors find Arabic text, the English translation, and Surah identifiers, then open
and act on a matching verse.

**Independent Test**: Submit Arabic with/without diacritics, English text, or a Surah identifier;
open a highlighted result; and copy, share, or bookmark the chosen verse.

- [X] T028 [P] [US3] Add normalization/search unit tests in `tests/unit/search/quran-search.test.ts` for Arabic variants, English matching, Surah identifiers, highlights, and no-result retention.
- [X] T029 [P] [US3] Add search/action contract tests in `tests/contract/search-and-actions.contract.test.tsx` for empty query, announcements, stale result recovery, copy, and share fallback.
- [X] T030 [US3] Implement indexed bundle search and safe highlight-range derivation in `src/features/search/quran-search.ts`, enforcing match scopes `arabic`, `english`, `surah-name`, and `surah-number`.
- [X] T031 [US3] Implement accessible search form, result list, query retention, result announcements, and no-results state in `src/features/search/SearchPage.tsx` and `src/features/search/search.css`.
- [X] T032 [P] [US3] Implement copy/share fallbacks and verse-action state in `src/lib/verse-actions.ts` and `src/components/quran/VerseActions.tsx`.
- [X] T033 [US3] Integrate result navigation and verse actions with `src/features/reader/ReaderPage.tsx` and `src/app/routes.tsx`.
- [X] T034 [US3] Add end-to-end search/action coverage in `tests/e2e/search-and-actions.spec.ts` for Arabic variants, English, Surah IDs, keyboard results, no results, copy, and share fallback.

**Checkpoint**: User Story 3 is independently usable from the Search route.

---

## Phase 6: User Story 4 - Resume and Save Reading (Priority: P2)

**Goal**: Let visitors resume their device-local reading location and manage device-local bookmarks.

**Independent Test**: Read to a verse, reload, resume, save/remove/open a bookmark, and recover
from invalid stored state without an account.

- [X] T035 [P] [US4] Add guest-storage unit tests in `tests/unit/lib/guest-storage.test.ts` for corrupt JSON, schema migration, unavailable storage, invalid keys, duplicate bookmarks, and `1:1` fallback.
- [X] T036 [P] [US4] Add persistence contract tests in `tests/contract/guest-persistence.contract.test.tsx` for immediate view updates, non-blocking errors, and device-local messaging.
- [X] T037 [US4] Implement reading-position updates and debounced persistence in `src/features/reader/reading-position.ts` and connect them to `src/features/reader/ReaderPage.tsx`.
- [X] T038 [US4] Implement bookmark add/remove/list/search/open UI and accessible empty states in `src/features/bookmarks/BookmarksPage.tsx`, `src/features/bookmarks/bookmarks.ts`, and `src/features/bookmarks/bookmarks.css`.
- [X] T039 [US4] Implement Home continuation and Verse-of-the-Day entry points in `src/features/home/HomePage.tsx` and `src/features/home/home.css`.
- [X] T040 [US4] Integrate persistence, continuation, and bookmarks with `src/app/App.tsx` and `src/app/routes.tsx`.
- [X] T041 [US4] Add end-to-end persistence coverage in `tests/e2e/guest-persistence.spec.ts` for reload/resume, bookmark lifecycle, invalid data recovery, and no-storage behavior.

**Checkpoint**: User Story 4 is independently usable from a reader location and the Home/Bookmarks routes.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Complete navigation, release validation, and constitution quality gates.

- [X] T042 [P] Implement responsive primary navigation and deferred-feature labels in `src/components/navigation/PrimaryNavigation.tsx` and `src/components/navigation/navigation.css`.
- [X] T043 [P] Add locale copy and locale-direction regression tests in `tests/integration/app/localization.test.tsx` and `tests/e2e/rtl-navigation.spec.ts`.
- [X] T044 Validate content provenance, manifest hash, attribution display, and unavailable-content handling in `tests/contract/content-integrity.contract.test.ts` and `src/content/validate-content.ts`.
- [X] T045 Run keyboard-only, visible-focus, contrast, reduced-motion, 320px, and 400% zoom review; record results in `specs/001-quran-reading-platform/quickstart.md`.
- [X] T046 Run mobile-performance measurement for Surah/Juz open time and document the 90%/3-second result in `specs/001-quran-reading-platform/quickstart.md`.
- [X] T047 Run `npm run lint`, unit/integration/e2e suites, `npm run build`, and the complete quickstart acceptance scenarios; resolve failures in the affected `src/` or `tests/` files.

---

## Dependencies & Execution Order

- Setup (T001–T004) precedes Foundational work (T005–T012).
- Foundational work blocks all stories.
- US1 and US2 can begin after the foundation; US2 needs only a known reader location, while US1
  provides the browse entry point.
- US3 depends on the foundation and reader integration (T024/T026) for result opening/actions.
- US4 depends on the foundation and reader (T024) for position capture; its Home entry may be
  completed independently after persistence is ready.
- Polish begins after the desired story set is complete.

## Parallel Opportunities

- Setup: T002 and T003 can run alongside dependency preparation for T001.
- Foundation: T008 and T009 can run in parallel after T005–T007; T012 can begin when token/state
  interfaces are stable.
- US1: T013/T014, T016, and T017 touch separate files and can run in parallel.
- US2: T020/T021, T022, and T023 can run in parallel after the foundation.
- US3: T028/T029 and T032 can run in parallel; T030 then enables T031/T033.
- US4: T035/T036 can run in parallel; T038 and T039 can proceed after storage interfaces stabilize.

## Implementation Strategy

1. Complete Setup and Foundational phases, including content validation and accessibility tokens.
2. Deliver US1 as the browse/open MVP, then US2 as the complete reading MVP.
3. Add US3 for search and verse actions, then US4 for guest continuity.
4. Finish cross-cutting validation before treating the portfolio MVP as complete.
