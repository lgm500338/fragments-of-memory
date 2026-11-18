import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CATEGORY_LEVELS } from './data/categoryLevels';
import { generateDynamicLevel } from './utils/proceduralGenerator';
import { generatePictureLevel } from './scenes/generatePicture';
import { ALL_WORKS, generateTaleLevel, sequenceFor } from './data/taleGenerator';
import { WorkPicker } from './components/WorkPicker';
import { TierSelector } from './components/TierSelector';
import { PICTURE_TIERS, TALE_PASS, taleTiers } from './data/tiers';
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

// 문장 따라 쓰기 통과선 (%)
const PASS_PERCENT = 70;

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
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(() => {
    try {
      const w = localStorage.getItem('fragments_selected_work') || 'all';
      return JSON.parse(localStorage.getItem('fragments_work_progress') || '{}')[w] || 0;
    } catch {
      return 0;
    }
  });
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // 기억동화·소설: 고른 작품과 작품별 진행
  const [selectedWork, setSelectedWork] = useState<string>(() => {
    try {
      return localStorage.getItem('fragments_selected_work') || ALL_WORKS;
    } catch {
      return ALL_WORKS;
    }
  });
  const [workProgress, setWorkProgress] = useState<Record<string, number>>(() => {
    try {
      return JSON.parse(localStorage.getItem('fragments_work_progress') || '{}');
    } catch {
      return {};
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem('fragments_selected_work', selectedWork);
      localStorage.setItem('fragments_work_progress', JSON.stringify(workProgress));
    } catch {}
  }, [selectedWork, workProgress]);

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

  const currentLevel: LevelData = useMemo(
    () =>
      currentCategory === 'picture'
        ? generatePictureLevel(currentLevelIndex + 1)
        : currentCategory === 'tale_novel'
        ? generateTaleLevel(currentLevelIndex + 1, selectedWork, lang)
        : currentLevelIndex < baseLevels.length
        ? baseLevels[currentLevelIndex]
        : generateDynamicLevel(currentCategory, currentLevelIndex + 1),
    [currentCategory, currentLevelIndex, baseLevels, selectedWork, lang]
  );

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
  }, [currentCategory, currentLevelIndex, selectedWork]);

  // 단계 선택 칸: 기억동화·소설은 작품별 진행
  const taleSeqLen = useMemo(() => sequenceFor(selectedWork, lang).length, [selectedWork, lang]);
  const selectorLevels: LevelData[] =
    currentCategory === 'tale_novel' ? new Array(taleSeqLen).fill(currentLevel) : currentCategory === 'picture' ? [] : baseLevels;
  const highestUnlocked =
    currentCategory === 'tale_novel'
      ? workProgress[selectedWork] || 0
      : playerStats.unlockedProgress[currentCategory] || 0;

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

  // 문장 통과선: 단계가 높을수록 올라감 (명언 탭은 기본 70%)
  const passPercent =
    currentCategory === 'tale_novel' ? TALE_PASS[currentLevel.tierKey || ''] ?? PASS_PERCENT : PASS_PERCENT;

  // 판 통과 조건: 기억 그림은 한 문제까지만 틀려도 됨
  const needCorrect =
    currentCategory === 'picture' ? Math.max(1, currentLevel.questions.length - 1) : 0;
  const levelPassed = levelResults.filter((r) => r.isCorrect).length >= needCorrect;

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
        // 그림은 가로 16 : 세로 10 이라 세로 %를 가로 % 길이로 맞춰서 잰다
        const dx = userPin.x - targetItem.x;
        const dy = (userPin.y - targetItem.y) * (10 / 16);
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
        isCorrect = matchPercentage >= passPercent;
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
      isCorrect,
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
      // 판 끝: 통과했을 때만 다음 판이 열리고 책갈피를 받음
      const passed = levelResults.filter((r) => r.isCorrect).length >= needCorrect;
      const earned = passed ? 1 : 0;

      if (passed) {
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
      }

      if (passed && currentCategory === 'tale_novel') {
        setWorkProgress((prev) => ({
          ...prev,
          [selectedWork]: Math.max(prev[selectedWork] || 0, currentLevelIndex + 1),
        }));
      }

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
          // 하던 곳부터 이어서
          setCurrentLevelIndex(
            cat === 'tale_novel' ? workProgress[selectedWork] || 0 : playerStats.unlockedProgress[cat] || 0
          );
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
        {currentCategory === 'tale_novel' && (
          <WorkPicker
            selected={selectedWork}
            onSelect={(id) => {
              setSelectedWork(id);
              setCurrentLevelIndex(Math.min(workProgress[id] || 0, 100000));
            }}
            progress={workProgress}
            lang={lang}
            isLight={isLight}
          />
        )}

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
                sceneId={currentLevel.sceneId}
                timeOfDay={currentLevel.timeOfDay}
                revealOk={currentQuestionResult?.isCorrect}
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
                coverTitle={currentCategory === 'tale_novel' ? currentLevel.title[lang].split(':').slice(1).join(':').trim() : undefined}
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
          {currentCategory === 'quote' ? (
            <LevelSelector
              key={currentCategory}
              levels={selectorLevels}
              currentLevelIndex={currentLevelIndex}
              highestUnlockedLevel={highestUnlocked}
              onSelectLevel={(idx) => setCurrentLevelIndex(idx)}
              lang={lang}
              isLight={isLight}
            />
          ) : (
            <TierSelector
              key={`${currentCategory}-${selectedWork}-${lang}`}
              tiers={currentCategory === 'picture' ? PICTURE_TIERS : taleTiers(selectedWork, lang)}
              currentIndex={currentLevelIndex}
              cleared={highestUnlocked}
              onSelect={(idx) => setCurrentLevelIndex(idx)}
              lang={lang}
              isLight={isLight}
            />
          )}
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
          passed={levelPassed}
          needCorrect={needCorrect}
          onRetryLevel={handleRetryCurrentLevel}
          bookmarksEarned={bookmarksEarned}
          totalBookmarks={playerStats.bookmarks}
          lang={lang}
        />
      )}
    </div>
  );
}
