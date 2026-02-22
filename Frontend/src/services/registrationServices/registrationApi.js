import axiosInstance from "@/helpers/axiosInstance";

export const registerThanaApi = async (registrationData) => {
    try {
        const response = await axiosInstance.post('/thana/add-thana', registrationData); // by Rayyan 2.0 — was /signup-thana
        return response.data;
    } catch (error) {
        console.log("Thana Registration API Error:", error);
        return {
            success: false,
            error: error.response?.data?.message || "An error occurred during registration. Please try again."
        }
    }
}

export const registerOfficerApi = async (registrationData) => {
    try {
        const response = await axiosInstance.post('/officer/add-officer', registrationData); // by Rayyan 2.0 — was /signup-officer
        return response.data;
    } catch(error) {
        console.log("Officer Registration API Error:", error);
        return {
            success: false,
            error: error.response?.data?.message || "An error occurred during registration. Please try again."
        }
    }
}

export const registerJailApi = async (registrationData) => {
    try {
        const response = await axiosInstance.post('/jail/add-jail', registrationData); // by Rayyan 2.0 — was /signup-jail
        return response.data;
    } catch(error) {
        console.log("Jail Registration API Error:", error);
        return {
            success: false,
            error: error.response?.data?.message || "An error occurred during registration. Please try again."
        }
    }
}
