import React from 'react';
import { useDarkMode } from '../DarkModeContext';
import { FaPhoneAlt, FaUserCircle } from 'react-icons/fa';
import { BsSun, BsMoon } from 'react-icons/bs';
import Logout from '../Logout';

const Header = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <header className={`${darkMode ? 'bg-gray-900 text-white border-b-1 border-b-white' : 'border-b-1 border-b-black bg-[#ebeced] text-black'} w-full h-[12vh] z-50 transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center w-full">
        
        {/* Left Section - Search Input */}
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className={`${!darkMode ? 'bg-gray-300 text-gray-700' : 'bg-white text-black'} w-48 px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>

        {/* Right Section - Icons & Theme Toggle */}
        <div className="flex items-center space-x-4">
        <div className=""><Logout/></div>
        <div className="text-lg  p-2  shadow-md  shadow-amber-900 rounded-md mb-2 text-red-500 font-semibold transition-transform duration-200 hover:scale-90 active:scale-120">

          <FaUserCircle className="text-2xl cursor-pointer hover:scale-110 transition-transform duration-300 " />
        </div>

          {/* Theme Toggle Button */}
          
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full border border-gray-400 hover:scale-110 transition-transform duration-300 text-lg  p-2  shadow-md  shadow-amber-900  mb-2 text-red-500 font-semibold  active:scale-120"
          >
            {darkMode ? <BsSun className="text-yellow-400 text-2xl" /> : <BsMoon className="text-blue-600 text-2xl" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
