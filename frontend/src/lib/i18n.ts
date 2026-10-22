import { en } from "@/dictionaries/en";
import { fa } from "@/dictionaries/fa";

export const locales = ["en", "fa"] as const;
export type Locale = (typeof locales)[number];
export type Dict = typeof en;

export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v);
export const getDir = (l: Locale) => (l === "fa" ? "rtl" : "ltr");
export const getDict = (l: Locale): Dict => (l === "fa" ? fa : en);
