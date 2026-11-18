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
  passed?: boolean;
  needCorrect?: number;
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

// 폭죽 불꽃 (두 번 터짐)
const SPARK_COLORS = ['#fbbf24', '#f472b6', '#60a5fa', '#34d399', '#f87171', '#a78bfa', '#fde68a'];
const SPARKS = Array.from({ length: 36 }, (_, i) => {
  const burst = i < 18 ? 0 : 1;
  const a = ((i % 18) / 18) * Math.PI * 2 + burst * 0.17;
  const dist = 90 + (i % 3) * 22;
  return {
    x: Math.round(Math.cos(a) * dist + (burst ? 40 : -40)),
    y: Math.round(Math.sin(a) * dist * 0.7),
    c: SPARK_COLORS[i % SPARK_COLORS.length],
    d: burst ? 650 : 50,
  };
});

export const ResultModal: React.FC<ResultModalProps> = ({
  level,
  results,
  onNextLevel,
  onRetryLevel,
  bookmarksEarned,
  totalBookmarks,
  lang,
  passed,
  needCorrect = 0,
}) => {
  const correctCount = results.filter((r) => r.isCorrect).length;
  const totalQuestions = results.length;
  const accuracyRate = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const isPassed = passed ?? accuracyRate >= 65;

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
        {/* 통과: 칭찬 글자가 폭죽처럼 터지며 나타남 / 실패: 다시 도전 아이콘 */}
        <div className="flex flex-col items-center">
          {isPassed ? (
            <div className="relative py-4 w-full" aria-label={compliment}>
              <div className="fw-sparks" aria-hidden="true">
                {SPARKS.map((sp, i) => (
                  <i
                    key={i}
                    style={{ '--x': `${sp.x}px`, '--y': `${sp.y}px`, background: sp.c, animationDelay: `${sp.d}ms` } as React.CSSProperties}
                  />
                ))}
              </div>
              <h2 className="relative text-xl sm:text-2xl font-black text-white leading-snug break-keep" aria-hidden="true">
                {Array.from(compliment).map((ch, i, arr) => {
                  const a = (i / Math.max(1, arr.length - 1)) * Math.PI * 2;
                  return (
                    <span
                      key={i}
                      className="fw-char"
                      style={{
                        '--dx': `${Math.cos(a) * 60}px`,
                        '--dy': `${Math.sin(a) * 40 + 20}px`,
                        '--r': `${(i % 2 ? 1 : -1) * 90}deg`,
                        animationDelay: `${120 + i * 45}ms, ${900 + i * 45}ms`,
                      } as React.CSSProperties}
                    >
                      {ch === ' ' ? '\u00a0' : ch}
                    </span>
                  );
                })}
              </h2>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-3 bg-slate-800 text-slate-400 border border-slate-700">
                <RotateCcw className="w-8 h-8" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {lang === 'ko' ? '조금 더 주의 깊게 관찰해 보세요' : 'Try Observing Once More'}
              </h2>
            </>
          )}
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
              ? `${totalQuestions}문제 중 ${needCorrect}문제 이상 맞혀야 다음 판이 열려요. 다시 도전해 보세요!`
              : `Get at least ${needCorrect} of ${totalQuestions} right to unlock the next stage.`}
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

          {isPassed && (
          <button
            onClick={() => {
              sound.playClick();
              onNextLevel();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
          >
            <span>{lang === 'ko' ? '다음 판으로' : 'Next Stage'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          )}
        </div>
      </div>
    </div>
  );
};
