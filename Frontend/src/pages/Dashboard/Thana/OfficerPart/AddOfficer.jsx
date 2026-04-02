import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addOfficer, getAllRanks } from "@/services/Thana/thanaApi";
import userStore from "@/state/userStore";
import { useMutation, useQuery } from "@tanstack/react-query";

function AddOfficer() {
	const navigate = useNavigate();
	const location = useLocation();
	const isModal = Boolean(location.state?.modal);
	const { user } = userStore();
	const [form, setForm] = useState({
		badge_no: "",
		full_name: "",
		rank_code: "",
		phone: "",
		email: "",
		nid_number: "",
		father_name: "",
		mother_name: "",
		birth_date: "",
		gender: "",
		image_url: "",
		password: "",
	});
	const [imagePreview, setImagePreview] = useState("");
	const set = (k, v) => setForm({ ...form, [k]: v });
	const inputCls =
		"w-full bg-gray-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500/50";

	const computedAge = (() => {
		if (!form.birth_date) return "";
		const dob = new Date(form.birth_date);
		if (Number.isNaN(dob.getTime())) return "";
		const now = new Date();
		let age = now.getFullYear() - dob.getFullYear();
		const m = now.getMonth() - dob.getMonth();
		if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age -= 1;
		return age >= 0 ? age : "";
	})();

	const handleImageFileChange = (event) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = () => {
			const result = typeof reader.result === "string" ? reader.result : "";
			set("image_url", result);
			setImagePreview(result);
		};
		reader.readAsDataURL(file);
	};

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
		<div className={isModal ? "flex items-center justify-center p-0" : "min-h-screen bg-gray-950 flex items-center justify-center p-4"}>
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
						<label className="text-xs text-slate-400 uppercase">NID Number</label>
						<input
							value={form.nid_number}
							onChange={(e) => set("nid_number", e.target.value)}
							className={inputCls}
							required
						/>
					</div>
					<div>
						<label className="text-xs text-slate-400 uppercase">Father's Name</label>
						<input
							value={form.father_name}
							onChange={(e) => set("father_name", e.target.value)}
							className={inputCls}
							required
						/>
					</div>
					<div>
						<label className="text-xs text-slate-400 uppercase">Mother's Name</label>
						<input
							value={form.mother_name}
							onChange={(e) => set("mother_name", e.target.value)}
							className={inputCls}
							required
						/>
					</div>
					<div>
						<label className="text-xs text-slate-400 uppercase">Birth Date</label>
						<input
							type="date"
							value={form.birth_date}
							onChange={(e) => set("birth_date", e.target.value)}
							className={inputCls}
							required
						/>
						{computedAge !== "" && (
							<p className="mt-1 text-xs text-blue-300">Calculated Age: {computedAge}</p>
						)}
					</div>
					<div>
						<label className="text-xs text-slate-400 uppercase">Gender</label>
						<select
							value={form.gender}
							onChange={(e) => set("gender", e.target.value)}
							className={inputCls}
							required
						>
							<option value="">Select gender</option>
							<option value="male">Male</option>
							<option value="female">Female</option>
							<option value="other">Other</option>
						</select>
					</div>
					<div>
						<label className="text-xs text-slate-400 uppercase">Officer Image</label>
						<input
							type="file"
							accept="image/*"
							onChange={handleImageFileChange}
							className={`${inputCls} file:mr-3 file:border-0 file:bg-blue-600/20 file:text-blue-300 file:px-3 file:py-1.5 file:rounded-md`}
							required={!form.image_url}
						/>
						<p className="mt-1 text-xs text-slate-500">Upload a clear profile image for officer profile rendering.</p>
					</div>
					{(imagePreview || form.image_url) && (
						<div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-white/10">
							<div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-br from-blue-400 via-cyan-300 to-blue-600">
								<img
									src={imagePreview || form.image_url}
									alt="Officer preview"
									className="w-full h-full object-cover rounded-full"
								/>
							</div>
							<div>
								<p className="text-sm text-slate-200 font-semibold">Profile Preview</p>
								<p className="text-xs text-slate-400">This image will appear in officer profile cards.</p>
							</div>
						</div>
					)}
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
