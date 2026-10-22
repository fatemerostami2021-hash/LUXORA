// DEMO DATA ONLY. No real prices, specs, or availability. Replaced by the database later.
import type { ImgKey } from "./images";

export const demoProducts: { slug: string; category: number; image: ImgKey }[] = [
  { slug: "demo-multi-styler-gold", category: 0, image: "categories_multi_styler_gold" },
  { slug: "demo-hair-dryer", category: 1, image: "categories_hair_dryer_box" },
  { slug: "demo-straightener", category: 2, image: "categories_straightener" },
  { slug: "demo-curling-tool", category: 3, image: "categories_curling_tools" },
  { slug: "demo-brush-set", category: 4, image: "categories_round_brush" },
  { slug: "demo-multi-styler-white", category: 0, image: "categories_multi_styler_white" },
];
export const categoryImages: ImgKey[] = [
  "categories_multi_styler_white", "categories_hair_dryer_box", "categories_straightener",
  "categories_curling_tools", "categories_round_brush",
];
export const brandSlugs = ["dyson", "shark", "ghd", "babyliss"];
