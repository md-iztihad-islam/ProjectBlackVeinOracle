import getArrestRecordByIdApi from "@/services/ArrestRecord/getArrestRecordByIdApi";
import getBailRecordByArrestIdApi from "@/services/Bail/getBailRecordByArrestIdApi";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

const arrestStatusConfig = {
  in_custody:  { label: "In Custody",  bg: "#1a0e2e", color: "#b87eea", dot: "#b87eea" },
  on_bail:     { label: "On Bail",     bg: "#1f1a0d", color: "#d4932a", dot: "#d4932a" },
  released:    { label: "Released",    bg: "#0c2218", color: "#3dba78", dot: "#3dba78" },
  transferred: { label: "Transferred", bg: "#0e1a2e", color: "#4da6e8", dot: "#4da6e8" },
};

const bailStatusConfig = {
  pending:  { label: "Pending",  bg: "#1f1a0d", color: "#d4932a", dot: "#d4932a" },
  granted:  { label: "Granted",  bg: "#0c2218", color: "#3dba78", dot: "#3dba78" },
  rejected: { label: "Rejected", bg: "#2a0e0e", color: "#e05252", dot: "#e05252" },
};

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}

function formatDateShort(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function formatCurrency(amount) {
  if (amount == null || amount === "") return null;
  return new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", minimumFractionDigits: 2 }).format(amount);
}

function StatusBadge({ status, config }) {
  const cfg = config[status] || Object.values(config)[0];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      background: cfg.bg, color: cfg.color,
      padding: "4px 10px", borderRadius: "5px",
      fontSize: "0.72rem", fontWeight: "600",
      letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap",
    }}>
      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
}

function DetailRow({ label, value, mono, accent, isLast }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "flex-start",
      padding: "0.75rem 0", borderBottom: isLast ? "none" : "1px solid #111418", gap: "1rem",
    }}>
      <span style={{ fontSize: "0.8rem", color: "#5a6278", fontWeight: "500", flexShrink: 0 }}>{label}</span>
      <span style={{
        fontSize: "0.85rem",
        color: accent || (mono ? "#9aa3b8" : "#e8eaf0"),
        fontFamily: mono ? "monospace" : "inherit",
        textAlign: "right", wordBreak: "break-all",
      }}>{value || "—"}</span>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ background: "#12151a", border: "1px solid #1e2330", borderRadius: "14px", padding: "2rem", marginBottom: "1rem" }}>
      <div style={{ height: "26px", width: "45%", borderRadius: "5px", background: "#1a1f2a", marginBottom: "2rem" }} />
      {[...Array(5)].map((_, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 0", borderBottom: "1px solid #111418" }}>
          <div style={{ height: "13px", width: "28%", borderRadius: "4px", background: "#1a1f2a" }} />
          <div style={{ height: "13px", width: "38%", borderRadius: "4px", background: "#1a1f2a" }} />
        </div>
      ))}
    </div>
  );
}

export default function ArrestRecordDetails() {
  const navigate = useNavigate();
  const { arrestId } = useParams();

  const { data: arrestRecordData, isLoading: arrestLoading, error: arrestError } = useQuery({
    queryKey: ["arrestRecord", arrestId],
    queryFn: () => getArrestRecordByIdApi(arrestId),
    cacheTime: 2 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
  });

  const { data: bailData, isLoading: bailLoading } = useQuery({
    queryKey: ["bailRecord", arrestId],
    queryFn: () => getBailRecordByArrestIdApi(arrestId),
    cacheTime: 2 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    enabled: !!arrestId,
  });

  const r = arrestRecordData?.data || {};

  const bailRecords = Array.isArray(bailData?.data)
    ? bailData.data
    : bailData?.data
    ? [bailData.data]
    : [];

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0c0f",
      color: "#e8eaf0", fontFamily: "'DM Sans','Segoe UI',sans-serif",
      padding: "2rem", display: "flex", alignItems: "flex-start", justifyContent: "center",
    }}>
      <div style={{ width: "100%", maxWidth: "640px" }}>

        <button
          onClick={() => navigate('/officer/dashboard/arrest-records')}
          style={{ background: "none", border: "none", color: "#5a6278", fontSize: "0.82rem", cursor: "pointer", padding: 0, marginBottom: "1.5rem" }}
        >
          ← Back to records
        </button>

        {arrestLoading ? <SkeletonCard /> : arrestError ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#e05252", fontSize: "0.9rem", background: "#12151a", border: "1px solid #1e2330", borderRadius: "14px" }}>
            Failed to load record.
          </div>
        ) : (
          <>
            {/* ── Arrest Record Card ── */}
            <div style={{ background: "#12151a", border: "1px solid #1e2330", borderRadius: "14px", padding: "2rem", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
                <div>
                  <p style={{ fontSize: "0.72rem", color: "#5a6278", fontWeight: "600", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 4px" }}>Arrest Record</p>
                  <h1 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#e8eaf0", margin: 0, fontFamily: "monospace" }}>{r.arrest_id}</h1>
                </div>
                <StatusBadge status={r.custody_status} config={arrestStatusConfig} />
              </div>

              {/* Criminal highlight */}
              <div style={{
                background: "#0d1017", border: "1px solid #1e2330",
                borderRadius: "10px", padding: "1rem 1.25rem", marginBottom: "1.5rem",
                display: "flex", alignItems: "center", gap: "12px",
              }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "50%", flexShrink: 0,
                  background: "#1a0e2e", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.85rem", fontWeight: "700", color: "#b87eea",
                }}>
                  {r.criminal_name?.split(" ").map(n => n[0]).slice(0, 2).join("") || "??"}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: "600", color: "#e8eaf0", fontSize: "0.95rem" }}>{r.criminal_name || "—"}</p>
                  <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#5a6278", fontFamily: "monospace" }}>{r.criminal_id}</p>
                </div>
              </div>

              <DetailRow label="Arrest Date"    value={formatDate(r.arrest_date)} />
              <DetailRow label="Bail Due Date"  value={formatDate(r.bail_due_date)} accent={r.bail_due_date ? "#d4932a" : undefined} />
              <DetailRow label="Case Reference" value={r.case_reference} mono />
              <DetailRow label="Thana"          value={r.thana_name} />
              <DetailRow label="Thana ID"       value={r.thana_id} mono isLast />
            </div>

            {/* Arrest actions */}
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "2.5rem" }}>
              <button
                onClick={() => navigate(`/officer/dashboard/update-arrest-record/${arrestId}`)}
                style={{
                  flex: 1, padding: "0.65rem", background: "#2c5fe6",
                  border: "none", borderRadius: "8px", color: "#fff",
                  fontSize: "0.85rem", fontWeight: "600", cursor: "pointer",
                }}
              >
                Edit Arrest Record
              </button>
              <button
                onClick={() => navigate("/officer/dashboard/arrest-records")}
                style={{
                  flex: 1, padding: "0.65rem", background: "transparent",
                  border: "1px solid #1e2330", borderRadius: "8px", color: "#9aa3b8",
                  fontSize: "0.85rem", fontWeight: "500", cursor: "pointer",
                }}
              >
                All Records
              </button>
            </div>

            {/* ── Bail Records ── */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div>
                  <h2 style={{ fontSize: "1rem", fontWeight: "600", color: "#e8eaf0", margin: 0 }}>Bail Records</h2>
                  <p style={{ fontSize: "0.78rem", color: "#5a6278", margin: "2px 0 0" }}>
                    {bailLoading ? "Loading…" : `${bailRecords.length} record${bailRecords.length !== 1 ? "s" : ""}`}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/officer/dashboard/arrest-record-details/${arrestId}/add-bail`)}
                  style={{
                    padding: "0.5rem 1rem", background: "transparent",
                    border: "1px solid #2c5fe6", borderRadius: "7px",
                    color: "#4da6e8", fontSize: "0.82rem", fontWeight: "600", cursor: "pointer",
                  }}
                >
                  + Add Bail
                </button>
              </div>

              {bailLoading ? (
                <div style={{ background: "#12151a", border: "1px solid #1e2330", borderRadius: "12px" }}>
                  {[...Array(2)].map((_, i) => (
                    <div key={i} style={{ padding: "1rem 1.25rem", borderBottom: i < 1 ? "1px solid #111418" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ height: "13px", width: "40%", borderRadius: "4px", background: "#1a1f2a" }} />
                      <div style={{ height: "13px", width: "20%", borderRadius: "4px", background: "#1a1f2a" }} />
                    </div>
                  ))}
                </div>
              ) : bailRecords.length === 0 ? (
                <div style={{
                  background: "#12151a", border: "1px dashed #1e2330",
                  borderRadius: "12px", padding: "2rem",
                  textAlign: "center", color: "#5a6278", fontSize: "0.85rem",
                }}>
                  No bail records for this arrest.{" "}
                  <span
                    onClick={() => navigate(`/officer/dashboard/arrest-record-details/${arrestId}/add-bail`)}
                    style={{ color: "#4da6e8", cursor: "pointer", textDecoration: "underline" }}
                  >
                    Add one
                  </span>
                </div>
              ) : (
                <div style={{ background: "#12151a", border: "1px solid #1e2330", borderRadius: "12px", overflow: "hidden" }}>
                  {bailRecords.map((bail, idx) => (
                    <div
                      key={bail.bail_id}
                      onClick={() => navigate(`/officer/dashboard/arrest-records/${arrestId}/bail-record-details/${bail.bail_id}`)}
                      style={{
                        padding: "1rem 1.25rem",
                        borderBottom: idx < bailRecords.length - 1 ? "1px solid #111418" : "none",
                        cursor: "pointer", transition: "background 0.1s",
                        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "#0f1219"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                          <span style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "#4da6e8" }}>#{bail.bail_id}</span>
                          <StatusBadge status={bail.status} config={bailStatusConfig} />
                        </div>
                        <p style={{ margin: 0, fontSize: "0.85rem", color: "#e8eaf0", fontWeight: "500", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {bail.court_name}
                        </p>
                        {bail.surety_name && (
                          <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#5a6278" }}>Surety: {bail.surety_name}</p>
                        )}
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        {formatCurrency(bail.bail_amount) && (
                          <p style={{ margin: 0, fontFamily: "monospace", fontSize: "0.88rem", fontWeight: "700", color: "#3dba78" }}>
                            {formatCurrency(bail.bail_amount)}
                          </p>
                        )}
                        <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#5a6278" }}>
                          {bail.granted_at ? formatDateShort(bail.granted_at) : "Date pending"}
                        </p>
                        <span style={{ fontSize: "0.75rem", color: "#3a4055" }}>→</span>
                      </div>
                    </div>
                  ))}
                  <div
                    onClick={() => navigate(`/arrest-records/${arrestId}/bail`)}
                    style={{
                      padding: "0.75rem 1.25rem", borderTop: "1px solid #1e2330",
                      textAlign: "center", cursor: "pointer",
                      color: "#4da6e8", fontSize: "0.8rem", fontWeight: "500",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#0f1219"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    View all bail records →
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}