import axiosInstance from "@/helpers/axiosInstance";

async function getJailByIdApi(jailId) {
    try {
        const res = await axiosInstance.get(`/jail/get-jail/${jailId}`);
        return res.data;
    } catch (error) {
        console.log("Error in getJailByIdApi: ", error);
        return {
            success: false,
            message: "Failed to fetch jail details. Please try again later."
        }
    }
}

export default getJailByIdApi;