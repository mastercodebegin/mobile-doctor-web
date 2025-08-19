import { useEffect, useState } from 'react'
import Loading from '../../components/Loading'
import { GetAllCategory } from '../AddCategory/AddCategorySlice';
import { GetAllSubCategory } from '../AddSubCategory/SubCategorySlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { toast } from 'react-toastify';
import { EditClass, EditIcon, getStatusBadgeClass, inputClass, pageSize, SearchIcon, ShowModalMainClass, SubmitButtonClass, TableDataClass, TableHadeClass } from '../../helper/ApplicationConstants';
import Pagination from '../../helper/Pagination';
import { GetAllRepairUnitOrderByUserId, update, UpdateOrder } from './OrderSlice';
import DatePicker from '../../components/DatePicker';
import { UrlConstants } from '../../util/practice/UrlConstants';
import { getRequestMethodWithParam } from '../../util/CommonService';
import ConfirmationModal from '../../components/ConfirmationModal';

interface FilterObject {
  modalNumberId: number;
  userId: number;
  managerId: number;
  pickupPartnerId: number;
  engineerId: number;
  unitRepairStatus: string;
  fromDate: string;
  toDate: string;
  orderId: string;
}


const Order = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false)
  const [searchModel, setSearchModel] = useState(false);
  const { Orders, isLoading, Edit } = useSelector((state: RootState) => state.OrderSlice);
  const [showFilters, setShowFilters] = useState(true); 
  const [filterEmail, setFilterEmail] = useState<any>('')
  const [filterOrderId, setFilterOrderId] = useState('')
  const [managerId, setManagerId] = useState<number | null>(null);
  const [engineerId, setEngineerId] = useState<number | null>(null);
  const [pickupPartnerId, setPickupPartnerId] = useState<number | null>(null);

  const [unitRepairStatusEdit, setUnitRepairStatusEdit] = useState("PENDING");
const [description, setDescription] = useState("");
const [price, setPrice] = useState("");
const [orderCompletedOn, setOrderCompletedOn] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const [unitRepairStatus, setUnitRepairStatus] = useState<string>('');
  const [filterDate, setFilterDate] = useState({
    startDate: null,
    endDate: null
  });
  const usersPerPage = 5;
  const paginatedUsers = Orders?.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage)

  // Status options - Add more as needed
  const statusOptions = [
    'PENDING',
    'CANCELLED',
    'READY_TO_PICK',
    'PICKED_UP_BY_PARTNER',
    'PICKED_UP_BY_USER',
    'IN_SERVICE',
    'READY_TO_DISPATCH',
    'DISPATCHED',
    'DELIVERED',
    'COMPLETED',
  ];

  // Date change handler - यह function DatePicker से call होगा
  const handleDateChange = (newValue) => {
    console.log("Date changed:", newValue);
    setFilterDate(newValue);
  };

  const getAllUnitOrderCommonFunction = () => {
    const baseFilterObj = {
      pageSize: pageSize,
      pageNumber: 0,
    };

    const filterObj: FilterObject = {};

    // Add status filter if selected
    if (unitRepairStatus) {
      filterObj.unitRepairStatus = unitRepairStatus;
    }

    // Role filters
    if (managerId) {
      filterObj.managerId = managerId;
    } else if (engineerId) {
      filterObj.engineerId = engineerId;
    } else if (pickupPartnerId) {
      filterObj.pickupPartnerId = pickupPartnerId;
    }

    // Add Order Id filter
    if(filterOrderId) {
      filterObj.orderId = filterOrderId;
    }


    // Add date filter if selected
    if (filterDate?.startDate && filterDate?.endDate) {
      // Format dates to YYYY-MM-DD format for API
      const formatDateForAPI = (date) => {
        return date.toISOString().split('T')[0];
      };

      filterObj.fromDate = formatDateForAPI(filterDate.startDate);
      filterObj.toDate = formatDateForAPI(filterDate.endDate);

      console.log('Date filter applied:', {
        fromDate: filterObj.fromDate,
        toDate: filterObj.toDate
      });
    }

    // Combine base filters with additional filters
    const finalFilterObj = { ...baseFilterObj, ...filterObj };

    console.log('Final API call with filters:', finalFilterObj);
    dispatch(GetAllRepairUnitOrderByUserId(finalFilterObj)).then(() => {
      setShowConfirmModal(false)
    })
  };


  const handleSearchEmail = async (e: React.FormEvent) => {
    e.preventDefault()

const isUpdating = isEditMode && Edit?.order?.orderId;

    try {
      setLoading(true) 
     if(filterEmail && !filterOrderId) {
       const res = await getRequestMethodWithParam({ email: filterEmail }, UrlConstants.GET_USRE_BY_EMAIL);
      console.log(res)

      const roleName = res?.responseDetails?.role?.name?.toLowerCase();
      const userId = res?.responseDetails?.id;

      if (!roleName || !userId) return;

      if (roleName === "manager") {
        setManagerId(userId);
      } else if (roleName === "engineer") {
        setEngineerId(userId);
      } else if (roleName === "pickuppartner") {
        setPickupPartnerId(userId);
      } else {
      toast.warning(`Invalid role: ${roleName}. Please try again.`);
      setFilterEmail("");
      setLoading(false);
      setSearchModel(true); 
      return;
    }

    setShowConfirmModal(true);
    setSearchModel(false);
    setShowFilters(false);
      setFilterEmail("");

     }
// else if (filterOrderId && !filterEmail) {
//   try {
//    await getAllUnitOrderCommonFunction(); // Wait for API to fetch data
    
//     // Check if Orders is empty after API call
// setTimeout(() => {
//       if (!Orders.content || Orders.content.length < 0) {
//       toast.error("Invalid Order ID! Please enter a valid Order ID.");
//       setFilterOrderId(""); // Clear input field
//       setLoading(false);
//       setSearchModel(true); // Keep modal open
//       return; // Exit early
//     }
// }, 1000);


//   // If data is found, proceed normally
//     setSearchModel(false);
//     setFilterOrderId("");
//     setLoading(false);  
//   } catch (error) {
//     toast.error("Failed to fetch order. Please try again.");
//     setLoading(false);
//     setSearchModel(true); // Keep modal open on error
//   }
// }


else if (filterOrderId && !filterEmail) {
  try {
     await getAllUnitOrderCommonFunction(); // API call ka response

    if (Orders.length > 0) {
      // ✅ Valid case
      setSearchModel(false);  // modal band
      setFilterOrderId("");   // input clear
      setLoading(false);      // loader off
    } else {
      // ❌ Invalid case
      toast.error("Invalid Order ID! Please enter a valid Order ID.");
      setFilterOrderId("");   // input clear
      setLoading(false);
      setSearchModel(true);   // modal open
    }
  } catch (error) {
    toast.error("Failed to fetch order. Please try again.");
    setLoading(false);
    setSearchModel(true); // error hone par modal open
  }
}


 else if(isUpdating || isEditMode){
      if(!unitRepairStatus || !description || !price){
  toast.warn("Fill All Details!!")
};

  setShowFilters(false)
  console.log("✅ UPDATE FLOW");

  try {
    // FIXED: Create updated order object with current form values
    const updateOrder = {
      orderId: Edit.order.orderId,
      unitRepairStatus: unitRepairStatusEdit,
      price: price,
      defectDescriptionByEngineer: description, // FIXED: Use current description input value
      orderCompletedOn: orderCompletedOn || Edit.order.orderCompletedOn
    }

    // FIXED: Update Redux state with current form values before API call
    dispatch(update(updateOrder))

    const updateResult = await dispatch(UpdateOrder(updateOrder?.orderId)).unwrap();
    console.log("Update successful:", updateResult);
    await getAllUnitOrderCommonFunction();
    toast.success(updateResult.message || "Repair Cost Updated Successfully!");
    handleCloseModal();

  } catch (error: any) {
    console.error("Edit error:", error);
    toast.error("Order Update Failed: " + error.message || error);
  }
} else {
      toast.warning("Please fill only one field (Email OR Order Id)");
      setLoading(false)
    }
    } catch (error: any) {
      console.error("Error fetching user by email:", error);
      toast.error(error.message || "An error occurred");
    setLoading(false);
    setSearchModel(true); // Keep modal open on error
    }
  }
  

  const handleConfirmSave = () => {
    if (managerId || pickupPartnerId || engineerId) {
      getAllUnitOrderCommonFunction()
    }
    setShowFilters(false)
  }

  const handleCloseModal = () => {
    setShowConfirmModal(false);
    setIsEditMode(false);
    setLoading(false);
    setSearchModel(false);
    setShowFilters(true);
    setFilterEmail("");
    setFilterOrderId("");
    setManagerId(null);
    setEngineerId(null);
    setPickupPartnerId(null);
    setUnitRepairStatusEdit("");
    setDescription("");
    setPrice("");
    setOrderCompletedOn("");
    setUnitRepairStatus('');
  }

  const handleClearFilter = () => {
    setUnitRepairStatus('');
    setFilterDate({
      startDate: null,
      endDate: null
    });
    setManagerId(null);
    setEngineerId(null);
    setPickupPartnerId(null);
    setSearchModel(false);
    setFilterEmail("");
    setFilterOrderId("");
    setCurrentPage(1);

    getAllUnitOrderCommonFunction();
  };

const handleEditUser = (user) => {
  console.log("Edit User with User :--", user);

  dispatch(update(user));

  setIsEditMode(true);
  setShowFilters(false);
  setSearchModel(true);

  // Populate input fields with user data
  setUnitRepairStatusEdit(user?.order?.unitRepairStatus || "");
  setDescription(user?.order?.defectDescriptionByEngineer || "");
  setPrice(user?.order?.price || "");
  
  // FIXED: Use 'completedOn' from API response, not 'orderCompletedOn'
  const orderCompletedOn = user?.order?.completedOn ? new Date(user.order.completedOn).toISOString().split('T')[0] : "";
  setOrderCompletedOn(orderCompletedOn);
};

useEffect(() => {
  if (Edit.isEdit) {
    setDescription(Edit.order.defectDescriptionByEngineer);
    setPrice(Edit.order.price);
    setUnitRepairStatusEdit(Edit.order.unitRepairStatus);
  }
}, [Edit]);

  useEffect(() => {
    setIsLoaded(true);
    dispatch(GetAllCategory());
    dispatch(GetAllSubCategory());
    getAllUnitOrderCommonFunction()
  }, [])

  // Add this effect to handle status and date changes
  useEffect(() => {
    if (isLoaded) { // Only call after initial load
      getAllUnitOrderCommonFunction();
    }
  }, [unitRepairStatus, filterDate]);

  // Sync data to localStorage whenever Orders changes
  useEffect(() => {
    if (Orders.length > 0) {
      localStorage.setItem('orders', JSON.stringify(Orders));
    }
  }, [Orders])

  if (isLoading) {
    return <Loading />
  }


  return (
    <>

      <div className="md:overflow-y-hidden overflow-x-hidden" >

        <div className="mt-10 flex items-center justify-between px-8">

          {/* Left Section */}
       <div className='flex items-center justify-start gap-x-5'>
          <button title='Email' type='button' className={"p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-all"} onClick={() => {
            setSearchModel(true)
            }}>
            {SearchIcon}
          </button>
{(showFilters) && (
   <button
    onClick={handleClearFilter}
    className={`px-3 py-1.5 text-sm font-medium border rounded-md transition-all ${
      (showFilters)
        ? "text-red-500 border-red-500 hover:bg-red-600 hover:text-white cursor-pointer"
        : "text-gray-400 border-gray-300 cursor-not-allowed opacity-50"
    }`}
  >
    Clear Filter
  </button>
 )} 
       </div>


          {/* Middle Section */}
          <div className="flex items-center gap-4 ">
            <DatePicker
              value={filterDate}
              onChange={handleDateChange}
            />

            {(filterDate?.startDate || filterDate?.endDate) && (
              <button
                onClick={handleClearFilter}
                className="text-red-400 hover:text-red-600 text-sm bg-red-50 px-2 py-1 rounded"
              >
                Clear Date
              </button>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">

            {/* Status Filter - Only show when subcategory is selected */}
            <select
              value={unitRepairStatus}
              onChange={(e) => setUnitRepairStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Status</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.replace(/_/g, ' ')}
                </option>
              ))}
            </select>

            {(unitRepairStatus) && (
              <button
                onClick={handleClearFilter}
                className="text-red-400 hover:text-red-600 text-sm bg-red-50 px-2 py-1 rounded"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        <div className="bg-gray-50 p-4 mt-2 min-h-screen">
          <div className="max-w-6xl mx-auto bg-white rounded-lg shadow overflow-hidden">

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr>
                    <th scope="col" className={TableHadeClass}>Order ID</th>
                    <th scope="col" className={TableHadeClass}>Product Image</th>
                    <th scope="col" className={TableHadeClass}>Model Number</th>
                    <th scope="col" className={TableHadeClass}>Status</th>
                    <th scope="col" className={TableHadeClass}>Price</th>
                    <th scope="col" className={TableHadeClass}>Created</th>
                    <th scope="col" className={TableHadeClass}>Expected Delivery</th>
                    <th scope="col" className={TableHadeClass}>Description</th>
                    <th scope="col" className={TableHadeClass}>Edit</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers?.map((user, index) => (
                      <tr
                        key={user.id}
                        className={`transform transition-all duration-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                          } ${hoveredRow === user.id ? 'bg-gray-50' : 'bg-white'}`}
                        style={{ transitionDelay: `${index * 100}ms` }}
                        onMouseEnter={() => setHoveredRow(user.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                      >
                        {/* Order ID */}
                        <td className={TableDataClass}>{user.orderId}</td>

                        {/* Product Image */}
                        <td className={TableDataClass}>
                          <div className="flex items-center space-x-2">
                            <img
                              src={`http://34.131.155.169:8080/uploads/${user.repairUnitImages?.[0]?.imageName}`}
                              className="w-14 h-14 object-contain border border-gray-300 rounded-md"
                              alt="Product"
                            />
                            <span>
                              <h4 className="text-black">{user.productModelNumber?.name}</h4>
                              <p>{user.brand?.name}</p>
                            </span>
                          </div>
                        </td>

                        {/* Name */}
                        <td className={TableDataClass}>{user.productModelNumber?.name}</td>

                        {/* Status */}
                        <td className={TableDataClass}>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(user.unitRepairStatus)}`}>
                            {user.unitRepairStatus?.replace(/_/g, ' ')}
                          </span>
                        </td>

                        {/* Price */}
                        <td className={TableDataClass}>{user.price ? `₹${user.price}` : "N/A"}</td>

                        {/* Created */}
                        <td className={TableDataClass}>{user?.orderOn ? new Date(user?.orderOn).toLocaleDateString() : "N/A"}</td>

                        {/* Expected Delivery */}
                        <td className={TableDataClass}>{user?.deliveredOn ? new Date(user?.deliveredOn).toLocaleDateString() : "N/A"}</td>

                        {/* Description */}
                        <td className={TableDataClass}>{user?.defectDescriptionByEngineer || "N/A"}</td>
                        {/* Edit */}
                        <td className={TableDataClass}>
                          <button onClick={() => handleEditUser(user)} className={EditClass}>
                            {EditIcon}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        {unitRepairStatus ? `No orders found for status: ${unitRepairStatus.replace(/_/g, ' ')}` : 'No orders found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>


            </div>

            {/* Reusable Pagination Component */}
            <Pagination
              currentPage={currentPage}
              totalCount={Orders.length}
              itemsPerPage={usersPerPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>

      </div>

      {searchModel && (
        <>
          <div className={ShowModalMainClass}>
            <div className="bg-white rounded-2xl shadow-xl p-8 w-[90%] max-w-xl relative">
              {/* Close Icon */}
              <button
                className="absolute top-4 right-5 text-2xl font-bold text-gray-500 hover:text-black"
                onClick={handleCloseModal}
              >
                &times;
              </button>

             {showFilters && (
               <>
               {/* By Email */}
               <div className="mb-6">
                <label className="block text-lg font-medium mb-2">Enter Email</label>
                <input
                  type="email"
                  value={filterEmail}
                  onChange={(e) => setFilterEmail(e.target.value)}
                  className={`${inputClass} ${!!filterOrderId ? 'cursor-not-allowed opacity-50' : ''}`}
                  placeholder="Enter Email"
                  disabled={!!filterOrderId}
                />
              </div>

{/* By Order Id */}
                <div className="mb-6">
                <label className="block text-lg font-medium mb-2">Enter Order Id</label>
                <input
                  type="text"
                  value={filterOrderId}
                  onChange={(e) => setFilterOrderId(e.target.value)}
                  className={`${inputClass} ${!!filterEmail ? 'cursor-not-allowed opacity-50' : ''}`}
                  placeholder="Enter Order Id"
                  disabled={!!filterEmail}
                />
              </div>
              </>
             )}

 {/* ====== Create Fields ====== */}
      {isEditMode && (
        <>
          <div className="mb-6">
          <label className="block text-lg font-medium mb-2">Unit Repair Status</label>
         <select
  value={unitRepairStatusEdit}
  onChange={(e) => setUnitRepairStatusEdit(e.target.value)}
  className={inputClass}
>
  <option value="">Select Status</option>
  {statusOptions.map((status) => (
    <option key={status} value={status}>
      {status.replace(/_/g, ' ')}
    </option>
  ))}
</select>
        </div>

           <div className="mb-6">
          <label className="block text-lg font-medium mb-2">Order Completed On</label>
          <input
            type="date"
            value={orderCompletedOn}
            onChange={(e) => setOrderCompletedOn(e.target.value)}
            className={inputClass}
          />
        </div>    

        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClass}
            placeholder="Enter Description"
          />
        </div>

        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">Price</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={inputClass}
            placeholder="Enter Price"
          />
        </div>
        </>
      )}


              {/* ===== Action Buttons ===== */}
              <div className="flex justify-end space-x-4 mt-4">
                <button type="button" onClick={handleCloseModal} className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">
                  Close
                </button>
                <button
                  type="submit"
                  onClick={handleSearchEmail}
                  disabled={loading}
                  className={`${SubmitButtonClass} ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                    {loading
    ? "Processing..."
    : isEditMode 
    ? "Update Order"  
    : filterEmail
    ? "Search Email"
    : filterOrderId
    ? "Search Order Id"
    : "Search"}
                </button>
              </div>

            </div>
          </div>
        </>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <ConfirmationModal
          isOpen={showConfirmModal}
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmSave}
          title="Confirm Save"
          message={`Are you sure you want to send this ${filterEmail} `}
        />
      )}

    </>
  )
}

export default Order