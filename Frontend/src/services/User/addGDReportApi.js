import axiosInstance from "@/helpers/axiosInstance";

async function addGDReportApi(gdData){
    try {
        const response = await axiosInstance.post('/gd-report/add-general-dairy', gdData);
        return response.data;
    } catch (error) {
        console.log("Error in addGDReportApi: ", error);
        return {
            success: false,
            message: "Failed to add GD report. Please try again later."
        }
    }
}

export default addGDReportApi;