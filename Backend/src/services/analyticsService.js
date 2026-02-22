import {
    getCriminalFullProfileRepository,
    getHighRiskNetworkRepository,
    getGdReportAnalyticsRepository,
    getBailStatisticsRepository,
    getCriminalMovementHistoryRepository,
    getOrganizationThreatAnalysisRepository,
    getCustodyOverviewRepository,
    getInmatesDueForBailRepository,
    getCellOccupancyDetailsRepository,
    getDashboardOverviewRepository,
    getCriminalsAboveAvgCasesRepository,
    getCriminalRankingRepository,
    getFreeOrgMembersRepository,
    getMonthlyArrestTrendRepository,
    getThanaPerformanceRepository,
    getJailOccupancyDetailRepository,
    getOfficerWorkloadRepository,
    getDistrictCrimeStatsRepository,
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

export const getGdReportAnalyticsService = async () => {
    try {
        return await getGdReportAnalyticsRepository();
    } catch (error) {
        console.log("Error at getGdReportAnalyticsService:", error);
        throw error;
    }
};

export const getBailStatisticsService = async () => {
    try {
        return await getBailStatisticsRepository();
    } catch (error) {
        console.log("Error at getBailStatisticsService:", error);
        throw error;
    }
};

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

export const getCriminalRankingService = async () => {
    try {
        return await getCriminalRankingRepository();
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



export const getThanaPerformanceService = async () => {
    try {
        return await getThanaPerformanceRepository();
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

export const getOfficerWorkloadService = async () => {
    try {
        return await getOfficerWorkloadRepository();
    } catch (error) {
        console.log("Error at getOfficerWorkloadService:", error);
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
