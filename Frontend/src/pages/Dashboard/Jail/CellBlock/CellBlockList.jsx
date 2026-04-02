import deleteCellBlockApi from "@/services/CellBlock/deleteCellBlockApi";
import getCellBlocksByJailApi from "@/services/CellBlock/getCellBlockByJailApi";
import userStore from "@/state/userStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CellBlockList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = userStore();
  const jailId = user?.jail_id;

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState("");

  const { data: cellBlockData, isLoading, error } = useQuery({
    queryKey: ["cellBlockData", jailId],
    queryFn: () => getCellBlocksByJailApi(jailId),
    enabled: !!jailId,
  });

  const cellBlocks = cellBlockData?.data || [];

  const { mutate: deleteCellBlock, isLoading: deleteLoading } = useMutation({
    mutationFn: (blockId) => deleteCellBlockApi(blockId),
    onSuccess: () => { queryClient.invalidateQueries(["cellBlockData", jailId]); setDeleteTarget(null); },
    onError: () => alert("Failed to delete cell block. Please try again."),
  });

  const filtered = cellBlocks.filter((b) =>
    b.block_name?.toLowerCase().includes(search.toLowerCase()) ||
    b.block_id?.toLowerCase().includes(search.toLowerCase())
  );

  const totalCapacity = cellBlocks.reduce((s, b) => s + (b.capacity || 0), 0);

  return (
    <div className="min-h-screen bg-[#080a0e] text-slate-300 px-6 py-10 md:px-10"
      style={{ backgroundImage: "linear-gradient(rgba(96,165,250,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(96,165,250,0.025) 1px,transparent 1px)", backgroundSize: "40px 40px", fontFamily: "'IBM Plex Mono', monospace" }}>

      <div className="mb-10">
        <span className="text-[10px] tracking-[0.22em] uppercase text-blue-400 bg-blue-400/10 border border-blue-400/20 px-3 py-1 inline-block mb-3">Records</span>
        <h1 className="text-4xl md:text-5xl font-black tracking-widest uppercase text-white leading-none" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
          Cell Block <span className="text-blue-400">List</span>
        </h1>
        <p className="text-[11px] text-slate-700 mt-2 tracking-widest">// Jail: <span className="text-blue-400/60">{jailId}</span></p>
      </div>

      <div className="h-px bg-gradient-to-r from-blue-400/30 via-blue-400/10 to-transparent mb-10" />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10 max-w-lg">
        {[
          { label: "Total Blocks",    value: isLoading ? "—" : cellBlocks.length, accent: true  },
          { label: "Total Capacity",  value: isLoading ? "—" : totalCapacity,     accent: false },
          { label: "Jail ID",         value: jailId || "—",                       accent: false },
        ].map((s) => (
          <div key={s.label} className="bg-slate-900/40 border border-slate-800 px-4 py-4 relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-px ${s.accent ? "bg-blue-400/60" : "bg-slate-700"}`} />
            <div className="text-[10px] tracking-[0.18em] uppercase text-slate-600 mb-1">{s.label}</div>
            <div className={`text-xl font-black truncate ${s.accent ? "text-blue-400" : "text-white"}`} style={{ fontFamily: "'Rajdhani', sans-serif" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <input className="bg-slate-900/60 border border-slate-800 text-slate-300 placeholder-slate-700 px-4 py-2.5 text-sm outline-none focus:border-blue-400/30 hover:border-slate-700 transition-colors w-full sm:w-64"
          placeholder="Search by block name or ID..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <button onClick={() => navigate("/jail/dashboard/add-cell-block")}
          className="bg-blue-400 text-[#080a0e] px-6 py-2.5 text-[12px] font-black tracking-widest uppercase hover:bg-blue-300 hover:-translate-y-0.5 transition-all duration-150 whitespace-nowrap">
          + Add Block
        </button>
      </div>

      <div className="text-[10px] tracking-[0.22em] uppercase text-slate-700 pb-3 mb-4 border-b border-slate-800/80 flex items-center justify-between">
        <span>// Block Records</span>
        {!isLoading && <span className="text-blue-400 bg-blue-400/10 border border-blue-400/20 px-2 py-0.5 text-[10px]">{filtered.length} records</span>}
      </div>

      {isLoading && (
        <div className="flex items-center gap-3 py-16 text-slate-700 text-[11px] tracking-widest">
          <div className="w-4 h-4 border border-slate-700 border-t-blue-400 rounded-full animate-spin" />LOADING RECORDS...
        </div>
      )}
      {error && <div className="bg-red-500/8 border border-red-500/20 text-red-400 text-[12px] tracking-widest px-4 py-3 mb-4">⚠ Failed to load cell blocks. Please refresh.</div>}
      {!isLoading && !error && filtered.length === 0 && (
        <div className="py-16 text-center text-slate-700 text-[11px] tracking-widest">{search ? "NO MATCHING BLOCKS FOUND" : "NO CELL BLOCKS REGISTERED YET"}</div>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                {["Block ID", "Block Name", "Capacity", "Actions"].map((h) => (
                  <th key={h} className="text-left text-[10px] tracking-[0.18em] uppercase text-slate-600 pb-3 pr-6 font-normal whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((block) => (
                <tr key={block.block_id} className="border-b border-slate-800/60 hover:bg-slate-900/40 transition-colors">
                  <td className="py-4 pr-6 text-blue-400 text-[11px] tracking-wider whitespace-nowrap">{block.block_id}</td>
                  <td className="py-4 pr-6 whitespace-nowrap">
                    <span className="text-white font-bold text-base" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{block.block_name}</span>
                  </td>
                  <td className="py-4 pr-6 text-slate-400">{block.capacity?.toLocaleString()}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button onClick={() => navigate(`/jail/dashboard/cellblock/${block.block_id}/cells`)}
                        className="border border-slate-800 text-slate-600 px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase hover:border-blue-400/40 hover:text-blue-400 transition-all duration-150 whitespace-nowrap">CELLS</button>
                      <button onClick={() => navigate(`update-cell-block/${block.block_id}`)}
                        className="border border-slate-800 text-slate-600 px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase hover:border-blue-400/40 hover:text-blue-400 transition-all duration-150">EDIT</button>
                      <button onClick={() => setDeleteTarget(block.block_id)}
                        className="border border-slate-800 text-slate-600 px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase hover:border-red-500/40 hover:text-red-400 transition-all duration-150">DELETE</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-[#080a0e]/90 flex items-center justify-center z-50 px-6">
          <div className="bg-[#0c1017] border border-slate-800 p-8 max-w-sm w-full">
            <span className="text-[10px] tracking-[0.22em] uppercase text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-1 inline-block mb-4">Confirm Delete</span>
            <h2 className="text-2xl font-black tracking-widest uppercase text-white mb-2" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Delete Block?</h2>
            <p className="text-[11px] text-slate-600 tracking-wider mb-6">// All cells within this block will also be deleted.</p>
            <div className="text-[11px] text-slate-500 bg-slate-900/60 border border-slate-800 px-4 py-3 mb-6 tracking-wider">
              ID: <span className="text-blue-400">{deleteTarget}</span>
            </div>
            <div className="flex gap-3">
              <button onClick={() => deleteCellBlock(deleteTarget)} disabled={deleteLoading}
                className="bg-red-500 text-white px-6 py-3 text-[12px] font-black tracking-widest uppercase hover:bg-red-400 disabled:opacity-50 transition-all duration-150">
                {deleteLoading ? "DELETING..." : "DELETE"}
              </button>
              <button onClick={() => setDeleteTarget(null)}
                className="border border-slate-800 text-slate-600 px-6 py-3 text-[12px] font-bold tracking-widest uppercase hover:border-slate-600 hover:text-slate-400 transition-all duration-150">CANCEL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}