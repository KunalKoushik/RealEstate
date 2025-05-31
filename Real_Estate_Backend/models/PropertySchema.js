const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User who created the property
        // required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["rental", "sale"], // Only allow 'rental' or 'sale'
        required: true
    },
    price: {
        type: String,
        required: true
    },
    longDescription: {
        type: String,
        required: true
    },
    washrooms: {
        type: Number,
        required: true
    },
    bedrooms: {
        type: Number,
        required: true
    },
    totalArea: {
        type: Number, // In square feet/meters
        required: true
    },
    location: {
        type: String,
        required: true
    },
    category: { // New category field
        type: String, 
        enum: ['residential', 'commercial', 'industrial'], // You can define the categories that make sense for your properties
        default: 'residential'  // You can make it required if you want
    },
    images: {
        type: String // Image URLs stored as an array of strings
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    RatingAndReview:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReview", // Reference to the User who created the property
        // required: true
    }],
    status: { type: String, enum: ['available', 'pending', 'sold'], default: 'available' },
    // owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ownerHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model("Property", PropertySchema);
