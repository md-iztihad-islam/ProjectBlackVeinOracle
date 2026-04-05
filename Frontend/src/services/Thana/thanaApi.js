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

export async function getCriminalById(criminalId) {
	try {
		const res = await axiosInstance.get(`/criminal/get-criminal/${criminalId}`);
		return res.data;
	} catch {
		return { success: false, data: null };
	}
}

export async function getCriminalFullProfile(criminalId) {
	try {
		const res = await axiosInstance.get(`/criminal/profile/${criminalId}`);
		return res.data;
	} catch {
		return { success: false, data: null };
	}
}

export async function getCriminalTimeline(criminalId) {
	try {
		const res = await axiosInstance.get(`/criminal/timeline/${criminalId}`);
		return res.data;
	} catch {
		return { success: false, data: [] };
	}
}

export async function getCriminalCaseHistory(criminalId) {
	try {
		const res = await axiosInstance.get(`/criminal/case-history/${criminalId}`);
		return res.data;
	} catch {
		return { success: false, data: [] };
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

export async function getOfficerById(officerId) {
	try {
		const res = await axiosInstance.get(`/officer/get-officer-by-id/${officerId}`);
		return res.data;
	} catch {
		return { success: false, data: null };
	}
}

export async function deleteOfficer(officerId) {
	try {
		const res = await axiosInstance.delete(`/officer/delete-officer/${officerId}`);
		return res.data;
	} catch (e) {
		return { success: false, message: e.response?.data?.message || "Failed" };
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

export async function getCaseFileById(caseId) {
	try {
		const res = await axiosInstance.get(`/case-file/get-case-file/${caseId}`);
		return res.data;
	} catch {
		return { success: false, data: null };
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

export async function updateLocation(locationId, data) {
	try {
		const res = await axiosInstance.put(`/location/update-location/${locationId}`, data);
		return res.data;
	} catch (e) {
		return { success: false, message: e.response?.data?.message || "Failed" };
	}
}

export async function getLocationById(locationId) {
	try {
		const res = await axiosInstance.get(`/location/get-location/${locationId}`);
		return res.data;
	} catch {
		return { success: false, data: null };
	}
}

export async function deleteLocation(locationId) {
	try {
		const res = await axiosInstance.delete(`/location/delete-location/${locationId}`);
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

export async function getAllOrganizations() {
	try {
		const res = await axiosInstance.get("/organization/get-all-organizations");
		return res.data;
	} catch {
		return { success: false, data: [] };
	}
}

export async function getAllLocations() {
	try {
		const res = await axiosInstance.get("/location/get-all-locations");
		return res.data;
	} catch {
		return { success: false, data: [] };
	}
}

export async function getAllCriminalOrganizationLinks() {
	try {
		const res = await axiosInstance.get("/criminal-organization/get-all-links");
		return res.data;
	} catch {
		return { success: false, data: [] };
	}
}

export async function getAllCriminalRelations() {
	try {
		const res = await axiosInstance.get("/criminal-relation/get-all-relations");
		return res.data;
	} catch {
		return { success: false, data: [] };
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

export async function updateGDReportStatus(gdId, data) {
	try {
		const res = await axiosInstance.put(`/gd-report/update-general-dairy-status/${gdId}`, data);
		return res.data;
	} catch (e) {
		return { success: false, message: e.response?.data?.message || "Failed" };
	}
}

export async function addCriminalOrganizationLink(data) {
	try {
		const res = await axiosInstance.post("/criminal-organization/add-link", data);
		return res.data;
	} catch (e) {
		return { success: false, message: e.response?.data?.message || "Failed" };
	}
}

export async function updateCriminalOrganizationLink(criminalId, orgId, data) {
	try {
		const res = await axiosInstance.put(`/criminal-organization/update-link/${criminalId}/${orgId}`, data);
		return res.data;
	} catch (e) {
		return { success: false, message: e.response?.data?.message || "Failed" };
	}
}

export async function updateCriminalRelation(relationId, data) {
	try {
		const res = await axiosInstance.put(`/criminal-relation/update-relation/${relationId}`, data);
		return res.data;
	} catch (e) {
		return { success: false, message: e.response?.data?.message || "Failed" };
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
