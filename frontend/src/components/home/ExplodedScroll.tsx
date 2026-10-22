"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LABELS, PIECES, STAGE } from "@/data/exploded";
import type { Dict } from "@/lib/i18n";

const pct = (v: number, total: number) => `${(v / total) * 100}%`;

// Pinned, scroll-scrubbed exploded view. Built from the supplied concept-board image (2.5D),
// NOT a real 3D model. Replace with a GLB + React Three Fiber when the model exists.
export default function ExplodedScroll({ t }: { t: Dict["home"]["exploded"] }) {
  const root = useRef<HTMLElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const el = root.current!;
      const pieces = gsap.utils.toArray<HTMLElement>("[data-piece]", el);
      const labels = gsap.utils.toArray<HTMLElement>("[data-label]", el);
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: { trigger: el, start: "top top", end: "+=2400", scrub: 0.7, pin: true, anticipatePin: 1, invalidateOnRefresh: true },
      });
      const centerX = STAGE.w / 2;
      pieces.forEach((p, i) => {
        const cx = Number(p.dataset.cx);
        tl.from(p, {
          x: () => ((centerX - cx) / STAGE.w) * stage.current!.offsetWidth * 0.6,
          y: i % 2 ? 46 : -46, opacity: 0, scale: 0.86,
          rotationY: i % 2 ? -32 : 32, transformPerspective: 900, duration: 1.2,
        }, i * 0.18);
      });
      labels.forEach((l, i) => tl.from(l, { opacity: 0, y: 14, duration: 0.5 }, 1.3 + i * 0.16));
      tl.from("[data-progress]", { scaleX: 0, transformOrigin: "left center", ease: "none", duration: tl.duration() }, 0);
      // Phones: the stage is wider than the screen, so pan it while scrolling.
      if (window.matchMedia("(max-width: 767px)").matches) {
        tl.to(stage.current, { x: () => -(stage.current!.offsetWidth - wrap.current!.clientWidth), ease: "none", duration: tl.duration() }, 0);
      }
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} aria-labelledby="exploded-title" className="stage-bg relative flex min-h-screen flex-col justify-center overflow-hidden py-16 text-white">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <p className="eyebrow">{t.eyebrow}</p>
        <h2 id="exploded-title" className="mt-3 text-4xl md:text-6xl">{t.title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-white/70">{t.text}</p>
      </div>

      <div ref={wrap} className="mx-auto mt-10 w-full max-w-[1400px] overflow-hidden px-3 md:px-8">
        <div ref={stage} dir="ltr" role="img" aria-label={t.alt}
          className="stage-bg relative w-[1100px] md:w-full" style={{ aspectRatio: `${STAGE.w} / ${STAGE.h}` }}>
          {PIECES.map((p) => (
            <div key={p.id} data-piece data-cx={p.x0 + p.w / 2} className="absolute"
              style={{ left: pct(p.x0, STAGE.w), width: pct(p.w, STAGE.w), top: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt="" width={p.w} height={p.h} loading="lazy" decoding="async"
                className="block h-auto w-full" style={{ mixBlendMode: "screen" }} />
            </div>
          ))}
          {LABELS.map((l, i) => (
            <div key={l.x} className="absolute -translate-x-1/2" style={{ left: pct(l.x, STAGE.w), top: pct(l.lineTop, STAGE.h) }}>
              <div data-label className="flex flex-col items-center">
                <span className="block w-px bg-white/45" style={{ height: "clamp(14px, 3.4vw, 44px)" }} />
                <span dir="auto" className="mt-1 whitespace-nowrap text-center text-[13px] font-bold md:text-[clamp(12px,1.25vw,17px)]">{t.labels[i]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 w-full max-w-xl px-5">
        <div className="h-0.5 w-full bg-white/15"><div data-progress className="h-full bg-accent" /></div>
        <p className="mt-4 text-center text-xs text-white/55">{t.hint} · {t.note}</p>
      </div>
    </section>
  );
}
