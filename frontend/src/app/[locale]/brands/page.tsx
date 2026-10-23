import { notFound } from "next/navigation";
import { Eyebrow } from "@/components/Section";
import Kinetic from "@/components/Kinetic";
import PageScene from "@/components/scene/PageSceneLazy";
import { brandSlugs } from "@/data/demo";
import { getDict, isLocale } from "@/lib/i18n";

export default async function Brands({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const b = getDict(locale).brands;
  return (
    <>
    <PageScene variant="brands" locale={locale} />
    <div className="mx-auto max-w-7xl px-5 py-16">
      <Eyebrow>{b.eyebrow}</Eyebrow>
      <Kinetic as="h1" text={b.title} className="mt-4 max-w-3xl" immediate />
      <p className="mt-5 max-w-2xl text-muted">{b.intro}</p>
      <ul className="mt-12 grid gap-5 md:grid-cols-2">
        {b.items.map((it, i) => (
          <li key={brandSlugs[i]} data-tilt className="card p-8">
            <p className="display display-sm" lang="en" dir="ltr">{it.name}</p>
            <p className="mt-3 font-semibold text-accent">{it.head}</p>
            <p className="mt-2 text-muted">{it.text}</p>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-xs text-muted">{b.note}</p>
    </div>
    </>
  );
}
