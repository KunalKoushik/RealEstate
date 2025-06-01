import React, { useState, useEffect } from "react";
import { useDarkMode } from "../components/DarkModeContext";
import AOS from "aos";
import "aos/dist/aos.css";
import Logout from "../components/Auth/Logout";
import axios from "axios";
import { FaUser, FaHome, FaHistory, FaStar, FaEdit, FaBed, FaBath } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState(null); // This will hold the profile object, which contains user details
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
    fetchProfileData(); // Call a single function to fetch all initial data
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token) {
        navigate("/account");
        return;
      }

      // Fetch user's profile which includes populated favorites and purchaseHistory
      const profileResponse = await axios.get(
        `http://localhost:4000/api/v1/profile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Set the entire profile object
      setUserData(profileResponse.data.profile);

      // Purchase history is already populated within the profile response
      setPurchasedProperties(profileResponse.data.profile.purchaseHistory || []);

      // --- Fetch Listed Properties ---
      // This requires a dedicated backend endpoint to fetch properties listed by the user.
      // Ensure you've added the necessary route and controller as shown in the backend section below.
     try {
    // The userId is no longer passed in the URL, as the backend will derive it
    // from the authenticated user's token via the 'protect' middleware.
    const listedPropertiesResponse = await axios.get(
      `http://localhost:4000/api/v1/property/user/properties`, // Updated endpoint
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setListedProperties(listedPropertiesResponse.data.properties || []);
} catch (listedError) {
    console.warn("Could not fetch user's listed properties. Make sure the endpoint /api/v1/property/user/properties exists and is correctly implemented with authentication.", listedError);
    setListedProperties([]); // Default to empty array if fetch fails
}

    } catch (error) {
      console.error("Error fetching profile data:", error);
      setUserData(null);
      setListedProperties([]);
      setPurchasedProperties([]);
      if (error.response && error.response.status === 401) {
          navigate("/account"); // Redirect to login if token is invalid/expired
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    navigate("/edit-profile"); // You'll need to create this route and component
  };

  if (loading) {
    return (
      <div
        className={`flex justify-center items-center h-screen ${
          darkMode ? "bg-black text-white" : "bg-white"
        }`}
      >
        Loading profile...
      </div>
    );
  }

  // Fallback if userData is null after loading (e.g., due to an error)
  if (!userData) {
      return (
          <div className={`flex flex-col justify-center items-center h-screen ${darkMode ? "bg-black text-white" : "bg-white"}`}>
              <p>Failed to load profile. Please ensure you are logged in.</p>
              <button onClick={() => navigate("/account")} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">Go to Login</button>
          </div>
      );
  }

  return (
    <div
      className={`min-h-screen pt-20 ${
        darkMode ? "bg-black text-white" : "bg-gray-100 text-black"
      }`}
    >
      <div className="container  py-8 px-4">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
            {console.log(userData)}
            {userData?.profilePicture ? (
              <img
                src={userData.user.image}
                alt="Profile"
                className="w-32  h-32 "
              />
            ) : (
              <FaUser className="text-6xl text-gray-500" />
            )}
          </div>
          <div className="flex-1">
            {/* Access user details from the nested 'user' object within profile */}
            <h1 className="text-3xl font-bold">
              {userData?.user?.firstName} {userData?.user?.lastName}
            </h1>
            <p className="text-lg text-gray-500">{userData?.user?.email}</p>
            {/* Phone is directly on the Profile model */}
            <p className="text-lg">
              {userData?.phone || "N/A"}
            </p>
            <div className="flex  items-center gap-4 mt-2">
              <button
              onClick={handleEditProfile}
              className=" flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              <FaEdit /> Edit Profile
            </button>
            <Logout />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b mb-8 overflow-x-auto whitespace-nowrap">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "profile" ? "border-b-2 border-blue-500" : ""
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <FaUser className="inline mr-2" /> Profile
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "properties" ? "border-b-2 border-blue-500" : ""
            }`}
            onClick={() => setActiveTab("properties")}
          >
            <FaHome className="inline mr-2" /> My Properties
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "purchases" ? "border-b-2 border-blue-500" : ""
            }`}
            onClick={() => setActiveTab("purchases")}
          >
            <FaHistory className="inline mr-2" /> Purchases
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "reviews" ? "border-b-2 border-blue-500" : ""
            }`}
            onClick={() => setActiveTab("reviews")}
          >
            <FaStar className="inline mr-2" /> My Reviews
          </button>
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {activeTab === "profile" && (
            <div className=" bg-white  p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-500">First Name</h3>
                  <p>{userData?.user?.firstName || "N/A"}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-500">Last Name</h3>
                  <p>{userData?.user?.lastName || "N/A"}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-500">Email</h3>
                  <p>{userData?.user?.email || "N/A"}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-500">Phone</h3>
                  <p>{userData?.phone || "Not provided"}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-500">Joined On</h3>
                  <p>{new Date(userData?.createdAt).toLocaleDateString()}</p>
                </div>
                {userData?.bio && (
                  <div>
                    <h3 className="font-semibold text-gray-500">Bio</h3>
                    <p>{userData.bio}</p>
                  </div>
                )}
                {/* Add more profile fields like address, social links here */}
                {userData.address && (
                    <>
                        <div>
                            <h3 className="font-semibold text-gray-500">Address</h3>
                            <p>{userData.address.street}</p>
                            <p>{userData.address.city}, {userData.address.state}</p>
                            <p>{userData.address.postalCode}, {userData.address.country}</p>
                        </div>
                    </>
                )}
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
                      className="bg-white  rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-lg transition"
                      onClick={() => navigate(`/property/${property._id}`)}
                    >
                      <div
                        className="h-48 bg-cover bg-center"
                        style={{ backgroundImage: `url(${property.images && property.images.length > 0 ? property.images : 'https://via.placeholder.com/400x250?text=No+Image'})` }}
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
                <div className="bg-white  p-6 rounded-lg shadow text-center">
                  <p>You haven't listed any properties yet.</p>
                  <button
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    onClick={() => navigate("/add-property")} // Adjust this path to your property creation page
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
                  {purchasedProperties.map((purchaseItem) => ( // Renamed to purchaseItem for clarity
                    <div
                      key={purchaseItem._id} // Use purchaseItem._id for key
                      className="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-lg transition"
                      onClick={() => navigate(`/property/${purchaseItem.property._id}`)}
                    >
                      <div
                        className="h-48 bg-cover bg-center"
                        style={{ backgroundImage: `url(${purchaseItem.property.images && purchaseItem.property.images.length > 0 ? purchaseItem.property.images[0] : 'https://via.placeholder.com/400x250?text=No+Image'})` }}
                      ></div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg">{purchaseItem.property.title}</h3>
                        <p className="text-blue-600 font-semibold">
                          ${purchaseItem.property.price}
                        </p>
                        <p className="text-gray-500">{purchaseItem.property.location}</p>
                        <div className="flex justify-between mt-2">
                          <span className="flex items-center">
                            <FaBed className="mr-1" /> {purchaseItem.property.bedrooms}
                          </span>
                          <span className="flex items-center">
                            <FaBath className="mr-1" /> {purchaseItem.property.washrooms}
                          </span>
                          <span>{purchaseItem.property.totalArea} sq.ft</span>
                        </div>
                        <div className="mt-2 text-sm text-green-600">
                          Purchased on{" "}
                          {new Date(purchaseItem.purchaseDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white  p-6 rounded-lg shadow text-center">
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
              {/* Reviews content would go here. You'll need to fetch reviews associated with the user. */}
              {/* Assuming you'll have an endpoint like /api/v1/review/userReviews */}
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p>Your reviews will appear here.</p>
                <p className="text-sm text-gray-500 mt-2">
                  (Review functionality needs a backend endpoint and frontend implementation.)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;