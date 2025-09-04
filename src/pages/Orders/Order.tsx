import { useEffect, useState } from 'react'
import Loading from '../../components/Loading'
import { GetAllCategory } from '../AddCategory/AddCategorySlice';
import { GetAllSubCategory } from '../AddSubCategory/SubCategorySlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { toast } from 'react-toastify';
import { ClearFilter, EditClass, EditIcon, getStatusBadgeClass, inputClass, pageSize, SearchIcon, ShowModalMainClass, SubmitButtonClass, TableDataClass, TableHadeClass } from '../../helper/ApplicationConstants';
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
  const [showDetailsModel, setShowDetailsModel] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
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
  const OrderArray = Array.isArray(Orders) ? Orders : Orders ? [Orders] : [];
  const paginatedUsers = OrderArray?.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage)

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
    if (filterOrderId) {
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
      if (filterEmail && !filterOrderId) {
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
      else if (isUpdating || isEditMode) {
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
    handleCloseModal()
  }

  const handleCloseModal = () => {
    setShowConfirmModal(false);
    setIsEditMode(false);
    setLoading(false);
    setSearchModel(false);
    setShowDetailsModel(false);
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

  const handlePrintDetails = () => {
    const printContent = document.getElementById('order-details-print');
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Reload to restore event handlers
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
  // useEffect(() => {
  //   if (Orders.length > 0) {
  //     localStorage.setItem('orders', JSON.stringify(Orders));
  //   }
  // }, [Orders])

  if (isLoading) {
    return <Loading />
  }


  return (
    <>

      <div className="md:overflow-y-hidden overflow-x-hidden" >

        <div className="mt-10 flex items-center justify-start px-8">

          {/* Left Section */}
          <div className='flex items-center justify-start gap-x-50'>
            <button title='Email' type='button' className={"p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-all"} onClick={() => {
              setSearchModel(true)
            }}>
              {SearchIcon}
            </button>
          </div>


          {/* Middle Section */}
          <div className="flex items-center gap-4 ">
            <DatePicker
              value={filterDate}
              onChange={handleDateChange}
            />
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

            <button
              onClick={handleClearFilter}
              className={ClearFilter}
            >
              Clear Filter
            </button>
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
                    <th scope="col" className={TableHadeClass}>Details</th>
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

                        {/* Details */}
                        <td className={TableDataClass}>
                          <button
                            onClick={() => {
                              setSelectedOrderDetails(user);
                              setShowDetailsModel(true);
                            }}
                            className={EditClass}
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="py-4 mx-auto text-center text-gray-500">
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



{/* Option-1 */}
      {showDetailsModel && selectedOrderDetails && (
  <>
    <div className={ShowModalMainClass}>
      <div className="bg-white rounded-2xl shadow-xl p-8 w-[95%] max-w-4xl relative max-h-[90vh] overflow-y-auto">
        
        <button
          className="absolute top-4 right-5 text-2xl font-bold text-gray-500 hover:text-black z-10"
          onClick={handleCloseModal}
        >
          &times;
        </button>

        <div id="order-details-print">
          <h2 className="text-2xl font-bold mb-6 text-center">Order Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Order Information</h3>
              <p><span className="font-medium">Order ID:</span> {selectedOrderDetails.orderId}</p>
              <p><span className="font-medium">Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusBadgeClass(selectedOrderDetails.unitRepairStatus)}`}>
                  {selectedOrderDetails.unitRepairStatus?.replace(/_/g, ' ')}
                </span>
              </p>
              <p><span className="font-medium">Price:</span> {selectedOrderDetails.price ? `₹${selectedOrderDetails.price}` : "N/A"}</p>
              <p><span className="font-medium">IMEI Number:</span> {selectedOrderDetails.imeiNumber || "N/A"}</p>
              <p><span className="font-medium">Online Order:</span> {selectedOrderDetails.onlineOrder ? "Yes" : "No"}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Product Information</h3>
              <p><span className="font-medium">Brand:</span> {selectedOrderDetails.brand?.name}</p>
              <p><span className="font-medium">Model:</span> {selectedOrderDetails.productModelNumber?.name}</p>
              <p><span className="font-medium">Category:</span> {selectedOrderDetails.categories?.name}</p>
              <p><span className="font-medium">Sub Category:</span> {selectedOrderDetails.subCategory?.name}</p>
              {selectedOrderDetails.repairUnitImages?.length > 0 && (
                <div className="mt-2">
                  <span className="font-medium">Product Image:</span>
                  <img
                    src={`http://34.131.155.169:8080/uploads/${selectedOrderDetails.repairUnitImages[0]?.imageName}`}
                    className="w-20 h-20 object-contain border border-gray-300 rounded-md mt-1"
                    alt="Product"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-lg mb-3">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><span className="font-medium">Name:</span> {selectedOrderDetails.customer?.firstName} {selectedOrderDetails.customer?.lastName}</p>
                <p><span className="font-medium">Email:</span> {selectedOrderDetails.customer?.email}</p>
                <p><span className="font-medium">Mobile:</span> {selectedOrderDetails.customer?.mobile}</p>
              </div>
              <div>
                <p><span className="font-medium">Role:</span> {selectedOrderDetails.customer?.role?.name}</p>
                <p><span className="font-medium">User Address:</span> {selectedOrderDetails.userAddress || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-lg mb-3">Descriptions</h3>
            <p><span className="font-medium">User Description:</span> {selectedOrderDetails.userDefectDescription || "N/A"}</p>
            <p><span className="font-medium">Engineer Description:</span> {selectedOrderDetails.defectDescriptionByEngineer || "N/A"}</p>
            <p><span className="font-medium">Cancel Reason:</span> {selectedOrderDetails.cancelReason || "N/A"}</p>
            <p><span className="font-medium">Delay Reason:</span> {selectedOrderDetails.delayReason || "N/A"}</p>
          </div>

          {selectedOrderDetails.defectivePart && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-lg mb-3">Defective Part Information</h3>
              <p><span className="font-medium">Part Name:</span> {selectedOrderDetails.defectivePart.productPart?.name}</p>
              <p><span className="font-medium">Part Price:</span> ₹{selectedOrderDetails.defectivePart.price}</p>
              <p><span className="font-medium">Message:</span> {selectedOrderDetails.defectivePart.message}</p>
            </div>
          )}

          {selectedOrderDetails.createdByManager && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-lg mb-3">Created By Manager</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><span className="font-medium">Name:</span> {selectedOrderDetails.createdByManager.firstName} {selectedOrderDetails.createdByManager.lastName}</p>
                  <p><span className="font-medium">Email:</span> {selectedOrderDetails.createdByManager.email}</p>
                  <p><span className="font-medium">Mobile:</span> {selectedOrderDetails.createdByManager.mobile || "N/A"}</p>
                </div>
                <div>
                  <p><span className="font-medium">Role:</span> {selectedOrderDetails.createdByManager.role?.name}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-lg mb-3">Important Dates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><span className="font-medium">Order Date:</span> {selectedOrderDetails.orderOn ? new Date(selectedOrderDetails.orderOn).toLocaleString() : "N/A"}</p>
                <p><span className="font-medium">Pickup Schedule:</span> {selectedOrderDetails.pickupScheduleOn ? new Date(selectedOrderDetails.pickupScheduleOn).toLocaleString() : "N/A"}</p>
                <p><span className="font-medium">Picked Up From User:</span> {selectedOrderDetails.pickedupUnitFromUserOn ? new Date(selectedOrderDetails.pickedupUnitFromUserOn).toLocaleString() : "N/A"}</p>
                <p><span className="font-medium">Received From Partner:</span> {selectedOrderDetails.unitRecievedFromPartnerOn ? new Date(selectedOrderDetails.unitRecievedFromPartnerOn).toLocaleString() : "N/A"}</p>
              </div>
              <div>
                <p><span className="font-medium">Delivered On:</span> {selectedOrderDetails.deliveredOn ? new Date(selectedOrderDetails.deliveredOn).toLocaleString() : "N/A"}</p>
                <p><span className="font-medium">Cancelled On:</span> {selectedOrderDetails.cancelledOn ? new Date(selectedOrderDetails.cancelledOn).toLocaleString() : "N/A"}</p>
                <p><span className="font-medium">Completed By Engineer:</span> {selectedOrderDetails.completedByEngineerOn ? new Date(selectedOrderDetails.completedByEngineerOn).toLocaleString() : "N/A"}</p>
                <p><span className="font-medium">Expected Completion:</span> {selectedOrderDetails.expectedCompletedOn ? new Date(selectedOrderDetails.expectedCompletedOn).toLocaleString() : "N/A"}</p>
              </div>
            </div>
          </div>

          {selectedOrderDetails.productModelNumber?.productSpecification && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-lg mb-3">Product Specifications</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <p><span className="font-medium">Network:</span> {selectedOrderDetails.productModelNumber.productSpecification.network}</p>
                <p><span className="font-medium">Platform:</span> {selectedOrderDetails.productModelNumber.productSpecification.platform}</p>
                <p><span className="font-medium">RAM:</span> {selectedOrderDetails.productModelNumber.productSpecification.ram}GB</p>
                <p><span className="font-medium">ROM:</span> {selectedOrderDetails.productModelNumber.productSpecification.rom}GB</p>
              </div>
            </div>
          )}

          {selectedOrderDetails.variant && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-lg mb-3">Variant Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <p><span className="font-medium">RAM:</span> {selectedOrderDetails.variant.ram}GB</p>
                <p><span className="font-medium">ROM:</span> {selectedOrderDetails.variant.rom}GB</p>
                <p><span className="font-medium">Main Camera:</span> {selectedOrderDetails.variant.mainCamera}MP</p>
                <p><span className="font-medium">Selfie Camera:</span> {selectedOrderDetails.variant.selfieCamera}MP</p>
                <p><span className="font-medium">Battery:</span> {selectedOrderDetails.variant.battery}mAh</p>
                <p><span className="font-medium">Network:</span> {selectedOrderDetails.variant.network}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
          <button 
            type="button" 
            onClick={handleCloseModal} 
            className="bg-gray-300 text-black px-6 py-2 rounded hover:bg-gray-400"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrintDetails}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Print Details
          </button>
        </div>

      </div>
    </div>
  </>
)}


      {/* Option-2 */}
      {showDetailsModel && selectedOrderDetails && (
        <>
          <div className={ShowModalMainClass}>
            <div className="bg-white rounded-2xl shadow-xl w-[95%] max-w-5xl relative max-h-[90vh] overflow-y-auto">

              {/* Close Icon */}
              <button
                className="absolute top-6 right-6 text-2xl font-bold text-gray-400 hover:text-gray-600 z-10 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center"
                onClick={handleCloseModal}
              >
                &times;
              </button>

              <div id="order-details-print" className="p-8">

                {/* Header Section with Order ID */}
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Details</h1>
                  <div className="text-xl font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg inline-block">
                    {selectedOrderDetails.orderId}
                  </div>
                </div>

                {/* User Profile Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
                  <div className="flex items-center space-x-4">
                    {/* User Avatar */}
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {selectedOrderDetails.customer?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>

                    {/* User Details */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {selectedOrderDetails.customer?.firstName} {selectedOrderDetails.customer?.lastName}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 mt-2 text-sm text-gray-600">
                        <p><span className="font-medium">Email:</span> {selectedOrderDetails.customer?.email}</p>
                        <p><span className="font-medium">Mobile:</span> {selectedOrderDetails.customer?.mobile}</p>
                        <p><span className="font-medium">Role:</span> {selectedOrderDetails.customer?.role?.name}</p>
                        <p><span className="font-medium">Address:</span> {selectedOrderDetails.userAddress || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Stepper */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Order Progress</h3>
                  <div className="relative">
                    {(() => {
                      const status = selectedOrderDetails.unitRepairStatus;
                      const steps = [
                        { name: 'PENDING', label: 'Order Placed', icon: '📝' },
                        { name: 'PICKED_UP', label: 'Picked Up', icon: '📦' },
                        { name: 'IN_PROGRESS', label: 'In Progress', icon: '🔧' },
                        { name: 'COMPLETED', label: 'Completed', icon: '✅' },
                        { name: 'DELIVERED', label: 'Delivered', icon: '🚚' }
                      ];

                      const cancelledSteps = [
                        { name: 'PENDING', label: 'Order Placed', icon: '📝' },
                        { name: 'CANCELLED', label: 'Cancelled', icon: '❌' }
                      ];

                      const activeSteps = status === 'CANCELLED' ? cancelledSteps : steps;
                      const currentStepIndex = activeSteps.findIndex(step => step.name === status);

                      return (
                        <div className="flex items-center justify-between">
                          {activeSteps.map((step, index) => (
                            <div key={step.name} className="flex flex-col items-center flex-1">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-2 transition-all ${index <= currentStepIndex
                                  ? status === 'CANCELLED' && step.name === 'CANCELLED'
                                    ? 'bg-red-500 text-white'
                                    : 'bg-blue-500 text-white'
                                  : 'bg-gray-200 text-gray-400'
                                }`}>
                                {step.icon}
                              </div>
                              <span className={`text-xs font-medium text-center ${index <= currentStepIndex ? 'text-gray-800' : 'text-gray-400'
                                }`}>
                                {step.label}
                              </span>
                              {index < activeSteps.length - 1 && (
                                <div className={`absolute top-6 h-0.5 transition-all ${index < currentStepIndex ? 'bg-blue-500' : 'bg-gray-200'
                                  }`}
                                  style={{
                                    left: `${(index + 1) * (100 / activeSteps.length)}%`,
                                    width: `${100 / activeSteps.length - 8}%`
                                  }} />
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Descriptions Section */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Problem Description</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">User Description:</span>
                      <p className="text-gray-600 mt-1">{selectedOrderDetails.userDefectDescription || "N/A"}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Engineer Description:</span>
                      <p className="text-gray-600 mt-1">{selectedOrderDetails.defectDescriptionByEngineer || "N/A"}</p>
                    </div>
                    {selectedOrderDetails.cancelReason && (
                      <div>
                        <span className="font-medium text-red-600">Cancel Reason:</span>
                        <p className="text-red-500 mt-1">{selectedOrderDetails.cancelReason}</p>
                      </div>
                    )}
                    {selectedOrderDetails.delayReason && (
                      <div>
                        <span className="font-medium text-orange-600">Delay Reason:</span>
                        <p className="text-orange-500 mt-1">{selectedOrderDetails.delayReason}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Created By Manager */}
                {selectedOrderDetails.createdByManager && (
                  <div className="bg-green-50 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Created By Manager</h3>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                        {selectedOrderDetails.createdByManager.firstName?.charAt(0)?.toUpperCase() || 'M'}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 flex-1">
                        <div>
                          <p><span className="font-medium">Name:</span> {selectedOrderDetails.createdByManager.firstName} {selectedOrderDetails.createdByManager.lastName}</p>
                          <p><span className="font-medium">Email:</span> {selectedOrderDetails.createdByManager.email}</p>
                        </div>
                        <div>
                          <p><span className="font-medium">Mobile:</span> {selectedOrderDetails.createdByManager.mobile || "N/A"}</p>
                          <p><span className="font-medium">Role:</span> {selectedOrderDetails.createdByManager.role?.name}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Defective Part Information */}
                {selectedOrderDetails.defectivePart && (
                  <div className="bg-red-50 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Defective Part Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <span className="text-sm font-medium text-gray-600">Part Name</span>
                        <p className="text-lg font-semibold text-gray-800">{selectedOrderDetails.defectivePart.productPart?.name}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <span className="text-sm font-medium text-gray-600">Part Price</span>
                        <p className="text-lg font-semibold text-green-600">₹{selectedOrderDetails.defectivePart.price}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <span className="text-sm font-medium text-gray-600">Message</span>
                        <p className="text-sm text-gray-700">{selectedOrderDetails.defectivePart.message}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Three Column Layout for Order Info, Product Specs, Variant Info */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                  {/* Order Information */}
                  <div className="bg-purple-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4 text-purple-800">Order Information</h3>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</span>
                        <div className={`mt-1 px-2 py-1 rounded text-xs font-medium inline-block ${getStatusBadgeClass(selectedOrderDetails.unitRepairStatus)}`}>
                          {selectedOrderDetails.unitRepairStatus?.replace(/_/g, ' ')}
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Price</span>
                        <p className="text-lg font-bold text-green-600 mt-1">₹{selectedOrderDetails.price || "N/A"}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">IMEI Number</span>
                        <p className="text-sm font-mono text-gray-800 mt-1">{selectedOrderDetails.imeiNumber || "N/A"}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Order Type</span>
                        <p className="text-sm text-gray-800 mt-1">{selectedOrderDetails.onlineOrder ? "Online" : "Offline"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Product Specifications */}
                  <div className="bg-orange-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4 text-orange-800">Product Specifications</h3>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Brand & Model</span>
                        <p className="text-sm font-semibold text-gray-800 mt-1">
                          {selectedOrderDetails.brand?.name} {selectedOrderDetails.productModelNumber?.name}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Category</span>
                        <p className="text-sm text-gray-800 mt-1">
                          {selectedOrderDetails.categories?.name}  {selectedOrderDetails.subCategory?.name}
                        </p>
                      </div>
                      {selectedOrderDetails.productModelNumber?.productSpecification && (
                        <>
                          <div className="bg-white p-3 rounded-lg">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Network & Platform</span>
                            <p className="text-sm text-gray-800 mt-1">
                              {selectedOrderDetails.productModelNumber.productSpecification.network?.toUpperCase()} • {selectedOrderDetails.productModelNumber.productSpecification.platform}
                            </p>
                          </div>
                          <div className="bg-white p-3 rounded-lg">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Storage</span>
                            <p className="text-sm text-gray-800 mt-1">
                              {selectedOrderDetails.productModelNumber.productSpecification.ram}GB RAM • {selectedOrderDetails.productModelNumber.productSpecification.rom}GB ROM
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Variant Information */}
                  <div className="bg-green-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4 text-green-800">Variant Information</h3>
                    {selectedOrderDetails.variant ? (
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded-lg">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Memory</span>
                          <p className="text-sm text-gray-800 mt-1">
                            {selectedOrderDetails.variant.ram}GB RAM • {selectedOrderDetails.variant.rom}GB Storage
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Camera</span>
                          <p className="text-sm text-gray-800 mt-1">
                            {selectedOrderDetails.variant.mainCamera}MP Main • {selectedOrderDetails.variant.selfieCamera}MP Selfie
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Battery & Network</span>
                          <p className="text-sm text-gray-800 mt-1">
                            {selectedOrderDetails.variant.battery}mAh • {selectedOrderDetails.variant.network?.toUpperCase()}
                          </p>
                        </div>
                        {selectedOrderDetails.variant.variantColors?.length > 0 && (
                          <div className="bg-white p-3 rounded-lg">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Color</span>
                            <div className="flex items-center mt-2 space-x-2">
                              <div
                                className="w-6 h-6 rounded-full border-2 border-gray-300"
                                style={{ backgroundColor: selectedOrderDetails.variant.variantColors[0]?.colorName?.colorCode || '#gray' }}
                              ></div>
                              <span className="text-sm text-gray-800 capitalize">
                                {selectedOrderDetails.variant.variantColors[0]?.colorName?.color}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-white p-4 rounded-lg text-center text-gray-500">
                        No variant information available
                      </div>
                    )}
                  </div>
                </div>

                {/* Important Dates Timeline */}
                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Timeline</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Order Date', date: selectedOrderDetails.orderOn, icon: '📅' },
                      { label: 'Pickup Schedule', date: selectedOrderDetails.pickupScheduleOn, icon: '⏰' },
                      { label: 'Picked From User', date: selectedOrderDetails.pickedupUnitFromUserOn, icon: '📦' },
                      { label: 'Received From Partner', date: selectedOrderDetails.unitRecievedFromPartnerOn, icon: '🤝' },
                      { label: 'Delivered', date: selectedOrderDetails.deliveredOn, icon: '✅' },
                      { label: 'Cancelled', date: selectedOrderDetails.cancelledOn, icon: '❌' },
                      { label: 'Completed By Engineer', date: selectedOrderDetails.completedByEngineerOn, icon: '🔧' },
                      { label: 'Expected Completion', date: selectedOrderDetails.expectedCompletedOn, icon: '⏳' }
                    ].filter(item => item.date).map((item, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">{item.icon}</span>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{item.label}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-800">
                          {new Date(item.date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(item.date).toLocaleTimeString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Product Images */}
                {selectedOrderDetails.repairUnitImages?.length > 0 && (
                  <div className="bg-indigo-50 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-indigo-800">Product Images</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedOrderDetails.repairUnitImages.map((image, index) => (
                        <div key={index} className="bg-white p-2 rounded-lg shadow-sm">
                          <img
                            src={`http://34.131.155.169:8080/uploads/${image.imageName}`}
                            className="w-full h-24 object-cover rounded-md cursor-pointer hover:opacity-75 transition-opacity"
                            alt={`Product ${index + 1}`}
                            onClick={() => {
                              // Add image modal functionality if needed
                              window.open(`http://34.131.155.169:8080/uploads/${image.imageName}`, '_blank');
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Variant Images */}
                {selectedOrderDetails.variant?.variantColors?.[0]?.modalImages?.length > 0 && (
                  <div className="bg-pink-50 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-pink-800">Product Variant Images</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedOrderDetails.variant.variantColors[0].modalImages.map((image, index) => (
                        <div key={index} className="bg-white p-2 rounded-lg shadow-sm">
                          <img
                            src={`http://34.131.155.169:8080/uploads/${image.imageName}`}
                            className="w-full h-24 object-cover rounded-md cursor-pointer hover:opacity-75 transition-opacity"
                            alt={`Variant ${index + 1}`}
                            onClick={() => {
                              window.open(`http://34.131.155.169:8080/uploads/${image.imageName}`, '_blank');
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center p-8 pt-0">
                <div className="text-sm text-gray-500">
                  Last Updated: {new Date().toLocaleString()}
                </div>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={handlePrintDetails}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <span>🖨️</span>
                    <span>Print Details</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </>
      )}



     {/* Option-3 */}
      {showDetailsModel && selectedOrderDetails && (
        <>
          <div className={ShowModalMainClass}>
            <div className="bg-white rounded-2xl shadow-xl w-[95%] max-w-5xl relative max-h-[90vh] overflow-y-auto">

              {/* Close Icon */}
              <button
                className="absolute top-6 right-6 text-2xl font-bold text-gray-400 hover:text-gray-600 z-10 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center"
                onClick={handleCloseModal}
              >
                &times;
              </button>

              <div id="order-details-print" className="p-8">

                {/* Header Section with Order ID */}
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Details</h1>
                  <div className="text-xl font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg inline-block">
                    {selectedOrderDetails.orderId}
                  </div>
                </div>

                {/* User Profile Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
                  <div className="flex items-center space-x-4">
                    {/* User Avatar */}
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {(() => {
                        // Handle both single order and multiple orders
                        const firstOrder = Array.isArray(selectedOrderDetails) ? selectedOrderDetails[0] : selectedOrderDetails;
                        return firstOrder.customer?.firstName?.charAt(0)?.toUpperCase() || 'AK';
                      })()}
                    </div>

                    {/* User Details */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800">
  {(() => {
    const firstOrder = Array.isArray(selectedOrderDetails)
      ? selectedOrderDetails[0]
      : selectedOrderDetails;

    const firstName =
      firstOrder.customer?.firstName
        ? firstOrder.customer.firstName.charAt(0).toUpperCase() +
          firstOrder.customer.firstName.slice(1).toLowerCase()
        : "";

    const lastName =
      firstOrder.customer?.lastName
        ? firstOrder.customer.lastName.charAt(0).toUpperCase() +
          firstOrder.customer.lastName.slice(1).toLowerCase()
        : "";

    return `${firstName} ${lastName}`;
  })()}
</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 mt-2 text-sm text-gray-600">
                        {(() => {
                          const firstOrder = Array.isArray(selectedOrderDetails) ? selectedOrderDetails[0] : selectedOrderDetails;
                          return (
                            <>
                              <p><span className="font-medium">Email:</span> {firstOrder.customer?.email}</p>
                              <p><span className="font-medium">Mobile:</span> {firstOrder.customer?.mobile}</p>
                              <p><span className="font-medium">Role:</span> {firstOrder.customer?.role?.name}</p>
                              <p><span className="font-medium">Address:</span> {firstOrder.userAddress || "N/A"}</p>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Total Orders Badge */}
                    <div className="text-right">
                      <div className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                        <p className="text-xs font-medium">Total Orders</p>
                        <p className="text-2xl font-bold">
                          {Array.isArray(selectedOrderDetails) ? selectedOrderDetails.length : 1}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

    

                {/* Progress Stepper-2 - Show overall progress based on actual dates */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Order Progress</h3>
                  <div className="relative">
                    {(() => {
                      const firstOrder = Array.isArray(selectedOrderDetails) ? selectedOrderDetails[0] : selectedOrderDetails;

                      // Define steps based on available dates and status
                      const allSteps = [
                        {
                          name: 'ORDERED',
                          label: 'Order Placed',
                          icon: '📝',
                          date: firstOrder.orderOn,
                          completed: !!firstOrder.orderOn
                        },
                        {
                          name: 'PICKUP_SCHEDULED',
                          label: 'Pickup Scheduled',
                          icon: '⏰',
                          date: firstOrder.pickupScheduleOn,
                          completed: !!firstOrder.pickupScheduleOn
                        },
                        {
                          name: 'PICKED_UP',
                          label: 'Picked From User',
                          icon: '📦',
                          date: firstOrder.pickedupUnitFromUserOn,
                          completed: !!firstOrder.pickedupUnitFromUserOn
                        },
                        {
                          name: 'RECEIVED_FROM_PARTNER',
                          label: 'Received From Partner',
                          icon: '🤝',
                          date: firstOrder.unitRecievedFromPartnerOn,
                          completed: !!firstOrder.unitRecievedFromPartnerOn
                        },
                        {
                          name: 'COMPLETED',
                          label: 'Completed',
                          icon: '🔧',
                          date: firstOrder.completedByEngineerOn,
                          completed: !!firstOrder.completedByEngineerOn || firstOrder.unitRepairStatus === 'COMPLETED'
                        },
                        {
                          name: 'DELIVERED',
                          label: 'Delivered',
                          icon: '🚚',
                          date: firstOrder.deliveredOn,
                          completed: !!firstOrder.deliveredOn
                        }
                      ];

                      // Handle cancelled orders
                      if (firstOrder.unitRepairStatus === 'CANCELLED' || firstOrder.cancelledOn) {
                        const cancelIndex = allSteps.findIndex(step => step.completed);
                        const cancelledSteps = [
                          ...allSteps.slice(0, cancelIndex + 1),
                          {
                            name: 'CANCELLED',
                            label: 'Cancelled',
                            icon: '❌',
                            date: firstOrder.cancelledOn,
                            completed: true,
                            cancelled: true
                          }
                        ];

                        return (
                          <div className="flex items-center justify-between">
                            {cancelledSteps.map((step, index) => (
                              <div key={step.name} className="flex flex-col items-center flex-1 relative">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-2 transition-all ${step.completed
                                    ? step.cancelled
                                      ? 'bg-red-500 text-white'
                                      : 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-400'
                                  }`}>
                                  {step.icon}
                                </div>
                                <span className={`text-xs font-medium text-center ${step.completed ? 'text-gray-800' : 'text-gray-400'
                                  }`}>
                                  {step.label}
                                </span>
                                {step.date && (
                                  <span className="text-xs text-gray-500 mt-1">
                                    {new Date(step.date).toLocaleDateString()}
                                  </span>
                                )}
                                {index < cancelledSteps.length - 1 && (
                                  <div className={`absolute top-6 h-0.5 transition-all ${step.completed && cancelledSteps[index + 1].completed ? 'bg-blue-500' : 'bg-gray-200'
                                    }`}
                                    style={{
                                      left: '50%',
                                      right: `-${100 / cancelledSteps.length}%`,
                                      width: `${100 / cancelledSteps.length}%`
                                    }} />
                                )}
                              </div>
                            ))}
                          </div>
                        );
                      }

                      // Normal flow for non-cancelled orders
                      const activeSteps = allSteps.filter(step =>
                        step.completed ||
                        allSteps.findIndex(s => s.completed) + 1 === allSteps.findIndex(s => s.name === step.name)
                      );

                      // If no steps are active, show first step
                      if (activeSteps.length === 0) {
                        activeSteps.push(allSteps[0]);
                      }

                      return (
                        <div className="flex items-center justify-between">
                          {activeSteps.map((step, index) => (
                            <div key={step.name} className="flex flex-col items-center flex-1 relative">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-2 transition-all ${step.completed
                                  ? 'bg-blue-500 text-white'
                                  : index === activeSteps.length - 1
                                    ? 'bg-yellow-500 text-white animate-pulse'
                                    : 'bg-gray-200 text-gray-400'
                                }`}>
                                {step.icon}
                              </div>
                              <span className={`text-xs font-medium text-center ${step.completed ? 'text-gray-800' : index === activeSteps.length - 1 ? 'text-yellow-600 font-semibold' : 'text-gray-400'
                                }`}>
                                {step.label}
                              </span>
                              {step.date && (
                                <span className="text-xs text-gray-500 mt-1">
                                  {new Date(step.date).toLocaleDateString()}
                                </span>
                              )}
                              {index < activeSteps.length - 1 && (
                                <div className={`absolute top-6 h-0.5 transition-all ${step.completed ? 'bg-blue-500' : 'bg-gray-200'
                                  }`}
                                  style={{
                                    left: '50%',
                                    right: `-${100 / activeSteps.length}%`,
                                    width: `${100 / activeSteps.length}%`
                                  }} />
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </div>



                {/* Global Descriptions Section - Common for all orders */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Overall Problem Description</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <span className="font-medium text-gray-700">User Description:</span>
                      <p className="text-gray-600 mt-1">{selectedOrderDetails.userDefectDescription || "N/A"}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <span className="font-medium text-gray-700">Engineer Description:</span>
                      <p className="text-gray-600 mt-1">{selectedOrderDetails.defectDescriptionByEngineer || "N/A"}</p>
                    </div>
                    {selectedOrderDetails.cancelReason && (
                      <div className="bg-white p-4 rounded-lg">
                        <span className="font-medium text-red-600">Cancel Reason:</span>
                        <p className="text-red-500 mt-1">{selectedOrderDetails.cancelReason}</p>
                      </div>
                    )}
                    {selectedOrderDetails.delayReason && (
                      <div className="bg-white p-4 rounded-lg">
                        <span className="font-medium text-orange-600">Delay Reason:</span>
                        <p className="text-orange-500 mt-1">{selectedOrderDetails.delayReason}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Created By Manager */}
                {selectedOrderDetails.createdByManager && (
                  <div className="bg-green-50 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Created By Manager</h3>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                        {selectedOrderDetails.createdByManager.firstName?.charAt(0)?.toUpperCase() || 'M'}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 flex-1">
                        <div>
                          <p><span className="font-medium">Name:</span> {selectedOrderDetails.createdByManager.firstName} {selectedOrderDetails.createdByManager.lastName}</p>
                          <p><span className="font-medium">Email:</span> {selectedOrderDetails.createdByManager.email}</p>
                        </div>
                        <div>
                          <p><span className="font-medium">Mobile:</span> {selectedOrderDetails.createdByManager.mobile || "N/A"}</p>
                          <p><span className="font-medium">Role:</span> {selectedOrderDetails.createdByManager.role?.name}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Defective Part Information */}
                {selectedOrderDetails.defectivePart && (
                  <div className="bg-red-50 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Defective Part Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <span className="text-sm font-medium text-gray-600">Part Name</span>
                        <p className="text-lg font-semibold text-gray-800">{selectedOrderDetails.defectivePart.productPart?.name}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <span className="text-sm font-medium text-gray-600">Part Price</span>
                        <p className="text-lg font-semibold text-green-600">₹{selectedOrderDetails.defectivePart.price}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <span className="text-sm font-medium text-gray-600">Message</span>
                        <p className="text-sm text-gray-700">{selectedOrderDetails.defectivePart.message}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Products/Orders List - Row wise display for multiple orders */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-6 text-gray-800">Order Items</h3>

                  {/* If selectedOrderDetails is an array of orders, map through them */}
                  {(() => {
                    // Check if it's a single order or multiple orders
                    const orders = Array.isArray(selectedOrderDetails) ? selectedOrderDetails : [selectedOrderDetails];

                    return orders.map((order, orderIndex) => (
                      <div key={order.id || orderIndex} className="border border-gray-200 rounded-xl mb-6 overflow-hidden">

                        {/* Order Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="bg-white bg-opacity-20 rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">
                                {orderIndex + 1}
                              </div>
                              <div>
                                <h4 className="text-lg font-semibold">Order #{order.orderId}</h4>
                                <p className="text-sm opacity-90">
                                  {order.brand?.name} {order.productModelNumber?.name}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`px-3 py-1 rounded-full text-xs font-medium ${order.unitRepairStatus === 'COMPLETED' ? 'bg-green-500' :
                                  order.unitRepairStatus === 'CANCELLED' ? 'bg-red-500' :
                                    order.unitRepairStatus === 'IN_PROGRESS' ? 'bg-yellow-500' :
                                      'bg-gray-500'
                                }`}>
                                {order.unitRepairStatus?.replace(/_/g, ' ')}
                              </div>
                              <p className="text-lg font-bold mt-1">₹{order.price || "N/A"}</p>
                            </div>
                          </div>
                        </div>

                        {/* Order Content */}
                        <div className="p-6">
                          {/* Three Column Layout for this specific order */}
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Order Information */}
                            <div className="bg-purple-50 rounded-xl p-4">
                              <h4 className="text-md font-semibold mb-3 text-purple-800">Order Information</h4>
                              <div className="space-y-2">
                                <div className="bg-white p-3 rounded-lg">
                                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">IMEI</span>
                                  <p className="text-sm font-mono text-gray-800 mt-1">{order.imeiNumber || "N/A"}</p>
                                </div>
                                <div className="bg-white p-3 rounded-lg">
                                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Order Type</span>
                                  <p className="text-sm text-gray-800 mt-1">{order.onlineOrder ? "Online" : "Offline"}</p>
                                </div>
                                <div className="bg-white p-3 rounded-lg">
                                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Order Date</span>
                                  <p className="text-sm text-gray-800 mt-1">
                                    {order.orderOn ? new Date(order.orderOn).toLocaleDateString() : "N/A"}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Product Specifications */}
                            <div className="bg-orange-50 rounded-xl p-4">
                              <h4 className="text-md font-semibold mb-3 text-orange-800">Product Specifications</h4>
                              <div className="space-y-2">
                                <div className="bg-white p-3 rounded-lg">
                                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Brand & Model</span>
                                  <p className="text-sm font-semibold text-gray-800 mt-1">
                                    {order.brand?.name} {order.productModelNumber?.name}
                                  </p>
                                </div>
                                <div className="bg-white p-3 rounded-lg">
                                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Category</span>
                                  <p className="text-sm text-gray-800 mt-1">
                                    {order.categories?.name}  {order.subCategory?.name}
                                  </p>
                                </div>
                                {order.productModelNumber?.productSpecification && (
                                  <div className="bg-white p-3 rounded-lg">
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Specs</span>
                                    <p className="text-sm text-gray-800 mt-1">
                                      {order.productModelNumber.productSpecification.ram}GB RAM • {order.productModelNumber.productSpecification.rom}GB ROM
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1">
                                      {order.productModelNumber.productSpecification.network?.toUpperCase()} • {order.productModelNumber.productSpecification.platform}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Variant Information */}
                            <div className="bg-green-50 rounded-xl p-4">
                              <h4 className="text-md font-semibold mb-3 text-green-800">Variant Information</h4>
                              {order.variant ? (
                                <div className="space-y-2">
                                  <div className="bg-white p-3 rounded-lg">
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Memory</span>
                                    <p className="text-sm text-gray-800 mt-1">
                                      {order.variant.ram}GB • {order.variant.rom}GB
                                    </p>
                                  </div>
                                  <div className="bg-white p-3 rounded-lg">
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Camera</span>
                                    <p className="text-sm text-gray-800 mt-1">
                                      {order.variant.mainCamera}MP Main • {order.variant.selfieCamera}MP Selfie
                                    </p>
                                  </div>
                                  <div className="bg-white p-3 rounded-lg">
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Battery</span>
                                    <p className="text-sm text-gray-800 mt-1">
                                      {order.variant.battery}mAh • {order.variant.network?.toUpperCase()}
                                    </p>
                                  </div>
                                  {order.variant.variantColors?.length > 0 && (
                                    <div className="bg-white p-3 rounded-lg">
                                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Color</span>
                                      <div className="flex items-center mt-2 space-x-2">
                                        <div
                                          className="w-5 h-5 rounded-full border-2 border-gray-300"
                                          style={{ backgroundColor: order.variant.variantColors[0]?.colorName?.colorCode || '#gray' }}
                                        ></div>
                                        <span className="text-sm text-gray-800 capitalize">
                                          {order.variant.variantColors[0]?.colorName?.color}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="bg-white p-4 rounded-lg text-center text-gray-500 text-sm">
                                  No variant information
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Product Images for this order */}
                          {order.repairUnitImages?.length > 0 && (
                            <div className="mt-4 bg-indigo-50 rounded-lg p-4">
                              <h5 className="text-sm font-semibold mb-3 text-indigo-800">Product Images</h5>
                              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                                {order.repairUnitImages.map((image, imgIndex) => (
                                  <div key={imgIndex} className="bg-white p-2 rounded-lg shadow-sm">
                                    <img
                                      src={`http://34.131.155.169:8080/uploads/${image.imageName}`}
                                      className="w-full h-16 object-cover rounded-md cursor-pointer hover:opacity-75 transition-opacity"
                                      alt={`Product ${imgIndex + 1}`}
                                      onClick={() => window.open(`http://34.131.155.169:8080/uploads/${image.imageName}`, '_blank')}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Variant Images for this order */}
                          {order.variant?.variantColors?.[0]?.modalImages?.length > 0 && (
                            <div className="mt-4 bg-pink-50 rounded-lg p-4">
                              <h5 className="text-sm font-semibold mb-3 text-pink-800">Variant Images</h5>
                              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                                {order.variant.variantColors[0].modalImages.map((image, imgIndex) => (
                                  <div key={imgIndex} className="bg-white p-2 rounded-lg shadow-sm">
                                    <img
                                      src={`http://34.131.155.169:8080/uploads/${image.imageName}`}
                                      className="w-full h-16 object-cover rounded-md cursor-pointer hover:opacity-75 transition-opacity"
                                      alt={`Variant ${imgIndex + 1}`}
                                      onClick={() => window.open(`http://34.131.155.169:8080/uploads/${image.imageName}`, '_blank')}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Defective Part for this order */}
                          {order.defectivePart && (
                            <div className="mt-4 bg-red-50 rounded-lg p-4">
                              <h5 className="text-sm font-semibold mb-3 text-red-800">Defective Part</h5>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="bg-white p-3 rounded-lg">
                                  <span className="text-xs font-medium text-gray-500">Part</span>
                                  <p className="text-sm font-semibold text-gray-800">{order.defectivePart.productPart?.name}</p>
                                </div>
                                <div className="bg-white p-3 rounded-lg">
                                  <span className="text-xs font-medium text-gray-500">Price</span>
                                  <p className="text-sm font-semibold text-red-600">₹{order.defectivePart.price}</p>
                                </div>
                                <div className="bg-white p-3 rounded-lg">
                                  <span className="text-xs font-medium text-gray-500">Message</span>
                                  <p className="text-xs text-gray-700">{order.defectivePart.message}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Timeline for this order */}
                          <div className="mt-4 bg-gray-50 rounded-lg p-4">
                            <h5 className="text-sm font-semibold mb-3 text-gray-800">Timeline</h5>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {[
                                { label: 'Order Date', date: order.orderOn },
                                { label: 'Pickup Schedule', date: order.pickupScheduleOn },
                                { label: 'Delivered', date: order.deliveredOn },
                                { label: 'Expected', date: order.expectedCompletedOn }
                              ].filter(item => item.date).map((item, dateIndex) => (
                                <div key={dateIndex} className="bg-white p-3 rounded-lg text-center">
                                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block">{item.label}</span>
                                  <p className="text-sm font-semibold text-gray-800 mt-1">
                                    {new Date(item.date).toLocaleDateString()}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      </div>
                    ));
                  })()}
                </div>

                {/* Important Dates Timeline */}
                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Timeline</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Order Date', date: selectedOrderDetails.orderOn, icon: '📅' },
                      { label: 'Pickup Schedule', date: selectedOrderDetails.pickupScheduleOn, icon: '⏰' },
                      { label: 'Picked From User', date: selectedOrderDetails.pickedupUnitFromUserOn, icon: '📦' },
                      { label: 'Received From Partner', date: selectedOrderDetails.unitRecievedFromPartnerOn, icon: '🤝' },
                      { label: 'Delivered', date: selectedOrderDetails.deliveredOn, icon: '✅' },
                      { label: 'Cancelled', date: selectedOrderDetails.cancelledOn, icon: '❌' },
                      { label: 'Completed By Engineer', date: selectedOrderDetails.completedByEngineerOn, icon: '🔧' },
                      { label: 'Expected Completion', date: selectedOrderDetails.expectedCompletedOn, icon: '⏳' }
                    ].filter(item => item.date).map((item, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">{item.icon}</span>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{item.label}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-800">
                          {new Date(item.date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(item.date).toLocaleTimeString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Product Images */}
                {selectedOrderDetails.repairUnitImages?.length > 0 && (
                  <div className="bg-indigo-50 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-indigo-800">Product Images</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedOrderDetails.repairUnitImages.map((image, index) => (
                        <div key={index} className="bg-white p-2 rounded-lg shadow-sm">
                          <img
                            src={`http://34.131.155.169:8080/uploads/${image.imageName}`}
                            className="w-full h-24 object-cover rounded-md cursor-pointer hover:opacity-75 transition-opacity"
                            alt={`Product ${index + 1}`}
                            onClick={() => {
                              // Add image modal functionality if needed
                              window.open(`http://34.131.155.169:8080/uploads/${image.imageName}`, '_blank');
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Variant Images */}
                {selectedOrderDetails.variant?.variantColors?.[0]?.modalImages?.length > 0 && (
                  <div className="bg-pink-50 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-pink-800">Product Variant Images</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedOrderDetails.variant.variantColors[0].modalImages.map((image, index) => (
                        <div key={index} className="bg-white p-2 rounded-lg shadow-sm">
                          <img
                            src={`http://34.131.155.169:8080/uploads/${image.imageName}`}
                            className="w-full h-24 object-cover rounded-md cursor-pointer hover:opacity-75 transition-opacity"
                            alt={`Variant ${index + 1}`}
                            onClick={() => {
                              window.open(`http://34.131.155.169:8080/uploads/${image.imageName}`, '_blank');
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center p-8 pt-0">
                <div className="text-sm text-gray-500">
                  Last Updated: {new Date().toLocaleString()}
                </div>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={handlePrintDetails}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <span>🖨️</span>
                    <span>Print Details</span>
                  </button>
                </div>
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