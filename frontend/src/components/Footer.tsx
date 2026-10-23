import Link from "next/link";
import type { Dict, Locale } from "@/lib/i18n";
import { SITE } from "@/data/site";
import HairLazy from "./HairLazy";
import Logo, { Wordmark } from "./Logo";
import { PhoneIcon } from "./Icons";

export default function Footer({ locale, t }: { locale: Locale; t: Dict }) {
  const f = t.footer;
  const shop = `/${locale}/shop`;
  return (
    <footer className="site-footer page-layer">
      <HairLazy />
        <div className="relative mx-auto grid max-w-7xl gap-6 px-5 pb-6 pt-10 sm:pt-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-3">
            <Logo size={48} />
            <Wordmark />
          </div>
          <p className="mt-4 max-w-xs text-sm" style={{ color: "var(--ft-muted)" }}>{f.about}</p>
          <p className="mt-4 text-sm font-bold" style={{ color: "var(--accent-2)" }}>{f.hairNote}</p>
        </div>

        <nav aria-label={f.explore}>
          <p className="label-caps" style={{ color: "var(--accent-2)" }}>{f.shopTitle}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {f.shop.map((x) => <li key={x}><Link href={`${shop}?q=${encodeURIComponent(x)}`} className="footer-link">{x}</Link></li>)}
          </ul>
        </nav>

        <div>
          <p className="label-caps" style={{ color: "var(--accent-2)" }}>{f.companyTitle}</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href={`/${locale}/about`} className="footer-link">{t.nav.about}</Link></li>
            <li><Link href={`/${locale}/brands`} className="footer-link">{t.nav.brands}</Link></li>
            <li><Link href={`/${locale}/contact`} className="footer-link">{t.nav.contact}</Link></li>
          </ul>
          <p className="label-caps mt-6" style={{ color: "var(--accent-2)" }}>{f.supportTitle}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {f.support.map((x) => <li key={x}><Link href={`/${locale}/contact`} className="footer-link">{x}</Link></li>)}
          </ul>
        </div>

        <div>
          <p className="label-caps" style={{ color: "var(--accent-2)" }}>{f.contactTitle}</p>
          <a href={SITE.phoneHref} className="mt-4 flex items-center gap-3 text-lg font-extrabold" dir="ltr">
            <span className="social-btn !h-10 !w-10"><PhoneIcon width={18} height={18} /></span>{SITE.phoneDisplay}
          </a>
          <p className="mt-3 text-sm" style={{ color: "var(--ft-muted)" }}>{f.email}: <a href={`mailto:${SITE.email}`} className="underline" dir="ltr">{SITE.email}</a></p>
          <p className="mt-4 max-w-xs text-xs" style={{ color: "var(--ft-muted)" }}>{f.note}</p>
        </div>
      </div>
      <p className="relative border-t py-5 text-center text-xs" style={{ borderColor: "var(--ft-line)", color: "var(--ft-muted)" }}>
        © {new Date().getFullYear()} LUXORA. {f.rights}
      </p>
    </footer>
  );
}
