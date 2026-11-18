import React, { useMemo } from 'react';
import { SceneItem } from '../types/puzzle';
import { OBJECTS } from './objects';
import { SCENES, SHARED_DEFS, TimeOfDay, atmosphere } from './scenes';

interface Props {
  sceneId: string;
  timeOfDay: TimeOfDay;
  items: SceneItem[];
  showItems: boolean; // 관찰 중에는 모두 보임
  revealItem?: SceneItem; // 정답 확인 때 그 물건만 다시 보임
  revealOk?: boolean;
  userPin?: { x: number; y: number } | null;
}

function drawItem(it: SceneItem, i: number, animate: boolean) {
  const o = OBJECTS[it.objKey || ''];
  if (!o) return '';
  const contact = `<ellipse cx="0" cy="0" rx="22" ry="4.5" fill="url(#contact)"/>`;
  return `<g class="${animate ? 'pic-obj' : ''}" style="animation-delay:${i * 70}ms" transform="translate(${it.px} ${it.py}) scale(${it.scale})"><g filter="url(#objShade)">${contact}${o.svg}</g></g>`;
}

export const PictureScene: React.FC<Props> = ({ sceneId, timeOfDay, items, showItems, revealItem, revealOk, userPin }) => {
  const scene = SCENES.find((s) => s.id === sceneId) || SCENES[0];

  const bgHtml = useMemo(() => scene.bg(timeOfDay), [scene, timeOfDay]);
  const atmoHtml = useMemo(() => atmosphere(timeOfDay), [timeOfDay]);
  const objHtml = useMemo(
    () => (showItems ? items.map((it, i) => drawItem(it, i, true)).join('') : ''),
    [items, showItems]
  );

  let revealHtml = '';
  if (revealItem && revealItem.px !== undefined && revealItem.py !== undefined) {
    const cx = revealItem.px;
    const cy = revealItem.py - 24 * (revealItem.scale || 1);
    const line = userPin
      ? `<line x1="${(userPin.x / 100) * 800}" y1="${(userPin.y / 100) * 500}" x2="${cx}" y2="${cy}" stroke="#fff" stroke-width="3" stroke-dasharray="6 6" opacity=".9"/>`
      : '';
    revealHtml = `${drawItem(revealItem, 0, true)}${line}
      <circle cx="${cx}" cy="${cy}" r="46" fill="none" stroke="${revealOk ? '#2f8a5b' : '#e9b949'}" stroke-width="4"/>
      <circle cx="${cx}" cy="${cy}" r="46" fill="${revealOk ? '#2f8a5b' : '#e9b949'}" opacity=".12"/>`;
  }

  return (
    <svg
      viewBox="0 0 800 500"
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full block"
      role="img"
      aria-label={scene.ko}
    >
      <style>{`@keyframes picFade{from{opacity:0;transform:translateY(-6px)}to{opacity:1}}
        .pic-obj>g{animation:picFade .45s ease-out both;animation-delay:inherit}
        @media (prefers-reduced-motion:reduce){.pic-obj>g{animation:none}}`}</style>
      <defs dangerouslySetInnerHTML={{ __html: SHARED_DEFS }} />
      <g dangerouslySetInnerHTML={{ __html: bgHtml }} />
      <g dangerouslySetInnerHTML={{ __html: objHtml }} />
      <g dangerouslySetInnerHTML={{ __html: atmoHtml }} style={{ pointerEvents: 'none' }} />
      <g dangerouslySetInnerHTML={{ __html: revealHtml }} />
    </svg>
  );
};
