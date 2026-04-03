import axiosInstance from "@/helpers/axiosInstance";

async function getOfficerByNameApi(name) {
    try {
        const response = await axiosInstance.get(`/officer/get-officer-by-name/${name}`);
        return response.data;
    } catch (error) {
        console.error("Error in getOfficerByNameApi: ", error);
        return {
            success: false,
            message: "Failed to fetch officer details. Please try again later."
        }
    }
}

export default getOfficerByNameApi;
