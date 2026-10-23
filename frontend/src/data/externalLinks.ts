const LINKS: Record<string, string> = {
  "multi-stylers": "https://www.dyson.com/hair-care/hair-stylers",
  "hair dryers": "https://www.dyson.com/hair-care/hair-dryers",
  "straighteners": "https://www.ghdhair.com/hair-straighteners-c",
  "curling tools": "https://www.ghdhair.com/curling-wands-tongs-c",
  "brushes & combs": "https://www.sephora.com/shop/hair-brushes-combs",
  "heat protectants": "https://www.sephora.com/shop/heat-protectant",
  "lipstick & lip gloss": "https://www.sephora.com/shop/lipstick",
  "foundation & concealer": "https://www.sephora.com/shop/foundation-makeup",
  "mascara & eyeliner": "https://www.sephora.com/shop/mascara",
  "eyeshadow palettes": "https://www.sephora.com/shop/eyeshadow",
  "blush & highlighter": "https://www.sephora.com/shop/blush",
  "makeup brushes": "https://www.sephora.com/shop/makeup-brushes",
  "face creams": "https://www.sephora.com/shop/moisturizers",
  "serums": "https://theordinary.com/en-us/category/skincare/serums",
  "cleansers & toners": "https://www.sephora.com/shop/face-wash-facial-cleanser",
  "sunscreen": "https://www.sephora.com/shop/sunscreen",
  "masks": "https://www.sephora.com/shop/facial-masks",
  "eye care": "https://www.sephora.com/shop/eye-cream-treatment",
  "women's perfume": "https://www.sephora.com/shop/womens-fragrance",
  "body mist": "https://www.sephora.com/shop/body-mist",
  "body lotion": "https://www.sephora.com/shop/body-lotion",
  "hand & nail care": "https://www.sephora.com/shop/hand-cream",
  "nail polish": "https://www.sephora.com/shop/nail-polish",
  "bath & shower": "https://www.sephora.com/shop/bath-shower",
  "shampoo & conditioner": "https://www.sephora.com/shop/shampoo-conditioner",
  "hair masks": "https://www.sephora.com/shop/hair-masks",
  "hair oils & serums": "https://www.sephora.com/shop/hair-oil",
  "styling products": "https://www.sephora.com/shop/hair-styling-products",
  "hair accessories": "https://www.sephora.com/shop/hair-accessories",
  "scalp care": "https://www.sephora.com/shop/scalp-care",
  "dyson": "https://www.dyson.com/hair-care",
  "shark": "https://www.sharkclean.com/products/beauty",
  "ghd": "https://www.ghdhair.com/",
  "babyliss": "https://babyliss.com/",
};

export function getExternalHref(label: string): string | undefined {
  const key = label.toLowerCase().trim();
  if (LINKS[key]) return LINKS[key];
  if (/رژ لب|برق لب|أحمر الشفاه|شفاه/.test(key)) return LINKS["lipstick & lip gloss"];
  if (/سشوار|مجفف|مجففات/.test(key)) return LINKS["hair dryers"];
  if (/اتو مو|مملسات|straight/.test(key)) return LINKS.straighteners;
  if (/فر|تجعيد|curl/.test(key)) return LINKS["curling tools"];
  if (/برس|فرش|مشط|أمشاط/.test(key)) return LINKS["brushes & combs"];
  if (/شامپو|بلسم|شعر|hair/.test(key)) return LINKS["shampoo & conditioner"];
  if (/سرم|سيروم|serum/.test(key)) return LINKS.serums;
  if (/ضدآفتاب|واقي شمسي|sunscreen/.test(key)) return LINKS.sunscreen;
  if (/عطر|عطور|perfume/.test(key)) return LINKS["women's perfume"];
  if (/لاک|طلاء الأظافر|nail/.test(key)) return LINKS["nail polish"];
  return undefined;
}
