import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import userStore from "@/state/userStore";

const resolveRoleFromUser = (user) => {
    if (!user || typeof user !== "object") return null;

    if (typeof user.role === "string" && user.role.trim() !== "") {
        return user.role.trim().toLowerCase();
    }

    if (user.admin_id) return "admin";
    if (user.officer_id) return "officer";
    if (user.jail_id) return "jail";
    if (user.thana_id) return "thana";
    if (user.user_id) return "user";

    return null;
};

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user } = userStore();
    const location = useLocation();
    const [isHydrated, setIsHydrated] = useState(() => userStore.persist?.hasHydrated?.() ?? true);

    useEffect(() => {
        if (!userStore.persist) return;

        const unsubHydrate = userStore.persist.onHydrate?.(() => {
            setIsHydrated(false);
        });

        const unsubFinishHydration = userStore.persist.onFinishHydration?.(() => {
            setIsHydrated(true);
        });

        setIsHydrated(userStore.persist.hasHydrated());

        return () => {
            unsubHydrate?.();
            unsubFinishHydration?.();
        };
    }, []);

    if (!isHydrated) {
        return null;
    }

    if (!user) {
        return <Navigate to="/access" state={{ from: location }} replace />;
    }

    const normalizedAllowedRoles = allowedRoles.map((role) => String(role).toLowerCase());
    const currentUserRole = resolveRoleFromUser(user);

    if (normalizedAllowedRoles.length > 0 && !normalizedAllowedRoles.includes(currentUserRole)) {
        return <Navigate to="/access" state={{ from: location }} replace />;
    }

    return children ?? <Outlet />;
};

export default ProtectedRoute;