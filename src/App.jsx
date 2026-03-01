import { useState } from "react";

// ============================================================
// CHANGE YOUR PASSWORD HERE
// ============================================================
const CORRECT_PASSWORD = "vijay@outreach2024";

// ============================================================
// CHANGE YOUR CLAUDE API KEY HERE (from console.anthropic.com)
// ============================================================
const CLAUDE_API_KEY = "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";

const RESUME_CONTEXT = `
Candidate: Vijay Srinivassan S J
Degree: MBA in Marketing & Operations, Dr. NGP Institute of Technology, Coimbatore (Sep 2023 - Oct 2025)
Undergraduate: Bachelor of Commerce in International Business, Dr. NGP Arts & Science College (Apr 2020 - Mar 2023)

Internships:
1. VilFresh (May 2025 - Jun 2025) - Built N8N automation agent for customer data collection, Looker Studio reports, WhatsApp automation, and AI Chatbot for order queries
2. Stead (Dec 2024 - Jan 2025) - Drafted ICP for UI/UX agency, authored 2 SEO articles, set up Apollo.io email campaigns for US clients
3. TheX.Press (Aug 2024 - Sep 2024) - Authored 30+ blogs, redrafted business model segment

Skills: SEO, Content Management (WordPress & Shopify), Social Media Marketing, PPC (Google Ads), Apollo.io, HubSpot CRM, N8N automation, Google Slides, Google Sheets
`;

const EMAIL_SYSTEM_PROMPT = `You are an email drafting agent writing on behalf of Vijay Srinivassan S J, an MBA fresher looking for a marketing/sales internship at small startups.

RULES:
- Address only the founder by first name
- Opening: Who you are (name, degree, college) + how you found them + ONE line on what impressed you about the company (focus on business impact/revenue/growth outcome, not features, max 15 words)
- Middle: Why you want to intern + what you can do for them (base this on typical job duties for that role at similar companies)
- Experience: What relevant experience you have from the resume (keep it real, don't exaggerate)
- Always end with EXACTLY these two lines verbatim:
  "I am willing to work absolutely for free, for the first two months, post which you can hire me, based on my performance. I am pretty confident that I would be a great hire."
  "I have attached my resume for further reference. Looking forward to hearing back from you."
- Sign off: "Thank You,\nVijay Srinivassan S J\n9653941593"
- Vocabulary: Simple Indian English, no complicated words, young and hungry tone
- Total email: 150-200 words
- Output ONLY the email body, no subject line, no extra commentary`;

const initialEmails = [
  { id: 1, founder: "Ishaan Shakunt", firstName: "Ishaan", title: "Founder", company: "Spear Growth", email: "ishaan@speargrowth.com", subject: "Helping Spear Growth Scale Even Further", body: `Hi Ishaan,\n\nI am Vijay Srinivassan, an MBA fresher from Dr. NGP Institute of Technology, Coimbatore. I came across Spear Growth on LinkedIn and was genuinely impressed by how your team helps B2B SaaS companies turn marketing spend directly into sales pipeline.\n\nI would love to intern with you, as I believe this would be a great way to start my career in performance marketing and growth. I am willing to research and qualify outbound leads, assist in building SEO and ad campaign reports, support client communication and follow-ups, and help maintain relationships with existing accounts.\n\nI have experience setting up emailing campaigns on Apollo.io, managing leads on HubSpot CRM, creating SEO content, and building N8N automation agents during my previous internships at Stead and VilFresh.\n\nI am willing to work absolutely for free, for the first two months, post which you can hire me, based on my performance. I am pretty confident that I would be a great hire.\n\nI have attached my resume for further reference. Looking forward to hearing back from you.\n\nThank You,\nVijay Srinivassan S J\n9653941593`, status: "pending" },
  { id: 2, founder: "Vipin Guliani", firstName: "Vipin", title: "Founder & CEO", company: "Eridium Digital", email: "vipin@eridium.com", subject: "Wanting to Grow With Eridium", body: `Hi Vipin,\n\nI am Vijay Srinivassan, an MBA fresher from Dr. NGP Institute of Technology, Coimbatore. I found Eridium on LinkedIn and was really impressed by how your team turns data and consumer intent into real business outcomes for brands.\n\nI would love to intern with you, as I believe this would be a great way to kick-start my marketing career. I am willing to support SEO content creation, assist in performance marketing campaign reporting, handle client coordination and follow-ups, and help manage social media calendars and execution.\n\nI have hands-on experience with Apollo.io for lead generation, HubSpot for CRM management, and I have authored 30+ blogs and set up automated email campaigns during my stints at Stead and TheX.Press.\n\nI am willing to work absolutely for free, for the first two months, post which you can hire me, based on my performance. I am pretty confident that I would be a great hire.\n\nI have attached my resume for further reference. Looking forward to hearing back from you.\n\nThank You,\nVijay Srinivassan S J\n9653941593`, status: "pending" },
  { id: 3, founder: "Hitesh Lalwani", firstName: "Hitesh", title: "CEO & Founder", company: "Intent Farm", email: "hitesh@intentfarm.com", subject: "Would Love to Be Part of What You're Building", body: `Hi Hitesh,\n\nI am Vijay Srinivassan, an MBA fresher from Dr. NGP Institute of Technology, Coimbatore. I came across Intent Farm on LinkedIn and was really impressed by how your team converts ad spends into measurable revenue growth for 150+ brands across eCommerce and D2C.\n\nI would love to intern with you, as I believe this is exactly the kind of environment where I can learn fast and contribute meaningfully. I am willing to assist in managing Google and Meta ad campaign dashboards, qualify and filter inbound leads, support client reporting and follow-ups, and coordinate with internal teams on campaign execution.\n\nI have experience setting up lead generation workflows on Apollo.io, managing leads through HubSpot CRM, and building automation agents during my internships at Stead and VilFresh.\n\nI am willing to work absolutely for free, for the first two months, post which you can hire me, based on my performance. I am pretty confident that I would be a great hire.\n\nI have attached my resume for further reference. Looking forward to hearing back from you.\n\nThank You,\nVijay Srinivassan S J\n9653941593`, status: "pending" },
  { id: 4, founder: "Ganesh Raman", firstName: "Ganesh", title: "Founder & CEO", company: "Freeflow Ideas", email: "ganesh@freeflowideas.in", subject: "Excited to Contribute to Freeflow's Creative Journey", body: `Hi Ganesh,\n\nI am Vijay Srinivassan, an MBA fresher from Dr. NGP Institute of Technology, Coimbatore. I came across Freeflow Ideas on LinkedIn and was genuinely impressed by how your team uses creative storytelling to help brands break through the noise and actually grow their business.\n\nI would love to intern with you, as I feel Freeflow's culture of fearless thinking is exactly where I want to begin my career. I am willing to support digital content creation and social media management, assist in client coordination and campaign reporting, help research brand insights and competitor analysis, and follow up with prospects and leads.\n\nI have experience writing SEO articles and blog content, running email campaigns on Apollo.io, and building AI-driven customer engagement tools during my internships at Stead and VilFresh.\n\nI am willing to work absolutely for free, for the first two months, post which you can hire me, based on my performance. I am pretty confident that I would be a great hire.\n\nI have attached my resume for further reference. Looking forward to hearing back from you.\n\nThank You,\nVijay Srinivassan S J\n9653941593`, status: "pending" },
  { id: 5, founder: "Saanand Warrier", firstName: "Saanand", title: "CEO", company: "Wirality", email: "saanand@wirality.co", subject: "Would Love to Learn the Craft at Wirality", body: `Hi Saanand,\n\nI am Vijay Srinivassan, an MBA fresher from Dr. NGP Institute of Technology, Coimbatore. I came across Wirality on LinkedIn and was really impressed by how your team uses narrative design and data together to actually move the needle on brand performance.\n\nI would love to intern with you, as I believe Wirality's focused and creative approach is exactly the environment I need to grow fast. I am willing to support social media and content strategy execution, manage campaign tracking and reporting, coordinate with clients and follow up on deliverables, and research brand and competitor insights.\n\nI have experience writing SEO content, setting up email outreach campaigns on Apollo.io, and building AI-powered automation tools during my internships at Stead and VilFresh.\n\nI am willing to work absolutely for free, for the first two months, post which you can hire me, based on my performance. I am pretty confident that I would be a great hire.\n\nI have attached my resume for further reference. Looking forward to hearing back from you.\n\nThank You,\nVijay Srinivassan S J\n9653941593`, status: "pending" },
];

const statusColors = {
  pending:  { bg: "#1e293b", text: "#94a3b8", label: "Pending Review" },
  approved: { bg: "#052e16", text: "#4ade80", label: "Approved" },
  sent:     { bg: "#1e3a5f", text: "#60a5fa", label: "Sent" },
  rejected: { bg: "#2d1515", text: "#f87171", label: "Rejected" },
  drafting: { bg: "#2d1b4e", text: "#c084fc", label: "AI Drafting..." },
};

// ============================================================
// LOGIN SCREEN
// ============================================================
function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleLogin = () => {
    if (password === CORRECT_PASSWORD) {
      onLogin();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Georgia', serif" }}>
      <div style={{ background: "#0d1424", border: "1px solid #1e293b", borderRadius: 16, padding: "48px 40px", width: 380, textAlign: "center", animation: shake ? "shake 0.4s ease" : "none" }}>
        <div style={{ width: 52, height: 52, borderRadius: 12, margin: "0 auto 20px", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>✉</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#e2e8f0", marginBottom: 6 }}>Vijay's Email Agent</div>
        <div style={{ fontSize: 12, color: "#475569", marginBottom: 32 }}>Private access only</div>
        <input
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(false); }}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          placeholder="Enter password"
          style={{ width: "100%", background: "#111827", border: error ? "1px solid #ef4444" : "1px solid #1e293b", borderRadius: 8, padding: "12px 16px", color: "#e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: error ? 8 : 16, textAlign: "center", letterSpacing: "0.1em" }}
        />
        {error && <div style={{ fontSize: 12, color: "#ef4444", marginBottom: 16 }}>Incorrect password. Try again.</div>}
        <button onClick={handleLogin} style={{ width: "100%", padding: "12px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          Login →
        </button>
      </div>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}`}</style>
    </div>
  );
}

// ============================================================
// MAIN EMAIL AGENT
// ============================================================
function EmailAgent({ onLogout }) {
  const [emailList, setEmailList] = useState(initialEmails);
  const [selected, setSelected] = useState(0);
  const [editing, setEditing] = useState(false);
  const [editBody, setEditBody] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [editFounder, setEditFounder] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [toast, setToast] = useState(null);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ firstName: "", lastName: "", company: "", email: "", title: "", whatTheyDo: "" });

  const current = emailList[selected];

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const updateEmail = (id, data) => setEmailList((prev) => prev.map((e) => (e.id === id ? { ...e, ...data } : e)));

  const startEdit = () => { setEditBody(current.body); setEditSubject(current.subject); setEditFounder(current.founder); setEditEmail(current.email); setEditing(true); };
  const saveEdit  = () => { updateEmail(current.id, { body: editBody, subject: editSubject, founder: editFounder, email: editEmail }); setEditing(false); showToast("Saved ✓"); };

  // ---- Claude AI Drafting ----
  const draftWithAI = async (emailObj) => {
    if (CLAUDE_API_KEY === "YOUR_CLAUDE_API_KEY_HERE") {
      showToast("Add your Claude API key in App.jsx line 14 first", "error");
      return;
    }
    updateEmail(emailObj.id, { status: "drafting" });
    try {
      const userPrompt = `Write a personalized internship outreach email to ${emailObj.firstName}, who is ${emailObj.title} at ${emailObj.company}.
${emailObj.whatTheyDo ? `About the company: ${emailObj.whatTheyDo}` : ""}

Candidate resume:
${RESUME_CONTEXT}`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": CLAUDE_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 600,
          system: EMAIL_SYSTEM_PROMPT,
          messages: [{ role: "user", content: userPrompt }],
        }),
      });

      const data = await response.json();
      if (data.content && data.content[0]) {
        updateEmail(emailObj.id, { body: data.content[0].text, status: "pending", subject: `Internship Opportunity - ${emailObj.company}` });
        showToast(`AI drafted email for ${emailObj.firstName} ✓`);
      } else {
        throw new Error(data.error?.message || "Unknown API error");
      }
    } catch (err) {
      updateEmail(emailObj.id, { status: "pending" });
      showToast("AI draft failed: " + err.message, "error");
    }
  };

  const handleApprove  = (id) => { updateEmail(id, { status: "approved" }); showToast("Approved ✓"); };
  const handleReject   = (id) => { updateEmail(id, { status: "rejected" }); showToast("Rejected", "error"); };
  const handleMarkSent = (id) => { updateEmail(id, { status: "sent" }); showToast("Marked as sent ✓"); };

  const exportToCSV = () => {
    const approved = emailList.filter((e) => e.status === "approved");
    if (approved.length === 0) { showToast("No approved emails to export", "error"); return; }
    const esc = (s) => `"${(s || "").replace(/"/g, '""')}"`;
    const headers = ["Name","Email","Company","Title","Email1_Subject","Email1_Body","Email2_Body","Status","Date_Sent","FollowUp_Date","FollowUp_Status"];
    const rows = approved.map((e) => [
      esc(e.founder), esc(e.email), esc(e.company), esc(e.title), esc(e.subject), esc(e.body),
      esc(`Hi ${e.firstName},\n\nJust following up on my previous email. I am still very much interested in interning with ${e.company} and willing to start for free. Would love just 10 minutes of your time.\n\nThank You,\nVijay Srinivassan S J\n9653941593`),
      esc("Approved"), esc(""), esc(""), esc("Pending"),
    ].join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "outreach_contacts.csv"; a.click();
    URL.revokeObjectURL(url);
    showToast(`Exported ${approved.length} contacts ✓`);
  };

  const addContact = async () => {
    if (!newContact.firstName || !newContact.email) { showToast("First name and email are required", "error"); return; }
    const id = Date.now();
    const fullName = `${newContact.firstName} ${newContact.lastName}`.trim();
    const newEntry = { id, founder: fullName, firstName: newContact.firstName, title: newContact.title || "Founder", company: newContact.company, email: newContact.email, subject: `Internship Opportunity - ${newContact.company}`, body: "", status: "pending", whatTheyDo: newContact.whatTheyDo };
    setEmailList((prev) => [...prev, newEntry]);
    setSelected(emailList.length);
    setShowAddContact(false);
    setNewContact({ firstName: "", lastName: "", company: "", email: "", title: "", whatTheyDo: "" });
    showToast(`${fullName} added — drafting email with AI...`);
    await draftWithAI(newEntry);
  };

  const approvedCount = emailList.filter((e) => e.status === "approved").length;
  const sentCount     = emailList.filter((e) => e.status === "sent").length;
  const pendingCount  = emailList.filter((e) => e.status === "pending").length;

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#0a0f1e", minHeight: "100vh", color: "#e2e8f0", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1e293b", padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0d1424" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>✉</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Vijay's Email Agent</div>
            <div style={{ fontSize: 11, color: "#64748b" }}>Powered by Claude Sonnet 4.5 · Bangalore Founders</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {[{ label: "Pending", val: pendingCount, color: "#94a3b8" }, { label: "Approved", val: approvedCount, color: "#4ade80" }, { label: "Sent", val: sentCount, color: "#60a5fa" }].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 9, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
            </div>
          ))}
          <button onClick={exportToCSV} style={{ padding: "8px 14px", borderRadius: 6, border: "none", cursor: "pointer", background: "linear-gradient(135deg, #059669, #0d9488)", color: "#fff", fontSize: 11, fontWeight: 700 }}>⬇ Export CSV</button>
          <button onClick={() => setShowAddContact(true)} style={{ padding: "8px 14px", borderRadius: 6, border: "none", cursor: "pointer", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "#fff", fontSize: 11, fontWeight: 700 }}>+ Add Contact</button>
          <button onClick={onLogout} style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #334155", background: "transparent", color: "#64748b", fontSize: 11, cursor: "pointer" }}>⎋ Logout</button>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Sidebar */}
        <div style={{ width: 250, borderRight: "1px solid #1e293b", background: "#0d1424", overflowY: "auto", flexShrink: 0 }}>
          <div style={{ padding: "12px 16px 6px", fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em" }}>Draft Queue</div>
          {emailList.map((e, i) => {
            const sc = statusColors[e.status] || statusColors.pending;
            return (
              <div key={e.id} onClick={() => { setSelected(i); setEditing(false); }} style={{ padding: "13px 16px", cursor: "pointer", borderLeft: selected === i ? "3px solid #3b82f6" : "3px solid transparent", background: selected === i ? "#111827" : "transparent", borderBottom: "1px solid #1a2235" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: selected === i ? "#e2e8f0" : "#94a3b8" }}>{e.founder}</div>
                  <div style={{ fontSize: 9, padding: "2px 5px", borderRadius: 4, background: sc.bg, color: sc.text, fontFamily: "monospace", textTransform: "uppercase" }}>{sc.label}</div>
                </div>
                <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{e.company}</div>
                <div style={{ fontSize: 10, color: "#334155", marginTop: 3, fontStyle: "italic" }}>{e.email}</div>
              </div>
            );
          })}
        </div>

        {/* Main Panel */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Contact Header */}
          <div style={{ padding: "14px 24px", borderBottom: "1px solid #1e293b", background: "#0d1424", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {editing ? (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", width: 70 }}>Name</span>
                    <input value={editFounder} onChange={(e) => setEditFounder(e.target.value)} style={{ background: "#111827", border: "1px solid #334155", borderRadius: 5, padding: "4px 9px", color: "#e2e8f0", fontSize: 13, outline: "none", width: 200 }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", width: 70 }}>Email ID</span>
                    <input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} style={{ background: "#111827", border: "1px solid #334155", borderRadius: 5, padding: "4px 9px", color: "#3b82f6", fontSize: 13, outline: "none", width: 240 }} />
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{current.founder} <span style={{ color: "#475569", fontWeight: 400, fontSize: 12 }}>· {current.title} at {current.company}</span></div>
                  <div style={{ fontSize: 12, color: "#3b82f6" }}>→ {current.email}</div>
                </>
              )}
            </div>

            <div style={{ display: "flex", gap: 7 }}>
              {current.status !== "sent" && current.status !== "drafting" && (
                <button onClick={() => draftWithAI(current)} style={{ padding: "6px 13px", borderRadius: 6, border: "none", cursor: "pointer", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "#fff", fontSize: 11, fontWeight: 700 }}>🤖 Draft with AI</button>
              )}
              {current.status === "drafting" && (
                <div style={{ padding: "6px 13px", borderRadius: 6, background: "#2d1b4e", color: "#c084fc", fontSize: 11 }}>⏳ AI Writing...</div>
              )}
              {!editing && current.status !== "sent" && current.status !== "drafting" && (
                <button onClick={startEdit} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #334155", background: "transparent", color: "#94a3b8", fontSize: 11, cursor: "pointer" }}>✎ Edit</button>
              )}
              {editing && (
                <>
                  <button onClick={() => setEditing(false)} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #334155", background: "transparent", color: "#94a3b8", fontSize: 11, cursor: "pointer" }}>Cancel</button>
                  <button onClick={saveEdit} style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: "#1d4ed8", color: "#fff", fontSize: 11, cursor: "pointer", fontWeight: 700 }}>Save</button>
                </>
              )}
              {current.status === "pending" && !editing && (
                <>
                  <button onClick={() => handleReject(current.id)} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #7f1d1d", background: "#2d1515", color: "#f87171", fontSize: 11, cursor: "pointer" }}>✕ Reject</button>
                  <button onClick={() => handleApprove(current.id)} style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: "#166534", color: "#4ade80", fontSize: 11, cursor: "pointer", fontWeight: 700 }}>✓ Approve</button>
                </>
              )}
              {current.status === "approved" && !editing && (
                <button onClick={() => handleMarkSent(current.id)} style={{ padding: "6px 16px", borderRadius: 6, border: "none", background: "linear-gradient(135deg, #2563eb, #7c3aed)", color: "#fff", fontSize: 11, cursor: "pointer", fontWeight: 700 }}>⚡ Mark Sent</button>
              )}
              {current.status === "sent" && <div style={{ padding: "6px 12px", borderRadius: 6, background: "#1e3a5f", color: "#60a5fa", fontSize: 11 }}>✓ Sent</div>}
              {current.status === "rejected" && !editing && (
                <button onClick={() => handleApprove(current.id)} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #1e3a5f", background: "transparent", color: "#60a5fa", fontSize: 11, cursor: "pointer" }}>↺ Re-approve</button>
              )}
            </div>
          </div>

          {/* Subject */}
          <div style={{ padding: "10px 24px", borderBottom: "1px solid #1a2235", background: "#0a0f1e", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em" }}>Subject</span>
            {editing
              ? <input value={editSubject} onChange={(e) => setEditSubject(e.target.value)} style={{ flex: 1, background: "#111827", border: "1px solid #334155", borderRadius: 5, padding: "5px 10px", color: "#e2e8f0", fontSize: 13, outline: "none" }} />
              : <span style={{ fontSize: 13, color: "#e2e8f0", fontStyle: "italic" }}>{current.subject}</span>
            }
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
            {current.status === "drafting" ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 16 }}>
                <div style={{ fontSize: 40 }}>🤖</div>
                <div style={{ fontSize: 14, color: "#c084fc" }}>Claude is writing your email for {current.company}...</div>
                <div style={{ fontSize: 12, color: "#475569" }}>This takes about 10–15 seconds</div>
              </div>
            ) : editing ? (
              <textarea value={editBody} onChange={(e) => setEditBody(e.target.value)} style={{ width: "100%", minHeight: 320, background: "#111827", border: "1px solid #334155", borderRadius: 8, padding: 16, color: "#e2e8f0", fontSize: 13, lineHeight: 1.8, outline: "none", resize: "vertical", fontFamily: "Georgia, serif", boxSizing: "border-box" }} />
            ) : (
              <div style={{ background: "#0d1424", borderRadius: 10, border: "1px solid #1e293b", padding: "24px 28px", lineHeight: 1.85, fontSize: 13.5, color: "#cbd5e1", whiteSpace: "pre-wrap", maxWidth: 660 }}>
                {current.body || <span style={{ color: "#475569", fontStyle: "italic" }}>No email yet. Click 🤖 Draft with AI to generate one.</span>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Contact Modal */}
      {showAddContact && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "#0d1424", border: "1px solid #334155", borderRadius: 12, width: "100%", maxWidth: 480, padding: 32 }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>➕ Add New Contact</div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 24 }}>Fill in details — Claude will auto-draft the email</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              {[{ k: "firstName", p: "First Name *" }, { k: "lastName", p: "Last Name" }, { k: "company", p: "Company Name" }, { k: "title", p: "Title (Founder, CEO...)" }, { k: "email", p: "Email ID *" }].map((f) => (
                <input key={f.k} value={newContact[f.k]} onChange={(e) => setNewContact((n) => ({ ...n, [f.k]: e.target.value }))} placeholder={f.p}
                  style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 7, padding: "9px 12px", color: "#e2e8f0", fontSize: 13, outline: "none" }} />
              ))}
            </div>
            <textarea value={newContact.whatTheyDo} onChange={(e) => setNewContact((n) => ({ ...n, whatTheyDo: e.target.value }))}
              placeholder="What does this company do? (helps AI write a better personalized email)"
              style={{ width: "100%", background: "#111827", border: "1px solid #1e293b", borderRadius: 7, padding: "9px 12px", color: "#e2e8f0", fontSize: 13, outline: "none", resize: "none", height: 72, boxSizing: "border-box", fontFamily: "Georgia, serif", marginBottom: 16 }} />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setShowAddContact(false)} style={{ flex: 1, padding: "10px", borderRadius: 7, border: "1px solid #334155", background: "transparent", color: "#94a3b8", fontSize: 13, cursor: "pointer" }}>Cancel</button>
              <button onClick={addContact} style={{ flex: 2, padding: "10px", borderRadius: 7, border: "none", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>🤖 Add & Draft with AI</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: toast.type === "error" ? "#2d1515" : "#052e16", border: `1px solid ${toast.type === "error" ? "#7f1d1d" : "#166534"}`, color: toast.type === "error" ? "#f87171" : "#4ade80", padding: "12px 20px", borderRadius: 8, fontSize: 13, boxShadow: "0 4px 24px rgba(0,0,0,0.4)", zIndex: 1000 }}>
          {toast.msg}
        </div>
      )}

      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#0a0f1e}
        ::-webkit-scrollbar-thumb{background:#1e293b;border-radius:4px}
        button:hover{opacity:0.85;transition:opacity 0.15s}
        input,textarea{font-family:Georgia,serif}
      `}</style>
    </div>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />;
  return <EmailAgent onLogout={() => setLoggedIn(false)} />;
}
