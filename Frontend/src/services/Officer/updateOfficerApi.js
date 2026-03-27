import axiosInstance from "@/helpers/axiosInstance";

async function updateOfficerApi({officerId, updatedData}) {
    try {
        const res = await axiosInstance.put(`/officer/update-officer/${officerId}`, updatedData);
        return res.data;
    } catch (error) {
        console.log("Error in updateOfficerApi: ", error);
        return {
            success: false,
            message: "Failed to update officer. Please try again later."
        }
    }
}

export default updateOfficerApi;