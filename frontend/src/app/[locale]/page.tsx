import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Eyebrow } from "@/components/Section";
import PartsJourney from "@/components/home/PartsJourney";
import { brandSlugs, categoryImages, demoProducts } from "@/data/demo";
import { IMG } from "@/data/images";
import { getDict, isLocale } from "@/lib/i18n";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDict(locale);
  const h = t.home;
  const shop = `/${locale}/shop`;
  const tiles = ["attachments_curling_barrel", "attachments_round_brush", "attachments_smoothing_brush", "attachments_volumizing", "attachments_storage_case"] as const;

  return (
    <>
      {/* 1. Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 md:grid-cols-2 md:py-20">
        <div>
          <Eyebrow>{t.tagline}</Eyebrow>
          <h1 data-reveal="0" className="mt-5 text-5xl leading-[1.08] md:text-7xl">{h.heroTitle}</h1>
          <p data-reveal="0.12" className="mt-6 max-w-xl text-lg text-muted">{h.heroText}</p>
          <div data-reveal="0.24" className="mt-8 flex flex-wrap gap-3">
            <Link href={shop} className="btn-primary">{h.ctaPrimary}</Link>
            <Link href={shop} className="btn-ghost">{h.ctaSecondary}</Link>
          </div>
        </div>
        <div data-reveal="0.1" className="card relative mx-auto aspect-square w-full max-w-xl overflow-hidden">
          <div data-parallax="6" className="absolute inset-[-8%]">
            <Image {...IMG.hero_model_blush} alt={h.alts.hero} priority sizes="(min-width:768px) 40vw, 90vw" className="h-full w-full object-cover dark:hidden" />
            <Image {...IMG.hero_model_ivory} alt={h.alts.hero} priority sizes="(min-width:768px) 40vw, 90vw" className="hidden h-full w-full object-cover dark:block" />
          </div>
        </div>
      </section>

      {/* 2. Parts travel with the scroll (fixed WebGL layer) and assemble here */}
      <PartsJourney t={h.journey} />

      {/* 3. Categories */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <h2 data-reveal="0" className="text-3xl md:text-5xl">{h.catsTitle}</h2>
        <p data-reveal="0.1" className="mt-3 max-w-2xl text-muted">{h.catsText}</p>
        <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-5">
          {h.cats.map((c, i) => (
            <li key={c} data-reveal={i * 0.08}>
              <Link href={shop} className="card group relative block aspect-[3/4] overflow-hidden">
                <Image src={IMG[categoryImages[i]].src} alt="" fill sizes="(min-width:768px) 20vw, 45vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4 text-base font-bold text-white">{c}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 4. Attachments (from the concept board) */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <Eyebrow>{h.attachments.eyebrow}</Eyebrow>
        <h2 data-reveal="0" className="mt-3 text-3xl md:text-5xl">{h.attachments.title}</h2>
        <p data-reveal="0.1" className="mt-3 max-w-2xl text-muted">{h.attachments.text}</p>
        <div className="mt-10 grid gap-4 md:grid-cols-[1.7fr_1fr]">
          <div data-reveal="0" className="card overflow-hidden"><Image {...IMG.attachments_lineup} alt={h.attachments.lineupAlt} sizes="(min-width:768px) 55vw, 95vw" className="h-full w-full object-cover" /></div>
          <div data-reveal="0.1" className="card overflow-hidden"><Image {...IMG.attachments_case_scene} alt={h.attachments.caseAlt} sizes="(min-width:768px) 30vw, 95vw" className="h-full w-full object-cover" /></div>
        </div>
        <ul className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-5">
          {h.attachments.items.map((it, i) => (
            <li key={it.name} data-reveal={i * 0.07} className="card overflow-hidden">
              <Image {...IMG[tiles[i]]} alt="" sizes="(min-width:768px) 18vw, 45vw" className="aspect-[9/10] w-full object-cover" />
              <div className="p-4"><p className="font-bold">{it.name}</p><p className="mt-1 text-sm text-muted">{it.text}</p></div>
            </li>
          ))}
        </ul>
      </section>

      {/* 5. Featured (demo) */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <h2 data-reveal="0" className="text-3xl md:text-5xl">{h.featTitle}</h2>
        <p data-reveal="0.1" className="mt-3 max-w-2xl text-muted">{h.featText}</p>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {demoProducts.slice(0, 3).map((p, i) => (
            <li key={p.slug} data-reveal={i * 0.1} className="card p-4">
              <Image {...IMG[p.image]} alt="" sizes="(min-width:1024px) 30vw, 90vw" className="aspect-square w-full rounded-xl object-cover" />
              <p className="mt-4 font-bold">{h.cats[p.category]}</p>
              <p className="text-xs text-muted">{t.shop.demoProduct}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 6. Brands */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <h2 data-reveal="0" className="text-3xl md:text-5xl">{h.brandsTitle}</h2>
        <p data-reveal="0.1" className="mt-3 max-w-2xl text-muted">{h.brandsText}</p>
        <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {t.brands.items.map((b, i) => (
            <li key={brandSlugs[i]} data-reveal={i * 0.08}>
              <Link href={`/${locale}/brands`} className="card flex h-28 items-center justify-center text-xl font-extrabold tracking-wide transition-transform hover:-translate-y-1" dir="ltr">{b.name}</Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 7. Editorial */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="card grid items-center gap-10 overflow-hidden p-8 md:grid-cols-2 md:p-14">
          <div>
            <h2 data-reveal="0" className="text-3xl md:text-5xl">{h.editTitle}</h2>
            <p data-reveal="0.1" className="mt-4 max-w-xl text-muted">{h.editText}</p>
            <Link data-reveal="0.2" href={`/${locale}/about`} className="btn-ghost mt-8">{h.editCta}</Link>
          </div>
          <div data-reveal="0.1" className="relative">
            <Image {...IMG.editorial_styling_products} alt={h.alts.products} sizes="(min-width:768px) 40vw, 90vw" className="w-full rounded-2xl object-cover" />
            <Image {...IMG.editorial_gift_set} alt={h.alts.giftSet} sizes="30vw" className="absolute -bottom-6 -start-4 w-2/5 rounded-2xl border-4 border-bg object-cover shadow-xl" />
          </div>
        </div>
      </section>

      {/* 8. Final CTA */}
      <section className="relative mx-auto my-10 max-w-7xl overflow-hidden rounded-3xl px-5">
        <Image {...IMG.categories_tools_pedestals} alt={h.alts.tools} sizes="90vw" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative mx-auto max-w-3xl px-5 py-24 text-center text-white">
          <h2 data-reveal="0" className="text-4xl md:text-6xl">{h.finalTitle}</h2>
          <p data-reveal="0.1" className="mt-4 text-white/80">{h.finalText}</p>
          <Link data-reveal="0.2" href={shop} className="btn-primary mt-8">{h.finalCta}</Link>
        </div>
      </section>
    </>
  );
}
