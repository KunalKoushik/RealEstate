import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { useDarkMode } from "../DarkModeContext";

const PostTypeChart = () => {
  const { darkMode } = useDarkMode();
  const [postTypeData, setPostTypeData] = useState([
    { name: "Images", value: 0 },
    { name: "Videos", value: 0 },
  ]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("https://socialappbackend-n15j.onrender.com/api/v1/post/getAllPosts");
        const result = await response.json();
        if (result.success && result.data) {
          let imageCount = 0;
          let videoCount = 0;
          
          result.data.forEach((post) => {
            const url = post.postUrl;
            if (url) {
              const fileType = url.split(".").pop().toLowerCase();
              if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileType)) {
                imageCount++;
              } else if (["mp4", "webm", "mov", "avi"].includes(fileType)) {
                videoCount++;
              }
            }
          });

          setPostTypeData([
            { name: "Images", value: imageCount },
            { name: "Videos", value: videoCount },
          ]);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  const COLORS = darkMode ? ["#4F46E5", "#10B981"] : ["#3B82F6", "#52C55E"];
  const bgColor = darkMode ? "bg-gray-800 text-white" : "bg-white text-black";

  return (
    <div className={`p-4 rounded-lg shadow-lg shadow-gray-500 ${bgColor}`}>
      <h2 className="text-lg font-semibold mb-3">Post Type Distribution</h2>
      <PieChart width={400} height={250}>
        <Pie 
          data={postTypeData} 
          cx={200} 
          cy={125} 
          outerRadius={80} 
          dataKey="value" 
          label={({ name, value }) => `${name}: ${value}`}
        >
          {postTypeData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
};

export default PostTypeChart;
