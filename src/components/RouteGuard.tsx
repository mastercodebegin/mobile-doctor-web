// Create new file: components/RouteGuard.tsx
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

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

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = useSelector((state: RootState) => state.UserLoginSlice);
  
  // Extract role
  const userRole = data?.role;
  const role = typeof userRole === 'object' && userRole?.name 
    ? userRole.name 
    : (typeof userRole === 'string' ? userRole : null);

  useEffect(() => {
    const currentPath = location.pathname;
    
    // Skip for login page
    if (currentPath === '/login') return;
    
    // If not logged in, redirect to login
    if (!data || !data.jwtToken) {
      navigate('/login', { replace: true });
      return;
    }
    
    // If no role found, redirect to login
    if (!role) {
      navigate('/login', { replace: true });
      return;
    }
    
    // Check if current route is allowed for this role
    const roleConfig = roleMenuConfig[role];
    
    if (roleConfig !== "ALL") {
      if (!roleConfig || !roleConfig.includes(currentPath)) {
        console.log(`Access denied for ${role} to ${currentPath}`);
        const defaultRoute = defaultRoutes[role] || '/orders';
        navigate(defaultRoute, { replace: true });
        return;
      }
    }
    
    console.log(`Access granted for ${role} to ${currentPath}`);
  }, [location.pathname, data, role, navigate]);

  return <>{children}</>;
};

export default RouteGuard;