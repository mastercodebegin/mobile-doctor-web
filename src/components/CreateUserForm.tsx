import React, { useState } from 'react';

interface Props {
  onClose: () => void;
}

const CreateUserForm: React.FC<Props> = ({ onClose }) => {

  const [formDate , setFormData] = useState({
    firstName : "",
    lastName : "",
    mobile : "",
    email : "",
    homeAddress : "",
    aadhar : "",
    businessName : "",
    businessAddress : "",
    pincode : "",
    gstNumber : "",
    state : "",
    city : "",
    frontDocs : "",
    backDocs : "",
    gstDocs : "",
    gumastaDocs : ""
  })

  const [frontDocs, setFrontDocs] = useState<File[]>([]);
  const [backDocs, setBackDocs] = useState<File[]>([])
  const [gstDocs, setGstDocs] = useState<File[]>([]);
  const [gumastaDocs, setGumastaDocs] = useState<File[]>([]);
console.log(gumastaDocs)
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File[]>>
  ) => {
    const files = Array.from(e.target.files || []);
    setter(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (
    index: number,
    setter: React.Dispatch<React.SetStateAction<File[]>>
  ) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form className="space-y-4">
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" placeholder="First name" className="input" />
        <input type="text" placeholder="Last name" className="input" />
        <input type="text" placeholder="Mobile" className="input" />
        <input type="email" placeholder="Email" className="input" />
        <input type="text" placeholder="Home Address" className="input" />
        <input type="text" placeholder="Aadhar Number" className="input" />
        <input type="text" placeholder="Business Name" className="input" />
        <input type="text" placeholder="Business Address" className="input" />
        <input type="text" placeholder="Pincode" className="input" />
        <input type="text" placeholder="GST Number" className="input" />
        <select className="input">
          <option>Select State</option>
        </select>
        <select className="input">
          <option>Select City</option>
        </select>
      </div>

      <hr className="my-2 border-gray-300" />

      {/* Personal Docs */}
      <h3 className="text-lg font-semibold">Upload Personal Documents</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <label className="block font-medium">Front Side Photo</label>
          <input className='bg-gray-200 border border-gray-600 px-4 text-gray-600' type="file" multiple onChange={(e) => handleFileChange(e, setFrontDocs)} />
          <ul className="text-sm mt-1 space-y-2">
            {frontDocs.map((file, idx) => (
              <li key={idx} className="flex items-center space-x-4">
                <img src={URL.createObjectURL(file)} alt={file.name}
                className='w-20 h-20 object-cover rounded border'
                />
<div className="flex-1">
  <p className="truncate w-32">{file.name}</p>
                <button type="button" className="text-red-500 text-sm" onClick={() => handleRemoveFile(idx, setFrontDocs)}>
                  Remove
                </button>
</div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <label className="block font-medium">Back Side Photo</label>
          <input className='bg-gray-200 border border-gray-600 px-4 text-gray-600' type="file" 
          multiple 
          accept='image/*' 
          onChange={(e) => handleFileChange(e, setBackDocs)}
          />
          <ul className="text-sm mt-1 space-y-2">
            {backDocs.map((file, idx) =>(
              <li key={idx} className="flex items-center space-x-4">
<img 
src={URL.createObjectURL(file)} 
alt={file.name} 
className="w-20 h-20 object-cover rounded border"
 />
 <div className="flex-1">
  <p className="truncate w-32">{file.name}</p>
  <button 
  className="text-red-500 text-sm"
  type='button'
  onClick={() => handleRemoveFile(idx, setBackDocs)}
  >
    Remove
  </button>
 </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <hr className="my-2 border-gray-300" />

      {/* Business Docs */}
      <h3 className="text-lg font-semibold">Upload Business Documents</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">GST Photo</label>
          <input className='bg-gray-200 border border-gray-600 px-4 text-gray-600' type="file" multiple onChange={(e) => handleFileChange(e, setGstDocs)} />
          <ul className="text-sm mt-1">
            {gstDocs.map((file, idx) => (
              <li key={idx} className="flex space-x-4 items-center">
                <img 
                className='w-20 h-20 object-cover rounded border'
                src={URL.createObjectURL(file)} 
                alt={file.name}
                />
<div className="flex-1">
  <p className="truncate w-32">{file.name}</p>
                <button type="button" className="text-red-500 text-sm`" onClick={() => handleRemoveFile(idx, setGstDocs)}>
                  Remove
                </button>
</div>
              </li>
            ))}
          </ul>
        </div>

        {/* <div>
          <label className="block font-medium">GUMASTA Photo</label>
          <input className='bg-gray-200 border border-gray-600 px-4 text-gray-600' type="file" multiple onChange={(e) => handleFileChange(e, setGumastaDocs)} />
          <ul className="text-sm mt-1">
            {gumastaDocs.map((file, idx) => (
              <li key={idx} className="flex justify-between items-center">
                <img src={file.name} alt="" />
                {file.name}
                <button type="button" className="text-red-500" onClick={() => handleRemoveFile(idx, setGumastaDocs)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div> */}

        <div>
  <label className="block font-medium">GUMASTA Photo</label>
  <input
    className='bg-gray-200 border border-gray-600 px-4 text-gray-600'
    type="file"
    multiple
    accept="image/*"
    onChange={(e) => handleFileChange(e, setGumastaDocs)}
  />
  <ul className="text-sm mt-1 space-y-2">
    {gumastaDocs.map((file, idx) => (
      <li key={idx} className="flex items-center space-x-4">
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          className="w-20 h-20 object-cover rounded border"
        />
        <div className="flex-1">
          <p className="truncate w-32">{file.name}</p>
          <button
            type="button"
            className="text-red-500 text-sm"
            onClick={() => handleRemoveFile(idx, setGumastaDocs)}
          >
            Remove
          </button>
        </div>
      </li>
    ))}
  </ul>
</div>



      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-4 mt-4">
        <button type="button" onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">
          Close
        </button>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default CreateUserForm;
