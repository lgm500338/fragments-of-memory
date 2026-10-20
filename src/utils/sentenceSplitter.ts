/**
 * Sentence Splitter Helper
 * Splits a sentence into two natural, balanced halves for 3-step progressive memory learning:
 * Step 1: Front Half
 * Step 2: Back Half
 * Step 3: Full Complete Sentence
 */

export interface SentenceSplit {
  part1: string;
  part2: string;
  full: string;
}

export function splitSentence(text: string): SentenceSplit {
  const clean = text.trim();
  if (!clean) {
    return { part1: '', part2: '', full: '' };
  }

  // 1. If contains ' - ' (e.g. quote - author)
  if (clean.includes(' - ')) {
    const parts = clean.split(' - ');
    return {
      part1: parts[0].trim(),
      part2: parts.slice(1).join(' - ').trim(),
      full: clean,
    };
  }

  // 2. If contains comma or semicolon
  if (clean.includes(',')) {
    const idx = clean.indexOf(',');
    return {
      part1: clean.slice(0, idx + 1).trim(),
      part2: clean.slice(idx + 1).trim(),
      full: clean,
    };
  }

  // 3. Otherwise split by words at roughly half point
  const words = clean.split(' ');
  if (words.length <= 2) {
    return {
      part1: words[0] || '',
      part2: words.slice(1).join(' ') || '',
      full: clean,
    };
  }

  const mid = Math.ceil(words.length / 2);
  return {
    part1: words.slice(0, mid).join(' '),
    part2: words.slice(mid).join(' '),
    full: clean,
  };
}
