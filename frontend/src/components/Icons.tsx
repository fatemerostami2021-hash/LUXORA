import type { SVGProps } from "react";
type P = SVGProps<SVGSVGElement>;
const base = (p: P) => ({ width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true, ...p });

export const SearchIcon = (p: P) => <svg {...base(p)}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
export const CloseIcon = (p: P) => <svg {...base(p)}><path d="M6 6l12 12M18 6 6 18" /></svg>;
export const MenuIcon = (p: P) => <svg {...base(p)}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
export const ChevronDown = (p: P) => <svg {...base(p)}><path d="m6 9 6 6 6-6" /></svg>;
export const SendIcon = (p: P) => <svg {...base(p)}><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4 20-7Z" /></svg>;
export const ChatIcon = (p: P) => <svg {...base(p)}><path d="M21 12a8 8 0 0 1-11.7 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" /></svg>;
export const HeadsetIcon = (p: P) => <svg {...base(p)}><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><path d="M4 14h3v5H5a1 1 0 0 1-1-1zM20 14h-3v5h2a1 1 0 0 0 1-1z" /><path d="M17 19c0 1.7-1.8 3-4 3h-1" /></svg>;
export const PhoneIcon = (p: P) => <svg {...base(p)}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>;
export const InstagramIcon = (p: P) => <svg {...base(p)}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" /></svg>;
export const TelegramIcon = (p: P) => <svg {...base(p)}><path d="M21.5 4.5 2.8 11.7c-.8.3-.8 1.4 0 1.7l4.6 1.5 1.8 5.5c.2.7 1.1.9 1.6.3l2.6-2.7 4.7 3.5c.6.4 1.4.1 1.6-.6L23 5.8c.2-.9-.7-1.6-1.5-1.3Z" /><path d="m7.4 14.9 10.3-6.4" /></svg>;
export const WhatsAppIcon = (p: P) => <svg {...base(p)}><path d="M3 21l1.6-4.8A9 9 0 1 1 8 19.6L3 21Z" /><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1.2-1.7-2.2-1.1-.9.8a4.6 4.6 0 0 1-2.2-2.2l.8-.9L10.9 7.7 9 8.5Z" /></svg>;
export const LinkedinIcon = (p: P) => <svg {...base(p)}><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 11v6M8 7.5v.01M12 17v-6m0 3c0-2 1.2-3 2.700-3S17 12 17 14v3" /></svg>;
export const SunIcon = (p: P) => <svg {...base(p)}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>;
export const MoonIcon = (p: P) => <svg {...base(p)}><path d="M21 13.5A9 9 0 1 1 10.5 3a7 7 0 0 0 10.5 10.500Z" /></svg>;
export const ArrowIcon = (p: P) => <svg {...base(p)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;

// Product-category icons used in the brand rail
export const LipstickIcon = (p: P) => <svg {...base(p)}><path d="M9 21v-7h6v7zM10 14V9l2-5 2 5v5" /></svg>;
export const CreamIcon = (p: P) => <svg {...base(p)}><rect x="4" y="11" width="16" height="9" rx="2" /><path d="M6 11V8h12v3M9 8V6h6v2" /></svg>;
export const PerfumeIcon = (p: P) => <svg {...base(p)}><rect x="6" y="10" width="12" height="11" rx="3" /><path d="M10 10V7h4v3M9 4h6v3H9z" /></svg>;
export const MascaraIcon = (p: P) => <svg {...base(p)}><path d="M10 21V10h4v11zM12 10V3M10 5l2-1 2 1M10 7l2-1 2 1" /></svg>;
export const DryerIcon = (p: P) => <svg {...base(p)}><path d="M3 9a5 5 0 0 1 5-5h8a5 5 0 0 1 0 10H8a5 5 0 0 1-5-5Z" /><path d="m11 14-2 7h4l1-7" /></svg>;
export const PolishIcon = (p: P) => <svg {...base(p)}><rect x="7" y="11" width="10" height="10" rx="3" /><path d="M10 11V7l2-4 2 4v4" /></svg>;
export const BrushIcon = (p: P) => <svg {...base(p)}><path d="m4 20 9-9M13 11l5-7 2 2-7 5" /><circle cx="5" cy="19" r="1.500" /></svg>;
export const MirrorIcon = (p: P) => <svg {...base(p)}><circle cx="12" cy="9" r="6" /><path d="M12 15v6M9 21h6" /></svg>;
export const SparkleIcon = (p: P) => <svg {...base(p)}><path d="M12 3l1.8 5.2L19 10l-5.200 1.800L12 17l-1.800-5.200L5 10l5.200-1.800L12 3Z" /></svg>;
