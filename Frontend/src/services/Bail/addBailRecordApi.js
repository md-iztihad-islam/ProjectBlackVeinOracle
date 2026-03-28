import axiosInstance from "@/helpers/axiosInstance";

async function addBailRecordApi(bailRecord) {
    try {
        const response = await axiosInstance.post("/bail-record/add-bail-record", bailRecord);
        return response.data;
    } catch (error) {
        console.log("Error adding bail record:", error);
        return {
            success: false,
            message: "Failed to add bail record."
        }
    }
}

export default addBailRecordApi;