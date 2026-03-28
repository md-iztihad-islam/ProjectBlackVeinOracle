import axiosInstance from "@/helpers/axiosInstance";

async function responseToGDReportApi({gdId, responseData}) {
    try {
        const response = await axiosInstance.put(`/gd-report/respond-to-general-dairy/${gdId}`, responseData, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.log("Error in responseToGDReportApi: ", error);
        return {
            success: false,
            message: "Failed to submit response to GD report. Please try again later."
        }
    }
}

export default responseToGDReportApi;