import axiosInstance from "@/helpers/axiosInstance";

async function getCriminalProfileApi(criminalId) {
    try {
        const response = await axiosInstance.get(`/analytics/criminal-full-profile/${criminalId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.log("Error in getCriminalProfileApi: ", error);
        return {
            success: false,
            message: "Failed to fetch criminal profile. Please try again later."
        }
    }
}

export default getCriminalProfileApi;