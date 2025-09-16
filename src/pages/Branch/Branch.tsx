import { useDispatch, useSelector } from "react-redux";
import ConfirmationModal from "../../components/ConfirmationModal";
import Loading from "../../components/Loading";
import { DeleteClass, DeleteIcon, EditClass, EditIcon, inputClass, ShowModalMainClass, ShowModelCloseButtonClass, SubmitButtonClass, TableDataClass, TableHadeClass } from "../../helper/ApplicationConstants";
import Pagination from "../../helper/Pagination";
import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "../../redux/store";
import { CreateBranch, GetAllBranch, Remove, Restore, Update, UpdateBranch } from "./BranchSlice";
import { toast } from "react-toastify";
import { GetStateByCountryId } from "../State/StateSlice";
import { GetCitiesByStateId } from "../City/CitySlice";
import { GetAllCountries } from "../Country/CountrySlice";
import { GetAllVendors } from "../userManagement/VendorSlice";

const Branch = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [branchName, setBranchName] = useState("");

  const dispatch = useDispatch<AppDispatch>()
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null)
  const [selectedCity, setSelectedCity] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null);

  const { data } = useSelector((state: RootState) => state.VendorSlice)
  const { countryData } = useSelector((state: RootState) => state.CountrySlice)
  const { stateData } = useSelector((state: RootState) => state.StateSlice)
  const { cityData } = useSelector((state: RootState) => state.CitySlice)
  const { branchData, isLoading, Edit } = useSelector((state: RootState) => state.BranchSlice)

  const usersPerPage = 5;
  const paginatedUsers = branchData.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  // Updated handleCountryChange function
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;

    if (selectedValue === "") {
      setSelectedCountry(null);
      setSelectedState(null); // Clear state when country is cleared
      setSelectedCity(null);  // Clear city when country is cleared
      dispatch(Restore());
      return;
    }

    const selectedObj = countryData.find(
      (item) => item.id.toString() === selectedValue
    );

    setSelectedCountry(selectedObj || null);
    setSelectedState(null); // Clear state when country changes
    setSelectedCity(null);  // Clear city when country changes

    dispatch(GetStateByCountryId(selectedValue))
      .unwrap()
      .then((res: any) => {
        console.log("State Response:", res);
      })
      .catch((err: any) => {
        console.log("State API Error:", err);
        toast.error("Failed to fetch States");
      });
  };

  // Updated handleStateChange function  
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;

    if (selectedValue === "") {
      setSelectedState(null);
      setSelectedCity(null);
      return;
    }

    const selectedObj = stateData.find(
      (item) => item.id.toString() === selectedValue
    );

    setSelectedState(selectedObj || null);
    setSelectedCity(null); // Clear city when state changes

    dispatch(GetCitiesByStateId(selectedValue))
      .unwrap()
      .then((res: any) => {
        console.log("City Response:", res);
      })
      .catch((err: any) => {
        console.log("City API Error:", err);
        toast.error("Failed to fetch Cities");
      });
  };

  // Updated handleSaveClick function
  const handleSaveClick = async () => {
    if (!branchName.trim()) {
      toast.warn("Please enter Branch name");
      return;
    }

    if (!selectedCountry || !selectedState || !selectedCity || !selectedUser) {
      toast.warn("Please select all required fields");
      return;
    }

    if (isEditMode && Edit.branch?.id) {
      try {
        const updateData = {
          id: Edit.branch.id,
          address: branchName,
          countries: { id: selectedCountry.id },
          states: { id: selectedState.id },
          cities: { id: selectedCity.id },
          user: { id: selectedUser.id },
        };

        dispatch(Update(updateData));

        dispatch(UpdateBranch(updateData))
          .unwrap()
          .then((res: any) => {
            dispatch(GetAllBranch());
            toast.success(res.message || "Branch updated successfully!");
            handleCloseModal();
          })
          .catch((err: any) => {
            console.error("Update failed:", err);
            toast.error("Branch update failed: " + err);
          });
      } catch (error) {
        toast.error("Failed to update Branch");
        console.error("Update error:", error);
      }
    } else {
      setShowConfirmModal(true);
    }
  };

  // Updated handleConfirmSave function
  const handleConfirmSave = async () => {
    const newBranch = {
      address: branchName,
      countries: { id: selectedCountry.id },
      states: { id: selectedState.id },
      cities: { id: selectedCity.id },
      user: { id: selectedUser.id },
    };

    dispatch(CreateBranch(newBranch))
      .unwrap()
      .then((res: any) => {
        dispatch(GetAllBranch()).then(() => {
          toast.success(res.message || "Branch added successfully!");
          handleCloseModal();
        });
      })
      .catch((err: any) => {
        toast.error("Branch creation failed: " + err);
        console.log("Branch creation failed: " + err);
      });
  };

    const handleCloseModal = () => {
    setShowConfirmModal(false);
    setShowModal(false);
    setBranchName("");
    setSelectedUser(null);
    setSelectedCountry(null)
    setSelectedState(null)
    setSelectedCity(null)
    setIsEditMode(false);
    dispatch(Restore());
  };

  // Updated handleEditUser function
  const handleEditUser = (user: any) => {
    if (!user.states || !user.countries || !user.cities) {
      toast.error("Cannot edit: State/Country/Cities data missing. Please refresh.");
      return;
    }

    dispatch(Update(user));

    setBranchName(user.address || "");
    setSelectedUser(user.user || null);
    setSelectedCountry(user.countries || null);
    setSelectedState(user.states || null);
    setSelectedCity(user.cities || null);

    if (user.countries?.id) {
      dispatch(GetStateByCountryId(user.countries.id))
        .unwrap()
        .then((res: any) => {
          console.log("States fetched for edit:", res);

          if (user.states?.id) {
            dispatch(GetCitiesByStateId(user.states.id))
              .unwrap()
              .then((res: any) => {
                console.log("Cities fetched for edit:", res);
              })
              .catch((err: any) => {
                console.log("City fetch error during edit:", err);
                toast.error("Failed to fetch cities");
              });
          }
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
    dispatch(GetAllBranch());
    dispatch(GetAllCountries());
    dispatch(GetAllVendors())
  }, []);


  useEffect(() => {
    if (Edit?.isEdit && Edit?.branch) {
      const { address, states, countries, cities, user } = Edit.branch;

      setIsEditMode(true);
      setBranchName(address || "");
      setSelectedUser(user || null);
      setSelectedCountry(countries || null);
      setSelectedState(states || null);
      setSelectedCity(cities || null);

      if (countries?.id) {
        dispatch(GetStateByCountryId(countries?.id));

        if (states?.id) {
          dispatch(GetCitiesByStateId(states?.id));
        }
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
            <h1 className="font-bold text-2xl" >Branches</h1>
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
                      Email
                    </th>
                    <th scope="col" className={TableHadeClass}>
                      Mobile Number
                    </th>
                    <th scope="col" className={TableHadeClass}>
                      Address
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

                      {/* Email */}
                      <td className={TableDataClass}>
                        <div className="text-sm font-medium text-gray-600">{user?.user?.email ?? "--"}</div>
                      </td>

                      {/* Mobile Number */}
                      <td className={TableDataClass}>
                        <div className="text-sm font-medium text-gray-600">{user?.user?.mobile ?? "--"}</div>
                      </td>

                      {/* Address */}
                      <td className={TableDataClass}>
                        <div className="text-sm font-medium text-gray-600">{user?.address ?? "--"}</div>
                      </td>

                      <td className={TableDataClass}>
                        <div className="text-sm font-medium text-gray-600">
                          {(() => {
                            // Category object check
                            if (user?.states && user?.states?.name) {
                              return (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                  {user?.states?.name}
                                </span>
                              );
                            }

                            if (user?.states && stateData?.length > 0) {
                              const category = stateData.find(cat => cat?.id === user?.states?.id);
                              if (category) {
                                return (
                                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                    {category?.name}
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
              totalCount={branchData?.length}
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
                {isEditMode ? 'Edit Branch' : 'Add Branch'}
              </h2>

              {/* Close Icon */}
              <button
                className="absolute top-4 right-5 text-2xl font-bold text-gray-500 hover:text-black"
                onClick={handleCloseModal}
              >
                &times;
              </button>

              <div className="mb-6">
                <label className="block text-lg font-medium mb-2">Select User</label>
                <select
                  value={selectedUser?.id || ""}
                  onChange={(e) => {
                    const categoryId = e.target.value;
                    const selected = data.find(cat => cat.id.toString() === categoryId);
                    setSelectedUser(selected || null);
                  }}
                  className={inputClass}
                >
                  <option value="">Select...</option>
                  {data.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item?.role?.name}
                    </option>
                  ))}
                </select>
              </div>


              {/* Country Selection - FIXED DROPDOWN */}
              {selectedUser && (
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
              )}

              {/* State Selection - FIXED DROPDOWN */}
              {selectedCountry && (
                <div className="mb-6">
                  <label className="block text-lg font-medium mb-2">Select State</label>
                  <select
                    value={selectedState?.id || ""}
                    onChange={handleStateChange}
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

              {selectedState && (
                <div className="mb-6">
                  <label className="block text-lg font-medium mb-2">Select City</label>
                  <select
                    value={selectedCity?.id || ""}
                    onChange={(e) => {
                      const categoryId = e.target.value;
                      const selected = cityData.find(cat => cat.id.toString() === categoryId);
                      setSelectedCity(selected || null);
                    }}
                    className={inputClass}
                  >
                    <option value="">Select...</option>
                    {cityData.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item?.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}


              {/* Branch Address Name Input */}
              <div className="mb-6">
                <label className="block text-lg font-medium mb-2">Branch Address</label>
                <input
                  type="text"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  placeholder="Enter Branch Address"
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
            title="Confirm Branch Creation"
            message={`Are you sure you want to add this Branch "${branchName}"?`}
            onConfirm={handleConfirmSave}
            onCancel={() => setShowConfirmModal(false)}
          />
        </>
      )}

          {isLoading && <Loading overlay={true} />}
          
    </>
  )
}

export default Branch
