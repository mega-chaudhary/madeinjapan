// Small helpers that generate the "liquid chrome" swirl artwork.
// Everything is deterministic (seeded) so the art looks the same every load.

export function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// Catmull-Rom → cubic Bézier, for silky curves
export function smoothPath(pts) {
  if (pts.length < 2) return '';
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

/** A bundle of spiralling ribbons. */
export function swirls(seed, count, size, spread = 1) {
  const r = rng(seed);
  const out = [];
  for (let k = 0; k < count; k++) {
    const cx = size * (0.5 + (r() - 0.5) * 0.45 * spread);
    const cy = size * (0.5 + (r() - 0.5) * 0.45 * spread);
    const turns = 0.45 + r() * 1.1;
    const r0 = size * (0.04 + r() * 0.12);
    const r1 = size * (0.22 + r() * 0.3);
    const phase = r() * Math.PI * 2;
    const dir = r() < 0.5 ? 1 : -1;
    const wob = 6 + r() * 8;
    const pts = [];
    const N = 36;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const a = phase + dir * t * turns * Math.PI * 2;
      const rr = r0 + (r1 - r0) * t + Math.sin(t * wob + k) * size * 0.012;
      pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]);
    }
    out.push({
      d: smoothPath(pts),
      w: size * (0.03 + r() * 0.085),
      o: 0.55 + r() * 0.45,
      g: k % 3,
    });
  }
  return out;
}

export const cleanId = (id) => id.replace(/[^a-zA-Z0-9_-]/g, '');
