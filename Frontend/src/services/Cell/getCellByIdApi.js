import axiosInstance from "@/helpers/axiosInstance";

async function getCellByIdApi(cellId) {
    try {
        const res = await axiosInstance.get(`/cell/get-cell/${cellId}`);
        return res.data;
    } catch (error) {
        console.log("Error in getCellByIdApi: ", error);
        return {
            success: false,
            message: "Failed to fetch cell details. Please try again later."
        }
    }
}

export default getCellByIdApi;