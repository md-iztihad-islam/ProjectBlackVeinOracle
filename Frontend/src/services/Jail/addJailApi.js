import axiosInstance from "@/helpers/axiosInstance";

async function addJailApi(jailData) {
    try {
        const res = await axiosInstance.post("/jail/add-jail", jailData);
        return res.data;
    } catch (error) {
        console.log("Error in addJailApi: ", error);
        return {
            success: false,
            message: "Failed to add jail. Please try again later."
        }
    }
}

export default addJailApi;