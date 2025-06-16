import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardContent from "./DashboardContent";
import RecentUsers from "./RecentUsers";
import PostTypeChart from "./PostTypeChart";
import Properties from "./Properties";
import { useDarkMode } from "../DarkModeContext";

const RightCorner = () => {
  const { darkMode } = useDarkMode();

  return (
    <div
      className={`w-full h-full transition-colors duration-300 
        ${darkMode ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-900 border-white"}
      `}
    >
      <div className="h-full">
        <Routes>
          <Route path="/dashboard" element={<DashboardContent />} />
          <Route path="/recentuser" element={<RecentUsers />} />
          <Route path="/properties" element={<Properties />} />
        </Routes>
      </div>
    </div>
  );
};

export default RightCorner;
