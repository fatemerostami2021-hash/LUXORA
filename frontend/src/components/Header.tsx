"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Dict, Locale } from "@/lib/i18n";
import ThemeToggle from "./ThemeToggle";

export default function Header({ locale, t }: { locale: Locale; t: Dict }) {
  const pathname = usePathname() ?? `/${locale}`;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const other: Locale = locale === "en" ? "fa" : "en";
  const switchHref = pathname.replace(/^\/(en|fa)/, `/${other}`) || `/${other}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("keydown", onKey); };
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  const links = [
    { href: `/${locale}/shop`, label: t.nav.shop },
    { href: `/${locale}/brands`, label: t.nav.brands },
    { href: `/${locale}/about`, label: t.nav.about },
    { href: `/${locale}/contact`, label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40">
      <div className="announce text-center text-xs font-semibold py-2 px-4">{t.announcement}</div>
      <div className={`border-b border-line transition-colors ${scrolled ? "bg-bg/95 backdrop-blur" : "bg-bg"}`}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5">
          <Link href={`/${locale}`} className="text-xl font-bold tracking-[0.3em]">LUXORA</Link>
          <nav aria-label={t.nav.main} className="hidden md:flex items-center gap-8 text-sm">
            {links.map((l) => (
              <Link key={l.href} href={l.href}
                aria-current={pathname.startsWith(l.href) ? "page" : undefined}
                className="hover:text-accent transition-colors aria-[current=page]:text-accent">{l.label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link href={switchHref} hrefLang={other} lang={other}
              className="h-10 rounded-full border border-line px-4 text-sm leading-10 hover:border-accent transition-colors">
              {other === "fa" ? "فارسی" : "EN"}
            </Link>
            <ThemeToggle label={t.nav.theme} />
            <button className="md:hidden h-10 w-10 rounded-full border border-line" aria-expanded={open}
              aria-controls="mobile-nav" aria-label={t.nav.menu} onClick={() => setOpen(!open)}>
              <span aria-hidden>{open ? "✕" : "☰"}</span>
            </button>
          </div>
        </div>
        {open && (
          <nav id="mobile-nav" aria-label={t.nav.main} className="md:hidden border-t border-line px-5 py-4 flex flex-col gap-4">
            {links.map((l) => <Link key={l.href} href={l.href} className="py-1 text-lg">{l.label}</Link>)}
          </nav>
        )}
      </div>
    </header>
  );
}
