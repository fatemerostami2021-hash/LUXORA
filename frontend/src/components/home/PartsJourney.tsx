"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PIECES, STAGE } from "@/data/exploded";
import type { Dict } from "@/lib/i18n";

const TAU = Math.PI * 2;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

// Per-piece choreography while the visitor scrolls the whole page (p = 0 top ... 1 end of page).
const LANES = [
  { lx: -0.40, ly: 0.18, fx: 1.0, fy: 1.3, ph: 0.0, spin: 5.0, z: 90 },
  { lx: 0.38, ly: -0.05, fx: 1.2, fy: 0.9, ph: 1.1, spin: -4.0, z: -80 },
  { lx: -0.34, ly: -0.28, fx: 0.8, fy: 1.1, ph: 2.0, spin: 6.0, z: 40 },
  { lx: 0.42, ly: 0.28, fx: 1.1, fy: 1.4, ph: 3.2, spin: -5.0, z: 130 },
  { lx: -0.44, ly: -0.02, fx: 0.9, fy: 0.8, ph: 4.1, spin: 4.5, z: -120 },
  { lx: 0.30, ly: -0.32, fx: 1.3, fy: 1.0, ph: 5.0, spin: -6.0, z: 20 },
];

// A fixed WebGL layer sits behind the page. The six parts of the styler travel with the visitor from the top of
// the page to the end, spinning in 3D, then fly into place and assemble in the row inside the section below.
// Built from the supplied concept-board image (parts are flat photos placed in a 3D scene).
export default function PartsJourney({ t }: { t: Dict["home"]["journey"] }) {
  const section = useRef<HTMLElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const canvasHost = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const host = canvasHost.current;
    const rowEl = row.current;
    if (!host || !rowEl) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setFallback(true); return; }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    } catch {
      setFallback(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block";

    const scene = new THREE.Scene();
    const FOV = 38;
    const camera = new THREE.PerspectiveCamera(FOV, 1, 10, 4000);
    let vw = 1, vh = 1;

    const loader = new THREE.TextureLoader();
    const meshes = PIECES.map((p) => {
      const tex = loader.load(p.src, () => { /* re-render happens on the next frame */ });
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(p.w, p.h), mat);
      scene.add(mesh);
      return mesh;
    });

    const resize = () => {
      vw = window.innerWidth; vh = window.innerHeight;
      renderer.setSize(vw, vh, false);
      camera.aspect = vw / vh;
      camera.position.z = (vh / 2) / Math.tan((FOV * Math.PI) / 360);
      camera.updateProjectionMatrix();
    };
    resize();

    // --- scroll state (smoothed) ---
    let target = 0, shown = 0;
    const st = ScrollTrigger.create({
      trigger: document.documentElement, start: 0, end: "max",
      onUpdate: (self) => { target = self.progress; },
    });
    target = shown = st.progress;

    const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
    const onMove = (e: PointerEvent) => { mouse.x = e.clientX / window.innerWidth - 0.5; mouse.y = e.clientY / window.innerHeight - 0.5; };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);

    let raf = 0;
    let visible = true;
    const onVis = () => { visible = !document.hidden; };
    document.addEventListener("visibilitychange", onVis);
    const t0 = performance.now();

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const time = (performance.now() - t0) / 1000;
      shown += (target - shown) * 0.08;
      mouse.sx += (mouse.x - mouse.sx) * 0.05; mouse.sy += (mouse.y - mouse.sy) * 0.05;
      const p = shown;

      // Landing row (DOM anchor): how close is it to the middle of the screen?
      const r = rowEl.getBoundingClientRect();
      const rowCx = r.left + r.width / 2 - vw / 2;
      const rowCy = -(r.top + r.height / 2 - vh / 2);
      const near = 1 - clamp(Math.abs(r.top + r.height / 2 - vh / 2) / (vh * 0.62), 0, 1);
      const land = smooth(near);
      const landScale = clamp((r.width * 0.96) / STAGE.w, 0.35, 1.5);
      const freeScale = clamp(vw / 1200, 0.55, 1.35);
      const small = vw < 768;

      meshes.forEach((m, i) => {
        const L = LANES[i];
        const p0 = PIECES[i];
        // free flight: lanes at the page edges, weaving and spinning with scroll progress
        const fx = (L.lx * vw * (small ? 0.62 : 0.92)) + Math.sin(p * TAU * L.fx + L.ph) * vw * 0.07 + mouse.sx * 40 * (i % 2 ? 1 : -1);
        const fy = L.ly * vh * 0.9 + Math.cos(p * TAU * L.fy + L.ph) * vh * 0.1 - mouse.sy * 30 + Math.sin(time * 0.8 + i) * 8;
        const fz = L.z;
        const frx = Math.sin(p * TAU * 1.5 + L.ph) * 0.55 + mouse.sy * 0.3;
        const fry = p * L.spin * Math.PI + time * 0.15 * (i % 2 ? 1 : -1) + mouse.sx * 0.4;
        const frz = Math.sin(p * TAU * 2 + L.ph) * 0.22;
        // landing: the exploded arrangement of the original concept board
        const cx = (p0.x0 + p0.w / 2 - STAGE.w / 2) * landScale;
        const cy = -(p0.y0 + p0.h / 2 - STAGE.h / 2) * landScale + Math.sin(time * 1.1 + i * 0.9) * 5 * land;
        const sc = freeScale + (landScale - freeScale) * land;
        const e = smooth(land);
        m.position.set(fx + (rowCx + cx - fx) * e, fy + (rowCy + cy - fy) * e, fz * (1 - e));
        m.rotation.set(frx * (1 - e), fry * (1 - e) , frz * (1 - e));
        m.scale.setScalar(sc);
        (m.material as THREE.MeshBasicMaterial).opacity = (small ? 0.42 : 0.62) + (1 - (small ? 0.42 : 0.62)) * e;
      });
      renderer.render(scene, camera);
    };
    frame();

    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 500);

    return () => {
      window.clearTimeout(refresh);
      cancelAnimationFrame(raf);
      st.kill();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
      meshes.forEach((m) => {
        const mat = m.material as THREE.MeshBasicMaterial;
        mat.map?.dispose(); mat.dispose(); m.geometry.dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <>
      {/* fixed WebGL layer behind the whole page */}
      <div ref={canvasHost} className="parts-canvas" aria-hidden />
      <section ref={section} aria-labelledby="journey-title" className="relative flex min-h-[110vh] flex-col justify-center py-24">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="journey-title" data-reveal="0" className="mt-3 text-4xl md:text-6xl">{t.title}</h2>
          <p data-reveal="0.1" className="mx-auto mt-5 max-w-2xl text-lg text-muted">{t.text}</p>
        </div>

        {/* landing row: the 3D parts assemble here */}
        <div ref={row} dir="ltr" role="img" aria-label={t.alt}
          className="relative mx-auto my-10 w-full max-w-[1300px] px-3 md:px-8" style={{ aspectRatio: `${STAGE.w} / ${STAGE.h}` }}>
          {fallback && (
            <>
              {PIECES.map((p) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={p.id} src={p.src} alt="" width={p.w} height={p.h} loading="lazy" decoding="async"
                  className="absolute h-auto" style={{ left: `${(p.x0 / STAGE.w) * 100}%`, width: `${(p.w / STAGE.w) * 100}%`, top: `${(p.y0 / STAGE.h) * 100}%` }} />
              ))}
            </>
          )}
        </div>

        <ul className="mx-auto grid max-w-5xl gap-4 px-5 md:grid-cols-3">
          {t.points.map((pt, i) => (
            <li key={pt.head} data-reveal={i * 0.1} className="card p-6 text-center backdrop-blur">
              <p className="text-xl font-extrabold text-accent">{pt.head}</p>
              <p className="mt-2 text-sm text-muted">{pt.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
