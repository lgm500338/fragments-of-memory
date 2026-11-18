// 기억 그림: 장면(배경 + 물건이 놓일 자리)
// 그림 크기는 800 x 500. 슬롯의 x,y는 물건 바닥이 닿는 점.
import { SlotType } from './objects';

export type TimeOfDay = 'morning' | 'sunset' | 'night';

export interface Slot {
  x: number;
  y: number;
  t: SlotType;
  s: number; // 크기 배율 (원근감)
  ko: string; // 자리 이름
  en: string;
}

export interface SceneDef {
  id: string;
  ko: string;
  en: string;
  narrativeKo: string;
  narrativeEn: string;
  slots: Slot[];
  objects: string[]; // 이 장면에 어울리는 물건들
  bg: (tod: TimeOfDay) => string;
}

export const TOD_LABEL: Record<TimeOfDay, { ko: string; en: string }> = {
  morning: { ko: '아침', en: 'Morning' },
  sunset: { ko: '저녁노을', en: 'Sunset' },
  night: { ko: '밤', en: 'Night' },
};

// 모든 장면이 같이 쓰는 색·질감
export const SHARED_DEFS = `
<linearGradient id="skyMorning" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fb6e6"/><stop offset=".65" stop-color="#cfe6f3"/><stop offset="1" stop-color="#fbe9c6"/></linearGradient>
<linearGradient id="skySunset" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a4f8f"/><stop offset=".45" stop-color="#e98a7a"/><stop offset=".8" stop-color="#f7b867"/><stop offset="1" stop-color="#fde0a0"/></linearGradient>
<linearGradient id="skyNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1433"/><stop offset=".7" stop-color="#22336a"/><stop offset="1" stop-color="#3b4a80"/></linearGradient>
<linearGradient id="beamMorning" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff4cf" stop-opacity=".6"/><stop offset="1" stop-color="#fff4cf" stop-opacity="0"/></linearGradient>
<linearGradient id="beamSunset" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb070" stop-opacity=".55"/><stop offset="1" stop-color="#ffb070" stop-opacity="0"/></linearGradient>
<linearGradient id="beamNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b8c8ff" stop-opacity=".35"/><stop offset="1" stop-color="#b8c8ff" stop-opacity="0"/></linearGradient>
<linearGradient id="gWood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9a6a40"/><stop offset="1" stop-color="#6e4526"/></linearGradient>
<linearGradient id="gWoodLight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c08a58"/><stop offset="1" stop-color="#9a6a40"/></linearGradient>
<linearGradient id="gGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3d77a"/><stop offset=".5" stop-color="#c9a24c"/><stop offset="1" stop-color="#9c7c1f"/></linearGradient>
<radialGradient id="gRed" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#f07060"/><stop offset=".6" stop-color="#d23d33"/><stop offset="1" stop-color="#9e2b2b"/></radialGradient>
<radialGradient id="gApple" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ff6a55"/><stop offset=".7" stop-color="#d33a2c"/><stop offset="1" stop-color="#a5281c"/></radialGradient>
<linearGradient id="gPorcelain" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#f4f0e8"/><stop offset="1" stop-color="#d9d1c2"/></linearGradient>
<radialGradient id="gFur" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#c48a52"/><stop offset="1" stop-color="#93603a"/></radialGradient>
<linearGradient id="gClay" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e88a5a"/><stop offset="1" stop-color="#b85a32"/></linearGradient>
<linearGradient id="gCactus" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#76b46f"/><stop offset="1" stop-color="#4a8446"/></linearGradient>
<linearGradient id="gYellow" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f8d548"/><stop offset="1" stop-color="#d9a41a"/></linearGradient>
<linearGradient id="gWicker" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2c590"/><stop offset="1" stop-color="#b8945a"/></linearGradient>
<radialGradient id="gCat" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#f4a656"/><stop offset="1" stop-color="#d6802f"/></radialGradient>
<radialGradient id="gGlow"><stop offset="0" stop-color="#ffd27a" stop-opacity=".9"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
<radialGradient id="gSea" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#6aa6d8"/><stop offset="1" stop-color="#2c5f8f"/></radialGradient>
<radialGradient id="gGreen" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#6fae80"/><stop offset="1" stop-color="#2f6043"/></radialGradient>
<linearGradient id="gBread" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d08a45"/><stop offset=".4" stop-color="#e8b070"/><stop offset="1" stop-color="#f3d3a0"/></linearGradient>
<linearGradient id="gGlass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".25" stop-color="#fff" stop-opacity="0"/><stop offset=".8" stop-color="#000" stop-opacity=".1"/></linearGradient>
<radialGradient id="gPumpkin" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#f7a04a"/><stop offset="1" stop-color="#d26a1e"/></radialGradient>
<radialGradient id="gBall" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></radialGradient>
<linearGradient id="gShell" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbd3da"/><stop offset="1" stop-color="#f0a7b5"/></linearGradient>
<linearGradient id="gSand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eed29c"/><stop offset="1" stop-color="#d2b073"/></linearGradient>
<linearGradient id="gStraw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0d48c"/><stop offset="1" stop-color="#cfa95a"/></linearGradient>
<radialGradient id="vignette" cx=".5" cy=".5" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#2a1a08" stop-opacity=".35"/></radialGradient>
<radialGradient id="contact"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<filter id="objShade" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="1.5" dy="2" stdDeviation="1.4" flood-color="#2a1a08" flood-opacity=".28"/></filter>
<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3" result="n"/><feColorMatrix in="n" type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 .07"/></feComponentTransfer><feComposite in2="SourceGraphic" operator="in"/></filter>
`;

const skyFill = (t: TimeOfDay) =>
  t === 'morning' ? 'url(#skyMorning)' : t === 'sunset' ? 'url(#skySunset)' : 'url(#skyNight)';
const beamFill = (t: TimeOfDay) =>
  t === 'morning' ? 'url(#beamMorning)' : t === 'sunset' ? 'url(#beamSunset)' : 'url(#beamNight)';

// 창밖 풍경(해/달/별/구름)
function windowView(x: number, y: number, w: number, h: number, t: TimeOfDay) {
  const cx = x + w * 0.75;
  const cy = y + h * 0.28;
  if (t === 'night') {
    const stars = [
      [0.12, 0.2], [0.3, 0.1], [0.5, 0.45], [0.2, 0.6], [0.88, 0.62], [0.6, 0.14], [0.08, 0.82], [0.8, 0.85], [0.42, 0.75],
    ]
      .map(([a, b], i) => `<circle cx="${x + a * w}" cy="${y + b * h}" r="${1 + (i % 3) * 0.4}" fill="#fff" opacity="${0.6 + (i % 2) * 0.4}"/>`)
      .join('');
    return `${stars}<circle cx="${cx}" cy="${cy}" r="14" fill="#f4f1dc"/><circle cx="${cx + 6}" cy="${cy - 4}" r="12" fill="#1a2750"/>
      <circle cx="${cx}" cy="${cy}" r="26" fill="#f4f1dc" opacity=".08"/>`;
  }
  if (t === 'sunset') {
    return `<circle cx="${x + w * 0.35}" cy="${y + h * 0.78}" r="22" fill="#ffd27a"/><circle cx="${x + w * 0.35}" cy="${y + h * 0.78}" r="38" fill="#ffd27a" opacity=".3"/>
      <g fill="#f8c3a8" opacity=".85"><ellipse cx="${x + w * 0.65}" cy="${y + h * 0.3}" rx="30" ry="6"/><ellipse cx="${x + w * 0.25}" cy="${y + h * 0.42}" rx="22" ry="5"/></g>`;
  }
  return `<circle cx="${cx}" cy="${cy}" r="16" fill="#fff6cc"/><circle cx="${cx}" cy="${cy}" r="30" fill="#fff6cc" opacity=".35"/>
    <g fill="#fff" opacity=".92"><ellipse cx="${x + w * 0.25}" cy="${y + h * 0.35}" rx="26" ry="8"/><ellipse cx="${x + w * 0.35}" cy="${y + h * 0.3}" rx="16" ry="8"/><ellipse cx="${x + w * 0.6}" cy="${y + h * 0.62}" rx="20" ry="6"/></g>`;
}

// 시간대에 따라 전체 분위기 덮기 (물건 위에도 덮여서 같이 어두워짐)
export function atmosphere(t: TimeOfDay) {
  const tint =
    t === 'night'
      ? `<rect width="800" height="500" fill="#0b1640" opacity=".34" style="mix-blend-mode:multiply"/>`
      : t === 'sunset'
      ? `<rect width="800" height="500" fill="#ff9a5a" opacity=".2" style="mix-blend-mode:multiply"/><rect width="800" height="500" fill="#ffd2a0" opacity=".08"/>`
      : `<rect width="800" height="500" fill="#fff3d6" opacity=".06"/>`;
  return `${tint}<rect width="800" height="500" fill="url(#vignette)"/><rect width="800" height="500" fill="#a08060" filter="url(#grain)"/>`;
}

// ───────────── 1. 엘레나의 아침 방 ─────────────
const room: SceneDef = {
  id: 'room',
  ko: '엘레나의 방',
  en: "Elena's Room",
  narrativeKo: '창가로 빛이 드는 엘레나의 방이에요. 화장대, 창턱, 선반, 침대, 바닥에 놓인 물건들을 잘 봐두세요.',
  narrativeEn: "Elena's cozy room. Watch the dresser, windowsill, shelf, bed and floor.",
  objects: ['clock', 'cup', 'shoes', 'bear', 'cactus', 'umbrella', 'apples', 'books', 'glasses', 'cat', 'candle', 'globe', 'musicbox', 'plane', 'hat', 'milk'],
  slots: [
    { x: 72, y: 222, t: 'surface', s: 0.9, ko: '화장대 왼쪽 위', en: 'left of the dresser' },
    { x: 198, y: 222, t: 'surface', s: 0.9, ko: '화장대 오른쪽 위', en: 'right of the dresser' },
    { x: 338, y: 223, t: 'surface', s: 0.75, ko: '창턱 왼쪽', en: 'left windowsill' },
    { x: 462, y: 223, t: 'surface', s: 0.75, ko: '창턱 오른쪽', en: 'right windowsill' },
    { x: 592, y: 140, t: 'surface', s: 0.7, ko: '선반 왼쪽', en: 'left of the shelf' },
    { x: 708, y: 140, t: 'surface', s: 0.7, ko: '선반 오른쪽', en: 'right of the shelf' },
    { x: 290, y: 362, t: 'surface', s: 0.9, ko: '나무 의자 위', en: 'on the stool' },
    { x: 622, y: 318, t: 'bed', s: 0.95, ko: '침대 이불 왼쪽', en: 'left of the bed' },
    { x: 712, y: 316, t: 'bed', s: 0.95, ko: '침대 이불 오른쪽', en: 'right of the bed' },
    { x: 395, y: 448, t: 'floor', s: 1.1, ko: '러그 한가운데', en: 'middle of the rug' },
    { x: 510, y: 430, t: 'floor', s: 1.05, ko: '러그 오른쪽', en: 'right side of the rug' },
    { x: 150, y: 420, t: 'floor', s: 1.1, ko: '화장대 앞 바닥', en: 'floor by the dresser' },
    { x: 690, y: 452, t: 'floor', s: 1.15, ko: '침대 앞 바닥', en: 'floor by the bed' },
    { x: 250, y: 480, t: 'floor', s: 1.15, ko: '의자 앞 바닥', en: 'floor by the stool' },
  ],
  bg: (t) => `
  <defs>
    <linearGradient id="rWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6e8cf"/><stop offset="1" stop-color="#e6cfa6"/></linearGradient>
    <pattern id="rPaper" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M14 6 q3 4 0 8 q-3 -4 0 -8z" fill="#d9bf93" opacity=".45"/><circle cx="0" cy="22" r="1.4" fill="#d9bf93" opacity=".5"/><circle cx="28" cy="22" r="1.4" fill="#d9bf93" opacity=".5"/></pattern>
    <linearGradient id="rFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9c6638"/><stop offset="1" stop-color="#c8905a"/></linearGradient>
    <linearGradient id="rMirror" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eef5f8"/><stop offset=".55" stop-color="#b9cdd8"/><stop offset="1" stop-color="#dfe9ee"/></linearGradient>
    <radialGradient id="rRug" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#d9826a"/><stop offset=".62" stop-color="#c46a52"/><stop offset=".66" stop-color="#f1d9a8"/><stop offset=".72" stop-color="#b65a45"/><stop offset="1" stop-color="#9e4a38"/></radialGradient>
    <linearGradient id="rCurtain" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e29a97"/><stop offset=".5" stop-color="#f0b5b1"/><stop offset="1" stop-color="#d98885"/></linearGradient>
    <linearGradient id="rQuilt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8eaad4"/><stop offset="1" stop-color="#6a88b8"/></linearGradient>
  </defs>
  <rect width="800" height="335" fill="url(#rWall)"/><rect width="800" height="335" fill="url(#rPaper)"/>
  <rect y="300" width="800" height="35" fill="#000" opacity=".04"/>
  <rect y="335" width="800" height="165" fill="url(#rFloor)"/>
  <g stroke="#7d4e28" stroke-width="1.4" opacity=".5">
    <line x1="400" y1="335" x2="400" y2="500"/><line x1="330" y1="335" x2="250" y2="500"/><line x1="260" y1="335" x2="100" y2="500"/>
    <line x1="190" y1="335" x2="-50" y2="500"/><line x1="470" y1="335" x2="550" y2="500"/><line x1="540" y1="335" x2="700" y2="500"/>
    <line x1="610" y1="335" x2="850" y2="500"/><line x1="120" y1="335" x2="-200" y2="500"/><line x1="680" y1="335" x2="1000" y2="500"/>
    <line x1="0" y1="372" x2="800" y2="372" opacity=".5"/><line x1="0" y1="420" x2="800" y2="420" opacity=".5"/>
  </g>
  <rect y="328" width="800" height="10" fill="#f3e5c9"/><rect y="337" width="800" height="3" fill="#6b4122" opacity=".45"/>
  <g>
    <rect x="292" y="44" width="216" height="182" rx="6" fill="#f8efdc"/>
    <rect x="302" y="54" width="196" height="162" fill="${skyFill(t)}"/>
    ${windowView(302, 54, 196, 150, t)}
    <path d="M302 200 Q340 176 380 190 T460 182 T498 192 V216 H302Z" fill="${t === 'night' ? '#1b2747' : t === 'sunset' ? '#7a6a6e' : '#9cc58a'}"/>
    <rect x="397" y="54" width="6" height="162" fill="#f8efdc"/><rect x="302" y="132" width="196" height="6" fill="#f8efdc"/>
    <rect x="282" y="222" width="236" height="12" rx="3" fill="#efe1c3"/><rect x="282" y="232" width="236" height="4" fill="#c7a878"/>
    <path d="M270 36 H318 Q306 120 322 236 H278 Q262 140 270 36Z" fill="url(#rCurtain)"/>
    <path d="M482 36 H530 Q538 140 522 236 H478 Q494 120 482 36Z" fill="url(#rCurtain)"/>
    <g stroke="#c97c79" stroke-width="2" fill="none" opacity=".7"><path d="M290 40 Q284 140 296 232"/><path d="M510 40 Q516 140 504 232"/><path d="M302 40 Q296 140 308 232"/><path d="M498 40 Q504 140 492 232"/></g>
    <rect x="262" y="30" width="276" height="8" rx="4" fill="#8a5a33"/><circle cx="262" cy="34" r="6" fill="#c9a24c"/><circle cx="538" cy="34" r="6" fill="#c9a24c"/>
  </g>
  <rect x="555" y="140" width="190" height="10" rx="2" fill="url(#gWood)"/><rect x="555" y="150" width="190" height="4" fill="#000" opacity=".12"/>
  <path d="M575 150 l10 18 h-4z M725 150 l-10 18 h4z" fill="#6e4526"/>
  <rect x="610" y="62" width="70" height="52" rx="3" fill="url(#gGold)"/><rect x="617" y="69" width="56" height="38" fill="#cfe0d4"/>
  <path d="M617 107 L635 86 L648 98 L660 84 L673 107Z" fill="#7ea681"/><circle cx="660" cy="78" r="4" fill="#f7e2a0"/>
  <polygon points="302,226 498,226 640,500 230,500" fill="${beamFill(t)}"/>
  <ellipse cx="410" cy="446" rx="196" ry="46" fill="#000" opacity=".1"/>
  <ellipse cx="410" cy="440" rx="190" ry="44" fill="url(#rRug)"/>
  <ellipse cx="410" cy="440" rx="190" ry="44" fill="none" stroke="#f1d9a8" stroke-width="2" stroke-dasharray="2 6"/>
  <ellipse cx="410" cy="440" rx="120" ry="26" fill="none" stroke="#f1d9a8" stroke-width="1.5" opacity=".6"/>
  <g>
    <ellipse cx="135" cy="142" rx="44" ry="56" fill="url(#gGold)"/><ellipse cx="135" cy="142" rx="36" ry="48" fill="url(#rMirror)"/>
    <path d="M112 118 l14 -16 M118 132 l22 -24" stroke="#fff" stroke-width="3" opacity=".6" stroke-linecap="round"/>
    <rect x="30" y="222" width="210" height="14" rx="3" fill="#7a4c2a"/>
    <rect x="40" y="236" width="190" height="104" fill="url(#gWood)"/>
    <g fill="#a46d44" stroke="#6e4526" stroke-width="2"><rect x="50" y="246" width="80" height="40" rx="3"/><rect x="140" y="246" width="80" height="40" rx="3"/><rect x="50" y="292" width="170" height="40" rx="3"/></g>
    <g fill="url(#gGold)"><circle cx="90" cy="266" r="4"/><circle cx="180" cy="266" r="4"/><circle cx="135" cy="312" r="4"/></g>
    <rect x="46" y="340" width="10" height="10" fill="#5a3518"/><rect x="214" y="340" width="10" height="10" fill="#5a3518"/>
    <ellipse cx="135" cy="352" rx="100" ry="6" fill="url(#contact)"/>
  </g>
  <g>
    <ellipse cx="290" cy="438" rx="44" ry="6" fill="url(#contact)"/>
    <ellipse cx="290" cy="372" rx="34" ry="9" fill="#6e4526"/><rect x="256" y="364" width="68" height="8" fill="#93603a"/>
    <ellipse cx="290" cy="364" rx="34" ry="9" fill="url(#gWoodLight)"/>
    <path d="M264 372 l-6 64 h6 l8 -64z M316 372 l6 64 h-6 l-8 -64z M287 378 h6 v52 h-6z" fill="#6e4526"/>
  </g>
  <g>
    <rect x="600" y="196" width="196" height="150" rx="10" fill="url(#gWood)"/>
    <rect x="612" y="208" width="172" height="80" rx="6" fill="#a46d44"/>
    <path d="M612 208 h172 v12 h-172z" fill="#b98052"/>
    <rect x="560" y="296" width="240" height="70" rx="8" fill="#f7f1e4"/>
    <path d="M560 316 Q600 300 640 318 T730 312 T800 318 V366 H560Z" fill="url(#rQuilt)"/>
    <path d="M560 316 Q600 300 640 318 T730 312 T800 318" fill="none" stroke="#f7f1e4" stroke-width="5"/>
    <g fill="#f7f1e4" opacity=".5"><circle cx="600" cy="340" r="4"/><circle cx="640" cy="352" r="4"/><circle cx="690" cy="336" r="4"/><circle cx="740" cy="350" r="4"/><circle cx="780" cy="334" r="4"/></g>
    <rect x="712" y="270" width="80" height="34" rx="14" fill="#ffffff" stroke="#e1d6c2" stroke-width="2"/>
    <rect x="566" y="366" width="12" height="22" fill="#5a3518"/>
    <ellipse cx="680" cy="390" rx="130" ry="7" fill="url(#contact)"/>
  </g>
  <g>
    <ellipse cx="38" cy="472" rx="26" ry="5" fill="url(#contact)"/>
    <path d="M18 470 L58 470 L52 420 L24 420Z" fill="#5f7f9a"/><rect x="20" y="414" width="36" height="8" rx="2" fill="#4c6a84"/>
    <g fill="#4f8a4b"><ellipse cx="38" cy="380" rx="10" ry="34" transform="rotate(-18 38 380)"/><ellipse cx="38" cy="384" rx="9" ry="30" transform="rotate(22 38 384)"/></g>
    <g fill="#6aa75e"><ellipse cx="38" cy="372" rx="8" ry="36"/><ellipse cx="30" cy="392" rx="7" ry="24" transform="rotate(-40 30 392)"/></g>
  </g>`,
};

// ───────────── 2. 할머니의 부엌 ─────────────
const kitchen: SceneDef = {
  id: 'kitchen',
  ko: '할머니의 부엌',
  en: "Grandma's Kitchen",
  narrativeKo: '맛있는 냄새가 나는 할머니의 부엌이에요. 선반, 조리대, 창턱, 식탁, 바닥 위 물건을 기억하세요.',
  narrativeEn: "Grandma's warm kitchen. Remember what sits on the shelf, counter, sill, table and floor.",
  objects: ['kettle', 'teapot', 'bread', 'jam', 'eggs', 'milk', 'pumpkin', 'apples', 'cup', 'candle', 'cat', 'clock', 'books', 'glasses', 'cactus', 'watermelon'],
  slots: [
    { x: 80, y: 118, t: 'surface', s: 0.7, ko: '벽 선반 왼쪽', en: 'left of the wall shelf' },
    { x: 190, y: 118, t: 'surface', s: 0.7, ko: '벽 선반 오른쪽', en: 'right of the wall shelf' },
    { x: 350, y: 176, t: 'surface', s: 0.7, ko: '창턱 왼쪽', en: 'left windowsill' },
    { x: 452, y: 176, t: 'surface', s: 0.7, ko: '창턱 오른쪽', en: 'right windowsill' },
    { x: 60, y: 250, t: 'surface', s: 0.9, ko: '조리대 왼쪽 끝', en: 'far left of the counter' },
    { x: 170, y: 250, t: 'surface', s: 0.9, ko: '조리대 가운데', en: 'middle of the counter' },
    { x: 280, y: 250, t: 'surface', s: 0.9, ko: '조리대 오른쪽', en: 'right of the counter' },
    { x: 440, y: 248, t: 'surface', s: 0.9, ko: '가스레인지 위', en: 'on the stove' },
    { x: 605, y: 330, t: 'surface', s: 0.95, ko: '식탁 왼쪽', en: 'left of the table' },
    { x: 680, y: 334, t: 'surface', s: 0.95, ko: '식탁 가운데', en: 'middle of the table' },
    { x: 752, y: 330, t: 'surface', s: 0.95, ko: '식탁 오른쪽', en: 'right of the table' },
    { x: 120, y: 470, t: 'floor', s: 1.1, ko: '조리대 앞 바닥', en: 'floor by the counter' },
    { x: 330, y: 452, t: 'floor', s: 1.05, ko: '부엌 한가운데 바닥', en: 'middle of the floor' },
    { x: 510, y: 482, t: 'floor', s: 1.15, ko: '오븐 앞 바닥', en: 'floor by the oven' },
  ],
  bg: (t) => `
  <defs>
    <linearGradient id="kWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3e7cf"/><stop offset="1" stop-color="#ead8b6"/></linearGradient>
    <pattern id="kTile" width="32" height="24" patternUnits="userSpaceOnUse"><rect width="32" height="24" fill="#f7f3ea"/><rect x="0" y="0" width="31" height="23" fill="#eef3f2" stroke="#c9d6d4" stroke-width="1"/><circle cx="16" cy="12" r="3" fill="#7fa9b8" opacity=".5"/></pattern>
    <pattern id="kFloor" width="50" height="50" patternUnits="userSpaceOnUse"><rect width="50" height="50" fill="#e9dcc2"/><rect width="25" height="25" fill="#b98b5e"/><rect x="25" y="25" width="25" height="25" fill="#b98b5e"/></pattern>
    <pattern id="kCloth" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="#fbf6ec"/><rect width="12" height="24" fill="#e06a6a" opacity=".55"/><rect width="24" height="12" fill="#e06a6a" opacity=".55"/></pattern>
    <pattern id="kGingham" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#fff"/><rect width="6" height="12" fill="#7fa9d8" opacity=".5"/><rect width="12" height="6" fill="#7fa9d8" opacity=".5"/></pattern>
    <linearGradient id="kCounter" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f1ea"/><stop offset="1" stop-color="#d8d2c4"/></linearGradient>
    <linearGradient id="kCab" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9cc0b4"/><stop offset="1" stop-color="#7da295"/></linearGradient>
    <linearGradient id="kSteel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#cfd5da"/><stop offset=".5" stop-color="#f4f6f8"/><stop offset="1" stop-color="#aeb6bd"/></linearGradient>
  </defs>
  <rect width="800" height="380" fill="url(#kWall)"/>
  <rect y="180" width="560" height="70" fill="url(#kTile)"/>
  <g transform="translate(0 380)"><path d="M0 0 H800 V120 H0Z" fill="url(#kFloor)"/><rect width="800" height="120" fill="#000" opacity=".06"/></g>
  <rect y="376" width="800" height="6" fill="#8a6440" opacity=".55"/>
  <g>
    <rect x="300" y="32" width="200" height="150" rx="5" fill="#f9f3e6"/>
    <rect x="310" y="42" width="180" height="130" fill="${skyFill(t)}"/>
    ${windowView(310, 42, 180, 130, t)}
    <path d="M310 150 q30 -18 60 -6 t70 -4 t50 6 V172 H310Z" fill="${t === 'night' ? '#1b2747' : t === 'sunset' ? '#7a6a6e' : '#8fbf7f'}"/>
    <rect x="397" y="42" width="6" height="130" fill="#f9f3e6"/>
    <rect x="292" y="174" width="216" height="8" rx="2" fill="#e8dcc2"/>
    <path d="M300 30 H500 V78 Q450 90 400 78 Q350 90 300 78Z" fill="url(#kGingham)"/>
    <path d="M300 78 Q350 90 400 78 Q450 90 500 78" stroke="#5b8fbf" stroke-width="2" fill="none"/>
    <rect x="292" y="26" width="216" height="7" rx="3" fill="#8a5a33"/>
  </g>
  <polygon points="310,182 490,182 600,380 230,380" fill="${beamFill(t)}"/>
  <rect x="40" y="118" width="190" height="10" rx="2" fill="url(#gWood)"/><rect x="40" y="128" width="190" height="4" fill="#000" opacity=".12"/>
  <path d="M60 128 l10 16 h-4z M210 128 l-10 16 h4z" fill="#6e4526"/>
  <g stroke="#7a5a3a" stroke-width="2"><line x1="70" y1="132" x2="70" y2="150"/><line x1="135" y1="132" x2="135" y2="150"/><line x1="200" y1="132" x2="200" y2="150"/></g>
  <g fill="#b07a4b"><circle cx="70" cy="160" r="9"/><rect x="66" y="150" width="8" height="4"/></g>
  <path d="M130 150 h10 v24 q-5 8 -10 0z" fill="#9aa4ad"/><path d="M196 150 h8 l6 26 h-20z" fill="#c9a24c"/>
  <rect x="0" y="248" width="540" height="14" fill="url(#kCounter)"/><rect x="0" y="260" width="540" height="3" fill="#000" opacity=".12"/>
  <rect x="0" y="263" width="540" height="113" fill="url(#kCab)"/>
  <g fill="none" stroke="#6d8f83" stroke-width="2.5"><rect x="12" y="274" width="100" height="92" rx="4"/><rect x="122" y="274" width="100" height="92" rx="4"/><rect x="232" y="274" width="100" height="92" rx="4"/></g>
  <g fill="url(#gGold)"><circle cx="100" cy="300" r="4"/><circle cx="134" cy="300" r="4"/><circle cx="244" cy="300" r="4"/></g>
  <rect x="370" y="263" width="150" height="113" fill="url(#kSteel)"/>
  <rect x="384" y="290" width="122" height="72" rx="6" fill="#2b2f33"/><rect x="390" y="296" width="110" height="60" rx="4" fill="#3d444a"/>
  <path d="M396 302 h40" stroke="#fff" stroke-width="3" opacity=".25" stroke-linecap="round"/>
  <g fill="#3d444a"><circle cx="395" cy="276" r="5"/><circle cx="420" cy="276" r="5"/><circle cx="470" cy="276" r="5"/><circle cx="495" cy="276" r="5"/></g>
  <g fill="none" stroke="#3d444a" stroke-width="3"><ellipse cx="410" cy="248" rx="26" ry="4"/><ellipse cx="480" cy="248" rx="26" ry="4"/></g>
  <rect x="520" y="200" width="20" height="176" fill="#e8dcc2"/>
  <g>
    <path d="M670 0 V70" stroke="#3a2a1a" stroke-width="2"/>
    <path d="M640 92 Q670 56 700 92Z" fill="#3f7a55"/><ellipse cx="670" cy="92" rx="30" ry="5" fill="#2f6043"/>
    ${t === 'morning' ? '' : `<ellipse cx="670" cy="100" rx="40" ry="12" fill="#ffd27a" opacity=".55"/><polygon points="642,94 698,94 790,330 550,330" fill="#ffd27a" opacity=".16"/>`}
  </g>
  <g>
    <ellipse cx="672" cy="470" rx="130" ry="10" fill="url(#contact)"/>
    <rect x="578" y="360" width="12" height="104" fill="url(#gWood)"/><rect x="756" y="360" width="12" height="104" fill="url(#gWood)"/>
    <path d="M560 328 H786 L798 384 H548Z" fill="url(#kCloth)"/>
    <path d="M548 384 H798" stroke="#c75454" stroke-width="2"/>
    <rect x="560" y="322" width="226" height="8" rx="2" fill="#f0e6d4"/>
  </g>
  <g>
    <rect x="530" y="396" width="44" height="74" rx="4" fill="#d9a86c"/><rect x="530" y="396" width="44" height="12" fill="#c99456"/>
    <ellipse cx="552" cy="474" rx="30" ry="5" fill="url(#contact)"/>
  </g>`,
};

// ───────────── 3. 여름 바닷가 ─────────────
const beach: SceneDef = {
  id: 'beach',
  ko: '여름 바닷가',
  en: 'Summer Beach',
  narrativeKo: '파도 소리가 들리는 여름 바닷가예요. 모래밭, 돗자리, 바위 위의 물건들이 어디 있는지 잘 봐두세요.',
  narrativeEn: 'A summer beach with gentle waves. Watch the sand, the mat and the rocks.',
  objects: ['beachball', 'bucket', 'starfish', 'shell', 'sandcastle', 'crab', 'flipflops', 'hat', 'watermelon', 'glasses', 'books', 'umbrella', 'plane', 'cup'],
  slots: [
    { x: 78, y: 314, t: 'surface', s: 0.8, ko: '왼쪽 바위 위', en: 'on the left rocks' },
    { x: 170, y: 432, t: 'towel', s: 1.0, ko: '돗자리 왼쪽', en: 'left of the mat' },
    { x: 272, y: 432, t: 'towel', s: 1.0, ko: '돗자리 오른쪽', en: 'right of the mat' },
    { x: 330, y: 340, t: 'sand', s: 0.85, ko: '파도 가까운 모래', en: 'sand by the waves' },
    { x: 450, y: 362, t: 'sand', s: 0.9, ko: '모래밭 가운데', en: 'middle of the sand' },
    { x: 560, y: 408, t: 'sand', s: 1.0, ko: '파라솔 왼쪽 모래', en: 'sand left of the parasol' },
    { x: 720, y: 470, t: 'sand', s: 1.15, ko: '오른쪽 아래 모래', en: 'lower right sand' },
    { x: 760, y: 378, t: 'sand', s: 0.95, ko: '파라솔 오른쪽 모래', en: 'sand right of the parasol' },
    { x: 440, y: 478, t: 'sand', s: 1.15, ko: '앞쪽 모래밭', en: 'front sand' },
    { x: 70, y: 476, t: 'sand', s: 1.15, ko: '왼쪽 아래 모래', en: 'lower left sand' },
    { x: 610, y: 330, t: 'sand', s: 0.8, ko: '물가 오른쪽', en: 'right shoreline' },
    { x: 700, y: 236, t: 'surface', s: 0.65, ko: '먼 바위 위', en: 'on the far rock' },
  ],
  bg: (t) => {
    const sea =
      t === 'night' ? ['#1d2f5a', '#2c4778'] : t === 'sunset' ? ['#6a6fa8', '#e7a07a'] : ['#3f93c9', '#7cc4de'];
    return `
  <defs>
    <linearGradient id="bSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sea[0]}"/><stop offset="1" stop-color="${sea[1]}"/></linearGradient>
    <linearGradient id="bSand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9cf9a"/><stop offset="1" stop-color="#f3dfb4"/></linearGradient>
    <pattern id="bDots" width="22" height="18" patternUnits="userSpaceOnUse"><circle cx="4" cy="5" r="1" fill="#c9a56a" opacity=".5"/><circle cx="15" cy="13" r=".8" fill="#fff" opacity=".6"/></pattern>
    <linearGradient id="bRock" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9ea3a8"/><stop offset="1" stop-color="#5f666d"/></linearGradient>
    <pattern id="bMat" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill="#f4e6c4"/><rect width="10" height="20" fill="#5b8fbf" opacity=".75"/></pattern>
  </defs>
  <rect width="800" height="220" fill="${skyFill(t)}"/>
  ${windowView(0, 0, 800, 200, t)}
  <path d="M520 214 q40 -30 90 -8 q30 -14 60 4 V220 H520Z" fill="${t === 'night' ? '#14203f' : '#6f9a8c'}" opacity=".85"/>
  <rect y="212" width="800" height="110" fill="url(#bSea)"/>
  ${t === 'sunset' ? '<g fill="#ffd27a" opacity=".55"><ellipse cx="280" cy="232" rx="40" ry="3"/><ellipse cx="276" cy="254" rx="28" ry="2.4"/><ellipse cx="284" cy="276" rx="18" ry="2"/><ellipse cx="278" cy="298" rx="10" ry="1.6"/></g>' : t === 'night' ? '<g fill="#f4f1dc" opacity=".35"><ellipse cx="600" cy="232" rx="26" ry="2"/><ellipse cx="596" cy="252" rx="18" ry="1.6"/><ellipse cx="604" cy="272" rx="12" ry="1.4"/><ellipse cx="598" cy="292" rx="8" ry="1.2"/></g>' : ''}
  <g stroke="#fff" stroke-width="2" fill="none" opacity=".55" stroke-linecap="round">
    <path d="M40 240 q20 -6 40 0 M180 252 q24 -6 48 0 M360 236 q20 -5 40 0 M520 258 q24 -6 48 0 M680 244 q20 -5 40 0 M100 280 q30 -8 60 0 M420 290 q30 -8 60 0 M640 296 q30 -8 60 0"/>
  </g>
  <path d="M0 316 Q100 300 200 314 T400 312 T600 318 T800 310 V500 H0Z" fill="url(#bSand)"/>
  <path d="M0 316 Q100 300 200 314 T400 312 T600 318 T800 310 V330 Q600 338 400 330 T0 334Z" fill="#d8bb85" opacity=".6"/>
  <path d="M0 316 Q100 300 200 314 T400 312 T600 318 T800 310" stroke="#fff" stroke-width="4" fill="none" opacity=".8"/>
  <rect y="320" width="800" height="180" fill="url(#bDots)"/>
  <g>
    <ellipse cx="80" cy="330" rx="70" ry="8" fill="url(#contact)"/>
    <path d="M18 330 Q16 300 44 292 Q70 280 104 294 Q132 304 136 330Z" fill="url(#bRock)"/>
    <path d="M44 300 q20 -10 44 -2" stroke="#c4c9cd" stroke-width="3" fill="none" opacity=".6"/>
    <path d="M110 332 Q118 312 140 314 Q156 318 156 334Z" fill="#7a8187"/>
  </g>
  <g>
    <path d="M668 238 Q676 222 700 222 Q724 222 730 240Z" fill="url(#bRock)"/>
    <path d="M660 240 q40 6 80 0" stroke="#fff" stroke-width="2" fill="none" opacity=".6"/>
  </g>
  <g>
    <path d="M120 412 L330 412 L350 470 L96 470Z" fill="url(#bMat)"/>
    <path d="M96 470 L350 470" stroke="#3e6f9b" stroke-width="3"/>
    <path d="M100 476 L346 476" stroke="#000" stroke-width="4" opacity=".08"/>
  </g>
  <g>
    <ellipse cx="660" cy="430" rx="120" ry="20" fill="#000" opacity=".12"/>
    <line x1="660" y1="430" x2="652" y2="250" stroke="#f5f0e6" stroke-width="5"/>
    <path d="M556 300 Q600 230 652 228 Q704 230 750 300 Q726 290 704 300 Q678 288 652 300 Q626 288 602 300 Q580 290 556 300Z" fill="#e0475e"/>
    <path d="M602 300 Q620 250 652 228 Q684 250 704 300 Q678 288 652 300 Q626 288 602 300Z" fill="#fbf6ec"/>
    <circle cx="652" cy="226" r="4" fill="#c9a24c"/>
  </g>
  ${t === 'night' ? '' : `<g fill="none" stroke="#3a3a3a" stroke-width="1.6" stroke-linecap="round" opacity=".6"><path d="M200 80 q6 -6 12 0 q6 -6 12 0"/><path d="M250 60 q5 -5 10 0 q5 -5 10 0"/></g>`}`;
  },
};

export const SCENES: SceneDef[] = [room, kitchen, beach];
