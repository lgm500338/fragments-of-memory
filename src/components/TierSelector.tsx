import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Lock, Check } from 'lucide-react';
import { Language } from '../types/puzzle';
import { Tier, tierAt } from '../data/tiers';
import { sound } from '../utils/audio';

interface Props {
  tiers: Tier[];
  currentIndex: number; // 지금 판 (전체 번호, 0부터)
  cleared: number; // 깬 판 수 (이 번호 미만은 모두 깸)
  onSelect: (index: number) => void;
  lang: Language;
  isLight: boolean;
}

const PAGE = 10;

export const TierSelector: React.FC<Props> = ({ tiers, currentIndex, cleared, onSelect, lang, isLight }) => {
  const pos = tierAt(tiers, currentIndex);
  const [viewTier, setViewTier] = useState(pos.tierIdx);
  const [page, setPage] = useState(Math.floor(pos.stage / PAGE));

  useEffect(() => {
    setViewTier(pos.tierIdx);
    setPage(Math.floor(pos.stage / PAGE));
  }, [pos.tierIdx, pos.stage]);

  const tier = tiers[viewTier];
  const unlockedTier = (t: Tier) => t.start <= cleared;
  const doneIn = (t: Tier) => Math.max(0, Math.min(cleared - t.start, Number.isFinite(t.count) ? t.count : Infinity));
  const finite = Number.isFinite(tier.count);
  const maxStage = finite ? tier.count : Math.max(doneIn(tier) + 1, (page + 1) * PAGE);
  const stages = Array.from({ length: PAGE }, (_, i) => page * PAGE + i).filter((s) => s < maxStage);
  const lastPage = finite ? Math.ceil(tier.count / PAGE) - 1 : Infinity;

  const muted = isLight ? 'text-stone-400' : 'text-slate-500';

  return (
    <div className={`w-full rounded-2xl p-4 sm:p-5 border shadow-sm select-none ${isLight ? 'bg-white border-[#e7dec8]' : 'bg-slate-900 border-slate-800'}`}>
      <div className="text-sm font-bold mb-3">{lang === 'ko' ? '난이도' : 'Difficulty'}</div>

      {/* 단계 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tiers.map((t, i) => {
          const open = unlockedTier(t);
          const done = doneIn(t);
          const complete = Number.isFinite(t.count) && done >= t.count;
          const active = i === viewTier;
          return (
            <button
              key={t.key + i}
              disabled={!open}
              onClick={() => {
                sound.playClick();
                setViewTier(i);
                setPage(Math.floor(Math.min(done, Number.isFinite(t.count) ? t.count - 1 : done) / PAGE));
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 transition-colors ${
                active
                  ? 'bg-amber-500 border-amber-500 text-slate-950'
                  : open
                  ? isLight
                    ? 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100 cursor-pointer'
                    : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 cursor-pointer'
                  : isLight
                  ? 'bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-slate-800/40 border-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              {!open && <Lock className="w-3 h-3" />}
              {complete && <Check className="w-3 h-3" />}
              <span>{t[lang]}</span>
              {open && (
                <span className="font-mono opacity-70">
                  {done}
                  {Number.isFinite(t.count) ? `/${t.count}` : ''}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 판 */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className={`p-2 rounded-lg border shrink-0 ${isLight ? 'border-stone-200' : 'border-slate-700'} disabled:opacity-30`}
          aria-label={lang === 'ko' ? '이전' : 'Previous'}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 grid grid-cols-5 sm:grid-cols-10 gap-1.5">
          {stages.map((s) => {
            const idx = tier.start + s;
            const open = idx <= cleared;
            const current = idx === currentIndex;
            const done = idx < cleared;
            return (
              <button
                key={s}
                disabled={!open}
                onClick={() => {
                  sound.playClick();
                  onSelect(idx);
                }}
                className={`h-10 rounded-lg text-xs font-mono font-bold border flex items-center justify-center transition-all ${
                  current
                    ? 'bg-amber-500 border-amber-600 text-slate-950 ring-2 ring-amber-300'
                    : done
                    ? isLight
                      ? 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100 cursor-pointer'
                      : 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700 cursor-pointer'
                    : open
                    ? isLight
                      ? 'bg-white border-amber-400 text-amber-700 cursor-pointer'
                      : 'bg-slate-900 border-amber-500/60 text-amber-300 cursor-pointer'
                    : isLight
                    ? 'bg-stone-50 border-stone-200 text-stone-300 cursor-not-allowed'
                    : 'bg-slate-900 border-slate-800 text-slate-700 cursor-not-allowed'
                }`}
              >
                {open ? s + 1 : <Lock className="w-3 h-3" />}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setPage((p) => (p < lastPage ? p + 1 : p))}
          disabled={page >= lastPage || tier.start + (page + 1) * PAGE > cleared}
          className={`p-2 rounded-lg border shrink-0 ${isLight ? 'border-stone-200' : 'border-slate-700'} disabled:opacity-30`}
          aria-label={lang === 'ko' ? '다음' : 'Next'}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <p className={`text-[11px] mt-3 ${muted}`}>
        {lang === 'ko' ? '판을 깨면 다음 판이 열리고, 단계의 판을 모두 깨면 다음 단계가 열려요.' : 'Clear a stage to unlock the next one.'}
      </p>
    </div>
  );
};
