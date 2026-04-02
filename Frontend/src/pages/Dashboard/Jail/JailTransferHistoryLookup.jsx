import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTransferHistory } from "@/services/Incarceration/incarcerationApi";
import userStore from "@/state/userStore";

export default function JailTransferHistoryLookup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = userStore();
  const jailId = user?.jail_id;

  const [criminalId, setCriminalId] = useState(location.state?.criminalId || "");
  const [submittedId, setSubmittedId] = useState(location.state?.criminalId || "");

  const {
    data: history,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["jail-transfer-history", submittedId],
    queryFn: () => getTransferHistory(submittedId),
    enabled: !!submittedId,
  });

  const rows = Array.isArray(history?.data) ? history.data : [];
  const filteredRows = jailId
    ? rows.filter((r) => r?.from_jail_id === jailId || r?.to_jail_id === jailId)
    : rows;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!criminalId.trim()) return;
    setSubmittedId(criminalId.trim());
  };

  const handleBack = () => {
    if (location.state?.modal) {
      navigate(-1);
      return;
    }
    navigate("/jail/dashboard");
  };

  return (
    <div className="w-full max-w-6xl mx-auto text-slate-200">
      <div className="bg-gray-900/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Transfer History</h1>
            <p className="text-sm text-slate-400 mt-1">Showing records related to your jail account</p>
          </div>
          <button
            onClick={handleBack}
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
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm">
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
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                        No transfer history found for this jail.
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((item, idx) => (
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
