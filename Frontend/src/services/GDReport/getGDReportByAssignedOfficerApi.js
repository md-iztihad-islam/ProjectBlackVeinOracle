import axiosInstance from "@/helpers/axiosInstance";

async function getGDReportByAssignedOfficerApi(officerId) {
    try {
        const response = await axiosInstance.get(`/gd-report/get-general-dairies-by-assigned-officer/${officerId}`);
        return response.data;
    } catch (error) {
        console.log("Error fetching GD reports by assigned officer:", error);
        return {
            success: false,
            message: "Failed to fetch GD reports by assigned officer."
        }
    }
}

export default getGDReportByAssignedOfficerApi;