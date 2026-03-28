import addBailRecordApi from "@/services/Bail/addBailRecordApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const bailStatusOptions = [
  { value: "pending",  label: "Pending" },
  { value: "granted",  label: "Granted" },
  { value: "rejected", label: "Rejected" },
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

export default function AddBailRecord() {
  const navigate = useNavigate();
  // arrestId from URL so bail is automatically linked to the correct arrest
  const { arrestId } = useParams();
  const queryClient = useQueryClient();

  const [courtName, setCourtName]   = useState("");
  const [bailAmount, setBailAmount] = useState("");
  const [grantedAt, setGrantedAt]   = useState("");
  const [suretyName, setSuretyName] = useState("");
  const [status, setStatus]         = useState("pending");

  const { mutate: addBailRecord, isPending, isSuccess, isError } = useMutation({
    mutationFn: (bailData) => addBailRecordApi(bailData),
    onSuccess: () => {
      queryClient.invalidateQueries(["bailRecord", arrestId]);
      setCourtName("");
      setBailAmount("");
      setGrantedAt("");
      setSuretyName("");
      setStatus("pending");
    },
  });

  const isValid = courtName.trim();

  const handleSubmit = () => {
    if (!isValid) return;
    addBailRecord({
      arrest_id:   arrestId,
      court_name:  courtName.trim(),
      bail_amount: bailAmount ? parseFloat(bailAmount) : null,
      granted_at:  grantedAt || null,
      surety_name: suretyName.trim() || null,
      status,
    });
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0c0f",
      color: "#e8eaf0", fontFamily: "'DM Sans','Segoe UI',sans-serif",
      padding: "2rem", display: "flex", alignItems: "flex-start", justifyContent: "center",
    }}>
      <div style={{ width: "100%", maxWidth: "580px" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "1.5rem" }}>
          <button
            onClick={() => navigate("/arrest-records")}
            style={{ background: "none", border: "none", color: "#5a6278", fontSize: "0.82rem", cursor: "pointer", padding: 0 }}
          >
            Arrest Records
          </button>
          <span style={{ color: "#3a4055" }}>/</span>
          <button
            onClick={() => navigate(`/arrest-records/${arrestId}`)}
            style={{ background: "none", border: "none", color: "#5a6278", fontSize: "0.82rem", cursor: "pointer", padding: 0, fontFamily: "monospace" }}
          >
            {arrestId}
          </button>
          <span style={{ color: "#3a4055" }}>/</span>
          <span style={{ color: "#9aa3b8", fontSize: "0.82rem" }}>New Bail</span>
        </div>

        <div style={{ background: "#12151a", border: "1px solid #1e2330", borderRadius: "14px", padding: "2rem" }}>

          {/* Title */}
          <div style={{ marginBottom: "2rem" }}>
            <h1 style={{ fontSize: "1.4rem", fontWeight: "700", color: "#e8eaf0", margin: 0 }}>New Bail Record</h1>
            <p style={{ color: "#5a6278", margin: "4px 0 0", fontSize: "0.83rem" }}>
              Arrest: <span style={{ fontFamily: "monospace", color: "#4da6e8" }}>{arrestId}</span>
            </p>
          </div>

          {/* Banners */}
          {isSuccess && (
            <div style={{
              background: "#0c2218", border: "1px solid #1b4530", borderRadius: "8px",
              padding: "0.7rem 1rem", color: "#3dba78", fontSize: "0.83rem",
              marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "8px",
            }}>
              <span>✓</span> Bail record added successfully.
            </div>
          )}
          {isError && (
            <div style={{
              background: "#2a0e0e", border: "1px solid #4a1a1a", borderRadius: "8px",
              padding: "0.7rem 1rem", color: "#e05252", fontSize: "0.83rem",
              marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "8px",
            }}>
              <span>✕</span> Failed to add bail record. Please try again.
            </div>
          )}

          <Field label="Court Name" hint="required">
            <input
              style={inputStyle}
              value={courtName}
              onChange={e => setCourtName(e.target.value)}
              placeholder="e.g. Dhaka Sessions Court"
            />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Bail Amount" hint="optional">
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute", left: "10px", top: "50%",
                  transform: "translateY(-50%)", color: "#5a6278", fontSize: "0.8rem", pointerEvents: "none",
                }}>৳</span>
                <input
                  style={{ ...inputStyle, paddingLeft: "1.6rem" }}
                  type="number"
                  min="0"
                  step="0.01"
                  value={bailAmount}
                  onChange={e => setBailAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </Field>
            <Field label="Granted On" hint="optional">
              <input
                style={inputStyle}
                type="date"
                value={grantedAt}
                onChange={e => setGrantedAt(e.target.value)}
              />
            </Field>
          </div>

          <Field label="Surety Name" hint="optional">
            <input
              style={inputStyle}
              value={suretyName}
              onChange={e => setSuretyName(e.target.value)}
              placeholder="Full name of surety"
            />
          </Field>

          <Field label="Status">
            <div style={{ position: "relative" }}>
              <select
                style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                value={status}
                onChange={e => setStatus(e.target.value)}
              >
                {bailStatusOptions.map(opt => (
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

          <div style={{ borderTop: "1px solid #1e2330", margin: "1.5rem 0" }} />

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
              {isPending ? "Saving…" : "Add Bail Record"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}