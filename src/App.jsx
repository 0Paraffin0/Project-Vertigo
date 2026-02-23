/*
 * LEXSTAR — Phase 3
 * Markets Screen · Exchange tabs · Index card · Sparklines · Top movers · Market news
 *
 * Builds on Phase 2: replaces the Markets placeholder with a fully-functional
 * exchange view. Static data lives in src/markets.js (replaced by live feeds in Phase 7).
 */
import { useState } from "react";
import { EXCHANGES, MARKET_MOVERS, MARKET_NEWS } from "./markets.js";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg:       "#080A0F",
  surface:  "#0F1218",
  border:   "#1C2030",
  gold:     "#D4AF6A",
  goldDim:  "#8A6F3E",
  blue:     "#4A9EFF",
  green:    "#3ECF8E",
  red:      "#FF5C5C",
  text:     "#E8E4DC",
  textMid:  "#8A8880",
  textDim:  "#3A3A40",
  student:  "#6C8EFF",
  pro:      "#D4AF6A",
};

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
`;

const BASE_CSS = `
  ${FONTS}
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${C.bg}; }
  ::-webkit-scrollbar { width: 2px; }
  ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 4px; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position:  400px 0; }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.3; }
  }
  @keyframes slideRight {
    from { transform: translateX(-100%); opacity: 0; }
    to   { transform: translateX(0);    opacity: 1; }
  }
  @keyframes scaleIn {
    from { transform: scale(0.92); opacity: 0; }
    to   { transform: scale(1);    opacity: 1; }
  }

  .fade-up  { animation: fadeUp  0.5s cubic-bezier(0.16,1,0.3,1) both; }
  .scale-in { animation: scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) both; }

  .plan-card {
    border: 1px solid ${C.border};
    border-radius: 12px;
    padding: 24px;
    cursor: pointer;
    transition: border-color 0.2s, transform 0.15s, box-shadow 0.2s;
    background: ${C.surface};
    position: relative;
    overflow: hidden;
  }
  .plan-card::before {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
  }
  .plan-card.student::before { background: radial-gradient(ellipse at top left, ${C.student}12, transparent 60%); }
  .plan-card.pro::before     { background: radial-gradient(ellipse at top left, ${C.gold}15,    transparent 60%); }
  .plan-card:hover { transform: translateY(-2px); }
  .plan-card:hover::before { opacity: 1; }
  .plan-card.selected.student { border-color: ${C.student}; box-shadow: 0 0 0 1px ${C.student}40; }
  .plan-card.selected.pro     { border-color: ${C.gold};    box-shadow: 0 0 0 1px ${C.gold}40;   }

  .nav-btn {
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    background: none; border: none; cursor: pointer;
    padding: 8px 16px; border-radius: 8px;
    transition: background 0.15s;
    flex: 1;
  }
  .nav-btn:hover { background: ${C.border}; }
  .nav-btn.active .nav-icon  { color: ${C.gold}; }
  .nav-btn.active .nav-label { color: ${C.gold}; }

  .skeleton {
    background: linear-gradient(90deg, ${C.surface} 25%, ${C.border} 50%, ${C.surface} 75%);
    background-size: 400px 100%;
    animation: shimmer 1.4s ease-in-out infinite;
    border-radius: 6px;
  }

  .live-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: ${C.green};
    animation: pulse 2s ease-in-out infinite;
    display: inline-block;
  }

  .tag-chip {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 10px;
    border-radius: 100px;
    font-size: 11px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    letter-spacing: 0.03em;
    border: 1px solid;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }

  .primary-btn {
    width: 100%;
    padding: 14px;
    border-radius: 10px;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    letter-spacing: 0.02em;
    transition: opacity 0.15s, transform 0.1s;
  }
  .primary-btn:active { transform: scale(0.98); opacity: 0.85; }

  /* ── Phase 2: Filter overlay + bottom-sheet ── */
  .filter-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.65);
    z-index: 40;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s;
  }
  .filter-overlay.open {
    opacity: 1;
    pointer-events: all;
  }
  .filter-sheet {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    background: ${C.surface};
    border-top: 1px solid ${C.border};
    border-radius: 16px 16px 0 0;
    z-index: 50;
    transform: translateY(100%);
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    max-height: 82vh;
    overflow-y: auto;
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }
  .filter-sheet.open {
    transform: translateY(0);
  }
`;

// ─── FILTER DATA ──────────────────────────────────────────────────────────────
const FILTER_CATEGORIES = ["breaking", "legal", "markets", "finance"];

const TAG_GROUPS = [
  {
    label: "Sector",
    tags: ["Banking", "Asset Management", "Private Equity", "Insurance", "Real Estate"],
  },
  {
    label: "Legal",
    tags: ["Antitrust", "Compliance", "Regulation", "Litigation", "M&A Law"],
  },
  {
    label: "Geography",
    tags: ["United States", "United Kingdom", "European Union", "Asia-Pacific", "Global"],
  },
  {
    label: "Market",
    tags: ["NYSE", "LSE", "Nasdaq", "HKEX", "Euronext"],
  },
];

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_ARTICLES = [
  {
    id: 1,
    category: "breaking",
    headline: "Fed Holds Rates — Signals Two Cuts in 2025",
    brief: "The Federal Reserve kept its benchmark rate at 5.25–5.5%, citing easing inflation but cautioning that labour market data must soften further before cuts begin.",
    tags: ["Monetary Policy", "United States", "Banking"],
    sources: ["Reuters", "FT", "Bloomberg"],
    time: "8m ago",
    market: "NYSE",
    verified: true,
  },
  {
    id: 2,
    category: "legal",
    headline: "DOJ Launches Landmark Antitrust Probe into Big 4 Audit Firms",
    brief: "US regulators are examining whether Deloitte, PwC, KPMG and EY have engaged in anticompetitive practices in the audit market, potentially forcing structural separation.",
    tags: ["Antitrust", "Deloitte", "United States", "Compliance"],
    sources: ["WSJ", "Law360", "FT"],
    time: "34m ago",
    market: null,
    verified: true,
  },
  {
    id: 3,
    category: "markets",
    headline: "FTSE 100 Edges Higher as UK CPI Drops to 2.1%",
    brief: "London equities gained 0.4% after UK inflation printed below the Bank of England's 2.5% forecast, raising hopes for a June rate cut.",
    tags: ["Inflation", "United Kingdom", "LSE"],
    sources: ["BBC Business", "Reuters", "The Times"],
    time: "1h ago",
    market: "LSE",
    verified: true,
  },
  {
    id: 4,
    category: "finance",
    headline: "BlackRock Crosses $11 Trillion AUM After GIP Acquisition Closes",
    brief: "The world's largest asset manager completed its $12.5bn purchase of Global Infrastructure Partners, cementing its dominance in alternative asset management.",
    tags: ["BlackRock", "Asset Management", "M&A"],
    sources: ["Bloomberg", "FT", "Reuters"],
    time: "2h ago",
    market: "NYSE",
    verified: true,
  },
];

const NAV_ITEMS = [
  { id: "feed",    icon: "◈", label: "Feed"    },
  { id: "markets", icon: "▲", label: "Markets" },
  { id: "archive", icon: "⊟", label: "Archive" },
  { id: "profile", icon: "○", label: "Profile"  },
];

const PLANS = [
  {
    id: "student",
    label: "Student",
    icon: "🎓",
    tagline: "Ace your interviews & exams",
    description: "News explained simply, with context on why it matters for your studies, grad applications, and finance interviews.",
    features: ["Plain-English explanations", "Interview question links", "Case study breakdowns", "Key terms highlighted"],
    price: "Free · £4.99/mo Pro",
    accent: C.student,
  },
  {
    id: "pro",
    label: "Professional",
    icon: "⚖",
    tagline: "Precision intelligence for practitioners",
    description: "Technical depth, regulatory detail, and market data for lawyers, bankers, analysts, and fund managers.",
    features: ["Full regulatory citations", "Market data overlays", "Source document links", "Deal & case databases"],
    price: "£14.99/mo · £129/yr",
    accent: C.gold,
  },
];

const CATEGORY_COLORS = {
  breaking: C.red,
  legal:    "#A78BFA",
  markets:  C.blue,
  finance:  C.gold,
};

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div style={{ padding: "18px 0", borderBottom: `1px solid ${C.border}` }}>
      <div className="skeleton" style={{ height: 10, width: "30%", marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 16, width: "90%", marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 16, width: "70%", marginBottom: 14 }} />
      <div className="skeleton" style={{ height: 10, width: "50%", marginBottom: 12 }} />
      <div style={{ display: "flex", gap: 6 }}>
        <div className="skeleton" style={{ height: 22, width: 70, borderRadius: 100 }} />
        <div className="skeleton" style={{ height: 22, width: 90, borderRadius: 100 }} />
      </div>
    </div>
  );
}

function ArticleCard({ article, plan, detailLevel }) {
  const [expanded, setExpanded] = useState(false);
  const catColor = CATEGORY_COLORS[article.category] || C.gold;

  return (
    <div
      className="fade-up"
      onClick={() => setExpanded(e => !e)}
      style={{ padding: "18px 0", borderBottom: `1px solid ${C.border}`, cursor: "pointer" }}
    >
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {article.category === "breaking" && (
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: "0.12em",
              color: C.red, border: `1px solid ${C.red}`,
              padding: "2px 7px", borderRadius: 3,
              fontFamily: "'DM Sans', sans-serif",
            }}>BREAKING</span>
          )}
          <span style={{
            fontSize: 10, color: catColor,
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600, letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}>{article.category}</span>
        </div>
        <span style={{ fontSize: 11, color: C.textMid, fontFamily: "'DM Sans', sans-serif" }}>
          {article.time}
        </span>
      </div>

      {/* Headline */}
      <h3 style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: 17, fontWeight: 400, lineHeight: 1.35,
        color: C.text, marginBottom: detailLevel > 0 ? 10 : 12,
      }}>{article.headline}</h3>

      {/* Brief */}
      {detailLevel >= 1 && (
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13, lineHeight: 1.65, color: C.textMid, marginBottom: 12,
        }}>{article.brief}</p>
      )}

      {/* Student callout */}
      {plan === "student" && detailLevel >= 1 && expanded && (
        <div style={{
          background: `${C.student}12`, border: `1px solid ${C.student}30`,
          borderRadius: 8, padding: "10px 12px", marginBottom: 12,
        }}>
          <p style={{
            fontSize: 12, color: C.student,
            fontFamily: "'DM Sans', sans-serif", fontWeight: 600, marginBottom: 4,
          }}>🎓 Why this matters for you</p>
          <p style={{
            fontSize: 12, color: C.textMid,
            fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6,
          }}>
            This is a classic macro policy question. In interviews, expect: "How does a rate hold
            affect equity valuations?" — Use DCF logic: higher discount rates = lower present value
            of future cash flows.
          </p>
        </div>
      )}

      {/* Verification badge */}
      {article.verified && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          <span style={{ fontSize: 11, color: C.green, fontFamily: "'DM Sans', sans-serif" }}>✓ Verified</span>
          <span style={{ fontSize: 10, color: C.textDim, fontFamily: "'DM Sans', sans-serif" }}>
            {article.sources.join(" · ")}
          </span>
        </div>
      )}

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {article.tags.map(tag => (
          <span key={tag} className="tag-chip" style={{
            borderColor: C.border, color: C.textMid, background: "transparent", fontSize: 10,
          }}>{tag}</span>
        ))}
      </div>

      {/* Read more */}
      {expanded && (
        <p style={{
          marginTop: 12, fontSize: 12, color: C.gold,
          fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
        }}>
          Read full articles → Reuters · FT · Bloomberg
        </p>
      )}
    </div>
  );
}

// ─── PHASE 2: FILTER PANEL ────────────────────────────────────────────────────

function FilterPanel({ open, onClose, activeCategories, activeTags, detailLevel, onApply, plan }) {
  // Local draft state — committed only on Apply
  const [draftCats,   setDraftCats]   = useState(activeCategories);
  const [draftTags,   setDraftTags]   = useState(activeTags);
  const [draftDetail, setDraftDetail] = useState(detailLevel);

  // Sync draft when panel opens
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setDraftCats(activeCategories);
      setDraftTags(activeTags);
      setDraftDetail(detailLevel);
    }
  }

  const toggleCat = (cat) =>
    setDraftCats(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );

  const toggleTag = (tag) =>
    setDraftTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );

  const clearAll = () => {
    setDraftCats([]);
    setDraftTags([]);
    setDraftDetail(1);
  };

  const handleApply = () => {
    onApply(draftCats, draftTags, draftDetail);
    onClose();
  };

  const planAccent = plan === "student" ? C.student : C.gold;

  return (
    <div className={`filter-sheet${open ? " open" : ""}`}>
      {/* Handle bar */}
      <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: C.border }} />
      </div>

      {/* Header row */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "8px 20px 16px",
        borderBottom: `1px solid ${C.border}`,
      }}>
        <h3 style={{
          fontFamily: "'DM Serif Display', serif", fontSize: 20, color: C.text,
        }}>Filters</h3>
        <button onClick={clearAll} style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: 12, color: C.textMid, fontFamily: "'DM Sans', sans-serif",
          fontWeight: 500,
        }}>Clear all</button>
      </div>

      <div style={{ padding: "20px 20px 24px" }}>

        {/* ── Detail level ── */}
        <p style={{
          fontSize: 10, color: C.textDim, fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
          marginBottom: 10,
        }}>Detail Level</p>
        <div style={{
          display: "flex", background: C.bg, borderRadius: 8, padding: 3, gap: 2, marginBottom: 24,
        }}>
          {["Headlines", "Brief", "Full"].map((label, i) => (
            <button key={label} onClick={() => setDraftDetail(i)} style={{
              flex: 1, padding: "8px 0", borderRadius: 6, border: "none",
              background: draftDetail === i ? planAccent : "transparent",
              color: draftDetail === i ? (plan === "student" ? "#fff" : C.bg) : C.textMid,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12, fontWeight: draftDetail === i ? 600 : 400,
              cursor: "pointer", transition: "all 0.2s",
            }}>{label}</button>
          ))}
        </div>

        {/* ── Categories ── */}
        <p style={{
          fontSize: 10, color: C.textDim, fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
          marginBottom: 10,
        }}>Categories</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
          {FILTER_CATEGORIES.map(cat => {
            const active = draftCats.includes(cat);
            const color  = CATEGORY_COLORS[cat] || C.gold;
            return (
              <span
                key={cat}
                className="tag-chip"
                onClick={() => toggleCat(cat)}
                style={{
                  borderColor: active ? color : C.border,
                  color:       active ? color : C.textMid,
                  background:  active ? `${color}15` : "transparent",
                  fontSize: 12,
                }}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </span>
            );
          })}
        </div>

        {/* ── Tag groups ── */}
        {TAG_GROUPS.map(group => (
          <div key={group.label} style={{ marginBottom: 20 }}>
            <p style={{
              fontSize: 10, color: C.textDim, fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
              marginBottom: 10,
            }}>{group.label}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {group.tags.map(tag => {
                const active = draftTags.includes(tag);
                return (
                  <span
                    key={tag}
                    className="tag-chip"
                    onClick={() => toggleTag(tag)}
                    style={{
                      borderColor: active ? planAccent : C.border,
                      color:       active ? planAccent : C.textMid,
                      background:  active ? `${planAccent}15` : "transparent",
                      fontSize: 11,
                    }}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>
        ))}

        {/* Apply button */}
        <button
          className="primary-btn"
          onClick={handleApply}
          style={{
            marginTop: 8,
            background: `linear-gradient(135deg, ${planAccent}, ${plan === "pro" ? C.goldDim : "#3A5ECC"})`,
            color: plan === "student" ? "#fff" : C.bg,
          }}
        >
          Apply Filters
          {(draftCats.length + draftTags.length) > 0 &&
            ` (${draftCats.length + draftTags.length} active)`}
        </button>
      </div>
    </div>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────

function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);

  if (step === 0) {
    return (
      <div className="scale-in" style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "40px 24px", background: C.bg,
      }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 72, height: 72, borderRadius: 20,
            background: `linear-gradient(135deg, ${C.gold}20, ${C.gold}08)`,
            border: `1px solid ${C.gold}40`, marginBottom: 20, fontSize: 32,
          }}>⚖</div>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 42, color: C.text, letterSpacing: "-0.02em", marginBottom: 6,
          }}>LexStar</h1>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14, color: C.textMid, letterSpacing: "0.12em", textTransform: "uppercase",
          }}>Legal & Financial Intelligence</p>
        </div>

        {[
          { icon: "◈", text: "AI-curated news, verified across 3+ sources" },
          { icon: "▲", text: "Global markets & exchanges, live" },
          { icon: "⊟", text: "Student & Professional modes" },
        ].map((item, i) => (
          <div key={i} className="fade-up" style={{
            display: "flex", alignItems: "center", gap: 14,
            marginBottom: 18, animationDelay: `${0.1 + i * 0.08}s`,
          }}>
            <div style={{
              width: 36, height: 36, background: C.surface,
              border: `1px solid ${C.border}`, borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, color: C.gold, flexShrink: 0,
            }}>{item.icon}</div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.textMid, lineHeight: 1.5 }}>
              {item.text}
            </p>
          </div>
        ))}

        <div style={{ marginTop: 40 }}>
          <button className="primary-btn" onClick={() => setStep(1)} style={{
            background: `linear-gradient(135deg, ${C.gold}, ${C.goldDim})`, color: C.bg,
          }}>Get Started</button>
          <p style={{
            textAlign: "center", marginTop: 14, fontSize: 12, color: C.textDim,
            fontFamily: "'DM Sans', sans-serif",
          }}>No account needed to browse · Free plan available</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, padding: "48px 20px 32px", overflowY: "auto" }}>
      <div className="fade-up" style={{ textAlign: "center", marginBottom: 32 }}>
        <h2 style={{
          fontFamily: "'DM Serif Display', serif", fontSize: 28, color: C.text, marginBottom: 8,
        }}>How do you use LexStar?</h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.textMid, lineHeight: 1.6 }}>
          This shapes how news is presented to you. You can change it anytime.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
        {PLANS.map((plan, i) => (
          <div
            key={plan.id}
            className={`plan-card ${plan.id}${selectedPlan === plan.id ? " selected" : ""} fade-up`}
            style={{ animationDelay: `${i * 0.1}s` }}
            onClick={() => setSelectedPlan(plan.id)}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 24, marginBottom: 4 }}>{plan.icon}</div>
                <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: C.text }}>{plan.label}</h3>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12, color: plan.accent, fontWeight: 600, letterSpacing: "0.03em",
                }}>{plan.tagline}</p>
              </div>
              <div style={{
                width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                border: `2px solid ${selectedPlan === plan.id ? plan.accent : C.border}`,
                background: selectedPlan === plan.id ? plan.accent : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {selectedPlan === plan.id && (
                  <span style={{ fontSize: 11, color: C.bg, fontWeight: 700 }}>✓</span>
                )}
              </div>
            </div>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13, color: C.textMid, lineHeight: 1.6, marginBottom: 14,
            }}>{plan.description}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
              {plan.features.map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, color: plan.accent }}>→</span>
                  <span style={{ fontSize: 12, color: C.textMid, fontFamily: "'DM Sans', sans-serif" }}>{f}</span>
                </div>
              ))}
            </div>
            <p style={{
              fontSize: 11, color: C.textDim, fontFamily: "'DM Sans', sans-serif",
              borderTop: `1px solid ${C.border}`, paddingTop: 10, marginTop: 4,
            }}>{plan.price}</p>
          </div>
        ))}
      </div>

      <button
        className="primary-btn"
        disabled={!selectedPlan}
        onClick={() => selectedPlan && onComplete(selectedPlan)}
        style={{
          background: selectedPlan
            ? `linear-gradient(135deg, ${PLANS.find(p => p.id === selectedPlan)?.accent}, ${selectedPlan === "pro" ? C.goldDim : "#3A5ECC"})`
            : C.border,
          color: selectedPlan ? (selectedPlan === "student" ? "#fff" : C.bg) : C.textDim,
          cursor: selectedPlan ? "pointer" : "not-allowed",
        }}
      >
        {selectedPlan ? `Continue as ${PLANS.find(p => p.id === selectedPlan)?.label}` : "Select a plan to continue"}
      </button>
    </div>
  );
}

// ─── FEED SCREEN ──────────────────────────────────────────────────────────────

function FeedScreen({ plan, detailLevel, filteredArticles }) {
  const [loading] = useState(false);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}>
      {/* Feed header — detail toggle moved to filter panel */}
      <div style={{
        position: "sticky", top: 0, background: C.bg,
        paddingTop: 16, paddingBottom: 12,
        borderBottom: `1px solid ${C.border}`, zIndex: 10, marginBottom: 4,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="live-dot" />
            <span style={{
              fontSize: 11, color: C.green, fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600, letterSpacing: "0.08em",
            }}>LIVE FEED</span>
            <span style={{ fontSize: 10, color: C.textDim, fontFamily: "'DM Sans', sans-serif" }}>
              · {new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          <span style={{
            fontSize: 11,
            color: plan === "student" ? C.student : C.gold,
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            border: `1px solid ${plan === "student" ? C.student + "50" : C.gold + "50"}`,
            padding: "2px 8px", borderRadius: 4,
          }}>{plan === "student" ? "🎓 Student" : "⚖ Pro"}</span>
        </div>
      </div>

      {/* Articles */}
      <div>
        {loading
          ? [1, 2, 3].map(i => <SkeletonCard key={i} />)
          : filteredArticles.length > 0
            ? filteredArticles.map((a, i) => (
                <div key={a.id} style={{ animationDelay: `${i * 0.07}s` }}>
                  <ArticleCard article={a} plan={plan} detailLevel={detailLevel} />
                </div>
              ))
            : (
              <div style={{
                textAlign: "center", padding: "60px 20px",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 14,
                  background: C.surface, border: `1px solid ${C.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24, color: C.textDim,
                }}>◈</div>
                <p style={{
                  fontSize: 14, color: C.text, fontFamily: "'DM Serif Display', serif",
                }}>No articles match your filters</p>
                <p style={{
                  fontSize: 12, color: C.textMid, fontFamily: "'DM Sans', sans-serif",
                }}>Try clearing some filters above</p>
              </div>
            )
        }
      </div>

      {filteredArticles.length > 0 && (
        <p style={{
          textAlign: "center", padding: "24px 0 8px",
          fontSize: 11, color: C.textDim, fontFamily: "'DM Sans', sans-serif",
        }}>Phase 7 will connect live AI news here</p>
      )}
    </div>
  );
}

// ─── PHASE 3: MARKETS SCREEN ─────────────────────────────────────────────────

function getLocalTime(utcOffset) {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const local = new Date(utcMs + utcOffset * 3600000);
  return local.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function Sparkline({ values, positive }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 36 }}>
      {values.map((v, i) => {
        const heightPct = Math.max(((v - min) / range) * 100, 8);
        const isLast = i === values.length - 1;
        return (
          <div key={i} style={{
            width: 7,
            height: `${heightPct}%`,
            borderRadius: 3,
            background: isLast
              ? (positive ? C.green : C.red)
              : (positive ? `${C.green}40` : `${C.red}40`),
          }} />
        );
      })}
    </div>
  );
}

function MoverRow({ ticker }) {
  const pos = ticker.changePct >= 0;
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "9px 0",
      borderBottom: `1px solid ${C.border}`,
    }}>
      <div>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: C.text,
        }}>{ticker.symbol}</p>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: C.textMid, marginTop: 1,
        }}>{ticker.name}</p>
      </div>
      <span style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
        color: pos ? C.green : C.red,
      }}>
        {pos ? "+" : ""}{ticker.changePct.toFixed(2)}%
      </span>
    </div>
  );
}

function MarketNewsCard({ article }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      onClick={() => setExpanded(e => !e)}
      style={{
        minWidth: 230, maxWidth: 250,
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        padding: "14px 14px 12px",
        cursor: "pointer",
        flexShrink: 0,
        transition: "border-color 0.15s",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{
          fontSize: 9, color: C.blue, fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
        }}>Markets</span>
        <span style={{ fontSize: 10, color: C.textDim, fontFamily: "'DM Sans', sans-serif" }}>
          {article.time}
        </span>
      </div>
      <p style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: 14, lineHeight: 1.4, color: C.text,
      }}>{article.headline}</p>
      {expanded && (
        <div style={{ marginTop: 10 }}>
          {article.verified && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
              <span style={{ fontSize: 10, color: C.green, fontFamily: "'DM Sans', sans-serif" }}>✓ Verified</span>
              <span style={{ fontSize: 9, color: C.textDim, fontFamily: "'DM Sans', sans-serif" }}>
                {article.sources.join(" · ")}
              </span>
            </div>
          )}
          <p style={{ fontSize: 11, color: C.gold, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
            Read full articles →
          </p>
        </div>
      )}
    </div>
  );
}

function MarketsScreen() {
  const [activeExchange, setActiveExchange] = useState(EXCHANGES[0].id);
  const exchange = EXCHANGES.find(e => e.id === activeExchange) || EXCHANGES[0];
  const movers   = MARKET_MOVERS[activeExchange] || MARKET_MOVERS.nyse;
  const news     = MARKET_NEWS.filter(n => n.exchange === activeExchange);

  const positive = exchange.change >= 0;

  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      {/* Exchange tab bar */}
      <div style={{
        display: "flex",
        overflowX: "auto",
        padding: "12px 16px 0",
        borderBottom: `1px solid ${C.border}`,
        background: C.bg,
        position: "sticky", top: 0, zIndex: 10,
        gap: 0,
        scrollbarWidth: "none",
      }}>
        {EXCHANGES.map(ex => (
          <button
            key={ex.id}
            onClick={() => setActiveExchange(ex.id)}
            style={{
              flexShrink: 0,
              background: "none", border: "none",
              padding: "8px 14px 12px",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13, fontWeight: activeExchange === ex.id ? 600 : 400,
              color: activeExchange === ex.id ? C.gold : C.textDim,
              borderBottom: `2px solid ${activeExchange === ex.id ? C.gold : "transparent"}`,
              transition: "all 0.15s",
              whiteSpace: "nowrap",
            }}
          >{ex.name}</button>
        ))}
      </div>

      <div style={{ padding: "20px 20px 32px" }}>
        {/* Index card */}
        <div style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: "18px 18px 16px",
          marginBottom: 20,
        }}>
          {/* Exchange name + flag + local time */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                <span style={{ fontSize: 22 }}>{exchange.flag}</span>
                <span style={{
                  fontFamily: "'DM Serif Display', serif", fontSize: 18, color: C.text,
                }}>{exchange.fullName}</span>
              </div>
              <span style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: C.textMid,
              }}>{exchange.index}</span>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: C.textDim,
              }}>Local</span>
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.textMid, fontWeight: 500,
              }}>{getLocalTime(exchange.utcOffset)}</p>
            </div>
          </div>

          {/* Value + change */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <p style={{
                fontFamily: "'DM Serif Display', serif", fontSize: 32, color: C.text, lineHeight: 1,
              }}>
                {exchange.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
                  color: positive ? C.green : C.red,
                }}>
                  {positive ? "▲" : "▼"} {positive ? "+" : ""}
                  {exchange.change.toFixed(2)}
                </span>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                  color: positive ? C.green : C.red,
                }}>
                  ({positive ? "+" : ""}{exchange.changePct.toFixed(2)}%)
                </span>
              </div>
            </div>
            <Sparkline values={exchange.sparkline} positive={positive} />
          </div>

          {/* 7-day label */}
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: C.textDim, textAlign: "right",
          }}>7-day trend</p>
        </div>

        {/* Top movers */}
        <p style={{
          fontSize: 10, color: C.textDim, fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
          marginBottom: 12,
        }}>Top Movers</p>

        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          {/* Gainers */}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: C.green }}>▲</span>
              <span style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: C.green, fontWeight: 600,
              }}>Gainers</span>
            </div>
            {movers.gainers.map(t => <MoverRow key={t.symbol} ticker={t} />)}
          </div>

          {/* Vertical divider */}
          <div style={{ width: 1, background: C.border, flexShrink: 0 }} />

          {/* Losers */}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: C.red }}>▼</span>
              <span style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: C.red, fontWeight: 600,
              }}>Losers</span>
            </div>
            {movers.losers.map(t => <MoverRow key={t.symbol} ticker={t} />)}
          </div>
        </div>

        {/* Market news strip */}
        {news.length > 0 && (
          <>
            <p style={{
              fontSize: 10, color: C.textDim, fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
              marginBottom: 12,
            }}>Market News</p>
            <div style={{
              display: "flex", gap: 12,
              overflowX: "auto", paddingBottom: 4,
              scrollbarWidth: "none",
              marginLeft: -20, paddingLeft: 20,
              marginRight: -20, paddingRight: 20,
            }}>
              {news.map(article => (
                <MarketNewsCard key={article.id} article={article} />
              ))}
            </div>
          </>
        )}

        {!news.length && (
          <p style={{
            fontSize: 12, color: C.textDim, fontFamily: "'DM Sans', sans-serif",
            textAlign: "center", paddingTop: 8,
          }}>No market news for this exchange right now.</p>
        )}
      </div>
    </div>
  );
}

// ─── PLACEHOLDER SCREENS ──────────────────────────────────────────────────────

function PlaceholderScreen({ title, icon }) {
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: 40, gap: 16,
    }}>
      <div style={{
        fontSize: 40, color: C.textDim, width: 80, height: 80,
        background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>{icon}</div>
      <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: C.text }}>
        {title}
      </h3>
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13, color: C.textMid, textAlign: "center", lineHeight: 1.6,
      }}>Coming in a future phase. Check back soon.</p>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────

export default function LexStarApp() {
  const [onboarded, setOnboarded]             = useState(false);
  const [plan, setPlan]                       = useState(null);
  const [activeNav, setActiveNav]             = useState("feed");
  const [detailLevel, setDetailLevel]         = useState(1);

  // Phase 2 filter state
  const [filterOpen, setFilterOpen]           = useState(false);
  const [activeCategories, setActiveCategories] = useState([]);
  const [activeTags, setActiveTags]           = useState([]);

  const handleOnboardingComplete = (selectedPlan) => {
    setPlan(selectedPlan);
    setOnboarded(true);
  };

  const handleFilterApply = (cats, tags, detail) => {
    setActiveCategories(cats);
    setActiveTags(tags);
    setDetailLevel(detail);
  };

  // Derive filtered articles
  const filteredArticles = MOCK_ARTICLES.filter(a => {
    const catOk = activeCategories.length === 0 || activeCategories.includes(a.category);
    const tagOk = activeTags.length === 0       || a.tags.some(t => activeTags.includes(t));
    return catOk && tagOk;
  });

  const filterCount = activeCategories.length + activeTags.length;

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      background: C.bg,
      minHeight: "100vh",
      maxWidth: 430,
      margin: "0 auto",
      color: C.text,
      display: "flex",
      flexDirection: "column",
      position: "relative",   // needed for absolute filter sheet
      overflow: "hidden",
    }}>
      <style>{BASE_CSS}</style>

      {!onboarded ? (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      ) : (
        <>
          {/* App header */}
          <div style={{
            padding: "16px 20px 12px",
            borderBottom: `1px solid ${C.border}`,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            background: C.bg, position: "sticky", top: 0, zIndex: 20,
          }}>
            <span style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 24, color: C.gold, letterSpacing: "-0.02em",
            }}>LexStar</span>

            {/* Filter button with active badge */}
            <button
              onClick={() => setFilterOpen(true)}
              style={{
                background: filterCount > 0 ? `${C.gold}15` : C.surface,
                border: `1px solid ${filterCount > 0 ? C.gold + "60" : C.border}`,
                borderRadius: 8, padding: "6px 12px",
                color: filterCount > 0 ? C.gold : C.textMid,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
                transition: "all 0.2s",
              }}
            >
              <span>Filter</span>
              {filterCount > 0 ? (
                <span style={{
                  background: C.gold, color: C.bg,
                  fontSize: 10, fontWeight: 700,
                  width: 16, height: 16, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{filterCount}</span>
              ) : (
                <span style={{ color: C.gold }}>≡</span>
              )}
            </button>
          </div>

          {/* Screen content */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {activeNav === "feed"    && (
              <FeedScreen
                plan={plan}
                detailLevel={detailLevel}
                filteredArticles={filteredArticles}
              />
            )}
            {activeNav === "markets" && <MarketsScreen />}
            {activeNav === "archive" && <PlaceholderScreen title="Archive"  icon="⊟" />}
            {activeNav === "profile" && <PlaceholderScreen title="Profile"  icon="○" />}
          </div>

          {/* Bottom navigation */}
          <div style={{
            display: "flex", borderTop: `1px solid ${C.border}`,
            background: C.surface, padding: "8px 0 4px",
            position: "sticky", bottom: 0, zIndex: 20,
          }}>
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                className={`nav-btn${activeNav === item.id ? " active" : ""}`}
                onClick={() => setActiveNav(item.id)}
              >
                <span className="nav-icon" style={{
                  fontSize: 18, color: activeNav === item.id ? C.gold : C.textDim, transition: "color 0.2s",
                }}>{item.icon}</span>
                <span className="nav-label" style={{
                  fontSize: 10, color: activeNav === item.id ? C.gold : C.textDim,
                  fontWeight: activeNav === item.id ? 600 : 400,
                  letterSpacing: "0.05em", transition: "color 0.2s",
                }}>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Filter overlay */}
          <div
            className={`filter-overlay${filterOpen ? " open" : ""}`}
            onClick={() => setFilterOpen(false)}
          />

          {/* Filter panel */}
          <FilterPanel
            open={filterOpen}
            onClose={() => setFilterOpen(false)}
            activeCategories={activeCategories}
            activeTags={activeTags}
            detailLevel={detailLevel}
            onApply={handleFilterApply}
            plan={plan}
          />
        </>
      )}
    </div>
  );
}
