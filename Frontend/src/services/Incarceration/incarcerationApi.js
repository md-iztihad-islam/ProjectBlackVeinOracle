import axiosInstance from "@/helpers/axiosInstance";

const extractApiError = (e) => ({
  status: e?.response?.status || 0,
  message: e?.response?.data?.message || e?.message || "Request failed",
});

export async function getTransferHistory(criminalId) {
  try {
    const res = await axiosInstance.get(`/incarceration/transfers/${criminalId}`);
    return res.data;
  } catch (e) {
    return { success: false, data: [], error: extractApiError(e) };
  }
}

export async function transferCriminal(payload) {
  try {
    const res = await axiosInstance.post("/incarceration/transfer", payload);
    return res.data;
  } catch (e) {
    return {
      success: false,
      message: e?.response?.data?.message || "Transfer failed",
      error: extractApiError(e),
    };
  }
}

export async function findAvailableCell(jailId) {
  try {
    const res = await axiosInstance.get(`/incarceration/find-cell/${jailId}`);
    return res.data;
  } catch (e) {
    return { success: false, data: null, error: extractApiError(e) };
  }
}

export async function getIncarcerationsByJail(jailId) {
  try {
    const res = await axiosInstance.get(`/incarceration/get-incarcerations-by-jail/${jailId}`);
    return res.data;
  } catch (e) {
    return { success: false, data: [], error: extractApiError(e) };
  }
}

export async function addIncarceration(payload) {
  try {
    const res = await axiosInstance.post("/incarceration/add-incarceration", payload);
    return res.data;
  } catch (e) {
    return {
      success: false,
      message: e?.response?.data?.message || "Failed to add incarceration",
      error: extractApiError(e),
    };
  }
}

export async function releaseIncarceration(incarcerationId, payload = {}) {
  try {
    const res = await axiosInstance.put(`/incarceration/release-incarceration/${incarcerationId}`, payload);
    return res.data;
  } catch (e) {
    return {
      success: false,
      message: e?.response?.data?.message || "Release failed",
      error: extractApiError(e),
    };
  }
}
