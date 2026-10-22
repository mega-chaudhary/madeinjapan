import { useCallback, useEffect, useRef, useState } from 'react';

const DEMO_LENGTH = 200; // seconds, used when a track has no file and no duration

let uid = 0;
const withId = (t) => ({ ...t, id: t.id ?? `t${++uid}` });

/**
 * Audio player state.
 * Plays real files through an <audio> element; if a track has no file
 * (or the file can't be loaded) it falls back to a "demo" clock so the
 * UI still behaves like it's playing.
 */
export function usePlayer(initialTracks) {
  const [tracks, setTracks] = useState(() => initialTracks.map(withId));
  const [index, setIndex] = useState(0);
  const [loadId, setLoadId] = useState(0); // bumps on every (re)load, even same index
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(initialTracks[0]?.duration || 0);
  const [volume, setVolume] = useState(0.8);
  const [demo, setDemo] = useState(false);

  const audioRef = useRef(null);
  const st = useRef({}); // latest values for event handlers
  st.current = { tracks, index, playing, demo, time, duration };

  // ── navigation ────────────────────────────────────────────
  const go = useCallback((i, autoplay) => {
    const n = st.current.tracks.length;
    if (!n) return;
    setIndex(((i % n) + n) % n);
    setLoadId((x) => x + 1);
    if (autoplay !== undefined) setPlaying(autoplay);
  }, []);

  const next = useCallback(() => go(st.current.index + 1), [go]);
  const prev = useCallback(() => {
    if (st.current.time > 3) {
      seek(0);
      return;
    }
    go(st.current.index - 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [go]);

  // ── audio element ─────────────────────────────────────────
  useEffect(() => {
    const a = new Audio();
    a.preload = 'metadata';
    audioRef.current = a;

    const onTime = () => setTime(a.currentTime);
    const onMeta = () => {
      if (!isFinite(a.duration)) return;
      setDuration(a.duration);
      const { tracks: list, index: i } = st.current;
      if (list[i] && Math.round(list[i].duration || 0) !== Math.round(a.duration)) {
        setTracks((t) => t.map((x, k) => (k === i ? { ...x, duration: a.duration } : x)));
      }
    };
    const onEnded = () => go(st.current.index + 1);
    const onError = () => {
      if (!a.getAttribute('src')) return;
      setDemo(true);
      const t = st.current.tracks[st.current.index];
      setDuration(t?.duration || DEMO_LENGTH);
    };

    a.addEventListener('timeupdate', onTime);
    a.addEventListener('loadedmetadata', onMeta);
    a.addEventListener('ended', onEnded);
    a.addEventListener('error', onError);
    return () => {
      a.pause();
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('loadedmetadata', onMeta);
      a.removeEventListener('ended', onEnded);
      a.removeEventListener('error', onError);
      audioRef.current = null;
    };
  }, [go]);

  // ── load the current track ────────────────────────────────
  const current = tracks[index];
  useEffect(() => {
    const a = audioRef.current;
    if (!a || !current) return;
    setTime(0);
    if (current.src) {
      setDemo(false);
      setDuration(current.duration || 0);
      a.src = current.src;
      a.load();
      if (st.current.playing) a.play().catch(() => {});
    } else {
      a.pause();
      a.removeAttribute('src');
      a.load();
      setDemo(true);
      setDuration(current.duration || DEMO_LENGTH);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadId, current?.src]);

  // ── play / pause ──────────────────────────────────────────
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (demo) {
      a.pause();
      return;
    }
    if (playing) {
      a.play().catch((err) => {
        if (err?.name === 'NotAllowedError') setPlaying(false);
      });
    } else a.pause();
  }, [playing, demo, loadId]);

  // demo clock
  useEffect(() => {
    if (!demo || !playing) return;
    let last = performance.now();
    const id = setInterval(() => {
      const now = performance.now();
      const dt = (now - last) / 1000;
      last = now;
      const nt = st.current.time + dt;
      if (nt >= st.current.duration) {
        st.current.time = 0;
        go(st.current.index + 1);
      } else {
        st.current.time = nt;
        setTime(nt);
      }
    }, 200);
    return () => clearInterval(id);
  }, [demo, playing, go]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // ── public actions ────────────────────────────────────────
  function seek(t) {
    const d = st.current.duration || 0;
    const clamped = Math.max(0, Math.min(d, t));
    setTime(clamped);
    const a = audioRef.current;
    if (a && !st.current.demo && a.getAttribute('src')) a.currentTime = clamped;
  }

  const toggle = useCallback(() => setPlaying((p) => !p), []);

  const select = useCallback(
    (i) => {
      if (i === st.current.index) setPlaying((p) => !p);
      else go(i, true);
    },
    [go]
  );

  const addFiles = useCallback(
    (fileList) => {
      const files = Array.from(fileList || []).filter(
        (f) => f.type.startsWith('audio/') || /\.(mp3|m4a|wav|ogg|aac|flac)$/i.test(f.name)
      );
      if (!files.length) return 0;
      const start = st.current.tracks.length;
      const added = files.map((f) =>
        withId({
          title: f.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' '),
          artist: 'added by me',
          src: URL.createObjectURL(f),
          duration: 0,
        })
      );
      setTracks((t) => [...t, ...added]);
      // jump to the first new song
      setTimeout(() => go(start, true), 0);
      return files.length;
    },
    [go]
  );

  return {
    tracks,
    index,
    current,
    playing,
    time,
    duration,
    volume,
    demo,
    toggle,
    next,
    prev,
    select,
    seek,
    setVolume,
    addFiles,
  };
}
