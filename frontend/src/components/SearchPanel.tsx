"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { MEGA } from "@/data/mega";
import { CloseIcon, SearchIcon } from "./Icons";

export default function SearchPanel({ locale, open, onClose }: { locale: Locale; open: boolean; onClose: () => void }) {
  const m = MEGA[locale];
  const router = useRouter();
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const all = useMemo(() => m.groups.flatMap((g) => g.items.map((i) => ({ label: i, group: g.title }))), [m]);
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return all.filter((x) => x.label.toLowerCase().includes(s)).slice(0, 8);
  }, [q, all]);

  useEffect(() => {
    if (!open) return;
    setQ("");
    const t = window.setTimeout(() => input.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.clearTimeout(t); window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);

  if (!open) return null;
  const go = (term: string) => { onClose(); router.push(`/${locale}/shop?q=${encodeURIComponent(term)}`); };
  const popular = m.groups.slice(0, 3).map((g) => g.items[0]).concat(m.groups[3].items[0], m.groups[1].items[0]);

  return (
    <div role="dialog" aria-modal="true" aria-label={m.searchTitle} className="fixed inset-0 z-[70] flex items-start justify-center bg-black/55 px-4 pt-[12vh] backdrop-blur-sm" onClick={onClose}>
      <div className="card w-full max-w-2xl overflow-hidden p-5" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={(e) => { e.preventDefault(); go(q.trim()); }} className="flex items-center gap-3 border-b border-line pb-4">
          <SearchIcon className="text-accent" />
          <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder={m.searchPlaceholder} aria-label={m.searchTitle}
            className="w-full bg-transparent text-lg text-fg outline-none placeholder:text-muted" />
          <button type="button" onClick={onClose} className="icon-btn shrink-0" aria-label="Close"><CloseIcon width={18} height={18} /></button>
        </form>
        {q.trim() ? (
          results.length ? (
            <ul className="mt-3">
              {results.map((r) => (
                <li key={r.label}>
                  <button type="button" onClick={() => go(r.label)} className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-start hover:bg-[var(--accent-soft)]">
                    <span className="font-semibold">{r.label}</span><span className="text-xs text-muted">{r.group}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : <p className="mt-5 text-sm text-muted">{m.noResults}</p>
        ) : (
          <div className="mt-4">
            <p className="label-caps text-muted">{m.popular}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {popular.map((p) => <button key={p} type="button" className="chip" style={{ color: "var(--fg)" }} onClick={() => go(p)}>{p}</button>)}
            </div>
            <p className="mt-5 text-xs text-muted">{m.searchHint}</p>
          </div>
        )}
      </div>
    </div>
  );
}
