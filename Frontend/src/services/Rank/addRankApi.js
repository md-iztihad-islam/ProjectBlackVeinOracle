import axiosInstance from "@/helpers/axiosInstance";

async function addRankApi(rankData) {
    try {
        const res = await axiosInstance.post("/rank/add-rank", rankData);
        return res.data;
    } catch (error) {
        console.log("Error in addRankApi: ", error);
        return {
            success: false,
            message: "Failed to add rank. Please try again later."
        }
    }
}

export default addRankApi;