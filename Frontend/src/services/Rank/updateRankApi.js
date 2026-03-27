import axiosInstance from "@/helpers/axiosInstance";

async function updateRankApi({rankId, updatedData}) {
    try {
        const res = await axiosInstance.put(`/rank/update-rank/${rankId}`, updatedData);
        return res.data;
    } catch (error) {
        console.log("Error in updateRankApi: ", error);
        return {
            success: false,
            message: "Failed to update rank. Please try again later."
        }
    }
}

export default updateRankApi;