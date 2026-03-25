import axiosInstance from "@/helpers/axiosInstance";

async function getGDReportByThanaApi(thanaId) {
    try {
        const response = await axiosInstance.get(`/gd-report/get-general-dairies-by-thana/${thanaId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.log("Error in getGDReportByThanaApi: ", error);
        return {
            success: false,
            message: "Failed to fetch GD reports for the thana. Please try again later."
        }
    }
}

export default getGDReportByThanaApi;