import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../DarkModeContext";
import AOS from "aos";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import { FaBath, FaBed, FaUserCircle, FaMapMarkerAlt } from "react-icons/fa";
import "aos/dist/aos.css";
import BuyProperty from "./BuyProperty";
import StarRating from "./StarRating"; // Import the StarRating component

const ShowProperty = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState("");
  const [propertyRatings, setPropertyRatings] = useState({}); // Store individual ratings for each property
  const [submittedReviews, setSubmittedReviews] = useState({}); // To keep track of reviews for each property
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const [showHistory, setShowHistory] = useState(false);

  // Retrieve the user ID from localStorage
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    AOS.init({
      offset: 200,
      duration: 400,
      easing: "ease-in-sine",
      delay: 50,
    });

    const fetchProperties = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/property/getAllProperties"
        );
        setProperties(response.data.properties);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch properties");
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Handle Rating Change for a specific property
  const handleRatingChange = (propertyId, rating) => {
    setPropertyRatings((prevRatings) => ({
      ...prevRatings,
      [propertyId]: rating, // Update the rating for the specific property
    }));
  };

  const formatPrice = (price) => {
    if (!price) return '₹0';
    
    // Convert to number in case it's a string
    const num = Number(price);
    
    if (num >= 10000000) { // 1 crore or more
      const croreValue = num / 10000000;
      // Trim trailing zeros and unnecessary decimal points
      return `₹${croreValue % 1 === 0 ? croreValue.toFixed(0) : croreValue.toFixed(2).replace(/\.?0+$/, '')} Cr`;
    } 
    else if (num >= 1000) { // 1 thousand or more
      const thousandValue = num / 1000;
      // Trim trailing zeros and unnecessary decimal points
      return `₹${thousandValue % 1 === 0 ? thousandValue.toFixed(0) : thousandValue.toFixed(2).replace(/\.?0+$/, '')}k`;
    }
    else {
      // For numbers less than 1000, just display as is without decimal places
      return `₹${num.toFixed(0)}`;
    }
  };

  // Handle review submission for a specific property
  const handleSubmitReview = async (propertyId) => {
    const rating = propertyRatings[propertyId]; // Get the rating for this specific property
    const reviewText = newReview[propertyId] || ""; // Get the review text for this property

    if (!rating || !reviewText) {
      alert("Please fill in both the rating and the review.");
      return;
    }

    if (!userId) {
      alert("You need to be logged in to submit a review.");
      return;
    }

    try {
      // Send the review and rating to the backend with the user ID from localStorage
      await axios.post("http://localhost:4000/api/v1/review/create", {
        user: userId, // Passing the user ID from localStorage
        PropertySchema: propertyId,
        rating,
        review: reviewText,
      });

      alert("Review submitted successfully!");
      setNewReview({ ...newReview, [propertyId]: "" }); // Clear the review field for this property

      // Refresh the properties list to include the new review
      const response = await axios.get("http://localhost:4000/api/v1/property/getAllProperties");
      setProperties(response.data.properties);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(error.response.data.message);
    }
  };
console.log(properties)
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading properties...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div
      className={`${
        darkMode ? "dark bg-black text-white" : "light bg-transparent text-black"
      } w-[95%]`}
    >
      <div
        id="grid-box"
        className="grid lg:grid-cols-3 grid-cols-1 justify-center items-center gap-8"
      >
        {properties.map((property) => (
          <div
            data-aos="zoom-in"
            data-aos-delay="200"
            key={property._id}
            className="rounded-xl border w-full"
          >
            <div>
              <div
                id="image-box"
                className="bg-cover bg-center h-[350px] rounded-xl p-4 flex flex-col justify-between items-end"
                style={{ backgroundImage: `url(${property.images})` }}
              >
                {/* Image, buttons, and status */}
              </div>

              <div className="px-6 py-3 flex flex-col justify-center items-start gap-2 w-full">
                <h1 className="text-xl font-semibold">{property.title}</h1>
                <h1 className="text-2xl text-blue-600 font-bold">{formatPrice(property.price)}</h1>
                <p>{property.description}</p>

                {/* Icons and Property Details */}
                <div className="flex justify-between w-full">
                  <div id="icons" className="flex justify-center items-start gap-4">
                    <div className="flex justify-center items-center gap-2">
                      <FaBath className="size-5 text-blue-400" />
                      <h1>{property.washrooms}</h1>
                    </div>
                    <div className="flex justify-center items-center gap-2">
                      <FaBed className="size-5 text-blue-400" />
                      <h1>{property.bedrooms}</h1>
                    </div>
                    <div className="flex justify-center items-center gap-2">
                      <FaMapMarkerAlt className="size-5 text-blue-400" />
                      <h1>{property.location}</h1>
                    </div>
                  </div>

                 
                </div>
                <div className="flex w-full justify-between pr-10 ">
                              <span className="flex items-center gap-2 ">
                              <FaUserCircle className="size-5 text-blue-400" />
                                {property.user.firstName} {property.user.lastName} 

                              </span>
                               {/* Buy Property Button */}
                  <div className=" p-2 shadow-lg shadow-blue-500 bg-blue-600">
                    {property.status !== "sold" ? (
                      <BuyProperty propertyId={property._id} />
                    ) : (
                      <h2>Property already sold</h2>
                    )}
                  </div>
                            </div>
                {/* Show Owner History Button */}
                <button
                  onClick={() => setShowHistory((prev) => !prev)}
                  className="mt-4 text-blue-500 hover:text-blue-700 flex items-center gap-2"
                >
                  {showHistory ? (
                    <IoIosArrowDown className="text-xl" />
                  ) : (
                    <IoIosArrowForward className="text-xl" />
                  )}
                  {showHistory ? "Hide Owner History" : "Show Owner History"}
                </button>
                
                {/* Displaying Owner History */}
                {showHistory && (
                  <div id="owner-history" className="mt-4">
                    <ul>
                      {property.ownerHistory &&
                      property.ownerHistory.length > 0 ? (
                        property.ownerHistory.map((owner, index) => (
                          <li key={index} className="mt-2">
                            <div className="flex items-center gap-2">
                              <FaUserCircle className="size-5 text-blue-400" />
                              <span>
                                {owner.firstName} {owner.lastName} - {owner.email}
                              </span>
                            </div>
                          </li>
                        ))
                      ) : (
                        <li>No owner history available</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Review Form and Existing Reviews */}
              <div id="reviews-container" className="mt-6">
                <h2 className="text-xl font-semibold">Add a Review</h2>
                <div className="flex flex-col gap-2">
                  <StarRating
                    rating={propertyRatings[property._id] || 0}
                    setRating={(rating) => handleRatingChange(property._id, rating)}
                  />
                  <textarea
                    value={newReview[property._id] || ""}
                    onChange={(e) =>
                      setNewReview({ ...newReview, [property._id]: e.target.value })
                    }
                    placeholder="Write your review"
                    className="border p-2 rounded"
                  />
                  <button
                    onClick={() => handleSubmitReview(property._id)}
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Submit Review
                  </button>
                </div>

                {/* Display Existing Reviews */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold">Reviews</h3>
                  <div>
                    {property.RatingAndReview.length > 0 ? (
                      property.RatingAndReview.map((review, index) => (
                        <div key={index} className="mt-4 border-b">
                          <p>
                            <strong>{review.user.firstName} {review.user.lastName}</strong> - {review.rating} / 5
                          </p>
                          <p>{review.review}</p>
                        </div>
                      ))
                    ) : (
                      <p>No reviews yet</p>
                    )}
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
