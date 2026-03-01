import { useState } from "react";
import { Analytics } from "@vercel/analytics/react";

// ============================================================
// CONFIG
// ============================================================
const CORRECT_PASSWORD = "vijay@outreach2024";
const CLAUDE_API_KEY = process.env.REACT_APP_CLAUDE_API_KEY;

// ============================================================
// STYLES (Figma OutreachAI theme)
// ============================================================
const theme = {
  gradient: "linear-gradient(135deg, #2563eb, #9333ea)",
  bg: "linear-gradient(135deg, #eff6ff, #ffffff, #faf5ff)",
  card: { background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
  input: { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" },
  label: { fontSize: 13, fontWeight: 600, color: "#1f2937", marginBottom: 4, display: "block" },
  btnPrimary: { padding: "10px 24px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #2563eb, #9333ea)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  btnOutline: { padding: "10px 24px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", color: "#374151", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  btnGhost: { padding: "8px 16px", borderRadius: 8, border: "none", background: "transparent", color: "#6b7280", fontSize: 13, cursor: "pointer", fontFamily: "inherit" },
  heading: { fontSize: 14, fontWeight: 700, color: "#111827" },
  subtext: { fontSize: 13, color: "#6b7280" },
};

// ============================================================
// EMAIL SYSTEM PROMPT
// ============================================================
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

const initialEmails = [
  { id: 1, founder: "Ishaan Shakunt", firstName: "Ishaan", title: "Founder", company: "Spear Growth", email: "ishaan@speargrowth.com", subject: "Helping Spear Growth Scale Even Further", body: "", status: "pending" },
  { id: 2, founder: "Vipin Guliani", firstName: "Vipin", title: "Founder & CEO", company: "Eridium Digital", email: "vipin@eridium.com", subject: "Wanting to Grow With Eridium", body: "", status: "pending" },
  { id: 3, founder: "Hitesh Lalwani", firstName: "Hitesh", title: "CEO & Founder", company: "Intent Farm", email: "hitesh@intentfarm.com", subject: "Would Love to Be Part of What You're Building", body: "", status: "pending" },
  { id: 4, founder: "Ganesh Raman", firstName: "Ganesh", title: "Founder & CEO", company: "Freeflow Ideas", email: "ganesh@freeflowideas.in", subject: "Excited to Contribute to Freeflow's Creative Journey", body: "", status: "pending" },
  { id: 5, founder: "Saanand Warrier", firstName: "Saanand", title: "CEO", company: "Wirality", email: "saanand@wirality.co", subject: "Would Love to Learn the Craft at Wirality", body: "", status: "pending" },
];

const statusConfig = {
  pending: { bg: "#f3f4f6", text: "#6b7280", label: "Pending" },
  approved: { bg: "#dcfce7", text: "#16a34a", label: "Approved" },
  sent: { bg: "#dbeafe", text: "#2563eb", label: "Sent" },
  rejected: { bg: "#fee2e2", text: "#dc2626", label: "Rejected" },
  drafting: { bg: "#f3e8ff", text: "#9333ea", label: "AI Drafting..." },
};

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
          <h1 style={{ fontSize: 48, fontWeight: 800, marginBottom: 20, background: theme.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.15 }}>
            AI-Powered Cold Email Outreach for Job Seekers
          </h1>
          <p style={{ fontSize: 18, color: "#6b7280", marginBottom: 32, lineHeight: 1.6 }}>
            Stop spending hours researching companies and crafting personalized emails.
            Let AI do the heavy lifting while you focus on landing your dream job.
          </p>
          <button onClick={onStart} style={{ ...theme.btnPrimary, padding: "14px 32px", fontSize: 16 }}>
            Start Your Outreach Journey →
          </button>
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
              { n: "2", t: "AI Analyzes", d: "Our AI understands your profile and requirements" },
              { n: "3", t: "Research Companies", d: "AI researches target companies and founders" },
              { n: "4", t: "Send Emails", d: "Personalized emails sent from your address" },
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

      <footer style={{ borderTop: "1px solid #e5e7eb", padding: "24px", marginTop: 80, textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
        © 2026 OutreachAI. Helping job seekers connect with founders.
      </footer>
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

  const handleLogin = () => {
    if (password === CORRECT_PASSWORD) { onLogin(); }
    else { setError(true); setShake(true); setTimeout(() => setShake(false), 500); }
  };

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div style={{ ...theme.card, padding: "48px 40px", width: 400, textAlign: "center", animation: shake ? "shake 0.4s ease" : "none" }}>
        <div style={{ width: 56, height: 56, background: theme.gradient, borderRadius: 14, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>✨</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 6 }}>Welcome to OutreachAI</h2>
        <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 28 }}>Enter your password to continue</p>
        <input type="password" value={password}
          onChange={(e) => { setPassword(e.target.value); setError(false); }}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          placeholder="Enter password"
          style={{ ...theme.input, marginBottom: error ? 8 : 16, textAlign: "center", letterSpacing: "0.1em", borderColor: error ? "#ef4444" : "#d1d5db" }}
        />
        {error && <div style={{ fontSize: 12, color: "#ef4444", marginBottom: 16 }}>Incorrect password. Try again.</div>}
        <button onClick={handleLogin} style={{ ...theme.btnPrimary, width: "100%", marginBottom: 12 }}>Login</button>
        <button onClick={onBack} style={{ ...theme.btnGhost, width: "100%" }}>← Back to Home</button>
      </div>
      <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }`}</style>
    </div>
  );
}

// ============================================================
// ONBOARDING FORM
// ============================================================
function OnboardingForm({ onComplete, onBack }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", degree: "", college: "", gradYear: "", targetRole: "", location: "", industry: "", companySize: "", internships: "", skills: "", additional: "" });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.targetRole) { alert("Please fill in Name, Email, and Target Role"); return; }

    const ctx = [
      `Candidate: ${form.name}`,
      form.degree && form.college ? `Degree: ${form.degree}, ${form.college}${form.gradYear ? ` (${form.gradYear})` : ""}` : "",
      form.phone ? `Phone: ${form.phone}` : "",
      form.targetRole ? `Target Role: ${form.targetRole}` : "",
      form.location ? `Preferred Location: ${form.location}` : "",
      form.industry ? `Target Industry: ${form.industry}` : "",
      form.companySize ? `Company Size Preference: ${form.companySize}` : "",
      form.internships ? `Internships & Experience:\n${form.internships}` : "",
      form.skills ? `Skills: ${form.skills}` : "",
      form.additional ? `Additional Context: ${form.additional}` : "",
    ].filter(Boolean).join("\n");

    onComplete(ctx, form);
  };

  const Field = ({ label, k, required, placeholder, type }) => (
    <div style={{ marginBottom: 14 }}>
      <label style={theme.label}>{label}{required && " *"}</label>
      <input type={type || "text"} value={form[k]} onChange={(e) => set(k, e.target.value)} placeholder={placeholder} required={required} style={theme.input} />
    </div>
  );

  const TextArea = ({ label, k, placeholder, rows }) => (
    <div style={{ marginBottom: 14 }}>
      <label style={theme.label}>{label}</label>
      <textarea value={form[k]} onChange={(e) => set(k, e.target.value)} placeholder={placeholder} rows={rows || 4}
        style={{ ...theme.input, resize: "vertical", minHeight: 80, lineHeight: 1.5 }} />
    </div>
  );

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
        <p style={{ color: "#6b7280", marginBottom: 32, fontSize: 15 }}>Tell us about yourself. Our AI will use this to craft personalized outreach emails.</p>

        <form onSubmit={handleSubmit}>
          <div style={{ ...theme.card, padding: 28, marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Basic Information</h3>
            <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 18 }}>Your personal details and contact info</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Full Name" k="name" required placeholder="Vijay Srinivassan" />
              <Field label="Email" k="email" required placeholder="vijay@example.com" type="email" />
              <Field label="Phone Number" k="phone" placeholder="9653941593" />
              <Field label="Graduation Year" k="gradYear" placeholder="2025" />
              <Field label="Degree" k="degree" placeholder="MBA in Marketing & Operations" />
              <Field label="College" k="college" placeholder="Dr. NGP Institute of Technology" />
            </div>
          </div>

          <div style={{ ...theme.card, padding: 28, marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Job Preferences</h3>
            <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 18 }}>Help AI understand what you're looking for</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Target Role" k="targetRole" required placeholder="Marketing Intern" />
              <Field label="Preferred Location" k="location" placeholder="Bangalore, Remote" />
              <Field label="Target Industry" k="industry" placeholder="SaaS, Digital Marketing, D2C" />
              <Field label="Ideal Company Size" k="companySize" placeholder="Seed stage, 10-50 employees" />
            </div>
          </div>

          <div style={{ ...theme.card, padding: 28, marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Experience & Skills</h3>
            <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 18 }}>Your background that AI will reference in emails</p>
            <TextArea label="Internships & Experience" k="internships" rows={5}
              placeholder={"1. VilFresh (May-Jun 2025) - Built N8N automation, WhatsApp bots\n2. Stead (Dec 2024-Jan 2025) - Apollo.io campaigns, SEO articles\n3. TheX.Press (Aug-Sep 2024) - 30+ blogs, business model"} />
            <Field label="Skills" k="skills" placeholder="SEO, Apollo.io, HubSpot CRM, Google Ads, N8N, WordPress" />
          </div>

          <div style={{ ...theme.card, padding: 28, marginBottom: 28 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Additional Instructions</h3>
            <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 18 }}>Anything else AI should know</p>
            <TextArea label="" k="additional" rows={4}
              placeholder="e.g. I'm open to working for free initially, I want to focus on performance marketing agencies in India..." />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <button type="button" onClick={onBack} style={theme.btnOutline}>Cancel</button>
            <button type="submit" style={theme.btnPrimary}>✨ Start AI Outreach</button>
          </div>
        </form>
      </main>
    </div>
  );
}

// ============================================================
// COMPANY SELECT (Placeholder for Apollo ICP)
// ============================================================
function CompanySelect({ onContinue, onBack }) {
  const [companies] = useState(initialEmails.map((e) => ({ ...e, selected: true })));
  const [selected, setSelected] = useState(new Set(initialEmails.map((e) => e.id)));

  const toggle = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

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
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#111827", marginBottom: 8 }}>Select Target Companies</h1>
        <p style={{ color: "#6b7280", marginBottom: 8, fontSize: 15 }}>Choose which founders you want to reach out to. AI will draft personalized emails for each.</p>
        <p style={{ color: "#9ca3af", marginBottom: 28, fontSize: 13, fontStyle: "italic" }}>🔌 Apollo ICP integration coming soon — these are pre-loaded contacts for now.</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
          {companies.map((c) => (
            <div key={c.id} onClick={() => toggle(c.id)}
              style={{ ...theme.card, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", borderColor: selected.has(c.id) ? "#2563eb" : "#e5e7eb", background: selected.has(c.id) ? "#eff6ff" : "#fff", transition: "all 0.15s" }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, border: selected.has(c.id) ? "none" : "2px solid #d1d5db", background: selected.has(c.id) ? theme.gradient : "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                {selected.has(c.id) && "✓"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: "#111827", fontSize: 14 }}>{c.founder}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{c.title} at {c.company}</div>
              </div>
              <div style={{ fontSize: 12, color: "#9ca3af" }}>{c.email}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "#6b7280" }}>{selected.size} of {companies.length} selected</span>
          <button onClick={() => onContinue([...selected])} disabled={selected.size === 0}
            style={{ ...theme.btnPrimary, opacity: selected.size === 0 ? 0.5 : 1 }}>
            Draft Emails for {selected.size} Founders →
          </button>
        </div>
      </main>
    </div>
  );
}

// ============================================================
// EMAIL DASHBOARD
// ============================================================
function EmailDashboard({ resumeContext, userProfile, onLogout }) {
  const [emailList, setEmailList] = useState(initialEmails);
  const [selected, setSelected] = useState(0);
  const [editing, setEditing] = useState(false);
  const [editBody, setEditBody] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [sendingId, setSendingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [aiInstructions, setAiInstructions] = useState("");
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ firstName: "", lastName: "", company: "", email: "", title: "", whatTheyDo: "" });

  const current = emailList[selected];
  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };
  const updateEmail = (id, updates) => setEmailList((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));

  const startEdit = () => { setEditBody(current.body); setEditSubject(current.subject); setEditing(true); };
  const saveEdit = () => { updateEmail(current.id, { body: editBody, subject: editSubject }); setEditing(false); showToast("Saved ✓"); };

  const draftWithAI = async (emailObj) => {
    if (!CLAUDE_API_KEY) { showToast("API key not configured", "error"); return; }
    updateEmail(emailObj.id, { status: "drafting" });
    try {
      const userPrompt = `Write a personalized outreach email to ${emailObj.firstName}, who is ${emailObj.title} at ${emailObj.company}.
${emailObj.whatTheyDo ? `About the company: ${emailObj.whatTheyDo}` : ""}
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
    const entry = { id: Date.now(), founder: fullName, firstName: newContact.firstName, title: newContact.title || "Founder", company: newContact.company, email: newContact.email, whatTheyDo: newContact.whatTheyDo, subject: "", body: "", status: "pending" };
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

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: "#f9fafb", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #e5e7eb", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: theme.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>✨</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>OutreachAI Dashboard</div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>Powered by Claude Sonnet 4.5 · {userProfile?.name || "User"}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {[{ l: "Pending", v: pendingCount, c: "#6b7280" }, { l: "Approved", v: approvedCount, c: "#16a34a" }, { l: "Sent", v: sentCount, c: "#2563eb" }].map((s) => (
            <div key={s.l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: s.c }}>{s.v}</div>
              <div style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.l}</div>
            </div>
          ))}
          <button onClick={() => setShowAddContact(true)} style={{ ...theme.btnPrimary, padding: "8px 14px", fontSize: 12 }}>+ Add Contact</button>
          <button onClick={onLogout} style={{ ...theme.btnGhost, fontSize: 11 }}>Logout</button>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={{ width: 260, borderRight: "1px solid #e5e7eb", background: "#fff", overflowY: "auto", flexShrink: 0 }}>
          <div style={{ padding: "14px 16px 8px", fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>Draft Queue</div>
          {emailList.map((e, i) => {
            const sc = statusConfig[e.status] || statusConfig.pending;
            return (
              <div key={e.id} onClick={() => { setSelected(i); setEditing(false); }}
                style={{ padding: "14px 16px", cursor: "pointer", borderLeft: selected === i ? "3px solid #2563eb" : "3px solid transparent", background: selected === i ? "#eff6ff" : "transparent", borderBottom: "1px solid #f3f4f6", transition: "all 0.15s" }}>
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

        {/* Main */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Email header */}
          <div style={{ padding: "14px 24px", borderBottom: "1px solid #e5e7eb", background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>
                {current.founder} <span style={{ fontWeight: 400, color: "#9ca3af", fontSize: 13 }}>· {current.title} at {current.company}</span>
              </div>
              <div style={{ fontSize: 12, color: "#2563eb", marginTop: 2 }}>→ {current.email}</div>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {current.status !== "sent" && current.status !== "drafting" && (
                <>
                  <input value={aiInstructions} onChange={(e) => setAiInstructions(e.target.value)} placeholder="Custom instructions for AI..."
                    style={{ ...theme.input, width: 240, padding: "6px 10px", fontSize: 11 }} />
                  <button onClick={() => draftWithAI(current)} style={{ ...theme.btnPrimary, padding: "6px 14px", fontSize: 11, whiteSpace: "nowrap" }}>🤖 Draft with AI</button>
                </>
              )}
              {current.status === "drafting" && <div style={{ padding: "6px 14px", borderRadius: 6, background: "#f3e8ff", color: "#9333ea", fontSize: 11 }}>⏳ AI Writing...</div>}
              {!editing && current.status !== "sent" && current.status !== "drafting" && (
                <button onClick={startEdit} style={{ ...theme.btnOutline, padding: "6px 12px", fontSize: 11 }}>✎ Edit</button>
              )}
              {editing && (
                <>
                  <button onClick={() => setEditing(false)} style={{ ...theme.btnOutline, padding: "6px 12px", fontSize: 11 }}>Cancel</button>
                  <button onClick={saveEdit} style={{ ...theme.btnPrimary, padding: "6px 12px", fontSize: 11 }}>Save</button>
                </>
              )}
              {current.status === "pending" && !editing && (
                <>
                  <button onClick={() => { updateEmail(current.id, { status: "rejected" }); showToast("Rejected", "error"); }}
                    style={{ ...theme.btnOutline, padding: "6px 12px", fontSize: 11, color: "#dc2626", borderColor: "#fecaca" }}>✕ Reject</button>
                  <button onClick={() => { updateEmail(current.id, { status: "approved" }); showToast("Approved ✓"); }}
                    style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: "#16a34a", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>✓ Approve</button>
                </>
              )}
              {current.status === "approved" && (
                <button onClick={() => handleSend(current)} disabled={sendingId === current.id}
                  style={{ ...theme.btnPrimary, padding: "6px 16px", fontSize: 11, opacity: sendingId === current.id ? 0.6 : 1 }}>
                  {sendingId === current.id ? "Sending..." : "⚡ Send"}
                </button>
              )}
              {current.status === "sent" && <div style={{ padding: "6px 14px", borderRadius: 6, background: "#dbeafe", color: "#2563eb", fontSize: 11, fontWeight: 600 }}>✓ Sent</div>}
              {current.status === "rejected" && (
                <button onClick={() => { updateEmail(current.id, { status: "approved" }); showToast("Re-approved ✓"); }}
                  style={{ ...theme.btnOutline, padding: "6px 12px", fontSize: 11, color: "#2563eb" }}>↺ Re-approve</button>
              )}
            </div>
          </div>

          {/* Subject */}
          <div style={{ padding: "10px 24px", borderBottom: "1px solid #f3f4f6", background: "#fafafa", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Subject</span>
            {editing ? (
              <input value={editSubject} onChange={(e) => setEditSubject(e.target.value)} style={{ ...theme.input, flex: 1, padding: "5px 10px", fontSize: 13 }} />
            ) : (
              <span style={{ fontSize: 13, color: "#111827", fontStyle: "italic" }}>{current.subject || "No subject yet"}</span>
            )}
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
            {current.status === "drafting" ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 16 }}>
                <div style={{ fontSize: 40 }}>🤖</div>
                <div style={{ fontSize: 14, color: "#9333ea", fontWeight: 600 }}>Claude is writing your email for {current.company}...</div>
                <div style={{ fontSize: 12, color: "#9ca3af" }}>This takes about 10-15 seconds</div>
              </div>
            ) : editing ? (
              <textarea value={editBody} onChange={(e) => setEditBody(e.target.value)}
                style={{ ...theme.input, width: "100%", minHeight: 340, resize: "vertical", lineHeight: 1.8, fontSize: 13.5 }} />
            ) : (
              <div style={{ ...theme.card, padding: "24px 28px", lineHeight: 1.85, fontSize: 13.5, color: "#374151", whiteSpace: "pre-wrap", maxWidth: 660 }}>
                {current.body || <span style={{ color: "#9ca3af", fontStyle: "italic" }}>No email yet. Click 🤖 Draft with AI to generate one.</span>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Contact Modal */}
      {showAddContact && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ ...theme.card, width: "100%", maxWidth: 480, padding: 32 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 4 }}>➕ Add New Contact</h3>
            <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>Fill in details — Claude will auto-draft the email</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              {[{ k: "firstName", p: "First Name *" }, { k: "lastName", p: "Last Name" }, { k: "company", p: "Company" }, { k: "title", p: "Title (Founder, CEO...)" }, { k: "email", p: "Email *" }].map((f) => (
                <input key={f.k} value={newContact[f.k]} onChange={(e) => setNewContact((n) => ({ ...n, [f.k]: e.target.value }))} placeholder={f.p} style={theme.input} />
              ))}
            </div>
            <textarea value={newContact.whatTheyDo} onChange={(e) => setNewContact((n) => ({ ...n, whatTheyDo: e.target.value }))}
              placeholder="What does the company do? (helps AI personalize)" rows={3} style={{ ...theme.input, resize: "vertical", marginBottom: 16 }} />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setShowAddContact(false)} style={{ ...theme.btnOutline, flex: 1 }}>Cancel</button>
              <button onClick={addContact} style={{ ...theme.btnPrimary, flex: 2 }}>🤖 Add & Draft</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: toast.type === "error" ? "#fef2f2" : "#f0fdf4",
          border: `1px solid ${toast.type === "error" ? "#fecaca" : "#bbf7d0"}`, color: toast.type === "error" ? "#dc2626" : "#16a34a",
          padding: "12px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600, boxShadow: "0 4px 16px rgba(0,0,0,0.1)", zIndex: 1000 }}>
          {toast.msg}
        </div>
      )}
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

  const handleOnboardingComplete = (ctx, profile) => {
    setResumeContext(ctx);
    setUserProfile(profile);
    setScreen("companies");
  };

  return (
    <>
      {screen === "landing" && <LandingPage onStart={() => setScreen("login")} />}
      {screen === "login" && <LoginScreen onLogin={() => setScreen("onboarding")} onBack={() => setScreen("landing")} />}
      {screen === "onboarding" && <OnboardingForm onComplete={handleOnboardingComplete} onBack={() => setScreen("login")} />}
      {screen === "companies" && <CompanySelect onContinue={() => setScreen("dashboard")} onBack={() => setScreen("onboarding")} />}
      {screen === "dashboard" && <EmailDashboard resumeContext={resumeContext} userProfile={userProfile} onLogout={() => setScreen("landing")} />}
      <Analytics />
    </>
  );
}
