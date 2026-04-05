import {
    getCriminalFullProfileRepository,
    getHighRiskNetworkRepository,
    getGdReportAnalyticsRepository,
    // getBailStatisticsRepository,
    getCriminalMovementHistoryRepository,
    getOrganizationThreatAnalysisRepository,
    getCustodyOverviewRepository,
    getInmatesDueForBailRepository,
    getCellOccupancyDetailsRepository,
    getDashboardOverviewRepository,
    getCriminalsAboveAvgCasesRepository,
    getCriminalOverviewRepository,
    getCriminalByDistrictRepository,
    getCrimeTypeDistributionRepository,
    getCrimePeakByYearRepository,
    getWantedByAreaRepository,
    getCrimeYearsRepository,
    getCriminalRankingRepository,
    getFreeOrgMembersRepository,
    getMonthlyArrestTrendRepository,
    getThanaPerformanceRepository,
    getJailOccupancyDetailRepository,
    getOfficerWorkloadRepository,
    getOfficerRankingRepository, 
    getDistrictCrimeStatsRepository,
    getAdminJailOverviewRepository,
    getAdminJailDetailsRepository,
    getAuditLogsRepository,
    recalculateAllRiskScoresRepository,
} from "../repositories/analyticsRepository.js";


export const getCriminalFullProfileService = async (criminalId) => {
    try {
        return await getCriminalFullProfileRepository(criminalId);
    } catch (error) {
        console.log("Error at getCriminalFullProfileService:", error);
        throw error;
    }
};

export const getHighRiskNetworkService = async () => {
    try {
        return await getHighRiskNetworkRepository();
    } catch (error) {
        console.log("Error at getHighRiskNetworkService:", error);
        throw error;
    }
};

export const getGdReportAnalyticsService = async (thanaId = null) => {
    try {
        return await getGdReportAnalyticsRepository(thanaId);
    } catch (error) {
        console.log("Error at getGdReportAnalyticsService:", error);
        throw error;
    }
};

// export const getBailStatisticsService = async () => {
//     try {
//         return await getBailStatisticsRepository();
//     } catch (error) {
//         console.log("Error at getBailStatisticsService:", error);
//         throw error;
//     }
// };

export const getCriminalMovementHistoryService = async (criminalId) => {
    try {
        return await getCriminalMovementHistoryRepository(criminalId);
    } catch (error) {
        console.log("Error at getCriminalMovementHistoryService:", error);
        throw error;
    }
};

export const getOrganizationThreatAnalysisService = async () => {
    try {
        return await getOrganizationThreatAnalysisRepository();
    } catch (error) {
        console.log("Error at getOrganizationThreatAnalysisService:", error);
        throw error;
    }
};

export const getCustodyOverviewService = async () => {
    try {
        return await getCustodyOverviewRepository();
    } catch (error) {
        console.log("Error at getCustodyOverviewService:", error);
        throw error;
    }
};

export const getInmatesDueForBailService = async () => {
    try {
        return await getInmatesDueForBailRepository();
    } catch (error) {
        console.log("Error at getInmatesDueForBailService:", error);
        throw error;
    }
};

export const getCellOccupancyDetailsService = async (jailId) => {
    try {
        return await getCellOccupancyDetailsRepository(jailId);
    } catch (error) {
        console.log("Error at getCellOccupancyDetailsService:", error);
        throw error;
    }
};

export const getDashboardOverviewService = async () => {
    try {
        return await getDashboardOverviewRepository();
    } catch (error) {
        console.log("Error at getDashboardOverviewService:", error);
        throw error;
    }
};

export const getCriminalsAboveAvgCasesService = async () => {
    try {
        return await getCriminalsAboveAvgCasesRepository();
    } catch (error) {
        console.log("Error at getCriminalsAboveAvgCasesService:", error);
        throw error;
    }
};

export const getCriminalOverviewService = async (district, thanaId) => {
    try {
        return await getCriminalOverviewRepository(district, thanaId);
    } catch (error) {
        console.log("Error at getCriminalOverviewService:", error);
        throw error;
    }
};

export const getCriminalByDistrictService = async (district, thanaId) => {
    try {
        return await getCriminalByDistrictRepository(district, thanaId);
    } catch (error) {
        console.log("Error at getCriminalByDistrictService:", error);
        throw error;
    }
};

export const getCrimeTypeDistributionService = async (year, district, thanaId) => {
    try {
        return await getCrimeTypeDistributionRepository(year, district, thanaId);
    } catch (error) {
        console.log("Error at getCrimeTypeDistributionService:", error);
        throw error;
    }
};

export const getCrimePeakByYearService = async (year, district, thanaId) => {
    try {
        return await getCrimePeakByYearRepository(year, district, thanaId);
    } catch (error) {
        console.log("Error at getCrimePeakByYearService:", error);
        throw error;
    }
};

export const getWantedByAreaService = async (district, thanaId) => {
    try {
        return await getWantedByAreaRepository(district, thanaId);
    } catch (error) {
        console.log("Error at getWantedByAreaService:", error);
        throw error;
    }
};

export const getCrimeYearsService = async () => {
    try {
        return await getCrimeYearsRepository();
    } catch (error) {
        console.log("Error at getCrimeYearsService:", error);
        throw error;
    }
};

export const getCriminalRankingService = async (district, thanaId) => {
    try {
        return await getCriminalRankingRepository(district, thanaId);
    } catch (error) {
        console.log("Error at getCriminalRankingService:", error);
        throw error;
    }
};

export const getFreeOrgMembersService = async () => {
    try {
        return await getFreeOrgMembersRepository();
    } catch (error) {
        console.log("Error at getFreeOrgMembersService:", error);
        throw error;
    }
};

export const getMonthlyArrestTrendService = async () => {
    try {
        return await getMonthlyArrestTrendRepository();
    } catch (error) {
        console.log("Error at getMonthlyArrestTrendService:", error);
        throw error;
    }
};



export const getThanaPerformanceService = async (thanaId = null) => {
    try {
        return await getThanaPerformanceRepository(thanaId);
    } catch (error) {
        console.log("Error at getThanaPerformanceService:", error);
        throw error;
    }
};

export const getJailOccupancyDetailService = async () => {
    try {
        return await getJailOccupancyDetailRepository();
    } catch (error) {
        console.log("Error at getJailOccupancyDetailService:", error);
        throw error;
    }
};

export const getOfficerWorkloadService = async (thanaId = null) => {
    try {
        return await getOfficerWorkloadRepository(thanaId);
    } catch (error) {
        console.log("Error at getOfficerWorkloadService:", error);
        throw error;
    }
};

export const getOfficerRankingService = async (thanaId = null) => {
    try {
        return await getOfficerRankingRepository(thanaId);
    } catch (error) {
        console.log("Error at getOfficerRankingService:", error);
        throw error;
    }
};

export const getDistrictCrimeStatsService = async (district) => {
    try {
        return await getDistrictCrimeStatsRepository(district);
    } catch (error) {
        console.log("Error at getDistrictCrimeStatsService:", error);
        throw error;
    }
};

export const getAdminJailOverviewService = async (limit = 10) => {
    try {
        return await getAdminJailOverviewRepository(limit);
    } catch (error) {
        console.log("Error at getAdminJailOverviewService:", error);
        throw error;
    }
};

export const getAdminJailDetailsService = async (jailId) => {
    try {
        return await getAdminJailDetailsRepository(jailId);
    } catch (error) {
        console.log("Error at getAdminJailDetailsService:", error);
        throw error;
    }
};




export const getAuditLogsService = async (tableName, page, limit) => {
    try {
        return await getAuditLogsRepository(tableName, page, limit);
    } catch (error) {
        console.log("Error at getAuditLogsService:", error);
        throw error;
    }
};

export const recalculateAllRiskScoresService = async () => {
    try {
        return await recalculateAllRiskScoresRepository();
    } catch (error) {
        console.log("Error at recalculateAllRiskScoresService:", error);
        throw error;
    }
};
