import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { CreateCategory, GetAllCategory, Remove, RemoveCategory, restore, Update, UpdateCategory } from "./AddCategorySlice";
import ConfirmationModal from "../../components/ConfirmationModal";
import { DeleteClass, EditClass, inputClass, ShowModalMainClass, ShowModelCloseButtonClass, SubmitButtonClass, TableDataClass, TableHadeClass } from "../../helper/ApplicationConstants";
import Loading from "../../components/Loading";
import Pagination from "../../helper/Pagination";
import { toast } from "react-toastify";

const AddCategory = () => {

  const [showConfirmModal, setShowConfirmModal] = useState(false); // new state

  const { data, isLoading, Edit } = useSelector((state: RootState) => state.AddCategorySlice)

  const dispatch = useDispatch<AppDispatch >()
  const [showModal, setShowModal] = useState(false)
  const [category, setCategory] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const usersPerPage = 5; // You can set 10 or any number you want
  const paginatedUsers = data.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  const handleSaveClick = async () => {
    if (!category.trim()) {
      alert("Please enter a category name");
      return;
    }

    if (isEditMode && Edit.category?.id) {
      try {

        // Update existing category
        // First update the edit state with new name
        dispatch(Update({ ...Edit.category, name: category }));

        dispatch(UpdateCategory(Edit.category.id))
          .unwrap()
          .then((res: any) => {
            // ✅ Update ke baad data fetch karo
            console.log("Update response:", res); // ✅ response data
            dispatch(GetAllCategory());

            // ✅ Success toast
            toast.success(res.message || "Category updated successfully!");
            // Reset form
            setShowModal(false);
            setCategory("");
            setIsEditMode(false);
            dispatch(restore(null)); // Clear edit state
          })
          .catch((err: any) => {
            // ❌ Error toast
            console.error("Update failed:", err); // ❌ error log
            // toast.error("Category update failed: " + err);
          })
      } catch (error) {
        // Error handling
        // toast.error("Failed to update category");
        console.error("Update error:", error);
      };

    } else {
    setShowConfirmModal(true)
    }
  };

  // Updated modal close handler
  const handleCloseModal = () => {
    setShowModal(false);
    setCategory("");
    setIsEditMode(false);
    dispatch(restore(null)); // Clear edit state when closing
  };

  const handleConfirmSave = () => {
    const newCategory = {
      name: category,
    };
    dispatch(CreateCategory(newCategory))
      .unwrap()
      .then((res: any) => {
        dispatch(GetAllCategory()); // ✅ Fetch updated list
        toast.success(res.message || "Category added successfully!");
        setCategory("");
        setShowModal(false);
        setShowConfirmModal(false);
        dispatch(restore(null));
      })
      .catch((err: any) => {
        // toast.error("Category creation failed: " + err);
        console.log("Category Creation Failed : " + err)
      });
  };


  const handleEditUser = (user: User) => { // Changed parameter type from number to User
    console.log(`Edit user:`, user);
    dispatch(Update(user)); // Set edit mode with user data
    setShowModal(true); // Open modal
    setCategory(user.name); // Pre-fill form with current name
  };

  const handleDeleteUser = async (id: string) => {
    console.log(`Delete user with ID: ${id}`);

    // Confirmation dialog add करें
    const confirmDelete = window.confirm("Are you sure you want to delete this category?");
    if (!confirmDelete) return;

    try {
      // केवल RemoveCategory dispatch करें
      await dispatch(RemoveCategory(id)).unwrap();
      dispatch(Remove(id))
      toast.success("Category deleted successfully!");
    } catch (error) {
      console.error('Delete error:', error);
      // toast.error("Failed to delete category");
    }
  };

  // Animation for table rows
  const [isLoaded, setIsLoaded] = useState(false);

  // Save to localStorage whenever data changes
  useEffect(() => {
    setIsLoaded(true);
    localStorage.setItem("categories", JSON.stringify(data));
    dispatch(GetAllCategory())
  }, []);


  useEffect(() => {
    if (Edit.isEdit && Edit.category) {
      setIsEditMode(true);
      setCategory(Edit?.category?.name || "");
      setShowModal(true);
    } else {
      setIsEditMode(false);
      setCategory("");
    }
  }, [Edit]);


  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <div className="md:overflow-y-hidden overflow-x-hidden">
        <div className="mt-10 flex items-center justify-between">
          <h1 className="font-bold text-2xl" >Category</h1>
          <button onClick={() => setShowModal(true)} className={SubmitButtonClass} >Add</button>
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
                      key={user?.id || `${user?.name}-${index}`}
                      className={`transform transition-all duration-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                        } ${hoveredRow === user?.id ? 'bg-gray-50' : 'bg-white'}`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                      onMouseEnter={() => setHoveredRow(user?.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td className={TableDataClass}>
                        {user.id}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-600">{user?.name}</div>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>


            {/* Reusable Pagination Component */}
            <Pagination
              currentPage={currentPage}
              totalCount={data.length}
              itemsPerPage={usersPerPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>

      {/* // Updated Modal JSX */}
      {showModal && (
        <div className={ShowModalMainClass}>
          <div className="bg-white rounded-2xl shadow-xl p-8 w-[90%] max-w-xl relative">
            <h2 className="text-3xl font-semibold text-center mb-6">
              {isEditMode ? 'Edit Category' : 'Add Category'}
            </h2>

            {/* Close Icon */}
            <button
              className="absolute top-4 right-5 text-2xl font-bold text-gray-500 hover:text-black"
              onClick={handleCloseModal}
            >
              &times;
            </button>

            {/* Input Field */}
            <div className="mb-6">
              <label className="block text-lg font-medium mb-2">
                {isEditMode ? 'Edit Category' : 'Add Category'}
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder={isEditMode ? "Edit Category" : "Add Category"}
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
                {isLoading ? 'Saving...' : (isEditMode ? 'UPDATE' : 'SAVE CHANGES')}
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Confirmation Modal Function */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        title="Confirm Category Creation"
        message={`Are you sure you want to add the category "${category}"?`}
        onConfirm={handleConfirmSave}
        onCancel={() => setShowConfirmModal(false)}
      />

    </>
  )
}

export default AddCategory



