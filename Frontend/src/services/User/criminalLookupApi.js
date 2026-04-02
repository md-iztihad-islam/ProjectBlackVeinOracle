import axiosInstance from "@/helpers/axiosInstance";

export async function getWantedCriminalsApi() {
  try {
    const res = await axiosInstance.get("/criminal/wanted");
    return res.data;
  } catch {
    return { success: false, data: [] };
  }
}

export async function getCriminalsByAreaApi(district) {
  try {
    const res = await axiosInstance.get(
      `/criminal/area/${encodeURIComponent(district)}`,
    );
    return res.data;
  } catch {
    return { success: false, data: [] };
  }
}

export async function getCriminalFullProfileApi(criminalId) {
  try {
    const res = await axiosInstance.get(`/criminal/profile/${criminalId}`);
    return res.data;
  } catch {
    return { success: false, data: null };
  }
}

export async function getCriminalTimelineApi(criminalId) {
  try {
    const res = await axiosInstance.get(`/criminal/timeline/${criminalId}`);
    return res.data;
  } catch {
    return { success: false, data: [] };
  }
}

export async function getCriminalCaseHistoryApi(criminalId) {
  try {
    const res = await axiosInstance.get(`/criminal/case-history/${criminalId}`);
    return res.data;
  } catch {
    return { success: false, data: [] };
  }
}
