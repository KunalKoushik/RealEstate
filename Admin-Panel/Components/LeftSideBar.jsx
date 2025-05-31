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
    { name: 'Dashboard', icon: <LayoutDashboard />, path: '/dashboard' },
    { name: 'Users', icon: <Users />, path: '/recentuser' },
    // { name: 'Content', icon: <MessageSquare />, path: '/content' },
    // { name: 'Analytics', icon: <BarChart3 />, path: '/analytics' },
    // { name: 'Settings', icon: <Settings />, path: '/settings' }
  ];

  return (
    <div 
      className={`fixed md:relative top-0 left-0 h-[80vh] md:h-screen w-64 md:w-1/4 lg:w-1/5 p-4 transition-all duration-300 
      ${darkMode ? 'bg-gray-900 text-white border-r border-white' : 'border-r border-black text-gray-900'} shadow-md`}
    >
      <nav className="mt-8">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `w-full flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive ? 'bg-indigo-500 text-white' : 'hover:bg-indigo-50 hover:text-indigo-600'
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default LeftSideBar;
 