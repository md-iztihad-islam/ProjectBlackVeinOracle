import axiosInstance from "@/helpers/axiosInstance";

async function updateCellBlockApi({cellBlockId, cellBlockData}) {
    try {
        const res = await axiosInstance.put(`/cell-block/update-cell-block/${cellBlockId}`, cellBlockData);
        return res.data;
    } catch (error) {
        console.log("Error in updateCellBlockApi: ", error);
        return {
            success: false,
            message: "Failed to update cell block. Please try again later."
        }
    }
}

export default updateCellBlockApi;