import NotFound from "@/pages/NotFound/NotFound";
import HomePage from "@/pages/HomePage/HomePage";
import AccessRedirectionPage from "@/pages/AccessRedirectionPage/AccessRedirectionPage";
import LoginPage from "@/pages/AccessRedirectionPage/LoginPage";
import { Routes, Route } from "react-router-dom";
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
import TransferCriminal from "@/pages/Dashboard/Thana/TransferCriminal";
import ManageGDStatus from "@/pages/Dashboard/Thana/GDPart/ManageGDStatus";
import CellList from "@/pages/Dashboard/Jail/Cell/CellList";
import AddCell from "@/pages/Dashboard/Jail/Cell/AddCell";
import UpdateCell from "@/pages/Dashboard/Jail/Cell/UpdateCell";



function Routing() {
  return (
    <Routes>
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
      <Route path="/thana/transfer-criminal" element={<TransferCriminal />} />
      <Route path="/thana/transfer-history" element={<TransferHistoryLookup />} />

      {/* Officer */}
      <Route path="/officer/dashboard" element={<OfficerDashboard />} />
      <Route path="/officer/dashboard/gd-list" element={<GDList />} />
      <Route path="/officer/dashboard/gd-list/:dairyId" element={<GDDetails />} />
      {/* <Route path="/officer/respond-gd/:gdId" element={<ResponseToGD />} /> */}

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
  );
}

export default Routing;