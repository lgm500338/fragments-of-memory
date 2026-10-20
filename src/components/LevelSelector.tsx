import React, { useState } from 'react';
import { LevelData, Language } from '../types/puzzle';
import { Bookmark, Lock, ChevronLeft, ChevronRight, Hash, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface LevelSelectorProps {
  levels: LevelData[];
  currentLevelIndex: number;
  highestUnlockedLevel: number;
  onSelectLevel: (levelIndex: number) => void;
  lang: Language;
  isLight: boolean;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  levels,
  currentLevelIndex,
  highestUnlockedLevel,
  onSelectLevel,
  lang,
  isLight,
}) => {
  const [jumpInput, setJumpInput] = useState<string>('');

  // Page-based windowing (10 buttons per page window)
  const pageSize = 10;
  const currentChapterNum = currentLevelIndex + 1;
  const maxUnlockedNum = highestUnlockedLevel + 1;

  // Total available chapters in view (at least 10, or up to maxUnlockedNum + 5)
  const totalDisplayCount = Math.max(levels.length, maxUnlockedNum + 5);
  const [pageStart, setPageStart] = useState<number>(() => {
    return Math.floor(currentLevelIndex / pageSize) * pageSize;
  });

  const handlePrevPage = () => {
    sound.playClick();
    setPageStart((prev) => Math.max(0, prev - pageSize));
  };

  const handleNextPage = () => {
    sound.playClick();
    setPageStart((prev) => prev + pageSize);
  };

  const handleDirectJump = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(jumpInput.trim(), 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= maxUnlockedNum) {
      sound.playClick();
      onSelectLevel(parsed - 1);
      setPageStart(Math.floor((parsed - 1) / pageSize) * pageSize);
      setJumpInput('');
    }
  };

  const displayedNumbers = Array.from(
    { length: pageSize },
    (_, i) => pageStart + i + 1
  );

  return (
    <div
      className={`w-full rounded-2xl p-4 sm:p-5 border transition-all select-none shadow-sm ${
        isLight
          ? 'bg-white border-[#e7dec8] text-stone-900'
          : 'bg-slate-900 border-slate-800 text-slate-100'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
        {/* Title & Current Level Summary */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-500">
            <Bookmark className="w-4 h-4 fill-current" />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-bold">
              {lang === 'ko' ? '단계 선택' : 'Stage Selector'}
            </span>
            <span className="text-xs text-stone-400 ml-2">
              (
              {lang === 'ko'
                ? `현재 제${currentChapterNum}화 · 최고 도달 ${maxUnlockedNum}화`
                : `Current Ep. ${currentChapterNum} · Max Ep. ${maxUnlockedNum}`}
              )
            </span>
          </div>
        </div>

        {/* Quick Direct Jump Form (For jumping to Ep. 50, 300, 3000) */}
        <form onSubmit={handleDirectJump} className="flex items-center gap-1.5 self-end sm:self-auto">
          <div className="relative flex items-center">
            <Hash className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 pointer-events-none" />
            <input
              type="number"
              min={1}
              max={maxUnlockedNum}
              value={jumpInput}
              onChange={(e) => setJumpInput(e.target.value)}
              placeholder={lang === 'ko' ? '단계 이동' : 'Go to #'}
              className={`w-24 pl-7 pr-2 py-1 rounded-lg text-xs font-mono font-bold border transition-colors outline-none focus:ring-1 focus:ring-amber-500 ${
                isLight
                  ? 'bg-stone-50 border-stone-300 text-stone-900'
                  : 'bg-slate-800 border-slate-700 text-slate-100'
              }`}
            />
          </div>
          <button
            type="submit"
            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs transition-transform"
          >
            {lang === 'ko' ? '이동' : 'Go'}
          </button>
        </form>
      </div>

      {/* Compact Number Buttons Bar */}
      <div className="flex items-center gap-1.5 sm:gap-2 justify-between flex-wrap">
        {/* Page Prev */}
        <button
          onClick={handlePrevPage}
          disabled={pageStart === 0}
          title={lang === 'ko' ? '이전 10단계' : 'Prev 10'}
          className={`p-2 rounded-xl border text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
            isLight
              ? 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-700'
              : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Number Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-1 justify-center flex-wrap">
          {displayedNumbers.map((num) => {
            const idx = num - 1;
            const isUnlocked = idx <= highestUnlockedLevel;
            const isCleared = idx < highestUnlockedLevel;
            const isCurrent = idx === currentLevelIndex;

            return (
              <button
                key={num}
                onClick={() => {
                  if (isUnlocked) {
                    sound.playClick();
                    onSelectLevel(idx);
                  }
                }}
                disabled={!isUnlocked}
                title={
                  isUnlocked
                    ? `${lang === 'ko' ? `제${num}화` : `Ep. ${num}`}${isCleared ? ' (완료)' : ''}`
                    : lang === 'ko'
                    ? '이전 단계를 완료해야 열립니다'
                    : 'Locked'
                }
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-mono text-xs sm:text-sm font-bold flex items-center justify-center relative transition-all ${
                  isCurrent
                    ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400 scale-105 z-10'
                    : isCleared
                    ? isLight
                      ? 'bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100 hover:border-amber-400'
                      : 'bg-amber-950/40 border border-amber-500/40 text-amber-200 hover:bg-amber-900/50'
                    : isUnlocked
                    ? isLight
                      ? 'bg-white border border-stone-200 hover:border-amber-300 text-stone-800 hover:bg-stone-50'
                      : 'bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200'
                    : isLight
                    ? 'bg-stone-100 border border-stone-200 text-stone-400 cursor-not-allowed opacity-60'
                    : 'bg-slate-950/60 border border-slate-800 text-slate-600 cursor-not-allowed opacity-60'
                }`}
              >
                <span>{num}</span>

                {/* Subtle Mini Bookmark Tag on Cleared */}
                {isCleared && !isCurrent && (
                  <Bookmark className="w-2.5 h-2.5 fill-amber-500 text-amber-500 absolute -top-1 -right-1" />
                )}

                {/* Subtle Mini Lock on Locked */}
                {!isUnlocked && (
                  <Lock className="w-2.5 h-2.5 absolute -top-1 -right-1 text-stone-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Page Next */}
        <button
          onClick={handleNextPage}
          title={lang === 'ko' ? '다음 10단계' : 'Next 10'}
          className={`p-2 rounded-xl border text-xs font-bold transition-all ${
            isLight
              ? 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-700'
              : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200'
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
