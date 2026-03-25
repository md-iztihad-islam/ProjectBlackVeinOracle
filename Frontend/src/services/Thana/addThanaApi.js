import axiosInstance from "@/helpers/axiosInstance";

async function addThanaApi(thanaData) {
    try {
        const res = await axiosInstance.post("/thana/add-thana", thanaData);
        return res.data;
    } catch (error) {
        console.log("Error in addThanaApi: ", error);
        return {
            success: false,
            message: "Failed to add thana. Please try again later."
        }
    }
}

export default addThanaApi;