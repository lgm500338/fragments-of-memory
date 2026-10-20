import React, { useRef, useState } from 'react';
import { SceneItem, GamePhase, Question, Language, ArtStyle } from '../types/puzzle';
import { MapPin, CheckCircle, Sparkles, Eye } from 'lucide-react';
import { ArtisticIllustration } from './ArtisticIllustration';
import { sound } from '../utils/audio';

interface SceneRendererProps {
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
  levelNumber?: number;
  items?: SceneItem[];
  phase: GamePhase;
  activeQuestion?: Question;
  userPin: { x: number; y: number } | null;
  onDropPin: (coords: { x: number; y: number }) => void;
  showFeedbackResults?: boolean;
  hintItemHighlight?: boolean;
  lang: Language;
  compact?: boolean;
  isLight?: boolean;
}

export const SceneRenderer: React.FC<SceneRendererProps> = ({
  illustrationType,
  artStyle,
  levelNumber = 1,
  items = [],
  phase,
  activeQuestion,
  userPin,
  onDropPin,
  showFeedbackResults = false,
  hintItemHighlight = false,
  lang,
  compact = false,
  isLight = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverCoords, setHoverCoords] = useState<{ x: number; y: number } | null>(null);

  const isPinQuestion = activeQuestion?.type === 'pin_location';
  const targetItem = items.find((it) => it.id === activeQuestion?.targetItemId);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (phase !== 'RECALL' || !isPinQuestion || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const xPercent = Math.max(0, Math.min(100, (clientX / rect.width) * 100));
    const yPercent = Math.max(0, Math.min(100, (clientY / rect.height) * 100));

    sound.playPinDrop();
    onDropPin({ x: Math.round(xPercent * 10) / 10, y: Math.round(yPercent * 10) / 10 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (phase !== 'RECALL' || !isPinQuestion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setHoverCoords({ x, y });
  };

  const isPictureCanvas = items.length > 0;

  // Frame styling tailored to active art style
  const STYLE_CYCLE: ArtStyle[] = [
    'pencil_sketch',
    'framed_oil',
    'vintage_watercolor',
    'woodcut_print',
    'ethereal_night',
  ];
  const effectiveStyle =
    artStyle || STYLE_CYCLE[(Math.max(1, levelNumber) - 1) % STYLE_CYCLE.length];

  const getFrameClasses = () => {
    if (effectiveStyle === 'framed_oil') {
      return 'border-[6px] border-[#b45309] shadow-2xl ring-4 ring-[#78350f]/60 ring-offset-2';
    }
    if (effectiveStyle === 'woodcut_print') {
      return 'border-4 border-[#292524] shadow-xl ring-2 ring-[#44403c]';
    }
    if (effectiveStyle === 'vintage_watercolor') {
      return isLight
        ? 'border-2 border-[#d97706]/60 shadow-lg ring-1 ring-amber-500/30'
        : 'border-2 border-amber-600/60 shadow-xl';
    }
    if (effectiveStyle === 'pencil_sketch') {
      return isLight
        ? 'border border-stone-300 shadow-md ring-1 ring-stone-200'
        : 'border border-slate-700 shadow-lg';
    }
    // ethereal_night
    return 'border-2 border-indigo-500/40 shadow-2xl ring-2 ring-purple-500/20';
  };

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden select-none transition-all ${
        compact ? 'max-w-[340px] aspect-[4/3] mx-auto' : 'aspect-[16/10] max-h-[460px]'
      } ${getFrameClasses()} ${
        isLight ? 'bg-[#fbf9f4]' : 'bg-slate-950'
      }`}
    >
      <div
        ref={containerRef}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverCoords(null)}
        className={`w-full h-full relative ${
          phase === 'RECALL' && isPinQuestion ? 'cursor-crosshair' : 'cursor-default'
        }`}
      >
        {/* Authentic Multi-Style Canvas Artwork */}
        <ArtisticIllustration
          type={illustrationType}
          artStyle={artStyle}
          levelNumber={levelNumber}
          isLight={isLight}
        />

        {/* Observation Item Markers (Picture Mode Only) - Refined Non-Pictogram Callouts */}
        {phase === 'OBSERVATION' &&
          isPictureCanvas &&
          items.map((item, idx) => (
            <div
              key={item.id}
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute pointer-events-none flex flex-col items-center z-20 group animate-pulse"
            >
              {/* Elegant Gold Target Reticle instead of plain bubble icon */}
              <div className="relative flex items-center justify-center">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-amber-300/90 bg-amber-950/60 backdrop-blur-sm shadow-lg flex items-center justify-center text-amber-200 font-mono text-xs font-bold ring-2 ring-amber-500/40">
                  {idx + 1}
                </div>
                {item.count && item.count > 1 && (
                  <span className="absolute -top-1 -right-2 px-1.5 py-0.2 bg-red-600 text-white text-[9px] font-black rounded-full shadow">
                    ×{item.count}
                  </span>
                )}
              </div>
              <div className="mt-1 px-2.5 py-0.5 bg-slate-950/90 text-amber-200 text-[11px] font-bold rounded shadow-md border border-amber-500/40 whitespace-nowrap backdrop-blur-sm">
                {item.name[lang]}
              </div>
            </div>
          ))}

        {/* User Pin Drop */}
        {phase === 'RECALL' && isPinQuestion && userPin && (
          <div
            style={{
              left: `${userPin.x}%`,
              top: `${userPin.y}%`,
              transform: 'translate(-50%, -100%)',
            }}
            className="absolute pointer-events-none flex flex-col items-center z-30"
          >
            <div className="p-1 rounded-full bg-red-600 text-white shadow-xl animate-bounce">
              <MapPin className="w-7 h-7 fill-red-600 stroke-white stroke-2" />
            </div>
            <div className="text-[10px] bg-slate-950/90 text-white px-2 py-0.5 rounded border border-slate-700 whitespace-nowrap shadow mt-0.5">
              {lang === 'ko' ? '지정한 위치' : 'Selected Location'}
            </div>
          </div>
        )}

        {/* Bookmark Hint Highlight Glow */}
        {hintItemHighlight && targetItem && (
          <div
            style={{
              left: `${targetItem.x}%`,
              top: `${targetItem.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className="absolute pointer-events-none w-20 h-20 rounded-full border-4 border-amber-400 bg-amber-500/30 animate-ping z-30"
          />
        )}

        {/* Feedback Mode for Picture Mode */}
        {(phase === 'FEEDBACK' || showFeedbackResults) && targetItem && (
          <>
            <div
              style={{
                left: `${targetItem.x}%`,
                top: `${targetItem.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute pointer-events-none flex flex-col items-center z-20"
            >
              <div className="w-12 h-12 rounded-full border-3 border-emerald-400 bg-emerald-500/25 flex items-center justify-center text-white shadow-xl">
                <CheckCircle className="w-6 h-6 text-emerald-400 fill-emerald-950" />
              </div>
              <span className="text-[11px] font-bold bg-emerald-950/90 text-emerald-300 px-2 py-0.5 rounded border border-emerald-600 shadow-md mt-1">
                {targetItem.name[lang]}
              </span>
            </div>

            {userPin && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                <line
                  x1={`${userPin.x}%`}
                  y1={`${userPin.y}%`}
                  x2={`${targetItem.x}%`}
                  y2={`${targetItem.y}%`}
                  stroke="#EF4444"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                />
              </svg>
            )}
          </>
        )}

        {/* Crosshair coordinates */}
        {phase === 'RECALL' && isPinQuestion && hoverCoords && (
          <div className="absolute bottom-2 left-2 pointer-events-none bg-slate-900/80 backdrop-blur text-slate-300 px-2.5 py-1 rounded text-xs border border-slate-700 font-mono tabular-nums">
            X {hoverCoords.x}% · Y {hoverCoords.y}%
          </div>
        )}
      </div>
    </div>
  );
};
