import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";

import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/userManagement/UserManagement";
import Sidebar from "./CommonPages/Sidebar/Sidebar";
import Navbar from "./CommonPages/Header/Navbar";
import AddCategory from "./pages/AddCategory/AddCategory";
import AddSubCategory from "./pages/AddSubCategory/AddSubCategory";
import AddBrand from "./pages/AddBrand/AddBrand";
import AddMobileNumber from "./pages/AddMobileNumber/AddMobileNumber";
import AddVarient from "./pages/AddVarient/AddVarient";
import AddVarientColor from "./pages/AddVarientColor/AddVarientColor";
import { useMediaQuery } from "./hooks/useMediaQuery";
import { ToastContainer } from "react-toastify";
import ColorName from "./pages/AddColorName/ColorName";

function App() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(!isDesktop);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);

  // Adjust sidebar state based on screen size
  React.useEffect(() => {
    setSidebarCollapsed(!isDesktop);
    setSidebarMobileOpen(false);
  }, [isDesktop]);

  const handleSidebarToggle = () => {
    if (isDesktop) setSidebarCollapsed((prev) => !prev);
    else setSidebarMobileOpen((prev) => !prev);
  };

  return (
    <Router>
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar onToggleSidebar={handleSidebarToggle} />
      </div>

      <div className="flex pt-16 h-screen">
        {/* Sidebar */}
        <Sidebar
          collapsed={isDesktop ? sidebarCollapsed : !sidebarMobileOpen}
          onNavigate={() => !isDesktop && setSidebarMobileOpen(false)}
        />
        {/* Main Content Area */}
        <div
          className={`flex-1 overflow-auto transition-all duration-300 bg-gray-50 p-4 ${
            isDesktop
              ? sidebarCollapsed
                ? "ml-0"
                : "ml-64"
              : "ml-0"
          }`}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/category" element={<AddCategory />} />
            <Route path="/sub-category" element={<AddSubCategory />} />
            <Route path="/brand" element={<AddBrand />} />
            <Route path="/mobile-number" element={<AddMobileNumber />} />
            <Route path="/color-name" element={<ColorName />} />
            <Route path="/variant" element={<AddVarient />} />
            <Route path="/variant-color" element={<AddVarientColor />} />
          </Routes>
        </div>
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;






























// //import React from 'react';
// //import logo from './logo.svg';
// import { Route, Routes } from 'react-router-dom'
// import './App.css';
// import Login from './roles/Admin/screen/login/Login';
// // import Login from './roles/Admin/screen/login/Login';
// import Dashboard from './commonScreen/dashboard/Dashboard';
// import UserManagement from './roles/Admin/screen/usermanagement/VendorManagement';
// import AddCategory from './roles/Admin/screen/addCategory/AddCategory';
// import AddSubCategory from './roles/Admin/screen/addSubCategory/AddSubCategory';
// import AddBrand from './roles/Admin/screen/addBrand/AddBrand';
// import AddModalNumber from './roles/Admin/screen/addModalNumber/AddModalNumber';
// import CreateUserModal from './roles/Admin/screen/usermanagement/CreateVendorModal';
// import AddVariant from './roles/Admin/screen/addVariant/AddVariant';
// import AddVendorProduct from './roles/Admin/screen/addVendorProduct/AddVendorProduct';
// import { useDispatch, useSelector } from 'react-redux'
// import { useEffect } from 'react';
// import AddVariantColor from './roles/Admin/screen/addVariantColor/AddVariantColor';


// //import SpinnerHelper from './helpers/SpinnerHelper';

// const App=(props:any)=> {
//   const loginReducerResponsee = useSelector((state: any) => state.LoginReducer)
// //   const loginReducerResponse ={'role':1}
// // // const roleId=loginReducerResponse;
// //   useEffect(()=>{
// // console.log('loginReducerResponse app.tsx>>>',loginReducerResponsee);

// //   },[loginReducerResponsee])
  
//     return (<Routes>
      
//       <Route path='/dashboard' element={<Dashboard />} />
//       <Route path='/' element={<Login />} />
//       <Route path='/addproduct' element={< AddVendorProduct />} />
//       <Route path='/usermanagement' element={<UserManagement />} />
//       <Route path='/addcategory' element={<AddCategory />} />
//       <Route path='/addsubcategory' element={<AddSubCategory />} />
//       <Route path='/addbrand' element={<AddBrand />} />
//       <Route path='/addmodalnumber' element={<AddModalNumber />} />
//       <Route path='/addvariant' element={<AddVariant />} />
//       <Route path='/addvariantcolor' element={<AddVariantColor />} />
      
      
//     </Routes>)

//     // switch (loginReducerResponse?.role) {
//     //   case  1: 
//     //  return <Routes>  
//     //     <Route path='/' element={<Login />} />
//     //     <Route path='/dashboard' element={<Dashboard/>} />
//     //     <Route path='/addproduct' element={< AddProduct />} />
//     //     <Route path='/usermanagement' element={<UserManagement />} />
//     //     <Route path='/addcategory' element={<AddCategory />} />
//     //     <Route path='/addsubcategory' element={<AddSubCategory />} />
//     //     <Route path='/addbrand' element={<AddBrand />} />
//     //     <Route path='/addmodalnumber' element={<AddModalNumber />} />
//     //     <Route path='/addvariant' element={<AddVariant />} />
//     //   </Routes>
        
//     //     case 2:  
//     //     return <Routes>  
//     //        <Route path='/' element={<Login />} />
//     //        <Route path='/dashboard' element={<Dashboard />} />
//     //        <Route path='/addproduct' element={< AddProduct />} />
//     //        <Route path='/usermanagement' element={<UserManagement />} />
//     //        <Route path='/addcategory' element={<AddCategory />} />
//     //        <Route path='/addsubcategory' element={<AddSubCategory />} />
//     //        <Route path='/addbrand' element={<AddBrand />} />
//     //        <Route path='/addmodalnumber' element={<AddModalNumber />} />
//     //        <Route path='/addvariant' element={<AddVariant />} />
//     //      </Routes>

//     //     case 3:  
//     //     return <Routes>  
//     //       <Route path='/' element={<Login />} />
//     //       <Route path='/dashboard' element={<Dashboard />} />
//     //       <Route path='/addproduct' element={< AddProduct />} />
//     //       <Route path='/usermanagement' element={<UserManagement />} />
//     //       <Route path='/addcategory' element={<AddCategory />} />
//     //       <Route path='/addsubcategory' element={<AddSubCategory />} />
//     //       <Route path='/addbrand' element={<AddBrand />} />
//     //       <Route path='/addmodalnumber' element={<AddModalNumber />} />
//     //       <Route path='/addvariant' element={<AddVariant />} />
//     //     </Routes>


//     //     case 4:  
//     //     return <Routes>  
//     //       <Route path='/' element={<Login />} />
//     //       <Route path='/dashboard' element={<Dashboard />} />
//     //       <Route path='/addproduct' element={< AddProduct />} />
//     //       <Route path='/usermanagement' element={<UserManagement />} />
//     //       <Route path='/addcategory' element={<AddCategory />} />
//     //       <Route path='/addsubcategory' element={<AddSubCategory />} />
//     //       <Route path='/addbrand' element={<AddBrand />} />
//     //       <Route path='/addmodalnumber' element={<AddModalNumber />} />
//     //       <Route path='/addvariant' element={<AddVariant />} />
//     //     </Routes>
        
        
//     //     case 5: 
//     //     return <Routes>  
//     //       <Route path='/' element={<Login />} />
//     //       <Route path='/dashboard' element={<Dashboard />} />
//     //       <Route path='/addproduct' element={< AddProduct />} />
//     //       <Route path='/usermanagement' element={<UserManagement />} />
//     //       <Route path='/addcategory' element={<AddCategory />} />
//     //       <Route path='/addsubcategory' element={<AddSubCategory />} />
//     //       <Route path='/addbrand' element={<AddBrand />} />
//     //       <Route path='/addmodalnumber' element={<AddModalNumber />} />
//     //       <Route path='/addvariant' element={<AddVariant />} />
//     //     </Routes>


//     //   default:
//     //     return <Routes>  
//     //     <Route path='/' element={<Login />} />
//     //   </Routes>
//     // }}

//     }

// export default App