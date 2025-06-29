import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Loading from "../../components/Loading";
import { CreateModalNumber, FetchAllModalNumber, FetchBrandIdModalNumber, Remove, restore, Update, UpdateModalNumber } from "./MobileNumberSlice";
import ConfirmationModal from "../../components/ConfirmationModal";
import { GetAllSubCategory } from "../AddSubCategory/SubCategorySlice";
import { GetAllBrand } from "../AddBrand/BrandSlice";
import { DeleteClass, EditClass, inputClass, SelectClass, ShowModalMainClass, ShowModelCloseButtonClass, ShowVarientButtonClass, SubmitButtonClass, TableDataClass, TableHadeClass, ThemeTextColor } from "../../helper/ApplicationConstants";
import Pagination from "../../helper/Pagination";
import { toast } from "react-toastify";
import { GetAllCategory } from "../AddCategory/AddCategorySlice";
  
const MobileNumberPage = () => {
  // State declarations
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showVariantId, setShowVariantId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState(false);

  // Redux selectors
  const { AllModalNumberData, BrandModalNumberData, Edit, isLoading } = useSelector((state: RootState) => state.MobileNumberSlice);
  const { data } = useSelector((state: RootState) => state.AddCategorySlice);
  const { SubCategoriesData } = useSelector((state: RootState) => state.SubCategorySlice);
  const { BrandData } = useSelector((state: RootState) => state.BrandSlice);

  const dispatch = useDispatch();

  const usersPerPage = 5;

  const displayData = selectedBrand ? BrandModalNumberData : AllModalNumberData;

  const getSelectedBrandName = () => {
    if (!selectedBrand) return "";
    const brand = BrandData?.find(brand => brand.id == selectedBrand);
    return brand?.name || "";
  };

  // ✅ NEW: Function to check if user is in brand-filtered view
const isInBrandFilteredView = () => {
  return selectedBrand && selectedBrand !== "";
};

// ✅ ENHANCED: getCurrentContextInfo with more details
const getCurrentContextInfo = () => {
  if (isInBrandFilteredView()) {
    const brandData = BrandData?.find(brand => brand.id == selectedBrand);
    return {
      context: 'brand-filtered',
      brandName: brandData?.name || 'Unknown Brand',
      brandId: selectedBrand,
      totalItems: BrandModalNumberData?.length || 0,
      displayData: BrandModalNumberData,
      filterActive: true,
      message: `Viewing models for ${brandData?.name || 'Unknown Brand'}`
    };
  }
  
  return {
    context: 'all-models',
    totalItems: AllModalNumberData?.length || 0,
    displayData: AllModalNumberData,
    filterActive: false,
    message: 'Viewing all models from all brands'
  };
};

// ✅ NEW: Additional utility function using context info
const getContextBasedMessage = (action = 'create') => {
  const contextInfo = getCurrentContextInfo();
  
  switch (action) {
    case 'create':
      return contextInfo.context === 'brand-filtered' 
        ? `Adding new model to ${contextInfo.brandName} collection`
        : 'Adding new model to main database';
        
    case 'success':
      return contextInfo.context === 'brand-filtered'
        ? `Model successfully added to ${contextInfo.brandName}! Total ${contextInfo.brandName} models: ${contextInfo.totalItems + 1}`
        : `Model successfully added! Total models: ${contextInfo.totalItems + 1}`;
        
    case 'delete':
      return contextInfo.context === 'brand-filtered'
        ? `Are you sure you want to remove this model from ${contextInfo.brandName}?`
        : 'Are you sure you want to remove this model?';
        
    default:
      return contextInfo.message;
  }
};


  const paginatedUsers = displayData.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  // showVarients Form data
  const [showVarients, setShowVarients] = useState({
    platform: "",
    ram: "",
    rom: "",
    network: "",
  });

  const { platform, ram, rom, network } = showVarients;

  // Default Show Varient
  const defaultShowVarient = {
    platform: "",
    ram: "",
    rom: "",
    network: "",
  };

  // ✅ ENHANCED: Updated getDefaultFormData to handle auto brand selection
const getDefaultFormData = (autoBrandId = null, autoBrandName = null) => ({
  modelNo: "",
  category: {
    id: "",
    name: "",
    is_deleted: false
  },
  subCategory: {
    id: "",
    name: "",
    category: {
      id: "",
      name: "",
      is_deleted: false
    },
    is_deleted: false
  },
  brand: {
    id: autoBrandId || "",
    name: autoBrandName || "",
    is_deleted: false
  },
  showVarient: defaultShowVarient,
});

  // formData
  const [formData, setFormData] = useState(getDefaultFormData());
  const { modelNo, category, subCategory, brand } = formData;

  // Updated handleChange function to handle nested object updates
  const handleChage = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "modelNo") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } 
    else if (name === "category") {
      const selectedCategory = data.find(cat => cat.id == value || cat?.id === parseInt(value));
      console.log("Selected Category:", selectedCategory);
      
      setFormData((prev) => ({ 
        ...prev, 
        category: {
          id: value,
          name: selectedCategory?.name || "Category not found",
          is_deleted: false
        }
      }));
    }
    else if (name === "subCategory") {
      const selectedSubCategory = SubCategoriesData.find(subCat => subCat.id == value || subCat.id === parseInt(value));
      console.log("Selected SubCategory:", selectedSubCategory);
      
      setFormData((prev) => ({ 
        ...prev, 
        subCategory: {
          id: value,
          name: selectedSubCategory?.name || "SubCategory not found",
          category: {
            id: selectedSubCategory?.category?.id || "",
            name: selectedSubCategory?.category?.name || "Category not found",
            is_deleted: false
          },
          is_deleted: false
        }
      }));
    }
    else if (name === "brand") {
      const selectedBrand = BrandData.find(brand => brand.id == value || brand.id === parseInt(value));
      console.log("Selected Brand:", selectedBrand);
      
      setFormData((prev) => ({ 
        ...prev, 
        brand: {
          id: value,
          name: selectedBrand?.name || "Brand not found",
          is_deleted: false
        }
      }));
    }
    else {
      // For showVarient fields
      setShowVarients((prev) => ({ ...prev, [name]: value }));
      setFormData((prev) => ({
        ...prev,
        showVarient: { ...prev.showVarient, [name]: value }
      }));
    }
  };

  // ✅ NEW: Function to handle Create Model button click
const handleCreateModelClick = () => {
  // ✅ If a brand is selected, auto-populate it in the form
  if (selectedBrand && selectedBrand !== "") {
    const selectedBrandData = BrandData?.find(brand => brand.id == selectedBrand);
    if (selectedBrandData) {
      setFormData(getDefaultFormData(selectedBrand, selectedBrandData.name));
    } else {
      setFormData(getDefaultFormData());
    }
  } else {
    // ✅ No brand filter - start with empty form
    setFormData(getDefaultFormData());
  }
  
  setIsEditMode(false);
  setShowModal(true);
};


// ✅ ENHANCED: Updated handleSaveClick for proper edit functionality
const handleSaveClick = async () => {
  if (!formData.modelNo || !formData.brand.id || !formData.category.id) {
    alert("Please enter full details!!");
    return;
  }

  if (isEditMode && Edit.modalNumber?.id) {
    try {
      const updateData = {
        id: Edit.modalNumber.id,
        name: formData.modelNo,
        categories: formData.category,
        subCategory: formData.subCategory,
        brand: formData.brand,
        productSpecification: {
          id: Edit.modalNumber.productSpecification?.id || "",
          network: formData.showVarient.network,
          platform: formData.showVarient.platform,
          ram: formData.showVarient.ram,
          rom: formData.showVarient.rom
        },
        is_deleted: Edit.modalNumber.is_deleted
      };

      dispatch(Update(updateData));

      const updateResult = await dispatch(UpdateModalNumber(Edit.modalNumber.id)).unwrap();
      
      console.log("Update successful:", updateResult);
      
      // ✅ After successful update, refresh the appropriate data
      if (selectedBrand && selectedBrand !== "") {
        await dispatch(FetchBrandIdModalNumber(parseInt(selectedBrand)));
      } else {
        await dispatch(FetchAllModalNumber());
      }
      
      toast.success(updateResult.message || "Model Number Updated Successfully!");
      handleCloseModal();
      
    } catch (error : any) {
      console.error("Update Failed:", error);
      toast.error("Model Number update failed: " + (error?.message || error));
    }
  } else {
    setShowConfirmModal(true);
  }
};

// ✅ Usage in handleConfirmSave with context info
const handleConfirmSave = async () => {
  const contextInfo = getCurrentContextInfo();
  
  const newMobileNumber = {
    name: formData.modelNo,
    brand: {
      id: parseInt(formData.brand.id),
      name: formData.brand.name,
      is_deleted: false
    },
    categories: {
      id: parseInt(formData.category.id),
      name: formData.category.name,
      is_deleted: false
    },
    subCategory: {
      id: parseInt(formData.subCategory.id),
      name: formData.subCategory.name,
      category: {
        id: parseInt(formData.subCategory.category.id),
        name: formData.subCategory.category.name,
        is_deleted: false
      },
      is_deleted: false
    },
    is_deleted: false,
    productSpecification: {
      network: formData.showVarient.network,
      platform: formData.showVarient.platform,
      rom: formData.showVarient.rom,
      ram: formData.showVarient.ram,
    }
  };

  try {
    console.log("Creating model with context:", contextInfo);
    
    const createResult = await dispatch(CreateModalNumber(newMobileNumber)).unwrap();

    console.log(createResult)
    
    // Refresh based on context
    if (contextInfo.context === 'brand-filtered') {
      await dispatch(FetchBrandIdModalNumber(parseInt(contextInfo.brandId)));
    } else {
      await dispatch(FetchAllModalNumber());
    }
    
    // Reset form with context awareness
    if (contextInfo.context === 'brand-filtered') {
      const selectedBrandData = BrandData?.find(brand => brand.id == contextInfo.brandId);
      setFormData(getDefaultFormData(contextInfo.brandId, selectedBrandData?.name || ""));
    } else {
      setFormData(getDefaultFormData());
    }
    
    setShowVarients(defaultShowVarient);
    setShowConfirmModal(false);
    setShowModal(false);
    setCurrentPage(1);
    
    // Context-aware success message
    toast.success(getContextBasedMessage('success'));
    
  } catch (error : any) {
    console.error("Failed to create model number:", error);
    toast.error("Failed to create model number: " + (error?.message || error));
  }
};

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBrand("");
    setIsEditMode(false);
    setFormData(getDefaultFormData()); // ✅ Reset form data properly
    setShowVarients(defaultShowVarient); // ✅ Reset variants
    dispatch(restore());
  }

  // ✅ FIXED: Updated handleEditUser to properly populate form data
  const handleEditUser = (user: any) => {
    console.log("Editing user:", user);
    
    // ✅ Dispatch the correct data structure to Redux
    dispatch(Update({
      id: user.id,
      name: user.name, // ✅ Using 'name' field consistently
      categories: user.categories, // ✅ Note: 'categories' not 'category'
      subCategory: user.subCategory,
      brand: user.brand,
      productSpecification: user.productSpecification,
      is_deleted: user.is_deleted
    }));

    // ✅ Set form data to match the user data structure
    setFormData({
      modelNo: user.name || "",
      category: {
        id: user.categories?.id?.toString() || "",
        name: user.categories?.name || "",
        is_deleted: user.categories?.is_deleted || false
      },
      subCategory: {
        id: user.subCategory?.id?.toString() || "",
        name: user.subCategory?.name || "",
        category: {
          id: user.subCategory?.category?.id?.toString() || "",
          name: user.subCategory?.category?.name || "",
          is_deleted: user.subCategory?.category?.is_deleted || false
        },
        is_deleted: user.subCategory?.is_deleted || false
      },
      brand: {
        id: user.brand?.id?.toString() || "",
        name: user.brand?.name || "",
        is_deleted: user.brand?.is_deleted || false
      },
      showVarient: {
        network: user.productSpecification?.network || "",
        platform: user.productSpecification?.platform || "",
        ram: user.productSpecification?.ram || "",
        rom: user.productSpecification?.rom || ""
      }
    });

    // ✅ Set variants separately
    setShowVarients({
      network: user.productSpecification?.network || "",
      platform: user.productSpecification?.platform || "",
      ram: user.productSpecification?.ram || "",
      rom: user.productSpecification?.rom || ""
    });

    setIsEditMode(true);
    setShowModal(true);
  };

  const handleDeleteUser = (userId: number) => {
    console.log(`Delete user with ID: ${userId}`);
    dispatch(Remove(userId));
  };

  // Animation for table rows
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
        localStorage.setItem("Modal-Numbers", JSON.stringify(AllModalNumberData));
        // localStorage.setItem("Category", JSON.stringify(data))
        // localStorage.setItem("Sub-Category", JSON.stringify(SubCategoriesData))
    // localStorage.setItem("Brand-Modal-Numbers", JSON.stringify(BrandModalNumberData));
    dispatch(GetAllSubCategory());
    dispatch(GetAllBrand());
    dispatch(GetAllCategory());
    dispatch(FetchAllModalNumber());
  }, []);

  // Replace your existing useEffect for brand filtering with this:
  useEffect(() => {
    if (selectedBrand && selectedBrand !== "") {
      console.log("Dispatching FetchBrandIdModalNumber with brandId:", selectedBrand);
      dispatch(FetchBrandIdModalNumber(selectedBrand));
    }
  }, [selectedBrand, dispatch]);

  useEffect(() => {
    console.log("🔍 useEffect triggered with selectedBrand:", selectedBrand);
    
    if (selectedBrand && selectedBrand !== "" && selectedBrand !== "undefined") {
      console.log("🚀 Dispatching FetchBrandIdModalNumber");
      
      // Make sure to pass the right type
      const brandId = parseInt(selectedBrand);
      
      if (!isNaN(brandId)) {
        dispatch(FetchBrandIdModalNumber(brandId));
      } else {
        console.error("❌ Invalid brandId after parsing:", brandId);
      }
    } else {
      console.log("📋 Fetching all models");
      dispatch(FetchAllModalNumber());
    }
  }, [selectedBrand, dispatch]);

// 3. CHECK: Your dropdown onChange handler
const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const value = e.target.value;
  console.log("Brand dropdown changed:", value, typeof value);
  
  // Make sure value is not empty string
  if (value && value !== "") {
    setSelectedBrand(value);
  } else {
    setSelectedBrand("");
    // Reset to show all data
    dispatch(FetchAllModalNumber());
  }
};

// 6. DEBUG: Add state logging
useEffect(() => {
  console.log("🔍 Current states:");
  console.log("selectedBrand:", selectedBrand);
  console.log("BrandData:", BrandData);
  console.log("AllModalNumberData:", AllModalNumberData?.length);
  console.log("BrandModalNumberData:", BrandModalNumberData?.length);
}, [selectedBrand, BrandData, AllModalNumberData, BrandModalNumberData]);


  const handleClear = () => {
    setSelectedBrand("");
    setCurrentPage(1);
    dispatch(FetchAllModalNumber());
  };

  // Reset pagination when brand changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBrand]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="md:overflow-y-hidden overflow-x-hidden">
        {/* Top Section - Search Icon, Brand Filter, and Create Button */}
        <div className="mt-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Brand Filter Dropdown */}
            <div className="flex items-center gap-2">
              <select
                value={selectedBrand}
                onChange={handleBrandChange}
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-[200px]"
              >
                <option value="">All Brands</option>
                {BrandData?.map((item) => (
                  <option key={item?.id} value={item?.id}>
                   {item?.name}
                  </option>
                ))}
              </select>
              
              {selectedBrand && (
                <button 
                  onClick={handleClear}
                  className="text-red-400 hover:text-red-600 text-sm bg-red-50 px-2 py-1 rounded"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>

<button 
  onClick={handleCreateModelClick} // ✅ Changed from setShowModal(true)
  className={`${SubmitButtonClass}`}
>
  Create Model Number
</button>
        </div>

        {/* Center Section - Show Data in Table Format */}
        <div className="bg-gray-50 p-4 mt-2 min-h-screen">
          <div className="max-w-6xl mx-auto bg-white rounded-lg shadow overflow-hidden">
            {/* Show filtering info */}
            <div className={`bg-transparent p-4 rounded-t-lg border border-gray-200 ${ThemeTextColor}`}>
              <h2 className="text-xl font-semibold">
                {selectedBrand 
                  ? `${getSelectedBrandName()} Models (${displayData.length} total)` 
                  : `All Models (${displayData.length} total)`
                }
              </h2>
            </div>



            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                {/* Table Header */}
                <thead className="bg-white">
                  <tr>
                    <th scope="col" className={TableHadeClass}>#</th>
                    <th scope="col" className={TableHadeClass}>Model No</th>
                    <th scope="col" className={TableHadeClass}>Category</th>
                    <th scope="col" className={TableHadeClass}>Sub Category</th>
                    <th scope="col" className={TableHadeClass}>Brand</th>
                    <th scope="col" className={TableHadeClass}>Edit</th>
                    <th scope="col" className={TableHadeClass}>Delete</th>
                    <th scope="col" className={TableHadeClass}>Show Variant</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8">
                        <div className="text-gray-500">
                          {selectedBrand 
                            ? `No models found for ${getSelectedBrandName()}. Create your first model!`
                            : "No models found. Create your first model!"
                          }
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((user, index) => (
                      <React.Fragment key={user?.id}>
                        <tr
                          className={`transform transition-all duration-300 ${
                            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                          } ${hoveredRow === user?.id ? 'bg-gray-50' : 'bg-white'}`}
                          style={{ transitionDelay: `${index * 100}ms` }}
                          onMouseEnter={() => setHoveredRow(user?.id)}
                          onMouseLeave={() => setHoveredRow(null)}
                        >
                          <td className={TableDataClass}>{user?.id}</td>
                          <td className={TableDataClass}>
                            <div className="text-sm font-medium text-gray-600">{user?.name}</div>
                          </td>
                          <td className={TableDataClass}>
                            <div className="text-sm font-medium text-gray-600">{user?.categories?.name}</div>
                          </td>
                          <td className={TableDataClass}>
                            <div className="text-sm font-medium text-gray-600">{user?.subCategory?.name}</div>
                          </td>
                          <td className={TableDataClass}>
                            <div className="text-sm font-medium text-gray-600">{user?.brand?.name}</div>
                          </td>
                          <td className={TableDataClass}>
                            <button
                              onClick={() => handleEditUser(user)}
                              className={EditClass}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </button>
                          </td>
                          <td className={TableDataClass}>
                            <button
                              onClick={() => handleDeleteUser(user?.id)}
                              className={DeleteClass}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </td>
                          <td className="py-4 px-6 whitespace-nowrap">
                            <button
                              onClick={() => setShowVariantId(showVariantId === user?.id ? null : user?.id)}
                              className={`${ShowVarientButtonClass}`}
                            >
                              {showVariantId === user?.id ? "Hide Variant" : "View Variant"}
                            </button>
                          </td>
                        </tr>

                        {/* variant Row */}
                        {showVariantId === user?.id && (
                          <tr key={`variant-${user?.id}`}>
                            <td colSpan={8}>
                              <div className="bg-gray-50 p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {(() => {
                                    const variant = user?.productSpecification;
                                    if (!variant) return null;

                                    const variantFields = [
                                      { label: "Platform", value: variant.platform },
                                      { label: "RAM", value: variant.ram },
                                      { label: "ROM", value: variant.rom },
                                      { label: "Network", value: variant.network },
                                    ];

                                    return variantFields.map((field, i) => (
                                      <div key={i} className="p-4 bg-white rounded shadow-sm border">
                                        <div className="text-sm font-medium text-green-600">{field.label}</div>
                                        <div className="text-sm text-gray-800 mt-1">{field.value}</div>
                                      </div>
                                    ));
                                  })()}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Reusable Pagination Component */}
            {displayData.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalCount={displayData.length}
                itemsPerPage={usersPerPage}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modal for creating new model */}
      {showModal && (
        <>
          <div className={ShowModalMainClass}>
            <div className="bg-white rounded-2xl shadow-xl p-8 w-[90%] max-w-4xl relative max-h-[90vh] overflow-y-auto">
              {/* Close Button */}
              <button
                className="absolute top-4 right-6 text-2xl font-bold text-gray-500 hover:text-black"
                onClick={handleCloseModal}
              >
                &times;
              </button>

              <h2 className="text-3xl font-semibold text-center mb-8">
                {isEditMode ? "Edit Model Number" : "Add Model Number"}
              </h2>

              {/* Form */}
              <div className="space-y-6">
                {/* Dropdown + Model Input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-medium mb-2">Model Number</label>
                    <input 
                      onChange={handleChage} 
                      value={modelNo} 
                      type="text" 
                      required 
                      name="modelNo" 
                      placeholder="Model Number" 
                      className={inputClass} 
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-2">Select Category</label>
                    <select
                      className={SelectClass}
                      name="category"
                      onChange={handleChage}
                      value={category.id}
                    >
                      <option value="">Select Category</option>
                      {data?.map((item) => (
                        <option key={item?.id} value={item?.id}>
                          {item?.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium mb-2">Select Sub Category</label>
                    <select
                      className={SelectClass}
                      onChange={handleChage}
                      name="subCategory"
                      value={subCategory.id}
                    >
                      <option value="">Select Sub Category</option>
                      {SubCategoriesData?.map((item) => (
                        <option key={item?.id} value={item?.id}>
                          {item?.name}
                        </option>
                      ))}
                    </select>
                  </div>


<div>
  <label className="block font-medium mb-2">
    Select Brand 
    {selectedBrand && (
      <span className="text-sm text-gray-600 ml-2">
        (Auto-selected: {getSelectedBrandName()})
      </span>
    )}
  </label>
  <select
    className={SelectClass}
    onChange={handleChage}
    name="brand"
    value={brand.id}
  >
    <option value="">Select Brand</option>
    {BrandData?.map((item) => (
      <option key={item?.id} value={item?.id}>
        {item?.name}
        {selectedBrand == item?.id}
      </option>
    ))}
  </select>
  {selectedBrand && selectedBrand == brand.id && (
    <p className="text-xs text-green-600 mt-1">
      ✓ This brand is auto-selected because you're viewing {getSelectedBrandName()} models. You can change it if needed.
    </p>
  )}
</div>
                </div>

                {/* Specification Title */}
                <h3 className="text-xl font-semibold">Specification</h3>

                {/* Specification Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block font-medium mb-2">Platform</label>
                    <input onChange={handleChage} value={platform} type="text" placeholder="Platform" name="platform" className={inputClass} />
                  </div>

                  <div>
                    <label className="block font-medium mb-2">Network</label>
                    <input onChange={handleChage} name="network" value={network} type="text" placeholder="Network" className={inputClass} />
                  </div>

                  <div>
                    <label className="block font-medium mb-2">Ram</label>
                    <input onChange={handleChage} name="ram" value={ram} type="text" placeholder="Ram" className={inputClass} />
                  </div>

                  <div>
                    <label className="block font-medium mb-2">Rom</label>
                    <input onChange={handleChage} name="rom" value={rom} type="text" placeholder="Rom" className={inputClass} />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-6 mt-10">
                  <button
                    onClick={handleCloseModal}
                    className={ShowModelCloseButtonClass}
                  >
                    Close
                  </button>
                  <button
                    onClick={handleSaveClick}
                    className={SubmitButtonClass}
                  >
                    {isEditMode ? "UPDATE CHANGES" : "SAVE CHANGES"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <ConfirmationModal
            isOpen={showConfirmModal}
            title="Confirm Mobile Number Creation"
             message={(() => {
    const contextInfo = getCurrentContextInfo();
    
    if (contextInfo.context === 'brand-filtered') {
      return `Are you sure you want to add the model "${modelNo}" for brand "${brand.name}"? 
              This will be added to your current ${contextInfo.brandName} filter view 
              (Total ${contextInfo.brandName} models will become ${contextInfo.totalItems + 1}).`;
    } else {
      return `Are you sure you want to add the model "${modelNo}" for brand "${brand.name}"? 
              This will be added to the main models list 
              (Total models will become ${contextInfo.totalItems + 1}).`;
    }
  })()}
            onConfirm={handleConfirmSave}
            onCancel={() => setShowConfirmModal(false)}
          />
        </>
      )}
    </>
  );
};

export default MobileNumberPage; 