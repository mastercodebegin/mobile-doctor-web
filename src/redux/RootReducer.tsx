import UserLoginSlice from "../features/auth/UserLoginSlice"
import ErrorModalWindowSlice from "../ErrorModalWindow/ErrorModalWindow/ErrorModalWindowSlice"
import VendorSlice from "../pages/userManagement/VendorSlice"
import AddCategorySlice from "../pages/AddCategory/AddCategorySlice"
import SubCategorySlice from "../pages/AddSubCategory/SubCategorySlice"
import BrandSlice from "../pages/AddBrand/BrandSlice"
import MobileNumberSlice from "../pages/AddMobileNumber/MobileNumberSlice"
import ColorNameSlice from "../pages/AddColorName/ColorNameSlice"
import variantSlice from "../pages/AddVarient/VarientSlice"
import VariantColorSlice from "../pages/AddVarientColor/VariantColorSlice"

const RootReducer = ({
UserLoginSlice,
ErrorModalWindowSlice ,
VendorSlice,   
AddCategorySlice,
SubCategorySlice,
BrandSlice,
MobileNumberSlice,
ColorNameSlice,
variantSlice,
VariantColorSlice
})


export default RootReducer