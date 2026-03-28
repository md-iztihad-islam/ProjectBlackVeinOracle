import getArrestRecordByThanaApi from "@/services/ArrestRecord/getArrestRecordByThanaApi";
import userStore from "@/state/userStore";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const statusConfig = {
  in_custody: { label: "In Custody", bg: "#1a0e2e", color: "#b87eea", dot: "#b87eea" },
  on_bail: { label: "On Bail", bg: "#1f1a0d", color: "#d4932a", dot: "#d4932a" },
  released: { label: "Released", bg: "#0c2218", color: "#3dba78", dot: "#3dba78" },
  transferred: { label: "Transferred", bg: "#0e1a2e", color: "#4da6e8", dot: "#4da6e8" },
};

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.in_custody;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      background: cfg.bg, color: cfg.color,
      padding: "3px 9px", borderRadius: "5px",
      fontSize: "0.72rem", fontWeight: "600",
      letterSpacing: "0.05em", textTransform: "uppercase",
      whiteSpace: "nowrap",
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
          <div style={{ height: "14px", borderRadius: "4px", background: "#1a1f2a", width: i === 0 ? "70%" : "50%" }} />
        </td>
      ))}
    </tr>
  );
}

export default function ArrestRecordList() {
  const navigate = useNavigate();
  const { user } = userStore();
  const thanaId = user?.thana_id || "";

  const { data: arrestRecordsData, isLoading, error } = useQuery({
    queryKey: ["arrestRecords", thanaId],
    queryFn: () => getArrestRecordByThanaApi(thanaId),
    cacheTime: 2 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
  });

  const arrestRecords = arrestRecordsData?.data || [];

  const statusCounts = arrestRecords.reduce((acc, r) => {
    acc[r.custody_status] = (acc[r.custody_status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0c0f",
      color: "#e8eaf0", fontFamily: "'DM Sans','Segoe UI',sans-serif", padding: "2rem",
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#e8eaf0", margin: 0 }}>Arrest Records</h1>
            <p style={{ color: "#5a6278", margin: "4px 0 0", fontSize: "0.83rem" }}>
              Thana: {thanaId || "—"}
            </p>
          </div>
          <button
            onClick={() => navigate("/officer/dashboard/add-arrest-record")}
            style={{
              padding: "0.6rem 1.2rem", background: "#2c5fe6", border: "none",
              borderRadius: "8px", color: "#fff", fontSize: "0.85rem",
              fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap",
            }}
          >
            + New Record
          </button>
        </div>

        {/* Stat Pills */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.75rem" }}>
          {Object.entries(statusConfig).map(([key, cfg]) => (
            <div key={key} style={{
              background: "#12151a", border: "1px solid #1e2330",
              borderRadius: "8px", padding: "0.6rem 1rem",
              display: "flex", alignItems: "center", gap: "8px",
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: cfg.dot }} />
              <span style={{ fontSize: "0.78rem", color: "#9aa3b8" }}>{cfg.label}</span>
              <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#e8eaf0" }}>
                {statusCounts[key] || 0}
              </span>
            </div>
          ))}
          <div style={{
            background: "#12151a", border: "1px solid #1e2330",
            borderRadius: "8px", padding: "0.6rem 1rem",
            display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto",
          }}>
            <span style={{ fontSize: "0.78rem", color: "#9aa3b8" }}>Total</span>
            <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#e8eaf0" }}>{arrestRecords.length}</span>
          </div>
        </div>

        {/* Table Card */}
        <div style={{ background: "#12151a", border: "1px solid #1e2330", borderRadius: "12px", overflow: "hidden" }}>
          {error ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#e05252", fontSize: "0.9rem" }}>
              Failed to load arrest records. Please try again.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
                <thead>
                  <tr style={{ background: "#0d1017" }}>
                    {["Arrest ID", "Criminal", "Arrest Date", "Bail Due", "Status", "Case Ref"].map((h) => (
                      <th key={h} style={{
                        padding: "0.7rem 1rem", textAlign: "left",
                        fontSize: "0.7rem", fontWeight: "600",
                        letterSpacing: "0.08em", textTransform: "uppercase",
                        color: "#5a6278", borderBottom: "1px solid #1e2330",
                        whiteSpace: "nowrap",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isLoading
                    ? [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                    : arrestRecords.length === 0
                    ? (
                      <tr>
                        <td colSpan={6} style={{ padding: "3rem", textAlign: "center", color: "#5a6278", fontSize: "0.9rem" }}>
                          No arrest records found.
                        </td>
                      </tr>
                    )
                    : arrestRecords.map((record) => (
                      <tr
                        key={record.arrest_id}
                        onClick={() => navigate(`/officer/dashboard/arrest-record-details/${record.arrest_id}`)}
                        style={{ cursor: "pointer", transition: "background 0.1s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#0f1219"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <td style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #111418", fontFamily: "monospace", fontSize: "0.8rem", color: "#4da6e8" }}>
                          {record.arrest_id}
                        </td>
                        <td style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #111418" }}>
                          <div style={{ fontWeight: "600", color: "#e8eaf0", fontSize: "0.85rem" }}>{record.criminal_name}</div>
                          <div style={{ fontSize: "0.72rem", color: "#5a6278", marginTop: "1px", fontFamily: "monospace" }}>{record.criminal_id}</div>
                        </td>
                        <td style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #111418", color: "#c0c6d6", fontSize: "0.83rem", whiteSpace: "nowrap" }}>
                          {formatDate(record.arrest_date)}
                        </td>
                        <td style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #111418", fontSize: "0.83rem", whiteSpace: "nowrap" }}>
                          {record.bail_due_date
                            ? <span style={{ color: "#d4932a" }}>{formatDate(record.bail_due_date)}</span>
                            : <span style={{ color: "#5a6278" }}>—</span>}
                        </td>
                        <td style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #111418" }}>
                          <StatusBadge status={record.custody_status} />
                        </td>
                        <td style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #111418", fontFamily: "monospace", fontSize: "0.78rem", color: "#9aa3b8" }}>
                          {record.case_reference || "—"}
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