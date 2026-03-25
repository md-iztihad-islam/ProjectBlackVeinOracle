import axiosInstance from "@/helpers/axiosInstance";

async function deleteThanaApi(thanaId) {
    try {
        const response = await axiosInstance.delete(`/thana/delete-thana/${thanaId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.log("Error in deleteThanaApi: ", error);
        return {
            success: false,
            message: "Failed to delete thana. Please try again later."
        }
    }
}

export default deleteThanaApi;