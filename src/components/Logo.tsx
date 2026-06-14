import { site } from "@/config/site";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        aria-hidden
        className="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient shadow-brand"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <path
            d="M12 3c-2.4 3.8-4.6 6.3-4.6 9.4a4.6 4.6 0 0 0 9.2 0C16.6 9.3 14.4 6.8 12 3Z"
            fill="#fff"
            fillOpacity="0.95"
          />
          <g transform="translate(12 12.4)" stroke="#0c4a6e" fill="none" strokeWidth="0.53">
            <ellipse rx="4.03" ry="1.73" transform="rotate(35)" />
            <ellipse rx="4.03" ry="1.73" transform="rotate(-35)" />
          </g>
          <circle cx="12" cy="12.4" r="1.25" fill="#0c4a6e" />
          <circle cx="15.07" cy="10.39" r="0.58" fill="#0c4a6e" />
          <circle cx="8.93" cy="14.41" r="0.58" fill="#0c4a6e" />
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
