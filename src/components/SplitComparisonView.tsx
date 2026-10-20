import React from 'react';
import { Language } from '../types/puzzle';
import { CheckCircle2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';
import { normalizeKoreanText } from '../utils/textComparison';

interface SplitComparisonViewProps {
  originalText: string;
  userText: string;
  keyWords: string[];
  matchPercentage: number;
  explanation: string;
  onProceed: () => void;
  lang: Language;
  isLight: boolean;
}

export const SplitComparisonView: React.FC<SplitComparisonViewProps> = ({
  originalText,
  userText,
  keyWords,
  matchPercentage,
  explanation,
  onProceed,
  lang,
  isLight,
}) => {
  const isPassed = matchPercentage >= 65;
  const normalizedUser = normalizeKoreanText(userText);

  return (
    <div
      className={`w-full rounded-2xl p-6 sm:p-7 shadow-2xl flex flex-col gap-5 select-none border transition-colors ${
        isLight
          ? 'bg-white border-[#e7dec8] text-stone-900'
          : 'bg-slate-900 border-slate-700/80 text-slate-100'
      }`}
    >
      {/* Header Result Badge */}
      <div
        className={`flex items-center justify-between border-b pb-3.5 flex-wrap gap-2 ${
          isLight ? 'border-stone-200' : 'border-slate-800'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {isPassed ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
          ) : (
            <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
          )}
          <div>
            <h3
              className={`text-base sm:text-lg font-bold ${
                isLight ? 'text-stone-900' : 'text-white'
              }`}
            >
              {isPassed
                ? lang === 'ko'
                  ? '기억 대조 완료 (성공)'
                  : 'Recall Match Succeeded!'
                : lang === 'ko'
                ? '기억 대조 완료'
                : 'Recall Completed'}
            </h3>
            <p className="text-xs text-stone-500 dark:text-slate-400">
              {lang === 'ko'
                ? '상단 원본 문장과 하단 작성 답안을 대조해 보세요.'
                : 'Compare the original text above with your answer below.'}
            </p>
          </div>
        </div>

        {/* Match Percentage Tag */}
        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border ${
            isLight
              ? 'bg-stone-100 border-stone-200 text-stone-800'
              : 'bg-slate-800 border-slate-700 text-slate-200'
          }`}
        >
          <span className="text-xs text-stone-500">
            {lang === 'ko' ? '일치도' : 'Accuracy'}:
          </span>
          <span
            className={`text-base sm:text-lg font-bold font-mono tabular-nums ${
              matchPercentage >= 90
                ? 'text-emerald-500'
                : matchPercentage >= 65
                ? 'text-amber-500'
                : 'text-rose-500'
            }`}
          >
            {matchPercentage}%
          </span>
        </div>
      </div>

      {/* Top Pane: Original Text */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
          <span>{lang === 'ko' ? '1. 원본 텍스트' : '1. Original Text'}</span>
          <span className="text-[11px] font-normal text-stone-400">
            {lang === 'ko' ? '원래 기록된 문장' : 'Original reference text'}
          </span>
        </div>
        <div
          className={`p-4 rounded-xl border text-sm sm:text-base leading-relaxed font-serif shadow-inner whitespace-pre-line ${
            isLight
              ? 'bg-amber-50/70 border-amber-300/80 text-amber-950 font-medium'
              : 'bg-amber-950/25 border-amber-500/30 text-amber-100'
          }`}
        >
          {originalText}
        </div>
      </div>

      {/* Bottom Pane: User Input Text */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold text-cyan-600 dark:text-cyan-400">
          <span>
            {lang === 'ko' ? '2. 내가 기억해낸 답안' : '2. Your Recalled Answer'}
          </span>
          <span className="text-[11px] font-normal text-stone-400">
            {lang === 'ko' ? '음성 또는 타이핑으로 입력한 문장' : 'Answer submitted via voice/typing'}
          </span>
        </div>
        <div
          className={`p-4 rounded-xl border text-sm sm:text-base leading-relaxed font-serif shadow-inner min-h-[70px] whitespace-pre-line ${
            isLight
              ? 'bg-stone-50 border-stone-200 text-stone-800'
              : 'bg-slate-800/80 border-slate-700 text-slate-200'
          }`}
        >
          {userText.trim() ? (
            userText
          ) : (
            <span className="text-stone-400 italic">
              {lang === 'ko' ? '(입력된 내용이 없습니다)' : '(No text entered)'}
            </span>
          )}
        </div>
      </div>

      {/* Keyword Retention Check */}
      {keyWords && keyWords.length > 0 && (
        <div
          className={`p-3.5 rounded-xl border flex flex-col gap-2 ${
            isLight ? 'bg-stone-50 border-stone-200' : 'bg-slate-800/40 border-slate-700/60'
          }`}
        >
          <div className="text-xs font-bold text-stone-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{lang === 'ko' ? '핵심 단어 기억 여부' : 'Key Elements Recall'}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {keyWords.map((word, idx) => {
              const normWord = normalizeKoreanText(word);
              const matched = normalizedUser.includes(normWord);
              return (
                <span
                  key={idx}
                  className={`px-2.5 py-0.5 rounded-md text-xs font-medium border transition-colors ${
                    matched
                      ? isLight
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-800 font-semibold'
                        : 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300 font-semibold'
                      : isLight
                      ? 'bg-stone-100 border-stone-200 text-stone-400'
                      : 'bg-slate-800 border-slate-700 text-slate-500'
                  }`}
                >
                  {matched ? '✓ ' : '· '}
                  {word}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Explanation Quote */}
      <p
        className={`text-xs leading-relaxed font-sans border-t pt-3 ${
          isLight ? 'border-stone-200 text-stone-600' : 'border-slate-800 text-slate-400'
        }`}
      >
        {explanation}
      </p>

      {/* Proceed Button */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={() => {
            sound.playClick();
            onProceed();
          }}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
        >
          <span>{lang === 'ko' ? '다음으로 진행' : 'Continue'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
