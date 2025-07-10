// import { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { ChevronDown, ChevronUp } from "lucide-react";
// import { ThemeBackgroundColor } from "../../helper/ApplicationConstants";

// interface SidebarProps {
//   collapsed: boolean;
//   onNavigate?: () => void;
// }

// const AddProductLinks = [
//   { name: "Category", to: "/category" },
//   { name: "Sub Category", to: "/sub-category" },
//   { name: "Brand", to: "/brand" },
//   { name: "Model Number", to: "/mobile-number" },
//   { name: "Color Name", to: "/color-name" },
//   { name: "Variant", to: "/variant" },
//   { name: "Variant Color", to: "/variant-color" },
// ];

// const Inventory = [
//   {name: "Product Part", to: "/product-part"},
//   {name: "Products", to: "/products"},
// ]

// export default function Sidebar({ collapsed, onNavigate }: SidebarProps) {
//   const [open, setOpen] = useState(false);
//   const location = useLocation();

//   const linkClass = (to: string) =>
//     `block px-4 py-2 rounded transition ${
//       location.pathname === to ? "bg-gray-700 text-white" : "hover:bg-gray-700"
//     }`;

//   return (
//     <aside
//       className={`${ThemeBackgroundColor} text-white h-full fixed top-16 left-0 transition-all duration-300 ease-in-out z-40
//         ${collapsed ? "w-0 ease-in-out duration-300 hidden" : "w-64"} flex flex-col`}
//     >
//       <nav className="flex-1 py-4">
//         <Link to="/" className={linkClass("/")} onClick={onNavigate}>
//           {!collapsed && "Dashboard"}
//         </Link>
//         <Link to="/user-management" className={linkClass("/user-management")} onClick={onNavigate}>
//           {!collapsed && "User Management"}
//         </Link>
//         <button
//           className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-700 focus:outline-none"
//           onClick={() => setOpen((v) => !v)}
//         >
//           {!collapsed && "Add Product"}
//           {!collapsed && (open ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
//         </button>
//         {open && !collapsed && (
//           <div className="ml-6 space-y-1">
//             {AddProductLinks.map((item) => (
//               <Link
//                 key={item.to}
//                 to={item.to}
//                 className={linkClass(item.to)}
//                 onClick={onNavigate}
//               >
//                 {item.name}
//               </Link>
//             ))}
//           </div>
//         )}
//           <Link to="/product-part" className={linkClass("/product-part")} onClick={onNavigate}>
//           {!collapsed && "Product Part Label"}
//         </Link>
//           <Link to="/repair-cost" className={linkClass("/repair-cost")} onClick={onNavigate}>
//           {!collapsed && "Repair Cost"}
//         </Link>
//           <button
//           className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-700 focus:outline-none"
//           onClick={() => setOpen((v) => !v)}
//         >
//           {!collapsed && "Inventory"}
//           {!collapsed && (open ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
//         </button>
//         {open && !collapsed && (
//           <div className="ml-6 space-y-1">
//             {Inventory.map((item) => (
//               <Link
//                 key={item.to}
//                 to={item.to}
//                 className={linkClass(item.to)}
//                 onClick={onNavigate}
//               >
//                 {item.name}
//               </Link>
//             ))}
//           </div>
//         )}
//       </nav>
//     </aside>
//   );
// }







import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ThemeBackgroundColor } from "../../helper/ApplicationConstants";

interface SidebarProps {
  collapsed: boolean;
  onNavigate?: () => void;
}

const AddProductLinks = [
  { name: "Category", to: "/category" },
  { name: "Sub Category", to: "/sub-category" },
  { name: "Brand", to: "/brand" },
  { name: "Model Number", to: "/mobile-number" },
  { name: "Color Name", to: "/color-name" },
  { name: "Variant", to: "/variant" },
  { name: "Variant Color", to: "/variant-color" },
];

const Inventory = [
  {name: "Product Part", to: "/product-part"},
  {name: "Products", to: "/products"},
]

export default function Sidebar({ collapsed, onNavigate }: SidebarProps) {
  // Separate states for each dropdown
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const location = useLocation();

  const linkClass = (to: string) =>
    `block px-4 py-2 rounded transition ${
      location.pathname === to ? "bg-gray-700 text-white" : "hover:bg-gray-700"
    }`;

  return (
    <aside
      className={`${ThemeBackgroundColor} text-white h-full fixed top-16 left-0 transition-all duration-300 ease-in-out z-40
        ${collapsed ? "w-0 ease-in-out duration-300 hidden" : "w-64"} flex flex-col`}
    >
      <nav className="flex-1 py-4">
        <Link to="/" className={linkClass("/")} onClick={onNavigate}>
          {!collapsed && "Dashboard"}
        </Link>
        <Link to="/user-management" className={linkClass("/user-management")} onClick={onNavigate}>
          {!collapsed && "User Management"}
        </Link>
        
        {/* Add Product Dropdown */}
        <button
          className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-700 focus:outline-none"
          onClick={() => setAddProductOpen((v) => !v)}
        >
          {!collapsed && "Add Product"}
          {!collapsed && (addProductOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
        </button>
        {addProductOpen && !collapsed && (
          <div className="ml-6 space-y-1">
            {AddProductLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={linkClass(item.to)}
                onClick={onNavigate}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}

        <Link to="/product-part-label" className={linkClass("/product-part-label")} onClick={onNavigate}>
          {!collapsed && "Product Part Label"}
        </Link>

        <Link to="/repair-cost" className={linkClass("/repair-cost")} onClick={onNavigate}>
          {!collapsed && "Repair Cost"}
        </Link>

        {/* Inventory Dropdown */}
        <button
          className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-700 focus:outline-none"
          onClick={() => setInventoryOpen((v) => !v)}
        >
          {!collapsed && "Inventory"}
          {!collapsed && (inventoryOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
        </button>
        {inventoryOpen && !collapsed && (
          <div className="ml-6 space-y-1">
            {Inventory.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={linkClass(item.to)}
                onClick={onNavigate}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </aside>
  );
}