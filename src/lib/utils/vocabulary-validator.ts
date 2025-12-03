/**
 * Vocabulary validation and constraint enforcement utilities
 */

/**
 * Estimate syllables in a word (rough heuristic)
 */
export function estimateSyllables(word: string): number {
  if (!word || word.length === 0) return 0;
  const vowelGroups = word.toLowerCase().match(/[aeiouy]+/g);
  if (!vowelGroups) return 1;
  let count = vowelGroups.length;
  // Silent 'e' at the end doesn't count unless it's the only vowel
  if (word.endsWith('e') && count > 1) {
    count--;
  }
  return Math.max(1, count);
}

/**
 * Check if a synonym is acceptable for the given CEFR level
 */
export function isSynonymAcceptableForLevel(synonym: string, levelLower: string): boolean {
  if (!synonym || synonym.trim() === '') return true;

  const synLower = synonym.toLowerCase().trim();
  const syllables = estimateSyllables(synLower);

  // A1/A2 (Beginner): synonyms must be very simple
  if (levelLower.includes('a1') || levelLower.includes('a2') || levelLower.includes('beginner') || levelLower.includes('elementary')) {
    // If multi-word, usually too complex for A1/A2
    if (synLower.split(/\s+/).length > 2) return false;
    // If >3 syllables, likely too advanced
    if (syllables > 3) return false;
    // Check for advanced suffixes
    if (/(ize|ization|ify|ification|tion|sion|ment|ous|ious|eous)$/.test(synLower)) {
      // Some exceptions for common words
      if (['decision', 'discussion', 'famous', 'serious', 'nervous', 'dangerous'].includes(synLower)) {
        return true;
      }
      return false;
    }
    return true;
  }

  // B1/B2 (Intermediate): allow moderate complexity
  if (levelLower.includes('b1') || levelLower.includes('b2') || levelLower.includes('intermediate') || levelLower.includes('upper')) {
    // Multi-word phrases >3 words are too complex
    if (synLower.split(/\s+/).length > 3) return false;
    // Allow up to 5 syllables
    if (syllables > 5) return false;
    return true;
  }

  // C1/C2 (Advanced): allow sophisticated synonyms
  return true;
}

/**
 * Enforce synonym constraints on parsed AI response based on CEFR level
 * This mutates parsedResponse in-place
 */
export function enforceSynonymConstraints(parsedResponse: unknown, level: string): void {
  if (typeof parsedResponse !== 'object' || parsedResponse === null) return;
  const resp = parsedResponse as { exercises?: unknown[] };
  if (!resp.exercises || !Array.isArray(resp.exercises)) return;
  const lvl = level.toLowerCase();

  type Exercise = { type?: string; content?: { vocabulary?: unknown[] } };
  for (const ex of resp.exercises as Exercise[]) {
    if (!ex || ex.type !== 'vocabulary' || !ex.content || !Array.isArray(ex.content.vocabulary)) continue;

    for (const item of ex.content.vocabulary as unknown[]) {
      if (typeof item === 'object' && item !== null) {
        const vocabItem = item as { synonym?: string };
        if (vocabItem.synonym && typeof vocabItem.synonym === 'string') {
          const acceptable = isSynonymAcceptableForLevel(vocabItem.synonym, lvl);
          if (!acceptable) {
            vocabItem.synonym = '';
          }
        }
      }
    }
  }
}
