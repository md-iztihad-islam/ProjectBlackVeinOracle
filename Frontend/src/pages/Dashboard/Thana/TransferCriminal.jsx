import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  findAvailableCell,
  transferCriminal,
} from "@/services/Incarceration/incarcerationApi";

function TransferCriminal() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    criminalId: "",
    fromJailId: "",
    toJailId: "",
    toCellId: "",
    reason: "",
    authorizedBy: "",
  });
  const [cellLookupNote, setCellLookupNote] = useState("");

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const transferMut = useMutation({
    mutationFn: () => transferCriminal(form),
    onSuccess: (res) => {
      if (res?.success) {
        alert("Transfer successful.");
        navigate("/thana/transfer-history");
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
        setCellLookupNote(res?.error?.message || "No available cell found.");
      }
    },
  });

  const inputCls =
    "w-full bg-gray-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500/50";

  return (
    <div className="min-h-screen bg-gray-950 text-slate-200 p-6">
      <div className="max-w-2xl mx-auto bg-gray-900 border border-white/5 rounded-2xl p-6">
        <button
          onClick={() => navigate("/thana/dashboard")}
          className="text-sm text-blue-400 mb-4"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold mb-2">Transfer Criminal</h1>
        <p className="text-sm text-slate-400 mb-6">
          This action writes a transfer entry. After success, it appears in Transfer
          History for that `criminalId`.
        </p>

        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            transferMut.mutate();
          }}
        >
          <div>
            <label className="text-xs text-slate-400 uppercase">Criminal ID</label>
            <input
              required
              className={inputCls}
              placeholder="CRM-0000001"
              value={form.criminalId}
              onChange={(e) => set("criminalId", e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 uppercase">Authorized By (Officer ID)</label>
            <input
              required
              className={inputCls}
              placeholder="OFC-0000001"
              value={form.authorizedBy}
              onChange={(e) => set("authorizedBy", e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 uppercase">From Jail ID</label>
            <input
              required
              className={inputCls}
              placeholder="JAIL-0000001"
              value={form.fromJailId}
              onChange={(e) => set("fromJailId", e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 uppercase">To Jail ID</label>
            <input
              required
              className={inputCls}
              placeholder="JAIL-0000002"
              value={form.toJailId}
              onChange={(e) => set("toJailId", e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="text-xs text-slate-400 uppercase">To Cell ID (or Block ID)</label>
                <input
                  required
                  className={inputCls}
                  placeholder="CEL-0000001 or CLB-0000002"
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
            {cellLookupNote && (
              <p className="text-xs mt-2 text-indigo-300">{cellLookupNote}</p>
            )}
            <p className="text-[11px] mt-1 text-slate-500">
              If you enter a block ID (CLB-...), the backend will auto-pick an available cell in that block.
            </p>
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
              onClick={() => navigate("/thana/transfer-history")}
              className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-slate-200"
            >
              Go to Transfer History
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransferCriminal;
