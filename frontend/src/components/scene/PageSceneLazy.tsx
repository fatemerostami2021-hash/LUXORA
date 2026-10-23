"use client";
import dynamic from "next/dynamic";
import type { Variant } from "./PageScene";

// Three.js for the inner pages is downloaded only in the browser, after the page text is already shown.
const PageScene = dynamic(() => import("./PageScene"), { ssr: false });
export default function PageSceneLazy({ variant, locale }: { variant: Variant; locale: string }) {
  return <PageScene variant={variant} locale={locale} />;
}
