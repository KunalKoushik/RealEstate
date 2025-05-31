import React, { useEffect, useState } from "react";
import { useDarkMode } from "../DarkModeContext"; // Ensure you have a dark mode context

const RecentPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { darkMode } = useDarkMode();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("https://socialappbackend-n15j.onrender.com/api/v1/post/getRecentPosts");
        const data = await response.json();
        if (data.success) {
          setPosts(data.data);
        } else {
          setError("Failed to fetch posts.");
        }
      } catch (error) {
        setError("Error fetching recent posts.");
        console.error("Error fetching recent posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className={`p-6 max-h-fit ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <h2 className="text-2xl font-semibold mb-6 text-center">Recent Posts (Last 20 Days)</h2>

      <div className="flex flex-col w-full gap-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post._id}
              className={`flex flex-col justify-between p-4 shadow-md rounded-lg max-h-fit 
                ${darkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white text-gray-800 border-gray-300"}`}
            >
              {/* User Info */}
              <div className="flex items-center w-full gap-3">
                <img
                  src={post.creatorId.image}
                  alt={post.creatorId.username}
                  className="w-10 h-10 rounded-full border border-gray-300"
                />
                <div>
                  <h3 className="text-lg font-medium">{post.description}</h3>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>@{post.creatorId.username}</p>
                </div>
              </div>

              {/* Comments & Likes */}
              <div className="mt-3">
                <h4 className="text-sm font-semibold">Comments & Likes:</h4>
                {post.CommentsAndLike.length > 0 ? (
                  <ul>
                    {post.CommentsAndLike.slice(0, 3).map((comment, index) => (
                      <li
                        key={index}
                        className={`flex justify-between items-center text-sm px-3 py-1 rounded-md my-1 
                          ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-600"}`}
                      >
                        <span>{comment.comment || "No comment"}</span>
                        {comment.like ? <span className="text-green-500">👍</span> : null}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No comments yet</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className={`text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No recent posts available</div>
        )}
      </div>
    </div>
  );
};

export default RecentPosts;
