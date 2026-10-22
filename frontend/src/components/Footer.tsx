import Link from "next/link";
import type { Dict, Locale } from "@/lib/i18n";

export default function Footer({ locale, t }: { locale: Locale; t: Dict }) {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto max-w-7xl px-5 py-12 grid gap-8 md:grid-cols-3">
        <div>
          <p className="text-lg font-extrabold tracking-[0.3em]" dir="ltr">LUXORA</p>
          <p className="mt-3 text-sm text-muted">{t.tagline}</p>
        </div>
        <nav aria-label={t.footer.explore} className="flex flex-col gap-2 text-sm">
          <Link href={`/${locale}/shop`}>{t.nav.shop}</Link>
          <Link href={`/${locale}/brands`}>{t.nav.brands}</Link>
          <Link href={`/${locale}/about`}>{t.nav.about}</Link>
          <Link href={`/${locale}/contact`}>{t.nav.contact}</Link>
        </nav>
        <p className="text-sm text-muted">{t.footer.note}</p>
      </div>
      <p className="border-t border-line py-5 text-center text-xs text-muted">© {new Date().getFullYear()} LUXORA</p>
    </footer>
  );
}
