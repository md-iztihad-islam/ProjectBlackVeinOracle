import addCellApi from "@/services/Cell/addCellApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const labelClass = "block text-[10px] tracking-[0.18em] uppercase text-slate-400 mb-2";
const inputClass =
  "w-full bg-slate-900/70 border border-slate-700 text-slate-100 placeholder-slate-500 px-4 py-3 text-sm outline-none focus:border-blue-400/40 hover:border-slate-500 transition-colors appearance-none rounded-xl";
const hintClass = "text-[10px] text-slate-500 mt-1.5";

const statusOptions = [
  { value: "available", label: "Available", color: "text-emerald-400" },
  { value: "maintenance", label: "Maintenance", color: "text-red-400" },
];

export default function AddCell() {
  const navigate = useNavigate();
  const { blockId } = useParams();
  const cellBlockId = blockId;
  const queryClient = useQueryClient();

  const [cellNumber,     setCellNumber]     = useState("");
  const [capacity,       setCapacity]       = useState("");
  const [status,         setStatus]         = useState("available");
  const [formError,      setFormError]      = useState("");

  const { mutate: addCell, isLoading: addCellLoading } = useMutation({
    mutationFn: (cellData) => addCellApi(cellData),
    onSuccess: () => {
      queryClient.invalidateQueries(["cellData", cellBlockId]);
      setCellNumber("");
      setCapacity("");
      setStatus("available");
      setFormError("");
      navigate(-1);
    },
    onError: () => setFormError("Failed to add cell. Please try again."),
  });

  const handleAddCell = () => {
    setFormError("");
    if (!cellNumber.trim() || !capacity) {
      setFormError("Cell number and capacity are required.");
      return;
    }
    if (isNaN(parseInt(capacity)) || parseInt(capacity) < 1) {
      setFormError("Capacity must be a positive integer (≥ 1).");
      return;
    }
    addCell({
      block_id: cellBlockId,
      cell_number: cellNumber.trim(),
      capacity: parseInt(capacity),
      status,
    });
  };

  const selectedStatus = statusOptions.find((s) => s.value === status);
  return (
    <div
      className="min-h-screen bg-[#080a0e] text-slate-300 px-6 py-10 md:px-10"
      style={{
        backgroundImage:
          "linear-gradient(rgba(96,165,250,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(96,165,250,0.025) 1px,transparent 1px)",
        backgroundSize: "40px 40px",
        fontFamily: "'IBM Plex Mono', monospace",
      }}
    >
      <div className="max-w-5xl mx-auto">
      <div className="mb-6 flex items-center justify-between gap-3">
        <button
          onClick={() => navigate(-1)}
          className="rounded-xl border border-slate-600 bg-slate-900/70 text-slate-100 px-4 py-2 text-[11px] font-black tracking-widest uppercase hover:border-blue-400/50 hover:text-blue-300 hover:bg-slate-800/80 transition-all"
        >
          ← Back
        </button>
      </div>

      {/* ── Header ── */}
      <div className="mb-10">
        <span className="text-[10px] tracking-[0.22em] uppercase text-blue-400 bg-blue-400/10 border border-blue-400/20 px-3 py-1 inline-block mb-3">
          New Record · Block <span className="text-white">{cellBlockId}</span>
        </span>
        <h1
          className="text-4xl md:text-5xl font-black tracking-widest uppercase text-white leading-none"
          style={{ fontFamily: "'Rajdhani', sans-serif" }}
        >
          Add <span className="text-blue-400">Cell</span>
        </h1>
        <p className="text-[11px] text-slate-500 mt-2 tracking-widest">
          // Register a new cell in the block
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-blue-400/30 via-blue-400/10 to-transparent mb-10" />

      {/* ── Error ── */}
      {formError && (
        <div className="bg-red-500/8 border border-red-500/20 text-red-400 text-[12px] tracking-widest px-4 py-3 mb-6 max-w-xl">
          ⚠ {formError}
        </div>
      )}

      <div className="max-w-2xl flex flex-col gap-0">
        <div className="text-[10px] tracking-[0.22em] uppercase text-slate-500 pb-3 mb-5 border-b border-slate-700/80">
          // Cell Details
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelClass}>Cell Number *</label>
            <input
              className={inputClass}
              value={cellNumber}
              onChange={(e) => setCellNumber(e.target.value)}
              placeholder="e.g. A-101"
            />
            <p className={hintClass}>Must be unique within the block</p>
          </div>
          <div>
            <label className={labelClass}>Capacity *</label>
            <input
              className={inputClass}
              type="number"
              min={1}
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="e.g. 4"
            />
            <p className={hintClass}>Max occupants allowed</p>
          </div>
        </div>

        <div className="mb-8">
          <label className={labelClass}>Status *</label>
            <div className="grid grid-cols-2 gap-2">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatus(opt.value)}
                className={`py-3 text-[11px] font-bold tracking-widest uppercase border transition-all duration-150 ${
                  status === opt.value
                    ? `border-blue-400/40 bg-blue-400/10 ${opt.color}`
                    : "rounded-xl border-slate-700 text-slate-300 hover:border-slate-500 hover:text-slate-100"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Preview ── */}
        {cellNumber && (
          <div className="bg-blue-400/5 border border-blue-400/15 px-5 py-4 mb-8 flex items-center gap-5">
            <div
              className="w-12 h-12 flex items-center justify-center text-base font-black text-blue-400 bg-slate-800 border border-slate-700 flex-shrink-0"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              {cellNumber}
            </div>
            <div>
              <div className="text-[10px] text-slate-500 tracking-widest uppercase mb-1">Preview</div>
              <div className="text-white font-bold text-lg" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                Cell {cellNumber}
              </div>
              <div className={`text-[11px] mt-0.5 ${selectedStatus?.color}`}>
                {selectedStatus?.label} · Cap: {capacity || "—"} · People: System controlled
              </div>
            </div>
          </div>
        )}

        {/* ── Actions ── */}
        <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-slate-700">
          <button
            onClick={handleAddCell}
            disabled={addCellLoading}
            className="rounded-xl bg-blue-400 text-[#080a0e] px-8 py-3.5 text-[13px] font-black tracking-widest uppercase hover:bg-blue-300 hover:-translate-y-0.5 disabled:bg-blue-900 disabled:text-blue-700 disabled:translate-y-0 transition-all duration-150"
          >
            {addCellLoading ? "SAVING..." : "+ ADD CELL"}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="rounded-xl border border-slate-600 bg-slate-900/70 text-slate-100 px-6 py-3.5 text-[13px] font-bold tracking-widest uppercase hover:border-blue-400/40 hover:text-blue-300 transition-all duration-150"
          >
            CANCEL
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}