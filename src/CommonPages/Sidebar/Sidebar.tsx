import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Home,
  Users,
  Plus,
  Tag,
  Grid3x3,
  Palette,
  Smartphone,
  Layers,
  Package,
  BookOpen,
  DollarSign,
  Archive,
  ShoppingCart,
  Map,
  Earth,
  MapPinned,
  LocateFixed,
  Split,
  TicketPercent,
  Settings,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SidebarColors } from "../../helper/ApplicationConstants";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

// ==========================
// Sidebar Role Config
// ==========================
const roleMenuConfig: Record<string, string[] | "ALL"> = {
  admin: "ALL",
  customer: ["/orders", "/support-ticket"],
  manager: "ALL",
  pickupPartner: ["/orders"],
  engineer: ["/orders"],
  customerExecutive: ["/orders", "/support-ticket"],
  vendor: ["/product-part", "/products", "/orders"],
};

// Default routes for each role
const defaultRoutes: Record<string, string> = {
  admin: "/",
  customer: "/orders",
  manager: "/",
  pickupPartner: "/orders",
  engineer: "/orders",
  customerExecutive: "/orders",
  vendor: "/product-part",
};

// ==========================
// Add Product Dropdown Links
// ==========================
const AddProductLinks = [
  { name: "Category", to: "/category", icon: Tag, ...SidebarColors.addProduct.category },
  { name: "Sub Category", to: "/sub-category", icon: Grid3x3, ...SidebarColors.addProduct.subCategory },
  { name: "Brand", to: "/brand", icon: BookOpen, ...SidebarColors.addProduct.brand },
  { name: "Model Number", to: "/mobile-number", icon: Smartphone, ...SidebarColors.addProduct.modelNumber },
  { name: "Color Name", to: "/color-name", icon: Palette, ...SidebarColors.addProduct.colorName },
  { name: "Variant", to: "/variant", icon: Layers, ...SidebarColors.addProduct.variant },
  { name: "Variant Color", to: "/variant-color", icon: Package, ...SidebarColors.addProduct.variantColor },
];

// ==========================
// Inventory Dropdown Links
// ==========================
const InventoryLinks = [
  { name: "Product Part", to: "/product-part", icon: Package, ...SidebarColors.inventory.productPart },
  { name: "Products", to: "/products", icon: ShoppingCart, ...SidebarColors.inventory.products },
];

// ==========================
// Location Dropdown Links
// ==========================
const LocationLinks = [
  {name: "Country", to: "/country", icon: Earth, ...SidebarColors.location.country },
  {name: "State", to: "/state", icon: Map, ...SidebarColors.location.state },
  {name: "City", to: "/city", icon: MapPinned, ...SidebarColors.location.country },
  {name: "Branch", to: "/branch", icon: Split, ...SidebarColors.location.branch },
]

// ==========================
// All Main Menu Items
// ==========================
const menuItems = [
  { type: "link", to: "/", label: "Dashboard", icon: Home, ...SidebarColors.dashboard },
  { type: "link", to: "/user-management", label: "User Management", icon: Users, ...SidebarColors.userManagement },
  { type: "dropdown", label: "Add Product", icon: Plus, color: SidebarColors.dropdown.addProduct.color, children: AddProductLinks },
  { type: "link", to: "/product-part-label", label: "Product Part Label", icon: BookOpen, ...SidebarColors.productPartLabel },
  { type: "link", to: "/repair-cost", label: "Repair Cost", icon: DollarSign, ...SidebarColors.repairCost },
  { type: "dropdown", label: "Inventory", icon: Archive, color: SidebarColors.dropdown.inventory.color, children: InventoryLinks },
  { type: "link", to: "/orders", label: "Orders", icon: Users, ...SidebarColors.orders },
  { type: "link", to: "/support-ticket", label: "Support Ticket", icon: Users, ...SidebarColors.supportTicket },
  { type: "link", to: "/role", label: "User Role", icon: Users, ...SidebarColors.role },
  { type: "dropdown", label: "Location", icon: LocateFixed, color: SidebarColors.dropdown.location.color, children: LocationLinks },
  { type: "link", to: "/coupon", label: "Coupon", icon: TicketPercent, ...SidebarColors.coupon },
  // { type: "link", to: "/settings", label: "Settings", icon: Settings, ...SidebarColors.settings },
];

interface SidebarProps {
  collapsed: boolean;
  onNavigate?: () => void;
}

export default function Sidebar({ collapsed, onNavigate }: SidebarProps) {
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState(location.pathname);

  // Get user role from Redux - handle both object and string formats
  const userRole = useSelector((state: RootState) => state.UserLoginSlice.data?.role);
  const role = typeof userRole === 'object' && userRole?.name ? userRole.name : (typeof userRole === 'string' ? userRole : 'admin');


  const handleLinkClick = (to: string) => {
    setActiveLink(to);
    if (onNavigate) onNavigate();
  };

  // ==========================
  // Helper function to check if route is allowed for role
  // ==========================
  const isRouteAllowed = (route: string): boolean => {
    const roleConfig = roleMenuConfig[role];
    
    console.log(`Checking route: ${route} for role: ${role}`, roleConfig);
    
    if (!roleConfig) {
      console.log(`Role ${role} not found in config, denying access`);
      return false;
    }
    
    const isAllowed = roleConfig === "ALL" || (Array.isArray(roleConfig) && roleConfig.includes(route));
    console.log(`Route ${route} allowed: ${isAllowed}`);
    return isAllowed;
  };

  // ==========================
  // Route Protection Effect
  // ==========================
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Skip protection for login/public routes
    if (currentPath === '/login' || currentPath === '/register') {
      return;
    }

    // Check if current route is allowed for user's role
    if (!isRouteAllowed(currentPath)) {
      console.log(`Access denied for route: ${currentPath}, redirecting to default route`);
      const defaultRoute = defaultRoutes[role] || '/orders';
      navigate(defaultRoute, { replace: true });
    }

     if (["/settings", "/update-password"].includes(currentPath)) {
    setActiveLink(null);
  } else {
    setActiveLink(currentPath);
  }
  }, [location.pathname, role, navigate]);

  // ==========================
  // Filter Menu Based on Role
  // ==========================
  const allowedItems = menuItems.filter((item) => {
    if (item.type === "dropdown") {
      return item.children?.some((child) => isRouteAllowed(child.to));
    }
    return isRouteAllowed(item.to);
  });

  console.log("Allowed items for role:", role, allowedItems);

  // ==========================
  // SidebarItem Component
  // ==========================
  const SidebarItem = ({ to, icon: Icon, children, color, bgColor, isActive, isSubItem = false }) => (
    <div
      className={`
        relative group cursor-pointer transition-all duration-300 ease-in-out overflow-hidden
        ${isSubItem ? "ml-4 my-1" : "mx-3 my-1"}
        ${isActive ? `${bgColor} rounded-lg shadow-sm` : ""}
      `}
    >
      <div
        className={`
          absolute inset-0 rounded-lg transition-all duration-300 ease-out
          ${isActive ? "w-full" : "w-0 group-hover:w-full"}
        `}
        style={{ backgroundColor: color + "20" }}
      />
      <div
        className={`
          absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 rounded-r-full
          transition-all duration-300 z-10
          ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
        `}
        style={{ backgroundColor: color }}
      />
      <Link
        to={to}
        onClick={() => handleLinkClick(to)}
        className={`
          relative flex items-center px-4 py-3 rounded-lg transition-all duration-300 z-10
          ${isActive ? "text-gray-800" : "text-gray-600 group-hover:text-gray-800"}
        `}
      >
        <Icon
          size={isSubItem ? 18 : 20}
          className={`
            ${isSubItem ? "mr-3" : "mr-4"} transition-all duration-300
            ${isActive ? "text-gray-800" : "text-gray-500 group-hover:text-gray-700"}
          `}
          style={{ color: isActive ? color : undefined }}
        />
        {!collapsed && <span className={`font-medium transition-all duration-300 ${isSubItem ? "text-sm" : ""}`}>{children}</span>}
      </Link>
      {isActive && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full z-10" style={{ backgroundColor: color }} />
      )}
    </div>
  );

  // ==========================
  // DropdownButton Component
  // ==========================
  const DropdownButton = ({ icon: Icon, children, isOpen, onClick, color }) => (
    <div
      className="relative group cursor-pointer transition-all duration-300 ease-in-out mx-3 my-1 overflow-hidden"
      onClick={onClick}
    >
      <div className="absolute inset-0 rounded-lg transition-all duration-300 ease-out w-0 group-hover:w-full" style={{ backgroundColor: color + "20" }} />
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 rounded-r-full transition-all duration-300 opacity-0 group-hover:opacity-100 z-10" style={{ backgroundColor: color }} />
      <div className="relative flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300 text-gray-600 group-hover:text-gray-800 z-10">
        <div className="flex items-center">
          <Icon size={20} className="mr-4 transition-all duration-300 text-gray-500 group-hover:text-gray-700" />
          {!collapsed && <span className="font-medium">{children}</span>}
        </div>
        {!collapsed && <div className="transition-transform duration-300">{isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</div>}
      </div>
    </div>
  );

  return (
    <aside
      className={`
        bg-white border-r pb-20 border-gray-200 h-full fixed top-16 left-0 
        transition-all duration-300 ease-in-out z-40 shadow-sm
        ${collapsed ? "w-0 ease-in-out duration-300 hidden" : "w-64"} 
        flex flex-col
      `}
    >
      <nav className="flex-1 py-4 overflow-y-auto">
        {allowedItems.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No menu items available for your role
          </div>
        ) : (
          allowedItems.map((item) => {
            if (item.type === "dropdown") {
              const isAddProduct = item.label === "Add Product";
              const isInventory = item.label === "Inventory";
              const isLocation = item.label === "Location";
              const isOpen = isAddProduct ? addProductOpen : isInventory ? inventoryOpen : locationOpen;

              return (
                <div key={item.label}>
                  <DropdownButton
                    icon={item.icon}
                    color={item.color}
                    isOpen={isOpen}
                    onClick={() => {
                      if (isAddProduct) setAddProductOpen(!addProductOpen);
                      if (isInventory) setInventoryOpen(!inventoryOpen);
                      if(isLocation) setLocationOpen(!locationOpen)
                    }}
                  >
                    {item.label}
                  </DropdownButton>
                  {isOpen && !collapsed && (
                    <div className="overflow-hidden animate-slideDown">
                      {item.children
                        ?.filter((child) => isRouteAllowed(child.to))
                        .map((child) => (
                          <SidebarItem
                            key={child.to}
                            to={child.to}
                            icon={child.icon}
                            color={child.color}
                            bgColor={child.bgColor}
                            isActive={activeLink === child.to}
                            isSubItem={true}
                          >
                            {child.name}
                          </SidebarItem>
                        ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <SidebarItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                color={item.color}
                bgColor={item.bgColor}
                isActive={activeLink === item.to}
              >
                {item.label}
              </SidebarItem>
            );
          })
        )}
      </nav>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </aside>
  );
}












