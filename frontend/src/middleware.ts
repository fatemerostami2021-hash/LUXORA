import { NextRequest, NextResponse } from "next/server";

const locales = ["en", "fa"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hit = locales.find((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hit) {
    // remember the visitor's language choice
    const res = NextResponse.next();
    if (req.cookies.get("NEXT_LOCALE")?.value !== hit) res.cookies.set("NEXT_LOCALE", hit, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    return res;
  }
  const saved = req.cookies.get("NEXT_LOCALE")?.value;
  const accept = (req.headers.get("accept-language") ?? "").toLowerCase();
  const locale = saved && locales.includes(saved) ? saved : accept.startsWith("fa") ? "fa" : "en";
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/((?!_next|api|.*\\..*).*)"] };
