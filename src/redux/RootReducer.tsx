import ErrorModalWindowSlice from "../ErrorModalWindow/ErrorModalWindow/ErrorModalWindowSlice"
import UserLoginSlice from "../features/auth/UserLoginSlice"
import VendorSlice from "../pages/userManagement/VendorSlice"
import AddCategorySlice from "../pages/AddCategory/AddCategorySlice"
import SubCategorySlice from "../pages/AddSubCategory/SubCategorySlice"
import BrandSlice from "../pages/AddBrand/BrandSlice"
import MobileNumberSlice from "../pages/AddMobileNumber/MobileNumberSlice"
import ColorNameSlice from "../pages/AddColorName/ColorNameSlice"
import variantSlice from "../pages/AddVarient/VarientSlice"
import VariantColorSlice from "../pages/AddVarientColor/VariantColorSlice"
import ModalIssuesSlice from "../pages/ModalIssues/ModalIssuesSlice"
import RepairCostSlice from "../pages/RepairCost/RepairCostSlice"

const RootReducer = ({
    ErrorModalWindowSlice ,
    UserLoginSlice,
VendorSlice,   
AddCategorySlice,
SubCategorySlice,
BrandSlice,
MobileNumberSlice,
ColorNameSlice,
variantSlice,
VariantColorSlice,
ModalIssuesSlice,
RepairCostSlice,
})


export default RootReducer














// import ErrorModalWindowSlice from "../ErrorModalWindow/ErrorModalWindow/ErrorModalWindowSlice";
// import UserLoginSlice from "../features/auth/UserLoginSlice";
// import VendorSlice from "../pages/userManagement/VendorSlice";
// import AddCategorySlice from "../pages/AddCategory/AddCategorySlice";
// import SubCategorySlice from "../pages/AddSubCategory/SubCategorySlice";
// import BrandSlice from "../pages/AddBrand/BrandSlice";
// import MobileNumberSlice from "../pages/AddMobileNumber/MobileNumberSlice";
// import ColorNameSlice from "../pages/AddColorName/ColorNameSlice";
// import variantSlice from "../pages/AddVarient/VarientSlice";
// import VariantColorSlice from "../pages/AddVarientColor/VariantColorSlice";
// import ModalIssuesSlice from "../pages/ModalIssues/ModalIssuesSlice";
// import RepairCostSlice from "../pages/RepairCost/RepairCostSlice";

// // RootReducer should be an object, not a function
// const RootReducer = {
//     ErrorModalWindowSlice: ErrorModalWindowSlice,
//     UserLoginSlice: UserLoginSlice,
//     VendorSlice: VendorSlice,
//     AddCategorySlice: AddCategorySlice,
//     SubCategorySlice: SubCategorySlice,
//     BrandSlice: BrandSlice,
//     MobileNumberSlice: MobileNumberSlice,
//     ColorNameSlice: ColorNameSlice,
//     variantSlice: variantSlice,
//     VariantColorSlice: VariantColorSlice,
//     ModalIssuesSlice: ModalIssuesSlice,
//     RepairCostSlice: RepairCostSlice,
// };

// export default RootReducer;