import express from 'express';
import {
  getCriminalFullProfileController,
  getHighRiskNetworkController,
  getGdReportAnalyticsController,
  getBailStatisticsController,
  getCriminalMovementHistoryController,
  getOrganizationThreatAnalysisController,
  getCustodyOverviewController,
  getInmatesDueForBailController,
  getCellOccupancyDetailsController,
  getDashboardOverviewController,
  getCriminalsAboveAvgCasesController,
  getCriminalRankingController,
  getFreeOrgMembersController,
  getMonthlyArrestTrendController,
  getThanaPerformanceController,
  getJailOccupancyDetailController,
  getOfficerWorkloadController,
  getDistrictCrimeStatsController,
  getAuditLogsController,
  recalculateAllRiskScoresController,
} from '../../controllers/analyticsController.js';
import isAuthenticated from '../../utils/isAuthenticated.js'; 
import requireRole from '../../utils/requireRole.js'; 

const router = express.Router();


router.get('/criminal-full-profile/:criminalId', isAuthenticated, requireRole("admin", "thana", "officer"), getCriminalFullProfileController);
router.get('/high-risk-network', isAuthenticated, requireRole("admin", "thana"), getHighRiskNetworkController);
router.get('/gd-report-analytics', isAuthenticated, requireRole("admin", "thana"), getGdReportAnalyticsController);
router.get('/bail-statistics', isAuthenticated, requireRole("admin", "thana"), getBailStatisticsController);
router.get('/criminal-movement-history/:criminalId', isAuthenticated, requireRole("admin", "thana", "officer"), getCriminalMovementHistoryController);
router.get('/organization-threat-analysis', isAuthenticated, requireRole("admin", "thana"), getOrganizationThreatAnalysisController);
router.get('/custody-overview', isAuthenticated, requireRole("admin", "thana", "jail"), getCustodyOverviewController);
router.get('/inmates-due-for-bail', isAuthenticated, requireRole("admin", "thana", "jail"), getInmatesDueForBailController);
router.get('/cell-occupancy-details/:jailId', isAuthenticated, requireRole("admin", "jail"), getCellOccupancyDetailsController);
router.get('/dashboard-overview', isAuthenticated, requireRole("admin"), getDashboardOverviewController);

router.get('/criminals-above-avg-cases', isAuthenticated, requireRole("admin", "thana"), getCriminalsAboveAvgCasesController);
router.get('/criminal-ranking', isAuthenticated, requireRole("admin", "thana"), getCriminalRankingController);
router.get('/free-org-members', isAuthenticated, requireRole("admin", "thana"), getFreeOrgMembersController);
router.get('/monthly-arrest-trend', isAuthenticated, requireRole("admin", "thana"), getMonthlyArrestTrendController);

router.get('/thana-performance', isAuthenticated, requireRole("admin"), getThanaPerformanceController);
router.get('/jail-occupancy-detail', isAuthenticated, requireRole("admin", "jail"), getJailOccupancyDetailController);
router.get('/officer-workload', isAuthenticated, requireRole("admin", "thana"), getOfficerWorkloadController);
router.get('/district-crime-stats', isAuthenticated, requireRole("admin", "thana"), getDistrictCrimeStatsController);


router.get('/audit-logs', isAuthenticated, requireRole("admin"), getAuditLogsController);
router.post('/recalculate-all-risks', isAuthenticated, requireRole("admin"), recalculateAllRiskScoresController);

export default router;
