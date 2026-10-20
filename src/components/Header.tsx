import React from 'react';
import { CategoryType, Language } from '../types/puzzle';
import { Volume2, VolumeX, BookOpen, Bookmark, FileText, Image, Quote, Globe, Sun, Moon } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderProps {
  currentCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  bookmarks: number;
  lang: Language;
  onToggleLang: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  themeMode: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  onSelectCategory,
  bookmarks,
  lang,
  onToggleLang,
  isMuted,
  onToggleMute,
  themeMode,
  onToggleTheme,
}) => {
  const isLight = themeMode === 'light';

  const categories = [
    {
      id: 'tale_novel' as CategoryType,
      label: { ko: '기억동화·소설', en: 'Tale & Novel' },
      icon: <BookOpen className="w-4 h-4" />
    },
    {
      id: 'picture' as CategoryType,
      label: { ko: '기억 그림', en: 'Picture' },
      icon: <Image className="w-4 h-4" />
    },
    {
      id: 'quote' as CategoryType,
      label: { ko: '기억 명언·명대사', en: 'Quotes & Lines' },
      icon: <Quote className="w-4 h-4" />
    }
  ];

  return (
    <header
      className={`w-full sticky top-0 z-40 select-none border-b transition-colors ${
        isLight
          ? 'bg-[#fdfbf7] border-[#e7dec8] text-stone-900 shadow-sm'
          : 'bg-slate-900 border-slate-800 text-slate-100 shadow-lg'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 md:py-0 md:h-16 flex flex-wrap md:flex-nowrap items-center justify-between gap-x-3 gap-y-2 md:gap-6">
        
        {/* Zone 1: Brand title */}
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isLight
                ? 'bg-amber-100 border border-amber-300 text-amber-700'
                : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
            }`}
          >
            <Bookmark className="w-4 h-4 fill-current opacity-70" />
          </div>
          <span
            className={`text-base sm:text-lg font-bold tracking-tight ${
              isLight ? 'text-stone-900' : 'text-white'
            }`}
          >
            {lang === 'ko' ? '기억의 조각' : 'Fragments'}
          </span>
        </div>

        {/* Zone 2: The 4 Core Category Mode Buttons */}
        <nav className="order-last md:order-none w-full md:w-auto grid grid-cols-3 md:flex items-center gap-1 sm:gap-2 py-1">
          {categories.map((cat) => {
            const isActive = currentCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  sound.playClick();
                  onSelectCategory(cat.id);
                }}
                className={`px-2 md:px-3 py-2 md:py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow font-bold'
                    : isLight
                    ? 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <span className="hidden sm:inline">{cat.icon}</span>
                <span>{cat.label[lang]}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Bookmarks & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Bookmarks Counter Badge */}
          <div
            title={lang === 'ko' ? `보유한 책갈피: ${bookmarks}개` : `Bookmarks: ${bookmarks}`}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
              isLight
                ? 'bg-amber-100/80 border border-amber-300 text-amber-900'
                : 'bg-amber-950/50 border border-amber-500/40 text-amber-300'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 fill-amber-500" />
            <span className="tabular-nums font-mono">{bookmarks}</span>
          </div>

          {/* Theme Mode Toggle (☀️ Light / 🌙 Dark) */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleTheme();
            }}
            title={isLight ? '다크 모드로 전환 (Dark Mode)' : '화이트 모드로 전환 (Light Mode)'}
            className={`p-1.5 rounded-lg text-xs font-bold transition-colors border ${
              isLight
                ? 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700'
            }`}
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Bilingual Language Switcher */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleLang();
            }}
            title={lang === 'ko' ? 'Switch to English' : '한국어로 전환'}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1 ${
              isLight
                ? 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === 'ko' ? 'EN' : 'KO'}</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            className={`p-1.5 rounded-lg transition-colors border ${
              isLight
                ? 'bg-stone-100 hover:bg-stone-200 text-stone-600 border-stone-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-amber-500" />}
          </button>
        </div>
      </div>
    </header>
  );
};
