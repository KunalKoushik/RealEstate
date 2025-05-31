import React, { useState, useEffect } from "react";
import { useDarkMode } from "../DarkModeContext";
import axios from "axios";
import { FaHeart, FaRegHeart, FaBed, FaBath, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        
        if (!token || !userId) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `http://localhost:4000/api/v1/user/favorites/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFavorites(response.data.favorites);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch favorites");
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [navigate]);

  const toggleFavorite = async (propertyId) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      
      if (!token || !userId) {
        navigate("/login");
        return;
      }

      await axios.post(
        `http://localhost:4000/api/v1/user/toggleFavorite/${userId}`,
        { propertyId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state
      setFavorites(prev => 
        prev.some(fav => fav._id === propertyId)
          ? prev.filter(fav => fav._id !== propertyId)
          : [...prev, { _id: propertyId }] // In a real app, you'd want to fetch the full property details
      );
    } catch (err) {
      console.error("Error toggling favorite:", err);
      alert(err.response?.data?.message || "Failed to update favorites");
    }
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-screen ${darkMode ? "bg-black" : "bg-white"}`}>
        Loading favorites...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex justify-center items-center h-screen ${darkMode ? "bg-black" : "bg-white"}`}>
        Error: {error}
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-black text-white" : "bg-gray-100 text-black"}`}>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Your Favorites</h1>
        
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((property) => (
              <div 
                key={property._id} 
                className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition cursor-pointer"
                onClick={() => navigate(`/property/${property._id}`)}
              >
                <div className="relative">
                  <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${property.images})` }}></div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(property._id);
                    }}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow"
                  >
                    {favorites.some(fav => fav._id === property._id) ? (
                      <FaHeart className="text-red-500" />
                    ) : (
                      <FaRegHeart className="text-gray-500" />
                    )}
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{property.title}</h3>
                  <p className="text-blue-600 font-semibold mb-2">${property.price}</p>
                  <p className="text-gray-500 dark:text-gray-300 mb-4">{property.location}</p>
                  <div className="flex justify-between">
                    <span className="flex items-center">
                      <FaBed className="mr-1" /> {property.bedrooms}
                    </span>
                    <span className="flex items-center">
                      <FaBath className="mr-1" /> {property.washrooms}
                    </span>
                    <span className="flex items-center">
                      <FaMapMarkerAlt className="mr-1" /> {property.totalArea} sq.ft
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow text-center">
            <p className="text-lg mb-4">You haven't added any properties to your favorites yet.</p>
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              onClick={() => navigate("/properties")}
            >
              Browse Properties
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;