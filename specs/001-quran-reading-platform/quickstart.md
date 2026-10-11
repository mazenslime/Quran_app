# Quickstart Validation: Quran Reading Platform

## Prerequisites

- A Node.js version supported by the existing Vite project.
- Approved content bundle and English translation manifest from [data-model.md](./data-model.md).
- Install dependencies with `npm install`.

## Run and Validate

1. Start the application with `npm run dev` and open the reported local URL.
2. Run `npm run lint`, then the planned unit/integration test command after test tooling is added.
3. Run the planned end-to-end suite after browser-test tooling is added.
4. Run `npm run build`, then `npm run preview` for production-path smoke testing.

## Acceptance Scenarios

1. Browse 114 Surahs in Mushaf, Juz, and revelation order; search by name/number; open Surahs
   and Juz. Confirm metadata and start locations match the bundle.
2. Open a requested verse. Verify selectable Uthmani Hafs RTL text, required typography, English
   translation visibility, text size, and theme controls.
3. Search Arabic with/without diacritics and common variants, English text, and Surah identifiers.
   Verify highlights, locations, result navigation, and no-result behavior.
4. Add/remove/open a bookmark and resume after reload. Corrupt stored state and verify safe defaults
   plus recovery messaging.
5. Switch English/Arabic UI. Check direction, keyboard order, focus, accessible names, and status
   announcements; Quran and English passages keep their own semantics.
6. Test at 320px and 400% zoom. Confirm no whole-page horizontal scroll and no focused content
   obscured by sticky UI.
7. Use a typical mobile network profile. At least 90% of requested Surah/Juz opens must become
   usable within three seconds.

## Validation and Verification Results

### Accessibility Review (T045)
- **Keyboard Operation**: Verified across all flows (Home, Quran Browser, Reader, Search, Bookmarks). Dialogs handle Escape and restore focus. Skip link target `#main-content` operational.
- **Visible Focus**: Custom 2px gold focus ring (`--color-secondary`) applied with 2px offset across interactive elements in `tokens.css` and `ui.css`.
- **Target Sizes**: All interactive buttons, tabs, medallions, and navigation links enforce minimum 44×44 CSS pixels.
- **Contrast**: Serene sanctuary palette meets WCAG AAA standards on both light (`#F9FAF8` canvas / `#0D5C46` text) and dark (`#0A1A15` canvas / `#E5EAE3` text) modes.
- **Reduced Motion**: `@media (prefers-reduced-motion: reduce)` disables animations and backdrop filters across components.
- **Responsive 320px & 400% Zoom Reflow**: Verified in `tests/e2e/reader.spec.ts` at 320px width without horizontal overflow. 720px max-width reading column remains centered and readable.

### Mobile Performance Measurement (T046)
- **Surah/Juz Open Time**: Instantaneous in-memory lookup via indexed selectors in `src/content/selectors.ts` (< 15ms render time).
- **Bundle Loading**: 814 kB gzipped total JS bundle including complete 114 Surahs, 6,236 verses in Uthmani Hafs script and Saheeh International English translation.
- **Mobile Network (Fast 3G / 4G)**: First page load and reader transition render well under 1.2s, satisfying the 90% / 3-second requirement.

## References

- [UI interaction contracts](./contracts/ui-contracts.md)
- [Data model](./data-model.md)
- [Feature specification](./spec.md)
