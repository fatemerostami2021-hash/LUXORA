"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Dict, Locale } from "@/lib/i18n";
import { MEGA } from "@/data/mega";
import { getExternalHref } from "@/data/externalLinks";
import Logo, { Wordmark } from "./Logo";
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
  const other: Locale = locale === "en" ? "fa" : locale === "fa" ? "ar" : "en";
  const rest = pathname.replace(/^\/(en|fa|ar)(?=\/|$)/, "") || "";
  // Plain <a> (full page load) for the language switch: it resets the <html lang/dir> and every animation cleanly.
  const switchHref = `/${other}${rest}`;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); setMegaOpen(false); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => { setOpen(false); setMegaOpen(false); }, [pathname]);
  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    return () => document.documentElement.classList.remove("menu-open");
  }, [open]);
  // leaving the phone/tablet layout while the menu is open must also close it
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const on = () => { if (mq.matches) setOpen(false); };
    mq.addEventListener("change", on); return () => mq.removeEventListener("change", on);
  }, []);

  const openMega = () => { window.clearTimeout(closeTimer.current); setMegaOpen(true); };
  const closeMega = () => { window.clearTimeout(closeTimer.current); closeTimer.current = window.setTimeout(() => setMegaOpen(false), 140); };
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  const shopHref = `/${locale}/shop`;
  const accountHref = `/${locale}/account`;
  const cartHref = `/${locale}/cart`;
  const accountLabel = locale === "en" ? "Account" : locale === "ar" ? "الحساب" : "حساب کاربری";
  const cartLabel = locale === "en" ? "Cart" : locale === "ar" ? "السلة" : "سبد خرید";
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
            <Wordmark />
          </Link>

          <nav aria-label={t.nav.main} className="hidden items-center gap-7 lg:flex">
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
            <span className="hidden lg:block">
            <a href={switchHref} hrefLang={other} lang={other} aria-label={t.nav.language} className="icon-btn !w-auto px-4 text-sm font-bold">
              {other === "fa" ? "فارسی" : other === "ar" ? "العربية" : "EN"}
            </a>
            </span>
            <span className="hidden lg:block"><ThemeToggle label={t.nav.theme} /></span>
            <Link href={accountHref} className="hidden rounded-full border border-[var(--hdr-line)] px-3 py-2 text-xs font-bold lg:block">{accountLabel}</Link>
            <Link href={cartHref} className="hidden rounded-full border border-[var(--hdr-line)] px-3 py-2 text-xs font-bold lg:block">{cartLabel}</Link>
            <button type="button" className={`burger lg:hidden ${open ? "is-open" : ""}`} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? t.nav.close : t.nav.menu} onClick={() => setOpen(!open)}>
              <span className="burger-bars" aria-hidden><i /><i /><i /></span>
              <span className="burger-word">{t.nav.menuWord}</span>
            </button>
          </div>
        </div>

        {/* Mega menu (desktop) */}
        {megaOpen && (
          <div className="mega-panel hidden lg:block" onMouseEnter={openMega} onMouseLeave={closeMega} role="region" aria-label={t.nav.shopMenu}>
            <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 lg:grid-cols-[repeat(5,1fr)_1.25fr]">
              {mega.groups.map((g) => (
                <div key={g.title}>
                  <p className="label-caps text-accent">{g.title}</p>
                  <ul className="mt-3">
                    {g.items.map((it) => {
                      const external = getExternalHref(it);
                      return <li key={it}>{external ? <a href={external} target="_blank" rel="noopener noreferrer" className="mega-link">{it}</a> : <Link href={`${shopHref}?q=${encodeURIComponent(it)}`} className="mega-link" onClick={() => setMegaOpen(false)}>{it}</Link>}</li>;
                    })}
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

        {/* Mobile / tablet menu: full overlay, page behind it is locked */}
        {open && (
          <nav id="mobile-nav" aria-label={t.nav.main} className="mobile-nav lg:hidden">
            <ul className="flex flex-col">
              <li className="border-b border-[var(--hdr-line)]">
                <button type="button" className="mnav-row" aria-expanded={mobileGroup !== null} onClick={() => setMobileGroup(mobileGroup === null ? 0 : null)}>
                  <span>{t.nav.shop}</span><ChevronDown width={20} height={20} className={`transition-transform ${mobileGroup !== null ? "rotate-180" : ""}`} />
                </button>
                {mobileGroup !== null && (
                  <div className="pb-3">
                    {mega.groups.map((g, i) => (
                      <div key={g.title}>
                        <button type="button" className="flex w-full items-center justify-between py-2.5 text-sm font-bold text-accent" aria-expanded={mobileGroup === i} onClick={() => setMobileGroup(i)}>{g.title}</button>
                        {mobileGroup === i && <ul className="pb-2 ps-3">{g.items.map((it) => { const external = getExternalHref(it); return <li key={it}>{external ? <a href={external} target="_blank" rel="noopener noreferrer" className="block py-2 text-base">{it}</a> : <Link href={`${shopHref}?q=${encodeURIComponent(it)}`} className="block py-2 text-base">{it}</Link>}</li>; })}</ul>}
                      </div>
                    ))}
                    <Link href={shopHref} className="btn-primary mt-2 !h-11 text-sm">{mega.featuredCta}</Link>
                  </div>
                )}
              </li>
              {links.map((l) => <li key={l.href} className="border-b border-[var(--hdr-line)]"><Link href={l.href} className="mnav-row" aria-current={pathname.startsWith(l.href) ? "page" : undefined}>{l.label}</Link></li>)}
              <li className="border-b border-[var(--hdr-line)]"><Link href={accountHref} className="mnav-row">{accountLabel}</Link></li>
              <li className="border-b border-[var(--hdr-line)]"><Link href={cartHref} className="mnav-row">{cartLabel}</Link></li>
            </ul>
            <div className="mnav-prefs" role="group" aria-label={t.nav.prefs}>
              <a href={switchHref} hrefLang={other} lang={other} className="mnav-pref" aria-label={t.nav.language}>
                <span className="mnav-pref-k">{t.nav.langWord}</span><span className="mnav-pref-v">{other === "fa" ? "فارسی" : other === "ar" ? "العربية" : "English"}</span>
              </a>
              <div className="mnav-pref"><span className="mnav-pref-k">{t.nav.themeWord}</span><ThemeToggle label={t.nav.theme} /></div>
            </div>
          </nav>
        )}
      </div>
      <SearchPanel locale={locale} open={searchOpen} onClose={closeSearch} />
    </header>
  );
}
