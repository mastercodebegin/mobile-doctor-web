import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../../components/Loading';
import { AppDispatch, RootState } from '../../redux/store';
import { CreateVendor, GetAllVendors, GetVendorByEmail, GetVendorByRoleId } from './VendorSlice';
import { DeleteClass, DeleteIcon, EditClass, EditIcon, inputClass, ShowModalMainClass, ShowVarientButtonClass, SubmitButtonClass, TableDataClass, TableHadeClass } from '../../helper/ApplicationConstants';
import Pagination from '../../helper/Pagination';
import { toast } from 'react-toastify';
import ConfirmationModal from '../../components/ConfirmationModal';
import { GetAllRoles } from '../Roles/RoleSlice';

const UserManagement = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [openSpecRow, setOpenSpecRow] = useState(null);
  const [openSpecImgRow, setOpenSpecImgRow] = useState(null);
  const [searchByEmail, setSearchByEmail] = useState(false);
  const [filterEmail, setFilterEmail] = useState<any>('')
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState(null);

  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<Partial<Vendor>>({});
  const [selectedDocType, setSelectedDocType] = useState('');
  const [frontDoc, setFrontDoc] = useState(null);
  const [backDoc, setBackDoc] = useState(null);
  const [gstDoc, setGstDoc] = useState(null);
  const [gumastaDoc, setGumastaDoc] = useState(null);

  const { data, isLoading } = useSelector((state: RootState) => state.VendorSlice);
  const { roleData } = useSelector((state: RootState) => state.RoleSlice);

  const usersPerPage = 5;
  const paginatedUsers = data.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  const toggleSpecRow = (id: any) => {
    setOpenSpecRow(openSpecRow === id ? null : id);
  };

  const toggleSpecImgRow = (id: any) => {
    setOpenSpecImgRow(openSpecImgRow === id ? null : id);
  };

  const handleFilterStatusChange = (e: any) => {
    const selectedStatus = e.target.value;
    setFilterStatus(selectedStatus);
    setCurrentPage(1);

    // API call to fetch orders by status
    dispatch(GetVendorByRoleId(selectedStatus))
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
  }

  const handleClearFilter = () => {
    setFilterEmail("");
    setFilterStatus('');
    setCurrentPage(1);
    dispatch(GetAllVendors());
  }

  const handleSearchIconClick = () => {
    setShowModal(true);
    setSearchByEmail(true);
  };


  const documentTypes = [
    { value: 'AADHAR_CARD', label: 'Aadhar Card' },
    { value: 'VOTER_ID', label: 'Voter ID' },
    { value: 'DRIVING_LICENSE', label: 'Driving License' },
    { value: 'GST', label: 'Gst' },
    { value: 'GUMASTA', label: 'Gumasta' },
    { value: 'PANCARD', label: 'PanCard' },
    { value: 'PASSPORT', label: 'Passport' },
  ];


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveClick = () => {
    if (searchByEmail) {
      // =================  SEARCH  =================
      if (!filterEmail.trim()) return;
      console.log(filterEmail)
      dispatch(GetVendorByEmail(filterEmail.trim()));
      handleCloseModal();
      return;
    }
    setShowConfirmModal(true);
  };

  // Updated handleConfirmSave function
  const handleConfirmSave = async () => {
    try {
      console.log("🚀 Starting Vendor form submission...");
      setShowConfirmModal(false);

      const newFormData = new FormData();

      const filesArray = [];

      if (frontDoc) filesArray.push(frontDoc);
      if (backDoc) filesArray.push(backDoc);
      if (gstDoc) filesArray.push(gstDoc);
      if (gumastaDoc) filesArray.push(gumastaDoc);

      filesArray.forEach((file) => {
        newFormData.append('files', file);
      });

      // ✅ vendorString
      const vendorString = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        mobile: formData.mobile,
        email: formData.email,
        panCard: formData.panCard,
        aadharNumber: formData.aadharNumber,
        homeAddress: formData.homeAddress,
        businessName: formData.businessName,
        businessAddress: formData.businessAddress,
        pinCode: formData.pinCode,
        gstNumber: formData.gstNumber,
        state: formData.state,
        city: formData.city,
        password: formData.password || "HX36?@tz",
        createdOn: new Date().toISOString(),
        role: {
          id: parseInt(formData.role) || 0,
          name: roleData?.find(r => r.id === parseInt(formData.role))?.name || "",

        },
      };
      console.log(vendorString)
      newFormData.append("vendorString", JSON.stringify(vendorString));

      const userDocumentString = [];

      if (frontDoc) {
        userDocumentString.push({
          imageName: frontDoc.name,
          idtype: selectedDocType || "AADHAR_CARD",
          frontSide: true,
        });
      }

      if (backDoc) {
        userDocumentString.push({
          imageName: backDoc.name,
          idtype: selectedDocType || "AADHAR_CARD",
          frontSide: true,
        });
      }

      if (gstDoc) {
        userDocumentString.push({
          imageName: gstDoc.name,
          idtype: "GST",
          frontSide: true,
        });
      }

      if (gumastaDoc) {
        userDocumentString.push({
          imageName: gumastaDoc.name,
          idtype: "GUMASTA",
          frontSide: true,
        });
      }

      newFormData.append("userDocumentString", JSON.stringify(userDocumentString));

      // Debug
      console.log('=== FormData Debug ===');
      for (let [key, value] of newFormData.entries()) {
        console.log(key, ':', value);
        if (value instanceof File) {
          console.log(`  File name: ${value.name}`);
        }
      }

      // Dispatch
      dispatch(CreateVendor(newFormData)).unwrap()
        .then((res: any) => {
          toast.success("User-Management Created Successfull!!");
          console.log(res)
          handleCloseModal();
          setCurrentPage(1);
          dispatch(GetAllVendors())
          setOpenSpecRow(null);
          setOpenSpecImgRow(null);
        })


    } catch (error: any) {
      console.error("❌ Error submitting vendor form:", error);
      toast.error(error?.message || "Failed to create vendor");
    }
  };



  const handleCloseModal = () => {
    setShowModal(false);
    setShowConfirmModal(false);
    setIsEditMode(false);
    setSearchByEmail(false)
    setFormData({})
  };

  const handleEditUser = (user: any) => {
    console.log(user)
  }

  const handleDeleteUser = (userId: number) => {
    console.log(userId)
  }

  useEffect(() => {
    dispatch(GetAllVendors());
    dispatch(GetAllRoles())
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className=" md:overflow-y-hidden overflow-x-hidden">
        <div className="mt-10 flex items-center justify-between">

          <div className="flex items-center gap-2">
            <button
              type="button"
              className={"p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-all"}
              onClick={handleSearchIconClick}
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 5.65a7.5 7.5 0 010 10.6z"
                />
              </svg>
            </button>

            <div className="flex items-center gap-2">
              <select
                value={filterStatus}
                onChange={handleFilterStatusChange}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Status</option>
                {roleData.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
              {/* )} */}

              {(filterStatus || searchByEmail) && (
                <button
                  onClick={handleClearFilter}
                  className="px-3 py-1.5 text-sm font-medium text-red-500 border border-red-500 hover:bg-red-600 hover:text-white rounded-md transition-all"
                >
                  Clear Filter
                </button>
              )}
            </div>

          </div>

          {/* Add Button */}
          <div className="flex items-center gap-4">
            <button onClick={() => setShowModal(true)} className={SubmitButtonClass}>
              Add
            </button>
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
                      Name
                    </th>
                    <th scope="col" className={TableHadeClass}>
                      Mobile
                    </th>
                    <th scope="col" className={TableHadeClass}>
                      Email
                    </th>
                    <th scope="col" className={TableHadeClass}>
                      Role Name
                    </th>
                    <th scope="col" className={TableHadeClass}>
                      Status
                    </th>
                    <th scope="col" className={TableHadeClass}>
                      <button>View</button>
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8">
                        <div className="text-gray-500">
                          <h1>No Data Found!!</h1>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((vendor: any, idx) => {
                      const fullName = `${vendor.firstName ?? ''} ${vendor.lastName ?? ''}`.trim();

                      return (
                        <React.Fragment key={idx} >
                          <tr
                            key={vendor.id}
                            className={`transform transition-all duration-300 ${hoveredRow === vendor.id ? 'bg-gray-50' : 'bg-white'}`}
                            onMouseEnter={() => setHoveredRow(vendor.id)}
                            onMouseLeave={() => setHoveredRow(null)}
                          >
                            <td className={TableDataClass}>
                              {vendor.id}
                            </td>
                            <td className={TableDataClass}>
                              <div className="flex items-center">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{fullName}</div>
                                  <div className="text-xs text-gray-500">{vendor.businessName}</div>
                                </div>
                              </div>
                            </td>
                            <td className={TableDataClass}>{vendor.mobile || '--'}</td>
                            <td className={TableDataClass}>{vendor.email || '--'}</td>
                            <td className={TableDataClass}>
                              <div className={TableDataClass}>
                                {vendor?.role?.name || '--'}
                              </div>
                            </td>
                            <td className={TableDataClass}>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditUser(vendor.id)}
                                  className={EditClass}
                                >
                                  {EditIcon}
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(vendor.id)}
                                  className={DeleteClass}
                                >
                                  {DeleteIcon}
                                </button>
                              </div>
                            </td>
                            <td className={TableDataClass}>
                              <button onClick={() => toggleSpecRow(openSpecRow === vendor?.id ? null : vendor?.id)} className={ShowVarientButtonClass}>
                                {openSpecRow === vendor?.id ? 'Hide' : 'Show'} Details
                              </button>
                            </td>
                          </tr>

                          {openSpecRow === vendor?.id && (
                            <React.Fragment>
                              <tr key={`variant-${vendor?.id}`}>
                                <td colSpan={13}>
                                  <div className="bg-gray-50 p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {(() => {
  const user = vendor.vendor;
  const roleName = user?.role?.name?.toLowerCase();

  // All possible fields
  const allFields = [
    { label: "First Name", value: user?.firstName || 'N/A' },
    { label: "Last Name", value: user?.lastName || 'N/A' },
    { label: "Mobile", value: user?.mobile || 'N/A' },
    { label: "Email", value: user?.email || 'N/A' },
    { label: "PAN Card", value: user?.panCard || 'N/A' },
    { label: "Aadhar Number", value: user?.aadharNumber || 'N/A' },
    { label: "Pin Code", value: user?.pinCode || 'N/A' },
    { label: "State", value: user?.state || 'N/A' },
    { label: "City", value: user?.city || 'N/A' },
    { label: "Home Address", value: user?.homeAddress || 'N/A' },
    { label: "Created On", value: user?.createdOn ? new Date(user.createdOn).toLocaleString() : 'N/A' },
    { label: "Account Status", value: user?.accountStatus || 'N/A' },
    { label: "Business Name", value: user?.businessName || 'N/A' },
    { label: "Business Address", value: user?.businessAddress || 'N/A' },
    { label: "GST Number", value: user?.gstNumber || 'N/A' },
  ];

  let variantFields = [];

  if (roleName === 'vendor') {
    // Vendor: Show ALL fields
    variantFields = allFields;
  } else if (roleName === 'customer') {
    // Customer: Hide BusinessName, BusinessAddress, GstNumber, Aadhar, PanCard
    variantFields = allFields.filter(field => 
      !['Business Name', 'Business Address', 'GST Number', 'Aadhar Number', 'PAN Card'].includes(field.label)
    );
  } else {
    // Other roles: Hide only BusinessName, BusinessAddress, GstNumber
    variantFields = allFields.filter(field => 
      !['Business Name', 'Business Address', 'GST Number'].includes(field.label)
    );
  }

  return (
    <>
      {variantFields.map((field, i) => (
        <div key={i} className="p-4 bg-white rounded shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-black">{field?.label}</div>
          <div className={`text-sm text-gray-800 mt-1`}>
            {field?.value}
          </div>
        </div>
      ))}
      <div className="p-4 bg-white rounded shadow-sm border border-gray-200">
        <button onClick={() => toggleSpecImgRow(openSpecImgRow === vendor?.id ? null : vendor?.id)} className={ShowVarientButtonClass}>
          {openSpecImgRow === vendor?.id ? 'Hide' : 'Show'} Images
        </button>
      </div>
    </>
  );
})()}








                                    </div>
                                  </div>
                                </td>
                              </tr>

                              {openSpecImgRow === vendor?.id && (
                                <tr key={`variant-${vendor?.id}`}>
                                  <td colSpan={13}>
                                    <div className="bg-gray-50 p-6">
                                      <div className="flex items-center gap-4">
                                        {vendor?.vendor?.vendorDocument?.map((doc: any, i: number) => (
                                          <div key={i} className="p-4 bg-white rounded shadow-sm border border-gray-200">
                                            <img
                                              src={`https://shopax.s3.eu-north-1.amazonaws.com/${doc?.imageName}`}
                                              alt={`${doc?.idtype}`}
                                              className="w-20 h-20 object-contain border border-gray-200 rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                                              onClick={() => setSelectedImage(`https://shopax.s3.eu-north-1.amazonaws.com/${doc?.imageName}`)}
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          )}

                          {/* Add this Image Modal at the end of your component (before closing div/fragment) */}
                          {selectedImage && (
                            <div
                              className={ShowModalMainClass}
                              onClick={() => setSelectedImage(null)}
                            >
                              <div className="relative max-w-4xl max-h-4xl p-4">
                                <button
                                  onClick={() => setSelectedImage(null)}
                                  className="absolute top-2 right-2 text-white bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 z-10"
                                >
                                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                                <img
                                  src={selectedImage}
                                  alt="Full size view"
                                  className="max-w-full max-h-full object-contain"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalCount={data.length}
              itemsPerPage={usersPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <>
          <div className={ShowModalMainClass}>
            <div className="bg-white rounded-2xl shadow-xl p-8 w-[95%] max-w-4xl relative max-h-[90vh] overflow-y-auto">
              {/* Close */}
              <button
                className="absolute top-4 right-5 text-2xl font-bold text-gray-500 hover:text-black"
                onClick={handleCloseModal}
              >
                &times;
              </button>


              {searchByEmail ? (
                <div className="mb-6">
                  <label className="block text-lg font-medium mb-2">Enter Email</label>
                  <input
                    type="email"
                    value={filterEmail}
                    onChange={(e) => setFilterEmail(e.target.value)}
                    className={inputClass}
                    placeholder="Enter Email"
                  />
                </div>
              ) : (
                <>
                  {/* Title */}
                  <h2 className="text-3xl font-semibold text-center mb-6">
                    {isEditMode ? "Update Variant" : "Add Variant"}
                  </h2>

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First name" className="input" />
                    <input name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last name" className="input" />
                    <input name="mobile" value={formData.mobile} onChange={handleInputChange} placeholder="Mobile" className="input" />
                    <input name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="input" />
                    <input
                      name="panCard"
                      value={formData.panCard}
                      onChange={handleInputChange}
                      placeholder="PAN Card Number"
                      className="input"
                    />
                    <input name="homeAddress" value={formData.homeAddress} onChange={handleInputChange} placeholder="Home Address" className="input" />
                    <input name="aadharNumber" value={formData.aadharNumber} onChange={handleInputChange} placeholder="Aadhar Number" className="input" />
                    <input name="businessName" value={formData.businessName} onChange={handleInputChange} placeholder="Business Name" className="input" />
                    <input name="businessAddress" value={formData.businessAddress} onChange={handleInputChange} placeholder="Business Address" className="input" />
                    <input name="pinCode" value={formData.pinCode} onChange={handleInputChange} placeholder="Pincode" className="input" />
                    <input name="gstNumber" value={formData.gstNumber} onChange={handleInputChange} placeholder="GST Number" className="input" />
                    <select name="state" value={formData.state} onChange={handleInputChange} className="input">
                      <option>Select State</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Gujarat">Gujarat</option>
                    </select>
                    <select name="city" value={formData.city} onChange={handleInputChange} className="input">
                      <option>Select City</option>
                      <option value="Indore">Indore</option>
                      <option value="Dewas">Dewas</option>
                      <option value="Ujjain">Ujjain</option>
                    </select>
                    <select name="role" value={formData.role || ''} onChange={handleInputChange} className="input">
                      <option value="">Select Role</option>
                      {roleData?.map((role: any) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <>
                    <hr className="my-2 border-gray-300" />
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-4">Upload Documents</h3>

                      {/* Document Type Selection Dropdown */}
                      <div className="mb-6">
                        <label className="block font-medium mb-2">Select Document Type</label>
                        <select
                          value={selectedDocType}
                          onChange={(e) => setSelectedDocType(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Document Type</option>
                          {documentTypes.map((doc) => (
                            <option key={doc.value} value={doc.value}>
                              {doc.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Document Upload Fields - Show based on selection */}
                      {selectedDocType && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Front Side */}
                          <div className="mb-6">
                            <label className="block font-medium mb-2">
                              {selectedDocType === 'AADHAR_CARD' ? 'Aadhar Front' :
                                selectedDocType === 'VOTER_ID' ? 'Voter ID Front' :
                                  selectedDocType === 'DRIVING_LICENSE' ? 'Driving License Front' :
                                    selectedDocType === 'GST' ? 'Gst Front' :
                                      selectedDocType === 'GUMASTA' ? 'Gumasta Front' :
                                        selectedDocType === 'PANCARD' ? 'PanCard Front' :
                                          selectedDocType === 'PASSPORT' ? 'Passport Front' :
                                            `${selectedDocType} Front`}
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              multiple={false}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                setFrontDoc(file || null);
                              }}
                              className="w-full border border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors"
                            />
                            {frontDoc && (
                              <div className="mt-4">
                                <div className="relative bg-gray-100 p-2 rounded-lg">
                                  <span className="text-sm text-gray-700 truncate block">
                                    {frontDoc.name}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setFrontDoc(null)}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                  >
                                    ×
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Back Side */}
                          <div className="mb-6">
                            <label className="block font-medium mb-2">
                              {selectedDocType === 'AADHAR_CARD' ? 'Aadhar Back' :
                                selectedDocType === 'VOTER_ID' ? 'Voter ID Back' :
                                  selectedDocType === 'DRIVING_LICENSE' ? 'Driving License Back' :
                                    selectedDocType === 'GST' ? 'Gst Back' :
                                      selectedDocType === 'GUMASTA' ? 'Gumasta Back' :
                                        selectedDocType === 'PANCARD' ? 'PanCard Back' :
                                          selectedDocType === 'PASSPORT' ? 'Passport Back' :
                                            `${selectedDocType} Back`}
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              multiple={false}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                setBackDoc(file || null);
                              }}
                              className="w-full border border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors"
                            />
                            {backDoc && (
                              <div className="mt-4">
                                <div className="relative bg-gray-100 p-2 rounded-lg">
                                  <span className="text-sm text-gray-700 truncate block">
                                    {backDoc.name}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setBackDoc(null)}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                  >
                                    ×
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <hr className="my-4 border-gray-300" />

                      {/* GST and Gumasta Documents */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* GST Document */}
                        <div className="mb-6">
                          <label className="block font-medium mb-2">GST Certificate</label>
                          <input
                            type="file"
                            accept="image/*"
                            multiple={false}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              setGstDoc(file || null);
                            }}
                            className="w-full border border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors"
                          />
                          {gstDoc && (
                            <div className="mt-4">
                              <div className="relative bg-gray-100 p-2 rounded-lg">
                                <span className="text-sm text-gray-700 truncate block">
                                  {gstDoc.name}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setGstDoc(null)}
                                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Gumasta Document */}
                        <div className="mb-6">
                          <label className="block font-medium mb-2">Gumasta License</label>
                          <input
                            type="file"
                            accept="image/*"
                            multiple={false}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              setGumastaDoc(file || null);
                            }}
                            className="w-full border border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors"
                          />
                          {gumastaDoc && (
                            <div className="mt-4">
                              <div className="relative bg-gray-100 p-2 rounded-lg">
                                <span className="text-sm text-gray-700 truncate block">
                                  {gumastaDoc.name}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setGumastaDoc(null)}
                                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                </>
              )}



              {/*Action  Buttons */}
              <div className="flex justify-end space-x-4 mt-4">
                <button type="button" onClick={handleCloseModal} className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">
                  Close
                </button>
                <button
                  onClick={handleSaveClick}
                  type="submit"
                  disabled={isLoading}
                  className={SubmitButtonClass}>
                  {isEditMode ? 'Update' : 'Save'}
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
          message="Are you sure you want to save this variant?"
        />
      )}
    </>
  );
};

export default UserManagement;











