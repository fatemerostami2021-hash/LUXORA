// DEMO DATA ONLY. No real prices, specs, reviews or stock. Demo products are flagged isDemo=true.
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const brands = [
  { slug: "dyson", name: "Dyson", en: ["Engineering Meets Beauty.", "Explore innovative hair care and styling tools developed with a focus on engineering, performance, and design."], fa: ["مهندسی و زیبایی در کنار هم.", "ابزارهای نوآورانه مراقبت و حالت‌دهی مو را ببین که با تمرکز بر مهندسی، عملکرد و طراحی ساخته شده‌اند."] },
  { slug: "shark", name: "Shark", en: ["Versatility for Your Everyday.", "Discover multifunctional styling solutions designed to make different looks more accessible."], fa: ["تنوع برای هر روز.", "راهکارهای چندکاره حالت‌دهی که ساختن حالت‌های مختلف را در دسترس‌تر می‌کنند."] },
  { slug: "ghd", name: "ghd", en: ["Professional Styling, Refined.", "Explore styling tools created for sleek finishes, polished looks, and precise control."], fa: ["حالت‌دهی حرفه‌ای، پالوده.", "ابزارهایی برای حالت‌های صاف و براق، ظاهر مرتب و کنترل دقیق."] },
  { slug: "babyliss", name: "BaByliss", en: ["Styling Possibilities Without Limits.", "Discover a diverse range of hair styling tools designed for different techniques, textures, and looks."], fa: ["امکان‌های بی‌پایان حالت‌دهی.", "طیف متنوعی از ابزارهای حالت‌دهی برای تکنیک‌ها، بافت‌ها و استایل‌های مختلف."] },
] as const;
const categories = [
  { slug: "multi-stylers", en: "Multi-Stylers", fa: "مولتی‌استایلر" },
  { slug: "hair-dryers", en: "Hair Dryers", fa: "سشوار" },
  { slug: "straighteners", en: "Straighteners", fa: "اتو مو" },
  { slug: "curling-tools", en: "Curling Tools", fa: "ابزار فر" },
  { slug: "brushes-accessories", en: "Brushes & Accessories", fa: "برس و لوازم جانبی" },
];

async function main() {
  for (const b of brands) {
    const brand = await prisma.brand.upsert({ where: { slug: b.slug }, update: { name: b.name }, create: { slug: b.slug, name: b.name } });
    for (const locale of ["en", "fa"] as const) {
      const [headline, description] = b[locale];
      await prisma.brandTranslation.upsert({
        where: { brandId_locale: { brandId: brand.id, locale } },
        update: { headline, description },
        create: { brandId: brand.id, locale, headline, description },
      });
    }
  }
  for (const [i, c] of categories.entries()) {
    const cat = await prisma.category.upsert({ where: { slug: c.slug }, update: { sortOrder: i }, create: { slug: c.slug, sortOrder: i } });
    for (const locale of ["en", "fa"] as const) {
      await prisma.categoryTranslation.upsert({
        where: { categoryId_locale: { categoryId: cat.id, locale } },
        update: { name: c[locale] },
        create: { categoryId: cat.id, locale, name: c[locale] },
      });
    }
  }
  // Demo products are attached to Dyson only as a placeholder brand; they are not real products.
  const dyson = await prisma.brand.findUniqueOrThrow({ where: { slug: "dyson" } });
  for (const c of categories) {
    const cat = await prisma.category.findUniqueOrThrow({ where: { slug: c.slug } });
    const slug = `demo-${c.slug}`;
    const p = await prisma.product.upsert({
      where: { slug }, update: {},
      create: { slug, brandId: dyson.id, categoryId: cat.id, status: "PUBLISHED", isDemo: true },
    });
    for (const locale of ["en", "fa"] as const) {
      const name = locale === "en" ? `Demo ${c.en}` : `نمونه ${c.fa}`;
      await prisma.productTranslation.upsert({
        where: { productId_locale: { productId: p.id, locale } },
        update: { name },
        create: { productId: p.id, locale, name },
      });
    }
  }
  console.log("Seeded demo brands, categories and demo products (no prices).");
}
main().finally(() => prisma.$disconnect());
