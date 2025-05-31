import React, { useEffect, useState } from "react";
import { useDarkMode } from "../DarkModeContext";
import RecentPosts from "./RecentPosts";

const RecentUsers = () => {
  const { darkMode } = useDarkMode();
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://socialappbackend-n15j.onrender.com/api/v1/auth/count30users"
        );
        const data = await response.json();

        if (data.users) {
          setRecentUsers(data.users);
        }
      } catch (error) {
        console.error("Error fetching recent users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div
      className={`p-8 transition-colors duration-300 grid grid-cols-1 sm:grid-cols-2 gap-8 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Recent Users Section */}
      <div
        className={`rounded-xl shadow-lg p-6 transition-colors duration-300 max-h-[80vh] overflow-y-auto ${ // Adjusted here
          darkMode
            ? "bg-gray-800 text-white shadow-gray-700"
            : "bg-white text-gray-900 shadow-gray-300"
        }`}
      >
        <h2 className="text-lg font-semibold mb-4">Recent Users</h2>

        <div className="space-y-4">
          {recentUsers.length > 0 ? (
            recentUsers.map((user) => (
              <div key={user.id} className="flex items-center space-x-3">
                <img
                  src={user.image}
                  alt={user.username}
                  className="w-12 h-12 rounded-full"
                />
                <p className="font-medium">{user.username}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No recent users found.</p>
          )}
        </div>
      </div>

      {/* Recent Posts Section */}
      <div
        className={`rounded-xl shadow-lg p-6 transition-colors duration-300 max-h-[80vh] overflow-y-auto ${ // Adjusted here
          darkMode
            ? "bg-gray-800 text-white shadow-gray-700"
            : "bg-white text-gray-900 shadow-gray-300"
        }`}
      >
        <RecentPosts />
      </div>
    </div>
  );
};

export default RecentUsers;