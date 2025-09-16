import { useEffect, useState } from 'react'
import ConfirmationModal from "../../components/ConfirmationModal";
import { DeleteClass, DeleteIcon, EditClass, EditIcon, inputClass, ShowModalMainClass, ShowModelCloseButtonClass, SubmitButtonClass, TableDataClass, TableHadeClass } from '../../helper/ApplicationConstants';
import Pagination from '../../helper/Pagination';
import { AppDispatch, RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../../components/Loading';
import { CreateCoupon, GetAllCoupons, Remove, Update, UpdateCoupon } from './CouponSlice';
import { toast } from 'react-toastify';

const Coupon = () => {
    const [showConfirmModal, setShowConfirmModal] = useState(false)
      const [showModal, setShowModal] = useState(false)
      const [currentPage, setCurrentPage] = useState(1);
      const [hoveredRow, setHoveredRow] = useState<number | null>(null);
      const [isLoaded, setIsLoaded] = useState(false);
      const [isEditMode, setIsEditMode] = useState(false);
      const [couponCode, setCouponCode] = useState("");
const [discountInPercent, setDiscountInPercent] = useState("");
const [expiredOn, setExpiredOn] = useState("");

      const dispatch = useDispatch<AppDispatch>()

      const {couponData, isLoading, Edit} = useSelector((state: RootState) => state.CouponSlice)
      
      const usersPerPage = 5;
      const couponArray = Array.isArray(couponData) ? couponData : couponData ? [couponData] : [];
  const paginatedUsers = couponArray?.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  const handleSaveClick = () =>{
    if(!couponCode || !discountInPercent || !expiredOn) {
        toast.warn("Please Fill All Details!!")
    }
    if(isEditMode && Edit?.coupon?.id) {
try {
  const updateData = {
    id: Edit?.coupon?.id,
    couponCode: couponCode,
    discountInPercent: discountInPercent,
    expiredOn: expiredOn,
    createdBy: {
      id: Edit?.coupon?.createdBy?.id
    },
  };

  dispatch(Update(updateData));
  dispatch(UpdateCoupon(updateData))
  .unwrap()
            .then((res: any) => {
              dispatch(GetAllCoupons());
              toast.success(res.message || "Coupon updated successfully!");
              handleCloseModal();
            })
            .catch((err: any) => {
              console.error("Update failed:", err);
              toast.error("Coupon update failed: " + err);
            });
} catch (error) {
  toast.error("Failed to update Coupon");
        console.error("Update error:", error);
}
    } else {
        setShowConfirmModal(true)
    }
  }

  const handleConfirmSave = () =>{
    const newCouponCode = {
        couponCode: couponCode,
        discountInPercent: discountInPercent,
        expiredOn: expiredOn,
    }
    dispatch(CreateCoupon(newCouponCode))
         .unwrap()
          .then((res: any) => {
            dispatch(GetAllCoupons()).then(() => {
              toast.success(res.message || "Coupon added successfully!");
              handleCloseModal();
            });
          })
          .catch((err: any) => {
            toast.error("Coupon creation failed: " + err);
            console.log("Coupon creation failed: " + err);
          });
  }

  const handleCloseModal = () =>{
    setShowConfirmModal(false);
    setShowModal(false);
    setCouponCode("");
    setDiscountInPercent("");
    setExpiredOn("")
    setIsEditMode(false);
  }

  const handleEditUser = (user: any) =>{
dispatch(Update(user));
setCouponCode(user?.couponCode || "")
setDiscountInPercent(user?.discountInPercent || 0);
  setExpiredOn(user?.expiredOn || "");

  setIsEditMode(true);
  setShowModal(true);
  }

  const handleDeleteUser = (userId: number) =>{
        console.log(`Delete user with ID: ${userId}`);
        dispatch(Remove(userId))
  }

  useEffect(() =>{
    setIsLoaded(true);
dispatch(GetAllCoupons())
  },[])

  useEffect(() =>{
if(Edit?.isEdit && Edit?.coupon) {
  setIsEditMode(true);
  setCouponCode(Edit?.coupon?.couponCode || "")
  setDiscountInPercent(Edit?.coupon?.discountInPercent || 0);
  setExpiredOn(Edit?.coupon?.expiredOn || "");
  setShowModal(true);
}
  },[Edit])

    {isLoading && <Loading overlay={true} />}

  return (
    <>
           <div className="md:overflow-y-hidden overflow-x-hidden">
             <div className="mt-10 flex items-center justify-between">
     
               {/* Left Section */}
               <div className="flex items-center gap-2">
                 <h1 className="font-bold text-2xl" >Coupons</h1>
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
        <th scope="col" className={TableHadeClass}>#</th>
        <th scope="col" className={TableHadeClass}>Coupon Code</th>
        <th scope="col" className={TableHadeClass}>Discount (%)</th>
        <th scope="col" className={TableHadeClass}>Expired On</th>
        <th scope="col" className={TableHadeClass}>Created By (Email)</th>
        <th scope="col" className={TableHadeClass}>Edit</th>
        <th scope="col" className={TableHadeClass}>Delete</th>
      </tr>
    </thead>

    {/* Table Body */}
    <tbody className="bg-white divide-y divide-gray-200">
      {paginatedUsers.map((coupon, index) => (
        <tr
          key={coupon?.id}
          className={`transform transition-all duration-300 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          } ${hoveredRow === coupon?.id ? 'bg-gray-50' : 'bg-white'}`}
          style={{ transitionDelay: `${index * 100}ms` }}
          onMouseEnter={() => setHoveredRow(coupon?.id)}
          onMouseLeave={() => setHoveredRow(null)}
        >
          {/* Index */}
          <td className={TableDataClass}>{coupon?.id}</td>

          {/* Coupon Code */}
          <td className={TableDataClass}>
            <div className="text-sm font-medium text-gray-600">
              {coupon?.couponCode ?? "--"}
            </div>
          </td>

          {/* Discount In Percent */}
          <td className={TableDataClass}>
            <div className="text-sm font-medium text-gray-600">
              {coupon?.discountInPercent ?? "--"}%
            </div>
          </td>

          {/* Expired On */}
          <td className={TableDataClass}>
            <div className="text-sm font-medium text-gray-600">
              {coupon?.expiredOn ?? "--"}
            </div>
          </td>

          {/* Created By Email */}
          <td className={TableDataClass}>
            <div className="text-sm font-medium text-gray-600">
              {coupon?.createdBy?.email ?? "--"}
            </div>
          </td>

          {/* Edit Button */}
          <td className={TableDataClass}>
            <button
              onClick={() => handleEditUser(coupon)}
              className={EditClass}
            >
              {EditIcon}
            </button>
          </td>

          {/* Delete Button */}
          <td className={TableDataClass}>
            <button
              onClick={() => handleDeleteUser(coupon?.id)}
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
                   totalCount={couponData?.length}
                   itemsPerPage={usersPerPage}
                   onPageChange={(page) => setCurrentPage(page)}
                 />
               </div>
             </div>
     
     
           </div>

{showModal && (
  <div className={ShowModalMainClass}>
    <div className="bg-white rounded-2xl shadow-xl p-8 w-[90%] max-w-xl relative">
      <h2 className="text-3xl font-semibold text-center mb-6">
        {isEditMode ? "Edit Coupon" : "Add Coupon"}
      </h2>

      {/* Close Icon */}
      <button
        className="absolute top-4 right-5 text-2xl font-bold text-gray-500 hover:text-black"
        onClick={handleCloseModal}
      >
        &times;
      </button>

      {/* Coupon Code */}
      <div className="mb-6">
        <label className="block text-lg font-medium mb-2">Coupon Code</label>
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Enter Coupon Code"
          className={inputClass}
        />
      </div>

      {/* Discount Percent */}
      <div className="mb-6">
        <label className="block text-lg font-medium mb-2">Discount In Percent</label>
        <input
          type="number"
          value={discountInPercent}
          onChange={(e) => setDiscountInPercent(e.target.value)}
          placeholder="Enter Discount Percent"
          className={inputClass}
        />
      </div>

      {/* Expire Date */}
      <div className="mb-6">
        <label className="block text-lg font-medium mb-2">Expired On</label>
        <input
          type="date"
          value={expiredOn}
          onChange={(e) => setExpiredOn(e.target.value)}
          className={inputClass}
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
          {isLoading ? "Saving..." : isEditMode ? "Update" : "Create"}
        </button>
      </div>
    </div>
  </div>
)}


      <ConfirmationModal
            isOpen={showConfirmModal}
            title="Confirm Coupon Creation"
            message={`Are you sure you want to add this Coupon "${couponCode}"?`}
            onConfirm={handleConfirmSave}
            onCancel={() => setShowConfirmModal(false)}
          />

              {isLoading && <Loading overlay={true} />}

    </>
  )
}

export default Coupon
