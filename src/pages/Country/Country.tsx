import { useEffect, useState } from "react"
import ConfirmationModal from "../../components/ConfirmationModal"
import { ClearFilter, DeleteClass, DeleteIcon, EditClass, EditIcon, inputClass, SearchIcon, ShowModalMainClass, ShowModelCloseButtonClass, SubmitButtonClass, TableDataClass, TableHadeClass } from "../../helper/ApplicationConstants"
import Pagination from "../../helper/Pagination"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../redux/store"
import Loading from "../../components/Loading"
import { toast } from "react-toastify"
import { CreateCountry, GetAllCountries, GetCountryById, Remove, restore, Update, UpdateCountry } from "./CountrySlice"
import { LocalStorageManager, STORAGE_KEYS } from "../../util/LocalStorageManager"

const Country = () => {
  const { countryData, isLoading, Edit } = useSelector((state: RootState) => state.CountrySlice)
  const dispatch = useDispatch<AppDispatch>()

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showModal, setShowModal] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false);;
  const [country, setCountry] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchById, setSearchById] = useState(false);
  const [filterNumber, setFilterNumber] = useState<any>('')
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const usersPerPage = 5;
  const roleArray = Array.isArray(countryData) ? countryData : countryData ? [countryData] : [];
  const paginatedUsers = roleArray?.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  const handleClearFilter = () => {
    setFilterNumber("");
    setCurrentPage(1);
    dispatch(GetAllCountries())
  }

  const handleSearchIconClick = () => {
    setShowModal(true);
    setSearchById(true)
  }

  const handleSaveClick = async () => {
    if (searchById) {
      // =================  SEARCH  =================
      if (!filterNumber.trim()) return;
      dispatch(GetCountryById(filterNumber));
      handleCloseModal();
      return;
    }

    if (!country.trim()) {
      alert("Please enter a country name");
      return;
    }

    if (isEditMode && Edit.country?.id) {
      try {

        dispatch(Update({ ...Edit.country, name: country }));

        dispatch(UpdateCountry(Edit.country.id))
          .unwrap()
          .then((res: any) => {
            console.log("Update response:", res);
            dispatch(GetAllCountries());

            toast.success(res.message || "country updated successfully!");
            // Reset form
            setShowModal(false);
            setCountry("");
            setIsEditMode(false);
            dispatch(restore(null));
          })
          .catch((err: any) => {
            console.error("Update failed:", err);
            toast.error("country update failed: " + err);
          })
      } catch (error) {
        toast.error("Failed to update country");
        console.error("Update error:", error);
      };

    } else {
      setShowConfirmModal(true)
    }
  };

  // Updated modal close handler
  const handleCloseModal = () => {
    setShowModal(false);
    setCountry("");
    setIsEditMode(false);
  };

  const handleConfirmSave = () => {
    const newCategory = {
      name: country,
    };
    dispatch(CreateCountry(newCategory))
      .unwrap()
      .then((res: any) => {
        dispatch(GetAllCountries());
        toast.success(res.message || "country added successfully!");
        setCountry("");
        setShowModal(false);
        setShowConfirmModal(false);
        dispatch(restore(null));
      })
      .catch((err: any) => {
        toast.error("country creation failed: " + err);
        console.log("country Creation Failed : " + err)
      });
  };

  const handleEditUser = (user: any) => {
    console.log(`Edit user:`, user);
    dispatch(Update(user));
    setShowModal(true);
    setCountry(user.name);
  };

  const handleDeleteUser = async (id: number) => {
    console.log(`Delete user with ID: ${id}`);

    const confirmDelete = window.confirm("Are you sure you want to delete this country?");
    if (!confirmDelete) return;

    try {
      console.log("Country Deleted :===", id)
      dispatch(Remove(id))
            toast.success("Country deleted successfully!");
    } catch (error) {
      console.error('Delete error:', error);
      toast.error("Failed to delete Country");
    }
  };

  useEffect(() => {
    if (Edit.isEdit && Edit.country) {
      setIsEditMode(true);
      setCountry(Edit?.country?.name || "");
      setShowModal(true);
    } else {
      setIsEditMode(false);
      setCountry("");
    }
  }, [Edit]);

  useEffect(() => {
    setIsLoaded(true);
    if (!LocalStorageManager.hasData(STORAGE_KEYS.COUNTRY)) {
        dispatch(GetAllCountries());
    }
    dispatch(GetAllCountries())    
  }, []);

    {isLoading && <Loading overlay={true} />}

  return (
    <>
    
      <div className="md:overflow-y-hidden overflow-x-hidden">
        <div className="mt-10 flex items-center justify-between">

          {/* Left Section */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={"p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-all"}
              onClick={handleSearchIconClick}
            >
              {SearchIcon}
            </button>

            <button
              onClick={handleClearFilter}
              className={ClearFilter}
            >
              Clear Filter
            </button>

          </div>

          {/* Add Button */}
          <div className="flex items-center gap-4">
            <button onClick={() => setShowModal(true)} className={SubmitButtonClass} >Add</button>
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
              totalCount={countryData.length}
              itemsPerPage={usersPerPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>

      {/* // Updated Modal JSX */}
      {showModal && (
  <>
        <div className={ShowModalMainClass}>
          <div className="bg-white rounded-2xl shadow-xl p-8 w-[90%] max-w-xl relative">
            <h2 className="text-3xl font-semibold text-center mb-6">
              {isEditMode ? 'Edit Country' : searchById ? 'Search Country' : 'Add Country'}
            </h2>

            {/* Close Icon */}
            <button
              className="absolute top-4 right-5 text-2xl font-bold text-gray-500 hover:text-black"
              onClick={handleCloseModal}
            >
              &times;
            </button>

            {searchById ? (
              <div className="mb-6">
                <label className="block text-lg font-medium mb-2">Country Id</label>
                <input
                  type="number"
                  value={filterNumber}
                  onChange={(e) => setFilterNumber(e.target.value)}
                  className={inputClass}
                  placeholder="Enter Country Id"
                />
              </div>
            ) : (
              <div className="mb-6">
                <label className="block text-lg font-medium mb-2">
                  {isEditMode ? 'Edit Country' : 'Add Country'}
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder={isEditMode ? "Edit Country" : "Add Country"}
                  className={`${inputClass}`}
                />
              </div>
            )}

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
        </div >

              {/* Confirmation Modal Function */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        title="Confirm Country Creation"
        message={`Are you sure you want to add the Country "${country}"?`}
        onConfirm={handleConfirmSave}
        onCancel={() => setShowConfirmModal(false)}
      />
  </>
      )}

          {isLoading && <Loading overlay={true} />}

    </>
  )
}

export default Country
