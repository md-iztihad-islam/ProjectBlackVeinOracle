import axiosInstance from "@/helpers/axiosInstance";

async function getGDReportByGDIdApi(dairyId) {
    try {
        const response = await axiosInstance.get(`/gd-report/get-general-dairy-by-id/${dairyId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.log("Error in getGDReportByGDIdApi: ", error);
        return {
            success: false,
            message: "Failed to fetch GD report details. Please try again later."
        }
    }
}

export default getGDReportByGDIdApi;