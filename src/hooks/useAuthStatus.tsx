import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { RootState } from '../redux/store'

// Role configuration
const roleMenuConfig: Record<string, string[] | "ALL"> = {
 admin: "ALL",
  customer: ["/orders", "/support-ticket"],
  manager: "ALL",
  pickupPartner: ["/orders"],
  engineer: ["/orders"],
  customerExecutive: ["/orders", "/support-ticket"],
  vendor: ["/product-part", "/products", "/orders"],
};

const defaultRoutes: Record<string, string> = {
   admin: "/",
  customer: "/orders",
  manager: "/",
  pickupPartner: "/orders",
  engineer: "/orders",
  customerExecutive: "/orders",
  vendor: "/product-part",
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


    useEffect(() => {
    // IMPROVED: Better token checking logic
    const token = localStorage.getItem("token");
    const isLoggedIn = (data && data.jwtToken) || token;
    
    setLoggedIn(!!isLoggedIn);
    setCheckStatus(false);
    
    // If no token found, clear any stale data
    if (!token && !data?.jwtToken) {
        localStorage.removeItem("user");
    }
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







