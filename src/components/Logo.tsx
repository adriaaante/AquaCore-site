import { site } from "@/config/site";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        aria-hidden
        className="grid h-9 w-9 place-items-center overflow-hidden rounded-xl shadow-brand"
      >
        {/* Идентично public/icon.svg — единый знак во всех местах */}
        <svg viewBox="0 0 512 512" className="h-9 w-9">
          <defs>
            <linearGradient id="aqlogo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
          </defs>
          <rect width="512" height="512" fill="url(#aqlogo)" />
          <g transform="translate(256 256) scale(1.3) translate(-256 -242)">
            <path
              d="M256 96 c -50 80 -96 132 -96 196 a 96 96 0 0 0 192 0 c 0 -64 -46 -116 -96 -196 z"
              fill="#fff"
              fillOpacity="0.95"
            />
            <g transform="translate(256 292)" stroke="#0c4a6e" fill="none" strokeWidth="11">
              <ellipse rx="84" ry="36" transform="rotate(35)" />
              <ellipse rx="84" ry="36" transform="rotate(-35)" />
            </g>
            <circle cx="256" cy="292" r="26" fill="#0c4a6e" />
            <circle cx="320" cy="250" r="12" fill="#0c4a6e" />
            <circle cx="192" cy="334" r="12" fill="#0c4a6e" />
          </g>
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-lg font-extrabold tracking-tight text-ink">
          Aqua<span className="text-brand-700">Core</span>
        </span>
        <span className="text-[10px] font-medium uppercase tracking-wider text-ink-muted">
          {site.tagline}
        </span>
      </span>
    </span>
  );
}
