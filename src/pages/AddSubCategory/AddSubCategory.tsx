import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import Loading from "../../components/Loading";
import { CreateSubCategory, GetAllSubCategory, Remove, restore, Update, UpdateSubCategory, } from "./SubCategorySlice";
import ConfirmationModal from "../../components/ConfirmationModal";
import { DeleteClass, DeleteIcon, EditClass, EditIcon, inputClass, ShowModalMainClass, ShowModelCloseButtonClass, SubmitButtonClass, TableDataClass, TableHadeClass } from "../../helper/ApplicationConstants";
import Pagination from "../../helper/Pagination";
import { toast } from "react-toastify";
import { GetAllCategory } from "../AddCategory/AddCategorySlice";

const AddSubCategory = () => {

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const { SubCategoriesData, isLoading, Edit } = useSelector((state: RootState) => state.SubCategorySlice)
  const { data } = useSelector((state: RootState) => state.AddCategorySlice)
  const [subCategoryName, setSubCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<{ id: string | number; name: string } | null>(null);

  const dispatch = useDispatch<AppDispatch>()
  const usersPerPage = 5; 
  const paginatedUsers = SubCategoriesData.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);


  const handleEditUser = (user: any) => {
    if (!user.category && user.category === null) {
      const categoryFromList = data.find((cat: any) => cat.id === user.categoryId);
      if (!categoryFromList) {
        toast.error("Cannot edit: Category data is missing. Please refresh the page.");
        return;
      }
      user.category = categoryFromList;
    }

    // Dispatch the Redux Update action
    dispatch(Update({
      id: user.id,
      name: user.name,
      category: user.category
    }));

    // Local states update
    setSubCategoryName(user.name || "");
    setSelectedCategory({
      id: user.category.id,
      name: user.category.name
    });
    setIsEditMode(true);
    setShowModal(true);
  };



  const handleDeleteUser = (userId: number) => {
    console.log(`Delete user with ID: ${userId}`);
    dispatch(Remove(userId))
  };

  const handleSaveClick = async () => {

    if (!subCategoryName.trim()) {
      alert("Please enter a sub-category name");
      return;
    }

    if (!selectedCategory) {
      alert("Please select a parent category");
      return;
    }

    if (isEditMode && Edit.subCategory?.id) {
      try {
        // Update local Edit state with new name & category
        dispatch(Update({
          ...Edit.subCategory,
          name: subCategoryName,
          category: selectedCategory
        }));

        dispatch(UpdateSubCategory(Edit.subCategory.id))
          .unwrap()
          .then((res: any) => {
            dispatch(GetAllSubCategory());
            toast.success(res.message || "Sub-category updated successfully!");
            handleCloseModal();
          })
          .catch((err: any) => {
            console.error("Update failed:", err);
            toast.error("Sub-category update failed: " + err);
          });
      } catch (error) {
        toast.error("Failed to update sub-category");
        console.error("Update error:", error);
      }
    } else {
      setShowConfirmModal(true)
    }
  }

  const handleConfirmSave = async () => {
    const newSubCategory = {
      name: subCategoryName,
      category: {
        id: selectedCategory?.id,
        name: selectedCategory?.name
      }
    }

    dispatch(CreateSubCategory(newSubCategory))
      .unwrap()
      .then((res: any) => {
        dispatch(GetAllSubCategory()).then(() => {
          toast.success(res.message || "Sub-category added successfully!");
          setSubCategoryName("")
          setShowModal(false);
          setShowConfirmModal(false);
          dispatch(restore());
        });
      }).catch((err: any) => {
        toast.error("Sub-category creation failed: " + err);
        console.log("Sub-Category creation failed: " + err)
      })
  }

  const handleCloseModal = () => {
    setShowModal(false);
    setSubCategoryName("");
    setSelectedCategory({ id: "", name: '' })
    setIsEditMode(false);
    dispatch(restore());
  };



  useEffect(() => {
    setIsLoaded(true);
    dispatch(GetAllSubCategory());
    dispatch(GetAllCategory());
  }, []);


  useEffect(() => {
    if (Edit.isEdit && Edit.subCategory) {
      const { name, category } = Edit.subCategory;
      setIsEditMode(true);
      setSubCategoryName(name || "");
      if (category && category.id) {
        setSelectedCategory({
          id: category.id.toString(),
          name: category.name
        });
      } else {
        setSelectedCategory(null);
      }
      setShowModal(true);
    }
  }, [Edit]);



    {isLoading && <Loading overlay={true} />}

  return (
    <>

      <div className="md:overflow-y-hidden overflow-x-hidden">
        <div className="mt-10 flex items-center justify-between">
          <h1 className="font-bold text-2xl" >Sub Category</h1>
          <button onClick={() => setShowModal(true)}
            className={SubmitButtonClass}
          > Add </button>
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
                      #
                    </th>
                    <th scope="col" className={TableHadeClass}>
                      Name
                    </th>
                    <th scope="col" className={TableHadeClass}>
                      Category
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
                  {paginatedUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className={`transform transition-all duration-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                        } ${hoveredRow === user.id ? 'bg-gray-50' : 'bg-white'}`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                      onMouseEnter={() => setHoveredRow(user.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >

                      {/* Id */}
                      <td className={TableDataClass}>
                        {user.id}
                      </td>

                      {/* Name */}
                      <td className={TableDataClass}>
                        <div className="text-sm font-medium text-gray-600">{user.name}</div>
                      </td>

                      <td className={TableDataClass}>
                        <div className="text-sm font-medium text-gray-600">
                          {(() => {
                            // Category object check
                            if (user.category && user.category.name) {
                              return (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                  {user.category.name}
                                </span>
                              );
                            }

                            if (user.categoryId && data.length > 0) {
                              const category = data.find(cat => cat.id === user.categoryId);
                              if (category) {
                                return (
                                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                    {category.name}
                                  </span>
                                );
                              }
                            }

                            // No category found
                            return (
                              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                                No Category
                              </span>
                            );
                          })()}
                        </div>
                      </td>

                      <td className={TableDataClass}>
                        <button
                          onClick={() => handleEditUser(user)}
                          className={EditClass}
                        >
                        {EditIcon}
                        </button>
                      </td>
                      <td className={TableDataClass}>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className={DeleteClass}
                        >
                        {DeleteIcon}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Reusable Pagination Component */}
            <Pagination
              currentPage={currentPage}
              totalCount={SubCategoriesData.length}
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
                {isEditMode ? 'Edit Sub Category' : 'Add Sub Category'}
              </h2>

              {/* Close Icon */}
              <button
                className="absolute top-4 right-5 text-2xl font-bold text-gray-500 hover:text-black"
                onClick={handleCloseModal}
              >
                &times;
              </button>

              {/* Category Selection - FIXED DROPDOWN */}
              <div className="mb-6">
                <label className="block text-lg font-medium mb-2">Select Category</label>
                <select
                  value={selectedCategory?.id || ""}
                  onChange={(e) => {
                    const categoryId = e.target.value;
                    const selected = data.find(cat => cat.id.toString() === categoryId);
                    setSelectedCategory(selected || null);
                  }}
                  className="border w-full p-3"
                >
                  <option value="">Select...</option>
                  {data.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item?.name}
                    </option>
                  ))}
                </select>
              </div>


              {/* Sub-Category Name Input */}
              <div className="mb-6">
                <label className="block text-lg font-medium mb-2">Sub-Category Name</label>
                <input
                  type="text"
                  value={subCategoryName}
                  onChange={(e) => setSubCategoryName(e.target.value)}
                  placeholder="Enter Sub-Category Name"
                  className={`${inputClass}`}
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
                  {isLoading ? 'Saving...' : (isEditMode ? 'UPDATE' : 'Continue')}
                </button>
              </div>
            </div>
          </div>

          <ConfirmationModal
            isOpen={showConfirmModal}
            title="Confirm Sub Category Creation"
            message={`Are you sure you want to add the sub-category "${subCategoryName}"?`}
            onConfirm={handleConfirmSave}
            onCancel={() => setShowConfirmModal(false)}
          />

                    {/* ADD this overlay loading at the end */}
    {isLoading && <Loading overlay={true} />}
        </>
      )}
    </>
  )
}

export default AddSubCategory