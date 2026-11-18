import React, { useState } from 'react';
import { BookOpen, ChevronDown, Shuffle } from 'lucide-react';
import { Language } from '../types/puzzle';
import { GROUP_LABEL, WorkGroup } from '../data/works';
import { ALL_WORKS, visibleWorks } from '../data/taleGenerator';
import { sound } from '../utils/audio';

interface Props {
  selected: string;
  onSelect: (id: string) => void;
  progress: Record<string, number>;
  lang: Language;
  isLight: boolean;
}

const GROUP_HINT: Record<WorkGroup, { ko: string; en: string }> = {
  tale: { ko: '쉬움', en: 'Easy' },
  novel: { ko: '보통', en: 'Medium' },
  korean: { ko: '어려움 · 원문', en: 'Hard' },
};

export const WorkPicker: React.FC<Props> = ({ selected, onSelect, progress, lang, isLight }) => {
  const [open, setOpen] = useState(false);
  const works = visibleWorks(lang);
  const current = works.find((w) => w.id === selected);
  const label = current ? current[lang] : lang === 'ko' ? '전체 이어하기' : 'All works in order';

  const pick = (id: string) => {
    sound.playClick();
    onSelect(id);
    setOpen(false);
  };

  const card = isLight ? 'bg-white border-[#e7dec8]' : 'bg-slate-900 border-slate-700';
  const item = (active: boolean) =>
    `text-left p-3 rounded-xl border transition-colors cursor-pointer ${
      active
        ? 'border-amber-500 bg-amber-500/15'
        : isLight
        ? 'border-stone-200 bg-stone-50 hover:bg-amber-50'
        : 'border-slate-700 bg-slate-800/60 hover:bg-slate-800'
    }`;

  return (
    <div className={`rounded-2xl border shadow-sm ${card}`}>
      <button
        onClick={() => {
          sound.playClick();
          setOpen((o) => !o);
        }}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 cursor-pointer"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 min-w-0">
          <BookOpen className="w-4 h-4 text-amber-500 shrink-0" />
          <span className={`text-xs ${isLight ? 'text-stone-500' : 'text-slate-400'}`}>{lang === 'ko' ? '작품 서재' : 'Library'}</span>
          <span className="font-bold truncate">{label}</span>
        </span>
        <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 shrink-0">
          {lang === 'ko' ? '작품 고르기' : 'Choose'}
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {open && (
        <div className={`px-4 pb-4 space-y-4 border-t ${isLight ? 'border-stone-200' : 'border-slate-800'}`}>
          <button onClick={() => pick(ALL_WORKS)} className={`${item(selected === ALL_WORKS)} w-full mt-4 flex items-center gap-3`}>
            <Shuffle className="w-5 h-5 text-amber-500 shrink-0" />
            <span>
              <span className="block font-bold text-sm">{lang === 'ko' ? '전체 이어하기' : 'All works in order'}</span>
              <span className={`block text-xs ${isLight ? 'text-stone-500' : 'text-slate-400'}`}>
                {lang === 'ko' ? '쉬운 동화부터 시작해 소설, 한국 고전 순서로 이어져요' : 'Starts with fairy tales, then novels'}
              </span>
            </span>
          </button>

          {(['tale', 'novel', 'korean'] as WorkGroup[]).map((g) => {
            const list = works.filter((w) => w.group === g);
            if (!list.length) return null;
            return (
              <div key={g}>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-sm font-extrabold">{GROUP_LABEL[g][lang]}</span>
                  <span className={`text-[11px] ${isLight ? 'text-stone-400' : 'text-slate-500'}`}>{GROUP_HINT[g][lang]}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {list.map((w) => {
                    const done = Math.min(progress[w.id] || 0, w.lines.length);
                    return (
                      <button key={w.id} onClick={() => pick(w.id)} className={item(selected === w.id)}>
                        <span className="block font-bold text-sm leading-snug">{w[lang]}</span>
                        <span className={`block text-[11px] mt-0.5 ${isLight ? 'text-stone-500' : 'text-slate-400'}`}>
                          {lang === 'ko' ? w.authorKo : w.authorEn}
                        </span>
                        <span className="block mt-2 h-1.5 rounded-full bg-stone-200 dark:bg-slate-700 overflow-hidden">
                          <span className="block h-full bg-amber-500" style={{ width: `${(done / w.lines.length) * 100}%` }} />
                        </span>
                        <span className={`block text-[10px] mt-1 ${isLight ? 'text-stone-400' : 'text-slate-500'}`}>
                          {done} / {w.lines.length}
                          {lang === 'ko' ? '문장' : ' lines'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
