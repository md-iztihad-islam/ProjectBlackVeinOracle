import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { registerThanaApi } from '@/services/registrationServices/registrationApi';
import { Building2, ArrowLeft, Eye, EyeOff, CheckCircle, AlertCircle, Shield } from 'lucide-react';

export const ThanaRegistrationPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    thana_name: '',
    district: '',
    zone: '',
    address: '',
    phone: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [validationError, setValidationError] = useState('');

  const registerMutation = useMutation({
    mutationFn: registerThanaApi,
    onSuccess: (data) => {
      if (data.success) {
        // Show success and redirect
        setTimeout(() => {
          navigate('/login/thana');
        }, 2000);
      } else {
        setValidationError(data.error || 'Registration failed');
      }
    },
    onError: (error) => {
      setValidationError(error.message || 'An error occurred during registration');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setValidationError('');
    
    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 12.5;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 12.5;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return 'bg-red-500';
    if (passwordStrength < 50) return 'bg-orange-500';
    if (passwordStrength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Weak';
    if (passwordStrength < 50) return 'Fair';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  const validateForm = () => {
    if (formData.password !== formData.confirm_password) {
      setValidationError('Passwords do not match');
      return false;
    }

    if (passwordStrength < 50) {
      setValidationError('Password is too weak. Please use a stronger password.');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setValidationError('Please enter a valid email address');
      return false;
    }

    if (!/^\d{10,15}$/.test(formData.phone.replace(/[-\s]/g, ''))) {
      setValidationError('Please enter a valid phone number');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const { confirm_password, ...registrationData } = formData;
    registerMutation.mutate(registrationData);
  };

  if (registerMutation.isSuccess && registerMutation.data?.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-100 via-base-200 to-base-100 p-4">
        <div className="card-elevated p-8 max-w-md w-full text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full mb-6 shadow-2xl shadow-blue-500/30">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Registration Successful!</h2>
          <p className="text-base-content/60 mb-6">
            Your Thana account has been created successfully. Redirecting to login page...
          </p>
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg text-blue-500"></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-100 via-base-200 to-base-100 p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
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
      <div className="w-full max-w-2xl relative z-10">
        <div className="card-elevated p-8 animate-fade-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mb-4 shadow-2xl shadow-blue-500/30">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-3xl font-display font-bold text-base-content mb-2">
              Thana Registration
            </h1>
            <p className="text-sm text-base-content/60">
              Police Station Portal Registration
            </p>
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
          {(validationError || registerMutation.isError) && (
            <div className="alert bg-error/10 border border-error/30 text-error mb-6 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{validationError || 'Registration failed. Please try again.'}</span>
              </div>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Thana Name */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-base-content/80">
                  Thana Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="thana_name"
                  value={formData.thana_name}
                  onChange={handleChange}
                  placeholder="Enter police station name"
                  required
                  className="w-full bg-base-300 border border-base-content/10 rounded-lg px-4 py-3 text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              {/* District */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-base-content/80">
                  District <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="Enter district"
                  required
                  className="w-full bg-base-300 border border-base-content/10 rounded-lg px-4 py-3 text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              {/* Zone */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-base-content/80">
                  Zone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="zone"
                  value={formData.zone}
                  onChange={handleChange}
                  placeholder="Enter zone"
                  required
                  className="w-full bg-base-300 border border-base-content/10 rounded-lg px-4 py-3 text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-base-content/80">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter complete address"
                  required
                  rows={3}
                  className="w-full bg-base-300 border border-base-content/10 rounded-lg px-4 py-3 text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 resize-none"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-base-content/80">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                  className="w-full bg-base-300 border border-base-content/10 rounded-lg px-4 py-3 text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-base-content/80">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  required
                  className="w-full bg-base-300 border border-base-content/10 rounded-lg px-4 py-3 text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              {/* Password */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-base-content/80">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    required
                    className="w-full bg-base-300 border border-base-content/10 rounded-lg px-4 py-3 pr-12 text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
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
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-base-content/60">Password Strength:</span>
                      <span className="font-medium text-blue-500">
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="h-2 bg-base-300 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                        style={{ width: `${passwordStrength}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-base-content/80">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    required
                    className="w-full bg-base-300 border border-base-content/10 rounded-lg px-4 py-3 pr-12 text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-base-content/10 rounded transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5 text-base-content/50" />
                    ) : (
                      <Eye className="w-5 h-5 text-base-content/50" />
                    )}
                  </button>
                </div>
                
                {/* Password Match Indicator */}
                {formData.confirm_password && (
                  <div className="flex items-center gap-2 text-xs">
                    {formData.password === formData.confirm_password ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-green-500">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span className="text-red-500">Passwords do not match</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-2 text-sm">
              <input 
                type="checkbox" 
                required
                className="checkbox checkbox-sm border-blue-500 mt-1"
              />
              <label className="text-base-content/70">
                I agree to the{' '}
                <button type="button" className="text-blue-500 hover:underline font-medium">
                  Terms of Service
                </button>
                {' '}and{' '}
                <button type="button" className="text-blue-500 hover:underline font-medium">
                  Privacy Policy
                </button>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold px-6 py-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {registerMutation.isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Thana Account</span>
                  <svg 
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 pt-6 border-t border-base-content/10 text-center">
            <p className="text-sm text-base-content/60">
              Already have an account?{' '}
              <Link to="/login/thana" className="text-blue-500 hover:underline font-semibold">
                Sign in here
              </Link>
            </p>
          </div>

          {/* Additional Info */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-base-content/60">
            <Shield className="w-4 h-4" />
            <span>Secure encrypted connection</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThanaRegistrationPage;