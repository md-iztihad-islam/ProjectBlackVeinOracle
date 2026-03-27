import axiosInstance from "@/helpers/axiosInstance";

async function getOfficerByIdApi(officerId) {
    try {
        const res = await axiosInstance.get(`/officer/get-officer-by-id/${officerId}`);
        return res.data;
    } catch (error) {
        console.log("Error in getOfficerByIdApi: ", error);
        return {
            success: false,
            message: "Failed to fetch officer details. Please try again later."
        }
    }
}

export default getOfficerByIdApi;