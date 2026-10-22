import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-28 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-4xl md:text-6xl">Page not found · صفحه پیدا نشد</h1>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/en" className="btn-primary">LUXORA · English</Link>
        <Link href="/fa" className="btn-ghost">LUXORA · فارسی</Link>
      </div>
    </div>
  );
}
