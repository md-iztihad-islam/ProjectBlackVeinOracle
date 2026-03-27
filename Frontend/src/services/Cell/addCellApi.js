import axiosInstance from "@/helpers/axiosInstance";

async function addCellApi(cellData) {
    try {
        const res = await axiosInstance.post("/cell/add-cell", cellData);
        return res.data;
    } catch (error) {
        console.log("Error in addCellApi: ", error);
        return {
            success: false,
            message: "Failed to add cell. Please try again later."
        }
    }
}

export default addCellApi;