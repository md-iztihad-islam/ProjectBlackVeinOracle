import deleteCellApi from "@/services/Cell/deleteCellApi";
import getCellsByBlockApi from "@/services/Cell/getCellsByBlockApi";
import { addIncarceration } from "@/services/Incarceration/incarcerationApi";
import userStore from "@/state/userStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const statusStyle = {
  available:   { label: "Available",   cls: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  occupied:    { label: "Occupied",    cls: "text-amber-400  bg-amber-400/10  border-amber-400/20"  },
  maintenance: { label: "Maintenance", cls: "text-red-400    bg-red-400/10    border-red-400/20"    },
};

export default function CellList() {
  const navigate = useNavigate();
  const { blockId } = useParams();
  const cellBlockId = blockId;
  const { user } = userStore();
  const jailId = user?.jail_id;
  const queryClient = useQueryClient();

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [assignTarget, setAssignTarget] = useState(null);
  const [arrestIdInput, setArrestIdInput] = useState("");
  const [search, setSearch]             = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: cellData, isLoading: cellDataLoading, error: cellDataError } = useQuery({
    queryKey: ["cellData", cellBlockId],
    queryFn: () => getCellsByBlockApi(cellBlockId),
    enabled: !!cellBlockId,
  });

  const cells = cellData?.data || [];

  const { mutate: deleteCell, isLoading: deleteCellLoading } = useMutation({
    mutationFn: (cellId) => deleteCellApi(cellId),
    onSuccess: () => {
      queryClient.invalidateQueries(["cellData", cellBlockId]);
      setDeleteTarget(null);
    },
    onError: () => alert("Failed to delete cell. Please try again."),
  });

  const { mutate: addIncarcerationMut, isLoading: addIncarcerationLoading } = useMutation({
    mutationFn: ({ arrestId, cellId }) =>
      addIncarceration({
        jail_id: jailId,
        arrest_id: arrestId,
        cell_id: cellId,
      }),
    onSuccess: (res) => {
      if (!res?.success) {
        alert(res?.message || "Failed to add criminal to cell.");
        return;
      }
      alert("Criminal added to cell successfully.");
      setAssignTarget(null);
      setArrestIdInput("");
      queryClient.invalidateQueries(["cellData", cellBlockId]);
      queryClient.invalidateQueries(["jailIncarcerations", jailId]);
      queryClient.invalidateQueries(["jailOccupancyData", jailId]);
    },
    onError: () => alert("Failed to add criminal to cell. Please try again."),
  });

  const filtered = cells.filter((c) => {
    const matchSearch = c.cell_number?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    all: cells.length,
    available: cells.filter((c) => c.status === "available").length,
    occupied: cells.filter((c) => c.status === "occupied").length,
    maintenance: cells.filter((c) => c.status === "maintenance").length,
  };

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
          Block · <span className="text-white">{cellBlockId}</span>
        </span>
        <h1
          className="text-4xl md:text-5xl font-black tracking-widest uppercase text-white leading-none"
          style={{ fontFamily: "'Rajdhani', sans-serif" }}
        >
          Cell <span className="text-blue-400">List</span>
        </h1>
        <p className="text-[11px] text-slate-700 mt-2 tracking-widest">
          // All cells registered in this block
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-blue-400/30 via-blue-400/10 to-transparent mb-10" />

      {/* ── Status Tabs ── */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: "all",         label: "All"         },
          { key: "available",   label: "Available"   },
          { key: "occupied",    label: "Occupied"    },
          { key: "maintenance", label: "Maintenance" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            className={`text-[10px] tracking-widest uppercase px-3 py-1.5 border transition-all duration-150 ${
              filterStatus === tab.key
                ? "border-blue-400/40 bg-blue-400/10 text-blue-400"
                : "border-slate-800 text-slate-600 hover:border-slate-700 hover:text-slate-500"
            }`}
          >
            {tab.label}
            <span className="ml-2 text-slate-700">{counts[tab.key]}</span>
          </button>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <input
          className="bg-slate-900/60 border border-slate-800 text-slate-300 placeholder-slate-700 px-4 py-2.5 text-sm outline-none focus:border-blue-400/30 hover:border-slate-700 transition-colors w-full sm:w-64"
          placeholder="Search by cell number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => navigate(`/jail/dashboard/cellblock/${cellBlockId}/addcell`)}
          className="bg-blue-400 text-[#080a0e] px-6 py-2.5 text-[12px] font-black tracking-widest uppercase hover:bg-blue-300 hover:-translate-y-0.5 transition-all duration-150 whitespace-nowrap"
        >
          + Add Cell
        </button>
      </div>

      {/* ── Section label ── */}
      <div className="text-[10px] tracking-[0.22em] uppercase text-slate-700 pb-3 mb-4 border-b border-slate-800/80 flex items-center justify-between">
        <span>// Cell Records</span>
        {!cellDataLoading && (
          <span className="text-blue-400 bg-blue-400/10 border border-blue-400/20 px-2 py-0.5 text-[10px]">
            {filtered.length} records
          </span>
        )}
      </div>

      {/* ── Loading ── */}
      {cellDataLoading && (
        <div className="flex items-center gap-3 py-16 text-slate-700 text-[11px] tracking-widest">
          <div className="w-4 h-4 border border-slate-700 border-t-blue-400 rounded-full animate-spin" />
          LOADING RECORDS...
        </div>
      )}

      {/* ── Error ── */}
      {cellDataError && (
        <div className="bg-red-500/8 border border-red-500/20 text-red-400 text-[12px] tracking-widest px-4 py-3 mb-4">
          ⚠ Failed to load cell records. Please refresh.
        </div>
      )}

      {/* ── Empty ── */}
      {!cellDataLoading && !cellDataError && filtered.length === 0 && (
        <div className="py-16 text-center text-slate-700 text-[11px] tracking-widest">
          {search || filterStatus !== "all" ? "NO MATCHING RECORDS FOUND" : "NO CELLS REGISTERED YET"}
        </div>
      )}

      {/* ── Table ── */}
      {!cellDataLoading && filtered.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                {["Cell ID", "Cell No.", "Capacity", "Occupancy", "Status", "Actions"].map((h) => (
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
              {filtered.map((cell) => {
                const pct = cell.capacity
                  ? Math.min(100, Math.round(((cell.number_of_people || 0) / cell.capacity) * 100))
                  : 0;
                const s = statusStyle[cell.status] || statusStyle.available;
                return (
                  <tr
                    key={cell.cell_id}
                    className="border-b border-slate-800/60 hover:bg-slate-900/40 transition-colors"
                  >
                    <td className="py-4 pr-6 text-blue-400 text-[11px] tracking-wider whitespace-nowrap">
                      {cell.cell_id}
                    </td>
                    <td className="py-4 pr-6 whitespace-nowrap">
                      <span className="text-white font-bold text-base" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                        {cell.cell_number}
                      </span>
                    </td>
                    <td className="py-4 pr-6 text-slate-400 whitespace-nowrap">{cell.capacity}</td>
                    <td className="py-4 pr-6 min-w-[120px]">
                      <div className="flex items-center gap-2">
                        <div className="h-1 flex-1 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-400 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-600 whitespace-nowrap">
                          {cell.number_of_people || 0}/{cell.capacity}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 pr-6 whitespace-nowrap">
                      <span className={`text-[10px] tracking-wider uppercase border px-2 py-1 ${s.cls}`}>
                        {s.label}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/jail/dashboard/cell/update/${cell.cell_id}`)}
                          className="border border-slate-800 text-slate-600 px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase hover:border-blue-400/40 hover:text-blue-400 transition-all duration-150 whitespace-nowrap"
                        >
                          EDIT
                        </button>
                        <button
                          onClick={() => {
                            setAssignTarget(cell);
                            setArrestIdInput("");
                          }}
                          disabled={
                            cell.status === "maintenance" ||
                            Number(cell.number_of_people || 0) >= Number(cell.capacity || 0)
                          }
                          className="border border-slate-800 text-slate-600 px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase hover:border-emerald-400/40 hover:text-emerald-400 transition-all duration-150 whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          ADD INMATE
                        </button>
                        <button
                          onClick={() => setDeleteTarget(cell.cell_id)}
                          className="border border-slate-800 text-slate-600 px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase hover:border-red-500/40 hover:text-red-400 transition-all duration-150 whitespace-nowrap"
                        >
                          DELETE
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-[#080a0e]/90 flex items-center justify-center z-50 px-6">
          <div className="bg-[#0c1017] border border-slate-800 p-8 max-w-sm w-full">
            <div className="text-[10px] tracking-[0.22em] uppercase text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-1 inline-block mb-4">
              Confirm Delete
            </div>
            <h2 className="text-2xl font-black tracking-widest uppercase text-white mb-2" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              Delete Cell?
            </h2>
            <p className="text-[11px] text-slate-600 tracking-wider mb-6">
              // This action cannot be undone. The cell record will be permanently removed.
            </p>
            <div className="text-[11px] text-slate-500 bg-slate-900/60 border border-slate-800 px-4 py-3 mb-6 tracking-wider">
              ID: <span className="text-blue-400">{deleteTarget}</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => deleteCell(deleteTarget)}
                disabled={deleteCellLoading}
                className="bg-red-500 text-white px-6 py-3 text-[12px] font-black tracking-widest uppercase hover:bg-red-400 disabled:opacity-50 transition-all duration-150"
              >
                {deleteCellLoading ? "DELETING..." : "DELETE"}
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

      {/* ── Assign Criminal to Cell Modal ── */}
      {assignTarget && (
        <div className="fixed inset-0 bg-[#080a0e]/90 flex items-center justify-center z-50 px-6">
          <div className="bg-[#0c1017] border border-slate-800 p-8 max-w-md w-full">
            <div className="text-[10px] tracking-[0.22em] uppercase text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 inline-block mb-4">
              Add Inmate
            </div>
            <h2 className="text-2xl font-black tracking-widest uppercase text-white mb-2" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              Assign to Cell
            </h2>
            <p className="text-[11px] text-slate-600 tracking-wider mb-4">
              Enter the arrest ID from court order to admit into this cell.
            </p>

            <div className="text-[11px] text-slate-500 bg-slate-900/60 border border-slate-800 px-4 py-3 mb-4 tracking-wider">
              Cell: <span className="text-blue-400">{assignTarget.cell_number}</span> ({assignTarget.cell_id})
              <br />
              Jail: <span className="text-blue-400">{jailId || "—"}</span>
            </div>

            <label className="text-[10px] tracking-[0.18em] uppercase text-slate-600 mb-2 block">Arrest ID *</label>
            <input
              className="w-full bg-slate-900/60 border border-slate-800 text-slate-300 placeholder-slate-700 px-4 py-3 text-sm outline-none focus:border-blue-400/30"
              placeholder="e.g. ARR-0000001"
              value={arrestIdInput}
              onChange={(e) => setArrestIdInput(e.target.value)}
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  const trimmed = arrestIdInput.trim();
                  if (!trimmed) {
                    alert("Arrest ID is required.");
                    return;
                  }
                  addIncarcerationMut({ arrestId: trimmed, cellId: assignTarget.cell_id });
                }}
                disabled={addIncarcerationLoading || !jailId}
                className="bg-emerald-500 text-white px-6 py-3 text-[12px] font-black tracking-widest uppercase hover:bg-emerald-400 disabled:opacity-50 transition-all duration-150"
              >
                {addIncarcerationLoading ? "ADDING..." : "CONFIRM"}
              </button>
              <button
                onClick={() => {
                  setAssignTarget(null);
                  setArrestIdInput("");
                }}
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