/**
 * Distractor Generator for Korean Sentence Recall
 * Generates 4 highly plausible, realistic multiple-choice options:
 * 1 exact correct sentence + 3 clever distractors with subtle spacing,
 * typos, phonetic swaps, or modifier variations.
 */

export interface MultipleChoiceItem {
  id: number;
  text: string;
  isCorrect: boolean;
  distractorType?: 'original' | 'spacing' | 'typo' | 'modifier';
}

export function generateSentenceDistractors(originalText: string): MultipleChoiceItem[] {
  const cleanOriginal = originalText.trim();
  if (!cleanOriginal) {
    return [
      { id: 1, text: '정답 문장', isCorrect: true, distractorType: 'original' },
      { id: 2, text: '유사한 문장 1', isCorrect: false, distractorType: 'spacing' },
      { id: 3, text: '유사한 문장 2', isCorrect: false, distractorType: 'typo' },
      { id: 4, text: '유사한 문장 3', isCorrect: false, distractorType: 'modifier' },
    ];
  }

  // 1. Spacing distractor: merge or split some common words/particles
  let spacingVariant = cleanOriginal;
  if (spacingVariant.includes(' 한 송이')) {
    spacingVariant = spacingVariant.replace(' 한 송이', ' 한송이');
  } else if (spacingVariant.includes(' 한송이')) {
    spacingVariant = spacingVariant.replace(' 한송이', ' 한 송이');
  } else if (spacingVariant.includes('어린 왕자')) {
    spacingVariant = spacingVariant.replace('어린 왕자', '어린왕자');
  } else if (spacingVariant.includes('어린왕자')) {
    spacingVariant = spacingVariant.replace('어린왕자', '어린 왕자');
  } else if (spacingVariant.includes(' 생택')) {
    spacingVariant = spacingVariant.replace(' 생택', ' 생텍');
  } else if (spacingVariant.includes('3시간을')) {
    spacingVariant = spacingVariant.replace('3시간을', '3시간 을');
  } else if (spacingVariant.includes('한 바퀴')) {
    spacingVariant = spacingVariant.replace('한 바퀴', '한바퀴');
  } else {
    // Generic fallback spacing adjustment
    const words = spacingVariant.split(' ');
    if (words.length >= 3) {
      spacingVariant = `${words[0]}${words[1]} ${words.slice(2).join(' ')}`;
    }
  }

  // 2. Typo / Phonetic distractor
  let typoVariant = cleanOriginal;
  if (typoVariant.includes('정성껏')) {
    typoVariant = typoVariant.replace('정성껏', '정성것');
  } else if (typoVariant.includes('생택쥐페리')) {
    typoVariant = typoVariant.replace('생택쥐페리', '생텍쥐베리');
  } else if (typoVariant.includes('셜록 홈즈')) {
    typoVariant = typoVariant.replace('셜록 홈즈', '쉘록 홈즈');
  } else if (typoVariant.includes('시간은 금이다')) {
    typoVariant = typoVariant.replace('시간은 금이다', '시간은 곧 금이다');
  } else if (typoVariant.includes('사무엘 존슨')) {
    typoVariant = typoVariant.replace('사무엘 존슨', '샤무엘 존슨');
  } else if (typoVariant.includes('초콜릿 상자')) {
    typoVariant = typoVariant.replace('초콜릿 상자', '초콜렛 상자');
  } else if (typoVariant.includes('보살폈습니다')) {
    typoVariant = typoVariant.replace('보살폈습니다', '돌보았습니다');
  } else {
    if (typoVariant.endsWith('.')) {
      typoVariant = typoVariant.slice(0, -1) + '!';
    } else {
      typoVariant = typoVariant + '.';
    }
  }

  // 3. Modifier / Word variation distractor
  let modifierVariant = cleanOriginal;
  if (modifierVariant.includes('매일 ')) {
    modifierVariant = modifierVariant.replace('매일 ', '매일같이 ');
  } else if (modifierVariant.includes('핀 ')) {
    modifierVariant = modifierVariant.replace('핀 ', '피어있는 ');
  } else if (modifierVariant.includes('소행성에')) {
    modifierVariant = modifierVariant.replace('소행성에', '작은 소행성에');
  } else if (modifierVariant.includes('프랑스 작가')) {
    modifierVariant = modifierVariant.replace('프랑스 작가', '프랑스의 소설가');
  } else if (modifierVariant.includes('명작')) {
    modifierVariant = modifierVariant.replace('명작', '불멸의 명작');
  } else if (modifierVariant.includes('지구를')) {
    modifierVariant = modifierVariant.replace('지구를', '푸른 지구를');
  } else {
    modifierVariant = `진정으로 ${cleanOriginal}`;
  }

  // Ensure all 4 candidates are unique
  const rawList = [
    { text: cleanOriginal, isCorrect: true, distractorType: 'original' as const },
    { text: spacingVariant, isCorrect: false, distractorType: 'spacing' as const },
    { text: typoVariant, isCorrect: false, distractorType: 'typo' as const },
    { text: modifierVariant, isCorrect: false, distractorType: 'modifier' as const },
  ];

  const seen = new Set<string>();
  const sanitizedList: { text: string; isCorrect: boolean; distractorType: 'original' | 'spacing' | 'typo' | 'modifier' }[] = [];

  rawList.forEach((item, idx) => {
    let t = item.text;
    if (seen.has(t) && !item.isCorrect) {
      t = idx === 1 ? `[주의] ${t}` : idx === 2 ? `${t} (기억)` : `${t} (원문 변형)`;
    }
    seen.add(t);
    sanitizedList.push({ ...item, text: t });
  });

  // Seeded rotation
  const seed = cleanOriginal.length % 4;
  const rotatedIndices = [
    (0 + seed) % 4,
    (1 + seed) % 4,
    (2 + seed) % 4,
    (3 + seed) % 4,
  ];

  const result: MultipleChoiceItem[] = rotatedIndices.map((srcIdx, displayIdx) => ({
    id: displayIdx + 1,
    text: sanitizedList[srcIdx].text,
    isCorrect: sanitizedList[srcIdx].isCorrect,
    distractorType: sanitizedList[srcIdx].distractorType,
  }));

  return result;
}
