# Quran App — Functional Requirements

## 1. Purpose

The application provides an integrated platform for reading, listening to, studying, and searching the Holy Quran, with personal tools such as bookmarks, collections, notes, reading goals, reading plans, and progress tracking.

## 2. Users

### 2.1 Guest User
- Read the Quran.
- Browse Surahs and Juz.
- Search the Quran.
- Listen to recitations.
- View translations.
- Use available study tools without registration.

### 2.2 Registered User
In addition to guest features, the user can:
- Save verses.
- Create collections.
- Add notes.
- Save the last reading position.
- Track reading history.
- Create reading goals.
- Create reading plans.
- Track reading streaks and progress.
- Synchronize data across devices when a backend is available.

# 3. Functional Requirements

## FR-001 — Home Page

The user shall be able to:
- Open the home page.
- Access the Quran directly.
- Continue from the last reading position.
- View the Verse of the Day.
- Access search.
- Access audio.
- View reading goals and progress when logged in.
- Access study tools.

## FR-002 — Surah List

The user shall be able to:
- View all 114 Surahs.
- View the Surah number.
- View the Arabic Surah name.
- View the English name when available.
- View the number of verses.
- Identify whether the Surah is Makki or Madani.
- Open a Surah.
- Search by Surah name or number.
- Browse Surahs in Mushaf order.
- Browse Surahs by Juz.
- Browse Surahs by revelation order.

## FR-003 — Juz

The user shall be able to:
- View the Juz of the Quran.
- Select a Juz.
- View the Surahs and verses contained in the Juz.
- Open the Juz position in the reader.

## FR-004 — Quran Reader

The user shall be able to:
- Open any Surah.
- Read verses in order.
- Navigate to a specific verse.
- Navigate to a specific Surah.
- Navigate between verses.
- Navigate to a Juz.
- View verse numbers.
- Read Arabic Quran text in RTL.
- Change text size.
- Change reading mode.
- Enable Dark Mode.
- Show or hide translations.
- Open Study Mode for a verse.

## FR-005 — Verse Actions

When selecting a verse, the user shall be able to:
- Play the verse.
- Bookmark the verse.
- Add the verse to a collection.
- Add a note.
- Copy the verse.
- Share the verse.
- View the translation.
- View Tafsir.
- Open Study Mode.
- Pin the verse for comparison.

## FR-006 — Study Mode

The application shall provide a dedicated mode for studying a verse.

The user shall be able to:
- Focus on the current verse.
- Navigate to the previous and next verses.
- View the words separately.
- Select a specific word.
- View word information.
- Listen to word pronunciation.
- View word translation when available.
- View Tafsir.
- View related verses.
- View reflections when available.
- Save the verse.
- Copy the verse.
- Share the verse.
- Add a note.
- Add the verse to a collection.

## FR-007 — Word by Word

The user shall be able to:
- View a verse divided into individual words.
- Select a specific word.
- View the word translation.
- View word information.
- Play word pronunciation.
- Navigate between words.

## FR-008 — Translations

The user shall be able to:
- Select a translation language.
- Select a specific translation when multiple translations are available.
- Show the translation below the Arabic text.
- Hide the translation.
- Read the translation in a separate Translation Reading Mode when supported.

## FR-009 — Tafsir

The user shall be able to:
- Open the Tafsir of a verse.
- Select a Tafsir source.
- Read Tafsir inside the application.
- Navigate between verses while reading Tafsir.
- Close Tafsir and return to the reader.

## FR-010 — Search

The user shall be able to:
- Search for a word.
- Search for a phrase.
- Search for verse text.
- Search by Surah name.
- Search by Surah number.
- View search results.
- Highlight the search term in results.
- Open a verse from a result.
- Filter results when filters are available.
- Search translations when supported.

## FR-011 — Audio

The user shall be able to:
- Select a reciter.
- Play a complete Surah.
- Play a verse.
- Pause playback.
- Resume playback.
- Play the next verse.
- Return to the previous verse.
- Control volume.
- Control playback speed.
- Repeat a verse.
- Repeat a Surah.
- Automatically play verses in order.
- View audio progress.

## FR-012 — Reciters

The user shall be able to:
- View a list of reciters.
- Select a reciter.
- Play recitation using the selected reciter.
- Change the reciter from the audio player.

## FR-013 — Quran Radio

The user shall be able to:
- Open Quran Radio.
- Start continuous recitation.
- Stop the radio.
- Control volume.
- View the current reciter or Surah when information is available.

## FR-014 — Reading Position

The user shall be able to:
- Save the last reading position.
- Save a verse-level reading position.
- Save a page-level position when Mushaf pages are supported.
- Return to the last saved position.
- Continue reading from the same location.

## FR-015 — Bookmarks

The user shall be able to:
- Save a verse.
- Remove a bookmark.
- View all saved verses.
- Open a bookmarked verse.
- Search bookmarks when needed.

## FR-016 — Collections

The user shall be able to:
- Create a collection.
- Name a collection.
- Rename a collection.
- Delete a collection.
- Add a verse to a collection.
- Remove a verse from a collection.
- Add a verse to multiple collections.
- Open a collection and view its contents.

Examples:
- Verses to memorize.
- Verses about patience.
- Verses for study.
- Favorite verses.

## FR-017 — Notes

The user shall be able to:
- Add a note to a verse.
- Edit a note.
- Delete a note.
- View notes associated with verses.
- Open the verse associated with a note.

## FR-018 — Pin & Compare

The user shall be able to:
- Pin a verse.
- Pin multiple verses for comparison.
- Open comparison mode.
- Display pinned verses together.
- Remove a verse from comparison.
- Return to the reader.

## FR-019 — Verse Sharing

The user shall be able to:
- Share a verse.
- Copy the verse URL.
- Share Arabic text.
- Share a translation when available.
- Use the Web Share API on supported devices.

## FR-020 — Verse Copying

The user shall be able to:
- Copy Arabic text.
- Copy the translation.
- Copy Arabic text and translation together.
- Copy Word-by-Word data when needed.

## FR-021 — Topics

The user shall be able to:
- View topics.
- Select a topic.
- View verses related to the topic.
- Open a verse from the results.

Examples:
- Patience.
- Prayer.
- Repentance.
- Mercy.
- Faith.
- Paradise.

## FR-022 — Verse of the Day

The user shall be able to:
- View the Verse of the Day.
- Open the verse.
- Play the verse.
- Save the verse.
- Share the verse.

## FR-023 — Goals

The user shall be able to:
- Create a reading goal.
- Set a daily verse target.
- Set a daily page target.
- Set a goal period.
- View completion percentage.
- Automatically update progress while reading.
- Edit a goal.
- Delete a goal.

## FR-024 — Reading Plans

The user shall be able to:
- View reading plans.
- Select a ready-made plan.
- Start a plan.
- Track progress.
- View remaining content.
- Create a custom plan when supported.
- Pause or finish a plan.

Examples:
- Complete the Quran in one year.
- Ramadan plan.
- Custom plan.

## FR-025 — Reading Streak

The application shall:
- Record reading days.
- Calculate consecutive reading days.
- Display the current streak.
- Display daily progress.
- Display reading streak history.

## FR-026 — Reading History

The user shall be able to:
- View reading history.
- See which Surahs have been read.
- See verses that have been read when supported.
- Return to a previous reading position.

## FR-027 — User Profile

For registered users, the Profile page shall contain:
- Account information.
- Bookmarks.
- Collections.
- Notes.
- Reading History.
- Goals.
- Plans.
- Streak.
- Reading Progress.

## FR-028 — Settings

The user shall be able to control:

### Reading
- Font size.
- Font type.
- Line spacing.
- Verse display mode.
- Translation visibility.
- Word-by-Word display.
- Tafsir selection.

### Audio
- Reciter.
- Playback speed.
- Repeat behavior.
- Autoplay.

### Appearance
- Light Mode.
- Dark Mode.
- System Mode.

### Language
- Application interface language.
- Translation language.

## FR-029 — Multilingual Support

The user shall be able to:
- Change the application interface language.
- Select the translation language.
- Use RTL for Arabic.
- Use LTR for other languages.
- Preserve the selected language setting between visits.

## FR-030 — Translation Feedback

A registered user shall be able to:
- Report a translation issue.
- Identify the translation containing the issue.
- Submit a description of the issue.
- Track the report status when supported.

## FR-031 — Authentication

When a backend is added, the user shall be able to:
- Create an account.
- Log in.
- Log out.
- Reset the password.
- Update account information.
- Synchronize user data.

## FR-032 — Synchronization

For registered users, the following data shall be synchronized:
- Bookmarks.
- Collections.
- Notes.
- Reading Position.
- History.
- Goals.
- Plans.
- Settings.

# 4. Navigation Requirements

The application shall provide clear navigation to:

- Home.
- Quran.
- Search.
- Audio.
- Study.
- Goals and Plans.
- My Quran.
- Settings.

On mobile, Bottom Navigation may be used. On larger screens, Sidebar or Header Navigation may be used.

# 5. Responsive Requirements

The application shall work on:
- Mobile.
- Tablet.
- Desktop.

The Quran reading experience shall remain comfortable, especially on small screens.

# 6. RTL Requirements

When Arabic is selected:
- The application direction shall be RTL.
- Quran text shall be RTL.
- Text alignment shall be appropriate for Arabic.
- Navigation shall work correctly with RTL.
- Controls that should remain LTR, such as audio progress bars when appropriate, shall not be unnecessarily reversed.

# 7. Frontend MVP Requirements

For the first portfolio version, implement:

- Home.
- Surah List.
- Juz.
- Quran Reader.
- Verse Actions.
- Search.
- Translation.
- Dark Mode.
- Bookmarks using localStorage.
- Reading Position using localStorage.
- Responsive Design.
- RTL.

Then add the following gradually:

1. Audio.
2. Study Mode.
3. Word by Word.
4. Tafsir.
5. Collections.
6. Notes.
7. Goals.
8. Plans.
9. Streak.
10. Pin & Compare.

# 8. Non-Functional Requirements

- The application should be responsive and fast.
- Use lazy loading for heavy pages or data where appropriate.
- Use code splitting.
- Do not load unnecessary audio files.
- Support accessibility.
- Support keyboard navigation.
- Use semantic HTML.
- Support Dark Mode.
- Support RTL/LTR.
- Follow a mobile-first design approach.
- Keep React components reusable and maintainable.
