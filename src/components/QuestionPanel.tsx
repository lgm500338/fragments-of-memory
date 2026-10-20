import React, { useState, useEffect } from 'react';
import { Question, SceneItem, QuestionResult, Language } from '../types/puzzle';
import {
  Check,
  ArrowRight,
  Minus,
  Plus,
  HelpCircle,
  MapPin,
  Mic,
  MicOff,
  Eye,
  Brain,
  Lock,
  CheckCircle2,
  Sparkles,
  Layers,
} from 'lucide-react';
import { sound } from '../utils/audio';
import { speechHandler } from '../utils/speech';

interface QuestionPanelProps {
  question: Question;
  questionIndex: number; // 0, 1, or 2 (Step 1, Step 2, Step 3)
  totalQuestions: number; // usually 3
  targetItem?: SceneItem;
  userPin: { x: number; y: number } | null;
  onSelectOption: (optionIndex: number) => void;
  selectedOptionIndex: number | null;
  onCountChange: (count: number) => void;
  selectedCount: number;
  userTypedText: string;
  onTypedTextChange: (text: string) => void;
  onSubmitAnswer: () => void;
  result: QuestionResult | null;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
  bookmarks: number;
  onUseBookmarkHint: () => void;
  activeHint: string | null;
  lang: Language;
  isLight: boolean;
  previousAnswers?: string[]; // user answers from step 1 and step 2
  fullNarrative?: string;     // Entire story sentence of the episode
  levelTitle?: string;
}

export const QuestionPanel: React.FC<QuestionPanelProps> = ({
  question,
  questionIndex,
  totalQuestions,
  targetItem,
  userPin,
  onSelectOption,
  selectedOptionIndex,
  onCountChange,
  selectedCount,
  userTypedText,
  onTypedTextChange,
  onSubmitAnswer,
  result,
  onNextQuestion,
  isLastQuestion,
  bookmarks,
  onUseBookmarkHint,
  activeHint,
  lang,
  isLight,
  previousAnswers = [],
  fullNarrative = '',
  levelTitle = '',
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [micNotice, setMicNotice] = useState<string | null>(null);

  // Memorize mode: false = showing text to memorize; true = hidden, user writing from memory!
  const [isMemorized, setIsMemorized] = useState<boolean>(false);
  // Sneak peek countdown timer (in seconds)
  const [peekSeconds, setPeekSeconds] = useState<number>(0);

  const isAnswered = result !== null;
  const stepNumber = questionIndex + 1;
  const isChunkedTextRecall = question.type === 'text_recall_typing';

  // Target sentence for this specific step:
  // Step 1: Front half ('프랑스 작가')
  // Step 2: Back half ('생택쥐페리의 어린왕자')
  // Step 3: Full sentence ('프랑스 작가 생택쥐페리의 어린왕자')
  const originalChunk = question.originalText?.[lang] || '';
  const narrativeText = fullNarrative || originalChunk;
  const targetSentence =
    stepNumber === 3 && narrativeText
      ? narrativeText
      : originalChunk || narrativeText;

  // Reset memorize state when changing question
  useEffect(() => {
    setIsMemorized(false);
    setPeekSeconds(0);
  }, [questionIndex, question.id]);

  useEffect(() => {
    return () => {
      speechHandler.stopListening();
    };
  }, []);

  // Sneak peek timer countdown
  useEffect(() => {
    if (peekSeconds <= 0) return;
    const timer = setInterval(() => {
      setPeekSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [peekSeconds]);

  const toggleSpeechRecording = () => {
    if (isRecording) {
      speechHandler.stopListening();
      setIsRecording(false);
      setMicNotice(null);
    } else {
      setMicNotice(lang === 'ko' ? '듣고 있습니다... 말씀해 주세요.' : 'Listening... please speak.');
      speechHandler.startListening(
        lang,
        (transcript) => {
          onTypedTextChange(transcript);
        },
        (errorMsg) => {
          setIsRecording(false);
          setMicNotice(errorMsg);
          setTimeout(() => setMicNotice(null), 4000);
        }
      );
      setIsRecording(true);
    }
  };

  const handleStartWriting = () => {
    sound.playClick();
    setIsMemorized(true);
  };

  const handleTriggerPeek = () => {
    sound.playHintUsed();
    setPeekSeconds(3);
  };

  const canSubmit = (() => {
    if (isAnswered) return false;
    switch (question.type) {
      case 'pin_location':
        return userPin !== null;
      case 'multiple_choice':
        return selectedOptionIndex !== null;
      case 'count_input':
        return selectedCount >= 0;
      case 'text_recall_typing':
        return isMemorized && userTypedText.trim().length > 0;
      default:
        return false;
    }
  })();

  return (
    <div
      className={`w-full rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between gap-5 select-none border transition-colors ${
        isLight
          ? 'bg-white border-[#e7dec8] text-stone-900'
          : 'bg-slate-900 border-slate-700/80 text-slate-100 shadow-2xl'
      }`}
    >
      <div>
        {/* Text Recall Memory Game Flow */}
        {isChunkedTextRecall ? (
          <div className="space-y-4">
            {/* Header: Step info & Peek Button */}
            <div
              className={`flex items-center justify-between pb-3 border-b text-xs flex-wrap gap-2 ${
                isLight ? 'border-stone-200' : 'border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-amber-500 text-sm flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  {stepNumber === 1
                    ? lang === 'ko' ? '1단계: 앞부분 기억하기 (1/3)' : 'Step 1: Front Half (1/3)'
                    : stepNumber === 2
                    ? lang === 'ko' ? '2단계: 뒷부분 기억하기 (2/3)' : 'Step 2: Back Half (2/3)'
                    : lang === 'ko' ? '3단계: 전체 문장 기억하기 (3/3)' : 'Step 3: Complete Sentence (3/3)'}
                </span>
              </div>

              {/* Sneak peek button when writing from memory */}
              {isMemorized && !isAnswered && (
                <button
                  type="button"
                  onClick={handleTriggerPeek}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 dark:bg-amber-500/20 dark:hover:bg-amber-500/30 text-amber-900 dark:text-amber-200 text-xs font-bold transition-all shadow-sm cursor-pointer border border-amber-300 dark:border-amber-500/40"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>{lang === 'ko' ? '원문 살짝보기 (3초)' : 'Peek (3s)'}</span>
                </button>
              )}
            </div>

            {/* MOMENT 1: Eye Memorize Phase (!isMemorized) */}
            {!isMemorized && !isAnswered && (
              <div
                className={`p-6 sm:p-7 rounded-2xl border-2 shadow-md text-center space-y-4 animate-in fade-in duration-200 ${
                  isLight
                    ? 'bg-amber-50/90 border-amber-300 text-stone-900'
                    : 'bg-amber-950/40 border-amber-500/50 text-amber-50'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                  <Brain className="w-4 h-4 text-amber-600" />
                  <span>
                    {stepNumber === 1
                      ? lang === 'ko' ? '1단계 문구를 눈으로 잘 기억하세요' : 'Memorize Step 1 Sentence'
                      : stepNumber === 2
                      ? lang === 'ko' ? '2단계 문구를 눈으로 잘 기억하세요' : 'Memorize Step 2 Sentence'
                      : lang === 'ko' ? '3단계 전체 문장을 눈으로 잘 기억하세요' : 'Memorize Full Sentence'}
                  </span>
                </div>

                {/* Target Sentence in Large Serif Font */}
                <div className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-wide text-stone-900 dark:text-amber-100 py-3 select-text">
                  “ {targetSentence} ”
                </div>

                <p className="text-xs text-stone-500 dark:text-slate-400">
                  {lang === 'ko'
                    ? '머릿속에 새긴 후 아래 버튼을 누르면 문구가 가려집니다.'
                    : 'Once memorized, click the button below to hide and write from memory.'}
                </p>

                {/* Big Button to Hide and Start Writing from Memory */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleStartWriting}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 text-sm font-extrabold shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{lang === 'ko' ? '🧠 기억 완료! 가리고 작성하기' : 'Memorized! Hide and Write'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* MOMENT 2: Hidden Writing Phase (isMemorized && !isAnswered) */}
            {isMemorized && !isAnswered && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Antique Hidden Parchment Plate */}
                <div
                  className={`p-5 rounded-2xl border-2 border-dashed text-center space-y-1.5 transition-all ${
                    isLight
                      ? 'bg-amber-50/50 border-amber-300/80 text-stone-700'
                      : 'bg-slate-950 border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
                    <Lock className="w-3.5 h-3.5" />
                    <span>
                      {stepNumber === 1
                        ? lang === 'ko' ? '1단계: 앞서 기억한 문구를 작성하세요' : 'Type Step 1 from memory'
                        : stepNumber === 2
                        ? lang === 'ko' ? '2단계: 앞서 기억한 문구를 작성하세요' : 'Type Step 2 from memory'
                        : lang === 'ko' ? '3단계: 전체 완성 문장을 작성하세요' : 'Type the full sentence from memory'}
                    </span>
                  </div>

                  {/* If user clicked Peek, show for 3 seconds */}
                  <div className="text-xl sm:text-2xl font-serif font-extrabold tracking-wide py-1 text-stone-900 dark:text-amber-100">
                    {peekSeconds > 0 ? (
                      <span className="text-amber-600 dark:text-amber-300 animate-pulse">
                        “ {targetSentence} ”
                      </span>
                    ) : (
                      <span className="text-stone-400 dark:text-slate-600 tracking-widest font-mono">
                        • • • • • • • •
                      </span>
                    )}
                  </div>

                  {peekSeconds > 0 && (
                    <span className="text-[11px] text-amber-700 dark:text-amber-400 font-mono block">
                      {peekSeconds}초 후 다시 가려집니다...
                    </span>
                  )}
                </div>

                {/* Step 3 Helper: previous two parts reminder */}
                {stepNumber === 3 && previousAnswers.length >= 2 && (
                  <div
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                      isLight
                        ? 'bg-stone-50 border-stone-200 text-stone-700'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>{lang === 'ko' ? '1단계+2단계를 합쳐 전체를 완성하세요' : 'Combine parts 1 & 2'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        onTypedTextChange(`${previousAnswers[0]} ${previousAnswers[1]}`.trim())
                      }
                      className="text-amber-600 dark:text-amber-400 font-bold hover:underline cursor-pointer"
                    >
                      {lang === 'ko' ? '두 조각 합치기 ➜' : 'Combine ➜'}
                    </button>
                  </div>
                )}

                {/* Textarea Input Box */}
                <div className="relative">
                  <textarea
                    value={userTypedText}
                    onChange={(e) => onTypedTextChange(e.target.value)}
                    placeholder={
                      lang === 'ko'
                        ? '기억해낸 문구를 여기에 작성하거나 마이크 🎙️를 누르세요...'
                        : 'Type the recalled sentence here or use mic 🎙️...'
                    }
                    rows={2}
                    autoFocus
                    className={`w-full p-4 pr-12 rounded-xl text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-400 font-serif resize-none shadow-inner border transition-colors ${
                      isLight
                        ? 'bg-[#fcfaf5] border-stone-300 text-stone-900 placeholder:text-stone-400'
                        : 'bg-slate-950/80 border-slate-700 text-slate-100 placeholder:text-slate-500'
                    }`}
                  />

                  {/* Microphone Button */}
                  <button
                    type="button"
                    onClick={toggleSpeechRecording}
                    title={isRecording ? '음성 녹음 중지' : '마이크로 말하기'}
                    className={`absolute right-3 bottom-3.5 p-2 rounded-lg transition-all cursor-pointer ${
                      isRecording
                        ? 'bg-red-500 text-white animate-pulse shadow-lg'
                        : isLight
                        ? 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300'
                        : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>

                {micNotice && (
                  <div className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>{micNotice}</span>
                  </div>
                )}
              </div>
            )}

            {/* MOMENT 3: Answered State (Success Confirmation) */}
            {isAnswered && (
              <div
                className={`p-5 rounded-2xl border space-y-3 animate-in fade-in duration-200 ${
                  isLight
                    ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                    : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-2 text-sm sm:text-base text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    {lang === 'ko' ? '정확하게 기억해냈습니다! (100% 정답)' : 'Brilliant Memory! (100%)'}
                  </span>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200">
                    ✓ 통과
                  </span>
                </div>
                <div className="text-sm font-serif space-y-1 pl-3 border-l-2 border-emerald-500">
                  <div>
                    <span className="text-stone-500 dark:text-slate-400 mr-2 text-xs font-sans">
                      {lang === 'ko' ? '내가 작성한 답:' : 'Your input:'}
                    </span>
                    <span className="font-bold">{userTypedText}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 dark:text-slate-400 mr-2 text-xs font-sans">
                      {lang === 'ko' ? '원문 구절:' : 'Original:'}
                    </span>
                    <span className="text-stone-700 dark:text-slate-300 font-medium">{targetSentence}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Standard Quiz Mode for Picture Mode */
          <div>
            <div className="flex items-center justify-between pb-3 border-b text-xs">
              <span className="font-extrabold text-amber-500 text-sm">
                문제 {stepNumber} / {totalQuestions}
              </span>
            </div>

            <div className="mt-4">
              <h3 className={`text-base sm:text-lg font-bold leading-snug ${isLight ? 'text-stone-900' : 'text-white'}`}>
                {question.prompt[lang]}
              </h3>
              {question.subPrompt && (
                <p className="text-xs sm:text-sm text-stone-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{question.subPrompt[lang]}</span>
                </p>
              )}
            </div>

            <div className="mt-4 space-y-4">
              {/* Pin location */}
              {question.type === 'pin_location' && !isAnswered && (
                <div className={`p-4 rounded-xl border flex items-center gap-3 ${isLight ? 'bg-stone-50 border-stone-200' : 'bg-slate-800/60 border-slate-700'}`}>
                  <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-500">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className={`text-xs ${isLight ? 'text-stone-700' : 'text-slate-300'}`}>
                    {userPin ? (
                      <span className="text-amber-600 dark:text-amber-300 font-semibold">
                        {lang === 'ko'
                          ? `위치 좌표 (X: ${userPin.x}%, Y: ${userPin.y}%) 지정 완료. [답안 제출]을 누르세요.`
                          : `Pin dropped. Click Submit.`}
                      </span>
                    ) : (
                      <span>
                        {lang === 'ko'
                          ? '화면에서 사물이 원래 있던 위치를 클릭하여 핀을 꽂으세요.'
                          : 'Click on the scene above to drop your pin.'}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Multiple Choice */}
              {question.type === 'multiple_choice' && question.options && !isAnswered && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {question.options.map((opt, idx) => {
                    const isSelected = selectedOptionIndex === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          sound.playClick();
                          onSelectOption(idx);
                        }}
                        className={`p-3 rounded-xl text-left text-xs sm:text-sm font-medium transition-all border flex items-center gap-3 ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500 text-amber-900 dark:text-amber-200 shadow-sm'
                            : isLight
                            ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800'
                            : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-slate-200'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${isSelected ? 'bg-amber-500 text-slate-950' : isLight ? 'bg-stone-200 text-stone-700' : 'bg-slate-700 text-slate-300'}`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="truncate">{opt[lang]}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Count Stepper */}
              {question.type === 'count_input' && !isAnswered && (
                <div className={`p-4 rounded-xl border flex items-center justify-center gap-4 ${isLight ? 'bg-stone-50 border-stone-200' : 'bg-slate-800/60 border-slate-700'}`}>
                  <button
                    onClick={() => {
                      sound.playClick();
                      onCountChange(Math.max(0, selectedCount - 1));
                    }}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${isLight ? 'bg-stone-200 hover:bg-stone-300 text-stone-800' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="w-24 text-center">
                    <span className="text-3xl font-extrabold text-amber-500 font-mono tabular-nums">
                      {selectedCount}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      sound.playClick();
                      onCountChange(selectedCount + 1);
                    }}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${isLight ? 'bg-stone-200 hover:bg-stone-300 text-stone-800' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer Button */}
      <div
        className={`pt-3 border-t flex items-center justify-between ${
          isLight ? 'border-stone-200' : 'border-slate-800'
        }`}
      >
        {!isAnswered ? (
          isChunkedTextRecall && !isMemorized ? (
            /* During Memorize Phase, the main action is in the card: '기억 완료! 가리고 작성하기' */
            <button
              onClick={handleStartWriting}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 text-base font-extrabold shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Brain className="w-5 h-5" />
              <span>{lang === 'ko' ? '기억 완료! 가리고 작성하기' : 'Memorized! Start Writing'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            /* During Hidden Writing Phase */
            <button
              disabled={!canSubmit}
              onClick={() => {
                sound.playClick();
                onSubmitAnswer();
              }}
              className={`w-full py-3.5 rounded-xl text-base font-bold shadow-md transition-all flex items-center justify-center gap-2 ${
                canSubmit
                  ? 'bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 cursor-pointer shadow-amber-500/20'
                  : 'bg-stone-200 text-stone-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed'
              }`}
            >
              <Check className="w-5 h-5 stroke-[3]" />
              <span>
                {isChunkedTextRecall
                  ? stepNumber === 1
                    ? lang === 'ko' ? '1단계 답안 확인' : 'Check Step 1'
                    : stepNumber === 2
                    ? lang === 'ko' ? '2단계 답안 확인' : 'Check Step 2'
                    : lang === 'ko' ? '3단계 전체 문장 확인' : 'Check Step 3'
                  : lang === 'ko' ? '답안 제출' : 'Submit Answer'}
              </span>
            </button>
          )
        ) : (
          /* Next Question / Episode Complete */
          <button
            onClick={() => {
              sound.playClick();
              onNextQuestion();
            }}
            className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 text-base font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shadow-amber-500/30"
          >
            <span>
              {isLastQuestion
                ? lang === 'ko'
                  ? '🌟 이번 화 완료! 결과 확인'
                  : '🌟 Episode Complete! View Results'
                : stepNumber === 1
                ? lang === 'ko'
                  ? '다음 2단계로 (뒷부분 기억하기) →'
                  : 'Next: Step 2 (Back Half) →'
                : lang === 'ko'
                ? '마지막 3단계로 (전체 문장 기억하기) →'
                : 'Next: Step 3 (Full Complete) →'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
