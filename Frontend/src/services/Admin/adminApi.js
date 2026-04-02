import axiosInstance from "@/helpers/axiosInstance";

const extractApiError = (e) => ({
	status: e?.response?.status || 0,
	message: e?.response?.data?.message || e?.message || "Request failed",
});

export async function getAllThanas() {
	try {
		const res = await axiosInstance.get("/thana/get-all-thanas");
		return res.data;
	} catch (e) {
		return { success: false, data: [], error: extractApiError(e) };
	}
}

export async function getAllOfficers() {
	try {
		const res = await axiosInstance.get("/officer/get-officers");
		return res.data;
	} catch (e) {
		return { success: false, data: [], error: extractApiError(e) };
	}
}

export async function getAllCriminals() {
	try {
		const res = await axiosInstance.get("/criminal/get-criminals");
		return res.data;
	} catch (e) {
		return { success: false, data: [], error: extractApiError(e) };
	}
}

export async function getAllRanks() {
	try {
		const res = await axiosInstance.get("/rank/get-all-ranks");
		return res.data;
	} catch (e) {
		return { success: false, data: [], error: extractApiError(e) };
	}
}

export async function getAllJails() {
	try {
		const res = await axiosInstance.get("/jail/get-jails");
		return res.data;
	} catch (e) {
		return { success: false, data: [], error: extractApiError(e) };
	}
}

export async function getAllUsers() {
	try {
		const res = await axiosInstance.get("/user/get-users");
		return res.data;
	} catch (e) {
		return { success: false, data: [], error: extractApiError(e) };
	}
}

export async function getAllGDReports() {
	try {
		const res = await axiosInstance.get("/gd-report/get-all-general-dairies");
		return res.data;
	} catch (e) {
		return { success: false, data: [], error: extractApiError(e) };
	}
}

export async function getDashboardOverview() {
	try {
		const res = await axiosInstance.get("/analytics/dashboard-overview");
		return res.data;
	} catch (e) {
		return { success: false, data: {}, error: extractApiError(e) };
	}
}

export async function addThana(data) {
	try {
		const res = await axiosInstance.post("/thana/add-thana", data);
		return res.data;
	} catch (e) {
		return { success: false, message: e.response?.data?.message || "Failed" };
	}
}

export async function addJail(data) {
	try {
		const res = await axiosInstance.post("/jail/add-jail", data);
		return res.data;
	} catch (e) {
		return { success: false, message: e.response?.data?.message || "Failed" };
	}
}

export async function updateThana(thanaId, data) {
	try {
		const res = await axiosInstance.put(`/thana/update-thana/${thanaId}`, data);
		return res.data;
	} catch {
		return { success: false, message: "Failed" };
	}
}

export async function deleteThana(thanaId) {
	try {
		const res = await axiosInstance.delete(`/thana/delete-thana/${thanaId}`);
		return res.data;
	} catch {
		return { success: false, message: "Failed" };
	}
}

export async function addRank(data) {
	try {
		const res = await axiosInstance.post("/rank/add-rank", data);
		return res.data;
	} catch (e) {
		return { success: false, message: e.response?.data?.message || "Failed" };
	}
}

export async function addHeadOfficer(data) {
	try {
		const res = await axiosInstance.post("/thana/add-head-officer", data);
		return res.data;
	} catch (e) {
		return { success: false, message: e.response?.data?.message || "Failed" };
	}
}
