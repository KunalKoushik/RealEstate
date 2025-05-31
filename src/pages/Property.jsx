import React, { useState, useEffect } from "react";
import ListProperty from "../components/property/ListProperty";
import ShowProperty from "../components/property/ShowProperty";
import AOS from "aos"; // Import AOS
import "aos/dist/aos.css"; // Import AOS CSS

const Property = () => {
  // Use a more descriptive state variable name
  const [showAllProperties, setShowAllProperties] = useState(true);

  // Initialize AOS when the component mounts
  useEffect(() => {
    AOS.init({
      offset: 200,
      duration: 400,
      easing: "ease-in-sine",
      delay: 50,
    });
  }, []); // Empty dependency array ensures it runs only once

  const handleToggleView = () => {
    setShowAllProperties(!showAllProperties);
  };

  return (
    <div className="w-full mt-20 flex flex-col items-center justify-center p-4"> {/* Added p-4 for padding */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl mb-10 gap-4"> {/* Use flexbox for better alignment */}
        <h1 data-aos="zoom-in" className="text-4xl font-semibold text-center md:text-left">
          {showAllProperties ? "Latest Properties" : "List Your Property"} {/* Dynamic heading */}
        </h1>
        <button
          className="rounded-md p-2 shadow-lg shadow-blue-500 bg-blue-200 text-blue-800 hover:bg-blue-300 transition-colors duration-200 ease-in-out" // Improved styling
          onClick={handleToggleView}
        >
          {showAllProperties ? "Sell Your Property" : "View All Properties"} {/* Clearer button text */}
        </button>
      </div>

      {/* Conditionally render components based on state */}
      {showAllProperties ? <ShowProperty /> : <ListProperty />}
    </div>
  );
};

export default Property;