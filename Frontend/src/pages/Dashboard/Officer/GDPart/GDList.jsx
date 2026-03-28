import getGDReportByAssignedOfficerApi from "@/services/GDReport/getGDReportByAssignedOfficerApi";
import userStore from "@/state/userStore";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const statusConfig = {
  submitted: { label: "Submitted", bg: "#0e1a2e", color: "#4da6e8", dot: "#4da6e8" },
  assigned:  { label: "Assigned",  bg: "#1f1a0d", color: "#d4932a", dot: "#d4932a" },
  approved:  { label: "Approved",  bg: "#0c2218", color: "#3dba78", dot: "#3dba78" },
  rejected:  { label: "Rejected",  bg: "#2a0e0e", color: "#e05252", dot: "#e05252" },
};

const gdTypeLabels = {
  theft: "Theft", lost_document: "Lost Document", missing_person: "Missing Person",
  accident: "Accident", assault: "Assault", robbery: "Robbery",
  fraud: "Fraud", domestic_violence: "Domestic Violence", property_dispute: "Property Dispute",
  suspicious_activity: "Suspicious Activity", threat: "Threat",
  noise_disturbance: "Noise Disturbance", other: "Other",
};

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.submitted;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      background: cfg.bg, color: cfg.color,
      padding: "3px 9px", borderRadius: "5px",
      fontSize: "0.72rem", fontWeight: "600",
      letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap",
    }}>
      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr>
      {[...Array(6)].map((_, i) => (
        <td key={i} style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #111418" }}>
          <div style={{ height: "13px", borderRadius: "4px", background: "#1a1f2a", width: i === 0 ? "40%" : "60%" }} />
        </td>
      ))}
    </tr>
  );
}

export default function GDList() {
  const navigate = useNavigate();
  const { user } = userStore();
  const officerId = user?.officer_id || "";

  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");

  const { data: gdReportsData, isLoading, error } = useQuery({
    queryKey: ["gdReportsByOfficer", officerId],
    queryFn: () => getGDReportByAssignedOfficerApi(officerId),
    enabled: !!officerId,
  });

  const gdReports = gdReportsData?.data || [];

  const filtered = gdReports.filter(r => {
    const matchesStatus = filterStatus === "all" || r.status === filterStatus;
    const matchesSearch = !search ||
      r.gd_id?.toString().includes(search) ||
      gdTypeLabels[r.gd_type]?.toLowerCase().includes(search.toLowerCase()) ||
      r.incident_location?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const counts = gdReports.reduce((acc, r) => { acc[r.status] = (acc[r.status] || 0) + 1; return acc; }, {});

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0c0f",
      color: "#e8eaf0", fontFamily: "'DM Sans','Segoe UI',sans-serif", padding: "2rem",
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#e8eaf0", margin: 0 }}>General Diary</h1>
            <p style={{ color: "#5a6278", margin: "4px 0 0", fontSize: "0.83rem" }}>
              Officer: <span style={{ fontFamily: "monospace", color: "#9aa3b8" }}>{officerId || "—"}</span>
            </p>
          </div>
          <button
            onClick={() => navigate("/officer/dashboard")}
            style={{
              padding: "0.55rem 1.1rem", background: "transparent",
              border: "1px solid #1e2330", borderRadius: "8px",
              color: "#9aa3b8", fontSize: "0.82rem", fontWeight: "500", cursor: "pointer",
            }}
          >
            ← Dashboard
          </button>
        </div>

        {/* Stat Pills */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          {Object.entries(statusConfig).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setFilterStatus(filterStatus === key ? "all" : key)}
              style={{
                background: filterStatus === key ? cfg.bg : "#12151a",
                border: `1px solid ${filterStatus === key ? cfg.color + "55" : "#1e2330"}`,
                borderRadius: "8px", padding: "0.55rem 0.9rem",
                display: "flex", alignItems: "center", gap: "7px",
                cursor: "pointer",
              }}
            >
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: cfg.dot }} />
              <span style={{ fontSize: "0.78rem", color: filterStatus === key ? cfg.color : "#9aa3b8" }}>{cfg.label}</span>
              <span style={{ fontSize: "0.82rem", fontWeight: "700", color: filterStatus === key ? cfg.color : "#e8eaf0" }}>{counts[key] || 0}</span>
            </button>
          ))}
          <div style={{ marginLeft: "auto", background: "#12151a", border: "1px solid #1e2330", borderRadius: "8px", padding: "0.55rem 0.9rem", display: "flex", alignItems: "center", gap: "7px" }}>
            <span style={{ fontSize: "0.78rem", color: "#9aa3b8" }}>Total</span>
            <span style={{ fontSize: "0.82rem", fontWeight: "700", color: "#e8eaf0" }}>{gdReports.length}</span>
          </div>
        </div>

        {/* Search */}
        <div style={{ marginBottom: "1.5rem" }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by GD ID, type, or location…"
            style={{
              width: "100%", padding: "0.65rem 1rem",
              background: "#12151a", border: "1px solid #1e2330",
              borderRadius: "8px", color: "#e8eaf0",
              fontSize: "0.88rem", outline: "none", boxSizing: "border-box",
            }}
          />
        </div>

        {/* Table */}
        <div style={{ background: "#12151a", border: "1px solid #1e2330", borderRadius: "12px", overflow: "hidden" }}>
          {error ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#e05252", fontSize: "0.9rem" }}>Failed to load GD reports.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
                <thead>
                  <tr style={{ background: "#0d1017" }}>
                    {["GD ID", "Type", "Location", "Incident Date", "Submitted", "Status"].map(h => (
                      <th key={h} style={{
                        padding: "0.7rem 1rem", textAlign: "left",
                        fontSize: "0.7rem", fontWeight: "600",
                        letterSpacing: "0.08em", textTransform: "uppercase",
                        color: "#5a6278", borderBottom: "1px solid #1e2330", whiteSpace: "nowrap",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isLoading
                    ? [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                    : filtered.length === 0
                    ? (
                      <tr>
                        <td colSpan={6} style={{ padding: "3rem", textAlign: "center", color: "#5a6278", fontSize: "0.9rem" }}>
                          {search || filterStatus !== "all" ? "No records match your filter." : "No GD reports assigned yet."}
                        </td>
                      </tr>
                    )
                    : filtered.map(report => (
                      <tr
                        key={report.gd_id}
                        onClick={() => navigate(`/officer/dashboard/gd-list/${report.gd_id}`)}
                        style={{ cursor: "pointer" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#0f1219"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <td style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #111418", fontFamily: "monospace", fontSize: "0.8rem", color: "#4da6e8" }}>
                          #{report.gd_id}
                        </td>
                        <td style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #111418" }}>
                          <span style={{
                            background: "#1a1f2a", color: "#c0c6d6",
                            padding: "2px 8px", borderRadius: "4px",
                            fontSize: "0.75rem", fontWeight: "500",
                          }}>
                            {gdTypeLabels[report.gd_type] || report.gd_type}
                          </span>
                        </td>
                        <td style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #111418", color: "#c0c6d6", fontSize: "0.83rem", maxWidth: "180px" }}>
                          <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {report.incident_location || "—"}
                          </span>
                        </td>
                        <td style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #111418", color: "#9aa3b8", fontSize: "0.83rem", whiteSpace: "nowrap" }}>
                          {formatDate(report.incident_date)}
                        </td>
                        <td style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #111418", color: "#5a6278", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                          {formatDate(report.submitted_at)}
                        </td>
                        <td style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #111418" }}>
                          <StatusBadge status={report.status} />
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}