import { memo, useId, useMemo } from 'react';
import { swirls, cleanId } from './art.js';

/** Square cover shown on the little screen. */
function CoverArt() {
  const id = cleanId(useId());
  const W = 300;
  const H = 200;
  const ribbons = useMemo(() => swirls(29, 5, 300, 0.8), []);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" width="100%" height="100%" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2={W} y2={H} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.25" stopColor="#7d838d" />
          <stop offset="0.45" stopColor="#0d0e11" />
          <stop offset="0.62" stopColor="#f3f5f8" />
          <stop offset="0.85" stopColor="#3a3e46" />
          <stop offset="1" stopColor="#cfd4db" />
        </linearGradient>
        <filter id={`${id}f`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="1" seed="9" />
          <feDisplacementMap in="SourceGraphic" scale="22" />
        </filter>
      </defs>
      <rect width={W} height={H} fill="#d9dde2" />
      <g filter={`url(#${id}f)`} transform="translate(0 -50)">
        {ribbons.map((p, i) => (
          <path key={`s${i}`} d={p.d} fill="none" stroke="#000" strokeOpacity="0.7" strokeWidth={p.w * 1.8} strokeLinecap="round" />
        ))}
        {ribbons.map((p, i) => (
          <path key={`b${i}`} d={p.d} fill="none" stroke={`url(#${id}g)`} strokeWidth={p.w} strokeLinecap="round" />
        ))}
        {ribbons.map((p, i) => (
          <path key={`h${i}`} d={p.d} fill="none" stroke="#fff" strokeOpacity="0.9" strokeWidth={Math.max(1, p.w * 0.1)} strokeLinecap="round" transform="translate(-1 -1)" />
        ))}
      </g>
      <circle cx="232" cy="58" r="26" fill="#e8173a" />
      <text x="20" y="182" fill="#0a0a0c" fontFamily="'Michroma', sans-serif" fontSize="11" letterSpacing="2">
        MADE IN JAPAN
      </text>
      <text x="278" y="100" fill="#0a0a0c" fontFamily="'Noto Sans JP', sans-serif" fontWeight="500" fontSize="15" style={{ writingMode: 'vertical-rl' }}>
        日本製
      </text>
    </svg>
  );
}

export default memo(CoverArt);
