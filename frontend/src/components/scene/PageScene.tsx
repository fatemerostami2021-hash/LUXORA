"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ATTACHMENTS, PED_Y, TAU, evalAtt, type AttState, type Layout } from "@/lib/choreo";
import { buildAttachment, buildDevice, buildPedestal, disposeTree, makeMaterials } from "./models";
import { createStudio } from "./studio";

gsap.registerPlugin(ScrollTrigger);
export type Variant = "shop" | "brands" | "about" | "contact";

// Ambient 3D layer for the inner pages (Shop / Brands / About / Contact). Same models and lighting as the home hero,
// a lighter choreography: shop = attachments drifting along the page edges, brands = device + four attachments orbiting,
// about = the full set assembling onto the pedestal as you read, contact = a slow orbit. All driven by page scroll.
const CONFIG: Record<Variant, { device: boolean; pedestal: boolean; items: number[] }> = {
  shop: { device: false, pedestal: false, items: [0, 3, 5, 2, 7, 4] },
  brands: { device: true, pedestal: false, items: [0, 5, 6, 3] },
  about: { device: true, pedestal: true, items: [0, 1, 2, 3, 4, 5, 6, 7] },
  contact: { device: true, pedestal: false, items: [1, 5, 6, 7] },
};

export default function PageScene({ variant, locale }: { variant: Variant; locale: string }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = host.current; if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches || window.matchMedia("(pointer: coarse)").matches;
    const studio = createStudio(el, { mobile, shadows: !mobile });
    if (!studio) return;
    const { renderer, scene, key } = studio;
    const cfg = CONFIG[variant]; const rtl = locale === "fa"; const side = rtl ? -1 : 1;
    const mats = makeMaterials();
    const world = new THREE.Group(); scene.add(world);
    const device = cfg.device ? buildDevice(mats) : null;
    if (device) { device.position.y = PED_Y + 2.2; world.add(device); }
    if (cfg.pedestal) world.add(buildPedestal(mats));
    const list = cfg.items.map((i) => ATTACHMENTS[i]);
    const objs = list.map((s) => { const o = buildAttachment(s, mats, mobile ? "low" : "high"); world.add(o); return o; });
    key.target.position.set(0, -1, 0); scene.add(key.target);

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    let layout: Layout = "wide", vw = 1, vh = 1, halfW = 6, halfH = 4;
    const resize = () => {
      vw = el.clientWidth || 1; vh = el.clientHeight || 1; renderer.setSize(vw, vh, false);
      camera.aspect = vw / vh; camera.updateProjectionMatrix();
      layout = vw / vh < 0.95 ? "narrow" : "wide";
      const d = 15; halfH = d * Math.tan((32 * Math.PI) / 360); halfW = halfH * (vw / vh);
      camera.position.set(0, 0.6, d);
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(el);

    let target = 0, shown = 0;
    const st = ScrollTrigger.create({ trigger: document.documentElement, start: 0, end: "max", onUpdate: (s) => { target = s.progress; } });
    target = shown = st.progress;
    const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
    const onMove = (e: PointerEvent) => { mouse.x = e.clientX / window.innerWidth - 0.5; mouse.y = e.clientY / window.innerHeight - 0.5; };
    if (!reduce) window.addEventListener("pointermove", onMove, { passive: true });
    let visible = true; const onVis = () => { visible = !document.hidden; }; document.addEventListener("visibilitychange", onVis);

    const S: AttState = { ex: 0, turn: 0, settle: 0, prec: 0 };
    const t0 = performance.now();
    const render = () => {
      if (!visible) return;
      const time = reduce ? 0 : (performance.now() - t0) / 1000;
      shown += (target - shown) * 0.07; mouse.sx += (mouse.x - mouse.sx) * 0.05; mouse.sy += (mouse.y - mouse.sy) * 0.05;
      const p = shown;
      const narrow = layout === "narrow";
      if (variant === "shop") {
        world.scale.setScalar(narrow ? 0.42 : 0.55); world.position.set(0, 0, 0);
        objs.forEach((o, k) => {
          const col = k % 2 ? 1 : -1; const edge = halfW * (narrow ? 0.9 : 0.84) * col * side;
          o.position.set(edge + mouse.sx * (k % 3 ? 0.5 : -0.5), Math.sin(p * TAU * (0.6 + k * 0.17) + k * 1.3) * halfH * 0.62 + Math.sin(time * 0.6 + k) * 0.15, -1.2 + (k % 3) * 1.1);
          o.rotation.set(0.5 + p * (3 + k) + time * 0.1, p * (5 - k * 0.6) + time * 0.15, 0.3 * col + Math.sin(p * 4 + k) * 0.3);
        });
      } else {
        const x = narrow ? 0 : side * halfW * 0.5; const y = narrow ? halfH * 0.35 : 0;
        world.position.set(x, y - (variant === "about" ? 0.4 : 0), 0);
        world.scale.setScalar(narrow ? 0.42 : variant === "about" ? 0.62 : 0.55);
        world.rotation.y = mouse.sx * 0.35; world.rotation.x = mouse.sy * 0.08;
        if (device) device.rotation.y = p * 2.2 + time * 0.1;
        objs.forEach((o, k) => {
          if (variant === "about") { const e = Math.min(1, Math.max(0, p * 1.6 - k * 0.04)); const sm = e * e * (3 - 2 * e); S.ex = 0.4 * (1 - sm); S.turn = Math.min(1, p * 1.8); S.settle = sm; }
          else { S.ex = 0.35; S.turn = p * 0.8; S.settle = 0; }
          const r = evalAtt(list[k], layout, S, time);
          o.position.set(r.pos[0], r.pos[1], r.pos[2]);
          const a = new THREE.Quaternion().setFromEuler(new THREE.Euler(...r.orbitEuler)), b = new THREE.Quaternion().setFromEuler(new THREE.Euler(...r.finalEuler));
          o.quaternion.copy(a).slerp(b, variant === "about" ? r.prec : 0);
        });
      }
      renderer.render(scene, camera);
    };
    gsap.ticker.add(render);
    return () => {
      gsap.ticker.remove(render); st.kill(); ro.disconnect(); document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove); disposeTree(world); studio.dispose();
    };
  }, [variant, locale]);
  return <div ref={host} className={`page-scene page-scene-${variant}`} aria-hidden />;
}
