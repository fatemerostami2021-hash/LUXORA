"use client";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { CHAT_TEXT, QA_DATA, QUICK, findAnswer } from "@/data/chat";
import { SITE } from "@/data/site";
import { ChatIcon, CloseIcon, HeadsetIcon, InstagramIcon, LinkedinIcon, SendIcon, TelegramIcon, WhatsAppIcon } from "./Icons";

const FAB_MSGS: Record<string, string[]> = {
  en: ["Need help choosing?", "Free beauty consultation", "Chat with us on WhatsApp", "See the newest products"],
  fa: ["برای انتخاب محصول راهنمایی می‌خواهی؟", "مشاوره زیبایی آنلاین", "در واتساپ با ما صحبت کن", "تازه‌ترین محصولات را ببین"],
  ar: ["هل تحتاج مساعدة في الاختيار؟", "استشارة تجميل مجانية", "تحدث معنا عبر واتساب", "شاهد أحدث المنتجات"],
};
const FAB_ICONS = [HeadsetIcon, WhatsAppIcon, TelegramIcon, InstagramIcon, LinkedinIcon];

type Msg = { id: number; from: "bot" | "me"; text: string; cta?: boolean };

export default function ChatWidget({ locale }: { locale: Locale }) {
  const c = CHAT_TEXT[locale];
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([{ id: 0, from: "bot", text: c.welcome }]);
  const idRef = useRef(1);
  const endRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);

  // Closed state: icons rotate one by one INSIDE the floating circle, plus a short rotating hint.
  const [fabIdx, setFabIdx] = useState(0);
  const [hint, setHint] = useState(0);
  const [hintOn, setHintOn] = useState(false);
  useEffect(() => {
    if (open) return;
    const t = window.setInterval(() => setFabIdx((v) => (v + 1) % FAB_ICONS.length), 1800);
    return () => window.clearInterval(t);
  }, [open]);
  useEffect(() => {
    if (open) { setHintOn(false); return; }
    const list = FAB_MSGS[locale] ?? FAB_MSGS.en;
    let hide: number | undefined;
    const show = () => { setHintOn(true); hide = window.setTimeout(() => setHintOn(false), 3500); };
    const first = window.setTimeout(show, 3000);
    const t = window.setInterval(() => { setHint((v) => (v + 1) % list.length); show(); }, 7000);
    return () => { window.clearTimeout(first); window.clearTimeout(hide); window.clearInterval(t); };
  }, [open, locale]);

  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => { endRef.current?.scrollIntoView({ block: "end" }); }, [msgs, typing, open]);

  const ask = (q: string, known?: number) => {
    const clean = q.trim();
    if (!clean || typing) return;
    setMsgs((m) => [...m, { id: idRef.current++, from: "me", text: clean }]);
    setText("");
    setTyping(true);
    const hit = known !== undefined ? QA_DATA[locale][known] : findAnswer(locale, clean);
    timer.current = window.setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { id: idRef.current++, from: "bot", text: hit ? hit.a : c.fallback, cta: !hit }]);
    }, 550 + Math.random() * 450);
  };

  const socials = [
    { href: SITE.social.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: SITE.social.telegram, label: "Telegram", Icon: TelegramIcon },
    { href: SITE.social.whatsapp, label: "WhatsApp", Icon: WhatsAppIcon },
    { href: SITE.social.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
  ];

  return (
    <div className="chat-widget fixed bottom-4 end-4 z-30 flex flex-col items-end gap-3 sm:bottom-6 sm:end-6">
      {open && (
        <section role="dialog" aria-label={c.title}
          className="card flex h-[min(34rem,calc(100vh-9rem))] w-[min(23rem,calc(100vw-2rem))] flex-col overflow-hidden !rounded-3xl">
          <header className="flex items-center gap-3 px-4 py-3" style={{ background: "var(--btn-bg)", color: "var(--btn-fg)" }}>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white/25"><ChatIcon width={20} height={20} /></span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-extrabold">{c.title}</p>
              <p className="flex items-center gap-1.5 text-xs opacity-90"><span className="h-2 w-2 rounded-full bg-emerald-400" />{c.online}</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label={c.close} className="grid h-8 w-8 place-items-center rounded-full bg-white/20"><CloseIcon width={16} height={16} /></button>
          </header>

          <div className="flex items-center gap-2 border-b border-line px-4 py-3" aria-label={c.social}>
            <span className="me-1 text-xs font-bold text-muted">{c.social}</span>
            {socials.map(({ href, label, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}
                className="icon-btn !h-9 !w-9" style={{ borderColor: "var(--line)", color: "var(--fg)" }}>
                <Icon width={17} height={17} />
              </a>
            ))}
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
            {msgs.map((m) => (
              <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${m.from === "me" ? "chat-bubble-me rounded-ee-sm" : "chat-bubble-bot rounded-es-sm"}`}>
                  {m.text}
                  {m.cta && (
                    <span className="mt-2 flex flex-wrap gap-2">
                      <a href={SITE.social.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-primary !h-8 !px-3 text-xs">{c.wa}</a>
                      <a href={SITE.phoneHref} className="btn-ghost !h-8 !px-3 text-xs">{c.call}</a>
                    </span>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start" aria-label={c.typing}>
                <div className="chat-bubble-bot flex gap-1 rounded-2xl rounded-es-sm px-4 py-3">
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-[var(--muted)]" /><span className="typing-dot h-1.5 w-1.5 rounded-full bg-[var(--muted)]" /><span className="typing-dot h-1.5 w-1.5 rounded-full bg-[var(--muted)]" />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-line px-3 pt-2">
            <p className="px-1 text-[11px] font-bold text-muted">{c.suggestions}</p>
            <div className="mt-1 flex gap-2 overflow-x-auto pb-2">
              {QUICK[locale].map((i) => (
                <button key={i} type="button" onClick={() => ask(QA_DATA[locale][i].q, i)}
                  className="shrink-0 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-fg hover:border-accent hover:text-accent">{QA_DATA[locale][i].q}</button>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); ask(text); }} className="flex items-center gap-2 pb-3">
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder={c.placeholder} aria-label={c.placeholder}
                className="h-11 w-full rounded-full border border-line bg-surface px-4 text-sm text-fg outline-none focus:border-accent" />
              <button type="submit" aria-label={c.send} disabled={typing} className="grid h-11 w-11 shrink-0 place-items-center rounded-full disabled:opacity-50" style={{ background: "var(--btn-bg)", color: "var(--btn-fg)" }}>
                <SendIcon width={18} height={18} className="rtl:-scale-x-100" />
              </button>
            </form>
          </div>
        </section>
      )}

      {!open && (
        <div className={`chat-hint ${hintOn ? "is-on" : ""}`} aria-hidden="true">{(FAB_MSGS[locale] ?? FAB_MSGS.en)[hint]}</div>
      )}
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? c.close : c.open}
        className="chat-fab relative grid h-14 w-14 place-items-center rounded-full">
        {open ? <CloseIcon width={24} height={24} /> : (() => { const I = FAB_ICONS[fabIdx]; return <span key={fabIdx} className="fab-icon"><I width={26} height={26} /></span>; })()}
        <span className="absolute end-0 top-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400" />
      </button>
    </div>
  );
}
