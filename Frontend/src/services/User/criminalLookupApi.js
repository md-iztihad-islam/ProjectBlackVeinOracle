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
