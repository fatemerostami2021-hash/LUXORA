import type { ImgKey } from "./images";

export type Product = {
  id: string;
  image: ImgKey;
  category: number;
  price: number;
  stock: number;
  name: { en: string; fa: string; ar: string };
  description: { en: string; fa: string; ar: string };
};

export const catalog: Product[] = [
  { id: "multi-styler-gold", image: "categories_multi_styler_gold", category: 0, price: 399, stock: 12, name: { en: "LUXORA Gold Multi-Styler", fa: "مولتی‌استایلر طلایی لوکسورا", ar: "جهاز LUXORA متعدد الاستخدامات الذهبي" }, description: { en: "One refined tool for curls, volume and smooth finishes.", fa: "یک ابزار برای فر، حجم و حالت صاف.", ar: "أداة واحدة للتجعيد ومنح الحجم والتنعيم." } },
  { id: "hair-dryer", image: "categories_hair_dryer_box", category: 1, price: 249, stock: 18, name: { en: "LUXORA Air Dryer", fa: "سشوار ایر لوکسورا", ar: "مجفف LUXORA الهوائي" }, description: { en: "Fast, controlled airflow for polished styling.", fa: "جریان هوای سریع و کنترل‌شده برای حالت‌دهی مرتب.", ar: "تدفق هواء سريع ومتحكم لتصفيف أنيق." } },
  { id: "straightener", image: "categories_straightener", category: 2, price: 229, stock: 9, name: { en: "LUXORA Precision Straightener", fa: "اتو موی دقیق لوکسورا", ar: "مملس LUXORA الدقيق" }, description: { en: "A sleek finish with confident control.", fa: "حالت صاف و براق با کنترل مطمئن.", ar: "لمسة ناعمة ولامعة بتحكم دقيق." } },
  { id: "curling-tool", image: "categories_curling_tools", category: 3, price: 199, stock: 14, name: { en: "LUXORA Curling Tool", fa: "ابزار فر لوکسورا", ar: "أداة تجعيد LUXORA" }, description: { en: "Defined waves with a soft, luminous finish.", fa: "موج‌های مشخص با پایانی نرم و درخشان.", ar: "تموجات محددة بلمسة ناعمة ومشرقة." } },
  { id: "brush-set", image: "categories_round_brush", category: 4, price: 59, stock: 30, name: { en: "LUXORA Brush Set", fa: "ست برس لوکسورا", ar: "مجموعة فرش LUXORA" }, description: { en: "Everyday tools for volume and smoothness.", fa: "ابزارهای روزمره برای حجم و نرمی.", ar: "أدوات يومية لمنح الحجم والنعومة." } },
  { id: "multi-styler-ivory", image: "categories_multi_styler_white", category: 0, price: 399, stock: 7, name: { en: "LUXORA Ivory Multi-Styler", fa: "مولتی‌استایلر آیوری لوکسورا", ar: "جهاز LUXORA متعدد الاستخدامات العاجي" }, description: { en: "The complete styling ritual in ivory.", fa: "آیین کامل حالت‌دهی در رنگ آیوری.", ar: "طقوس التصفيف الكاملة باللون العاجي." } },
];
