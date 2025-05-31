import React, { useState, useEffect } from "react";
import { useDarkMode } from "../components/DarkModeContext";
import AOS from "aos";
import "aos/dist/aos.css";
import Logout from "../components/Auth/Logout";
import axios from "axios";
import { FaUser, FaHome, FaHistory, FaStar, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState(null);
  const [listedProperties, setListedProperties] = useState([]);
  const [purchasedProperties, setPurchasedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      offset: 200,
      duration: 400,
      easing: "ease-in-sine",
      delay: 50,
    });
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        navigate("/login");
        return;
      }

      // Fetch user profile
      const userResponse = await axios.get(
        `http://localhost:4000/api/v1/user/profile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fetch user's listed properties
      const propertiesResponse = await axios.get(
        `http://localhost:4000/api/v1/property/userProperties/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fetch purchased properties
      const purchasedResponse = await axios.get(
        `http://localhost:4000/api/v1/property/purchasedProperties/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserData(userResponse.data.user);
      setListedProperties(propertiesResponse.data.properties);
      setPurchasedProperties(purchasedResponse.data.properties);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    // Navigate to edit profile page or show modal
    console.log("Edit profile clicked");
  };

  if (loading) {
    return (
      <div
        className={`flex justify-center items-center h-screen ${darkMode ? "bg-black" : "bg-white"
          }`}
      >
        Loading profile...
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen mt-17  ${darkMode ? "bg-black text-white" : "bg-gray-100 text-black"
        }`}
    >
      <div className="container mx-auto py-8 px-4">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
            {userData?.profilePicture ? (
              <img
                src={userData.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <FaUser className="text-6xl text-gray-500" />
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">
              {userData?.firstName} {userData?.lastName}
            </h1>
            <p className="text-lg text-gray-500">{userData?.email}</p>
            <p className="text-lg">
              {userData?.phone || "No phone number provided"}
            </p>
            <button
              onClick={handleEditProfile}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              <FaEdit /> Edit Profile
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b mb-8">
          <button
            className={`px-4 py-2 font-medium ${activeTab === "profile" ? "border-b-2 border-blue-500" : ""
              }`}
            onClick={() => setActiveTab("profile")}
          >
            <FaUser className="inline mr-2" /> Profile
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === "properties" ? "border-b-2 border-blue-500" : ""
              }`}
            onClick={() => setActiveTab("properties")}
          >
            <FaHome className="inline mr-2" /> My Properties
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === "purchases" ? "border-b-2 border-blue-500" : ""
              }`}
            onClick={() => setActiveTab("purchases")}
          >
            <FaHistory className="inline mr-2" /> Purchases
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === "reviews" ? "border-b-2 border-blue-500" : ""
              }`}
            onClick={() => setActiveTab("reviews")}
          >
            <FaStar className="inline mr-2" /> My Reviews
          </button>
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {activeTab === "profile" && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-500">First Name</h3>
                  <p>{userData?.firstName}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-500">Last Name</h3>
                  <p>{userData?.lastName}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-500">Email</h3>
                  <p>{userData?.email}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-500">Phone</h3>
                  <p>{userData?.phone || "Not provided"}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-500">Joined On</h3>
                  <p>{new Date(userData?.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "properties" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">My Listed Properties</h2>
              {listedProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listedProperties.map((property) => (
                    <div
                      key={property._id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-lg transition"
                      onClick={() => navigate(`/property/${property._id}`)}
                    >
                      <div
                        className="h-48 bg-cover bg-center"
                        style={{ backgroundImage: `url(${property.images})` }}
                      ></div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg">{property.title}</h3>
                        <p className="text-blue-600 font-semibold">
                          ${property.price}
                        </p>
                        <p className="text-gray-500">{property.location}</p>
                        <div className="flex justify-between mt-2">
                          <span className="flex items-center">
                            <FaBed className="mr-1" /> {property.bedrooms}
                          </span>
                          <span className="flex items-center">
                            <FaBath className="mr-1" /> {property.washrooms}
                          </span>
                          <span>{property.totalArea} sq.ft</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center">
                  <p>You haven't listed any properties yet.</p>
                  <button
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    onClick={() => navigate("/property")}
                  >
                    List a Property
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "purchases" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">My Purchases</h2>
              {purchasedProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {purchasedProperties.map((property) => (
                    <div
                      key={property._id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-lg transition"
                      onClick={() => navigate(`/property/${property._id}`)}
                    >
                      <div
                        className="h-48 bg-cover bg-center"
                        style={{ backgroundImage: `url(${property.images})` }}
                      ></div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg">{property.title}</h3>
                        <p className="text-blue-600 font-semibold">
                          ${property.price}
                        </p>
                        <p className="text-gray-500">{property.location}</p>
                        <div className="flex justify-between mt-2">
                          <span className="flex items-center">
                            <FaBed className="mr-1" /> {property.bedrooms}
                          </span>
                          <span className="flex items-center">
                            <FaBath className="mr-1" /> {property.washrooms}
                          </span>
                          <span>{property.totalArea} sq.ft</span>
                        </div>
                        <div className="mt-2 text-sm text-green-600">
                          Purchased on{" "}
                          {new Date(property.purchaseDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center">
                  <p>You haven't purchased any properties yet.</p>
                  <button
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    onClick={() => navigate("/properties")}
                  >
                    Browse Properties
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">My Reviews</h2>
              {/* Reviews content would go here */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center">
                <p>Your reviews will appear here.</p>
              </div>
            </div>
          )}
        </div>

        <Logout />
      </div>
    </div>
  );
};

export default Profile;
