const mongoose = require("mongoose");

const RatingAndReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",  // Reference to User collection
    },
    PropertySchema: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PropertySchema",  // Reference to Post (or any other entity you're reviewing, e.g., Product)
        required: true,
    },
    rating: {
        type: Number, // Rating is a number
        required: true,
        min: 1, // Minimum rating value
        max: 5, // Maximum rating value
    },
    review: {
        type: String,
        required: true, // Review text is required
        minlength: 4,  // Minimum length for review text (optional, adjust as needed)
        maxlength: 500, // Maximum length for review text (optional, adjust as needed)
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set current date and time
    },
});

module.exports = mongoose.model("RatingAndReview", RatingAndReviewSchema);
