import axiosInstance from "@/helpers/axiosInstance";

async function getCellBlocksByJailApi(jailId) {
    try {
        const res = await axiosInstance.get(`/cell-block/get-cell-blocks-by-jail/${jailId}`);
        return res.data;
    } catch (error) {
        console.log("Error in getCellBlocksByJailApi: ", error);
        return {
            success: false,
            message: "Failed to fetch cell blocks for the jail. Please try again later."
        }
    }
}

export default getCellBlocksByJailApi;