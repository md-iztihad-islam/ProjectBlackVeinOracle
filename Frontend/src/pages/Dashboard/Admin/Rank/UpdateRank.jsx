import getRankByIdApi from "@/services/Rank/getRankByIdApi";
import updateRankApi from "@/services/Rank/updateRankApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const labelClass =
  "block text-[10px] tracking-[0.18em] uppercase text-slate-600 mb-2 flex items-center gap-2";

export default function UpdateRank() {
  const navigate = useNavigate();
  const { rankId } = useParams();
  const queryClient = useQueryClient();

  const [rankCode, setRankCode] = useState("");
  const [rankName, setRankName] = useState("");
  const [level, setLevel] = useState("");
  const [original, setOriginal] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [formError, setFormError] = useState("");

  const { data: rankData, isLoading: rankLoading } = useQuery({
    queryKey: ["rank", rankId],
    queryFn: () => getRankByIdApi(rankId),
    cacheTime: 5 * 60 * 1000,
    staleTime: 5 * 60 * 1000,         // fixed typo: statleTime → staleTime
    enabled: !!rankId,
  });

  // fixed: was using useState(rank?.x) which runs before data loads — must use useEffect
  useEffect(() => {
    const r = rankData?.data;
    if (r) {
      setRankCode(r.rank_code || "");
      setRankName(r.rank_name || "");
      setLevel(String(r.level || ""));
      setOriginal({ rank_code: r.rank_code, rank_name: r.rank_name, level: String(r.level) });
    }
  }, [rankData]);

  const isChanged = (field, val) =>
    original[field] !== undefined && original[field] !== val;

  const inputClass = (changed) =>
    `w-full bg-slate-900/60 border text-slate-300 placeholder-slate-700 px-4 py-3 text-sm outline-none transition-colors appearance-none ` +
    (changed
      ? "border-violet-400/40 focus:border-violet-400/60"
      : "border-slate-800 hover:border-slate-700 focus:border-violet-400/20");

  const { mutate: updateRank, isLoading: updateRankLoading } = useMutation({
    mutationFn: ({ rankId, updatedData }) => updateRankApi({ rankId, updatedData }),
    onSuccess: () => {
      setFormError("");
      setShowToast(true);
      queryClient.invalidateQueries(["rank", rankId]);
      queryClient.invalidateQueries(["ranks"]);
      setTimeout(() => setShowToast(false), 3000);
    },
    onError: () => setFormError("Failed to update rank. Please try again."),
  });

  const handleUpdateRank = () => {
    setFormError("");
    if (!rankCode.trim() || !rankName.trim() || !level) {
      setFormError("All fields are required.");
      return;
    }
    if (isNaN(parseInt(level)) || parseInt(level) < 1) {
      setFormError("Level must be a positive integer (≥ 1).");
      return;
    }
    updateRank({
      rankId,
      updatedData: {
        rank_code: rankCode.trim().toUpperCase(),
        rank_name: rankName.trim(),
        level: parseInt(level),
      },
    });
  };

  return (
    <div
      className="min-h-screen bg-[#080a0e] text-slate-300 px-6 py-10 md:px-10"
      style={{
        backgroundImage:
          "linear-gradient(rgba(167,139,250,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(167,139,250,0.025) 1px,transparent 1px)",
        backgroundSize: "40px 40px",
        fontFamily: "'IBM Plex Mono', monospace",
      }}
    >
      {/* ── Toast ── */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#0e1218] border border-lime-400/30 text-lime-400 text-[11px] tracking-widest px-5 py-3">
          ✓ RANK UPDATED SUCCESSFULLY
        </div>
      )}

      {/* ── Header ── */}
      <div className="mb-10">
        <span className="text-[10px] tracking-[0.22em] uppercase text-violet-400 bg-violet-400/10 border border-violet-400/20 px-3 py-1 inline-block mb-3">
          Edit Record
        </span>
        <h1
          className="text-4xl md:text-5xl font-black tracking-widest uppercase text-white leading-none"
          style={{ fontFamily: "'Rajdhani', sans-serif" }}
        >
          Update <span className="text-violet-400">Rank</span>
        </h1>
        <p className="text-[11px] text-slate-700 mt-2 tracking-widest">
          // Modify existing rank tier details
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-violet-400/30 via-violet-400/10 to-transparent mb-10" />

      {rankLoading ? (
        <div className="flex flex-col items-center py-24 gap-4 text-slate-700 text-[12px] tracking-widest">
          <div className="w-8 h-8 border-2 border-slate-800 border-t-violet-400 rounded-full animate-spin" />
          LOADING RANK DATA...
        </div>
      ) : (
        <>
          {/* ── Meta bar ── */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 bg-violet-400/5 border border-violet-400/12 px-4 py-3 mb-8 max-w-xl">
            <div>
              <span className="text-[10px] text-slate-700 tracking-widest uppercase mr-2">Rank ID</span>
              <span className="text-violet-400 text-[12px]">{rankId}</span>
            </div>
            <div className="w-px h-4 bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-700 tracking-widest uppercase mr-2">Current Level</span>
              <span className="text-violet-400 text-[12px]">{original.level || "—"}</span>
            </div>
          </div>

          {formError && (
            <div className="bg-red-500/8 border border-red-500/20 text-red-400 text-[12px] tracking-widest px-4 py-3 mb-6 max-w-xl">
              ⚠ {formError}
            </div>
          )}

          <div className="max-w-xl">
            <div className="text-[10px] tracking-[0.22em] uppercase text-slate-700 pb-3 mb-5 border-b border-slate-800/80">
              // Rank Details
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelClass}>
                  Rank Code
                  {isChanged("rank_code", rankCode) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                  )}
                </label>
                <input
                  className={inputClass(isChanged("rank_code", rankCode))}
                  value={rankCode}
                  onChange={(e) => setRankCode(e.target.value)}
                  maxLength={10}
                />
              </div>
              <div>
                <label className={labelClass}>
                  Level
                  {isChanged("level", level) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                  )}
                </label>
                <input
                  className={inputClass(isChanged("level", level))}
                  type="number"
                  min={1}
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-8">
              <label className={labelClass}>
                Rank Name
                {isChanged("rank_name", rankName) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                )}
              </label>
              <input
                className={inputClass(isChanged("rank_name", rankName))}
                value={rankName}
                onChange={(e) => setRankName(e.target.value)}
              />
            </div>

            {/* ── Actions ── */}
            <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-slate-800">
              <button
                onClick={handleUpdateRank}
                disabled={updateRankLoading}
                className="bg-violet-500 text-white px-8 py-3.5 text-[13px] font-black tracking-widest uppercase hover:bg-violet-400 hover:-translate-y-0.5 disabled:bg-violet-950 disabled:text-violet-800 disabled:translate-y-0 transition-all duration-150"
              >
                {updateRankLoading ? "SAVING..." : "SAVE CHANGES"}
              </button>
              <button
                onClick={() => navigate("/admin/dashboard/rankdashboard/rank-list")}
                className="border border-slate-800 text-slate-600 px-6 py-3.5 text-[13px] font-bold tracking-widest uppercase hover:border-slate-600 hover:text-slate-400 transition-all duration-150"
              >
                CANCEL
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}