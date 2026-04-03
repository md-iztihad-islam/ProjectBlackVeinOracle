import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { findAvailableCell, getIncarcerationsByJail, transferCriminal } from "@/services/Incarceration/incarcerationApi";
import getAllJailApi from "@/services/Jail/getAllJailApi";
import userStore from "@/state/userStore";

export default function JailTransferCriminal() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = userStore();
  const jailId = user?.jail_id;

  const [form, setForm] = useState({
    criminalId: "",
    toJailId: "",
    toCellId: "",
    reason: "",
  });
  const [cellLookupNote, setCellLookupNote] = useState("");
  const [criminalQuery, setCriminalQuery] = useState("");
  const [showCriminalSuggestions, setShowCriminalSuggestions] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const { data: jailData, isLoading: jailLoading } = useQuery({
    queryKey: ["allJailsForTransfer"],
    queryFn: getAllJailApi,
    enabled: !!jailId,
  });

  const { data: jailIncarcerationData } = useQuery({
    queryKey: ["jail-transfer-criminal-options", jailId],
    queryFn: () => getIncarcerationsByJail(jailId),
    enabled: !!jailId,
  });

  const jailInmates = useMemo(
    () =>
      Array.isArray(jailIncarcerationData?.data)
        ? jailIncarcerationData.data.filter((i) => i?.criminal_id)
        : [],
    [jailIncarcerationData],
  );

  const inmateSuggestions = useMemo(() => {
    const q = criminalQuery.trim().toLowerCase();
    const list = jailInmates.filter((row) => {
      if (!q) return true;
      return (
        String(row.criminal_name || "").toLowerCase().includes(q) ||
        String(row.criminal_id || "").toLowerCase().includes(q) ||
        String(row.arrest_id || "").toLowerCase().includes(q)
      );
    });
    return list.slice(0, 8);
  }, [criminalQuery, jailInmates]);

  const selectedInmate = jailInmates.find((i) => i.criminal_id === form.criminalId) || null;

  const destinationJails = (Array.isArray(jailData?.data) ? jailData.data : []).filter(
    (j) => j?.jail_id && j.jail_id !== jailId
  );

  const transferMut = useMutation({
    mutationFn: () =>
      transferCriminal({
        criminalId: form.criminalId.trim(),
        fromJailId: jailId,
        toJailId: form.toJailId,
        toCellId: form.toCellId.trim() || null,
        reason: form.reason.trim(),
      }),
    onSuccess: (res) => {
      if (res?.success) {
        alert("Transfer completed.");
        navigate("/jail/dashboard/transfer-history", { state: { criminalId: form.criminalId.trim() } });
        return;
      }
      alert(res?.message || res?.error?.message || "Transfer failed.");
    },
  });

  const lookupCellMut = useMutation({
    mutationFn: () => findAvailableCell(form.toJailId),
    onSuccess: (res) => {
      const cellId = res?.data?.cell_id;
      if (res?.success && cellId) {
        set("toCellId", cellId);
        setCellLookupNote(`Suggested available cell: ${cellId}`);
      } else {
        setCellLookupNote(res?.error?.message || "No available cell found in destination jail.");
      }
    },
  });

  const inputCls =
    "w-full bg-gray-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500/50";

  const handleBack = () => {
    if (location.state?.modal) {
      navigate(-1);
      return;
    }
    navigate("/jail/dashboard");
  };

  if (!jailId) {
    return (
      <div className="min-h-screen bg-gray-950 text-slate-200 p-6">
        <div className="max-w-2xl mx-auto bg-gray-900 border border-white/5 rounded-2xl p-6">
          <p className="text-red-400">Access denied. Please login as jail account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto text-slate-200">
      <div className="bg-gray-900/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <button onClick={handleBack} className="text-sm text-blue-300 hover:text-blue-200 mb-4">
          ← Back
        </button>

        <h1 className="text-2xl font-bold mb-2">Transfer Criminal</h1>
        <p className="text-sm text-slate-400 mb-6">Source jail is fixed to your logged-in jail account.</p>

        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            transferMut.mutate();
          }}
        >
          <div>
            <label className="text-xs text-slate-400 uppercase">From Jail ID</label>
            <input className={`${inputCls} opacity-70`} value={jailId} readOnly />
          </div>

          <div className="md:col-span-2 relative">
            <label className="text-xs text-slate-400 uppercase">Criminal (Name / ID / Arrest ID)</label>
            <input
              required
              className={inputCls}
              placeholder="Type criminal name..."
              value={criminalQuery}
              onFocus={() => setShowCriminalSuggestions(true)}
              onChange={(e) => {
                setCriminalQuery(e.target.value);
                set("criminalId", "");
                setShowCriminalSuggestions(true);
              }}
            />
            {showCriminalSuggestions && inmateSuggestions.length > 0 && (
              <div className="absolute z-20 mt-1 w-full bg-gray-900 border border-white/10 rounded-lg max-h-56 overflow-auto">
                {inmateSuggestions.map((row) => (
                  <button
                    key={`${row.incarceration_id}-${row.criminal_id}-${row.arrest_id}`}
                    type="button"
                    onClick={() => {
                      set("criminalId", row.criminal_id);
                      setCriminalQuery(`${row.criminal_name || "Unknown"} (${row.criminal_id}) · ${row.arrest_id || "No arrest"}`);
                      setShowCriminalSuggestions(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-white/5"
                  >
                    <span className="font-medium text-slate-100">{row.criminal_name || "Unknown"}</span>
                    <span className="text-slate-400"> ({row.criminal_id}) · {row.arrest_id || "No arrest"}</span>
                  </button>
                ))}
              </div>
            )}
            {selectedInmate && (
              <p className="text-xs text-emerald-300 mt-2">
                Selected: {selectedInmate.criminal_name || "Unknown"} ({selectedInmate.criminal_id}) · Arrest: {selectedInmate.arrest_id || "N/A"}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs text-slate-400 uppercase">To Jail</label>
            <select
              required
              className={inputCls}
              value={form.toJailId}
              onChange={(e) => {
                set("toJailId", e.target.value);
                set("toCellId", "");
                setCellLookupNote("");
              }}
              disabled={jailLoading}
            >
              <option value="">Select destination jail</option>
              {destinationJails.map((j) => (
                <option key={j.jail_id} value={j.jail_id}>
                  {j.jail_name} ({j.jail_id})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="text-xs text-slate-400 uppercase">To Cell ID (optional)</label>
                <input
                  className={inputCls}
                  placeholder="Leave empty to auto-assign"
                  value={form.toCellId}
                  onChange={(e) => set("toCellId", e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={() => lookupCellMut.mutate()}
                disabled={!form.toJailId || lookupCellMut.isPending}
                className="px-3 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm disabled:opacity-50"
              >
                {lookupCellMut.isPending ? "Finding..." : "Find Cell"}
              </button>
            </div>
            {cellLookupNote && <p className="text-xs mt-2 text-indigo-300">{cellLookupNote}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="text-xs text-slate-400 uppercase">Reason</label>
            <textarea
              required
              className={`${inputCls} min-h-[90px]`}
              placeholder="Reason for transfer"
              value={form.reason}
              onChange={(e) => set("reason", e.target.value)}
            />
          </div>

          <div className="md:col-span-2 flex gap-2">
            <button
              type="submit"
              disabled={transferMut.isPending}
              className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white disabled:opacity-50"
            >
              {transferMut.isPending ? "Submitting..." : "Submit Transfer"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/jail/dashboard/transfer-history")}
              className="px-4 py-2 rounded-lg border border-slate-600 bg-slate-900/70 text-slate-100 hover:border-blue-400/50 hover:text-blue-300"
            >
              Transfer History
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
