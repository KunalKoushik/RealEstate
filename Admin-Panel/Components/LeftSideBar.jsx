import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  BarChart3,
  Settings
} from 'lucide-react';
import { useDarkMode } from './DarkModeContext';

const LeftSideBar = () => {
  const { darkMode } = useDarkMode();

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/admin/dashboard' },
    { name: 'Users', icon: <Users className="w-5 h-5" />, path: '/admin/recentuser' },
    // Uncomment below as needed
    // { name: 'Content', icon: <MessageSquare className="w-5 h-5" />, path: '/content' },
    // { name: 'Analytics', icon: <BarChart3 className="w-5 h-5" />, path: '/analytics' },
    // { name: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/settings' }
  ];

  return (
    <div
      className={`fixed md:relative top-0 left-0 h-[80vh] md:h-screen  md:w-1/4 lg:w-full p-4 transition-all duration-300 shadow-md
        ${darkMode
          ? 'bg-gray-900 text-white border-r border-white'
          : ' text-gray-900 border-r border-black'}
      `}
    >
      <nav className="mt-8 flex flex-col gap-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200
              ${isActive
                ? 'bg-indigo-500 text-white'
                : 'hover:bg-indigo-100 hover:text-indigo-600'}`
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
