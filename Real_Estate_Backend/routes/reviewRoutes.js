const express = require("express");
const router = express.Router();
const {createReview,getReviewsByProperty,getAllRatingsReviews,updateReview,deleteReview} = require("../controllers/reviewController");

// Create a review
router.post("/create", createReview);

// Get all reviews for a specific property
router.get("/property/:propertyId", getReviewsByProperty);

// Get a specific review by ID
// router.get("/:reviewId", getReviewById);

// Update a review
router.put("/:reviewId",updateReview);
router.get("/allRatingsReviews",getAllRatingsReviews);

// Delete a review
router.delete("/:reviewId",deleteReview);

module.exports = router;
