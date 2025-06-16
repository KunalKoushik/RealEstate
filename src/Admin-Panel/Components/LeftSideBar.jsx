import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Home
} from 'lucide-react';
import { useDarkMode } from './DarkModeContext';

const LeftSideBar = () => {
  const { darkMode } = useDarkMode();

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/admin/dashboard' },
    { name: 'Users', icon: <Users className="w-5 h-5" />, path: '/admin/recentuser' },
    { name: 'Properties', icon: <Home className="w-5 h-5" />, path: '/admin/properties' },
    { name: 'Analytics', icon: <BarChart3 className="w-5 h-5" />, path: '/admin/dashboard-' },
  ];

  return (
    <div
      className={`h-[80vh] p-4 shadow-md transition-all duration-300 
        ${darkMode ? 'bg-gray-900 text-white border-r border-white'
                   : 'bg-white text-gray-900 border-r border-black'}
      `}
    >
      <nav className="mt-8 flex flex-col gap-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200
              ${isActive ? 'bg-indigo-500 text-white' : 'hover:bg-indigo-100 hover:text-indigo-600'}`
            }
          >
            {item.icon}
            <span className="text-sm font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default LeftSideBar;
