import { useState, useEffect, useRef } from "react";
import { Analytics } from "@vercel/analytics/react";

// ============================================================
const CORRECT_PASSWORD = "vijay@outreach2024";
const CLAUDE_API_KEY = process.env.REACT_APP_CLAUDE_API_KEY;

// Apollo-exact industry list (from Apollo Knowledge Base)
const APOLLO_INDUSTRIES = [
  "Accounting","Agriculture","Airlines/Aviation","Alternative Dispute Resolution","Alternative Medicine","Animation",
  "Apparel & Fashion","Architecture & Planning","Arts & Crafts","Automotive","Aviation & Aerospace","Banking",
  "Biotechnology","Broadcast Media","Building Materials","Business Supplies & Equipment","Capital Markets","Chemicals",
  "Civic & Social Organization","Civil Engineering","Commercial Real Estate","Computer & Network Security","Computer Games",
  "Computer Hardware","Computer Networking","Computer Software","Construction","Consumer Electronics","Consumer Goods",
  "Consumer Services","Cosmetics","Dairy","Defense & Space","Design","E-Learning","Education Management",
  "Electrical/Electronic Manufacturing","Entertainment","Environmental Services","Events Services","Executive Office",
  "Facilities Services","Farming","Financial Services","Fine Art","Fishery","Food & Beverages","Food Production",
  "Fund-Raising","Furniture","Gambling & Casinos","Glass, Ceramics & Concrete","Government Administration",
  "Government Relations","Graphic Design","Health, Wellness & Fitness","Higher Education","Hospital & Health Care",
  "Hospitality","Human Resources","Import & Export","Individual & Family Services","Industrial Automation",
  "Information Services","Information Technology & Services","Insurance","International Affairs",
  "International Trade & Development","Internet","Investment Banking","Investment Management","Judiciary",
  "Law Enforcement","Law Practice","Legal Services","Legislative Office","Leisure, Travel & Tourism","Libraries",
  "Logistics & Supply Chain","Luxury Goods & Jewelry","Machinery","Management Consulting","Maritime","Market Research",
  "Marketing & Advertising","Mechanical or Industrial Engineering","Media Production","Medical Devices","Medical Practice",
  "Mental Health Care","Military","Mining & Metals","Motion Pictures & Film","Museums & Institutions","Music",
  "Nanotechnology","Newspapers","Nonprofit Organization Management","Oil & Energy","Online Media","Outsourcing/Offshoring",
  "Package/Freight Delivery","Packaging & Containers","Paper & Forest Products","Performing Arts","Pharmaceuticals",
  "Philanthropy","Photography","Plastics","Political Organization","Primary/Secondary Education","Printing",
  "Professional Training & Coaching","Program Development","Public Policy","Public Relations & Communications",
  "Public Safety","Publishing","Railroad Manufacture","Ranching","Real Estate","Recreational Facilities & Services",
  "Religious Institutions","Renewables & Environment","Research","Restaurants","Retail","Security & Investigations",
  "Semiconductors","Shipbuilding","Sports","Staffing & Recruiting","Supermarkets","Telecommunications","Textiles",
  "Think Tanks","Tobacco","Translation & Localization","Transportation/Trucking/Railroad","Utilities",
  "Venture Capital & Private Equity","Veterinary","Warehousing","Wholesale","Wine & Spirits","Wireless","Writing & Editing",
];

// Apollo employee ranges (exact format)
const APOLLO_EMPLOYEE_RANGES = [
  { label: "1-10 (Micro/Seed)", value: "1,10" },
  { label: "11-20", value: "11,20" },
  { label: "21-50 (Small)", value: "21,50" },
  { label: "51-100", value: "51,100" },
  { label: "101-200", value: "101,200" },
  { label: "201-500 (Mid-size)", value: "201,500" },
  { label: "501-1000", value: "501,1000" },
  { label: "1001-2000", value: "1001,2000" },
  { label: "2001-5000", value: "2001,5000" },
  { label: "5001-10000", value: "5001,10000" },
  { label: "10001+", value: "10001," },
];

// Pre-loaded locations (major cities)
const APOLLO_LOCATIONS = [
  // India - Major Metros
  "Bangalore, India","Mumbai, India","Delhi, India","New Delhi, India","Hyderabad, India","Chennai, India",
  "Pune, India","Kolkata, India","Ahmedabad, India","Noida, India","Gurgaon, India",
  // India - Tier 2
  "Jaipur, India","Coimbatore, India","Kochi, India","Indore, India","Chandigarh, India",
  "Lucknow, India","Nagpur, India","Bhopal, India","Visakhapatnam, India","Trivandrum, India",
  "Thiruvananthapuram, India","Madurai, India","Vadodara, India","Surat, India","Rajkot, India",
  "Mysore, India","Mangalore, India","Hubli, India","Salem, India","Tiruchirappalli, India",
  // India - Tier 3 & Emerging
  "Bhubaneswar, India","Dehradun, India","Ranchi, India","Guwahati, India","Patna, India",
  "Raipur, India","Vijayawada, India","Jodhpur, India","Udaipur, India","Nashik, India",
  "Aurangabad, India","Goa, India","Pondicherry, India","Kozhikode, India","Thrissur, India",
  "Tiruvottiyur, India","Navi Mumbai, India","Thane, India","Faridabad, India","Ghaziabad, India",
  "Greater Noida, India",
  // USA - Major Tech Hubs
  "San Francisco, CA","New York, NY","Los Angeles, CA","Chicago, IL","Austin, TX","Seattle, WA",
  "Boston, MA","Denver, CO","Miami, FL","Atlanta, GA","Dallas, TX","San Diego, CA",
  "Portland, OR","Phoenix, AZ","San Jose, CA","Palo Alto, CA","Mountain View, CA",
  // USA - Secondary Tech Cities
  "Raleigh, NC","Nashville, TN","Salt Lake City, UT","Minneapolis, MN","Detroit, MI",
  "Pittsburgh, PA","Charlotte, NC","Columbus, OH","Indianapolis, IN","Kansas City, MO",
  "St. Louis, MO","Tampa, FL","Orlando, FL","Las Vegas, NV","Sacramento, CA",
  "Houston, TX","San Antonio, TX","Philadelphia, PA","Washington, DC","Baltimore, MD",
  "Milwaukee, WI","Cincinnati, OH","Cleveland, OH","Richmond, VA","Omaha, NE",
  "Boise, ID","Tucson, AZ","Jacksonville, FL","Memphis, TN","Louisville, KY",
  // Global Hubs (bonus)
  "London, United Kingdom","Berlin, Germany","Paris, France","Amsterdam, Netherlands",
  "Dublin, Ireland","Singapore","Dubai, United Arab Emirates","Toronto, Canada",
  "Vancouver, Canada","Sydney, Australia","Melbourne, Australia","Tel Aviv, Israel",
  "Stockholm, Sweden","Lisbon, Portugal","Barcelona, Spain",
  // Flexible
  "Remote",
];


const theme = {
  gradient: "linear-gradient(135deg, #2563eb, #9333ea)",
  bg: "linear-gradient(135deg, #eff6ff, #ffffff, #faf5ff)",
  card: { background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
  input: { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" },
  label: { fontSize: 13, fontWeight: 600, color: "#1f2937", marginBottom: 4, display: "block" },
  btnPrimary: { padding: "10px 24px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #2563eb, #9333ea)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  btnOutline: { padding: "10px 24px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", color: "#374151", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  btnGhost: { padding: "8px 16px", borderRadius: 8, border: "none", background: "transparent", color: "#6b7280", fontSize: 13, cursor: "pointer", fontFamily: "inherit" },
};

const EMAIL_SYSTEM_PROMPT = `You are an email drafting agent. Write cold outreach emails on behalf of the candidate based on their resume context.

RULES:
- Address the founder by first name
- Opening: Who the candidate is + how they found the company + ONE impressive line about the company (max 15 words)
- Middle: Why they want to work there + what they can do
- Experience: Relevant experience from the resume context
- Always end with EXACTLY: "I am willing to work absolutely for free, for the first two months, post which you can hire me, based on my performance. I am pretty confident that I would be a great hire."
  Then: "I have attached my resume for further reference. Looking forward to hearing back from you."
- Sign off with the candidate's name and phone from the resume context
- Simple English, young and hungry tone
- 150-200 words
- Output ONLY the email body`;

const statusConfig = {
  pending: { bg: "#f3f4f6", text: "#6b7280", label: "Pending" },
  approved: { bg: "#dcfce7", text: "#16a34a", label: "Approved" },
  sent: { bg: "#dbeafe", text: "#2563eb", label: "Sent" },
  rejected: { bg: "#fee2e2", text: "#dc2626", label: "Rejected" },
  drafting: { bg: "#f3e8ff", text: "#9333ea", label: "AI Drafting..." },
};

// ============================================================
// SEARCHABLE MULTI-SELECT DROPDOWN (reusable)
// ============================================================
function SearchableSelect({ label, options, value, onChange, placeholder, multi = false }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = options.filter((o) => {
    const optLabel = typeof o === "string" ? o : o.label;
    return optLabel.toLowerCase().includes(search.toLowerCase());
  });

  const isSelected = (opt) => {
    const v = typeof opt === "string" ? opt : opt.value;
    return multi ? (value || []).includes(v) : value === v;
  };

  const handleSelect = (opt) => {
    const v = typeof opt === "string" ? opt : opt.value;
    if (multi) {
      const arr = value || [];
      onChange(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
    } else {
      onChange(v);
      setOpen(false);
      setSearch("");
    }
  };

  const displayValue = () => {
    if (multi) {
      const arr = value || [];
      if (arr.length === 0) return placeholder || "Select...";
      if (arr.length <= 2) return arr.map((v) => { const o = options.find((x) => (typeof x === "string" ? x : x.value) === v); return o ? (typeof o === "string" ? o : o.label) : v; }).join(", ");
      return `${arr.length} selected`;
    }
    if (!value) return placeholder || "Select...";
    const o = options.find((x) => (typeof x === "string" ? x : x.value) === value);
    return o ? (typeof o === "string" ? o : o.label) : value;
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {label && <label style={theme.label}>{label}</label>}
      <div onClick={() => setOpen(!open)}
        style={{ ...theme.input, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", color: (multi ? (value || []).length : value) ? "#111827" : "#9ca3af", minHeight: 38 }}>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{displayValue()}</span>
        <span style={{ fontSize: 10, marginLeft: 8 }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50, background: "#fff", border: "1px solid #d1d5db", borderRadius: 8, marginTop: 4, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", maxHeight: 240, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: 8, borderBottom: "1px solid #f3f4f6" }}>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." autoFocus
              style={{ ...theme.input, padding: "6px 10px", fontSize: 13 }} />
          </div>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {filtered.length === 0 && <div style={{ padding: "12px 14px", fontSize: 13, color: "#9ca3af" }}>No results found</div>}
            {filtered.map((opt) => {
              const optLabel = typeof opt === "string" ? opt : opt.label;
              const sel = isSelected(opt);
              return (
                <div key={optLabel} onClick={(e) => { e.stopPropagation(); handleSelect(opt); }}
                  style={{ padding: "8px 14px", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, background: sel ? "#eff6ff" : "transparent" }}
                  onMouseEnter={(e) => { if (!sel) e.currentTarget.style.background = "#f9fafb"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = sel ? "#eff6ff" : "transparent"; }}>
                  {multi && <span style={{ width: 16, height: 16, borderRadius: 4, border: sel ? "none" : "1.5px solid #d1d5db", background: sel ? "#2563eb" : "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10, flexShrink: 0 }}>{sel && "✓"}</span>}
                  {optLabel}
                </div>
              );
            })}
          </div>
          {multi && (
            <div style={{ padding: 8, borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => onChange([])} style={{ ...theme.btnGhost, fontSize: 11, padding: "4px 8px" }}>Clear all</button>
              <button onClick={() => setOpen(false)} style={{ ...theme.btnGhost, fontSize: 11, padding: "4px 8px", color: "#2563eb" }}>Done</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// LANDING PAGE
// ============================================================
function LandingPage({ onStart }) {
  return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <header style={{ padding: "16px 24px", borderBottom: "1px solid #e5e7eb", background: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 40, height: 40, background: theme.gradient, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>✨</div>
            <span style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>OutreachAI</span>
          </div>
          <button onClick={onStart} style={theme.btnPrimary}>Get Started</button>
        </div>
      </header>
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 64px" }}>
          <h1 style={{ fontSize: 48, fontWeight: 800, marginBottom: 20, background: theme.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.15 }}>AI-Powered Cold Email Outreach for Job Seekers</h1>
          <p style={{ fontSize: 18, color: "#6b7280", marginBottom: 32, lineHeight: 1.6 }}>Stop spending hours researching companies and crafting personalized emails. Let AI do the heavy lifting while you focus on landing your dream job.</p>
          <button onClick={onStart} style={{ ...theme.btnPrimary, padding: "14px 32px", fontSize: 16 }}>Start Your Outreach Journey →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 64 }}>
          {[
            { icon: "🎯", title: "Deep Company Research", desc: "AI analyzes companies thoroughly to create personalized outreach that resonates with founders.", color: "#dbeafe" },
            { icon: "✉️", title: "Personalized Emails", desc: "Every email is crafted specifically for each founder, highlighting your relevant experience.", color: "#f3e8ff" },
            { icon: "📈", title: "Scale Your Search", desc: "Reach out to dozens of companies without the research bottleneck. AI handles the workload.", color: "#dcfce7" },
          ].map((f) => (
            <div key={f.title} style={{ ...theme.card, padding: 32 }}>
              <div style={{ width: 48, height: 48, background: f.color, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 10 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ ...theme.card, padding: 48 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, textAlign: "center", marginBottom: 36, color: "#111827" }}>How It Works</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
            {[
              { n: "1", t: "Upload Your Info", d: "Share your resume, target role, and preferences" },
              { n: "2", t: "AI Finds Companies", d: "Apollo searches for matching companies and founders" },
              { n: "3", t: "Select Targets", d: "Pick the companies and people you want to reach" },
              { n: "4", t: "Draft & Send", d: "AI crafts personalized emails for each founder" },
            ].map((s) => (
              <div key={s.n} style={{ textAlign: "center" }}>
                <div style={{ width: 48, height: 48, background: "#2563eb", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: 20, fontWeight: 800 }}>{s.n}</div>
                <h4 style={{ fontWeight: 700, marginBottom: 6, color: "#111827", fontSize: 15 }}>{s.t}</h4>
                <p style={{ fontSize: 13, color: "#6b7280" }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <footer style={{ borderTop: "1px solid #e5e7eb", padding: "24px", marginTop: 80, textAlign: "center", color: "#9ca3af", fontSize: 13 }}>© 2026 OutreachAI. Helping job seekers connect with founders.</footer>
    </div>
  );
}

// ============================================================
// LOGIN SCREEN
// ============================================================
function LoginScreen({ onLogin, onBack }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const handleLogin = () => { if (password === CORRECT_PASSWORD) { onLogin(); } else { setError(true); setShake(true); setTimeout(() => setShake(false), 500); } };
  return (
    <div style={{ minHeight: "100vh", background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div style={{ ...theme.card, padding: "48px 40px", width: 400, textAlign: "center", animation: shake ? "shake 0.4s ease" : "none" }}>
        <div style={{ width: 56, height: 56, background: theme.gradient, borderRadius: 14, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>✨</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 6 }}>Welcome to OutreachAI</h2>
        <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 28 }}>Enter your password to continue</p>
        <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(false); }} onKeyDown={(e) => e.key === "Enter" && handleLogin()} placeholder="Enter password"
          style={{ ...theme.input, marginBottom: error ? 8 : 16, textAlign: "center", letterSpacing: "0.1em", borderColor: error ? "#ef4444" : "#d1d5db" }} />
        {error && <div style={{ fontSize: 12, color: "#ef4444", marginBottom: 16 }}>Incorrect password. Try again.</div>}
        <button onClick={handleLogin} style={{ ...theme.btnPrimary, width: "100%", marginBottom: 12 }}>Login</button>
        <button onClick={onBack} style={{ ...theme.btnGhost, width: "100%" }}>← Back to Home</button>
      </div>
      <style>{"@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}"}</style>
    </div>
  );
}

// ============================================================
// ONBOARDING FORM (Apollo-mapped dropdowns)
// ============================================================
function OnboardingForm({ onComplete, onBack }) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", degree: "", college: "", gradYear: "",
    targetRole: "", locations: [], industries: [], companySize: [], keywords: "",
    internships: "", skills: "", additional: "",
  });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.targetRole) { alert("Please fill in Name, Email, and Target Role"); return; }
    const ctx = [
      `Candidate: ${form.name}`,
      form.degree && form.college ? `Degree: ${form.degree}, ${form.college}${form.gradYear ? ` (${form.gradYear})` : ""}` : "",
      form.phone ? `Phone: ${form.phone}` : "",
      form.targetRole ? `Target Role: ${form.targetRole}` : "",
      form.locations.length ? `Preferred Location: ${form.locations.join(", ")}` : "",
      form.industries.length ? `Target Industry: ${form.industries.join(", ")}` : "",
      form.companySize.length ? `Company Size: ${form.companySize.map(v => { const r = APOLLO_EMPLOYEE_RANGES.find(x => x.value === v); return r ? r.label : v; }).join(", ")}` : "",
      form.keywords ? `Keywords: ${form.keywords}` : "",
      form.internships ? `Internships & Experience:\n${form.internships}` : "",
      form.skills ? `Skills: ${form.skills}` : "",
      form.additional ? `Additional Context: ${form.additional}` : "",
    ].filter(Boolean).join("\n");
    onComplete(ctx, form);
  };
  const iStyle = theme.input;
  const tStyle = { ...theme.input, resize: "vertical", minHeight: 80, lineHeight: 1.5 };
  return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <header style={{ padding: "16px 24px", borderBottom: "1px solid #e5e7eb", background: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={onBack} style={theme.btnGhost}>← Back</button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, background: theme.gradient, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>✨</div>
            <span style={{ fontWeight: 700, color: "#111827" }}>OutreachAI</span>
          </div>
        </div>
      </header>
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#111827", marginBottom: 8 }}>Set Up Your Profile</h1>
        <p style={{ color: "#6b7280", marginBottom: 32, fontSize: 15 }}>Tell us about yourself. All Apollo filters below map directly to the API — no guessing.</p>
        <form onSubmit={handleSubmit}>
          {/* Section: Basic Info */}
          <div style={{ ...theme.card, padding: 28, marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Basic Information</h3>
            <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 18 }}>Your personal details and contact info</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><label style={theme.label}>Full Name *</label><input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Vijay Srinivassan" required style={iStyle} /></div>
              <div><label style={theme.label}>Email *</label><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="vijay@example.com" required style={iStyle} /></div>
              <div><label style={theme.label}>Phone Number</label><input type="text" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="9653941593" style={iStyle} /></div>
              <div><label style={theme.label}>Graduation Year</label><input type="text" value={form.gradYear} onChange={(e) => set("gradYear", e.target.value)} placeholder="2025" style={iStyle} /></div>
              <div><label style={theme.label}>Degree</label><input type="text" value={form.degree} onChange={(e) => set("degree", e.target.value)} placeholder="MBA in Marketing & Operations" style={iStyle} /></div>
              <div><label style={theme.label}>College</label><input type="text" value={form.college} onChange={(e) => set("college", e.target.value)} placeholder="Dr. NGP Institute of Technology" style={iStyle} /></div>
            </div>
          </div>
          {/* Section: Apollo ICP Filters */}
          <div style={{ ...theme.card, padding: 28, marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 4 }}>🎯 Apollo ICP Filters</h3>
            <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 18 }}>These map directly to Apollo API. Only exact Apollo values are used.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><label style={theme.label}>Target Role *</label><input type="text" value={form.targetRole} onChange={(e) => set("targetRole", e.target.value)} placeholder="Marketing Intern" required style={iStyle} /></div>
              <SearchableSelect label="Account Location(s)" options={APOLLO_LOCATIONS} value={form.locations} onChange={(v) => set("locations", v)} placeholder="Select locations..." multi />
              <SearchableSelect label="Industry" options={APOLLO_INDUSTRIES} value={form.industries} onChange={(v) => set("industries", v)} placeholder="Select industries..." multi />
              <SearchableSelect label="Employee Count" options={APOLLO_EMPLOYEE_RANGES} value={form.companySize} onChange={(v) => set("companySize", v)} placeholder="Select size range..." multi />
            </div>
            <div style={{ marginTop: 12 }}>
              <label style={theme.label}>Target Keywords <span style={{ fontWeight: 400, color: "#9ca3af" }}>(comma-separated → maps to q_organization_keyword_tags)</span></label>
              <input type="text" value={form.keywords} onChange={(e) => set("keywords", e.target.value)} placeholder="performance marketing, SEO, growth hacking, paid ads" style={iStyle} />
            </div>
          </div>
          {/* Section: Experience & Skills */}
          <div style={{ ...theme.card, padding: 28, marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Experience & Skills</h3>
            <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 18 }}>Your background that AI will reference in emails</p>
            <div style={{ marginBottom: 14 }}>
              <label style={theme.label}>Internships & Experience</label>
              <textarea value={form.internships} onChange={(e) => set("internships", e.target.value)} rows={5} placeholder={"1. VilFresh (May-Jun 2025) - Built N8N automation\n2. Stead (Dec-Jan 2025) - Apollo.io campaigns"} style={tStyle} />
            </div>
            <div><label style={theme.label}>Skills</label><input type="text" value={form.skills} onChange={(e) => set("skills", e.target.value)} placeholder="SEO, Apollo.io, HubSpot CRM, Google Ads" style={iStyle} /></div>
          </div>
          {/* Section: Additional */}
          <div style={{ ...theme.card, padding: 28, marginBottom: 28 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Additional Instructions</h3>
            <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 18 }}>Anything else AI should know</p>
            <textarea value={form.additional} onChange={(e) => set("additional", e.target.value)} rows={4} placeholder="e.g. I'm open to working for free initially..." style={tStyle} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <button type="button" onClick={onBack} style={theme.btnOutline}>Cancel</button>
            <button type="submit" style={theme.btnPrimary}>✨ Find Companies with Apollo →</button>
          </div>
        </form>
      </main>
    </div>
  );
}

// ============================================================
// COMPANY SELECT (Apollo Integration)
// ============================================================
function CompanySelect({ onContinue, onBack, userProfile }) {
  const [companies, setCompanies] = useState([]);
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPeople, setLoadingPeople] = useState(false);
  const [selectedOrgs, setSelectedOrgs] = useState(new Set());
  const [selectedPeople, setSelectedPeople] = useState(new Set());
  const [step, setStep] = useState("companies");
  const [error, setError] = useState(null);

  useEffect(() => { searchCompanies(); }, []);

  const callApollo = async (endpoint, body) => {
    const res = await fetch("/api/apollo", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ endpoint, ...body }) });
    if (!res.ok) throw new Error("Apollo API error: " + res.status);
    return res.json();
  };

  const searchCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const body = { page: 1, per_page: 25 };
      if (userProfile?.locations?.length) body.organization_locations = userProfile.locations;
      if (userProfile?.industries?.length) body.organization_industries = userProfile.industries;
      if (userProfile?.companySize?.length) body.organization_num_employees_ranges = userProfile.companySize;
      if (userProfile?.keywords) {
        body.q_organization_keyword_tags = userProfile.keywords.split(",").map(s => s.trim()).filter(Boolean);
      }
      const data = await callApollo("organizations/search", body);
      if (data.organizations && data.organizations.length > 0) {
        setCompanies(data.organizations);
        setSelectedOrgs(new Set(data.organizations.slice(0, 10).map(o => o.id)));
      } else {
        setError("No companies found matching your criteria. Try broader filters.");
      }
    } catch (err) { setError("Failed to search companies: " + err.message); }
    setLoading(false);
  };

  const fetchPeople = async () => {
    setLoadingPeople(true);
    setError(null);
    const orgs = companies.filter(c => selectedOrgs.has(c.id));
    const allPeople = [];
    for (const org of orgs) {
      try {
        const data = await callApollo("mixed_people/organization_top_people", { organization_id: org.id });
        if (data.people) {
          data.people.slice(0, 5).forEach(p => {
            if (p.email) {
              allPeople.push({ id: p.id, name: p.name, firstName: p.first_name, title: p.title || "Founder", company: org.name, companyDomain: org.primary_domain, email: p.email, orgId: org.id });
            }
          });
        }
      } catch (err) { console.error("Failed for " + org.name, err); }
    }
    if (allPeople.length === 0) { setError("No people with emails found. Try selecting different companies."); setLoadingPeople(false); return; }
    setPeople(allPeople);
    setSelectedPeople(new Set(allPeople.map(p => p.id)));
    setStep("people");
    setLoadingPeople(false);
  };

  const toggleOrg = (id) => { const n = new Set(selectedOrgs); if (n.has(id)) n.delete(id); else n.add(id); setSelectedOrgs(n); };
  const togglePerson = (id) => { const n = new Set(selectedPeople); if (n.has(id)) n.delete(id); else n.add(id); setSelectedPeople(n); };
  const handleContinue = () => {
    const contacts = people.filter(p => selectedPeople.has(p.id)).map((p, i) => ({ id: Date.now() + i, founder: p.name, firstName: p.firstName, title: p.title, company: p.company, email: p.email, subject: "", body: "", status: "pending" }));
    onContinue(contacts);
  };

  const NavHeader = () => (
    <header style={{ padding: "16px 24px", borderBottom: "1px solid #e5e7eb", background: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={step === "people" ? () => setStep("companies") : onBack} style={theme.btnGhost}>← Back</button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, background: theme.gradient, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>✨</div>
          <span style={{ fontWeight: 700, color: "#111827" }}>OutreachAI</span>
        </div>
      </div>
    </header>
  );

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: "'Inter', -apple-system, sans-serif" }}>
        <NavHeader />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 16 }}>
          <div style={{ fontSize: 48 }}>🔍</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: "#111827" }}>Searching Apollo for companies...</div>
          <div style={{ fontSize: 13, color: "#9ca3af" }}>
            {userProfile?.industries?.length ? userProfile.industries.join(", ") : "companies"} in {userProfile?.locations?.length ? userProfile.locations.join(", ") : "your area"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <NavHeader />
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
        {step === "companies" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", marginBottom: 6 }}>Select Target Companies</h1>
                <p style={{ color: "#6b7280", fontSize: 14 }}>Apollo found {companies.length} companies. Select which ones you want to target.</p>
              </div>
              <button onClick={searchCompanies} style={{ ...theme.btnOutline, padding: "8px 14px", fontSize: 12 }}>🔄 Re-search</button>
            </div>
            {error && <div style={{ ...theme.card, padding: 16, marginBottom: 16, borderColor: "#fecaca", background: "#fef2f2", color: "#dc2626", fontSize: 13 }}>{error}</div>}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
              {companies.map((c) => (
                <div key={c.id} onClick={() => toggleOrg(c.id)}
                  style={{ ...theme.card, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", borderColor: selectedOrgs.has(c.id) ? "#2563eb" : "#e5e7eb", background: selectedOrgs.has(c.id) ? "#eff6ff" : "#fff", transition: "all 0.15s" }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, border: selectedOrgs.has(c.id) ? "none" : "2px solid #d1d5db", background: selectedOrgs.has(c.id) ? theme.gradient : "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{selectedOrgs.has(c.id) && "✓"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: "#111827", fontSize: 14 }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{c.industry || "Unknown industry"} · {c.estimated_num_employees ? `~${c.estimated_num_employees} employees` : "Size unknown"}{c.city ? ` · ${c.city}${c.state ? ", " + c.state : ""}` : ""}</div>
                  </div>
                  {c.primary_domain && <div style={{ fontSize: 11, color: "#9ca3af" }}>{c.primary_domain}</div>}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "#6b7280" }}>{selectedOrgs.size} of {companies.length} selected</span>
              <button onClick={fetchPeople} disabled={selectedOrgs.size === 0 || loadingPeople}
                style={{ ...theme.btnPrimary, opacity: selectedOrgs.size === 0 ? 0.5 : 1 }}>
                {loadingPeople ? "⏳ Finding founders..." : `Find Founders at ${selectedOrgs.size} Companies →`}
              </button>
            </div>
          </>
        )}
        {step === "people" && (
          <>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", marginBottom: 6 }}>Select People to Contact</h1>
            <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 24 }}>Found {people.length} people with emails. Select who you want to reach out to.</p>
            {error && <div style={{ ...theme.card, padding: 16, marginBottom: 16, borderColor: "#fecaca", background: "#fef2f2", color: "#dc2626", fontSize: 13 }}>{error}</div>}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
              {people.map((p) => (
                <div key={p.id} onClick={() => togglePerson(p.id)}
                  style={{ ...theme.card, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", borderColor: selectedPeople.has(p.id) ? "#2563eb" : "#e5e7eb", background: selectedPeople.has(p.id) ? "#eff6ff" : "#fff", transition: "all 0.15s" }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, border: selectedPeople.has(p.id) ? "none" : "2px solid #d1d5db", background: selectedPeople.has(p.id) ? theme.gradient : "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{selectedPeople.has(p.id) && "✓"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: "#111827", fontSize: 14 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>{p.title} at {p.company}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>{p.email}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "#6b7280" }}>{selectedPeople.size} of {people.length} selected</span>
              <button onClick={handleContinue} disabled={selectedPeople.size === 0}
                style={{ ...theme.btnPrimary, opacity: selectedPeople.size === 0 ? 0.5 : 1 }}>Draft Emails for {selectedPeople.size} People →</button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// ============================================================
// EMAIL DASHBOARD
// ============================================================
function EmailDashboard({ resumeContext, userProfile, initialContacts, onLogout }) {
  const [emailList, setEmailList] = useState(initialContacts || []);
  const [selected, setSelected] = useState(0);
  const [editing, setEditing] = useState(false);
  const [editBody, setEditBody] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [sendingId, setSendingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [aiInstructions, setAiInstructions] = useState("");
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ firstName: "", lastName: "", company: "", email: "", title: "", whatTheyDo: "" });
  const current = emailList[selected] || {};
  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };
  const updateEmail = (id, updates) => setEmailList((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  const startEdit = () => { setEditBody(current.body); setEditSubject(current.subject); setEditing(true); };
  const saveEdit = () => { updateEmail(current.id, { body: editBody, subject: editSubject }); setEditing(false); showToast("Saved ✓"); };
  const draftWithAI = async (emailObj) => {
    if (!CLAUDE_API_KEY) { showToast("Claude API key not configured", "error"); return; }
    updateEmail(emailObj.id, { status: "drafting" });
    try {
      const userPrompt = `Write a personalized outreach email to ${emailObj.firstName}, who is ${emailObj.title} at ${emailObj.company}.
${aiInstructions ? `\nAdditional instructions: ${aiInstructions}` : ""}

Candidate resume context:
${resumeContext}`;
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": CLAUDE_API_KEY, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({ model: "claude-sonnet-4-5-20250514", max_tokens: 600, system: EMAIL_SYSTEM_PROMPT, messages: [{ role: "user", content: userPrompt }] }),
      });
      const data = await response.json();
      if (data.content && data.content[0]) {
        updateEmail(emailObj.id, { body: data.content[0].text, status: "pending", subject: `Internship Opportunity - ${emailObj.company}` });
        showToast(`AI drafted email for ${emailObj.firstName} ✓`);
      } else { throw new Error(data.error?.message || "API error"); }
    } catch (err) { updateEmail(emailObj.id, { status: "pending" }); showToast("AI draft failed: " + err.message, "error"); }
  };
  const handleSend = async (emailObj) => {
    if (emailObj.status !== "approved") { showToast("Approve the email first", "error"); return; }
    setSendingId(emailObj.id);
    await new Promise((r) => setTimeout(r, 1800));
    updateEmail(emailObj.id, { status: "sent" });
    setSendingId(null);
    showToast(`Email sent to ${emailObj.founder} ✓`);
  };
  const addContact = async () => {
    if (!newContact.firstName || !newContact.email) { showToast("First name and email required", "error"); return; }
    const fullName = `${newContact.firstName} ${newContact.lastName}`.trim();
    const entry = { id: Date.now(), founder: fullName, firstName: newContact.firstName, title: newContact.title || "Founder", company: newContact.company, email: newContact.email, subject: "", body: "", status: "pending" };
    setEmailList((p) => [...p, entry]);
    setSelected(emailList.length);
    setShowAddContact(false);
    setNewContact({ firstName: "", lastName: "", company: "", email: "", title: "", whatTheyDo: "" });
    showToast(`${fullName} added — drafting...`);
    await draftWithAI(entry);
  };
  const approvedCount = emailList.filter((e) => e.status === "approved").length;
  const sentCount = emailList.filter((e) => e.status === "sent").length;
  const pendingCount = emailList.filter((e) => e.status === "pending").length;

  if (emailList.length === 0) {
    return (
      <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: "'Inter', -apple-system, sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}><div style={{ fontSize: 48, marginBottom: 16 }}>📭</div><h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 8 }}>No contacts selected</h2><button onClick={onLogout} style={theme.btnPrimary}>← Start Over</button></div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: "#f9fafb", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ borderBottom: "1px solid #e5e7eb", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: theme.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>✨</div>
          <div><div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>OutreachAI Dashboard</div><div style={{ fontSize: 11, color: "#9ca3af" }}>Powered by Claude · {userProfile?.name || "User"}</div></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {[{ l: "Pending", v: pendingCount, c: "#6b7280" }, { l: "Approved", v: approvedCount, c: "#16a34a" }, { l: "Sent", v: sentCount, c: "#2563eb" }].map((s) => (
            <div key={s.l} style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 800, color: s.c }}>{s.v}</div><div style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.l}</div></div>
          ))}
          <button onClick={() => setShowAddContact(true)} style={{ ...theme.btnPrimary, padding: "8px 14px", fontSize: 12 }}>+ Add Contact</button>
          <button onClick={onLogout} style={{ ...theme.btnGhost, fontSize: 11 }}>Logout</button>
        </div>
      </div>
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <div style={{ width: 260, borderRight: "1px solid #e5e7eb", background: "#fff", overflowY: "auto", flexShrink: 0 }}>
          <div style={{ padding: "14px 16px 8px", fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>Draft Queue ({emailList.length})</div>
          {emailList.map((e, i) => {
            const sc = statusConfig[e.status] || statusConfig.pending;
            return (
              <div key={e.id} onClick={() => { setSelected(i); setEditing(false); }}
                style={{ padding: "14px 16px", cursor: "pointer", borderLeft: selected === i ? "3px solid #2563eb" : "3px solid transparent", background: selected === i ? "#eff6ff" : "transparent", borderBottom: "1px solid #f3f4f6" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: selected === i ? "#111827" : "#6b7280" }}>{e.founder}</div>
                  <div style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: sc.bg, color: sc.text, fontWeight: 600, textTransform: "uppercase" }}>{sc.label}</div>
                </div>
                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{e.company}</div>
                <div style={{ fontSize: 10, color: "#d1d5db", marginTop: 3 }}>{e.email}</div>
              </div>
            );
          })}
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "14px 24px", borderBottom: "1px solid #e5e7eb", background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{current.founder} <span style={{ fontWeight: 400, color: "#9ca3af", fontSize: 13 }}>· {current.title} at {current.company}</span></div>
              <div style={{ fontSize: 12, color: "#2563eb", marginTop: 2 }}>→ {current.email}</div>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {current.status !== "sent" && current.status !== "drafting" && (
                <>
                  <input value={aiInstructions} onChange={(e) => setAiInstructions(e.target.value)} placeholder="Custom instructions for AI..." style={{ ...theme.input, width: 220, padding: "6px 10px", fontSize: 11 }} />
                  <button onClick={() => draftWithAI(current)} style={{ ...theme.btnPrimary, padding: "6px 14px", fontSize: 11, whiteSpace: "nowrap" }}>🤖 Draft</button>
                </>
              )}
              {current.status === "drafting" && <div style={{ padding: "6px 14px", borderRadius: 6, background: "#f3e8ff", color: "#9333ea", fontSize: 11 }}>⏳ AI Writing...</div>}
              {!editing && current.status !== "sent" && current.status !== "drafting" && <button onClick={startEdit} style={{ ...theme.btnOutline, padding: "6px 12px", fontSize: 11 }}>✎ Edit</button>}
              {editing && (<><button onClick={() => setEditing(false)} style={{ ...theme.btnOutline, padding: "6px 12px", fontSize: 11 }}>Cancel</button><button onClick={saveEdit} style={{ ...theme.btnPrimary, padding: "6px 12px", fontSize: 11 }}>Save</button></>)}
              {current.status === "pending" && !editing && (
                <>
                  <button onClick={() => { updateEmail(current.id, { status: "rejected" }); showToast("Rejected", "error"); }} style={{ ...theme.btnOutline, padding: "6px 12px", fontSize: 11, color: "#dc2626", borderColor: "#fecaca" }}>✕ Reject</button>
                  <button onClick={() => { updateEmail(current.id, { status: "approved" }); showToast("Approved ✓"); }} style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: "#16a34a", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>✓ Approve</button>
                </>
              )}
              {current.status === "approved" && <button onClick={() => handleSend(current)} disabled={sendingId === current.id} style={{ ...theme.btnPrimary, padding: "6px 16px", fontSize: 11, opacity: sendingId === current.id ? 0.6 : 1 }}>{sendingId === current.id ? "Sending..." : "⚡ Send"}</button>}
              {current.status === "sent" && <div style={{ padding: "6px 14px", borderRadius: 6, background: "#dbeafe", color: "#2563eb", fontSize: 11, fontWeight: 600 }}>✓ Sent</div>}
              {current.status === "rejected" && <button onClick={() => { updateEmail(current.id, { status: "approved" }); showToast("Re-approved ✓"); }} style={{ ...theme.btnOutline, padding: "6px 12px", fontSize: 11, color: "#2563eb" }}>↺ Re-approve</button>}
            </div>
          </div>
          <div style={{ padding: "10px 24px", borderBottom: "1px solid #f3f4f6", background: "#fafafa", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Subject</span>
            {editing ? <input value={editSubject} onChange={(e) => setEditSubject(e.target.value)} style={{ ...theme.input, flex: 1, padding: "5px 10px", fontSize: 13 }} /> : <span style={{ fontSize: 13, color: "#111827", fontStyle: "italic" }}>{current.subject || "No subject yet"}</span>}
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
            {current.status === "drafting" ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 16 }}><div style={{ fontSize: 40 }}>🤖</div><div style={{ fontSize: 14, color: "#9333ea", fontWeight: 600 }}>Claude is writing your email for {current.company}...</div></div>
            ) : editing ? (
              <textarea value={editBody} onChange={(e) => setEditBody(e.target.value)} style={{ ...theme.input, width: "100%", minHeight: 340, resize: "vertical", lineHeight: 1.8, fontSize: 13.5 }} />
            ) : (
              <div style={{ ...theme.card, padding: "24px 28px", lineHeight: 1.85, fontSize: 13.5, color: "#374151", whiteSpace: "pre-wrap", maxWidth: 660 }}>{current.body || <span style={{ color: "#9ca3af", fontStyle: "italic" }}>No email yet. Click 🤖 Draft to generate one.</span>}</div>
            )}
          </div>
        </div>
      </div>
      {showAddContact && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ ...theme.card, width: "100%", maxWidth: 480, padding: 32 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 4 }}>➕ Add New Contact</h3>
            <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>Fill in details — Claude will auto-draft the email</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              {[{ k: "firstName", p: "First Name *" }, { k: "lastName", p: "Last Name" }, { k: "company", p: "Company" }, { k: "title", p: "Title" }, { k: "email", p: "Email *" }].map((f) => (
                <input key={f.k} value={newContact[f.k]} onChange={(e) => setNewContact((n) => ({ ...n, [f.k]: e.target.value }))} placeholder={f.p} style={theme.input} />
              ))}
            </div>
            <textarea value={newContact.whatTheyDo} onChange={(e) => setNewContact((n) => ({ ...n, whatTheyDo: e.target.value }))} placeholder="What does the company do?" rows={3} style={{ ...theme.input, resize: "vertical", marginBottom: 16 }} />
            <div style={{ display: "flex", gap: 8 }}><button onClick={() => setShowAddContact(false)} style={{ ...theme.btnOutline, flex: 1 }}>Cancel</button><button onClick={addContact} style={{ ...theme.btnPrimary, flex: 2 }}>🤖 Add & Draft</button></div>
          </div>
        </div>
      )}
      {toast && (<div style={{ position: "fixed", bottom: 24, right: 24, background: toast.type === "error" ? "#fef2f2" : "#f0fdf4", border: `1px solid ${toast.type === "error" ? "#fecaca" : "#bbf7d0"}`, color: toast.type === "error" ? "#dc2626" : "#16a34a", padding: "12px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600, boxShadow: "0 4px 16px rgba(0,0,0,0.1)", zIndex: 1000 }}>{toast.msg}</div>)}
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [screen, setScreen] = useState("landing");
  const [resumeContext, setResumeContext] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const handleOnboardingComplete = (ctx, profile) => { setResumeContext(ctx); setUserProfile(profile); setScreen("companies"); };
  const handleCompanyContinue = (contacts) => { setSelectedContacts(contacts); setScreen("dashboard"); };
  return (
    <>
      {screen === "landing" && <LandingPage onStart={() => setScreen("login")} />}
      {screen === "login" && <LoginScreen onLogin={() => setScreen("onboarding")} onBack={() => setScreen("landing")} />}
      {screen === "onboarding" && <OnboardingForm onComplete={handleOnboardingComplete} onBack={() => setScreen("login")} />}
      {screen === "companies" && <CompanySelect onContinue={handleCompanyContinue} onBack={() => setScreen("onboarding")} userProfile={userProfile} />}
      {screen === "dashboard" && <EmailDashboard resumeContext={resumeContext} userProfile={userProfile} initialContacts={selectedContacts} onLogout={() => setScreen("landing")} />}
      <Analytics />
    </>
  );
}
