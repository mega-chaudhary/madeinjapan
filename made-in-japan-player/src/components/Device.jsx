import Disc from './Disc.jsx';
import Screen from './Screen.jsx';

// Stage geometry (px, before scaling)
export const STAGE_W = 720;
export const STAGE_H = 660;
const CX = 440;
const CY = 330;
const RING = 258;
const DISC = 222;

const rad = (a) => (a * Math.PI) / 180;
const pt = (r, a) => [CX + r * Math.cos(rad(a)), CY + r * Math.sin(rad(a))];
const f = (n) => n.toFixed(2);

function sector(r1, r2, a1, a2) {
  const [x1, y1] = pt(r2, a1);
  const [x2, y2] = pt(r2, a2);
  const [x3, y3] = pt(r1, a2);
  const [x4, y4] = pt(r1, a1);
  return `M${f(x1)} ${f(y1)} A${r2} ${r2} 0 0 1 ${f(x2)} ${f(y2)} L${f(x3)} ${f(y3)} A${r1} ${r1} 0 0 0 ${f(x4)} ${f(y4)}Z`;
}
function arc(r, a1, a2, cw = true) {
  const [x1, y1] = pt(r, cw ? a1 : a2);
  const [x2, y2] = pt(r, cw ? a2 : a1);
  return `M${f(x1)} ${f(y1)} A${r} ${r} 0 0 ${cw ? 1 : 0} ${f(x2)} ${f(y2)}`;
}
function grip(r1, r2, a1, a2, step = 2.4) {
  const lines = [];
  for (let a = a1; a <= a2 + 0.001; a += step) {
    const [x1, y1] = pt(r1, a);
    const [x2, y2] = pt(r2, a);
    lines.push(`M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}`);
  }
  return lines.join('');
}

/** A clickable ribbed arc segment on the ring (PREV / NEXT). */
function Segment({ a1, a2, label, textR, textCw, onPress, aria }) {
  const press = (e) => {
    e.currentTarget.classList.remove('pressed');
    void e.currentTarget.getBBox();
    e.currentTarget.classList.add('pressed');
    onPress();
  };
  return (
    <g
      className="segment"
      role="button"
      tabIndex={0}
      aria-label={aria}
      onClick={press}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), press(e))}
    >
      <path d={sector(230, 274, a1, a2)} fill="url(#segFill)" stroke="url(#segFill)" strokeWidth="8" strokeLinejoin="round" />
      <path d={sector(230, 274, a1, a2)} fill="none" stroke="#3b3d44" strokeWidth="1" strokeLinejoin="round" />
      <path d={sector(237, 257, a1 + 5, a2 - 5)} fill="#08090b" stroke="#08090b" strokeWidth="6" strokeLinejoin="round" />
      <path d={grip(240, 254, a1 + 6, a2 - 6)} stroke="#2f3137" strokeWidth="3.2" strokeLinecap="round" />
      <path d={grip(240, 254, a1 + 6, a2 - 6)} stroke="#4a4d55" strokeWidth="1" strokeLinecap="round" transform="translate(-0.6 -0.6)" />
      <path id={`seg-${aria}`} d={arc(textR, a1 + 4, a2 - 4, textCw)} fill="none" />
      <text className="seg-text">
        <textPath href={`#seg-${aria}`} startOffset="50%" textAnchor="middle">{label}</textPath>
      </text>
      {[a1 + 1.5, a2 - 1.5].map((a) => {
        const [x, y] = pt(266, a);
        return <circle key={a} cx={x} cy={y} r="2.6" fill="#0b0c0e" stroke="#44474f" strokeWidth="0.8" />;
      })}
    </g>
  );
}

const Screw = ({ style }) => <span className="screw" style={style} />;

export default function Device({ p, view, setView, onAdd, toast, onVolume }) {
  const onWheel = (e) => onVolume(-Math.sign(e.deltaY) * 0.05);

  return (
    <div className="stage" style={{ width: STAGE_W, height: STAGE_H }}>
      {/* ── back ring ───────────────────────────── */}
      <svg className="layer" width={STAGE_W} height={STAGE_H} aria-hidden="true">
        <defs>
          <radialGradient id="ringFill" cx={CX} cy={CY} r={RING} gradientUnits="userSpaceOnUse">
            <stop offset="0.86" stopColor="#060607" />
            <stop offset="0.9" stopColor="#1b1c21" />
            <stop offset="0.97" stopColor="#121317" />
            <stop offset="1" stopColor="#0a0a0c" />
          </radialGradient>
          <linearGradient id="ringEdge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4a4c54" />
            <stop offset="0.5" stopColor="#1a1b1f" />
            <stop offset="1" stopColor="#2c2e34" />
          </linearGradient>
        </defs>
        <circle cx={CX} cy={CY} r={RING} fill="url(#ringFill)" stroke="url(#ringEdge)" strokeWidth="1.5" />
        <circle cx={CX} cy={CY} r={RING - 14} fill="none" stroke="#000" strokeOpacity="0.6" strokeWidth="2" />
        <circle cx={CX} cy={CY} r={DISC + 6} fill="#030304" />
        {/* right clamp */}
        <rect x={CX + RING - 18} y={CY - 26} width="26" height="52" rx="7" fill="#15161a" stroke="#34363d" />
        <rect x={CX + RING - 11} y={CY - 16} width="6" height="32" rx="3" fill="#060607" />
      </svg>

      {/* ── disc ────────────────────────────────── */}
      <div className="disc-wrap" style={{ left: CX - DISC, top: CY - DISC }}>
        <Disc playing={p.playing} size={DISC * 2} />
      </div>

      {/* ── front ring: ticks + segments ───────── */}
      <svg className="layer front" width={STAGE_W} height={STAGE_H}>
        <defs>
          <linearGradient id="segFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#24262c" />
            <stop offset="1" stopColor="#111216" />
          </linearGradient>
        </defs>
        <circle cx={CX} cy={CY} r={DISC + 5} fill="none" stroke="#3a3c43" strokeWidth="3" strokeDasharray="1 6" aria-hidden="true" />
        <Segment a1={-98} a2={-22} textR={263} textCw label="◂◂ PREV · MADE IN JAPAN DISC READER" onPress={p.prev} aria="previous" />
        <Segment a1={22} a2={98} textR={268} textCw={false} label="DISC READER · 日本製 · NEXT ▸▸" onPress={p.next} aria="next" />
      </svg>

      {/* ── plate + hub ─────────────────────────── */}
      <div className="plate" style={{ left: 326, top: CY - 64 }}>
        <Screw style={{ top: 7, right: 9 }} />
        <Screw style={{ bottom: 7, right: 9 }} />
        <div className="plate-text">
          <span>HIS FAVS → MINE</span>
          <span>CONCEPT ©2026</span>
        </div>
      </div>

      <div className="hub" style={{ left: CX - 58, top: CY - 58 }}>
        <button
          className={`knob ${p.playing ? 'on' : ''}`}
          onClick={p.toggle}
          onWheel={onWheel}
          aria-label={p.playing ? 'Pause' : 'Play'}
          title="Click: play / pause · Scroll: volume"
        >
          <span className="knob-ring">
            <span className="knob-slot" />
          </span>
        </button>
      </div>

      {/* ── housing ─────────────────────────────── */}
      <div className="housing" style={{ left: 28, top: 70 }}>
        <div className="vent top" />
        <div className="vent bottom" />
        <div className="grip-col">
          {Array.from({ length: 9 }).map((_, i) => <i key={i} />)}
        </div>
        <Screw style={{ left: 54, top: 14 }} />
        <Screw style={{ left: 54, bottom: 14 }} />

        <div className="module">
          <button className="grille" style={{ top: 14 }} onClick={() => setView(view === 'art' ? 'list' : 'art')} aria-label="Switch screen view" />
          <div className="grille-label" style={{ top: 20 }}>
            <span className={`led ${p.playing ? 'on' : ''}`} />
            <b>VIEW</b>
            <small>{view === 'art' ? 'ART' : 'LIST'}</small>
          </div>

          <div className="bezel">
            <Screen p={p} view={view} setView={setView} onAdd={onAdd} toast={toast} />
          </div>

          <button className="grille" style={{ bottom: 14 }} onClick={onAdd} aria-label="Add songs" />
          <div className="grille-label" style={{ bottom: 18 }}>
            <b>ADD +</b>
            <small>SONGS</small>
          </div>
          <Screw style={{ right: 10, top: 10 }} />
          <Screw style={{ right: 10, bottom: 10 }} />
        </div>
      </div>
    </div>
  );
}
