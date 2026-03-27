import getOfficerByIdApi from "@/services/Officer/getOfficerByIdApi";
import updateOfficerApi from "@/services/Officer/updateOfficerApi";
import getRankByIdApi from "@/services/Rank/getRankByIdApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function AssignRank() {
  const navigate = useNavigate();
  const { rankId } = useParams();
  const queryClient = useQueryClient();

  const [officerId, setOfficerId] = useState("");
  const [officerIdInput, setOfficerIdInput] = useState("");  // controlled input, separate from query key
  const [showToast, setShowToast] = useState(false);
  const [assignError, setAssignError] = useState("");

  // ── Rank query ──
  const { data: rankData, isLoading: rankLoading } = useQuery({
    queryKey: ["rank", rankId],
    queryFn: () => getRankByIdApi(rankId),
    cacheTime: 5 * 60 * 1000,
    staleTime: 5 * 60 * 1000,          // fixed typo: statleTime → staleTime
    enabled: !!rankId,
  });

  const rank = rankData?.data;

  // ── Officer query — only fires when officerId is committed (on Search click) ──
  // fixed: original had no enabled guard so it queried on every keystroke with empty string
  const { data: officerData, isLoading: officerLoading, error: officerError } = useQuery({
    queryKey: ["officer", officerId],
    queryFn: () => getOfficerByIdApi(officerId),
    cacheTime: 5 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    enabled: !!officerId,
    retry: 1,
  });

  const officer = officerData?.data;

  // ── Mutation ──
  const { mutate: assignRank, isLoading: assignRankLoading } = useMutation({
    mutationFn: ({ officerId, updatedData }) => updateOfficerApi({ officerId, updatedData }),
    onSuccess: () => {
      setAssignError("");
      setShowToast(true);
      queryClient.invalidateQueries(["officer", officerId]);
      setTimeout(() => setShowToast(false), 3000);
    },
    onError: () => setAssignError("Failed to assign rank. Please try again."),
  });

  const handleSearch = () => {
    if (!officerIdInput.trim()) return;
    setOfficerId(officerIdInput.trim());
  };

  const handleAssignRank = () => {
    setAssignError("");
    if (!officer) { setAssignError("No officer loaded. Please search first."); return; }
    assignRank({
      officerId,
      updatedData: { ...officer, rank_code: rankId },
    });
  };

  return (
    <div
      className="min-h-screen bg-[#080a0e] text-slate-300 px-6 py-10 md:px-10"
      style={{
        backgroundImage:
          "linear-gradient(rgba(251,191,36,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(251,191,36,0.025) 1px,transparent 1px)",
        backgroundSize: "40px 40px",
        fontFamily: "'IBM Plex Mono', monospace",
      }}
    >
      {/* ── Toast ── */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#0e1218] border border-lime-400/30 text-lime-400 text-[11px] tracking-widest px-5 py-3">
          ✓ RANK ASSIGNED SUCCESSFULLY
        </div>
      )}

      {/* ── Header ── */}
      <div className="mb-10">
        <span className="text-[10px] tracking-[0.22em] uppercase text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 inline-block mb-3">
          Assignment
        </span>
        <h1
          className="text-4xl md:text-5xl font-black tracking-widest uppercase text-white leading-none"
          style={{ fontFamily: "'Rajdhani', sans-serif" }}
        >
          Assign <span className="text-amber-400">Rank</span>
        </h1>
        <p className="text-[11px] text-slate-700 mt-2 tracking-widest">
          // Assign this rank tier to an officer
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-amber-400/30 via-amber-400/10 to-transparent mb-10" />

      {rankLoading ? (
        <div className="flex flex-col items-center py-24 gap-4 text-slate-700 text-[12px] tracking-widest">
          <div className="w-8 h-8 border-2 border-slate-800 border-t-amber-400 rounded-full animate-spin" />
          LOADING RANK DATA...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 max-w-4xl">

          {/* ── Left: Officer search ── */}
          <div className="flex flex-col gap-5">

            {/* Rank info card */}
            {rank && (
              <div className="bg-amber-400/5 border border-amber-400/20 px-5 py-4 flex items-center gap-5">
                <div
                  className="w-14 h-14 flex items-center justify-center text-2xl font-black text-white bg-slate-800 border-2 border-amber-400/30 flex-shrink-0"
                  style={{ fontFamily: "'Rajdhani', sans-serif" }}
                >
                  {rank.level}
                </div>
                <div>
                  <div className="text-[10px] text-slate-600 tracking-widest uppercase mb-1">Assigning Rank</div>
                  <div
                    className="text-white font-black text-xl tracking-wide"
                    style={{ fontFamily: "'Rajdhani', sans-serif" }}
                  >
                    {rank.rank_name}
                  </div>
                  <div className="text-amber-400 text-[11px] mt-0.5">{rank.rank_code}</div>
                </div>
              </div>
            )}

            {/* Officer ID search */}
            <div>
              <div className="text-[10px] tracking-[0.22em] uppercase text-slate-700 pb-3 mb-4 border-b border-slate-800/80">
                // Search Officer
              </div>
              <div className="flex gap-3">
                <input
                  className="flex-1 bg-slate-900/60 border border-slate-800 text-slate-300 placeholder-slate-700 px-4 py-3 text-sm outline-none focus:border-amber-400/30 hover:border-slate-700 transition-colors"
                  placeholder="Enter Officer ID (e.g. OFC-0000001)"
                  value={officerIdInput}
                  onChange={(e) => setOfficerIdInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  disabled={!officerIdInput.trim()}
                  className="bg-amber-400 text-[#080a0e] px-5 py-3 text-[12px] font-black tracking-widest uppercase hover:bg-amber-300 disabled:bg-amber-900 disabled:text-amber-700 transition-all duration-150"
                >
                  SEARCH
                </button>
              </div>
            </div>

            {/* Officer loading */}
            {officerLoading && (
              <div className="flex items-center gap-3 py-6 text-slate-700 text-[12px] tracking-widest">
                <div className="w-5 h-5 border-2 border-slate-800 border-t-amber-400 rounded-full animate-spin" />
                SEARCHING OFFICER...
              </div>
            )}

            {/* Officer not found */}
            {officerError && officerId && (
              <div className="bg-red-500/8 border border-red-500/20 text-red-400 text-[12px] tracking-widest px-4 py-3">
                ⚠ Officer not found. Please check the ID.
              </div>
            )}

            {/* Officer card */}
            {officer && !officerLoading && (
              <div className="bg-slate-900/60 border border-slate-800">
                <div className="px-5 py-3.5 border-b border-slate-800 text-[10px] text-slate-600 tracking-widest uppercase">
                  Officer Found
                </div>
                <div className="p-5">
                  {/* Officer name + avatar */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-amber-400/30 flex items-center justify-center font-black text-white text-base flex-shrink-0"
                      style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                      {officer.officer_name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?"}
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                        {officer.officer_name}
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5">{officer.officer_id}</div>
                    </div>
                  </div>

                  {/* Officer details */}
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                    {[
                      { label: "Thana", value: officer.thana_id },
                      { label: "Current Rank", value: officer.rank_id || "Unranked" },
                      { label: "Phone", value: officer.phone },
                      { label: "Email", value: officer.email },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <div className="text-[10px] text-slate-700 tracking-widest uppercase mb-0.5">{label}</div>
                        <div className={`text-[12px] ${label === "Current Rank" ? "text-amber-400" : "text-slate-400"} truncate`}>
                          {value || "—"}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Assign error */}
                  {assignError && (
                    <div className="mt-4 bg-red-500/8 border border-red-500/20 text-red-400 text-[12px] tracking-widest px-4 py-3">
                      ⚠ {assignError}
                    </div>
                  )}

                  {/* Assign button */}
                  <button
                    onClick={handleAssignRank}
                    disabled={assignRankLoading}
                    className="mt-5 w-full bg-amber-400 text-[#080a0e] py-3.5 text-[12px] font-black tracking-widest uppercase hover:bg-amber-300 hover:-translate-y-0.5 disabled:bg-amber-900 disabled:text-amber-700 disabled:translate-y-0 transition-all duration-150"
                  >
                    {assignRankLoading ? "ASSIGNING..." : `⭐ ASSIGN ${rank?.rank_name?.toUpperCase() || "RANK"}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Side panel ── */}
          <div className="flex flex-col gap-4">
            <div className="bg-slate-900/40 border border-slate-800 p-5">
              <div className="text-[10px] tracking-[0.18em] uppercase text-slate-600 mb-4">Instructions</div>
              <ol className="flex flex-col gap-3">
                {[
                  "Enter the Officer ID in the search field",
                  "Click SEARCH to load officer details",
                  "Review the officer's current rank",
                  "Click ASSIGN to apply this rank",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="w-5 h-5 flex-shrink-0 flex items-center justify-center text-[10px] font-black text-amber-400 bg-amber-400/10 border border-amber-400/20 mt-0.5"
                    >
                      {i + 1}
                    </span>
                    <span className="text-[12px] text-slate-500 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <button
              onClick={() => navigate("/admin/dashboard/rankdashboard/rank-list")}
              className="w-full border border-slate-800 text-slate-600 py-3 text-[12px] font-bold tracking-widest uppercase hover:border-slate-600 hover:text-slate-400 transition-all duration-150"
            >
              ← BACK TO LIST
            </button>
          </div>
        </div>
      )}
    </div>
  );
}