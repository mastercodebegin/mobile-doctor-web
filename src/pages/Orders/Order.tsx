import { useEffect, useState } from 'react'
import Loading from '../../components/Loading'
import { GetAllCategory } from '../AddCategory/AddCategorySlice';
import { GetAllSubCategory } from '../AddSubCategory/SubCategorySlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { toast } from 'react-toastify';
import { ClearFilter, EditClass, EditIcon, getStatusBadgeClass, inputClass, pageSize, SearchIcon, ShowModalMainClass, ShowModelCloseButtonClass, SubmitButtonClass, TableDataClass, TableHadeClass } from '../../helper/ApplicationConstants';
import Pagination from '../../helper/Pagination';
import { GetAllRepairUnitOrderByUserId, update, UpdateOrder } from './OrderSlice';
import DatePicker from '../../components/DatePicker';
import { UrlConstants } from '../../util/practice/UrlConstants';
import { getRequestMethodWithParam } from '../../util/CommonService';
import ConfirmationModal from '../../components/ConfirmationModal';
import { MapPin, Phone, ShieldCheck, User } from 'lucide-react';
import OrderProgressStepper from '../../components/OrderProgressStepper';
import DefaultImage from "../../assets/Laptop_Image.png"

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



   const firstOrder = Array.isArray(selectedOrderDetails) ? selectedOrderDetails[0] : selectedOrderDetails;

  const firstName = firstOrder?.customer?.firstName
    ? firstOrder?.customer?.firstName?.charAt(0).toUpperCase() +
      firstOrder?.customer?.firstName?.slice(1).toLowerCase()
    : "";

  const lastName = firstOrder?.customer?.lastName
    ? firstOrder?.customer?.lastName?.charAt(0).toUpperCase() +
      firstOrder?.customer?.lastName?.slice(1).toLowerCase()
    : "";

    const HoverEffect = "rounded-xl p-6 mb-8 rounded-l-lg shadow border-l-4 border-gray-400"

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
          <div className="max-w-7xl mx-auto bg-white rounded-lg shadow overflow-hidden">

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
                        key={user?.id}
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
                <div className="mb-8 flex">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">#</h1>
                  <span className="text-md font-semibold pe-4 pt-2 rounded-lg inline-block">
                    {selectedOrderDetails.orderId}
                  </span>
                </div>

                <div className="mb-8 p-4 rounded-md border border-gray-300">

                {/* User Profile Section */}
<section>
  <div className="flex flex-col mb-4 md:flex-row items-center md:items-start justify-between">
    
    {/* Left Side: Avatar + Name */}
    <div className="flex items-center space-x-4">
      <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md">
        {firstOrder.customer?.firstName?.charAt(0)?.toUpperCase() || "AK"}
      </div>
     <div>
       <h3 className="text-xl font-semibold text-gray-800">
        {`${firstName} ${lastName}`}
      </h3>
      <span className='text-gray-500 text-sm' >{firstOrder.customer?.role?.name || "N/A"}</span>
     </div>
    </div>

    {/* Right Side: Details Card */}
    <div dir="rtl" className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 md:mt-0 md:ml-8 md:w-auto ">
      
      <div dir="ltr" className="flex items-center space-x-2 p-2 border border-gray-300 rounded-lg bg-white">
        <User className="w-5 h-5 text-blue-600" />
        <span>{firstOrder.customer?.email || "N/A"}</span>
      </div>
      
      <div dir="ltr" className="flex items-center space-x-2 p-2 border border-gray-300 rounded-lg bg-white">
        <Phone className="w-5 h-5 text-green-600" />
        <span>{firstOrder.customer?.mobile || "N/A"}</span>
      </div>

    </div>
  </div>
</section>

                {/* Progress Stepper-1 - Show overall progress based on actual dates */}
               <div className={`rounded-xl p-6 mb-4 rounded-l-lg shadow border-l-4 border-gray-400`}>
  <OrderProgressStepper selectedOrderDetails={selectedOrderDetails} />
</div>

{/* Rent Location Section */}
<div className="flex items-center space-x-3 mb-4 p-3 rounded-lg bg-white">
  {/* Icon with light gray background */}
  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
    <MapPin className="w-5 h-5 text-gray-600" />
  </div>

  {/* Text Section */}
  <div>
    <h4 className="text-sm font-semibold">Rent location</h4>
    <p className="text-gray-600 text-sm">
      {firstOrder?.userAddress || "No Description"}
    </p>
  </div>
</div>

{/* User Description Section */}
<div className="flex items-center space-x-3 mb-4 p-3 rounded-lg bg-white">
  {/* Icon with light gray background */}
  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
    <User className="w-5 h-5 text-gray-600" />
  </div>

  {/* Text Section */}
  <div>
    <h4 className="text-sm font-semibold">User Description</h4>
    <p className="text-gray-600 text-sm">
      {selectedOrderDetails.userDefectDescription || "N/A"}
    </p>
  </div>
</div>

{/* Manager Description Section */}
<div className="flex items-center space-x-3 mb-4 p-3 rounded-lg bg-white">
  {/* Icon with light gray background */}
  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
    <ShieldCheck className="w-5 h-5 text-gray-600" />
  </div>

  {/* Text Section */}
  <div>
    <h4 className="text-sm font-semibold">Manager Description</h4>
    <p className="text-gray-600 text-sm">
      {selectedOrderDetails.defectDescriptionByEngineer || "N/A"}
    </p>
  </div>
</div>

                {/* Global Descriptions Section - Common for all orders */}
                <div
  className={`${HoverEffect} px-4 py-2 ${
    !selectedOrderDetails?.cancelReason && !selectedOrderDetails?.delayReason ? "hidden" : ""
  }`}
>
                  <h3 className={"text-lg font-semibold mb-2 text-gray-800"}>Overall Problem Description</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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


                {/* Defective Part Information */}
                {selectedOrderDetails.defectivePart && (
                  <div className={`${HoverEffect} px-4 py-2`}>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Defective Part Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm hover:border border-red-200">
                        <span className="text-sm font-medium text-gray-600">Part Name</span>
                        <p className="text-lg font-semibold text-gray-800">{selectedOrderDetails?.defectivePart?.productPart?.name}</p>
                      </div>
                       <div className="bg-white p-4 rounded-lg shadow-sm hover:border border-red-200">
                        <span className="text-sm font-medium text-gray-600">Part Price</span>
                        <p className="text-lg font-semibold text-green-600">₹{selectedOrderDetails?.defectivePart?.price}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm hover:border border-red-200">
                        <span className="text-sm font-medium text-gray-600">Message</span>
                        <p className="text-sm text-gray-700">{selectedOrderDetails?.defectivePart?.message}</p>
                      </div>
                    </div>
                  </div>
                 )} 

                </div>
                <div className="p-4 rounded-md border border-gray-300">

                {/* Products/Orders List - Row wise display for multiple orders */}
                <div className="mb-8 border border-gray-300 rounded-xl p-6">
  <h3 className="text-xl font-semibold mb-6 text-gray-800">Orders ({Array.isArray(selectedOrderDetails) ? selectedOrderDetails.length : 1})</h3>

  <div className="overflow-x-auto border border-gray-200 rounded-xl">
    <table className="min-w-full divide-y divide-gray-200 text-sm">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
            Item Details
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
            Price
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {(Array.isArray(selectedOrderDetails) ? selectedOrderDetails : [selectedOrderDetails]).map((order, index) => (
          <tr key={index} className="hover:bg-gray-50">
            {/* Item Details */}
            <td className="px-6 py-4 flex items-center space-x-4">
              <img
                src={
                  order.variant?.variantColors?.[0]?.modalImages?.[0]?.imageName
                    ? `${order.variant.variantColors[0].modalImages[0].imageName}`
                    : DefaultImage
                }
                alt="Product"
                className="w-14 h-14 rounded-md object-cover bg-gray-100"
              />
              <div>
                <p className="font-medium text-gray-800">
                  {order.productModelNumber?.name || "Product Name"}
                </p>
                <p className="text-xs text-gray-500">
                  {`${order?.productModelNumber?.productSpecification?.ram}GB` || "N/A"} / {`${order?.productModelNumber?.productSpecification?.rom}GB` || "N/A"}
                </p>
              </div>
            </td>

            {/* Charge */}
            <td className="px-6 py-4 text-center">
              ₹{order.price || 0}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

{/* Summary Section */}
<div className="flex justify-end mt-6">
  <div className="w-full md:w-1/3 border-t border-gray-200 pt-4 space-y-3">
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">Subtotal</span>
      <span className="text-gray-900">₹{selectedOrderDetails?.subtotal || 750}</span>
    </div>
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">
        Delivery <span className="text-gray-400 cursor-help">ⓘ</span>
      </span>
      <span className="text-gray-900">₹{selectedOrderDetails?.delivery || 0}</span>
    </div>
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">Discount</span>
      <span className="text-green-600">({selectedOrderDetails?.discountPercent || 20}%) - ₹{selectedOrderDetails?.discountValue || 150}</span>
    </div>
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">Coupons</span>
      <span className="text-gray-900">—</span>
    </div>
    <div className="flex justify-between border-t pt-3 text-base font-bold">
      <span className="text-gray-800">Total</span>
      <span className="text-gray-900">₹{selectedOrderDetails?.total || 600}</span>
    </div>
  </div>
</div>



              </div>

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
                    className={ShowModelCloseButtonClass}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={handlePrintDetails}
                    className={SubmitButtonClass}
                  >
                    <span>Print</span>
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