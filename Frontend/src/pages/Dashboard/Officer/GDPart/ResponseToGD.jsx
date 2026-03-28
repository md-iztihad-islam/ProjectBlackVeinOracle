import getGDReportByGDIdApi from "@/services/GDReport/getDGReportByGDIdApi";
import responseToGDReportApi from "@/services/GDReport/responseToGDReportApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const statusOptions = [
  { value: "approved", label: "Approve", desc: "Mark this GD as reviewed and approved.", color: "#3dba78", bg: "#0c2218", border: "#1b4530" },
  { value: "rejected", label: "Reject",  desc: "Mark this GD as reviewed and rejected.",  color: "#e05252", bg: "#2a0e0e", border: "#4a1a1a" },
];

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

function SkeletonCard() {
  return (
    <div style={{ background: "#12151a", border: "1px solid #1e2330", borderRadius: "14px", padding: "1.5rem", marginBottom: "1rem" }}>
      <div style={{ height: "16px", width: "50%", borderRadius: "4px", background: "#1a1f2a", marginBottom: "1rem" }} />
      {[...Array(4)].map((_, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "0.7rem 0", borderBottom: "1px solid #111418" }}>
          <div style={{ height: "12px", width: "25%", borderRadius: "3px", background: "#1a1f2a" }} />
          <div style={{ height: "12px", width: "40%", borderRadius: "3px", background: "#1a1f2a" }} />
        </div>
      ))}
    </div>
  );
}

export default function ResponseToGD() {
  const navigate = useNavigate();
  const { gdId } = useParams();
  const queryClient = useQueryClient();

  const [decision, setDecision] = useState("approved");

  console.log("Rendering ResponseToGD for GD ID:", gdId);

  const { data: gdReportData, isLoading, error: fetchError } = useQuery({
    queryKey: ["gdReportDetails", gdId],
    queryFn: () => getGDReportByGDIdApi(gdId),
    enabled: !!gdId,
  });

  const r = gdReportData?.data || null;

  const { mutate: respondToGD, isPending, isSuccess, isError } = useMutation({
    mutationFn: (responseData) => responseToGDReportApi({ gdId: gdId, responseData }),
    onSuccess: () => {
      queryClient.invalidateQueries(["gdReportDetails", gdId]);
      queryClient.invalidateQueries(["gdReportsByOfficer"]);
    },
  });

  const alreadyResolved = r && (r.status === "approved" || r.status === "rejected");

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0c0f",
      color: "#e8eaf0", fontFamily: "'DM Sans','Segoe UI',sans-serif",
      padding: "2rem", display: "flex", alignItems: "flex-start", justifyContent: "center",
    }}>
      <div style={{ width: "100%", maxWidth: "600px" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "1.5rem" }}>
          <button onClick={() => navigate("/officer/dashboard/gd-list")} style={{ background: "none", border: "none", color: "#5a6278", fontSize: "0.82rem", cursor: "pointer", padding: 0 }}>
            GD List
          </button>
          <span style={{ color: "#3a4055" }}>/</span>
          <button onClick={() => navigate(`/officer/dashboard/gd-list/${gdId}`)} style={{ background: "none", border: "none", color: "#5a6278", fontSize: "0.82rem", cursor: "pointer", padding: 0, fontFamily: "monospace" }}>
            #{gdId}
          </button>
          <span style={{ color: "#3a4055" }}>/</span>
          <span style={{ color: "#9aa3b8", fontSize: "0.82rem" }}>Respond</span>
        </div>

        {/* GD Summary Card */}
        {isLoading ? <SkeletonCard /> : fetchError ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#e05252", fontSize: "0.9rem", background: "#12151a", border: "1px solid #1e2330", borderRadius: "14px", marginBottom: "1rem" }}>
            Failed to load GD report.
          </div>
        ) : r && (
          <div style={{ background: "#12151a", border: "1px solid #1e2330", borderRadius: "14px", padding: "1.5rem", marginBottom: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <p style={{ fontSize: "0.72rem", color: "#5a6278", fontWeight: "600", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 3px" }}>GD Report</p>
                <h2 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#e8eaf0", margin: 0, fontFamily: "monospace" }}>#{r.gd_id}</h2>
              </div>
              <span style={{
                background: "#1a1f2a", color: "#c0c6d6",
                padding: "3px 10px", borderRadius: "4px",
                fontSize: "0.72rem", fontWeight: "500",
              }}>
                {gdTypeLabels[r.gd_type] || r.gd_type}
              </span>
            </div>

            {r.description && (
              <p style={{
                fontSize: "0.85rem", color: "#9aa3b8", margin: "0 0 1rem",
                lineHeight: 1.6, padding: "0.75rem", background: "#0d1017",
                borderRadius: "8px", border: "1px solid #1a1f2a",
              }}>
                {r.description.length > 200 ? r.description.slice(0, 200) + "…" : r.description}
              </p>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              {[
                { label: "Location", value: r.incident_location || "—" },
                { label: "Incident Date", value: formatDate(r.incident_date) },
                { label: "Submitted", value: formatDateTime(r.submitted_at) },
                { label: "Thana", value: r.thana_id },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: "#0d1017", borderRadius: "7px", padding: "0.6rem 0.8rem" }}>
                  <p style={{ margin: 0, fontSize: "0.68rem", color: "#5a6278", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</p>
                  <p style={{ margin: "3px 0 0", fontSize: "0.82rem", color: "#c0c6d6", fontFamily: label === "Thana" ? "monospace" : "inherit" }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Response Form */}
        <div style={{ background: "#12151a", border: "1px solid #1e2330", borderRadius: "14px", padding: "2rem" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <h1 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#e8eaf0", margin: 0 }}>Submit Response</h1>
            <p style={{ color: "#5a6278", margin: "4px 0 0", fontSize: "0.83rem" }}>
              Your decision will be recorded and the applicant will be notified.
            </p>
          </div>

          {/* Already resolved notice */}
          {alreadyResolved && (
            <div style={{
              background: "#0d1017", border: "1px solid #1e2330",
              borderRadius: "8px", padding: "0.8rem 1rem",
              color: "#9aa3b8", fontSize: "0.83rem", marginBottom: "1.5rem",
              display: "flex", alignItems: "center", gap: "8px",
            }}>
              <span style={{ fontSize: "0.9rem" }}>ⓘ</span>
              This GD has already been <strong style={{ color: r.status === "approved" ? "#3dba78" : "#e05252" }}>{r.status}</strong>. You can still override the decision.
            </div>
          )}

          {/* Success/Error banners */}
          {isSuccess && (
            <div style={{
              background: "#0c2218", border: "1px solid #1b4530", borderRadius: "8px",
              padding: "0.7rem 1rem", color: "#3dba78", fontSize: "0.83rem",
              marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "8px",
            }}>
              <span>✓</span> Response submitted successfully.
            </div>
          )}
          {isError && (
            <div style={{
              background: "#2a0e0e", border: "1px solid #4a1a1a", borderRadius: "8px",
              padding: "0.7rem 1rem", color: "#e05252", fontSize: "0.83rem",
              marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "8px",
            }}>
              <span>✕</span> Failed to submit response. Please try again.
            </div>
          )}

          {/* Decision selector */}
          <p style={{ fontSize: "0.72rem", color: "#5a6278", fontWeight: "600", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Decision
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.75rem" }}>
            {statusOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setDecision(opt.value)}
                style={{
                  padding: "1rem",
                  background: decision === opt.value ? opt.bg : "#0d1017",
                  border: `1px solid ${decision === opt.value ? opt.border : "#1e2330"}`,
                  borderRadius: "10px", cursor: "pointer",
                  textAlign: "left", transition: "all 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{
                    width: "16px", height: "16px", borderRadius: "50%",
                    border: `2px solid ${decision === opt.value ? opt.color : "#3a4055"}`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    {decision === opt.value && (
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: opt.color }} />
                    )}
                  </span>
                  <span style={{ fontWeight: "600", color: decision === opt.value ? opt.color : "#9aa3b8", fontSize: "0.9rem" }}>
                    {opt.label}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#5a6278", paddingLeft: "24px" }}>
                  {opt.desc}
                </p>
              </button>
            ))}
          </div>

          <div style={{ borderTop: "1px solid #1e2330", margin: "0 0 1.5rem" }} />

          {/* Actions */}
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={() => navigate(`/officer/dashboard/gd-list/${gdId}`)}
              style={{
                flex: 1, padding: "0.7rem", background: "transparent",
                border: "1px solid #1e2330", borderRadius: "8px",
                color: "#9aa3b8", fontSize: "0.88rem", fontWeight: "500", cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => respondToGD({ status: decision })}
              disabled={isPending || isLoading}
              style={{
                flex: 2, padding: "0.7rem",
                background: decision === "approved" ? "#1a3a24" : "#2a0e0e",
                border: `1px solid ${decision === "approved" ? "#1b4530" : "#4a1a1a"}`,
                borderRadius: "8px",
                color: decision === "approved" ? "#3dba78" : "#e05252",
                fontSize: "0.88rem", fontWeight: "700",
                cursor: isPending ? "not-allowed" : "pointer",
                opacity: isPending ? 0.6 : 1,
                transition: "opacity 0.15s",
              }}
            >
              {isPending ? "Submitting…" : `Submit — ${decision === "approved" ? "Approve" : "Reject"}`}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}