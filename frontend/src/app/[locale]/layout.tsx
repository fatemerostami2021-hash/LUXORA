import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "@fontsource-variable/inter";
import "@fontsource-variable/vazirmatn";
import "@fontsource-variable/cormorant-garamond/wght.css";
import "@fontsource-variable/cormorant-garamond/wght-italic.css";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BrandRail from "@/components/BrandRail";
import ChatWidget from "@/components/ChatWidget";
import ScrollEffects from "@/components/ScrollEffects";
import { getDict, getDir, isLocale, locales } from "@/lib/i18n";

export const generateStaticParams = () => locales.map((locale) => ({ locale }));

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDict(locale);
  return {
    title: { default: `LUXORA — ${t.tagline}`, template: "%s | LUXORA" },
    description: t.home.heroText,
    alternates: { languages: { en: "/en", fa: "/fa", ar: "/ar" } },
  };
}

const themeScript = `try{var t=localStorage.getItem("theme");if(!t){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}if(!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("kin")`;

// This is the ONLY root layout (the only <html>). The old extra src/app/layout.tsx rendered a second
// <html> around this one, which caused hydration errors when switching language.
export default async function RootLayout({
  children, params,
}: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDict(locale);
  return (
    <html lang={locale} dir={getDir(locale)} data-theme="light" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body>
        <Header locale={locale} t={t} />
        <main id="main" className="page-layer">{children}</main>
        <BrandRail t={t.rail} />
        <Footer locale={locale} t={t} />
        <ChatWidget locale={locale} />
        <ScrollEffects />
      </body>
    </html>
  );
}
