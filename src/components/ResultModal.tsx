import React, { useEffect } from 'react';
import { LevelData, QuestionResult, Language } from '../types/puzzle';
import { Bookmark, RotateCcw, ArrowRight, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface ResultModalProps {
  level: LevelData;
  results: QuestionResult[];
  onNextLevel: () => void;
  onRetryLevel: () => void;
  bookmarksEarned: number;
  totalBookmarks: number;
  lang: Language;
}

const KO_COMPLIMENTS = [
  '점점 더 똑똑해지고 있어요! 🧠',
  '당신은 몰랐을 거예요, 당신이 천재라는 사실을! ✨',
  '정말 멋지게 기억해냈어요! 👏',
  '두뇌의 기억 회로가 환하게 깨어났습니다! 🌟',
  '놀라운 집중력입니다! 완벽한 기억력이에요. 💯',
  '기억의 퍼즐 조각을 완벽하게 맞췄습니다! 📖',
];

const EN_COMPLIMENTS = [
  'Your brain is getting sharper every moment! 🧠',
  'You probably didn’t know it, but you are a genius! ✨',
  'You recalled it so brilliantly! 👏',
  'Your memory neural network is wide awake! 🌟',
  'Astounding focus and impeccable recall! 💯',
  'The fragments of memory came together beautifully! 📖',
];

export const ResultModal: React.FC<ResultModalProps> = ({
  level,
  results,
  onNextLevel,
  onRetryLevel,
  bookmarksEarned,
  totalBookmarks,
  lang,
}) => {
  const correctCount = results.filter((r) => r.isCorrect).length;
  const totalQuestions = results.length;
  const accuracyRate = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const isPassed = accuracyRate >= 65;

  // Pick an encouraging compliment based on level number
  const complimentIndex = (level.levelNumber + results.length) % KO_COMPLIMENTS.length;
  const compliment = lang === 'ko' ? KO_COMPLIMENTS[complimentIndex] : EN_COMPLIMENTS[complimentIndex];

  useEffect(() => {
    if (bookmarksEarned > 0) {
      sound.playBookmarkEarned();
    } else if (isPassed) {
      sound.playSuccess();
    } else {
      sound.playError();
    }
  }, [bookmarksEarned, isPassed]);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-7 shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-center">
        {/* Top Badge Icon */}
        <div className="flex flex-col items-center">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-3 ${
              isPassed
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-bounce'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            {isPassed ? <Bookmark className="w-8 h-8 fill-amber-400" /> : <RotateCcw className="w-8 h-8" />}
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center justify-center gap-1.5 flex-wrap">
            <span>{isPassed ? compliment : lang === 'ko' ? '조금 더 주의 깊게 관찰해 보세요' : 'Try Observing Once More'}</span>
          </h2>
          <p className="text-xs text-amber-300/80 mt-1.5 font-medium">
            {level.title[lang]}
          </p>
        </div>

        {/* Minimalist Stats */}
        <div className="grid grid-cols-2 gap-3 my-5">
          <div className="bg-slate-800/80 border border-slate-700 p-3.5 rounded-xl">
            <div className="text-xs text-slate-400">
              {lang === 'ko' ? '기억 정확도' : 'Accuracy'}
            </div>
            <div className="text-xl font-black text-amber-300 mt-0.5 tabular-nums">
              {accuracyRate}%
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              ({correctCount} / {totalQuestions})
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 p-3.5 rounded-xl">
            <div className="text-xs text-slate-400">
              {lang === 'ko' ? '보유 책갈피' : 'Total Bookmarks'}
            </div>
            <div className="text-xl font-black text-amber-400 mt-0.5 tabular-nums flex items-center justify-center gap-1">
              <Bookmark className="w-4 h-4 fill-amber-400" />
              <span>{totalBookmarks}</span>
            </div>
            <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">
              {bookmarksEarned > 0 ? `+${bookmarksEarned} ${lang === 'ko' ? '획득' : 'earned'}` : '0'}
            </div>
          </div>
        </div>

        {/* Bookmark Award Banner - 1 bookmark per level */}
        {bookmarksEarned > 0 ? (
          <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>
              {lang === 'ko'
                ? `정답률 ${accuracyRate}% 달성! 책갈피 ${bookmarksEarned}개를 끼워 넣었습니다 🔖`
                : `Accuracy ${accuracyRate}%! Placed ${bookmarksEarned} bookmark 🔖`}
            </span>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-400 text-xs mb-6">
            {lang === 'ko'
              ? '정답률 65% 이상을 달성하면 소중한 책갈피를 얻을 수 있습니다.'
              : 'Achieve 65%+ accuracy to earn a precious bookmark.'}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onRetryLevel();
            }}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-700 hover:bg-slate-800 active:scale-95 text-slate-300 font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{lang === 'ko' ? '다시 도전' : 'Retry'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onNextLevel();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
          >
            <span>{lang === 'ko' ? '다음 단계로' : 'Next Stage'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
