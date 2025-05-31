import React, { useState, useEffect } from "react";
import { useDarkMode } from "../DarkModeContext";
import axios from "axios";
import { FaUser, FaCamera, FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profilePicture: null,
    previewImage: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        
        if (!token || !userId) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `http://localhost:4000/api/v1/user/profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserData({
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          email: response.data.user.email,
          phone: response.data.user.phone || "",
          profilePicture: response.data.user.profilePicture,
          previewImage: response.data.user.profilePicture,
        });
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch user data");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData(prev => ({
        ...prev,
        profilePicture: file,
        previewImage: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      
      if (!token || !userId) {
        navigate("/login");
        return;
      }

      const formData = new FormData();
      formData.append("firstName", userData.firstName);
      formData.append("lastName", userData.lastName);
      formData.append("phone", userData.phone);
      if (userData.profilePicture instanceof File) {
        formData.append("profilePicture", userData.profilePicture);
      }

      await axios.put(
        `http://localhost:4000/api/v1/user/updateProfile/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
      console.error("Error updating profile:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-screen ${darkMode ? "bg-black" : "bg-white"}`}>
        Loading profile...
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-black text-white" : "bg-gray-100 text-black"}`}>
      <div className="container mx-auto py-8 px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              {userData.previewImage ? (
                <img
                  src={userData.previewImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center">
                  <FaUser className="text-5xl text-gray-500" />
                </div>
              )}
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
                <FaCamera />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={userData.firstName}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={userData.lastName}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                disabled
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={userData.phone}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="px-6 py-2 border rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              {saving ? "Saving..." : (
                <>
                  <FaSave /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;