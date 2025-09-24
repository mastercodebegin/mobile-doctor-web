import Logo from "../../assets/Logo.png";
import SLogo from "../../assets/s-logo.png";
import { LogOut, KeyRound, Mail, User } from "lucide-react";
import { clearLoginState } from "../../features/auth/UserLoginSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import UpdatePassword from "../../components/UpdatePassword";

interface NavbarProps {
  onToggleSidebar: () => void;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, setToken }) => {
  const { data } = useSelector((state: RootState) => state.UserLoginSlice);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [openP, setOpenP] = useState(false)
  const [activeItem, setActiveItem] = useState<string | null>(null);


  const handleClearLoginState = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    dispatch(clearLoginState());
    setToken(null);
    navigate("/login");
  };

  //  Correctly map from your API response shape
  const apiBucket = data; // outer
  const user = apiBucket; // inner user
  const avatarUrl = apiBucket?.picturePath || null;

  const firstName = user?.firstName ?? "";
  const lastName = user?.lastName ?? "";
  const email = user?.email ?? "";

  const fullNameCaps = `${firstName} ${lastName}`.trim().toUpperCase();
  const initial =
    (firstName?.trim()?.[0] ??
      email?.trim()?.[0] ??
      "U").toUpperCase();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setActiveItem(null);
  }, [location.pathname]);

  return (
    <div className="w-full sticky top-0 z-40 bg-white shadow-lg px-10 py-5 flex items-center justify-between">
      {/* Sidebar Toggle + Logo */}
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

      {/* Right Profile Dropdown */}
      <div className="relative" ref={dropdownRef}>
        {/* Avatar Button */}
        <button
          type="button"
          title={fullNameCaps ?? "Alfaiz"}
          onClick={() => setOpen((v) => !v)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 overflow-hidden focus:outline-none"
          aria-haspopup="menu"
          aria-expanded={open}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={fullNameCaps || "User"}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-lg font-semibold text-white w-10 h-10 flex items-center justify-center rounded-full bg-gray-400">
              {initial}
            </span>
          )}
        </button>

        {/* Dropdown Menu */}
        {open && (
          <div
            role="menu"
            className="absolute right-0 mt-3 w-60 border border-gray-300 rounded-xl bg-white shadow-2xl z-50 overflow-hidden"
          >
            {/* Top user section (Chrome-like different shade, no border) */}
            <div className="p-4 bg-white text-center rounded-md">
              <p className="font-bold text-base tracking-wide">
                {fullNameCaps || "USER"}
              </p>

              {/* Email */}
              {email ? (
                <div className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Mail size={16} />
                  <span className="truncate">{email}</span>
                </div>
              ) : null}
            </div>

            {/* Divider via shade (no border) */}
            <div className="h-[1px] bg-gray-300" />

            {/* Options */}
            <div className="flex flex-col p-2">
              <button
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition text-sm 
    ${activeItem === "profile" ? "bg-gray-500 text-white" : "hover:bg-gray-300"}`}
                onClick={() => { navigate("/settings"), setOpen(false), setActiveItem("profile"); }}
              >
                <User size={18} />
                Profile
              </button>

              <button
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition text-sm 
    ${activeItem === "updatePassword" ? "bg-gray-500 text-white" : "hover:bg-gray-300"}`}
                onClick={() => { setOpenP(true), setActiveItem("updatePassword"); }}
              >
                <KeyRound size={18} />
                Update Password
              </button>

              {/* Divider via shade (no border) */}
              <div className="h-[1px] bg-gray-300 my-2 p-0" />

              <button
                onClick={handleClearLoginState}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm hover:text-red-600 text-red-400"
              >
                <LogOut size={18} />
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>

      {openP && <UpdatePassword setOpenP={setOpenP} setActiveItem={setActiveItem} />}
    </div>
  );
};

export default Navbar;

