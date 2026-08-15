import { useEffect } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { DecorativeNetwork } from "./components/DecorativeNetwork";
import { BrandEmblem } from "./components/Brand";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import {
  ApproachGrid,
  ContactSection,
  PrinciplesGrid,
  StatusSection,
  SystemLayers,
  TrustGrid,
} from "./components/Sections";
import { getDictionary, type Dictionary, type Locale, type PageKey } from "./content";
import { parseRoute, routePath } from "./lib/routing";
import { siteConfig } from "./lib/site-config";

type AppProps = { initialPath?: string };

function updateMeta(name: string, value: string, property = false) {
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(property ? "property" : "name", name);
    document.head.appendChild(element);
  }
  element.content = value;
}

function PageHero({ eyebrow, title, description, marker }: { eyebrow: string; title: string; description: string; marker: string }) {
  return (
    <section className="page-hero">
      <div className="container page-hero-grid">
        <div className="page-hero-copy">
          <span className="eyebrow"><i />{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <div className="page-hero-mark" aria-hidden="true">
          <span>{marker}</span>
          <i /><i /><i />
        </div>
      </div>
    </section>
  );
}

function HomePage({ dictionary, locale }: { dictionary: Dictionary; locale: Locale }) {
  const hero = dictionary.home.hero;
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow"><i />{hero.eyebrow}</span>
            <h1>{hero.title}</h1>
            <p className="hero-lead">{hero.description}</p>
            <p className="hero-support">{hero.support}</p>
            <div className="hero-actions">
              <a className="button button-primary" href={routePath(locale, "technology")}>{hero.primaryAction}<ArrowRight size={17} aria-hidden="true" /></a>
              <a className="button button-secondary" href={routePath(locale, "principles")}>{hero.secondaryAction}</a>
            </div>
            <div className="trust-line"><ShieldCheck size={17} aria-hidden="true" /><span>{hero.trustLine}</span></div>
          </div>
          <DecorativeNetwork dictionary={dictionary} />
        </div>
        <div className="container hero-rail" aria-hidden="true">
          <span>{dictionary.shared.approach.items[0].title}</span><i />
          <span>{dictionary.shared.approach.items[1].title}</span><i />
          <span>{dictionary.shared.approach.items[3].title}</span>
        </div>
      </section>
      <ApproachGrid dictionary={dictionary} />
      <SystemLayers dictionary={dictionary} />
      <PrinciplesGrid dictionary={dictionary} preview />
      <section className="section trust-feature-section">
        <div className="container trust-feature">
          <div className="trust-symbol" aria-hidden="true"><span /><i /><i /></div>
          <div>
            <span className="eyebrow"><i />{dictionary.home.trustFeature.eyebrow}</span>
            <h2>{dictionary.home.trustFeature.title}</h2>
            <p>{dictionary.home.trustFeature.description}</p>
            <a className="text-link" href={routePath(locale, "trust")}>{dictionary.home.trustFeature.action}<ArrowRight size={16} aria-hidden="true" /></a>
          </div>
        </div>
      </section>
      <StatusSection dictionary={dictionary} />
      <ContactSection dictionary={dictionary} />
    </>
  );
}

function TechnologyPage({ dictionary }: { dictionary: Dictionary }) {
  const page = dictionary.technology;
  return (
    <>
      <PageHero eyebrow={page.eyebrow} title={page.title} description={page.description} marker="01" />
      <ApproachGrid dictionary={dictionary} headingTitle={page.approachTitle} />
      <SystemLayers dictionary={dictionary} headingTitle={page.layersTitle} />
      <StatementPanel title={page.closingTitle} description={page.closingDescription} />
      <ContactSection dictionary={dictionary} />
    </>
  );
}

function PrinciplesPage({ dictionary }: { dictionary: Dictionary }) {
  const page = dictionary.principles;
  return (
    <>
      <PageHero eyebrow={page.eyebrow} title={page.title} description={page.description} marker="02" />
      <PrinciplesGrid dictionary={dictionary} />
      <StatementPanel title={page.closingTitle} description={page.closingDescription} />
      <ContactSection dictionary={dictionary} />
    </>
  );
}

function TrustPage({ dictionary }: { dictionary: Dictionary }) {
  const page = dictionary.trust;
  return (
    <>
      <PageHero eyebrow={page.eyebrow} title={page.title} description={page.description} marker="03" />
      <TrustGrid dictionary={dictionary} />
      <section className="section disclosure-section">
        <div className="container disclosure-panel">
          <div className="disclosure-lines" aria-hidden="true"><i /><i /><i /><i /></div>
          <div>
            <span className="eyebrow"><i />{page.disclosureEyebrow}</span>
            <h2>{page.disclosureTitle}</h2>
            <p>{page.disclosureDescription}</p>
          </div>
        </div>
      </section>
      <StatusSection dictionary={dictionary} />
      <ContactSection dictionary={dictionary} />
    </>
  );
}

function AboutPage({ dictionary }: { dictionary: Dictionary }) {
  const page = dictionary.about;
  return (
    <>
      <PageHero eyebrow={page.eyebrow} title={page.title} description={page.description} marker="04" />
      <section className="section about-purpose-section">
        <div className="container about-purpose-grid">
          <BrandEmblem className="about-principle" />
          <div>
            <span className="eyebrow"><i />{page.purposeEyebrow}</span>
            <h2>{page.purposeTitle}</h2>
            <p>{page.purposeDescription}</p>
          </div>
        </div>
      </section>
      <section className="section research-section">
        <div className="container research-grid">
          <span className="status-chip"><i />{dictionary.ui.statusLabel}</span>
          <div>
            <span className="eyebrow"><i />{page.researchEyebrow}</span>
            <h2>{page.researchTitle}</h2>
            <p>{page.researchDescription}</p>
          </div>
        </div>
      </section>
      <ContactSection dictionary={dictionary} />
    </>
  );
}

function StatementPanel({ title, description }: { title: string; description: string }) {
  return (
    <section className="section statement-section">
      <div className="container statement-panel">
        <span aria-hidden="true">—</span>
        <div><h2>{title}</h2><p>{description}</p></div>
      </div>
    </section>
  );
}

function NotFoundPage({ dictionary, locale }: { dictionary: Dictionary; locale: Locale }) {
  return (
    <section className="not-found">
      <div className="container">
        <span className="eyebrow"><i />{dictionary.notFound.eyebrow}</span>
        <h1>{dictionary.notFound.title}</h1>
        <p>{dictionary.notFound.description}</p>
        <a className="button button-primary" href={routePath(locale, "home")}>{dictionary.ui.backHome}<ArrowRight size={17} aria-hidden="true" /></a>
      </div>
    </section>
  );
}

function StructuredData({ dictionary }: { dictionary: Dictionary }) {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${siteConfig.siteUrl}/#organization`, name: "ÖTÜKEN AI", url: siteConfig.siteUrl },
      { "@type": "WebSite", "@id": `${siteConfig.siteUrl}/#website`, name: "ÖTÜKEN AI", url: siteConfig.siteUrl, description: dictionary.meta.pages.home.description, publisher: { "@id": `${siteConfig.siteUrl}/#organization` }, inLanguage: ["tr", "en", "de"] },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default function App({ initialPath }: AppProps) {
  const pathname = initialPath ?? (typeof window === "undefined" ? "/tr" : window.location.pathname);
  const route = parseRoute(pathname);
  const dictionary = getDictionary(route.locale);
  const metadata = dictionary.meta.pages[route.page];

  useEffect(() => {
    document.documentElement.lang = route.locale;
    document.title = route.valid ? metadata.title : dictionary.notFound.title;
    updateMeta("description", route.valid ? metadata.description : dictionary.notFound.description);
    updateMeta("og:title", route.valid ? metadata.title : dictionary.notFound.title, true);
    updateMeta("og:description", route.valid ? metadata.description : dictionary.notFound.description, true);
    updateMeta("og:locale", dictionary.meta.ogLocale, true);
    updateMeta("twitter:title", route.valid ? metadata.title : dictionary.notFound.title);
    updateMeta("twitter:description", route.valid ? metadata.description : dictionary.notFound.description);
  }, [dictionary, metadata, route.locale, route.valid]);

  const pageComponents: Record<PageKey, React.ReactNode> = {
    home: <HomePage dictionary={dictionary} locale={route.locale} />,
    technology: <TechnologyPage dictionary={dictionary} />,
    principles: <PrinciplesPage dictionary={dictionary} />,
    trust: <TrustPage dictionary={dictionary} />,
    about: <AboutPage dictionary={dictionary} />,
  };

  return (
    <>
      <a className="skip-link" href="#main">{dictionary.ui.skip}</a>
      <SiteHeader dictionary={dictionary} locale={route.locale} page={route.page} />
      <main id="main">{route.valid ? pageComponents[route.page] : <NotFoundPage dictionary={dictionary} locale={route.locale} />}</main>
      <SiteFooter dictionary={dictionary} locale={route.locale} />
      <StructuredData dictionary={dictionary} />
    </>
  );
}
