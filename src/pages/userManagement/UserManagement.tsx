import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../../components/Loading';
import { AppDispatch, RootState } from '../../redux/store';
import { CreateVendor, GetAllVendors, GetVendorByEmail, GetVendorByRoleId } from './VendorSlice';
import { DeleteClass, DeleteIcon, EditClass, EditIcon, inputClass, RoleIds, ShowModalMainClass, ShowVarientButtonClass, SubmitButtonClass, TableDataClass, TableHadeClass } from '../../helper/ApplicationConstants';
import Pagination from '../../helper/Pagination';
import { toast } from 'react-toastify';
import ConfirmationModal from '../../components/ConfirmationModal';
import { GetAllRoles } from '../Roles/RoleSlice';
import { GetCitiesByStateId } from '../City/CitySlice';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';

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

  const [errors, setErrors] = useState<any>({});
  const [touched, setTouched] = useState<any>({});

  const { data, isLoading } = useSelector((state: RootState) => state.VendorSlice);
  const { roleData } = useSelector((state: RootState) => state.RoleSlice);
  const { stateData } = useSelector((state: RootState) => state.StateSlice);
  const { cityData } = useSelector((state: RootState) => state.CitySlice);

  const usersPerPage = 5;
  const roleArray = Array.isArray(data) ? data : data ? [data] : [];
  const paginatedUsers = roleArray?.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

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

  // // handle state change
  // const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const stateId = Number(e.target.value);

  //   // poora object nikaalo
  //   const selectedState = stateData.find((item) => item.id === stateId);

  //   // formData me poora state save karo
  //   setFormData((prev) => ({
  //     ...prev,
  //     state: selectedState || null,   // poora object store hoga
  //   }));

  //   // dispatch ke liye sirf id bhejna
  //   if (selectedState) {
  //     dispatch(GetCitiesByStateId(selectedState.id));
  //   }
  // };

  // 3. Update handleStateChange - Add onBlur validation
const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const stateId = Number(e.target.value);

  // poora object nikaalo
  const selectedState = stateData.find((item) => item.id === stateId);

  // formData me poora state save karo
  setFormData((prev) => ({
    ...prev,
    state: selectedState || null,   // poora object store hoga
  }));

  // Clear error if state is selected
  if (selectedState && errors.state) {
    setErrors((prev) => ({
      ...prev,
      state: '',
    }));
  }

  // dispatch ke liye sirf id bhejna
  if (selectedState) {
    dispatch(GetCitiesByStateId(selectedState.id));
  }
};

// 4. Add separate onBlur handler for state
const handleStateBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
  const { value } = e.target;
  
  setTouched((prev) => ({
    ...prev,
    state: true,
  }));

  const error = validateField('state', value);
  setErrors((prev) => ({
    ...prev,
    state: error,
  }));
};

// 5. Update city change handler with onBlur validation
const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const cityId = Number(e.target.value);
  const selectedCity = cityData.find((item) => item.id === cityId);

  setFormData((prev) => ({
    ...prev,
    city: selectedCity || null,
  }));

  // Clear error if city is selected
  if (selectedCity && errors.city) {
    setErrors((prev) => ({
      ...prev,
      city: '',
    }));
  }
};

// 6. Add separate onBlur handler for city
const handleCityBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
  const { value } = e.target;
  
  setTouched((prev) => ({
    ...prev,
    city: true,
  }));

  const error = validateField('city', value);
  setErrors((prev) => ({
    ...prev,
    city: error,
  }));
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


  const validateField = (name: string, value: string) => {
    const selectedRole = roleData?.find((role: any) => role.id == formData.role);
    const isManagerRole = selectedRole?.name?.toLowerCase() === 'manager';

    switch (name) {
      case 'firstName':
        if (!value.trim()) return 'First name is required';
        if (value.length < 2) return 'First name must be at least 2 characters';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'First name should contain only letters';
        break;

      case 'lastName':
        if (!value.trim()) return 'Last name is required';
        if (value.length < 2) return 'Last name must be at least 2 characters';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'Last name should contain only letters';
        break;

      case 'mobile':
        if (!value.trim()) return 'Mobile number is required';
        if (!/^[6-9]\d{9}$/.test(value)) return 'Please enter a valid 10-digit mobile number';
        break;

      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        break;

      case 'role':
        if (!value) return 'Role selection is required';
        break;

      case 'panCard':
        if (!value.trim()) return 'PAN Card is required';
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value.toUpperCase())) return 'Please enter a valid PAN Card number (e.g., ABCDE1234F)';
        break;

      case 'aadharNumber':
        if (!value.trim()) return 'Aadhar number is required';
        if (!/^\d{12}$/.test(value)) return 'Aadhar number must be exactly 12 digits';
        break;

      case 'homeAddress':
        if (!value.trim()) return 'Home address is required';
        if (value.length < 10) return 'Please enter a complete address (minimum 10 characters)';
        break;

      case 'businessName':
        if (isManagerRole && !value.trim()) return 'Business name is required for managers';
        break;

      case 'businessAddress':
        if (isManagerRole && !value.trim()) return 'Business address is required for managers';
        if (isManagerRole && value.length < 10) return 'Please enter a complete business address';
        break;

      case 'pinCode':
        if (!value.trim()) return 'Pin code is required';
        if (!/^\d{6}$/.test(value)) return 'Pin code must be exactly 6 digits';
        break;

      case 'gstNumber':
        // GST is optional but if provided, should be valid
        if (value && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value.toUpperCase())) {
          return 'Please enter a valid GST number';
        }
        break;

      case 'state':
        if (!value) return 'State selection is required';
        break;

      case 'city':
        if (!value) return 'City selection is required';
        break;

      default:
        break;
    }
    return '';
  };

  const validateForm = () => {
    const newErrors: any = {};
    const selectedRole = roleData?.find((role: any) => role.id == formData.role);
    const isManagerRole = selectedRole?.name?.toLowerCase() === 'manager';

    // Required fields for all users
    const requiredFields = ['firstName', 'lastName', 'mobile', 'email', 'role', 'panCard', 'aadharNumber', 'homeAddress', 'pinCode', 'state', 'city'];

    // Additional required fields for managers
    if (isManagerRole) {
      requiredFields.push('businessName', 'businessAddress');
    }

    requiredFields.forEach(field => {
      const error = validateField(field, formData[field] || '');
      if (error) {
        newErrors[field] = error;
      }
    });

    // Document validation - only for non-search mode
    if (!searchByEmail) {
      if (!selectedDocType) {
        newErrors.selectedDocType = 'Please select a document type';
      }

      if (selectedDocType && !frontDoc) {
        newErrors.frontDoc = 'Front side document is required';
      }

      if (selectedDocType && !backDoc) {
        newErrors.backDoc = 'Back side document is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  // // 3. Update handleInputChange to include validation (replace existing function)
  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  //   const { name, value } = e.target;

  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));

  //   setTouched((prev) => ({
  //     ...prev,
  //     [name]: true,
  //   }));

  //   // Validate field on change
  //   const error = validateField(name, value);
  //   setErrors((prev) => ({
  //     ...prev,
  //     [name]: error,
  //   }));
  // };

  // // Add onBlur validation handler (add this new function)
  // const handleFieldBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
  //   const { name, value } = e.target;

  //   // Only validate if field has value
  //   if (value && value.trim()) {
  //     setTouched((prev) => ({
  //       ...prev,
  //       [name]: true,
  //     }));

  //     const error = validateField(name, value);
  //     setErrors((prev) => ({
  //       ...prev,
  //       [name]: error,
  //     }));
  //   }
  // };


  // 1. Update handleInputChange - Remove validation on change, only update form data
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));

  // Remove validation from here - only clear error if field has value
  if (value.trim() && errors[name]) {
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  }
};

// 2. Update handleFieldBlur - Run validation only when user leaves the field
const handleFieldBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;

  // Mark field as touched
  setTouched((prev) => ({
    ...prev,
    [name]: true,
  }));

  // Validate field only if it has been touched and user has left the field
  const error = validateField(name, value);
  setErrors((prev) => ({
    ...prev,
    [name]: error,
  }));
};

  // Add file validation handler (add this new function)
  const handleFileValidation = (file: File | null, fieldName: string) => {
    if (!file) return;

    let error = '';

    // File size validation (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      error = 'File size should be less than 5MB';
    }

    // File type validation
    if (!file.type.startsWith('image/')) {
      error = 'Only image files are allowed';
    }

    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));

    if (!error) {
      setTouched((prev) => ({
        ...prev,
        [fieldName]: true,
      }));
    }
  };

  // 4. Update handleSaveClick to include validation (replace existing function)
  const handleSaveClick = () => {
    if (searchByEmail) {
      // Email search validation
      if (!filterEmail.trim()) {
        toast.error('Please enter an email address');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(filterEmail)) {
        toast.error('Please enter a valid email address');
        return;
      }
      dispatch(GetVendorByEmail(filterEmail.trim()));
      handleCloseModal();
      return;
    }

    // Form validation
    if (validateForm()) {
      setShowConfirmModal(true);
    } else {
      toast.error('Please fix all validation errors before proceeding');
      // Mark all fields as touched to show errors
      const allFields = Object.keys(formData);
      const newTouched = {};
      allFields.forEach(field => {
        newTouched[field] = true;
      });
      setTouched(newTouched);
    }
  };

  // 5. Update handleCloseModal to reset errors (replace existing function)
  const handleCloseModal = () => {
    setShowModal(false);
    setShowConfirmModal(false);
    setIsEditMode(false);
    setSearchByEmail(false);
    setSelectedDocType('');
    setFrontDoc(null);
    setBackDoc(null);
    setGstDoc(null);
    setGumastaDoc(null);
    setFormData({});
    setErrors({});
    setTouched({});
  };

  // 6. Add error display helper function (add this new function)
  const renderFieldError = (fieldName: string) => {
    if (errors[fieldName] && touched[fieldName]) {
      return (
        <div className="text-red-500 text-xs mt-1">
          {errors[fieldName]}
        </div>
      );
    }
    return null;
  };

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

      // Fixed vendorString - ensure all fields are included for manager role
      const selectedRole = roleData?.find((role: any) => role.id == formData.role);
      const isManagerRole = selectedRole?.id === RoleIds.manager;

      const vendorString = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        mobile: formData.mobile,
        email: formData.email,
        panCard: formData.panCard,
        aadharNumber: formData.aadharNumber,
        homeAddress: formData.homeAddress,
        pinCode: formData.pinCode,
        state: formData.state.name,
        city: formData.city.name,
        createdOn: new Date().toISOString(),
        role: {
          id: parseInt(formData.role) || 0,
          name: selectedRole?.name || "",
        },
        // Add manager-specific fields only if manager role
        ...(isManagerRole && {
          businessName: formData.businessName,
          businessAddress: formData.businessAddress,
          gstNumber: formData.gstNumber || '', 
        })
      };

      console.log("Vendor String:", vendorString);
      newFormData.append("vendorString", JSON.stringify(vendorString));

      // Fixed userDocumentString - correct frontSide values
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
          frontSide: false, 
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

      console.log("User Document String:", userDocumentString);
      newFormData.append("userDocumentString", JSON.stringify(userDocumentString));

      // Debug
      console.log('=== FormData Debug ===');
      for (let [key, value] of newFormData.entries()) {
        console.log(key, ':', value);
        if (value instanceof File) {
          console.log(`  File name: ${value.name}, size: ${value.size}`);
        }
      }

      // Dispatch
      dispatch(CreateVendor(newFormData)).unwrap()
        .then((res: any) => {
          toast.success("User-Management Created Successfully!!");
          console.log("Create Response:", res);
          handleCloseModal();
          setCurrentPage(1);
          dispatch(GetAllVendors());
          setOpenSpecRow(null);
          setOpenSpecImgRow(null);
          setFormData({});
          setFrontDoc(null);
          setBackDoc(null);
          setGstDoc(null);
          setGumastaDoc(null);
          setSelectedDocType('');
        })
        .catch((error) => {
          console.error("Create Vendor Error:", error);
          toast.error(error?.message || "Failed to create vendor");
        });

    } catch (error: any) {
      console.error("❌ Error submitting vendor form:", error);
      toast.error(error?.message || "Failed to create vendor");
    }
  };

  const handleEditUser = (user: any) => {
    console.log(user)
  }

  const handleDeleteUser = (userId: number) => {
    console.log(userId)
  }

  useEffect(() => {
    dispatch(GetAllVendors());
    dispatch(GetAllRoles());
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

              {(filterStatus || !searchByEmail) && (
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
                      <button>Details</button>
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedUsers?.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8">
                        <div className="text-gray-500">
                          <h1>No Data Found!!</h1>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers?.map((vendor: any, idx) => {
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
                              <button onClick={() => toggleSpecRow(openSpecRow === vendor?.id ? null : vendor?.id)} className={EditClass}>
                                {openSpecRow === vendor?.id ? <ArrowUpIcon size={28} /> : <ArrowDownIcon size={28} />}
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
                                        const roleId = user?.role?.id;

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

                                        if (roleId === RoleIds.manager) {
                                          // Manager: Show ALL fields
                                          variantFields = allFields;
                                        } else if (roleId === RoleIds.customer) {
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
              totalCount={data?.length}
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
                    className={`${inputClass} ${filterEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(filterEmail) ? 'border-red-500' : ''}`}
                    placeholder="Enter Email"
                  />
                  {filterEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(filterEmail) && (
                    <div className="text-red-500 text-xs mt-1">
                      Please enter a valid email address
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Title */}
                  <h2 className="text-3xl font-semibold text-center mb-6">
                    {isEditMode ? "Update User" : "Create User"}
                  </h2>

                  <div className="mb-4">
                    <select
                      name="role"
                      value={formData.role || ''}
                      onChange={handleInputChange}
                      onBlur={handleFieldBlur}
                      className={`input ${errors.role && touched.role ? 'border-red-500' : ''}`}
                    >
                      <option value="">Select Role</option>
                      {roleData?.map((role: any) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                    {renderFieldError('role')}
                  </div>

                  {/* // Basic Info inputs (replace existing grid): */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input
                        name="firstName"
                        value={formData.firstName || ''}
                        onChange={handleInputChange}
                        onBlur={handleFieldBlur}
                        placeholder="First name"
                        className={`input ${errors.firstName && touched.firstName ? 'border-red-500' : ''}`}
                      />
                      {renderFieldError('firstName')}
                    </div>

                    <div>
                      <input
                        name="lastName"
                        value={formData.lastName || ''}
                        onChange={handleInputChange}
                        onBlur={handleFieldBlur}
                        placeholder="Last name"
                        className={`input ${errors.lastName && touched.lastName ? 'border-red-500' : ''}`}
                      />
                      {renderFieldError('lastName')}
                    </div>

                    <div>
                      <input
                        name="mobile"
                        value={formData.mobile || ''}
                        onChange={handleInputChange}
                        onBlur={handleFieldBlur}
                        placeholder="Mobile"
                        className={`input ${errors.mobile && touched.mobile ? 'border-red-500' : ''}`}
                        maxLength={10}
                      />
                      {renderFieldError('mobile')}
                    </div>

                    <div>
                      <input
                        name="email"
                        value={formData.email || ''}
                        onChange={handleInputChange}
                        onBlur={handleFieldBlur}
                        placeholder="Email"
                        type="email"
                        className={`input ${errors.email && touched.email ? 'border-red-500' : ''}`}
                      />
                      {renderFieldError('email')}
                    </div>

                    <div>
                      <input
                        name="panCard"
                        value={formData.panCard || ''}
                        onChange={handleInputChange}
                        onBlur={handleFieldBlur}
                        placeholder="PAN Card Number (e.g., ABCDE1234F)"
                        className={`input ${errors.panCard && touched.panCard ? 'border-red-500' : ''}`}
                        maxLength={10}
                        style={{ textTransform: 'uppercase' }}
                      />
                      {renderFieldError('panCard')}
                    </div>

                    <div>
                      <input
                        name="homeAddress"
                        value={formData.homeAddress || ''}
                        onChange={handleInputChange}
                        onBlur={handleFieldBlur}
                        placeholder="Home Address"
                        className={`input ${errors.homeAddress && touched.homeAddress ? 'border-red-500' : ''}`}
                      />
                      {renderFieldError('homeAddress')}
                    </div>

                    <div>
                      <input
                        name="aadharNumber"
                        value={formData.aadharNumber || ''}
                        onChange={handleInputChange}
                        onBlur={handleFieldBlur}
                        placeholder="Aadhar Number"
                        className={`input ${errors.aadharNumber && touched.aadharNumber ? 'border-red-500' : ''}`}
                        maxLength={12}
                      />
                      {renderFieldError('aadharNumber')}
                    </div>

                    {(() => {
                      const selectedRole = roleData?.find((role: any) => role.id == formData.role);
                      const isManagerRole = selectedRole?.id === RoleIds.manager;

                      return isManagerRole && (
                        <>
                          <div>
                            <input
                              name="businessName"
                              value={formData.businessName || ''}
                              onChange={handleInputChange}
                              onBlur={handleFieldBlur}
                              placeholder="Business Name"
                              className={`input ${errors.businessName && touched.businessName ? 'border-red-500' : ''}`}
                            />
                            {renderFieldError('businessName')}
                          </div>

                          <div>
                            <input
                              name="businessAddress"
                              value={formData.businessAddress || ''}
                              onChange={handleInputChange}
                              onBlur={handleFieldBlur}
                              placeholder="Business Address"
                              className={`input ${errors.businessAddress && touched.businessAddress ? 'border-red-500' : ''}`}
                            />
                            {renderFieldError('businessAddress')}
                          </div>
                        </>
                      );
                    })()}

                    <div>
                      <input
                        name="pinCode"
                        value={formData.pinCode || ''}
                        onChange={handleInputChange}
                        onBlur={handleFieldBlur}
                        placeholder="Pincode"
                        className={`input ${errors.pinCode && touched.pinCode ? 'border-red-500' : ''}`}
                        maxLength={6}
                      />
                      {renderFieldError('pinCode')}
                    </div>

                    <div>
                      <input
                        name="gstNumber"
                        value={formData.gstNumber || ''}
                        onChange={handleInputChange}
                        onBlur={handleFieldBlur}
                        placeholder="GST Number (Optional)"
                        className={`input ${errors.gstNumber && touched.gstNumber ? 'border-red-500' : ''}`}
                        maxLength={15}
                        style={{ textTransform: 'uppercase' }}
                      />
                      {renderFieldError('gstNumber')}
                    </div>

                    <div>
                      {/* <select
                        className={`input ${errors.state && touched.state ? 'border-red-500' : ''}`}
                        name="state"
                        value={formData.state?.id || ""}
                        onBlur={handleFieldBlur}
                        onChange={handleStateChange}
                      >
                        <option value="">Select State</option>
                        {stateData.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select> */}
                      <select
  className={`input ${errors.state && touched.state ? 'border-red-500' : ''}`}
  name="state"
  value={formData.state?.id || ""}
  onBlur={handleStateBlur}  // Add this line
  onChange={handleStateChange}
>
  <option value="">Select State</option>
  {stateData.map((item) => (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
  ))}
</select>

                      {renderFieldError('state')}
                    </div>

                    <div>
                      {/* <select
                        className={`input ${errors.city && touched.city ? 'border-red-500' : ''}`}
                        name="city"
                        value={formData.city?.id || ""}
                        onBlur={handleFieldBlur}
                        disabled={!formData.state}
                        onChange={(e) => {
                          const cityId = Number(e.target.value);
                          const selectedCity = cityData.find((item) => item.id === cityId);

                          setFormData((prev) => ({
                            ...prev,
                            city: selectedCity || null,
                          }));
                        }}
                      >
                        <option value="">Select City</option>
                        {cityData?.map((item: any) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select> */}

                      <select
  className={`input ${errors.city && touched.city ? 'border-red-500' : ''}`}
  name="city"
  value={formData.city?.id || ""}
  onBlur={handleCityBlur}  // Add this line
  disabled={!formData.state}
  onChange={handleCityChange}  // Change from inline function to separate handler
>
  <option value="">Select City</option>
  {cityData?.map((item: any) => (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
  ))}
</select>

                      {renderFieldError('city')}
                    </div>
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
                          onChange={(e) => {
                            setSelectedDocType(e.target.value);
                            setTouched(prev => ({ ...prev, selectedDocType: true }));
                            if (errors.selectedDocType) {
                              setErrors(prev => ({ ...prev, selectedDocType: '' }));
                            }
                          }}
                          className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.selectedDocType && touched.selectedDocType ? 'border-red-500' : ''}`}
                        >
                          <option value="">Select Document Type</option>
                          {documentTypes.map((doc) => (
                            <option key={doc.value} value={doc.value}>
                              {doc.label}
                            </option>
                          ))}
                        </select>
                        {renderFieldError('selectedDocType')}
                      </div>

                      {/* Document Upload Fields - Show based on selection */}
                      {selectedDocType && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                          {/* // Front Document Upload: */}
                          <div className="mb-6">
                            <label className="block font-medium mb-2">
                              {selectedDocType === 'AADHAR_CARD' ? 'Aadhar Front' :
                                selectedDocType === 'VOTER_ID' ? 'Voter ID Front' :
                                  selectedDocType === 'DRIVING_LICENSE' ? 'Driving License Front' :
                                    selectedDocType === 'GST' ? 'GST Front' :
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
                                setTouched(prev => ({ ...prev, frontDoc: true }));

                                // Validate file immediately after selection
                                if (file) {
                                  handleFileValidation(file, 'frontDoc');
                                }
                              }}
                              className={`w-full border border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors ${errors.frontDoc && touched.frontDoc ? 'border-red-500' : ''}`}
                            />
                            {renderFieldError('frontDoc')}
                            {frontDoc && (
                              <div className="mt-4">
                                <div className="relative bg-gray-100 p-2 rounded-lg">
                                  <span className="text-sm text-gray-700 truncate block">
                                    {frontDoc.name}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setFrontDoc(null);
                                      setErrors(prev => ({ ...prev, frontDoc: '' }));
                                    }}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                  >
                                    ×
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* // Back Document Upload: */}
                          <div className="mb-6">
                            <label className="block font-medium mb-2">
                              {selectedDocType === 'AADHAR_CARD' ? 'Aadhar Back' :
                                selectedDocType === 'VOTER_ID' ? 'Voter ID Back' :
                                  selectedDocType === 'DRIVING_LICENSE' ? 'Driving License Back' :
                                    selectedDocType === 'GST' ? 'GST Back' :
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
                                setTouched(prev => ({ ...prev, backDoc: true }));

                                // Validate file immediately after selection
                                if (file) {
                                  handleFileValidation(file, 'backDoc');
                                }
                              }}
                              className={`w-full border border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors ${errors.backDoc && touched.backDoc ? 'border-red-500' : ''}`}
                            />
                            {renderFieldError('backDoc')}
                            {backDoc && (
                              <div className="mt-4">
                                <div className="relative bg-gray-100 p-2 rounded-lg">
                                  <span className="text-sm text-gray-700 truncate block">
                                    {backDoc.name}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setBackDoc(null);
                                      setErrors(prev => ({ ...prev, backDoc: '' }));
                                    }}
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
                      {(() => {
                        const selectedRole = roleData?.find((role: any) => role.id == formData.role);
                        const isManagerRole = selectedRole?.id === RoleIds.manager;
                        return isManagerRole && (
                          <>
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
                          </>
                        )
                      })()}

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
                  {isEditMode ? 'Update' : 'Continue'}
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
          message="Are you sure you want to Create This User?"
        />
      )}
    </>
  );
};

export default UserManagement;











