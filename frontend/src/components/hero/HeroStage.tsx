"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ATTACHMENTS, LABELS, PED_Y, SETTLE_DUR, evalAtt, type AttState, type Layout } from "@/lib/choreo";
import { buildAttachment, buildDevice, buildPedestal, disposeTree, glowTexture, makeMaterials } from "../scene/models";
import { createStudio } from "../scene/studio";
import { Emph } from "../Kinetic";
import type { Dict, Locale } from "@/lib/i18n";
import { IMG } from "@/data/images";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true }); // stops the pinned stage jumping when the mobile URL bar shows/hides

type Hero = Dict["home"]["hero"];
const SCROLL_VH = 5.4; // scroll distance of the whole story, in viewport heights

// One pinned stage: a WebGL canvas (real 3D objects) + four DOM text blocks, all driven by ONE scrubbed GSAP timeline.
export default function HeroStage({ t, locale }: { t: Hero; locale: Locale }) {
  const wrap = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"loading" | "live" | "static" | "fallback">("loading");

  useEffect(() => {
    const wrapEl = wrap.current, pinEl = pin.current, hostEl = host.current;
    if (!wrapEl || !pinEl || !hostEl) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rtl = locale === "fa";
    const mobile = window.matchMedia("(max-width: 767px)").matches || window.matchMedia("(pointer: coarse)").matches;

    const studio = createStudio(hostEl, { mobile, shadows: true });
    if (!studio) { setMode("fallback"); return; }
    const { renderer, scene, key } = studio;

    // ---------- scene graph ----------
    const mats = makeMaterials();
    const world = new THREE.Group(); scene.add(world);
    const device = buildDevice(mats); device.position.y = PED_Y + 2.2; world.add(device);
    world.add(buildPedestal(mats));
    const atts = ATTACHMENTS.map((s) => { const o = buildAttachment(s, mats, mobile ? "low" : "high"); world.add(o); return o; });
    const glowTex = glowTexture();
    const halo = new THREE.Mesh(new THREE.PlaneGeometry(15, 15), new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, depthWrite: false, opacity: 0.9 }));
    halo.position.set(0, 0.2, -3.4); world.add(halo);
    const haloRing = new THREE.Mesh(new THREE.RingGeometry(5.35, 5.42, 128), new THREE.MeshBasicMaterial({ color: "#fff6e4", transparent: true, opacity: 0.85, depthWrite: false }));
    haloRing.position.set(0, 0.2, -3.3); world.add(haloRing);
    // thin orbit guides (fade as the attachments leave their orbits)
    const guides = [0, 1].map((ring) => {
      const rx = ring ? 3.7 : 2.2, rz = ring ? 2.9 : 1.2; const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 120; i++) { const a = (i / 120) * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * rx, ring ? -0.05 : 0.1, Math.sin(a) * rz)); }
      const l = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: "#fff3d6", transparent: true, opacity: 0.4 }));
      world.add(l); return l;
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.18 }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = PED_Y - 0.86; floor.receiveShadow = true; world.add(floor);
    key.target.position.set(0, -1, 0); scene.add(key.target);

    // ---------- animated state (plain objects, NOT React state) ----------
    const S: AttState[] = ATTACHMENTS.map(() => ({ ex: 0, turn: 0, settle: 0, prec: 0 }));
    const G = { cam: 0, shift: 0, haloK: 0, hold: 0 };
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    let layout: Layout = "wide", dOrbit = 12, dFinal = 10.5, aspect = 1, fov = 32;
    let vw = 1, vh = 1;
    const mouse = { x: 0, y: 0, sx: 0, sy: 0 };

    const resize = () => {
      vw = hostEl.clientWidth || 1; vh = hostEl.clientHeight || 1; aspect = vw / vh;
      layout = aspect < 0.95 ? "narrow" : "wide"; fov = layout === "narrow" ? 40 : 32;
      renderer.setSize(vw, vh, false);
      camera.aspect = aspect; camera.fov = fov; camera.updateProjectionMatrix();
      const th = Math.tan((fov * Math.PI) / 360);
      const fit = (hw: number, hh: number) => Math.max(hh / th, hw / (th * aspect));
      if (layout === "narrow") { dOrbit = fit(3.6, 3.8); dFinal = fit(3.1, 3.7); } else { dOrbit = fit(5.7, 3.6); dFinal = fit(4.9, 3.2); }
    };
    resize();

    const q1 = new THREE.Quaternion(), q2 = new THREE.Quaternion(), e1 = new THREE.Euler(), e2 = new THREE.Euler();
    let inView = true, t0 = performance.now();
    const render = () => {
      if (!inView || document.hidden) return;
      const time = reduce ? 0 : (performance.now() - t0) / 1000;
      mouse.sx += (mouse.x - mouse.sx) * 0.06; mouse.sy += (mouse.y - mouse.sy) * 0.06;
      ATTACHMENTS.forEach((s, i) => {
        const r = evalAtt(s, layout, S[i], time);
        atts[i].position.set(r.pos[0], r.pos[1], r.pos[2]);
        e1.set(r.orbitEuler[0], r.orbitEuler[1], r.orbitEuler[2]); e2.set(r.finalEuler[0], r.finalEuler[1], r.finalEuler[2]);
        q1.setFromEuler(e1); q2.setFromEuler(e2); atts[i].quaternion.copy(q1).slerp(q2, r.prec);
      });
      const avgSettle = S.reduce((a, b) => a + b.settle, 0) / S.length;
      device.rotation.y = Math.sin(time * 0.25) * 0.05 + G.cam * 0.25;
      (halo.material as THREE.MeshBasicMaterial).opacity = 0.75 + 0.25 * G.haloK;
      (haloRing.material as THREE.MeshBasicMaterial).opacity = 0.55 + 0.4 * G.haloK;
      guides.forEach((g) => { (g.material as THREE.LineBasicMaterial).opacity = 0.4 * (1 - Math.min(1, avgSettle * 2.2)) * (1 - S[0].ex * 0.4); g.visible = avgSettle < 0.45; });
      // composition: text lives at the side on desktop and at the bottom on phones; the product centres itself for the finale
      const side = rtl ? -1 : 1;
      world.position.x = layout === "wide" ? side * 1.6 * (1 - G.shift) : 0;
      world.position.y = layout === "narrow" ? 2.0 * (1 - G.shift * 0.35) : 0;
      const k = G.cam * G.cam * (3 - 2 * G.cam);
      const d = dOrbit + (dFinal - dOrbit) * k;
      camera.position.set(mouse.sx * 0.5 + Math.sin(k * 3.1) * 0.5 * (rtl ? -1 : 1), 0.9 + k * 0.5 - mouse.sy * 0.3, d);
      camera.lookAt(world.position.x * 0.2, -0.1 + world.position.y * 0.3, 0);
      renderer.render(scene, camera);
    };

    const onMove = (e: PointerEvent) => { mouse.x = e.clientX / window.innerWidth - 0.5; mouse.y = e.clientY / window.innerHeight - 0.5; };
    if (!reduce) window.addEventListener("pointermove", onMove, { passive: true });
    const io = new IntersectionObserver(([en]) => { inView = !!en?.isIntersecting; }, { threshold: 0 });
    io.observe(wrapEl);
    const ro = new ResizeObserver(() => { resize(); if (reduce) render(); }); ro.observe(hostEl);
    let ctx: gsap.Context | undefined;

    if (reduce) {
      // Reduced motion: no pin, no scrub. Show the finished composition once.
      S.forEach((s) => { s.settle = 1; s.prec = 1; s.turn = 1; s.ex = 1; }); G.cam = 1; G.shift = 1; G.haloK = 1;
      setMode("static"); render();
    } else {
      ctx = gsap.context(() => {
        const blocks = gsap.utils.toArray<HTMLElement>("[data-stage]", pinEl);
        const lines = (i: number) => blocks[i].querySelectorAll<HTMLElement>(".sline");
        const fades = (i: number) => blocks[i].querySelectorAll<HTMLElement>(".sfade");
        blocks.forEach((b, i) => { if (i) gsap.set(b, { autoAlpha: 0 }); });
        // one-time load-in of stage 1 (time based, plays once, not scroll driven)
        gsap.fromTo(lines(0), { yPercent: 115 }, { yPercent: 0, duration: 1.2, ease: "expo.out", stagger: 0.12, delay: 0.15 });
        gsap.fromTo(fades(0), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.1, delay: 0.5 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: wrapEl, start: "top top", end: () => `+=${Math.round(window.innerHeight * SCROLL_VH)}`, pin: pinEl, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true },
        });
        const L = LABELS;
        (Object.keys(L) as (keyof typeof L)[]).forEach((k) => tl.addLabel(k, L[k]));
        ATTACHMENTS.forEach((a, i) => {
          tl.to(S[i], { turn: 1, duration: L.descent + a.delay, ease: "sine.inOut" }, 0);          // stage 1 -> 3: orbit travel
          tl.to(S[i], { ex: 1, duration: 1.8, ease: "sine.inOut" }, L.dance + a.delay);            // stage 2: expansion
          tl.to(S[i], { settle: 1, duration: SETTLE_DUR, ease: "power2.inOut" }, L.descent + a.delay); // stage 3-4: U-shaped descent + assembly
        });
        tl.to(G, { cam: 1, duration: L.final - L.dance, ease: "sine.inOut" }, "dance");
        tl.to(G, { shift: 1, duration: 2.2, ease: "sine.inOut" }, "assembly");
        tl.to(G, { haloK: 1, duration: 2, ease: "sine.inOut" }, "assembly");
        tl.to(G, { hold: 1, duration: L.end - L.final }, "final"); // final pause: the finished set holds still before the page moves on
        // text choreography on the same timeline
        const swap = (i: number, inAt: number, outAt: number | null) => {
          if (i) tl.fromTo(blocks[i], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01, immediateRender: false }, inAt - 0.01);
          if (i) tl.fromTo(lines(i), { yPercent: 115 }, { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.1, immediateRender: false }, inAt);
          if (i) tl.fromTo(fades(i), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08, immediateRender: false }, inAt + 0.3);
          if (outAt !== null) {
            tl.fromTo(lines(i), { yPercent: 0 }, { yPercent: -115, duration: 0.7, ease: "power3.in", stagger: 0.06, immediateRender: false }, outAt);
            tl.fromTo(fades(i), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.4, immediateRender: false }, outAt);
            tl.fromTo(blocks[i], { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.01, immediateRender: false }, outAt + 0.75);
          }
        };
        swap(0, 0, 1.5); swap(1, 2.2, 4.0); swap(2, 4.5, 7.5); swap(3, 8.5, null);
        gsap.fromTo(pinEl.querySelector(".story-cue"), { autoAlpha: 1 }, { autoAlpha: 0, scrollTrigger: { trigger: wrapEl, start: "top top", end: "+=240", scrub: true } });
      }, pinEl);
      gsap.ticker.add(render);
      setMode("live");
    }
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 300);

    return () => {
      window.clearTimeout(refresh); gsap.ticker.remove(render); ctx?.revert();
      window.removeEventListener("pointermove", onMove); io.disconnect(); ro.disconnect();
      disposeTree(world); glowTex.dispose(); studio.dispose();
    };
  }, [locale]);

  const shop = `/${locale}/shop`;
  return (
    <section ref={wrap} className="story" data-mode={mode} aria-label={t.alt}>
      <div ref={pin} className="story-pin">
        <div className="story-bg" aria-hidden />
        <div ref={host} className="story-canvas" aria-hidden />
        {mode === "fallback" && <Image {...IMG.categories_tools_pedestals} alt="" priority sizes="100vw" className="story-fallback" />}
        <div className="story-text">
          {t.stages.map((s, i) => (
            <div key={i} data-stage={i} className={`story-block ${i === 3 ? "is-final" : ""}`}>
              <p className="eyebrow sfade">{s.eyebrow}</p>
              {i === 0 ? (
                <h1 className="display story-title">{s.lines.map((l, j) => <span className="sline-mask" key={j}><span className="sline"><Emph text={l} /></span></span>)}</h1>
              ) : (
                <h2 className="display story-title">{s.lines.map((l, j) => <span className="sline-mask" key={j}><span className="sline"><Emph text={l} /></span></span>)}</h2>
              )}
              {"text" in s && s.text && <p className="story-sub sfade">{s.text}</p>}
              {"cta" in s && s.cta && (
                <div className="story-cta sfade">
                  <Link href={shop} className="btn-primary">{s.cta}</Link>
                  <Link href={`/${locale}/about`} className="btn-ghost">{(s as { cta2?: string }).cta2}</Link>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="story-cue" aria-hidden><span className="story-cue-line" />{t.cue}</div>
        {mode === "loading" && <div className="story-loading" role="status">{t.loading}</div>}
      </div>
    </section>
  );
}
