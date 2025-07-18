import React, { useEffect, useState } from 'react'
import Loading from '../../components/Loading'
import { GetAllCategory } from '../AddCategory/AddCategorySlice';
import { GetAllSubCategory, GetAllSubCategoryById } from '../AddSubCategory/SubCategorySlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { toast } from 'react-toastify';
import { EditClass, EditIcon, getStatusBadgeClass, pageSize, ShowVarientButtonClass, SubmitButtonClass, TableDataClass, TableHadeClass } from '../../helper/ApplicationConstants';
import Pagination from '../../helper/Pagination';
import { GetAllRepairUnitOrderByDate, GetAllRepairUnitOrderByStatus, GetAllRepairUnitOrderByUserId } from './OrderSlice';

const Order = () => {

      const [showConfirmModal, setShowConfirmModal] = useState(false);
      const [showModal, setShowModal] = useState(false);
      const [currentPage, setCurrentPage] = useState(1);
      const [hoveredRow, setHoveredRow] = useState<number | null>(null);
      const [isEditMode, setIsEditMode] = useState(false);
      const [isLoaded, setIsLoaded] = useState(false);

      //  const [filterSubCategory, setFilterSubCategory] = useState<any>(null);
      //   const [filterCategory, setFilterCategory] = useState<any>(null);
        const [filterStatus, setFilterStatus] = useState<string>('');
        const [filterDate, setFilterDate] = useState<string>('');

        const dispatch = useDispatch<AppDispatch>();

        const {Orders, isLoading} = useSelector((state: RootState) => state.OrderSlice)
         const { SubCategoriesData } = useSelector((state: RootState) => state.SubCategorySlice)
          const { data } = useSelector((state: RootState) => state.AddCategorySlice)

            const usersPerPage = 5;
              const paginatedUsers = Orders.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage)

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

      // // Filter Category Change - Top Left Filter
      // const handleFilterCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      //   const selectedValue = e.target.value;
    
      //   if (selectedValue === "") {
      //     setFilterCategory(null);
      //     setFilterSubCategory(null);
      //     setFilterStatus('');
      //     setCurrentPage(1);
      //     return;
      //   }
    
      //   const selectedCat = JSON.parse(selectedValue);
      //   setFilterCategory(selectedCat);
      //   setFilterSubCategory(null);
      //   setFilterStatus('');
    
      //   // API call to get subcategories by category ID
      //   dispatch(GetAllSubCategoryById(selectedCat.id))
      //     .unwrap()
      //     .then((res: any) => {
      //       console.log("Filter SubCategories Response:", res);
      //       setCurrentPage(1);
      //     })
      //     .catch((err: any) => {
      //       console.log("Filter SubCategories API Error:", err);
      //       toast.error("Failed to fetch subcategories");
      //     });
      // };
    
      // // Filter SubCategory Change - Top Left Filter
      // const handleFilterSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      //   const selectedValue = e.target.value;
    
      //   if (selectedValue === "") {
      //     setFilterSubCategory(null);
      //     setFilterStatus('');
      //     setCurrentPage(1);
      //     return;
      //   }
    
      //   const selectedSubCat = JSON.parse(selectedValue);
      //   setFilterSubCategory(selectedSubCat);
      //   setFilterStatus('');
      //   setCurrentPage(1);
      // };

      // Filter Status Change - New function
     
      //  By Status
      const handleFilterStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedStatus = e.target.value;
        setFilterStatus(selectedStatus);
        setCurrentPage(1);

        // API call to fetch orders by status
        dispatch(GetAllRepairUnitOrderByStatus(selectedStatus))
          .unwrap()
          .then((res: any) => {
            console.log("Orders by Status Response:", res);
          })
          .catch((err: any) => {
            console.log("Orders by Status API Error:", err);
            toast.error("Failed to fetch orders by status");
          });

          console.log("Selected Status Type:", typeof selectedStatus);
console.log("Selected Status Value:", selectedStatus);
      };

      // By Date
      const handleFilterDate = () => {
  if (!filterDate) {
    toast.error("Please select a date first");
    return;
  }

  const payload = {
    pageSize,
    pageNumber: currentPage,
    // date: filterDate.trim(), // in yyyy-mm-dd format
    // date: '01-06-2024', 
  };

  dispatch(GetAllRepairUnitOrderByDate(payload))
    .unwrap()
    .then((res: any) => {
      console.log("Orders by Date Response:", res);
    })
    .catch((err: any) => {
      console.log("Orders by Date API Error:", err);
      toast.error("Failed to fetch orders by date");
    });
};


     // Clear filter function
     const handleClearFilter = () => {
      //  setFilterCategory(null);
      //  setFilterSubCategory(null);
       setFilterStatus('');
       setCurrentPage(1);
        dispatch(GetAllRepairUnitOrderByUserId());
     };

    const handleEditUser = (user: any) =>{
        console.log("Edit User with User :--", user)
    }

    useEffect(() =>{
        setIsLoaded(true);
        dispatch(GetAllCategory());
        dispatch(GetAllSubCategory());
        dispatch(GetAllRepairUnitOrderByUserId())

    },[])

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

 <div className="mt-10 flex items-center justify-between">

  {/* Left Section */}
          <div className="flex items-center gap-2">
            {/* Category Filter */}
            {/* <select
              value={filterCategory ? JSON.stringify(filterCategory) : ""}
              onChange={handleFilterCategoryChange}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              {data?.map((category) => (
                <option key={category.id} value={JSON.stringify(category)}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* SubCategory Filter - Only show when category is selected *}
            {filterCategory && (
              <select
                value={filterSubCategory ? JSON.stringify(filterSubCategory) : ""}
                onChange={handleFilterSubCategoryChange}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select SubCategory</option>
                {SubCategoriesData?.filter(subCat => subCat.category?.id === filterCategory?.id)?.map((subCat) => (
                  <option key={subCat.id} value={JSON.stringify(subCat)}>
                    {subCat.name}
                  </option>
                ))}
              </select>
            )} */}

            {/* Status Filter - Only show when subcategory is selected */}
            {/* {filterSubCategory && ( */}
              <select
                value={filterStatus}
                onChange={handleFilterStatusChange}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Status</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            {/* )} */}

            {(
              // filterCategory && filterSubCategory ||
               filterStatus) && (
              <button
                onClick={handleClearFilter}
                className="text-red-400 hover:text-red-600 text-sm bg-red-50 px-2 py-1 rounded"
              >
                Clear Filter
              </button>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
          <input
  type="date"
  value={filterDate}
  onChange={(e) => setFilterDate(e.target.value)}
  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
<button
  onClick={handleFilterDate}
  className={ShowVarientButtonClass}
>
  Filter by Date
</button>

{filterDate && (
  <button
    onClick={handleClearFilter}
    className="text-red-400 hover:text-red-600 text-sm bg-red-50 px-2 py-1 rounded ml-2"
  >
    Clear Date
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
      <th scope="col" className={TableHadeClass}>Edit</th>
    </tr>
  </thead>
  <tbody className="bg-white divide-y divide-gray-200">
    {paginatedUsers.length > 0 ? (
      paginatedUsers?.map((user, index) => (
        <tr
          key={user.id}
          className={`transform transition-all duration-300 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
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
                className="w-14 h-14 object-contain border rounded-md"
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
          {filterStatus ? `No orders found for status: ${filterStatus.replace(/_/g, ' ')}` : 'No orders found'}
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

    </>
  )
}

export default Order