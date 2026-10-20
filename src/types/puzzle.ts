export type CategoryType = 'tale_novel' | 'picture' | 'quote';

export type Language = 'ko' | 'en';

export type QuestionType =
  | 'text_recall_typing'
  | 'pin_location'
  | 'count_input'
  | 'multiple_choice';

export interface SceneItem {
  id: string;
  name: { ko: string; en: string };
  category: { ko: string; en: string };
  description: { ko: string; en: string };
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  radius: number; // tolerance
  count?: number;
  iconType: string;
  color?: string;
  zoneName: { ko: string; en: string };
}

export interface Question {
  id: string;
  type: QuestionType;
  prompt: { ko: string; en: string };
  subPrompt?: { ko: string; en: string };
  // For picture mode
  targetItemId?: string;
  expectedCount?: number;
  options?: { ko: string; en: string }[];
  correctOptionIndex?: number;
  // For text recall typing (tale, novel, quote)
  originalText?: { ko: string; en: string };
  keyWords?: { ko: string[]; en: string[] };
  explanation: { ko: string; en: string };
  points: number;
}

export type ArtStyle =
  | 'pencil_sketch'     // ✏️ 클래식 연필 & 목탄 정밀 소묘 (흑백 톤, 섬세한 해칭 명암, 스케치북 질감)
  | 'framed_oil'        // 🖼️ 앤틱 골드 액자 명화 유화 (고급 금빛 몰딩 액자, 유채 붓터치와 캔버스 질감)
  | 'vintage_watercolor'// 📖 빈티지 고전 동화 수채화 (은은한 수채 물감 번짐, 앤틱 양장본 테두리)
  | 'woodcut_print'     // 🪵 르네상스 고전 목판화 (묵직한 판화 음영선, 크라프트지 빈티지 인쇄)
  | 'ethereal_night';   // ✨ 환상적인 밤하늘 일러스트 (달빛과 별가루, 환상적인 오로라 펄)

export interface LevelData {
  id: string;
  category: CategoryType;
  levelNumber: number;
  title: { ko: string; en: string };
  subtitle?: { ko: string; en: string };
  authorOrSource?: { ko: string; en: string };
  storyNarrative: { ko: string; en: string };
  illustrationType:
    | 'little_prince'
    | 'fairytale_cottage'
    | 'fairytale_meadow'
    | 'classic_study'
    | 'quote_parchment'
    | 'savannah_wild'
    | 'observatory_altar'
    | 'fruit_storage';
  artStyle?: ArtStyle;
  observationTimeLimit: number; // seconds, 0 = untimed
  difficultyTier: 'easy' | 'normal' | 'hard';
  items?: SceneItem[]; // only for picture mode
  questions: Question[];
}

export interface PlayerStats {
  bookmarks: number;
  totalScore: number;
  levelsCompleted: number;
  unlockedProgress: Record<CategoryType, number>;
}

export type GamePhase = 'OBSERVATION' | 'RECALL' | 'FEEDBACK';

export interface QuestionResult {
  questionId: string;
  isCorrect: boolean;
  scoreAwarded: number;
  userSelection?: string | number | { x: number; y: number };
  targetItem?: SceneItem;
  distanceError?: number;
  textMatchPercentage?: number;
  matchedKeywords?: string[];
}
