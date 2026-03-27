import axiosInstance from "@/helpers/axiosInstance";

async function deleteCellApi(cellId) {
    try {
        const response = await axiosInstance.delete(`/cell/delete-cell/${cellId}`);
        return response.data;
    } catch (error) {
        console.log("Error in deleteCellApi: ", error);
        return {
            success: false,
            message: "Failed to delete cell. Please try again later."
        }
    }
}

export default deleteCellApi;