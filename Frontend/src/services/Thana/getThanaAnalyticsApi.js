import axiosInstance from "@/helpers/axiosInstance";

const getThanaAnalyticsApi = async (filters = {}) => {
    // Strip null / undefined / empty-string values so the URL stays clean
    const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== null && v !== undefined && v !== '')
    );
 
    const response = await axiosInstance.get('/thana/analytics', { params });
    return response.data;
};
 
export default getThanaAnalyticsApi;