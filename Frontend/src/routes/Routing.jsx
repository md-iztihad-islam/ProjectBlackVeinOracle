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
// import EditProfile from "@/pages/Dashboard/User/EditProfile";

function Routing(){
    return(
        <Routes>
            <Route 
                path="/" 
                element={<HomePage />} 
            />

            <Route 
                path="/access" 
                element={<AccessRedirectionPage />} 
            />

            <Route 
                path="/access/login/:userType" 
                element={<LoginPage />} 
            />

            <Route 
                path="/admin/dashboard"
                element={<AdminDashboard />}
            />

            <Route 
                path="/access/thana-register" 
                element={<ThanaRegistrationPage />} 
            />

            <Route 
                path="/access/officer-register" 
                element={<OfficerRegistrationPage />} 
            />

            <Route 
                path="/access/jail-register" 
                element={<JailRegistrationPage />} 
            />

            <Route 
                path="/user-registration" 
                element={<RegisterUser />} 
            />

            <Route
                path="/user-signin"
                element={<SigninUser />}
            />

            <Route
                path="/user/dashboard"
                element={<UserDashboard />}
            />

            <Route
                path="/user/dashboard/profile"
                element={<UserProfile />}
            />

            {/* <Route
                path="/user/dashboard/profile/edit"
                element={<EditProfile />}
            /> */}

            <Route
                path="/user/dashboard/add-gd-report"
                element={<AddGDReport />}
            />

            <Route 
                path="*" 
                element={<NotFound />} 
            />
        </Routes>
    )
}

export default Routing;