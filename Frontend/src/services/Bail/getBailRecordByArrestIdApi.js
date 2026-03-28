import axiosInstance from "@/helpers/axiosInstance";

async function getBailRecordByArrestIdApi(arrestId) {
    try {
        const response = await axiosInstance.get(`/bail-record/get-bail-records-by-arrest/${arrestId}`);
        return response.data;
    } catch (error) {
        console.log("Error fetching bail record by arrest ID:", error);
        return {
            success: false,
            message: "Failed to fetch bail record by arrest ID."
        }
    }
}

export default getBailRecordByArrestIdApi;