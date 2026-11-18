// 기억동화·소설 레벨 만들기
// - 작품 하나를 고르면: 그 작품 문장을 이야기 순서대로 → 다 끝나면 두 문장 잇기(도전)로 무한
// - 전체 이어하기: 동화(쉬움) → 세계 소설 → 한국 고전 순서, 같은 묶음 안에서는 작품을 번갈아 → 그 뒤 도전 무한
import { Language, LevelData } from '../types/puzzle';
import { splitSentence } from '../utils/sentenceSplitter';
import { WORKS, Work, WorkGroup } from './works';

export const ALL_WORKS = 'all';
const GROUP_ORDER: WorkGroup[] = ['tale', 'novel', 'korean'];

export function visibleWorks(lang: Language): Work[] {
  return WORKS.filter((w) => lang === 'ko' || !w.koOnly);
}

interface Step {
  work: Work;
  text: { ko: string; en: string };
  challenge: boolean;
}

function lineText(w: Work, i: number) {
  const l = w.lines[i];
  return { ko: l.ko, en: l.en || l.ko };
}

export function sequenceFor(workId: string, lang: Language): { work: Work; i: number }[] {
  const works = visibleWorks(lang);
  if (workId !== ALL_WORKS) {
    const w = works.find((x) => x.id === workId);
    return w ? w.lines.map((_, i) => ({ work: w, i })) : [];
  }
  const out: { work: Work; i: number }[] = [];
  for (const g of GROUP_ORDER) {
    const ws = works.filter((w) => w.group === g);
    const max = Math.max(0, ...ws.map((w) => w.lines.length));
    for (let i = 0; i < max; i++) for (const w of ws) if (i < w.lines.length) out.push({ work: w, i });
  }
  return out;
}

function stepFor(levelNumber: number, workId: string, lang: Language): Step {
  const seq = sequenceFor(workId, lang);
  const idx = levelNumber - 1;
  if (idx < seq.length) {
    const { work, i } = seq[idx];
    return { work, text: lineText(work, i), challenge: false };
  }
  // 도전: 같은 작품의 이어지는 두 문장
  const pool = workId === ALL_WORKS ? visibleWorks(lang) : visibleWorks(lang).filter((w) => w.id === workId);
  const k = idx - seq.length;
  let h = (k + 1) * 2654435761;
  h = (h ^ (h >>> 13)) >>> 0;
  const work = pool[h % pool.length];
  const start = (h >>> 8) % Math.max(1, work.lines.length - 1);
  const a = lineText(work, start);
  const b = lineText(work, Math.min(start + 1, work.lines.length - 1));
  return { work, text: { ko: `${a.ko} ${b.ko}`, en: `${a.en} ${b.en}` }, challenge: true };
}

function keywords(text: string): string[] {
  const words = text
    .replace(/[.,!?'"“”‘’…·:;()]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 2);
  return [...new Set(words)].sort((a, b) => b.length - a.length).slice(0, 3);
}

export function generateTaleLevel(levelNumber: number, workId: string, lang: Language): LevelData {
  const { work, text, challenge } = stepFor(levelNumber, workId, lang);
  const sKo = splitSentence(text.ko);
  const sEn = splitSentence(text.en);
  const tier = work.group === 'tale' && !challenge ? 'easy' : work.group === 'korean' || challenge ? 'hard' : 'normal';
  return {
    id: `tale-${workId}-${levelNumber}`,
    category: 'tale_novel',
    levelNumber,
    title: {
      ko: `<${work.ko}> 제${levelNumber}화: ${challenge ? '두 문장 잇기' : '기억의 문장'}`,
      en: `<${work.en}> Ep. ${levelNumber}: ${challenge ? 'Two Lines' : 'Memory Line'}`,
    },
    subtitle: { ko: `${work.authorKo} 작`, en: `by ${work.authorEn}` },
    authorOrSource: { ko: work.authorKo, en: work.authorEn },
    difficultyTier: tier,
    observationTimeLimit: 0,
    storyNarrative: {
      ko: `${text.ko}\n\n- ${work.authorKo} <${work.ko}>`,
      en: `${text.en}\n\n- ${work.authorEn}, ${work.en}`,
    },
    illustrationType: work.cover as LevelData['illustrationType'],
    questions: [
      {
        id: `tale-${levelNumber}-q1`,
        type: 'text_recall_typing',
        prompt: { ko: '[1단계: 앞부분] 문장의 앞부분을 기억하여 작성하세요.', en: '[Step 1: Front Half] Type the front half of the sentence.' },
        originalText: { ko: sKo.part1, en: sEn.part1 },
        explanation: { ko: '문장의 첫 번째 조각입니다.', en: 'The first piece of the sentence.' },
        points: 50,
      },
      {
        id: `tale-${levelNumber}-q2`,
        type: 'text_recall_typing',
        prompt: { ko: '[2단계: 뒷부분] 문장의 뒷부분을 기억하여 작성하세요.', en: '[Step 2: Back Half] Type the back half of the sentence.' },
        originalText: { ko: sKo.part2, en: sEn.part2 },
        explanation: { ko: '문장의 두 번째 조각입니다.', en: 'The second piece of the sentence.' },
        points: 50,
      },
      {
        id: `tale-${levelNumber}-q3`,
        type: 'text_recall_typing',
        prompt: { ko: '[3단계: 전체 완성] 1단계와 2단계를 합쳐 전체 문장을 완성하세요!', en: '[Step 3: Complete] Combine Step 1 and Step 2 to finish the full sentence!' },
        originalText: text,
        keyWords: { ko: keywords(text.ko), en: keywords(text.en) },
        explanation: {
          ko: `<${work.ko}>의 문장을 끝까지 기억해 냈어요.`,
          en: `You remembered the full line from ${work.en}.`,
        },
        points: 100,
      },
    ],
  };
}
