import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getWantedCriminalsApi,
  getCriminalFullProfileApi,
  getCriminalTimelineApi,
  getCriminalCaseHistoryApi,
} from "@/services/User/criminalLookupApi";

function WantedCriminals() {
  const navigate = useNavigate();
  const [selectedCriminal, setSelectedCriminal] = useState(null);
  const [selectedCaseFile, setSelectedCaseFile] = useState(null);
  const { data, isLoading } = useQuery({
    queryKey: ["user-wanted-criminals"],
    queryFn: getWantedCriminalsApi,
  });
  const selectedCriminalId = selectedCriminal?.criminal_id || "";
  const { data: selectedCriminalProfileData } = useQuery({
    queryKey: ["user-criminal-profile", selectedCriminalId],
    queryFn: () => getCriminalFullProfileApi(selectedCriminalId),
    enabled: Boolean(selectedCriminalId),
  });
  const { data: selectedCriminalTimelineData } = useQuery({
    queryKey: ["user-criminal-timeline", selectedCriminalId],
    queryFn: () => getCriminalTimelineApi(selectedCriminalId),
    enabled: Boolean(selectedCriminalId),
  });
  const { data: selectedCriminalCaseHistoryData } = useQuery({
    queryKey: ["user-criminal-case-history", selectedCriminalId],
    queryFn: () => getCriminalCaseHistoryApi(selectedCriminalId),
    enabled: Boolean(selectedCriminalId),
  });

  const rows = data?.data || [];
  const selectedCriminalProfile = selectedCriminalProfileData?.data || null;
  const selectedCriminalTimeline = selectedCriminalTimelineData?.data || [];
  const selectedCriminalCaseHistory = selectedCriminalCaseHistoryData?.data || [];

  return (
    <div className="user-wanted-page min-h-screen bg-gray-950 text-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Wanted Criminals</h1>
          <button
            onClick={() => navigate("/user/dashboard")}
            className="text-blue-400 text-sm"
          >
            ← Back to Dashboard
          </button>
        </div>

        {isLoading ? (
          <p className="text-slate-400">Loading...</p>
        ) : rows.length === 0 ? (
          <p className="text-slate-400">No wanted criminals found.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-gray-900">
                <tr>
                  <th className="text-left px-4 py-3">Criminal ID</th>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Risk</th>
                  <th className="text-left px-4 py-3">Registered Thana</th>
                  <th className="text-left px-4 py-3">Last Seen District</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.criminal_id}
                    className="user-row-hover border-t border-white/10 hover:bg-white/[0.03] cursor-pointer"
                    onClick={() => setSelectedCriminal(r)}
                  >
                    <td className="px-4 py-3 font-mono">{r.criminal_id}</td>
                    <td className="px-4 py-3">{r.full_name}</td>
                    <td className="px-4 py-3 capitalize">{r.status}</td>
                    <td className="px-4 py-3">{r.risk_level}</td>
                    <td className="px-4 py-3">{r.registered_thana || r.thana_name || r.registered_thana_id || "N/A"}</td>
                    <td className="px-4 py-3">{r.last_seen_district || r.district || "Unknown"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedCriminal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
          onClick={() => setSelectedCriminal(null)}
        >
          <div
            className="w-full max-w-4xl bg-gray-900 border border-white/10 rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500">Criminal Profile</p>
                <h3 className="text-xl font-bold text-slate-100 mt-1">{selectedCriminal.full_name}</h3>
              </div>
              <button onClick={() => setSelectedCriminal(null)} className="text-slate-400 hover:text-slate-200 text-sm">Close</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
              <Info label="Criminal ID" value={selectedCriminal.criminal_id} mono />
              <Info label="NID" value={selectedCriminal.nid} mono />
              <Info label="Status" value={selectedCriminal.status} />
              <Info label="Risk Level" value={selectedCriminal.risk_level != null ? `${selectedCriminal.risk_level}/10` : "—"} />
              <Info label="Gender" value={selectedCriminalProfile?.gender} />
              <Info label="Age" value={selectedCriminalProfile?.age ?? selectedCriminal.age ?? "—"} />
              <Info label="Father's Name" value={selectedCriminalProfile?.father_name} />
              <Info label="Mother's Name" value={selectedCriminalProfile?.mother_name} />
              <Info label="Registered Thana" value={selectedCriminalProfile?.registered_thana || selectedCriminal.registered_thana} />
              <Info label="Open Cases" value={selectedCriminalProfile?.open_cases ?? "—"} />
              <Info label="Closed Cases" value={selectedCriminalProfile?.closed_cases ?? "—"} />
              <Info label="Total Arrests" value={selectedCriminalProfile?.total_arrests ?? "—"} />
            </div>

            <div className="mb-4">
              <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Legal History Timeline</p>
              <div className="bg-gray-800 border border-white/5 rounded-lg overflow-hidden">
                {selectedCriminalTimeline.length === 0 ? (
                  <p className="p-4 text-sm text-slate-400">No legal history found.</p>
                ) : (
                  <ul className="divide-y divide-white/5">
                    {selectedCriminalTimeline.map((item, idx) => (
                      <li key={`${item.event_type}-${item.event_date}-${idx}`} className="p-3">
                        <p className="text-xs text-slate-500">{item.event_date ? new Date(item.event_date).toLocaleString() : "—"}</p>
                        <p className="text-sm font-semibold text-slate-200 mt-1">{item.event_type}</p>
                        <p className="text-sm text-slate-300 mt-1 whitespace-pre-wrap">{item.description}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Case Files</p>
              <div className="bg-gray-800 border border-white/5 rounded-lg overflow-hidden">
                {selectedCriminalCaseHistory.length === 0 ? (
                  <p className="p-4 text-sm text-slate-400">No case file history found.</p>
                ) : (
                  <ul className="divide-y divide-white/5">
                    {selectedCriminalCaseHistory.map((c) => (
                      <li
                        key={c.case_id}
                        className="p-3 cursor-pointer hover:bg-white/[0.03]"
                        onClick={() => setSelectedCaseFile(c)}
                      >
                        <p className="text-sm text-slate-200 font-semibold">Case #{c.case_id}: {c.case_title || "Untitled Case"}</p>
                        <p className="text-xs text-slate-400 mt-1">{c.case_type} | {c.status} | Registered: {c.filed_at ? new Date(c.filed_at).toLocaleString() : "—"}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedCaseFile && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80] flex items-center justify-center p-4"
          onClick={() => setSelectedCaseFile(null)}
        >
          <div
            className="w-full max-w-2xl bg-gray-900 border border-white/10 rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500">Case Details</p>
                <h3 className="text-xl font-bold text-slate-100 mt-1">
                  {selectedCaseFile.case_title || "Untitled Case"}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCaseFile(null)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
              <Info label="Case ID" value={selectedCaseFile.case_id} mono />
              <Info label="Case Type" value={selectedCaseFile.case_type} />
              <Info label="Status" value={selectedCaseFile.status} />
              <Info
                label="Registered At"
                value={selectedCaseFile.filed_at ? new Date(selectedCaseFile.filed_at).toLocaleString() : "—"}
              />
              <Info label="Thana" value={selectedCaseFile.thana_name || "—"} />
              <Info label="Thana ID" value={selectedCaseFile.thana_id || "—"} mono />
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Description</p>
              <div className="bg-gray-800 border border-white/5 rounded-lg p-3 text-sm text-slate-300 whitespace-pre-wrap">
                {selectedCaseFile.description || "No description provided."}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, value, mono = false }) {
  return (
    <div className="bg-gray-800/70 border border-white/5 rounded-lg p-3">
      <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">{label}</p>
      <p className={`text-slate-200 ${mono ? "font-mono text-xs" : ""}`}>{value || "—"}</p>
    </div>
  );
}

export default WantedCriminals;
