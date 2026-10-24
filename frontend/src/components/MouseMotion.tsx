"use client";
import { useEffect } from "react";
import gsap from "gsap";

// Mouse-driven motion (desktop mouse only; off for touch and for prefers-reduced-motion).
//  - headings / intro text drift with the cursor, words at slightly different depths
//  - cards ([data-tilt], .shop-card) tilt in 3D toward the cursor and their layers (image, title, price) float at different depths
//  - images inside .image-frame zoom a little and follow the cursor
//  - buttons are gently pulled toward the cursor (magnetic)
// Everything uses ONE delegated pointermove listener, so it also works for content that renders later.
// Movement uses the CSS `translate` property, so it never fights the GSAP scroll animations (which use `transform`).
const TEXT_SEL = ".display, .lede, .eyebrow, [data-mtext]";
const BTN_SEL = ".btn-primary, .btn-ghost, .chat-fab";
const CARD_SEL = "[data-tilt], .shop-card";
const LAYERS: [string, number][] = [[".image-frame", 9], [".shop-card__title", -6], [".shop-card__desc", -4], [".shop-card__price", -8]];

const num = (v: string | undefined, d: number) => (v !== undefined && v !== "" && !Number.isNaN(Number(v)) ? Number(v) : d);

export default function MouseMotion() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let px = 0, py = 0, cx = 0, cy = 0; // viewport-normalised (-1..1) and raw pointer position
    let target: Element | null = null;
    let activeCard: HTMLElement | null = null;
    const tilt = new WeakMap<HTMLElement, { rx: (v: number) => void; ry: (v: number) => void }>();

    const getTilt = (el: HTMLElement) => {
      let t = tilt.get(el);
      if (!t) {
        gsap.set(el, { transformPerspective: 900 });
        t = { rx: gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3.out" }), ry: gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3.out" }) };
        tilt.set(el, t);
      }
      return t;
    };

    const resetCard = (card: HTMLElement) => {
      const t = getTilt(card); t.rx(0); t.ry(0);
      card.style.setProperty("--gx", "50%"); card.style.setProperty("--gy", "50%");
      LAYERS.forEach(([sel]) => card.querySelectorAll<HTMLElement>(sel).forEach((n) => { n.style.translate = "0px 0px"; }));
      card.querySelectorAll<HTMLElement>(".image-frame img").forEach((n) => { n.style.translate = "0px 0px"; });
    };

    const frame = () => {
      raf = 0;

      // 1) Text drift
      document.querySelectorAll<HTMLElement>(TEXT_SEL).forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        const base = el.matches(".display") ? 14 : el.matches(".lede") ? 6 : 8;
        const d = num(el.dataset.mtext, base);
        el.style.translate = `${(px * d).toFixed(1)}px ${(py * d * 0.6).toFixed(1)}px`;
        if (el.matches(".display")) {
          el.querySelectorAll<HTMLElement>(".kw").forEach((w, i) => {
            const k = ((i % 3) - 1) * 5; // words sit at different depths
            w.style.translate = `${(px * k).toFixed(1)}px ${(py * Math.abs(k) * 0.4).toFixed(1)}px`;
          });
        }
      });

      // 2) Cards: tilt + layered depth + light spot
      const card = target ? (target.closest(CARD_SEL) as HTMLElement | null) : null;
      if (activeCard && activeCard !== card) resetCard(activeCard);
      activeCard = card;
      if (card) {
        const r = card.getBoundingClientRect();
        const nx = ((cx - r.left) / r.width) * 2 - 1, ny = ((cy - r.top) / r.height) * 2 - 1;
        const t = getTilt(card);
        t.ry(nx * 10); t.rx(-ny * 10);
        card.style.setProperty("--gx", `${((cx - r.left) / r.width) * 100}%`);
        card.style.setProperty("--gy", `${((cy - r.top) / r.height) * 100}%`);
        LAYERS.forEach(([sel, depth]) => card.querySelectorAll<HTMLElement>(sel).forEach((n) => { n.style.translate = `${(nx * depth).toFixed(1)}px ${(ny * depth).toFixed(1)}px`; }));
      }

      // 3) Image follows the cursor inside its frame
      const fr = target ? (target.closest(".image-frame") as HTMLElement | null) : null;
      document.querySelectorAll<HTMLElement>(".image-frame.is-hot").forEach((f) => { if (f !== fr) { f.classList.remove("is-hot"); f.querySelectorAll<HTMLElement>("img").forEach((n) => { n.style.translate = "0px 0px"; }); } });
      if (fr) {
        fr.classList.add("is-hot");
        const r = fr.getBoundingClientRect();
        const nx = ((cx - r.left) / r.width) * 2 - 1, ny = ((cy - r.top) / r.height) * 2 - 1;
        fr.querySelectorAll<HTMLElement>("img").forEach((n) => { n.style.translate = `${(-nx * 12).toFixed(1)}px ${(-ny * 12).toFixed(1)}px`; });
      }

      // 4) Magnetic buttons
      document.querySelectorAll<HTMLElement>(BTN_SEL).forEach((b) => {
        const r = b.getBoundingClientRect();
        const bx = r.left + r.width / 2, by = r.top + r.height / 2;
        const dx = cx - bx, dy = cy - by;
        const near = Math.hypot(dx, dy) < Math.max(r.width, 90) * 0.7 + 30;
        b.style.translate = near ? `${Math.max(-10, Math.min(10, dx * 0.18)).toFixed(1)}px ${Math.max(-8, Math.min(8, dy * 0.25)).toFixed(1)}px` : "0px 0px";
      });
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      cx = e.clientX; cy = e.clientY;
      px = (cx / window.innerWidth) * 2 - 1; py = (cy / window.innerHeight) * 2 - 1;
      target = e.target as Element;
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onLeave = () => { px = 0; py = 0; target = null; cx = -9999; cy = -9999; if (!raf) raf = requestAnimationFrame(frame); };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
      if (activeCard) resetCard(activeCard);
    };
  }, []);
  return null;
}
