import axiosInstance from "@/helpers/axiosInstance";

async function getGDReportByUserApi() {
    try {
        const response = await axiosInstance.get(`/gd-report/get-general-dairies-by-user`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.log("Error in getGDReportByUserApi: ", error);
        return {
            success: false,
            message: "Failed to fetch GD reports for the user. Please try again later."
        }
    }
}

export default getGDReportByUserApi;