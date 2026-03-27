import axiosInstance from "@/helpers/axiosInstance";

async function updateCellApi({cellId, cellData}) {
    try {
        const res = await axiosInstance.put(`/cell/update-cell/${cellId}`, cellData);
        return res.data;
    } catch (error) {
        console.log("Error in updateCellApi: ", error);
        return {
            success: false,
            message: "Failed to update cell. Please try again later."
        }
    }
}

export default updateCellApi;