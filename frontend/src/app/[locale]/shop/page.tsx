import Image from "next/image";
import { notFound } from "next/navigation";
import { Eyebrow } from "@/components/Section";
import Kinetic from "@/components/Kinetic";
import PageScene from "@/components/scene/PageSceneLazy";
import { demoProducts } from "@/data/demo";
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
            {s.filters.map((f) => <li key={f} className="py-3 text-muted">{f}</li>)}
          </ul>
          <h2 className="label-caps mt-8">{s.sortTitle}</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">{s.sort.map((x) => <li key={x}>{x}</li>)}</ul>
        </aside>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {demoProducts.map((p, i) => (
            <li key={p.slug} data-reveal={(i % 3) * 0.08} data-tilt className="card p-4">
              <Image {...IMG[p.image]} alt="" sizes="(min-width:1024px) 22vw, 45vw" className="aspect-square w-full rounded-xl object-cover" />
              <p className="mt-4 font-bold">{t.home.cats[p.category]}</p>
              <p className="text-xs text-muted">{s.demoNote}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </>
  );
}
