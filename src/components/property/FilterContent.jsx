import { useLocation } from "react-router-dom";
import { FaBath, FaBed, FaMapMarkerAlt, FaUserCircle } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { useState } from "react";
import { useDarkMode } from "../DarkModeContext";
import StarRating from "./StarRating";
import React from 'react'

export const FilterContent = () => {
    const { darkMode } = useDarkMode();
  const location = useLocation();
  const properties = location.state?.properties || []; // Default to an empty array if no properties
  const [showHistory, setShowHistory] = useState(false);
  const [newReview, setNewReview] = useState({});
  const [propertyRatings, setPropertyRatings] = useState({});
console.log(properties)
  const handleRatingChange = (propertyId, rating) => {
    setPropertyRatings({ ...propertyRatings, [propertyId]: rating });
  };

  const handleSubmitReview = (propertyId) => {
    // Handle review submission logic
    console.log("Review submitted for property", propertyId);
  };

  return (
    <div
      className={`  px-2 ${
        darkMode ? "dark bg-black text-white" : "light bg-transparent text-black"
      }`}
    >
      <div
        id="grid-box"
        className="mt-20 grid lg:grid-cols-3 grid-cols-1 justify-center gap-4 "
      >
        {properties.map((property) => (
          <div
            data-aos="zoom-in"
            data-aos-delay="200"
            key={property._id}
            className="rounded-xl border w-full"
          >
            <div className="px-4 py-2 ">
              <div
                id="image-box"
                className="bg-cover bg-center h-[350px] rounded-xl p-4 flex flex-col justify-between items-end"
                style={{ backgroundImage: `url(${property.images})` }}
              >
                {/* Image, buttons, and status */}
              </div>

              <div className=" py-3 flex flex-col justify-center items-start gap-2 w-full">
                <h1 className="text-xl font-semibold">{property.title}</h1>
                <h1 className="text-2xl text-blue-600 font-bold">${property.price}</h1>
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
                <div className="flex items-center gap-2 justify-between w-full pr-10">
                  <span className="flex  gap-2 items-center">
                  <FaUserCircle className="size-5 text-blue-400" />
                    {property.user.firstName} {property.user.lastName}
                  </span>
                   {/* Buy Property Button */}
                   <div className="rounded-md  shadow-lg shadow-blue-500  ">
                    {property.status !== "sold" ? (
                      <button className="bg-blue-600 text-white px-4 py-2 rounded">
                        Buy Property
                      </button>
                    ) : (
                      <h2>Property already sold</h2>
                    )}
                  </div>
                </div>

                {/* Show Owner History Button */}
                <button
                  onClick={() => setShowHistory((prev) => !prev)}
                  className="mt-1 text-blue-500 hover:text-blue-700 flex items-center gap-2"
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
                      {property.ownerHistory && property.ownerHistory.length > 0 ? (
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
              <div id="reviews-container" className="mt-1">
                <h2 className="text-xl font-semibold">Add a Review</h2>
                <div className="flex flex-col gap-2">
                  {/* Star Rating Component */}
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
}


export default FilterContent;
