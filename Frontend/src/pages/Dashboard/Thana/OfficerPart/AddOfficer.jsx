import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addOfficer, getAllRanks } from "@/services/Thana/thanaApi";
import userStore from "@/state/userStore";
import { useMutation, useQuery } from "@tanstack/react-query";

function AddOfficer() {
	const navigate = useNavigate();
	const { user } = userStore();
	const [form, setForm] = useState({
		badge_no: "",
		full_name: "",
		rank_code: "",
		phone: "",
		email: "",
		password: "",
	});
	const set = (k, v) => setForm({ ...form, [k]: v });
	const inputCls =
		"w-full bg-gray-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500/50";

	const { data: ranksData } = useQuery({
		queryKey: ["ranks"],
		queryFn: getAllRanks,
	});
	const ranks = ranksData?.data || [];

	const { mutate, isPending } = useMutation({
		mutationFn: () => addOfficer({ ...form, thana_id: user?.thana_id }),
		onSuccess: (r) => {
			if (r.success) {
				alert("Officer added!");
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
				<h1 className="text-2xl font-bold text-slate-100 mb-6">Add Officer</h1>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						mutate();
					}}
					className="flex flex-col gap-4"
				>
					<div>
						<label className="text-xs text-slate-400 uppercase">
							Badge Number
						</label>
						<input
							value={form.badge_no}
							onChange={(e) => set("badge_no", e.target.value)}
							placeholder="BD-OFC-XXX"
							className={inputCls}
							required
						/>
					</div>
					<div>
						<label className="text-xs text-slate-400 uppercase">
							Full Name
						</label>
						<input
							value={form.full_name}
							onChange={(e) => set("full_name", e.target.value)}
							className={inputCls}
							required
						/>
					</div>
					<div>
						<label className="text-xs text-slate-400 uppercase">Rank</label>
						<select
							value={form.rank_code}
							onChange={(e) => set("rank_code", e.target.value)}
							className={inputCls}
							required
						>
							<option value="">Select Rank</option>
							{ranks.map((r) => (
								<option key={r.rank_code} value={r.rank_code}>
									{r.rank_name}
								</option>
							))}
						</select>
					</div>
					<div>
						<label className="text-xs text-slate-400 uppercase">Phone</label>
						<input
							value={form.phone}
							onChange={(e) => set("phone", e.target.value)}
							className={inputCls}
							required
						/>
					</div>
					<div>
						<label className="text-xs text-slate-400 uppercase">Email</label>
						<input
							type="email"
							value={form.email}
							onChange={(e) => set("email", e.target.value)}
							className={inputCls}
							required
						/>
					</div>
					<div>
						<label className="text-xs text-slate-400 uppercase">Password</label>
						<input
							type="password"
							value={form.password}
							onChange={(e) => set("password", e.target.value)}
							className={inputCls}
							required
						/>
					</div>
					<button
						type="submit"
						disabled={isPending}
						className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-medium"
					>
						{isPending ? "Adding..." : "Add Officer"}
					</button>
				</form>
			</div>
		</div>
	);
}

export default AddOfficer;
