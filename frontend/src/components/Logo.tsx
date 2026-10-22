// Brand mark: a woman with long flowing hair. The eye winks and the sparkles twinkle (CSS only, see globals.css).
export default function Logo({ size = 44 }: { size?: number }) {
  return (
    <svg className="logo-mark" width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="LUXORA">
      <defs>
        <linearGradient id="lxHair" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--logo-a)" />
          <stop offset="1" stopColor="var(--logo-b)" />
        </linearGradient>
        <linearGradient id="lxSkin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--logo-skin-a)" />
          <stop offset="1" stopColor="var(--logo-skin-b)" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="var(--logo-bg)" stroke="url(#lxHair)" strokeWidth="1.5" />
      {/* long hair, behind the face */}
      <path d="M32 7C18 7 13 19 14 31c.8 10-3 15-6 20 7 1 13-1 16-6 .8 5 3 9 8 13 5-4 7-8 8-13 3 5 9 7 16 6-3-5-6-10-6-20C51 19 46 7 32 7Z" fill="url(#lxHair)" />
      {/* face */}
      <ellipse cx="32" cy="29" rx="10.500" ry="13" fill="url(#lxSkin)" />
      {/* fringe */}
      <path d="M21 27c3-9 12-12 22-3-4-1-9 0-13 4-2 1-6 0-9-1Z" fill="url(#lxHair)" />
      {/* eyes: left winks */}
      <g className="logo-eye" style={{ transformOrigin: "27.5px 29.5px" }}><ellipse cx="27.500" cy="29.500" rx="1.600" ry="1.100" fill="var(--logo-ink)" /></g>
      <ellipse cx="36.500" cy="29.500" rx="1.600" ry="1.100" fill="var(--logo-ink)" />
      {/* lips + blush */}
      <path d="M29.500 36.500c1.500 1.600 3.500 1.600 5 0-1.500.5-3.500.5-5 0Z" fill="var(--logo-lip)" />
      <circle cx="24.500" cy="33.500" r="2" fill="var(--logo-lip)" opacity=".28" />
      <circle cx="39.500" cy="33.500" r="2" fill="var(--logo-lip)" opacity=".28" />
      {/* sparkles */}
      <path className="logo-spark s1" d="M52 10v7M48.500 13.500h7" stroke="var(--logo-spark)" strokeWidth="1.600" strokeLinecap="round" />
      <path className="logo-spark s2" d="M10 14v5M7.500 16.500h5" stroke="var(--logo-spark)" strokeWidth="1.400" strokeLinecap="round" />
      <path className="logo-spark s3" d="M55 42v4M53 44h4" stroke="var(--logo-spark)" strokeWidth="1.200" strokeLinecap="round" />
    </svg>
  );
}
