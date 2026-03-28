import getArrestRecordByThanaApi from "@/services/ArrestRecord/getArrestRecordByThanaApi";
import { officerSignoutApi } from "@/services/authServices/signoutApi";
import getGDReportByAssignedOfficerApi from "@/services/GDReport/getGDReportByAssignedOfficerApi";
import userStore from "@/state/userStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const gdStatusConfig = {
  submitted: { label: "Submitted", color: "#4da6e8", bg: "#0e1a2e" },
  assigned:  { label: "Assigned",  color: "#d4932a", bg: "#1f1a0d" },
  approved:  { label: "Approved",  color: "#3dba78", bg: "#0c2218" },
  rejected:  { label: "Rejected",  color: "#e05252", bg: "#2a0e0e" },
};

const arrestStatusConfig = {
  in_custody:  { label: "In Custody",  color: "#b87eea", bg: "#1a0e2e" },
  on_bail:     { label: "On Bail",     color: "#d4932a", bg: "#1f1a0d" },
  released:    { label: "Released",    color: "#3dba78", bg: "#0c2218" },
  transferred: { label: "Transferred", color: "#4da6e8", bg: "#0e1a2e" },
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

function StatusDot({ status, config }) {
  const cfg = config[status] || Object.values(config)[0];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      background: cfg.bg, color: cfg.color,
      padding: "2px 8px", borderRadius: "4px",
      fontSize: "0.7rem", fontWeight: "600",
      letterSpacing: "0.04em", textTransform: "uppercase", whiteSpace: "nowrap",
    }}>
      <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: cfg.color, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
}

function StatCard({ value, label, color, isLoading }) {
  return (
    <div style={{
      background: "#0d1017", border: "1px solid #1e2330",
      borderRadius: "10px", padding: "1.25rem", textAlign: "center",
    }}>
      {isLoading
        ? <div style={{ height: "32px", borderRadius: "5px", background: "#1a1f2a", margin: "0 auto 8px", width: "60%" }} />
        : <div style={{ fontSize: "2rem", fontWeight: "700", color: color || "#e8eaf0", lineHeight: 1.1 }}>{value}</div>
      }
      <div style={{ fontSize: "0.72rem", color: "#5a6278", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: "600" }}>{label}</div>
    </div>
  );
}

function SectionHeader({ title, count, actionLabel, onAction }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
      <div>
        <h2 style={{ fontSize: "1rem", fontWeight: "600", color: "#e8eaf0", margin: 0 }}>{title}</h2>
        {count != null && (
          <p style={{ fontSize: "0.75rem", color: "#5a6278", margin: "2px 0 0" }}>{count} record{count !== 1 ? "s" : ""}</p>
        )}
      </div>
      {onAction && (
        <button
          onClick={onAction}
          style={{
            padding: "0.45rem 0.9rem", background: "transparent",
            border: "1px solid #1e2330", borderRadius: "7px",
            color: "#9aa3b8", fontSize: "0.78rem", fontWeight: "500", cursor: "pointer",
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default function OfficerDashboard() {
  const navigate = useNavigate();
  const { user } = userStore();
  const officerId = user?.officer_id || "";
  const thanaId = user?.thana_id || "";

  const { data: gdReportsData, isLoading: gdLoading } = useQuery({
    queryKey: ["gdReportsByOfficer", officerId],
    queryFn: () => getGDReportByAssignedOfficerApi(officerId),
    enabled: !!officerId,
  });

  const { data: arrestRecordsData, isLoading: arrestLoading } = useQuery({
    queryKey: ["arrestRecords", thanaId],
    queryFn: () => getArrestRecordByThanaApi(thanaId),
    enabled: !!thanaId,
  });

  const { mutate: signOut } = useMutation({
    mutationFn: () => officerSignoutApi(),
    onSuccess: () => {
        alert("Signed out successfully.");
        navigate("/");
    },
    onError: () => {
        alert("Error signing out. Please try again.");
    }
  })

  console.log("GD Reports for officer", officerId, gdReportsData);
  console.log("Arrest Records for officer", officerId, arrestRecordsData);

  const gdReports = gdReportsData?.data || [];
  const arrestRecords = arrestRecordsData?.data || [];

  const pendingGDs = gdReports.filter(r => r.status === "submitted" || r.status === "assigned");
  const inCustody  = arrestRecords.filter(r => r.custody_status === "in_custody");

  const gdCounts = gdReports.reduce((a, r) => { a[r.status] = (a[r.status] || 0) + 1; return a; }, {});

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0c0f",
      color: "#e8eaf0", fontFamily: "'DM Sans','Segoe UI',sans-serif", padding: "2rem",
    }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "2rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
            <p style={{ fontSize: "0.75rem", color: "#5a6278", fontWeight: "600", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 4px" }}>
            Officer Portal
            </p>
            <h1 style={{ fontSize: "1.6rem", fontWeight: "700", color: "#e8eaf0", margin: 0 }}>Dashboard</h1>
            <p style={{ color: "#5a6278", margin: "4px 0 0", fontSize: "0.83rem" }}>
            ID: <span style={{ fontFamily: "monospace", color: "#9aa3b8" }}>{officerId || "—"}</span>
            </p>
        </div>
        <button
            onClick={() => signOut()}
            style={{
            marginTop: "4px", padding: "0.45rem 0.9rem",
            background: "transparent", border: "1px solid #2a1515",
            borderRadius: "7px", color: "#7a4a4a",
            fontSize: "0.78rem", fontWeight: "500", cursor: "pointer",
            transition: "border-color 0.15s, color 0.15s, background 0.15s",
            }}
            onMouseEnter={e => {
            e.currentTarget.style.borderColor = "#e05252";
            e.currentTarget.style.color = "#e05252";
            e.currentTarget.style.background = "#1a0808";
            }}
            onMouseLeave={e => {
            e.currentTarget.style.borderColor = "#2a1515";
            e.currentTarget.style.color = "#7a4a4a";
            e.currentTarget.style.background = "transparent";
            }}
        >
            Sign Out
        </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
          <StatCard value={gdReports.length}    label="Total GDs"    isLoading={gdLoading} />
          <StatCard value={pendingGDs.length}   label="Pending GDs"  color="#d4932a" isLoading={gdLoading} />
          <StatCard value={arrestRecords.length} label="Arrest Records" isLoading={arrestLoading} />
          <StatCard value={inCustody.length}    label="In Custody"   color="#b87eea" isLoading={arrestLoading} />
        </div>

        {/* GD Status Breakdown */}
        {!gdLoading && gdReports.length > 0 && (
          <div style={{ background: "#12151a", border: "1px solid #1e2330", borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "1.5rem" }}>
            <p style={{ fontSize: "0.72rem", color: "#5a6278", fontWeight: "600", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 1rem" }}>
              GD Breakdown
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {Object.entries(gdStatusConfig).map(([key, cfg]) => (
                <div key={key} style={{ flex: 1, minWidth: "100px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <span style={{ fontSize: "0.75rem", color: "#9aa3b8" }}>{cfg.label}</span>
                    <span style={{ fontSize: "0.78rem", fontWeight: "700", color: cfg.color }}>{gdCounts[key] || 0}</span>
                  </div>
                  <div style={{ height: "4px", borderRadius: "2px", background: "#1e2330", overflow: "hidden" }}>
                    <div style={{
                      height: "100%",
                      width: gdReports.length ? `${((gdCounts[key] || 0) / gdReports.length) * 100}%` : "0%",
                      background: cfg.color, borderRadius: "2px", transition: "width 0.4s ease",
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>

          {/* Recent GDs */}
          <div>
            <SectionHeader
              title="Recent GD Reports"
              count={!gdLoading ? gdReports.length : null}
              actionLabel="View All →"
              onAction={() => navigate("/officer/dashboard/gd-list")}
            />
            <div style={{ background: "#12151a", border: "1px solid #1e2330", borderRadius: "12px", overflow: "hidden" }}>
              {gdLoading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} style={{ padding: "0.9rem 1rem", borderBottom: i < 3 ? "1px solid #111418" : "none", display: "flex", justifyContent: "space-between" }}>
                    <div style={{ height: "13px", width: "50%", borderRadius: "4px", background: "#1a1f2a" }} />
                    <div style={{ height: "13px", width: "22%", borderRadius: "4px", background: "#1a1f2a" }} />
                  </div>
                ))
              ) : gdReports.length === 0 ? (
                <div style={{ padding: "2rem", textAlign: "center", color: "#5a6278", fontSize: "0.85rem" }}>No GD reports assigned.</div>
              ) : (
                gdReports.slice(0, 5).map((report, idx) => (
                  <div
                    key={report.gd_id}
                    onClick={() => navigate(`/officer/dashboard/gd-list/${report.gd_id}`)}
                    style={{
                      padding: "0.85rem 1rem",
                      borderBottom: idx < Math.min(gdReports.length, 5) - 1 ? "1px solid #111418" : "none",
                      cursor: "pointer", transition: "background 0.1s",
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#0f1219"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                        <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#4da6e8" }}>#{report.gd_id}</span>
                        <span style={{ fontSize: "0.72rem", color: "#5a6278" }}>·</span>
                        <span style={{ fontSize: "0.72rem", color: "#9aa3b8" }}>{gdTypeLabels[report.gd_type] || report.gd_type}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: "0.8rem", color: "#c0c6d6", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {report.incident_location || "Location not specified"}
                      </p>
                    </div>
                    <StatusDot status={report.status} config={gdStatusConfig} />
                  </div>
                ))
              )}
              {gdReports.length > 5 && (
                <div
                  onClick={() => navigate("/officer/dashboard/gd-list")}
                  style={{
                    padding: "0.65rem 1rem", borderTop: "1px solid #1e2330",
                    textAlign: "center", cursor: "pointer", color: "#4da6e8",
                    fontSize: "0.78rem", fontWeight: "500",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#0f1219"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  +{gdReports.length - 5} more →
                </div>
              )}
            </div>
          </div>

          {/* Recent Arrest Records */}
          <div>
            <SectionHeader
              title="Arrest Records"
              count={!arrestLoading ? arrestRecords.length : null}
              actionLabel="View All →"
              onAction={() => navigate("/officer/dashboard/arrest-records")}
            />
            <div style={{ background: "#12151a", border: "1px solid #1e2330", borderRadius: "12px", overflow: "hidden" }}>
              {arrestLoading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} style={{ padding: "0.9rem 1rem", borderBottom: i < 3 ? "1px solid #111418" : "none", display: "flex", justifyContent: "space-between" }}>
                    <div style={{ height: "13px", width: "50%", borderRadius: "4px", background: "#1a1f2a" }} />
                    <div style={{ height: "13px", width: "22%", borderRadius: "4px", background: "#1a1f2a" }} />
                  </div>
                ))
              ) : arrestRecords.length === 0 ? (
                <div style={{ padding: "2rem", textAlign: "center", color: "#5a6278", fontSize: "0.85rem" }}>No arrest records found.</div>
              ) : (
                arrestRecords.slice(0, 5).map((record, idx) => (
                  <div
                    key={record.arrest_id}
                    onClick={() => navigate(`/officer/dashboard/arrest-record-details/${record.arrest_id}`)}
                    style={{
                      padding: "0.85rem 1rem",
                      borderBottom: idx < Math.min(arrestRecords.length, 5) - 1 ? "1px solid #111418" : "none",
                      cursor: "pointer", transition: "background 0.1s",
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#0f1219"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                        <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#4da6e8" }}>{record.arrest_id}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: "0.8rem", color: "#c0c6d6", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {record.criminal_name || "—"}
                      </p>
                      <p style={{ margin: "1px 0 0", fontSize: "0.72rem", color: "#5a6278" }}>
                        {formatDate(record.arrest_date)}
                      </p>
                    </div>
                    <StatusDot status={record.custody_status} config={arrestStatusConfig} />
                  </div>
                ))
              )}
              {arrestRecords.length > 5 && (
                <div
                  onClick={() => navigate("/officer/dashboard/arrest-records")}
                  style={{
                    padding: "0.65rem 1rem", borderTop: "1px solid #1e2330",
                    textAlign: "center", cursor: "pointer", color: "#4da6e8",
                    fontSize: "0.78rem", fontWeight: "500",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#0f1219"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  +{arrestRecords.length - 5} more →
                </div>
              )}
            </div>

            {/* Quick Add */}
            <button
              onClick={() => navigate("/officer/dashboard/add-arrest-record")}
              style={{
                width: "100%", marginTop: "0.75rem", padding: "0.65rem",
                background: "transparent", border: "1px dashed #1e2330",
                borderRadius: "8px", color: "#5a6278",
                fontSize: "0.82rem", fontWeight: "500", cursor: "pointer",
                transition: "border-color 0.15s, color 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#2c5fe6"; e.currentTarget.style.color = "#4da6e8"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e2330"; e.currentTarget.style.color = "#5a6278"; }}
            >
              + New Arrest Record
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}