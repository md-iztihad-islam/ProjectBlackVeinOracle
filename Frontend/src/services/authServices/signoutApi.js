import axiosInstance from "@/helpers/axiosInstance";

export const adminSignoutApi = async () => {
    try {
        const response = await axiosInstance.post('/admin/signout-admin');
        return response.data;
    } catch (error) {
        console.log("Signout API Error:", error);
        return { success: false, error: "An error occurred during signout." };
    }
};

export const thanaSignoutApi = async () => {
    try {
        const response = await axiosInstance.post('/thana/signout-thana');
        return response.data;
    } catch (error) {
        console.log("Signout API Error:", error);
        return { success: false, error: "An error occurred during signout." };
    }
};

export const officerSignoutApi = async () => {
    try {
        const response = await axiosInstance.post('/officer/signout-officer');
        return response.data;
    } catch (error) {
        console.log("Signout API Error:", error);
        return { success: false, error: "An error occurred during signout." };
    }
};

export const jailSignoutApi = async () => {
    try {
        const response = await axiosInstance.post('/jail/signout-jail');
        return response.data;
    } catch (error) {
        console.log("Signout API Error:", error);
        return { success: false, error: "An error occurred during signout." };
    }
};

export const userSignoutApi = async () => {
    try {
        const response = await axiosInstance.post('/user/signout-user');
        return response.data;
    } catch (error) {
        console.log("Signout API Error:", error);
        return { success: false, error: "An error occurred during signout." };
    }
};
