import axiosInstance from "@/helpers/axiosInstance";

async function getJailOccupancyDetailsApi() {
    try {
        const res = await axiosInstance.get(`/analytics/jail-occupancy-detail`);
        return res.data;
    } catch (error) {
        console.log("Error in getJailOccupancyDetailsApi: ", error);
        return {
            success: false,
            message: "Failed to fetch jail occupancy details. Please try again later."
        }
    }
}

export default getJailOccupancyDetailsApi;