import axiosInstance from "@/helpers/axiosInstance";
import userStore from "@/state/userStore";

// Utility function to clear all user-related cache
const clearAllUserCache = () => {
    // Clear Zustand store
    userStore.setState({ user: null });
    
    // Clear localStorage keys
    localStorage.removeItem("user-storage");
    localStorage.removeItem("user");
    
    // Clear sessionStorage as well
    sessionStorage.removeItem("user-storage");
    sessionStorage.removeItem("user");
    
    // Clear axios instance headers
    delete axiosInstance.defaults.headers.common["Authorization"];
};

export const adminSignoutApi = async () => {
    try {
        const response = await axiosInstance.post('/admin/signout-admin');
        clearAllUserCache();
        return response.data;
    } catch (error) {
        console.log("Signout API Error:", error);
        clearAllUserCache();
        return { success: false, error: "An error occurred during signout." };
    }
};

export const thanaSignoutApi = async () => {
    try {
        const response = await axiosInstance.post('/thana/signout-thana');
        clearAllUserCache();
        return response.data;
    } catch (error) {
        console.log("Signout API Error:", error);
        clearAllUserCache();
        return { success: false, error: "An error occurred during signout." };
    }
};

export const officerSignoutApi = async () => {
    try {
        const response = await axiosInstance.post('/officer/signout-officer');
        clearAllUserCache();
        return response.data;
    } catch (error) {
        console.log("Signout API Error:", error);
        clearAllUserCache();
        return { success: false, error: "An error occurred during signout." };
    }
};

export const jailSignoutApi = async () => {
    try {
        const response = await axiosInstance.post('/jail/signout-jail');
        clearAllUserCache();
        return response.data;
    } catch (error) {
        console.log("Signout API Error:", error);
        clearAllUserCache();
        return { success: false, error: "An error occurred during signout." };
    }
};

export const userSignoutApi = async () => {
    try {
        const response = await axiosInstance.post('/user/signout-user');
        clearAllUserCache();
        return response.data;
    } catch (error) {
        console.log("Signout API Error:", error);
        clearAllUserCache();
        return { success: false, error: "An error occurred during signout." };
    }
};
