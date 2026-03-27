import getCellByIdApi from "@/services/Cell/getCellByIdApi";
import updateCellApi from "@/services/Cell/updateCellApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const labelClass = "block text-[10px] tracking-[0.18em] uppercase text-slate-600 mb-2";
const inputClass =
  "w-full bg-slate-900/60 border border-slate-800 text-slate-300 placeholder-slate-700 px-4 py-3 text-sm outline-none focus:border-blue-400/30 hover:border-slate-700 transition-colors appearance-none";
const hintClass = "text-[10px] text-slate-700 mt-1.5";

const statusOptions = [
  { value: "available",   label: "Available",   color: "text-emerald-400" },
  { value: "occupied",    label: "Occupied",    color: "text-amber-400"   },
  { value: "maintenance", label: "Maintenance", color: "text-red-400"     },
];

export default function UpdateCell() {
  const navigate = useNavigate();
  const { cellId } = useParams();
  const queryClient = useQueryClient();

  const { data: cellData, isLoading: cellDataLoading, error: cellDataError } = useQuery({
    queryKey: ["cellById", cellId],
    queryFn: () => getCellByIdApi(cellId),
    enabled: !!cellId,
  });

  const cell = cellData?.data || null;

  const [cellNumber,     setCellNumber]     = useState("");
  const [capacity,       setCapacity]       = useState("");
  const [status,         setStatus]         = useState("available");
  const [numberOfPeople, setNumberOfPeople] = useState("");
  const [formError,      setFormError]      = useState("");

  useEffect(() => {
    if (cell) {
      setCellNumber(cell.cell_number || "");
      setCapacity(cell.capacity?.toString() || "");
      setStatus(cell.status || "available");
      setNumberOfPeople(cell.number_of_people?.toString() || "0");
    }
  }, [cell?.cell_id]);

  const { mutate: updateCell, isLoading: updateCellLoading } = useMutation({
    mutationFn: ({ cellId, cellData }) => updateCellApi({ cellId, cellData }),
    onSuccess: () => {
      queryClient.invalidateQueries(["cellData"]);
      queryClient.invalidateQueries(["cellById", cellId]);
      navigate(-1);
    },
    onError: () => setFormError("Failed to update cell. Please try again."),
  });

  const handleUpdate = () => {
    setFormError("");
    if (!cellNumber.trim() || !capacity) {
      setFormError("Cell number and capacity are required.");
      return;
    }
    if (isNaN(parseInt(capacity)) || parseInt(capacity) < 1) {
      setFormError("Capacity must be a positive integer (≥ 1).");
      return;
    }
    const people = parseInt(numberOfPeople) || 0;
    if (people < 0 || people > parseInt(capacity)) {
      setFormError("Number of people cannot exceed capacity or be negative.");
      return;
    }
    updateCell({
      cellId,
      cellData: {
        cell_number: cellNumber.trim(),
        capacity: parseInt(capacity),
        status,
        number_of_people: people,
      },
    });
  };

  const selectedStatus = statusOptions.find((s) => s.value === status);
  const occupancyPct = capacity && numberOfPeople
    ? Math.min(100, Math.round((parseInt(numberOfPeople) / parseInt(capacity)) * 100))
    : 0;

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
      {/* ── Header ── */}
      <div className="mb-10">
        <span className="text-[10px] tracking-[0.22em] uppercase text-blue-400 bg-blue-400/10 border border-blue-400/20 px-3 py-1 inline-block mb-3">
          Edit Record · <span className="text-white">{cellId}</span>
        </span>
        <h1
          className="text-4xl md:text-5xl font-black tracking-widest uppercase text-white leading-none"
          style={{ fontFamily: "'Rajdhani', sans-serif" }}
        >
          Update <span className="text-blue-400">Cell</span>
        </h1>
        <p className="text-[11px] text-slate-700 mt-2 tracking-widest">
          // Modify an existing cell record
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-blue-400/30 via-blue-400/10 to-transparent mb-10" />

      {/* ── Loading ── */}
      {cellDataLoading && (
        <div className="flex items-center gap-3 py-16 text-slate-700 text-[11px] tracking-widest">
          <div className="w-4 h-4 border border-slate-700 border-t-blue-400 rounded-full animate-spin" />
          LOADING CELL DATA...
        </div>
      )}

      {/* ── Fetch Error ── */}
      {cellDataError && (
        <div className="bg-red-500/8 border border-red-500/20 text-red-400 text-[12px] tracking-widest px-4 py-3 mb-6 max-w-xl">
          ⚠ Failed to load cell data. Please go back and try again.
        </div>
      )}

      {/* ── Form Error ── */}
      {formError && (
        <div className="bg-red-500/8 border border-red-500/20 text-red-400 text-[12px] tracking-widest px-4 py-3 mb-6 max-w-xl">
          ⚠ {formError}
        </div>
      )}

      {!cellDataLoading && !cellDataError && (
        <div className="max-w-xl flex flex-col gap-0">
          <div className="text-[10px] tracking-[0.22em] uppercase text-slate-700 pb-3 mb-5 border-b border-slate-800/80">
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
            </div>
          </div>

          <div className="mb-4">
            <label className={labelClass}>Number of People</label>
            <input
              className={inputClass}
              type="number"
              min={0}
              value={numberOfPeople}
              onChange={(e) => setNumberOfPeople(e.target.value)}
              placeholder="e.g. 2"
            />
            {capacity && numberOfPeople !== "" && (
              <div className="mt-2">
                <div className="flex justify-between text-[10px] text-slate-700 mb-1">
                  <span>Occupancy</span>
                  <span className="text-blue-400">{occupancyPct}%</span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-400 rounded-full transition-all duration-300"
                    style={{ width: `${occupancyPct}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mb-8">
            <label className={labelClass}>Status *</label>
            <div className="grid grid-cols-3 gap-2">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value)}
                  className={`py-3 text-[11px] font-bold tracking-widest uppercase border transition-all duration-150 ${
                    status === opt.value
                      ? `border-blue-400/40 bg-blue-400/10 ${opt.color}`
                      : "border-slate-800 text-slate-600 hover:border-slate-700 hover:text-slate-500"
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
                <div className="text-[10px] text-slate-600 tracking-widest uppercase mb-1">Preview</div>
                <div className="text-white font-bold text-lg" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                  Cell {cellNumber}
                </div>
                <div className={`text-[11px] mt-0.5 ${selectedStatus?.color}`}>
                  {selectedStatus?.label} · Cap: {capacity || "—"} · People: {numberOfPeople || 0}
                </div>
              </div>
            </div>
          )}

          {/* ── Actions ── */}
          <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-slate-800">
            <button
              onClick={handleUpdate}
              disabled={updateCellLoading}
              className="bg-blue-400 text-[#080a0e] px-8 py-3.5 text-[13px] font-black tracking-widest uppercase hover:bg-blue-300 hover:-translate-y-0.5 disabled:bg-blue-900 disabled:text-blue-700 disabled:translate-y-0 transition-all duration-150"
            >
              {updateCellLoading ? "SAVING..." : "SAVE CHANGES"}
            </button>
            <button
              onClick={() => navigate(-1)}
              className="border border-slate-800 text-slate-600 px-6 py-3.5 text-[13px] font-bold tracking-widest uppercase hover:border-slate-600 hover:text-slate-400 transition-all duration-150"
            >
              CANCEL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}