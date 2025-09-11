import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { inputClass, ShowModalMainClass, SubmitButtonClass } from "../helper/ApplicationConstants";
import { UpdatePasswordThunk } from "../pages/Password/PasswordSlice";
import { AppDispatch, RootState } from "../redux/store";
import { toast } from "react-toastify";

const UpdatePassword = ({ setOpenP }) => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  // Form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.PasswordSlice); 

  const handleCloseModal = () => {
    setOpenP(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (newPassword !== confirmPassword) {
    toast.warn("Please correct new password");
    return; 
  }

  if (currentPassword === newPassword) {
    toast.warn("New password must be different from current password");
    return; 
  }

  try {
    const requestData = {
      oldPassWord: currentPassword.trim(),
      newPassWord: newPassword.trim(),
    };
    console.log("Check RequestData Before Api Call :----", requestData);

    const result = await dispatch(UpdatePasswordThunk(requestData));

    if (result.type === "UPDATE/PASSWORD/fulfilled") {
      toast.success("Password updated successfully!");
      handleCloseModal();
    } else {
      console.log("Failed to update password. Please try again.");
    }
  } catch (error) {
    console.error("Password update error:", error);
  }
};


  return (
    <div className={ShowModalMainClass}>
      <div className="bg-white rounded-2xl shadow-xl p-8 w-[90%] max-w-xl relative">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">
          Update Password
        </h2>

        {/* Close Icon */}
        <button
          className="absolute top-4 right-5 text-2xl font-bold text-gray-500 hover:text-black transition"
          onClick={handleCloseModal}
        >
          &times;
        </button>

        <form onSubmit={handleSubmit}>
          {/* Current Password */}
          <div className="mb-6 relative">
            <label className="block text-lg font-medium mb-2 text-gray-700">
              Enter Current Password
            </label>
            <input
              type={showCurrent ? "text" : "password"}
              className={`${inputClass} pr-12`}
              placeholder="Enter Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={isLoading}
              required
            />
            <span
              className="absolute right-3 top-[58%] -translate-y-0/2 cursor-pointer text-gray-500 hover:text-gray-700 transition"
              onClick={() => setShowCurrent(!showCurrent)}
            >
              {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
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
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isLoading}
              required
            />
            <span
              className="absolute right-3 top-[58%] -translate-y-0/2 cursor-pointer text-gray-500 hover:text-gray-700 transition"
              onClick={() => setShowNew(!showNew)}
            >
              {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              required
            />
            <span
              className="absolute right-3 top-[58%] -translate-y-0/2 cursor-pointer text-gray-500 hover:text-gray-700 transition"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              disabled={isLoading}
            >
              Close
            </button>
            <button 
              type="submit" 
              className={`${SubmitButtonClass} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
