# Data Model: Quran Reading Platform

## Content Bundle

The immutable bundle has a manifest with version, source, licence and attribution, translation
resource identifier/name, retrieval date, and hash. All content references use `verseKey` in the
form `{surahNumber}:{ayahNumber}`.

### Surah

| Field | Rules |
|---|---|
| `number` | Integer, unique, 1–114 |
| `arabicName` / `englishName` | Approved display names |
| `verseCount` | Positive integer matching bundled verses |
| `revelationPlace` | `makki` or `madani` |
| `revelationOrder` | Positive display-order value |

### Juz

| Field | Rules |
|---|---|
| `number` | Integer, unique, 1–30 |
| `startVerseKey` | Valid canonical verse key |
| `ranges` | Inclusive verse-key ranges |

### Verse

| Field | Rules |
|---|---|
| `verseKey` | Unique `{surahNumber}:{ayahNumber}` identity |
| `surahNumber` / `ayahNumber` | Matches key and Surah verse bounds |
| `arabicText` | Approved immutable Uthmani Hafs text |
| `englishTranslation` | One approved translation or explicit unavailable state |
| `juzNumber` | References one valid Juz |
| `ordinal` | Derived search/sort value; never persisted as identity |

## Guest State

Persist one `quran-reader:guest-state:v1` envelope. The running application state is authoritative;
valid changes are persisted after a user action or debounced reading-location update.

| Field | Validation and lifecycle |
|---|---|
| `schemaVersion` | Migrate supported prior versions; ignore unsupported versions safely |
| `bookmarks` | Unique valid verse keys; discard malformed or unavailable entries |
| `readingPosition` | Valid verse key plus optional scroll anchor; otherwise use `1:1` |
| `preferences.locale` | `en` or `ar` |
| `preferences.theme` | `light`, `dark`, or `system` |
| `preferences.fontScale` | One approved reader scale |
| `preferences.showTranslation` | Boolean |

Storage failures preserve usable in-memory state. A user-triggered failed save gets a non-blocking
notice; unrelated browser storage is never cleared.

## Derived Search Result

| Field | Rules |
|---|---|
| `verseKey` | Valid bundled Verse reference |
| `matchScope` | `arabic`, `english`, `surah-name`, or `surah-number` |
| `highlightRanges` | Safe derived offsets; never alters canonical Arabic text |
| `displayContext` | Derived Surah name, verse number, and passage snippet |

## State Transitions

- Opening a valid Surah, Juz, search result, adjacent verse, or bookmark updates reading position.
- Bookmarking adds one unique valid verse key; removal deletes only that key.
- Changing preference updates in-memory state and its valid persisted representation.
- Missing or corrupt content keeps the current safe view and offers retry or Quran-browser recovery;
  it never fabricates Arabic content.
