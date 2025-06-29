import { useEffect, useState } from "react"
import { DeleteClass, EditClass, inputClass, ShowModalMainClass, ShowModelCloseButtonClass, SubmitButtonClass, TableDataClass, TableHadeClass } from "../../helper/ApplicationConstants"
import { useDispatch, useSelector } from "react-redux"
import Loading from "../../components/Loading"
import ConfirmationModal from "../../components/ConfirmationModal"
import Pagination from "../../helper/Pagination"
import { RootState } from "../../redux/store"
import { CreateColor, GetAllColors, Remove, restore, Update, UpdateColorName } from "./ColorNameSlice"
import { toast } from "react-toastify"

const ColorName = () => {

const [showConfirmModal , setShowConfirmModal] = useState(false)

const {colorData , isLoading , Edit} = useSelector((state : RootState) => state.ColorNameSlice)

const dispatch = useDispatch()
const [showModal , setShowModal] = useState(false)
const [colorName, setColorName] = useState("")
const [colorCodeName, setColorCodeName] = useState("")
const [isEditMode , setIsEditMode] = useState(false)
const [currentPage , setCurrentPage] = useState(1);
const [hoveredRow, setHoveredRow] = useState<number | null>(null);
const usersPerPage = 5; // You can set 10 or any number you want
const paginatedUsers = colorData.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

const handleSaveClick = async () =>{
if(!colorCodeName.trim() || !colorCodeName.trim()){
    alert("Please Enter Full Details!!")
}

if(isEditMode && Edit.Color?.id){
    try {
        dispatch(Update({...Edit.Color, color: colorName, colorCode: colorCodeName}));

        dispatch(UpdateColorName(Edit.Color.id))
        .unwrap()
        .then((res : any) =>{
            console.log("Update Response :--", res);
            dispatch(GetAllColors());
            toast.success(res.message || "Color Name Updated Successfully!!");
            handleCloseModal();
        })
        .catch((err : any) =>{
            console.log("Update Failed :--", err);
            toast.error("Color Name Update Failed :---", err);
        })
    } catch (error) {
        toast.error("Failed To Update Color")
        console.log("Update Error :----", error)
    }
} else{
    setShowConfirmModal(true)
}

}

const handleCloseModal = () =>{
    setShowModal(false);
    setIsEditMode(false);
    setColorName("");
    setColorCodeName("");
    dispatch(restore(null))
}

const handleConfirmSave = () =>{
    const newColor = {
        color : colorName,
        colorCode : colorCodeName
    };
    dispatch(CreateColor(newColor))
    .unwrap()
    .then((res : any) =>{
        dispatch(GetAllColors());
        toast.success(res.message || "Color Name Added Successfully!!");
        setColorName("");
        setColorCodeName("");
        setShowModal(false);
        setShowConfirmModal(false);
        dispatch(restore(null));
    })
    .catch((err : any) =>{
        toast.error("Color Name Creation Failed :---", err)
    })
}

const handleEditUser = (user : User) =>{
    console.log("Edit User :--", user)
    dispatch(Update(user));
    setShowModal(true);
    setColorName(user.color);
    setColorCodeName(user.colorCode);
    // setIsEditMode(true);
}

const handleDeleteUser = async (id : string) =>{
    console.log("Delete user with ID :---", id)
    const confirmDelete = window.confirm("Are you sure you wnat to delete this color name");
    if(!confirmDelete) return;
    try {
        await dispatch(Remove(id));
        toast.success("Color Name Deleted Successfully!!");
    } catch (error : any) {
        console.log("Delete Error :--", error);
        toast.error("Failed To delete Color Name");
    }
}

 // Animation for table rows
  const [isLoaded, setIsLoaded] = useState(false);

  // Save to localStorage whenever data changes
  useEffect(() => {
    setIsLoaded(true);
    localStorage.setItem("colores", JSON.stringify(colorData));
    dispatch(GetAllColors())
  }, []);

  useEffect(() => {
    if(Edit.isEdit && Edit.Color){
        setIsEditMode(true);
        setColorName(Edit?.Color?.color || "");
        setColorCodeName(Edit?.Color?.colorCode || "");
        setShowModal(true);
    } else {
        setIsEditMode(false);
        setColorName("");
        setColorCodeName("");
    }
  }, [Edit]);


  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <div className="md:overflow-y-hidden overflow-x-hidden">
        <div className="mt-10 flex items-center justify-between">
            <h1 className="font-bold text-2xl">Color Name</h1>
            <button
            onClick={() => setShowModal(true)}
             className={SubmitButtonClass}>
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
                    <th scope="col" className={TableHadeClass}>
                      #
                    </th>
                    <th scope="col" className={TableHadeClass}>
                      Name
                    </th>
                    <th scope="col" className={TableHadeClass}>
                      Hexa-Code
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
                      key={user?.id || `${user?.color}-${index}`}
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
                        <div className="text-sm font-medium text-gray-600">{user?.color}</div>
                      </td>

                      {/* Hexa Code */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-600">{user?.colorCode}</div>
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
              totalCount={colorData.length}
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
              {isEditMode ? 'Edit Color Name' : 'Add Color Name'}
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
                {isEditMode ? 'Edit Color Name' : 'Add Color Name'}
              </label>
              <input
                type="text"
                value={colorName}
                onChange={(e) => setColorName(e.target.value)}
                placeholder={isEditMode ? "Edit Color Name" : "Add Color Name"}
                className={`${inputClass}`}
              />
            </div>


            {/* Input Field */}
            <div className="mb-6">
              <label className="block text-lg font-medium mb-2">
                {isEditMode ? 'Edit Color Code' : 'Add Color Code'}
              </label>
              <input
                type="text"
                value={colorCodeName}
                onChange={(e) => setColorCodeName(e.target.value)}
                placeholder={isEditMode ? "Edit Color Code" : "Add Color Code"}
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
        message={`Are you sure you want to add the category "${colorName}"?`}
        onConfirm={handleConfirmSave}
        onCancel={() => setShowConfirmModal(false)}
      />

    </>
  )
}

export default ColorName
