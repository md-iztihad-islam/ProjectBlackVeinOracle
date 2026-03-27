import axiosInstance from "@/helpers/axiosInstance";

async function deleteCellBlockApi(cellBlockId) {
    try {
        const res = await axiosInstance.delete(`/cell-block/delete-cell-block/${cellBlockId}`);
        return res.data;
    } catch (error) {
        console.log("Error in deleteCellBlockApi: ", error);
        return {
            success: false,
            message: "Failed to delete cell block. Please try again later."
        }
    }
}

export default deleteCellBlockApi;