export const ThemeTextMainColor = 'text-cyan-500'

export const ThemeTextMainHoverColor = 'hover:text-cyan-700'

export const ThemeBackgroundColor = 'bg-cyan-500'

export const ThemeBackgroundHoverColor = 'hover:bg-cyan-700'

export const ThemeTextColor = 'text-gray-800 hover:text-gray-700'

export const ThemeTextHoverColor = 'hover:text-gray-700'

export const DropDownClass = 'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

export const ShowVarientButtonClass = ` ${ThemeBackgroundColor} ${ThemeBackgroundHoverColor} duration-200 px-6 py-2 shadow rounded-xl transition text-white`

export const SubmitButtonClass = `${ThemeBackgroundColor} ${ThemeBackgroundHoverColor} px-10 py-3 rounded-xl text-white transition-colors duration-300`

export const InventoryView = `${ThemeBackgroundColor} ${ThemeBackgroundHoverColor} px-5 py-2 rounded-md  text-white transition`

export const InventoryRefillUse = `px-5 py-2 ${ThemeTextMainColor} ${ThemeTextMainHoverColor} transition`

export const ShowModelCloseButtonClass = "px-6 py-3 bg-gray-300 text-white rounded-full hover:bg-gray-400 transition"

export const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500";

export const ForgotPassInput = "w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"

export const BackToLogin = "text-gray-600 hover:text-gray-800 flex items-center justify-center gap-2 mx-auto text-sm"

export const EditClass = `${ThemeTextMainColor} ${ThemeTextMainHoverColor} transition-colors duration-200`

export const DeleteClass = " text-red-400 hover:text-red-600 transition-colors duration-200"

export const TableDataClass = "py-4 px-6 whitespace-nowrap text-sm text-gray-700"

export const TableHadeClass = `py-4 px-6 text-left text-sm font-medium ${ThemeTextColor} `

export const ShowModalMainClass = "fixed inset-0 z-50 flex items-center justify-center bg-transparent/30 backdrop-blur-sm"

export const ClearFilter = "px-3 py-1.5 text-sm font-medium border rounded-md transition-all text-red-500 border-red-500 hover:bg-red-600 hover:text-white cursor-pointer"

export const EditIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
</svg>

export const DeleteIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
</svg>

export const SearchIcon = <svg
  className="w-5 h-5 text-gray-600"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  viewBox="0 0 24 24"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 5.65a7.5 7.5 0 010 10.6z"
  />
</svg>


// Sidebar Color Tokens

export const SidebarColors = {
  dashboard: { bgColor: 'bg-blue-50', color: '#3B82F6' },
  userManagement: { bgColor: 'bg-blue-50', color: '#3B82F6' },
  productPartLabel: { bgColor: 'bg-blue-50', color: '#3B82F6' },
  repairCost: { bgColor: 'bg-blue-50', color: '#3B82F6' },
  orders: { bgColor: 'bg-blue-50', color: '#3B82F6' },
  supportTicket: { bgColor: 'bg-blue-50', color: '#3B82F6' },
  role: { bgColor: 'bg-blue-50', color: '#3B82F6' },
  coupon: { bgColor: 'bg-blue-50', color: '#3B82F6' },
  settings: { bgColor: 'bg-blue-50', color: '#3B82F6' },
  addProduct: {
    category: { bgColor: 'bg-blue-50', color: '#3B82F6' },
    subCategory: { bgColor: 'bg-blue-50', color: '#3B82F6' },
    brand: { bgColor: 'bg-blue-50', color: '#3B82F6' },
    modelNumber: { bgColor: 'bg-blue-50', color: '#3B82F6' },
    colorName: { bgColor: 'bg-blue-50', color: '#3B82F6' },
    variant: { bgColor: 'bg-blue-50', color: '#3B82F6' },
    variantColor: { bgColor: 'bg-blue-50', color: '#3B82F6' },
  },
  inventory: {
    productPart: { bgColor: 'bg-blue-50', color: '#3B82F6' },
    products: { bgColor: 'bg-blue-50', color: '#3B82F6' },
  },
  location: {
    country: { bgColor: 'bg-blue-50', color: '#3B82F6' },
    state: { bgColor: 'bg-blue-50', color: '#3B82F6' },
    city: { bgColor: 'bg-blue-50', color: '#3B82F6' },
    branch: { bgColor: 'bg-blue-50', color: '#3B82F6' },
  },
  dropdown: {
    addProduct: { bgColor: 'bg-green-50', color: '#10B981' },
    inventory: { bgColor: 'bg-green-50', color: '#10B981' },
    location: { bgColor: 'bg-green-50', color: '#10B981' },
  },
};




export const pageSize = 10;

export const statusOptions = [
    'PENDING',
    'CANCELLED',
    'READY_TO_PICK',
    'PICKED_UP_BY_PARTNER',
    'PICKED_UP_BY_USER',
    'IN_SERVICE',
    'READY_TO_DISPATCH',
    'DISPATCHED',
    'DELIVERED',
    'COMPLETED',
  ];

export const getStatusBadgeClass = (status: string, isBackgroundColor: boolean) => {
  switch (status) {
    case 'PENDING': return `${isBackgroundColor ? "bg-cyan-100 text-cyan-800" : "bg-white text-blue-800"} `;
    case 'CANCELLED': return `${isBackgroundColor ? 'bg-red-100 text-red-800' : "bg-white text-red-800"}`;
    case 'COMPLETED': return `${isBackgroundColor ? "'bg-emerald-100 text-emerald-800'" : "bg-white text-green-800"}`;
    case 'READY_TO_PICK': return isBackgroundColor ? "bg-purple-100 text-purple-800" : "bg-white text-purple-800";
    case 'PICKED_UP_BY_PARTNER': return isBackgroundColor ? "bg-blue-100 text-blue-800" : "bg-white text-blue-800";
    case 'PICKED_UP_BY_USER': return isBackgroundColor ? "bg-indigo-100 text-indigo-800" : "bg-white text-indigo-800";
    case 'IN_SERVICE': return isBackgroundColor ? "bg-orange-100 text-orange-800" : "bg-white text-orange-800";
    case 'READY_TO_DISPATCH': return isBackgroundColor ? "bg-teal-100 text-teal-800" : "bg-white text-teal-800";
    case 'DISPATCHED': return isBackgroundColor ? "bg-sky-100 text-sky-800" : "bg-white text-sky-800";
    case 'DELIVERED': return isBackgroundColor ? "bg-green-100 text-green-800" : "bg-white text-green-800";
    default: return 'bg-white text-blue-500';
  }
};

export const RoleIds = {
  admin: 1,
  customer: 2,
  manager: 3,
  pickupPartner: 4,
  engineer: 5,
  customerExecutive: 6
};

export const capitalizeEachWord = (text = "") => {
  if (!text) return "";

  return text
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
};
