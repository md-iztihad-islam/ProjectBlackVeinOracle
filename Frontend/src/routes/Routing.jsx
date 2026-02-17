import NotFound from "@/pages/NotFound/NotFound";
import HomePage from "@/pages/HomePage/HomePage";
import AccessRedirectionPage from "@/pages/AccessRedirectionPage/AccessRedirectionPage";
import LoginPage from "@/pages/AccessRedirectionPage/LoginPage";
import { Routes, Route } from "react-router-dom";
import OfficerRegistrationPage from "@/pages/RegistrationPage/OfficerRegistrationPage";
import ThanaRegistrationPage from "@/pages/RegistrationPage/ThanaRegistrationPage";
import JailRegistrationPage from "@/pages/RegistrationPage/JailRegistrationPage";
import UserRegistrationPage from "@/pages/RegistrationPage/UserRegistrationPage";
import AdminDashboard from "@/pages/Dashboard/AdminDashboard";

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
                path="/access/user-register" 
                element={<UserRegistrationPage />} 
            />

            <Route 
                path="*" 
                element={<NotFound />} 
            />
        </Routes>
    )
}

export default Routing;