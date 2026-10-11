# Research: Quran Reading Platform

## Guest Persistence

**Decision**: Keep guest state in one versioned, namespaced browser-storage JSON envelope. Store
only canonical verse references, reading position, and non-sensitive preferences.

**Rationale**: The no-account MVP has small per-device state. A versioned envelope supports
validation and migration while the content bundle remains authoritative. Invalid JSON, unsupported
versions, unavailable storage, quota failures, or stale references fall back to usable in-memory
defaults; invalid positions fall back to Al-Fatihah 1:1.

**Alternatives considered**: Session storage has the wrong lifetime; IndexedDB is premature until
large offline caches exist; server synchronization is explicitly deferred.

## Quran Content Integrity

**Decision**: Ship an immutable bundle of approved Uthmani Hafs Arabic text, Surah metadata, Juz
ranges, and one named English translation. Store source, resource identifier, retrieval date,
licence/attribution, and bundle hash in a manifest.

**Rationale**: A static bundle meets the mobile target, avoids exposing content API credentials,
produces reproducible searches, and is auditable. Corrections become a reviewed bundle version;
Arabic strings are never edited in application code.

**Alternatives considered**: Runtime APIs introduce credential and availability risk; unversioned
third-party JSON lacks adequate provenance; hand-authored Quran text is unacceptable.

## Identity and Search

**Decision**: Use `verseKey` as `{surahNumber}:{ayahNumber}` for every durable reference. Search
Arabic text, one English translation, and Surah identifiers. Normalize Arabic diacritics and
common letter variants only for matching; always display original Uthmani Hafs text.

**Rationale**: This stable, provider-independent identity validates bookmarks and positions. The
matching rule supports common Arabic keyboard input without changing canonical display content.

**Alternatives considered**: Provider IDs, array indexes, and localized Surah names are fragile;
exact-only Arabic matching is too brittle; multiple translations exceed the MVP.

## RTL, Accessibility, and Responsive Reading

**Decision**: Set shell `lang`/`dir` from English or Arabic UI selection. Mark Quran passages as
Arabic RTL and translation as English LTR. Use logical CSS and one semantic DOM order: reference,
Arabic, translation, actions. Use native controls, status announcements, and focus-safe overlays.

**Rationale**: Explicit language/direction improves pronunciation and avoids mirrored-layout bugs.
The stable DOM order protects keyboard and assistive technology at every breakpoint. At 320px and
400% zoom, content stacks without whole-page horizontal scrolling.

**Alternatives considered**: Always-LTR shell, duplicate RTL/LTR trees, and CSS visual reordering
all create localization, focus, or reading-order failures.

## Sources

- Quran Foundation Content API documentation for versioned chapters, verses, translations, and
  `verse_key`; it is an acquisition/verification reference, not a browser runtime API.
- Tanzil Text License, if selected, for verbatim-use and attribution obligations.
- W3C WCAG 2.2 and guidance for language of parts, direction, reflow, focus, and dialogs.
- MDN browser-storage guidance for origin-scoped persistence and failure handling.
