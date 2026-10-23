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
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          opacity: 0, y: 48, duration: 0.9, delay: Number(el.dataset.reveal) || 0, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
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
    });
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
    return () => { window.clearTimeout(t); tiltCleanups.forEach((f) => f()); ctx.revert(); };
  }, [pathname]);
  return null;
}
