import { useEffect, useState } from 'react'
import ConfirmationModal from '../../components/ConfirmationModal';
import { ClearFilter, DeleteClass, DeleteIcon, DropDownClass, EditClass, EditIcon, inputClass, ShowModalMainClass, ShowModelCloseButtonClass, SubmitButtonClass, TableDataClass, TableHadeClass } from '../../helper/ApplicationConstants';
import Pagination from '../../helper/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import Loading from '../../components/Loading';
import { toast } from 'react-toastify';
import { CreateState, GetAllState, GetStateByCountryId, Remove, restore, Update, UpdateState } from './StateSlice';
import { GetAllCountries } from '../Country/CountrySlice';

const State = () => {
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState<{ id: string | number; name: string } | null>(null);
  const [filterCountry, setFilterCountry] = useState('')
  
    const { stateData, isLoading, Edit } = useSelector((state: RootState) => state.StateSlice)
    const { countryData } = useSelector((state: RootState) => state.CountrySlice)
    const [stateName, setStateName] = useState("");
  
    const dispatch = useDispatch<AppDispatch>()
    const usersPerPage = 5; 
    const paginatedUsers = stateData.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

    const handleFilterCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) =>{
const selectedValue = e.target.value; // dropdown se current value
  setFilterCountry(selectedValue);      // state update
  dispatch(GetStateByCountryId(selectedValue)); // yaha selectedValue bhejna hai, purana state nahi
};

const handleClearFilter = () =>{
  setFilterCountry("");
  setCurrentPage(1);
  dispatch(GetAllState())
}

      const handleSaveClick = async () => {
    
        if (!stateName.trim()) {
          alert("Please enter a State name");
          return;
        }
    
        if (!selectedCountry) {
          alert("Please select a Country");
          return;
        }
    
        if (isEditMode && Edit.state?.id) {
          try {
            // Update local Edit state with new name & category
            dispatch(Update({
              ...Edit.state,
              name: stateName,
              countries: selectedCountry
            }));
    
            dispatch(UpdateState(Edit.state?.id))
              .unwrap()
              .then((res: any) => {
                dispatch(GetAllState());
                toast.success(res.message || "State updated successfully!");
                handleCloseModal();
              })
              .catch((err: any) => {
                console.error("Update failed:", err);
                toast.error("State update failed: " + err);
              });
          } catch (error) {
            toast.error("Failed to update State");
            console.error("Update error:", error);
          }
        } else {
          setShowConfirmModal(true)
        }
      }
    
      const handleConfirmSave = async () => {
        const newState = {
          name: stateName,
          countries: {
            id: selectedCountry?.id,
            name: selectedCountry?.name
          }
        }
    
        dispatch(CreateState(newState))
          .unwrap()
          .then((res: any) => {
            dispatch(GetAllState()).then(() => {
              toast.success(res.message || "State added successfully!");
              setStateName("")
              setShowModal(false);
              setShowConfirmModal(false);
              dispatch(restore());
            });
          }).catch((err: any) => {
            toast.error("State creation failed: " + err);
            console.log("State creation failed: " + err)
          })
      }
    
      const handleCloseModal = () => {
        setShowModal(false);
        setStateName("");
        setSelectedCountry({ id: "", name: '' })
        setIsEditMode(false);
        dispatch(restore());
      };

        const handleEditUser = (user: any) => {
          if (!user.countries && user.countries === null) {
            const categoryFromList = countryData.find((cat: any) => cat.id === user.countries);
            if (!categoryFromList) {
              toast.error("Cannot edit: Country data is missing. Please refresh the page.");
              return;
            }
            user.countries = categoryFromList;
          }
      
          // Dispatch the Redux Update action
          dispatch(Update({
            id: user.id,
            name: user.name,
            countries: user.countries
          }));
      
          // Local states update
          setStateName(user.name || "");
          setSelectedCountry({
            id: user.countries.id,
            name: user.countries.name
          });
          setIsEditMode(true);
          setShowModal(true);
        };

      const handleDeleteUser = (userId: number) => {
        console.log(`Delete user with ID: ${userId}`);
        dispatch(Remove(userId))
      };
    
        useEffect(() => {
          setIsLoaded(true);
          dispatch(GetAllState());
          dispatch(GetAllCountries());
        }, []);
      
      
        useEffect(() => {
          if (Edit.isEdit && Edit.state) {
            const { name, countries } = Edit.state;
            setIsEditMode(true);
            setStateName(name || "");
            if (countries && countries.id) {
              setSelectedCountry({
                id: countries.id.toString(),
                name: countries.name
              });
            } else {
              setSelectedCountry(null);
            }
            setShowModal(true);
          }
        }, [Edit]);

    {isLoading && <Loading overlay={true} />}

  return (
    <>
         <div className="md:overflow-y-hidden overflow-x-hidden">
        <div className="mt-10 flex items-center justify-between">

                  {/* Left Section */}
              <div className="flex items-center gap-2">

                <select
                  value={filterCountry || ""}
                  onChange={handleFilterCountryChange}
                  className={DropDownClass}
                >
                  <option value="" disabled >Filter By Country</option>
                  {countryData.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item?.name}
                    </option>
                  ))}
                </select>

                  {filterCountry && (
                        <button
                              onClick={handleClearFilter}
                              className={ClearFilter}
                            >
                              Clear_Filter
                            </button>
                  )}
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
                      Country
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
                      onMouseEnter={() => setHoveredRow(user?.id)}
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
                            if (user.countries && user.countries.name) {
                              return (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                  {user.countries.name}
                                </span>
                              );
                            }

                            if (user.countries && countryData.length > 0) {
                              const category = countryData.find(cat => cat.id === user.countries.id);
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
                                No Country
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
              totalCount={stateData.length}
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
                {isEditMode ? 'Edit State' : 'Add State'}
              </h2>

              {/* Close Icon */}
              <button
                className="absolute top-4 right-5 text-2xl font-bold text-gray-500 hover:text-black"
                onClick={handleCloseModal}
              >
                &times;
              </button>


              {/* Country Selection - FIXED DROPDOWN */}
              <div className="mb-6">
                <label className="block text-lg font-medium mb-2">Select Country</label>
                <select
                  value={selectedCountry?.id || ""}
                  onChange={(e) => {
                    const categoryId = e.target.value;
                    const selected = countryData.find(cat => cat.id.toString() === categoryId);
                    setSelectedCountry(selected || null);
                  }}
                  className={DropDownClass}
                >
                  <option value="">Select...</option>
                  {countryData.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item?.name}
                    </option>
                  ))}
                </select>
              </div>


              {/* State Name Input */}
              <div className="mb-6">
                <label className="block text-lg font-medium mb-2">State Name</label>
                <input
                  type="text"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  placeholder="Enter State Name"
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
            title="Confirm State Creation"
            message={`Are you sure you want to add the State "${stateName}"?`}
            onConfirm={handleConfirmSave}
            onCancel={() => setShowConfirmModal(false)}
          />
        </>
      )}

          {isLoading && <Loading overlay={true} />}
          
    </>
  )
}

export default State
