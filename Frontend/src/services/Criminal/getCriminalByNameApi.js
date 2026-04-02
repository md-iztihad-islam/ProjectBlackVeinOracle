import axiosInstance from "@/helpers/axiosInstance";

async function getCriminalByNameApi(name){
    try {
        console.log("Fetching criminal by name:", name);
        const response = await axiosInstance.get(`/criminal/get-criminal-by-name/${name}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.log("Error in getCriminalByNameApi: ", error);
        return {
            success: false,
            message: "Failed to fetch criminal by name. Please try again later."
        }
    }
}

export default getCriminalByNameApi;