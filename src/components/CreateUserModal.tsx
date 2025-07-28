// CreateUserModal.tsx
import React, { useState, useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (fd: FormData) => Promise<any>;   // create (multipart)
  onUpdate?: (payload: any) => Promise<any>;// edit (JSON)
  initialData?: any;
  isEditMode?: boolean;
}

const CreateUserModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  initialData,
  isEditMode = false,
}) => {
  if (!isOpen) return null;

  /* ---------- 1.  form state ---------- */
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    mobile: initialData?.mobile || '',
    email: initialData?.email || '',
    homeAddress: initialData?.homeAddress || '',
    aadharNumber: initialData?.aadharNumber || '',
    businessName: initialData?.businessName || '',
    businessAddress: initialData?.businessAddress || '',
    pinCode: initialData?.pinCode || '',
    gstNumber: initialData?.gstNumber || '',
    state: initialData?.state || '',
    city: initialData?.city || '',
    role: initialData?.role ?? { id: 1 },
  });

  /* ---------- 2.  file buckets ---------- */
const [frontDoc, setFrontDoc] = useState<File | null>(null);
const [backDoc, setBackDoc] = useState<File | null>(null);
const [gstDoc, setGstDoc] = useState<File | null>(null);
const [gumastaDoc, setGumastaDoc] = useState<File | null>(null);


  /* ---------- 3.  pre-fill on edit ---------- */
  useEffect(() => {
    if (isEditMode && initialData) setFormData({ ...initialData, role: initialData.role ?? { id: 1 } });
  }, [initialData, isEditMode]);

  /* ---------- 4.  generic change ---------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------- 5.  file helpers ---------- */
  const handleSingleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  setter: React.Dispatch<React.SetStateAction<File | null>>
) => {
  const file = e.target.files?.[0];
  if (file) {
    setter(file);
  }
  };




  const removeFile = (idx: number, setter: React.Dispatch<React.SetStateAction<File[]>>) =>
    setter((prev) => prev.filter((_, i) => i !== idx));

  /* ---------- 6.  build multipart ---------- */
const buildFormData = (): FormData => {
  const fd = new FormData();
  
  // Add vendor data
  const vendorData = {
    ...formData,
    createdOn: new Date().toISOString()
  };
  fd.append('vendorString', JSON.stringify(vendorData));

  // Add user document metadata (only for files that exist)
  const userDocArray = [];
  if (frontDoc) userDocArray.push({ imageName: frontDoc.name, idtype: 'AADHAR_CARD', frontSide: true });
  if (backDoc) userDocArray.push({ imageName: backDoc.name, idtype: 'AADHAR_CARD', frontSide: false });
  if (gstDoc) userDocArray.push({ imageName: gstDoc.name, idtype: 'GST', frontSide: true });
  if (gumastaDoc) userDocArray.push({ imageName: gumastaDoc.name, idtype: 'GUMASTA', frontSide: true });
  
  fd.append('userDocumentString', JSON.stringify(userDocArray));

  // Add files (only if they exist)
  if (frontDoc) fd.append('files', frontDoc);
  if (backDoc) fd.append('files', backDoc);
  if (gstDoc) fd.append('files', gstDoc);
  if (gumastaDoc) fd.append('files', gumastaDoc);
  
  return fd;
};


  /* ---------- 7.  submit ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && onUpdate) {
      await onUpdate({ ...formData, role: { id: formData.role.id } });
    } else {
      await onSave(buildFormData());
    }
  };

  /* ---------- 8.  render ---------- */
  return (
    <div className="fixed inset-0 bg-gray-300 bg-opacity-40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-2 border-b">
          <h2 className="text-xl font-semibold">{isEditMode ? 'Edit User' : 'Create New User'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-lg">✕</button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First name" className="input" />
            <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last name" className="input" />
            <input name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile" className="input" />
            <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="input" />
            <input name="homeAddress" value={formData.homeAddress} onChange={handleChange} placeholder="Home Address" className="input" />
            <input name="aadharNumber" value={formData.aadharNumber} onChange={handleChange} placeholder="Aadhar Number" className="input" />
            <input name="businessName" value={formData.businessName} onChange={handleChange} placeholder="Business Name" className="input" />
            <input name="businessAddress" value={formData.businessAddress} onChange={handleChange} placeholder="Business Address" className="input" />
            <input name="pinCode" value={formData.pinCode} onChange={handleChange} placeholder="Pincode" className="input" />
            <input name="gstNumber" value={formData.gstNumber} onChange={handleChange} placeholder="GST Number" className="input" />
            <select name="state" value={formData.state} onChange={handleChange} className="input">
              <option>Select State</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
               <option value="Uttar Pradesh">Uttar Pradesh</option>
               <option value="Maharashtra">Maharashtra</option>
               <option value="Gujarat">Gujarat</option>
              </select>
            <select name="city" value={formData.city} onChange={handleChange} className="input">
              <option>Select City</option>
            <option value="Indore">Indore</option>
               <option value="Dewas">Dewas</option>
               <option value="Ujjain">Ujjain</option>
            </select>
          </div>

          <hr className="my-2 border-gray-300" />

          {/* File sections */}
          {!isEditMode && (
  <>
    <hr className="my-2 border-gray-300" />
    <h3 className="text-lg font-semibold mb-4">Upload Documents</h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* Aadhar Front */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Aadhar Front</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleSingleFileChange(e, setFrontDoc)}
          className="w-full border border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors"
        />
        
        {frontDoc && (
          <div className="mt-4">
            <div className="relative bg-gray-100 p-2 rounded-lg">
              <span className="text-sm text-gray-700 truncate block">{frontDoc.name}</span>
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

      {/* Aadhar Back */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Aadhar Back</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleSingleFileChange(e, setBackDoc)}
          className="w-full border border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors"
        />
        
        {backDoc && (
          <div className="mt-4">
            <div className="relative bg-gray-100 p-2 rounded-lg">
              <span className="text-sm text-gray-700 truncate block">{backDoc.name}</span>
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
      
    <hr />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* GST */}
      <div className="mb-6">
        <label className="block font-medium mb-2">GST Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleSingleFileChange(e, setGstDoc)}
          className="w-full border border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors"
        />
        
        {gstDoc && (
          <div className="mt-4">
            <div className="relative bg-gray-100 p-2 rounded-lg">
              <span className="text-sm text-gray-700 truncate block">{gstDoc.name}</span>
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

      {/* Gumasta */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Gumasta Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleSingleFileChange(e, setGumastaDoc)}
          className="w-full border border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors"
        />
        
        {gumastaDoc && (
          <div className="mt-4">
            <div className="relative bg-gray-100 p-2 rounded-lg">
              <span className="text-sm text-gray-700 truncate block">{gumastaDoc.name}</span>
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
)}

          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-4">
            <button type="button" onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">Close</button>
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">{isEditMode ? 'Update' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );

  /* ---------- helper for file list ---------- */
  function renderFileSection(
    label: string,
    list: File[],
    setter: React.Dispatch<React.SetStateAction<File[]>>
  ) {
    return (
      <div>
        <label className="block font-medium">{label}</label>
        <input type="file" multiple accept="image/*" className="bg-gray-200 border border-gray-600 px-4 text-gray-600" onChange={(e) => handleFileChange(e, setter)} />
        <ul className="text-sm mt-1 space-y-2">
          {list.map((file, idx) => (
            <li key={idx} className="flex items-center space-x-4">
              <img src={URL.createObjectURL(file)} alt={file.name} className="w-20 h-20 object-cover rounded border" />
              <div className="flex-1">
                <p className="truncate w-32">{file.name}</p>
                <button type="button" className="text-red-500 text-sm" onClick={() => removeFile(idx, setter)}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
};

export default CreateUserModal;




















// // CreateUserModal.tsx - FIXED FILE HANDLING
// import React, { useState, useEffect } from 'react';

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
//   onSave: (formData: any, files?: { frontDocs: File[], backDocs: File[], gstDocs: File[], gumastaDocs: File[] }) => Promise<any>;
//   onUpdate?: (payload: any) => Promise<any>;
//   initialData?: any;
//   isEditMode?: boolean;
// }

// const CreateUserModal: React.FC<Props> = ({
//   isOpen,
//   onClose,
//   onSave,
//   onUpdate,
//   initialData,
//   isEditMode = false,
// }) => {
//   if (!isOpen) return null;

//   /* ---------- 1. form state ---------- */
//   const [formData, setFormData] = useState({
//     firstName: initialData?.firstName || '',
//     lastName: initialData?.lastName || '',
//     mobile: initialData?.mobile || '',
//     email: initialData?.email || '',
//     homeAddress: initialData?.homeAddress || '',
//     aadharNumber: initialData?.aadharNumber || '',
//     businessName: initialData?.businessName || '',
//     businessAddress: initialData?.businessAddress || '',
//     pinCode: initialData?.pinCode || '',
//     gstNumber: initialData?.gstNumber || '',
//     state: initialData?.state || '',
//     city: initialData?.city || '',
//     role: initialData?.role ?? { id: 1 },
//   });

//   /* ---------- 2. file buckets - FIXED ---------- */
//   const [frontDocs, setFrontDocs] = useState<File[]>([]);
//   const [backDocs, setBackDocs] = useState<File[]>([]);
//   const [gstDocs, setGstDocs] = useState<File[]>([]);
//   const [gumastaDocs, setGumastaDocs] = useState<File[]>([]);

//   /* ---------- 3. pre-fill on edit ---------- */
//   useEffect(() => {
//     if (isEditMode && initialData) {
//       setFormData({ 
//         ...initialData, 
//         role: initialData.role ?? { id: 1 } 
//       });
//     }
//   }, [initialData, isEditMode]);

//   /* ---------- 4. generic change ---------- */
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };












// // CreateUserModal.tsx - SIMPLE DEBUG VERSION
// const handleFileChange = (
//   e: React.ChangeEvent<HTMLInputElement>,
//   setter: React.Dispatch<React.SetStateAction<File[]>>
// ) => {
//   const files = e.target.files;

//   console.log('🔥 IMMEDIATE CHECK:');
//   console.log('FileList:', files);
//   console.log('FileList length:', files?.length);

//   if (files && files.length > 0) {
//     const fileArray = Array.from(files);

//     console.log('🔥 ARRAY CHECK:');
//     fileArray.forEach((file, i) => {
//       console.log(`File ${i}:`, file);
//       console.log(`File ${i} name:`, file.name);
//       console.log(`File ${i} size:`, file.size);
//       console.log(`File ${i} instanceof File:`, file instanceof File);
//     });

//     console.log('🔥 SETTING FILES:', fileArray);
//     setter(fileArray);

//     setTimeout(() => console.log('🔥 AFTER SET - checking state...'), 100);
//   } else {
//     setter([]);
//   }
// };

// // handleSubmit mein bhi immediate check
// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
  
//   if (!isEditMode) {
//     // TURANT state check karo
//     console.log('🔥 SUBMIT TIME STATE CHECK:');
//     console.log('frontDocs state:', frontDocs);
//     console.log('backDocs state:', backDocs);
//     console.log('gstDocs state:', gstDocs);
//     console.log('gumastaDocs state:', gumastaDocs);
    
//     // Har ek file ko individually check karo
//     frontDocs.forEach((f, i) => {
//       console.log(`frontDoc ${i}:`, f);
//       console.log(`frontDoc ${i} instanceof File:`, f instanceof File);
//       console.log(`frontDoc ${i} name:`, f?.name);
//     });
    
//     // Simple object banao
//     const filesObj = {
//       frontDocs: frontDocs,
//       backDocs: backDocs,
//       gstDocs: gstDocs,
//       gumastaDocs: gumastaDocs
//     };
    
//     console.log('🔥 PASSING TO PARENT:', filesObj);
//     await onSave(formData, filesObj);
//   }
// };




















//   const removeFile = (idx: number, setter: React.Dispatch<React.SetStateAction<File[]>>) => {
//     setter((prev) => prev.filter((_, i) => i !== idx));
//   };


//   /* ---------- SINGLE FILE HANDLER ---------- */
// const handleSingleFile = (
//   e: React.ChangeEvent<HTMLInputElement>,
//   currentList: File[],
//   setter: React.Dispatch<React.SetStateAction<File[]>>
// ) => {
//   const file = e.target.files?.[0];
//   if (file) {
//     setter([file]); // Replace with new single file
//   }
// };


//   /* ---------- 7. render ---------- */
//   return (
//     <div className="fixed inset-0 bg-gray-300 bg-opacity-40 z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl relative max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center px-4 py-2 border-b">
//           <h2 className="text-xl font-semibold">{isEditMode ? 'Edit User' : 'Create New User'}</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-lg">✕</button>
//         </div>

//         {/* Body */}
//         <form onSubmit={handleSubmit} className="p-4 space-y-4">
//           {/* Basic Info */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <input 
//               name="firstName" 
//               value={formData.firstName} 
//               onChange={handleChange} 
//               placeholder="First name" 
//               className="input border border-gray-300 px-3 py-2 rounded" 
              
//             />
//             <input 
//               name="lastName" 
//               value={formData.lastName} 
//               onChange={handleChange} 
//               placeholder="Last name" 
//               className="input border border-gray-300 px-3 py-2 rounded" 
//             />
//             <input 
//               name="mobile" 
//               value={formData.mobile} 
//               onChange={handleChange} 
//               placeholder="Mobile" 
//               className="input border border-gray-300 px-3 py-2 rounded" 
              
//             />
//             <input 
//               name="email" 
//               type="email"
//               value={formData.email} 
//               onChange={handleChange} 
//               placeholder="Email" 
//               className="input border border-gray-300 px-3 py-2 rounded" 
              
//             />
//             <input 
//               name="homeAddress" 
//               value={formData.homeAddress} 
//               onChange={handleChange} 
//               placeholder="Home Address" 
//               className="input border border-gray-300 px-3 py-2 rounded" 
//             />
//             <input 
//               name="aadharNumber" 
//               value={formData.aadharNumber} 
//               onChange={handleChange} 
//               placeholder="Aadhar Number" 
//               className="input border border-gray-300 px-3 py-2 rounded" 
//             />
//             <input 
//               name="businessName" 
//               value={formData.businessName} 
//               onChange={handleChange} 
//               placeholder="Business Name" 
//               className="input border border-gray-300 px-3 py-2 rounded" 
//             />
//             <input 
//               name="businessAddress" 
//               value={formData.businessAddress} 
//               onChange={handleChange} 
//               placeholder="Business Address" 
//               className="input border border-gray-300 px-3 py-2 rounded" 
//             />
//             <input 
//               name="pinCode" 
//               value={formData.pinCode} 
//               onChange={handleChange} 
//               placeholder="Pincode" 
//               className="input border border-gray-300 px-3 py-2 rounded" 
//             />
//             <input 
//               name="gstNumber" 
//               value={formData.gstNumber} 
//               onChange={handleChange} 
//               placeholder="GST Number" 
//               className="input border border-gray-300 px-3 py-2 rounded" 
//             />
//             <select 
//               name="state" 
//               value={formData.state} 
//               onChange={handleChange} 
//               className="input border border-gray-300 px-3 py-2 rounded"
//             >
//               <option value="">Select State</option>
//               <option value="Madhya Pradesh">Madhya Pradesh</option>
//               <option value="Uttar Pradesh">Uttar Pradesh</option>
//               <option value="Maharashtra">Maharashtra</option>
//               <option value="Gujarat">Gujarat</option>
//               {/* Add your state options here */}
//             </select>
//             <select 
//               name="city" 
//               value={formData.city} 
//               onChange={handleChange} 
//               className="input border border-gray-300 px-3 py-2 rounded"
//             >
//               <option value="">Select City</option>
//               <option value="Indore">Indore</option>
//               <option value="Dewas">Dewas</option>
//               <option value="Ujjain">Ujjain</option>
//               {/* Add your city options here */}
//             </select>
//           </div>

//           <hr className="my-2 border-gray-300" />

//           {/* File sections - Only show for create mode */}
//           {/* {!isEditMode && (
//             <>
//               <h3 className="text-lg font-semibold">Upload Personal Documents</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {renderFileSection('Front Side Photo', frontDocs, setFrontDocs)}
//                 {renderFileSection('Back Side Photo', backDocs, setBackDocs)}
//               </div>

//               <hr className="my-2 border-gray-300" />

//               <h3 className="text-lg font-semibold">Upload Business Documents</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {renderFileSection('GST Photo', gstDocs, setGstDocs)}
//                 {renderFileSection('GUMASTA Photo', gumastaDocs, setGumastaDocs)}
//               </div>
//             </>
//           )} */}

// {/* ---------- 4 SEPARATE FILE UPLOADS ---------- */}
// {!isEditMode && (
//   <>
//     <hr className="my-2 border-gray-300" />
//     <h3 className="text-lg font-semibold mb-4">Upload Documents</h3>

//     {/* Document Upload Grid */}
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//       {/* Aadhar Front */}
//       <div className="mb-6">
//         <label className="block font-medium mb-2">Aadhar Front</label>
//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) => handleSingleFile(e, frontDocs, setFrontDocs)}
//           className="w-full border border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors"
//         />
        
//         {frontDocs.length > 0 && (
//           <div className="mt-4">
//             <h4 className="font-medium mb-2">Selected:</h4>
//             <div className="grid grid-cols-1 gap-2">
//               {frontDocs.map((file, index) => (
//                 <div key={index} className="relative bg-gray-100 p-2 rounded-lg">
//                   <span className="text-sm text-gray-700 truncate block">{file.name}</span>
//                   <button
//                     type="button"
//                     onClick={() => setFrontDocs([])}
//                     className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Aadhar Back */}
//       <div className="mb-6">
//         <label className="block font-medium mb-2">Aadhar Back</label>
//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) => handleSingleFile(e, backDocs, setBackDocs)}
//           className="w-full border border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors"
//         />
        
//         {backDocs.length > 0 && (
//           <div className="mt-4">
//             <h4 className="font-medium mb-2">Selected:</h4>
//             <div className="grid grid-cols-1 gap-2">
//               {backDocs.map((file, index) => (
//                 <div key={index} className="relative bg-gray-100 p-2 rounded-lg">
//                   <span className="text-sm text-gray-700 truncate block">{file.name}</span>
//                   <button
//                     type="button"
//                     onClick={() => setBackDocs([])}
//                     className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//     </div>
      
//       <hr />

//         {/* Document Upload (GST, Gumasta) Grid */}
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//       {/* GST */}
//       <div className="mb-6">
//         <label className="block font-medium mb-2">GST Photo</label>
//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) => handleSingleFile(e, gstDocs, setGstDocs)}
//           className="w-full border border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors"
//         />
        
//         {gstDocs.length > 0 && (
//           <div className="mt-4">
//             <h4 className="font-medium mb-2">Selected:</h4>
//             <div className="grid grid-cols-1 gap-2">
//               {gstDocs.map((file, index) => (
//                 <div key={index} className="relative bg-gray-100 p-2 rounded-lg">
//                   <span className="text-sm text-gray-700 truncate block">{file.name}</span>
//                   <button
//                     type="button"
//                     onClick={() => setGstDocs([])}
//                     className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Gumasta */}
//       <div className="mb-6">
//         <label className="block font-medium mb-2">Gumasta Photo</label>
//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) => handleSingleFile(e, gumastaDocs, setGumastaDocs)}
//           className="w-full border border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors"
//         />
        
//         {gumastaDocs.length > 0 && (
//           <div className="mt-4">
//             <h4 className="font-medium mb-2">Selected:</h4>
//             <div className="grid grid-cols-1 gap-2">
//               {gumastaDocs.map((file, index) => (
//                 <div key={index} className="relative bg-gray-100 p-2 rounded-lg">
//                   <span className="text-sm text-gray-700 truncate block">{file.name}</span>
//                   <button
//                     type="button"
//                     onClick={() => setGumastaDocs([])}
//                     className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//     </div>
//   </>
// )}

//           {/* Action Buttons */}
//           <div className="flex justify-end space-x-4 mt-4">
//             <button 
//               type="button" 
//               onClick={onClose} 
//               className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
//             >
//               Close
//             </button>
//             <button 
//               type="submit" 
//               className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//             >
//               {isEditMode ? 'Update' : 'Save'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );

//   /* ---------- FIXED FILE SECTION RENDERER ---------- */
//   function renderFileSection(
//     label: string,
//     list: File[],
//     setter: React.Dispatch<React.SetStateAction<File[]>>
//   ) {
//     return (
//       <div>
//         <label className="block font-medium mb-1">{label}</label>
//         <input 
//           type="file" 
//           multiple 
//           accept="image/*,.pdf" 
//           className="bg-gray-200 border border-gray-600 px-4 py-2 text-gray-600 w-full rounded" 
//           onChange={(e) => handleFileChange(e, setter)} 
//         />
//         <ul className="text-sm mt-2 space-y-2">
//           {list.map((file, idx) => {
//             // Verify file is valid before rendering
//             if (!(file instanceof File) || !file.name) {
//               console.error('Invalid file in list:', file);
//               return null;
//             }
            
//             return (
//               <li key={idx} className="flex items-center space-x-4 p-2 bg-gray-50 rounded">
//                 {file.type.startsWith('image/') && (
//                   <img 
//                     src={URL.createObjectURL(file)} 
//                     alt={file.name} 
//                     className="w-16 h-16 object-cover rounded border" 
//                   />
//                 )}
//                 <div className="flex-1">
//                   <p className="truncate max-w-32 text-sm font-medium">{file.name}</p>
//                   <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
//                   <p className="text-xs text-gray-400">{file.type}</p>
//                 </div>
//                 <button 
//                   type="button" 
//                   className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded" 
//                   onClick={() => removeFile(idx, setter)}
//                 >
//                   Remove
//                 </button>
//               </li>
//             );
//           })}
//         </ul>
//       </div>
//     );
//   }
// };

// export default CreateUserModal;