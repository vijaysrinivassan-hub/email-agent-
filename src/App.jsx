import { useState } from "react";

const emails = [
  {
    id: 1,
    founder: "Ishaan Shakunt",
    firstName: "Ishaan",
    title: "Founder",
    company: "Spear Growth",
    email: "ishaan@speargrowth.com",
    subject: "Helping Spear Growth Scale Even Further",
    body: `Hi Ishaan,

I am Vijay Srinivassan, an MBA fresher from Dr. NGP Institute of Technology, Coimbatore. I came across Spear Growth on LinkedIn and was genuinely impressed by how your team helps B2B SaaS companies turn marketing spend directly into sales pipeline.

I would love to intern with you, as I believe this would be a great way to start my career in performance marketing and growth. I am willing to research and qualify outbound leads, assist in building SEO and ad campaign reports, support client communication and follow-ups, and help maintain relationships with existing accounts.

I have experience setting up emailing campaigns on Apollo.io, managing leads on HubSpot CRM, creating SEO content, and building N8N automation agents during my previous internships at Stead and VilFresh.

I am willing to work absolutely for free, for the first two months, post which you can hire me, based on my performance. I am pretty confident that I would be a great hire.

I have attached my resume for further reference. Looking forward to hearing back from you.

Thank You,
Vijay Srinivassan S J
9653941593`,
    status: "pending",
  },
  {
    id: 2,
    founder: "Vipin Guliani",
    firstName: "Vipin",
    title: "Founder & CEO",
    company: "Eridium Digital",
    email: "vipin@eridium.com",
    subject: "Wanting to Grow With Eridium",
    body: `Hi Vipin,

I am Vijay Srinivassan, an MBA fresher from Dr. NGP Institute of Technology, Coimbatore. I found Eridium on LinkedIn and was really impressed by how your team turns data and consumer intent into real business outcomes for brands.

I would love to intern with you, as I believe this would be a great way to kick-start my marketing career. I am willing to support SEO content creation, assist in performance marketing campaign reporting, handle client coordination and follow-ups, and help manage social media calendars and execution.

I have hands-on experience with Apollo.io for lead generation, HubSpot for CRM management, and I have authored 30+ blogs and set up automated email campaigns during my stints at Stead and TheX.Press.

I am willing to work absolutely for free, for the first two months, post which you can hire me, based on my performance. I am pretty confident that I would be a great hire.

I have attached my resume for further reference. Looking forward to hearing back from you.

Thank You,
Vijay Srinivassan S J
9653941593`,
    status: "pending",
  },
  {
    id: 3,
    founder: "Hitesh Lalwani",
    firstName: "Hitesh",
    title: "CEO & Founder",
    company: "Intent Farm",
    email: "hitesh@intentfarm.com",
    subject: "Would Love to Be Part of What You're Building",
    body: `Hi Hitesh,

I am Vijay Srinivassan, an MBA fresher from Dr. NGP Institute of Technology, Coimbatore. I came across Intent Farm on LinkedIn and was really impressed by how your team converts ad spends into measurable revenue growth for 150+ brands across eCommerce and D2C.

I would love to intern with you, as I believe this is exactly the kind of environment where I can learn fast and contribute meaningfully. I am willing to assist in managing Google and Meta ad campaign dashboards, qualify and filter inbound leads, support client reporting and follow-ups, and coordinate with internal teams on campaign execution.

I have experience setting up lead generation workflows on Apollo.io, managing leads through HubSpot CRM, and building automation agents during my internships at Stead and VilFresh.

I am willing to work absolutely for free, for the first two months, post which you can hire me, based on my performance. I am pretty confident that I would be a great hire.

I have attached my resume for further reference. Looking forward to hearing back from you.

Thank You,
Vijay Srinivassan S J
9653941593`,
    status: "pending",
  },
  {
    id: 4,
    founder: "Ganesh Raman",
    firstName: "Ganesh",
    title: "Founder & CEO",
    company: "Freeflow Ideas",
    email: "ganesh@freeflowideas.in",
    subject: "Excited to Contribute to Freeflow's Creative Journey",
    body: `Hi Ganesh,

I am Vijay Srinivassan, an MBA fresher from Dr. NGP Institute of Technology, Coimbatore. I came across Freeflow Ideas on LinkedIn and was genuinely impressed by how your team uses creative storytelling to help brands break through the noise and actually grow their business.

I would love to intern with you, as I feel Freeflow's culture of fearless thinking is exactly where I want to begin my career. I am willing to support digital content creation and social media management, assist in client coordination and campaign reporting, help research brand insights and competitor analysis, and follow up with prospects and leads.

I have experience writing SEO articles and blog content, running email campaigns on Apollo.io, and building AI-driven customer engagement tools during my internships at Stead and VilFresh.

I am willing to work absolutely for free, for the first two months, post which you can hire me, based on my performance. I am pretty confident that I would be a great hire.

I have attached my resume for further reference. Looking forward to hearing back from you.

Thank You,
Vijay Srinivassan S J
9653941593`,
    status: "pending",
  },
  {
    id: 5,
    founder: "Saanand Warrier",
    firstName: "Saanand",
    title: "CEO",
    company: "Wirality",
    email: "saanand@wirality.co",
    subject: "Would Love to Learn the Craft at Wirality",
    body: `Hi Saanand,

I am Vijay Srinivassan, an MBA fresher from Dr. NGP Institute of Technology, Coimbatore. I came across Wirality on LinkedIn and was really impressed by how your team uses narrative design and data together to actually move the needle on brand performance for the clients you work with.

I would love to intern with you, as I believe Wirality's focused and creative approach is exactly the environment I need to grow fast. I am willing to support social media and content strategy execution, manage campaign tracking and reporting, coordinate with clients and follow up on deliverables, and research brand and competitor insights.

I have experience writing SEO content, setting up email outreach campaigns on Apollo.io, and building AI-powered automation tools during my internships at Stead and VilFresh.

I am willing to work absolutely for free, for the first two months, post which you can hire me, based on my performance. I am pretty confident that I would be a great hire.

I have attached my resume for further reference. Looking forward to hearing back from you.

Thank You,
Vijay Srinivassan S J
9653941593`,
    status: "pending",
  },
];

const statusColors = {
  pending: { bg: "#1e293b", text: "#94a3b8", label: "Pending Review" },
  approved: { bg: "#052e16", text: "#4ade80", label: "Approved" },
  sent: { bg: "#1e3a5f", text: "#60a5fa", label: "Sent" },
  rejected: { bg: "#2d1515", text: "#f87171", label: "Rejected" },
};

export default function EmailAgent() {
  const [emailList, setEmailList] = useState(emails);
  const [selected, setSelected] = useState(0);
  const [editing, setEditing] = useState(false);
  const [editBody, setEditBody] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [editFounder, setEditFounder] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [sendingId, setSendingId] = useState(null);
  const [toast, setToast] = useState(null);

  const current = emailList[selected];

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updateStatus = (id, status) => {
    setEmailList((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e))
    );
  };

  const startEdit = () => {
    setEditBody(current.body);
    setEditSubject(current.subject);
    setEditFounder(current.founder);
    setEditEmail(current.email);
    setEditing(true);
  };

  const saveEdit = () => {
    setEmailList((prev) =>
      prev.map((e) =>
        e.id === current.id
          ? { ...e, body: editBody, subject: editSubject, founder: editFounder, email: editEmail }
          : e
      )
    );
    setEditing(false);
    showToast("Email updated successfully");
  };

  const handleApprove = (id) => {
    updateStatus(id, "approved");
    showToast("Email approved ✓");
  };

  const handleReject = (id) => {
    updateStatus(id, "rejected");
    showToast("Email rejected", "error");
  };

  const handleSend = async (emailObj) => {
    if (emailObj.status !== "approved") {
      showToast("Please approve the email before sending", "error");
      return;
    }
    setSendingId(emailObj.id);
    // Simulate Apollo send delay
    await new Promise((r) => setTimeout(r, 1800));
    updateStatus(emailObj.id, "sent");
    setSendingId(null);
    showToast(`Email sent to ${emailObj.founder} via Apollo ✓`);
  };

  const [showExport, setShowExport] = useState(false);

  const exportToCSV = () => {
    const approved = emailList.filter((e) => e.status === "approved" || e.status === "sent");
    if (approved.length === 0) {
      showToast("No approved emails to export", "error");
      return;
    }
    const escape = (str) => `"${(str || "").replace(/"/g, '""')}"`;
    const headers = ["Name","Email","Company","Title","Email1_Subject","Email1_Body","Email2_Body","Status","Date_Sent","FollowUp_Date","FollowUp_Status"];
    const rows = approved.map((e) => [
      escape(e.founder),
      escape(e.email),
      escape(e.company),
      escape(e.title),
      escape(e.subject),
      escape(e.body),
      escape(`Hi ${e.firstName},\n\nJust following up on my previous email. I understand you must be really busy, but I genuinely believe I can add value to ${e.company}.\n\nI am still very much interested and willing to start for free. Would love just 10 minutes of your time.\n\nThank You,\nVijay Srinivassan S J\n9653941593`),
      escape("Approved"),
      escape(""),
      escape(""),
      escape("Pending"),
    ].join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "outreach_contacts.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Exported ${approved.length} contacts to CSV ✓`);
    setShowExport(true);
  };

  const approvedCount = emailList.filter((e) => e.status === "approved").length;
  const sentCount = emailList.filter((e) => e.status === "sent").length;
  const pendingCount = emailList.filter((e) => e.status === "pending").length;

  return (
    <div style={{
      fontFamily: "'Georgia', serif",
      background: "#0a0f1e",
      minHeight: "100vh",
      color: "#e2e8f0",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid #1e293b",
        padding: "18px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#0d1424",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16,
          }}>✉</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: "0.02em" }}>
              Vijay's Email Agent
            </div>
            <div style={{ fontSize: 11, color: "#64748b" }}>Powered by Apollo · 5 Founders · Bangalore</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {[
            { label: "Pending", val: pendingCount, color: "#94a3b8" },
            { label: "Approved", val: approvedCount, color: "#4ade80" },
            { label: "Sent", val: sentCount, color: "#60a5fa" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
            </div>
          ))}
          <button
            onClick={exportToCSV}
            style={{
              padding: "9px 18px", borderRadius: 7, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #059669, #0d9488)",
              color: "#fff", fontSize: 12, fontWeight: 700, letterSpacing: "0.03em",
              boxShadow: "0 2px 12px rgba(5,150,105,0.35)",
            }}>
            ⬇ Export to Sheet
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={{
          width: 260,
          borderRight: "1px solid #1e293b",
          background: "#0d1424",
          overflowY: "auto",
          flexShrink: 0,
        }}>
          <div style={{ padding: "14px 16px 8px", fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Draft Queue
          </div>
          {emailList.map((e, i) => {
            const sc = statusColors[e.status];
            return (
              <div
                key={e.id}
                onClick={() => { setSelected(i); setEditing(false); }}
                style={{
                  padding: "14px 16px",
                  cursor: "pointer",
                  borderLeft: selected === i ? "3px solid #3b82f6" : "3px solid transparent",
                  background: selected === i ? "#111827" : "transparent",
                  transition: "all 0.15s",
                  borderBottom: "1px solid #1a2235",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: selected === i ? "#e2e8f0" : "#94a3b8" }}>
                    {e.founder}
                  </div>
                  <div style={{
                    fontSize: 9, padding: "2px 6px", borderRadius: 4,
                    background: sc.bg, color: sc.text,
                    fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.05em"
                  }}>
                    {sc.label}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{e.company}</div>
                <div style={{ fontSize: 10, color: "#334155", marginTop: 4, fontStyle: "italic" }}>
                  {e.email}
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Email Header Bar */}
          <div style={{
            padding: "16px 28px",
            borderBottom: "1px solid #1e293b",
            background: "#0d1424",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {editing ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", width: 80 }}>Name</span>
                    <input
                      value={editFounder}
                      onChange={(e) => setEditFounder(e.target.value)}
                      style={{
                        background: "#111827", border: "1px solid #334155",
                        borderRadius: 6, padding: "5px 10px", color: "#e2e8f0",
                        fontSize: 13, outline: "none", width: 220,
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", width: 80 }}>Email ID</span>
                    <input
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      style={{
                        background: "#111827", border: "1px solid #334155",
                        borderRadius: 6, padding: "5px 10px", color: "#3b82f6",
                        fontSize: 13, outline: "none", width: 260,
                      }}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>
                    {current.founder}
                    <span style={{ color: "#475569", fontWeight: 400, fontSize: 13 }}> · {current.title} at {current.company}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#3b82f6", marginTop: 2 }}>→ {current.email}</div>
                </>
              )}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {!editing && current.status !== "sent" && (
                <button onClick={startEdit} style={{
                  padding: "7px 14px", borderRadius: 6, border: "1px solid #334155",
                  background: "transparent", color: "#94a3b8", fontSize: 12, cursor: "pointer",
                }}>
                  ✎ Edit
                </button>
              )}
              {current.status === "pending" && !editing && (
                <>
                  <button onClick={() => handleReject(current.id)} style={{
                    padding: "7px 14px", borderRadius: 6, border: "1px solid #7f1d1d",
                    background: "#2d1515", color: "#f87171", fontSize: 12, cursor: "pointer",
                  }}>
                    ✕ Reject
                  </button>
                  <button onClick={() => handleApprove(current.id)} style={{
                    padding: "7px 14px", borderRadius: 6, border: "none",
                    background: "#166534", color: "#4ade80", fontSize: 12, cursor: "pointer",
                    fontWeight: 600,
                  }}>
                    ✓ Approve
                  </button>
                </>
              )}
              {current.status === "approved" && (
                <button
                  onClick={() => handleSend(current)}
                  disabled={sendingId === current.id}
                  style={{
                    padding: "7px 18px", borderRadius: 6, border: "none",
                    background: sendingId === current.id ? "#1e3a5f" : "linear-gradient(135deg, #2563eb, #7c3aed)",
                    color: "#fff", fontSize: 12, cursor: sendingId === current.id ? "wait" : "pointer",
                    fontWeight: 700, letterSpacing: "0.03em",
                  }}>
                  {sendingId === current.id ? "Sending via Apollo..." : "⚡ Send via Apollo"}
                </button>
              )}
              {current.status === "sent" && (
                <div style={{
                  padding: "7px 14px", borderRadius: 6,
                  background: "#1e3a5f", color: "#60a5fa", fontSize: 12,
                }}>
                  ✓ Sent via Apollo
                </div>
              )}
              {current.status === "rejected" && (
                <button onClick={() => handleApprove(current.id)} style={{
                  padding: "7px 14px", borderRadius: 6, border: "1px solid #1e3a5f",
                  background: "transparent", color: "#60a5fa", fontSize: 12, cursor: "pointer",
                }}>
                  ↺ Re-approve
                </button>
              )}
            </div>
          </div>

          {/* Subject Line */}
          <div style={{
            padding: "12px 28px",
            borderBottom: "1px solid #1a2235",
            background: "#0a0f1e",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}>
            <span style={{ fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em" }}>Subject</span>
            {editing ? (
              <input
                value={editSubject}
                onChange={(e) => setEditSubject(e.target.value)}
                style={{
                  flex: 1, background: "#111827", border: "1px solid #334155",
                  borderRadius: 6, padding: "6px 12px", color: "#e2e8f0",
                  fontSize: 13, outline: "none",
                }}
              />
            ) : (
              <span style={{ fontSize: 13, color: "#e2e8f0", fontStyle: "italic" }}>{current.subject}</span>
            )}
          </div>

          {/* Email Body */}
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
            {editing ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, height: "100%" }}>
                <textarea
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  style={{
                    flex: 1, minHeight: 340,
                    background: "#111827", border: "1px solid #334155",
                    borderRadius: 8, padding: "16px", color: "#e2e8f0",
                    fontSize: 13, lineHeight: 1.8, outline: "none",
                    resize: "none", fontFamily: "Georgia, serif",
                  }}
                />
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  <button onClick={() => setEditing(false)} style={{
                    padding: "8px 16px", borderRadius: 6, border: "1px solid #334155",
                    background: "transparent", color: "#94a3b8", fontSize: 12, cursor: "pointer",
                  }}>
                    Cancel
                  </button>
                  <button onClick={saveEdit} style={{
                    padding: "8px 16px", borderRadius: 6, border: "none",
                    background: "#1d4ed8", color: "#fff", fontSize: 12, cursor: "pointer", fontWeight: 600,
                  }}>
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div style={{
                background: "#0d1424",
                borderRadius: 10,
                border: "1px solid #1e293b",
                padding: "28px 32px",
                lineHeight: 1.85,
                fontSize: 13.5,
                color: "#cbd5e1",
                whiteSpace: "pre-wrap",
                maxWidth: 680,
              }}>
                {current.body}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Export Instructions Modal */}
      {showExport && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
        }}>
          <div style={{
            background: "#0d1424", border: "1px solid #334155", borderRadius: 12,
            width: "100%", maxWidth: 500, padding: 32,
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>✅ CSV Downloaded!</div>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>Now paste it into your Google Sheet and run the script.</div>
            {[
              { n: "1", t: "Open your Google Sheet", d: "docs.google.com/spreadsheets — open your Outreach sheet" },
              { n: "2", t: "Click cell A2", d: "The first empty row below the headers" },
              { n: "3", t: "Open the CSV file", d: "Open outreach_contacts.csv in Excel or Google Sheets, copy rows 2 onwards" },
              { n: "4", t: "Paste into Sheet", d: "Paste into your Outreach sheet starting at A2" },
              { n: "5", t: "Run the Script", d: "Extensions → Apps Script → select sendEmail1 → Run" },
            ].map((s) => (
              <div key={s.n} style={{ display: "flex", gap: 14, marginBottom: 14, alignItems: "flex-start" }}>
                <div style={{
                  width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                  background: "linear-gradient(135deg, #059669, #0d9488)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700,
                }}>{s.n}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{s.t}</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{s.d}</div>
                </div>
              </div>
            ))}
            <button onClick={() => setShowExport(false)} style={{
              marginTop: 8, width: "100%", padding: "11px", borderRadius: 8, border: "none",
              background: "linear-gradient(135deg, #059669, #0d9488)", color: "#fff",
              fontSize: 13, fontWeight: 700, cursor: "pointer",
            }}>Got it!</button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24,
          background: toast.type === "error" ? "#2d1515" : "#052e16",
          border: `1px solid ${toast.type === "error" ? "#7f1d1d" : "#166534"}`,
          color: toast.type === "error" ? "#f87171" : "#4ade80",
          padding: "12px 20px", borderRadius: 8, fontSize: 13,
          boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
          animation: "fadeIn 0.2s ease",
          zIndex: 1000,
        }}>
          {toast.msg}
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0f1e; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
        button:hover { opacity: 0.85; }
      `}</style>
    </div>
  );
}
