import axiosInstance from "@/helpers/axiosInstance";

async function getAllCellBlocks() {
    try {
        const res = await axiosInstance.get("/cell-block/get-all-cell-blocks");
        return res.data;
    } catch (error) {
        console.log("Error in getAllCellBlocks: ", error);
        return {
            success: false,
            message: "Failed to fetch cell blocks. Please try again later."
        }
    }
}

export default getAllCellBlocks;