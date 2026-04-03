import NotFound from "@/pages/NotFound/NotFound";
import HomePage from "@/pages/HomePage/HomePage";
import AccessRedirectionPage from "@/pages/AccessRedirectionPage/AccessRedirectionPage";
import LoginPage from "@/pages/AccessRedirectionPage/LoginPage";
import { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import OfficerRegistrationPage from "@/pages/RegistrationPage/OfficerRegistrationPage";
import ThanaRegistrationPage from "@/pages/RegistrationPage/ThanaRegistrationPage";
import JailRegistrationPage from "@/pages/RegistrationPage/JailRegistrationPage";
import AdminDashboard from "@/pages/Dashboard/AdminDashboard";
import AddGDReport from "@/pages/Dashboard/User/AddGDReport";
import RegisterUser from "@/pages/Dashboard/User/RegisterUser";
import SigninUser from "@/pages/Dashboard/User/SigninUser";
import UserDashboard from "@/pages/Dashboard/User/UserDashboard";
import UserProfile from "@/pages/Dashboard/User/UserProfile";
import EditProfile from "@/pages/Dashboard/User/EditProfile";
import GDReports from "@/pages/Dashboard/User/GDReports";
import WantedCriminals from "@/pages/Dashboard/User/WantedCriminals";
import CriminalsByArea from "@/pages/Dashboard/User/CriminalsByArea";
import UserNotificationCenter from "@/pages/Dashboard/User/UserNotificationCenter";
import OfficerDashboard from "@/pages/Dashboard/Officer/OfficerDashboard";
import GDList from "@/pages/Dashboard/Officer/GDPart/GDList";
import GDDetails from "@/pages/Dashboard/Officer/GDPart/GDDetails";
import AdminThanaDashBoard from "@/pages/Dashboard/Admin/Thana/AdminThanaDashBoard";
import AddThana from "@/pages/Dashboard/Admin/Thana/AddThana";
import ThanaList from "@/pages/Dashboard/Admin/Thana/ThanaList";
import UpdateThana from "@/pages/Dashboard/Admin/Thana/UpdateThana";
import AssignThanaHead from "@/pages/Dashboard/Admin/Thana/AssignThanaHead";
import RankAdminDashboard from "@/pages/Dashboard/Admin/Rank/RankAdminDashboard";
import AddRank from "@/pages/Dashboard/Admin/Rank/AddRank";
import RankList from "@/pages/Dashboard/Admin/Rank/RankList";
import UpdateRank from "@/pages/Dashboard/Admin/Rank/UpdateRank";
import AssignRank from "@/pages/Dashboard/Admin/Rank/AssignRank";
import JailAdminDashboard from "@/pages/Dashboard/Admin/Jail/JailAdminDashboard";
import JailList from "@/pages/Dashboard/Admin/Jail/JailList";
import UpdateJail from "@/pages/Dashboard/Admin/Jail/UpdateJail";
import AddJail from "@/pages/Dashboard/Admin/Jail/AddJail";
import AdminNotificationCenter from "@/pages/Dashboard/Admin/AdminNotificationCenter";
import AdminAnalyticsOverview from "@/pages/Dashboard/Admin/AdminAnalyticsOverview";
import JailDashBoard from "@/pages/Dashboard/Jail/JailDashboard";
import JailAnalyticsOverview from "@/pages/Dashboard/Jail/JailAnalyticsOverview";
import JailNotificationCenter from "@/pages/Dashboard/Jail/JailNotificationCenter";
import JailTransferCriminal from "@/pages/Dashboard/Jail/JailTransferCriminal";
import JailTransferHistoryLookup from "@/pages/Dashboard/Jail/JailTransferHistoryLookup";
import CellBlockList from "@/pages/Dashboard/Jail/CellBlock/CellBlockList";
import AddCellBlock from "@/pages/Dashboard/Jail/CellBlock/AddCellBlock";
import UpdateCellBlock from "@/pages/Dashboard/Jail/CellBlock/UpdateCellBlock";
import ThanaDashboard from "@/pages/Dashboard/Thana/ThanaDashboard";
import AddCriminal from "@/pages/Dashboard/Thana/CriminalPart/AddCriminal";
import UpdateCriminal from "@/pages/Dashboard/Thana/CriminalPart/UpdateCriminal";
import AddCaseFile from "@/pages/Dashboard/Thana/CaseFilePart/AddCaseFile";
import UpdateCaseFile from "@/pages/Dashboard/Thana/CaseFilePart/UpdateCaseFile";
import AddOfficer from "@/pages/Dashboard/Thana/OfficerPart/AddOfficer";
import UpdateOfficer from "@/pages/Dashboard/Thana/OfficerPart/UpdateOfficer";
import AddLocation from "@/pages/Dashboard/Thana/CriminalPart/AddLocation";
import AddOrganization from "@/pages/Dashboard/Thana/CriminalPart/AddOrganization";
import UpdateLocation from "@/pages/Dashboard/Thana/CriminalPart/UpdateLocation";
import UpdateOrganization from "@/pages/Dashboard/Thana/CriminalPart/UpdateOrganization";
import AddCriminalRelation from "@/pages/Dashboard/Thana/CriminalPart/AddCriminalRelation";
import UpdateCriminalOrganization from "@/pages/Dashboard/Thana/CriminalPart/UpdateCriminalOrganization";
import AddCriminalLocation from "@/pages/Dashboard/Thana/CriminalPart/AddCriminalLocation";
import AddCriminalOrganization from "@/pages/Dashboard/Thana/CriminalPart/AddCriminalOrganization";
import UpdateCriminalRelation from "@/pages/Dashboard/Thana/CriminalPart/UpdateCriminalRelation";
import NotificationCenter from "@/pages/Dashboard/Thana/NotificationCenter";
import AnalyticsOverview from "@/pages/Dashboard/Thana/AnalyticsOverview";
import TransferHistoryLookup from "@/pages/Dashboard/Thana/TransferHistoryLookup";
import ManageGDStatus from "@/pages/Dashboard/Thana/GDPart/ManageGDStatus";
import CellList from "@/pages/Dashboard/Jail/Cell/CellList";
import AddCell from "@/pages/Dashboard/Jail/Cell/AddCell";
// <<<<<<< HEAD
// import ArrestRecordList from "@/pages/Dashboard/Officer/Arrest/ArrestRecordList";
// import UpdateArrestRecord from "@/pages/Dashboard/Officer/Arrest/UpdateArrestRecord";
// import ArrestRecordDetails from "@/pages/Dashboard/Officer/Arrest/ArrestRecordDetails";
// import AddArrestRecord from "@/pages/Dashboard/Officer/Arrest/AddArrestRecord";
// import AddBailRecord from "@/pages/Dashboard/Officer/Bail/AddBailRecord";
// import UpdateBailRecord from "@/pages/Dashboard/Officer/Bail/UpdateBailRecord";
// import BailRecordDetails from "@/pages/Dashboard/Officer/Bail/BailRecordDetails";
// import ResponseToGD from "@/pages/Dashboard/Officer/GDPart/ResponseToGD";
// =======
// import UpdateCell from "@/pages/Dashboard/Jail/Cell/UpdateCell";
// >>>>>>> 8923ed636c9794a778e6f6dfa662f45b1f178003


import UpdateCell from "@/pages/Dashboard/Jail/Cell/UpdateCell";
import ArrestRecordList from "@/pages/Dashboard/Officer/Arrest/ArrestRecordList";
import UpdateArrestRecord from "@/pages/Dashboard/Officer/Arrest/UpdateArrestRecord";
import ArrestRecordDetails from "@/pages/Dashboard/Officer/Arrest/ArrestRecordDetails";
import AddArrestRecord from "@/pages/Dashboard/Officer/Arrest/AddArrestRecord";
import AddBailRecord from "@/pages/Dashboard/Officer/Bail/AddBailRecord";
import UpdateBailRecord from "@/pages/Dashboard/Officer/Bail/UpdateBailRecord";
import BailRecordDetails from "@/pages/Dashboard/Officer/Bail/BailRecordDetails";
import ResponseToGD from "@/pages/Dashboard/Officer/GDPart/ResponseToGD";
import CriminalProfile from "@/pages/Dashboard/Officer/Arrest/CriminalProfile";
import CaseFile from "@/pages/Dashboard/Officer/Arrest/CaseFile";
import Organization from "@/pages/Dashboard/Officer/Arrest/Organization";
import OfficerProfile from "@/pages/Dashboard/Officer/OfficerProfile";
import OfficerAnalytics from "@/pages/Dashboard/Admin/Analytics/OfficerAnalytics";
import OfficerProfileAnalytics from "@/pages/Dashboard/Admin/Analytics/OfficerProfileAnalytics";
import ThanaAnalytics from "@/pages/Dashboard/Admin/Analytics/ThanaAnalytics";



function Routing() {
  const location = useLocation();
  const navigate = useNavigate();
  const backgroundLocation = location.state?.modal ? location.state.backgroundLocation : null;

  const closeModal = () => navigate(-1);

  return (
    <>
    <Routes location={backgroundLocation || location}>
      <Route path="/" element={<HomePage />} />
      <Route path="/access" element={<AccessRedirectionPage />} />
      <Route path="/access/login/:userType" element={<LoginPage />} />
      <Route
        path="/access/thana-register"
        element={<ThanaRegistrationPage />}
      />
      <Route
        path="/access/officer-register"
        element={<OfficerRegistrationPage />}
      />
      <Route path="/access/jail-register" element={<JailRegistrationPage />} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/dashboard/thanadashboard" element={<AdminThanaDashBoard />} />
      <Route path="/admin/dashboard/thanadashboard/add-thana" element={<AddThana />} />
      <Route path="/admin/dashboard/thanadashboard/thana-list" element={<ThanaList />} />
      <Route path="/admin/dashboard/thanadashboard/thana-list/update-thana/:thana_id" element={<UpdateThana />} />
      <Route path="/admin/dashboard/thanadashboard/thana-list/thana-head/:thana_id" element={<AssignThanaHead />} />

      <Route path="/admin/dashboard/rankdashboard" element={<RankAdminDashboard />} />
      <Route path="/admin/dashboard/rankdashboard/add-rank" element={<AddRank />} />
      <Route path="/admin/dashboard/rankdashboard/rank-list" element={<RankList />} />
      <Route path="/admin/dashboard/rankdashboard/rank-list/update-rank/:rankId" element={<UpdateRank />} />
      <Route path="/admin/dashboard/rankdashboard/rank-list/assign-rank/:rankId" element={<AssignRank />} />

      <Route path="/admin/dashboard/jaildashboard" element={<JailAdminDashboard />} />
      <Route path="/admin/dashboard/jaildashboard/add-jail" element={<AddJail />} />
      <Route path="/admin/dashboard/jaildashboard/jail-list" element={<JailList />} />
      <Route path="/admin/dashboard/jaildashboard/jail-list/update-jail/:jailId" element={<UpdateJail />} />
      <Route path="/admin/dashboard/notifications" element={<AdminNotificationCenter />} />
      <Route path="/admin/dashboard/analytics" element={<AdminAnalyticsOverview />} />


      {/* Jail */}
      <Route path="/jail/dashboard" element={<JailDashBoard />} />
      <Route path="/jail/dashboard/analytics" element={<JailAnalyticsOverview />} />
      <Route path="/jail/dashboard/notifications" element={<JailNotificationCenter />} />
      <Route path="/jail/dashboard/transfer-criminal" element={<JailTransferCriminal />} />
      <Route path="/jail/dashboard/transfer-history" element={<JailTransferHistoryLookup />} />
      <Route path="/jail/dashboard/cell-block-list" element={<CellBlockList />} />
      <Route path="/jail/dashboard/add-cell-block" element={<AddCellBlock />} />
      <Route path="/jail/dashboard/cell-block-list/update-cell-block/:cellBlockId" element={<UpdateCellBlock />} />

      <Route path="/jail/dashboard/cellblock/:blockId/cells" element={<CellList />} />
      <Route path="/jail/dashboard/cellblock/:blockId/addcell" element={<AddCell />} />
      <Route path="/jail/dashboard/cell/update/:cellId" element={<UpdateCell />} />

      {/* Thana */}
      
      <Route path="/thana/dashboard" element={<ThanaDashboard />} />
      <Route path="/thana/add-criminal" element={<AddCriminal />} />
      <Route
        path="/thana/update-criminal/:criminalId"
        element={<UpdateCriminal />}
      />
      <Route path="/thana/add-case-file" element={<AddCaseFile />} />
      <Route
        path="/thana/update-case-file/:caseId"
        element={<UpdateCaseFile />}
      />
      <Route path="/thana/add-officer" element={<AddOfficer />} />
      <Route
        path="/thana/update-officer/:officerId"
        element={<UpdateOfficer />}
      />
      <Route path="/thana/add-location" element={<AddLocation />} />
      <Route path="/thana/update-location/:locationId" element={<UpdateLocation />} />
      <Route path="/thana/add-organization" element={<AddOrganization />} />
      <Route path="/thana/update-organization" element={<UpdateOrganization />} />
      <Route path="/thana/update-organization/:orgId" element={<UpdateOrganization />} />
      <Route path="/thana/add-criminal-relation" element={<AddCriminalRelation />} />
      <Route path="/thana/add-criminal-location" element={<AddCriminalLocation />} />
      <Route path="/thana/add-criminal-organization" element={<AddCriminalOrganization />} />
      <Route path="/thana/update-criminal-organization" element={<UpdateCriminalOrganization />} />
      <Route path="/thana/update-criminal-relation" element={<UpdateCriminalRelation />} />
      <Route path="/thana/update-location" element={<UpdateLocation />} />
      <Route path="/thana/gd/manage/:gdId" element={<ManageGDStatus />} />
      <Route path="/thana/notifications" element={<NotificationCenter />} />
      <Route path="/thana/analytics-overview" element={<AnalyticsOverview />} />
      <Route path="/thana/transfer-history" element={<TransferHistoryLookup />} />

      {/* Officer */}
      <Route path="/officer/dashboard" element={<OfficerDashboard />} />
      <Route path="/officer/dashboard/profile" element={<OfficerProfile />} />
      <Route path="/officer/dashboard/arrest-records" element={<ArrestRecordList />} />
      <Route path="/officer/dashboard/update-arrest-record/:arrestId" element={<UpdateArrestRecord />} />
      <Route path="/officer/dashboard/arrest-record-details/:arrestId" element={<ArrestRecordDetails />} />
      <Route path="/officer/dashboard/add-arrest-record" element={<AddArrestRecord />} />
      <Route path="/officer/dashboard/arrest-record-details/:arrestId/add-bail" element={<AddBailRecord />} />
      <Route path="/officer/dashboard/arrest-records/:arrestId/update-bail/:bailId" element={<UpdateBailRecord />} />
      <Route path="/officer/dashboard/arrest-records/:arrestId/bail-record-details/:bailId" element={<BailRecordDetails />} />
      <Route path="/officer/dashboard/gd-list" element={<GDList />} />
      <Route path="/officer/dashboard/gd-list/:dairyId" element={<GDDetails />} />
      <Route path="/officer/respond-gd/:gdId" element={<ResponseToGD />} />
      <Route path="/officer/dashboard/criminal-profile/:criminalId" element={<CriminalProfile />} />
      <Route path="/officer/dashboard/criminal-profile/:criminalId/case-file/:caseId" element={<CaseFile />} />
      <Route path="/officer/dashboard/criminal-profile/:criminalId/organization/:orgId" element={<Organization />} />

      {/* Analytics */}
      <Route path="/analytics/officer" element={<OfficerAnalytics />} />
      <Route path="/analytics/officer/profile/:officerId" element={<OfficerProfileAnalytics />} />
      <Route path="/analytics/thana" element={<ThanaAnalytics />} />

      {/* User */}
      <Route path="/user-registration" element={<RegisterUser />} />
      <Route path="/user-signin" element={<SigninUser />} />
      <Route path="/user/dashboard" element={<UserDashboard />} />
      <Route path="/user/dashboard/profile" element={<UserProfile />} />
      <Route path="/user/dashboard/profile/edit" element={<EditProfile />} />
      <Route path="/user/dashboard/add-gd-report" element={<AddGDReport />} />
      <Route path="/user/dashboard/gd-reports" element={<GDReports />} />
      <Route
        path="/user/dashboard/wanted-criminals"
        element={<WantedCriminals />}
      />
      <Route
        path="/user/dashboard/criminals-by-area"
        element={<CriminalsByArea />}
      />
      <Route
        path="/user/dashboard/notifications"
        element={<UserNotificationCenter />}
      />

      <Route path="*" element={<NotFound />} />
    </Routes>

    {backgroundLocation && (
      <Routes>
        {/* Admin modal routes */}
        <Route path="/admin/dashboard/notifications" element={<ModalShell onClose={closeModal}><AdminNotificationCenter /></ModalShell>} />
        <Route path="/admin/dashboard/analytics" element={<ModalShell onClose={closeModal}><AdminAnalyticsOverview /></ModalShell>} />
        <Route path="/admin/dashboard/thanadashboard" element={<ModalShell onClose={closeModal}><AdminThanaDashBoard /></ModalShell>} />
        <Route path="/admin/dashboard/thanadashboard/add-thana" element={<ModalShell onClose={closeModal}><AddThana /></ModalShell>} />
        <Route path="/admin/dashboard/thanadashboard/thana-list" element={<ModalShell onClose={closeModal}><ThanaList /></ModalShell>} />
        <Route path="/admin/dashboard/thanadashboard/thana-list/update-thana/:thana_id" element={<ModalShell onClose={closeModal}><UpdateThana /></ModalShell>} />
        <Route path="/admin/dashboard/thanadashboard/thana-list/thana-head/:thana_id" element={<ModalShell onClose={closeModal}><AssignThanaHead /></ModalShell>} />
        <Route path="/admin/dashboard/rankdashboard" element={<ModalShell onClose={closeModal}><RankAdminDashboard /></ModalShell>} />
        <Route path="/admin/dashboard/rankdashboard/add-rank" element={<ModalShell onClose={closeModal}><AddRank /></ModalShell>} />
        <Route path="/admin/dashboard/rankdashboard/rank-list" element={<ModalShell onClose={closeModal}><RankList /></ModalShell>} />
        <Route path="/admin/dashboard/rankdashboard/rank-list/update-rank/:rankId" element={<ModalShell onClose={closeModal}><UpdateRank /></ModalShell>} />
        <Route path="/admin/dashboard/rankdashboard/rank-list/assign-rank/:rankId" element={<ModalShell onClose={closeModal}><AssignRank /></ModalShell>} />
        <Route path="/admin/dashboard/jaildashboard" element={<ModalShell onClose={closeModal}><JailAdminDashboard /></ModalShell>} />
        <Route path="/admin/dashboard/jaildashboard/add-jail" element={<ModalShell onClose={closeModal}><AddJail /></ModalShell>} />
        <Route path="/admin/dashboard/jaildashboard/jail-list" element={<ModalShell onClose={closeModal}><JailList /></ModalShell>} />
        <Route path="/admin/dashboard/jaildashboard/jail-list/update-jail/:jailId" element={<ModalShell onClose={closeModal}><UpdateJail /></ModalShell>} />

        {/* Jail modal routes */}
        <Route path="/jail/dashboard/analytics" element={<ModalShell onClose={closeModal}><JailAnalyticsOverview /></ModalShell>} />
        <Route path="/jail/dashboard/notifications" element={<ModalShell onClose={closeModal}><JailNotificationCenter /></ModalShell>} />
        <Route path="/jail/dashboard/transfer-criminal" element={<ModalShell onClose={closeModal}><JailTransferCriminal /></ModalShell>} />
        <Route path="/jail/dashboard/transfer-history" element={<ModalShell onClose={closeModal}><JailTransferHistoryLookup /></ModalShell>} />
        <Route path="/jail/dashboard/cell-block-list" element={<ModalShell onClose={closeModal}><CellBlockList /></ModalShell>} />
        <Route path="/jail/dashboard/add-cell-block" element={<ModalShell onClose={closeModal}><AddCellBlock /></ModalShell>} />
        <Route path="/jail/dashboard/cell-block-list/update-cell-block/:cellBlockId" element={<ModalShell onClose={closeModal}><UpdateCellBlock /></ModalShell>} />
        <Route path="/jail/dashboard/cellblock/:blockId/cells" element={<ModalShell onClose={closeModal}><CellList /></ModalShell>} />
        <Route path="/jail/dashboard/cellblock/:blockId/addcell" element={<ModalShell onClose={closeModal}><AddCell /></ModalShell>} />
        <Route path="/jail/dashboard/cell/update/:cellId" element={<ModalShell onClose={closeModal}><UpdateCell /></ModalShell>} />

        {/* Thana modal routes */}
        <Route path="/thana/notifications" element={<ModalShell onClose={closeModal}><NotificationCenter /></ModalShell>} />
        <Route path="/thana/analytics-overview" element={<ModalShell onClose={closeModal}><AnalyticsOverview /></ModalShell>} />
        <Route path="/thana/add-criminal" element={<ModalShell onClose={closeModal}><AddCriminal /></ModalShell>} />
        <Route path="/thana/update-criminal/:criminalId" element={<ModalShell onClose={closeModal}><UpdateCriminal /></ModalShell>} />
        <Route path="/thana/add-case-file" element={<ModalShell onClose={closeModal}><AddCaseFile /></ModalShell>} />
        <Route path="/thana/update-case-file/:caseId" element={<ModalShell onClose={closeModal}><UpdateCaseFile /></ModalShell>} />
        <Route path="/thana/add-officer" element={<ModalShell onClose={closeModal}><AddOfficer /></ModalShell>} />
        <Route path="/thana/update-officer/:officerId" element={<ModalShell onClose={closeModal}><UpdateOfficer /></ModalShell>} />
        <Route path="/thana/add-location" element={<ModalShell onClose={closeModal}><AddLocation /></ModalShell>} />
        <Route path="/thana/update-location/:locationId" element={<ModalShell onClose={closeModal}><UpdateLocation /></ModalShell>} />
        <Route path="/thana/add-organization" element={<ModalShell onClose={closeModal}><AddOrganization /></ModalShell>} />
        <Route path="/thana/update-organization" element={<ModalShell onClose={closeModal}><UpdateOrganization /></ModalShell>} />
        <Route path="/thana/update-organization/:orgId" element={<ModalShell onClose={closeModal}><UpdateOrganization /></ModalShell>} />
        <Route path="/thana/add-criminal-relation" element={<ModalShell onClose={closeModal}><AddCriminalRelation /></ModalShell>} />
        <Route path="/thana/add-criminal-location" element={<ModalShell onClose={closeModal}><AddCriminalLocation /></ModalShell>} />
        <Route path="/thana/add-criminal-organization" element={<ModalShell onClose={closeModal}><AddCriminalOrganization /></ModalShell>} />
        <Route path="/thana/update-criminal-organization" element={<ModalShell onClose={closeModal}><UpdateCriminalOrganization /></ModalShell>} />
        <Route path="/thana/update-criminal-relation" element={<ModalShell onClose={closeModal}><UpdateCriminalRelation /></ModalShell>} />
        <Route path="/thana/update-location" element={<ModalShell onClose={closeModal}><UpdateLocation /></ModalShell>} />
        <Route path="/thana/gd/manage/:gdId" element={<ModalShell onClose={closeModal}><ManageGDStatus /></ModalShell>} />
        <Route path="/thana/transfer-history" element={<ModalShell onClose={closeModal}><TransferHistoryLookup /></ModalShell>} />
      </Routes>
    )}
    </>
  );
}

function ModalShell({ children, onClose }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div
      className="app-modal-overlay fixed inset-0 z-[80] bg-slate-900/45 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="app-modal-content modal-shell-content w-full max-w-6xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export default Routing;