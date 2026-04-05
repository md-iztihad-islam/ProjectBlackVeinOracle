import axiosInstance from "@/helpers/axiosInstance";

const buildParams = (params = {}) => {
  const clean = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      clean[key] = value;
    }
  });
  return clean;
};

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

export const getGdReportAnalytics = (params = {}) =>
  safe(() => axiosInstance.get("/analytics/gd-report-analytics", { params: buildParams(params) }), {
    success: false,
    data: {},
  });

// export const getBailStatistics = () =>
//   safe(() => axiosInstance.get("/analytics/bail-statistics"), {
//     success: false,
//     data: {},
//   });

export const getDistrictCrimeStats = () =>
  safe(() => axiosInstance.get("/analytics/district-crime-stats"), {
    success: false,
    data: [],
  });

export const getOfficerWorkload = (params = {}) =>
  safe(() => axiosInstance.get("/analytics/officer-workload", { params: buildParams(params) }), {
    success: false,
    data: [],
  });

export const getOfficerRanking = (params = {}) =>
  safe(() => axiosInstance.get("/analytics/officer-ranking", { params: buildParams(params) }), {
    success: false,
    data: [],
  });

export const getCriminalRanking = (params = {}) =>
  safe(() => axiosInstance.get("/analytics/criminal-ranking", { params: buildParams(params) }), {
    success: false,
    data: [],
  });

export const getCriminalOverview = (params = {}) =>
  safe(() => axiosInstance.get("/analytics/criminal-overview", { params: buildParams(params) }), {
    success: false,
    data: {},
  });

export const getCriminalByDistrict = (params = {}) =>
  safe(() => axiosInstance.get("/analytics/criminal-by-district", { params: buildParams(params) }), {
    success: false,
    data: [],
  });

export const getCrimeTypeDistribution = (params = {}) =>
  safe(() => axiosInstance.get("/analytics/crime-type-distribution", { params: buildParams(params) }), {
    success: false,
    data: [],
  });

export const getCrimePeakByYear = (params = {}) =>
  safe(() => axiosInstance.get("/analytics/crime-peak-by-year", { params: buildParams(params) }), {
    success: false,
    data: [],
  });

export const getWantedByArea = (params = {}) =>
  safe(() => axiosInstance.get("/analytics/wanted-by-area", { params: buildParams(params) }), {
    success: false,
    data: [],
  });

export const getCrimeYears = () =>
  safe(() => axiosInstance.get("/analytics/crime-years"), {
    success: false,
    data: [],
  });

export const getThanaPerformance = (params = {}) =>
  safe(() => axiosInstance.get("/analytics/thana-performance", { params: buildParams(params) }), {
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

export const getAdminJailOverview = (params = {}) =>
  safe(() => axiosInstance.get("/analytics/admin-jail-overview", { params: buildParams(params) }), {
    success: false,
    data: {},
  });

export const getAdminJailDetails = (jailId) =>
  safe(() => axiosInstance.get(`/analytics/admin-jail-details/${jailId}`), {
    success: false,
    data: null,
  });
