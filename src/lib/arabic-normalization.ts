/**
 * Arabic Text Normalization for Quranic Search
 * Normalizes text ONLY for matching purposes while keeping original text intact for display.
 */

// Regex for Arabic diacritics (harakat, tanween, sukun, shaddah, Quranic annotation marks)
// Ranges:
// \u0610-\u061A: Arabic signs
// \u064B-\u065F: Tashkeel / Harakat
// \u0670: Superscript dagger alif
// \u06D6-\u06ED: Quranic stop signs and annotation marks
const ARABIC_DIACRITICS_REGEX = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g

// Tatweel / Kashida
const TATWEEL_REGEX = /\u0640/g

/**
 * Normalizes an Arabic string by removing diacritics, tatweel, and normalizing letter variants.
 */
export function normalizeArabic(text: string): string {
  if (!text || typeof text !== 'string') return ''

  let normalized = text
    // Remove diacritics
    .replace(ARABIC_DIACRITICS_REGEX, '')
    // Remove tatweel
    .replace(TATWEEL_REGEX, '')

  // Normalize Alif variants: أ, إ, آ, ٱ -> ا
  normalized = normalized.replace(/[أإآٱ]/g, 'ا')

  // Normalize Taa Marbutah: ة -> ه
  normalized = normalized.replace(/ة/g, 'ه')

  // Normalize Alif Maqsurah: ى -> ي
  normalized = normalized.replace(/ى/g, 'ي')

  // Normalize Hamza on Waw and Yaa: ؤ -> و, ئ -> ي
  normalized = normalized.replace(/ؤ/g, 'و')
  normalized = normalized.replace(/ئ/g, 'ي')

  // Normalize Arabic numerals to standard if needed
  normalized = normalized.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632))

  return normalized.trim().toLowerCase()
}

/**
 * Normalizes Arabic text and produces an index mapping array from normalized indices
 * back to the original source string indices, allowing accurate highlight range derivation.
 */
export function normalizeArabicWithMapping(original: string): {
  normalized: string
  indexMap: number[] // indexMap[normalizedIndex] = originalIndex
} {
  if (!original) return { normalized: '', indexMap: [] }

  const indexMap: number[] = []
  let normalized = ''

  for (let i = 0; i < original.length; i++) {
    const char = original[i]

    // Skip diacritics
    if (ARABIC_DIACRITICS_REGEX.test(char)) {
      ARABIC_DIACRITICS_REGEX.lastIndex = 0
      continue
    }

    // Skip tatweel
    if (char === '\u0640') {
      continue
    }

    // Letter normalization
    let normChar = char
    if (/[أإآٱ]/.test(char)) {
      normChar = 'ا'
    } else if (char === 'ة') {
      normChar = 'ه'
    } else if (char === 'ى') {
      normChar = 'ي'
    } else if (char === 'ؤ') {
      normChar = 'و'
    } else if (char === 'ئ') {
      normChar = 'ي'
    }

    normalized += normChar
    indexMap.push(i)
  }

  return { normalized, indexMap }
}

/**
 * Find occurrence ranges of query in original Arabic text using normalized matching.
 */
export function findArabicHighlightRanges(
  originalText: string,
  query: string
): Array<{ start: number; end: number }> {
  const normQuery = normalizeArabic(query)
  if (!normQuery) return []

  const { normalized, indexMap } = normalizeArabicWithMapping(originalText)
  const ranges: Array<{ start: number; end: number }> = []

  let pos = 0
  while (pos < normalized.length) {
    const matchIdx = normalized.indexOf(normQuery, pos)
    if (matchIdx === -1) break

    const normEnd = matchIdx + normQuery.length
    const origStart = indexMap[matchIdx]
    const origLastChar = indexMap[normEnd - 1]

    // To find the full ending index in the original string, include any trailing diacritics on the last char
    let origEnd = origLastChar + 1
    while (
      origEnd < originalText.length &&
      (ARABIC_DIACRITICS_REGEX.test(originalText[origEnd]) || originalText[origEnd] === '\u0640')
    ) {
      ARABIC_DIACRITICS_REGEX.lastIndex = 0
      origEnd++
    }

    ranges.push({ start: origStart, end: origEnd })
    pos = matchIdx + normQuery.length
  }

  return ranges
}
