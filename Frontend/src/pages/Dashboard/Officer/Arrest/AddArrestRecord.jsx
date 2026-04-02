import addArrestRecordApi from "@/services/ArrestRecord/addArrestRecordApi";
import getCriminalByNameApi from "@/services/Criminal/getCriminalByNameApi";
import userStore from "@/state/userStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const custodyOptions = [
  { value: "in_custody", label: "In Custody" },
  { value: "on_bail", label: "On Bail" },
  { value: "released", label: "Released" },
  { value: "transferred", label: "Transferred" },
];

function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.4rem" }}>
        <label style={{
          fontSize: "0.72rem", fontWeight: "600",
          letterSpacing: "0.08em", textTransform: "uppercase", color: "#5a6278",
        }}>{label}</label>
        {hint && <span style={{ fontSize: "0.7rem", color: "#3a4055" }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "0.65rem 0.9rem",
  background: "#0d1017", border: "1px solid #1e2330",
  borderRadius: "8px", color: "#e8eaf0",
  fontSize: "0.9rem", outline: "none",
  boxSizing: "border-box",
};

export default function AddArrestRecord() {
  const navigate = useNavigate();
  const { user } = userStore();
  const thanaId = user?.thana_id || "";
  const queryClient = useQueryClient();

  const [criminalId, setCriminalId] = useState("");
  const [arrestDate, setArrestDate] = useState("");
  const [bailDueDate, setBailDueDate] = useState("");
  const [custodyStatus, setCustodyStatus] = useState("in_custody");
  const [caseReference, setCaseReference] = useState("");
  const [name, setName] = useState("");

  const { data: criminalData } = useQuery({
    queryKey: ["criminalByName", name],
    queryFn: () => getCriminalByNameApi(name),
    enabled: !!name.trim(),
    staleTime: 5 * 60 * 1000,
  });

  const criminals = criminalData?.data || [];


  const { mutate: addArrestRecord, isPending, isSuccess, isError } = useMutation({
    mutationFn: (arrestData) => addArrestRecordApi(arrestData),
    onSuccess: () => {
      queryClient.invalidateQueries(["arrestRecords", thanaId]);
      setCriminalId("");
      setArrestDate("");
      setBailDueDate("");
      setCustodyStatus("in_custody");
      setCaseReference("");
    },
  });

  const isValid = criminalId.trim() && arrestDate;

  const handleSubmit = () => {
    if (!isValid) return;
    addArrestRecord({
      criminal_id: criminalId.trim(),
      arrest_date: arrestDate,
      bail_due_date: bailDueDate || null,
      custody_status: custodyStatus,
      thana_id: thanaId,
      case_reference: caseReference.trim() || null,
    });
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0c0f",
      color: "#e8eaf0", fontFamily: "'DM Sans','Segoe UI',sans-serif",
      padding: "2rem", display: "flex", alignItems: "flex-start", justifyContent: "center",
    }}>
      <div style={{ width: "100%", maxWidth: "580px" }}>

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          style={{ background: "none", border: "none", color: "#5a6278", fontSize: "0.82rem", cursor: "pointer", padding: 0, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "4px" }}
        >
          ← Back
        </button>

        {/* Card */}
        <div style={{ background: "#12151a", border: "1px solid #1e2330", borderRadius: "14px", padding: "2rem" }}>

          {/* Title */}
          <div style={{ marginBottom: "2rem" }}>
            <h1 style={{ fontSize: "1.4rem", fontWeight: "700", color: "#e8eaf0", margin: 0 }}>New Arrest Record</h1>
            <p style={{ color: "#5a6278", margin: "4px 0 0", fontSize: "0.83rem" }}>
              Thana: <span style={{ color: "#9aa3b8", fontFamily: "monospace" }}>{thanaId || "—"}</span>
            </p>
          </div>

          {/* Success / Error banners */}
          {isSuccess && (
            <div style={{
              background: "#0c2218", border: "1px solid #1b4530",
              borderRadius: "8px", padding: "0.7rem 1rem",
              color: "#3dba78", fontSize: "0.83rem", marginBottom: "1.5rem",
              display: "flex", alignItems: "center", gap: "8px",
            }}>
              <span style={{ fontSize: "1rem" }}>✓</span> Arrest record added successfully.
            </div>
          )}
          {isError && (
            <div style={{
              background: "#2a0e0e", border: "1px solid #4a1a1a",
              borderRadius: "8px", padding: "0.7rem 1rem",
              color: "#e05252", fontSize: "0.83rem", marginBottom: "1.5rem",
              display: "flex", alignItems: "center", gap: "8px",
            }}>
              <span style={{ fontSize: "1rem" }}>✕</span> Failed to add record. Please try again.
            </div>
          )}

          {/* Criminal ID */}
          <Field label="Criminal ID" hint="required">
            <input
              style={inputStyle}
              value={criminalId}
              onChange={e => setCriminalId(e.target.value)}
              placeholder="e.g. CRM-0000001"
            />
          </Field>

          {/* Dates row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Arrest Date" hint="required">
              <input
                style={inputStyle}
                type="date"
                value={arrestDate}
                onChange={e => setArrestDate(e.target.value)}
              />
            </Field>
            <Field label="Bail Due Date" hint="optional">
              <input
                style={inputStyle}
                type="date"
                value={bailDueDate}
                onChange={e => setBailDueDate(e.target.value)}
                min={arrestDate || undefined}
              />
            </Field>
          </div>

          {/* Custody Status */}
          <Field label="Custody Status">
            <div style={{ position: "relative" }}>
              <select
                style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                value={custodyStatus}
                onChange={e => setCustodyStatus(e.target.value)}
              >
                {custodyOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <span style={{
                position: "absolute", right: "10px", top: "50%",
                transform: "translateY(-50%)", pointerEvents: "none",
                color: "#5a6278", fontSize: "0.65rem",
              }}>▼</span>
            </div>
          </Field>

          {/* Case Reference */}
          <Field label="Case Reference" hint="optional">
            <input
              style={inputStyle}
              value={caseReference}
              onChange={e => setCaseReference(e.target.value)}
              placeholder="e.g. CF-2024-DHK-001"
            />
          </Field>

          {/* Divider */}
          <div style={{ borderTop: "1px solid #1e2330", margin: "1.5rem 0" }} />

          {/* Actions */}
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                flex: 1, padding: "0.7rem", background: "transparent",
                border: "1px solid #1e2330", borderRadius: "8px",
                color: "#9aa3b8", fontSize: "0.88rem", fontWeight: "500", cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isPending || !isValid}
              style={{
                flex: 2, padding: "0.7rem", background: "#2c5fe6",
                border: "none", borderRadius: "8px",
                color: "#fff", fontSize: "0.88rem", fontWeight: "600",
                cursor: isPending || !isValid ? "not-allowed" : "pointer",
                opacity: isPending || !isValid ? 0.55 : 1,
                transition: "opacity 0.15s",
              }}
            >
              {isPending ? "Saving…" : "Add Arrest Record"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}