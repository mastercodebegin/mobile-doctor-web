import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import Loading from "../../components/Loading";
import { CreateBrand, GetAllBrand, Remove, restore, Update, UpdateBrand } from "./BrandSlice";
import ConfirmationModal from "../../components/ConfirmationModal";
import { DeleteClass, DeleteIcon, EditClass, EditIcon, inputClass, ShowModalMainClass, ShowModelCloseButtonClass, SubmitButtonClass, TableDataClass, TableHadeClass } from "../../helper/ApplicationConstants";
import Pagination from "../../helper/Pagination";
import { toast } from "react-toastify";

const AddBrand = () => {

  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const { BrandData, isLoading, Edit } = useSelector((state: RootState) => state.BrandSlice)

  const dispatch = useDispatch<AppDispatch>()
  const [showModal, setShowModal] = useState(false)
  const [category, setCategory] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const usersPerPage = 5;
  const paginatedUsers = BrandData?.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);


  const handleSaveClick = () => {
    if (!category.trim()) {
      toast.warn("Please enter a Brand name.");
      return;
    }

    if (isEditMode && Edit.brand?.id) {
      try {

        dispatch(Update({ ...Edit.brand, name: category }));

        dispatch(UpdateBrand(Edit.brand.id))
          .unwrap()
          .then((res: any) => {
            console.log("Update response:", res);
            dispatch(GetAllBrand());

            toast.success(res.message || "Brand updated successfully!");
            handleCloseModal()
          })
          .catch((err: any) => {
            console.error("Update failed:", err);
            toast.error("Brand update failed: " + err);
          })
      } catch (error) {
        toast.error("Failed to update Brand");
        console.error("Update error:", error);
      };

    } else {
      setShowConfirmModal(true);
    }

  }

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditMode(false)
    setCategory("")
    dispatch(restore(null))
  }

  const handleConfirmSave = () => {
    const newCategory = {
      name: category,
    }

    dispatch(CreateBrand(newCategory))
      .unwrap()
      .then((res: any) => {
        dispatch(GetAllBrand())
        setCategory("");
        setShowModal(false);
        setShowConfirmModal(false);
        toast.success(res.message || "Brand Added Successfully!!")
        dispatch(restore(null))
      })
      .catch((err: any) => {
        toast.error("Brand Creation Failed: " + err)
        console.log("Brand Creation Failed :" + err)
      })
  };

  const handleEditUser = (user: User) => {
    console.log(`Edit user with ID: ${user}`);
    dispatch(Update(user))
    setShowModal(true)
    setCategory(user.name)
  };

  const handleDeleteUser = (userId: number) => {
    console.log(`Delete user with ID: ${userId}`);
    dispatch(Remove(userId))
  };


  // Animation for table rows
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    dispatch(GetAllBrand())
  }, [])

  useEffect(() => {
    if (Edit.isEdit && Edit.brand) {
      setIsEditMode(true);
      setCategory(Edit?.brand?.name || "")
      setShowModal(true)
    } else {
      setIsEditMode(false);
      setCategory("")
    }
  }, [Edit]);

    {isLoading && <Loading overlay={true} />}

  return (
    <>

      <div className="md:overflow-y-hidden overflow-x-hidden">
        <div className="mt-10 flex items-center justify-between">
          <h1 className="font-bold text-2xl" >Brand</h1>
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
                      ID
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
                  {paginatedUsers?.length > 0 ? (
  paginatedUsers.map((user, index) => (

                    <tr
                      key={user?.id || `${user.name}-${index}`}
                      className={`transform transition-all duration-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                        } ${hoveredRow === user?.id ? 'bg-gray-50' : 'bg-white'}`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                      onMouseEnter={() => setHoveredRow(user?.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td className={TableDataClass}>
                        {user?.id}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-600">{user?.name}</div>
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
                          onClick={() => handleDeleteUser(user?.id)}
                          className={DeleteClass}
                        >
                         {DeleteIcon}
                        </button>
                      </td>
                    </tr>
                  ))
) : (
  <tr>
    <td colSpan={8} className="text-center py-4 text-gray-500">
      No Brand Found
    </td>
  </tr>
)}
                </tbody>
              </table>
            </div>

            {/* Reusable Pagination Component */}
            <Pagination
              currentPage={currentPage}
              totalCount={BrandData?.length}
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
              <h2 className="text-3xl font-semibold text-center mb-6">Add Brand</h2>

              {/* Close Icon */}
              <button
                className="absolute top-4 right-5 text-2xl font-bold text-gray-500 hover:text-black"
                onClick={handleCloseModal}
              >
                &times;
              </button>

              {/* Input Field */}
              <div className="mb-6">
                <label className="block text-lg font-medium mb-2">Brand Name</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Add Brand"
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
                  {isLoading ? 'Saving...' : (isEditMode ? 'UPDATE' : 'Continue')}
                </button>
              </div>
            </div>
          </div>

          <ConfirmationModal
            isOpen={showConfirmModal}
            title="Confirm Brand Creation"
            message={`Are you sure you want to add the category "${category}"?`}
            onConfirm={handleConfirmSave}
            onCancel={() => setShowConfirmModal(false)}
          />
        </>

      )}

                {/* ADD this overlay loading at the end */}
    {isLoading && <Loading overlay={true} />}

    </>
  )
}

export default AddBrand
