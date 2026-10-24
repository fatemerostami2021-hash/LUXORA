"use client";
import { useParams } from "next/navigation";
import { useStore } from "./StoreProvider";
import { IMG } from "@/data/images";

export default function ShopProducts() {
  const { locale } = useParams<{ locale: "en" | "fa" | "ar" }>();
  const { products, addToCart } = useStore();
  const fa = locale === "fa", ar = locale === "ar";
  const stockLabel = fa ? "موجودی" : ar ? "المتوفر" : "In stock";
  const addLabel = fa ? "افزودن به سبد" : ar ? "أضيفي إلى السلة" : "Add to cart";
  return (
    <ul className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p, i) => (
        <li key={p.id} data-jump={(i % 3) * 0.1} data-tilt className="card product-card shop-card flex h-full flex-col overflow-hidden p-4">
          <div className="image-frame"><img src={IMG[p.image].src} alt={p.name[locale]} className="h-full w-full object-cover" /></div>
          <h3 className="shop-card__title mt-4">{p.name[locale]}</h3>
          <p className="shop-card__desc mt-1.5">{p.description[locale]}</p>
          <div className="mt-auto pt-4">
            <p className="shop-card__price" dir="ltr">${p.price.toLocaleString()} <span>USD</span></p>
            <p className="shop-card__stock mt-1">{stockLabel}: {fa ? p.stock.toLocaleString("fa-IR") : p.stock}</p>
            <button onClick={() => addToCart(p.id)} className="btn-primary mt-4 w-full justify-center">{addLabel}</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
