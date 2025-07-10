import React, { useEffect, useState } from "react";
import ConfirmationModal from "../../components/ConfirmationModal";
import { DeleteClass, EditClass, inputClass, SelectClass, ShowModalMainClass, ShowModelCloseButtonClass, SubmitButtonClass, TableDataClass, TableHadeClass } from "../../helper/ApplicationConstants";
import Pagination from "../../helper/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import Loading from "../../components/Loading";
import { FetchAllModalNumber } from "../AddMobileNumber/MobileNumberSlice";
import { GetAllModalIssues, GetAllProductPartsBySubCategory } from "../ModalIssues/ModalIssuesSlice";
import { GetAllRepairCost, GetRepairCostByModalId, CreateRepairCost, setEditRepairCost, UpdateRepairCost } from "./RepairCostSlice";
import { GetAllSubCategory, GetAllSubCategoryById } from "../AddSubCategory/SubCategorySlice";
import { GetAllCategory } from "../AddCategory/AddCategorySlice";
import { toast } from "react-toastify";

const RepairCost = () => {

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedProductPart, setSelectedProductPart] = useState("");
  const [selectedModalNumber, setSelectedModalNumber] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);

  // Initial selection states
  const [formModalNumber, setFormModalNumber] = useState("");

  // Filtered data for dropdowns
  const [filteredSubCategories, setFilteredSubCategories] = useState<any[]>([]);
  const [filteredProductParts, setFilteredProductParts] = useState<any[]>([]);

  // Form states
  const [formCategory, setFormCategory] = useState("");
  const [formSubCategory, setFormSubCategory] = useState("");
  const [formProductPart, setFormProductPart] = useState("");
  const [formFilteredSubCategories, setFormFilteredSubCategories] = useState<any[]>([]);
  const [formFilteredProductParts, setFormFilteredProductParts] = useState<any[]>([]);

  const { AllModalNumberData } = useSelector((state: RootState) => state.MobileNumberSlice);
  const { ModalIssuesData } = useSelector((state: RootState) => state.ModalIssuesSlice);
  const { RepairCostData, isLoading, Edit } = useSelector((state: RootState) => state.RepairCostSlice);
  const { data } = useSelector((state: RootState) => state.AddCategorySlice);
  const { SubCategoriesData } = useSelector((state: RootState) => state.SubCategorySlice);

  const dispatch = useDispatch<AppDispatch>();

  const usersPerPage = 5;
  const paginatedUsers = RepairCostData.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  const getDefaultFormData = () => ({
    price: '',
    message: '',
    category: {
      id: 0,
      name: '',
      is_deleted: false
    },
    subCategory: {
      id: 0,
      name: '',
      category: {
        id: 0,
        name: '',
        is_deleted: false
      },
      is_deleted: false
    },
    productPart: {
      id: 0,
      name: '',
       subCategory: {
        id: 0,
        name: '',
        category: {
          id: 0,
          name: '',
          is_deleted: false
        },
        is_deleted: false,
      },
      deleted: false
    },
    productModelNumber: {
      id: 0,
      name: '',
      brand: {
        id: 0,
        name: '',
        is_deleted: false
      },
      categories: {
        id: 0,
        name: '',
        is_deleted: false
      },
      subCategory: {
        id: 0,
        name: '',
        category: {
          id: 0,
          name: '',
          is_deleted: false
        },
      },
      is_deleted: false,
      productSpecification: {
        id: 0,
        network: '',
        platform: '',
        rom: '',
        ram: ''
      }
    },
  });

  const [formData, setFormData] = useState(getDefaultFormData());
  const [showSpecifications, setShowSpecifications] = useState(false);

  // Handle category selection from dropdown
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory("");
    setSelectedProductPart("");
    setSelectedModalNumber("");

    if (categoryId) {
      dispatch(GetAllSubCategoryById(Number(categoryId)));
    }

    if (!categoryId) {
      dispatch(GetAllRepairCost());
      setIsFiltered(false);
    }
  };

  // Handle subcategory selection from dropdown
  const handleSubCategorySelect = (subCategoryId: string) => {
    setSelectedSubCategory(subCategoryId);
    setSelectedProductPart("");
    setSelectedModalNumber("");

    if (subCategoryId) {
      dispatch(GetAllProductPartsBySubCategory(Number(subCategoryId)));
    }
  };

  // Handle product part selection from dropdown
  const handleProductPartSelect = (productPartId: string) => {
    setSelectedProductPart(productPartId);
    setSelectedModalNumber("");
  };

  // Handle modal number selection from dropdown
  const handleModalNumberSelect = (modalNumberId: string) => {
    setSelectedModalNumber(modalNumberId);

    if (selectedProductPart && modalNumberId) {
      dispatch(GetRepairCostByModalId({
        modalNumberId: Number(modalNumberId),
        modelIssueTitleId: Number(selectedProductPart)
      }));
      setIsFiltered(true);
      setCurrentPage(1);
    }
  };

  // Handle clear filter
  const handleClearFilter = () => {
    setSelectedCategory("");
    setSelectedSubCategory("");
    setSelectedProductPart("");
    setSelectedModalNumber("");
    setIsFiltered(false);
    setFilteredSubCategories([]);
    setFilteredProductParts([]);
    dispatch(GetAllRepairCost());
    setCurrentPage(1);
  };

  // Form category selection
  const handleFormCategorySelect = (categoryId: string) => {
    setFormCategory(categoryId);
    setFormSubCategory("");
    setFormProductPart("");

    if (categoryId) {
      dispatch(GetAllSubCategoryById(Number(categoryId)));
    }

    // Update form data
    const selectedCategoryData = data.find(cat => cat.id == categoryId);
    if (selectedCategoryData) {
      setFormData(prev => ({
        ...prev,
        category: selectedCategoryData
      }));
    }
  };

  // Form subcategory selection
  const handleFormSubCategorySelect = (subCategoryId: string) => {
    setFormSubCategory(subCategoryId);
    setFormProductPart("");

    if (subCategoryId) {
      dispatch(GetAllProductPartsBySubCategory(Number(subCategoryId)));
    }

    // Update form data
    const selectedSubCategoryData = SubCategoriesData.find(sub => sub.id == subCategoryId);
    if (selectedSubCategoryData) {
      setFormData(prev => ({
        ...prev,
        subCategory: selectedSubCategoryData
      }));
    }
  };

  // Form product part selection
  const handleFormProductPartSelect = (productPartId: string) => {
    setFormProductPart(productPartId);

    // Update form data
    const selectedProductPartData = ModalIssuesData.find(part => part.id == productPartId);
    if (selectedProductPartData) {
      setFormData(prev => ({
        ...prev,
        productPart: selectedProductPartData,
        modalIssueTitle: selectedProductPartData
      }));
    }
  };

  // 2. Fix the handleChange function for modalNumber
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'price' || name === 'message') {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else if (name === 'category') {
      handleFormCategorySelect(value);
    } else if (name === 'subCategory') {
      handleFormSubCategorySelect(value);
    } else if (name === 'productPart') {
      handleFormProductPartSelect(value);
    } else if (name === 'modalNumber') {
      setFormModalNumber(value); // Add this line
      const selectedModal = AllModalNumberData.find(item => item.id == value);

      if (selectedModal) {
        setFormData(prev => ({
          ...prev,
          productModelNumber: selectedModal
        }));
        setFormModalNumber(value);
        setShowSpecifications(true);
      } else {
        setFormData(prev => ({
          ...prev,
          productModelNumber: getDefaultFormData().productModelNumber
        }));
        setFormModalNumber("");
        setShowSpecifications(false);
      }
    }
  };

  // 3. Fix the handleCloseModal function to reset formModalNumber
  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditMode(false);
    setFormData(getDefaultFormData());
    setShowSpecifications(false);
    setFormCategory("");
    setFormSubCategory("");
    setFormProductPart("");
    setFormModalNumber("");
    setFormFilteredSubCategories([]);
    setFormFilteredProductParts([]);
  };

  // 5. Add this debug console.log in handleSaveClick to check if it's being called
const handleSaveClick = async () => {
  console.log("Save button clicked");

  if (!formData.category || !formData.price || !formData.productModelNumber?.id) {
    alert("Fill All Details!!");
    return;
  }

  const isUpdating = isEditMode && Edit?.repairCost?.id;
  console.log("✔ DEBUG ---");
console.log("isEditMode:", isEditMode); 
console.log("Edit.repairCost.id:", Edit.repairCost?.id); 
console.log("Edit.isEdit:", Edit.isEdit); 
  console.log("🔍 Is this an update?", isUpdating);
  console.log("🔍 Edit object:", Edit);

  if (isUpdating) {
    console.log("✅ UPDATE FLOW");

    try {
      // Prepare updated object
      const updatedRepairCost = {
        id: Edit.repairCost?.id,
        price: formData.price,
        message: formData.message,
        category: formData.category,
        subCategory: formData.subCategory,
        productPart: formData.productPart,
        productModelNumber: formData.productModelNumber
      };

      // First update the redux `edit` state
      dispatch(setEditRepairCost(updatedRepairCost));

      // Now make the async update API call
      const updateResult = await dispatch(UpdateRepairCost(updatedRepairCost.id)).unwrap();

      console.log("Update successful:", updateResult);

      await dispatch(GetAllRepairCost()); 
      toast.success(updateResult.message || "Repair Cost Updated Successfully!");
      handleCloseModal();

    } catch (error: any) {
      console.error("Edit error:", error);
      toast.error("Repair Cost Update Failed: " + error.message || error);
    }

  } else {
    console.log("❌ CREATE FLOW");
    setShowConfirmModal(true);
  }
};

  // 6. Add this debug console.log in handleConfirmSave
  const handleConfirmSave = async () => {
    console.log("Confirm save called");
    try {
      const requestData = {
        price: formData.price,
        message: formData.message,
        category: formData.category,
        subCategory: formData.subCategory,
        productPart: formData.productPart,
        productModelNumber: formData.productModelNumber,
      };

      console.log("Sending request data:", requestData);

      const result = await dispatch(CreateRepairCost(requestData));
      console.log("Create result:", result);

      setShowConfirmModal(false);
      handleCloseModal();

      // Refresh data based on current filter state
      if (isFiltered && selectedModalNumber && selectedProductPart) {
        dispatch(GetRepairCostByModalId({
          modalNumberId: Number(selectedModalNumber),
          modelIssueTitleId: Number(selectedProductPart)
        }));
      } else {
        dispatch(GetAllRepairCost());
      }
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleCreateRepairCost = () => {
    setShowModal(true);
  };

const handleEditUser = async (user: any) => {
  console.log("Edit Data", user);

  const subCategory = user?.productPart?.subCategory || {};
  const category = subCategory?.category || {};

  // Populate dropdowns
  if (category?.id) {
    await dispatch(GetAllSubCategoryById(category.id));
  }

  if (subCategory?.id) {
    await dispatch(GetAllProductPartsBySubCategory(subCategory.id));
  }

  // ✅ Pre-fill formData (local form state)
  setFormData({
    price: user?.price || "",
    message: user?.message || "",
    category,
    subCategory,
    productPart: user?.productPart || {},
    productModelNumber: user?.productModelNumber || {}
  });

  // ✅ Set dropdown values
  setFormCategory(category?.id?.toString() || "");
  setFormSubCategory(subCategory?.id?.toString() || "");
  setFormProductPart(user?.productPart?.id?.toString() || "");
  setFormModalNumber(user?.productModelNumber?.id?.toString() || "");

  // ✅ Set edit mode
  setIsEditMode(true);
  setShowSpecifications(!!user?.productModelNumber?.id);
  setShowModal(true);

  // ✅ Store edit data in Redux
  dispatch(setEditRepairCost(user));
};

  const handleDeleteUser = (userId: number) => {
    console.log("Delete Id", userId);
  };

  // Filter subcategories based on selected category
  useEffect(() => {
    if (selectedCategory && SubCategoriesData) {
      const filtered = SubCategoriesData.filter(sub => sub?.category?.id == selectedCategory);
      setFilteredSubCategories(filtered);
    } else {
      setFilteredSubCategories([]);
    }
  }, [selectedCategory, SubCategoriesData]);

  // Filter product parts based on selected subcategory
  useEffect(() => {
    if (selectedSubCategory && ModalIssuesData) {
      setFilteredProductParts(ModalIssuesData);
    } else {
      setFilteredProductParts([]);
    }
  }, [selectedSubCategory, ModalIssuesData]);

  // Filter subcategories for form
  useEffect(() => {
    if (formCategory && SubCategoriesData) {
      const filtered = SubCategoriesData.filter(sub => sub?.category?.id == formCategory);
      setFormFilteredSubCategories(filtered);
    } else {
      setFormFilteredSubCategories([]);
    }
  }, [formCategory, SubCategoriesData]);

  // Filter product parts for form
  useEffect(() => {
    if (formSubCategory && ModalIssuesData) {
      setFormFilteredProductParts(ModalIssuesData);
    } else {
      setFormFilteredProductParts([]);
    }
  }, [formSubCategory, ModalIssuesData]);

  // Initialize data on component mount
  useEffect(() => {
    setIsLoaded(true);
    dispatch(FetchAllModalNumber());
    dispatch(GetAllModalIssues());
    dispatch(GetAllCategory());
    dispatch(GetAllSubCategory());
    dispatch(GetAllRepairCost());
  }, [dispatch]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="md:overflow-y-hidden overflow-x-hidden">
        <div className="mt-10 flex items-center justify-between">

          {/* Left side - Filter controls */}
<div className="flex items-center flex-wrap gap-4">
  {/* First Row - Category and Sub-Category */}
  <div className="flex items-center gap-2">
    {/* Category Dropdown */}
    <select
      className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-[150px]"
      value={selectedCategory}
      onChange={(e) => handleCategorySelect(e.target.value)}
    >
      <option value="">Select Category</option>
      {data?.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>

    {/* Sub-Category Dropdown */}
    <select
      className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-[150px] disabled:bg-gray-100 disabled:cursor-not-allowed"
      value={selectedSubCategory}
      onChange={(e) => handleSubCategorySelect(e.target.value)}
      disabled={!selectedCategory}
    >
      <option value="">Select Sub-Category</option>
      {filteredSubCategories?.map((subCategory) => (
        <option key={subCategory.id} value={subCategory.id}>
          {subCategory.name}
        </option>
      ))}
    </select>
  </div>

  {/* Second Row - Product Part and Modal Number */}
  <div className="flex items-center gap-2">
    {/* Product Part Dropdown */}
    <select
      className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-[150px] disabled:bg-gray-100 disabled:cursor-not-allowed"
      value={selectedProductPart}
      onChange={(e) => handleProductPartSelect(e.target.value)}
      disabled={!selectedSubCategory}
    >
      <option value="">Select Product Part</option>
      {filteredProductParts?.map((part) => (
        <option key={part.id} value={part.id}>
          {part.name}
        </option>
      ))}
    </select>

    {/* Modal Number Dropdown */}
    <select
      className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-[150px] disabled:bg-gray-100 disabled:cursor-not-allowed"
      value={selectedModalNumber}
      onChange={(e) => handleModalNumberSelect(e.target.value)}
      disabled={!selectedProductPart}
    >
      <option value="">Select Modal Number</option>
      {AllModalNumberData?.map((modal) => (
        <option key={modal.id} value={modal.id}>
          {modal.name}
        </option>
      ))}
    </select>

    {/* Clear Filter Button */}
    {(selectedCategory || selectedSubCategory || selectedProductPart || selectedModalNumber || isFiltered) && (
      <button
        onClick={handleClearFilter}
        className="text-red-400 hover:text-red-600 text-sm bg-red-50 px-3 py-2 rounded ml-2"
      >
        Clear Filter
      </button>
    )}
  </div>
</div>

          {/* Right side - Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleCreateRepairCost}
              className={SubmitButtonClass}
            >
              Add
            </button>
          </div>
        </div>

        <div className="bg-gray-50 p-4 mt-2 min-h-screen">
          <div className="max-w-6xl mx-auto bg-white rounded-lg shadow overflow-hidden">
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                {/* Table Header */}
                <thead className="bg-white">
                  <tr>
                    <th scope="col" className={TableHadeClass}>#</th>
                    <th scope="col" className={TableHadeClass}>Price</th>
                    <th scope="col" className={TableHadeClass}>Product Part</th>
                    <th scope="col" className={TableHadeClass}>Modal Number</th>
                    <th scope="col" className={TableHadeClass}>Message</th>
                    <th scope="col" className={TableHadeClass}>Edit</th>
                    <th scope="col" className={TableHadeClass}>Delete</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8">
                        <div className="text-gray-500">
                          {isFiltered
                            ? "No repair costs found for selected filters. Create your first repair cost!"
                            : "No repair costs found. Create your first repair cost!"
                          }
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((user, index) => {
                      if (!user || !user.id) {
                        return null;
                      }

                      return (
                        <React.Fragment key={user?.id}>
                          <tr
                            className={`transform transition-all duration-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                              } ${hoveredRow === user?.id ? 'bg-gray-50' : 'bg-white'}`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                            onMouseEnter={() => setHoveredRow(user?.id)}
                            onMouseLeave={() => setHoveredRow(null)}
                          >
                            <td className={TableDataClass}>{user?.id}</td>
                            <td className={TableDataClass}>
                              <div className="text-sm font-medium text-gray-600">
                                ₹{user?.price || 'N/A'}
                              </div>
                            </td>
                            <td className={TableDataClass}>
                              <div className="text-sm font-medium text-gray-600">
                                {user?.productPart?.name || 'N/A'}
                              </div>
                            </td>
                            <td className={TableDataClass}>
                              <div className="text-sm font-medium text-gray-600">
                                {user?.productModelNumber?.name || 'N/A'}
                              </div>
                            </td>
                            <td className={TableDataClass}>
                              <div className="text-sm font-medium text-gray-600">
                                {user?.message || 'N/A'}
                              </div>
                            </td>
                            <td className={TableDataClass}>
                              <button onClick={() => handleEditUser(user)} className={EditClass}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                              </button>
                            </td>
                            <td className={TableDataClass}>
                              <button onClick={() => handleDeleteUser(user?.id)} className={DeleteClass}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        </React.Fragment>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            {RepairCostData?.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalCount={RepairCostData?.length}
                itemsPerPage={usersPerPage}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modal for Creating/Editing Repair Cost */}
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
                {isEditMode ? "Edit Repair Cost" : "Add Repair Cost"}
              </h2>

              {/* Form */}
              <div className="space-y-6">
                {/* Category Selection */}
                <div>
                  <label className="block font-medium mb-2">Select Category</label>
                  <select
                    name="category"
                    className={SelectClass}
                    onChange={handleChange}
                    value={formCategory}
                  >
                    <option value="">Choose Category</option>
                    {data?.map((item) => (
                      <option key={item?.id} value={item?.id}>{item?.name}</option>
                    ))}
                  </select>
                </div>

                {/* Sub-Category Selection */}
                <div>
                  <label className="block font-medium mb-2">Select Sub-Category</label>
                  <select
                    name="subCategory"
                    className={SelectClass}
                    onChange={handleChange}
                    value={formSubCategory}
                    disabled={!formCategory}
                  >
                    <option value="">Choose Sub-Category</option>
                    {formFilteredSubCategories?.map((item) => (
                      <option key={item?.id} value={item?.id}>{item?.name}</option>
                    ))}
                  </select>
                </div>

                {/* Product Part Selection */}
                <div>
                  <label className="block font-medium mb-2">Select Product Part</label>
                  <select
                    name="productPart"
                    className={SelectClass}
                    onChange={handleChange}
                    value={formProductPart}
                    disabled={!formSubCategory}
                  >
                    <option value="">Choose Product Part</option>
                    {formFilteredProductParts?.map((item) => (
                      <option key={item?.id} value={item?.id}>{item?.name}</option>
                    ))}
                  </select>
                </div>

                {/* Modal Number Selection */}
                <div>
                  <label className="block font-medium mb-2">Select Modal Number</label>
                  <select
                    name="modalNumber"
                    className={SelectClass}
                    onChange={handleChange}
                    value={formModalNumber}
                    disabled={!formProductPart}
                  >
                    <option value="">Choose Modal Number</option>
                    {AllModalNumberData?.map((item) => (
                      <option key={item?.id} value={item?.id}>{item?.name}</option>
                    ))}
                  </select>
                </div>

                {/* Price Input */}
                <div>
                  <label className="block font-medium mb-2">Price</label>
                  <input
                    type="number"
                    name="price"
                    className={inputClass}
                    placeholder="Enter Price"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>

                {/* Message Input */}
                <div>
                  <label className="block font-medium mb-2">Message</label>
                  <textarea
                    name="message"
                    className={inputClass}
                    placeholder="Enter Message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-center gap-4 mt-8">
                  <button
                    onClick={handleCloseModal}
                    className={ShowModelCloseButtonClass}
                  >
                    Close
                  </button>
                  <button
                    className={SubmitButtonClass}
                    onClick={handleSaveClick}
                    disabled={!formData.price || !formData.message || !formCategory || !formSubCategory || !formProductPart || !formModalNumber}
                  >
                    {isEditMode ? "Update Repair Cost" : "Add Repair Cost"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation Modal */}
          <ConfirmationModal
            isOpen={showConfirmModal}
            title="Confirm Repair Cost Creation"
            message="Are you sure you want to save this repair cost?"
            onConfirm={handleConfirmSave}
            onCancel={() => setShowConfirmModal(false)}
          />
        </>
      )}
    </>
  );
};

export default RepairCost;

