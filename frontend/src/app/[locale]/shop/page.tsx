import Image from "next/image";
import { notFound } from "next/navigation";
import { Eyebrow } from "@/components/Section";
import Kinetic from "@/components/Kinetic";
import PageScene from "@/components/scene/PageSceneLazy";
import ShopProducts from "@/components/ShopProducts";
import { IMG } from "@/data/images";
import { getDict, isLocale } from "@/lib/i18n";

export default async function Shop({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDict(locale);
  const s = t.shop;
  return (
    <>
    <PageScene variant="shop" locale={locale} />
    <div className="mx-auto max-w-7xl px-5 py-16">
      <Eyebrow>{s.eyebrow}</Eyebrow>
      <Kinetic as="h1" text={s.title} className="mt-4 max-w-3xl" immediate />
      <p data-reveal="0.1" className="mt-5 max-w-2xl text-muted">{s.intro}</p>
      <p className="mt-4 text-xs font-semibold text-accent">{t.common.preview}</p>

      <div className="mt-10 grid gap-10 md:grid-cols-[240px_1fr]">
          <aside aria-label={s.filtersTitle}>
          <h2 className="label-caps">{s.filtersTitle}</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line text-sm">
            {s.filters.map((f) => <li key={f} className="py-3 text-muted"><a href={`https://www.sephora.com/`} target="_blank" rel="noopener noreferrer" className="footer-link">{f}</a></li>)}
          </ul>
          <h2 className="label-caps mt-8">{s.sortTitle}</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">{s.sort.map((x) => <li key={x}>{x}</li>)}</ul>
        </aside>
        <ShopProducts />
      </div>
    </div>
    </>
  );
}
