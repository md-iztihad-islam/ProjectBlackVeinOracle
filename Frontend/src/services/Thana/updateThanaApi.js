import axiosInstance from "@/helpers/axiosInstance";

async function updateThanaApi({thanaId, thanaData}) {
    try {
        console.log("Updating thana with ID:", thanaId, "and data:", thanaData);
        const response = await axiosInstance.put(`/thana/update-thana/${thanaId}`, thanaData, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.log("Error in updateThanaApi: ", error);
        return {
            success: false,
            message: "Failed to update thana. Please try again later."
        }
    }
}

export default updateThanaApi;