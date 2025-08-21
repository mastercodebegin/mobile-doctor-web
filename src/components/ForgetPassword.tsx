// import React, { useState } from 'react'
// import { inputClass, ShowModalMainClass, SubmitButtonClass } from '../helper/ApplicationConstants'

// const ForgetPassword = ({ setOpenP }) => {

//     const [showCurrent, setShowCurrent] = useState(false);
// const [showNew, setShowNew] = useState(false);
// const [showConfirm, setShowConfirm] = useState(false);


//     const handleCloseModal = () => {
//         setOpenP(false)
//     }

//     return (
//         <>
//             <div className={ShowModalMainClass}>
//                 <div className="bg-white rounded-2xl shadow-xl p-8 w-[90%] max-w-xl relative">

//                     <h2 className="text-3xl font-semibold text-center mb-6">Forget Password</h2>

//                     {/* Close Icon */}
//                     <button
//                         className="absolute top-4 right-5 text-2xl font-bold text-gray-500 hover:text-black"
//                         onClick={handleCloseModal}
//                     >
//                         &times;
//                     </button>

//                     <>
//                         {/* Current Password */}
//                      <div className="mb-6 relative">
//   <label className="block text-lg font-medium mb-2">Enter Current Password</label>
//   <input
//     type={showCurrent ? "text" : "password"}
//     className={`${inputClass} pr-10`}   // space for icon
//     placeholder="Enter Current Password"
//   />
//   <span
//     className="absolute right-3 top-[58%] -translate-y-1/2 cursor-pointer text-gray-500"
//     onClick={() => setShowCurrent(!showCurrent)}
//   >
//     {showCurrent ? "👁️" : "🙈"}
//   </span>
// </div>


//                        {/* New Password */}
// <div className="mb-6 relative">
//   <label className="block text-lg font-medium mb-2">Enter New Password</label>
//   <input
//     type={showNew ? "text" : "password"}
//     className={`${inputClass} pr-10`}
//     placeholder="Enter New Password"
//   />
//   <span
//     className="absolute right-3 top-[58%] -translate-y-1/2 cursor-pointer text-gray-500"
//     onClick={() => setShowNew(!showNew)}
//   >
//     {showNew ? "👁️" : "🙈"}
//   </span>
// </div>

// {/* Confirm Password */}
// <div className="mb-6 relative">
//   <label className="block text-lg font-medium mb-2">Enter Confirm Password</label>
//   <input
//     type={showConfirm ? "text" : "password"}
//     className={`${inputClass} pr-10`}
//     placeholder="Enter Confirm Password"
//   />
//   <span
//     className="absolute right-3 top-[58%] -translate-y-1/2 cursor-pointer text-gray-500"
//     onClick={() => setShowConfirm(!showConfirm)}
//   >
//     {showConfirm ? "👁️" : "🙈"}
//   </span>
// </div>

//                     </>

//                     {/* ===== Action Buttons ===== */}
//                     <div className="flex justify-end space-x-4 mt-4">
//                         <button type="button" onClick={handleCloseModal} className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">
//                             Close
//                         </button>
//                         <button
//                             type="submit"
//                             // onClick={handleSearchEmail}
//                             // disabled={loading}
//                             className={`${SubmitButtonClass}`}
//                         >
//                             Change Password
//                         </button>
//                     </div>


//                 </div>
//             </div>
//         </>
//     )
// }

// export default ForgetPassword





import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";   // ✅ updated import
import { inputClass, ShowModalMainClass, SubmitButtonClass } from "../helper/ApplicationConstants";

const ForgetPassword = ({ setOpenP }) => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCloseModal = () => {
    setOpenP(false);
  };

  return (
    <div className={ShowModalMainClass}>
      <div className="bg-white rounded-2xl shadow-xl p-8 w-[90%] max-w-xl relative">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">
          Forget Password
        </h2>

        {/* Close Icon */}
        <button
          className="absolute top-4 right-5 text-2xl font-bold text-gray-500 hover:text-black transition"
          onClick={handleCloseModal}
        >
          &times;
        </button>

        {/* Current Password */}
        <div className="mb-6 relative">
          <label className="block text-lg font-medium mb-2 text-gray-700">
            Enter Current Password
          </label>
          <input
            type={showCurrent ? "text" : "password"}
            className={`${inputClass} pr-12`}
            placeholder="Enter Current Password"
          />
          <span
            className="absolute right-3 top-[58%] -translate-y-0/2 cursor-pointer text-gray-500 hover:text-gray-700 transition"
            onClick={() => setShowCurrent(!showCurrent)}
          >
            {showCurrent ? <EyeOff  size={20} /> : <Eye  size={20} />}
          </span>
        </div>

        {/* New Password */}
        <div className="mb-6 relative">
          <label className="block text-lg font-medium mb-2 text-gray-700">
            Enter New Password
          </label>
          <input
            type={showNew ? "text" : "password"}
            className={`${inputClass} pr-12`}
            placeholder="Enter New Password"
          />
          <span
            className="absolute right-3 top-[58%] -translate-y-0/2 cursor-pointer text-gray-500 hover:text-gray-700 transition"
            onClick={() => setShowNew(!showNew)}
          >
            {showNew ? <EyeOff  size={20} /> : <Eye  size={20} />}
          </span>
        </div>

        {/* Confirm Password */}
        <div className="mb-6 relative">
          <label className="block text-lg font-medium mb-2 text-gray-700">
            Enter Confirm Password
          </label>
          <input
            type={showConfirm ? "text" : "password"}
            className={`${inputClass} pr-12`}
            placeholder="Enter Confirm Password"
          />
          <span
            className="absolute right-3 top-[58%] -translate-y-0/2 cursor-pointer text-gray-500 hover:text-gray-700 transition"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <EyeOff  size={20} /> : <Eye  size={20} />}
          </span>
        </div>

        {/* ===== Action Buttons ===== */}
        <div className="flex justify-end space-x-4 mt-4">
          <button
            type="button"
            onClick={handleCloseModal}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Close
          </button>
          <button type="submit" className={`${SubmitButtonClass}`}>
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
