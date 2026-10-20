import React, { useState } from 'react';
import { CategoryType, Language } from '../types/puzzle';
import { Clock, Check, Volume2, Square } from 'lucide-react';
import { sound } from '../utils/audio';
import { speechHandler } from '../utils/speech';

interface ClueReaderProps {
  category: CategoryType;
  title: string;
  narrative: string;
  authorOrSource?: string;
  timeLeft: number;
  totalTime: number;
  onReadyToRecall: () => void;
  lang: Language;
  isLight: boolean;
}

export const ClueReader: React.FC<ClueReaderProps> = ({
  category,
  title,
  narrative,
  authorOrSource,
  timeLeft,
  totalTime,
  onReadyToRecall,
  lang,
  isLight,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const timeProgressPercent = totalTime > 0 ? (timeLeft / totalTime) * 100 : 100;

  const handleReadAloud = () => {
    if (isPlayingAudio) {
      speechHandler.stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      speechHandler.speakText(narrative, lang, () => {
        setIsPlayingAudio(false);
      });
    }
  };

  const isPicture = category === 'picture';

  return (
    <div
      className={`w-full rounded-2xl p-6 sm:p-7 shadow-xl flex flex-col justify-between gap-5 select-none border transition-colors ${
        isLight
          ? 'bg-white border-[#e7dec8] text-stone-900'
          : 'bg-slate-900 border-slate-700/80 text-slate-100 shadow-2xl'
      }`}
    >
      <div>
        {/* Prominent Tailored Instruction Banner */}
        <div
          className={`p-3.5 sm:p-4 rounded-xl border-2 flex items-center justify-between gap-3 shadow-sm ${
            isLight
              ? 'bg-amber-50/80 border-amber-400/70 text-amber-950'
              : 'bg-amber-500/15 border-amber-500/40 text-amber-200'
          }`}
        >
          <p className="text-sm sm:text-base md:text-lg font-extrabold tracking-tight leading-snug">
            {isPicture
              ? lang === 'ko'
                ? '사물의 위치와 수량, 세부 단서를 머릿속에 기억하세요.'
                : 'Remember the locations, quantities, and subtle clues in your mind.'
              : lang === 'ko'
              ? '문장의 단어와 띄어쓰기를 머릿속에 기억하세요.'
              : 'Remember the words and spacing of the sentence in your mind.'}
          </p>

          {totalTime > 0 && (
            <div
              className={`flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-lg border ${
                isLight
                  ? 'bg-white border-amber-300 text-amber-800'
                  : 'bg-slate-950/80 border-amber-500/40 text-amber-300'
              }`}
            >
              <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
              <span className="text-sm font-bold font-mono tabular-nums">
                {timeLeft}s
              </span>
            </div>
          )}
        </div>

        {/* Level Title and TTS Audio Read Button */}
        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <h2
              className={`text-lg sm:text-xl font-bold ${
                isLight ? 'text-stone-900' : 'text-white'
              }`}
            >
              {title}
            </h2>
            {authorOrSource && (
              <span
                className={`text-xs font-semibold mt-0.5 block ${
                  isLight ? 'text-amber-800' : 'text-amber-400/90'
                }`}
              >
                {authorOrSource}
              </span>
            )}
          </div>

          {/* AI Voice Read Aloud Button (TTS) */}
          {!isPicture && (
            <button
              onClick={handleReadAloud}
              title={isPlayingAudio ? '읽기 멈추기' : '소리 내어 듣기'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shrink-0 ${
                isPlayingAudio
                  ? 'bg-amber-500 text-slate-950 border-amber-600 animate-pulse'
                  : isLight
                  ? 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>{lang === 'ko' ? '정지' : 'Stop'}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                  <span>{lang === 'ko' ? '문장 듣기' : 'Listen'}</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Narrative Text Content */}
        <div
          className={`mt-4 p-5 rounded-xl border text-sm sm:text-base leading-relaxed font-serif whitespace-pre-line shadow-inner ${
            isLight
              ? 'bg-[#f8f5ee] border-[#e7dec8] text-stone-900'
              : 'bg-slate-950/70 border-slate-800 text-slate-100'
          }`}
        >
          {narrative}
        </div>
      </div>

      {/* Progress Bar (if timed) */}
      {totalTime > 0 && (
        <div
          className={`w-full rounded-full h-1.5 overflow-hidden ${
            isLight ? 'bg-stone-200' : 'bg-slate-800'
          }`}
        >
          <div
            style={{ width: `${timeProgressPercent}%` }}
            className={`h-full transition-all duration-300 ${
              timeLeft <= 5 ? 'bg-red-500' : 'bg-amber-500'
            }`}
          />
        </div>
      )}

      {/* Proceed Button */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={() => {
            speechHandler.stopSpeaking();
            sound.playTransition();
            onReadyToRecall();
          }}
          className="w-full sm:w-auto px-7 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-extrabold text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Check className="w-5 h-5 stroke-[3]" />
          <span>{lang === 'ko' ? '기억 완료! (문제 풀기)' : 'Memorized! (Start Recall)'}</span>
        </button>
      </div>
    </div>
  );
};
