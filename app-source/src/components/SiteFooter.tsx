import type { Dictionary, Locale, PageKey } from "../content";
import { locales, pages, routePath } from "../lib/routing";
import { Brand } from "./Brand";

const languageNames: Record<Locale, string> = { tr: "Türkçe", en: "English", de: "Deutsch" };

export function SiteFooter({ dictionary, locale }: { dictionary: Dictionary; locale: Locale }) {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand-column">
          <Brand locale={locale} label={`${dictionary.brand.name} ${dictionary.nav.home}`} />
          <p className="footer-slogan">{dictionary.brand.slogan}</p>
          <p className="footer-value">{dictionary.brand.valueLine}</p>
        </div>
        <div className="footer-column">
          <strong>{dictionary.footer.navigation}</strong>
          {pages.map((page: PageKey) => <a key={page} href={routePath(locale, page)}>{dictionary.nav[page]}</a>)}
        </div>
        <div className="footer-column">
          <strong>{dictionary.footer.languages}</strong>
          {locales.map((item) => <a key={item} href={routePath(item, "home")} hrefLang={item} lang={item}>{languageNames[item]}</a>)}
        </div>
        <div className="footer-privacy">
          <span className="status-chip"><i />{dictionary.footer.status}</span>
          <p>{dictionary.footer.privacy}</p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} ÖTÜKEN AI</span>
        <span>{dictionary.footer.rights}</span>
      </div>
    </footer>
  );
}
