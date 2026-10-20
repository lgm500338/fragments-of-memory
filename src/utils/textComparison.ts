/**
 * Text Comparison & Fuzzy Matching Engine
 * Accurately measures text recall accuracy with character-level Levenshtein similarity,
 * whitespace & punctuation normalization, and Korean phonetic tolerance.
 * 
 * Supports:
 * 1. Spacing-insensitive matching (zero penalty for missing/extra spaces)
 * 2. Full narrative recognition: If the user inputs the entire sentence of the episode
 *    in Step 1 or Step 2, they memorized the whole text -> 100% Correct!
 * 3. Substring containment: If user's text contains the target chunk -> 100% Correct!
 * 4. Punctuation stripping and common Korean transliteration normalization
 */

export function normalizeKoreanText(str: string): string {
  if (!str) return '';
  return str
    .trim()
    .toLowerCase()
    .replace(/[.,!?'"~·\-_/\\()[\]{}<>:;`“”‘’]/g, '') // remove punctuation & smart quotes
    .replace(/\s+/g, ' ') // collapse multiple spaces
    .replace(/생텍/g, '생택') // Saint-Exupéry common variant
    .replace(/어린\s*왕자/g, '어린왕자'); // 어린 왕자 vs 어린왕자
}

export function computeTextSimilarity(
  userText: string,
  targetText: string,
  fullNarrative?: string
): number {
  if (!userText || !userText.trim()) return 0;

  const normUser = normalizeKoreanText(userText);
  const normTarget = normalizeKoreanText(targetText);
  const normNarrative = fullNarrative ? normalizeKoreanText(fullNarrative) : '';

  // 1. Spacing-stripped versions (Korean spacing is often flexible)
  const noSpaceUser = normUser.replace(/\s+/g, '');
  const noSpaceTarget = normTarget.replace(/\s+/g, '');
  const noSpaceNarrative = normNarrative.replace(/\s+/g, '');

  if (!noSpaceUser) return 0;

  // Case A: Exact match with target chunk (with or without spaces)
  if (noSpaceUser === noSpaceTarget && noSpaceTarget.length > 0) {
    return 100;
  }

  // Case B: User typed the entire narrative/sentence of the episode!
  // If the user recalled the whole sentence in Step 1 or 2, that's superior recall!
  if (noSpaceNarrative.length > 0) {
    if (noSpaceUser === noSpaceNarrative) {
      return 100;
    }
    // If user text contains the full narrative or narrative contains user text (>= 80% length)
    if (noSpaceUser.includes(noSpaceNarrative)) {
      return 100;
    }
    if (noSpaceNarrative.includes(noSpaceUser) && noSpaceUser.length >= noSpaceNarrative.length * 0.75) {
      return 100;
    }
  }

  // Case C: User text contains the target chunk (e.g. user typed whole sentence which starts with target chunk)
  if (noSpaceTarget.length > 0 && noSpaceUser.includes(noSpaceTarget)) {
    return 100;
  }

  // Case D: Target chunk contains user text and user has written most of it
  if (noSpaceTarget.length > 0 && noSpaceTarget.includes(noSpaceUser)) {
    const ratio = Math.round((noSpaceUser.length / noSpaceTarget.length) * 100);
    if (ratio >= 80) return 100;
    if (ratio >= 50) return ratio;
  }

  // Case E: Levenshtein distance on spacing-stripped strings
  const lenU = noSpaceUser.length;
  const lenT = noSpaceTarget.length;
  if (lenT === 0) return 0;

  const dp: number[][] = Array.from({ length: lenU + 1 }, () => new Array(lenT + 1).fill(0));
  for (let i = 0; i <= lenU; i++) dp[i][0] = i;
  for (let j = 0; j <= lenT; j++) dp[0][j] = j;

  for (let i = 1; i <= lenU; i++) {
    for (let j = 1; j <= lenT; j++) {
      const cost = noSpaceUser[i - 1] === noSpaceTarget[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,       // deletion
        dp[i][j - 1] + 1,       // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }

  const distance = dp[lenU][lenT];
  const maxLen = Math.max(lenU, lenT);
  const similarity = Math.max(0, Math.round(((maxLen - distance) / maxLen) * 100));

  // Word-level matching bonus
  const userWords = normUser.split(' ').filter(Boolean);
  const targetWords = normTarget.split(' ').filter(Boolean);
  let matchedWords = 0;
  targetWords.forEach((tw) => {
    if (userWords.some((uw) => uw.includes(tw) || tw.includes(uw))) {
      matchedWords++;
    }
  });
  const wordRatio = targetWords.length > 0 ? (matchedWords / targetWords.length) * 100 : 0;

  const finalScore = Math.max(similarity, Math.round(similarity * 0.6 + wordRatio * 0.4));
  return Math.min(100, Math.max(0, finalScore));
}
