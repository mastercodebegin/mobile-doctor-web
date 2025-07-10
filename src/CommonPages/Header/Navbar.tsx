import Logo from "../../assets/Logo.png";
import SLogo from "../../assets/s-logo.png";
import { LogOut } from "lucide-react";
import { clearLoginState } from "../../features/auth/UserLoginSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { Dispatch } from "@reduxjs/toolkit";
import { SetStateAction } from "react";

interface NavbarProps {
   onToggleSidebar: () => void;
   setToken: Dispatch<SetStateAction<string>>;
}

const Navbar:React.FC<NavbarProps> = ({onToggleSidebar, setToken }) => {

  const { data } = useSelector((state: RootState) => state.UserLoginSlice);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate(); 

  const handleClearLoginState = () => {
    // ✅ Remove token
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");

    // ✅ Clear redux login state
    dispatch(clearLoginState());
    setToken(null)

    console.log("User logged out:", data);

    // ✅ Navigate to login
    navigate("/login");
  };

  return (
    <div className="w-full sticky top-0 z-50 bg-white text-center shadow-lg px-10 py-5 flex items-center justify-between">
     <div className="cursor-pointer" onClick={onToggleSidebar}>
      <img
        src={Logo}
        alt="PhopaxWeb Logo"
        className="hidden lg:block w-[120px]"
      />

      <img
        src={SLogo}
        alt="PhopaxWeb Small Logo"
        className="block lg:hidden w-[18px] cursor-pointer"
      />
      </div>


      <button 
      onClick={handleClearLoginState}
      className="text-red-500 cursor-pointer hover:text-red-600 font-semibold hover:underline"><LogOut /></button>
    </div>
  );
};

export default Navbar;






