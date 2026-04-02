import axiosInstance from "@/helpers/axiosInstance";

async function changePasswordApi( currentPassword, newPassword, officerId ) {
    try {
        const res = await axiosInstance.post(`/officer/reset-password/${officerId}`, {
            current_password: currentPassword,
            new_password: newPassword
        });
        return res.data;
    } catch (error) {
        console.log("Error in changePasswordApi: ", error);
        return {
            success: false,
            message: "Failed to change password. Please try again later."
        }
    }
}

export default changePasswordApi;