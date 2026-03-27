import axiosInstance from "@/helpers/axiosInstance";

async function getCellBlockByIdApi(cellBlockId) {
    try {
        const res = await axiosInstance.get(`/cell-block/get-cell-block/${cellBlockId}`);
        return res.data;
    } catch (error) {
        console.log("Error in getCellBlockById: ", error);
        return {
            success: false,
            message: "Failed to fetch cell block details. Please try again later."
        }
    }
}

export default getCellBlockByIdApi;