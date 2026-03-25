import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
// import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input"; 
import {
  Shield,
  Building2,
  UserCog,
  Building,
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import {
  adminLoginApi,
  jailLoginApi,
  officerLoginApi,
  thanaLoginApi,
} from "@/services/authServices/loginApi";
import userStore from "@/state/userStore";

const userTypes = {
  admin: {
    title: "Admin",
    subtitle: "System Administrator Access",
    icon: Shield,
    gradient: "from-red-600 to-red-700",
    bgGlow: "bg-red-500/10",
    accentColor: "red",
    useUsername: true,
  },
  thana: {
    title: "Thana",
    subtitle: "Police Station Portal",
    icon: Building2,
    gradient: "from-blue-600 to-blue-700",
    bgGlow: "bg-blue-500/10",
    accentColor: "blue",
    useUsername: false,
  },
  officer: {
    title: "Officer",
    subtitle: "Law Enforcement Access",
    icon: UserCog,
    gradient: "from-green-600 to-green-700",
    bgGlow: "bg-green-500/10",
    accentColor: "green",
    useUsername: false,
  },
  jail: {
    title: "Jail",
    subtitle: "Correctional Facility Portal",
    icon: Building,
    gradient: "from-orange-600 to-orange-700",
    bgGlow: "bg-orange-500/10",
    accentColor: "orange",
    useUsername: false,
  },
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const { userType = "admin" } = useParams();
  const { setUser } = userStore();

  const config = userTypes[userType] || userTypes.admin;
  const Icon = config.icon;

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const {
    mutate: loginMutation,
    isPending,
    error,
  } = useMutation({
    // by Rayyan 2.0 — was isLoading
    mutationFn: (credentials) => {
      if (userType === "admin") {
        return adminLoginApi(credentials);
      } else if (userType === "thana") {
        return thanaLoginApi(credentials);
      } else if (userType === "officer") {
        return officerLoginApi(credentials);
      } else if (userType === "jail") {
        return jailLoginApi(credentials);
      }
    },
    onSuccess: (data) => {
      if (!data?.success) {
        alert(
          data?.error || data?.message || "Login failed. Please try again.",
        );
        return;
      }
      console.log("Login successful:", data);
      setUser(data?.data?.user);

      // const dashboardRoutes = {
      //     admin: '/admin/dashboard',
      //     thana: '/access',
      //     officer: '/access',
      //     jail: '/access',
      // };
      const dashboardRoutes = {
        admin: "/admin/dashboard",
        thana: "/thana/dashboard",
        officer: "/officer/dashboard",
        jail: "/admin/dashboard",
      };
      navigate(dashboardRoutes[userType] || "/access");
    },
    onError: (error) => {
      alert(error?.message || "Login failed. Please try again.");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    loginMutation(
      config.useUsername ? { username, password } : { email, password },
    );
  };

  const getAccentClasses = (color) => {
    const colors = {
      red: {
        text: "text-red-500",
        border: "border-red-500",
        bg: "bg-red-500",
        ring: "ring-red-500/50",
        hover: "hover:bg-red-500/10",
        gradient: "from-red-600 to-red-700",
      },
      blue: {
        text: "text-blue-500",
        border: "border-blue-500",
        bg: "bg-blue-500",
        ring: "ring-blue-500/50",
        hover: "hover:bg-blue-500/10",
        gradient: "from-blue-600 to-blue-700",
      },
      green: {
        text: "text-green-500",
        border: "border-green-500",
        bg: "bg-green-500",
        ring: "ring-green-500/50",
        hover: "hover:bg-green-500/10",
        gradient: "from-green-600 to-green-700",
      },
      orange: {
        text: "text-orange-500",
        border: "border-orange-500",
        bg: "bg-orange-500",
        ring: "ring-orange-500/50",
        hover: "hover:bg-orange-500/10",
        gradient: "from-orange-600 to-orange-700",
      },
    };
    return colors[color] || colors.red;
  };

  const accentClasses = getAccentClasses(config.accentColor);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-100 via-base-200 to-base-100 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-1/4 left-1/4 w-96 h-96 ${config.bgGlow} rounded-full blur-3xl animate-pulse`}
        ></div>
        <div
          className={`absolute bottom-1/4 right-1/4 w-96 h-96 ${config.bgGlow} rounded-full blur-3xl animate-pulse`}
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-2xl opacity-30"
          style={{
            background: `radial-gradient(circle, ${config.bgGlow.replace("bg-", "rgba(")} 0%, transparent 70%)`,
          }}
        ></div>
      </div>

      {/* Back Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 glass-panel rounded-lg hover:bg-base-200/70 transition-all group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to Categories</span>
      </Link>

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        <div className="card-elevated p-8 animate-fade-in">
          {/* Logo/Icon */}
          <div className="text-center mb-8">
            <div
              className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${config.gradient} rounded-2xl mb-4 shadow-2xl`}
              style={{
                boxShadow: `0 25px 50px -12px ${config.bgGlow.replace("bg-", "rgba(")}0.4)`,
              }}
            >
              <Icon className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-3xl font-display font-bold text-base-content mb-2">
              {config.title} Login
            </h1>
            <p className="text-sm text-base-content/60">{config.subtitle}</p>
          </div>

          {/* Black Vein Oracle Branding */}
          <div className="text-center mb-6 pb-6 border-b border-base-content/10">
            <h2 className="text-lg font-display font-bold gradient-text">
              BLACK VEIN ORACLE
            </h2>
            <p className="text-xs font-mono text-base-content/50 mt-1">
              When Database Learns To Bleed
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="alert bg-error/10 border border-error/30 text-error mb-6 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username/Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-base-content/80">
                {config.useUsername ? "Username" : "Email Address"}
              </label>
              <input
                type={config.useUsername ? "text" : "email"}
                name="identifier"
                value={config.useUsername ? username : email}
                onChange={
                  config.useUsername
                    ? (e) => setUsername(e.target.value)
                    : (e) => setEmail(e.target.value)
                }
                placeholder={
                  config.useUsername
                    ? "Enter your username"
                    : "Enter your email"
                }
                required
                autoComplete={config.useUsername ? "username" : "email"}
                className={`w-full bg-base-300 border border-base-content/10 rounded-lg px-4 py-3 text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:${accentClasses.ring} focus:${accentClasses.border} transition-all duration-200`}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-base-content/80">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className={`w-full bg-base-300 border border-base-content/10 rounded-lg px-4 py-3 pr-12 text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:${accentClasses.ring} focus:${accentClasses.border} transition-all duration-200`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-base-content/10 rounded transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-base-content/50" />
                  ) : (
                    <Eye className="w-5 h-5 text-base-content/50" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className={`checkbox checkbox-sm ${accentClasses.border}`}
                />
                <span className="text-base-content/70">Remember me</span>
              </label>
              <button
                type="button"
                className={`${accentClasses.text} hover:underline font-medium`}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className={`w-full bg-gradient-to-r ${config.gradient} text-white font-semibold px-6 py-4 rounded-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group`}
              style={{
                boxShadow: isPending
                  ? "none"
                  : `0 10px 30px -10px ${config.bgGlow.replace("bg-", "rgba(")}0.5)`,
              }}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-base-content/10">
            <div className="flex items-center justify-center gap-2 text-sm text-base-content/60">
              <Shield className="w-4 h-4" />
              <span>Secure encrypted connection</span>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-base-content/50">
          <p>
            Having trouble logging in?{" "}
            <button
              className={`${accentClasses.text} hover:underline font-medium`}
            >
              Contact Support
            </button>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .glass-panel {
          background: rgba(17, 17, 17, 0.5);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .card-elevated {
          background: rgba(17, 17, 17, 0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1.5rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .gradient-text {
          background: linear-gradient(to right, #ef4444, #dc2626, #f59e0b);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
