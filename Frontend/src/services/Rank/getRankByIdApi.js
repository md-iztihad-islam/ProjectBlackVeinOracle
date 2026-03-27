import axiosInstance from "@/helpers/axiosInstance";

async function getRankByIdApi(rankId) {
    try {
        const res = await axiosInstance.get(`/rank/get-rank/${rankId}`);
        return res.data;
    } catch (error) {
        console.log("Error in getRankByIdApi: ", error);
        return {
            success: false,
            message: "Failed to fetch rank details. Please try again later."
        }
    }
}

export default getRankByIdApi;