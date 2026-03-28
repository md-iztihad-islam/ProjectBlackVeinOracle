import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	deleteOfficer,
	getOfficerById,
	updateOfficer,
} from "@/services/Thana/thanaApi";
import { useMutation, useQuery } from "@tanstack/react-query";

function UpdateOfficer() {
	const navigate = useNavigate();
	const { officerId } = useParams();
	const [form, setForm] = useState({
		full_name: "",
		phone: "",
		badge_no: "",
		rank_code: "",
		thana_id: "",
	});
	const set = (k, v) => setForm({ ...form, [k]: v });
	const inputCls =
		"w-full bg-gray-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500/50";

	const { data: officerData, isLoading: isLoadingOfficer } = useQuery({
		queryKey: ["officer-by-id", officerId],
		queryFn: () => getOfficerById(officerId),
		enabled: Boolean(officerId),
	});

	const currentOfficer = officerData?.data || {};

	const { mutate, isPending } = useMutation({
		mutationFn: () => {
			const payload = {
				full_name: form.full_name || currentOfficer.full_name || "",
				phone: form.phone || currentOfficer.phone || "",
				badge_no: form.badge_no || currentOfficer.badge_no || "",
				rank_code: form.rank_code || currentOfficer.rank_code || "",
				thana_id: form.thana_id || currentOfficer.thana_id || "",
			};
			return updateOfficer(officerId, payload);
		},
		onSuccess: (r) => {
			if (r.success) {
				alert("Updated!");
				navigate("/thana/dashboard");
			} else alert(r.message || "Failed");
		},
	});

	const { mutate: removeOfficer, isPending: isRemoving } = useMutation({
		mutationFn: () => deleteOfficer(officerId),
		onSuccess: (r) => {
			if (r.success) {
				alert("Officer removed!");
				navigate("/thana/dashboard");
			} else alert(r.message || "Failed");
		},
	});

	return (
		<div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
			<div className="w-full max-w-lg bg-gray-900 border border-white/[0.07] rounded-2xl p-6">
				<button
					onClick={() => navigate("/thana/dashboard")}
					className="text-sm text-blue-400 mb-4"
				>
					← Back
				</button>
				<h1 className="text-2xl font-bold text-slate-100 mb-2">
					Update Officer
				</h1>
				<p className="text-sm text-slate-500 mb-6 font-mono">{officerId}</p>
				{isLoadingOfficer && (
					<p className="text-sm text-slate-400 mb-4">Loading current data...</p>
				)}
				<form
					onSubmit={(e) => {
						e.preventDefault();
						mutate();
					}}
					className="flex flex-col gap-4"
				>
					<div>
						<label className="text-xs text-slate-400 uppercase">
							Full Name
						</label>
						<input
							value={form.full_name || currentOfficer.full_name || ""}
							onChange={(e) => set("full_name", e.target.value)}
							className={inputCls}
						/>
					</div>
					<div>
						<label className="text-xs text-slate-400 uppercase">Phone</label>
						<input
							value={form.phone || currentOfficer.phone || ""}
							onChange={(e) => set("phone", e.target.value)}
							className={inputCls}
						/>
					</div>
					<div>
						<label className="text-xs text-slate-400 uppercase">Badge No</label>
						<input
							value={form.badge_no || currentOfficer.badge_no || ""}
							onChange={(e) => set("badge_no", e.target.value)}
							className={inputCls}
						/>
					</div>
					<div>
						<label className="text-xs text-slate-400 uppercase">Rank Code</label>
						<input
							value={form.rank_code || currentOfficer.rank_code || ""}
							onChange={(e) => set("rank_code", e.target.value)}
							className={inputCls}
						/>
					</div>
					<div>
						<label className="text-xs text-slate-400 uppercase">Thana ID</label>
						<input
							value={form.thana_id || currentOfficer.thana_id || ""}
							onChange={(e) => set("thana_id", e.target.value)}
							className={inputCls}
						/>
					</div>
					<button
						type="submit"
						disabled={isPending}
						className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-medium"
					>
						{isPending ? "Updating..." : "Update Officer"}
					</button>
					<button
						type="button"
						disabled={isRemoving}
						onClick={() => {
							if (window.confirm("Remove this officer? This cannot be undone.")) {
								removeOfficer();
							}
						}}
						className="w-full bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-lg font-medium"
					>
						{isRemoving ? "Removing..." : "Remove Officer"}
					</button>
				</form>
			</div>
		</div>
	);
}

export default UpdateOfficer;
