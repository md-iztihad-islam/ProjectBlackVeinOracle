import axiosInstance from "@/helpers/axiosInstance";

async function updateJailApi({jailId, updatedData}) {
    try {
        const res = await axiosInstance.put(`/jail/update-jail/${jailId}`, updatedData);
        return res.data;
    } catch (error) {
        console.log("Error in updateJailApi: ", error);
        return {
            success: false,
            message: "Failed to update jail. Please try again later."
        }
    }
}

export default updateJailApi;