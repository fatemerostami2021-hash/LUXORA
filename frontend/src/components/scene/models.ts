import * as THREE from "three";
import { ATTACHMENTS, PED_Y, type AttSpec } from "@/lib/choreo";

// STAND-IN PROCEDURAL MODELS. These are built in code from lathe / cylinder / torus primitives so the scene, the
// choreography and the lighting can be developed now. They are NOT Blender-quality product models. When real GLBs are
// exported (see docs/blender-glb-checklist.md) each builder below is replaced by a GLTFLoader lookup of the same name.

export interface Mats { cream: THREE.MeshPhysicalMaterial; champagne: THREE.MeshPhysicalMaterial; rose: THREE.MeshPhysicalMaterial; bristle: THREE.MeshStandardMaterial; dark: THREE.MeshStandardMaterial }

export function makeMaterials(): Mats {
  return {
    cream: new THREE.MeshPhysicalMaterial({ color: "#f3ead9", roughness: 0.55, metalness: 0, clearcoat: 0.18, clearcoatRoughness: 0.5 }),
    champagne: new THREE.MeshPhysicalMaterial({ color: "#dcc09a", roughness: 0.26, metalness: 1, clearcoat: 0.3, clearcoatRoughness: 0.25 }),
    rose: new THREE.MeshPhysicalMaterial({ color: "#c08463", roughness: 0.3, metalness: 1 }),
    bristle: new THREE.MeshStandardMaterial({ color: "#4a3023", roughness: 0.7, metalness: 0.1 }),
    dark: new THREE.MeshStandardMaterial({ color: "#2a211b", roughness: 0.5, metalness: 0.2 }),
  };
}

const at = <T extends THREE.Object3D>(o: T, x: number, y: number, z: number): T => { o.position.set(x, y, z); return o; };
const cyl = (rt: number, rb: number, h: number, seg: number, mat: THREE.Material) => {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
  m.castShadow = true; m.receiveShadow = true; return m;
};

function lathe(points: [number, number][], seg: number, mat: THREE.Material) {
  const m = new THREE.Mesh(new THREE.LatheGeometry(points.map(([r, y]) => new THREE.Vector2(r, y)), seg), mat);
  m.castShadow = true; m.receiveShadow = true; return m;
}

// Bristles as instanced thin cylinders around a core. `arc` < TAU gives a half brush (smoothing brush).
function bristles(core: number, y0: number, y1: number, rows: number, around: number, arc: number, blen: number, mat: THREE.Material) {
  const geo = new THREE.CylinderGeometry(0.011, 0.016, blen, 4);
  const mesh = new THREE.InstancedMesh(geo, mat, rows * around);
  const d = new THREE.Object3D(); const up = new THREE.Vector3(0, 1, 0); let k = 0;
  for (let r = 0; r < rows; r++) for (let a = 0; a < around; a++) {
    const ang = (a / around) * arc + (r % 2) * (arc / around / 2) - arc / 2 + Math.PI / 2;
    const dir = new THREE.Vector3(Math.cos(ang), 0, Math.sin(ang));
    const y = y0 + ((r + 0.5) / rows) * (y1 - y0);
    d.position.set(dir.x * (core + blen / 2 - 0.01), y, dir.z * (core + blen / 2 - 0.01));
    d.quaternion.setFromUnitVectors(up, dir); d.updateMatrix(); mesh.setMatrixAt(k++, d.matrix);
  }
  mesh.castShadow = true; return mesh;
}

export function buildDevice(m: Mats): THREE.Group {
  const g = new THREE.Group(); g.name = "MainDevice";
  // body (cream) with a soft lathe profile, local y: -2.2 .. 2.2
  g.add(lathe([[0, -1.72], [0.29, -1.72], [0.31, -1.66], [0.31, 0.78], [0.3, 0.84], [0, 0.84]], 48, m.cream));
  // chrome barrel + cream tip
  g.add(at(cyl(0.235, 0.255, 1.28, 48, m.champagne), 0, 1.5, 0));
  g.add(at(cyl(0.245, 0.245, 0.16, 48, m.cream), 0, 2.12, 0));
  // rose-gold band + slot detail
  g.add(at(cyl(0.322, 0.322, 0.3, 48, m.rose), 0, 0.62, 0));
  const slot = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.9, 0.02), m.dark); slot.position.set(0, 1.5, 0.245); g.add(slot);
  // lower grille: champagne cylinder with ribs
  const pts: [number, number][] = [[0, -2.2], [0.3, -2.2]];
  for (let i = 0; i < 14; i++) { const y = -2.18 + i * 0.034; pts.push([0.318, y], [0.3, y + 0.017]); }
  pts.push([0.31, -1.72], [0, -1.72]);
  g.add(lathe(pts, 48, m.champagne));
  // three control buttons
  [0.32, 0.1, -0.12].forEach((y) => { const b = cyl(0.035, 0.035, 0.03, 20, m.rose); b.rotation.x = Math.PI / 2; b.position.set(0, y, 0.31); g.add(b); });
  // power cable lying on the pedestal
  const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, -2.16, 0.28), new THREE.Vector3(0.05, -2.18, 0.7), new THREE.Vector3(0.38, -2.18, 1.1), new THREE.Vector3(0.18, -2.18, 1.65), new THREE.Vector3(0.45, -2.18, 2.15)]);
  const cable = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.032, 8), m.dark); cable.castShadow = true; g.add(cable);
  return g;
}

export function buildAttachment(s: AttSpec, m: Mats, detail: "high" | "low"): THREE.Group {
  const g = new THREE.Group(); g.name = s.name;
  const hi = detail === "high"; const L = s.len, R = s.rad, baseH = 0.3;
  const baseY = -L / 2 + baseH / 2, bodyY = baseH / 2, bodyL = L - baseH;
  if (s.kind === "diffuser") {
    const outer = new THREE.Mesh(new THREE.TorusGeometry(R * 0.78, R * 0.34, hi ? 24 : 14, hi ? 64 : 36), m.cream); outer.castShadow = true; g.add(outer);
    const inner = new THREE.Mesh(new THREE.TorusGeometry(R * 0.44, R * 0.1, 16, 48), m.rose); inner.position.z = R * 0.22; g.add(inner);
    return g;
  }
  g.add(at(cyl(R * 0.82, R * 0.9, baseH, 40, m.cream), 0, baseY, 0));
  if (s.kind === "roundBrush" || s.kind === "smoothBrush") {
    const core = R * 0.62;
    const c = cyl(core, core, bodyL, 36, m.champagne); c.position.y = bodyY; g.add(c);
    const rows = Math.round(bodyL * (hi ? 7 : 4)), around = Math.max(10, Math.round(R * (hi ? 52 : 30)));
    const half = s.kind === "smoothBrush";
    const b = bristles(core, bodyY - bodyL / 2 + 0.04, bodyY + bodyL / 2 - 0.02, rows, half ? around : around, half ? Math.PI * 1.1 : Math.PI * 2, R * 0.38, m.bristle);
    g.add(b);
    if (half) c.scale.set(1, 1, 0.85);
  } else if (s.kind === "barrel") {
    const b = cyl(R * 0.8, R * 0.8, bodyL, 40, m.champagne); b.position.y = bodyY; g.add(b);
    const tip = cyl(R * 0.84, R * 0.84, 0.08, 40, m.rose); tip.position.y = bodyY + bodyL / 2 - 0.04; g.add(tip);
    const slot = new THREE.Mesh(new THREE.BoxGeometry(0.014, bodyL * 0.7, 0.014), m.dark); slot.position.set(0, bodyY, R * 0.8); g.add(slot);
  } else { // concentrator
    const c = cyl(R * 0.45, R * 0.8, bodyL, 32, m.champagne); c.position.y = bodyY; c.scale.set(1.5, 1, 0.5); g.add(c);
  }
  return g;
}

export function buildPedestal(m: Mats): THREE.Group {
  const g = new THREE.Group(); g.name = "Display_Pedestal";
  const top = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 5.3, 0.5, 96), m.cream); top.position.y = PED_Y - 0.25; top.receiveShadow = true; top.castShadow = true; g.add(top);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(5.2, 0.035, 12, 128), m.champagne); rim.rotation.x = Math.PI / 2; rim.position.y = PED_Y - 0.01; g.add(rim);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(5.7, 5.8, 0.34, 96), m.champagne); base.position.y = PED_Y - 0.67; base.receiveShadow = true; g.add(base);
  return g;
}

// Soft radial glow texture for the halo behind the product.
export function glowTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas"); c.width = c.height = 256;
  const x = c.getContext("2d")!; const g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, "rgba(255,246,228,.95)"); g.addColorStop(0.55, "rgba(255,236,205,.35)"); g.addColorStop(1, "rgba(255,230,200,0)");
  x.fillStyle = g; x.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export function disposeTree(root: THREE.Object3D) {
  const mats = new Set<THREE.Material>();
  root.traverse((o) => {
    const m = o as THREE.Mesh; m.geometry?.dispose();
    const mm = m.material; if (mm) (Array.isArray(mm) ? mm : [mm]).forEach((x) => mats.add(x));
  });
  mats.forEach((x) => { (x as THREE.MeshBasicMaterial).map?.dispose(); x.dispose(); });
}

export const attachmentNames = ATTACHMENTS.map((a) => a.name);
