# UI Interaction Contracts

These are observable client behavior contracts, not network API contracts.

## Navigation

| Trigger | Required outcome | Failure or empty outcome |
|---|---|---|
| Select Surah | Open its first verse | Return to Quran browser with an announcement |
| Select Juz | Open its `startVerseKey` | Return to Quran browser with an announcement |
| Select search result | Open its `verseKey` | Retain search view and announce stale result |
| Select bookmark | Open its `verseKey` | Remove obsolete entry from list and explain |
| Continue reading | Open saved position | Fall back to `1:1` |

## Reader and Accessibility

- Semantic verse order is reference, Arabic text, English translation when enabled, then actions.
- Quran uses `lang="ar" dir="rtl"`; English translation uses `lang="en" dir="ltr"`.
- The shell follows the saved English/Arabic locale; audio timelines and numeric trackers retain
  deliberate LTR behavior.
- Arabic is selectable text, not an image. The reading column is at most 720px and medallions use
  Eastern Arabic numerals.
- Controls are named, keyboard-operable, visibly focused, at least 44px square, and expose state
  beyond color. Escape closes overlays and restores focus to the trigger.

## Search

- Empty query: prompt for a query without searching.
- Search Arabic Quran text, the approved English translation, Surah names, and Surah numbers.
- Arabic matching ignores diacritics and normalizes common letter variants; results render original
  text, locations, highlights, and an announced result count.
- No-result response retains the query and gives an accessible empty state.

## Guest Persistence and Sharing

- Bookmark, resume, locale, theme, font scale, and translation visibility update immediately, then
  attempt device-local persistence.
- Storage failures do not block reading; user-triggered save failures show a non-blocking message.
- Copy supports Arabic, English, or both when available. Share uses the platform mechanism when
  available and a copyable verse-link fallback otherwise.
