import { useState } from "react";
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
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { SidebarColors } from "../../helper/ApplicationConstants";

interface SidebarProps {
  collapsed: boolean;
  onNavigate?: () => void;
}

const AddProductLinks = [
  { name: "Category", to: "/category", icon: Tag, ...SidebarColors.addProduct.category },
  { name: "Sub Category", to: "/sub-category", icon: Grid3x3, ...SidebarColors.addProduct.subCategory },
  { name: "Brand", to: "/brand", icon: BookOpen, ...SidebarColors.addProduct.brand },
  { name: "Model Number", to: "/mobile-number", icon: Smartphone, ...SidebarColors.addProduct.modelNumber },
  { name: "Color Name", to: "/color-name", icon: Palette, ...SidebarColors.addProduct.colorName },
  { name: "Variant", to: "/variant", icon: Layers, ...SidebarColors.addProduct.variant },
  { name: "Variant Color", to: "/variant-color", icon: Package, ...SidebarColors.addProduct.variantColor },
];

const Inventory = [
  { name: "Product Part", to: "/product-part", icon: Package, ...SidebarColors.inventory.productPart },
  { name: "Products", to: "/products", icon: ShoppingCart, ...SidebarColors.inventory.products },
];

export default function Sidebar({ collapsed, onNavigate }: SidebarProps) {
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  const handleLinkClick = (to: string) => {
    setActiveLink(to);
    if (onNavigate) onNavigate();
  };

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
        {!collapsed && (
          <span className={`font-medium transition-all duration-300 ${isSubItem ? "text-sm" : ""}`}>
            {children}
          </span>
        )}
      </Link>

      {isActive && (
        <div
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full z-10"
          style={{ backgroundColor: color }}
        />
      )}
    </div>
  );


  const DropdownButton = ({ icon: Icon, children, isOpen, onClick, color }) => (
    <div
      className="relative group cursor-pointer transition-all duration-300 ease-in-out mx-3 my-1 overflow-hidden"
      onClick={onClick}
    >
      <div
        className="absolute inset-0 rounded-lg transition-all duration-300 ease-out w-0 group-hover:w-full"
        style={{ backgroundColor: color + "20" }}
      />

      <div
        className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 rounded-r-full transition-all duration-300 opacity-0 group-hover:opacity-100 z-10"
        style={{ backgroundColor: color }}
      />

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
        <SidebarItem
          to="/"
          icon={Home}
          {...SidebarColors.dashboard}
          isActive={activeLink === "/"}
        >
          Dashboard
        </SidebarItem>

        <SidebarItem
          to="/user-management"
          icon={Users}
          {...SidebarColors.userManagement}
          isActive={activeLink === "/user-management"}
        >
          User Management
        </SidebarItem>

        <DropdownButton
          icon={Plus}
          color={SidebarColors.dropdown.addProduct.color}
          isOpen={addProductOpen}
          onClick={() => setAddProductOpen(!addProductOpen)}
        >
          Add Product
        </DropdownButton>

        {addProductOpen && !collapsed && (
          <div className="overflow-hidden">
            <div className="transform transition-all duration-300 ease-in-out animate-slideDown">
              {AddProductLinks.map((item) => (
                <SidebarItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  color={item.color}
                  bgColor={item.bgColor}
                  isActive={activeLink === item.to}
                  isSubItem={true}
                >
                  {item.name}
                </SidebarItem>
              ))}
            </div>
          </div>
        )}

        <SidebarItem
          to="/product-part-label"
          icon={BookOpen}
          {...SidebarColors.productPartLabel}
          isActive={activeLink === "/product-part-label"}
        >
          Product Part Label
        </SidebarItem>

        <SidebarItem
          to="/repair-cost"
          icon={DollarSign}
          {...SidebarColors.repairCost}
          isActive={activeLink === "/repair-cost"}
        >
          Repair Cost
        </SidebarItem>

        <DropdownButton
          icon={Archive}
          color={SidebarColors.dropdown.inventory.color}
          isOpen={inventoryOpen}
          onClick={() => setInventoryOpen(!inventoryOpen)}
        >
          Inventory
        </DropdownButton>

        {inventoryOpen && !collapsed && (
          <div className="overflow-hidden">
            <div className="transform transition-all duration-300 ease-in-out animate-slideDown">
              {Inventory.map((item) => (
                <SidebarItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  color={item.color}
                  bgColor={item.bgColor}
                  isActive={activeLink === item.to}
                  isSubItem={true}
                >
                  {item.name}
                </SidebarItem>
              ))}
            </div>
          </div>
        )}

                <SidebarItem
          to="/orders"
          icon={Users}
          {...SidebarColors.orders}
          isActive={activeLink === "/orders"}
        >
          Orders
        </SidebarItem>


                <SidebarItem
          to="/support-ticket"
          icon={Users}
          {...SidebarColors.supportTicket}
          isActive={activeLink === "/support-ticket"}
        >
          Support Ticket
        </SidebarItem>
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
