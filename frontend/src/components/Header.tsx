"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Dict, Locale } from "@/lib/i18n";
import { MEGA } from "@/data/mega";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import SearchPanel from "./SearchPanel";
import { ArrowIcon, ChevronDown, CloseIcon, MenuIcon, SearchIcon } from "./Icons";

export default function Header({ locale, t }: { locale: Locale; t: Dict }) {
  const pathname = usePathname() ?? `/${locale}`;
  const mega = MEGA[locale];
  const [open, setOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<number | null>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const other: Locale = locale === "en" ? "fa" : "en";
  const rest = pathname.replace(/^\/(en|fa)(?=\/|$)/, "") || "";
  // Plain <a> (full page load) for the language switch: it resets the <html lang/dir> and every animation cleanly.
  const switchHref = `/${other}${rest}`;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); setMegaOpen(false); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => { setOpen(false); setMegaOpen(false); }, [pathname]);

  const openMega = () => { window.clearTimeout(closeTimer.current); setMegaOpen(true); };
  const closeMega = () => { window.clearTimeout(closeTimer.current); closeTimer.current = window.setTimeout(() => setMegaOpen(false), 140); };
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  const shopHref = `/${locale}/shop`;
  const links = [
    { href: `/${locale}/brands`, label: t.nav.brands },
    { href: `/${locale}/about`, label: t.nav.about },
    { href: `/${locale}/contact`, label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40" onMouseLeave={closeMega}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2">{t.nav.skip}</a>
      <div className="announce px-4 py-2 text-center text-xs font-semibold">{t.announcement}</div>
      <div className="site-header">
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-5">
          <Link href={`/${locale}`} className="brand-link flex items-center gap-3" aria-label="LUXORA">
            <Logo size={46} />
            <span className="brand-word" dir="ltr">LUXORA</span>
          </Link>

          <nav aria-label={t.nav.main} className="hidden items-center gap-7 md:flex">
            <div onMouseEnter={openMega} onFocus={openMega}>
              <Link href={shopHref} className="nav-link" aria-haspopup="true" aria-expanded={megaOpen}
                aria-current={pathname.startsWith(shopHref) ? "page" : undefined}>
                {t.nav.shop}<ChevronDown width={16} height={16} className={`transition-transform ${megaOpen ? "rotate-180" : ""}`} />
              </Link>
            </div>
            {links.map((l) => (
              <Link key={l.href} href={l.href} onMouseEnter={closeMega} aria-current={pathname.startsWith(l.href) ? "page" : undefined} className="nav-link">{l.label}</Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button type="button" className="icon-btn" aria-label={t.nav.search} onClick={() => setSearchOpen(true)}><SearchIcon width={18} height={18} /></button>
            <a href={switchHref} hrefLang={other} lang={other} aria-label={t.nav.language} className="icon-btn !w-auto px-4 text-sm font-bold">
              {other === "fa" ? "فارسی" : "EN"}
            </a>
            <ThemeToggle label={t.nav.theme} />
            <button type="button" className="icon-btn md:hidden" aria-expanded={open} aria-controls="mobile-nav" aria-label={t.nav.menu} onClick={() => setOpen(!open)}>
              {open ? <CloseIcon width={18} height={18} /> : <MenuIcon width={18} height={18} />}
            </button>
          </div>
        </div>

        {/* Mega menu (desktop) */}
        {megaOpen && (
          <div className="mega-panel hidden md:block" onMouseEnter={openMega} onMouseLeave={closeMega} role="region" aria-label={t.nav.shopMenu}>
            <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 lg:grid-cols-[repeat(5,1fr)_1.25fr]">
              {mega.groups.map((g) => (
                <div key={g.title}>
                  <p className="label-caps text-accent">{g.title}</p>
                  <ul className="mt-3">
                    {g.items.map((it) => (
                      <li key={it}><Link href={`${shopHref}?q=${encodeURIComponent(it)}`} className="mega-link" onClick={() => setMegaOpen(false)}>{it}</Link></li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="rounded-2xl border border-[var(--hdr-line)] p-5" style={{ background: "var(--accent-soft)" }}>
                <p className="label-caps text-accent">{mega.filtersTitle}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {mega.filters.map((f) => <Link key={f} href={`${shopHref}?filter=${encodeURIComponent(f)}`} className="chip" onClick={() => setMegaOpen(false)}>{f}</Link>)}
                </div>
                <p className="mt-5 text-base font-extrabold">{mega.featuredTitle}</p>
                <p className="mt-1 text-sm opacity-80">{mega.featuredText}</p>
                <Link href={shopHref} className="btn-primary mt-4 !h-10 gap-2 !px-5 text-sm" onClick={() => setMegaOpen(false)}>{mega.featuredCta}<ArrowIcon width={16} height={16} className="rtl:rotate-180" /></Link>
              </div>
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {open && (
          <nav id="mobile-nav" aria-label={t.nav.main} className="max-h-[75vh] overflow-y-auto border-t border-[var(--hdr-line)] px-5 py-4 md:hidden">
            <ul className="flex flex-col">
              <li className="border-b border-[var(--hdr-line)]">
                <button type="button" className="flex w-full items-center justify-between py-3 text-lg font-bold" aria-expanded={mobileGroup !== null} onClick={() => setMobileGroup(mobileGroup === null ? 0 : null)}>
                  {t.nav.shop}<ChevronDown width={18} height={18} className={mobileGroup !== null ? "rotate-180" : ""} />
                </button>
                {mobileGroup !== null && (
                  <div className="pb-3">
                    {mega.groups.map((g, i) => (
                      <div key={g.title}>
                        <button type="button" className="flex w-full items-center justify-between py-2 text-sm font-bold text-accent" aria-expanded={mobileGroup === i} onClick={() => setMobileGroup(i)}>{g.title}</button>
                        {mobileGroup === i && <ul className="pb-2 ps-3">{g.items.map((it) => <li key={it}><Link href={`${shopHref}?q=${encodeURIComponent(it)}`} className="block py-1.5 text-sm">{it}</Link></li>)}</ul>}
                      </div>
                    ))}
                    <Link href={shopHref} className="btn-primary mt-2 !h-10 text-sm">{mega.featuredCta}</Link>
                  </div>
                )}
              </li>
              {links.map((l) => <li key={l.href} className="border-b border-[var(--hdr-line)]"><Link href={l.href} className="block py-3 text-lg font-bold">{l.label}</Link></li>)}
            </ul>
          </nav>
        )}
      </div>
      <SearchPanel locale={locale} open={searchOpen} onClose={closeSearch} />
    </header>
  );
}
