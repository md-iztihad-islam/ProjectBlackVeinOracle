import axiosInstance from "@/helpers/axiosInstance";

async function getThanaByThanaIdApi(thanaId) {
    try {
        const response = await axiosInstance.get(`/thana/get-thana-by-id/${thanaId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.log("Error in getThanaByThanaIdApi: ", error);
        return {
            success: false,
            message: "Failed to fetch thana details. Please try again later."
        }
    }
}

export default getThanaByThanaIdApi;