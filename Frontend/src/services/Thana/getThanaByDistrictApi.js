import axiosInstance from "@/helpers/axiosInstance";

async function getThanaByDistrictApi(district) {
    try {
        const response = await axiosInstance.get(`/thana/get-thanas-by-district/${district}`);
        return response.data;
    } catch (error) {
        console.log("Error in getThanaByDistrictApi: ", error);
        return {
            success: false,
            message: "Failed to fetch thana data for the specified district. Please try again later."
        }
    }
}

export default getThanaByDistrictApi;