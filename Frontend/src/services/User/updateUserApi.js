import axiosInstance from "@/helpers/axiosInstance";

async function updateUserApi(userData) {
  try {
    const payload = userData?.updatedData ? userData.updatedData : userData;
    const userId =
      userData?.userId ||
      userData?.user_id ||
      JSON.parse(localStorage.getItem("user-storage"))?.state?.user?.user_id;
    const response = await axiosInstance.put(
      `/user/update-user/${userId}`,
      payload,
    );
    return response.data;
  } catch (error) {
    console.log("Error in updateUserApi: ", error);
    return { success: false, message: "Failed to update profile." };
  }
}

export default updateUserApi;