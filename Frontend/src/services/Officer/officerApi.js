import axiosInstance from "@/helpers/axiosInstance";

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
    const res = await axiosInstance.put(
      `/gd-report/update-general-dairy-status/${gdId}`,
      data,
    );
    return res.data;
  } catch {
    return { success: false, message: "Failed" };
  }
}

export async function getAllCriminals() {
  try {
    const res = await axiosInstance.get("/criminal/get-criminals");
    return res.data;
  } catch {
    return { success: false, data: [] };
  }
}

export async function searchCriminals(query) {
  try {
    const res = await axiosInstance.get(
      `/criminal/search-criminals?q=${encodeURIComponent(query)}`,
    );
    return res.data;
  } catch {
    return { success: false, data: [] };
  }
}

export async function getAllArrestRecords() {
  try {
    const res = await axiosInstance.get("/arrest-record/get-arrest-records");
    return res.data;
  } catch {
    return { success: false, data: [] };
  }
}

export async function getAllBailRecords() {
  try {
    const res = await axiosInstance.get("/bail-record/get-bail-records");
    return res.data;
  } catch {
    return { success: false, data: [] };
  }
}

export async function getAllIncarcerations() {
  try {
    const res = await axiosInstance.get("/incarceration/get-incarcerations");
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

export async function getAllOrganizations() {
  try {
    const res = await axiosInstance.get("/organization/get-all-organizations");
    return res.data;
  } catch {
    return { success: false, data: [] };
  }
}

export async function getAllJails() {
  try {
    const res = await axiosInstance.get("/jail/get-jails");
    return res.data;
  } catch {
    return { success: false, data: [] };
  }
}