import { useNavigate } from 'react-router-dom';
import { Shield, Building2, UserCog, Building } from 'lucide-react';
import userStore from '@/state/userStore';

const resolveRoleFromUser = (user) => {
    if (!user || typeof user !== 'object') return null;
    if (typeof user.role === 'string' && user.role.trim() !== '') return user.role.trim().toLowerCase();
    if (user.admin_id) return 'admin';
    if (user.officer_id) return 'officer';
    if (user.jail_id) return 'jail';
    if (user.thana_id) return 'thana';
    if (user.user_id) return 'user';
    return null;
};

const dashboardRoutes = {
    admin: '/admin/dashboard',
    thana: '/thana/dashboard',
    officer: '/officer/dashboard',
    jail: '/jail/dashboard',
    user: '/user/dashboard',
};

function AccessRedirectionPage() {
    const navigate = useNavigate();
    const { user } = userStore();

    const accessCategories = [
        {
            id: 'admin',
            title: 'Admin',
            description: 'Full system access and control',
            icon: Shield,
            gradient: 'from-red-600 to-red-700',
            hoverGradient: 'from-red-700 to-red-800',
            bgGlow: 'bg-red-500/10',
            borderColor: 'border-red-500/20',
            iconBg: 'bg-red-500/20',
            iconColor: 'text-red-500',
            route: 'login/admin'
        },
        {
            id: 'thana',
            title: 'Thana',
            description: 'Police station management',
            icon: Building2,
            gradient: 'from-blue-600 to-blue-700',
            hoverGradient: 'from-blue-700 to-blue-800',
            bgGlow: 'bg-blue-500/10',
            borderColor: 'border-blue-500/20',
            iconBg: 'bg-blue-500/20',
            iconColor: 'text-blue-500',
            route: 'login/thana'
        },
        {
            id: 'officer',
            title: 'Officer',
            description: 'Law enforcement personnel',
            icon: UserCog,
            gradient: 'from-green-600 to-green-700',
            hoverGradient: 'from-green-700 to-green-800',
            bgGlow: 'bg-green-500/10',
            borderColor: 'border-green-500/20',
            iconBg: 'bg-green-500/20',
            iconColor: 'text-green-500',
            route: 'login/officer'
        },
        {
            id: 'jail',
            title: 'Jail',
            description: 'Correctional facility access',
            icon: Building,
            gradient: 'from-orange-600 to-orange-700',
            hoverGradient: 'from-orange-700 to-orange-800',
            bgGlow: 'bg-orange-500/10',
            borderColor: 'border-orange-500/20',
            iconBg: 'bg-orange-500/20',
            iconColor: 'text-orange-500',
            route: 'login/jail'
        }
    ];

    const handleCategoryClick = (route) => {
        const loggedInRole = resolveRoleFromUser(user);
        if (loggedInRole && dashboardRoutes[loggedInRole]) {
            navigate(dashboardRoutes[loggedInRole]);
            return;
        }
        navigate(route);
    };

    return (
        <div className="access-page min-h-screen flex items-center justify-center bg-gradient-to-br from-base-100 via-base-200 to-base-100 p-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-red-500/10 via-transparent to-transparent rounded-full blur-2xl"></div>
            </div>

            {/* Main Container */}
            <div className="w-full max-w-6xl relative z-10">
                {/* Header Section */}
                <div className="text-center mb-12 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl mb-6 shadow-2xl shadow-red-500/30">
                        <Shield className="w-10 h-10 text-white" />
                    </div>
                    
                    <h1 className="text-5xl md:text-6xl font-display font-bold text-base-content mb-4 tracking-tight">
                        BLACK VEIN <span className="text-blue-500">ORACLE</span>
                    </h1>
                    
                    <p className="text-sm font-mono text-base-content/50 mb-6">
                        When Database Learns To Bleed
                    </p>
                    
                    <div className="max-w-2xl mx-auto">
                        <p className="text-xl text-base-content/80 mb-2">
                            Select Your Access Category
                        </p>
                        <p className="text-base-content/60">
                            Choose your role to access role-based modules for case, custody, jail, and analytics operations.
                        </p>
                    </div>
                </div>

                {/* Access Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {accessCategories.map((category, index) => {
                        const Icon = category.icon;
                        return (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryClick(category.route)}
                                className={`group relative glass-panel rounded-2xl p-8 hover:scale-105 transition-all duration-300 border ${category.borderColor} overflow-hidden`}
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                    animation: 'fadeIn 0.6s ease-out forwards'
                                }}
                            >
                                {/* Glow Effect on Hover */}
                                <div className={`absolute inset-0 ${category.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl`}></div>
                                
                                {/* Content */}
                                <div className="relative z-10">
                                    {/* Icon */}
                                    <div className={`inline-flex items-center justify-center w-16 h-16 ${category.iconBg} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className={`w-8 h-8 ${category.iconColor}`} />
                                    </div>
                                    
                                    {/* Title */}
                                    <h3 className="text-2xl font-bold text-base-content mb-3 group-hover:text-primary transition-colors">
                                        {category.title}
                                    </h3>
                                    
                                    {/* Description */}
                                    <p className="text-base-content/60 text-sm mb-6">
                                        {category.description}
                                    </p>
                                    
                                    {/* Arrow Icon */}
                                    <div className="flex items-center justify-center">
                                        <div className="flex items-center gap-2 text-base-content/40 group-hover:text-primary transition-colors">
                                            <span className="text-sm font-medium">Access Portal</span>
                                            <svg 
                                                className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Gradient Border Animation */}
                                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${category.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none`}></div>
                            </button>
                        );
                    })}
                </div>

                {/* Footer Info */}
                <div className="text-center space-y-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
                    <div className="glass-panel rounded-xl p-6 inline-block">
                        <div className="flex items-center gap-4 text-sm text-base-content/60">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span>System Online</span>
                            </div>
                            <div className="w-px h-4 bg-base-content/20"></div>
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                <span>Secure Authentication</span>
                            </div>
                            <div className="w-px h-4 bg-base-content/20"></div>
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span>Encrypted Connection</span>
                            </div>
                        </div>
                    </div>
                    
                    
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

                .gradient-text {
                    background: linear-gradient(to right, #ef4444, #dc2626, #f59e0b);
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                }
            `}</style>
        </div>
    );
}

export default AccessRedirectionPage;