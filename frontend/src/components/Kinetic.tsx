"use client";
import { useEffect, useRef, type ElementType } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Typographic motion. Text stays real text in the DOM (SEO + screen readers read it normally).
// "*word*" marks an emphasised word: italic serif in English, a lighter coloured weight in Persian.
// English splits into words (hero: characters). Persian is split into WORDS only, never letters, so joining is never broken.
export function Emph({ text }: { text: string }) {
  const parts = text.split("*");
  return <>{parts.map((p, i) => (i % 2 ? <em key={i} className="kin-em">{p}</em> : <span key={i}>{p}</span>))}</>;
}

function Words({ text, chars }: { text: string; chars: boolean }) {
  const parts = text.split("*");
  let k = 0;
  return (
    <>
      {parts.map((seg, i) => {
        const words = seg.split(/(\s+)/);
        const inner = words.map((w) => {
          if (/^\s+$/.test(w) || w === "") return w ? " " : null;
          const key = k++;
          return (
            <span className="kw" key={key}>
              <span className="kwi">{chars ? Array.from(w).map((c, ci) => <span className="kc" key={ci}>{c}</span>) : w}</span>
            </span>
          );
        });
        return i % 2 ? <em key={i} className="kin-em" data-mark>{inner}</em> : <span key={i}>{inner}</span>;
      })}
    </>
  );
}

export default function Kinetic({ text, as: Tag = "h2", className = "", chars = false, delay = 0, immediate = false }: {
  text: string; as?: ElementType; className?: string; chars?: boolean; delay?: number; immediate?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.querySelectorAll<HTMLElement>(".kwi").forEach((n) => { n.style.opacity = "1"; }); return; }
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const targets = chars ? el.querySelectorAll(".kc") : el.querySelectorAll(".kwi");
      gsap.set(el.querySelectorAll(".kwi"), { opacity: 1 });
      gsap.fromTo(targets, { yPercent: 115, rotate: chars ? 0 : 3, opacity: chars ? 0 : 1 },
        { yPercent: 0, rotate: 0, opacity: 1, duration: 1.1, ease: "expo.out", delay, stagger: chars ? 0.025 : 0.07,
          scrollTrigger: immediate ? undefined : { trigger: el, start: "top 90%", once: true } });
    }, el);
    return () => ctx.revert();
  }, [text, chars, delay, immediate]);
  return <Tag ref={ref} className={`display ${className}`}><Words text={text} chars={chars} /></Tag>;
}
