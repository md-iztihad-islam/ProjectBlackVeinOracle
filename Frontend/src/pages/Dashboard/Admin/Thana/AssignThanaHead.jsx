import getOfficerByThanaApi from "@/services/Officer/getOfficerByThanaApi";
import getThanaByThanaIdApi from "@/services/Thana/getThanaByThanaIdApi";
import updateThanaApi from "@/services/Thana/updateThanaApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function AssignThanaHead() {
  const { thana_id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const navigateWithModal = (to) => {
    const isModal = Boolean(location.state?.modal);
    const backgroundLocation = location.state?.backgroundLocation || location;
    navigate(to, isModal ? { state: { modal: true, backgroundLocation } } : undefined);
  };

  const [selectedOfficerId, setSelectedOfficerId] = useState(null);
  const [search, setSearch] = useState("");
  const [showToast, setShowToast] = useState(false);

  /* ── Queries ── */
  const { data: thanaData, isLoading: thanaLoading } = useQuery({
    queryKey: ["thanaDetails", thana_id],
    queryFn: () => getThanaByThanaIdApi(thana_id),
    enabled: !!thana_id,
  });

  const { data: officersData, isLoading: officersLoading } = useQuery({
    queryKey: ["officersByThana", thana_id],
    queryFn: () => getOfficerByThanaApi(thana_id),
    enabled: !!thana_id,
  });

  const thanaDetails = thanaData?.data || null;
  const officersList = officersData?.data || [];

  console.log("Thana details:", thanaDetails);
  console.log("Officers in thana:", officersList);

  const filteredOfficers = officersList.filter((o) =>
    [o.officer_name, o.officer_id, o.rank].some((f) =>
      f?.toLowerCase().includes(search.toLowerCase())
    )
  );

  /* ── Mutation ── */
  const { mutate: updateThanaMutation, isLoading: updateLoading } = useMutation({
    mutationFn: ({ thanaId, thanaData }) => updateThanaApi({thanaId, thanaData}),
    onSuccess: () => {
      queryClient.invalidateQueries(["thanaDetails", thana_id]);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    },
    onError: () => alert("Failed to assign head. Please try again."),
  });

  const handleAssign = () => {
    if (!selectedOfficerId) return;
    const thanaData = {
        ...thanaDetails,
        head_officer_id: selectedOfficerId,
    }

    console.log("Assigning officer ID:", selectedOfficerId, "to thana ID:", thana_id);
    updateThanaMutation({ thanaId: thana_id, thanaData });
  };

  const initials = (name) =>
    name
      ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
      : "?";

  const isLoading = thanaLoading || officersLoading;

  return (
    <div
      className="min-h-screen bg-[#080a0e] text-slate-300 px-6 py-10 md:px-10"
      style={{
        backgroundImage:
          "linear-gradient(rgba(251,146,60,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(251,146,60,0.025) 1px,transparent 1px)",
        backgroundSize: "40px 40px",
        fontFamily: "'IBM Plex Mono', monospace",
      }}
    >
      {/* ── Toast ── */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#0e1218] border border-lime-400/30 text-lime-400 text-[11px] tracking-widest px-5 py-3">
          ✓ HEAD OFFICER ASSIGNED
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
          Assign <span className="text-amber-400">Thana Head</span>
        </h1>
        <p className="text-[11px] text-slate-700 mt-2 tracking-widest">// Designate the commanding officer for this station</p>
      </div>

      <div className="h-px bg-gradient-to-r from-amber-400/30 via-amber-400/10 to-transparent mb-10" />

      {isLoading ? (
        <div className="flex flex-col items-center py-24 gap-4 text-slate-700 text-[12px] tracking-widest">
          <div className="w-8 h-8 border-2 border-slate-800 border-t-amber-400 rounded-full animate-spin" />
          LOADING DATA...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 max-w-4xl">

          {/* ── Officer selector ── */}
          <div className="bg-slate-900/40 border border-slate-800">
            {/* Panel head */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <span className="text-[10px] tracking-[0.18em] uppercase text-slate-600">Select Officer</span>
              <span className="text-[10px] text-slate-700 bg-slate-800/80 px-2 py-0.5">
                {filteredOfficers.length} officers
              </span>
            </div>

            {/* Search */}
            <div className="p-3 border-b border-slate-800">
              <input
                className="w-full bg-[#080a0e] border border-slate-800 text-slate-300 placeholder-slate-700 px-3 py-2 text-[12px] outline-none focus:border-amber-400/25 transition-colors"
                placeholder="Search officer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Officer list */}
            <div className="max-h-[400px] overflow-y-auto">
              {filteredOfficers.length === 0 ? (
                <div className="py-12 text-center text-[11px] text-slate-700 tracking-widest">NO OFFICERS FOUND</div>
              ) : (
                filteredOfficers.map((officer) => {
                  const isSelected = selectedOfficerId === officer.officer_id;
                  const isCurrent = thanaDetails?.head_officer_id === officer.officer_id;
                  return (
                    <div
                      key={officer.officer_id}
                      onClick={() => setSelectedOfficerId(officer.officer_id)}
                      className={`
                        flex items-center gap-4 px-5 py-4 border-b border-slate-900 cursor-pointer transition-colors duration-150 relative
                        ${isSelected ? "bg-amber-400/8" : "hover:bg-white/[0.015]"}
                      `}
                    >
                      {/* Selected indicator bar */}
                      {isSelected && (
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-amber-400" />
                      )}

                      {/* Avatar */}
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0
                        border-2 transition-colors duration-150
                        ${isSelected
                          ? "bg-amber-400/15 border-amber-400 text-amber-400"
                          : "bg-slate-800 border-slate-700 text-slate-500"
                        }
                      `}>
                        {initials(officer.officer_name)}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div
                          className="text-white text-[15px] font-bold tracking-wide truncate"
                          style={{ fontFamily: "'Rajdhani', sans-serif" }}
                        >
                          {officer.officer_name}
                        </div>
                        <div className="text-[10px] text-slate-600 mt-0.5">{officer.officer_id}</div>
                      </div>

                      {/* Rank & current badge */}
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        {officer.rank && (
                          <span className="text-[10px] px-2 py-0.5 bg-amber-400/8 border border-amber-400/15 text-amber-400 uppercase tracking-wider">
                            {officer.rank}
                          </span>
                        )}
                        {isCurrent && (
                          <span className="text-[10px] text-lime-400 tracking-wider">CURRENT</span>
                        )}
                      </div>

                      {/* Check */}
                      {isSelected && (
                        <span className="text-amber-400 text-base ml-2">✓</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ── Side panel: Thana info + action ── */}
          <div className="flex flex-col gap-4">

            {/* Thana summary card */}
            {thanaDetails && (
              <div className="bg-slate-900/40 border border-slate-800 p-5">
                <div className="text-[10px] tracking-[0.18em] uppercase text-slate-600 mb-4">Station Info</div>

                <div
                  className="text-2xl font-black text-white tracking-wide mb-4"
                  style={{ fontFamily: "'Rajdhani', sans-serif" }}
                >
                  {thanaDetails.thana_name}
                </div>

                {[
                  { label: "ID", value: thanaDetails.thana_id },
                  { label: "District", value: thanaDetails.district },
                  { label: "Zone", value: thanaDetails.zone },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-2 border-b border-slate-800/60 last:border-0">
                    <span className="text-[10px] tracking-widest uppercase text-slate-600">{label}</span>
                    <span className="text-[12px] text-slate-400">{value}</span>
                  </div>
                ))}

                <div className="mt-4 pt-4 border-t border-slate-800">
                  <div className="text-[10px] tracking-widest uppercase text-slate-600 mb-1.5">Current Head</div>
                  {thanaDetails.head_officer_id ? (
                    <span className="text-[11px] text-amber-400 bg-amber-400/8 border border-amber-400/15 px-2 py-1 inline-block">
                      {thanaDetails.head_officer_id}
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-700">UNASSIGNED</span>
                  )}
                </div>
              </div>
            )}

            {/* Selected officer preview */}
            {selectedOfficerId && (
              <div className="bg-amber-400/5 border border-amber-400/20 p-4">
                <div className="text-[10px] tracking-widest uppercase text-amber-400/60 mb-2">To be assigned</div>
                <div className="text-amber-400 text-[13px] font-bold">
                  {officersList.find((o) => o.officer_id === selectedOfficerId)?.officer_name || selectedOfficerId}
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">{selectedOfficerId}</div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleAssign}
                disabled={!selectedOfficerId || updateLoading}
                className="w-full bg-amber-400 text-[#080a0e] py-3.5 text-[12px] font-black tracking-widest uppercase hover:bg-amber-300 hover:-translate-y-0.5 disabled:bg-amber-900 disabled:text-amber-700 disabled:translate-y-0 transition-all duration-150"
              >
                {updateLoading ? "ASSIGNING..." : "⭐ ASSIGN AS HEAD"}
              </button>
              <button
                onClick={() => navigateWithModal("/admin/dashboard/thanadashboard/thana-list")}
                className="w-full border border-slate-800 text-slate-600 py-3 text-[12px] font-bold tracking-widest uppercase hover:border-slate-600 hover:text-slate-400 transition-all duration-150"
              >
                BACK TO LIST
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssignThanaHead;