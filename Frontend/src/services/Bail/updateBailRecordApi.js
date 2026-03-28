import axiosInstance from "@/helpers/axiosInstance";

async function updateBailRecordApi({bailRecordId, updatedData}) {
    try {
        const response = await axiosInstance.put(`/bail-record/update-bail-record/${bailRecordId}`, updatedData);
        return response.data;
    } catch (error) {
        console.log("Error updating bail record:", error);
        return {
            success: false,
            message: "Failed to update bail record."
        }
    }
}

export default updateBailRecordApi;