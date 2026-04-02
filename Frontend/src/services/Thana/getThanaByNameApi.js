import axiosInstance from "@/helpers/axiosInstance";

async function getThanaByNameApi(thanaName) {
    try {
        const res = await axiosInstance.get(`/thana/get-thana-by-name/${thanaName}`);
        return res.data;
    } catch (error) {
        console.log("Error in getThanaByNameApi: ", error);
        return {
            success: false,
            message: "Failed to fetch thana details. Please try again later."
        }
    }
}

export default getThanaByNameApi;