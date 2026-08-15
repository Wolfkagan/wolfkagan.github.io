import type { Locale, PageKey } from "../content";

export const locales: Locale[] = ["tr", "en", "de"];
export const pages: PageKey[] = ["home", "technology", "principles", "trust", "about"];

const slugToPage: Record<string, PageKey> = {
  "": "home",
  technology: "technology",
  principles: "principles",
  trust: "trust",
  about: "about",
};

const pageToSlug: Record<PageKey, string> = {
  home: "",
  technology: "technology",
  principles: "principles",
  trust: "trust",
  about: "about",
};

export type Route = {
  locale: Locale;
  page: PageKey;
  valid: boolean;
};

export function parseRoute(pathname: string): Route {
  const cleanPath = pathname.split(/[?#]/, 1)[0].replace(/^\/+|\/+$/g, "");
  const segments = cleanPath ? cleanPath.split("/") : [];
  const locale = locales.includes(segments[0] as Locale) ? (segments[0] as Locale) : "tr";
  const page = slugToPage[segments[1] ?? ""] ?? "home";
  const valid = segments.length >= 1 && segments.length <= 2 && locales.includes(segments[0] as Locale) && (segments[1] ?? "") in slugToPage;
  return { locale, page, valid };
}

export function routePath(locale: Locale, page: PageKey): string {
  const slug = pageToSlug[page];
  return slug ? `/${locale}/${slug}` : `/${locale}`;
}

export const staticRoutes = locales.flatMap((locale) => pages.map((page) => routePath(locale, page)));
