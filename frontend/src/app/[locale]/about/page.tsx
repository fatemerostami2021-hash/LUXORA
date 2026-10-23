import { notFound } from "next/navigation";
import Image from "next/image";
import { Eyebrow } from "@/components/Section";
import Kinetic from "@/components/Kinetic";
import PageScene from "@/components/scene/PageSceneLazy";
import { IMG } from "@/data/images";
import { getDict, isLocale } from "@/lib/i18n";

export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const a = getDict(locale).about;
  return (
    <>
    <PageScene variant="about" locale={locale} />
    <div className="mx-auto max-w-4xl px-5 py-16">
      <Eyebrow>{a.eyebrow}</Eyebrow>
      <Kinetic as="h1" text={a.title} className="mt-4" immediate />
      <div className="lede mt-8 space-y-5 text-muted">{a.paragraphs.map((p, i) => <p key={p} className={i === 0 ? "drop" : ""}>{p}</p>)}</div>
      <Kinetic as="h2" text={a.philosophyTitle} className="display-sm mt-16" />
      <ul className="mt-6 grid gap-5 md:grid-cols-3">
        {a.philosophy.map((p) => (
          <li key={p.head} data-tilt className="card p-6">
            <p className="font-semibold">{p.head}</p>
            <p className="mt-2 text-sm text-muted">{p.text}</p>
          </li>
        ))}
      </ul>
      <Kinetic as="h2" text={a.promiseTitle} className="display-sm mt-16" />
      <p className="mt-3 text-lg">{a.promise}</p>
      <p className="mt-8 text-sm font-bold text-accent">{a.signoff}</p>
      <section className="card mt-16 p-6 md:p-8" aria-labelledby="designer-story">
        <p className="eyebrow">{a.designerTitle}</p>
        <h2 id="designer-story" className="display-sm mt-3">{a.designerText}</h2>
      </section>
      <Image {...IMG.editorial_gift_set} alt="" sizes="(min-width:768px) 50vw, 90vw" className="mt-10 w-full max-w-md rounded-3xl object-cover" />
    </div>
    </>
  );
}
