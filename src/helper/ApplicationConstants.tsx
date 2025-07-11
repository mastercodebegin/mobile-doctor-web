export const ThemeBackgroundColor = 'bg-gray-800'

export const ThemeBackgroundHoverColor = 'hover:bg-gray-700'

export const ThemeTextColor = 'text-gray-800 hover:text-gray-700'

export const ShowVarientButtonClass = "bg-gray-800 duration-200  hover:bg-gray-700 px-6 py-2 rounded-md shadow  transition text-white"

export const SubmitButtonClass = `${ThemeBackgroundColor} ${ThemeBackgroundHoverColor} px-10 py-3  text-white rounded-xl transition`

export const ShowModelCloseButtonClass = "px-6 py-3 bg-gray-300 text-white rounded-full hover:bg-gray-400 transition"

export const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800";

export const EditClass = " text-green-400 hover:text-green-600 transition-colors duration-200"

export const DeleteClass = " text-red-400 hover:text-red-600 transition-colors duration-200"

export const TableDataClass = "py-4 px-6 whitespace-nowrap text-sm text-gray-500"

export const TableHadeClass = `py-4 px-6 text-left text-sm font-medium ${ThemeTextColor} `

export const ShowModalMainClass = "fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm"

export const SelectClass = "w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"


// Sidebar Color Tokens

 export const SidebarColors = {
  dashboard: { bgColor: 'bg-blue-50', color: '#3B82F6' },
  userManagement: { bgColor: 'bg-blue-50', color: '#3B82F6' },
  productPartLabel: { bgColor: 'bg-blue-50', color: '#3B82F6' },
  repairCost: { bgColor: 'bg-blue-50', color: '#3B82F6' },
  addProduct: {
    category: { bgColor: 'bg-blue-50', color: '#3B82F6' },
    subCategory: { bgColor: 'bg-blue-50', color: '#3B82F6' },
    brand: {bgColor: 'bg-blue-50', color: '#3B82F6' },
    modelNumber: { bgColor: 'bg-blue-50', color: '#3B82F6' },
    colorName: { bgColor: 'bg-blue-50', color: '#3B82F6' },
    variant: { bgColor: 'bg-blue-50', color: '#3B82F6' },
    variantColor: { bgColor: 'bg-blue-50', color: '#3B82F6' },
  },
  inventory: {
    productPart: { bgColor: 'bg-blue-50', color: '#3B82F6' },
    products: { bgColor: 'bg-blue-50', color: '#3B82F6' },
  },
  dropdown: {
    addProduct: {  bgColor: 'bg-green-50', color: '#10B981' },
    inventory: {  bgColor: 'bg-green-50', color: '#10B981' },
  },
};

