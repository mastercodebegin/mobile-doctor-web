import { useEffect, useState } from "react"
import { DeleteClass, DeleteIcon, EditClass, EditIcon, inputClass, ShowModalMainClass, ShowModelCloseButtonClass, SubmitButtonClass, TableDataClass, TableHadeClass } from "../../helper/ApplicationConstants"
import { useDispatch, useSelector } from "react-redux"
import Loading from "../../components/Loading"
import ConfirmationModal from "../../components/ConfirmationModal"
import Pagination from "../../helper/Pagination"
import { AppDispatch, RootState } from "../../redux/store"
import { CreateColor, GetAllColors, Remove, restore, Update, UpdateColorName } from "./ColorNameSlice"
import { toast } from "react-toastify"

const ColorName = () => {

const [showConfirmModal , setShowConfirmModal] = useState(false)

const {colorData , isLoading , Edit} = useSelector((state : RootState) => state.ColorNameSlice)

const dispatch = useDispatch<AppDispatch>()
const [showModal , setShowModal] = useState(false)
const [colorName, setColorName] = useState("")
const [colorCodeName, setColorCodeName] = useState("")
const [isEditMode , setIsEditMode] = useState(false)
const [currentPage , setCurrentPage] = useState(1);
const [hoveredRow, setHoveredRow] = useState<number | null>(null);
const usersPerPage = 5; 
const paginatedUsers = colorData.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

const handleSaveClick = async () => {
    if (!colorCodeName.trim() || !colorName.trim()) {
        alert("Please Enter Full Details!!");
        return;
    }

    if (isEditMode && Edit.Color?.id) {
        try {
            const originalId = Edit.Color.id;
            
            const updateData = {
                id: originalId,
                color: colorName,
                colorCode: colorCodeName
            };
            
            dispatch(Update(updateData));
            
            const response = await dispatch(UpdateColorName(originalId)).unwrap();
            
            console.log("Update Response :--", response);
            toast.success("Color Name Updated Successfully!!");
            handleCloseModal();
            
            await dispatch(GetAllColors());
            
        } catch (error: any) {
            console.log("Update Error :----", error);
            toast.error("Color Name Update Failed");
        }
    } else {
        setShowConfirmModal(true);
    }
};

const handleCloseModal = () =>{
    setShowModal(false);
    setIsEditMode(false);
    setColorName("");
    setColorCodeName("");

}

const handleConfirmSave = () => {
  const newColor = {
    color: colorName,
    colorCode: colorCodeName
  };

  dispatch(CreateColor(newColor))
    .unwrap()
    .then(async (res: any) => {
      toast.success(res.message || "Color Name Added Successfully!!");

      await dispatch(GetAllColors());

      setColorName("");
      setColorCodeName("");
      setShowModal(false);
      setShowConfirmModal(false);
      dispatch(restore(null));
    })
    .catch((err: any) => {
      toast.error("Color Name Creation Failed" , err);
    });
};


const handleEditUser = (user : User) =>{
    console.log("Edit User :--", user)
    dispatch(Update(user));
    setShowModal(true);
    setColorName(user.color);
    setColorCodeName(user.colorCode);
    setIsEditMode(true); 
}

const handleDeleteUser = async (id : string) =>{
    console.log("Delete user with ID :---", id)
    const confirmDelete = window.confirm("Are you sure you want to delete this color name");
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
    if(colorData.length === 0) {
        dispatch(GetAllColors())
    }
  }, [dispatch]);

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

  // Save to localStorage whenever colorData changes
  useEffect(() => {
    if(colorData.length > 0) {
        localStorage.setItem("colores", JSON.stringify(colorData));
    }
  }, [colorData]);

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