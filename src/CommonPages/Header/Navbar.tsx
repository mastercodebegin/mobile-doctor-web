import Logo from "../../assets/Logo.png";
import SLogo from "../../assets/s-logo.png";
import { LogOut, KeyRound, Mail, Phone } from "lucide-react";
import { clearLoginState } from "../../features/auth/UserLoginSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";

interface NavbarProps {
  onToggleSidebar: () => void;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, setToken }) => {
  const { data } = useSelector((state: RootState) => state.UserLoginSlice);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClearLoginState = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    dispatch(clearLoginState());
    setToken(null);
    navigate("/login");
  };

  // ✅ Correctly map from your API response shape
  const apiBucket = data; // outer
  const user = apiBucket; // inner user
  const avatarUrl = apiBucket?.picturePath || null;

  const firstName = user?.firstName ?? "";
  const lastName = user?.lastName ?? "";
  const email = user?.email ?? "";
  const mobile = user?.mobile ?? "";

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

  return (
    <div className="w-full sticky top-0 z-50 bg-white shadow-lg px-10 py-5 flex items-center justify-between">
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
            <span className="text-lg font-semibold text-white w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600">
              {initial}
            </span>
          )}
        </button>

        {/* Dropdown Menu */}
        {open && (
          <div
            role="menu"
            className="absolute right-0 mt-3 w-80 rounded-xl bg-[#202124] shadow-2xl text-white z-50 overflow-hidden"
          >
            {/* Top user section (Chrome-like different shade, no border) */}
            <div className="p-4 bg-[#2d2e30] text-center">
              <p className="font-extrabold text-base tracking-wide">
                {fullNameCaps || "USER"}
              </p>

              {/* Email */}
              {email ? (
                <div className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-300">
                  <Mail size={16} />
                  <span className="truncate">{email}</span>
                </div>
              ) : null}

              {/* Mobile */}
              {mobile ? (
                <div className="mt-1 flex items-center justify-center gap-2 text-sm text-gray-300">
                  <Phone size={16} />
                  <span className="truncate">{mobile}</span>
                </div>
              ) : null}
            </div>

            {/* Divider via shade (no border) */}
            <div className="h-[1px] bg-[#3c4043]" />

            {/* Options */}
            <div className="flex flex-col p-2">
              <button
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#3c4043] transition text-sm"
                onClick={() => {
                  // TODO: open change-password modal/page
                }}
              >
                <KeyRound size={18} />
                Change Password
              </button>

              <button
                onClick={handleClearLoginState}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#3c4043] transition text-sm text-red-400"
              >
                <LogOut size={18} />
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;

