import axiosInstance from "@/helpers/axiosInstance";

async function getAllJailApi() {
    try {
        const res = await axiosInstance.get("/jail/get-jails");
        return res.data;
    } catch (error) {
        console.log("Error in getAllJailApi: ", error);
        return {
            success: false,
            message: "Failed to fetch jails. Please try again later."
        }
    }
}

export default getAllJailApi;