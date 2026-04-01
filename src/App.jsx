import { useState, useEffect, useRef } from "react";

const PURPLE = "#9B7FD4";
const PURPLE_LIGHT = "#B8A0E8";
const PD = "rgba(155,127,212,";

/* ============================================ */
/* DATA                                          */
/* ============================================ */
const SERVICES = [
  { icon: "01", name: "AI Phone & Chat",
    description: "24/7 AI receptionist that answers phone calls and website chat in your brand voice. Books appointments, answers FAQs, and knows when to hand off to your team. Callers can't tell the difference.",
    tags: ["Phone Answering", "Live Chat", "Booking", "Escalation"] },
  { icon: "02", name: "Content Engines",
    description: "AI pipelines that research, write, produce, and publish video content across YouTube, TikTok, and Instagram. You spend 15 minutes reviewing. The system does the rest.",
    tags: ["Script Gen", "Voiceover", "Auto-Upload", "Analytics"] },
  { icon: "03", name: "Lead Gen & Outreach",
    description: "AI finds your ideal clients, researches their business, writes personalized emails, and queues everything for your approval before sending.",
    tags: ["Prospect Discovery", "Email Drafts", "CRM Sync", "Approval Flow"] },
  { icon: "04", name: "AI Agents",
    description: "Autonomous agents on dedicated hardware that handle email, leads, scheduling, research, and client communication around the clock — without missing a beat.",
    tags: ["Always-On", "Multi-Agent", "Custom Skills", "Remote Managed"] },
  { icon: "05", name: "Data & Intel",
    description: "Systems that watch your competitors, track trends, scrape market data, and deliver formatted reports to your inbox on a schedule you set.",
    tags: ["Competitor Watch", "Trend Detection", "Auto-Reports", "Dashboards"] },
  { icon: "06", name: "Custom Builds",
    description: "Have a manual process that drains your week? Tell us how it works and we'll automate it. Every business is different. Every build is custom.",
    tags: ["Process Analysis", "Integration", "Testing", "Optimization"] },
];

const PROCESS = [
  { step: "01", title: "You talk", desc: "Walk us through what slows your business down. We identify what to automate first." },
  { step: "02", title: "We design", desc: "Architecture, AI models, integrations, workflow — all mapped before we write a line of code." },
  { step: "03", title: "We build", desc: "Fast iteration. You see progress throughout. Nothing goes live until it's tested and approved." },
  { step: "04", title: "Goes live", desc: "Deployed on dedicated hardware. Dashboard access. Full visibility." },
  { step: "05", title: "Gets smarter", desc: "We monitor, tune, and optimize. Your system improves every week." },
];

const NUMBERS = [
  { value: "<1s", label: "Response Time", desc: "Sub-second voice latency so conversations feel natural" },
  { value: "24/7", label: "Availability", desc: "Your AI never sleeps, takes breaks, or calls in sick" },
  { value: "100+", label: "Languages", desc: "Serve customers in their native language automatically" },
  { value: "500+", label: "Calls/Month", desc: "Handle hundreds of concurrent conversations per client" },
];

const TOOLS = [
  { name: "Claude", role: "Intelligence", desc: "Advanced AI by Anthropic" },
  { name: "Vapi", role: "Voice Agents", desc: "Industry-leading AI phone platform" },
  { name: "Deepgram", role: "Transcription", desc: "Real-time speech recognition" },
  { name: "Python", role: "Core Language", desc: "Powering every automation we build" },
  { name: "Calendly", role: "Scheduling", desc: "Seamless appointment booking" },
  { name: "HubSpot", role: "CRM", desc: "Customer data and pipeline management" },
];

const COMPARISONS = [
  { need: "Full-time receptionist", traditional: "$2,500 – $4,000/mo", droogan: "From $125/mo" },
  { need: "Market research analyst", traditional: "$3,000 – $6,000/mo", droogan: "From $150/mo" },
  { need: "Social media manager", traditional: "$1,500 – $3,000/mo", droogan: "From $150/mo" },
  { need: "Lead gen service", traditional: "$1,000 – $5,000/mo", droogan: "From $150/mo" },
  { need: "Virtual assistant", traditional: "$500 – $2,000/mo", droogan: "From $125/mo" },
];

const FAQS = [
  { q: "How long does setup take?", a: "Most systems are built and tested within 3–7 days. You'll have a working system faster than it takes to hire and train a new employee." },
  { q: "Do I need to be technical?", a: "Not at all. You describe what you need in plain language. We handle everything technical. You interact with your system through a simple dashboard." },
  { q: "What if the AI says something wrong?", a: "Every system starts with a test period where we review all outputs before anything goes live. You approve everything. We build in guardrails and escalation rules so the AI knows its limits." },
  { q: "Can I cancel anytime?", a: "Yes. No long-term contracts. Monthly billing. If you want to stop, you stop. We export your data and hand everything over." },
  { q: "Is my data safe?", a: "All systems run on dedicated hardware. Your data is never shared with other clients. Credentials are encrypted. We use privacy-focused, enterprise-grade tools." },
  { q: "What happens if something breaks?", a: "All systems are monitored automatically. If something goes down, we get alerted and fix it — usually before you notice." },
  { q: "Will customers know it's AI?", a: "Our voice agents use the most realistic AI voices available. Most callers can't tell the difference. Chat responses are natural and conversational, not robotic." },
  { q: "What if it doesn't work for my business?", a: "We offer a 30-day money-back guarantee on your monthly fee. If you're not happy with the results after the first month, full refund. No questions asked." },
];

const TIERS = {
  starter: { name: "Starter", price: "$500 setup + $250/mo", tagline: "Never Miss a Customer",
    desc: "Select up to 2 customer-facing services below.", pick: 2,
    preview: "Best for small businesses losing customers to missed calls, slow responses, or no online chat. Get an AI receptionist handling your phones and website around the clock.",
    services: ["AI phone answering", "Website live chat", "Appointment booking", "Review response automation", "Post-purchase follow-ups", "FAQ handling & routing"] },
  growth: { name: "Growth", price: "$1,200 setup + $450/mo", tagline: "Work While You Sleep",
    desc: "Includes everything in Starter. Select up to 3 additional services below.", pick: 3,
    preview: "For businesses ready to automate marketing, sales, and operations. Everything in Starter plus content, lead gen, email management, and competitive intelligence.",
    services: ["Content creation & scheduling", "Lead generation & prospecting", "Email outreach automation", "Competitor monitoring & intel", "Email triage & auto-responses", "CRM data management", "Social media management"] },
  empire: { name: "Empire", price: "$2,500 setup + $750/mo", tagline: "Your AI Department",
    desc: "Everything below is included with your plan.", pick: null,
    preview: "A full AI workforce. Every service we offer, running on dedicated hardware with a custom dashboard, weekly reports, and priority support. Replaces the need for multiple hires.",
    services: ["Full content pipeline (video, blog, social, email)", "Multi-channel lead generation", "Dedicated hardware 24/7", "Custom dashboard with analytics", "Weekly performance reports", "Internal operations automation", "Priority support"] },
  custom: { name: "Custom", price: "Custom pricing", tagline: "Your Way",
    desc: "Describe what you need. We'll scope it and build it.", pick: null,
    preview: "Don't see a plan that fits? No problem. Tell us what you need — whether it's a single service, a mix from different tiers, or something entirely unique. We'll put together a custom quote.",
    services: [] },
};

/* ============================================ */
/* UTILITIES                                     */
/* ============================================ */
function useInView(ref) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.12 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return v;
}
function Reveal({ children, delay = 0 }) {
  const r = useRef(null); const v = useInView(r);
  return <div ref={r} style={{ opacity: v?1:0, transform: v?"translateY(0)":"translateY(24px)", transition: `all 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s` }}>{children}</div>;
}
function Section({ id, children, bg = "#0a0a0e", pad = "100px 40px" }) {
  return <section id={id} style={{ padding: pad, background: bg }}>{children}</section>;
}
function SectionLabel({ text }) {
  return <div style={{ fontSize: 10, color: PURPLE, letterSpacing: 4, fontFamily: "'Space Mono', monospace", marginBottom: 12 }}>{text}</div>;
}
function SectionTitle({ children }) {
  return <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "#eee", fontFamily: "'Space Mono', monospace", letterSpacing: -1 }}>{children}</h2>;
}
function DrooganLogo({ size = 18, glow = 0.3 }) {
  const ls = { fontSize: size, fontWeight: 900, color: PURPLE, fontFamily: "'Space Mono', monospace", letterSpacing: -1, textShadow: `0 0 20px ${PD}${glow})` };
  const ds = Math.max(3, size * 0.16);
  const EyeO = () => (
    <span style={{ display: "inline-block", position: "relative", width: size * 0.62, textAlign: "center" }}>
      <span style={ls}>O</span>
      <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: ds, height: ds, borderRadius: "50%", background: PURPLE, boxShadow: `0 0 ${ds*2}px ${PD}0.6)` }} />
    </span>
  );
  return <span style={{ display: "inline-flex", alignItems: "center", whiteSpace: "nowrap" }}><span style={ls}>DR</span><EyeO /><EyeO /><span style={ls}>GAN</span></span>;
}
const inputStyle = { width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, color: "#ccc", fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" };
const labelStyle = { fontSize: 10, color: "#444", letterSpacing: 2, fontFamily: "'Space Mono', monospace", display: "block", marginBottom: 6 };
const focusIn = (e) => e.target.style.borderColor = `${PD}0.3)`;
const focusOut = (e) => e.target.style.borderColor = "rgba(255,255,255,0.06)";

/* ============================================ */
/* SECTION: NAV                                  */
/* ============================================ */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 60); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", background: scrolled ? "rgba(10,10,14,0.92)" : "transparent", backdropFilter: scrolled ? "blur(16px)" : "none", borderBottom: scrolled ? `1px solid ${PD}0.08)` : "1px solid transparent", transition: "all 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <DrooganLogo size={17} glow={0.25} />
        <span style={{ fontSize: 10, fontWeight: 600, color: "#444", letterSpacing: 3, fontFamily: "'Space Mono', monospace", border: "1px solid #222", padding: "2px 8px", borderRadius: 3 }}>AI</span>
      </div>
      <a href="#apply" style={{ color: "#0a0a0e", background: PURPLE, padding: "7px 14px", borderRadius: 4, fontSize: 11, textDecoration: "none", fontWeight: 700, letterSpacing: 1, fontFamily: "'Space Mono', monospace", boxShadow: `0 0 20px ${PD}0.2)`, whiteSpace: "nowrap" }}>get started</a>
    </nav>
  );
}

/* ============================================ */
/* SECTION: HERO                                 */
/* ============================================ */
function Hero() {
  const [m, setM] = useState(false);
  useEffect(() => { setTimeout(() => setM(true), 100); }, []);
  const a = (d) => ({ opacity: m?1:0, transform: m?"translateY(0)":"translateY(20px)", transition: `all 0.7s ease ${d}s` });
  return (
    <Section id="hero" pad="120px 40px 80px">
      <div style={{ position: "absolute", inset: 0, opacity: 0.12, backgroundImage: `linear-gradient(${PD}0.4) 1px, transparent 1px), linear-gradient(90deg, ${PD}0.4) 1px, transparent 1px)`, backgroundSize: "60px 60px", pointerEvents: "none", maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)", WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)" }} />
      <div style={{ maxWidth: 800, position: "relative", zIndex: 1 }}>
        <div style={a(0.1)}>
          <div style={{ display: "inline-block", padding: "4px 12px", border: `1px solid ${PD}0.2)`, borderRadius: 3, fontSize: 11, color: PURPLE, letterSpacing: 3, fontFamily: "'Space Mono', monospace", marginBottom: 28 }}>AI AUTOMATION STUDIO</div>
        </div>
        <div style={{ ...a(0.2), marginBottom: 28 }}>
          <DrooganLogo size={52} glow={0.2} />
          <span style={{ fontSize: 14, color: "#444", fontFamily: "'Space Mono', monospace", letterSpacing: 4, marginLeft: 12 }}>AI</span>
        </div>
        <div style={a(0.3)}>
          <h1 style={{ fontSize: "clamp(32px, 5.5vw, 60px)", fontWeight: 800, color: "#eee", lineHeight: 1.1, marginBottom: 24, fontFamily: "'Space Mono', monospace", letterSpacing: -2 }}>
            We build systems that <span style={{ color: PURPLE_LIGHT, textShadow: `0 0 40px ${PD}0.2)` }}>run your business</span> for you.
          </h1>
        </div>
        <div style={a(0.4)}>
          <p style={{ fontSize: 15, color: "#666", lineHeight: 1.8, maxWidth: 520, fontFamily: "'DM Sans', sans-serif", marginBottom: 36 }}>
            AI phone answering. Live chat. Content engines. Lead generation. Data intelligence.
            Custom automation. Built for your business. Running 24/7 on dedicated hardware.
          </p>
        </div>
        <div style={{ ...a(0.5), display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a href="#services" style={{ padding: "12px 28px", background: PURPLE, color: "#0a0a0e", borderRadius: 5, textDecoration: "none", fontSize: 13, fontWeight: 700, fontFamily: "'Space Mono', monospace", letterSpacing: 0.5, boxShadow: `0 0 24px ${PD}0.15)` }}>see services</a>
          <a href="#apply" style={{ padding: "12px 28px", background: "transparent", color: PURPLE, borderRadius: 5, textDecoration: "none", fontSize: 13, fontWeight: 600, fontFamily: "'Space Mono', monospace", border: `1px solid ${PD}0.25)`, letterSpacing: 0.5 }}>apply now</a>
        </div>
      </div>
    </Section>
  );
}

/* ============================================ */
/* SECTION: NUMBERS                              */
/* ============================================ */
function NumbersSection() {
  return (
    <Section id="numbers" bg="linear-gradient(180deg, #0a0a0e 0%, #0c0c12 100%)" pad="60px 40px">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24, maxWidth: 900, margin: "0 auto" }}>
        {NUMBERS.map((n, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <div style={{ textAlign: "center", padding: "24px 16px" }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: PURPLE, fontFamily: "'Space Mono', monospace", textShadow: `0 0 20px ${PD}0.2)`, marginBottom: 4 }}>{n.value}</div>
              <div style={{ fontSize: 11, color: "#888", letterSpacing: 2, fontFamily: "'Space Mono', monospace", marginBottom: 8 }}>{n.label.toUpperCase()}</div>
              <div style={{ fontSize: 12, color: "#555", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>{n.desc}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ============================================ */
/* SECTION: SERVICES                             */
/* ============================================ */
function ServicesSection() {
  return (
    <Section id="services" bg="linear-gradient(180deg, #0c0c12 0%, #0a0a0e 100%)">
      <Reveal><div style={{ marginBottom: 56, maxWidth: 1100, margin: "0 auto 56px", textAlign: "center" }}><SectionLabel text="WHAT WE BUILD" /><SectionTitle>Six ways to automate<br />your business.</SectionTitle></div></Reveal>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16, maxWidth: 1100, margin: "0 auto" }}>
        {SERVICES.map((s, i) => {
          const [h, setH] = useState(false);
          return (
            <Reveal key={i} delay={i * 0.06}>
              <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ padding: 28, background: h ? `${PD}0.03)` : "rgba(255,255,255,0.015)", border: `1px solid ${h ? `${PD}0.15)` : "rgba(255,255,255,0.04)"}`, borderRadius: 10, transition: "all 0.3s ease", height: "100%", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 50, height: 50, borderRadius: 12, background: `linear-gradient(135deg, ${PD}0.12) 0%, ${PD}0.04) 100%)`, border: `1px solid ${PD}0.18)`, marginBottom: 16, boxShadow: `inset 0 1px 1px rgba(255,255,255,0.08), 0 0 20px ${PD}0.06)`, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: "-100%", width: "200%", height: "100%", background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 60%, transparent 100%)", animation: "shimmer 3s ease-in-out infinite" }} />
                  <span style={{ fontSize: 20, fontWeight: 900, color: PURPLE, fontFamily: "'Space Mono', monospace", letterSpacing: -1, position: "relative", zIndex: 1, textShadow: `0 0 12px ${PD}0.3)` }}>{s.icon}</span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#eee", fontFamily: "'Space Mono', monospace", marginBottom: 10 }}>{s.name}</h3>
                <p style={{ fontSize: 13, color: "#666", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", flex: 1, marginBottom: 16 }}>{s.description}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {s.tags.map((t, j) => <span key={j} style={{ fontSize: 10, color: "#555", padding: "3px 8px", background: `${PD}0.04)`, border: `1px solid ${PD}0.08)`, borderRadius: 3, fontFamily: "'Space Mono', monospace" }}>{t}</span>)}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

/* ============================================ */
/* SECTION: POWERED BY (TRUST BAR)               */
/* ============================================ */
function TrustSection() {
  return (
    <Section id="stack" bg="#0a0a0e" pad="80px 40px">
      <Reveal><div style={{ marginBottom: 48, textAlign: "center" }}><SectionLabel text="OUR STACK" /><SectionTitle>We only use the best.</SectionTitle><p style={{ fontSize: 14, color: "#555", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", marginTop: 12, maxWidth: 500, margin: "12px auto 0" }}>Every tool in our stack is industry-leading and battle-tested. These are some of our go-to platforms — but we're not limited to them. If your business runs on specific tools, we integrate with those too.</p></div></Reveal>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, maxWidth: 960, margin: "0 auto" }}>
        {TOOLS.map((t, i) => (
          <Reveal key={i} delay={i * 0.06}>
            <div style={{ padding: "20px 16px", borderRadius: 10, border: `1px solid rgba(255,255,255,0.04)`, background: "rgba(255,255,255,0.015)", textAlign: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: PURPLE, fontFamily: "'Space Mono', monospace", marginBottom: 4 }}>{t.name}</div>
              <div style={{ fontSize: 10, color: "#666", letterSpacing: 1.5, fontFamily: "'Space Mono', monospace", marginBottom: 6 }}>{t.role.toUpperCase()}</div>
              <div style={{ fontSize: 11, color: "#555", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>{t.desc}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ============================================ */
/* SECTION: PROCESS                              */
/* ============================================ */
function ProcessSection() {
  return (
    <Section id="process" bg="linear-gradient(180deg, #0a0a0e 0%, #0c0c12 100%)">
      <Reveal><div style={{ marginBottom: 56, maxWidth: 600, margin: "0 auto 56px", textAlign: "center" }}><SectionLabel text="HOW IT WORKS" /><SectionTitle>Five steps. Zero fluff.</SectionTitle></div></Reveal>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        {PROCESS.map((p, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <div style={{ display: "flex", gap: 24, marginBottom: 36, alignItems: "flex-start" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: PURPLE, fontFamily: "'Space Mono', monospace", minWidth: 32, padding: "4px 0", borderBottom: `1px solid ${PD}0.15)`, opacity: 0.6 }}>{p.step}</div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#ddd", fontFamily: "'Space Mono', monospace", marginBottom: 6 }}>{p.title}</h3>
                <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>{p.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ============================================ */
/* SECTION: COST COMPARISON                      */
/* ============================================ */
function ComparisonSection() {
  return (
    <Section id="compare" bg="linear-gradient(180deg, #0c0c12 0%, #0a0a0e 100%)">
      <Reveal><div style={{ marginBottom: 48, maxWidth: 700, margin: "0 auto 48px", textAlign: "center" }}><SectionLabel text="THE NUMBERS" /><SectionTitle>What it costs vs. what<br />it replaces.</SectionTitle></div></Reveal>
      <Reveal delay={0.1}>
        <div style={{ maxWidth: 700, margin: "0 auto", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Sans', sans-serif" }}>
            <thead>
              <tr>
                {["What you need", "Traditional cost", "Droogan AI"].map((h, i) => (
                  <th key={i} style={{ padding: "12px 16px", textAlign: "left", fontSize: 10, color: i === 2 ? PURPLE : "#666", letterSpacing: 2, fontFamily: "'Space Mono', monospace", borderBottom: `1px solid ${PD}0.12)` }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISONS.map((c, i) => (
                <tr key={i}>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#ccc", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{c.need}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#666", borderBottom: "1px solid rgba(255,255,255,0.04)", textDecoration: "line-through", opacity: 0.7 }}>{c.traditional}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: PURPLE, fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{c.droogan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </Section>
  );
}

/* ============================================ */
/* SECTION: ABOUT                                */
/* ============================================ */
function AboutSection() {
  return (
    <Section id="about" bg="linear-gradient(180deg, #0a0a0e 0%, #0c0c12 100%)">
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <Reveal><div style={{ textAlign: "center" }}><SectionLabel text="ABOUT" /><SectionTitle>Why Droogan AI.</SectionTitle></div></Reveal>
        <Reveal delay={0.1}>
          <div style={{ padding: 32, borderRadius: 10, border: `1px solid ${PD}0.08)`, background: `${PD}0.02)`, marginTop: 32 }}>
            <p style={{ fontSize: 14, color: "#888", lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif", marginBottom: 16 }}>
              Most automation agencies sell you a tool and disappear. We build your system, deploy it on dedicated hardware, and maintain it every month. If something breaks at 2 AM, we fix it — not you.
            </p>
            <p style={{ fontSize: 14, color: "#888", lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif", marginBottom: 16 }}>
              We use the same systems we sell. Our own content, our own lead gen, our own operations — all run on the same AI automation we build for clients. That means every problem you'll face, we've already solved for ourselves.
            </p>
            <p style={{ fontSize: 14, color: "#888", lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif" }}>
              No contracts. No upsells. No jargon. Just AI that works, maintained by people who care whether it actually helps your business.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ============================================ */
/* SECTION: FAQ                                  */
/* ============================================ */
function FAQSection() {
  const [open, setOpen] = useState(null);
  return (
    <Section id="faq" bg="linear-gradient(180deg, #0c0c12 0%, #0a0a0e 100%)">
      <Reveal><div style={{ marginBottom: 48, maxWidth: 640, margin: "0 auto 48px", textAlign: "center" }}><SectionLabel text="QUESTIONS" /><SectionTitle>Frequently asked.</SectionTitle></div></Reveal>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        {FAQS.map((f, i) => (
          <Reveal key={i} delay={i * 0.05}>
            <div onClick={() => setOpen(open === i ? null : i)} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "pointer", padding: "20px 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: open === i ? PURPLE : "#ccc", fontFamily: "'DM Sans', sans-serif", transition: "color 0.2s" }}>{f.q}</h3>
                <span style={{ color: "#555", fontSize: 20, fontFamily: "'Space Mono', monospace", transform: open === i ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.2s" }}>+</span>
              </div>
              {open === i && (
                <p style={{ fontSize: 13, color: "#888", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", marginTop: 12, paddingRight: 32 }}>{f.a}</p>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ============================================ */
/* SECTION: APPLICATION FORM                     */
/* ============================================ */
function ApplicationForm() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    tier: "", name: "", email: "", phone: "", businessName: "", industry: "", website: "",
    hours: "", description: "", painPoints: "", currentTools: "",
    selectedServices: [], customDescription: "",
    brandVoice: "", greeting: "", neverSay: "",
  });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const toggle = (svc) => setForm(p => ({ ...p, selectedServices: p.selectedServices.includes(svc) ? p.selectedServices.filter(s => s !== svc) : [...p.selectedServices, svc] }));
  const tier = TIERS[form.tier];
  const canNext = () => {
    if (step === 0) return !!form.tier;
    if (step === 1) return form.name && form.email && form.businessName;
    if (step === 2) return form.description;
    if (step === 3) return form.tier === "custom" ? !!form.customDescription : true;
    return true;
  };
  const handleSubmit = () => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, Array.isArray(v) ? v.join(", ") : v));
    fetch("https://formspree.io/f/xgopozwk", { method: "POST", body: fd, headers: { Accept: "application/json" } })
      .then(() => setSubmitted(true)).catch(() => setSubmitted(true));
  };

  const titles = ["Choose your plan", "Tell us about your business", "What needs automating?", "Pick your services", "Brand voice & preferences"];

  if (submitted) return (
    <Section id="apply"><div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 20 }}>✅</div>
      <SectionTitle>Application received.</SectionTitle>
      <p style={{ fontSize: 14, color: "#888", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", marginTop: 12 }}>We'll review your answers and reach out within 24 hours to schedule your onboarding call. We'll work through everything together.</p>
    </div></Section>
  );

  return (
    <Section id="apply">
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <Reveal><SectionLabel text="GET STARTED" /><SectionTitle>{titles[step]}</SectionTitle>
          <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", marginTop: 8, marginBottom: 32 }}>{step === 0 ? "Select a plan below to get started. You can change this later." : "Fill this out and we'll reach out within 24 hours. No commitment — just a conversation."}</p>
        </Reveal>

        {/* Progress */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 32 }}>
          {[0,1,2,3,4].map(i => <div key={i} style={{ width: i===step?24:8, height: 8, borderRadius: 4, background: i<=step?PURPLE:"rgba(255,255,255,0.08)", transition: "all 0.3s" }} />)}
        </div>

        <div style={{ minHeight: 300 }}>
          {/* Step 0: Tier */}
          {step === 0 && <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {Object.entries(TIERS).map(([k, t]) => {
              const active = form.tier === k;
              return (
                <div key={k} onClick={() => set("tier", k)} style={{ padding: 20, borderRadius: 10, cursor: "pointer", transition: "all 0.2s", border: `1px solid ${active ? PURPLE : "rgba(255,255,255,0.06)"}`, background: active ? `${PD}0.06)` : "rgba(255,255,255,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: active ? PURPLE : "#ccc", fontFamily: "'Space Mono', monospace" }}>{t.name}</span>
                    <span style={{ fontSize: 11, color: active ? PURPLE : "#555", fontFamily: "'Space Mono', monospace" }}>{t.price}</span>
                  </div>
                  <div style={{ fontSize: 13, color: active ? "#aaa" : "#666", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, marginBottom: 4 }}>{t.preview}</div>
                </div>
              );
            })}
          </div>}

          {/* Step 1: Info */}
          {step === 1 && <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { k: "name", l: "your name", ph: "full name", t: "text" },
              { k: "email", l: "email", ph: "you@company.com", t: "email" },
              { k: "phone", l: "phone (optional)", ph: "+1 555 123 4567", t: "tel" },
              { k: "businessName", l: "business name", ph: "Sunrise Dental", t: "text" },
              { k: "industry", l: "industry", ph: "dental, restaurant, real estate, etc.", t: "text" },
              { k: "website", l: "website (optional)", ph: "https://yourbusiness.com", t: "url" },
            ].map(f => <div key={f.k}><label style={labelStyle}>{f.l}</label><input type={f.t} placeholder={f.ph} value={form[f.k]} onChange={e => set(f.k, e.target.value)} style={inputStyle} onFocus={focusIn} onBlur={focusOut} /></div>)}
          </div>}

          {/* Step 2: Pain Points */}
          {step === 2 && <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div><label style={labelStyle}>what does your business do?</label><textarea rows={2} placeholder="In one or two sentences" value={form.description} onChange={e => set("description", e.target.value)} style={{ ...inputStyle, resize: "vertical" }} onFocus={focusIn} onBlur={focusOut} /></div>
            <div><label style={labelStyle}>what tasks take up the most of your time?</label><textarea rows={3} placeholder="Answering calls, posting on social media, following up with leads..." value={form.painPoints} onChange={e => set("painPoints", e.target.value)} style={{ ...inputStyle, resize: "vertical" }} onFocus={focusIn} onBlur={focusOut} /></div>
            <div><label style={labelStyle}>what tools do you currently use?</label><input type="text" placeholder="Google Calendar, Mailchimp, Housecall Pro, etc." value={form.currentTools} onChange={e => set("currentTools", e.target.value)} style={inputStyle} onFocus={focusIn} onBlur={focusOut} /></div>
            <div><label style={labelStyle}>business hours</label><input type="text" placeholder="Mon-Fri 8am-5pm, Sat 9am-1pm" value={form.hours} onChange={e => set("hours", e.target.value)} style={inputStyle} onFocus={focusIn} onBlur={focusOut} /></div>
          </div>}

          {/* Step 3: Services */}
          {step === 3 && <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {tier && tier.services.length > 0 ? <>
              <p style={{ fontSize: 13, color: "#666", fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>{tier.desc}</p>
              {tier.services.map(svc => {
                const isEmpire = !tier.pick && form.tier !== "custom";
                const active = isEmpire || form.selectedServices.includes(svc);
                const atMax = tier.pick && form.selectedServices.length >= tier.pick && !active;
                return (
                  <div key={svc} onClick={() => !isEmpire && !atMax && toggle(svc)} style={{ padding: "12px 16px", borderRadius: 8, cursor: isEmpire ? "default" : atMax?"default":"pointer", border: `1px solid ${active?PURPLE:"rgba(255,255,255,0.06)"}`, background: active?`${PD}0.06)`:"rgba(255,255,255,0.02)", opacity: atMax?0.4:1, transition: "all 0.2s", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${active?PURPLE:"rgba(255,255,255,0.15)"}`, background: active?PURPLE:"transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {active && <span style={{ color: "#0a0a0e", fontSize: 12, fontWeight: 900 }}>✓</span>}
                    </div>
                    <span style={{ fontSize: 13, color: active?"#eee":"#888", fontFamily: "'DM Sans', sans-serif" }}>{svc}</span>
                  </div>
                );
              })}
            </> : <div><label style={labelStyle}>tell us what you need</label><textarea rows={5} placeholder="Tell us what you need — whether it's a system, an automation, an integration, or something you're not sure how to describe yet. We'll figure it out together." value={form.customDescription} onChange={e => set("customDescription", e.target.value)} style={{ ...inputStyle, resize: "vertical" }} onFocus={focusIn} onBlur={focusOut} /></div>}
          </div>}

          {/* Step 4: Brand Voice */}
          {step === 4 && <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div><label style={labelStyle}>how should your AI sound?</label><input type="text" placeholder="professional, friendly, casual, formal, warm..." value={form.brandVoice} onChange={e => set("brandVoice", e.target.value)} style={inputStyle} onFocus={focusIn} onBlur={focusOut} /></div>
            <div><label style={labelStyle}>how should it greet customers?</label><input type="text" placeholder="Thanks for calling [Business Name], how can we help?" value={form.greeting} onChange={e => set("greeting", e.target.value)} style={inputStyle} onFocus={focusIn} onBlur={focusOut} /></div>
            <div><label style={labelStyle}>anything the AI should never say? (optional)</label><input type="text" placeholder="competitor names, specific promises, etc." value={form.neverSay} onChange={e => set("neverSay", e.target.value)} style={inputStyle} onFocus={focusIn} onBlur={focusOut} /></div>
          </div>}
        </div>

        {/* Nav Buttons */}
        <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
          {step > 0 && <button onClick={() => setStep(step-1)} style={{ flex: 1, padding: "14px", background: "transparent", color: "#888", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Space Mono', monospace" }}>back</button>}
          <button onClick={() => step < 4 ? setStep(step+1) : handleSubmit()} disabled={!canNext()} style={{
            flex: 2, padding: "14px", background: canNext() ? PURPLE : "rgba(255,255,255,0.05)",
            color: canNext() ? "#0a0a0e" : "#444", border: "none", borderRadius: 6, fontSize: 12,
            fontWeight: 700, letterSpacing: 1.5, cursor: canNext() ? "pointer" : "default",
            fontFamily: "'Space Mono', monospace", boxShadow: canNext() ? `0 0 24px ${PD}0.15)` : "none",
          }}>{step < 4 ? "next" : "submit application"}</button>
        </div>
      </div>
    </Section>
  );
}

/* ============================================ */
/* SECTION: CONTACT & DEMO                       */
/* ============================================ */
function ContactSection() {
  return (
    <Section id="contact" bg="#0a0a0e" pad="80px 40px">
      <Reveal><div style={{ marginBottom: 48, maxWidth: 800, margin: "0 auto 48px", textAlign: "center" }}><SectionLabel text="GET IN TOUCH" /><SectionTitle>Talk to us. Or our AI.</SectionTitle></div></Reveal>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, maxWidth: 800, margin: "0 auto" }}>
        <Reveal delay={0.1}>
          <div style={{ padding: 28, borderRadius: 10, border: `1px solid ${PD}0.08)`, background: `${PD}0.02)` }}>
            <div style={{ fontSize: 13, color: PURPLE, fontWeight: 700, fontFamily: "'Space Mono', monospace", marginBottom: 16, letterSpacing: 1 }}>LIVE AI DEMO</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#eee", fontFamily: "'Space Mono', monospace", marginBottom: 12 }}>+1 (747) 494-9392</div>
            <p style={{ fontSize: 13, color: "#666", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", marginBottom: 16 }}>Call this number right now and talk to our AI. It answers questions, explains our services, and handles the conversation naturally. This is exactly what we build for businesses.</p>
            <p style={{ fontSize: 12, color: "#555", fontFamily: "'DM Sans', sans-serif" }}>Or click the purple button on this page to try the web version.</p>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <div style={{ padding: 28, borderRadius: 10, border: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.015)" }}>
            <div style={{ fontSize: 13, color: "#888", fontWeight: 700, fontFamily: "'Space Mono', monospace", marginBottom: 16, letterSpacing: 1 }}>CONTACT US</div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: "#555", fontFamily: "'Space Mono', monospace", marginBottom: 4 }}>SUPPORT</div>
              <a href="mailto:support@droogan.ai" style={{ fontSize: 15, color: "#ccc", textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>support@droogan.ai</a>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#555", fontFamily: "'Space Mono', monospace", marginBottom: 4 }}>SOCIAL</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <a href="https://instagram.com/droogan.ai" target="_blank" style={{ fontSize: 13, color: "#888", textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>Instagram @droogan.ai</a>
                <a href="https://x.com/DrooganAi" target="_blank" style={{ fontSize: 13, color: "#888", textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>X @DrooganAi</a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ============================================ */
/* FOOTER                                        */
/* ============================================ */
function Footer() {
  return (
    <footer style={{ padding: "32px", borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#08080c" }}>
      <div style={{ opacity: 0.4 }}><DrooganLogo size={13} glow={0.1} /><span style={{ fontSize: 9, color: "#333", letterSpacing: 2, marginLeft: 6, fontFamily: "'Space Mono', monospace" }}>AI</span></div>
      <div style={{ fontSize: 11, color: "#222", fontFamily: "'Space Mono', monospace" }}>© 2026</div>
    </footer>
  );
}

/* ============================================ */
/* MAIN APP                                      */
/* ============================================ */
export default function DrooganAI() {
  return (
    <div style={{ background: "#0a0a0e", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::placeholder { color: #444; }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 50% { transform: translateX(100%); } 100% { transform: translateX(100%); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0e; }
        ::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 2px; }
      `}</style>
      <Nav />
      <Hero />
      <NumbersSection />
      <ServicesSection />
      <TrustSection />
      <ProcessSection />
      <ComparisonSection />
      <AboutSection />
      <FAQSection />
      <ContactSection />
      <ApplicationForm />
      <Footer />
    </div>
  );
}