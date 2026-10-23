// Numeric collision check of the hero choreography (capsule vs capsule): `npx tsx scripts/check-choreo.ts`
import { ATTACHMENTS, LABELS, SETTLE_DUR, evalAtt, type AttSpec, type Layout, type V3 } from "../src/lib/choreo";
const tw = (v: number, a: number, b: number, e: (t: number) => number = (t) => t) => e(Math.min(1, Math.max(0, (v - a) / (b - a))));
const sine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
const p2 = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const add = (a: V3, b: V3, k: number): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
// three.js Euler "XYZ": R = Rx * Ry * Rz ; local +Y column of R
function axisY(e: V3): V3 {
  const [x, y, z] = e; const a = Math.cos(x), b = Math.sin(x), c = Math.cos(y), d = Math.sin(y), f = Math.cos(z), g = Math.sin(z);
  return [-c * g, a * f - b * d * g, b * f + a * d * g]; // matches three.js Matrix4.makeRotationFromEuler column 2 of Y (m12,m22,m32)
}
function segDist(p1: V3, d1: V3, p2_: V3, d2: V3, h1: number, h2: number) {
  // closest distance between segments p1±d1*h1 and p2±d2*h2
  let best = Infinity;
  const r = sub(p1, p2_); const a = dot(d1, d1), e = dot(d2, d2), b = dot(d1, d2), c = dot(d1, r), f = dot(d2, r);
  const den = a * e - b * b; let s = 0;
  if (den > 1e-9) s = Math.max(-h1, Math.min(h1, (b * f - c * e) / den));
  for (const ss of [s, -h1, h1]) {
    let t = (b * ss + f) / e; t = Math.max(-h2, Math.min(h2, t));
    const ss2 = Math.max(-h1, Math.min(h1, (b * t - c) / a));
    const q1 = add(p1, d1, ss2), q2 = add(p2_, d2, t); const dv = sub(q1, q2);
    best = Math.min(best, Math.hypot(dv[0], dv[1], dv[2]));
  }
  return best;
}
const cap = (s: AttSpec) => ({ h: s.kind === "diffuser" ? 0 : Math.max(0, s.len / 2 - s.rad * 0.6), r: s.kind === "diffuser" ? s.rad : s.rad });
export function clearance(layout: Layout, step = 0.04): number {
  let worst = Infinity;
  for (let T = 0; T <= LABELS.end; T += step) {
    const ev = ATTACHMENTS.map((s) => {
      const st = { ex: tw(T, LABELS.dance + s.delay, LABELS.dance + s.delay + 1.8, sine), turn: tw(T, 0, LABELS.descent + s.delay, sine),
        settle: tw(T, LABELS.descent + s.delay, LABELS.descent + s.delay + SETTLE_DUR, p2), prec: 0 };
      const r = evalAtt(s, layout, st, 0);
      const eu = r.prec > 0.5 ? r.finalEuler : r.orbitEuler;
      return { pos: r.pos, ax: axisY(eu) };
    });
    for (let i = 0; i < ev.length; i++) {
      const ci = cap(ATTACHMENTS[i]);
      worst = Math.min(worst, segDist(ev[i].pos, ev[i].ax, [0, -0.2, 0], [0, 1, 0], ci.h, 2.2) - ci.r - 0.33);
      for (let j = i + 1; j < ev.length; j++) {
        const cj = cap(ATTACHMENTS[j]);
        { const d = segDist(ev[i].pos, ev[i].ax, ev[j].pos, ev[j].ax, ci.h, cj.h) - ci.r - cj.r; if (d < worst) { worst = d; if (process.argv[2] === "where") console.log(layout, ATTACHMENTS[i].name, ATTACHMENTS[j].name, "T=" + T.toFixed(2), d.toFixed(2)); } }
      }
    }
  }
  return worst;
}
const perms = <T,>(a: T[]): T[][] => (a.length <= 1 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map((p) => [x, ...p])));
if (process.argv[2] === "search") {
  const inner = ATTACHMENTS.filter((s) => s.ring === 0), outer = ATTACHMENTS.filter((s) => s.ring === 1);
  const iph = inner.map((s) => s.phase), oph = outer.map((s) => s.phase);
  let best = -Infinity, bi: number[] = [], bo: number[] = [];
  for (const pi of perms(iph)) for (const po of perms(oph)) {
    inner.forEach((s, k) => (s.phase = pi[k])); outer.forEach((s, k) => (s.phase = po[k]));
    const c = Math.min(clearance("wide", 0.1), clearance("narrow", 0.1));
    if (c > best) { best = c; bi = pi; bo = po; }
  }
  inner.forEach((s, k) => (s.phase = bi[k])); outer.forEach((s, k) => (s.phase = bo[k]));
  console.log("best coarse", best.toFixed(2)); ATTACHMENTS.forEach((s) => console.log(s.name, s.phase.toFixed(2)));
}
for (const layout of ["wide", "narrow"] as Layout[]) console.log(layout + ": min capsule clearance over whole timeline = " + clearance(layout, 0.02).toFixed(2));
