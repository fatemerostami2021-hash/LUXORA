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
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => { window.clearTimeout(t); ctx.revert(); };
  }, [pathname]);
  return null;
}
