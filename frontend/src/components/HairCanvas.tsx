"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

// Flowing strands of hair, drawn with Three.js (a vertex shader animates every strand).
// Renders only while the footer is on screen, follows the pointer, and re-colors itself when the theme changes.
const STRANDS = 260;
const POINTS = 56;

const vert = /* glsl */ `
  attribute float aStrand; attribute float aT;
  uniform float uTime; uniform vec2 uMouse; uniform float uAspect;
  varying float vT; varying float vS;
  void main() {
    float s = aStrand, t = aT;
    float len = 1.15 + 0.85 * fract(sin(s * 91.7) * 43758.5453);
    float rootX = (s - 0.5) * 2.0 * uAspect * 1.08;
    float w1 = sin(uTime * 0.55 + t * 3.4 + s * 14.0) * 0.10;
    float w2 = sin(uTime * 0.9 + t * 6.2 + s * 31.0) * 0.035;
    float curl = sin(t * 7.0 + s * 40.0 + uTime * 0.4) * 0.03 * t;
    float sway = sin(uTime * 0.35 + s * 3.0) * 0.18 * t * t;
    float x = rootX + (w1 + w2 + curl + sway) * t + uMouse.x * 0.35 * t * t;
    float y = 1.05 - t * len * 1.75 + uMouse.y * 0.1 * t;
    vT = t; vS = s;
    gl_Position = vec4(x / uAspect, y, 0.0, 1.0);
  }
`;
const frag = /* glsl */ `
  precision mediump float;
  uniform vec3 uA; uniform vec3 uB; uniform float uAlpha;
  varying float vT; varying float vS;
  void main() {
    vec3 col = mix(uA, uB, smoothstep(0.0, 1.0, vT * 0.9 + vS * 0.25));
    float a = uAlpha * (0.18 + 0.82 * (1.0 - vT * 0.65)) * (0.55 + 0.45 * fract(sin(vS * 77.0) * 1000.0));
    gl_FragColor = vec4(col, a);
  }
`;

const cssColor = (name: string, fallback: string) => {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return new THREE.Color(v || fallback);
};

export default function HairCanvas() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); } catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block";

    // geometry: independent line segments for every strand
    const segs = STRANDS * (POINTS - 1);
    const aStrand = new Float32Array(segs * 2), aT = new Float32Array(segs * 2), pos = new Float32Array(segs * 2 * 3);
    let k = 0;
    for (let s = 0; s < STRANDS; s++) {
      for (let m = 0; m < POINTS - 1; m++) {
        for (let e = 0; e < 2; e++) { aStrand[k] = s / (STRANDS - 1); aT[k] = (m + e) / (POINTS - 1); k++; }
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aStrand", new THREE.BufferAttribute(aStrand, 1));
    geo.setAttribute("aT", new THREE.BufferAttribute(aT, 1));
    const uniforms = {
      uTime: { value: 0 }, uMouse: { value: new THREE.Vector2() }, uAspect: { value: 2 },
      uA: { value: cssColor("--hair-a", "#ff9ec7") }, uB: { value: cssColor("--hair-b", "#ffd6a0") }, uAlpha: { value: 0.85 },
    };
    const mat = new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const lines = new THREE.LineSegments(geo, mat);
    lines.frustumCulled = false;
    const scene = new THREE.Scene(); scene.add(lines);
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const resize = () => {
      const w = el.clientWidth || 1, h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      uniforms.uAspect.value = w / h;
      renderer.render(scene, camera);
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(el);

    const recolor = () => { uniforms.uA.value = cssColor("--hair-a", "#ff9ec7"); uniforms.uB.value = cssColor("--hair-b", "#ffd6a0"); };
    const mo = new MutationObserver(recolor);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const target = new THREE.Vector2();
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target.set(((e.clientX - r.left) / r.width - 0.5) * 2, -((e.clientY - r.top) / r.height - 0.5) * 2);
    };
    el.parentElement?.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0, visible = false;
    const io = new IntersectionObserver(([en]) => { visible = !!en?.isIntersecting; }, { threshold: 0.01 });
    io.observe(el);
    const t0 = performance.now();
    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) return;
      uniforms.uTime.value = reduce ? 0 : (performance.now() - t0) / 1000;
      uniforms.uMouse.value.lerp(target, 0.05);
      renderer.render(scene, camera);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); mo.disconnect();
      el.parentElement?.removeEventListener("pointermove", onMove);
      geo.dispose(); mat.dispose(); renderer.dispose(); renderer.domElement.remove();
    };
  }, []);

  return <div ref={host} className="pointer-events-none absolute inset-0 opacity-90" aria-hidden />;
}
