// 기억 그림 레벨 만들기: 레벨 번호마다 장면·시간대·물건 배치가 정해진다 (같은 레벨은 항상 같은 그림)
import { LevelData, Question, SceneItem } from '../types/puzzle';
import { OBJECTS } from './objects';
import { SCENES, TimeOfDay, TOD_LABEL } from './scenes';

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], r: () => number) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 받침 있는 글자면 '은/이', 없으면 '는/가'
function josa(word: string, withF: string, withoutF: string) {
  const c = word.charCodeAt(word.length - 1);
  const has = c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 !== 0;
  return word + (has ? withF : withoutF);
}

const TODS: TimeOfDay[] = ['morning', 'sunset', 'night'];

// 핀이 정답으로 인정되는 거리 (가로 % 기준, 그림 800px 중 약 64px)
export const PIN_RADIUS = 8;

export function generatePictureLevel(levelNumber: number): LevelData {
  const r = rng(levelNumber * 7919 + 17);
  const scene = SCENES[(levelNumber - 1) % SCENES.length];
  const tod = TODS[Math.floor((levelNumber - 1) / SCENES.length) % TODS.length];

  // 난이도: 레벨이 오를수록 물건은 많아지고 관찰 시간은 짧아짐
  const wantCount = Math.min(10, 5 + Math.floor((levelNumber - 1) / 3));
  const observeSec = Math.max(7, 14 - Math.floor((levelNumber - 1) / 4));

  const usable = scene.objects.filter((k) => OBJECTS[k] && scene.slots.some((s) => OBJECTS[k].types.includes(s.t)));
  const keys = shuffle(usable, r);
  const freeSlots = shuffle(
    scene.slots.map((_, i) => i),
    r
  );
  const used = new Set<number>();
  const placed: { key: string; si: number }[] = [];
  for (const k of keys) {
    if (placed.length >= wantCount) break;
    const si = freeSlots.find((i) => {
      if (used.has(i) || !OBJECTS[k].types.includes(scene.slots[i].t)) return false;
      const s = scene.slots[i];
      return placed.every((p) => Math.hypot(scene.slots[p.si].x - s.x, scene.slots[p.si].y - s.y) > 70);
    });
    if (si === undefined) continue;
    used.add(si);
    placed.push({ key: k, si });
  }

  const items: SceneItem[] = placed.map(({ key, si }) => {
    const s = scene.slots[si];
    const o = OBJECTS[key];
    const cy = s.y - 24 * s.s * 1.15; // 물건의 가운데쯤
    return {
      id: key,
      objKey: key,
      px: s.x,
      py: s.y,
      scale: s.s * 1.15,
      name: { ko: o.ko, en: o.en },
      category: { ko: '물건', en: 'Object' },
      description: { ko: o.ko, en: o.en },
      x: Math.round((s.x / 800) * 1000) / 10,
      y: Math.round((cy / 500) * 1000) / 10,
      radius: PIN_RADIUS,
      count: 1,
      iconType: key,
      zoneName: { ko: s.ko, en: s.en },
    };
  });

  // 문제 3개: 위치 찾기 2개 + "그림에 없던 물건" 1개 (레벨 1~2는 위치 찾기만)
  const targets = shuffle(items, r);
  const pinQ = (it: SceneItem, n: number): Question => ({
    id: `pic-${levelNumber}-q${n}`,
    type: 'pin_location',
    prompt: {
      ko: `${josa(it.name.ko, '은', '는')} 어디에 있었나요? 그림에서 그 자리를 눌러 주세요.`,
      en: `Where was the ${it.name.en}? Tap that spot in the picture.`,
    },
    targetItemId: it.id,
    explanation: {
      ko: `${josa(it.name.ko, '은', '는')} ${it.zoneName.ko}에 있었어요.`,
      en: `The ${it.name.en} was on the ${it.zoneName.en}.`,
    },
    points: 100,
  });

  const questions: Question[] = [pinQ(targets[0], 1), pinQ(targets[1], 2)];

  const absentPool = shuffle(
    usable.filter((k) => !items.some((it) => it.id === k)),
    r
  );
  if (levelNumber >= 3 && absentPool.length > 0) {
    const shown = shuffle(items, r).slice(0, 3).map((it) => it.objKey as string);
    const absent = absentPool[0];
    const opts = shuffle([...shown, absent], r);
    questions.push({
      id: `pic-${levelNumber}-q3`,
      type: 'multiple_choice',
      prompt: { ko: '그림에 없었던 물건은 무엇일까요?', en: 'Which object was NOT in the picture?' },
      options: opts.map((k) => ({ ko: OBJECTS[k].ko, en: OBJECTS[k].en })),
      correctOptionIndex: opts.indexOf(absent),
      explanation: {
        ko: `${josa(OBJECTS[absent].ko, '은', '는')} 그림에 없었어요.`,
        en: `The ${OBJECTS[absent].en} was not in the picture.`,
      },
      points: 100,
    });
  } else {
    questions.push(pinQ(targets[2] || targets[0], 3));
  }

  const todL = TOD_LABEL[tod];
  return {
    id: `pic-${levelNumber}`,
    category: 'picture',
    levelNumber,
    title: {
      ko: `탐험 제${levelNumber}장: ${scene.ko} · ${todL.ko}`,
      en: `Expedition Ch. ${levelNumber}: ${scene.en} · ${todL.en}`,
    },
    subtitle: { ko: `물건 ${items.length}개 · 관찰 ${observeSec}초`, en: `${items.length} objects · ${observeSec}s` },
    difficultyTier: levelNumber <= 5 ? 'easy' : levelNumber <= 15 ? 'normal' : 'hard',
    observationTimeLimit: observeSec,
    storyNarrative: {
      ko: `${scene.narrativeKo}\n물건 ${items.length}개가 숨어 있어요. 시간이 끝나면 모두 사라져요!`,
      en: `${scene.narrativeEn}\n${items.length} objects are hidden here. They vanish when time is up!`,
    },
    illustrationType: 'fairytale_cottage',
    sceneId: scene.id,
    timeOfDay: tod,
    items,
    questions,
  };
}
