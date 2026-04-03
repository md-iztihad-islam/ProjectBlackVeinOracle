import express from 'express';
import {
  getCriminalFullProfileController,
  getHighRiskNetworkController,
  getGdReportAnalyticsController,
  // getBailStatisticsController,
  getCriminalMovementHistoryController,
  getOrganizationThreatAnalysisController,
  getCustodyOverviewController,
  getInmatesDueForBailController,
  getCellOccupancyDetailsController,
  getDashboardOverviewController,
  getCriminalsAboveAvgCasesController,
  getCriminalOverviewController,
  getCriminalByDistrictController,
  getCrimeTypeDistributionController,
  getCrimePeakByYearController,
  getWantedByAreaController,
  getCrimeYearsController,
  getCriminalRankingController,
  getFreeOrgMembersController,
  getMonthlyArrestTrendController,
  getThanaPerformanceController,
  getJailOccupancyDetailController,
  getOfficerWorkloadController,
  getOfficerRankingController,
  getDistrictCrimeStatsController,
  getAuditLogsController,
  recalculateAllRiskScoresController,
} from '../../controllers/analyticsController.js';
import isAuthenticated from '../../utils/isAuthenticated.js'; 
import requireRole from '../../utils/requireRole.js'; 

const router = express.Router();


router.get('/criminal-full-profile/:criminalId', isAuthenticated, requireRole("admin", "thana", "officer", "jail"), getCriminalFullProfileController);
router.get('/high-risk-network', isAuthenticated, requireRole("admin", "thana"), getHighRiskNetworkController);
router.get('/gd-report-analytics', isAuthenticated, requireRole("admin", "thana"), getGdReportAnalyticsController);
// router.get('/bail-statistics', isAuthenticated, requireRole("admin", "thana"), getBailStatisticsController);
router.get('/criminal-movement-history/:criminalId', isAuthenticated, requireRole("admin", "thana", "officer"), getCriminalMovementHistoryController);
router.get('/organization-threat-analysis', isAuthenticated, requireRole("admin", "thana"), getOrganizationThreatAnalysisController);
router.get('/custody-overview', isAuthenticated, requireRole("admin", "thana", "jail"), getCustodyOverviewController);
router.get('/inmates-due-for-bail', isAuthenticated, requireRole("admin", "thana", "jail"), getInmatesDueForBailController);
router.get('/cell-occupancy-details/:jailId', isAuthenticated, requireRole("admin", "jail"), getCellOccupancyDetailsController);
router.get('/dashboard-overview', isAuthenticated, requireRole("admin", "thana", "officer", "jail"), getDashboardOverviewController);

router.get('/criminals-above-avg-cases', isAuthenticated, requireRole("admin", "thana"), getCriminalsAboveAvgCasesController);
router.get('/criminal-overview', isAuthenticated, requireRole("admin", "thana"), getCriminalOverviewController);
router.get('/criminal-by-district', isAuthenticated, requireRole("admin", "thana"), getCriminalByDistrictController);
router.get('/crime-type-distribution', isAuthenticated, requireRole("admin", "thana"), getCrimeTypeDistributionController);
router.get('/crime-peak-by-year', isAuthenticated, requireRole("admin", "thana"), getCrimePeakByYearController);
router.get('/wanted-by-area', isAuthenticated, requireRole("admin", "thana"), getWantedByAreaController);
router.get('/crime-years', isAuthenticated, requireRole("admin", "thana"), getCrimeYearsController);
router.get('/criminal-ranking', isAuthenticated, requireRole("admin", "thana"), getCriminalRankingController);
router.get('/free-org-members', isAuthenticated, requireRole("admin", "thana"), getFreeOrgMembersController);
router.get('/monthly-arrest-trend', isAuthenticated, requireRole("admin", "thana"), getMonthlyArrestTrendController);

router.get('/thana-performance', isAuthenticated, requireRole("admin", "thana", "officer", "jail"), getThanaPerformanceController);
router.get('/jail-occupancy-detail', isAuthenticated, requireRole("admin", "jail", "thana", "officer"), getJailOccupancyDetailController);
router.get('/officer-workload', isAuthenticated, requireRole("admin", "thana", "officer", "jail"), getOfficerWorkloadController);
router.get('/officer-ranking', isAuthenticated, requireRole("admin", "thana", "officer", "jail"), getOfficerRankingController);
router.get('/district-crime-stats', isAuthenticated, requireRole("admin", "thana", "officer", "jail"), getDistrictCrimeStatsController);


router.get('/audit-logs', isAuthenticated, requireRole("admin"), getAuditLogsController);
router.post('/recalculate-all-risks', isAuthenticated, requireRole("admin"), recalculateAllRiskScoresController);

export default router;
