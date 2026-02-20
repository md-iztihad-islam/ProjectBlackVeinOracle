import axiosInstance from "@/helpers/axiosInstance";

async function getAllThanaApi() {
    try {
        const response = await axiosInstance.get('/thana/get-all-thana');
        return response.data;
    } catch (error) {
        console.log("Error in getAllThanaApi: ", error);
        return {
            success: false,
            message: "Failed to fetch thana data. Please try again later."
        }
    }
}

export default getAllThanaApi;