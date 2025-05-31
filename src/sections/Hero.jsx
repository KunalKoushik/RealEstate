import React, { useState, useEffect } from "react";
import { useDarkMode } from "../components/DarkModeContext";
import heroimg from "../assets/images/hero1.webp";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [properties, setProperties] = useState([]);
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState({});

  // Initialize AOS (Animation library)
  useEffect(() => {
    AOS.init({
      offset: 200,
      duration: 400,
      easing: "ease-in-sine",
      delay: 50,
    });
  }, []);

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple form validation
    const validationErrors = {};
    if (!location) validationErrors.location = "Location is required";
    if (!propertyType) validationErrors.propertyType = "Type is required";
    if (!category) validationErrors.category = "Category is required";
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Prepare the form data to send to the backend
    const formData = {
      location,
      propertyType,
      category,
    };

    try {
      // Sending the form data to the backend
      const response = await axios.post(
        "http://localhost:4000/api/v1/property/filter", // Update the URL accordingly
        formData
      );

      // Handle the response (e.g., update state or display results)
      if (response.data.success) {
        // Assuming response.data.data contains the list of properties
        const properties = response.data.data;
        console.log(properties); // Display properties in the console

        // Update state to display the properties (you should store them in a state)
        setProperties(properties); // Assuming setProperties is a state setter function
        navigate("/filter", { state: { properties } }); // Send properties data to the /filter route
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  const { darkMode } = useDarkMode();

  return (
    <div
      className={`${darkMode ? "bg-black text-white" : "bg-white text-black"}`}
    >
      <section
        id="hero"
        className="mt-18 h-[60vh] m-auto bg-cover justify-center bg-center rounded-xl overflow-hidden flex flex-col border- items-center lg:px-[10%] px-5 gap-5 z-20"
        style={{ backgroundImage: `url(${heroimg})` }}
      >
        <h1
          data-aos="zoom-in"
          className="text-5xl text-white font-semibold "
        >
          Find your next Home in India
        </h1>
        <button type="button"data-aos="zoom-in"
          className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-900 text-xl p-4 text-white font-semibold rounded-xl cursor-pointer transform hover:scale-110 transition-transform duration-300" 
          onClick={()=> {navigate('/properties')}}
        >
          Explore Propertirs 
        </button>
      </section>

      {/* Form Section */}
      <div
        className={`${
          darkMode ? "bg-gray-900 text-white" : "bg-transparent text-black"
        } z-10`}
      >
        <div
          data-aos="zoom-in"
          id="form"
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } lg:w-[70%] w-[90%] m-auto grid lg:grid-cols-4 grid-cols-1 justify-center items-center gap-6 p-6 rounded-xl -mt-15`}
        >
          <div className="w-full">
            <h1 className="font-semibold">LOCATION</h1>
            <input
              type="text"
              placeholder="Enter an address, state, city, or pincode"
              className="bg-white text-black p-2 w-full mt-2 border-b border-gray-300 focus:outline-none"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location}</p>
            )}
          </div>
          <div className="w-full">
            <h1 className="font-semibold">TYPE</h1>
            <select
              className="bg-white p-2 border-b w-full mt-2 border-gray-300 text-gray-500 text-md focus:outline-none"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            >
              <option value="" disabled>
                Select Property Type
              </option>
              <option value="rental">rental</option>
              <option value="sale">sale</option>
            </select>
            {errors.propertyType && (
              <p className="text-red-500 text-sm">{errors.propertyType}</p>
            )}
          </div>
          <div className="w-full">
            <h1 className="font-semibold">CATEGORY</h1>
            <select
              className="bg-white p-2 border-b w-full mt-2 border-gray-300 text-gray-500 text-md focus:outline-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" disabled>
                Select Property Category
              </option>
              <option value="residential">residential</option>
              <option value="commercial">commercial</option>
              <option value="industrial">industrial</option>
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category}</p>
            )}
          </div>
          <div className="w-full">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 dark:bg-blue-700 hover:bg-black text-lg p-4 w-full text-white font-semibold rounded-xl cursor-pointer transform hover:scale-105 transition-transform duration-300"
            >
              SUBMIT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
