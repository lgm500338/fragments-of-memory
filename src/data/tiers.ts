// 난이도 단계(쉬움 → 전설). 앱 안에서는 판 번호(0부터)를 계속 이어서 쓰고, 화면에는 "어려움 12/50판"처럼 보여준다.
import { Language } from '../types/puzzle';
import { sequenceFor } from './taleGenerator';
import { WorkGroup } from './works';

export interface Tier {
  key: string;
  ko: string;
  en: string;
  start: number; // 이 단계 첫 판의 전체 번호 (0부터)
  count: number; // 판 수 (Infinity = 끝없음)
}

export interface TierPos {
  tier: Tier;
  tierIdx: number;
  stage: number; // 단계 안에서 몇 번째 판 (0부터)
}

function build(list: { key: string; ko: string; en: string; count: number }[]): Tier[] {
  let start = 0;
  return list.map((t) => {
    const out = { ...t, start };
    start += t.count;
    return out;
  });
}

// ── 기억 그림 ──
export interface PictureTierRule {
  objs: [number, number];
  time: number;
  questions: number;
  radius: number; // 핀 정답 범위 (가로 %)
}

export const PICTURE_TIERS = build([
  { key: 'easy', ko: '쉬움', en: 'Easy', count: 3 },
  { key: 'normal', ko: '보통', en: 'Normal', count: 7 },
  { key: 'hard', ko: '어려움', en: 'Hard', count: 50 },
  { key: 'veryhard', ko: '아주 어려움', en: 'Very Hard', count: 100 },
  { key: 'extreme', ko: '극도로 어려움', en: 'Extreme', count: 100 },
  { key: 'legend', ko: '전설', en: 'Legend', count: Infinity },
]);

export const PICTURE_RULES: Record<string, PictureTierRule> = {
  easy: { objs: [4, 5], time: 14, questions: 3, radius: 8.5 },
  normal: { objs: [6, 7], time: 12, questions: 3, radius: 8 },
  hard: { objs: [8, 10], time: 10, questions: 4, radius: 7.5 },
  veryhard: { objs: [11, 13], time: 8, questions: 4, radius: 7 },
  extreme: { objs: [14, 15], time: 7, questions: 5, radius: 6.5 },
  legend: { objs: [15, 15], time: 7, questions: 5, radius: 6 },
};

// ── 기억동화·소설 ──
const TALE_TIER_NAME: Record<WorkGroup | 'challenge', { key: string; ko: string; en: string }> = {
  tale: { key: 'easy', ko: '쉬움', en: 'Easy' },
  novel: { key: 'hard', ko: '어려움', en: 'Hard' },
  korean: { key: 'veryhard', ko: '아주 어려움', en: 'Very Hard' },
  challenge: { key: 'extreme', ko: '극도로 어려움', en: 'Extreme' },
};

// 단계별 문장 통과선(%)
export const TALE_PASS: Record<string, number> = { easy: 70, hard: 75, veryhard: 80, extreme: 85 };

export function taleTiers(workId: string, lang: Language): Tier[] {
  const seq = sequenceFor(workId, lang);
  const list: { key: string; ko: string; en: string; count: number }[] = [];
  for (const g of ['tale', 'novel', 'korean'] as WorkGroup[]) {
    const n = seq.filter((s) => s.work.group === g).length;
    if (n > 0) list.push({ ...TALE_TIER_NAME[g], count: n });
  }
  list.push({ ...TALE_TIER_NAME.challenge, count: Infinity });
  return build(list);
}

export function tierAt(tiers: Tier[], index: number): TierPos {
  for (let i = 0; i < tiers.length; i++) {
    const t = tiers[i];
    if (index < t.start + t.count) return { tier: t, tierIdx: i, stage: index - t.start };
  }
  const last = tiers.length - 1;
  return { tier: tiers[last], tierIdx: last, stage: index - tiers[last].start };
}

export function stageLabel(pos: TierPos, lang: Language) {
  const total = Number.isFinite(pos.tier.count) ? `/${pos.tier.count}` : '';
  return lang === 'ko' ? `${pos.tier.ko} ${pos.stage + 1}${total}판` : `${pos.tier.en} ${pos.stage + 1}${total}`;
}

