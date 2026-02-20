import axiosInstance from "@/helpers/axiosInstance";

async function registerUserApi(userData) {
    try {
        const response = await axiosInstance.post('/user/add-user', userData);
        return response.data;
    } catch (error) {
        console.log("Error in registerUserApi: ", error);
        return {
            success: false,
            message: "Failed to register user. Please try again later."
        }
    }
}

export default registerUserApi;