import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { RootState } from '../redux/store'

// Role configuration
const roleMenuConfig: Record<string, string[] | "ALL"> = {
  admin: "ALL",
  vendor: ["/product-part", "/products", "/orders"],
  customerExecutive: ["/orders", "/support-ticket"],
  customer: ["/orders", "/support-ticket"],
};

const defaultRoutes: Record<string, string> = {
  admin: "/",
  vendor: "/product-part", 
  customerExecutive: "/orders",
  customer: "/orders",
};

const useAuthStatus = () => {
    const {data} = useSelector((state : RootState) => state.UserLoginSlice)
    const location = useLocation();
    const navigate = useNavigate();
    
    const [loggedIn , setLoggedIn] = useState<boolean>(false)
    const [checkStatus , setCheckStatus] = useState<boolean>(true)

    // Extract role - handle both object and string formats
    const userRole = data?.role;
    const role = typeof userRole === 'object' && userRole?.name ? userRole.name : (typeof userRole === 'string' ? userRole : 'admin');

    // console.log("useAuthStatus - Raw role:", userRole);
    // console.log("useAuthStatus - Processed role:", role);

    useEffect(() => {
        const isLoggedIn = data && data.jwtToken || localStorage.getItem("token");
        setLoggedIn(!!isLoggedIn);
        setCheckStatus(false);
    }, [data]);

    // Route protection effect
    useEffect(() => {
        if (!loggedIn || !data) return;
        
        const currentPath = location.pathname;
        
        // Skip login page
        if (currentPath === '/login') return;

        console.log(`useAuthStatus - Checking route: ${currentPath} for role: ${role}`);

        // Check if route is allowed
        const roleConfig = roleMenuConfig[role];
        if (roleConfig && roleConfig !== "ALL") {
            if (!roleConfig.includes(currentPath)) {
                const defaultRoute = defaultRoutes[role] || '/orders';
                console.log(`useAuthStatus - Redirecting ${role} from ${currentPath} to ${defaultRoute}`);
                navigate(defaultRoute, { replace: true });
            }
        }
    }, [loggedIn, location.pathname, role, navigate, data]);

    return {loggedIn , checkStatus, role}
}

export default useAuthStatus







