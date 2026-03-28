import getBailRecordByArrestIdApi from "@/services/Bail/getBailRecordByArrestIdApi";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

const statusConfig = {
  pending:  { label: "Pending",  bg: "#1f1a0d", color: "#d4932a", dot: "#d4932a" },
  granted:  { label: "Granted",  bg: "#0c2218", color: "#3dba78", dot: "#3dba78" },
  rejected: { label: "Rejected", bg: "#2a0e0e", color: "#e05252", dot: "#e05252" },
};

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function formatCurrency(amount) {
  if (amount == null || amount === "") return "—";
  return new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", minimumFractionDigits: 2 }).format(amount);
}

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.pending;
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

export default function BailRecordList() {
  const navigate = useNavigate();
  const { arrestId } = useParams();

  const { data: bailRecordData, isLoading, error } = useQuery({
    queryKey: ["bailRecord", arrestId],
    queryFn: () => getBailRecordByArrestIdApi(arrestId),
    cacheTime: 2 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    enabled: !!arrestId,
  });

  const bailRecords = Array.isArray(bailRecordData?.data)
    ? bailRecordData.data
    : bailRecordData?.data
    ? [bailRecordData.data]
    : [];

  const counts = bailRecords.reduce((acc, r) => { acc[r.status] = (acc[r.status] || 0) + 1; return acc; }, {});

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0c0f",
      color: "#e8eaf0", fontFamily: "'DM Sans','Segoe UI',sans-serif", padding: "2rem",
    }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>

        {/* Back breadcrumb */}
        <button
          onClick={() => navigate(`/arrest-records/${arrestId}`)}
          style={{ background: "none", border: "none", color: "#5a6278", fontSize: "0.82rem", cursor: "pointer", padding: 0, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "4px" }}
        >
          ← Arrest Record <span style={{ color: "#3a4055", fontFamily: "monospace", fontSize: "0.78rem", marginLeft: "2px" }}>{arrestId}</span>
        </button>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#e8eaf0", margin: 0 }}>Bail Records</h1>
            <p style={{ color: "#5a6278", margin: "4px 0 0", fontSize: "0.83rem" }}>
              Linked to arrest <span style={{ fontFamily: "monospace", color: "#9aa3b8" }}>{arrestId}</span>
            </p>
          </div>
          <button
            onClick={() => navigate(`/arrest-records/${arrestId}/bail/add`)}
            style={{
              padding: "0.6rem 1.2rem", background: "#2c5fe6", border: "none",
              borderRadius: "8px", color: "#fff", fontSize: "0.85rem",
              fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap",
            }}
          >
            + Add Bail Record
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
              <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#e8eaf0" }}>{counts[key] || 0}</span>
            </div>
          ))}
          <div style={{
            background: "#12151a", border: "1px solid #1e2330",
            borderRadius: "8px", padding: "0.6rem 1rem",
            display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto",
          }}>
            <span style={{ fontSize: "0.78rem", color: "#9aa3b8" }}>Total</span>
            <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#e8eaf0" }}>{bailRecords.length}</span>
          </div>
        </div>

        {/* Table */}
        <div style={{ background: "#12151a", border: "1px solid #1e2330", borderRadius: "12px", overflow: "hidden" }}>
          {error ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#e05252", fontSize: "0.9rem" }}>
              Failed to load bail records.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "650px" }}>
                <thead>
                  <tr style={{ background: "#0d1017" }}>
                    {["Bail ID", "Court", "Bail Amount", "Granted On", "Surety", "Status"].map(h => (
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
                    ? [...Array(3)].map((_, i) => <SkeletonRow key={i} />)
                    : bailRecords.length === 0
                    ? (
                      <tr>
                        <td colSpan={6} style={{ padding: "3rem", textAlign: "center", color: "#5a6278", fontSize: "0.9rem" }}>
                          No bail records found for this arrest.
                        </td>
                      </tr>
                    )
                    : bailRecords.map(record => (
                      <tr
                        key={record.bail_id}
                        onClick={() => navigate(`/bail-records/${record.bail_id}`)}
                        style={{ cursor: "pointer" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#0f1219"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <td style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #111418", fontFamily: "monospace", fontSize: "0.8rem", color: "#4da6e8" }}>
                          #{record.bail_id}
                        </td>
                        <td style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #111418", color: "#e8eaf0", fontSize: "0.85rem", fontWeight: "500" }}>
                          {record.court_name || "—"}
                        </td>
                        <td style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #111418", color: "#3dba78", fontSize: "0.85rem", fontFamily: "monospace" }}>
                          {formatCurrency(record.bail_amount)}
                        </td>
                        <td style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #111418", color: "#c0c6d6", fontSize: "0.83rem", whiteSpace: "nowrap" }}>
                          {formatDate(record.granted_at)}
                        </td>
                        <td style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #111418", color: "#9aa3b8", fontSize: "0.83rem" }}>
                          {record.surety_name || "—"}
                        </td>
                        <td style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #111418" }}>
                          <StatusBadge status={record.status} />
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