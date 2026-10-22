"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle({ label }: { label: string }) {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.dataset.theme === "dark"), []);
  const toggle = () => {
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch {}
    setDark(!dark);
  };
  return (
    <button onClick={toggle} aria-label={label} aria-pressed={dark}
      className="h-10 w-10 rounded-full border border-line text-sm hover:border-accent transition-colors">
      <span aria-hidden>{dark ? "☀" : "☾"}</span>
    </button>
  );
}
