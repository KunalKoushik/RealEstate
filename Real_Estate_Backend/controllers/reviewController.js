const RatingAndReview = require("../models/RatingAndReview")
const Property = require("../models/PropertySchema")

exports.createReview = async (req, res) => {
  try {
    const { user, PropertySchema, rating, review } = req.body;

    // Check if the rating is valid
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5." });
    }

    // Check if the user has already reviewed this property
    const existingReview = await RatingAndReview.findOne({
      user: user,
      PropertySchema: PropertySchema,
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this property." });
    }

    // Create the review and rating document
    const newReview = new RatingAndReview({
      user,
      PropertySchema,
      rating,
      review,
    });

    console.log(newReview);

    // Save the review to the database
    await newReview.save();

    // Add the new review to the Property's reviews array
    const property = await Property.findById(PropertySchema);
    if (!property) {
      return res.status(404).json({ message: "Property not found." });
    }

    // Add the review ID to the property's RatingAndReview array
    property.RatingAndReview.push(newReview._id);
    await property.save();

    return res
      .status(201)
      .json({ message: "Review created successfully!", review: newReview });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating review." });
  }
};

// module.exports = { createReview };

// Get all reviews for a specific property
exports.getReviewsByProperty = async (req, res) => {
  try {
    const propertyId = req.params.propertyId;

    const reviews = await RatingAndReview.find({ PropertySchema: propertyId })
      .populate("user", "name") // Populate user name for reference
      .populate("PropertySchema", "name") // Populate property name for reference
      .sort({ createdAt: -1 }); // Sort by newest first

    if (!reviews.length) {
      return res
        .status(404)
        .json({ message: "No reviews found for this property." });
    }

    return res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching reviews." });
  }
};

// Update an existing review
exports.updateReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const { rating, review } = req.body;

    // Check if the review exists
    const existingReview = await RatingAndReview.findById(reviewId);
    if (!existingReview) {
      return res.status(404).json({ message: "Review not found." });
    }

    // Check if rating is valid
    if (rating && (rating < 1 || rating > 5)) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5." });
    }

    // Update the review
    if (rating) existingReview.rating = rating;
    if (review) existingReview.review = review;

    await existingReview.save();
    return res.status(200).json({
      message: "Review updated successfully!",
      review: existingReview,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating review." });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;

    // Check if the review exists
    const review = await RatingAndReview.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    // Delete the review
    await review.remove();
    return res.status(200).json({ message: "Review deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting review." });
  }
};

// // Get a specific review by its ID
// exports.getReviewById = async (req, res) => {
//   try {
//     const reviewId = req.params.reviewId;

//     const review = await RatingAndReview.findById(reviewId)
//       .populate("user", "name")
//       .populate("PropertySchema", "name");

//     if (!review) {
//       return res.status(404).json({ message: "Review not found." });
//     }

//     return res.status(200).json(review);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Error fetching review." });
//   }
// };
exports.getAllRatingsReviews = async (req, res) => {
  try {
    // Fetch all ratings and reviews from the RatingAndReview collection
    const ratingsReviews = await RatingAndReview.find().populate("user", "firstName lastName email image");

    // If no reviews are found
    if (!ratingsReviews || ratingsReviews.length === 0) {
      return res.status(404).json({ message: "No reviews found" });
    }

    // Return the populated reviews and ratings
    res.status(200).json({
      success: true,
      data: ratingsReviews,
    });
  } catch (error) {
    console.error("Error fetching ratings and reviews:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

