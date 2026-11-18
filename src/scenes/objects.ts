// 기억 그림: 장면에 놓이는 물건들 (SVG 조각)
// 모든 물건은 (0,0)이 바닥에 닿는 점이고, 위쪽(-y)으로 그려진다. 높이는 대략 40~60.

export type SlotType = 'surface' | 'floor' | 'bed' | 'sand' | 'towel';

export interface SceneObject {
  ko: string;
  en: string;
  types: SlotType[];
  svg: string;
}

export const OBJECTS: Record<string, SceneObject> = {
  clock: {
    ko: '빨간 탁상시계', en: 'Red Alarm Clock', types: ['surface', 'bed', 'towel'],
    svg: `
    <path d="M-15 -4 l-4 4 M15 -4 l4 4" stroke="#7a2020" stroke-width="3" stroke-linecap="round"/>
    <circle cx="-14" cy="-44" r="7" fill="url(#gGold)" stroke="#9c7c1f" stroke-width="1.5"/><circle cx="14" cy="-44" r="7" fill="url(#gGold)" stroke="#9c7c1f" stroke-width="1.5"/>
    <circle cx="0" cy="-25" r="21" fill="url(#gRed)" stroke="#8e2525" stroke-width="2"/>
    <circle cx="0" cy="-25" r="15.5" fill="#fffaf0"/>
    <g stroke="#555" stroke-width="1.4"><line x1="0" y1="-39" x2="0" y2="-36"/><line x1="0" y1="-14" x2="0" y2="-11"/><line x1="-14" y1="-25" x2="-11" y2="-25"/><line x1="11" y1="-25" x2="14" y2="-25"/></g>
    <line x1="0" y1="-25" x2="0" y2="-35" stroke="#222" stroke-width="2" stroke-linecap="round"/><line x1="0" y1="-25" x2="7" y2="-22" stroke="#222" stroke-width="2" stroke-linecap="round"/>
    <circle cx="0" cy="-25" r="1.8" fill="#d64545"/>
    <path d="M-12 -36 a17 17 0 0 1 9 -6" stroke="#fff" stroke-width="2.5" opacity=".7" fill="none" stroke-linecap="round"/>`,
  },
  cup: {
    ko: '파란 줄무늬 찻잔', en: 'Blue Striped Teacup', types: ['surface', 'towel'],
    svg: `
    <ellipse cx="0" cy="-3" rx="24" ry="5.5" fill="#f7f3ec" stroke="#c9b9a0" stroke-width="1.5"/>
    <path d="M13 -23 q12 0 9 10 q-3 5 -11 3" stroke="#5b8fbf" stroke-width="3.2" fill="none"/>
    <path d="M-15 -27 L15 -27 Q13 -7 0 -7 Q-13 -7 -15 -27Z" fill="url(#gPorcelain)" stroke="#5b8fbf" stroke-width="1.6"/>
    <path d="M-14.2 -20 L14.2 -20 L13.4 -16 L-13.4 -16Z" fill="#5b8fbf"/>
    <ellipse cx="0" cy="-27" rx="15" ry="3.4" fill="#8a4f26"/>
    <path d="M-4 -34 q-4 -6 0 -11 q4 -5 0 -10 M5 -33 q-4 -5 0 -9" stroke="#fff" stroke-width="2" fill="none" opacity=".75" stroke-linecap="round"/>`,
  },
  shoes: {
    ko: '빨간 구두 한 켤레', en: 'Pair of Red Shoes', types: ['floor'],
    svg: `
    <path d="M-2 -4 L-2 -15 Q-2 -21 6 -21 L12 -21 Q16 -13 26 -13 Q32 -13 32 -6 L32 -4Z" fill="#a82d22"/>
    <path d="M-32 -2 L-32 -14 Q-32 -20 -24 -20 L-18 -20 Q-14 -11 -4 -11 Q2 -11 2 -4 L2 -2Z" fill="url(#gRed)"/>
    <path d="M-25 -20 Q-20 -24 -15 -19" stroke="#7a1d15" stroke-width="2" fill="none"/>
    <path d="M5 -21 Q10 -25 15 -20" stroke="#6e1a12" stroke-width="2" fill="none"/>
    <path d="M-32 -2 h6 v-6 h-6z M-2 -4 h6 v-6 h-6z" fill="#3a1410"/>
    <path d="M-26 -16 q4 -2 8 0 M4 -17 q4 -2 8 0" stroke="#f08a80" stroke-width="1.5" fill="none"/>`,
  },
  bear: {
    ko: '곰인형', en: 'Teddy Bear', types: ['surface', 'bed', 'floor', 'towel'],
    svg: `
    <ellipse cx="-11" cy="-6" rx="8" ry="6" fill="#9a6535"/><ellipse cx="11" cy="-6" rx="8" ry="6" fill="#9a6535"/>
    <ellipse cx="-11" cy="-6" rx="4" ry="3" fill="#e2c39b"/><ellipse cx="11" cy="-6" rx="4" ry="3" fill="#e2c39b"/>
    <ellipse cx="0" cy="-20" rx="16" ry="16" fill="url(#gFur)"/>
    <ellipse cx="0" cy="-18" rx="9" ry="10" fill="#c99a68"/>
    <ellipse cx="-17" cy="-24" rx="5.5" ry="9" fill="#9a6535" transform="rotate(25 -17 -24)"/><ellipse cx="17" cy="-24" rx="5.5" ry="9" fill="#9a6535" transform="rotate(-25 17 -24)"/>
    <circle cx="-10" cy="-54" r="5.5" fill="#a8743f"/><circle cx="10" cy="-54" r="5.5" fill="#a8743f"/>
    <circle cx="-10" cy="-54" r="2.8" fill="#e2c39b"/><circle cx="10" cy="-54" r="2.8" fill="#e2c39b"/>
    <circle cx="0" cy="-44" r="13" fill="url(#gFur)"/>
    <ellipse cx="0" cy="-40" rx="6.5" ry="5" fill="#e2c39b"/>
    <circle cx="-5" cy="-47" r="1.7" fill="#2a1a0e"/><circle cx="5" cy="-47" r="1.7" fill="#2a1a0e"/>
    <ellipse cx="0" cy="-42" rx="2.4" ry="1.7" fill="#2a1a0e"/>
    <path d="M-6 -32 l6 3 l6 -3 l-2 5 l-4 -2 l-4 2z" fill="#d23b3b"/>`,
  },
  cactus: {
    ko: '작은 선인장 화분', en: 'Little Cactus Pot', types: ['surface', 'floor'],
    svg: `
    <path d="M-12 -18 L12 -18 L9 0 L-9 0Z" fill="url(#gClay)"/><rect x="-14" y="-22" width="28" height="6" rx="2" fill="#c56238"/>
    <rect x="-6" y="-48" width="12" height="28" rx="6" fill="url(#gCactus)"/>
    <path d="M-6 -32 h-6 a4 4 0 0 1 -4 -4 v-6 a3 3 0 0 1 6 0 v4 h4" fill="#5e9b5a"/>
    <path d="M6 -36 h5 a4 4 0 0 0 4 -4 v-5 a3 3 0 0 0 -6 0 v3 h-3" fill="#5e9b5a"/>
    <g stroke="#e9f2d9" stroke-width="1" opacity=".8"><line x1="-2" y1="-44" x2="-2" y2="-24"/><line x1="2" y1="-44" x2="2" y2="-24"/></g>
    <circle cx="0" cy="-50" r="3.5" fill="#f08bb0"/>`,
  },
  umbrella: {
    ko: '노란 우산', en: 'Yellow Umbrella', types: ['floor', 'sand'],
    svg: `
    <g transform="rotate(-10)">
      <line x1="0" y1="-86" x2="0" y2="-78" stroke="#555" stroke-width="2"/>
      <path d="M0 -79 L10 -24 Q0 -17 -10 -24Z" fill="url(#gYellow)"/>
      <path d="M0 -79 L3 -21 M0 -79 L-4 -22" stroke="#d6a51b" stroke-width="1.2"/>
      <rect x="-5" y="-50" width="10" height="4" rx="1" fill="#d6a51b"/>
      <path d="M0 -20 L0 -6 q0 7 -7 7 q-6 0 -6 -6" stroke="#6b4423" stroke-width="3.2" fill="none" stroke-linecap="round"/>
    </g>`,
  },
  apples: {
    ko: '사과 바구니', en: 'Basket of Apples', types: ['surface', 'floor'],
    svg: `
    <circle cx="-10" cy="-18" r="8.5" fill="url(#gApple)"/><circle cx="9" cy="-18" r="8.5" fill="url(#gApple)"/><circle cx="-1" cy="-27" r="8.5" fill="url(#gApple)"/>
    <circle cx="-4" cy="-30" r="2.5" fill="#fff" opacity=".55"/>
    <path d="M-1 -35 q1 -4 3 -6" stroke="#5a3a1a" stroke-width="1.6" fill="none"/><ellipse cx="4" cy="-39" rx="4" ry="2" fill="#5e9b5a" transform="rotate(-25 4 -39)"/>
    <path d="M-25 -15 Q-23 0 0 0 Q23 0 25 -15Z" fill="url(#gWicker)" stroke="#a88650" stroke-width="1.5"/>
    <path d="M-22 -9 h44 M-19 -4 h38" stroke="#a88650" stroke-width="1.2"/>`,
  },
  books: {
    ko: '책 세 권', en: 'Three Books', types: ['surface', 'floor', 'bed', 'towel'],
    svg: `
    <rect x="-23" y="-10" width="46" height="10" rx="1.5" fill="#2f5d8a"/><rect x="-21" y="-8" width="40" height="6" fill="#f2ead8"/>
    <rect x="-19" y="-19" width="40" height="9" rx="1.5" fill="#8a3b2f"/><rect x="-17" y="-17" width="35" height="5" fill="#f2ead8"/>
    <rect x="-21" y="-27" width="37" height="8" rx="1.5" fill="#3f7a55"/><rect x="-19" y="-25" width="32" height="4" fill="#f2ead8"/>
    <rect x="-23" y="-10" width="5" height="10" fill="#244a70"/><rect x="-19" y="-19" width="5" height="9" fill="#6e2e24"/><rect x="-21" y="-27" width="5" height="8" fill="#2f6043"/>
    <path d="M-10 -24 h14" stroke="#c9a24c" stroke-width="1"/>`,
  },
  glasses: {
    ko: '동그란 안경', en: 'Round Glasses', types: ['surface', 'bed', 'towel'],
    svg: `
    <path d="M-20 -10 L-28 -16 M20 -10 L28 -16" stroke="#3a2a1a" stroke-width="2" stroke-linecap="round"/>
    <ellipse cx="-11" cy="-8" rx="9" ry="7" fill="#cfe6f5" fill-opacity=".55" stroke="#3a2a1a" stroke-width="2.4"/>
    <ellipse cx="11" cy="-8" rx="9" ry="7" fill="#cfe6f5" fill-opacity=".55" stroke="#3a2a1a" stroke-width="2.4"/>
    <path d="M-2 -10 q2 -3 4 0" stroke="#3a2a1a" stroke-width="2" fill="none"/>
    <path d="M-15 -11 l4 -2 M7 -11 l4 -2" stroke="#fff" stroke-width="1.5" opacity=".8"/>`,
  },
  cat: {
    ko: '잠자는 고양이', en: 'Sleeping Cat', types: ['floor', 'bed', 'towel'],
    svg: `
    <path d="M24 -6 Q34 4 8 3" stroke="#d97d34" stroke-width="7" fill="none" stroke-linecap="round"/>
    <ellipse cx="2" cy="-13" rx="27" ry="13" fill="url(#gCat)"/>
    <g stroke="#b9621f" stroke-width="2.4" fill="none" opacity=".8"><path d="M-2 -25 q3 6 0 11"/><path d="M8 -24 q3 6 0 11"/><path d="M18 -21 q2 5 0 9"/></g>
    <circle cx="-20" cy="-16" r="11" fill="#ef9a48"/>
    <path d="M-29 -22 L-28 -33 L-21 -26Z M-15 -26 L-10 -34 L-9 -23Z" fill="#ef9a48"/>
    <path d="M-27 -24 L-27 -30 L-23 -26Z" fill="#f6c3b0"/>
    <path d="M-25 -16 q2 2 4 0 M-17 -16 q2 2 4 0" stroke="#5a3010" stroke-width="1.5" fill="none"/>
    <ellipse cx="-20" cy="-11" rx="2" ry="1.4" fill="#d9707a"/>
    <ellipse cx="-14" cy="-3" rx="7" ry="3.5" fill="#f6e3cf"/>`,
  },
  candle: {
    ko: '촛대와 초', en: 'Candlestick', types: ['surface'],
    svg: `
    <circle cx="0" cy="-46" r="20" fill="url(#gGlow)"/>
    <ellipse cx="0" cy="-4" rx="15" ry="4" fill="url(#gGold)"/><rect x="-3" y="-14" width="6" height="10" fill="#b38b35"/>
    <ellipse cx="0" cy="-14" rx="9" ry="3" fill="#d8b456"/>
    <rect x="-5" y="-40" width="10" height="26" rx="1" fill="#fbf6ea" stroke="#e6dcc6" stroke-width="1"/>
    <path d="M0 -55 q6 7 0 13 q-6 -6 0 -13z" fill="#ffb02e"/><path d="M0 -51 q3 4 0 8 q-3 -4 0 -8z" fill="#fff3b0"/>`,
  },
  globe: {
    ko: '지구본', en: 'Globe', types: ['surface'],
    svg: `
    <ellipse cx="0" cy="-4" rx="13" ry="4" fill="#7a4c2a"/><rect x="-2" y="-14" width="4" height="10" fill="#7a4c2a"/>
    <circle cx="0" cy="-34" r="17" fill="url(#gSea)"/>
    <path d="M-12 -42 q6 -6 12 -2 q2 6 -5 8 q-5 2 -7 -6z M2 -30 q8 -3 11 3 q-2 8 -9 6 q-4 -4 -2 -9z M-14 -28 q4 2 3 7 q-4 0 -3 -7z" fill="#7cbf6a"/>
    <path d="M-14 -18 A22 22 0 0 0 16 -52" stroke="#c9a24c" stroke-width="3" fill="none"/>
    <circle cx="-6" cy="-41" r="4" fill="#fff" opacity=".3"/>`,
  },
  musicbox: {
    ko: '나무 오르골', en: 'Wooden Music Box', types: ['surface'],
    svg: `
    <path d="M-20 -22 L-16 -42 L20 -42 L20 -22Z" fill="#a8693a"/><path d="M-17 -40 L17 -40 L17 -24 L-17 -24Z" fill="#f3e3c2" opacity=".7"/>
    <circle cx="0" cy="-32" r="4" fill="#d84f7a"/><path d="M0 -36 l-3 -6 h6z" fill="#d84f7a"/>
    <rect x="-22" y="-22" width="44" height="21" rx="2" fill="url(#gWood)"/>
    <rect x="-18" y="-18" width="36" height="13" rx="1" fill="none" stroke="#c9a24c" stroke-width="1.5"/>
    <path d="M22 -13 h6 m0 -4 v8" stroke="#c9a24c" stroke-width="2.4" stroke-linecap="round"/>`,
  },
  plane: {
    ko: '종이비행기', en: 'Paper Plane', types: ['floor', 'bed', 'sand', 'towel'],
    svg: `
    <path d="M-24 -6 L26 -16 L-4 -2 Z" fill="#ffffff" stroke="#b8c4d0" stroke-width="1.2"/>
    <path d="M-4 -2 L26 -16 L2 -14 Z" fill="#e6edf3" stroke="#b8c4d0" stroke-width="1.2"/>
    <path d="M2 -14 L-2 -6 L-4 -2" stroke="#b8c4d0" stroke-width="1.2" fill="none"/>`,
  },
  // ---- 부엌 ----
  kettle: {
    ko: '초록 주전자', en: 'Green Kettle', types: ['surface'],
    svg: `
    <path d="M-16 -36 Q-26 -36 -28 -26" stroke="#3f7a55" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M16 -24 L30 -34 L31 -31 L19 -18Z" fill="#3f7a55"/>
    <path d="M-20 -2 Q-24 -30 0 -36 Q24 -30 20 -2Z" fill="url(#gGreen)"/>
    <ellipse cx="0" cy="-2" rx="20" ry="3.5" fill="#2f6043"/>
    <ellipse cx="0" cy="-36" rx="9" ry="3" fill="#2f6043"/><circle cx="0" cy="-41" r="3.2" fill="#1f1f1f"/>
    <path d="M-10 -54 q10 -12 20 0" stroke="#1f1f1f" stroke-width="3" fill="none"/>
    <path d="M-12 -26 q2 -6 6 -7" stroke="#fff" stroke-width="3" opacity=".45" fill="none" stroke-linecap="round"/>`,
  },
  teapot: {
    ko: '꽃무늬 찻주전자', en: 'Floral Teapot', types: ['surface'],
    svg: `
    <path d="M17 -18 Q30 -18 30 -32" stroke="#e8e1d4" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M-17 -24 Q-30 -22 -32 -34 L-28 -36 Q-26 -28 -17 -30Z" fill="#f2ede4" stroke="#cbbfa9"/>
    <ellipse cx="0" cy="-18" rx="19" ry="17" fill="url(#gPorcelain)" stroke="#cbbfa9" stroke-width="1.2"/>
    <ellipse cx="0" cy="-34" rx="9" ry="3" fill="#e8e1d4"/><circle cx="0" cy="-38" r="3" fill="#e05a7a"/>
    <g fill="#e05a7a"><circle cx="-7" cy="-18" r="3"/><circle cx="6" cy="-14" r="2.6"/><circle cx="2" cy="-24" r="2.2"/></g>
    <g fill="#5e9b5a"><ellipse cx="-3" cy="-16" rx="2.5" ry="1.2"/><ellipse cx="9" cy="-19" rx="2.5" ry="1.2"/></g>
    <ellipse cx="0" cy="-1" rx="12" ry="2.5" fill="#cbbfa9"/>`,
  },
  bread: {
    ko: '식빵 한 덩이', en: 'Loaf of Bread', types: ['surface'],
    svg: `
    <rect x="-30" y="-6" width="60" height="6" rx="2" fill="#a46d44"/>
    <path d="M-24 -6 L-24 -24 Q-24 -36 -12 -36 Q-2 -40 6 -36 Q24 -38 24 -24 L24 -6Z" fill="url(#gBread)"/>
    <path d="M-12 -30 q4 -4 8 0 M2 -31 q4 -4 8 0 M14 -30 q3 -3 6 0" stroke="#a8612a" stroke-width="2" fill="none" stroke-linecap="round"/>`,
  },
  jam: {
    ko: '딸기잼 병', en: 'Strawberry Jam Jar', types: ['surface'],
    svg: `
    <rect x="-12" y="-30" width="24" height="30" rx="5" fill="#c22c3e"/>
    <rect x="-12" y="-30" width="24" height="30" rx="5" fill="url(#gGlass)"/>
    <path d="M-14 -34 Q0 -42 14 -34 L12 -28 H-12Z" fill="#f5f0e6"/>
    <g fill="#e0475e"><rect x="-14" y="-34" width="4" height="4"/><rect x="-6" y="-37" width="4" height="4"/><rect x="2" y="-37" width="4" height="4"/><rect x="10" y="-34" width="4" height="4"/></g>
    <rect x="-8" y="-20" width="16" height="10" rx="1.5" fill="#fffaf0"/><circle cx="0" cy="-15" r="3" fill="#e0475e"/>`,
  },
  eggs: {
    ko: '달걀 그릇', en: 'Bowl of Eggs', types: ['surface'],
    svg: `
    <ellipse cx="-8" cy="-18" rx="7" ry="9" fill="#f4e3c8"/><ellipse cx="8" cy="-18" rx="7" ry="9" fill="#efd9b6"/><ellipse cx="0" cy="-24" rx="7" ry="9" fill="#fbf0dc"/>
    <path d="M-22 -14 Q-20 0 0 0 Q20 0 22 -14Z" fill="#5b8fbf"/>
    <path d="M-22 -14 H22" stroke="#4a7aa6" stroke-width="2.5"/>
    <path d="M-16 -8 h32" stroke="#fff" stroke-width="1.5" stroke-dasharray="3 4" opacity=".7"/>`,
  },
  milk: {
    ko: '우유병', en: 'Milk Bottle', types: ['surface', 'floor'],
    svg: `
    <path d="M-8 -48 h16 v6 Q14 -36 14 -28 V-2 Q14 0 12 0 H-12 Q-14 0 -14 -2 V-28 Q-14 -36 -8 -42Z" fill="#fbfbf6" stroke="#cfd6dd" stroke-width="1.4"/>
    <rect x="-9" y="-52" width="18" height="6" rx="1.5" fill="#5b8fbf"/>
    <rect x="-14" y="-24" width="28" height="12" fill="#5b8fbf" opacity=".85"/>
    <path d="M-9 -30 v20" stroke="#fff" stroke-width="3" opacity=".6"/>`,
  },
  pumpkin: {
    ko: '작은 호박', en: 'Little Pumpkin', types: ['surface', 'floor'],
    svg: `
    <ellipse cx="-10" cy="-14" rx="12" ry="14" fill="#e07b2a"/><ellipse cx="10" cy="-14" rx="12" ry="14" fill="#e07b2a"/>
    <ellipse cx="0" cy="-14" rx="11" ry="15" fill="url(#gPumpkin)"/>
    <path d="M0 -28 q1 -6 4 -9" stroke="#5a3a1a" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M4 -34 q8 -4 10 2 q-6 2 -10 -2z" fill="#5e9b5a"/>`,
  },
  // ---- 바닷가 ----
  beachball: {
    ko: '비치볼', en: 'Beach Ball', types: ['sand', 'towel'],
    svg: `
    <circle cx="0" cy="-17" r="17" fill="#fff"/>
    <path d="M0 -34 A17 17 0 0 0 -15 -9 Q-6 -20 0 -34Z" fill="#e0475e"/>
    <path d="M0 -34 A17 17 0 0 1 15 -9 Q6 -20 0 -34Z" fill="#3b82c4"/>
    <path d="M-15 -9 A17 17 0 0 0 15 -9 Q0 -14 -15 -9Z" fill="#f2c230"/>
    <circle cx="0" cy="-17" r="17" fill="url(#gBall)"/>`,
  },
  bucket: {
    ko: '파란 모래 양동이', en: 'Blue Sand Bucket', types: ['sand'],
    svg: `
    <path d="M-15 -30 L15 -30 L11 0 L-11 0Z" fill="url(#gSea)"/>
    <ellipse cx="0" cy="-30" rx="15" ry="4" fill="#2c5f8f"/>
    <path d="M-15 -30 Q0 -50 15 -30" stroke="#f2c230" stroke-width="2.4" fill="none"/>
    <path d="M14 -4 L30 -40" stroke="#e0475e" stroke-width="3" stroke-linecap="round"/><path d="M27 -46 l8 4 l-4 10 l-8 -4z" fill="#e0475e"/>
    <path d="M-10 -24 v18" stroke="#fff" stroke-width="2.4" opacity=".4"/>`,
  },
  starfish: {
    ko: '주황 불가사리', en: 'Orange Starfish', types: ['sand', 'surface'],
    svg: `
    <g transform="translate(0 -10) scale(1 .55)">
      <path d="M0 -22 L6 -7 L22 -6 L9 3 L14 19 L0 10 L-14 19 L-9 3 L-22 -6 L-6 -7Z" fill="#ef8a3c" stroke="#c9692a" stroke-width="2" stroke-linejoin="round"/>
      <g fill="#ffd2a6"><circle cx="0" cy="-12" r="1.6"/><circle cx="12" cy="-4" r="1.6"/><circle cx="-12" cy="-4" r="1.6"/><circle cx="7" cy="9" r="1.6"/><circle cx="-7" cy="9" r="1.6"/></g>
    </g>`,
  },
  shell: {
    ko: '분홍 조개껍데기', en: 'Pink Seashell', types: ['sand', 'surface', 'towel'],
    svg: `
    <path d="M-16 -4 Q-18 -26 0 -28 Q18 -26 16 -4 Q0 2 -16 -4Z" fill="url(#gShell)" stroke="#d98a9a" stroke-width="1.2"/>
    <g stroke="#d98a9a" stroke-width="1.3" fill="none"><path d="M0 -2 V-27"/><path d="M-1 -2 L-10 -24"/><path d="M1 -2 L10 -24"/><path d="M-2 -3 L-15 -14"/><path d="M2 -3 L15 -14"/></g>
    <path d="M-6 -4 h12 l-2 4 h-8z" fill="#e6a3b0"/>`,
  },
  sandcastle: {
    ko: '모래성', en: 'Sandcastle', types: ['sand'],
    svg: `
    <path d="M-28 0 L-26 -22 L-16 -22 L-16 -30 L-8 -30 L-8 -22 L8 -22 L8 -30 L16 -30 L16 -22 L26 -22 L28 0Z" fill="url(#gSand)"/>
    <rect x="-8" y="-46" width="16" height="24" fill="#e2c38c"/>
    <path d="M-8 -46 h4 v-4 h4 v4 h4 v-4 h4 v4" fill="#e2c38c"/>
    <path d="M-4 0 v-10 a4 4 0 0 1 8 0 v10z" fill="#a88650"/>
    <line x1="0" y1="-50" x2="0" y2="-64" stroke="#6b4423" stroke-width="1.5"/><path d="M0 -64 l10 3 l-10 3z" fill="#e0475e"/>`,
  },
  crab: {
    ko: '빨간 게', en: 'Red Crab', types: ['sand', 'surface'],
    svg: `
    <g stroke="#b8322a" stroke-width="2.4" stroke-linecap="round" fill="none"><path d="M-12 -6 l-8 6 M-10 -3 l-6 7 M12 -6 l8 6 M10 -3 l6 7"/><path d="M-12 -14 q-8 -6 -12 -14 M12 -14 q8 -6 12 -14"/></g>
    <path d="M-30 -30 q-4 -8 4 -10 l2 6 l4 -6 q4 8 -10 10z M30 -30 q4 -8 -4 -10 l-2 6 l-4 -6 q-4 8 10 10z" fill="#e0473a"/>
    <ellipse cx="0" cy="-11" rx="16" ry="10" fill="url(#gRed)"/>
    <line x1="-5" y1="-20" x2="-6" y2="-27" stroke="#b8322a" stroke-width="2"/><line x1="5" y1="-20" x2="6" y2="-27" stroke="#b8322a" stroke-width="2"/>
    <circle cx="-6" cy="-28" r="3" fill="#fff"/><circle cx="6" cy="-28" r="3" fill="#fff"/><circle cx="-6" cy="-28" r="1.4" fill="#222"/><circle cx="6" cy="-28" r="1.4" fill="#222"/>`,
  },
  flipflops: {
    ko: '초록 슬리퍼', en: 'Green Flip-flops', types: ['sand'],
    svg: `
    <ellipse cx="-12" cy="-6" rx="10" ry="6" fill="#4ca37a" transform="rotate(-12 -12 -6)"/>
    <ellipse cx="12" cy="-6" rx="10" ry="6" fill="#4ca37a" transform="rotate(14 12 -6)"/>
    <path d="M-20 -6 Q-13 -16 -6 -6 M5 -5 Q12 -16 19 -6" stroke="#f5f0e6" stroke-width="2.6" fill="none"/>`,
  },
  hat: {
    ko: '밀짚모자', en: 'Straw Hat', types: ['sand', 'towel', 'surface'],
    svg: `
    <ellipse cx="0" cy="-6" rx="30" ry="8" fill="url(#gStraw)"/>
    <path d="M-15 -8 Q-16 -30 0 -30 Q16 -30 15 -8Z" fill="#e6c27a"/>
    <path d="M-15 -12 Q0 -6 15 -12 L15 -8 Q0 -2 -15 -8Z" fill="#e0475e"/>
    <path d="M-24 -6 q24 6 48 0" stroke="#c9a24c" stroke-width="1" fill="none"/>`,
  },
  watermelon: {
    ko: '수박 한 조각', en: 'Watermelon Slice', types: ['towel', 'surface'],
    svg: `
    <path d="M-24 -4 Q0 -46 24 -4Z" fill="#e8475a"/>
    <path d="M-24 -4 Q0 -46 24 -4" stroke="#3f8a4a" stroke-width="5" fill="none" transform="translate(0 2)"/>
    <path d="M-24 -4 H24" stroke="#3f8a4a" stroke-width="5"/>
    <path d="M-22 -6 H22" stroke="#cfe8b4" stroke-width="2"/>
    <g fill="#2a1a0e"><ellipse cx="-8" cy="-14" rx="1.5" ry="2.3"/><ellipse cx="2" cy="-20" rx="1.5" ry="2.3"/><ellipse cx="9" cy="-12" rx="1.5" ry="2.3"/><ellipse cx="-2" cy="-10" rx="1.5" ry="2.3"/></g>`,
  },
};
