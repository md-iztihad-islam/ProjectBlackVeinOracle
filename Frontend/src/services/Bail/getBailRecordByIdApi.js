import axiosInstance from "@/helpers/axiosInstance";

async function getBailRecordByIdApi(bailRecordId) {
    try {
        const response = await axiosInstance.get(`/bail-record/get-bail-record/${bailRecordId}`);
        return response.data;
    } catch (error) {
        console.log("Error fetching bail record by ID:", error);
        return {
            success: false,
            message: "Failed to fetch bail record by ID."
        }
    }
}

export default getBailRecordByIdApi;