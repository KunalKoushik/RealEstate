import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RecentUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/v1/admin/users");
      
        setUsers(res.data.users); // assuming the API returns an array of users directly
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6 text-center">Recent Users</h1>
      <div className="grid grid-cols-1  gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white shadow-lg rounded-xl p-4 flex items-center space-x-4 border hover:shadow-2xl transition"
          >
            <img
              src={user.image}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h2 className="text-lg font-bold">{user.firstName} {user.lastName}</h2>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-sm text-blue-600 font-medium">{user.accountType}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentUsers;
