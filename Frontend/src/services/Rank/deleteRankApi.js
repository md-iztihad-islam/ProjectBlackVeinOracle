import axiosInstance from "@/helpers/axiosInstance";

async function deleteRankApi(rankId) {
    try {
        const res = await axiosInstance.delete(`/rank/delete-rank/${rankId}`);
        return res.data;
    } catch (error) {
        console.log("Error in deleteRankApi: ", error);
        return {
            success: false,
            message: "Failed to delete rank. Please try again later."
        }
    }
}

export default deleteRankApi;