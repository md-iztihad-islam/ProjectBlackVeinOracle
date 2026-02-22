import {
    getCriminalFullProfileService,
    getHighRiskNetworkService,
    getGdReportAnalyticsService,
    getBailStatisticsService,
    getCriminalMovementHistoryService,
    getOrganizationThreatAnalysisService,
    getCustodyOverviewService,
    getInmatesDueForBailService,
    getCellOccupancyDetailsService,
    getDashboardOverviewService,
    getCriminalsAboveAvgCasesService,
    getCriminalRankingService,
    getFreeOrgMembersService,
    getMonthlyArrestTrendService,
    getThanaPerformanceService,
    getJailOccupancyDetailService,
    getOfficerWorkloadService,
    getDistrictCrimeStatsService,
    getAuditLogsService,
    recalculateAllRiskScoresService,
} from "../services/analyticsService.js";


export const getCriminalFullProfileController = async (req, res) => {
    try {
        const { criminalId } = req.params;
        const data = await getCriminalFullProfileService(criminalId);
        if (!data) return res.status(404).json({ success: false, message: "Criminal not found" });
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error at getCriminalFullProfileController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getHighRiskNetworkController = async (_, res) => {
    try {
        const data = await getHighRiskNetworkService();
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error at getHighRiskNetworkController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getGdReportAnalyticsController = async (_, res) => {
    try {
        const data = await getGdReportAnalyticsService();
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error at getGdReportAnalyticsController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getBailStatisticsController = async (_, res) => {
    try {
        const data = await getBailStatisticsService();
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error at getBailStatisticsController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getCriminalMovementHistoryController = async (req, res) => {
    try {
        const { criminalId } = req.params;
        const data = await getCriminalMovementHistoryService(criminalId);
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error at getCriminalMovementHistoryController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getOrganizationThreatAnalysisController = async (_, res) => {
    try {
        const data = await getOrganizationThreatAnalysisService();
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error at getOrganizationThreatAnalysisController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getCustodyOverviewController = async (_, res) => {
    try {
        const data = await getCustodyOverviewService();
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error at getCustodyOverviewController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getInmatesDueForBailController = async (_, res) => {
    try {
        const data = await getInmatesDueForBailService();
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error at getInmatesDueForBailController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getCellOccupancyDetailsController = async (req, res) => {
    try {
        const { jailId } = req.params;
        const data = await getCellOccupancyDetailsService(jailId);
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error at getCellOccupancyDetailsController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getDashboardOverviewController = async (_, res) => {
    try {
        const data = await getDashboardOverviewService();
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error at getDashboardOverviewController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getCriminalsAboveAvgCasesController = async (_, res) => {
    try {
        const data = await getCriminalsAboveAvgCasesService();
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error at getCriminalsAboveAvgCasesController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getCriminalRankingController = async (_, res) => {
    try {
        const data = await getCriminalRankingService();
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error at getCriminalRankingController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getFreeOrgMembersController = async (_, res) => {
    try {
        const data = await getFreeOrgMembersService();
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error at getFreeOrgMembersController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getMonthlyArrestTrendController = async (_, res) => {
    try {
        const data = await getMonthlyArrestTrendService();
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error at getMonthlyArrestTrendController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};



export const getThanaPerformanceController = async (_, res) => {
    try {
        const data = await getThanaPerformanceService();
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error at getThanaPerformanceController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getJailOccupancyDetailController = async (_, res) => {
    try {
        const data = await getJailOccupancyDetailService();
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error at getJailOccupancyDetailController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getOfficerWorkloadController = async (_, res) => {
    try {
        const data = await getOfficerWorkloadService();
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error at getOfficerWorkloadController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getDistrictCrimeStatsController = async (req, res) => {
    try {
        const district = req.query.district || null;
        const data = await getDistrictCrimeStatsService(district);
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error at getDistrictCrimeStatsController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


export const getAuditLogsController = async (req, res) => {
    try {
        const { table, page = 1, limit = 50 } = req.query;
        const data = await getAuditLogsService(table || null, parseInt(page), parseInt(limit));
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error at getAuditLogsController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


export const recalculateAllRiskScoresController = async (req, res) => {
    try {
        const data = await recalculateAllRiskScoresService();
        return res.status(200).json({ success: true, message: "All risk scores recalculated", data });
    } catch (error) {
        console.log("Error at recalculateAllRiskScoresController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
