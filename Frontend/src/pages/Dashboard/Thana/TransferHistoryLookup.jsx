import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getTransferHistory } from "@/services/Incarceration/incarcerationApi";

function TransferHistoryLookup() {
  const navigate = useNavigate();
  const [criminalId, setCriminalId] = useState("");
  const [submittedId, setSubmittedId] = useState("");

  const {
    data: history,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["transfer-history", submittedId],
    queryFn: () => getTransferHistory(submittedId),
    enabled: !!submittedId,
  });

  const rows = Array.isArray(history?.data) ? history.data : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!criminalId.trim()) return;
    setSubmittedId(criminalId.trim());
  };

  return (
    <div className="min-h-screen bg-gray-950 text-slate-200 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Transfer History Lookup</h1>
          <button
            onClick={() => navigate("/thana/dashboard")}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm"
          >
            Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-900 border border-white/5 rounded-xl p-4 mb-4">
          <label className="text-sm text-slate-400 block mb-2">Criminal ID</label>
          <div className="flex gap-2">
            <input
              value={criminalId}
              onChange={(e) => setCriminalId(e.target.value)}
              placeholder="Enter criminal ID"
              className="flex-1 bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm"
            >
              Fetch
            </button>
          </div>
        </form>

        {isFetching && <p className="text-sm text-slate-400">Loading transfer history...</p>}

        {isError && (
          <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            {error?.response?.data?.message || error?.message || "Failed to load history"}
          </div>
        )}

        {!isFetching && submittedId && !isError && (
          <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5 text-sm text-slate-300">
              Results for Criminal ID: <span className="font-semibold">{submittedId}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-800/80 text-slate-400">
                  <tr>
                    <th className="text-left px-4 py-3">From Jail</th>
                    <th className="text-left px-4 py-3">To Jail</th>
                    <th className="text-left px-4 py-3">Transfer Date</th>
                    <th className="text-left px-4 py-3">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                        No transfer history found.
                      </td>
                    </tr>
                  ) : (
                    rows.map((item, idx) => (
                      <tr key={item.transfer_id || idx} className="border-t border-white/5">
                        <td className="px-4 py-3">{item.from_jail_name || item.from_jail_id || "-"}</td>
                        <td className="px-4 py-3">{item.to_jail_name || item.to_jail_id || "-"}</td>
                        <td className="px-4 py-3">
                          {item.transferred_at
                            ? new Date(item.transferred_at).toLocaleString()
                            : item.transfer_date
                            ? new Date(item.transfer_date).toLocaleString()
                            : "-"}
                        </td>
                        <td className="px-4 py-3">{item.transfer_reason || item.reason || "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TransferHistoryLookup;
