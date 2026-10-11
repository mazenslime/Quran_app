import type { Verse } from '../types/quran'

export interface CopyVerseOptions {
  includeArabic?: boolean
  includeTranslation?: boolean
  includeReference?: boolean
}

/**
 * Format verse text for clipboard
 */
export function formatVerseText(
  verse: Verse,
  options: CopyVerseOptions = { includeArabic: true, includeTranslation: true, includeReference: true }
): string {
  const parts: string[] = []

  if (options.includeArabic) {
    parts.push(verse.arabicText)
  }

  if (options.includeTranslation && verse.englishTranslation) {
    parts.push(`"${verse.englishTranslation}"`)
  }

  if (options.includeReference) {
    parts.push(`— [Quran ${verse.verseKey}]`)
  }

  return parts.join('\n\n')
}

/**
 * Copy text to clipboard with fallback for older environments
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }

    // Fallback using textarea
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    const successful = document.execCommand('copy')
    document.body.removeChild(textarea)
    return successful
  } catch (err) {
    console.warn('Copy failed:', err)
    return false
  }
}

/**
 * Share verse using Web Share API or copy-link fallback
 */
export async function shareVerse(
  verse: Verse,
  currentOrigin = typeof window !== 'undefined' ? window.location.origin : ''
): Promise<{ shared: boolean; method: 'web-share' | 'clipboard' }> {
  const url = `${currentOrigin}/reader?verse=${verse.verseKey}`
  const title = `Quran ${verse.verseKey}`
  const text = `${verse.arabicText}\n${verse.englishTranslation}`

  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url,
      })
      return { shared: true, method: 'web-share' }
    } catch {
      // If user cancelled or failed, fall back to copying link
    }
  }

  const ok = await copyTextToClipboard(url)
  return { shared: ok, method: 'clipboard' }
}
