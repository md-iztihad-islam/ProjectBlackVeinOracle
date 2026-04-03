import axiosInstance from "@/helpers/axiosInstance";

async function getOrganizationByNameApi(name) {
  try {
    const response = await axiosInstance.get("/organization/search-organizations", {
      params: { q: name },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log("Error in getOrganizationByNameApi:", error);
    return {
      success: false,
      data: [],
      message: "Failed to fetch organizations by name.",
    };
  }
}

export default getOrganizationByNameApi;
