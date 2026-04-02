import axiosInstance from "@/helpers/axiosInstance";

async function getOrganizationByIdApi(orgId) {
    try {
        const response = await axiosInstance.get(`/organization/get-organization/${orgId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.log("Error in getOrganizationByIdApi: ", error);
        return {
            success: false,
            message: "Failed to fetch organization details. Please try again later."
        }
    }
}

export default getOrganizationByIdApi;