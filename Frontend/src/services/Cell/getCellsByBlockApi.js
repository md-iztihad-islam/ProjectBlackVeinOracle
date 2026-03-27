import axiosInstance from "@/helpers/axiosInstance";

async function getCellsByBlockApi(cellBlockId) {
    try {
        const res = await axiosInstance.get(`/cell/get-cells-by-block/${cellBlockId}`);
        return res.data;
    } catch (error) {
        console.log("Error in getCellsByBlockApi: ", error);
        return {
            success: false,
            message: "Failed to fetch cells. Please try again later."
        }
    }
}

export default getCellsByBlockApi;