import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Blocks,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronRight,
  CircleGauge,
  Database,
  FileCheck2,
  FileText,
  Fingerprint,
  GitBranch,
  Globe2,
  History,
  Layers3,
  LockKeyhole,
  Menu,
  Network,
  Orbit,
  PanelTop,
  Route,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Undo2,
  Users,
  Workflow,
  X,
  Zap,
} from "lucide-react";

const PAPER_URL = "/dokumanlar/otukenai-bigg4future-is-fikri.pdf";

const architectureLayers = [
  {
    id: "interaction",
    number: "01",
    title: "Interaction Layer",
    label: "Intent, role and output contract",
    icon: PanelTop,
    description:
      "Translates user intent into a structured task contract: role, objective, boundaries, target audience and output standard.",
    signals: ["Turkish-first task interpretation", "Versioned prompt assets", "Output schema enforcement"],
  },
  {
    id: "planning",
    number: "02",
    title: "Planning Layer",
    label: "Goals, checkpoints and recovery",
    icon: Route,
    description:
      "Breaks complex work into auditable steps, defines success conditions, and selects recovery paths when execution fails.",
    signals: ["Task decomposition", "Success criteria", "Error-recovery protocol"],
  },
  {
    id: "permission",
    number: "03",
    title: "Permission Engine",
    label: "Human authority at every critical step",
    icon: Fingerprint,
    description:
      "Separates reading, recommending, drafting and external action into explicit permission levels controlled by the user.",
    signals: ["Human approval gates", "Least-privilege actions", "Revocable authority"],
  },
  {
    id: "memory",
    number: "04",
    title: "Source-Aware Memory",
    label: "Context with provenance",
    icon: Database,
    description:
      "Stores information with source, date, scope and confidence while preserving corrections and validity changes over time.",
    signals: ["Source provenance", "Reality ledger", "Correction history"],
  },
  {
    id: "models",
    number: "05",
    title: "Model Adapter Layer",
    label: "Flexible intelligence, stable governance",
    icon: Network,
    description:
      "Connects different AI models to one consistent memory, policy and evaluation layer without locking the product to one provider.",
    signals: ["Multi-model routing", "Local-model readiness", "Provider portability"],
  },
];

const consoleEvents = [
  { icon: ScanSearch, label: "Source classified", value: "verified_document", state: "done" },
  { icon: BrainCircuit, label: "Context restored", value: "14 linked records", state: "done" },
  { icon: GitBranch, label: "Plan generated", value: "4 controlled steps", state: "done" },
  { icon: LockKeyhole, label: "Approval required", value: "external_action", state: "active" },
  { icon: History, label: "Action ledger", value: "awaiting decision", state: "pending" },
];

const capabilities = [
  {
    icon: FileCheck2,
    title: "Reality Ledger",
    copy: "Verified records, user declarations, inferences and hypotheses remain distinct by design.",
    tag: "Epistemic control",
    className: "bento-wide",
  },
  {
    icon: ShieldCheck,
    title: "Permission Governance",
    copy: "Critical actions stop at human approval gates and remain visible in an immutable action trail.",
    tag: "Human authority",
  },
  {
    icon: Undo2,
    title: "Reversible Actions",
    copy: "Every supported action is designed with traceability, rollback and post-action verification.",
    tag: "Operational safety",
  },
  {
    icon: Blocks,
    title: "Model Portability",
    copy: "Switch intelligence providers without rebuilding memory, policy or evaluation infrastructure.",
    tag: "No lock-in",
  },
  {
    icon: CircleGauge,
    title: "Measured Reliability",
    copy: "Source accuracy, task completion, permission violations and recovery are tracked as product metrics.",
    tag: "Evidence first",
    className: "bento-wide",
  },
];

const useCases = [
  {
    icon: Building2,
    eyebrow: "SME OPERATIONS",
    title: "Institutional memory without repeated briefing",
    copy: "Preserve decisions, documents, responsibilities and corrections across long-running business workflows.",
    bullets: ["Proposal and document workflows", "Task and decision continuity", "Auditable knowledge base"],
  },
  {
    icon: BriefcaseBusiness,
    eyebrow: "PROFESSIONAL SERVICES",
    title: "High-context work with source visibility",
    copy: "Support architecture, consulting and project teams where every answer must be connected to its origin.",
    bullets: ["Long file histories", "Structured project context", "Permission-aware assistance"],
  },
  {
    icon: Sparkles,
    eyebrow: "CREATIVE PRODUCTION",
    title: "Versioned creative intelligence",
    copy: "Keep briefs, references, feedback and creative decisions aligned across iterative production cycles.",
    bullets: ["Brief and revision memory", "Audience-aware outputs", "Repeatable quality standards"],
  },
];

const roadmap = [
  {
    period: "MONTHS 01–06",
    title: "Core Architecture",
    copy: "User research, structured memory, reality ledger MVP and Turkish evaluation baseline.",
    status: "MVP",
  },
  {
    period: "MONTHS 07–12",
    title: "Control & Security",
    copy: "Planner, permission engine, action ledger, model adapters and closed alpha testing.",
    status: "ALPHA",
  },
  {
    period: "MONTHS 13–18",
    title: "Pilots & Commercialization",
    copy: "Three institutional pilots, pricing validation, subscription infrastructure and first customers.",
    status: "MARKET",
  },
];

const metrics = [
  ["≥90%", "Source accuracy target"],
  ["0", "Critical unauthorized actions"],
  ["≥80%", "Pilot task completion"],
  ["3+", "Institutional pilots"],
];

function SectionHeading({ eyebrow, title, copy, align = "left" }) {
  return (
    <motion.div
      className={`section-heading ${align === "center" ? "section-heading-center" : ""}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.65 }}
    >
      <span className="eyebrow"><span />{eyebrow}</span>
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </motion.div>
  );
}

function Logo() {
  return (
    <a className="logo" href="#top" aria-label="ÖtükenAI home">
      <span className="logo-orbit"><Orbit size={20} strokeWidth={1.8} /></span>
      <span>ÖTÜKEN<span>AI</span></span>
    </a>
  );
}

function Navigation() {
  const [open, setOpen] = useState(false);
  const links = [
    ["Platform", "#platform"],
    ["Architecture", "#architecture"],
    ["Applications", "#applications"],
    ["Roadmap", "#roadmap"],
    ["Company", "#company"],
  ];

  return (
    <header className="nav-shell">
      <div className="nav-inner">
        <Logo />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
        </nav>
        <a className="nav-action" href={PAPER_URL} target="_blank" rel="noreferrer">
          Concept Paper <ArrowRight size={15} />
        </a>
        <button className="menu-button" type="button" aria-label="Toggle menu" onClick={() => setOpen((v) => !v)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            className="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}<ChevronRight size={16} /></a>)}
            <a href={PAPER_URL} target="_blank" rel="noreferrer">Concept Paper<ArrowRight size={16} /></a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function SystemConsole() {
  return (
    <motion.div
      className="system-console"
      initial={{ opacity: 0, x: 40, rotateY: -5 }}
      animate={{ opacity: 1, x: 0, rotateY: 0 }}
      transition={{ duration: 0.9, delay: 0.2 }}
    >
      <div className="console-topbar">
        <div className="window-dots"><i /><i /><i /></div>
        <span>AGENT CONTROL PLANE</span>
        <div className="live-status"><i /> LIVE</div>
      </div>
      <div className="console-header">
        <div>
          <span className="console-kicker">TASK EXECUTION</span>
          <strong>Prepare institutional briefing</strong>
        </div>
        <span className="risk-chip">RISK · CONTROLLED</span>
      </div>
      <div className="console-flow">
        {consoleEvents.map((item, index) => {
          const Icon = item.icon;
          return (
            <div className={`console-event ${item.state}`} key={item.label}>
              <div className="event-line">
                <span className="event-icon"><Icon size={16} /></span>
                {index < consoleEvents.length - 1 && <i />}
              </div>
              <div className="event-copy"><strong>{item.label}</strong><span>{item.value}</span></div>
              <span className="event-state">{item.state === "done" ? <Check size={14} /> : item.state === "active" ? "HOLD" : "—"}</span>
            </div>
          );
        })}
      </div>
      <div className="approval-panel">
        <div><ShieldCheck size={20} /><span><strong>Human decision required</strong><small>External action is outside autonomous authority.</small></span></div>
        <button type="button">Review action <ArrowRight size={14} /></button>
      </div>
      <div className="console-footer"><TerminalSquare size={14} /><span>trace_id: OTK-26-0812-A7F4</span><span>policy: human_authority_v2</span></div>
    </motion.div>
  );
}

function Architecture() {
  const [activeId, setActiveId] = useState("permission");
  const active = useMemo(() => architectureLayers.find((item) => item.id === activeId), [activeId]);
  const ActiveIcon = active.icon;

  return (
    <section className="section architecture-section" id="architecture">
      <div className="section-container">
        <SectionHeading
          eyebrow="SYSTEM ARCHITECTURE"
          title="Stable governance. Flexible intelligence."
          copy="The underlying model can change. Memory, permission, policy and evaluation stay under one consistent product architecture."
        />
        <div className="architecture-grid">
          <div className="layer-stack" role="tablist" aria-label="Architecture layers">
            {architectureLayers.map((layer) => {
              const Icon = layer.icon;
              const selected = activeId === layer.id;
              return (
                <button
                  key={layer.id}
                  type="button"
                  className={`layer-button ${selected ? "active" : ""}`}
                  onClick={() => setActiveId(layer.id)}
                  role="tab"
                  aria-selected={selected}
                >
                  <span className="layer-number">{layer.number}</span>
                  <span className="layer-icon"><Icon size={19} /></span>
                  <span className="layer-label"><strong>{layer.title}</strong><small>{layer.label}</small></span>
                  <ChevronRight size={18} />
                </button>
              );
            })}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              className="layer-detail"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="detail-visual">
                <div className="detail-orbit one" /><div className="detail-orbit two" />
                <span><ActiveIcon size={38} /></span>
              </div>
              <span className="detail-kicker">LAYER {active.number}</span>
              <h3>{active.title}</h3>
              <p>{active.description}</p>
              <ul>{active.signals.map((signal) => <li key={signal}><Check size={15} />{signal}</li>)}</ul>
              <div className="detail-foot"><Activity size={15} /><span>Designed for measurable verification</span></div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function App() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    document.documentElement.classList.add("js");
    return () => document.documentElement.classList.remove("js");
  }, []);

  return (
    <div id="top">
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />
      <Navigation />

      <main>
        <section className="hero-section">
          <div className="hero-glow glow-one" /><div className="hero-glow glow-two" />
          <div className="hero-grid section-container">
            <motion.div className="hero-content" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="launch-badge"><span><i /> DEVELOPMENT STAGE</span><b>Built in Türkiye</b></div>
              <h1>A control layer for AI agents operating in the <em>real world.</em></h1>
              <p>ÖtükenAI preserves long-term context, traces every claim to its source, and keeps critical actions under explicit human authority.</p>
              <div className="hero-actions">
                <a className="primary-button" href={PAPER_URL} target="_blank" rel="noreferrer">Explore the concept <ArrowRight size={17} /></a>
                <a className="secondary-button" href="#architecture"><Layers3 size={17} /> View architecture</a>
              </div>
              <div className="hero-trust">
                <span><ShieldCheck size={16} /> Permission governed</span>
                <span><FileCheck2 size={16} /> Source traceable</span>
                <span><Undo2 size={16} /> Reversible by design</span>
              </div>
            </motion.div>
            <SystemConsole />
          </div>
          <div className="hero-bottom-line"><span>MEMORY</span><i /><span>POLICY</span><i /><span>AUTHORITY</span><i /><span>ACTION</span><i /><span>VERIFICATION</span></div>
        </section>

        <section className="section problem-section" id="platform">
          <div className="section-container">
            <SectionHeading
              eyebrow="THE CONTROL GAP"
              title="Powerful models are not the same as reliable systems."
              copy="Professional AI needs more than intelligence. It needs continuity, provenance, permission boundaries and an accountable operating record."
              align="center"
            />
            <div className="problem-grid">
              {[
                [BrainCircuit, "Context disappears", "Decisions, corrections and working knowledge fragment across sessions and tools."],
                [ScanSearch, "Sources become unclear", "Documents, declarations and model inferences blend into one untraceable answer."],
                [LockKeyhole, "Authority is undefined", "Agents act without a clear separation between recommendation, drafting and execution."],
                [Globe2, "Providers become infrastructure", "Memory and workflows remain trapped inside a single intelligence provider."],
              ].map(([Icon, title, copy], index) => (
                <motion.article
                  className="problem-card"
                  key={title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <span className="card-index">0{index + 1}</span><Icon size={25} /><h3>{title}</h3><p>{copy}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <Architecture />

        <section className="section capability-section">
          <div className="section-container">
            <SectionHeading
              eyebrow="PRODUCT CAPABILITIES"
              title="Trust is not a disclaimer. It is product architecture."
              copy="Every capability is designed to make agent behavior visible, measurable and controllable."
            />
            <div className="bento-grid">
              {capabilities.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.article
                    className={`bento-card ${item.className || ""}`}
                    key={item.title}
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ delay: index * 0.06 }}
                  >
                    <div className="bento-top"><span><Icon size={22} /></span><small>{item.tag}</small></div>
                    <h3>{item.title}</h3><p>{item.copy}</p>
                    <div className="bento-line" />
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section metrics-section">
          <div className="section-container metrics-layout">
            <div>
              <span className="eyebrow"><span />EVIDENCE FIRST</span>
              <h2>Reliability becomes a measurable product outcome.</h2>
              <p>Targets are validated through Turkish evaluation sets, permission scenarios, red-team testing and real institutional pilots.</p>
            </div>
            <div className="metrics-grid">
              {metrics.map(([value, label]) => <div className="metric-card" key={label}><strong>{value}</strong><span>{label}</span></div>)}
            </div>
          </div>
        </section>

        <section className="section applications-section" id="applications">
          <div className="section-container">
            <SectionHeading
              eyebrow="APPLICATIONS"
              title="Built for work where context and accountability matter."
              copy="ÖtükenAI focuses on long-running workflows where every decision must remain explainable."
            />
            <div className="use-case-grid">
              {useCases.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.article className="use-case" key={item.title} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                    <div className="use-case-head"><span><Icon size={25} /></span><small>{item.eyebrow}</small></div>
                    <h3>{item.title}</h3><p>{item.copy}</p>
                    <ul>{item.bullets.map((bullet) => <li key={bullet}><Check size={15} />{bullet}</li>)}</ul>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section roadmap-section" id="roadmap">
          <div className="section-container">
            <SectionHeading eyebrow="18-MONTH ROADMAP" title="From controlled prototype to validated commercial product." copy="A narrow technical scope, measurable gates and evidence from real users at every stage." />
            <div className="roadmap-line">
              {roadmap.map((phase, index) => (
                <motion.article className="roadmap-phase" key={phase.period} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.12 }}>
                  <div className="phase-marker"><span>0{index + 1}</span><i /></div>
                  <div className="phase-content"><div className="phase-meta"><small>{phase.period}</small><b>{phase.status}</b></div><h3>{phase.title}</h3><p>{phase.copy}</p></div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="section company-section" id="company">
          <div className="section-container company-grid">
            <motion.div className="founder-card" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="founder-monogram">MY</div>
              <div><small>FOUNDER</small><h3>Mustafa Yıldırım</h3><p>Architecture graduate · Law student · AI interaction systems</p></div>
              <div className="founder-signal"><Activity size={16} /><span>Adana, Türkiye</span></div>
            </motion.div>
            <motion.div className="company-copy" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="eyebrow"><span />COMPANY</span>
              <h2>Multidisciplinary by design.</h2>
              <p>ÖtükenAI combines systems thinking from architecture, legal perspectives on authority and data ownership, and advanced prompt engineering focused on role separation, long-context reconstruction, error classification and versioned evaluation.</p>
              <div className="company-tags"><span>System architecture</span><span>Prompt engineering</span><span>Legal design</span><span>Turkish AI evaluation</span></div>
            </motion.div>
          </div>
        </section>

        <section className="paper-section">
          <div className="paper-grid section-container">
            <div className="paper-icon"><FileText size={34} /></div>
            <div><span className="eyebrow"><span />BiGG4FUTURE 2026-2</span><h2>Business concept & technology brief</h2><p>Explore the challenge, product architecture, innovation, team plan, investment allocation, risk model and 18-month targets.</p></div>
            <a className="primary-button" href={PAPER_URL} target="_blank" rel="noreferrer">Open the document <ArrowRight size={17} /></a>
          </div>
        </section>

        <section className="contact-section">
          <div className="contact-inner section-container">
            <div><span className="eyebrow"><span />BUILD WITH US</span><h2>Trusted AI requires serious partners.</h2><p>We are open to institutional pilots, technical collaboration, research partnerships and early-stage investment conversations.</p></div>
            <a href="mailto:contact@otukenai.com">contact@otukenai.com <ArrowRight size={18} /></a>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-inner section-container">
          <div><Logo /><p>Permission-governed, source-traceable AI agent infrastructure built in Türkiye.</p></div>
          <div><strong>PLATFORM</strong><a href="#architecture">Architecture</a><a href="#applications">Applications</a><a href="#roadmap">Roadmap</a></div>
          <div><strong>COMPANY</strong><a href="#company">About</a><a href={PAPER_URL} target="_blank" rel="noreferrer">Concept Paper</a><a href="mailto:contact@otukenai.com">Contact</a></div>
          <div><strong>EXTERNAL</strong><a href="https://github.com/Wolfkagan/wolfkagan.github.io" target="_blank" rel="noreferrer">GitHub</a><span>Adana, Türkiye</span></div>
        </div>
        <div className="footer-bottom section-container"><span>© 2026 ÖtükenAI. All rights reserved.</span><span>Reality sits on the throne.</span></div>
      </footer>
    </div>
  );
}

export default App;
