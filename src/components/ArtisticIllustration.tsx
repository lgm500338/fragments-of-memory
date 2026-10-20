import React, { useRef, useEffect } from 'react';
import { ArtStyle } from '../types/puzzle';

interface ArtisticIllustrationProps {
  type: string;
  artStyle?: ArtStyle;
  levelNumber?: number;
  className?: string;
  isLight?: boolean;
}

export const ArtisticIllustration: React.FC<ArtisticIllustrationProps> = ({
  artStyle = 'pencil_sketch',
  levelNumber = 1,
  className = '',
  isLight = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Retina 2x resolution
    const width = 800;
    const height = 550;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    // Render elegant bookplate / classic library parchment plate without any stick/geometric pictograms
    renderClassicBookplate(ctx, width, height, levelNumber, isLight);
  }, [artStyle, levelNumber, isLight]);

  return (
    <div className={`relative w-full h-full overflow-hidden flex flex-col ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover select-none pointer-events-none rounded-xl"
      />
    </div>
  );
};

/**
 * Pure, elegant literary bookplate with classic parchment texture,
 * gold filigree framing, and clean typography. Absolutely no childish pictograms.
 */
function renderClassicBookplate(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  level: number,
  isLight: boolean
) {
  // 1. Rich textured background
  const bgGrad = ctx.createLinearGradient(0, 0, w, h);
  if (isLight) {
    bgGrad.addColorStop(0, '#fdfbf7');
    bgGrad.addColorStop(0.5, '#f5efe1');
    bgGrad.addColorStop(1, '#ebe0cc');
  } else {
    bgGrad.addColorStop(0, '#1c1917');
    bgGrad.addColorStop(0.5, '#12100e');
    bgGrad.addColorStop(1, '#0c0a09');
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Soft atmospheric watercolor wash
  const wash = ctx.createRadialGradient(w / 2, h / 2, 40, w / 2, h / 2, 380);
  if (isLight) {
    wash.addColorStop(0, 'rgba(245, 158, 11, 0.08)');
    wash.addColorStop(1, 'rgba(120, 53, 15, 0.02)');
  } else {
    wash.addColorStop(0, 'rgba(217, 119, 6, 0.12)');
    wash.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
  }
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, w, h);

  // 2. Double gold filigree border
  const borderMargin = 24;
  ctx.strokeStyle = isLight ? '#d97706' : '#f59e0b';
  ctx.lineWidth = 2;
  ctx.strokeRect(borderMargin, borderMargin, w - borderMargin * 2, h - borderMargin * 2);

  ctx.strokeStyle = isLight ? 'rgba(217, 119, 6, 0.4)' : 'rgba(245, 158, 11, 0.35)';
  ctx.lineWidth = 1;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(borderMargin + 8, borderMargin + 8, w - (borderMargin + 8) * 2, h - (borderMargin + 8) * 2);
  ctx.setLineDash([]);

  // Corner fleurons
  const fleurons = [
    [borderMargin + 8, borderMargin + 8],
    [w - borderMargin - 8, borderMargin + 8],
    [borderMargin + 8, h - borderMargin - 8],
    [w - borderMargin - 8, h - borderMargin - 8],
  ];
  fleurons.forEach(([cx, cy]) => {
    ctx.fillStyle = isLight ? '#b45309' : '#f59e0b';
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // 3. Central Classical Emblem & Bookplate Title
  const midX = w / 2;
  const midY = h / 2;

  // Vintage Central Medallion
  ctx.strokeStyle = isLight ? 'rgba(180, 83, 9, 0.25)' : 'rgba(245, 158, 11, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(midX, midY - 20, 75, 0, Math.PI * 2);
  ctx.stroke();

  // Star Emblem in Center
  ctx.fillStyle = isLight ? '#b45309' : '#fbbf24';
  ctx.font = '32px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✦', midX, midY - 20);

  // Top Subtitle
  ctx.fillStyle = isLight ? '#78350f' : '#fde68a';
  ctx.font = 'bold 13px sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('FRAGMENTS OF MEMORY', midX, midY - 60);

  // Main Korean Title
  ctx.fillStyle = isLight ? '#292524' : '#fffbeb';
  ctx.font = 'bold 22px serif';
  ctx.letterSpacing = '1px';
  ctx.fillText(`기억 서재 · 제${level}화`, midX, midY + 28);

  // Bottom Classical Inscription
  ctx.fillStyle = isLight ? '#a8a29e' : '#78716c';
  ctx.font = 'italic 13px serif';
  ctx.fillText('A Collection of Classic Tales & Literary Wisdom', midX, midY + 58);
}
