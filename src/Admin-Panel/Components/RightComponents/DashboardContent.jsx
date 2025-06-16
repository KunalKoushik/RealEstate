import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DashboardContent = () => {
  const [userCount, setUserCount] = useState(0);
  const [propertyCount, setPropertyCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [userRes, propertyRes] = await Promise.all([
          axios.get("http://localhost:4000/api/v1/admin/countUsers"),
          axios.get("http://localhost:4000/api/v1/admin/getAllPropertiesCount"),
        ]);

        setUserCount(userRes.data.totalUsers || 0);
        setPropertyCount(propertyRes.data.totalProperties || 0);
      } catch (error) {
        console.error("Error fetching counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  if (loading) {
    return <div className="p-4 text-lg">Loading Dashboard...</div>;
  }

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-blue-500 text-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-2">Total Users</h2>
        <p className="text-3xl font-bold">{userCount}</p>
      </div>
      <div className="bg-green-500 text-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-2">Total Properties</h2>
        <p className="text-3xl font-bold">{propertyCount}</p>
      </div>
    </div>
  );
};

export default DashboardContent;
