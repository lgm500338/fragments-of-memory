import React, { useState, useEffect, useRef } from 'react';
import { CATEGORY_LEVELS } from './data/categoryLevels';
import { generateDynamicLevel } from './utils/proceduralGenerator';
import { CategoryType, GamePhase, Language, LevelData, PlayerStats, QuestionResult } from './types/puzzle';
import { sound } from './utils/audio';
import { Header } from './components/Header';
import { SceneRenderer } from './components/SceneRenderer';
import { ClueReader } from './components/ClueReader';
import { QuestionPanel } from './components/QuestionPanel';
import { SplitComparisonView } from './components/SplitComparisonView';
import { ResultModal } from './components/ResultModal';
import { LevelSelector } from './components/LevelSelector';
import { RotateCcw } from 'lucide-react';
import { computeTextSimilarity } from './utils/textComparison';

const INITIAL_STATS: PlayerStats = {
  bookmarks: 3, // Welcome gift of 3 bookmarks
  totalScore: 0,
  levelsCompleted: 0,
  unlockedProgress: {
    tale_novel: 0,
    picture: 0,
    quote: 0,
  },
};

export default function App() {
  const [lang, setLang] = useState<Language>('ko');
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    try {
      return (localStorage.getItem('fragments_theme_mode') as 'light' | 'dark') || 'light';
    } catch {
      return 'light';
    }
  });

  const [currentCategory, setCurrentCategory] = useState<CategoryType>('tale_novel');
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Player Stats with localStorage persistence
  const [playerStats, setPlayerStats] = useState<PlayerStats>(() => {
    try {
      const saved = localStorage.getItem('fragments_memory_v6_stats');
      return saved ? JSON.parse(saved) : INITIAL_STATS;
    } catch {
      return INITIAL_STATS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('fragments_memory_v6_stats', JSON.stringify(playerStats));
    } catch {}
  }, [playerStats]);

  useEffect(() => {
    try {
      localStorage.setItem('fragments_theme_mode', themeMode);
    } catch {}
  }, [themeMode]);

  const handleToggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const isLight = themeMode === 'light';

  // Current Level resolution: Handcrafted or Dynamic Infinite Generator
  const baseLevels =
    CATEGORY_LEVELS[currentCategory] ||
    CATEGORY_LEVELS.tale_novel ||
    CATEGORY_LEVELS[Object.keys(CATEGORY_LEVELS)[0]];

  const currentLevel: LevelData =
    currentLevelIndex < baseLevels.length
      ? baseLevels[currentLevelIndex]
      : generateDynamicLevel(currentCategory, currentLevelIndex + 1);

  // Game Phases & State
  const [phase, setPhase] = useState<GamePhase>('OBSERVATION');
  const [timeLeft, setTimeLeft] = useState<number>(currentLevel.observationTimeLimit);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);
  const [userPin, setUserPin] = useState<{ x: number; y: number } | null>(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [selectedCount, setSelectedCount] = useState<number>(0);
  const [userTypedText, setUserTypedText] = useState<string>('');
  const [currentQuestionResult, setCurrentQuestionResult] = useState<QuestionResult | null>(null);
  const [levelResults, setLevelResults] = useState<QuestionResult[]>([]);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [bookmarksEarned, setBookmarksEarned] = useState<number>(0);

  // Previous answers for Step 1 and Step 2 (to assist Step 3 full combination)
  const [previousStepAnswers, setPreviousStepAnswers] = useState<string[]>([]);
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [hintItemHighlight, setHintItemHighlight] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleToggleMute = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  };

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'ko' ? 'en' : 'ko'));
  };

  const startLevel = (lvl: LevelData) => {
    const isTextCategory = currentCategory === 'tale_novel' || currentCategory === 'quote';
    setPhase(isTextCategory ? 'RECALL' : 'OBSERVATION');
    setTimeLeft(lvl.observationTimeLimit);
    setActiveQuestionIdx(0);
    setUserPin(null);
    setSelectedOptionIndex(null);
    setSelectedCount(0);
    setUserTypedText('');
    setCurrentQuestionResult(null);
    setLevelResults([]);
    setShowResultModal(false);
    setActiveHint(null);
    setHintItemHighlight(false);
    setPreviousStepAnswers([]);
  };

  useEffect(() => {
    startLevel(currentLevel);
  }, [currentCategory, currentLevelIndex]);

  // Observation Timer countdown (if timed)
  useEffect(() => {
    if (phase === 'OBSERVATION' && currentLevel.observationTimeLimit > 0) {
      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            sound.playTransition();
            setPhase('RECALL');
            return 0;
          }
          if (prev <= 4) {
            sound.playTick();
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, currentLevel]);

  const handleReadyToRecall = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    sound.playTransition();
    setPhase('RECALL');
  };

  const safeQuestionIdx = Math.max(
    0,
    Math.min(activeQuestionIdx, (currentLevel?.questions?.length || 1) - 1)
  );
  const activeQuestion =
    currentLevel?.questions?.[safeQuestionIdx] ||
    currentLevel?.questions?.[0] ||
    {
      id: 'fallback-q',
      type: 'text_recall_typing' as const,
      prompt: { ko: '', en: '' },
      explanation: { ko: '', en: '' },
      points: 100,
    };
  const targetItem = currentLevel.items?.find((it) => it.id === activeQuestion?.targetItemId);

  // Bookmark Hint Use
  const handleUseBookmarkHint = () => {
    if (playerStats.bookmarks <= 0) return;

    setPlayerStats((prev) => ({
      ...prev,
      bookmarks: Math.max(0, prev.bookmarks - 1),
    }));
    sound.playHintUsed();
  };

  // Submit Answer
  const handleSubmitAnswer = () => {
    if (!activeQuestion) return;

    let isCorrect = false;
    let distanceError: number | undefined = undefined;
    let matchPercentage: number | undefined = undefined;
    let awardedPoints = 0;

    switch (activeQuestion.type) {
      case 'pin_location': {
        if (!userPin || !targetItem) break;
        const dx = userPin.x - targetItem.x;
        const dy = userPin.y - targetItem.y;
        distanceError = Math.sqrt(dx * dx + dy * dy);
        isCorrect = distanceError <= targetItem.radius;
        if (isCorrect) awardedPoints = activeQuestion.points;
        break;
      }

      case 'multiple_choice': {
        isCorrect = selectedOptionIndex === activeQuestion.correctOptionIndex;
        if (isCorrect) awardedPoints = activeQuestion.points;
        break;
      }

      case 'count_input': {
        isCorrect = selectedCount === activeQuestion.expectedCount;
        if (isCorrect) awardedPoints = activeQuestion.points;
        break;
      }

      case 'text_recall_typing': {
        const origText = activeQuestion.originalText?.[lang] || '';
        const fullStory = currentLevel.storyNarrative?.[lang] || '';
        matchPercentage = computeTextSimilarity(userTypedText, origText, fullStory);
        isCorrect = matchPercentage >= 60;
        if (isCorrect) awardedPoints = activeQuestion.points;
        break;
      }
    }

    if (activeQuestion.type === 'text_recall_typing' && !isCorrect) {
      sound.playError();
      setActiveHint(
        lang === 'ko'
          ? `일치도 ${matchPercentage}%. 아쉬워요! 단어와 띄어쓰기를 확인해 보세요. (상단 [원문 보기] 버튼으로 정답을 바로 확인할 수 있습니다)`
          : `Similarity: ${matchPercentage}%. Check words and spacing. (Click [View Original] above)`
      );
      return;
    }

    // Success
    sound.playSuccess();
    if (activeQuestion.type === 'text_recall_typing') {
      setPreviousStepAnswers((prev) => [...prev, userTypedText.trim()]);
    }

    const questionResult: QuestionResult = {
      questionId: activeQuestion.id,
      isCorrect: true,
      scoreAwarded: awardedPoints,
      userSelection:
        activeQuestion.type === 'pin_location'
          ? userPin || undefined
          : activeQuestion.type === 'count_input'
          ? selectedCount
          : activeQuestion.type === 'text_recall_typing'
          ? userTypedText
          : selectedOptionIndex ?? undefined,
      targetItem,
      distanceError,
      textMatchPercentage: matchPercentage,
    };

    setCurrentQuestionResult(questionResult);
    setLevelResults((prev) => [...prev, questionResult]);
    setPhase('FEEDBACK');
  };

  // Next Question or Finish Level (Exactly 3 steps per episode)
  const handleNextQuestion = () => {
    if (activeQuestionIdx + 1 < currentLevel.questions.length) {
      setActiveQuestionIdx((prev) => prev + 1);
      setUserPin(null);
      setSelectedOptionIndex(null);
      setSelectedCount(0);
      setUserTypedText('');
      setCurrentQuestionResult(null);
      setActiveHint(null);
      setPhase('RECALL');
    } else {
      // Completed all 3 steps of this episode!
      const earned = 1; // Exactly 1 bookmark reward per episode

      setPlayerStats((prev) => ({
        ...prev,
        bookmarks: prev.bookmarks + earned,
        levelsCompleted: prev.levelsCompleted + 1,
        unlockedProgress: {
          ...prev.unlockedProgress,
          [currentCategory]: Math.max(
            prev.unlockedProgress[currentCategory] || 0,
            currentLevelIndex + 1
          ),
        },
      }));

      setBookmarksEarned(earned);
      setShowResultModal(true);
    }
  };

  // Proceed to next level infinitely
  const handleProceedNextLevel = () => {
    setShowResultModal(false);
    setCurrentLevelIndex((prev) => prev + 1);
  };

  // Retry level
  const handleRetryCurrentLevel = () => {
    setShowResultModal(false);
    startLevel(currentLevel);
  };

  const isPictureCategory = currentCategory === 'picture';
  const isSplitComparisonMode =
    currentQuestionResult !== null && activeQuestion.type === 'text_recall_typing';

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors ${
        isLight
          ? 'bg-[#fcfaf5] text-stone-900'
          : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* 3-Zone Clean Header with Unified '기억동화·소설' */}
      <Header
        currentCategory={currentCategory}
        onSelectCategory={(cat) => {
          sound.playClick();
          setCurrentCategory(cat);
          setCurrentLevelIndex(0);
          setPhase(cat === 'picture' ? 'OBSERVATION' : 'RECALL');
          setActiveQuestionIdx(0);
          setUserPin(null);
          setSelectedOptionIndex(null);
          setSelectedCount(0);
          setUserTypedText('');
          setCurrentQuestionResult(null);
          setLevelResults([]);
          setShowResultModal(false);
          setActiveHint(null);
          setHintItemHighlight(false);
          setPreviousStepAnswers([]);
        }}
        bookmarks={playerStats.bookmarks}
        lang={lang}
        onToggleLang={handleToggleLang}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        themeMode={themeMode}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Level Indicator & Action Bar */}
        <div
          className={`flex items-center justify-between pb-3 border-b flex-wrap gap-3 ${
            isLight ? 'border-stone-200' : 'border-slate-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-mono font-bold px-2.5 py-1 rounded border ${
                isLight
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}
            >
              {currentLevel.title[lang].split(':')[0]}
            </span>
            <span
              className={`text-base sm:text-lg font-bold ${
                isLight ? 'text-stone-900' : 'text-white'
              }`}
            >
              {currentLevel.title[lang].split(':')[1] || currentLevel.title[lang]}
            </span>
            {currentLevel.subtitle && (
              <span className="text-xs text-stone-400 hidden sm:inline">
                · {currentLevel.subtitle[lang]}
              </span>
            )}
          </div>

          <button
            onClick={() => {
              sound.playClick();
              startLevel(currentLevel);
            }}
            title={lang === 'ko' ? '다시 시작' : 'Restart Level'}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 cursor-pointer ${
              isLight
                ? 'bg-white hover:bg-stone-100 text-stone-700 border-stone-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'ko' ? '다시 시작' : 'Restart'}</span>
          </button>
        </div>

        {/* Dynamic Puzzle Workspace */}
        {isSplitComparisonMode ? (
          /* Split Comparison View (Step Result with Praise & Compliments) */
          <div className="max-w-3xl mx-auto">
            <SplitComparisonView
              originalText={activeQuestion.originalText?.[lang] || ''}
              userText={userTypedText}
              keyWords={activeQuestion.keyWords?.[lang] || []}
              matchPercentage={currentQuestionResult.textMatchPercentage || 100}
              explanation={activeQuestion.explanation[lang]}
              onProceed={handleNextQuestion}
              lang={lang}
              isLight={isLight}
            />
          </div>
        ) : isPictureCategory ? (
          /* Picture Mode: Interactive Canvas + Questions */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-3">
              <SceneRenderer
                illustrationType={currentLevel.illustrationType}
                artStyle={currentLevel.artStyle}
                levelNumber={currentLevel.levelNumber}
                items={currentLevel.items}
                phase={phase}
                activeQuestion={activeQuestion}
                userPin={userPin}
                onDropPin={(coords) => setUserPin(coords)}
                showFeedbackResults={phase === 'FEEDBACK'}
                hintItemHighlight={hintItemHighlight}
                lang={lang}
                compact={false}
                isLight={isLight}
              />
            </div>

            <div className="lg:col-span-5 space-y-4">
              {phase === 'OBSERVATION' ? (
                <ClueReader
                  category={currentCategory}
                  title={currentLevel.title[lang]}
                  narrative={currentLevel.storyNarrative[lang]}
                  authorOrSource={currentLevel.authorOrSource?.[lang]}
                  timeLeft={timeLeft}
                  totalTime={currentLevel.observationTimeLimit}
                  onReadyToRecall={handleReadyToRecall}
                  lang={lang}
                  isLight={isLight}
                />
              ) : (
                <QuestionPanel
                  question={activeQuestion}
                  questionIndex={activeQuestionIdx}
                  totalQuestions={currentLevel.questions.length}
                  targetItem={targetItem}
                  userPin={userPin}
                  onSelectOption={(idx) => setSelectedOptionIndex(idx)}
                  selectedOptionIndex={selectedOptionIndex}
                  onCountChange={(cnt) => setSelectedCount(cnt)}
                  selectedCount={selectedCount}
                  userTypedText={userTypedText}
                  onTypedTextChange={(txt) => setUserTypedText(txt)}
                  onSubmitAnswer={handleSubmitAnswer}
                  result={currentQuestionResult}
                  onNextQuestion={handleNextQuestion}
                  isLastQuestion={activeQuestionIdx + 1 === currentLevel.questions.length}
                  bookmarks={playerStats.bookmarks}
                  onUseBookmarkHint={handleUseBookmarkHint}
                  activeHint={activeHint}
                  lang={lang}
                  isLight={isLight}
                  previousAnswers={previousStepAnswers}
                  fullNarrative={currentLevel.storyNarrative[lang]}
                  levelTitle={currentLevel.title[lang]}
                />
              )}
            </div>
          </div>
        ) : (
          /* Storybook Tale & Novel / Quote Mode: High-Class Folio Layout */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left Column: Elegant Bookplate Plate */}
            <div className="md:col-span-5 flex flex-col items-center gap-3">
              <SceneRenderer
                illustrationType={currentLevel.illustrationType}
                artStyle={currentLevel.artStyle}
                levelNumber={currentLevel.levelNumber}
                items={currentLevel.items}
                phase={phase}
                activeQuestion={activeQuestion}
                userPin={userPin}
                onDropPin={(coords) => setUserPin(coords)}
                lang={lang}
                compact={true}
                isLight={isLight}
              />
            </div>

            {/* Right Column: 3-Step Guided Handwriting & Memory Panel */}
            <div className="md:col-span-7">
              <QuestionPanel
                question={activeQuestion}
                  questionIndex={activeQuestionIdx}
                  totalQuestions={currentLevel.questions.length}
                  targetItem={targetItem}
                  userPin={userPin}
                  onSelectOption={(idx) => setSelectedOptionIndex(idx)}
                  selectedOptionIndex={selectedOptionIndex}
                  onCountChange={(cnt) => setSelectedCount(cnt)}
                  selectedCount={selectedCount}
                  userTypedText={userTypedText}
                  onTypedTextChange={(txt) => setUserTypedText(txt)}
                  onSubmitAnswer={handleSubmitAnswer}
                  result={currentQuestionResult}
                  onNextQuestion={handleNextQuestion}
                  isLastQuestion={activeQuestionIdx + 1 === currentLevel.questions.length}
                  bookmarks={playerStats.bookmarks}
                  onUseBookmarkHint={handleUseBookmarkHint}
                  activeHint={activeHint}
                  lang={lang}
                  isLight={isLight}
                  previousAnswers={previousStepAnswers}
                  fullNarrative={currentLevel.storyNarrative[lang]}
                  levelTitle={currentLevel.title[lang]}
                />
            </div>
          </div>
        )}

        {/* Bottom Level Bookshelf */}
        <div
          className={`mt-12 pt-8 border-t ${
            isLight ? 'border-stone-200' : 'border-slate-800'
          }`}
        >
          <LevelSelector
            levels={baseLevels}
            currentLevelIndex={currentLevelIndex}
            highestUnlockedLevel={playerStats.unlockedProgress[currentCategory] || 0}
            onSelectLevel={(idx) => setCurrentLevelIndex(idx)}
            lang={lang}
            isLight={isLight}
          />
        </div>
      </main>

      <footer
        className={`py-6 text-center text-xs ${
          isLight ? 'text-stone-400' : 'text-slate-500'
        }`}
      >
        {lang === 'ko'
          ? '© 2026 아이디어믹스랩. All rights reserved.'
          : '© 2026 IdeaFusionLab. All rights reserved.'}
      </footer>

      {/* Result Modal when all 3 steps of the episode are completed */}
      {showResultModal && (
        <ResultModal
          level={currentLevel}
          results={levelResults}
          onNextLevel={handleProceedNextLevel}
          onRetryLevel={handleRetryCurrentLevel}
          bookmarksEarned={bookmarksEarned}
          totalBookmarks={playerStats.bookmarks}
          lang={lang}
        />
      )}
    </div>
  );
}
