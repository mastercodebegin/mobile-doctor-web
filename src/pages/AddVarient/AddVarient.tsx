import React, { useEffect, useState } from "react";
import { DeleteClass, DeleteIcon, EditClass, EditIcon, inputClass, ShowModalMainClass, ShowModelCloseButtonClass, ShowVarientButtonClass, SubmitButtonClass, TableDataClass, TableHadeClass } from "../../helper/ApplicationConstants";
import Pagination from "../../helper/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import Loading from "../../components/Loading";
import { FetchAllModalNumber } from "../AddMobileNumber/MobileNumberSlice";
import { CreateVariant, DeleteVariant, FetchVariantByModalId, Remove, Update, UpdateVariant } from "./VarientSlice";
import { GetAllColors } from "../AddColorName/ColorNameSlice";
import { toast } from "react-toastify";
import ConfirmationModal from "../../components/ConfirmationModal";
import IphoneImage from "../../assets/Laptop_Image.png";

const AddVarient = () => {
 const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [selectedModalNumber, setSelectedModalNumber] = useState("");
  const [isModalNumberSelected, setIsModalNumberSelected] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [openSpecRow, setOpenSpecRow] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
const [originalModalNumber, setOriginalModalNumber] = useState("");
  const { AllVariantData, isLoading } = useSelector((state: RootState) => state.variantSlice);
  const { AllModalNumberData } = useSelector((state: RootState) => state.MobileNumberSlice);
  const { colorData } = useSelector((state: RootState) => state.ColorNameSlice);

  const dispatch = useDispatch<AppDispatch>();

  const toggleSpecRow = (id: any) => {
    setOpenSpecRow(openSpecRow === id ? null : id);
  };

  // Main variant data state - covers all form fields
  const [variantData, setVariantData] = useState({
    ram: "",
    rom: "",
    battery: "",
    mainCamera: "",
    selfieCamera: "",
    network: "",
    isDeleted: false,
    variantColors: [
      {
        id: 0,
        colorName: {
          id: 0,
          color: "",
          colorCode: "",
          is_deleted: null
        },
        modalImages: [
          {
            id: 0,
            imageName: "",
            is_deleted: null
          }
        ]
      }
    ]
  });

  // Additional states for UI
  const [ProductModalNumberPK, setProductModalNumberPK] = useState("");
  const [editingVariant, setEditingVariant] = useState(null);

  // File handling state
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);

  const usersPerPage = 5;

  // Filter variants based on selected modal number
  const filteredVariants = selectedModalNumber ? AllVariantData : [];

  const getSelectedBrandName = () => {
    if (!selectedModalNumber) return "";
    const brand = AllModalNumberData?.find(brand => brand.id == selectedModalNumber);
    return brand?.name || "";
  };

  const paginatedUsers = filteredVariants.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  // Handle input changes for basic fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVariantData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle modal number selection
  const handleModalNumberChange = (e) => {
    const value = e.target.value;
    setSelectedModalNumber(value);
    setProductModalNumberPK(value);
  };

  const handleColorChange = (e) => {
    const colorId = parseInt(e.target.value);
    
    // Find the selected color from colorData
    const selectedColor = colorData?.find(color => color.id === colorId);
    
    setVariantData((prev) => {
      const existingVariantColor = prev.variantColors[0] || {};

      return {
        ...prev,
        variantColors: [
          {
            id: existingVariantColor.id || 0,
            colorName: {
              id: colorId,
              color: selectedColor?.color || "",
              colorCode: selectedColor?.colorCode || "",
              is_deleted: null
            },
            modalImages: existingVariantColor.modalImages || [
              { id: 0, imageName: "", is_deleted: null }
            ]
          }
        ]
      };
    });
  };

  // ✅ Fixed File Upload Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("📁 File input changed:");
    const files = e.target.files;
    console.log("Files count:", files?.length || 0);
    
    if (files && files.length > 0) {
      // Convert FileList to Array
      const fileArray = Array.from(files);
      console.log("🔍 Debug - Selected Files:", fileArray);
      console.log("📁 Files length:", fileArray.length);
      
      // Log each file details
      fileArray.forEach((file, index) => {
        console.log(`File ${index}:`, {
          name: file.name,
          size: file.size,
          type: file.type
        });
      });
      
      // Update your state with the files
       setSelectedFiles([...selectedFiles, ...fileArray]);
       e.target.value = null;
    } else {
      console.log("⚠️ No files selected!");
      setSelectedFiles([]);
    }
  };

  // Remove selected file by index
  const handleRemoveFile = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);

    setVariantData((prev) => ({
      ...prev,
      variantColors: [
        {
          ...prev.variantColors[0],
          modalImages: updatedFiles.map((file, idx) => ({
            id: idx,
            imageName: file.name,
            is_deleted: null
          }))
        }
      ]
    }));
  };

  // Reset form function
  const resetForm = () => {
    setVariantData({
      ram: "",
      rom: "",
      battery: "",
      mainCamera: "",
      selfieCamera: "",
      network: "",
      isDeleted: false,
      variantColors: [{
        id: 0,
        colorName: { id: 0, color: "", colorCode: "", is_deleted: null },
        modalImages: [{ id: 0, imageName: "", is_deleted: null }]
      }]
    });

    setSelectedFiles([]);
  };

  const handleSave = () => {
    if (!variantData.ram || !variantData.rom) {
      toast.error("Please fill RAM and ROM fields");
      return;
    }

    if (isEditMode && editingVariant?.id) {
      try {
        // ✅ FIXED: Dispatch Update with correct data structure
        dispatch(Update({
          id: editingVariant.id,
          ram: variantData.ram,
          rom: variantData.rom,
          selfieCamera: variantData.selfieCamera,
          mainCamera: variantData.mainCamera,
          battery: variantData.battery,
          network: variantData.network,
          isDeleted: variantData.isDeleted,
          // Include other necessary fields that your slice expects
          ProductModalNumberPK: editingVariant.ProductModalNumberPK,
          variantColors: variantData.variantColors
        }));

        // ✅ Then dispatch the async update
        dispatch(UpdateVariant(editingVariant.id))
          .unwrap()
          .then((res: any) => {
            dispatch(FetchVariantByModalId(selectedModalNumber));
            toast.success(res.message || "Variant Updated Successfully!!");
            handleCloseModal();
          })
          .catch((err: any) => {
            console.log("Update Failed:--", err);
            toast.error("Variant Update Failed: " + (err.message || err));
          });
      } catch (error) {
        console.error("Error updating variant:", error);
        toast.error("Error updating variant");
      }
    } else {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmSave = async () => {
    try {
      console.log("🚀 Starting form submission...");

      // Store current modal number before submission
      const currentModalNumber = selectedModalNumber;
      
      // Create FormData
      const formData = new FormData();
      
      // Add ProductModalNumberPK
      formData.append('ProductModalNumberPK', ProductModalNumberPK.toString());
      console.log("✅ ProductModalNumberPK:", ProductModalNumberPK);
      
      // Add files - FIXED VERSION
      if (selectedFiles && selectedFiles.length > 0) {
        selectedFiles.forEach((file, index) => {
          console.log(`📎 Adding file ${index}:`, file.name, file.size);
          formData.append('files', file); // Use 'files' as key for multiple files
        });
      } else {
        console.log("⚠️ No files to upload!");
      }
      
      // Add variant data as JSON string
      const variantDataString = JSON.stringify({
        ram: variantData.ram,
        rom: variantData.rom,
        battery: variantData.battery,
        mainCamera: variantData.mainCamera,
        selfieCamera: variantData.selfieCamera,
        network: variantData.network,
        variantColors: variantData.variantColors.map((colorItem) => ({
          colorName : {
            id : parseInt(colorItem.colorName.id),
            color : colorItem.colorName.color || "",
            colorCode : colorItem.colorName.colorCode || "",
            is_deleted : colorItem.colorName.is_deleted ?? false,
          },
          modalImages : selectedFiles.map((file, idx) => ({
            id : idx,
            imageName : file.name.replace(/\s+/g, '_'),
            is_deleted : false,
          }))
        }))
      });
      
      formData.append('variantStringData', variantDataString);
      console.log("✅ Variant data string:", variantDataString);
      
      // Debug: Log all FormData entries before sending
      console.log("🚀 FormData entries before sending:");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File {name: ${value.name}, size: ${value.size}, type: ${value.type}}`);
        } else {
          console.log(`${key}:`, value);
        }
      }
      
      // Dispatch the action
      const result = await dispatch(CreateVariant(formData));
      
      // ✅ FIXED: Close confirmation modal regardless of success/failure
      setShowConfirmModal(false);
      
      if (CreateVariant.fulfilled.match(result)) {
        console.log("✅ Variant created successfully:", result.payload);
        
        // ✅ ADDED: Show success message
        toast.success("Variant created successfully!");

        resetForm()

        setShowModal(false);
        setIsEditMode(false);

         // ✅ CRITICAL FIX: Maintain modal number selection state
        setSelectedModalNumber(currentModalNumber);
        setIsModalNumberSelected(true);
        setProductModalNumberPK(currentModalNumber);
        
        // ✅ FIXED: Refresh variant data with current modal number
        console.log("🔄 Refreshing variant data for modal number:", currentModalNumber);
        await dispatch(FetchVariantByModalId(currentModalNumber));
        
        // ✅ Reset to first page to see new variant
        setCurrentPage(1);
        
        // ✅ ADDED: Close main modal and reset form
        handleCloseModal();
        
      } else {
        console.log("❌ Create Variant Failed:", result.payload);
        
        // ✅ ADDED: Show error message
        toast.error(result.payload?.message || "Failed to create variant");
      }
      
    } catch (error) {
      console.error("❌ Form submission error:", error);
      
      // ✅ FIXED: Close confirmation modal even on error
      setShowConfirmModal(false);
      
      // ✅ ADDED: Show error message
      toast.error("Error creating variant");
    }
  };

  // ✅ NEW: Handle Create Variant Button Click
  const handleCreateVariant = () => {
    setProductModalNumberPK(selectedModalNumber);
    setShowModal(true);
  };

  // ✅ Modified handleCloseModal to preserve modal number selection
  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditMode(false);
    setEditingVariant(null);
    resetForm();
    setSelectedFiles([]);

    if (originalModalNumber) {
      setSelectedModalNumber(originalModalNumber);
      setIsModalNumberSelected(true);
      setProductModalNumberPK(originalModalNumber);
      setOriginalModalNumber(""); // Clear it
    }
    
    // ✅ FIX: DON'T reset modal number selection - keep it as is
    // This ensures user stays on the same variant list after closing modal
  };

  const handleEditUser = (variant: any) => {
    console.log("Editing variant:", variant);
    console.log("Editing Variant ProductModalNumberPK:", variant?.ProductModalNumberPK);
    console.log("AllModalNumberData:", AllModalNumberData);

 // Store the current modal number before editing
  setOriginalModalNumber(selectedModalNumber);
    
    // ✅ Set Modal Number (critical!)
    setProductModalNumberPK(variant?.ProductModalNumberPK?.toString() || "");
    setSelectedModalNumber(variant?.ProductModalNumberPK?.toString() || "");
    setIsModalNumberSelected(true);

    // ✅ Set local form state ONLY
    setVariantData({
      ram: variant.ram || "",
      rom: variant.rom || "",
      selfieCamera: variant.selfieCamera || "",
      mainCamera: variant.mainCamera || "",
      battery: variant.battery || "",
      network: variant.network || "",
      isDeleted: variant.isDeleted || false,
      variantColors: Array.isArray(variant.variantColors) && variant.variantColors.length > 0 
        ? variant.variantColors.map(vc => ({
            id: vc.id || 0,
            colorName: {
              id: vc.colorName?.id || 0,
              color: vc.colorName?.color || "",
              colorCode: vc.colorName?.colorCode || "",
              is_deleted: vc.colorName?.is_deleted || null
            },
            modalImages: Array.isArray(vc.modalImages) 
              ? vc.modalImages.map(img => ({
                  id: img.id || 0,
                  imageName: img.imageName || "",
                  is_deleted: img.is_deleted || null
                }))
              : [{ id: 0, imageName: "", is_deleted: null }]
          }))
        : [{
            id: 0,
            colorName: { id: 0, color: "", colorCode: "", is_deleted: null },
            modalImages: [{ id: 0, imageName: "", is_deleted: null }]
          }]
    });

    // ✅ Store the variant being edited for later use
    setEditingVariant(variant);

    // ✅ Set edit flags
    setIsEditMode(true);
    setShowModal(true);
  };

  // ✅ Modified handleDeleteUser to refresh UI after delete
  const handleDeleteUser = async (userId: number) => {
    console.log(`Delete user with ID: ${userId}`);

    try {
      const res = await dispatch(DeleteVariant(userId)).unwrap(); // Wait for thunk to complete
      console.log("Deleted variant:", res);

      // ✅ FIX: Remove from Redux state immediately for UI update
      dispatch(Remove(userId)); 
      
      // ✅ FIX: Also refresh the variant list from server to ensure consistency
      if (selectedModalNumber) {
        await dispatch(FetchVariantByModalId(selectedModalNumber));
      }
      
      toast.success("Deleted variant successfully");
      
      // ✅ FIX: If current page becomes empty after deletion, go to previous page
      const remainingItems = AllVariantData.filter(variant => variant.id !== userId).length;
      const totalPages = Math.ceil(remainingItems / usersPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
      
    } catch (error: any) {
      console.error("Delete failed:", error.message);
      toast.error("Failed to delete variant: " + (error.message || error));
    }
  };

  const handleModalNumberSelect = (modalNumber: string) => {
    setSelectedModalNumber(modalNumber);
    setIsModalNumberSelected(true);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSelectedModalNumber("");
    setCurrentPage(1);
  };

  // Effects
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (selectedModalNumber && selectedModalNumber !== "") {
      console.log("Dispatching FetchVariant With ModalNumberId:", selectedModalNumber);
      dispatch(FetchVariantByModalId(selectedModalNumber));
    }
  }, [selectedModalNumber, dispatch]);

  useEffect(() => {
    localStorage.setItem("Variant", JSON.stringify(AllVariantData))
    dispatch(FetchAllModalNumber());
    dispatch(GetAllColors());
  }, [dispatch]);

  if (isLoading) {
    return <Loading />;
  }

  // If no modal number is selected, show the selection screen
  if (!isModalNumberSelected) {
    return (
      <div className="md:h-[calc(95vh-80px)] md:overflow-y-hidden overflow-x-hidden">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h1 className="font-bold text-2xl text-center mb-6">Please Select Modal Number</h1>
            <select 
              className="w-full border rounded-md px-4 py-3 text-lg"
              value={selectedModalNumber}
              onChange={(e) => handleModalNumberSelect(e.target.value)}
            >
              <option value="">Choose Modal Number</option>
              {AllModalNumberData?.map((modal) => (
                <option key={modal.id} value={modal.id}>
                  {modal.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="md:overflow-y-hidden overflow-x-hidden">
        <div className="mt-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <select 
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-[200px]"
                value={selectedModalNumber}
                onChange={(e) => handleModalNumberSelect(e.target.value)}
              >
                <option value="">Select Modal Number</option>
                {AllModalNumberData?.map((modal) => (
                  <option key={modal.id} value={modal.id}>
                    {modal.name}
                  </option>
                ))}
              </select>
              {selectedModalNumber && (
                <button 
                  onClick={handleClear}
                  className="text-red-400 hover:text-red-600 text-sm bg-red-50 px-2 py-1 rounded"
                >
                  Clear Filter
                </button>
              )}
            </div> 
          </div>

          <div className="flex gap-2">
            <button 
              onClick={handleCreateVariant} 
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
                    <th scope="col" className={TableHadeClass}>Color</th>
                    <th scope="col" className={TableHadeClass}>Color Code</th>
                    <th scope="col" className={TableHadeClass}>Edit</th>
                    <th scope="col" className={TableHadeClass}>Delete</th>
                    <th scope="col" className={TableHadeClass}>Show Specification</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8">
                        <div className="text-gray-500">
                          {selectedModalNumber 
                            ? `No variants found for ${getSelectedBrandName()}!`
                            : "No variants found!"
                          }
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((user, index) => {
                     
                       // Add this safety check
  if (!user || !user.id) {
    return null; // Skip invalid entries
  }
                     
                      return (
                      <React.Fragment key={user?.id}>
                        <tr
                          className={`transform transition-all duration-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} ${hoveredRow === user?.id ? 'bg-gray-50' : 'bg-white'}`}
                          style={{ transitionDelay: `${index * 100}ms` }}
                          onMouseEnter={() => setHoveredRow(user?.id)}
                          onMouseLeave={() => setHoveredRow(null)}
                        >
                          <td className={TableDataClass}>{user?.id}</td>
                          <td className={TableDataClass}>
                            <div className="text-sm font-medium text-gray-600">
                              {user?.variantColors?.[0]?.colorName?.color || 'N/A'}
                            </div>
                          </td>
                          <td className={TableDataClass}>
                            <div className="w-5 h-5 rounded-full border" style={{ backgroundColor: user?.variantColors?.[0]?.colorName?.colorCode || '#ccc' }}></div>
                          </td>
                          <td className={TableDataClass}>
                            <button onClick={() => handleEditUser(user)} className={EditClass}>
                              {EditIcon}
                            </button>
                          </td>
                          <td className={TableDataClass}>
                            <button onClick={() => handleDeleteUser(user?.id)} className={DeleteClass}>
                             {DeleteIcon}
                            </button>
                          </td>
                          <td className={TableDataClass}>
                            <button onClick={() => toggleSpecRow(openSpecRow === user?.id ? null : user?.id)} className={ShowVarientButtonClass}>
                              {openSpecRow === user?.id ? 'Hide' : 'Show'} Specification
                            </button>
                          </td>
                        </tr>

                        {/* Expandable Specification Row */}
                        {openSpecRow === user?.id && (
                          <tr key={`variant-${user?.id}`}>
                            <td colSpan={13}>
                              <div className="bg-gray-50 p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {(() => {
                                    const variant = user;
                                    const variantFields = [
                                      { label: "Main Camera", value: `${variant?.mainCamera || 'N/A'} MP` },
                                      { label: "Selfie Camera", value: `${variant?.selfieCamera || 'N/A'} MP` },
                                      { label: "RAM", value: `${variant?.ram || 'N/A'} GB` },
                                      { label: "ROM", value: `${variant?.rom || 'N/A'} GB` },
                                      { label: "Battery", value: `${variant?.battery || 'N/A'} mAh` },
                                      { label: "Network", value: variant?.network || 'N/A' },
                                    ];

                                    return (
                                      <>
                                        {variantFields.map((field, i) => (
                                          <div key={i} className="p-4 bg-white rounded shadow-sm border border-gray-200">
                                            <div className="text-sm font-medium text-green-600">{field?.label}</div>
                                            <div className="text-sm text-gray-800 mt-1">{field?.value}</div>
                                          </div>
                                        ))}
  <div className="p-4 bg-white rounded shadow-sm border border-gray-200">
  <div className="text-sm font-medium text-green-600 mb-1">Image</div>
  <div className="flex items-center gap-3 flex-wrap">
    <img 
      src={IphoneImage}
      alt="Variant"
      className="w-20 h-20 object-contain border border-gray-300 rounded"
    />
  </div>
</div>



                                      </>
                                    );
                                  })()}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    )})
                  )}
                </tbody>
              </table>
            </div>
            
            {AllVariantData?.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalCount={AllVariantData?.length}
                itemsPerPage={usersPerPage}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className={ShowModalMainClass}>
          <div className="bg-white rounded-2xl shadow-xl p-8 w-[95%] max-w-4xl relative max-h-[90vh] overflow-y-auto">
            {/* Close */}
            <button
              className="absolute top-4 right-5 text-2xl font-bold text-gray-500 hover:text-black"
              onClick={handleCloseModal}
            >
              &times;
            </button>

            {/* Title */}
           <h2 className="text-3xl font-semibold text-center mb-6">
  {isEditMode ? "Update Variant" : "Add Variant"}
</h2>

{/* ✅ FIXED: Dropdowns - Show in both Create and Edit Mode, but pre-populate in Create Mode */}
            {!isEditMode && (
  <div className="mb-4 space-y-6">
    <div>
      <label className="block font-medium mb-1">Modal Number</label>
      <select
        className="w-full border rounded-md px-4 py-3"
        name="ProductModalNumberPK"
        value={ProductModalNumberPK}
        onChange={handleModalNumberChange}
      >
        <option value="">Select Modal Number</option>
        {AllModalNumberData?.map((item) => (
          <option key={item?.id} value={item?.id}>{item?.name}</option>
        ))}
      </select>
    </div>

    <div>
      <label className="block font-medium mb-1">Color</label>
      <select 
        className="w-full border rounded-md px-4 py-3"
        name="colorId"
        value={variantData?.variantColors[0]?.colorName?.id || ""}
        onChange={handleColorChange}
      >
        <option value="">Select Color</option>
        {colorData?.map((color) => (
          <option key={color?.id} value={color?.id}>
            {color?.color}
          </option>
        ))}
      </select>
    </div>
  </div>
)}

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block font-medium mb-1">RAM (GB)</label>
                <input
                  type="text"
                  name="ram"
                  value={variantData.ram}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="Enter RAM"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">ROM (GB)</label>
                <input
                  type="text"
                  name="rom"
                  value={variantData.rom}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="Enter ROM"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Main Camera (MP)</label>
                <input
                  type="text"
                  name="mainCamera"
                  value={variantData.mainCamera}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="Enter Main Camera"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Selfie Camera (MP)</label>
                <input
                  type="text"
                  name="selfieCamera"
                  value={variantData.selfieCamera}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="Enter Selfie Camera"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Battery (mAh)</label>
                <input
                  type="text"
                  name="battery"
                  value={variantData.battery}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="Enter Battery"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Network</label>
                <input
                  type="text"
                  name="network"
                  value={variantData.network}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="Enter Network (e.g., 4G, 5G)"
                />
              </div>
            </div>

            {/* File Upload Section */}
            {!isEditMode && (
  <div className="mb-6">
    <label className="block font-medium mb-2">Upload Images</label>
    <input
      type="file"
      multiple
      accept="image/*"
      onChange={handleFileChange}
      className="w-full border border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors"
    />
    
    {selectedFiles.length > 0 && (
      <div className="mt-4">
        <h4 className="font-medium mb-2">Selected Files:</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {selectedFiles.map((file, index) => (
            <div key={index} className="relative bg-gray-100 p-2 rounded-lg">
              <span className="text-sm text-gray-700 truncate block">{file.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
)}

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <button
                type="button"
                onClick={handleCloseModal}
                className={ShowModelCloseButtonClass}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className={SubmitButtonClass}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : (isEditMode ? 'Update Variant' : 'Save Variant')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <ConfirmationModal
          isOpen={showConfirmModal}
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmSave}
          title="Confirm Save"
          message="Are you sure you want to save this variant?"
        />
      )}
    </>
  );
};

export default AddVarient;
               