import addRankApi from "@/services/Rank/addRankApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const labelClass = "block text-[10px] tracking-[0.18em] uppercase text-slate-600 mb-2";
const inputClass =
  "w-full bg-slate-900/60 border border-slate-800 text-slate-300 placeholder-slate-700 px-4 py-3 text-sm outline-none focus:border-lime-400/30 hover:border-slate-700 transition-colors appearance-none";

export default function AddRank() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();    // fixed: was missing cache invalidation on success

  const [rankCode, setRankCode] = useState("");
  const [rankName, setRankName] = useState("");
  const [level, setLevel] = useState("");
  const [formError, setFormError] = useState("");

  const { mutate: addRank, isLoading: addRankLoading } = useMutation({
    mutationFn: (rankData) => addRankApi(rankData),
    onSuccess: () => {
      setRankCode("");
      setRankName("");
      setLevel("");
      setFormError("");
      queryClient.invalidateQueries(["ranks"]);
      navigate("/admin/dashboard/rankdashboard/rank-list");
    },
    onError: () => setFormError("Failed to add rank. Please try again."),
  });

  const handleAddRank = () => {
    setFormError("");
    if (!rankCode.trim() || !rankName.trim() || !level) {
      setFormError("All fields are required.");
      return;
    }
    if (isNaN(parseInt(level)) || parseInt(level) < 1) {
      setFormError("Level must be a positive integer (≥ 1).");
      return;
    }
    addRank({ rank_code: rankCode.trim().toUpperCase(), rank_name: rankName.trim(), level: parseInt(level) });
  };

  return (
    <div
      className="min-h-screen bg-[#080a0e] text-slate-300 px-6 py-10 md:px-10"
      style={{
        backgroundImage:
          "linear-gradient(rgba(132,204,22,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(132,204,22,0.025) 1px,transparent 1px)",
        backgroundSize: "40px 40px",
        fontFamily: "'IBM Plex Mono', monospace",
      }}
    >
      {/* ── Header ── */}
      <div className="mb-10">
        <span className="text-[10px] tracking-[0.22em] uppercase text-lime-400 bg-lime-400/10 border border-lime-400/20 px-3 py-1 inline-block mb-3">
          New Record
        </span>
        <h1
          className="text-4xl md:text-5xl font-black tracking-widest uppercase text-white leading-none"
          style={{ fontFamily: "'Rajdhani', sans-serif" }}
        >
          Add <span className="text-lime-400">Rank</span>
        </h1>
        <p className="text-[11px] text-slate-700 mt-2 tracking-widest">
          // Define a new rank tier in the hierarchy
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-lime-400/30 via-lime-400/10 to-transparent mb-10" />

      {/* ── Error ── */}
      {formError && (
        <div className="bg-red-500/8 border border-red-500/20 text-red-400 text-[12px] tracking-widest px-4 py-3 mb-6 max-w-xl">
          ⚠ {formError}
        </div>
      )}

      {/* ── Form ── */}
      <div className="max-w-xl flex flex-col gap-0">
        <div className="text-[10px] tracking-[0.22em] uppercase text-slate-700 pb-3 mb-5 border-b border-slate-800/80">
          // Rank Details
        </div>

        {/* Rank Code + Level side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelClass}>Rank Code *</label>
            <input
              className={inputClass}
              value={rankCode}
              onChange={(e) => setRankCode(e.target.value)}
              placeholder="e.g. IGP, DIG, SP"
              maxLength={10}
            />
            <p className="text-[10px] text-slate-700 mt-1.5">Max 10 characters, auto-uppercased</p>
          </div>
          <div>
            <label className={labelClass}>Level *</label>
            <input
              className={inputClass}
              type="number"
              min={1}
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              placeholder="e.g. 1, 2, 3..."
            />
            <p className="text-[10px] text-slate-700 mt-1.5">Must be unique and ≥ 1</p>
          </div>
        </div>

        <div className="mb-8">
          <label className={labelClass}>Rank Name *</label>
          <input
            className={inputClass}
            value={rankName}
            onChange={(e) => setRankName(e.target.value)}
            placeholder="e.g. Inspector General of Police"
          />
        </div>

        {/* ── Preview ── */}
        {(rankCode || rankName || level) && (
          <div className="bg-lime-400/5 border border-lime-400/15 px-5 py-4 mb-8 flex items-center gap-5">
            <div
              className="w-12 h-12 flex items-center justify-center text-lg font-black text-white bg-slate-800 border border-slate-700 flex-shrink-0"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              {level || "—"}
            </div>
            <div>
              <div className="text-[10px] text-slate-600 tracking-widest uppercase mb-1">Preview</div>
              <div
                className="text-white font-bold text-lg"
                style={{ fontFamily: "'Rajdhani', sans-serif" }}
              >
                {rankName || "Rank Name"}
              </div>
              <div className="text-[11px] text-lime-400 mt-0.5">
                {rankCode ? rankCode.toUpperCase() : "CODE"}
              </div>
            </div>
          </div>
        )}

        {/* ── Actions ── */}
        <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-slate-800">
          <button
            onClick={handleAddRank}
            disabled={addRankLoading}
            className="bg-lime-400 text-[#080a0e] px-8 py-3.5 text-[13px] font-black tracking-widest uppercase hover:bg-lime-300 hover:-translate-y-0.5 disabled:bg-lime-900 disabled:text-lime-700 disabled:translate-y-0 transition-all duration-150"
          >
            {addRankLoading ? "SAVING..." : "+ ADD RANK"}
          </button>
          <button
            onClick={() => navigate("/admin/dashboard/rankdashboard/rank-list")}
            className="border border-slate-800 text-slate-600 px-6 py-3.5 text-[13px] font-bold tracking-widest uppercase hover:border-slate-600 hover:text-slate-400 transition-all duration-150"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}