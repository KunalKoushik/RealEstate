import React, { useEffect, useState } from 'react';
import axios from "axios";
import {
  TrendingUp,
  UserCheck,
  MessageCircle,
  Flag
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';
import Analatics from './Analatics';
import PostTypeChart from './PostTypeChart';
import useEngagementTracker from "./useEngagementTracker"
const DashboardContent = () => {
  const userId= "67aef1fb16eb48ca080786ff";
  useEngagementTracker(userId);
  const { darkMode } = useDarkMode();
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [propertyCount, setPCount] = useState(0);

  useEffect(() => {
    // Fetch total users count
    fetch('https://socialappbackend-n15j.onrender.com/api/v1/auth/countusers')
      .then(response => response.json())
      .then(data => setTotalUsers(data.count))
      .catch(error => console.error('Error fetching total users:', error));

    // Fetch post count
    fetch('https://socialappbackend-n15j.onrender.com/api/v1/post/getAllPosts')
      .then(response => response.json())
      .then(data => setPostCount(data.PostCount))
      .catch(error => console.error('Error fetching post count:', error)); 
      
      // yaha last 30 days k user count fetch krne h  api is 
      fetch('https://socialappbackend-n15j.onrender.com/api/v1/post/getTotalComments')
        .then(response => response.json())
        .then(data => setTotalComments(data.totalComments))
        .catch(error => console.error('Error fetching post count:', error)); 

        

  }, []);

  const stats = [
    { title: 'Total Users', value: `${totalUsers}`, trend: '+12%', icon: <UserCheck className="w-6 h-6" /> },
    { title: 'Post Counts', value: `${postCount}`, trend: '+8%', icon: <MessageCircle className="w-6 h-6" /> },
    { title: 'total comments', value: `${totalComments}`, trend: '-2%', icon: <Flag className="w-6 h-6" /> },
    { title: 'Engagement time total', value: `${Math.floor(totalEngagementTime / 60)} minutes`, trend: '+5', icon: <TrendingUp className="w-6 h-6" /> },
  ];

  return (
    <div className='min-h-screen'>
      <div className={`pt-8 px-10 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'text-gray-900'}`}>
        {stats.map((stat, index) => (
          <div key={index} className={`rounded-xl shadow-sm shadow-gray-500 p-6 transition-colors bg-gray-100 duration-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {stat.icon}
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-sm ${stat.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {stat.trend}
              </span>
              <span className="text-sm text-gray-500"> vs last month</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between py-8 px-36 mx-auto">
        <Analatics className='' />
        <PostTypeChart className='' />
      </div>
    </div>
  );
};

export default DashboardContent;
