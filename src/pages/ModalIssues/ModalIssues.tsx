import { useEffect, useState } from "react"
import { DeleteClass, EditClass, inputClass, ShowModalMainClass, ShowModelCloseButtonClass, SubmitButtonClass, TableDataClass, TableHadeClass } from "../../helper/ApplicationConstants"
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import Pagination from "../../helper/Pagination";
import ConfirmationModal from "../../components/ConfirmationModal";
import { CreateModalIssue, DeleteProductPart, GetAllModalIssues, GetAllProductPartsBySubCategory, resetEdit, Update, UpdateModalIssue } from "./ModalIssuesSlice";
import { AppDispatch, RootState } from "../../redux/store";
import { GetAllSubCategory, GetAllSubCategoryById } from "../AddSubCategory/SubCategorySlice";
import { GetAllCategory } from "../AddCategory/AddCategorySlice";

const ModalIssues = () => {

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [modalIssue, setModalIssue] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);
  const [filterSubCategory, setFilterSubCategory] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [filterCategory, setFilterCategory] = useState<any>(null);
  
  const dispatch = useDispatch<AppDispatch>();
  const { ModalIssuesData, isLoading, Edit } = useSelector((state: RootState) => state.ModalIssuesSlice)
  const {SubCategoriesData} = useSelector((state: RootState) => state.SubCategorySlice)
  const {data} = useSelector((state: RootState) => state.AddCategorySlice)

  const usersPerPage = 5;
  
  // Use ModalIssuesData for pagination (API will return filtered data)
  const paginatedUsers = ModalIssuesData.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  // Filter Category Change - Top Left Filter
  const handleFilterCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    
    if (selectedValue === "") {
      setFilterCategory(null);
      setFilterSubCategory(null);
      setCurrentPage(1);
      dispatch(GetAllModalIssues());
      return;
    }

    const selectedCat = JSON.parse(selectedValue);
    setFilterCategory(selectedCat);
    setFilterSubCategory(null);
    
    // API call to get subcategories by category ID
    dispatch(GetAllSubCategoryById(selectedCat.id))
      .unwrap()
      .then((res: any) => {
        console.log("Filter SubCategories Response:", res);
        setCurrentPage(1);
      })
      .catch((err: any) => {
        console.log("Filter SubCategories API Error:", err);
        toast.error("Failed to fetch subcategories");
      });
  };

  // Filter SubCategory Change - Top Left Filter
  const handleFilterSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    
    if (selectedValue === "") {
      setFilterSubCategory(null);
      setCurrentPage(1);
      return;
    }

    const selectedSubCat = JSON.parse(selectedValue);
    setFilterSubCategory(selectedSubCat);
    
    // API call to fetch modal issues by subcategory
    dispatch(GetAllProductPartsBySubCategory(selectedSubCat.id))
      .unwrap()
      .then((res: any) => {
        console.log("Filtered Data Response:", res);
        setCurrentPage(1);
      })
      .catch((err: any) => {
        console.log("Filter API Error:", err);
        toast.error("Failed to fetch filtered data");
      });
  };

  // Clear filter function
  const handleClearFilter = () => {
    setFilterCategory(null);
    setFilterSubCategory(null);
    setCurrentPage(1);
    dispatch(GetAllModalIssues());
  };

  // Modal Category Change Handler
  const handleModalCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    
    if (selectedValue === "") {
      setSelectedCategory(null);
      setSelectedSubCategory(null);
      return;
    }

    const selectedCat = JSON.parse(selectedValue);
    setSelectedCategory(selectedCat);
    setSelectedSubCategory(null); 
    
    dispatch(GetAllSubCategoryById(selectedCat.id))
      .unwrap()
      .then((res: any) => {
        console.log("Modal SubCategories Response:", res);
      })
      .catch((err: any) => {
        console.log("Modal SubCategories API Error:", err);
        toast.error("Failed to fetch subcategories");
      });
  };

  const handleSaveClick = () => {
    if (!modalIssue.trim()) {
      alert("Please Enter a Modal-Issue Name.");
      return;
    }
     if (!selectedSubCategory) {
      alert("Please select a Sub-Category.");
      return;
    }

    if (isEditMode && Edit?.modalIssue?.id) {
      try {
        // Update the edit state with new name
        dispatch(Update({ ...Edit.modalIssue, name: modalIssue, subCategory: selectedSubCategory }));

        dispatch(UpdateModalIssue(Edit.modalIssue.id))
          .unwrap()
          .then((res: any) => {
            console.log("Update Response :", res);
            toast.success(res.message || "Modal-Issue Updated Successfully");
            dispatch(GetAllModalIssues());
            handleCloseModal()
          })
          .catch((err: any) => {
            console.log("Update Failed :", err);
            toast.error("Modal-Issue Update Failed :" + err)
          })
      } catch (error: any) {
        toast.error("Failed To Update Modal-Issue");
        console.log("Update Error :--", error)
      }
    } else {
      setShowConfirmModal(true)
    }
  }

  const handleConfirmSave = () => {
    const newModalIssue = {
      name: modalIssue,
      subCategory: selectedSubCategory,
    }
    console.log(newModalIssue)
    dispatch(CreateModalIssue(newModalIssue))
      .unwrap()
      .then((res: any) => {
        setModalIssue("");
        setSelectedSubCategory(null);
        setSelectedCategory(null);
        setShowModal(false);
        setShowConfirmModal(false);
        toast.success(res.message || "Modal-Issue Added Successfully!");
        dispatch(resetEdit())
      })
      .catch((err: any) => {
        toast.error("Modal-Issue Creation Failed :" + err)
      })
  }

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditMode(false);
    setModalIssue("");
    setSelectedSubCategory(null);
    setSelectedCategory(null);
    dispatch(resetEdit())
  }

  const handleEditUser = (user: any) => {
    console.log("Edit user with ID :-", user);
    dispatch(Update(user))
    setShowModal(true);
    setModalIssue(user.name)
    setSelectedSubCategory(user.subCategory);
    
    // If editing, set the category and fetch subcategories
    if (user.subCategory?.category) {
      setSelectedCategory(user.subCategory.category);
      dispatch(GetAllSubCategoryById(user.subCategory.category.id))
        .unwrap()
        .then((res: any) => {
          console.log("Edit mode subcategories fetched", res);
        })
        .catch((err: any) => {
          console.log("Error fetching subcategories for edit:", err);
        });
    }
  }

  const handleDeleteUser = (userId: number) => {
  console.log("Delete User with ID :-", userId);
  
  if (window.confirm("Are you sure you want to delete this Modal Issue?")) {
    dispatch(DeleteProductPart(userId.toString()))
      .unwrap()
      .then((res: any) => {
        console.log("Delete successful:", res);
        toast.success("Modal-Issue deleted successfully!");
        // Optional: Refresh data if needed
        // dispatch(GetAllModalIssues());
      })
      .catch((err: any) => {
        console.log("Delete Failed:", err);
        toast.error("Failed to delete Modal-Issue: " + err);
      });
  }
};

  // Animation for table rows and initial data fetch
  useEffect(() => {
    setIsLoaded(true);
    dispatch(GetAllModalIssues());
    dispatch(GetAllSubCategory());
    dispatch(GetAllCategory());
  }, [])

  // Sync data to localStorage whenever ModalIssuesData changes
  useEffect(() => {
    if (ModalIssuesData.length > 0) {
      localStorage.setItem('modal-issues', JSON.stringify(ModalIssuesData));
    }
  }, [ModalIssuesData])

  useEffect(() => {
    if (Edit?.isEdit && Edit?.modalIssue) {
      setIsEditMode(true);
      setModalIssue(Edit?.modalIssue?.name || "");
      setSelectedSubCategory(Edit.modalIssue.subCategory)
      setShowModal(true)
    } else {
      setIsEditMode(false);
      setModalIssue("");
      setSelectedSubCategory(null);
      setSelectedCategory(null);
    }
  }, [Edit])

  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <div className="md:overflow-y-hidden overflow-x-hidden">
        <div className="mt-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Category Filter */}
            <select
              value={filterCategory ? JSON.stringify(filterCategory) : ""}
              onChange={handleFilterCategoryChange}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Filter by Category</option>
              {data?.map((category) => (
                <option key={category.id} value={JSON.stringify(category)}>
                  {category.name} 
                </option>
              ))}
            </select>
            
            {/* SubCategory Filter - Only show when category is selected */}
            {filterCategory && (
              <select
                value={filterSubCategory ? JSON.stringify(filterSubCategory) : ""}
                onChange={handleFilterSubCategoryChange}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Filter by SubCategory</option>
                {SubCategoriesData?.filter(subCat => subCat.category?.id === filterCategory?.id)?.map((subCat) => (
                  <option key={subCat.id} value={JSON.stringify(subCat)}>
                    {subCat.name}
                  </option>
                ))}
              </select>
            )}
              
            {(filterCategory || filterSubCategory) && (
              <button
                onClick={handleClearFilter}
                className="text-red-400 hover:text-red-600 text-sm bg-red-50 px-2 py-1 rounded"
              >
                Clear Filter
              </button>
            )}
          </div>
          
          {/* Add Button */}
          <div className="flex items-center gap-4">
            <button onClick={() => setShowModal(true)} className={SubmitButtonClass}>Add</button>
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
                    <th scope="col" className={TableHadeClass}>
                      ID
                    </th>
                    <th scope="col" className={TableHadeClass}>
                      Name
                    </th>
                    <th scope="col" className={TableHadeClass}>
                      SubCategory
                    </th>
                    <th scope="col" className={TableHadeClass}>
                      Edit
                    </th>
                    <th scope="col" className={TableHadeClass}>
                      Delete
                    </th>
                  </tr>
                </thead>
                {/* Table Body */}
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user, index) => (
                      <tr
                        key={user?.id || `${user.name}-${index}`}
                        className={`transform transition-all duration-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                          } ${hoveredRow === user.id ? 'bg-gray-50' : 'bg-white'}`}
                        style={{ transitionDelay: `${index * 100}ms` }}
                        onMouseEnter={() => setHoveredRow(user.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                      >
                        <td className={TableDataClass}>{user.id}</td>
                        <td className={TableDataClass}>{user.name}</td>
                        <td className={TableDataClass}>{user.subCategory?.name}</td>
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
                            onClick={() => handleDeleteUser(user.id)}
                            className={DeleteClass}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        {filterSubCategory ? 'No modal issues found for selected subcategory' : 'No modal issues found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Reusable Pagination Component */}
            <Pagination
              currentPage={currentPage}
              totalCount={ModalIssuesData.length}
              itemsPerPage={usersPerPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>

      {showModal && (
        <>
          <div className={ShowModalMainClass}>
            <div className="bg-white rounded-2xl shadow-xl p-8 w-[90%] max-w-xl relative">
              <h2 className="text-3xl font-semibold text-center mb-6">
                {isEditMode ? "Edit Modal Issue" : "Add Modal Issue"}
              </h2>

              {/* Close Icon */}
              <button
                className="absolute top-4 right-5 text-2xl font-bold text-gray-500 hover:text-black"
                onClick={handleCloseModal}
              >
                &times;
              </button>

       

              {/* Category Selection */}
              <div className="mb-6">
                <label className="block text-lg font-medium mb-2">Category</label>
                <select
                  value={selectedCategory ? JSON.stringify(selectedCategory) : ""}
                  onChange={handleModalCategoryChange}
                  className={inputClass}
                >
                  <option value="" disabled>Select Category</option>
                  {data?.map((category) => (
                    <option key={category.id} value={JSON.stringify(category)}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
             
              {/* SubCategory Selection - Only show when category is selected */}
              {selectedCategory && (
                <div className="mb-6">
                  <label className="block text-lg font-medium mb-2">SubCategory</label>
                  <select
                    value={selectedSubCategory ? JSON.stringify(selectedSubCategory) : ""}
                    onChange={(e) => {
                      const selectedObject = JSON.parse(e.target.value);
                      setSelectedSubCategory(selectedObject);
                    }}
                    className={inputClass}
                  >
                    <option value="" disabled>Select SubCategory</option>
                    {SubCategoriesData?.filter(subCat => subCat.category?.id === selectedCategory?.id)?.map((subCat) => (
                      <option key={subCat.id} value={JSON.stringify(subCat)}>
                        {subCat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

                     {/* Input Field */}
              <div className="mb-6">
                <label className="block text-lg font-medium mb-2">Modal-Issue Name</label>
                <input
                  type="text"
                  value={modalIssue}
                  onChange={(e) => setModalIssue(e.target.value)}
                  placeholder="Add Modal-Issue"
                  className={inputClass}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={handleCloseModal}
                  className={ShowModelCloseButtonClass}
                >
                  Close
                </button>
                <button
                  onClick={handleSaveClick}
                  className={SubmitButtonClass}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : (isEditMode ? 'UPDATE' : 'SAVE CHANGES')}
                </button>
              </div>
            </div>
          </div>

          <ConfirmationModal
            isOpen={showConfirmModal}
            title="Confirm Modal-Issue Creation"
            message={`Are you sure you want to add Modal-Issue "${modalIssue}"?`}
            onConfirm={handleConfirmSave}
            onCancel={() => setShowConfirmModal(false)}
          />
        </>
      )}
    </>
  )
}

export default ModalIssues