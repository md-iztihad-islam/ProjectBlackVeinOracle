import axiosInstance from "@/helpers/axiosInstance";

async function getJailByNameApi(jailName) {
    try {
       const response = await axiosInstance.get(`/jail/get-jail-by-name/${jailName}`);
       return response.data;
    }catch (error) {
        console.error("Error in getJailByNameApi: ", error);
        return {
            success: false,
            message: "Failed to fetch jail data. Please try again later."
        }
    }
}

export default getJailByNameApi;