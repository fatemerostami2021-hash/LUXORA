// Pure choreography maths for the LUXORA hero (no three.js here, so it can be unit-checked in Node).
// Coordinates: y up, camera looks down -z from +z. PED_Y is the top face of the display pedestal.
export type V3 = [number, number, number];
export type Layout = "wide" | "narrow";
export const TAU = Math.PI * 2;
export const PED_Y = -2.4;

export type AttKind = "roundBrush" | "barrel" | "smoothBrush" | "diffuser" | "concentrator";
export type AttState = { ex: number; turn: number; settle: number; prec: number };
type Final = { p: [number, number]; yaw: number; lean?: number }; // x,z on pedestal; y is derived from length

export interface AttSpec {
  name: string; kind: AttKind;
  len: number; rad: number;               // real size in scene units (length along local Y, radius)
  ring: number; rx: number; rz: number; y: number; phase: number; dir: 1 | -1; speed: number;
  tilt: [number, number]; spin: V3;        // orbit orientation (radians) + slow tumble rates
  delay: number;                           // stagger offset (timeline units)
  final: Record<Layout, Final>;
}

// Names follow the Blender object names from the brief. These are stand-in procedural models until real GLBs exist.
export const ATTACHMENTS: AttSpec[] = [
  { name: "Brush_Round_Large", kind: "roundBrush", len: 1.55, rad: 0.44, ring: 1, rx: 3.7, rz: 2.9, y: -0.55, phase: 1.57, dir: -1, speed: 0.9, tilt: [0.35, 0.5], spin: [0.5, 0.9, 0.3], delay: 0.0,
    final: { wide: { p: [-2.75, 0.1], yaw: 0.25 }, narrow: { p: [-1.25, -0.55], yaw: 0.2 } } },
  { name: "Brush_Round_Small", kind: "roundBrush", len: 1.1, rad: 0.3, ring: 0, rx: 2.2, rz: 1.2, y: 0.55, phase: 3.64, dir: 1, speed: 1.0, tilt: [-0.5, 0.2], spin: [0.8, 0.5, 0.6], delay: 0.28,
    final: { wide: { p: [-0.85, 1.9], yaw: 0.2, lean: 0 }, narrow: { p: [-0.55, 1.55], yaw: 0.2, lean: 0 } } },
  { name: "Brush_Round_Medium", kind: "roundBrush", len: 1.3, rad: 0.36, ring: 1, rx: 3.7, rz: 2.9, y: 0.55, phase: 0.00, dir: -1, speed: 0.9, tilt: [0.15, -0.6], spin: [0.4, 0.7, 0.5], delay: 0.56,
    final: { wide: { p: [-1.5, 1.0], yaw: 0.35 }, narrow: { p: [-1.2, 0.55], yaw: 0.3 } } },
  { name: "Barrel_Left", kind: "barrel", len: 1.95, rad: 0.23, ring: 1, rx: 3.7, rz: 2.9, y: -0.1, phase: 3.14, dir: -1, speed: 0.9, tilt: [-0.15, 0.85], spin: [0.2, 1.0, 0.4], delay: 0.84,
    final: { wide: { p: [-3.95, -0.45], yaw: 0 }, narrow: { p: [-2.25, -1.15], yaw: 0 } } },
  { name: "Barrel_Right", kind: "barrel", len: 1.95, rad: 0.27, ring: 1, rx: 3.7, rz: 2.9, y: 0.1, phase: 4.71, dir: -1, speed: 0.9, tilt: [0.25, -0.8], spin: [0.3, -0.9, 0.5], delay: 1.12,
    final: { wide: { p: [3.95, -0.45], yaw: 0 }, narrow: { p: [2.25, -1.15], yaw: 0 } } },
  { name: "Smoothing_Brush", kind: "smoothBrush", len: 1.6, rad: 0.3, ring: 0, rx: 2.2, rz: 1.2, y: -0.45, phase: 2.07, dir: 1, speed: 1.0, tilt: [0.55, -0.3], spin: [0.6, 0.8, 0.2], delay: 1.4,
    final: { wide: { p: [2.7, 0.1], yaw: -0.25 }, narrow: { p: [1.25, 0.55], yaw: -0.2 } } },
  { name: "Diffuser_Ring", kind: "diffuser", len: 0.5, rad: 0.5, ring: 0, rx: 2.2, rz: 1.2, y: 1.15, phase: 0.50, dir: 1, speed: 1.0, tilt: [1.1, 0.3], spin: [0.9, 0.4, 0.7], delay: 1.68,
    final: { wide: { p: [1.6, 1.15], yaw: 0.2 }, narrow: { p: [0.75, 1.55], yaw: 0.2 } } },
  { name: "Concentrator", kind: "concentrator", len: 0.95, rad: 0.2, ring: 0, rx: 2.2, rz: 1.2, y: -0.95, phase: 3.64, dir: 1, speed: 1.0, tilt: [-0.7, -0.4], spin: [0.7, 0.6, 0.9], delay: 1.96,
    final: { wide: { p: [1.45, -0.55], yaw: 0 }, narrow: { p: [0.2, 0.95], yaw: 0 } } },
];

// Timeline labels (units). The hero timeline is built from these so stage boundaries are explicit.
export const LABELS = { orbit: 0, dance: 2, descent: 4.2, assembly: 6.4, final: 8.6, end: 10.6 } as const;
export const SETTLE_DUR = 2.9;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (t: number) => { const x = Math.min(1, Math.max(0, t)); return x * x * (3 - 2 * x); };
const bez = (a: number, b: number, c: number, d: number, t: number) => { const u = 1 - t; return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d; };

// Orbit width factor: portrait screens get a narrower orbit, the inner ring tighter than the outer one.
const xsOf = (s: AttSpec, layout: Layout) => (layout === "wide" ? 1 : s.ring === 0 ? 0.48 : 0.62);

export function finalCenter(s: AttSpec, layout: Layout): V3 {
  const f = s.final[layout];
  const y = s.kind === "diffuser" ? PED_Y + 0.22 : PED_Y + s.len / 2;
  return [f.p[0], y, f.p[1]];
}
export function finalEuler(s: AttSpec, layout: Layout): V3 {
  const f = s.final[layout];
  return s.kind === "diffuser" ? [Math.PI / 2 - 0.25, f.yaw, 0] : [0, f.yaw, 0];
}

// How far (radians, always positive, >= PI) the attachment travels round its orbit before it leaves it.
// It ends exactly above its own pedestal slot, so the descent is a clean drop instead of a cross-over.
export function sweep(s: AttSpec, layout: Layout): number {
  const xs = xsOf(s, layout), zs = layout === "narrow" ? 0.9 : 1;
  const f = s.final[layout];
  const target = Math.atan2(f.p[1] / (s.rz * zs * 1.3), f.p[0] / (s.rx * xs * 1.42));
  let d = s.dir * (target - s.phase);
  d = ((d % TAU) + TAU) % TAU;
  if (d < Math.PI) d += TAU;
  return d;
}

export function evalAtt(s: AttSpec, layout: Layout, st: AttState, time: number): { pos: V3; euler: V3; orbitEuler: V3; finalEuler: V3; prec: number } {
  const xs = xsOf(s, layout);
  const zs = layout === "narrow" ? 0.9 : 1;
  const drift = time * 0.05 * (1 - st.settle);
  const a = s.phase + s.dir * (sweep(s, layout) * st.turn + drift);
  const bob = Math.sin(time * 0.9 * s.speed + s.phase * 2) * 0.12 * (1 - st.settle);
  const rx = s.rx * xs * (1 + 0.42 * st.ex), rz = s.rz * zs * (1 + 0.3 * st.ex);
  const y = s.y * (1 + 0.55 * st.ex) + bob + 0.15 * st.ex;
  const p0: V3 = [rx * Math.cos(a), y, rz * Math.sin(a)];
  const pf = finalCenter(s, layout);
  let pos = p0;
  if (st.settle > 0) {
    const t = st.settle;
    // U-shaped transition: drop down the outer side, sweep inward, then settle onto the pedestal.
    const p1: V3 = [p0[0] * 1.22, lerp(p0[1], pf[1], 0.8) + 0.5, lerp(p0[2], pf[2], 0.35)];
    const p2: V3 = [pf[0] * 1.18, pf[1] + 0.9, pf[2] + 0.15];
    pos = [bez(p0[0], p1[0], p2[0], pf[0], t), bez(p0[1], p1[1], p2[1], pf[1], t), bez(p0[2], p1[2], p2[2], pf[2], t)];
  }
  const w = (1 - st.settle) * time;
  const orbitEuler: V3 = [s.tilt[0] + s.spin[0] * (st.turn * 2 + w * 0.12), s.spin[1] * (st.turn * 2.4 + w * 0.15), s.tilt[1] + s.spin[2] * (st.turn * 1.2 + w * 0.08)];
  return { pos, euler: orbitEuler, orbitEuler, finalEuler: finalEuler(s, layout), prec: smooth((st.settle - 0.3) / 0.7) };
}

// Sphere used for in-flight collision checks (cylinder bounds are used on the pedestal).
export const flightRadius = (s: AttSpec) => Math.max(s.len * 0.32, s.rad * 1.15);
