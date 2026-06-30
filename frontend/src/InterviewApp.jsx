import { useState, useReducer, useEffect, useRef, useCallback } from "react";

// ─── ENV + CONSTANTS ──────────────────────────────────────────────────────────
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const MODEL          = "gemini-flash-latest";
const API_BASE       = "https://generativelanguage.googleapis.com/v1beta/models";
const EXP_LEVELS     = ["Fresher", "1-3 yrs", "3-5 yrs", "5+ yrs"];
const INT_TYPES      = ["Technical", "HR", "System Design", "Behavioral"];

// ─── COLOR TOKENS ─────────────────────────────────────────────────────────────
const T = {
  bgBase:      "#0d0f1a",
  bgCard:      "#161929",
  bgElevated:  "#1e2235",
  accent:      "#6c63ff",
  accentDim:   "#6c63ff33",
  gold:        "#f59e0b",
  success:     "#10b981",
  warning:     "#f59e0b",
  danger:      "#ef4444",
  textPrimary: "#f0f2ff",
  textMuted:   "#8b8fa8",
  border:      "#1e2235",
  borderMid:   "#2a2f45",
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function parseGemini(data) {
  try { return data.candidates[0].content.parts.map(p => p.text).join(""); }
  catch { throw new Error("Could not parse response from Gemini API."); }
}
function stripFences(raw) {
  return raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
}
// Closes truncated JSON from Gemini (unterminated strings / unclosed brackets)
function tryRepairJSON(raw) {
  let s = stripFences(raw);
  // Fast path — valid as-is
  try { return JSON.parse(s); } catch {}
  // Walk chars to find unclosed strings and brackets
  let inStr = false, esc = false;
  const stack = [];
  for (const ch of s) {
    if (esc)      { esc = false; continue; }
    if (ch === '\\' && inStr) { esc = true; continue; }
    if (ch === '"' && !esc)  { inStr = !inStr; continue; }
    if (!inStr) {
      if (ch === '{') stack.push('}');
      else if (ch === '[') stack.push(']');
      else if (ch === '}' || ch === ']') stack.pop();
    }
  }
  if (inStr) s += '"';            // close open string
  s += stack.reverse().join('');  // close open brackets / braces
  try { return JSON.parse(s); } catch (e) {
    throw new Error(`AI response was cut off and could not be repaired: ${e.message}`);
  }
}
async function callGemini(sys, msg) {
  const res = await fetch(`${API_BASE}/${MODEL}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-goog-api-key": GEMINI_API_KEY },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: sys }] },
      contents: [{ role: "user", parts: [{ text: msg }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
    }),
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e?.error?.message || `API error ${res.status}`);
  }
  return res.json();
}
function fmtTime(s) {
  return `${Math.floor(s/60).toString().padStart(2,"0")}:${(s%60).toString().padStart(2,"0")}`;
}

// ─── SESSION REDUCER ──────────────────────────────────────────────────────────
const S0 = { answers: {} };
function sessionReducer(state, action) {
  switch (action.type) {
    case "SET_TEXT":     return { ...state, answers: { ...state.answers, [action.idx]: { ...(state.answers[action.idx]||{}), text: action.text, submitted: false } } };
    case "SET_FEEDBACK": return { ...state, answers: { ...state.answers, [action.idx]: { ...(state.answers[action.idx]||{}), feedback: action.feedback, submitted: true } } };
    case "RESET":        return S0;
    default:             return state;
  }
}

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{font-family:'Inter',system-ui,sans-serif;background:#0d0f1a;color:#f0f2ff;}

@keyframes fadeUp   {from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn   {from{opacity:0}to{opacity:1}}
@keyframes scaleIn  {from{opacity:0;transform:scale(.88)}to{opacity:1;transform:scale(1)}}
@keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
@keyframes bounceIn {0%{opacity:0;transform:scale(.5)}60%{transform:scale(1.07)}80%{transform:scale(.97)}100%{opacity:1;transform:scale(1)}}
@keyframes spin     {to{transform:rotate(360deg)}}
@keyframes drawRing {from{stroke-dashoffset:251.2}}
@keyframes glowPulse{0%,100%{opacity:.08;transform:scale(1)}50%{opacity:.28;transform:scale(1.18)}}
@keyframes floatA   {0%,100%{transform:translate(0,0)}33%{transform:translate(45px,-30px)}66%{transform:translate(-22px,18px)}}
@keyframes floatB   {0%,100%{transform:translate(0,0)}50%{transform:translate(-55px,38px)}}
@keyframes floatC   {0%,100%{transform:translate(0,0)}50%{transform:translate(32px,-42px)}}
@keyframes confetti {0%{transform:translateY(-10px) rotate(0deg);opacity:1}100%{transform:translateY(105vh) rotate(720deg);opacity:0}}
@keyframes shake    {0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-5px)}40%,80%{transform:translateX(5px)}}
@keyframes numPop   {from{opacity:0;transform:scale(.5)}to{opacity:1;transform:scale(1)}}

.fu {animation:fadeUp .5s ease-out both}
.fu1{animation:fadeUp .5s .08s ease-out both}
.fu2{animation:fadeUp .5s .16s ease-out both}
.fu3{animation:fadeUp .5s .24s ease-out both}
.fu4{animation:fadeUp .5s .32s ease-out both}
.fu5{animation:fadeUp .5s .40s ease-out both}
.fu6{animation:fadeUp .5s .48s ease-out both}
.fu7{animation:fadeUp .5s .56s ease-out both}
.fi {animation:fadeIn .35s ease-out both}
.si {animation:scaleIn .4s cubic-bezier(.175,.885,.32,1.275) both}
.bi {animation:bounceIn .6s cubic-bezier(.175,.885,.32,1.275) both}
.sd {animation:slideDown .3s ease-out both}
.np {animation:numPop .4s cubic-bezier(.175,.885,.32,1.275) both}
.orb-a{animation:floatA 18s ease-in-out infinite}
.orb-b{animation:floatB 23s ease-in-out infinite}
.orb-c{animation:floatC 15s ease-in-out infinite}
.orb-glow{animation:glowPulse 5s ease-in-out infinite}
.spinner{animation:spin .75s linear infinite}

.grad-headline{
  background:linear-gradient(135deg,#f0f2ff 0%,#6c63ff 100%);
  -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;
}

.card{background:#161929;border:1px solid #1e2235;border-radius:16px;transition:border-color .2s,box-shadow .2s;}
.card-hover:hover{border-color:#6c63ff66;box-shadow:0 0 22px #6c63ff22;}
.card-lift{background:#161929;border:1px solid #1e2235;border-radius:16px;transition:transform .3s cubic-bezier(.34,1.56,.64,1),border-color .2s,box-shadow .2s;}
.card-lift:hover{transform:translateY(-5px);border-color:#6c63ff55;box-shadow:0 22px 50px rgba(0,0,0,.45),0 0 22px #6c63ff22;}

.btn-primary{background:linear-gradient(135deg,#6c63ff,#8b5cf6);color:#f0f2ff;border:none;border-radius:12px;font-family:Inter,sans-serif;font-weight:700;cursor:pointer;transition:transform .2s,box-shadow .2s;}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 0 32px #6c63ff66,0 10px 28px #6c63ff44;}
.btn-primary:active{transform:translateY(0);box-shadow:none;}
.btn-primary:disabled{opacity:.42;cursor:not-allowed;transform:none!important;box-shadow:none!important;}

.btn-ghost{background:#1e2235;color:#8b8fa8;border:1px solid #2a2f45;border-radius:10px;font-family:Inter,sans-serif;font-weight:500;cursor:pointer;transition:all .2s;}
.btn-ghost:hover{background:#252a40;color:#f0f2ff;border-color:#3a3f55;}

.inp{background:#1e2235!important;border:1px solid #2a2f45;border-radius:10px;padding:12px 16px;color:#f0f2ff;font-family:Inter,sans-serif;font-size:14px;transition:border-color .2s,box-shadow .2s;outline:none;width:100%;}
.inp:focus{border-color:#6c63ff;box-shadow:0 0 0 3px #6c63ff22;}
.inp::placeholder{color:#3a3f58;}
.inp.err{border-color:#ef4444;animation:shake .4s ease;}

.pill{padding:8px 16px;border-radius:8px;border:1px solid #2a2f45;background:#1e2235;color:#8b8fa8;font-size:13px;font-weight:500;cursor:pointer;transition:all .2s;font-family:Inter,sans-serif;}
.pill:hover{border-color:#3a3f55;color:#f0f2ff;}
.pill.on{background:#6c63ff18;border-color:#6c63ff55;color:#b5b0ff;box-shadow:0 0 12px #6c63ff22;}

.type-btn{padding:10px 8px;border-radius:10px;border:1px solid #2a2f45;background:#1e2235;color:#8b8fa8;font-size:13px;font-weight:500;cursor:pointer;transition:all .2s;text-align:center;font-family:Inter,sans-serif;}
.type-btn:hover{border-color:#3a3f55;color:#f0f2ff;}
.type-btn.on{background:#6c63ff18;border-color:#6c63ff55;color:#b5b0ff;}

.tag-chip{display:inline-flex;align-items:center;gap:5px;padding:4px 10px 4px 10px;border-radius:6px;background:#6c63ff18;border:1px solid #6c63ff33;color:#a09bff;font-size:12px;font-weight:600;animation:scaleIn .25s cubic-bezier(.175,.885,.32,1.275) both;}

.score-ring-fill{stroke-dasharray:251.2;transition:stroke-dashoffset 1.3s cubic-bezier(.4,0,.2,1);transform:rotate(-90deg);transform-origin:50% 50%;}

.q-card{background:#161929;border:1px solid #1e2235;border-radius:14px;padding:20px 22px;transition:border-color .2s;}
.q-card.done{background:#10b98108;border-color:#10b98128;}

.err-box{background:#ef444410;border:1px solid #ef444430;border-radius:10px;padding:14px 16px;display:flex;align-items:flex-start;gap:10px;}
.success-box{background:#10b98110;border:1px solid #10b98130;border-radius:10px;padding:14px 16px;}
.warn-box{background:#f59e0b10;border:1px solid #f59e0b30;border-radius:10px;padding:14px 16px;}

::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-track{background:#0d0f1a;}
::-webkit-scrollbar-thumb{background:#2a2f45;border-radius:4px;}
::-webkit-scrollbar-thumb:hover{background:#6c63ff;}

@media(max-width:640px){
  .feat-grid{grid-template-columns:1fr!important;}
  .steps-grid{grid-template-columns:1fr 1fr!important;}
  .sum-grid{grid-template-columns:1fr!important;}
  .trust-row{flex-direction:column;align-items:flex-start!important;gap:10px!important;}
}
`;

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
const IconLogo = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <polygon points="18,2 32,10 32,26 18,34 4,26 4,10" fill="#6c63ff" opacity="0.15" stroke="#6c63ff" strokeWidth="1.5"/>
    <polyline points="8,20 13,20 15,14 18,24 21,12 23,20 28,20" fill="none" stroke="#6c63ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="7" fill="#10b981" opacity="0.2"/>
    <polyline points="3.5,7 6,9.5 10.5,4.5" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconTarget = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="#6c63ff" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="5" stroke="#6c63ff" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="1.5" fill="#6c63ff"/>
    <line x1="12" y1="3" x2="12" y2="6" stroke="#6c63ff" strokeWidth="1.5"/>
    <line x1="12" y1="18" x2="12" y2="21" stroke="#6c63ff" strokeWidth="1.5"/>
    <line x1="3" y1="12" x2="6" y2="12" stroke="#6c63ff" strokeWidth="1.5"/>
    <line x1="18" y1="12" x2="21" y2="12" stroke="#6c63ff" strokeWidth="1.5"/>
  </svg>
);

const IconBolt = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <polygon points="13,2 4,14 12,14 11,22 20,10 12,10" fill="#f59e0b" opacity="0.85"/>
  </svg>
);

const IconBars = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="14" width="4" height="7" rx="1" fill="#6c63ff" opacity="0.6"/>
    <rect x="10" y="9" width="4" height="12" rx="1" fill="#6c63ff" opacity="0.8"/>
    <rect x="17" y="4" width="4" height="17" rx="1" fill="#6c63ff"/>
  </svg>
);

const IconWarning = ({ size = 15, color = T.danger }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    <line x1="12" y1="9" x2="12" y2="13" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="12" y1="17" x2="12.01" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const IconCheckCircle = ({ size = 14, color = T.success }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5"/>
    <polyline points="7,12 10,15 17,9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconArrowLeft = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M19 12H5M12 19l-7-7 7-7" stroke={T.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconChevronDown = ({ open }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ transition: "transform .25s", transform: open ? "rotate(180deg)" : "none" }}>
    <path d="M6 9l6 6 6-6" stroke={T.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconClock = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={T.textMuted} strokeWidth="1.5"/>
    <polyline points="12,6 12,12 16,14" stroke={T.textMuted} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconRefresh = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <polyline points="1,4 1,10 7,10" stroke={T.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.51 15a9 9 0 102.13-9.36L1 10" stroke={T.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconLightbulb = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M9 21h6M12 3a6 6 0 016 6c0 2.22-1.21 4.16-3 5.2V17H9v-2.8A6 6 0 0112 3z" stroke={T.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconTrophy = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M6 9H4a2 2 0 01-2-2V5a1 1 0 011-1h2M18 9h2a2 2 0 002-2V5a1 1 0 00-1-1h-2" stroke={T.gold} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6 2h12v8a6 6 0 01-12 0V2z" stroke={T.gold} strokeWidth="1.5"/>
    <path d="M12 16v4M8 20h8" stroke={T.gold} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconBriefcase = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="7" width="20" height="14" rx="2" stroke={T.textMuted} strokeWidth="1.5"/>
    <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke={T.textMuted} strokeWidth="1.5"/>
    <line x1="12" y1="12" x2="12" y2="12.01" stroke={T.textMuted} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// ─── SPINNER ──────────────────────────────────────────────────────────────────
function Spinner({ size = 18, color = "white" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="spinner" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" strokeOpacity="0.18"/>
      <path d="M12 2a10 10 0 0110 10" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

// ─── SCORE RING ───────────────────────────────────────────────────────────────
function ScoreRing({ score, size = 96 }) {
  const r = 40, circ = 2 * Math.PI * r;
  const [offset, setOffset] = useState(circ);
  const col = score >= 8 ? T.success : score >= 5 ? T.warning : T.danger;
  useEffect(() => { const t = setTimeout(() => setOffset(circ - (score / 10) * circ), 80); return () => clearTimeout(t); }, [score]);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#ffffff0d" strokeWidth="9"/>
      <circle cx="50" cy="50" r={r} fill="none" stroke={col} strokeWidth="9" strokeLinecap="round"
        className="score-ring-fill" style={{ strokeDashoffset: offset, filter: `drop-shadow(0 0 8px ${col}88)` }}/>
      <text x="50" y="47" textAnchor="middle" dominantBaseline="middle" fill={T.textPrimary}
        style={{ fontSize: 21, fontWeight: 700, fontFamily: "Inter,sans-serif" }}>{score}</text>
      <text x="50" y="63" textAnchor="middle" fill={T.textMuted}
        style={{ fontSize: 11, fontFamily: "Inter,sans-serif" }}>/10</text>
    </svg>
  );
}

// ─── SCORE BADGE ──────────────────────────────────────────────────────────────
function ScoreBadge({ score }) {
  const [col, glow] =
    score >= 8 ? [{ bg: "#10b98118", border: "#10b98140", text: "#34d399" }, "0 0 12px #10b98133"]
    : score >= 5 ? [{ bg: "#f59e0b18", border: "#f59e0b40", text: "#fcd34d" }, "0 0 12px #f59e0b33"]
    : [{ bg: "#ef444418", border: "#ef444440", text: "#f87171" }, "0 0 12px #ef444433"];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "3px 10px", borderRadius: 99, background: col.bg, border: `1px solid ${col.border}`, color: col.text, fontSize: 13, fontWeight: 700, boxShadow: glow }}>
      {score}<span style={{ color: T.textMuted, fontWeight: 400, fontSize: 11 }}>/10</span>
    </span>
  );
}

// ─── ANIMATED BACKGROUND ──────────────────────────────────────────────────────
function AnimatedBackground() {
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 65% 45% at 25% 20%, #6c63ff14 0%, transparent 60%), radial-gradient(ellipse 55% 40% at 80% 75%, #8b5cf610 0%, transparent 60%)` }}/>
      <div className="orb-a" style={{ position: "absolute", top: "6%", left: "6%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,#6c63ff18 0%,transparent 70%)", filter: "blur(72px)" }}/>
      <div className="orb-b" style={{ position: "absolute", bottom: "8%", right: "4%", width: 580, height: 580, borderRadius: "50%", background: "radial-gradient(circle,#8b5cf612 0%,transparent 70%)", filter: "blur(88px)" }}/>
      <div className="orb-c" style={{ position: "absolute", top: "42%", left: "44%", width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle,#6c63ff0e 0%,transparent 70%)", filter: "blur(60px)" }}/>
    </div>
  );
}

// ─── CONFETTI ─────────────────────────────────────────────────────────────────
function Confetti() {
  const pieces = Array.from({ length: 55 }, (_, i) => ({
    id: i, x: Math.random() * 100, delay: Math.random() * 2.5,
    dur: 2.2 + Math.random() * 2, size: 5 + Math.random() * 7,
    color: ["#6c63ff","#b5b0ff","#10b981","#f59e0b","#60a5fa","#f87171","#a78bfa"][Math.floor(Math.random() * 7)],
    br: Math.random() > 0.45 ? "50%" : "2px",
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 200 }}>
      {pieces.map(p => (
        <div key={p.id} style={{ position: "absolute", left: `${p.x}%`, top: -16,
          width: p.size, height: p.size, background: p.color, borderRadius: p.br, opacity: 0,
          animation: `confetti ${p.dur}s ${p.delay}s ease-in forwards` }}/>
      ))}
    </div>
  );
}

// ─── COLLAPSIBLE ──────────────────────────────────────────────────────────────
function Collapsible({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: `1px solid ${T.borderMid}`, borderRadius: 10, overflow: "hidden" }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: open ? "#6c63ff0c" : T.bgElevated, border: "none", cursor: "pointer", transition: "background .2s", color: T.textMuted, fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 500 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}><IconLightbulb /> {title}</span>
        <IconChevronDown open={open} />
      </button>
      {open && (
        <div className="sd" style={{ padding: "14px 16px", background: "#0d0f1a80", borderTop: `1px solid ${T.borderMid}`, fontSize: 13, lineHeight: 1.7, color: T.textMuted }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ─── TAG INPUT ────────────────────────────────────────────────────────────────
function TagInput({ tags, onAdd, onRemove, placeholder, error }) {
  const [val, setVal] = useState("");
  const handleKey = e => {
    if (e.key === "Enter") { e.preventDefault(); const v = val.trim(); if (v && !tags.includes(v)) { onAdd(v); setVal(""); } }
    if (e.key === "Backspace" && !val && tags.length) onRemove(tags[tags.length - 1]);
  };
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", minHeight: 50, padding: "8px 12px", background: T.bgElevated, border: `1px solid ${error ? T.danger : T.borderMid}`, borderRadius: 10, transition: "border-color .2s, box-shadow .2s", animation: error ? "shake .4s ease" : "none" }}>
        {tags.map(t => (
          <span key={t} className="tag-chip">
            {t}
            <button onClick={() => onRemove(t)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6c63ff88", fontSize: 15, lineHeight: 1, padding: 0, display: "flex" }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 1l8 8M9 1L1 9" stroke="#6c63ffaa" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          </span>
        ))}
        <input className="inp" style={{ flex: 1, minWidth: 130, background: "transparent !important", border: "none !important", padding: "2px 4px", boxShadow: "none !important" }}
          placeholder={tags.length === 0 ? placeholder : "Add more..."}
          value={val} onChange={e => setVal(e.target.value)} onKeyDown={handleKey}/>
      </div>
      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, fontSize: 12, color: T.danger }}>
          <IconWarning size={12}/> {error}
        </div>
      )}
    </div>
  );
}

// ─── FEEDBACK PANEL ───────────────────────────────────────────────────────────
function FeedbackPanel({ feedback }) {
  return (
    <div className="fi" style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div className="bi"><ScoreRing score={feedback.score} size={92}/></div>
        <div>
          <p style={{ fontSize: 11, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 4 }}>Your Score</p>
          <p className="np" style={{ fontSize: 22, fontWeight: 800, color: T.textPrimary }}>
            {feedback.score >= 8 ? "Excellent" : feedback.score >= 5 ? "Good Work" : "Keep Practicing"}
          </p>
          <p style={{ fontSize: 13, color: T.textMuted, marginTop: 4 }}>
            {feedback.score >= 8 ? "Strong answer — well done." : feedback.score >= 5 ? "Solid, with room to grow." : "Study this topic more deeply."}
          </p>
        </div>
      </div>

      {feedback.strengths?.length > 0 && (
        <div className="success-box fu1">
          <p style={{ fontSize: 11, fontWeight: 700, color: T.success, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Strengths</p>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
            {feedback.strengths.map((s, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: T.textPrimary, lineHeight: 1.55 }}>
                <div style={{ marginTop: 1 }}><IconCheckCircle size={14} color={T.success}/></div> {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {feedback.improvements?.length > 0 && (
        <div className="warn-box fu2">
          <p style={{ fontSize: 11, fontWeight: 700, color: T.warning, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Improvements</p>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
            {feedback.improvements.map((s, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: T.textPrimary, lineHeight: 1.55 }}>
                <div style={{ marginTop: 1 }}><IconWarning size={14} color={T.warning}/></div> {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {feedback.ideal_answer_hint && (
        <div className="fu3">
          <Collapsible title="Ideal Answer Hint">
            <p style={{ color: T.textPrimary }}>{feedback.ideal_answer_hint}</p>
          </Collapsible>
        </div>
      )}
    </div>
  );
}

// ─── ANSWER PANEL ─────────────────────────────────────────────────────────────
function AnswerPanel({ idx, question, session, dispatch }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const state     = session.answers[idx] || {};
  const text      = state.text || "";
  const feedback  = state.feedback || null;
  const submitted = state.submitted || false;

  const handleFeedback = useCallback(async () => {
    if (!text.trim()) { setError("Please write your answer before requesting feedback."); return; }
    setError(""); setLoading(true);
    try {
      const sys = `You are a senior technical interviewer. Evaluate the answer and respond ONLY with valid JSON (no markdown fences):\n{"score":7,"strengths":["…"],"improvements":["…"],"ideal_answer_hint":"…"}\nscore: integer 1–10. All fields required.`;
      const data = await callGemini(sys, `Interview Question: ${question}\n\nCandidate Answer: ${text}`);
      const parsed = tryRepairJSON(parseGemini(data));
      dispatch({ type: "SET_FEEDBACK", idx, feedback: parsed });
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  }, [idx, question, text, dispatch]);

  return (
    <div className="sd" style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${T.borderMid}`, display: "flex", flexDirection: "column", gap: 12, marginLeft: 0 }}>
      <div style={{ position: "relative" }}>
        <textarea className="inp" rows={4}
          style={{ resize: "vertical", minHeight: 96, paddingBottom: 28 }}
          placeholder="Write a thorough, structured answer..."
          value={text}
          onChange={e => dispatch({ type: "SET_TEXT", idx, text: e.target.value })}
          disabled={submitted}
        />
        <span style={{ position: "absolute", bottom: 10, right: 12, fontSize: 11, color: "#2a2f45", fontVariantNumeric: "tabular-nums" }}>{text.length}</span>
      </div>

      {error && (
        <div className="err-box fi">
          <IconWarning size={14}/>
          <span style={{ fontSize: 13, color: "#fca5a5" }}>{error}</span>
        </div>
      )}

      {!submitted && (
        <button className="btn-primary" onClick={handleFeedback} disabled={loading || !text.trim()}
          style={{ alignSelf: "flex-start", padding: "10px 20px", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
          {loading ? <><Spinner size={15}/>Evaluating...</> : "Get AI Feedback"}
        </button>
      )}

      {submitted && feedback && <FeedbackPanel feedback={feedback}/>}
    </div>
  );
}

// ─── QUESTION CARD ────────────────────────────────────────────────────────────
function QuestionCard({ idx, question, session, dispatch }) {
  const [open, setOpen] = useState(false);
  const answered = session.answers[idx]?.submitted || false;
  const score    = session.answers[idx]?.feedback?.score;

  return (
    <div className={`q-card${answered ? " done" : ""}`}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        {/* Number chip — fixed 34px */}
        <div style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, border: `1px solid ${answered ? T.success + "44" : T.accent + "44"}`, background: answered ? T.success + "18" : T.accent + "18", color: answered ? T.success : "#b5b0ff" }}>
          {answered ? <IconCheckCircle size={16} color={T.success}/> : idx + 1}
        </div>
        {/* Content column aligned with chip right edge */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, lineHeight: 1.65, color: T.textPrimary, fontWeight: 500 }}>{question}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
            {!open && !answered && (
              <button onClick={() => setOpen(true)} className="btn-ghost"
                style={{ padding: "7px 16px", fontSize: 13 }}>
                Answer This
              </button>
            )}
            {answered && score !== undefined && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ScoreBadge score={score}/>
                <span style={{ fontSize: 12, color: T.textMuted }}>answered</span>
              </div>
            )}
          </div>
          {(open || answered) && <AnswerPanel idx={idx} question={question} session={session} dispatch={dispatch}/>}
        </div>
      </div>
    </div>
  );
}

// ─── SESSION SUMMARY ──────────────────────────────────────────────────────────
function SessionSummary({ questions, session, elapsed, onRestart }) {
  const scores  = Object.values(session.answers).map(a => a.feedback?.score).filter(Boolean);
  const avg     = scores.length ? (scores.reduce((a,b)=>a+b,0)/scores.length).toFixed(1) : "—";
  const best    = scores.length ? Math.max(...scores) : null;
  const worst   = scores.length ? Math.min(...scores) : null;
  const bestIdx = scores.indexOf(best);
  const worstIdx= scores.lastIndexOf(worst);
  const avgN    = parseFloat(avg);
  const avgCol  = avgN >= 8 ? T.success : avgN >= 5 ? T.warning : T.danger;

  return (
    <div className="bi" style={{ background: "#6c63ff08", border: "1px solid #6c63ff28", borderRadius: 16, padding: 28 }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ width: 60, height: 60, borderRadius: 14, background: T.gold + "18", border: `1px solid ${T.gold}33`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
          <IconTrophy size={28}/>
        </div>
        <p style={{ fontSize: 22, fontWeight: 800, color: T.textPrimary, fontFamily: "Inter,sans-serif" }}>Session Complete</p>
        <p style={{ fontSize: 13, color: T.textMuted, marginTop: 6 }}>
          {questions.length} questions answered in <span style={{ fontFamily: "monospace", color: T.textPrimary }}>{fmtTime(elapsed)}</span>
        </p>
      </div>

      <div className="sum-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
        {[["Avg Score", avg, avgCol], ["Best", best ?? "—", T.success], ["Lowest", worst ?? "—", T.danger]].map(([l,v,c]) => (
          <div key={l} style={{ textAlign: "center", background: T.bgCard, border: `1px solid ${T.borderMid}`, borderRadius: 12, padding: "16px 8px" }}>
            <p style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{l}</p>
            <p className="np" style={{ fontSize: 26, fontWeight: 800, color: c }}>{v}</p>
          </div>
        ))}
      </div>

      {bestIdx >= 0 && questions[bestIdx] && (
        <div className="success-box fu2" style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: T.success, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Strongest Area</p>
          <p style={{ fontSize: 13, color: T.textPrimary, lineHeight: 1.55 }}>{questions[bestIdx]}</p>
        </div>
      )}
      {worstIdx >= 0 && worstIdx !== bestIdx && questions[worstIdx] && (
        <div className="err-box fu3" style={{ marginBottom: 20 }}>
          <div/>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.danger, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Needs More Practice</p>
            <p style={{ fontSize: 13, color: T.textPrimary, lineHeight: 1.55 }}>{questions[worstIdx]}</p>
          </div>
        </div>
      )}

      <button className="btn-primary fu4" onClick={onRestart}
        style={{ width: "100%", padding: "14px", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <IconRefresh size={15}/> Start New Session
      </button>
    </div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage({ onStart }) {
  const FEATURES = [
    { Icon: IconTarget, title: "AI-Tailored Questions", desc: "5 custom questions generated from your exact role and stack.", iconBg: "#6c63ff15" },
    { Icon: IconBolt,   title: "Instant AI Feedback",   desc: "Scored 1–10 with strengths, gaps, and model answers.",        iconBg: "#f59e0b12" },
    { Icon: IconBars,   title: "Session Analytics",     desc: "Track your score trend and weak areas across the session.",    iconBg: "#6c63ff15" },
  ];
  const STEPS = [
    { n: "01", title: "Set Your Profile",   desc: "Enter your target role, experience level, and tech stack." },
    { n: "02", title: "Get AI Questions",   desc: "Gemini generates 5 tailored interview questions instantly." },
    { n: "03", title: "Answer & Evaluate",  desc: "Write your answers and receive real-time AI scoring." },
    { n: "04", title: "Review Your Session",desc: "View your overall score, strengths, and areas to improve." },
  ];

  return (
    <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: T.bgBase + "e8", borderBottom: `1px solid ${T.border}`, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", width: "100%", padding: "0 28px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <IconLogo/>
            <span style={{ fontSize: 20, fontWeight: 700, color: T.textPrimary, fontFamily: "Inter,sans-serif", letterSpacing: -0.3 }}>CodePulse</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 12, color: T.textMuted, padding: "5px 14px", borderRadius: 99, background: T.bgElevated, border: "1px solid #6c63ff44", lineHeight: 1 }}>AI Interview Prep</span>
            <button className="btn-primary" onClick={onStart} style={{ padding: "9px 22px", fontSize: 14 }}>Start Now</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "80px 20px 60px" }}>
        <div className="fu" style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent, display: "inline-block", boxShadow: `0 0 8px ${T.accent}` }}/>
          Powered by Google Gemini
        </div>

        <h1 className="grad-headline fu1" style={{ fontSize: "clamp(2.2rem,6vw,4rem)", fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.1, marginBottom: 20, maxWidth: 760 }}>
          Ace Your Next Interview
        </h1>

        <p className="fu2" style={{ fontSize: 18, color: T.textMuted, marginBottom: 36, maxWidth: 520, lineHeight: 1.6 }}>
          5 tailored questions. Instant AI scoring. Zero signup.
        </p>

        <div className="fu3" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 56 }}>
          <button className="btn-primary" onClick={onStart} style={{ padding: "14px 32px", fontSize: 16, boxShadow: `0 0 24px #6c63ff55` }}>
            Start Free Session
          </button>
          <div className="trust-row" style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
            {["No signup", "No credit card", "Instant AI"].map((label, i) => (
              <span key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: T.textMuted }}>
                {i > 0 && <span style={{ color: "#2a2f45", fontSize: 18 }}>·</span>}
                <IconCheck/> {label}
              </span>
            ))}
          </div>
        </div>

        {/* Stat row */}
        <div className="fu4" style={{ display: "flex", flexWrap: "wrap", gap: 36, justifyContent: "center", marginBottom: 64 }}>
          {[["5", "AI Questions"], ["1–10", "Scored Answers"], ["4", "Interview Types"], ["Free", "Always"]].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <p style={{ fontSize: 28, fontWeight: 900, color: T.accent, fontFamily: "Inter,sans-serif" }}>{v}</p>
              <p style={{ fontSize: 12, color: T.textMuted, fontWeight: 500, marginTop: 2 }}>{l}</p>
            </div>
          ))}
        </div>

        {/* Mock card */}
        <div className="fu5" style={{ width: "100%", maxWidth: 480, background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 16, padding: 20, textAlign: "left", boxShadow: `0 0 60px #6c63ff10` }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {["#ef4444","#f59e0b","#10b981"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }}/>)}
            <span style={{ fontSize: 11, color: "#2a2f45", marginLeft: 8, fontFamily: "monospace" }}>interview-session.ai</span>
          </div>
          <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, background: T.accent + "20", border: `1px solid ${T.accent}33`, color: "#b5b0ff" }}>2</div>
            <p style={{ fontSize: 13, color: T.textPrimary, lineHeight: 1.55, fontWeight: 500 }}>Explain the difference between useEffect and useLayoutEffect in React, and when you would use each.</p>
          </div>
          <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: T.textMuted }}>
              <IconCheckCircle size={12} color={T.success}/> Feedback received
            </div>
            <ScoreBadge score={9}/>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ maxWidth: 1120, margin: "0 auto", width: "100%", padding: "0 20px 80px" }}>
        <p className="fu" style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: T.accent, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>Why CodePulse</p>
        <h2 className="fu1" style={{ textAlign: "center", fontSize: "clamp(1.4rem,3.5vw,2rem)", fontWeight: 800, color: T.textPrimary, marginBottom: 40 }}>
          Everything You Need to Prepare Smarter
        </h2>
        <div className="feat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {FEATURES.map(({ Icon, title, desc }, i) => (
            <div key={title} className={`card card-lift card-hover fu${i+1}`} style={{ padding: 28 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#6c63ff15", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                <Icon/>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: T.textPrimary, marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: 14, color: T.textMuted, lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ maxWidth: 1120, margin: "0 auto", width: "100%", padding: "0 20px 80px" }}>
        <p className="fu" style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: "#8b5cf6", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>How It Works</p>
        <h2 className="fu1" style={{ textAlign: "center", fontSize: "clamp(1.4rem,3.5vw,2rem)", fontWeight: 800, color: T.textPrimary, marginBottom: 40 }}>
          From Setup to Feedback in Under 3 Minutes
        </h2>
        <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
          {STEPS.map(({ n, title, desc }, i) => (
            <div key={n} className={`card card-lift fu${i+1}`} style={{ padding: 22, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 12, right: 14, fontSize: 42, fontWeight: 900, color: T.accent, opacity: 0.06, lineHeight: 1, userSelect: "none" }}>{n}</div>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: T.accent + "20", border: `1px solid ${T.accent}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#b5b0ff", marginBottom: 14 }}>{n}</div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: T.textPrimary, marginBottom: 8 }}>{title}</h4>
              <p style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.55 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM CTA */}
      <div style={{ maxWidth: 640, margin: "0 auto 80px", width: "100%", padding: "0 20px" }}>
        <div className="fu" style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 20, padding: "48px 40px", textAlign: "center", boxShadow: `0 0 80px #6c63ff08` }}>
          <h2 style={{ fontSize: "clamp(1.4rem,3vw,1.9rem)", fontWeight: 800, color: T.textPrimary, marginBottom: 12 }}>Ready to Practice?</h2>
          <p style={{ fontSize: 14, color: T.textMuted, marginBottom: 24, lineHeight: 1.6 }}>No account needed. Just your role, your stack, and 10 minutes.</p>
          <button className="btn-primary" onClick={onStart} style={{ padding: "14px 36px", fontSize: 16, boxShadow: `0 0 28px #6c63ff44` }}>
            Start Your Free Session
          </button>
        </div>
      </div>

      <footer style={{ textAlign: "center", padding: "20px 0", fontSize: 12, color: "#2a2f45", borderTop: `1px solid ${T.border}` }}>
        CodePulse — AI Interview Preparation · Powered by Google Gemini
      </footer>
    </div>
  );
}

// ─── SETUP FORM ───────────────────────────────────────────────────────────────
function SetupForm({ onBack, onStart }) {
  const [role, setRole]             = useState("");
  const [exp, setExp]               = useState(EXP_LEVELS[0]);
  const [stack, setStack]           = useState([]);
  const [intType, setIntType]       = useState(INT_TYPES[0]);
  const [errors, setErrors]         = useState({});
  const [loading, setLoading]       = useState(false);
  const [apiError, setApiError]     = useState("");

  const TYPE_ICONS_SVG = {
    Technical:      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="16,18 22,12 16,6" stroke="#b5b0ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><polyline points="8,6 2,12 8,18" stroke="#b5b0ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    HR:             <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="#b5b0ff" strokeWidth="1.5" strokeLinecap="round"/><circle cx="12" cy="7" r="4" stroke="#b5b0ff" strokeWidth="1.5"/></svg>,
    "System Design":<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="7" height="7" rx="1" stroke="#b5b0ff" strokeWidth="1.5"/><rect x="15" y="3" width="7" height="7" rx="1" stroke="#b5b0ff" strokeWidth="1.5"/><rect x="9" y="14" width="6" height="7" rx="1" stroke="#b5b0ff" strokeWidth="1.5"/><path d="M5.5 10v2a4 4 0 004 4h5a4 4 0 004-4v-2" stroke="#b5b0ff" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    Behavioral:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="#b5b0ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  };

  const validate = () => {
    const e = {};
    if (!role.trim()) e.role = "Job role is required";
    if (!stack.length) e.stack = "Add at least one technology";
    return e;
  };

  const handleStart = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({}); setApiError(""); setLoading(true);
    try {
      const sys = `You are an expert technical interviewer. Generate exactly 5 interview questions. Respond ONLY with valid JSON (no markdown fences, no extra text):\n{"questions":["Q1","Q2","Q3","Q4","Q5"]}`;
      const msg = `Role: ${role}\nExperience: ${exp}\nStack: ${stack.join(", ")}\nType: ${intType}\nGenerate 5 ${intType} interview questions tailored to this profile.`;
      const data = await callGemini(sys, msg);
      const parsed = tryRepairJSON(parseGemini(data));
      if (!Array.isArray(parsed.questions) || !parsed.questions.length) throw new Error("Unexpected response format from AI.");
      onStart({ role, exp, stack, intType, questions: parsed.questions.slice(0, 5) });
    } catch (err) {
      setApiError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: T.bgBase + "e8", borderBottom: `1px solid ${T.border}`, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", width: "100%", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={onBack} className="btn-ghost" style={{ width: 34, height: 34, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 4 }}>
              <IconArrowLeft size={14}/>
            </button>
            <IconLogo/>
            <span style={{ fontSize: 18, fontWeight: 700, color: T.textPrimary }}>CodePulse</span>
          </div>
          <span style={{ fontSize: 12, color: T.textMuted, padding: "5px 14px", borderRadius: 99, background: T.bgElevated, border: "1px solid #6c63ff44", lineHeight: 1 }}>Session Setup</span>
        </div>
      </nav>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: 680 }}>
          <div className="fu" style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: "clamp(1.4rem,3vw,1.9rem)", fontWeight: 800, color: T.textPrimary, marginBottom: 6 }}>Set Up Your Session</h2>
            <p style={{ fontSize: 14, color: T.textMuted, lineHeight: 1.6 }}>The more specific you are, the better your questions will be.</p>
          </div>

          <div className="card fu1" style={{ padding: "28px 28px", boxShadow: `0 0 60px rgba(0,0,0,0.4)` }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Role */}
              <div className="fu2">
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: T.textPrimary, marginBottom: 8 }}>
                  Target Job Role <span style={{ color: T.danger }}>*</span>
                </label>
                <input className={`inp${errors.role ? " err" : ""}`} type="text"
                  placeholder="e.g. Senior React Developer, Backend Engineer, ML Engineer..."
                  value={role}
                  onChange={e => { setRole(e.target.value); if (errors.role) setErrors(er => ({ ...er, role: "" })); }}
                />
                {errors.role && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, fontSize: 12, color: T.danger }}>
                    <IconWarning size={12}/> {errors.role}
                  </div>
                )}
              </div>

              {/* Experience */}
              <div className="fu3">
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: T.textPrimary, marginBottom: 10 }}>Experience Level</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {EXP_LEVELS.map(l => (
                    <button key={l} className={`pill${exp === l ? " on" : ""}`} onClick={() => setExp(l)}>{l}</button>
                  ))}
                </div>
              </div>

              {/* Stack */}
              <div className="fu4">
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: T.textPrimary, marginBottom: 4 }}>
                  Tech Stack <span style={{ color: T.danger }}>*</span>
                  <span style={{ fontSize: 11, color: T.textMuted, fontWeight: 400, marginLeft: 6 }}>Press Enter to add</span>
                </label>
                <TagInput tags={stack}
                  onAdd={t => { setStack(p => [...p, t]); if (errors.stack) setErrors(e => ({ ...e, stack: "" })); }}
                  onRemove={t => setStack(p => p.filter(x => x !== t))}
                  placeholder="e.g. React, Node.js, PostgreSQL, Docker..."
                  error={errors.stack}
                />
              </div>

              {/* Interview Type */}
              <div className="fu5">
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: T.textPrimary, marginBottom: 10 }}>Interview Type</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
                  {INT_TYPES.map(t => (
                    <button key={t} className={`type-btn${intType === t ? " on" : ""}`} onClick={() => setIntType(t)}>
                      <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>{TYPE_ICONS_SVG[t]}</div>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* API Error */}
              {apiError && (
                <div className="err-box fi">
                  <IconWarning size={15}/>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, color: "#fca5a5", marginBottom: 6 }}>{apiError}</p>
                    <button onClick={handleStart} style={{ fontSize: 12, color: T.danger, background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}>Retry</button>
                  </div>
                </div>
              )}

              {/* Submit */}
              <button className="btn-primary fu6" onClick={handleStart} disabled={loading}
                style={{ width: "100%", padding: "15px", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 9 }}>
                {loading ? <><Spinner size={16}/>Generating questions...</> : "Generate Interview Questions"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── QUESTIONS VIEW ───────────────────────────────────────────────────────────
function QuestionsView({ config, session, dispatch, elapsed, onRestart }) {
  const { role, exp, stack, intType, questions } = config;
  const answered    = Object.values(session.answers).filter(a => a.submitted).length;
  const allDone     = questions.length === 5 && answered === 5;
  const pct         = (answered / 5) * 100;

  return (
    <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: T.bgBase + "ee", borderBottom: `1px solid ${T.border}`, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", width: "100%", padding: "0 24px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          {/* Left: logo + wordmark */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <IconLogo/>
            <span style={{ fontSize: 15, fontWeight: 700, color: T.textPrimary }}>CodePulse</span>
          </div>
          {/* Centre: progress tracker — fixed 280px, auto margins push it centre */}
          <div style={{ width: 280, flexShrink: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: T.textMuted, marginBottom: 6, fontWeight: 500 }}>
              <span>{answered}/5 answered</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><IconClock size={11}/> {fmtTime(elapsed)}</span>
            </div>
            <div style={{ height: 4, background: T.bgElevated, borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${T.accent},#8b5cf6,#ec4899)`, borderRadius: 99, transition: "width .6s ease" }}/>
            </div>
          </div>
          {/* Right: reset button */}
          <button className="btn-ghost" onClick={onRestart} style={{ flexShrink: 0, padding: "7px 16px", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
            <IconRefresh size={12}/> Reset
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "28px 24px" }}>
        {/* Meta chips */}
        <div className="fu" style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
          {[
            { label: role,    icon: <IconBriefcase size={11}/> },
            { label: exp,     icon: null },
            { label: intType, icon: null },
            ...stack.slice(0, 4).map(s => ({ label: s, icon: null })),
          ].map(({ label, icon }) => (
            <span key={label} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 8, background: T.bgCard, border: `1px solid ${T.border}`, fontSize: 12, color: T.textMuted, fontWeight: 500 }}>
              {icon} {label}
            </span>
          ))}
          {stack.length > 4 && <span style={{ fontSize: 12, color: T.textMuted, padding: "5px 8px" }}>+{stack.length - 4} more</span>}
        </div>

        {/* Session complete */}
        {allDone && (
          <div style={{ marginBottom: 24 }}>
            <Confetti/>
            <SessionSummary questions={questions} session={session} elapsed={elapsed} onRestart={onRestart}/>
          </div>
        )}

        {/* Question cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {questions.map((q, i) => (
            <div key={i} className={`fu${Math.min(i+1,6)}`}>
              <QuestionCard idx={i} question={q} session={session} dispatch={dispatch}/>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function InterviewApp() {
  const [phase,   setPhase]   = useState("landing");  // landing | setup | questions
  const [config,  setConfig]  = useState(null);
  const [session, dispatch]   = useReducer(sessionReducer, S0);
  const [elapsed, setElapsed] = useState(0);
  const timerRef              = useRef(null);

  useEffect(() => {
    if (phase === "questions") {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const handleStart = useCallback(cfg => {
    setConfig(cfg);
    setElapsed(0);
    dispatch({ type: "RESET" });
    setPhase("questions");
  }, []);

  const handleRestart = () => {
    setConfig(null);
    dispatch({ type: "RESET" });
    setElapsed(0);
    setPhase("landing");
  };

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", minHeight: "100vh", background: T.bgBase, color: T.textPrimary }}>
      <style>{STYLES}</style>
      <AnimatedBackground/>
      {phase === "landing"   && <LandingPage onStart={() => setPhase("setup")}/>}
      {phase === "setup"     && <SetupForm onBack={() => setPhase("landing")} onStart={handleStart}/>}
      {phase === "questions" && config && (
        <QuestionsView config={config} session={session} dispatch={dispatch} elapsed={elapsed} onRestart={handleRestart}/>
      )}
    </div>
  );
}
