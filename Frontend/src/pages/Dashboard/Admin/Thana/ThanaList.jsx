import deleteThanaApi from "@/services/Thana/deleteThanaApi";
import getAllThanaApi from "@/services/Thana/getAllThanaApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BASE = "/admin/dashboard/thanadashboard";

export default function ThanaList() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const { data: thanaData, isLoading, error } = useQuery({
    queryKey: ["thanaList"],
    queryFn: getAllThanaApi,
    cacheTime: 5 * 60 * 1000,
    staleTime: 2 * 60 * 1000,
  });

  const thanaList = thanaData?.data || [];

  const filtered = thanaList.filter((t) =>
    [t.thana_name, t.district, t.zone].some((f) =>
      f?.toLowerCase().includes(search.toLowerCase())
    )
  );

  const { mutate: deleteThana, isLoading: deleting } = useMutation({
    mutationFn: (id) => deleteThanaApi(id),
    onSuccess: () => {
      setConfirmDelete(null);
      queryClient.invalidateQueries(["thanaList"]);
    },
    onError: () => alert("Failed to delete thana. Please try again."),
  });

  const navigateWithModal = (to) => {
    const isModal = Boolean(location.state?.modal);
    const backgroundLocation = location.state?.backgroundLocation || location;
    navigate(to, isModal ? { state: { modal: true, backgroundLocation } } : undefined);
  };

  return (
    <div
      className="min-h-screen bg-[#080a0e] text-slate-300 px-6 py-10 md:px-10"
      style={{
        backgroundImage:
          "linear-gradient(rgba(6,182,212,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,0.03) 1px,transparent 1px)",
        backgroundSize: "40px 40px",
        fontFamily: "'IBM Plex Mono', monospace",
      }}
    >
      {/* ── Header ── */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <span className="text-[10px] tracking-[0.22em] uppercase text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-3 py-1 inline-block mb-3">
            Registry
          </span>
          <h1
            className="text-4xl md:text-5xl font-black tracking-widest uppercase text-white leading-none"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            Thana <span className="text-cyan-400">List</span>
          </h1>
        </div>
        <button
          onClick={() => navigateWithModal(`${BASE}/add-thana`)}
          className="flex items-center gap-2 bg-cyan-400 text-[#080a0e] px-6 py-3 text-sm font-black tracking-widest uppercase hover:bg-cyan-300 hover:-translate-y-0.5 transition-all duration-150"
        >
          + Add Thana
        </button>
      </div>

      <div className="h-px bg-gradient-to-r from-cyan-400/30 via-cyan-400/10 to-transparent mb-8" />

      {/* ── Search ── */}
      <div className="mb-5">
        <input
          className="w-full max-w-md bg-slate-900/60 border border-slate-800 text-slate-300 placeholder-slate-700 px-4 py-2.5 text-sm outline-none focus:border-cyan-400/30 transition-colors"
          placeholder="Search by name, district or zone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ── States ── */}
      {isLoading && (
        <div className="flex flex-col items-center py-24 gap-4 text-slate-700 text-[12px] tracking-widest">
          <div className="w-8 h-8 border-2 border-slate-800 border-t-cyan-400 rounded-full animate-spin" />
          LOADING THANA DATA...
        </div>
      )}

      {error && (
        <div className="border border-red-500/20 bg-red-500/5 text-red-400 text-[12px] px-4 py-3 tracking-widest">
          ⚠ FAILED TO LOAD DATA
        </div>
      )}

      {!isLoading && !error && (
        <>
          <div className="text-[11px] text-slate-700 tracking-widest mb-4">
            SHOWING {filtered.length} OF {thanaList.length} RECORDS
          </div>

          {/* ── Table ── */}
          <div className="overflow-x-auto border border-slate-800">
            <table className="w-full min-w-[760px] border-collapse">
              <thead className="bg-slate-900/80">
                <tr>
                  {["ID", "Thana Name", "District", "Zone", "Phone", "Head Officer", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3.5 text-left text-[10px] tracking-[0.18em] uppercase text-slate-600 border-b border-slate-800 font-normal whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-[12px] tracking-widest text-slate-700">
                      NO RECORDS FOUND
                    </td>
                  </tr>
                ) : (
                  filtered.map((thana) => (
                    <tr
                      key={thana.thana_id}
                      className="border-b border-slate-900 hover:bg-cyan-400/[0.02] transition-colors duration-150"
                    >
                      {/* ID */}
                      <td className="px-4 py-3.5 text-[11px] text-slate-600">{thana.thana_id}</td>

                      {/* Name */}
                      <td className="px-4 py-3.5">
                        <span
                          className="text-white text-base font-bold tracking-wide"
                          style={{ fontFamily: "'Rajdhani', sans-serif" }}
                        >
                          {thana.thana_name}
                        </span>
                      </td>

                      {/* District */}
                      <td className="px-4 py-3.5">
                        <span className="text-[10px] tracking-[0.12em] uppercase px-2 py-1 bg-cyan-400/8 border border-cyan-400/15 text-cyan-400">
                          {thana.district}
                        </span>
                      </td>

                      {/* Zone */}
                      <td className="px-4 py-3.5">
                        <span className="text-[10px] tracking-[0.12em] uppercase px-2 py-1 bg-lime-400/8 border border-lime-400/15 text-lime-400">
                          {thana.zone}
                        </span>
                      </td>

                      {/* Phone */}
                      <td className="px-4 py-3.5 text-[12px] text-slate-500">{thana.phone}</td>

                      {/* Head Officer */}
                      <td className="px-4 py-3.5">
                        {thana.head_officer_id ? (
                          <span className="text-[10px] px-2 py-1 bg-amber-400/8 border border-amber-400/20 text-amber-400 tracking-wider">
                            {thana.head_officer_id}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-700">UNASSIGNED</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              navigateWithModal(`${BASE}/thana-list/update-thana/${thana.thana_id}`)
                            }
                            className="border border-slate-800 text-slate-400 px-3 py-1.5 text-[11px] font-bold tracking-widest uppercase hover:border-cyan-400/40 hover:text-cyan-400 transition-all duration-150"
                          >
                            EDIT
                          </button>
                          <button
                            onClick={() =>
                              navigateWithModal(`${BASE}/thana-list/thana-head/${thana.thana_id}`)
                            }
                            className="border border-slate-800 text-amber-400 px-3 py-1.5 text-[11px] font-bold tracking-widest uppercase hover:border-amber-400/40 hover:bg-amber-400/5 transition-all duration-150"
                          >
                            ASSIGN
                          </button>
                          <button
                            onClick={() => setConfirmDelete(thana)}
                            className="border border-slate-800 text-red-400 px-2.5 py-1.5 text-[13px] font-bold hover:border-red-400/40 hover:bg-red-400/5 transition-all duration-150"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── Delete Confirm Modal ── */}
      {confirmDelete && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
          onClick={() => setConfirmDelete(null)}
        >
          <div
            className="bg-[#0e1218] border border-red-400/20 p-8 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              className="text-xl font-black tracking-widest uppercase text-white mb-3"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              Confirm Delete
            </h2>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Permanently delete{" "}
              <span className="text-red-400 font-semibold">{confirmDelete.thana_name}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="border border-slate-800 text-slate-500 px-5 py-2.5 text-[11px] font-bold tracking-widest uppercase hover:border-slate-600 transition-colors"
              >
                CANCEL
              </button>
              <button
                disabled={deleting}
                onClick={() => deleteThana(confirmDelete.thana_id)}
                className="bg-red-500 text-white px-5 py-2.5 text-[11px] font-black tracking-widest uppercase hover:bg-red-400 disabled:bg-red-950 disabled:text-red-800 transition-colors"
              >
                {deleting ? "DELETING..." : "DELETE"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}