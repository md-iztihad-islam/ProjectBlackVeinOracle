import axiosInstance from "@/helpers/axiosInstance";

async function addArrestRecordApi(arrestRecord) {
    try {
        const response = await axiosInstance.post("/arrest-record/add-arrest-record", arrestRecord);
        return response.data;
    } catch (error) {
        console.log("Error adding arrest record:", error);
        return {
            success: false,
            message: "Failed to add arrest record."
        }
    }
}

export default addArrestRecordApi;