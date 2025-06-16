import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Analatics = () => {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/analytics/user-growth");
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const chartData = {
    labels: userData.map((item) => item.date),
    datasets: [
      {
        label: "User Growth",
        data: userData.map((item) => item.users),
        fill: false,
        borderColor: "rgb(32, 87, 129)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "User Growth Over the Last 15 Days",
      },
    },
  };

  return (
    <div className="p-4 shadow-md rounded-md shadow-gray-500 px-20 h-[400px]">
      <h2 className="text-2xl font-bold mb-4">User Growth Chart</h2>
      <div className="h-full">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Analatics;
