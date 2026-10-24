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
      <p data-reveal="0.1" className="lede mt-5 max-w-2xl text-fg/80">{s.intro}</p>
      <p className="mt-4 text-sm font-semibold text-accent">{t.common.preview}</p>

      <div className="mt-10 grid gap-10 md:grid-cols-[240px_1fr]">
          <aside aria-label={s.filtersTitle} data-reveal="0.05" className="shop-aside md:sticky md:top-28 md:self-start">
          <h2 className="label-caps"><span className="mark" data-mark>{s.filtersTitle}</span></h2>
          <ul className="mt-4 divide-y divide-line border-y border-line text-sm">
            {s.filters.map((f) => <li key={f} className="py-3"><a href={`https://www.sephora.com/`} target="_blank" rel="noopener noreferrer" className="filter-link">{f}</a></li>)}
          </ul>
          <h2 className="label-caps mt-8"><span className="mark" data-mark>{s.sortTitle}</span></h2>
          <ul className="mt-3 space-y-2 text-[.95rem] text-fg/80">{s.sort.map((x) => <li key={x}>{x}</li>)}</ul>
        </aside>
        <ShopProducts />
      </div>
    </div>
    </>
  );
}
