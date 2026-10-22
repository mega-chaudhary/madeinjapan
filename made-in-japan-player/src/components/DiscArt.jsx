import { memo, useId, useMemo } from 'react';
import { swirls, cleanId } from './art.js';

/** The printed face of the CD: liquid-chrome swirls, a red sun and ring text. */
function DiscArt({ size = 500 }) {
  const id = cleanId(useId());
  const S = 500;
  const C = S / 2;
  const ribbons = useMemo(() => swirls(11, 7, S, 1.1), []);
  const ring = 'MADE IN JAPAN ・ 日本製 ・ HIS FAVOURITE SONGS ・ NOW THEY ARE MINE ・ SIDE A ・ ';

  return (
    <svg width={size} height={size} viewBox={`0 0 ${S} ${S}`} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}base`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#6d7584" />
          <stop offset="0.5" stopColor="#3a404b" />
          <stop offset="1" stopColor="#14171c" />
        </radialGradient>
        <linearGradient id={`${id}c0`} x1="0" y1="0" x2={S} y2={S} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.18" stopColor="#8d939d" />
          <stop offset="0.34" stopColor="#15171c" />
          <stop offset="0.5" stopColor="#eef1f5" />
          <stop offset="0.66" stopColor="#2a2d34" />
          <stop offset="0.82" stopColor="#c9ced6" />
          <stop offset="1" stopColor="#1a1c21" />
        </linearGradient>
        <linearGradient id={`${id}c1`} x1={S} y1="0" x2="0" y2={S} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#20232a" />
          <stop offset="0.25" stopColor="#f4f6f9" />
          <stop offset="0.45" stopColor="#5d636d" />
          <stop offset="0.6" stopColor="#0e0f12" />
          <stop offset="0.8" stopColor="#dfe3e9" />
          <stop offset="1" stopColor="#3b3f47" />
        </linearGradient>
        <linearGradient id={`${id}c2`} x1="0" y1={S} x2={S} y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#a8aeb8" />
          <stop offset="0.3" stopColor="#101115" />
          <stop offset="0.55" stopColor="#ffffff" />
          <stop offset="0.75" stopColor="#4a4f58" />
          <stop offset="1" stopColor="#d4d8de" />
        </linearGradient>
        <radialGradient id={`${id}sun`} cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#ff5c72" />
          <stop offset="0.6" stopColor="#e8173a" />
          <stop offset="1" stopColor="#9c0c24" />
        </radialGradient>
        <filter id={`${id}liquid`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.005" numOctaves="1" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="34" />
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
        <clipPath id={`${id}clip`}>
          <circle cx={C} cy={C} r={C - 2} />
        </clipPath>
        <path id={`${id}ringpath`} d={`M ${C} ${C} m -206 0 a 206 206 0 1 1 412 0 a 206 206 0 1 1 -412 0`} />
      </defs>

      <circle cx={C} cy={C} r={C - 1} fill={`url(#${id}base)`} />

      <g clipPath={`url(#${id}clip)`}>
        <g filter={`url(#${id}liquid)`}>
          {ribbons.map((p, i) => (
            <path key={`s${i}`} d={p.d} fill="none" stroke="#000" strokeOpacity="0.55" strokeWidth={p.w * 1.45} strokeLinecap="round" />
          ))}
          {ribbons.map((p, i) => (
            <path key={`b${i}`} d={p.d} fill="none" stroke={`url(#${id}c${p.g})`} strokeOpacity={p.o} strokeWidth={p.w} strokeLinecap="round" />
          ))}
          {ribbons.map((p, i) => (
            <path key={`h${i}`} d={p.d} fill="none" stroke="#fff" strokeOpacity="0.6" strokeWidth={Math.max(1.2, p.w * 0.12)} strokeLinecap="round" transform="translate(-2.5 -2.5)" />
          ))}
        </g>

        {/* fine data rings */}
        {[238, 226, 214].map((r) => (
          <circle key={r} cx={C} cy={C} r={r} fill="none" stroke="#fff" strokeOpacity="0.07" />
        ))}
      </g>

      {/* the red sun — 日の丸 */}
      <circle cx={C + 92} cy={C - 104} r="30" fill={`url(#${id}sun)`} />
      <circle cx={C + 92} cy={C - 104} r="30" fill="none" stroke="#fff" strokeOpacity="0.25" />

      <text fill="#fff" fillOpacity="0.62" fontFamily="'JetBrains Mono', monospace" fontSize="10.5" letterSpacing="2.2">
        <textPath href={`#${id}ringpath`}>{ring}</textPath>
      </text>

      <text x={C - 150} y={C + 122} fill="#fff" fillOpacity="0.85" fontFamily="'Noto Sans JP', sans-serif" fontWeight="500" fontSize="22" letterSpacing="6">
        日本製
      </text>
      <text x={C - 150} y={C + 140} fill="#fff" fillOpacity="0.5" fontFamily="'Michroma', sans-serif" fontSize="7.5" letterSpacing="2">
        MADE IN JAPAN · VOL.01
      </text>

      {/* clear centre ring + stacking ring */}
      <circle cx={C} cy={C} r="74" fill="#c8d0da" fillOpacity="0.06" stroke="#fff" strokeOpacity="0.16" />
      <circle cx={C} cy={C} r="58" fill="#0a0b0d" fillOpacity="0.55" stroke="#fff" strokeOpacity="0.12" />
      <circle cx={C} cy={C} r="22" fill="#030304" />
      <circle cx={C} cy={C} r={C - 1.5} fill="none" stroke="#fff" strokeOpacity="0.22" strokeWidth="1.5" />
    </svg>
  );
}

export default memo(DiscArt);
