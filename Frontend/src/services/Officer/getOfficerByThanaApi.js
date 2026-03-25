import axiosInstance from "@/helpers/axiosInstance";

async function getOfficerByThanaApi(thanaId) {
    try {
        const response = await axiosInstance.get(`/officer/get-officers-by-thana/${thanaId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.log("Error in getOfficerByThanaApi: ", error);
        return {
            success: false,
            message: "Failed to fetch officers for the thana. Please try again later."
        }
    }
}

export default getOfficerByThanaApi;