import type { Locale } from "../content";
import { routePath } from "../lib/routing";

type OtukenMarkProps = { className?: string };

export function OtukenMark({ className = "" }: OtukenMarkProps) {
  const classes = ["brand-symbol", className].filter(Boolean).join(" ");
  return (
    <svg
      className={classes}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      data-brand-mark="otuken-ai-sigil-v1"
    >
      <circle className="brand-symbol-boundary" cx="32" cy="35" r="22.5" />
      <path className="brand-symbol-network" d="M20 23h8l4 7 4-7h8M32 29v24M32 40 22 50M32 40l10 10" />
      <g className="brand-symbol-nodes">
        <circle cx="26" cy="6.5" r="2.25" />
        <circle cx="38" cy="6.5" r="2.25" />
      </g>
      <path className="brand-symbol-core" d="M32 30l4 4.5-4 4.5-4-4.5Z" />
    </svg>
  );
}

export function BrandEmblem({ className = "" }: { className?: string }) {
  const classes = ["brand-emblem", className].filter(Boolean).join(" ");
  return (
    <div className={classes} aria-hidden="true">
      <span className="brand-emblem-ring brand-emblem-ring-outer" />
      <span className="brand-emblem-ring brand-emblem-ring-inner" />
      <OtukenMark className="brand-emblem-symbol" />
    </div>
  );
}

export function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <OtukenMark />
    </span>
  );
}

export function Brand({ locale, label }: { locale: Locale; label: string }) {
  return (
    <a className="brand" href={routePath(locale, "home")} aria-label={label}>
      <BrandMark />
      <span className="brand-name">ÖTÜKEN <b>AI</b></span>
    </a>
  );
}
