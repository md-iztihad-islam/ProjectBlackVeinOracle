import getBailRecordByIdApi from "@/services/Bail/getBailRecordByIdApi";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

const statusConfig = {
  pending:  { label: "Pending",  bg: "#1f1a0d", color: "#d4932a", dot: "#d4932a" },
  granted:  { label: "Granted",  bg: "#0c2218", color: "#3dba78", dot: "#3dba78" },
  rejected: { label: "Rejected", bg: "#2a0e0e", color: "#e05252", dot: "#e05252" },
};

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}

function formatCurrency(amount) {
  if (amount == null || amount === "") return "—";
  return new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", minimumFractionDigits: 2 }).format(amount);
}

function DetailRow({ label, value, mono, accent, isLast }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "flex-start",
      padding: "0.8rem 0", borderBottom: isLast ? "none" : "1px solid #111418", gap: "1rem",
    }}>
      <span style={{ fontSize: "0.8rem", color: "#5a6278", fontWeight: "500", flexShrink: 0 }}>{label}</span>
      <span style={{
        fontSize: "0.85rem",
        color: accent || (mono ? "#9aa3b8" : "#e8eaf0"),
        fontFamily: mono ? "monospace" : "inherit",
        textAlign: "right",
      }}>{value || "—"}</span>
    </div>
  );
}

function SkeletonDetails() {
  return (
    <div style={{ background: "#12151a", border: "1px solid #1e2330", borderRadius: "14px", padding: "2rem" }}>
      <div style={{ height: "28px", width: "50%", borderRadius: "5px", background: "#1a1f2a", marginBottom: "2rem" }} />
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "0.8rem 0", borderBottom: "1px solid #111418" }}>
          <div style={{ height: "13px", width: "28%", borderRadius: "4px", background: "#1a1f2a" }} />
          <div style={{ height: "13px", width: "40%", borderRadius: "4px", background: "#1a1f2a" }} />
        </div>
      ))}
    </div>
  );
}

export default function BailRecordDetails() {
  const navigate = useNavigate();
  const { bailId } = useParams();

  const { data: bailRecordData, isLoading, error } = useQuery({
    queryKey: ["bailRecord", bailId],
    queryFn: () => getBailRecordByIdApi(bailId),
    cacheTime: 2 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
  });

  const r = bailRecordData?.data || {};
  const cfg = statusConfig[r.status] || statusConfig.pending;

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0c0f",
      color: "#e8eaf0", fontFamily: "'DM Sans','Segoe UI',sans-serif",
      padding: "2rem", display: "flex", alignItems: "flex-start", justifyContent: "center",
    }}>
      <div style={{ width: "100%", maxWidth: "600px" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "1.5rem" }}>
          <button
            onClick={() => navigate("/arrest-records")}
            style={{ background: "none", border: "none", color: "#5a6278", fontSize: "0.82rem", cursor: "pointer", padding: 0 }}
          >
            Arrest Records
          </button>
          <span style={{ color: "#3a4055", fontSize: "0.82rem" }}>/</span>
          <button
            onClick={() => r.arrest_id && navigate(`/arrest-records/${r.arrest_id}`)}
            style={{ background: "none", border: "none", color: "#5a6278", fontSize: "0.82rem", cursor: "pointer", padding: 0, fontFamily: "monospace" }}
          >
            {r.arrest_id || "…"}
          </button>
          <span style={{ color: "#3a4055", fontSize: "0.82rem" }}>/</span>
          <span style={{ color: "#9aa3b8", fontSize: "0.82rem" }}>Bail #{bailId}</span>
        </div>

        {isLoading ? <SkeletonDetails /> : error ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#e05252", fontSize: "0.9rem", background: "#12151a", border: "1px solid #1e2330", borderRadius: "14px" }}>
            Failed to load bail record.
          </div>
        ) : (
          <>
            {/* Main card */}
            <div style={{ background: "#12151a", border: "1px solid #1e2330", borderRadius: "14px", padding: "2rem", marginBottom: "1rem" }}>

              {/* Header */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
                <div>
                  <p style={{ fontSize: "0.72rem", color: "#5a6278", fontWeight: "600", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 4px" }}>
                    Bail Record
                  </p>
                  <h1 style={{ fontSize: "1.4rem", fontWeight: "700", color: "#e8eaf0", margin: 0, fontFamily: "monospace" }}>
                    #{r.bail_id}
                  </h1>
                </div>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  background: cfg.bg, color: cfg.color,
                  padding: "5px 12px", borderRadius: "6px",
                  fontSize: "0.75rem", fontWeight: "600",
                  letterSpacing: "0.05em", textTransform: "uppercase",
                }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: cfg.dot }} />
                  {cfg.label}
                </span>
              </div>

              {/* Bail amount highlight */}
              {r.bail_amount && (
                <div style={{
                  background: "#0d1017", border: "1px solid #1e2330",
                  borderRadius: "10px", padding: "1rem 1.25rem", marginBottom: "1.5rem",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <span style={{ fontSize: "0.78rem", color: "#5a6278", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: "600" }}>
                    Bail Amount
                  </span>
                  <span style={{ fontSize: "1.3rem", fontWeight: "700", color: "#3dba78", fontFamily: "monospace" }}>
                    {formatCurrency(r.bail_amount)}
                  </span>
                </div>
              )}

              {/* Linked arrest */}
              <div
                onClick={() => r.arrest_id && navigate(`/arrest-records/${r.arrest_id}`)}
                style={{
                  background: "#0d1017", border: "1px solid #1e2330",
                  borderRadius: "10px", padding: "0.8rem 1.1rem", marginBottom: "1.5rem",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  cursor: r.arrest_id ? "pointer" : "default",
                }}
                onMouseEnter={e => r.arrest_id && (e.currentTarget.style.borderColor = "#2c3a50")}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#1e2330"}
              >
                <div>
                  <p style={{ margin: 0, fontSize: "0.72rem", color: "#5a6278", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: "600" }}>Linked Arrest</p>
                  <p style={{ margin: "3px 0 0", fontFamily: "monospace", fontSize: "0.85rem", color: "#4da6e8" }}>{r.arrest_id || "—"}</p>
                </div>
                {r.arrest_id && <span style={{ color: "#3a4055", fontSize: "0.9rem" }}>→</span>}
              </div>

              {/* Details */}
              <DetailRow label="Court"      value={r.court_name} />
              <DetailRow label="Surety Name" value={r.surety_name} />
              <DetailRow label="Granted On"  value={formatDate(r.granted_at)} accent={r.granted_at ? "#c0c6d6" : undefined} />
              <DetailRow label="Arrest ID"   value={r.arrest_id} mono isLast />
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={() => navigate(`/bail-records/${bailId}/edit`)}
                style={{
                  flex: 1, padding: "0.7rem", background: "#2c5fe6",
                  border: "none", borderRadius: "8px", color: "#fff",
                  fontSize: "0.85rem", fontWeight: "600", cursor: "pointer",
                }}
              >
                Edit Record
              </button>
              <button
                onClick={() => r.arrest_id && navigate(`/arrest-records/${r.arrest_id}/bail`)}
                style={{
                  flex: 1, padding: "0.7rem", background: "transparent",
                  border: "1px solid #1e2330", borderRadius: "8px", color: "#9aa3b8",
                  fontSize: "0.85rem", fontWeight: "500", cursor: "pointer",
                }}
              >
                All Bail Records
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}