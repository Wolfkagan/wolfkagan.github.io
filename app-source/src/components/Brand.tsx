import type { Locale } from "../content";
import { routePath } from "../lib/routing";

/** Replaceable visual brand mark pending a formally approved corporate identity asset. */
export function RootSystemMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 48 48" role="presentation">
        <circle cx="24" cy="24" r="17" />
        <path d="M14 17h20M17 26c3 5 11 5 14 0M24 31v9M24 35l-6 5M24 35l6 5" />
        <circle className="mark-dot" cx="24" cy="12" r="2" />
      </svg>
    </span>
  );
}

export function Brand({ locale, label }: { locale: Locale; label: string }) {
  return (
    <a className="brand" href={routePath(locale, "home")} aria-label={label}>
      <RootSystemMark />
      <span className="brand-name">ÖTÜKEN <b>AI</b></span>
    </a>
  );
}
