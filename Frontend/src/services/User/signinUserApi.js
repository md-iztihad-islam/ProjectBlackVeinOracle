import axiosInstance from "@/helpers/axiosInstance";

async function signinUserApi(credentials) {
    try {
        const response = await axiosInstance.post('/user/signin-user', credentials);
        return response.data;
    } catch (error) {
        console.log("Error in signinUserApi: ", error);
        return {
            success: false,
            message: "Failed to sign in. Please check your credentials and try again."
        }
    }
}

export default signinUserApi;