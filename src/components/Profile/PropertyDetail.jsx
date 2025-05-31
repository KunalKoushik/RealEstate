import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBed, FaBath, FaMapMarkerAlt, FaUserCircle, FaArrowLeft } from "react-icons/fa";
import { useDarkMode } from "../DarkModeContext";
// import StarRating from "";
// import BuyProperty from "./BuyProperty";

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/v1/property/getProperty/${id}`
        );
        setProperty(response.data.property);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch property");
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleSubmitReview = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      
      if (!token || !userId) {
        alert("Please login to submit a review");
        navigate("/login");
        return;
      }

      await axios.post(
        "http://localhost:4000/api/v1/review/create",
        {
          user: userId,
          PropertySchema: id,
          rating,
          review,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Review submitted successfully!");
      setReview("");
      setRating(0);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(error.response?.data?.message || "Failed to submit review");
    }
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-screen ${darkMode ? "bg-black" : "bg-white"}`}>
        Loading property details...
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

  if (!property) {
    return (
      <div className={`flex justify-center items-center h-screen ${darkMode ? "bg-black" : "bg-white"}`}>
        Property not found
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}>
      <div className="container mx-auto py-8 px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft /> Back to Properties
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Property Images */}
          <div className="space-y-4">
            <div className="h-96 bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={property.images}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {/* Additional images would go here */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>

          {/* Property Details */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
            <p className="text-2xl text-blue-600 font-bold mb-4">${property.price}</p>
            <p className="text-lg mb-6">{property.description}</p>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <FaBed className="text-blue-500" />
                <span>{property.bedrooms} Bedrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <FaBath className="text-blue-500" />
                <span>{property.washrooms} Bathrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-500" />
                <span>{property.location}</span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Details</h2>
              <p>{property.longDescription}</p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold">Property Type:</span> {property.type}
                </div>
                <div>
                  <span className="font-semibold">Category:</span> {property.category}
                </div>
                <div>
                  <span className="font-semibold">Total Area:</span> {property.totalArea} sq.ft
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Owner</h2>
              <div className="flex items-center gap-2">
                <FaUserCircle className="text-2xl text-blue-500" />
                <span>{property.user.firstName} {property.user.lastName}</span>
              </div>
            </div>

            {property.status !== "sold" && (
              <div className="mb-6">
                <BuyProperty propertyId={property._id} />
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>
          
          {/* Add Review Form */}
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold mb-4">Add Your Review</h3>
            <StarRating rating={rating} setRating={setRating} />
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your thoughts about this property..."
              className="w-full p-3 mt-4 border rounded-lg"
              rows="4"
            />
            <button
              onClick={handleSubmitReview}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Submit Review
            </button>
          </div>

          {/* Existing Reviews */}
          {property.RatingAndReview.length > 0 ? (
            <div className="space-y-6">
              {property.RatingAndReview.map((review) => (
                <div key={review._id} className="border-b pb-6">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <FaUserCircle className="text-2xl text-gray-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold">
                        {review.user.firstName} {review.user.lastName}
                      </h4>
                      <div className="flex items-center gap-1">
                        <StarRating rating={review.rating} setRating={() => {}} />
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-2">{review.review}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No reviews yet. Be the first to review!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;