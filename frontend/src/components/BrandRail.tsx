"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import { RAIL_BRANDS } from "@/data/brands";
import type { Dict } from "@/lib/i18n";

// Endless horizontal rail of beauty brands, driven by GSAP. Pauses on hover/focus.
export default function BrandRail({ t }: { t: Dict["rail"] }) {
  const track = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const tween = gsap.to(el, { xPercent: -50, ease: "none", duration: 55, repeat: -1 });
      const pause = () => tween.pause();
      const play = () => tween.resume();
      el.addEventListener("mouseenter", pause);
      el.addEventListener("mouseleave", play);
      el.addEventListener("focusin", pause);
      el.addEventListener("focusout", play);
      return () => {
        el.removeEventListener("mouseenter", pause); el.removeEventListener("mouseleave", play);
        el.removeEventListener("focusin", pause); el.removeEventListener("focusout", play);
      };
    }, el);
    return () => ctx.revert();
  }, []);

  const list = [...RAIL_BRANDS, ...RAIL_BRANDS];
  return (
    <section aria-label={t.title} className="page-layer overflow-hidden py-16">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <p className="eyebrow">{t.eyebrow}</p>
        <h2 className="mt-3 text-3xl md:text-5xl">{t.title}</h2>
        <p className="mt-3 text-muted">{t.text}</p>
      </div>
      <div dir="ltr" className="rail-mask mt-10 overflow-hidden py-4">
        <ul ref={track} className="flex w-max gap-5 ps-5">
          {list.map((b, i) => (
            <li key={`${b.name}-${i}`} aria-hidden={i >= RAIL_BRANDS.length ? true : undefined}>
              <a href={b.url} target="_blank" rel="noopener noreferrer" className="rail-tile" tabIndex={i >= RAIL_BRANDS.length ? -1 : 0}>
                <b.icon width={30} height={30} className="shrink-0 text-accent" />
                {b.logo
                  ? <Image src={b.logo} alt={b.name} width={120} height={36} className="h-9 w-auto object-contain" />
                  : <span className="whitespace-nowrap text-lg font-extrabold tracking-wide">{b.name}</span>}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-4 text-center text-xs text-muted">{t.hint}</p>
    </section>
  );
}
