import deleteCellApi from "@/services/Cell/deleteCellApi";
import getCellsByBlockApi from "@/services/Cell/getCellsByBlockApi";
import { addIncarceration, getIncarcerationsByJail } from "@/services/Incarceration/incarcerationApi";
import { getCriminalFullProfileForJail } from "@/services/Jail/jailCriminalApi";
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
  const [selectedCellId, setSelectedCellId] = useState("");
  const [selectedCriminalId, setSelectedCriminalId] = useState("");

  const { data: cellData, isLoading: cellDataLoading, error: cellDataError } = useQuery({
    queryKey: ["cellData", cellBlockId],
    queryFn: () => getCellsByBlockApi(cellBlockId),
    enabled: !!cellBlockId,
  });

  const { data: incarcerationData } = useQuery({
    queryKey: ["cellMapIncarcerations", jailId],
    queryFn: () => getIncarcerationsByJail(jailId),
    enabled: !!jailId,
  });

  const cells = cellData?.data || [];
  const jailIncarcerations = Array.isArray(incarcerationData?.data) ? incarcerationData.data : [];

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

  const inmatesByCell = jailIncarcerations.reduce((acc, row) => {
    if (!row?.cell_id) return acc;
    if (!acc[row.cell_id]) acc[row.cell_id] = [];
    acc[row.cell_id].push(row);
    return acc;
  }, {});

  const selectedCell = cells.find((c) => c.cell_id === selectedCellId) || filtered[0] || null;
  const selectedCellInmates = selectedCell ? (inmatesByCell[selectedCell.cell_id] || []) : [];

  const { data: selectedCriminalFullProfileData, isLoading: isLoadingCriminalProfile } = useQuery({
    queryKey: ["jailCellCriminalFullProfile", selectedCriminalId],
    queryFn: () => getCriminalFullProfileForJail(selectedCriminalId),
    enabled: !!selectedCriminalId,
  });

  const selectedCriminalFullProfile = selectedCriminalFullProfileData?.data || null;

  const counts = {
    all: cells.length,
    available: cells.filter((c) => c.status === "available").length,
    occupied: cells.filter((c) => c.status === "occupied").length,
    maintenance: cells.filter((c) => c.status === "maintenance").length,
  };

  const layoutCells = [...filtered].sort((a, b) => (a.cell_number || "").localeCompare(b.cell_number || ""));

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
      <div className="max-w-6xl mx-auto">
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
          Block · <span className="text-white">{cellBlockId}</span>
        </span>
        <h1
          className="text-4xl md:text-5xl font-black tracking-widest uppercase text-white leading-none"
          style={{ fontFamily: "'Rajdhani', sans-serif" }}
        >
          Cell <span className="text-blue-400">List</span>
        </h1>
        <p className="text-[11px] text-slate-400 mt-2 tracking-widest">
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
                : "rounded-xl border-slate-700 text-slate-300 hover:border-slate-500 hover:text-slate-100"
            }`}
          >
            {tab.label}
            <span className="ml-2 text-slate-400">{counts[tab.key]}</span>
          </button>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <input
          className="rounded-xl bg-slate-900/70 border border-slate-700 text-slate-100 placeholder-slate-500 px-4 py-2.5 text-sm outline-none focus:border-blue-400/40 hover:border-slate-500 transition-colors w-full sm:w-64"
          placeholder="Search by cell number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => navigate(`/jail/dashboard/cellblock/${cellBlockId}/addcell`)}
          className="rounded-xl bg-blue-400 text-[#080a0e] px-6 py-2.5 text-[12px] font-black tracking-widest uppercase hover:bg-blue-300 hover:-translate-y-0.5 transition-all duration-150 whitespace-nowrap"
        >
          + Add Cell
        </button>
      </div>

      {/* ── Section label ── */}
      <div className="text-[10px] tracking-[0.22em] uppercase text-slate-400 pb-3 mb-4 border-b border-slate-700/80 flex items-center justify-between">
        <span>// Cell Records</span>
        {!cellDataLoading && (
          <span className="text-blue-400 bg-blue-400/10 border border-blue-400/20 px-2 py-0.5 text-[10px]">
            {filtered.length} records
          </span>
        )}
      </div>

      {/* ── Loading ── */}
      {cellDataLoading && (
        <div className="flex items-center gap-3 py-16 text-slate-400 text-[11px] tracking-widest">
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
        <div className="py-16 text-center text-slate-400 text-[11px] tracking-widest">
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
                    className="text-left text-[10px] tracking-[0.18em] uppercase text-slate-400 pb-3 pr-6 font-normal whitespace-nowrap"
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
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
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
                          className="rounded-xl border border-slate-600 bg-slate-900/70 text-slate-100 px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase hover:border-blue-400/40 hover:text-blue-300 transition-all duration-150 whitespace-nowrap"
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
                          className="rounded-xl border border-slate-600 bg-slate-900/70 text-slate-100 px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase hover:border-emerald-400/40 hover:text-emerald-300 transition-all duration-150 whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          ADD INMATE
                        </button>
                        <button
                          onClick={() => setDeleteTarget(cell.cell_id)}
                          className="rounded-xl border border-slate-600 bg-slate-900/70 text-slate-100 px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase hover:border-red-500/40 hover:text-red-400 transition-all duration-150 whitespace-nowrap"
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

      {/* ── Cell Map & Inspector ── */}
      {!cellDataLoading && !cellDataError && filtered.length > 0 && (
        <div className="mt-10 grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 bg-slate-900/60 border border-slate-700 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black tracking-wider uppercase text-white">Cell Layout</h2>
              <p className="text-[11px] text-slate-400">Select a cell to view details</p>
            </div>

            <div className="jail-cell-layout-panel rounded-2xl border border-slate-700 bg-slate-950/40 p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 items-start">
                {layoutCells.map((cell) => {
                  const cellInmates = inmatesByCell[cell.cell_id] || [];
                  const pct = cell.capacity
                    ? Math.min(100, Math.round(((cell.number_of_people || 0) / cell.capacity) * 100))
                    : 0;
                  const selected = selectedCell?.cell_id === cell.cell_id;

                  return (
                    <button
                      key={cell.cell_id}
                      type="button"
                      onClick={() => setSelectedCellId(cell.cell_id)}
                      className={`jail-cell-tile w-full text-left rounded-2xl border p-3 transition-all duration-200 ${
                        selected
                          ? "is-selected border-blue-400/40 bg-blue-400/5 shadow-[0_0_0_1px_rgba(96,165,250,0.25)]"
                          : "border-slate-700 bg-slate-950/90 hover:border-slate-500"
                      }`}
                    >
                      <CellCardBody cell={cell} cellInmates={cellInmates} pct={pct} />
                    </button>
                  );
                })}
                </div>
              </div>
            </div>

          <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-5">
            <h3 className="text-base font-black tracking-wider uppercase text-white mb-1">Cell Inspector</h3>
            {!selectedCell ? (
              <p className="text-sm text-slate-400">Select a cell from map to view details.</p>
            ) : (
              <>
                <div className="text-sm text-slate-200 mb-3">
                  <span className="font-bold text-slate-100">{selectedCell.cell_number}</span> · <span className="text-slate-300">{selectedCell.cell_id}</span>
                </div>
                <div className="text-[12px] text-slate-400 mb-3">
                  Capacity: {selectedCell.capacity} · Occupancy: {selectedCell.number_of_people || 0}
                </div>
                <div className="border-t border-slate-700 pt-3">
                  <p className="text-[11px] uppercase tracking-widest text-slate-400 mb-2">Criminals in this cell</p>
                  {selectedCellInmates.length === 0 ? (
                    <p className="text-sm text-slate-400">No active inmate in this cell.</p>
                  ) : (
                    <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                      {selectedCellInmates.map((row) => (
                        <button
                          key={row.incarceration_id}
                          type="button"
                          onClick={() => setSelectedCriminalId(row.criminal_id)}
                          className="jail-inmate-tile w-full text-left rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 hover:border-blue-400/40 hover:bg-blue-400/5 transition-all"
                        >
                          <div className="text-sm text-slate-100 font-semibold">{row.criminal_name || "Unknown"}</div>
                          <div className="text-[11px] text-slate-300">{row.criminal_id}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-[#080a0e]/90 flex items-center justify-center z-50 px-6">
          <div className="bg-[#0c1017] border border-slate-700 p-8 max-w-sm w-full rounded-2xl overflow-hidden">
            <div className="text-[10px] tracking-[0.22em] uppercase text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-1 inline-block mb-4">
              Confirm Delete
            </div>
            <h2 className="text-2xl font-black tracking-widest uppercase text-white mb-2" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              Delete Cell?
            </h2>
            <p className="text-[11px] text-slate-400 tracking-wider mb-6">
              // This action cannot be undone. The cell record will be permanently removed.
            </p>
            <div className="text-[11px] text-slate-400 bg-slate-900/60 border border-slate-800 px-4 py-3 mb-6 tracking-wider">
              ID: <span className="text-blue-400">{deleteTarget}</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => deleteCell(deleteTarget)}
                disabled={deleteCellLoading}
                className="rounded-xl bg-red-500 text-white px-6 py-3 text-[12px] font-black tracking-widest uppercase hover:bg-red-400 disabled:opacity-50 transition-all duration-150"
              >
                {deleteCellLoading ? "DELETING..." : "DELETE"}
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-slate-600 bg-slate-900/70 text-slate-100 px-6 py-3 text-[12px] font-bold tracking-widest uppercase hover:border-blue-400/40 hover:text-blue-300 transition-all duration-150"
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
          <div className="bg-[#0c1017] border border-slate-700 p-8 max-w-md w-full rounded-2xl overflow-hidden">
            <div className="text-[10px] tracking-[0.22em] uppercase text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 inline-block mb-4">
              Add Inmate
            </div>
            <h2 className="text-2xl font-black tracking-widest uppercase text-white mb-2" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              Assign to Cell
            </h2>
            <p className="text-[11px] text-slate-400 tracking-wider mb-4">
              Enter the arrest ID from court order to admit into this cell.
            </p>

            <div className="text-[11px] text-slate-400 bg-slate-900/60 border border-slate-800 px-4 py-3 mb-4 tracking-wider">
              Cell: <span className="text-slate-100">{assignTarget.cell_number}</span> ({assignTarget.cell_id})
              <br />
              Jail: <span className="text-slate-100">{jailId || "—"}</span>
            </div>

            <label className="text-[10px] tracking-[0.18em] uppercase text-slate-400 mb-2 block">Arrest ID *</label>
            <input
              className="w-full rounded-xl bg-slate-900/70 border border-slate-700 text-slate-100 placeholder-slate-500 px-4 py-3 text-sm outline-none focus:border-blue-400/40"
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
                className="rounded-xl bg-emerald-500 text-white px-6 py-3 text-[12px] font-black tracking-widest uppercase hover:bg-emerald-400 disabled:opacity-50 transition-all duration-150"
              >
                {addIncarcerationLoading ? "ADDING..." : "CONFIRM"}
              </button>
              <button
                onClick={() => {
                  setAssignTarget(null);
                  setArrestIdInput("");
                }}
                className="rounded-xl border border-slate-600 bg-slate-900/70 text-slate-100 px-6 py-3 text-[12px] font-bold tracking-widest uppercase hover:border-blue-400/40 hover:text-blue-300 transition-all duration-150"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Criminal Profile Modal ── */}
      {selectedCriminalId && (
        <div className="fixed inset-0 bg-[#080a0e]/90 flex items-center justify-center z-50 px-6">
          <div className="bg-[#0c1017] border border-slate-700 p-6 max-w-3xl w-full rounded-2xl max-h-[85vh] overflow-y-auto overflow-x-hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black tracking-widest uppercase text-white">Criminal Profile</h2>
              <button
                onClick={() => setSelectedCriminalId("")}
                className="rounded-xl border border-slate-600 bg-slate-900/70 text-slate-100 px-4 py-2 text-[12px] font-bold tracking-widest uppercase hover:border-blue-400/40 hover:text-blue-300"
              >
                Close
              </button>
            </div>

            {isLoadingCriminalProfile ? (
              <p className="text-slate-400">Loading profile...</p>
            ) : !selectedCriminalFullProfile ? (
              <p className="text-red-300">Could not load criminal details.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Info label="Criminal ID" value={selectedCriminalFullProfile.criminal_id} />
                <Info label="Name" value={selectedCriminalFullProfile.full_name} />
                <Info label="NID" value={selectedCriminalFullProfile.nid} />
                <Info label="Status" value={selectedCriminalFullProfile.status} />
                <Info label="Risk Level" value={selectedCriminalFullProfile.risk_level} />
                <Info label="Age" value={displayValue(selectedCriminalFullProfile.age, "Adult")} />
                <Info label="Gender" value={displayValue(selectedCriminalFullProfile.gender, "male")} />
                <Info label="Registered Thana" value={displayValue(selectedCriminalFullProfile.registered_thana, "Demo Central Thana")} />
                <Info label="Open Cases" value={displayValue(selectedCriminalFullProfile.open_cases, "0")} />
                <Info label="Closed Cases" value={displayValue(selectedCriminalFullProfile.closed_cases, "0")} />
                <Info label="Total Arrests" value={displayValue(selectedCriminalFullProfile.total_arrests, "1")} />
                <Info label="Organizations" value={selectedCriminalFullProfile.organizations || "None"} />
                <Info label="Aliases" value={displayValue(selectedCriminalFullProfile.aliases, "Not available")} />
                <Info label="Nationality" value={displayValue(selectedCriminalFullProfile.nationality, "Bangladeshi")} />
                <Info label="Father Name" value={displayValue(selectedCriminalFullProfile.father_name, "Md. Rahman")} />
                <Info label="Mother Name" value={displayValue(selectedCriminalFullProfile.mother_name, "Amena Khatun")} />
                <Info label="Permanent Address" value={displayValue(selectedCriminalFullProfile.permanent_address, "Not available")} />
                <Info label="Current Address" value={displayValue(selectedCriminalFullProfile.current_address, "Not available")} />
                <Info label="Identifying Marks" value={displayValue(selectedCriminalFullProfile.identifying_marks, "Not available")} />
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

function CellCardBody({ cell, cellInmates, pct }) {
  const barClass = pct >= 90 ? "bg-red-400" : pct >= 70 ? "bg-amber-400" : "bg-emerald-400";

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-100 font-bold tracking-wide">{cell.cell_number}</span>
        <span className="text-[10px] uppercase tracking-widest text-slate-300">{cell.cell_id}</span>
      </div>
      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden mb-2">
        <div className={`h-full ${barClass} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <div className="text-[11px] text-slate-200">
        {cell.number_of_people || 0}/{cell.capacity} occupied
      </div>
      <div className="text-[10px] text-slate-300 mt-1">Inmates listed: {cellInmates.length}</div>
    </>
  );
}

function displayValue(value, fallback) {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string" && value.trim() === "") return fallback;
  return String(value);
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2">
      <p className="text-[10px] uppercase tracking-widest text-slate-400">{label}</p>
      <p className="text-sm text-slate-100 mt-1 break-words">{displayValue(value, "Not available")}</p>
    </div>
  );
}