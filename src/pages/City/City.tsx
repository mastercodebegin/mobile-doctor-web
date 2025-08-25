import React from 'react'
import { useEffect, useState } from 'react'
import ConfirmationModal from '../../components/ConfirmationModal';
import { ClearFilter, DeleteClass, DeleteIcon, EditClass, EditIcon, inputClass, ShowModalMainClass, ShowModelCloseButtonClass, SubmitButtonClass, TableDataClass, TableHadeClass } from '../../helper/ApplicationConstants';
import Pagination from '../../helper/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import Loading from '../../components/Loading';
import { toast } from 'react-toastify';
import { CreateCities, GetAllCities, GetCitiesByStateId, Remove, Restore, Update, UpdateCities } from './CitySlice';
import { GetStateByCountryId } from '../State/StateSlice';
import { GetAllCountries } from '../Country/CountrySlice';

const City = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null)

  const { countryData } = useSelector((state: RootState) => state.CountrySlice)
  const { stateData } = useSelector((state: RootState) => state.StateSlice)
  const { cityData, isLoading, Edit } = useSelector((state: RootState) => state.CitySlice)
  const [cityName, setCityName] = useState("");

  const dispatch = useDispatch<AppDispatch>()
  const usersPerPage = 5;
  const paginatedUsers = cityData.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;

    if (selectedValue === "") {
      setSelectedCountry(null);
      setSelectedState(null);
       dispatch(Restore());
      return;
    }

    const selectedObj = countryData.find(
      (item) => item.id.toString() === selectedValue
    );

    setSelectedCountry(selectedObj || null);
    setSelectedState(null);

    dispatch(GetStateByCountryId(selectedValue))
      .unwrap()
      .then((res: any) => {
        console.log("Country Response:", res);
      })
      .catch((err: any) => {
        console.log("State API Error:", err);
        toast.error("Failed to fetch States");
      });
  };

  const handleClearFilter = () =>{
    setSelectedCountry(null);
    setSelectedState(null);
    setCurrentPage(1);
    dispatch(GetAllCities())
  }

  const handleSaveClick = async () => {

    if (!cityName.trim()) {
      alert("Please enter a State name");
      return;
    }

    if (!selectedState) {
      alert("Please select a Country");
      return;
    }

    if (isEditMode && Edit.city?.id) {
      try {
        // Update local Edit state with new name & category
        dispatch(Update({
          ...Edit.city,
          name: cityName,
          states: selectedState
        }));

        dispatch(UpdateCities(Edit.city?.id))
          .unwrap()
          .then((res: any) => {
            dispatch(GetAllCities());
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
      name: cityName,
      states: {
        id: selectedState?.id,
        name: selectedState?.name,
        countries: {
          id: selectedState?.countries?.id,
          name: selectedState?.countries?.name,
          isoCode: selectedState?.countries?.isoCode
        }
      }
    }

    dispatch(CreateCities(newState))
      .unwrap()
      .then((res: any) => {
        dispatch(GetAllCities()).then(() => {
          toast.success(res.message || "State added successfully!");
          setCityName("")
          setShowModal(false);
          setShowConfirmModal(false);
          dispatch(Restore());
        });
      }).catch((err: any) => {
        toast.error("State creation failed: " + err);
        console.log("State creation failed: " + err)
      })
  }

  const handleCloseModal = () => {
    setShowModal(false);
    setCityName("");
    setSelectedCountry(null)
    setSelectedState(null)
    setIsEditMode(false);
    dispatch(Restore());
  };


  const handleEditUser = (user: any) => {
    if (!user.states || !user.states.countries) {
      toast.error("Cannot edit: State/Country data missing. Please refresh.");
      return;
    }

    // Dispatch Redux update object
    dispatch(Update(user));

    // Local state updates
    setCityName(user.name || "");
    setSelectedState(user.states);

    // Set country and fetch related states
    if (user.states.countries) {
      setSelectedCountry(user.states.countries);
      dispatch(GetStateByCountryId(user.states.countries.id))
        .unwrap()
        .then((res: any) => {
          console.log("States fetched for edit:", res);
        })
        .catch((err: any) => {
          console.log("Error fetching states for edit:", err);
          toast.error("Failed to fetch states");
        });
    }

    setIsEditMode(true);
    setShowModal(true);
  };

  const handleDeleteUser = (userId: number) => {
    console.log(`Delete user with ID: ${userId}`);
    dispatch(Remove(userId))
  };

  useEffect(() => {
    setIsLoaded(true);
    localStorage.setItem("city", JSON.stringify(stateData));
    dispatch(GetAllCountries());
    dispatch(GetAllCities());
  }, []);


  useEffect(() => {
    if (Edit?.isEdit && Edit?.city) {
      const { name, states } = Edit.city;
      setIsEditMode(true);
      setCityName(name || "");
      setSelectedState(states || "");
      setShowModal(true);
    }
  }, [Edit]);





  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <div className="md:overflow-y-hidden overflow-x-hidden">
        <div className="mt-10 flex items-center justify-between">

          {/* Left Section */}
          <div className="flex items-center gap-2">
           {/* State Selection - FIXED DROPDOWN */}
              <div className="mb-6">
                <select
                  value={selectedCountry?.id || ""}
                  onChange={handleCountryChange}
                  className={inputClass}
                >
                  <option value="">Filter Country</option>
                  {countryData.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item?.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* State Selection - FIXED DROPDOWN */}
            
                 <div className="mb-6">
    <select
      value={selectedState?.id || ""}
      onChange={(e) => {
        const stateId = e.target.value;
        const selected = stateData.find((cat) => cat.id.toString() === stateId);
        setSelectedState(selected || null);

        if (stateId) {
          dispatch(GetCitiesByStateId(stateId))
            .unwrap()
            .then((res: any) => {
              console.log("Cities fetched:", res);
              setSelectedCountry(null);
              setSelectedState([]); 
            })
            .catch((err: any) => {
              console.error("City API Error:", err);
              toast.error("Failed to fetch Cities");
            });
        }
      }}
      className={`${inputClass} disabled:bg-gray-100 disabled:cursor-not-allowed`}
      disabled={!selectedCountry}
    >
      <option value="">Filter State</option>
      {stateData.map((item) => (
        <option key={item.id} value={item.id}>
          {item?.name}
        </option>
      ))}
    </select>
  </div>

           <div className="mb-6">
             <button
              onClick={handleClearFilter}
              className={ClearFilter}
            >
              Clear Filter
            </button>
           </div>

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
                      State
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
                            if (user.states && user.states.name) {
                              return (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                  {user.states.name}
                                </span>
                              );
                            }

                            if (user.states && stateData.length > 0) {
                              const category = stateData.find(cat => cat.id === user.states.id);
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
                {isEditMode ? 'Edit City' : 'Add City'}
              </h2>

              {/* Close Icon */}
              <button
                className="absolute top-4 right-5 text-2xl font-bold text-gray-500 hover:text-black"
                onClick={handleCloseModal}
              >
                &times;
              </button>


              {/* State Selection - FIXED DROPDOWN */}
              <div className="mb-6">
                <label className="block text-lg font-medium mb-2">Select Country</label>
                <select
                  value={selectedCountry?.id || ""}
                  onChange={handleCountryChange}
                  className={inputClass}
                >
                  <option value="">Select...</option>
                  {countryData.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item?.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* State Selection - FIXED DROPDOWN */}
              {selectedCountry && (
                <div className="mb-6">
                  <label className="block text-lg font-medium mb-2">Select State</label>
                  <select
                    value={selectedState?.id || ""}
                    onChange={(e) => {
                      const categoryId = e.target.value;
                      const selected = stateData.find(cat => cat.id.toString() === categoryId);
                      setSelectedState(selected || null);
                    }}
                    className={inputClass}
                  >
                    <option value="">Select...</option>
                    {stateData.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item?.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}


              {/* State Name Input */}
              <div className="mb-6">
                <label className="block text-lg font-medium mb-2">City Name</label>
                <input
                  type="text"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  placeholder="Enter City Name"
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
                  {isLoading ? 'Saving...' : (isEditMode ? 'UPDATE' : 'SAVE CHANGE')}
                </button>
              </div>
            </div>
          </div>

          <ConfirmationModal
            isOpen={showConfirmModal}
            title="Confirm City Creation"
            message={`Are you sure you want to add the City "${cityName}"?`}
            onConfirm={handleConfirmSave}
            onCancel={() => setShowConfirmModal(false)}
          />
        </>
      )}
    </>
  )
}

export default City
