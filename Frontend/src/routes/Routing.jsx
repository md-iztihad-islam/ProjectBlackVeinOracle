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
// import ThanaDashboard from "@/pages/Dashboard/Thana/ThanaDashboard";
// import AddCriminal from "@/pages/Dashboard/Thana/CriminalPart/AddCriminal";
// import UpdateCriminal from "@/pages/Dashboard/Thana/CriminalPart/UpdateCriminal";
// import AddCaseFile from "@/pages/Dashboard/Thana/CaseFilePart/AddCaseFile";
// import UpdateCaseFile from "@/pages/Dashboard/Thana/CaseFilePart/UpdateCaseFile";
// import AddOfficer from "@/pages/Dashboard/Thana/OfficerPart/AddOfficer";
// import UpdateOfficer from "@/pages/Dashboard/Thana/OfficerPart/UpdateOfficer";
// import AddLocation from "@/pages/Dashboard/Thana/CriminalPart/AddLocation";
// import AddOrganization from "@/pages/Dashboard/Thana/CriminalPart/AddOrganization";
// // import OfficerDashboard from "@/pages/Dashboard/Officer/OfficerDashboard";
// // import ResponseToGD from "@/pages/Dashboard/Officer/GDPart/ResponseToGD";
import WantedCriminals from "@/pages/Dashboard/User/WantedCriminals";
import CriminalsByArea from "@/pages/Dashboard/User/CriminalsByArea";
import OfficerDashboard from "@/pages/Dashboard/Officer/OfficerDashboard";
import GDList from "@/pages/Dashboard/Officer/GDPart/GDList";
import GDDetails from "@/pages/Dashboard/Officer/GDPart/GDDetails";
import AdminThanaDashBoard from "@/pages/Dashboard/Admin/Thana/AdminThanaDashBoard";
import AddThana from "@/pages/Dashboard/Admin/Thana/AddThana";
import ThanaList from "@/pages/Dashboard/Admin/Thana/ThanaList";
import UpdateThana from "@/pages/Dashboard/Admin/Thana/UpdateThana";
import AssignThanaHead from "@/pages/Dashboard/Admin/Thana/AssignThanaHead";



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

      {/* Thana */}
      

      {/* Thana
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
      <Route path="/thana/add-organization" element={<AddOrganization />} /> */}

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

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default Routing;