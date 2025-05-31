import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../DarkModeContext";
import AOS from "aos";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import { FaBath, FaBed, FaUserCircle, FaMapMarkerAlt } from "react-icons/fa";
import "aos/dist/aos.css"; // Ensure AOS CSS is imported
import BuyProperty from "./BuyProperty"; // Ensure this component handles its own logic
import StarRating from "./StarRating"; // Ensure StarRating component is correctly implemented

const ShowProperty = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Store review text per property ID (e.g., { propertyId1: "text", propertyId2: "text" })
  const [newReviewText, setNewReviewText] = useState({});
  // Store rating per property ID (e.g., { propertyId1: 4, propertyId2: 3 })
  const [propertyRatings, setPropertyRatings] = useState({});
  // Stores a Set of property IDs whose owner history is currently expanded
  const [expandedHistory, setExpandedHistory] = useState(new Set());

  const navigate = useNavigate();
  const { darkMode } = useDarkMode();

  // Retrieve the user ID from localStorage
  const userId = localStorage.getItem("userId");

  // Initialize AOS on component mount
  useEffect(() => {
    AOS.init({
      offset: 200,
      duration: 400,
      easing: "ease-in-sine",
      delay: 50,
    });
  }, []); // Empty dependency array ensures it runs only once

  // Memoized function to fetch properties to prevent unnecessary re-creations
  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true); // Set loading true before fetching
      const response = await axios.get(
        "http://localhost:4000/api/v1/property/getAllProperties"
      );
      console.log(response)
    } catch (err) {
      console.error("Failed to fetch properties:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch properties"
      );
    } finally {
      setLoading(false); // Set loading false after fetch, regardless of success or error
    }
  }, []); // No dependencies, meaning this function itself is stable across renders

  // Fetch properties when the component mounts
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]); // `fetchProperties` is a dependency, but it's memoized, so it's stable

  // Toggles the visibility of owner history for a specific property
  const toggleOwnerHistory = (propertyId) => {
    setExpandedHistory((prevExpanded) => {
      const newExpanded = new Set(prevExpanded); // Create a new Set to ensure immutability
      if (newExpanded.has(propertyId)) {
        newExpanded.delete(propertyId); // Remove if already present
      } else {
        newExpanded.add(propertyId); // Add if not present
      }
      return newExpanded;
    });
  };

  // Handles rating changes for a specific property's review form
  const handleRatingChange = (propertyId, rating) => {
    setPropertyRatings((prevRatings) => ({
      ...prevRatings,
      [propertyId]: rating, // Update the rating for the specific property
    }));
  };

  // Formats price into more readable Crore, Lakh, or K formats
  const formatPrice = (price) => {
    if (price === null || price === undefined) return "₹0";
    const num = Number(price);
    if (isNaN(num)) return "Invalid Price"; // Handle non-numeric prices

    if (num >= 10000000) {
      // 1 Crore or more
      const croreValue = num / 10000000;
      return `₹${
        croreValue % 1 === 0
          ? croreValue.toFixed(0)
          : croreValue.toFixed(2).replace(/\.?0+$/, "")
      } Cr`;
    } else if (num >= 100000) {
      // 1 Lakh or more
      const lakhValue = num / 100000;
      return `₹${
        lakhValue % 1 === 0
          ? lakhValue.toFixed(0)
          : lakhValue.toFixed(2).replace(/\.?0+$/, "")
      } Lakh`;
    } else if (num >= 1000) {
      // 1 Thousand or more
      const thousandValue = num / 1000;
      return `₹${
        thousandValue % 1 === 0
          ? thousandValue.toFixed(0)
          : thousandValue.toFixed(2).replace(/\.?0+$/, "")
      }k`;
    } else {
      return `₹${num.toFixed(0)}`; // For numbers less than 1000, display as is
    }
  };

  // Handles submission of a review for a specific property
  const handleSubmitReview = async (propertyId) => {
    const rating = propertyRatings[propertyId]; // Get the rating for this specific property
    const reviewText = newReviewText[propertyId] || ""; // Get the review text for this property

    // Check if user is logged in
    if (!userId) {
      alert("Please log in to submit a review.");
      navigate("/login"); // Redirect to login page
      return;
    }

    // Validate inputs
    if (!rating || !reviewText.trim()) {
      alert("Please provide both a rating and a review.");
      return;
    }

    try {
      // Send the review and rating to the backend
      await axios.post("http://localhost:4000/api/v1/review/create", {
        user: userId, // User ID from localStorage
        PropertySchema: propertyId, // Make sure your backend expects this field name
        rating,
        review: reviewText,
      });

      alert("Review submitted successfully!");
      // Clear the review input and reset rating for this property after submission
      setNewReviewText((prev) => ({ ...prev, [propertyId]: "" }));
      setPropertyRatings((prev) => ({ ...prev, [propertyId]: 0 })); // Reset rating to 0

      // Re-fetch properties to display the newly added review
      fetchProperties();
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(
        error.response?.data?.message ||
          "Failed to submit review. Please try again."
      );
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div
        className={`flex justify-center items-center w-full h-screen ${
          darkMode ? "text-white bg-black" : "text-black bg-white"
        }`}
      >
        <p className="text-xl font-semibold">Loading properties...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div
        className={`flex justify-center items-center h-screen text-red-500 ${
          darkMode ? "bg-black" : "bg-white"
        }`}
      >
        <p className="text-xl font-semibold">Error: {error}</p>
      </div>
    );
  }

  // Main component render
  return (
    <div
      className={`${
        darkMode
          ? "dark bg-black text-white"
          : "light bg-transparent text-black"
      } w-[95%] mx-auto p-4`} // Added mx-auto and p-4 for better overall spacing
    >
      <div
        id="grid-box"
        className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 justify-center items-stretch gap-8" // `items-stretch` ensures all cards have uniform height
      >
        {properties.map((property) => (
          <div
            data-aos="zoom-in"
            data-aos-delay="200"
            key={property._id}
            className="rounded-xl border shadow-lg overflow-hidden flex flex-col transition-transform duration-300 hover:scale-[1.02]" // Added flex-col and hover effect
          >
            {/* Property Image Section */}
            <div
              id="image-box"
              className="bg-cover bg-center h-[350px] relative" // Added relative for internal positioning
              // Dynamic background image with a robust fallback
              style={{
                backgroundImage: `url(${
                  property.images && property.images.length > 0
                    ? property.images
                    : "https://via.placeholder.com/400x350?text=No+Image"
                })`,
              }}
            >
              {/* Add any badges or overlays here if needed (e.g., "FOR SALE") */}
            </div>

            {/* Property Details & Actions Section */}
            <div className="p-6 flex flex-col justify-between flex-grow">
              {" "}
              {/* `flex-grow` ensures this section fills remaining height */}
              <div>
                <h1 className="text-2xl font-semibold mb-2">
                  {property.title}
                </h1>
                <h2 className="text-3xl text-blue-600 font-bold mb-3">
                  {formatPrice(property.price)}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {property.description}
                </p>{" "}
                {/* `line-clamp-3` for concise descriptions */}
                {/* Icons for Property Features */}
                <div className="flex justify-between items-center mb-4">
                  <div id="icons" className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <FaBath className="size-5 text-blue-400" />
                      <span>{property.washrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaBed className="size-5 text-blue-400" />
                      <span>{property.bedrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaMapMarkerAlt className="size-5 text-blue-400" />
                      <span>{property.location}</span>
                    </div>
                  </div>
                </div>
                {/* Owner Information & Buy Button */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="flex items-center gap-2 text-lg font-medium">
                    <FaUserCircle className="size-6 text-blue-400" />
                    {property.user?.firstName} {property.user?.lastName}
                  </span>
                  <div>
                    {property.status !== "sold" ? (
                      <BuyProperty propertyId={property._id} />
                    ) : (
                      <h2 className="text-red-500 font-semibold text-lg">
                        Sold
                      </h2>
                    )}
                  </div>
                </div>
                {/* Owner History Toggle Button */}
                <button
                  onClick={() => toggleOwnerHistory(property._id)}
                  className="mt-4 text-blue-500 hover:text-blue-700 flex items-center gap-2 text-sm transition-colors duration-200"
                >
                  {expandedHistory.has(property._id) ? (
                    <IoIosArrowDown className="text-xl" />
                  ) : (
                    <IoIosArrowForward className="text-xl" />
                  )}
                  {expandedHistory.has(property._id)
                    ? "Hide Owner History"
                    : "Show Owner History"}
                </button>
                {/* Display Owner History (conditionally rendered) */}
                {expandedHistory.has(property._id) && (
                  <div
                    id="owner-history"
                    className="mt-4 bg-gray-50 dark:bg-gray-700 p-3 rounded-md shadow-inner"
                  >
                    <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-200">
                      Owner History:
                    </h4>
                    <ul>
                      {property.ownerHistory &&
                      property.ownerHistory.length > 0 ? (
                        property.ownerHistory.map((owner, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 text-sm py-1"
                          >
                            <FaUserCircle className="size-4 text-gray-500" />
                            <span>
                              {owner.firstName} {owner.lastName} - {owner.email}
                            </span>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-500">
                          No owner history available.
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
              {/* Review Section */}
              <div
                id="reviews-container"
                className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
              >
                <h2 className="text-xl font-semibold mb-3">Reviews</h2>
                {/* Display Existing Reviews */}
                {property.RatingAndReview &&
                property.RatingAndReview.length > 0 ? (
                  property.RatingAndReview.map((review, index) => (
                    <div
                      key={index}
                      className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                    >
                      <p className="font-medium text-lg">
                        <strong>
                          {review.user?.firstName} {review.user?.lastName}
                        </strong>
                      </p>
                      <StarRating rating={review.rating} readOnly={true} />{" "}
                      {/* Display review rating */}
                      <p className=" dark:text-gray-300 mt-1">
                        {review.review}
                      </p>
                      <span className="text-xs dark:text-gray-400">
                        Reviewed on:{" "}
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">
                    No reviews yet. Be the first to review!
                  </p>
                )}

                {/* Add a Review Form */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold mb-3">
                    Add Your Review
                  </h3>
                  <div className="flex flex-col gap-3">
                    <StarRating
                      rating={propertyRatings[property._id] || 0}
                      setRating={(rating) =>
                        handleRatingChange(property._id, rating)
                      }
                    />
                    <textarea
                      value={newReviewText[property._id] || ""}
                      onChange={(e) =>
                        setNewReviewText({
                          ...newReviewText,
                          [property._id]: e.target.value,
                        })
                      }
                      placeholder="Share your thoughts about this property..."
                      className="border border-gray-300 dark:border-gray-600 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white resize-y" // Added resize-y
                      rows="4"
                    />
                    <button
                      onClick={() => handleSubmitReview(property._id)}
                      className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 self-start"
                    >
                      Submit Review
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowProperty;
