import axiosInstance from "@/helpers/axiosInstance";

async function updateUserApi({userId, updatedData}) {
    try {
        const response = await axiosInstance.put(`/user/update-user/${userId}`, updatedData);

        return response.data;   
    } catch (error) {
        console.log("Error updating user:", error);
        throw error;
    }
}

export default updateUserApi;