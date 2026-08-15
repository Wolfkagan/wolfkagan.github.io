import {
  BadgeCheck,
  CircleHelp,
  Clock3,
  Cpu,
  Database,
  Eye,
  FileCheck2,
  GitBranch,
  HardDrive,
  History,
  KeyRound,
  Layers3,
  Merge,
  Route,
  Scale,
  ServerCog,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import type { Dictionary } from "../content";
import { siteConfig } from "../lib/site-config";

export function SectionHeading({ eyebrow, title, description, compact = false }: { eyebrow: string; title: string; description?: string; compact?: boolean }) {
  return (
    <header className={`section-heading${compact ? " section-heading-compact" : ""}`}>
      <span className="eyebrow"><i />{eyebrow}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </header>
  );
}

const approachIcons = [ServerCog, FileCheck2, History, KeyRound, BadgeCheck];
const layerIcons = [Cpu, Database, Route, ShieldCheck, Merge];
const principleIcons = [Layers3, Clock3, GitBranch, Scale];
const trustIcons = [HardDrive, CircleHelp, UserCheck, Eye];

export function ApproachGrid({ dictionary, heading = true, headingTitle }: { dictionary: Dictionary; heading?: boolean; headingTitle?: string }) {
  const content = dictionary.shared.approach;
  return (
    <section className="section section-approach">
      <div className="container">
        {heading && <SectionHeading eyebrow={content.eyebrow} title={headingTitle ?? content.title} description={content.description} />}
        <div className="approach-grid">
          {content.items.map((item, index) => {
            const Icon = approachIcons[index];
            return (
              <article className={`approach-card${index === 0 ? " approach-card-feature" : ""}`} key={item.title}>
                <div className="card-meta"><span>0{index + 1}</span><Icon aria-hidden="true" /></div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function SystemLayers({ dictionary, heading = true, headingTitle }: { dictionary: Dictionary; heading?: boolean; headingTitle?: string }) {
  const content = dictionary.shared.system;
  return (
    <section className="section section-system">
      <div className="container">
        {heading && <SectionHeading eyebrow={content.eyebrow} title={headingTitle ?? content.title} description={content.description} />}
        <div className="public-notice"><ShieldCheck aria-hidden="true" /><p>{content.notice}</p></div>
        <div className="layer-list">
          {content.items.map((item, index) => {
            const Icon = layerIcons[index];
            return (
              <article className="layer-row" key={item.title}>
                <span className="layer-index">0{index + 1}</span>
                <span className="layer-icon"><Icon aria-hidden="true" /></span>
                <div><h3>{item.title}</h3><p>{item.description}</p></div>
                <span className="layer-line" aria-hidden="true" />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function PrinciplesGrid({ dictionary, heading = true, preview = false }: { dictionary: Dictionary; heading?: boolean; preview?: boolean }) {
  const content = dictionary.shared.principleSet;
  return (
    <section className="section section-principles">
      <div className="container">
        {heading && <SectionHeading eyebrow={content.eyebrow} title={content.title} description={content.description} />}
        <div className="principles-grid">
          {content.items.map((item, index) => {
            const Icon = principleIcons[index];
            return (
              <article className="principle-card" key={item.technicalName}>
                <div className="principle-top"><span>{item.technicalName}</span><Icon aria-hidden="true" /></div>
                <h3>{item.title}</h3>
                <p className="principle-essence">{item.essence}</p>
                {!preview && <p className="principle-description">{item.description}</p>}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function TrustGrid({ dictionary, heading = true }: { dictionary: Dictionary; heading?: boolean }) {
  const content = dictionary.shared.trustSet;
  return (
    <section className="section section-trust-grid">
      <div className="container">
        {heading && <SectionHeading eyebrow={content.eyebrow} title={content.title} description={content.description} />}
        <div className="trust-grid">
          {content.items.map((item, index) => {
            const Icon = trustIcons[index];
            return (
              <article className="trust-card" key={item.title}>
                <span className="trust-icon"><Icon aria-hidden="true" /></span>
                <span className="trust-number">0{index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function StatusSection({ dictionary }: { dictionary: Dictionary }) {
  const content = dictionary.shared.status;
  return (
    <section className="section status-section">
      <div className="container status-panel">
        <div className="status-orbit" aria-hidden="true"><i /><i /><i /></div>
        <div>
          <span className="eyebrow"><i />{content.eyebrow}</span>
          <h2>{content.title}</h2>
          <p>{content.description}</p>
        </div>
      </div>
    </section>
  );
}

export function ContactSection({ dictionary }: { dictionary: Dictionary }) {
  const content = dictionary.shared.contact;
  if (!siteConfig.contactEmail) return null;
  return (
    <section className="section contact-section">
      <div className="container contact-panel">
        <div>
          <span className="eyebrow"><i />{content.eyebrow}</span>
          <h2>{content.title}</h2>
          <p>{content.description}</p>
        </div>
        <div className="contact-action">
          <a className="button button-primary" href={`mailto:${siteConfig.contactEmail}`}>{content.action}<span aria-hidden="true">↗</span></a>
          <small>{content.warning}</small>
        </div>
      </div>
    </section>
  );
}
