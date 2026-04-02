import axiosInstance from "@/helpers/axiosInstance";

async function getCaseFileByCaseIdApi(caseId) {
    try {
        const response = await axiosInstance.get(`/case-file/get-case-file/${caseId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.log("Error in getCaseFileByCaseIdApi: ", error);
        return {
            success: false,
            message: "Failed to fetch case file. Please try again later."
        }
    }
}

export default getCaseFileByCaseIdApi;