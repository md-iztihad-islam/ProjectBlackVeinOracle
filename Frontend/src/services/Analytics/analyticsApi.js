import axiosInstance from "@/helpers/axiosInstance";

const extractApiError = (e) => ({
  status: e?.response?.status || 0,
  message: e?.response?.data?.message || e?.message || "Request failed",
});

const safe = async (fn, fallback) => {
  try {
    const res = await fn();
    return res.data;
  } catch (e) {
    return { ...fallback, error: extractApiError(e) };
  }
};

export const getGdReportAnalytics = () =>
  safe(() => axiosInstance.get("/analytics/gd-report-analytics"), {
    success: false,
    data: {},
  });

export const getBailStatistics = () =>
  safe(() => axiosInstance.get("/analytics/bail-statistics"), {
    success: false,
    data: {},
  });

export const getDistrictCrimeStats = () =>
  safe(() => axiosInstance.get("/analytics/district-crime-stats"), {
    success: false,
    data: [],
  });

export const getOfficerWorkload = () =>
  safe(() => axiosInstance.get("/analytics/officer-workload"), {
    success: false,
    data: [],
  });

export const getCriminalRanking = () =>
  safe(() => axiosInstance.get("/analytics/criminal-ranking"), {
    success: false,
    data: [],
  });

export const getThanaPerformance = () =>
  safe(() => axiosInstance.get("/analytics/thana-performance"), {
    success: false,
    data: [],
  });

export const getCustodyOverview = () =>
  safe(() => axiosInstance.get("/analytics/custody-overview"), {
    success: false,
    data: {},
  });

export const getInmatesDueForBail = () =>
  safe(() => axiosInstance.get("/analytics/inmates-due-for-bail"), {
    success: false,
    data: [],
  });

export const getCellOccupancyDetails = (jailId) =>
  safe(() => axiosInstance.get(`/analytics/cell-occupancy-details/${jailId}`), {
    success: false,
    data: [],
  });
