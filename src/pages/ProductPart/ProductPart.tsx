import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import Pagination from '../../helper/Pagination';
import { DeleteClass, DeleteIcon, EditClass, EditIcon, inputClass, InventoryView, pageSize, ShowModalMainClass, ShowModelCloseButtonClass, ShowVarientButtonClass, SubmitButtonClass, TableDataClass, TableHadeClass } from '../../helper/ApplicationConstants';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import { GetAllCategory } from '../AddCategory/AddCategorySlice';
import { GetAllSubCategory, GetAllSubCategoryById } from '../AddSubCategory/SubCategorySlice';
import { GetAllModalIssues } from '../ModalIssues/ModalIssuesSlice';
import { CreateInventory, DeleteInventory, GetAllProductPart, GetAllProductPartBySubCategoryId, restore, Update, UpdateInventory, ReFillInventory, InventoryHistory, OrderInventoryUse } from './ProductPartSlice';
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

  // ReFill specific states
  const [isReFillMode, setIsReFillMode] = useState(false);
  const [selectedInventoryForReFill, setSelectedInventoryForReFill] = useState<any>(null);
  const [isOrderUseMode, setIsOrderUseMode] = useState<any>(false);
  const [unitRepairOrderId, setUnitRepairOrderId] = useState<any>("");

  const dispatch = useDispatch<AppDispatch>();

  const { ProductPartData, isLoading, Edit, History } = useSelector((state: RootState) => state.InventorySlice)
  const isHistoryLoading = History?.isLoading || false;
  const { SubCategoriesData } = useSelector((state: RootState) => state.SubCategorySlice)
  const { data } = useSelector((state: RootState) => state.AddCategorySlice)
  const { ModalIssuesData } = useSelector((state: RootState) => state.ModalIssuesSlice);

  const usersPerPage = 5;
  const paginatedUsers = ProductPartData.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage)

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

  // ReFill functionality
  const handleReFillClick = (inventory: any) => {
    setSelectedInventoryForReFill(inventory);
    setIsReFillMode(true);
    setIsOrderUseMode(false);
    setShowModal(true);
    setQuantity(0);
    setNotes("");
    setUnitRepairOrderId("");
  };

  // Use functionality
  const handleUseClick = (inventory: any) => {
    setSelectedInventoryForReFill(inventory);
    setIsReFillMode(false);
    setIsOrderUseMode(true);
    setShowModal(true);
    setQuantity(0);
    setNotes("");
    setUnitRepairOrderId("");
  };

  const handleSaveClick = () => {
    if (isOrderUseMode) {
      // Order Use Mode
      if (!unitRepairOrderId.trim() || !notes.trim()) {
        alert("Please Enter All Input Fields.");
        return;
      }

      if (!selectedInventoryForReFill) {
        alert("Please Select An Inventory Item.");
        return;
      }

      const orderUseData = {
        inventoryId: selectedInventoryForReFill.id,
        unitRepairOrderId: unitRepairOrderId,
        note: notes
      };

      console.log("Order Use Data:", orderUseData);

      dispatch(OrderInventoryUse(orderUseData))
        .unwrap()
        .then((res: any) => {
          setQuantity(0);
          setNotes("");
          setUnitRepairOrderId("");
          setSelectedInventoryForReFill(null);
          setIsOrderUseMode(false);
          setShowModal(false);
          toast.success(res.message || "Inventory Used Successfully!");
          dispatch(GetAllProductPart());
        })
        .catch((err: any) => {
          toast.error("Order Use Failed: " + err);
        });
    } 
    // else if (!quantity || !notes.trim()) {
    //   alert("Please Enter All Input Fields.");
    //   return;
    // } 
    else if (isReFillMode) {
      // ReFill Mode
      if (!selectedInventoryForReFill) {
        alert("Please Select An Inventory Item.");
        return;
      }

      const reFillData = {
        inventoryId: selectedInventoryForReFill.id,
        quantity: parseInt(quantity),
        notes: notes
      };

      console.log("ReFill Data:", reFillData);

      dispatch(ReFillInventory(reFillData))
        .unwrap()
        .then((res: any) => {
          setQuantity(0);
          setNotes("");
          setSelectedInventoryForReFill(null);
          setIsReFillMode(false);
          setShowModal(false);
          toast.success(res.message || "Inventory ReFilled Successfully!");
          dispatch(GetAllProductPart());
        })
        .catch((err: any) => {
          toast.error("ReFill Failed: " + err);
        });
    } else if (isEditMode && Edit?.inventory?.id) {
      // Edit Mode
      if (!selectedProductPartLabel) {
        alert("Please Select A Product-Part-Label.");
        return;
      }

      try {
        const updatedData = {
          ...Edit.inventory,
          quantity: quantity,
          notes: notes,
          productPart: selectedProductPartLabel
        };

        dispatch(Update(updatedData));

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
      // Add Mode
      if (!selectedProductPartLabel) {
        alert("Please Select A Product-Part-Label.");
        return;
      }

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
    setIsReFillMode(false);
    setIsOrderUseMode(false);
    setQuantity(0);
    setNotes("");
    setUnitRepairOrderId("");
    setSelectedProductPartLabel(null);
    setSelectedInventoryForReFill(null);
    dispatch(restore())
  }

  const handleEditUser = (user: any) => {
    console.log("Edit User with User :--", user)
    dispatch(Update(user))
    setShowModal(true);
    setQuantity(user.quantity)
    setNotes(user.notes)
    setSelectedProductPartLabel(user.productPart)
    setIsEditMode(true);
    setIsReFillMode(false);
    setIsOrderUseMode(false);

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
      setExpandedHistory({});
      setHistory(null);
    } else {
      const historyData = {
        id: userId,
        pageSize : pageSize || 10,
        pageNumber: 0,
      };

      // ✅ Only dispatch if id is defined
      if (userId && typeof userId === 'number') {
        dispatch(InventoryHistory(historyData));
      } else {
      console.error('Invalid userId for history fetch:', userId);
      toast.error('Invalid user ID for history fetch');
      return;
    }

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
  const isExpanded = expandedHistory[user.id];

  const filteredHistory = Array.isArray(History?.data)
    ? History.data.filter(
        (item) => item?.inventory?.productPart?.id === user?.productPart?.id,
      )
    : [];

  /* ----------  Summary numbers ---------- */
  const totalOrders = filteredHistory.filter((r) => r.unitRepair).length;
  const totalUsed   = filteredHistory
    .filter((r) => r.unitRepair)
    .reduce((sum, r) => sum + (r.quantity || 0), 0);
  const remaining   = user?.productPart?.quantity ?? 0;

  return (
    <tr key={`history-${user?.id}`} className="bg-gray-50">
      <td colSpan={10} className="px-6 py-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              History for {user.productPart?.name}
            </h3>
            <span className="text-sm text-gray-500">
              Total Records: {filteredHistory.length}
            </span>
          </div>

          {/* Summary */}
          <div className="mb-4 text-sm">
            <span className="font-semibold">Total Orders:</span> {totalOrders} &nbsp;&nbsp;
            <span className="font-semibold">Units Used:</span> {totalUsed} &nbsp;&nbsp;
            <span className="font-semibold">Units Left:</span> {remaining}
          </div>

          {isHistoryLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="relative">
                <div
                  className="w-16 h-16 border border-white rounded-full animate-spin"
                  style={{ animationDuration: '2s' }}
                >
                  <div
                    className="absolute inset-0 border-3 border-transparent border-y-gray-600 border-l-gray-600 rounded-full animate-spin"
                    style={{ animationDuration: '2s' }}
                  />
                </div>
                <p className="text-center text-gray-600 mt-4">Loading history...</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {!filteredHistory.length ? (
                <div className="text-center text-red-500 py-8">
                  <p className="text-lg">📋 Inventory History Not Available</p>
                  <p className="text-sm text-gray-500 mt-2">
                    No history records found for this product
                  </p>
                </div>
              ) : (
                (() => {
                  const displayedHistory = isExpanded
                    ? filteredHistory
                    : filteredHistory.slice(0, 5);

                  return (
                    <>
                      <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2 text-left">Date</th>
                            <th className="px-4 py-2 text-left">Time</th>
                            <th className="px-4 py-2 text-left">Action</th>
                            <th className="px-4 py-2 text-left">Quantity Change</th>
                            <th className="px-4 py-2 text-left">Total Qty</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2 text-left">Customer</th>
                            <th className="px-4 py-2 text-left">Used By</th>
                            <th className="px-4 py-2 text-left">Notes</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {displayedHistory.map((record) => {
                            // Date / Time
                            const date = record.usedOn?.split('T')[0] || record.usedOn || '--';
                            const time = record.usedOn?.split('T')[1]?.slice(0, 5) || '--';

                            // Action
                            let action = 'Updated';
                            if (record.new && !record.refill) action = 'Added';
                            if (record.refill) action = 'Re-Filled';
                            if (record.unitRepair) action = 'Used';

                            // Quantity Change string
                            const prevQty = record.previousQuantity ?? 0;
                            const newQty  = record.updatedQuantity ?? 0;
                            const diff    = newQty - prevQty;
                            const qtyText = `${prevQty} → ${newQty} (${diff >= 0 ? '+' : ''}${diff})`;

                            // Status badge
                            let statusBadge = { label: 'Updated', color: 'bg-gray-100 text-gray-800' };
                            if (record.unitRepair)
                              statusBadge = { label: 'Unit Repair', color: 'bg-yellow-100 text-yellow-800' };
                            else if (record.refill)
                              statusBadge = { label: 'Re-Filled', color: 'bg-green-100 text-green-800' };
                            else
                              statusBadge = { label: 'Utilise', color: 'bg-red-100 text-red-800' };

                            return (
                              <tr key={record.id}>
                                <td className="px-4 py-2">{date}</td>
                                <td className="px-4 py-2">{time}</td>
                                <td className="px-4 py-2 font-medium">{action}</td>
                                <td className={`px-4 py-2 font-medium ${diff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
  {qtyText}
</td>
                                <td className="px-4 py-2">{record.inventory?.quantity ?? '--'}</td>
                                <td className="px-4 py-2">
                                  <span
                                    className={`px-2 py-1 text-xs font-semibold rounded-full ${statusBadge.color}`}
                                  >
                                    {statusBadge.label}
                                  </span>
                                </td>
                                <td className="px-4 py-2">
                                  {record.unitRepair?.user
                                    ? `${record.unitRepair.user.firstName} ${record.unitRepair.user.lastName}`
                                    : '--'}
                                </td>
                                <td className="px-4 py-2">
                                  {record.user
                                    ? `${record.user.firstName} ${record.user.lastName}`
                                    : '--'}
                                </td>
                                <td className="px-4 py-2">{record.notes || '--'}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>

                      {filteredHistory.length > 5 && !isExpanded && (
                        <div className="mt-4 text-center">
                          <button
                            onClick={() => handleViewMore(user.id)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 transition-colors"
                          >
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                            View More ({filteredHistory.length - 5})
                          </button>
                        </div>
                      )}
                    </>
                  );
                })()
              )}
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
      setIsReFillMode(false);
      setIsOrderUseMode(false);
      setQuantity(Edit?.inventory?.quantity || 0);
      setNotes(Edit?.inventory?.notes || "");
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
                      ReFill
                    </th>
                    <th scope="col" className={TableHadeClass}>
                      View History
                    </th>
                    <th scope="col" className={TableHadeClass}>
                      Use
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
                              onClick={() => handleReFillClick(user)}
                              className={InventoryView}
                            >
                              ReFill
                            </button>
                          </td>
                          <td className={TableDataClass}>
                            <button
                              onClick={() => handleHistoryToggle(user.id)}
                              className={EditClass}
                            >
                              {history === user.id ? (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20V4m0 0l6 6m-6-6L6 10" />
                                  </svg>
                                </>
                              ) : (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0 0l-6-6m6 6l6-6" />
                                  </svg>
                                </>
                              )}
                            </button>
                          </td>
                          <td className={TableDataClass}>
                            <button 
                              onClick={() => handleUseClick(user)}
                              className={InventoryView}
                            >
                              Use
                            </button>
                          </td>
                        </tr>

                        {/* History Row */}
                        {history === user.id && renderHistoryRow(user)}
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="px-6 py-4 text-center text-gray-500">
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

 {/* Add/Edit Modal */}
       {showModal && (
        <>
          <div className={ShowModalMainClass}>
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-xl w-[90%] relative">
              <h2 className="text-3xl font-semibold text-center mb-6">
                {isReFillMode ? "Re-Fill Inventory" : isEditMode ? "Edit Product Part" : "Add Product Part"}
              </h2>

              {/* Close Icon */}
              <button
                className="absolute top-4 right-5 text-2xl font-bold text-gray-500 hover:text-black"
                onClick={handleCloseModal}
              >
                &times;
              </button>

{/* Re-Fill Mode */}
              {selectedInventoryForReFill && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-lg mb-2">Selected Product:</h3>
                  <p className="text-gray-700">{selectedInventoryForReFill.productPart.name}</p>
                  <p className="text-gray-600 text-sm">Current Quantity: {selectedInventoryForReFill.quantity}</p>
                  <p className="text-gray-600 text-sm">Category: {selectedInventoryForReFill.productPart.subCategory.category.name}</p>
                  <p className="text-gray-600 text-sm">SubCategory: {selectedInventoryForReFill.productPart.subCategory.name}</p>
                </div>
              )}


              {/* Product-Part-Label Selection - Only for Add/Edit Mode */}
              {!isReFillMode && !isOrderUseMode && (
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
              )}

              {/* Order Id */}
              {isOrderUseMode && (
                <div className="mb-6">
                  <label className="block text-lg font-medium mb-2">
                    Order ID
                  </label>
                  <input
                    type="text"
                    value={unitRepairOrderId}
                    onChange={(e) => setUnitRepairOrderId(e.target.value)}
                    className={inputClass}
                    placeholder="Enter Order ID"
                  />
                </div>
              )}

              {/* Quantity Input */}
            {!isOrderUseMode && (
                <div className="mb-6">
                <label className="block text-lg font-medium mb-2">
                  {isReFillMode ? "ReFill Quantity" : "Quantity"}
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className={inputClass}
                  placeholder={isReFillMode ? "Enter quantity to add" : "Enter quantity"}
                  min={isReFillMode ? "1" : "0"}
                />
              </div>
            )}

              {/* Notes Input */}
              <div className="mb-6">
                <label className="block text-lg font-medium mb-2">
                  {isReFillMode ? "ReFill Notes" : "Notes"}
                </label>
                <textarea
                  rows="4"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className={inputClass}
                  placeholder={isReFillMode ? "Enter notes for this refill" : "Enter notes"}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={handleCloseModal}
                  className={ShowModelCloseButtonClass}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveClick}
                  className={SubmitButtonClass}
                >
                  {isReFillMode ? "ReFill" : isEditMode ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Confirmation Modal for Add */}
      {showConfirmModal && (
        <ConfirmationModal
          isOpen={showConfirmModal}
          message="Are you sure you want to add this inventory?"
          onConfirm={handleConfirmSave}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}

    </>
  )
}

export default ProductPart;

