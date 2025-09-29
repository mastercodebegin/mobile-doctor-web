import { useEffect, useRef, useState } from 'react'
import Loading from '../../components/Loading'
import { GetAllCategory } from '../AddCategory/AddCategorySlice';
import { GetAllSubCategory } from '../AddSubCategory/SubCategorySlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { toast } from 'react-toastify';
import { capitalizeEachWord, DropDownClass, EditClass, EditIcon, getStatusBadgeClass, inputClass, pageSize, RoleIds, ShowModalMainClass, ShowModelCloseButtonClass, statusOptions, SubmitButtonClass, TableDataClass, TableHadeClass } from '../../helper/ApplicationConstants';
import Pagination from '../../helper/Pagination';
import { AssignToEngineer, FindUserByEmail, GetAllRepairUnitOrderByUserId, update, UpdateOrder } from './OrderSlice';
import DatePicker from '../../components/DatePicker';
import { UrlConstants } from '../../util/practice/UrlConstants';
import { getRequestMethodWithParam } from '../../util/CommonService';
import ConfirmationModal from '../../components/ConfirmationModal';
import { Filter, FunnelPlus, Mail, Phone, Search, User, X } from 'lucide-react';
import OrderProgressStepper from '../../components/OrderProgressStepper';
import DefaultImage from "../../assets/Laptop_Image.png"
import { debounce } from 'lodash';
import { DateRangePicker } from 'rsuite';


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
  expectedCompletedFromDate?: string;
  expectedCompletedToDate?: string;
}


const Order = ({ sidebarMobileOpen }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false)
  const [searchModel, setSearchModel] = useState(false);
  const [showDetailsModel, setShowDetailsModel] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const { Orders, isLoading, Edit, isEmailLoading } = useSelector((state: RootState) => state.OrderSlice);
  const [filterEmail, setFilterEmail] = useState<any>('')
  const [filterOrderId, setFilterOrderId] = useState('')
  const [managerId, setManagerId] = useState<number | null>(null);
  const [engineerId, setEngineerId] = useState<number | null>(null);
  const [pickupPartnerId, setPickupPartnerId] = useState<number | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  const [showAssign, setShowAssign] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [assignEmail, setAssignEmail] = useState('');

  const [unitRepairStatusEdit, setUnitRepairStatusEdit] = useState("PENDING");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [orderCompletedOn, setOrderCompletedOn] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const pickerRef = useRef<HTMLDivElement>(null);
  const [unitRepairStatus, setUnitRepairStatus] = useState<string>('');
  const [filterDate, setFilterDate] = useState({
    startDate: null,
    endDate: null
  });
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState([null, null]);

  const usersPerPage = 5;
  const OrderArray = Array.isArray(Orders) ? Orders : Orders ? [Orders] : [];
  const paginatedUsers = OrderArray?.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage)

  // // Date change handler - This function is Call By DatePicker
  const handleDateChange = (newValue, type = 'creation') => {
    console.log("Date changed:", newValue, "Type:", type);
    if (type === 'creation') {
      setFilterDate(newValue);
    } else if (type === 'expectedDelivery') {
      setExpectedDeliveryDate(newValue);
    }
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
      const formatDateForAPI = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      filterObj.fromDate = formatDateForAPI(filterDate.startDate);
      filterObj.toDate = formatDateForAPI(filterDate.endDate);

      console.log('Date filter applied:', {
        fromDate: filterObj.fromDate,
        toDate: filterObj.toDate
      });
    }

    // Add expected delivery date filter if selected (RSuite DateRangePicker format) 
    if (expectedDeliveryDate && expectedDeliveryDate[0] && expectedDeliveryDate[1]) {
      const formatDateTimeForAPI = (date) => {
        // Check if date is a Date object or needs conversion
        const dateObj = date instanceof Date ? date : new Date(date);

        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
        const seconds = String(dateObj.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
      };

      filterObj.expectedCompletedFromDate = formatDateTimeForAPI(expectedDeliveryDate[0]);
      filterObj.expectedCompletedToDate = formatDateTimeForAPI(expectedDeliveryDate[1]);

      console.log('Expected delivery date filter applied:', {
        expectedCompletedFromDate: filterObj.expectedCompletedFromDate,
        expectedCompletedToDate: filterObj.expectedCompletedToDate
      });
    }

    // Combine base filters with additional filters
    const finalFilterObj = { ...baseFilterObj, ...filterObj };

    console.log('Final API call with filters:', finalFilterObj);
    dispatch(GetAllRepairUnitOrderByUserId(finalFilterObj)).then(() => {
      setShowConfirmModal(false)
      handleCloseModal()
    })
  };

  const handleSearchEmail = async () => {

    const isUpdating = isEditMode && Edit?.order?.orderId;

    try {
      setLoading(true);
      const isApplyAction = !filterEmail && !filterOrderId && !isUpdating;

      if (isApplyAction) {
        getAllUnitOrderCommonFunction();
        setShowFilter(false);
        setLoading(false);
        return;
      }

      if (filterEmail && !filterOrderId) {
        console.log("Calling API with email:", filterEmail);
        const res = await getRequestMethodWithParam({ email: filterEmail }, UrlConstants.GET_USRE_BY_EMAIL);
        console.log(res);
        console.log("API Response:", res);

        if (!res || !res?.role || !res?.id || !res?.role?.name) {
          console.error("Invalid response from API");
          toast.error("Failed to fetch user data. Please try again.");
          setLoading(false);
          return;
        }

        const roleName = res?.role?.name?.toLowerCase();
        const userId = res?.id;

        if (!roleName || !userId) {
          toast.warning("Invalid user data. Please try again.");
          setFilterEmail("");
          setLoading(false);
          setShowFilter(true);
          return;
        }

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
          setShowFilter(true);
          return;
        }

        setShowConfirmModal(true);
        setSearchModel(false);
      } else if (filterOrderId && !filterEmail) {
        try {
          await getAllUnitOrderCommonFunction();

          if (Orders.length > 0) {
            setSearchModel(false);
            setFilterOrderId("");
            setLoading(false);
          } else {
            toast.error("Invalid Order ID! Please enter a valid Order ID.");
            setFilterOrderId("");
            setLoading(false);
            setSearchModel(true);
          }
        } catch (error) {
          toast.error("Failed to fetch order. Please try again.");
          setLoading(false);
          setSearchModel(true);
        }
      } else if (isUpdating || isEditMode) {
        console.log("✅ UPDATE FLOW");

        try {
          const updateOrder = {
            orderId: Edit.order.orderId,
            unitRepairStatus: unitRepairStatusEdit,
            price: price,
            defectDescriptionByEngineer: description,
            orderCompletedOn: orderCompletedOn || Edit.order.orderCompletedOn
          };

          dispatch(update(updateOrder));

          const updateResult = await dispatch(UpdateOrder(updateOrder?.orderId)).unwrap();
          console.log("Update successful:", updateResult);
          await getAllUnitOrderCommonFunction();
          toast.success(updateResult.message || "Order Updated Successfully!");
          handleCloseModal();
        } catch (error: any) {
          console.error("Edit error:", error);
          toast.error("Order Update Failed: " + error.message || error);
        }
      } else {
        toast.warning("Please fill only one field (Email OR Order Id)");
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Error fetching user by email:", error);
      toast.error(error.message || "An error occurred");
      setLoading(false);
      setShowFilter(true);
    }
  };

  const handleConfirmSave = () => {
    if (managerId || pickupPartnerId || engineerId) {
      getAllUnitOrderCommonFunction()
    }
    handleCloseModal()
  }

  // Add debounced search function after state declarations
  const debouncedSearch = debounce(async (email, roleId) => {
    if (email && email.length >= 1) {
      try {
        const requestData = {
          pageSize: 10,
          pageNumber: 0,
          email: email,
          roleId: roleId,
        };
        const response = await dispatch(FindUserByEmail(requestData)).unwrap();
        setSearchResults(response.content || []);
        setShowSearchResults(true);
      } catch (error) {
        console.error('Search failed:', error);
        setSearchResults([]);
        setShowSearchResults(false);
      }
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, 300); // 300ms debounce delay

  // Add search input handler
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setAssignEmail(value);
    if (selectedOrderDetails?.engineer) {
      debouncedSearch(value, RoleIds.engineer); // Pass roleId for engineer
    } else if (selectedOrderDetails?.pickupPartner) {
      debouncedSearch(value, RoleIds.pickupPartner); // Pass roleId for pickup partner
    } else {
      debouncedSearch(value, null); // No roleId if neither engineer nor pickup partner is selected
    }
  };

  // Add user selection handler
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setAssignEmail(user.email);
    setShowSearchResults(false);
  };

  // Add assign engineer handler
  const handleAssignEngineer = async () => {
    if (!selectedUser) {
      toast.error('Please select a user first');
      return;
    }

    try {
      setLoading(true);
      const requestData = {
        assignTo: selectedUser.id,
        orderId: selectedOrderDetails.orderId,
      };

      const response = await dispatch(AssignToEngineer(requestData)).unwrap();
      toast.success('Engineer assigned successfully!');

      // Refresh order details
      await getAllUnitOrderCommonFunction();
      handleCloseModal();
    } catch (error) {
      console.error('Assignment failed:', error);
      toast.error(error.message || 'Failed to assign engineer');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowAssign(false);
    setShowConfirmModal(false);
    setIsEditMode(false);
    setLoading(false);
    setSearchModel(false);
    setShowDetailsModel(false);
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
    setFilterDate({
      startDate: null,
      endDate: null
    });
    setExpectedDeliveryDate([null, null]);
    setSearchResults([]);
    setShowSearchResults(false);
    setSelectedUser(null);
    setAssignEmail('');
  }

  const handleClearFilter = () => {
    setFilterDate({ startDate: null, endDate: null });
    setExpectedDeliveryDate([null, null]);
    setUnitRepairStatus('');
    setManagerId(null);
    setEngineerId(null);
    setPickupPartnerId(null);
    setSearchModel(false);
    setFilterEmail("");
    setFilterOrderId("");
    setCurrentPage(1);
    setIsFilterApplied(false);
    setShowFilter(false);
    getAllUnitOrderCommonFunction();
  };

  const handleEditUser = (user) => {
    console.log("Edit User with User :--", user);

    dispatch(update(user));

    setIsEditMode(true);
    setSearchModel(true);

    // Populate input fields with user data
    setUnitRepairStatusEdit(user?.order?.unitRepairStatus || "");
    setDescription(user?.order?.defectDescriptionByEngineer || "");
    setPrice(user?.order?.finalPrice || "");

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
      setPrice(Edit.order.finalPrice);
      setUnitRepairStatusEdit(Edit.order.unitRepairStatus);
    }
  }, [Edit]);

  useEffect(() => {
    setIsLoaded(true);
    dispatch(GetAllCategory());
    dispatch(GetAllSubCategory());
    getAllUnitOrderCommonFunction()
  }, [])

  { isLoading && <Loading overlay={true} /> }

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dateNum = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${dateNum} ${month} ${year}`;
  };


  const firstOrder = Array.isArray(selectedOrderDetails) ? selectedOrderDetails[0] : selectedOrderDetails;
  const HoverEffect = "rounded-xl p-6 mb-8 rounded-l-lg shadow border-l-4 border-gray-400"

  return (
    <>
      <div className="md:overflow-y-hidden overflow-x-hidden" >

        <div className="mt-10 flex items-start space-x-5 justify-start px-8">

          {/* Filter Button */}
          <button
            type='button'
            title='Filter'
            onClick={() => setShowFilter(true)}
            className="transition"
          >
            {isFilterApplied ? (
              <FunnelPlus className="text-cyan-500" />
            ) : (
              <Filter className="text-gray-500 hover:text-gray-600" />
            )}
          </button>

          {showFilter && (
            <>
              {/* <div className="w-[450px] fixed left-85 bottom-0 z-40 bg-white border border-gray-300 rounded-xl shadow-lg flex flex-col max-h-[90vh]"> */}
              <div className={`w-[450px] fixed bottom-0 z-40 bg-white border border-gray-300 rounded-xl shadow-lg flex flex-col max-h-[90vh] transition-all duration-300 ${sidebarMobileOpen ? 'left-85' : 'left-20'
                }`}>

                {/* Header - Fixed at top */}
                <div className="flex items-center justify-between mb-4 p-4 pb-0 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-cyan-500" />
                    <h3 className="text-lg font-semibold text-gray-800">Filter</h3>
                  </div>
                  <X onClick={() => setShowFilter(false)} className="w-5 h-5 text-gray-500 cursor-pointer" />
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto px-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <hr className='text-gray-300 w-full pt-3 mb-4' />

                  {/* Date Range */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Date Range</label>
                      <button
                        onClick={() => setFilterDate({
                          startDate: null,
                          endDate: null
                        })}
                        className="text-sm text-cyan-600 hover:underline"
                      >
                        Reset
                      </button>
                    </div>
                    <DatePicker
                      value={filterDate}
                      onChange={handleDateChange}
                      sidebarMobileOpen={sidebarMobileOpen}
                    />
                  </div>

                  <hr className='text-gray-300 w-full pt-3 mb-4' />

                  {/* Expected Delivery Date Range */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Expected Delivery Date Range</label>
                      <button
                        onClick={() => {
                          setExpectedDeliveryDate([null, null]);
                        }}
                        className="text-sm text-cyan-600 hover:underline"
                      >
                        Reset
                      </button>
                    </div>

                    <DateRangePicker
                      format="dd MMM yyyy hh:mm aa"
                      showMeridian
                      rangeColors={["#06b6d4"]}
                      showSeconds
                      ranges={[]}
                      value={expectedDeliveryDate}
                      onChange={(newValue) => setExpectedDeliveryDate(newValue)}
                      style={{
                       border: `3px solid  #06b6d4`,
                        borderRadius: "9px",
                      }}
                      container={() => document.body}
                      menuStyle={{ zIndex: 9999 }}
                      cleanable={false}
                      placement="bottomStart"
                      appearance="subtle"
                      // onOpen={() => {
                      //   if (pickerRef.current) {
                      //     pickerRef.current.style.border = "2px solid #06b6d4"; 
                      //   }
                      // }}
                      // onOk={() => {
                      //   if (pickerRef.current) {
                      //     pickerRef.current.style.border = "2px solid #06b6d4"; 
                      //   }
                      // }}
                      // onClose={() => {
                      //   if (pickerRef.current) {
                      //     pickerRef.current.style.border = "2px solid #06b6d4"; 
                      //   }
                      // }}
                    />

                  </div>

                  <hr className='text-gray-300 w-full pt-3 mb-4' />

                  {/* Status */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <button onClick={() => setUnitRepairStatus('')} className="text-sm text-cyan-600 hover:underline">Reset</button>
                    </div>
                    <select
                      value={unitRepairStatus}
                      onChange={(e) => setUnitRepairStatus(e.target.value)}
                      className={DropDownClass}
                    >
                      <option value="">Select Status</option>
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {capitalizeEachWord(status.replace(/_/g, ' '))}
                        </option>
                      ))}
                    </select>
                  </div>

                  <hr className='text-gray-300 w-full pt-3 mb-4' />

                  {/* Email Search */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Email Search</label>
                      <button onClick={() => setFilterEmail('')} className="text-sm text-cyan-600 hover:underline">Reset</button>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={filterEmail}
                        onChange={(e) => setFilterEmail(e.target.value)}
                        className={`w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-sm focus:ring-2 focus:ring-gray-500 focus:outline-none ${!!filterOrderId ? 'cursor-not-allowed opacity-50' : ''}`}
                        placeholder="Enter Email"
                        disabled={!!filterOrderId}
                      />
                    </div>
                  </div>

                  <hr className='text-gray-300 w-full pt-3 mb-4' />

                  {/* Order-ID Search */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Order Id Search</label>
                      <button onClick={() => setFilterOrderId('')} className="text-sm text-cyan-600 hover:underline">Reset</button>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={filterOrderId}
                        onChange={(e) => setFilterOrderId(e.target.value)}
                        className={`w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-sm focus:ring-2 focus:ring-gray-500 focus:outline-none ${!!filterEmail ? 'cursor-not-allowed opacity-50' : ''}`}
                        placeholder="Enter Order Id"
                        disabled={!!filterEmail}
                      />
                    </div>
                  </div>

                  <hr className='text-gray-300 w-full pt-3 mb-4' />
                </div>

                {/* Footer Buttons - Fixed at bottom */}
                <div className="flex justify-between gap-2 p-4 pt-0 flex-shrink-0">
                  <button type='button' onClick={handleClearFilter} className={ShowModelCloseButtonClass}>
                    Reset
                  </button>
                  <button
                    type='submit'
                    onClick={() => {
                      handleSearchEmail();
                      setShowFilter(false);
                      setIsFilterApplied(true);
                    }}
                    className={SubmitButtonClass}>
                    Apply Now
                  </button>
                </div>
              </div>
            </>
          )}

        </div>

        <div className="bg-gray-50 p-4 mt-2 min-h-screen">
          <div className="max-w-7xl mx-auto bg-white rounded-lg shadow overflow-hidden">

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr>
                    <th scope="col" className={TableHadeClass}>Product Image</th>
                    <th scope="col" className={TableHadeClass}>Order ID</th>
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
                  {paginatedUsers?.length > 0 ? (
                    paginatedUsers?.map((user, index) => (
                      <tr
                        key={user?.id}
                        className={`transform transition-all duration-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                          } ${hoveredRow === user.id ? 'bg-gray-50' : 'bg-white'}`}
                        style={{ transitionDelay: `${index * 100}ms` }}
                        onMouseEnter={() => setHoveredRow(user.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                      >
                        {/* Product Image */}
                        <td className={TableDataClass}>
                          <div className="flex items-center space-x-3">
                            <img
                              src={`${user.repairUnitImages?.[0]?.imageName}`}
                              className="w-14 h-14 object-contain border border-gray-300 rounded-md"
                              alt="Product"
                            />
                            <span className='flex flex-col'>
                              <h4 className='text-black' >{user.productModelNumber?.name || ""}</h4>
                              <span>{`${user.productModelNumber?.productSpecification?.ram}GB` || ""} / {`${user.productModelNumber?.productSpecification?.rom || ""}GB`}</span>
                              <span>{capitalizeEachWord(user.productModelNumber?.brand?.name) || ""}</span>
                            </span>
                          </div>
                        </td>

                        {/* Order ID */}
                        <td className={TableDataClass}>{user.orderId}</td>

                        {/* Status */}
                        <td className={TableDataClass}>
                          <span className={`px-3 py-2 rounded-xl text-xs font-medium tracking-widest ${getStatusBadgeClass(user.unitRepairStatus, true)}`}>
                            {capitalizeEachWord(user.unitRepairStatus?.replace(/_/g, ' '))}
                          </span>
                        </td>

                        {/* Price */}
                        <td className={TableDataClass}>{user?.finalPrice ? `₹${user?.finalPrice}` : ""}</td>

                        {/* Created */}
                        <td className={TableDataClass}>
                          {formatDate(user?.orderOn)}
                        </td>

                        {/* Expected Delivery */}
                        <td className={TableDataClass}>
                          {formatDate(user?.expectedCompletedOn)}
                        </td>


                        {/* Description */}
                        <td className={`text-center ${TableDataClass}`}> {user?.defectDescriptionByEngineer ? (user.defectDescriptionByEngineer) : (<span className="font-bold text-lg">-</span>)}</td>

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
                        {unitRepairStatus ? `No orders found for status: ${capitalizeEachWord(unitRepairStatus).replace(/_/g, ' ')}` : 'No orders found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>


            </div>

            {/* Reusable Pagination Component */}
            <Pagination
              currentPage={currentPage}
              totalCount={Orders?.length}
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
              <button
                className="absolute top-4 right-5 text-2xl font-bold text-gray-500 hover:text-black"
                onClick={handleCloseModal}
              >
                &times;
              </button>

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
                          {capitalizeEachWord(status).replace(/_/g, ' ')}
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
                        <div className="flex items-start justify-center flex-col">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800">
                              {`${capitalizeEachWord(firstOrder?.customer?.firstName)} ${capitalizeEachWord(firstOrder?.customer?.lastName)}`}
                            </h3>
                          </div>
                          <div dir="ltr" className="flex items-center space-x-2 p-2 rounded-xl bg-white">
                            <Mail className="w-4 h-4 text-black" />
                            <span>{firstOrder.customer?.email || ""}</span>
                          </div>
                          <div dir="ltr" className="flex items-center space-x-2 px-2 rounded-xl bg-white">
                            <Phone className="w-4 h-4 text-black" />
                            <span>+91 {firstOrder.customer?.mobile || ""}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Side: Details Card */}
                      <div dir="rtl" className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 md:mt-0 md:ml-8 md:w-auto ">

                        {selectedOrderDetails?.onlineOrder && (
                          <button
                            onClick={() => setShowAssign(true)}
                            type='button'
                            dir="ltr"
                            className="flex items-center space-x-2 p-2 border border-gray-300 rounded-xl bg-white">
                            <User className="w-4 h-4 text-black" />
                            <span>
                              {selectedOrderDetails?.pickupPartner ? 'Re Assign To Pickup Partner' : 'Assign To Pickup Partner'}
                            </span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setShowAssign(true)}
                          dir="ltr"
                          className="flex items-center space-x-2 p-2 border border-gray-300 rounded-xl bg-white"
                        >
                          <User className="w-4 h-4 text-black" />
                          <span>
                            {selectedOrderDetails?.engineer ? 'Re Assign To Engineer' : 'Assign To Engineer'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Progress Stepper-1 - Show overall progress based on actual dates */}
                  <div className={`rounded-xl p-6 mb-4 rounded-l-lg shadow border-l-4 border-cyan-500`}>
                    <OrderProgressStepper selectedOrderDetails={selectedOrderDetails} />
                  </div>

                  {/* Address Information Card Section */}
                  {(() => {
                    try {
                      const addressData = typeof firstOrder?.userAddress === 'string'
                        ? JSON.parse(firstOrder.userAddress)
                        : firstOrder?.userAddress;

                      if (addressData) {
                        return (
                          <div className="mb-8 border border-gray-300 rounded-xl p-6">
                            <h3 className="text-xl font-semibold mb-6 text-gray-800">Delivery Address</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <span className="text-sm font-medium text-gray-600">Name:</span>
                                  <p className="text-gray-800">{`${addressData?.firstName || ''} ${addressData?.lastName || ''}`.trim() || ''}</p>
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-gray-600">Mobile:</span>
                                  <p className="text-gray-800">{addressData?.mobileNumber || ''}</p>
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-gray-600">City:</span>
                                  <p className="text-gray-800">{addressData?.city || ''}</p>
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-gray-600">State:</span>
                                  <p className="text-gray-800">{addressData?.state || ''}</p>
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-gray-600">Zip Code:</span>
                                  <p className="text-gray-800">{addressData?.zipCode || ''}</p>
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-gray-600">Address Type:</span>
                                  <p className="text-gray-800 capitalize">{addressData?.addressType || ''}</p>
                                </div>
                                {addressData?.landMark && (
                                  <div>
                                    <span className="text-sm font-medium text-gray-600">Landmark:</span>
                                    <p className="text-gray-800">{addressData.landMark}</p>
                                  </div>
                                )}
                                <div className="md:col-span-2">
                                  <span className="text-sm font-medium text-gray-600">Address:</span>
                                  <p className="text-gray-800">{addressData?.address || ''}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    } catch (error) {
                      console.error('Error parsing address:', error);
                      return (
                        <div className="mb-8 border border-gray-300 rounded-xl p-6">
                          <h3 className="text-xl font-semibold mb-6 text-gray-800">Delivery Address</h3>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-600">Address information not available</p>
                          </div>
                        </div>
                      );
                    }
                  })()}

                  {/* User Description Section */}
                  {(() => {
                    const description = selectedOrderDetails?.userDefectDescription;

                    return (
                      <div className="mb-8 border border-gray-300 rounded-xl p-6">
                        {/* Header with Icon */}
                        <div className="flex items-center gap-x-2 mb-6">
                          <h3 className="text-xl font-semibold text-gray-800">User Description</h3>
                        </div>

                        {/* Content based on condition */}
                        {description && description.trim() !== "" ? (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-800 font-medium">{description}</p>
                          </div>
                        ) : (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-600">Description not available</p>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Manager Description Section */}
                  {(() => {
                    const manager = selectedOrderDetails?.createdBy;

                    return (
                      <div className="mb-8 border border-gray-300 rounded-xl p-6">
                        {/* Header with Icon */}
                        <div className="flex items-center gap-x-2 mb-6">
                          <h3 className="text-xl font-semibold text-gray-800">Manager Description</h3>
                        </div>

                        {/* Content */}
                        {manager ? (
                          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-gray-500">Full Name</p>
                                <p className="font-medium text-gray-800">
                                  {manager.firstName} {manager.lastName}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Mobile</p>
                                <p className="font-medium text-gray-800">{manager.mobile}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Email</p>
                                <p className="font-medium text-gray-800">{manager.email}</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-600">Manager details not available</p>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Engineer Details Section */}
                  {(() => {
                    const engineer = selectedOrderDetails?.engineer;
                    return (
                      <div className="mb-8 border border-gray-300 rounded-xl p-6">
                        {/* Header with Icon */}
                        <div className="flex items-center gap-x-2 mb-6">
                          <h3 className="text-xl font-semibold text-gray-800">Engineer Details</h3>
                        </div>

                        {/* Content based on condition */}
                        {engineer ? (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-xs text-gray-500">First Name:</p>
                                <p className="font-medium text-gray-800">{engineer?.firstName}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Last Name:</p>
                                <p className="font-medium text-gray-800">{engineer?.lastName}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Mobile:</p>
                                <p className="font-medium text-gray-8000">{engineer?.mobile}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Email:</p>
                                <p className="font-medium text-gray-800">{engineer?.email}</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-600">Engineer details not available</p>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Condition :- Show if onlineOrder */}
                  {selectedOrderDetails.onlineOrder && (
                    <>
                      {/* Pickup Partner Details Section */}
                      {(() => {
                        const engineer = selectedOrderDetails?.pickupPartner;
                        return (
                          <div className="mb-8 border border-gray-300 rounded-xl p-6">
                            {/* Header with Icon */}
                            <div className="flex items-center gap-x-2 mb-6">
                              <h3 className="text-xl font-semibold text-gray-800">Pickup-Partner Details</h3>
                            </div>

                            {/* Content based on condition */}
                            {engineer ? (
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="text-xs text-gray-500">First Name:</p>
                                    <p className="font-medium text-gray-800">{engineer?.firstName}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Last Name:</p>
                                    <p className="font-medium text-gray-800">{engineer?.lastName}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Mobile:</p>
                                    <p className="font-medium text-gray-8000">{engineer?.mobile}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Email:</p>
                                    <p className="font-medium text-gray-800">{engineer?.email}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Role:</p>
                                    <p className="font-medium text-gray-800 capitalize">{engineer?.role?.name}</p>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-600">Pickup-Partner details not available</p>
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      {/* Recieve From Partner Section */}
                      {(() => {
                        const engineer = selectedOrderDetails?.recievedByFromPartner;
                        return (
                          <div className="mb-8 border border-gray-300 rounded-xl p-6">
                            {/* Header with Icon */}
                            <div className="flex items-center gap-x-2 mb-6">
                              <h3 className="text-xl font-semibold text-gray-800">Recieve Partner Details</h3>
                            </div>

                            {/* Content based on condition */}
                            {engineer ? (
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="text-xs text-gray-500">First Name:</p>
                                    <p className="font-medium text-gray-800">{engineer?.firstName}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Last Name:</p>
                                    <p className="font-medium text-gray-800">{engineer?.lastName}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Mobile:</p>
                                    <p className="font-medium text-gray-8000">{engineer?.mobile}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Email:</p>
                                    <p className="font-medium text-gray-800">{engineer?.email}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Role:</p>
                                    <p className="font-medium text-gray-800 capitalize">{engineer?.role?.name}</p>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-600">Recieve Partner details not available</p>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </>
                  )}


                  {/* Global Descriptions Section - Common for all orders */}
                  <div
                    className={`${HoverEffect} px-4 py-2 ${!selectedOrderDetails?.cancelReason && !selectedOrderDetails?.delayReason ? "hidden" : ""
                      }`}
                  >
                    <h3 className={"text-lg font-semibold mb-2 text-gray-800"}>Overall Problem Description</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedOrderDetails?.cancelReason && (
                        <div className="bg-white p-4 rounded-lg">
                          <span className="font-medium text-red-600">Cancel Reason:</span>
                          <p className="text-red-500 mt-1">{selectedOrderDetails.cancelReason}</p>
                        </div>
                      )}
                      {selectedOrderDetails?.delayReason && (
                        <div className="bg-white p-4 rounded-lg">
                          <span className="font-medium text-orange-600">Delay Reason:</span>
                          <p className="text-orange-500 mt-1">{selectedOrderDetails.delayReason}</p>
                        </div>
                      )}
                    </div>
                  </div>


                  {/* Defective Part Information */}
                  {selectedOrderDetails?.defectivePart && (
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
                    <h3 className="text-xl font-semibold mb-6 text-gray-800">Orders Summary</h3>

                    <div className="overflow-x-auto border border-gray-200 rounded-xl">
                      <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                              Model Number
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-l border-gray-300">
                              Unit Issue
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider border-l border-gray-300">
                              Price
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {(Array.isArray(selectedOrderDetails) ? selectedOrderDetails : [selectedOrderDetails]).map((order, index) => (
                            order?.unitProblemDetails?.map((detail, detailIndex) => (
                              <tr
                                key={`${index}-${detailIndex}`}
                                className="hover:bg-gray-50"
                              >
                                {/* Model Number + Specs */}
                                <td className="px-6 py-4 flex items-center space-x-4">
                                  <img
                                    src={
                                      order.variant?.variantColors?.[0]?.modalImages?.[0]
                                        ?.imageName || DefaultImage
                                    }
                                    alt="Product"
                                    className="w-14 h-14 rounded-md object-cover bg-gray-100"
                                  />
                                  <div>
                                    <p className="font-medium text-gray-800">
                                      {detail?.repairCost?.productModelNumber?.name ||
                                        order?.productModelNumber?.name ||
                                        "Product Name"}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {detail?.repairCost?.productModelNumber
                                        ?.productSpecification?.ram
                                        ? `${detail.repairCost.productModelNumber.productSpecification.ram}GB`
                                        : ""}{" "}
                                      /{" "}
                                      {detail?.repairCost?.productModelNumber
                                        ?.productSpecification?.rom
                                        ? `${detail.repairCost.productModelNumber.productSpecification.rom}GB`
                                        : ""}
                                    </p>
                                  </div>
                                </td>

                                {/* Unit Issue */}
                                <td className="px-6 py-4 text-left border-l border-gray-300">
                                  {detail?.productPart?.name || ""}
                                </td>

                                {/* Price (Prefer repairCost.price if available) */}
                                <td className="px-6 py-4 text-center border-l border-gray-300">
                                  ₹
                                  {detail?.repairCost?.price ||
                                    detail?.price ||
                                    order?.price ||
                                    0}
                                </td>
                              </tr>
                            ))
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Summary Section */}
                  <div className="flex justify-end mt-6">
                    <div className="w-full md:w-1/3 border shadow border-gray-200 p-6 rounded-xl space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-gray-900">
                          ₹{(() => {
                            const orders = Array.isArray(selectedOrderDetails)
                              ? selectedOrderDetails
                              : [selectedOrderDetails];

                            const subtotal = orders.reduce((total, order) => {
                              const unitTotal = (order?.unitProblemDetails || []).reduce(
                                (unitSum, detail) => {
                                  const repairCostPrice =
                                    parseFloat(detail?.repairCost?.price) || 0;
                                  return unitSum + repairCostPrice;
                                },
                                0
                              );

                              return total + unitTotal;
                            }, 0);

                            return subtotal;
                          })()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Advanced
                        </span>
                        <span className="text-gray-900">₹{selectedOrderDetails?.advance || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Discount</span>
                        <span className="text-green-600">₹{selectedOrderDetails?.discount || 0.0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Coupons</span>
                        <span className="text-gray-900">{selectedOrderDetails?.coupon || ""}</span>
                      </div>
                      <div className="flex justify-between border-t pt-3 text-base font-bold">
                        <span className="text-gray-800">Total</span>
                        <span className="text-gray-900">
                          ₹{(() => {
                            const orders = Array.isArray(selectedOrderDetails)
                              ? selectedOrderDetails
                              : [selectedOrderDetails];

                            //  Subtotal calculation
                            const subtotal = orders.reduce((total, order) => {
                              const unitTotal = (order?.unitProblemDetails || []).reduce(
                                (unitSum, detail) => unitSum + (parseFloat(detail?.repairCost?.price) || 0),
                                0
                              );
                              return total + unitTotal;
                            }, 0);

                            //  Advanced (percentage of subtotal)
                            const advancePercent = parseFloat(selectedOrderDetails?.advance) || 0;

                            //  Discount (percentage of subtotal)
                            const discountPercent = parseFloat(selectedOrderDetails?.discount) || 0;
                            const discountAmount = (subtotal * discountPercent) / 100;

                            //  Coupon (fixed amount)
                            const couponAmount = parseFloat(selectedOrderDetails?.coupon) || 0;

                            //  Final total
                            return subtotal + advancePercent - discountAmount - couponAmount;
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex justify-end items-center p-8 pt-0">
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

      {showAssign && (
        <>
          <div className={ShowModalMainClass}>
            <div
              className={`bg-white rounded-2xl shadow-xl p-8 w-[95%] max-w-4xl relative overflow-y-auto flex flex-col ${(assignEmail.length > 0 || selectedUser || searchResults.length > 0)
                ? "h-[70vh]"
                : ""
                }`}
            >

              {/* Close */}
              <button
                className="absolute top-4 right-5 text-2xl font-bold text-gray-500 hover:text-black"
                onClick={() => {
                  setShowAssign(false);
                  setAssignEmail(''); // Clear assignEmail state
                  setSearchResults([]); // Clear searchResults state
                  setSelectedUser(null); // Clear selectedUser state
                }}
              >
                &times;
              </button>

              <div className="mb-6 relative">
                <label className="block text-lg font-medium mb-2">Search</label>
                <input
                  type="email"
                  value={assignEmail}
                  onChange={handleSearchInputChange}
                  className={`${inputClass}`}
                  placeholder="Enter Email"
                />

                {/* Loader Spinner */}
                {isEmailLoading && (
                  <div className="flex justify-center items-center py-8">
                    <div className="relative">
                      <div
                        className="w-16 h-16 border border-white rounded-full animate-spin"
                        style={{ animationDuration: '2s' }}
                      >
                        <div
                          className="absolute inset-0 border-3 border-transparent border-y-cyan-600 border-l-cyan-600 rounded-full animate-spin"
                          style={{ animationDuration: '2s' }}
                        />
                      </div>
                      <p className="text-center text-gray-600 mt-4">Loading Email...</p>
                    </div>
                  </div>
                )}

                {/* Search Results Dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg overflow-y-auto h-[35vh]">
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => handleUserSelect(user)}
                        className="px-6 py-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {user.firstName?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">
                              {`${user.firstName} ${user.lastName}`}
                            </div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                            <div className="text-xs text-gray-400 capitalize">
                              Role: {user.role?.name}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* No Results Found */}
                {!isEmailLoading && showSearchResults && searchResults.length === 0 && assignEmail.length >= 1 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-4">
                    <p className="text-gray-500 text-center">No users found</p>
                  </div>
                )}
              </div>

              {/* Selected User Display */}
              {selectedUser && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Selected User:</h4>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                      {selectedUser.firstName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="font-medium">{`${selectedUser.firstName} ${selectedUser.lastName}`}</div>
                      <div className="text-sm text-gray-500">{selectedUser.email}</div>
                      <div className="text-sm text-gray-400 capitalize">Role: {selectedUser.role?.name}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-auto pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAssign(false);
                    setAssignEmail(''); // Clear assignEmail state
                    setSearchResults([]); // Clear searchResults state
                    setSelectedUser(null); // Clear selectedUser state
                  }}
                  className={ShowModelCloseButtonClass}
                >
                  Close
                </button>
                <button
                  type="submit"
                  onClick={handleAssignEngineer}
                  disabled={loading || !selectedUser}
                  className={`${SubmitButtonClass} ${(!selectedUser || loading) ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  {loading ? 'Assigning...' : 'Assign'}
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

      {/* ADD this overlay loading at the end */}
      {isLoading && <Loading overlay={true} />}

    </>
  )
}

export default Order