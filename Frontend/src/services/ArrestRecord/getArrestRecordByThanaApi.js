import axiosInstance from "@/helpers/axiosInstance";

async function getArrestRecordByThanaApi(thanaId) {
    try {
        const response = await axiosInstance.get(`/arrest-record/get-arrest-records-by-thana/${thanaId}`);
        return response.data;
    } catch (error) {
        console.log("Error fetching arrest records by thana:", error);
        return {
            success: false,
            message: "Failed to fetch arrest records by thana."
        }
    }
}

export default getArrestRecordByThanaApi;