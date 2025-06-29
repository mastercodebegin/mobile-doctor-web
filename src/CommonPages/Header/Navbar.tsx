import Logo from "../../assets/Logo.png";
import SLogo from "../../assets/s-logo.png";
import { LogOut } from "lucide-react";

interface NavbarProps {
   onToggleSidebar: () => void;
}

const Navbar:React.FC<NavbarProps> = ({onToggleSidebar}) => {
  return (
    <div className="w-full sticky top-0 z-50 bg-white text-center shadow-lg px-10 py-5 flex items-center justify-between">
    {/* <Link to={"/"} > */}
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


      <button className="text-black font-semibold hover:underline"><LogOut /></button>
    </div>
  );
};

export default Navbar;






