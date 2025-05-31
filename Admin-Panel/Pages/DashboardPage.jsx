import React from 'react';
import { Outlet } from "react-router-dom";
import LeftSideBar from "../Components/LeftSideBar";
import RightArea from "../Components/RightComponents/RightArea";
// import { DarkModeProvider } from '../Components/DarkModeContext';

const DashboardPage = () => {
  return (
    
    <div className=" flex mt-20 min-h-screen text-black">
      <div className="w-1/8">
        <LeftSideBar />
      </div>
      <div className="w-7/8  ">
        <RightArea />
        <Outlet /> {/* For nested routes, optional */}
      </div>
    </div>
  );
}

export default DashboardPage;
