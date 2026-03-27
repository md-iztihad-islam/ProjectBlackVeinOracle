import axiosInstance from "@/helpers/axiosInstance";

async function addCellBlockApi(cellBlockData) {
    try {
        const res = await axiosInstance.post("/cell-block/add-cell-block", cellBlockData);
        return res.data;
    } catch (error) {
        console.log("Error in addCellBlockApi: ", error);
        return {
            success: false,
            message: "Failed to add cell block. Please try again later."
        }
    }
}

export default addCellBlockApi;