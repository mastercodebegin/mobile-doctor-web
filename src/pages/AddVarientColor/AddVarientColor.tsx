import { useEffect, useState } from "react";
import { DeleteClass, DeleteIcon, EditClass, EditIcon, SelectClass, ShowModalMainClass, ShowModelCloseButtonClass, SubmitButtonClass, TableDataClass, TableHadeClass } from "../../helper/ApplicationConstants";
import Pagination from "../../helper/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import Loading from "../../components/Loading";
import { GetAllCategory } from "../AddCategory/AddCategorySlice";
import { GetAllSubCategory } from "../AddSubCategory/SubCategorySlice";
import { GetAllBrand } from "../AddBrand/BrandSlice";
import { GetAllColors } from "../AddColorName/ColorNameSlice";
import { CreateVariantColor } from "./VariantColorSlice";
import { FetchModalBySubCategory } from "../AddMobileNumber/MobileNumberSlice";
import { FetchVariantByModalId } from "../AddVarient/VarientSlice";
import { toast } from "react-toastify";
import ConfirmationModal from "../../components/ConfirmationModal";

interface FormData {
  category: string;
  subCategory: string;
  brand: string;
  modalNumber: string;
}

const AddVarientColor = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    category: "",
    subCategory: "",
    brand: "",
    modalNumber: "",
  });

  const [variantId, setVariantId] = useState("")

  const [variantColorData, setVariantColorData] = useState({
    id: 0,
    colorName: {
      id: 0,
      color: "",
      colorCode: "",
      is_deleted: false
    },
    modalImages: {
      id: 0,
      imageName: "",
      is_deleted: false
    }
  })

  // File handling state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Redux selectors
  const { data: categoryData } = useSelector((state: RootState) => state.AddCategorySlice);
  const { SubCategoriesData } = useSelector((state: RootState) => state.SubCategorySlice);
  const { BrandData } = useSelector((state: RootState) => state.BrandSlice);
  const { MobileNumberData } = useSelector((state: RootState) => state.MobileNumberSlice);
  const { AllVariantData } = useSelector((state: RootState) => state.variantSlice);
  const { colorData } = useSelector((state: RootState) => state.ColorNameSlice);
  const { AllVariantColorData, isLoading } = useSelector((state: RootState) => state.VariantColorSlice);

  const dispatch = useDispatch<AppDispatch>();

  const usersPerPage = 5;
  const paginatedUsers = AllVariantColorData.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  // Filter data based on selections
  const filteredSubCategories = SubCategoriesData?.filter(
    (subCat) => subCat.category?.id === parseInt(formData.category)
  ) || [];


  const filteredModalNumbers = MobileNumberData || [];

  const filteredVariants = AllVariantData || [];

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "category") {
      setFormData({
        category: value,
        subCategory: "",
        brand: "",
        modalNumber: "",
      });
      setVariantId("");
      setVariantColorData({
        id: 0,
        colorName: { id: 0, color: "", colorCode: "", is_deleted: false },
        modalImages: { id: 0, imageName: "", is_deleted: false }
      });
      setSelectedFiles([]);
    }

    else if (name === "subCategory") {
      setFormData(prev => ({
        ...prev,
        subCategory: value,
        brand: "",
        modalNumber: "",
      }));
      setVariantId("");
      setVariantColorData({
        id: 0,
        colorName: { id: 0, color: "", colorCode: "", is_deleted: false },
        modalImages: { id: 0, imageName: "", is_deleted: false }
      });
      setSelectedFiles([]);
    }

    else if (name === "brand") {
      setFormData(prev => ({
        ...prev,
        brand: value,
        modalNumber: "",
      }));
      setVariantId("");
      setVariantColorData({
        id: 0,
        colorName: { id: 0, color: "", colorCode: "", is_deleted: false },
        modalImages: { id: 0, imageName: "", is_deleted: false }
      });
      setSelectedFiles([]);

          if (value) {
      // Fetch modal numbers by subCategory ID
      const subCategoryId = formData.subCategory ? parseInt(formData.subCategory) : 0;
      dispatch(FetchModalBySubCategory(subCategoryId) as any);
    }
    }

    else if (name === "modalNumber") {
      setFormData(prev => ({
        ...prev,
        modalNumber: value,
      }));
      setVariantId("");
      setVariantColorData({
        id: 0,
        colorName: { id: 0, color: "", colorCode: "", is_deleted: false },
        modalImages: { id: 0, imageName: "", is_deleted: false }
      });
      setSelectedFiles([]);

      if (value) {
        dispatch(FetchVariantByModalId(parseInt(value)) as any);
      }
    }

    else if (name === "variantId") {
      setVariantId(value);
      setVariantColorData(prev => ({
        ...prev,
        colorName: {
          id: 0,
          color: "",
          colorCode: "",
          is_deleted: false
        }
      }));
      setSelectedFiles([]);
    }


    else if (name === "colorId") {
      const selectedColor = colorData.find(color => color.id === parseInt(value));

      setVariantColorData(prev => ({
        ...prev,
        colorName: {
          id: parseInt(value),
          color: selectedColor?.color || "",         
          colorCode: selectedColor?.colorCode || "",   
          is_deleted: false
        }
      }));
      console.log("Selected color:", selectedColor);
    }
  };
 
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log("🔍 File input change triggered");
    console.log("📁 Raw files from input:", files);
    console.log("📊 Files count:", files?.length || 0);

    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      console.log("📋 File array created:", fileArray);
      console.log("📏 File array length:", fileArray.length);

      // Enhanced file validation
      const validFiles = fileArray.filter(file => {
        const isValidType = file.type.startsWith('image/');
        const isValidSize = file.size > 0 && file.size < 10 * 1024 * 1024; // 10MB limit

        console.log(`File validation for ${file.name}:`, {
          name: file.name,
          size: file.size,
          type: file.type,
          isValidType,
          isValidSize,
          isValid: isValidType && isValidSize
        });

        return isValidType && isValidSize;
      });

      if (validFiles.length === 0) {
        alert("Please select valid image files (max 10MB each)");
        setSelectedFiles([]);
        return;
      }

      if (validFiles.length !== fileArray.length) {
        alert(`${fileArray.length - validFiles.length} file(s) were rejected. Only valid images under 10MB are accepted.`);
      }

      console.log("✅ Valid files:", validFiles);
      setSelectedFiles(validFiles);

      // Test FormData creation immediately
      console.log("🧪 Testing FormData creation with selected files:");
      const testFormData = new FormData();
      validFiles.forEach((file, index) => {
        testFormData.append('testFiles', file);
        console.log(`✅ Test file ${index} added:`, file.name);
      });

      // Verify test FormData
      let testFileCount = 0;
      for (let [key, value] of testFormData.entries()) {
        if (key === 'testFiles') {
          testFileCount++;
          console.log(`🧪 Test file ${testFileCount}:`, value.name, value.size);
        }
      }
      console.log(`🧪 Test FormData contains ${testFileCount} files`);

    } else {
      console.log("❌ No files selected");
      setSelectedFiles([]);
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
  };


  const handleSave = () => {
    // 🛑 Validation
    if (!formData.category) return alert("Please select a category.");
    if (!formData.subCategory) return alert("Please select a sub-category.");
    if (!formData.brand) return alert("Please select a brand.");
    if (!formData.modalNumber) return alert("Please select a modal number.");
    if (!variantId) return alert("Please select a variant.");
    if (!variantColorData.colorName.id) return alert("Please select a color.");
    if (selectedFiles.length === 0) return alert("Please upload at least one image.");

    setShowConfirmModal(true);

  }




  // ✅ FIXED handleSave function
  const handleConfirmSave = async () => {
    try {
      console.log("🚀 Starting form submission...");
      console.log("📁 Selected Files before processing:", selectedFiles);

      // ✅ Get the complete color data from colorData array
      const selectedColor = colorData.find(color => color.id === variantColorData.colorName.id);

      if (!selectedColor) {
        alert("Selected color not found!");
        return;
      }

      console.log("Selected Color Data:", selectedColor);

      // 📦 Create FormData
      const apiFormData = new FormData();

      // ✅ CRITICAL FIX 1: Use correct parameter name as expected by API
      apiFormData.append("varaintId", variantId); // Note: "varaintId" (with 'a') as per your API
      console.log("✅ VariantId:", variantId);

      // ✅ CRITICAL FIX 2: Add files with proper validation
      console.log("📁 Processing files...");
      console.log("Files array length:", selectedFiles.length);

      if (selectedFiles && selectedFiles.length > 0) {
        selectedFiles.forEach((file, index) => {
          console.log(`📎 Processing file ${index}:`, {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified
          });

          // ✅ Add files with correct key name
          apiFormData.append('files', file);
          console.log(`✅ File ${index} added to FormData`);
        });
      } else {
        console.error("❌ No files found!");
        alert("No files selected!");
        return;
      }

      // ✅ CRITICAL FIX 3: Use correct JSON key name as expected by API
      const modalColorString = JSON.stringify({
        id: 0,
        colorName: {
          id: selectedColor.id,
          color: selectedColor.color,
          colorCode: selectedColor.colorCode,
          is_deleted: false
        },
        modalImages: selectedFiles.map((file, idx) => ({
          id: idx,
          imageName: file.name,
          is_deleted: false
        }))
      });

      // ✅ Use correct key name: "modalColorString" not "VariantColorDataString"
      apiFormData.append('modalColorString', modalColorString);
      console.log("✅ modalColorString:", modalColorString);

      // ✅ Debug FormData contents
      console.log("🔍 FormData verification:");

      let fileCount = 0;
      let otherEntries = [];

      for (let [key, value] of apiFormData.entries()) {
        if (key === 'files') {
          fileCount++;
          console.log(`📁 File ${fileCount}:`, {
            key: key,
            name: value.name,
            size: value.size,
            type: value.type
          });
        } else {
          otherEntries.push({ key, value });
          console.log(`📝 ${key}:`, value);
        }
      }

      console.log(`✅ Total files in FormData: ${fileCount}`);
      console.log(`✅ Other entries: ${otherEntries.length}`);

      if (fileCount === 0) {
        console.error("❌ NO FILES FOUND IN FORMDATA!");
        alert("Error: Files were not properly added to FormData");
        return;
      }

      // 🚀 Dispatch the action
      console.log("🚀 Sending request to server...");
      const result = await dispatch(CreateVariantColor(apiFormData));
      console.log("📡 API Result:", result);

      setShowConfirmModal(false);

      // ✅ Handle response
      if (CreateVariantColor.fulfilled.match(result)) {
        console.log("✅ Variant color created successfully:", result.payload);
        toast.success("Variant color added successfully!")

        // Reset all states
        setFormData({
          category: "",
          subCategory: "",
          brand: "",
          modalNumber: ""
        });
        setVariantId("");
        setVariantColorData({
          id: 0,
          colorName: {
            id: 0,
            color: "",
            colorCode: "",
            is_deleted: false
          },
          modalImages: {
            id: 0,
            imageName: "",
            is_deleted: false
          }
        });
        setSelectedFiles([]);
        setShowModal(false);
        setCurrentPage(1);
      } else {
        console.error("❌ API Error:", result.payload);
        toast.error(result.payload?.message || "Failed to Create Variant-color")
      }

    } catch (error) {
      console.error("❌ Error submitting variant color:", error);
      setShowConfirmModal(false);
      toast.error("Error Creating Variant-Color Faild")
    }
  };



  const handleEditUser = (userId: number) => {
    console.log(`Edit user with ID: ${userId}`);
  };

  const handleDeleteUser = (userId: number) => {
    console.log(`Delete user with ID: ${userId}`);
  };

  // Animation for table rows
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    dispatch(GetAllCategory());
    dispatch(GetAllSubCategory());
    dispatch(GetAllBrand());
    dispatch(GetAllColors());
  }, [dispatch]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="md:overflow-y-hidden overflow-x-hidden">
        <div className="mt-10 flex items-center justify-between">
          <h1 className="font-bold text-2xl">Variant Color</h1>
          <button
            onClick={() => setShowModal(true)}
            className={SubmitButtonClass}
          >
            Add
          </button>
        </div>

        <div className="bg-gray-50 p-4 mt-2 min-h-screen">
          <div className="max-w-6xl mx-auto bg-white rounded-lg shadow overflow-hidden">
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                {/* Table Header */}
                <thead className="bg-white">
                  <tr>
                    <th scope="col" className={TableHadeClass}>ID</th>
                    <th scope="col" className={TableHadeClass}>Color</th>
                    <th scope="col" className={TableHadeClass}>ColorCode</th>
                    <th scope="col" className={TableHadeClass}>Image_Name</th>
                    <th scope="col" className={TableHadeClass}>Edit</th>
                    <th scope="col" className={TableHadeClass}>Delete</th>
                  </tr>
                </thead>
                {/* Table Body */}
                <tbody className="bg-white divide-y divide-gray-200">
                  
                  {paginatedUsers.map((user, index) => {
                    let modalData = user.modalColorString;

                    // ✅ Parse if it's a string
                    if (typeof modalData === "string") {
                      try {
                        modalData = JSON.parse(modalData);
                      } catch (err) {
                        console.warn("Invalid JSON in modalColorString", err);
                        modalData = {};
                      }
                    }

                    return (
                      <tr
                        key={user.id}
                        className={`transform transition-all duration-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                          } ${hoveredRow === user.id ? 'bg-gray-50' : 'bg-white'}`}
                        style={{ transitionDelay: `${index * 100}ms` }}
                        onMouseEnter={() => setHoveredRow(user.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                      >
                        {/* ✅ Color ID */}
                        <td className={TableDataClass}>{modalData?.id || "N/A"}</td>

                        {/* ✅ Color Name */}
                        <td className={TableDataClass}>
                          <div className="text-sm font-medium text-gray-600">
                            {modalData?.colorName?.color || "N/A"}
                          </div>
                        </td>

                        {/* ✅ Color Code */}
                        <td className={TableDataClass}>
                          <div className="text-sm font-medium text-gray-600">
                            {modalData?.colorName?.colorCode || "N/A"}
                          </div>
                        </td>

                        {/* ✅ First Image Name */}
                        <td className={TableDataClass}>
                          <div className="text-sm font-medium text-gray-600">
                            {modalData?.modalImages?.[0]?.imageName || "No image"}
                          </div>
                        </td>

                        {/* ✅ Edit Button */}
                        <td className={TableDataClass}>
                          <button
                            onClick={() => handleEditUser(user)}
                            className={EditClass}
                          >
                           {EditIcon}
                          </button>
                        </td>

                        {/* ✅ Delete Button */}
                        <td className={TableDataClass}>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className={DeleteClass}
                          >
                           {DeleteIcon}
                          </button>
                        </td>
                      </tr>
                    );
                  })}



                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalCount={AllVariantColorData?.length}
              itemsPerPage={usersPerPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>

      {showModal && (
        <div className={ShowModalMainClass}>
          <div className="bg-white rounded-2xl shadow-xl p-8 w-[90%] max-w-4xl relative max-h-[90vh] overflow-y-auto">

            {/* Close Icon */}
            <button
              className="absolute top-4 right-5 text-2xl font-bold text-gray-500 hover:text-black"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>

            {/* Title */}
            <h2 className="text-3xl font-semibold text-center mb-6">Add Variant Color</h2>

            {/* Dropdowns */}
            <div className="space-y-6">
              <div>
                <label className="block font-medium mb-2">Select Category</label>
                <select
                  className={SelectClass}
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="">Select Category</option>
                  {categoryData.map((item) => (
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
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleInputChange}
                  disabled={!formData.category}
                >
                  <option value="">Select Sub Category</option>
                  {filteredSubCategories?.map((item) => (
                    <option key={item?.id} value={item?.id}>
                      {item?.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-2">Select Brand</label>
                <select
                  className={SelectClass}
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  disabled={!formData.subCategory}
                >
                  <option value="">Select Brand</option>
                  {BrandData?.map((item) => (
                    <option key={item?.id} value={item?.id}>
                      {item?.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-2">Select Modal Number</label>
                <select
                  className={SelectClass}
                  name="modalNumber"
                  value={formData.modalNumber}
                  onChange={handleInputChange}
                  disabled={!formData.brand}
                >
                  <option value="">Select Modal Number</option>
                  {filteredModalNumbers?.map((item) => (
                    <option key={item?.id} value={item?.id}>
                      {item?.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-2">Select Variant</label>
                <select
                  className={SelectClass}
                  name="variantId"
                  value={variantId}
                  onChange={handleInputChange}
                  disabled={!formData.modalNumber}
                >
                  <option value="">Select Variant</option>
                  {filteredVariants?.map((item) => (
                    <option key={item?.id || item?.variantStringData?.id} value={item?.id || item?.variantStringData?.id}>
                      {item?.variantStringData?.ram || item?.ram || 'N/A'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-2">Select Variant Color</label>
                <select
                  className={SelectClass}
                  name="colorId"
                  value={variantColorData.colorName.id}
                  onChange={handleInputChange}
                  disabled={!variantId}
                >
                  <option value="">Select Color</option>
                  {colorData?.map((item) => (
                    <option key={item?.id} value={item?.id}>
                      {item?.color}
                    </option>
                  ))}
                </select>
              </div>
              </div>

              {/* File Upload Section */}
              {variantColorData.colorName.id > 0 && (
                <div className="mt-3" >
                  <label className="block font-medium mb-1">Upload Files</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    key={selectedFiles.length}
                    className="w-full border rounded-md px-4 py-[9px] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              )}
            

            {/* File Preview List */}
            {selectedFiles.length > 0 && (
              <div className="mb-6">
                <p className="font-medium mb-2">Selected Files ({selectedFiles.length}):</p>
                <ul className="space-y-2 max-h-32 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <li key={index} className="flex justify-between items-center bg-gray-100 rounded px-4 py-2">
                      <span className="truncate text-sm">
                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium ml-2"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className={ShowModelCloseButtonClass}
              >
                Close
              </button>
              <button
                onClick={handleSave}
                className={SubmitButtonClass}
                disabled={!variantColorData.colorName.id || selectedFiles.length === 0}
              >
                {isLoading ? "Saving..." : "Continue Variant-Color"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={showConfirmModal}
        title="Confirm Variant-Color Creation"
        message={
          `Are you sure want to create this variant-color with ${selectedFiles.length} image(s)?`
        }
        onConfirm={handleConfirmSave}
        onCancel={() => setShowConfirmModal(false)}
      />
    </>
  );
};

export default AddVarientColor;