// DEMO DATA ONLY. No real prices, specs, or availability. Replaced by the database later.
import type { ImgKey } from "./images";

export const demoProducts: { slug: string; category: number; image: ImgKey; price: number; externalUrl: string }[] = [
  { slug: "demo-multi-styler-gold", category: 0, image: "categories_multi_styler_gold", price: 399, externalUrl: "https://www.dyson.com/hair-care/hair-stylers" },
  { slug: "demo-hair-dryer", category: 1, image: "categories_hair_dryer_box", price: 249, externalUrl: "https://www.dyson.com/hair-care/hair-dryers" },
  { slug: "demo-straightener", category: 2, image: "categories_straightener", price: 229, externalUrl: "https://www.ghdhair.com/hair-straighteners-c" },
  { slug: "demo-curling-tool", category: 3, image: "categories_curling_tools", price: 199, externalUrl: "https://www.ghdhair.com/curling-wands-tongs-c" },
  { slug: "demo-brush-set", category: 4, image: "categories_round_brush", price: 59, externalUrl: "https://www.sephora.com/shop/hair-brushes-combs" },
  { slug: "demo-multi-styler-white", category: 0, image: "categories_multi_styler_white", price: 399, externalUrl: "https://www.dyson.com/hair-care/hair-stylers" },
]; 
export const categoryImages: ImgKey[] = [
  "categories_multi_styler_white", "categories_hair_dryer_box", "categories_straightener",
  "categories_curling_tools", "categories_round_brush",
];
export const brandSlugs = ["dyson", "shark", "ghd", "babyliss"];
