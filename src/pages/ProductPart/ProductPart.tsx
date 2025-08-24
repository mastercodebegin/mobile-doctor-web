import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import Pagination from '../../helper/Pagination';
import { ArrowDown, ArrowUp, ClearFilter, DeleteClass, DeleteIcon, EditClass, EditIcon, inputClass, InventoryView, pageSize, ShowModalMainClass, ShowModelCloseButtonClass, SubmitButtonClass, TableDataClass, TableHadeClass, ThemeBackgroundColor } from '../../helper/ApplicationConstants';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import { GetAllCategory } from '../AddCategory/AddCategorySlice';
import { GetAllSubCategory, GetAllSubCategoryById } from '../AddSubCategory/SubCategorySlice';
import { GetAllModalIssues } from '../ModalIssues/ModalIssuesSlice';
import { CreateInventory, DeleteInventory, GetAllProductPart, GetAllProductPartBySubCategoryId, Update, UpdateInventory, ReFillInventory, InventoryHistory, OrderInventoryUse, clearHistoryCache } from './ProductPartSlice';
import ConfirmationModal from '../../components/ConfirmationModal';
import { FetchAllModalNumber } from '../AddMobileNumber/MobileNumberSlice';
import IphoneImage from "../../assets/Laptop_Image.png";

const ProductPart = () => {

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [filterSubCategory, setFilterSubCategory] = useState<any>(null);
  const [filterCategory, setFilterCategory] = useState<any>(null);
  const [selectedModel, setSelectedModel] = useState<any>(null)
  const [selectedProductPartLabel, setSelectedProductPartLabel] = useState<any>(null)
  const [quantity, setQuantity] = useState<any>(0);
  const [notes, setNotes] = useState<any>("");
  const [history, setHistory] = useState<any>(null);
  const [historyPagination, setHistoryPagination] = useState<{ [key: number]: { currentPage: number, totalPages: number, totalElements: number } }>({});

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
  const {AllModalNumberData} = useSelector((state: RootState) => state.MobileNumberSlice);

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
    setHistory(null);
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
    setHistory(null);
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
          dispatch(clearHistoryCache(selectedInventoryForReFill.id));
          toast.success(res.message || "Inventory Used Successfully!");
          dispatch(GetAllProductPart());
        })
        .catch((err: any) => {
          toast.error("Order Use Failed: " + err);
        });
    }
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
          dispatch(clearHistoryCache(selectedInventoryForReFill.id))
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
      productModelNumber: selectedModel,
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
    setIsEditMode(false);
    setShowModal(false);
    setIsReFillMode(false);
    setIsOrderUseMode(false);
    setQuantity(0);
    setNotes("");
    setUnitRepairOrderId("");
    setSelectedProductPartLabel(null);
    setSelectedModel(null);
    setSelectedInventoryForReFill(null);
    dispatch(Update(null))
  }

  const handleEditUser = (user: any) => {
    console.log("Edit User with User :--", user)
    dispatch(Update(user))
    setShowModal(true);
    setQuantity(user?.quantity)
    setNotes(user?.notes)
    setSelectedProductPartLabel(user?.productPart)
    setSelectedModel(user?.productModelNumber)
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

  // History Section
  const handleHistoryToggle = (userId: number) => {
    // If the history is already open for this user, close it
    if (history === userId) {
      setHistory(null);
      return;
    }

    // If the history is not open, set it to the current user ID
    setHistory(userId);

    if (History?.data[userId]?.length) {
      setHistory(userId);           // use existing
      return;
    }

    // Check if data is already cached
    const cachedData = History?.data[userId] || [];
    const totalElements = History?.pagination[userId]?.totalElements || 0;

    // If data is not fully cached, fetch the first page
    if (cachedData.length === 0 || cachedData?.length < totalElements) {
      const historyData = {
        id: userId,
        pageSize: pageSize || 10,
        pageNumber: 0,
      };
      dispatch(InventoryHistory(historyData));
    }

    // Reset the current page to the first page when opening history
    setHistoryPagination(prev => ({
      ...prev,
      [userId]: { ...prev[userId], currentPage: 0 },
    }));
  };

  // Also update the renderHistoryRow function to show correct page data:
  const renderHistoryRow = (user: any) => {
    const userSpecificHistory = History?.data[user?.id] || [];
    const userPagination = historyPagination[user?.id] || { currentPage: 0, totalPages: 0, totalElements: 0 };

    console.log('Checking history for user ID:', user?.id, History?.data);

    const currentPage = userPagination?.currentPage;
    const totalPages = userPagination?.totalPages;
    const totalElements = userPagination?.totalElements;
    const historyPageSize = pageSize || 10;
    const startEntry = (currentPage * historyPageSize) + 1;
    const endEntry = Math.min((currentPage + 1) * historyPageSize, totalElements);

    // Get current page data from cached history
    const startIndex = currentPage * historyPageSize;
    const endIndex = startIndex + historyPageSize;
    const currentPageData = userSpecificHistory?.slice(startIndex, endIndex)?.filter(item => item !== undefined);

    return (
      <tr key={`history-${user?.id}`} className="bg-gray-50">
        <td colSpan={10} className="px-6 py-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            {isHistoryLoading ? (
              // ... loading content remains same
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
                  <p className="text-center text-gray-600 mt-4">Loading history...</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {!userSpecificHistory.length ? (
                  <div className="text-center text-red-500 py-8">
                    <p className="text-lg">📋 Inventory History Not Available</p>
                    <p className="text-sm text-gray-500 mt-2">
                      No history records found for this product
                    </p>
                  </div>
                ) : (
                  <>
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className={TableHadeClass}>Order ID</th>
                          <th scope="col" className={TableHadeClass}>Date</th>
                          <th scope="col" className={TableHadeClass}>Qty Change</th>
                          <th scope="col" className={TableHadeClass}>Updated Qty</th>
                          <th scope="col" className={TableHadeClass}>Status</th>
                          <th scope="col" className={TableHadeClass}>Used By</th>
                          <th scope="col" className={TableHadeClass}>Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {/* Use currentPageData instead of userSpecificHistory */}
                        {currentPageData.map((record) => {
                          // ... rest of the mapping logic remains same
                          const date = record.usedOn?.split('T')[0] || record.usedOn || '--';

                          const prevQty = record.previousQuantity ?? 0;
                          const newQty = record.updatedQuantity ?? 0;
                          const ReFillQty = record.quantity ?? 0;
                          const NewReFillQty = record.inventory?.quantity ?? 0;

                          let qtyChangeDisplay = '';
                          let qtyChangeColor = '';
                          let statusBadge = { label: '', color: '' };
                          let totalQtyDisplay = '';

                          if (record.new) {
                            qtyChangeDisplay = `+${newQty}`;
                            qtyChangeColor = 'text-blue-600';
                            statusBadge = { label: 'Initial', color: 'text-blue-500' };
                            totalQtyDisplay = newQty;
                          } else if (record.refill) {
                            qtyChangeDisplay = `+${ReFillQty}`;
                            qtyChangeColor = 'text-green-600';
                            statusBadge = { label: 'In', color: 'text-green-500' };
                            totalQtyDisplay = NewReFillQty;
                          } else if (record.unitRepair) {
                            qtyChangeDisplay = `${prevQty} - 1`;
                            qtyChangeColor = 'text-red-600';
                            statusBadge = { label: 'Out', color: 'text-yellow-500' };
                            totalQtyDisplay = newQty;
                          } else {
                            qtyChangeDisplay = '--';
                            qtyChangeColor = 'text-gray-600';
                            statusBadge = { label: 'Updated', color: 'bg-gray-100 text-gray-500' };
                            totalQtyDisplay = newQty;
                          }

                          return (
                            <tr key={record.id} className="border-b border-gray-200 last:border-b-0 h-16">
                              <td className="px-4 py-2 align-middle">{record?.unitRepair?.orderId ?? ''}</td>
                              <td className="px-4 py-2 align-middle">{date}</td>
                              <td className={`px-4 py-2 align-middle font-medium ${qtyChangeColor}`}>{qtyChangeDisplay}</td>
                              <td className="px-4 py-2 align-middle">{totalQtyDisplay}</td>
                              <td className="px-4 py-2 align-middle">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusBadge.color}`}>
                                  {statusBadge.label}
                                </span>
                              </td>
                              <td className="px-4 py-2 align-middle">
  {(() => {
    // First check record.user, then fallback to record.inventory.user
    const user = record?.user || record?.inventory?.user;
    return user ? `${user.firstName} ${user.lastName ?? ""}`.trim() : '--';
  })()}
</td>
                              <td className="px-4 py-2 align-middle">
  {statusBadge.label === "Initial" 
    ? record?.inventory?.notes || '--' 
    : record?.notes || '--'}
</td>

                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    {/* Pagination section remains same but use handlePreviewClick for Previous button */}
                    {totalElements > 0 && totalPages > 1 && (
                      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm text-gray-700">
                              Showing <span className="font-medium">{startEntry}</span> to{' '}
                              <span className="font-medium">{endEntry}</span> of{' '}
                              <span className="font-medium">{totalElements}</span> entries
                            </p>
                          </div>

                          <div>
                            <nav className="relative z-0 inline-flex rounded-md space-x-2" aria-label="Pagination">
                              {/* Previous Button - Use handlePreviewClick */}
                              {currentPage !== 0 && (
                                <button
                                  onClick={() => handlePreviewClick(user.id, currentPage - 1)}
                                  className={`relative inline-flex hover:rounded-md items-center px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors duration-200
                                 ${currentPage === 0
                                      ? 'hover:bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                                      : 'border-gray-300 text-gray-500 hover:bg-gray-50 cursor-pointer'
                                    }`}
                                >
                                  Previous
                                </button>
                              )}

                              {/* Page Numbers - Use handlePreviewClick for page numbers too */}
                              {(() => {
                                const maxVisiblePages = pageSize;
                                const halfVisible = Math.floor(maxVisiblePages / 2);
                                let startPage = Math.max(0, currentPage - halfVisible);
                                let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

                                if (endPage - startPage < maxVisiblePages - 1) {
                                  startPage = Math.max(0, endPage - maxVisiblePages + 1);
                                }

                                return Array.from({ length: endPage - startPage + 1 }, (_, index) => {
                                  const pageIndex = startPage + index;
                                  return (
                                    <button
                                      key={pageIndex}
                                      onClick={() => handleNextPrevClick(user.id, pageIndex)}
                                      className={`relative inline-flex items-center px-3.5 py-1 text-sm font-medium rounded-md ${currentPage === pageIndex
                                          ? `z-10 ${ThemeBackgroundColor} text-white`
                                          : 'bg-white text-gray-500 hover:bg-gray-200'
                                        }`}
                                    >
                                      {pageIndex + 1}
                                    </button>
                                  );
                                });
                              })()}

                              {/* Next Button - Use handlePreviewClick */}
                              {currentPage < totalPages - 1 && (
                                <button
                                  onClick={() => handleNextPrevClick(user.id, currentPage + 1)}
                                  className={`relative inline-flex hover:rounded-md items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors duration-200 ${currentPage >= totalPages - 1
                                      ? 'bg-gray-100 border-gray-300 hover:bg-gray-100 text-gray-400 cursor-not-allowed'
                                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 cursor-pointer'
                                    }`}
                                >
                                  Next
                                </button>
                              )}
                            </nav>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </td>
      </tr>
    );
  };

  const handlePreviewClick = (userId: number, newPageNumber: number) => {
    const userPagination = historyPagination[userId];
    if (!userPagination || newPageNumber < 0 || newPageNumber >= userPagination.totalPages) {
      return;
    }

    // Only update pagination state, don't make API call
    // Just show the previous page data from state
    setHistoryPagination(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        currentPage: newPageNumber
      }
    }));
  };

  const handleNextPrevClick = (userId: number, newPageNumber: number) => {
    const userPagination = historyPagination[userId];
    if (!userPagination || newPageNumber < 0 || newPageNumber >= userPagination.totalPages) return;

    const cachedData = History.data[userId] || [];
    const start = newPageNumber * pageSize;
    const end = (newPageNumber + 1) * pageSize;

    // Check if the requested page data exists (not just length check)
    const hasPageData = cachedData.slice(start, end).every(item => item !== undefined);

    if (hasPageData) {
      // Fetch the requested page
      const historyData = {
        id: userId,
        pageSize,
        pageNumber: newPageNumber,
      };
      dispatch(InventoryHistory(historyData));
    }

    // Update pagination state to show the requested page
    setHistoryPagination(prev => ({
      ...prev,
      [userId]: { ...prev[userId], currentPage: newPageNumber },
    }));
  };

  useEffect(() => {
    if (History?.pagination) {
      const updatedPagination = {};
      Object.keys(History.pagination).forEach(userId => {
        const paginationData = History.pagination[userId];
        updatedPagination[userId] = {
          currentPage: paginationData.number || 0,
          totalPages: paginationData.totalPages || 0,
          totalElements: paginationData.totalElements || 0,
          data: History.data[userId] || [],  
        };
      });

      setHistoryPagination(updatedPagination);
    }
  }, [History?.pagination, History?.data]);


  useEffect(() => {
    setIsLoaded(true);
    dispatch(GetAllProductPart());
    dispatch(FetchAllModalNumber());
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
      setSelectedModel(Edit?.inventory?.productModelNumber);
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
                className={ClearFilter}
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
                              <img src={IphoneImage || 'https://tse4.mm.bing.net/th/id/OIP.FVpPrz3IlNVDLpKMLC3D2wHaHa?pid=Api&P=0&h=180'} className="w-20 h-20 object-contain rounded-md" alt="Iphone Image" />
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
                              {history === user.id ? ( ArrowUp ) : ( ArrowDown )}
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

{/* Product-Model-Number Selection - Only for Add/Edit Mode */}
{!isReFillMode && !isOrderUseMode && (
     <div className="mb-6">
                  <label className="block text-lg font-medium mb-2">Product Model Number</label>
                  <select
                    value={selectedModel ? JSON.stringify(selectedModel) : ""}
                    onChange={(e) => {
                      const selectedObject = JSON.parse(e.target.value);
                      setSelectedModel(selectedObject);
                    }}
                    className={`${inputClass} ${isEditMode ? "cursor-not-allowed bg-gray-100" : ""}`}
                    disabled={isEditMode}
                  >
                    <option value="" disabled>Select Model Number</option>
                    {AllModalNumberData?.map((category) => (
                      <option key={category.id} value={JSON.stringify(category)}>
                        {category.name} 
                      </option>
                    ))}
                  </select>
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
                    disabled={isEditMode || !selectedModel}
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

