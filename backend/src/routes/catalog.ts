import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";

export const catalog = Router();

const localeSchema = z.enum(["en", "fa", "ar"]).default("en");
const regionSchema = z.enum(["AE", "CA", "IR", "OM"]);

const pick = <X extends { locale: string }>(rows: X[], locale: string): X | undefined =>
  rows.find((r) => r.locale === locale) ?? rows.find((r) => r.locale === "en");

catalog.get("/brands", async (req, res, next) => {
  try {
    const { locale } = z.object({ locale: localeSchema }).parse(req.query);
    const brands = await prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      include: {
        translations: true,
        _count: { select: { products: { where: { status: "PUBLISHED" } } } },
      },
    });
    res.json({
      data: brands.map((b) => {
        const t = pick(b.translations, locale);
        return { slug: b.slug, name: b.name, headline: t?.headline ?? null, description: t?.description ?? null, productCount: b._count.products };
      }),
    });
  } catch (e) { next(e); }
});

const listQuery = z.object({
  locale: localeSchema,
  region: regionSchema.optional(),
  brand: z.string().max(80).optional(),
  category: z.string().max(80).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(48).default(12),
});

catalog.get("/products", async (req, res, next) => {
  try {
    const q = listQuery.parse(req.query);
    const where = {
      status: "PUBLISHED" as const,
      ...(q.brand ? { brand: { slug: q.brand } } : {}),
      ...(q.category ? { category: { slug: q.category } } : {}),
      // sold in a region only when a price exists for that region
      ...(q.region ? { prices: { some: { region: q.region } } } : {}),
    };
    const [total, rows] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (q.page - 1) * q.limit,
        take: q.limit,
        include: {
          brand: true,
          category: { include: { translations: true } },
          translations: true,
          prices: q.region ? { where: { region: q.region } } : false,
          inventory: q.region ? { where: { region: q.region } } : false,
        },
      }),
    ]);
    res.json({
      data: rows.map((p) => {
        const t = pick(p.translations, q.locale);
        const price = p.prices?.[0];
        const inv = p.inventory?.[0];
        return {
          slug: p.slug,
          isDemo: p.isDemo,
          name: t?.name ?? p.slug,
          summary: t?.summary ?? null,
          brand: { slug: p.brand.slug, name: p.brand.name },
          category: { slug: p.category.slug, name: pick(p.category.translations, q.locale)?.name ?? p.category.slug },
          price: price ? { currency: price.currency, amount: price.amount.toString() } : null,
          inStock: inv ? inv.quantity > 0 : null,
        };
      }),
      meta: { page: q.page, limit: q.limit, total },
    });
  } catch (e) { next(e); }
});

catalog.get("/products/:slug", async (req, res, next) => {
  try {
    const { locale, region } = z.object({ locale: localeSchema, region: regionSchema.optional() }).parse(req.query);
    const p = await prisma.product.findFirst({
      where: { slug: req.params.slug, status: "PUBLISHED" },
      include: {
        brand: true,
        translations: true,
        specs: { orderBy: { sortOrder: "asc" } },
        category: { include: { translations: true } },
        prices: region ? { where: { region } } : false,
        inventory: region ? { where: { region } } : false,
      },
    });
    if (!p) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Product not found" } });
    const t = pick(p.translations, locale);
    const price = p.prices?.[0];
    const inv = p.inventory?.[0];
    res.json({
      data: {
        slug: p.slug, isDemo: p.isDemo, sku: p.sku,
        name: t?.name ?? p.slug, summary: t?.summary ?? null, description: t?.description ?? null,
        brand: { slug: p.brand.slug, name: p.brand.name },
        category: { slug: p.category.slug, name: pick(p.category.translations, locale)?.name ?? p.category.slug },
        specs: p.specs.map((s) => ({ key: s.key, value: s.value, unit: s.unit })),
        price: price ? { currency: price.currency, amount: price.amount.toString() } : null,
        inStock: inv ? inv.quantity > 0 : null,
      },
    });
  } catch (e) { next(e); }
});
