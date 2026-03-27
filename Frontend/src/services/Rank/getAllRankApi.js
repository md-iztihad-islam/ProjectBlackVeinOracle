import axiosInstance from "@/helpers/axiosInstance";

async function getAllRankApi() {
    try {
        const res = await axiosInstance.get("/rank/get-all-ranks");
        return res.data;
    } catch (error) {
        console.log("Error in getAllRankApi: ", error);
        return {
            success: false,
            message: "Failed to fetch ranks. Please try again later."
        }
    }
}

export default getAllRankApi;