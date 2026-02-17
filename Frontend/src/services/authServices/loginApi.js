import axiosInstance from "@/helpers/axiosInstance";

export const adminLoginApi = async (credentials) => {
    try {
        const response = await axiosInstance.post('/admin/signin-admin', credentials);
        return response.data;
    } catch (error) {
        console.log("Login API Error:", error);
        return { success: false, error: "An error occurred during login. Please try again." };
    }
}

export const thanaLoginApi = async (credentials) => {
    try {
        const response = await axiosInstance.post('/thana/signin-thana', credentials);
        return response.data;
    } catch (error) {
        console.log("Login API Error:", error);
        return { success: false, error: "An error occurred during login. Please try again." };
    }
}

export const officerLoginApi = async (credentials) => {
    try {
        const response = await axiosInstance.post('/officer/signin-officer', credentials);
        return response.data;
    } catch (error) {
        console.log("Login API Error:", error);
        return { success: false, error: "An error occurred during login. Please try again." };
    }
}

export const jailLoginApi = async (credentials) => {
    try {
        const response = await axiosInstance.post('/jail/signin-jail', credentials);
        return response.data;
    } catch (error) {
        console.log("Login API Error:", error);
        return { success: false, error: "An error occurred during login. Please try again." };
    }
}