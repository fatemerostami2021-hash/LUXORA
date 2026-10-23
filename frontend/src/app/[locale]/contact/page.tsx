import { notFound } from "next/navigation";
import { Eyebrow } from "@/components/Section";
import Kinetic from "@/components/Kinetic";
import PageScene from "@/components/scene/PageSceneLazy";
import { getDict, isLocale } from "@/lib/i18n";

export default async function Contact({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const c = getDict(locale).contact;
  const input = "mt-1 w-full rounded-xl border border-line bg-surface px-4 py-3";
  return (
    <>
    <PageScene variant="contact" locale={locale} />
    <div className="mx-auto max-w-5xl px-5 py-16">
      <Eyebrow>{c.eyebrow}</Eyebrow>
      <Kinetic as="h1" text={c.title} className="mt-4 max-w-3xl" immediate />
      <p className="mt-5 max-w-2xl text-muted">{c.intro}</p>

      <div className="mt-12 grid gap-12 md:grid-cols-2">
        <form className="space-y-4" aria-describedby="form-note">
          <Kinetic as="h2" text={c.formTitle} className="display-sm" />
          <p className="text-sm text-muted">{c.formText}</p>
          <label className="block text-sm">{c.fields.name}<input name="name" autoComplete="name" className={input} /></label>
          <label className="block text-sm">{c.fields.email}<input name="email" type="email" autoComplete="email" className={input} /></label>
          <label className="block text-sm">{c.fields.order}<input name="order" className={input} /></label>
          <label className="block text-sm">{c.fields.subject}<input name="subject" className={input} /></label>
          <label className="block text-sm">{c.fields.message}<textarea name="message" rows={5} className={input} /></label>
          <button type="button" disabled className="h-12 rounded-full bg-fg px-7 text-sm font-semibold text-bg opacity-40">{c.send}</button>
          <p id="form-note" className="text-xs text-accent">{c.notConnected}</p>
        </form>
        <div>
          <Kinetic as="h2" text={c.faqTitle} className="display-sm" />
          <div className="mt-4 divide-y divide-line border-y border-line">
            {c.faq.map((f) => (
              <details key={f.q} className="py-4">
                <summary className="cursor-pointer font-semibold">{f.q}</summary>
                <p className="mt-2 text-sm text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
