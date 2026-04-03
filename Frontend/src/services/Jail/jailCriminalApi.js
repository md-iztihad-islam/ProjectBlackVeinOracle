import axiosInstance from "@/helpers/axiosInstance";

export async function getCriminalFullProfileForJail(criminalId) {
  try {
    const res = await axiosInstance.get(`/analytics/criminal-full-profile/${criminalId}`);
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to fetch criminal profile",
      data: null,
    };
  }
}

export async function getCriminalTimelineForJail(criminalId) {
  try {
    const res = await axiosInstance.get(`/criminal/timeline/${criminalId}`);
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to fetch criminal timeline",
      data: [],
    };
  }
}

export async function getCriminalCaseHistoryForJail(criminalId) {
  try {
    const res = await axiosInstance.get(`/criminal/case-history/${criminalId}`);
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to fetch criminal case history",
      data: [],
    };
  }
}
