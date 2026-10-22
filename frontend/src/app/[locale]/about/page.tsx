import { notFound } from "next/navigation";
import Image from "next/image";
import { Eyebrow } from "@/components/Section";
import { IMG } from "@/data/images";
import { getDict, isLocale } from "@/lib/i18n";

export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const a = getDict(locale).about;
  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <Eyebrow>{a.eyebrow}</Eyebrow>
      <h1 className="mt-4 text-4xl md:text-6xl">{a.title}</h1>
      <div className="mt-8 space-y-5 text-lg text-muted">{a.paragraphs.map((p) => <p key={p}>{p}</p>)}</div>
      <h2 className="mt-16 text-2xl font-bold">{a.philosophyTitle}</h2>
      <ul className="mt-6 grid gap-5 md:grid-cols-3">
        {a.philosophy.map((p) => (
          <li key={p.head} className="card p-6">
            <p className="font-semibold">{p.head}</p>
            <p className="mt-2 text-sm text-muted">{p.text}</p>
          </li>
        ))}
      </ul>
      <h2 className="mt-16 text-2xl font-bold">{a.promiseTitle}</h2>
      <p className="mt-3 text-lg">{a.promise}</p>
      <p className="mt-8 text-sm font-bold text-accent">{a.signoff}</p>
      <Image {...IMG.editorial_gift_set} alt="" sizes="(min-width:768px) 50vw, 90vw" className="mt-10 w-full max-w-md rounded-3xl object-cover" />
    </div>
  );
}
