import { useEffect, useRef } from 'react';
import CoverArt from './CoverArt.jsx';
import { Play, Pause, Prev, Next, Plus, Heart, Grid, List } from './Icons.jsx';
import { PLAYLIST_NAME, PLAYLIST_SUB } from '../data/playlist.js';

export const fmt = (s) => {
  if (!s || !isFinite(s)) return '--:--';
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
};

/** The small display on the device. */
export default function Screen({ p, view, setView, onAdd, toast }) {
  const listRef = useRef(null);
  const { tracks, index, current, playing, time, duration, demo } = p;
  const pct = duration ? Math.min(100, (time / duration) * 100) : 0;

  // keep the active row visible without scrolling the page
  useEffect(() => {
    const list = listRef.current;
    const row = list?.querySelector('[data-active="true"]');
    if (!list || !row) return;
    const top = row.offsetTop - list.offsetTop;
    if (top < list.scrollTop || top + row.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTo({ top: top - list.clientHeight / 2 + row.offsetHeight / 2, behavior: 'smooth' });
    }
  }, [index, view]);

  const seekFrom = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    p.seek(((e.clientX - r.left) / r.width) * duration);
  };

  return (
    <div className={`screen view-${view}`}>
      <header className="scr-head">
        <div>
          <h1 className="scr-title">{PLAYLIST_NAME}</h1>
          <p className="scr-sub">PLAYLIST · {PLAYLIST_SUB}</p>
        </div>
        <div className="scr-icons">
          <button className="scr-icon" onClick={() => setView(view === 'art' ? 'list' : 'art')} aria-label="Switch view">
            {view === 'art' ? <List /> : <Grid />}
          </button>
          <span className="scr-icon heart" aria-hidden="true"><Heart /></span>
        </div>
      </header>

      {view === 'art' && (
        <>
          <button className="scr-art" onClick={() => setView('list')} aria-label="Show full playlist">
            <CoverArt />
            <span className="scr-art-tag">{demo ? 'DEMO' : 'CD-DA'}</span>
          </button>
          <div className="scr-ctrl">
            <span className="scr-time">
              {fmt(time)}
              <i>/{fmt(duration)}</i>
            </span>
            <div className="scr-btns">
              <button onClick={p.prev} aria-label="Previous"><Prev /></button>
              <button onClick={p.next} aria-label="Next"><Next /></button>
              <button className="round" onClick={p.toggle} aria-label={playing ? 'Pause' : 'Play'}>
                {playing ? <Pause /> : <Play />}
              </button>
            </div>
          </div>
        </>
      )}

      <ol className="scr-list" ref={listRef}>
        {tracks.map((t, i) => {
          const active = i === index;
          return (
            <li key={t.id}>
              <button data-active={active} className={active ? 'row active' : 'row'} onClick={() => p.select(i)}>
                <span className="row-n">{i + 1}.</span>
                <span className="row-main">
                  <span className="row-t">{t.title}</span>
                  <span className="row-a">{t.artist || '—'}</span>
                </span>
                <span className="row-d">
                  {active && playing ? (
                    <span className="eq" aria-label="playing"><i /><i /><i /></span>
                  ) : (
                    fmt(t.duration)
                  )}
                </span>
              </button>
            </li>
          );
        })}
        <li>
          <button className="row add" onClick={onAdd}>
            <span className="row-n"><Plus /></span>
            <span className="row-main"><span className="row-t">add his songs</span><span className="row-a">mp3 · m4a · wav — or drop files here</span></span>
          </button>
        </li>
      </ol>

      <div className="scr-progress" onClick={seekFrom} role="slider" aria-label="Seek" aria-valuemin={0} aria-valuemax={Math.round(duration) || 0} aria-valuenow={Math.round(time)}>
        <div className="scr-progress-fill" style={{ width: `${pct}%` }} />
      </div>

      <footer className="scr-now">
        <span className="now-n">{index + 1}.</span>
        <span className="now-main">
          <span className="now-t">{current?.title}</span>
          <span className="now-a">{current?.artist}</span>
        </span>
        <button className="now-play" onClick={p.toggle} aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? <Pause /> : <Play />}
        </button>
      </footer>

      {toast && <div className="scr-toast" key={toast.k}>{toast.text}</div>}
      <div className="scr-glass" aria-hidden="true" />
    </div>
  );
}
