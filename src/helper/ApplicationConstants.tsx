export const ThemeBackgroundColor = 'bg-gray-800'

export const ThemeBackgroundHoverColor = 'hover:bg-gray-700'

export const ThemeTextColor = 'text-gray-800 hover:text-gray-700'

export const ShowVarientButtonClass = "bg-gray-800 duration-200  hover:bg-gray-700 px-6 py-2 rounded-md shadow  transition text-white"

export const SubmitButtonClass = `${ThemeBackgroundColor} ${ThemeBackgroundHoverColor} px-10 py-3  text-white rounded-xl transition`

export const InventoryView = `${ThemeBackgroundColor} ${ThemeBackgroundHoverColor} px-5 py-2  text-white rounded-xl transition`

export const ShowModelCloseButtonClass = "px-6 py-3 bg-gray-300 text-white rounded-full hover:bg-gray-400 transition"

export const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800";

export const EditClass = " text-green-400 hover:text-green-600 transition-colors duration-200"

export const DeleteClass = " text-red-400 hover:text-red-600 transition-colors duration-200"

export const TableDataClass = "py-4 px-6 whitespace-nowrap text-sm text-gray-500"

export const TableHadeClass = `py-4 px-6 text-left text-sm font-medium ${ThemeTextColor} `

export const ShowModalMainClass = "fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm"

export const SelectClass = "w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"

export const EditIcon =  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>

export const DeleteIcon =  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>                                


// Sidebar Color Tokens

 export const SidebarColors = {
  dashboard: { bgColor: 'bg-blue-50', color: '#3B82F6' },
  userManagement: { bgColor: 'bg-blue-50', color: '#3B82F6' },
  productPartLabel: { bgColor: 'bg-blue-50', color: '#3B82F6' },
  repairCost: { bgColor: 'bg-blue-50', color: '#3B82F6' },
  orders: {bgColor: 'bg-blue-50', color: '#3B82F6'},
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

