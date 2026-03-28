import axiosInstance from "@/helpers/axiosInstance";

async function updateArrestRecordApi({arrestRecordId, updatedData}) {
    try {
        const response = await axiosInstance.put(`/arrest-record/update-arrest-record/${arrestRecordId}`, updatedData);
        return response.data;
    } catch (error) {
        console.log("Error updating arrest record:", error);
        return {
            success: false,
            message: "Failed to update arrest record."
        }
    }
}

export default updateArrestRecordApi;