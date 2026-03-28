import getGDReportByGDIdApi from "@/services/GDReport/getDGReportByGDIdApi";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

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
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}

function formatDateTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
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
        textAlign: "right", wordBreak: "break-word", maxWidth: "65%",
      }}>{value || "—"}</span>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ background: "#12151a", border: "1px solid #1e2330", borderRadius: "14px", padding: "2rem", marginBottom: "1rem" }}>
      <div style={{ height: "26px", width: "40%", borderRadius: "5px", background: "#1a1f2a", marginBottom: "2rem" }} />
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 0", borderBottom: "1px solid #111418" }}>
          <div style={{ height: "13px", width: "28%", borderRadius: "4px", background: "#1a1f2a" }} />
          <div style={{ height: "13px", width: "40%", borderRadius: "4px", background: "#1a1f2a" }} />
        </div>
      ))}
    </div>
  );
}

export default function GDDetails() {
  const navigate = useNavigate();
  const { dairyId } = useParams();

  const { data: gdReportData, isLoading, error } = useQuery({
    queryKey: ["gdReportDetails", dairyId],
    queryFn: () => getGDReportByGDIdApi(dairyId),
    enabled: !!dairyId,
  });

  const r = gdReportData?.data || null;
  const cfg = statusConfig[r?.status] || statusConfig.submitted;

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0c0f",
      color: "#e8eaf0", fontFamily: "'DM Sans','Segoe UI',sans-serif",
      padding: "2rem", display: "flex", alignItems: "flex-start", justifyContent: "center",
    }}>
      <div style={{ width: "100%", maxWidth: "640px" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "1.5rem" }}>
          <button onClick={() => navigate("/officer/dashboard")} style={{ background: "none", border: "none", color: "#5a6278", fontSize: "0.82rem", cursor: "pointer", padding: 0 }}>
            Dashboard
          </button>
          <span style={{ color: "#3a4055" }}>/</span>
          <button onClick={() => navigate("/officer/dashboard/gd-list")} style={{ background: "none", border: "none", color: "#5a6278", fontSize: "0.82rem", cursor: "pointer", padding: 0 }}>
            GD List
          </button>
          <span style={{ color: "#3a4055" }}>/</span>
          <span style={{ color: "#9aa3b8", fontSize: "0.82rem", fontFamily: "monospace" }}>#{dairyId}</span>
        </div>

        {isLoading ? <SkeletonCard /> : error ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#e05252", fontSize: "0.9rem", background: "#12151a", border: "1px solid #1e2330", borderRadius: "14px" }}>
            Failed to load GD report.
          </div>
        ) : r && (
          <>
            {/* Main card */}
            <div style={{ background: "#12151a", border: "1px solid #1e2330", borderRadius: "14px", padding: "2rem", marginBottom: "1rem" }}>

              {/* Header */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
                <div>
                  <p style={{ fontSize: "0.72rem", color: "#5a6278", fontWeight: "600", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 4px" }}>
                    General Diary
                  </p>
                  <h1 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#e8eaf0", margin: 0, fontFamily: "monospace" }}>
                    #{r.gd_id}
                  </h1>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
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
                  <span style={{
                    background: "#1a1f2a", color: "#c0c6d6",
                    padding: "3px 10px", borderRadius: "4px",
                    fontSize: "0.72rem", fontWeight: "500",
                  }}>
                    {gdTypeLabels[r.gd_type] || r.gd_type}
                  </span>
                </div>
              </div>

              {/* Description block */}
              {r.description && (
                <div style={{
                  background: "#0d1017", border: "1px solid #1e2330",
                  borderRadius: "10px", padding: "1rem 1.25rem", marginBottom: "1.5rem",
                }}>
                  <p style={{ fontSize: "0.72rem", color: "#5a6278", fontWeight: "600", letterSpacing: "0.07em", textTransform: "uppercase", margin: "0 0 0.5rem" }}>
                    Description
                  </p>
                  <p style={{ fontSize: "0.88rem", color: "#c0c6d6", margin: 0, lineHeight: 1.7 }}>
                    {r.description}
                  </p>
                </div>
              )}

              <DetailRow label="Incident Location" value={r.incident_location} />
              <DetailRow label="Incident Date"     value={formatDate(r.incident_date)} />
              <DetailRow label="Submitted At"      value={formatDateTime(r.submitted_at)} accent="#9aa3b8" />
              <DetailRow label="Thana ID"          value={r.thana_id} mono />
              <DetailRow label="User ID"           value={r.user_id} mono />
              {r.assigned_officer_id && (
                <DetailRow label="Assigned Officer" value={r.assigned_officer_id} mono accent="#4da6e8" />
              )}
              {r.approved_by_officer_id && (
                <DetailRow label="Approved By" value={r.approved_by_officer_id} mono accent="#3dba78" isLast />
              )}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {(r.status === "submitted" || r.status === "assigned") && (
                <button
                  onClick={() => navigate(`/officer/respond-gd/${r.gd_id}`)}
                  style={{
                    flex: 2, padding: "0.7rem", background: "#2c5fe6",
                    border: "none", borderRadius: "8px", color: "#fff",
                    fontSize: "0.85rem", fontWeight: "600", cursor: "pointer",
                  }}
                >
                  Respond to GD
                </button>
              )}
              <button
                onClick={() => navigate("/officer/dashboard/gd-list")}
                style={{
                  flex: 1, padding: "0.7rem", background: "transparent",
                  border: "1px solid #1e2330", borderRadius: "8px", color: "#9aa3b8",
                  fontSize: "0.85rem", fontWeight: "500", cursor: "pointer",
                }}
              >
                Back to List
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}