import axiosInstance from "@/helpers/axiosInstance";

async function getCriminalByThanaId(thanaId) {
    try {
        const response = await axiosInstance.get(`/criminal/get-criminals-by-thana/${thanaId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.log("Error in getCriminalByThanaId: ", error);
        return {
            success: false,
            message: "Failed to fetch criminals for the thana. Please try again later."
        }
    }
}

export default getCriminalByThanaId;