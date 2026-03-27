import deleteJailApi from "@/services/Jail/deleteJailApi";
import getAllJailApi from "@/services/Jail/getAllJailApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JailList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState(null); // jail_id pending confirm
  const [search, setSearch] = useState("");

  const { data: jailListData, isLoading: jailListLoading, error: jailListError } = useQuery({
    queryKey: ["jailList"],
    queryFn: () => getAllJailApi(),
    cacheTime: 5 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
  });

  const jailList = jailListData?.data || [];

  const { mutate: deleteJail, isLoading: deleteJailLoading } = useMutation({
    mutationFn: (jailId) => deleteJailApi(jailId),
    onSuccess: () => {
      queryClient.invalidateQueries(["jailList"]);
      setDeleteTarget(null);
    },
    onError: () => alert("Failed to delete jail. Please try again."),
  });

  const filtered = jailList.filter(
    (j) =>
      j.jail_name?.toLowerCase().includes(search.toLowerCase()) ||
      j.district?.toLowerCase().includes(search.toLowerCase()) ||
      j.zone?.toLowerCase().includes(search.toLowerCase())
  );

  console.log("JailList render: ", { jailList, filtered, search });

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
          Records
        </span>
        <h1
          className="text-4xl md:text-5xl font-black tracking-widest uppercase text-white leading-none"
          style={{ fontFamily: "'Rajdhani', sans-serif" }}
        >
          Jail <span className="text-blue-400">List</span>
        </h1>
        <p className="text-[11px] text-slate-700 mt-2 tracking-widest">
          // All registered detention facilities
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-blue-400/30 via-blue-400/10 to-transparent mb-10" />

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <input
          className="bg-slate-900/60 border border-slate-800 text-slate-300 placeholder-slate-700 px-4 py-2.5 text-sm outline-none focus:border-blue-400/30 hover:border-slate-700 transition-colors w-full sm:w-72"
          placeholder="Search by name, district, zone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => navigate("/admin/dashboard/jaillist/add")}
          className="bg-blue-400 text-[#080a0e] px-6 py-2.5 text-[12px] font-black tracking-widest uppercase hover:bg-blue-300 hover:-translate-y-0.5 transition-all duration-150 whitespace-nowrap"
        >
          + Add Jail
        </button>
      </div>

      {/* ── Section label ── */}
      <div className="text-[10px] tracking-[0.22em] uppercase text-slate-700 pb-3 mb-4 border-b border-slate-800/80 flex items-center justify-between">
        <span>// Facility Records</span>
        {!jailListLoading && (
          <span className="text-blue-400 bg-blue-400/10 border border-blue-400/20 px-2 py-0.5 text-[10px]">
            {filtered.length} records
          </span>
        )}
      </div>

      {/* ── Loading ── */}
      {jailListLoading && (
        <div className="flex items-center gap-3 py-16 text-slate-700 text-[11px] tracking-widest">
          <div className="w-4 h-4 border border-slate-700 border-t-blue-400 rounded-full animate-spin" />
          LOADING RECORDS...
        </div>
      )}

      {/* ── Error ── */}
      {jailListError && (
        <div className="bg-red-500/8 border border-red-500/20 text-red-400 text-[12px] tracking-widest px-4 py-3 mb-4">
          ⚠ Failed to load jail records. Please refresh.
        </div>
      )}

      {/* ── Empty ── */}
      {!jailListLoading && !jailListError && filtered.length === 0 && (
        <div className="py-16 text-center text-slate-700 text-[11px] tracking-widest">
          {search ? "NO MATCHING RECORDS FOUND" : "NO FACILITIES REGISTERED YET"}
        </div>
      )}

      {/* ── Table ── */}
      {!jailListLoading && filtered.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                {["Jail ID", "Facility Name", "District", "Zone", "Capacity", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="text-left text-[10px] tracking-[0.18em] uppercase text-slate-600 pb-3 pr-6 font-normal whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((jail) => (
                <tr
                  key={jail.jail_id}
                  className="border-b border-slate-800/60 hover:bg-slate-900/40 transition-colors group"
                >
                  <td className="py-4 pr-6 text-blue-400 text-[11px] tracking-wider whitespace-nowrap">
                    {jail.jail_id}
                  </td>
                  <td className="py-4 pr-6 whitespace-nowrap">
                    <span
                      className="text-white font-bold text-base"
                      style={{ fontFamily: "'Rajdhani', sans-serif" }}
                    >
                      {jail.jail_name}
                    </span>
                  </td>
                  <td className="py-4 pr-6 text-slate-400 whitespace-nowrap">{jail.district}</td>
                  <td className="py-4 pr-6">
                    <span className="bg-slate-900 border border-slate-800 text-slate-500 text-[10px] tracking-wider px-2 py-1 uppercase">
                      {jail.zone}
                    </span>
                  </td>
                  <td className="py-4 pr-6 text-slate-400 whitespace-nowrap">
                    {jail.capacity?.toLocaleString()}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`update-jail/${jail.jail_id}`)}
                        className="border border-slate-800 text-slate-600 px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase hover:border-blue-400/40 hover:text-blue-400 transition-all duration-150 whitespace-nowrap"
                      >
                        EDIT
                      </button>
                      <button
                        onClick={() => setDeleteTarget(jail.jail_id)}
                        className="border border-slate-800 text-slate-600 px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase hover:border-red-500/40 hover:text-red-400 transition-all duration-150 whitespace-nowrap"
                      >
                        DELETE
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-[#080a0e]/90 flex items-center justify-center z-50 px-6">
          <div className="bg-[#0c1017] border border-slate-800 p-8 max-w-sm w-full">
            <div className="text-[10px] tracking-[0.22em] uppercase text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-1 inline-block mb-4">
              Confirm Delete
            </div>
            <h2
              className="text-2xl font-black tracking-widest uppercase text-white mb-2"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              Delete Facility?
            </h2>
            <p className="text-[11px] text-slate-600 tracking-wider mb-6">
              // This action cannot be undone. The facility record will be permanently removed.
            </p>
            <div className="text-[11px] text-slate-500 bg-slate-900/60 border border-slate-800 px-4 py-3 mb-6 tracking-wider">
              ID: <span className="text-blue-400">{deleteTarget}</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => deleteJail(deleteTarget)}
                disabled={deleteJailLoading}
                className="bg-red-500 text-white px-6 py-3 text-[12px] font-black tracking-widest uppercase hover:bg-red-400 disabled:opacity-50 transition-all duration-150"
              >
                {deleteJailLoading ? "DELETING..." : "DELETE"}
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                className="border border-slate-800 text-slate-600 px-6 py-3 text-[12px] font-bold tracking-widest uppercase hover:border-slate-600 hover:text-slate-400 transition-all duration-150"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}