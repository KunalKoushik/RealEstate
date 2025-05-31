import React from 'react';
import { Outlet } from "react-router-dom";
import LeftSideBar from "../Components/LeftSideBar";
import RightArea from "../Components/RightComponents/RightArea";

const DashboardPage = () => {
  return (
    <div className="flex mt-20  h-full">
      <div className="w-1/8">
        <LeftSideBar />
      </div>
      <div className="flex-1 h-full overflow-y-auto">
        <RightArea />
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardPage;
