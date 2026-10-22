import { useCallback, useEffect, useRef, useState } from 'react';
import Device, { STAGE_W, STAGE_H } from './components/Device.jsx';
import Screen from './components/Screen.jsx';
import { usePlayer } from './hooks/usePlayer.js';
import { tracks as initialTracks } from './data/playlist.js';

const SCREEN_W = 186; // inner size of the device screen
const SCREEN_H = 334;

function useViewport() {
  const [vp, setVp] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  useEffect(() => {
    const on = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return vp;
}

export default function App() {
  const p = usePlayer(initialTracks);
  const [view, setView] = useState('art');
  const [toast, setToast] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);
  const toastTimer = useRef();
  const { w, h } = useViewport();

  const compact = w < 760;
  const scale = compact
    ? Math.min((w - 24) / STAGE_W, 1)
    : Math.min((w - 48) / STAGE_W, (h - 150) / STAGE_H, 1.45);
  const popScale = Math.min((w - 32) / SCREEN_W, 2.1);

  const flash = useCallback((text) => {
    clearTimeout(toastTimer.current);
    setToast({ text, k: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 1300);
  }, []);

  const changeVolume = useCallback(
    (d) => {
      const v = Math.round(Math.max(0, Math.min(1, p.volume + d)) * 100) / 100;
      p.setVolume(v);
      flash(`VOL ${String(Math.round(v * 100)).padStart(3, '0')}`);
    },
    [p, flash]
  );

  const openPicker = () => fileRef.current?.click();
  const addFiles = (files) => {
    const n = p.addFiles(files);
    if (n) flash(`+${n} SONG${n > 1 ? 'S' : ''}`);
  };

  // keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.('input, textarea')) return;
      if (e.code === 'Space' && !e.target.closest?.('button,[role=button]')) {
        e.preventDefault();
        p.toggle();
      } else if (e.key === 'ArrowRight') p.next();
      else if (e.key === 'ArrowLeft') p.prev();
      else if (e.key === 'ArrowUp') { e.preventDefault(); changeVolume(0.05); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); changeVolume(-0.05); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [p, changeVolume]);

  return (
    <main
      className={`app ${compact ? 'compact' : ''} ${p.playing ? 'is-playing' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={(e) => { if (e.currentTarget === e.target) setDragging(false); }}
      onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
    >
      <header className="topbar">
        <span className="tb-l">
          <span className="sun" /> MADE IN JAPAN
        </span>
        <span className="tb-c">彼のお気に入り → 私のもの</span>
        <span className="tb-r">SIDE A · {String(p.tracks.length).padStart(2, '0')} TRACKS</span>
      </header>

      <section className="device-area">
        <div className="scaler" style={{ width: STAGE_W * scale, height: STAGE_H * scale }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: '0 0' }}>
            <Device p={p} view={view} setView={setView} onAdd={openPicker} toast={toast} onVolume={changeVolume} />
          </div>
          <div className="floor-shadow" />
        </div>
      </section>

      {compact && (
        <section className="popout" style={{ width: SCREEN_W * popScale + 16, height: SCREEN_H * popScale + 16 }}>
          <div className="popout-bezel">
            <div style={{ transform: `scale(${popScale})`, transformOrigin: '0 0', width: SCREEN_W, height: SCREEN_H }}>
              <Screen p={p} view={view} setView={setView} onAdd={openPicker} toast={toast} />
            </div>
          </div>
        </section>
      )}

      <footer className="caption">
        <p className="jp">彼のお気に入りの曲は、今、私のもの。</p>
        <p className="en">his favourite songs — now they're mine</p>
        <p className="hint">click the knob to play · scroll it for volume · ◂◂ / ▸▸ arcs skip · drop audio files anywhere</p>
      </footer>

      <input
        ref={fileRef}
        type="file"
        accept="audio/*"
        multiple
        hidden
        onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }}
      />

      {dragging && <div className="dropzone"><span>drop his songs here</span></div>}
    </main>
  );
}
