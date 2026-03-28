import axiosInstance from "@/helpers/axiosInstance";

async function getArrestRecordByIdApi(arrestRecordId) {
    try {
        const response = await axiosInstance.get(`/arrest-record/get-arrest-record/${arrestRecordId}`);
        return response.data;
    } catch (error) {
        console.log("Error fetching arrest record by ID:", error);
        return {
            success: false,
            message: "Failed to fetch arrest record by ID."
        }
    }
}

export default getArrestRecordByIdApi;