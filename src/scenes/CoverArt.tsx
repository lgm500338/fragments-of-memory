import React from 'react';

// 문장 모드(동화·소설 / 명언) 표지 삽화. 400 x 300.
interface Props {
  type: string;
  title?: string;
  levelNumber?: number;
}

const DEFS = `
<radialGradient id="cvGlow"><stop offset="0" stop-color="#ffd27a" stop-opacity=".85"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
<radialGradient id="cvVig" cx=".5" cy=".45" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#1a1006" stop-opacity=".45"/></radialGradient>
<linearGradient id="cvBand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></linearGradient>
<filter id="cvGrain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="5"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 .08"/></feComponentTransfer><feComposite in2="SourceGraphic" operator="in"/></filter>
<filter id="cvBlur"><feGaussianBlur stdDeviation="2"/></filter>
`;

function stars(n: number, seed: number, maxY: number, x0 = 0, w = 400, y0 = 0) {
  let s = seed;
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  let out = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + r() * w;
    const y = y0 + r() * maxY;
    const rad = 0.5 + r() * 1.3;
    out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rad.toFixed(2)}" fill="#fff" opacity="${(0.4 + r() * 0.6).toFixed(2)}"/>`;
  }
  return out;
}

// 별이 빛나는 동화의 밤
const nightBase = `
<defs><linearGradient id="cvN" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1236"/><stop offset=".6" stop-color="#2b3a78"/><stop offset="1" stop-color="#6a5a8e"/></linearGradient>
<linearGradient id="cvDune1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c79a6a"/><stop offset="1" stop-color="#8a6446"/></linearGradient>
<linearGradient id="cvDune2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9c7452"/><stop offset="1" stop-color="#5e4232"/></linearGradient></defs>
<rect width="400" height="300" fill="url(#cvN)"/>
${stars(70, 7, 200)}
<g stroke="#fff" stroke-linecap="round"><line x1="60" y1="40" x2="110" y2="62" stroke-width="1.6" opacity=".8"/><line x1="60" y1="40" x2="140" y2="76" stroke-width=".6" opacity=".35"/></g>
<circle cx="300" cy="78" r="44" fill="#fff3c4" opacity=".08"/>
<circle cx="300" cy="78" r="26" fill="#fbf1c8"/><circle cx="312" cy="70" r="23" fill="#24306a"/>
__MID__<path d="M0 230 Q90 196 190 222 T400 210 V300 H0Z" fill="url(#cvDune1)"/>
<path d="M0 262 Q120 236 230 258 T400 250 V300 H0Z" fill="url(#cvDune2)"/>
<path d="M30 232 q60 -18 120 -6" stroke="#f1d1a0" stroke-width="1.5" fill="none" opacity=".5"/>
<g transform="translate(300 236)"><rect x="-4" y="-2" width="8" height="10" fill="#5a3a24"/>
  <circle cx="0" cy="4" r="14" fill="url(#cvGlow)"/></g>`;

// 햇살 가득한 초원과 큰 나무 (앨리스)
const meadow = `
<defs><linearGradient id="cvSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fc3ea"/><stop offset="1" stop-color="#f6e8c6"/></linearGradient>
<linearGradient id="cvG1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fcf7f"/><stop offset="1" stop-color="#5f9a52"/></linearGradient>
<linearGradient id="cvG2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fb666"/><stop offset="1" stop-color="#3f7a45"/></linearGradient>
<radialGradient id="cvLeaf" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#7fbf68"/><stop offset="1" stop-color="#2f6a3c"/></radialGradient></defs>
<rect width="400" height="300" fill="url(#cvSky)"/>
<circle cx="70" cy="60" r="22" fill="#fff6cc"/><circle cx="70" cy="60" r="44" fill="#fff6cc" opacity=".3"/>
<g fill="#fff" opacity=".9"><ellipse cx="200" cy="54" rx="34" ry="10"/><ellipse cx="222" cy="46" rx="22" ry="10"/><ellipse cx="330" cy="90" rx="26" ry="7"/></g>
<path d="M0 200 Q100 170 200 192 T400 180 V300 H0Z" fill="url(#cvG1)"/>
<path d="M0 240 Q140 214 260 236 T400 230 V300 H0Z" fill="url(#cvG2)"/>
<path d="M170 300 Q190 250 230 214 Q240 206 252 204" stroke="#e9d6a8" stroke-width="16" fill="none" stroke-linecap="round" opacity=".8"/>
<g><path d="M300 210 q-6 -40 4 -70 q-14 -10 -10 -24 M304 140 q14 -14 26 -10" stroke="#6b4423" stroke-width="10" fill="none" stroke-linecap="round"/>
  <circle cx="300" cy="104" r="40" fill="url(#cvLeaf)"/><circle cx="270" cy="124" r="26" fill="url(#cvLeaf)"/><circle cx="334" cy="124" r="28" fill="url(#cvLeaf)"/>
  <ellipse cx="300" cy="212" rx="44" ry="6" fill="#000" opacity=".15" filter="url(#cvBlur)"/></g>
<g transform="translate(286 150)"><line x1="0" y1="0" x2="0" y2="14" stroke="#9c7c1f" stroke-width="1.2"/><circle cx="0" cy="20" r="7" fill="#e8c55a" stroke="#9c7c1f"/><circle cx="0" cy="20" r="4.6" fill="#fffaf0"/><path d="M0 20 v-3 M0 20 h2.5" stroke="#333" stroke-width="1"/></g>
<g><rect x="96" y="232" width="6" height="12" fill="#f5efe0"/><path d="M86 234 q13 -18 26 0z" fill="#d6453a"/><g fill="#fff"><circle cx="94" cy="229" r="2"/><circle cx="104" cy="227" r="1.6"/></g>
  <rect x="122" y="240" width="4" height="8" fill="#f5efe0"/><path d="M115 242 q9 -12 18 0z" fill="#d6453a"/></g>
<g fill="#fff"><circle cx="40" cy="262" r="3"/><circle cx="60" cy="276" r="2.5"/><circle cx="360" cy="268" r="3"/></g>
<g fill="#f2c230"><circle cx="40" cy="262" r="1.2"/><circle cx="60" cy="276" r="1"/><circle cx="360" cy="268" r="1.2"/></g>
<g fill="#e98bb0"><circle cx="150" cy="276" r="3"/><circle cx="210" cy="282" r="2.5"/><circle cx="380" cy="286" r="2.5"/></g>
<g transform="translate(140 150) rotate(-10)"><path d="M0 0 q-10 -10 -14 -2 q4 8 14 2 q10 -10 14 -2 q-4 8 -14 2" fill="#f0a24a"/><line x1="0" y1="-4" x2="0" y2="4" stroke="#333"/></g>`;

// 등불 켜진 서재 (셜록 홈즈·개츠비)
const study = `
<defs><linearGradient id="cvWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2a22"/><stop offset="1" stop-color="#5a3e2c"/></linearGradient>
<linearGradient id="cvDesk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a4c2a"/><stop offset="1" stop-color="#4a2c18"/></linearGradient>
<linearGradient id="cvWin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a2550"/><stop offset="1" stop-color="#3b4a80"/></linearGradient></defs>
<rect width="400" height="300" fill="url(#cvWall)"/>
<g stroke="#2a1c14" stroke-width="2" opacity=".5"><line x1="0" y1="40" x2="400" y2="40"/></g>
<rect x="230" y="30" width="130" height="140" rx="4" fill="#2a1c14"/><rect x="238" y="38" width="114" height="124" fill="url(#cvWin)"/>
${stars(16, 3, 60, 238, 114, 40)}
<g fill="#0e1430"><rect x="238" y="122" width="18" height="40"/><rect x="258" y="108" width="14" height="54"/><rect x="274" y="130" width="22" height="32"/><rect x="298" y="100" width="12" height="62"/><rect x="312" y="118" width="20" height="44"/><rect x="334" y="128" width="18" height="34"/></g>
<g fill="#ffd27a"><rect x="261" y="114" width="3" height="4"/><rect x="301" y="108" width="3" height="4"/><rect x="301" y="122" width="3" height="4"/><rect x="316" y="126" width="3" height="4"/><rect x="278" y="138" width="3" height="4"/></g>
<rect x="292" y="38" width="4" height="124" fill="#2a1c14"/><rect x="238" y="98" width="114" height="4" fill="#2a1c14"/>
<g stroke="#9db2d8" stroke-width="1" opacity=".35"><line x1="246" y1="50" x2="242" y2="62"/><line x1="276" y1="70" x2="272" y2="82"/><line x1="330" y1="56" x2="326" y2="68"/><line x1="314" y1="140" x2="310" y2="152"/></g>
<g><rect x="20" y="40" width="150" height="150" fill="#2a1c14"/>
  <rect x="26" y="88" width="138" height="5" fill="#5a3e2c"/><rect x="26" y="140" width="138" height="5" fill="#5a3e2c"/>
  <g><rect x="30" y="56" width="10" height="32" fill="#8a3b2f"/><rect x="42" y="60" width="8" height="28" fill="#2f5d8a"/><rect x="52" y="54" width="12" height="34" fill="#3f7a55"/><rect x="66" y="62" width="9" height="26" fill="#c9a24c"/><rect x="77" y="58" width="11" height="30" fill="#6e2e24"/><rect x="100" y="64" width="30" height="8" fill="#8a3b2f" transform="rotate(-8 100 64)"/>
  <rect x="30" y="108" width="12" height="32" fill="#2f5d8a"/><rect x="44" y="112" width="10" height="28" fill="#8a6a2f"/><rect x="56" y="106" width="9" height="34" fill="#8a3b2f"/><rect x="90" y="110" width="10" height="30" fill="#3f7a55"/><rect x="102" y="104" width="12" height="36" fill="#6e2e24"/><rect x="116" y="112" width="9" height="28" fill="#2f5d8a"/></g></g>
<circle cx="120" cy="200" r="110" fill="url(#cvGlow)" opacity=".55"/>
<rect x="0" y="214" width="400" height="86" fill="url(#cvDesk)"/><rect x="0" y="210" width="400" height="8" fill="#8a5a33"/>
<g><ellipse cx="120" cy="212" rx="22" ry="5" fill="#2f5a3a"/><rect x="117" y="168" width="6" height="44" fill="#c9a24c"/>
  <path d="M86 170 Q120 140 154 170Z" fill="#2f7a4a"/><path d="M86 170 Q120 160 154 170" stroke="#1f5a34" stroke-width="2" fill="none"/>
  <ellipse cx="120" cy="172" rx="30" ry="5" fill="#fff3c4" opacity=".8"/></g>
<g transform="translate(220 210)"><rect x="-40" y="-8" width="80" height="8" fill="#8a3b2f"/><rect x="-36" y="-16" width="72" height="8" fill="#2f5d8a"/><rect x="-30" y="-22" width="60" height="6" fill="#3f7a55"/></g>
<g transform="translate(320 210)"><path d="M-10 0 h20 l-3 -14 h-14z" fill="#1f1f2a"/><path d="M-2 -14 L18 -56" stroke="#f5efe0" stroke-width="2.5"/><path d="M18 -56 q8 10 -2 22 q-6 -8 2 -22z" fill="#f5efe0"/></g>
<g transform="translate(60 260) rotate(-8)"><rect x="-26" y="-14" width="52" height="28" fill="#efe3c6"/><g stroke="#8a7a5a" stroke-width="1"><line x1="-20" y1="-6" x2="18" y2="-6"/><line x1="-20" y1="0" x2="14" y2="0"/><line x1="-20" y1="6" x2="16" y2="6"/></g></g>`;

// 펼쳐진 책과 깃펜 (명언)
const parchment = `
<defs><linearGradient id="cvTbl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a3a24"/><stop offset="1" stop-color="#2e1d12"/></linearGradient>
<linearGradient id="cvPgL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#efe1c0"/><stop offset="1" stop-color="#d8c49a"/></linearGradient>
<linearGradient id="cvPgR" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d8c49a"/><stop offset="1" stop-color="#f3e7cb"/></linearGradient></defs>
<rect width="400" height="300" fill="url(#cvTbl)"/>
<g stroke="#000" opacity=".15"><line x1="0" y1="70" x2="400" y2="76"/><line x1="0" y1="160" x2="400" y2="150"/><line x1="0" y1="240" x2="400" y2="246"/></g>
<circle cx="320" cy="90" r="120" fill="url(#cvGlow)" opacity=".6"/>
<g transform="translate(320 120)"><ellipse cx="0" cy="40" rx="20" ry="5" fill="#9c7c1f"/><rect x="-7" y="-10" width="14" height="50" fill="#fbf6ea"/><path d="M0 -26 q8 9 0 17 q-8 -8 0 -17z" fill="#ffb02e"/><path d="M0 -21 q4 5 0 10 q-4 -5 0 -10z" fill="#fff3b0"/></g>
<ellipse cx="190" cy="248" rx="150" ry="12" fill="#000" opacity=".35" filter="url(#cvBlur)"/>
<path d="M190 236 Q130 222 50 232 L60 120 Q130 108 190 124Z" fill="url(#cvPgL)"/>
<path d="M190 236 Q250 222 330 232 L320 120 Q250 108 190 124Z" fill="url(#cvPgR)"/>
<path d="M190 124 V236" stroke="#b8a070" stroke-width="2"/>
<g stroke="#8a7a5a" stroke-width="1.4" opacity=".7" stroke-linecap="round">
  <path d="M78 140 q50 -6 98 0 M80 156 q48 -6 94 0 M82 172 q46 -6 90 0 M84 188 q46 -6 88 0 M86 204 q40 -5 70 0"/>
  <path d="M204 140 q50 -6 98 0 M206 156 q48 -6 94 0 M208 172 q46 -6 90 0 M210 188 q40 -5 76 0"/></g>
<path d="M240 200 q-4 -8 6 -10" stroke="#c9a24c" stroke-width="2" fill="none"/>
<g transform="translate(120 260) rotate(-30)"><path d="M0 0 L0 -96" stroke="#d8cdb6" stroke-width="2"/><path d="M0 -96 Q22 -60 2 -10 Q-16 -60 0 -96Z" fill="#f5efe0" stroke="#cfc3a8"/>
  <g stroke="#cfc3a8" stroke-width="1"><path d="M0 -80 l10 -6 M0 -64 l12 -6 M0 -48 l10 -6 M0 -80 l-8 -6 M0 -64 l-9 -6"/></g></g>
<g transform="translate(70 270)"><path d="M-14 0 h28 v-14 q0 -6 -6 -6 h-16 q-6 0 -6 6z" fill="#1f1f2a"/><ellipse cx="0" cy="-20" rx="8" ry="2" fill="#333"/></g>
<g fill="#ffe7a0">${[[60, 60], [150, 40], [230, 80], [100, 96], [370, 200], [20, 140]].map(([x, y]) => `<path d="M${x} ${y - 5} L${x + 1.5} ${y - 1.5} L${x + 5} ${y} L${x + 1.5} ${y + 1.5} L${x} ${y + 5} L${x - 1.5} ${y + 1.5} L${x - 5} ${y} L${x - 1.5} ${y - 1.5}Z" opacity=".7"/>`).join('')}</g>`;

const PLANET = `<g transform="translate(110 118)"><circle r="22" fill="#d9b07a"/><circle r="22" fill="url(#cvVig)"/><ellipse cx="-6" cy="-8" rx="8" ry="5" fill="#fff" opacity=".2"/>
  <path d="M-2 -22 q-1 -12 2 -18" stroke="#3f7a55" stroke-width="1.6" fill="none"/><path d="M0 -40 q-6 -3 -4 -8 q4 -1 4 3 q0 -4 4 -3 q2 5 -4 8z" fill="#e0475e"/></g>`;
const COTTAGE = `<g transform="translate(96 214)">
  <ellipse cx="0" cy="4" rx="54" ry="6" fill="#000" opacity=".25"/>
  <rect x="-34" y="-34" width="68" height="38" fill="#b98a5e"/><path d="M-42 -32 L0 -66 L42 -32Z" fill="#7a4c2a"/>
  <rect x="18" y="-62" width="10" height="20" fill="#6e4526"/><path d="M23 -66 q6 -10 0 -18 q8 6 4 16" stroke="#cfd6e8" stroke-width="2" fill="none" opacity=".5"/>
  <rect x="-24" y="-22" width="16" height="14" fill="#ffd27a"/><rect x="6" y="-24" width="14" height="28" fill="#5a3518"/>
  <circle cx="-16" cy="-15" r="22" fill="url(#cvGlow)" opacity=".7"/>
  <path d="M-24 -15 h16 M-16 -22 v14" stroke="#7a4c2a" stroke-width="1.5"/></g>
  <g fill="#2f4a3a"><path d="M180 222 l12 -40 l12 40z"/><path d="M200 226 l10 -32 l10 32z"/></g>`;
const nightPrince = nightBase.replace('__MID__', PLANET);
const nightCottage = nightBase.replace('__MID__', '').replace('<path d="M0 262', COTTAGE + '<path d="M0 262');

const ART: Record<string, string> = {
  little_prince: nightPrince,
  fairytale_cottage: nightCottage,
  observatory_altar: nightCottage,
  fairytale_meadow: meadow,
  savannah_wild: meadow,
  fruit_storage: meadow,
  classic_study: study,
  quote_parchment: parchment,
};

export const CoverArt: React.FC<Props> = ({ type, title, levelNumber = 1 }) => {
  const art = ART[type] || meadow;
  const label = title || `기억 서재 · 제${levelNumber}화`;
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full block" role="img" aria-label={label}>
      <defs dangerouslySetInnerHTML={{ __html: DEFS }} />
      <g dangerouslySetInnerHTML={{ __html: art }} />
      <rect width="400" height="300" fill="url(#cvVig)" />
      <rect width="400" height="300" fill="#a08060" filter="url(#cvGrain)" />
      <rect y="236" width="400" height="64" fill="url(#cvBand)" className="hidden sm:inline" />
      <text className="hidden sm:inline" x="200" y="280" textAnchor="middle" fill="#fff8e6" fontSize="17" fontWeight="700" style={{ fontFamily: '"Gowun Batang","Noto Serif KR",serif', letterSpacing: '1px' }}>
        {label}
      </text>
    </svg>
  );
};
