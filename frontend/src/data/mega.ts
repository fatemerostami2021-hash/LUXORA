import type { Locale } from "@/lib/i18n";

export type MegaGroup = { title: string; items: string[] };
export type MegaData = {
  groups: MegaGroup[];
  filtersTitle: string;
  filters: string[];
  featuredTitle: string;
  featuredText: string;
  featuredCta: string;
  searchPlaceholder: string;
  searchTitle: string;
  searchHint: string;
  noResults: string;
  popular: string;
};

export const MEGA: Record<Locale, MegaData> = {
  en: {
    groups: [
      { title: "Hair Tools", items: ["Multi-Stylers", "Hair Dryers", "Straighteners", "Curling Tools", "Brushes & Combs", "Heat Protectants"] },
      { title: "Makeup", items: ["Lipstick & Lip Gloss", "Foundation & Concealer", "Mascara & Eyeliner", "Eyeshadow Palettes", "Blush & Highlighter", "Makeup Brushes"] },
      { title: "Skincare", items: ["Face Creams", "Serums", "Cleansers & Toners", "Sunscreen", "Masks", "Eye Care"] },
      { title: "Fragrance & Body", items: ["Women's Perfume", "Body Mist", "Body Lotion", "Hand & Nail Care", "Nail Polish", "Bath & Shower"] },
      { title: "Hair Care", items: ["Shampoo & Conditioner", "Hair Masks", "Hair Oils & Serums", "Styling Products", "Hair Accessories", "Scalp Care"] },
    ],
    filtersTitle: "Shop by filter",
    filters: ["Brand", "Price range", "Skin / hair concern", "New arrivals", "Best sellers", "Gift sets", "In stock"],
    featuredTitle: "Your signature look starts here",
    featuredText: "Discover tools and beauty essentials chosen to bring out the best in you.",
    featuredCta: "Shop everything",
    searchPlaceholder: "Search products, brands, categories…",
    searchTitle: "Search LUXORA",
    searchHint: "Press Enter to search the shop",
    noResults: "Nothing found. Try another word.",
    popular: "Popular searches",
  },
  fa: {
    groups: [
      { title: "ابزار حالت‌دهی مو", items: ["مولتی‌استایلر", "سشوار", "اتو مو", "ابزار فر", "برس و شانه", "محافظ حرارتی مو"] },
      { title: "آرایش", items: ["رژ لب و برق لب", "کرم پودر و کانسیلر", "ریمل و خط چشم", "پالت سایه", "رژگونه و هایلایتر", "براش آرایشی"] },
      { title: "مراقبت از پوست", items: ["کرم صورت", "سرم", "پاک‌کننده و تونر", "ضدآفتاب", "ماسک صورت", "مراقبت دور چشم"] },
      { title: "عطر و بدن", items: ["عطر زنانه", "بادی میست", "لوسیون بدن", "مراقبت از دست و ناخن", "لاک ناخن", "حمام و دوش"] },
      { title: "مراقبت از مو", items: ["شامپو و نرم‌کننده", "ماسک مو", "روغن و سرم مو", "محصولات حالت‌دهنده", "اکسسوری مو", "مراقبت از پوست سر"] },
    ],
    filtersTitle: "خرید بر اساس فیلتر",
    filters: ["برند", "محدوده قیمت", "نیاز پوست / مو", "تازه‌ها", "پرفروش‌ها", "ست‌های هدیه", "موجود در انبار"],
    featuredTitle: "استایل امضای تو از اینجا شروع می‌شود",
    featuredText: "ابزار و محصولات زیبایی‌ای را ببین که بهترین نسخه‌ی تو را به نمایش می‌گذارند.",
    featuredCta: "مشاهده همه محصولات",
    searchPlaceholder: "جستجوی محصول، برند، دسته‌بندی…",
    searchTitle: "جستجو در LUXORA",
    searchHint: "برای جستجو در فروشگاه Enter بزن",
    noResults: "چیزی پیدا نشد. کلمه‌ی دیگری امتحان کن.",
    popular: "جستجوهای پرطرفدار",
  },
};
