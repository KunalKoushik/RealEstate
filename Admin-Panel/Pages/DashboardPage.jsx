import React from 'react';
import { Outlet } from "react-router-dom";
import LeftSideBar from "../Components/LeftSideBar";
import RightArea from "../Components/RightComponents/RightArea";

const DashboardPage = () => {
  return (
    <div className="bg-black flex mt-20 min-h-screen text-black">
      <div className="w-1/4">
        <LeftSideBar />
      </div>
      <div className="w-3/4 p-4">
        <RightArea />
        <Outlet /> {/* For nested routes, optional */}
      </div>
    </div>
  );
}

export default DashboardPage;
