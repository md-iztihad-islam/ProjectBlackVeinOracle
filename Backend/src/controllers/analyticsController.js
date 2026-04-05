import {
    getCriminalFullProfileService,
    getHighRiskNetworkService,
    getGdReportAnalyticsService,
    // getBailStatisticsService,
    getCriminalMovementHistoryService,
    getOrganizationThreatAnalysisService,
    getCustodyOverviewService,
    getInmatesDueForBailService,
    getCellOccupancyDetailsService,
    getDashboardOverviewService,
    getCriminalsAboveAvgCasesService,
    getCriminalOverviewService,
    getCriminalByDistrictService,
    getCrimeTypeDistributionService,
    getCrimePeakByYearService,
    getWantedByAreaService,
    getCrimeYearsService,
    getCriminalRankingService,
    getFreeOrgMembersService,
    getMonthlyArrestTrendService,
    getThanaPerformanceService,
    getJailOccupancyDetailService,
    getOfficerWorkloadService,
    getOfficerRankingService,
    getDistrictCrimeStatsService,
    getAdminJailOverviewService,
    getAdminJailDetailsService,
    getAuditLogsService,
    recalculateAllRiskScoresService,
} from "../services/analyticsService.js";

const resolveScopedThanaId = (req) => {
    if (req?.role === "thana") return req.id;
    return req.query.thanaId || null;
};


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
        const thanaId = resolveScopedThanaId(_);
        const data = await getGdReportAnalyticsService(thanaId);
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error at getGdReportAnalyticsController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// export const getBailStatisticsController = async (_, res) => {
//     try {
//         const data = await getBailStatisticsService();
//         return res.status(200).json({ success: true, data });
//     } catch (error) {
//         console.log("Error at getBailStatisticsController:", error);
//         return res.status(500).json({ success: false, message: "Internal server error" });
//     }
// };

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

export const getCriminalOverviewController = async (req, res) => {
    try {
        const district = req.query.district || null;
        const thanaId = resolveScopedThanaId(req);
        const data = await getCriminalOverviewService(district, thanaId);
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error at getCriminalOverviewController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getCriminalByDistrictController = async (req, res) => {
    try {
        const district = req.query.district || null;
        const thanaId = resolveScopedThanaId(req);
        const data = await getCriminalByDistrictService(district, thanaId);
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error at getCriminalByDistrictController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getCrimeTypeDistributionController = async (req, res) => {
    try {
        const year = req.query.year ? Number(req.query.year) : null;
        const district = req.query.district || null;
        const thanaId = resolveScopedThanaId(req);
        const data = await getCrimeTypeDistributionService(year, district, thanaId);
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error at getCrimeTypeDistributionController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getCrimePeakByYearController = async (req, res) => {
    try {
        const year = req.query.year ? Number(req.query.year) : null;
        const district = req.query.district || null;
        const thanaId = resolveScopedThanaId(req);
        const data = await getCrimePeakByYearService(year, district, thanaId);
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error at getCrimePeakByYearController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getWantedByAreaController = async (req, res) => {
    try {
        const district = req.query.district || null;
        const thanaId = resolveScopedThanaId(req);
        const data = await getWantedByAreaService(district, thanaId);
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error at getWantedByAreaController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getCrimeYearsController = async (_, res) => {
    try {
        const data = await getCrimeYearsService();
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error at getCrimeYearsController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getCriminalRankingController = async (req, res) => {
    try {
        const district = req.query.district || null;
        const thanaId = resolveScopedThanaId(req);
        const data = await getCriminalRankingService(district, thanaId);
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
        const thanaId = resolveScopedThanaId(_);
        const data = await getThanaPerformanceService(thanaId);
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
        const thanaId = resolveScopedThanaId(_);
        const data = await getOfficerWorkloadService(thanaId);
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error at getOfficerWorkloadController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getOfficerRankingController = async (_, res) => {
    try {
        const thanaId = resolveScopedThanaId(_);
        const data = await getOfficerRankingService(thanaId);
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error at getOfficerRankingController:", error);
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

export const getAdminJailOverviewController = async (req, res) => {
    try {
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const data = await getAdminJailOverviewService(limit);
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error at getAdminJailOverviewController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getAdminJailDetailsController = async (req, res) => {
    try {
        const { jailId } = req.params;
        const data = await getAdminJailDetailsService(jailId);
        if (!data?.jail) {
            return res.status(404).json({ success: false, message: "Jail not found" });
        }
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error at getAdminJailDetailsController:", error);
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
