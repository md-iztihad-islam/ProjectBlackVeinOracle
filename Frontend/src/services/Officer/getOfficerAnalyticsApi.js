import axiosInstance from "@/helpers/axiosInstance";

async function getOfficerAnalyticsApi({ thanaId, district, rank, gender }) {
    try {
        console.log("Fetching analytics with params: ", { thanaId, district, rank, gender });
        const res = await axiosInstance.get(`/officer/analytics`, {
            params: {
                thanaId: thanaId,
                district: district,
                rank: rank,
                gender: gender
            }
         }
        );
        return res.data;
    } catch (error) {
        console.log("Error in getAnalyticsApi: ", error);
        return {
            success: false,
            message: "Failed to fetch analytics data. Please try again later."
        }
    }
}

export default getOfficerAnalyticsApi;