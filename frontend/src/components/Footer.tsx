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
        <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-x-5 gap-y-4 px-5 pb-3 pt-6 sm:gap-6 sm:pb-6 sm:pt-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-3">
            <Logo size={48} />
            <Wordmark />
          </div>
          <p className="mt-2 max-w-xs text-sm sm:mt-4" style={{ color: "var(--ft-muted)" }}>{f.about}</p>
          <p className="mt-2 hidden text-sm font-bold sm:mt-4 sm:block" style={{ color: "var(--accent-2)" }}>{f.hairNote}</p>
        </div>

        <nav aria-label={f.explore}>
          <p className="label-caps" style={{ color: "var(--accent-2)" }}>{f.shopTitle}</p>
          <ul className="mt-2 space-y-1 text-sm sm:mt-4 sm:space-y-2">
            {f.shop.map((x) => <li key={x}><Link href={`${shop}?q=${encodeURIComponent(x)}`} className="footer-link">{x}</Link></li>)}
          </ul>
        </nav>

        <div>
          <p className="label-caps" style={{ color: "var(--accent-2)" }}>{f.companyTitle}</p>
          <ul className="mt-2 space-y-1 text-sm sm:mt-4 sm:space-y-2">
            <li><Link href={`/${locale}/about`} className="footer-link">{t.nav.about}</Link></li>
            <li><Link href={`/${locale}/brands`} className="footer-link">{t.nav.brands}</Link></li>
            <li><Link href={`/${locale}/contact`} className="footer-link">{t.nav.contact}</Link></li>
            <li><a href={SITE.designerUrl} target="_blank" rel="noopener noreferrer" className="footer-link">{locale === "en" ? "Fatemeh Rostami — Web Developer" : locale === "ar" ? "فاطمة رستمي — مطوّرة ويب" : "فاطمه رستمی — طراح سایت"}</a></li>
          </ul>
          <p className="label-caps mt-3 sm:mt-6" style={{ color: "var(--accent-2)" }}>{f.supportTitle}</p>
          <ul className="mt-2 space-y-1 text-sm sm:mt-4 sm:space-y-2">
            {f.support.map((x) => <li key={x}><Link href={`/${locale}/contact`} className="footer-link">{x}</Link></li>)}
          </ul>
        </div>

        <div className="col-span-2 md:col-span-1">
          <p className="label-caps" style={{ color: "var(--accent-2)" }}>{f.contactTitle}</p>
          <a href={SITE.phoneHref} className="mt-2 flex items-center gap-3 text-lg font-extrabold sm:mt-4" dir="ltr">
            <span className="social-btn !h-10 !w-10"><PhoneIcon width={18} height={18} /></span>{SITE.phoneDisplay}
          </a>
          <p className="mt-3 text-sm" style={{ color: "var(--ft-muted)" }}>{f.email}: <a href={`mailto:${SITE.email}`} className="underline" dir="ltr">{SITE.email}</a></p>
          <p className="mt-2 text-sm" style={{ color: "var(--ft-muted)" }}>{locale === "ar" ? "شيراز، شارع زَرگَري" : SITE.address}</p>
          <p className="mt-4 hidden max-w-xs text-xs sm:block" style={{ color: "var(--ft-muted)" }}>{f.note}</p>
        </div>
      </div>
      <p className="relative border-t py-3 text-center text-xs sm:py-5" style={{ borderColor: "var(--ft-line)", color: "var(--ft-muted)" }}>
        © {new Date().getFullYear()} LUXORA. {f.rights}
      </p>
    </footer>
  );
}
