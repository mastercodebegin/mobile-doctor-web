import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import Pagination from '../../helper/Pagination';
import { DeleteClass, DeleteIcon, EditClass, EditIcon, inputClass, InventoryView, ShowModalMainClass, ShowModelCloseButtonClass, ShowVarientButtonClass, SubmitButtonClass, TableDataClass, TableHadeClass } from '../../helper/ApplicationConstants';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import { GetAllCategory } from '../AddCategory/AddCategorySlice';
import { GetAllSubCategory, GetAllSubCategoryById } from '../AddSubCategory/SubCategorySlice';
import { GetAllModalIssues } from '../ModalIssues/ModalIssuesSlice';
import { CreateInventory, DeleteInventory, GetAllProductPart, GetAllProductPartBySubCategoryId, restore, Update, UpdateInventory } from './ProductPartSlice';
import ConfirmationModal from '../../components/ConfirmationModal';

const ProductPart = () => {

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [filterSubCategory, setFilterSubCategory] = useState<any>(null);
  const [filterCategory, setFilterCategory] = useState<any>(null);
  const [selectedProductPartLabel, setSelectedProductPartLabel] = useState<any>(null)
  const [quantity, setQuantity] = useState<any>(0);
  const [notes, setNotes] = useState<any>("");
  const [history, setHistory] = useState<any>(null);
  const [expandedHistory, setExpandedHistory] = useState<{ [key: number]: boolean }>({});

  const dispatch = useDispatch<AppDispatch>();

  const { ProductPartData, isLoading, Edit } = useSelector((state: RootState) => state.InventorySlice)
  const { SubCategoriesData } = useSelector((state: RootState) => state.SubCategorySlice)
  const { data } = useSelector((state: RootState) => state.AddCategorySlice)
  const { ModalIssuesData } = useSelector((state: RootState) => state.ModalIssuesSlice);

  const usersPerPage = 5;
  const paginatedUsers = ProductPartData.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage)

  // Static history data - will be replaced with API call later
  const getHistoryData = (inventoryId: number) => {
    return [
      {
        id: 1,
        action: "Added",
        quantity: 10,
        previousQuantity: 0,
        notes: "Initial stock added",
        date: "2024-01-15",
        time: "10:30 AM",
        user: "Admin"
      },
      {
        id: 2,
        action: "Updated",
        quantity: 15,
        previousQuantity: 10,
        notes: "Stock increased due to new delivery",
        date: "2024-01-16",
        time: "02:15 PM",
        user: "Manager"
      },
      {
        id: 3,
        action: "Reduced",
        quantity: 12,
        previousQuantity: 15,
        notes: "Sold 3 units to customer",
        date: "2024-01-17",
        time: "11:45 AM",
        user: "Sales Team"
      },
      {
        id: 4,
        action: "Updated",
        quantity: 20,
        previousQuantity: 12,
        notes: "Restocked from warehouse",
        date: "2024-01-18",
        time: "09:20 AM",
        user: "Warehouse Staff"
      },
      {
        id: 5,
        action: "Reduced",
        quantity: 18,
        previousQuantity: 20,
        notes: "Damaged items removed",
        date: "2024-01-19",
        time: "04:30 PM",
        user: "Quality Control"
      },
      {
        id: 6,
        action: "Updated",
        quantity: 25,
        previousQuantity: 18,
        notes: "Bulk order received",
        date: "2024-01-20",
        time: "01:00 PM",
        user: "Admin"
      },
      {
        id: 7,
        action: "Reduced",
        quantity: 22,
        previousQuantity: 25,
        notes: "Return to supplier",
        date: "2024-01-21",
        time: "03:45 PM",
        user: "Purchase Team"
      },
      {
        id: 8,
        action: "Updated",
        quantity: 30,
        previousQuantity: 22,
        notes: "New shipment arrived",
        date: "2024-01-22",
        time: "10:15 AM",
        user: "Receiving Dept"
      }
    ];
  };

  // Filter Category Change - Top Left Filter
  const handleFilterCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;

    if (selectedValue === "") {
      setFilterCategory(null);
      setFilterSubCategory(null);
      setCurrentPage(1);
      dispatch(GetAllModalIssues());
      return;
    }

    const selectedCat = JSON.parse(selectedValue);
    setFilterCategory(selectedCat);
    setFilterSubCategory(null);

    // API call to get subcategories by category ID
    dispatch(GetAllSubCategoryById(selectedCat.id))
      .unwrap()
      .then((res: any) => {
        console.log("Filter SubCategories Response:", res);
        setCurrentPage(1);
      })
      .catch((err: any) => {
        console.log("Filter SubCategories API Error:", err);
        toast.error("Failed to fetch subcategories");
      });
  };

  // Filter SubCategory Change - Top Left Filter
  const handleFilterSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;

    if (selectedValue === "") {
      setFilterSubCategory(null);
      setCurrentPage(1);
      return;
    }

    const selectedSubCat = JSON.parse(selectedValue);
    setFilterSubCategory(selectedSubCat);

    // API call to fetch modal issues by subcategory
    dispatch(GetAllProductPartBySubCategoryId({ subCategoryId: selectedSubCat.id }))
      .unwrap()
      .then((res: any) => {
        console.log("Filtered Data Response:", res);
        setCurrentPage(1);
      })
      .catch((err: any) => {
        console.log("Filter API Error:", err);
        toast.error("Failed to fetch filtered data");
      });
  };

  // Clear filter function
  const handleClearFilter = () => {
    setFilterCategory(null);
    setFilterSubCategory(null);
    setCurrentPage(1);
    dispatch(GetAllProductPart());
  };

  const handleSaveClick = () => {
    if (!quantity || !notes.trim()) {
      alert("Please Enter All Input Fields.");
      return;
    }

    if (!selectedProductPartLabel) {
      alert("Please Select A Product-Part-Label.");
      return;
    }

    if (isEditMode && Edit.inventory.id) {
      try {
        // Prepare the updated data
        const updatedData = {
          ...Edit.inventory,
          quantity: quantity,
          notes: notes,
          productPart: selectedProductPartLabel
        };

        // Update Redux state
        dispatch(Update(updatedData));

        // Call API with the updated data directly
        dispatch(UpdateInventory({
          id: Edit.inventory.id,
          updateData: updatedData
        }))
          .unwrap()
          .then((res: any) => {
            console.log("Update Response :-", res);
            toast.success(res.message || "Inventory Updated Successfully");
            dispatch(GetAllProductPart());
            handleCloseModal();
          })
          .catch((err: any) => {
            console.log("Update Failed :-", err);
            toast.error("Inventory Update Failed");
          });
      } catch (error: any) {
        toast.error("Failed To Update Product-Part");
        console.log("Update Error :--", error);
      }
    } else {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmSave = () => {
    const newInventory = {
      quantity: quantity,
      notes: notes,
      productPart: selectedProductPartLabel,
    }

    console.log(newInventory)

    dispatch(CreateInventory(newInventory))
      .unwrap()
      .then((res: any) => {
        setQuantity(0);
        setNotes("");
        setSelectedProductPartLabel(null);
        setShowModal(false);
        setShowConfirmModal(false);
        toast.success(res.message || "Inventory Added Successfully!");

        // Refresh the data
        dispatch(GetAllProductPart());
      })
      .catch((err: any) => {
        setShowConfirmModal(false);
        toast.error("Inventory Creation Failed: " + err);
      });
  }

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditMode(false);
    setQuantity(0);
    setNotes("");
    setSelectedProductPartLabel(null);
    dispatch(restore())
  }

  const handleEditUser = (user: any) => {
    console.log("Edit User with User :--", user)
    dispatch(Update(user))
    setShowModal(true);
    setQuantity(user.quantity)
    setNotes(user.notes)
    setSelectedProductPartLabel(user.productPart)

    // If editing, set the quantity and fetch productpartlabel
    if (user?.productPart?.id) {
      setSelectedProductPartLabel(user.productPart);
      dispatch(GetAllProductPartBySubCategoryId(user.productPart.subCategory.id))
        .unwrap()
        .then((res: any) => {
          console.log("Edit Mode SubCategories Fetched :", res)
        })
        .catch((err: any) => {
          console.log("Error Fetching SubCategories For Edit : ", err);
        })
    }
  }

  const handleDeleteUser = (userId: number) => {
    console.log("Delete User with ID: --", userId)
    if (window.confirm("Are you sure you want to delete this Inventory?")) {
      dispatch(DeleteInventory(userId.toString()))
        .unwrap()
        .then((res: any) => {
          console.log("Delete successful:", res);
          toast.success("Inventory deleted successfully!");
        })
        .catch((err: any) => {
          console.log("Delete Failed:", err);
          toast.error("Failed to delete Inventory: " + err);
        });
    }
  }

  // Handle history toggle
  const handleHistoryToggle = (userId: number) => {
    if (history === userId) {
      setHistory(null);
      setExpandedHistory({});
    } else {
      setHistory(userId);
      setExpandedHistory({ [userId]: false });
    }
  };

  // Handle view more toggle
  const handleViewMore = (userId: number) => {
    setExpandedHistory(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  // Render history row
  const renderHistoryRow = (user: any) => {
    const historyData = getHistoryData(user.id);
    const isExpanded = expandedHistory[user.id];
    const displayedHistory = isExpanded ? historyData : historyData.slice(0, 5);

    return (
      <tr key={`history-${user.id}`} className="bg-gray-50">
        <td colSpan={9} className="px-6 py-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                History for {user.productPart.name}
              </h3>
              <span className="text-sm text-gray-500">
                Total Records: {historyData.length}
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity Change
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayedHistory.map((record, index) => (
                    <tr key={record.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{record.date}</div>
                          <div className="text-gray-500">{record.time}</div>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          record.action === 'Added' ? 'bg-green-100 text-green-800' :
                          record.action === 'Updated' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {record.action}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500">{record.previousQuantity}</span>
                          <span className="text-gray-400">→</span>
                          <span className={`font-medium ${
                            record.quantity > record.previousQuantity ? 'text-green-600' : 
                            record.quantity < record.previousQuantity ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {record.quantity}
                          </span>
                          <span className={`text-xs ${
                            record.quantity > record.previousQuantity ? 'text-green-600' : 
                            record.quantity < record.previousQuantity ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            ({record.quantity > record.previousQuantity ? '+' : ''}{record.quantity - record.previousQuantity})
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        <div className="max-w-xs truncate" title={record.notes}>
                          {record.notes}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {record.user}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* View More Button */}
            {historyData.length > 5 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => handleViewMore(user.id)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isExpanded ? (
                    <>
                      <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      View Less
                    </>
                  ) : (
                    <>
                      <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      View More ({historyData.length - 5} more records)
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </td>
      </tr>
    );
  };

  useEffect(() => {
    setIsLoaded(true);
    dispatch(GetAllProductPart())
    dispatch(GetAllCategory());
    dispatch(GetAllSubCategory());
  }, [])

  // Sync data to localStorage whenever InventoryData changes
  useEffect(() => {
    if (ProductPartData.length > 0) {
      localStorage.setItem('product-part', JSON.stringify(ProductPartData));
    }
  }, [ProductPartData])

  useEffect(() => {
    if (Edit?.isEdit && Edit?.inventory) {
      setIsEditMode(true);
      setQuantity(Edit?.inventory?.quantity || 0);
      setNotes(Edit?.inventory?.notes);
      setSelectedProductPartLabel(Edit?.inventory?.productPart);
      setShowModal(true)
    } else {
      setIsEditMode(false);
      setQuantity(0);
      setNotes("");
      setSelectedProductPartLabel(null);
    }
  }, [Edit])

  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <div className="md:overflow-y-hidden overflow-x-hidden" >

        <div className="mt-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Category Filter */}
            <select
              value={filterCategory ? JSON.stringify(filterCategory) : ""}
              onChange={handleFilterCategoryChange}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Filter by Category</option>
              {data?.map((category) => (
                <option key={category.id} value={JSON.stringify(category)}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* SubCategory Filter - Only show when category is selected */}
            {filterCategory && (
              <select
                value={filterSubCategory ? JSON.stringify(filterSubCategory) : ""}
                onChange={handleFilterSubCategoryChange}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Filter by SubCategory</option>
                {SubCategoriesData?.filter(subCat => subCat.category?.id === filterCategory?.id)?.map((subCat) => (
                  <option key={subCat.id} value={JSON.stringify(subCat)}>
                    {subCat.name}
                  </option>
                ))}
              </select>
            )}

            {(filterCategory || filterSubCategory) && (
              <button
                onClick={handleClearFilter}
                className="text-red-400 hover:text-red-600 text-sm bg-red-50 px-2 py-1 rounded"
              >
                Clear Filter
              </button>
            )}
          </div>

          {/* Add Button */}
          <div className="flex items-center gap-4">
            <button onClick={() => setShowModal(true)} className={SubmitButtonClass}>Add</button>
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
                      ID
                    </th>
                    <th scope="col" className={TableHadeClass}>
                      Product Image
                    </th>
                    <th scope="col" className={TableHadeClass}>
                      Name
                    </th>
                    <th scope="col" className={TableHadeClass}>
                      Quantity
                    </th>
                    <th scope="col" className={TableHadeClass}>
                      Notes
                    </th>
                    <th scope="col" className={TableHadeClass}>
                      Edit
                    </th>
                    <th scope="col" className={TableHadeClass}>
                      Delete
                    </th>
                    <th scope="col" className={TableHadeClass}>
                      View History
                    </th>
                    <th scope="col" className={TableHadeClass}>
                      Extra
                    </th>
                  </tr>
                </thead>
                {/* Table Body */}
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers?.map((user, index) => (
                      <React.Fragment key={user?.id}>
                        <tr
                          className={`transform transition-all duration-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                            } ${hoveredRow === user.id ? 'bg-gray-50' : 'bg-white'}`}
                          style={{ transitionDelay: `${index * 100}ms` }}
                          onMouseEnter={() => setHoveredRow(user.id)}
                          onMouseLeave={() => setHoveredRow(null)}
                        >
                          <td className={TableDataClass}>{user.id}</td>
                          <td className={TableDataClass}>
                            <div className='flex items-center space-x-2' >
                              <img src="https://tse4.mm.bing.net/th/id/OIP.FVpPrz3IlNVDLpKMLC3D2wHaHa?pid=Api&P=0&h=180" className="w-15 h-15 object-contain border rounded-md" alt="Iphone Image" />
                              <span>
                                <h4 className='text-black' >{user.productPart.subCategory.name}</h4>
                                <p>{user.productPart.subCategory.category.name}</p>
                              </span>
                            </div>
                          </td>
                          <td className={TableDataClass}>{user.productPart.name}</td>
                          <td className={TableDataClass}>{user.quantity}</td>
                          <td className={TableDataClass}>{user.notes}</td>
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
                              onClick={() => handleDeleteUser(user.id)}
                              className={DeleteClass}
                            >
                              {DeleteIcon}
                            </button>
                          </td>
                          <td className={TableDataClass}>
                            <button
                              onClick={() => handleHistoryToggle(user.id)}
                              className={`${ShowVarientButtonClass} ${history === user.id ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                            >
                              {history === user.id ? (
                                <>
                                  <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  Hide History
                                </>
                              ) : (
                                <>
                                  <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  View History
                                </>
                              )}
                            </button>
                          </td>
                          <td className={TableDataClass}>
                            <button className={InventoryView}>View</button>
                          </td>
                        </tr>

                        {/* History Row */}
                        {history === user.id && renderHistoryRow(user)}
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                        {filterSubCategory ? 'No modal issues found for selected subcategory' : 'No modal issues found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Reusable Pagination Component */}
            <Pagination
              currentPage={currentPage}
              totalCount={ProductPartData.length}
              itemsPerPage={usersPerPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>

      {showModal && (
        <>
          <div className={ShowModalMainClass} >
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-xl w-[90%] relative">
              <h2 className="text-3xl font-semibold text-center mb-6">
                {isEditMode ? "Edit Product Part" : "Add Product Part"}
              </h2>

              {/* Close Icon */}
              <button
                className="absolute top-4 right-5 text-2xl font-bold text-gray-500 hover:text-black"
                onClick={handleCloseModal}
              >
                &times;
              </button>

              {/* Product-Part-Label Selection */}
              <div className="mb-6">
                <label className="block text-lg font-medium mb-2">Product-Part-Label</label>
                <select
                  value={selectedProductPartLabel ? JSON.stringify(selectedProductPartLabel) : ""}
                  onChange={(e) => {
                    const selectedObject = JSON.parse(e.target.value);
                    setSelectedProductPartLabel(selectedObject);
                  }}
                  className={`${inputClass} ${isEditMode ? "cursor-not-allowed bg-gray-100" : ""}`}
                  disabled={isEditMode}
                >
                  <option value="" disabled>Select Product-Part-Label</option>
                  {ModalIssuesData?.map((category) => (
                    <option key={category.id} value={JSON.stringify(category)}>
                      {category.name} ({category.subCategory.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Input Field */}
              <div className="mb-6">
                <label className="block text-lg font-medium mb-2">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Add Quantity"
                  className={inputClass}
                />
              </div>

              {/* Input Field */}
              <div className="mb-6">
                <label className="block text-lg font-medium mb-2">Notes</label>
                <textarea
                  name='message'
                  value={notes}
                  rows={4}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add Notes"
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
                  {isLoading ? 'Saving...' : (isEditMode ? 'UPDATE' : 'SAVE CHANGES')}
                </button>
              </div>
            </div>
          </div>

          <ConfirmationModal
            isOpen={showConfirmModal}
            title="Confirm Modal-Issue Creation"
            message={`Are you sure you want to add Product-Part "${selectedProductPartLabel?.name}"?`}
            onConfirm={handleConfirmSave}
            onCancel={() => setShowConfirmModal(false)}
          />
        </>
      )}
    </>
  )
}

export default ProductPart