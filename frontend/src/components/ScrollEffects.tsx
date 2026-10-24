"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Page-wide scroll animation. Elements opt in with data attributes:
//   data-reveal="0.1"  -> fades/rises in when scrolled into view (value = delay in seconds)
//   data-parallax="8"  -> image drifts slightly while scrolling (value = percent)
// Everything lives in ONE gsap.context that is reverted on unmount / route change,
// so nothing keeps pointing at elements that no longer exist (that caused the old offsetWidth error).
export default function ScrollEffects() {
  const pathname = usePathname();
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    // Every reveal tween starts paused and plays when scrolled into view. As a safety net (screenshots,
    // PDF export, full-page capture tools that never scroll) anything still hidden is played after 3.5 s,
    // so content can never stay invisible.
    const pending: gsap.core.Tween[] = [];
    const reveal = (el: Element, from: gsap.TweenVars, trigger: Element) => {
      const tw = gsap.from(el, { ...from, paused: true });
      ScrollTrigger.create({ trigger, start: "top 92%", once: true, onEnter: () => tw.play() });
      pending.push(tw);
    };
    const playAll = () => pending.forEach((tw) => { if (tw.progress() === 0) tw.play(); });
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        reveal(el, { opacity: 0, y: 24, duration: 0.7, delay: Number(el.dataset.reveal) || 0, ease: "power3.out" }, el);
      });
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const parent = el.parentElement;
        if (!parent) return;
        const s = Number(el.dataset.parallax) || 8;
        gsap.fromTo(el, { yPercent: -s }, {
          yPercent: s, ease: "none",
          scrollTrigger: { trigger: parent, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
      gsap.utils.toArray<HTMLImageElement>("main img").forEach((img) => {
        const frame = img.closest<HTMLElement>(".image-frame, .card, section") || img;
        reveal(img, { scale: 1.04, opacity: 0.9, duration: 0.8, ease: "power3.out" }, frame);
      });
    });
    const safety = window.setTimeout(playAll, 3500);
    window.addEventListener("beforeprint", playAll);
    // 3D tilt on cards (mouse only, desktop): opt in with data-tilt
    const tiltCleanups: (() => void)[] = [];
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      gsap.utils.toArray<HTMLElement>("[data-tilt]").forEach((el) => {
        const rx = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3.out" });
        const ry = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3.out" });
        gsap.set(el, { transformPerspective: 900 });
        const move = (e: PointerEvent) => { const r = el.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - 0.5) * 9); rx(-((e.clientY - r.top) / r.height - 0.5) * 9); };
        const leave = () => { rx(0); ry(0); };
        el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave);
        tiltCleanups.push(() => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); });
      });
    }
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => { window.clearTimeout(t); window.clearTimeout(safety); window.removeEventListener("beforeprint", playAll); tiltCleanups.forEach((f) => f()); ctx.revert(); };
  }, [pathname]);
  return null;
}
