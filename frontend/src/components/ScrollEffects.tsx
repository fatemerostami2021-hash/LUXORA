"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Page-wide scroll animation. Elements opt in with data attributes:
//   data-reveal="0.1"  -> fades/rises in when scrolled into view (value = delay in seconds)
//   data-parallax="8"  -> image drifts slightly while scrolling (value = percent)
// Everything is skipped when the user prefers reduced motion.
export default function ScrollEffects() {
  const pathname = usePathname();
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          opacity: 0, y: 48, duration: 0.9, delay: Number(el.dataset.reveal) || 0, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const s = Number(el.dataset.parallax) || 8;
        gsap.fromTo(el, { yPercent: -s }, {
          yPercent: s, ease: "none",
          scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    });
    const t = setTimeout(() => ScrollTrigger.refresh(), 500);
    return () => { clearTimeout(t); mm.revert(); };
  }, [pathname]);
  return null;
}
