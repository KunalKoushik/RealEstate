import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardContent from './DashboardContent';
import RecentUsers from './RecentUsers';
import { useDarkMode } from '../DarkModeContext';
// import PostTypeChart from './PostTypeChart';

const RightCorner = () => {
  const { darkMode } = useDarkMode();

  return (
    <div 
      className={`h-[calc(100vh-12vh)]   overflow-hidden transition-colors duration-300 
        ${darkMode ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-900 border-white'}`}
    >
     
      <div className='border-2 border-amber-500 h-full'>
        hello 
        <Routes>
        {/* <Route path="/admin/dashboard" element={<DashboardContent />} /> */}
        <Route path="/admin/recentuser" element={<RecentUsers/>} />
        {/* <Route path="/admin/content" element={<PostTypeChart />} /> */}
      </Routes>
       ram
      </div>
    
    </div>
  );
};

export default RightCorner;
