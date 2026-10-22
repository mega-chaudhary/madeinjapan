import { useEffect, useRef } from 'react';
import DiscArt from './DiscArt.jsx';

const GHOSTS = [5, 10, 15]; // degrees of trailing "motion blur" copies at full speed

/**
 * The spinning disc. Uses requestAnimationFrame with a little physics so
 * it spins up and coasts down like a real CD drive.
 */
export default function Disc({ playing, size }) {
  const main = useRef(null);
  const ghosts = useRef([]);
  const playingRef = useRef(playing);
  playingRef.current = playing;

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const MAX = reduce ? 30 : 560; // deg / second
    let raf;
    let last = performance.now();
    let angle = 0;
    let vel = 0;

    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const on = playingRef.current;
      const k = on ? 1.4 : 0.8; // spin-up is quicker than coast-down
      vel += ((on ? MAX : 0) - vel) * (1 - Math.exp(-k * dt));
      if (!on && vel < 0.5) vel = 0;
      angle = (angle + vel * dt) % 360;

      const ratio = vel / MAX;
      if (main.current) main.current.style.transform = `rotate(${angle}deg)`;
      ghosts.current.forEach((g, i) => {
        if (!g) return;
        g.style.transform = `rotate(${angle - GHOSTS[i] * ratio}deg)`;
        g.style.opacity = (0.3 * ratio).toFixed(3);
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="disc" style={{ width: size, height: size }}>
      <div className="disc-layer" ref={main}>
        <DiscArt size={size} />
      </div>
      {GHOSTS.map((_, i) => (
        <div key={i} className="disc-layer disc-ghost" ref={(el) => (ghosts.current[i] = el)}>
          <DiscArt size={size} />
        </div>
      ))}
      <div className="disc-sheen" />
    </div>
  );
}
