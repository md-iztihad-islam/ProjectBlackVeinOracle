import axiosInstance from "@/helpers/axiosInstance";

async function deleteJailApi(jailId) {
    try {
        const res = await axiosInstance.delete(`/jail/delete-jail/${jailId}`);
        return res.data;
    } catch (error) {
        console.log("Error in deleteJailApi: ", error);
        return {
            success: false,
            message: "Failed to delete jail. Please try again later."
        }
    }
}

export default deleteJailApi;