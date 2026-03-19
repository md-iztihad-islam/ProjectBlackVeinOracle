import axiosInstance from "@/helpers/axiosInstance";

export async function getCriminalsByThana(thanaId) {
	try {
		const res = await axiosInstance.get(
			`/criminal/get-criminals-by-thana/${thanaId}`,
		);
		return res.data;
	} catch {
		return { success: false, data: [] };
	}
}

export async function addCriminal(data) {
	try {
		const res = await axiosInstance.post("/criminal/add-criminal", data);
		return res.data;
	} catch (e) {
		return { success: false, message: e.response?.data?.message || "Failed" };
	}
}

export async function updateCriminal(criminalId, data) {
	try {
		const res = await axiosInstance.put(
			`/criminal/update-criminal/${criminalId}`,
			data,
		);
		return res.data;
	} catch {
		return { success: false, message: "Failed" };
	}
}

export async function getOfficersByThana(thanaId) {
	try {
		const res = await axiosInstance.get(
			`/officer/get-officers-by-thana/${thanaId}`,
		);
		return res.data;
	} catch {
		return { success: false, data: [] };
	}
}

export async function addOfficer(data) {
	try {
		const res = await axiosInstance.post("/officer/add-officer", data);
		return res.data;
	} catch (e) {
		return { success: false, message: e.response?.data?.message || "Failed" };
	}
}

export async function updateOfficer(officerId, data) {
	try {
		const res = await axiosInstance.put(
			`/officer/update-officer/${officerId}`,
			data,
		);
		return res.data;
	} catch {
		return { success: false, message: "Failed" };
	}
}

export async function getCaseFilesByThana(thanaId) {
	try {
		const res = await axiosInstance.get(
			`/case-file/get-case-files-by-thana/${thanaId}`,
		);
		return res.data;
	} catch {
		return { success: false, data: [] };
	}
}

export async function addCaseFile(data) {
	try {
		const res = await axiosInstance.post("/case-file/add-case-file", data);
		return res.data;
	} catch (e) {
		return { success: false, message: e.response?.data?.message || "Failed" };
	}
}

export async function updateCaseFile(caseId, data) {
	try {
		const res = await axiosInstance.put(
			`/case-file/update-case-file/${caseId}`,
			data,
		);
		return res.data;
	} catch {
		return { success: false, message: "Failed" };
	}
}

export async function addLocation(data) {
	try {
		const res = await axiosInstance.post("/location/add-location", data);
		return res.data;
	} catch (e) {
		return { success: false, message: e.response?.data?.message || "Failed" };
	}
}

export async function addOrganization(data) {
	try {
		const res = await axiosInstance.post(
			"/organization/add-organization",
			data,
		);
		return res.data;
	} catch (e) {
		return { success: false, message: e.response?.data?.message || "Failed" };
	}
}

export async function getGDReportsByThana(thanaId) {
	try {
		const res = await axiosInstance.get(
			`/gd-report/get-general-dairies-by-thana/${thanaId}`,
		);
		return res.data;
	} catch {
		return { success: false, data: [] };
	}
}

export async function getAllRanks() {
	try {
		const res = await axiosInstance.get("/rank/get-all-ranks");
		return res.data;
	} catch {
		return { success: false, data: [] };
	}
}
