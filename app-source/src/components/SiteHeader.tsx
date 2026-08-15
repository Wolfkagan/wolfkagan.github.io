import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import type { Dictionary, Locale, PageKey } from "../content";
import { locales, pages, routePath } from "../lib/routing";
import { Brand } from "./Brand";

const languageLabels: Record<Locale, string> = { tr: "TR", en: "EN", de: "DE" };

export function SiteHeader({ dictionary, locale, page }: { dictionary: Dictionary; locale: Locale; page: PageKey }) {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = mobileNavRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
    focusable?.[0]?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const navItems = pages.map((item) => ({ key: item, label: dictionary.nav[item] }));

  return (
    <header className="site-header-wrap">
      <div className="header-inner container">
        <Brand locale={locale} label={`${dictionary.brand.name} ${dictionary.nav.home}`} />
        <nav className="primary-nav" aria-label={dictionary.nav.home}>
          {navItems.map((item) => (
            <a key={item.key} href={routePath(locale, item.key)} aria-current={page === item.key ? "page" : undefined}>
              {item.label}
            </a>
          ))}
        </nav>
        <nav className="language-nav" aria-label={dictionary.ui.selectLanguage}>
          {locales.map((item) => (
            <a key={item} className={locale === item ? "active" : undefined} href={routePath(item, page)} lang={item} hrefLang={item} aria-current={locale === item ? "true" : undefined}>
              {languageLabels[item]}
            </a>
          ))}
        </nav>
        <button ref={menuButtonRef} className="menu-button" type="button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? dictionary.ui.closeMenu : dictionary.ui.openMenu} onClick={() => setOpen((value) => !value)}>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      {open && (
        <div className="mobile-panel" id="mobile-navigation" ref={mobileNavRef}>
          <nav className="mobile-primary" aria-label={dictionary.nav.home}>
            {navItems.map((item, index) => (
              <a key={item.key} href={routePath(locale, item.key)} aria-current={page === item.key ? "page" : undefined} onClick={() => setOpen(false)}>
                <span>0{index + 1}</span>{item.label}
              </a>
            ))}
          </nav>
          <nav className="mobile-languages" aria-label={dictionary.ui.selectLanguage}>
            {locales.map((item) => (
              <a key={item} href={routePath(item, page)} lang={item} hrefLang={item} aria-current={locale === item ? "true" : undefined} onClick={() => setOpen(false)}>
                {languageLabels[item]}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
