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

  // 2. 쉼표·마침표·물음표·느낌표 중 가운데에 가장 가까운 곳에서 나누기 (너무 한쪽으로 치우치면 건너뜀)
  const half = clean.length / 2;
  let best = -1;
  const re = /[,.?!…](?=\s)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(clean))) {
    const pos = m.index + 1;
    if (pos < clean.length * 0.25 || pos > clean.length * 0.75) continue;
    if (best < 0 || Math.abs(pos - half) < Math.abs(best - half)) best = pos;
  }
  if (best > 0) {
    return { part1: clean.slice(0, best).trim(), part2: clean.slice(best).trim(), full: clean };
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
