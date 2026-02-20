import axiosInstance from "@/helpers/axiosInstance";

export const registerThanaApi = async (registrationData) => {
    try {
        const response = await axiosInstance.post('/thana/signup-thana', registrationData);
        return response.data;
    } catch (error) {
        console.log("Thana Registration API Error:", error);
        return {
            success: false,
            error: "An error occurred during registration. Please try again."
        }
    }
}

export const registerOfficerApi = async (registrationData) => {
    try {
        const response = await axiosInstance.post('/officer/signup-officer', registrationData);
        return response.data;
    } catch(error) {
        console.log("Officer Registration API Error:", error);
        return {
            success: false,
            error: "An error occurred during registration. Please try again."
        }
    }
}

export const registerJailApi = async (registrationData) => {
    try {
        const response = await axiosInstance.post('/jail/signup-jail', registrationData);
        return response.data;
    } catch(error) {
        console.log("Jail Registration API Error:", error);
        return {
            success: false,
            error: "An error occurred during registration. Please try again."
        }
    }
}
