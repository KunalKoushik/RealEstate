const Property = require("../models/PropertySchema");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
// const fs = require('fs');
// const path = require('path');

exports.createProperty = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      title,
      description,
      type,
      price,
      longDescription,
      washrooms,
      bedrooms,
      totalArea,
      location,
      category, // Add category field here
    } = req.body;
    console.log(req.body);
    if (!req.files || !req.files.image) {
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });
    }

    const image = req.files.image;
    console.log(image);
    if (
      !title ||
      !description ||
      !type ||
      !price ||
      !longDescription ||
      !washrooms ||
      !bedrooms ||
      !totalArea ||
      !location
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Upload image to Cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      image,
      process.env.FOLDER_NAME
    );
    console.log("uplod: ", uploadDetails);

    if (!uploadDetails || !uploadDetails.secure_url) {
      return res
        .status(500)
        .json({ success: false, message: "Cloudinary upload failed" });
    }

    const newProperty = await Property.create({
      user: userId,
      title,
      description,
      type,
      price,
      longDescription,
      washrooms,
      bedrooms,
      totalArea,
      location,
      category, // Include category in the property creation
      images: uploadDetails.secure_url, // Save Cloudinary URL
    });

    await User.findByIdAndUpdate(
      { _id: userId },
      { $push: { properties: newProperty._id } },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Property created successfully",
      newProperty,
    });
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ✅ Get all properties
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate("user", "firstName lastName email ")
      .populate("ownerHistory", "firstName lastName email") // Populating user details (name, email)
      .populate({
        path: "RatingAndReview", // Populating the reviews field that holds references to RatingAndReview
        select: "rating review user", // Selecting fields to return (rating, review, and user)
        populate: {
          path: "user", // Populating the user inside each review
          select: "firstName lastName email", // Select the user details (name, email)
        },
      });
    res.status(200).json({ success: true, properties });
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ✅ Get a single property by ID
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    res.status(200).json({ success: true, property });
  } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Update a property
exports.updateProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      price,
      longDescription,
      washrooms,
      bedrooms,
      totalArea,
      location,
      images,
    } = req.body;

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    // Update property details
    property.title = title || property.title;
    property.description = description || property.description;
    property.type = type || property.type;
    property.price = price || property.price;
    property.longDescription = longDescription || property.longDescription;
    property.washrooms = washrooms || property.washrooms;
    property.bedrooms = bedrooms || property.bedrooms;
    property.totalArea = totalArea || property.totalArea;
    property.location = location || property.location;
    property.images = images || property.images;

    await property.save();

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      property,
    });
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Delete a property
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    await property.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// backend/controllers/propertyController.js

exports.buyProperty = async (req, res) => {
  const { propertyId } = req.params;
  const userId = req.user.id; // Get user ID from authenticated request

  try {
    const property = await Property.findById(propertyId).populate("user");

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.status !== "available") {
      return res.status(400).json({ message: "Property is not available" });
    }

    const buyer = await User.findById(userId);

    if (!buyer) {
      return res.status(404).json({ message: "buyer not found" });
    }

    if (property.user.toString() === userId) {
      return res
        .status(400)
        .json({ message: "you cannot buy your own property" });
    }

    // Update property details
    property.status = "pending"; // or 'sold' depending on your flow
    property.ownerHistory.push(property.user); // Add previous owner to history
    property.user = userId; // Set new owner
    property.status = "sold";
    await property.save();
    // After updating the property ownership
    const buyerProfile = await Profile.findOne({ user: userId });
    if (buyerProfile) {
      buyerProfile.purchaseHistory.push({
        property: property._id,
        amountPaid: property.price,
        transactionId: `TXN-${Date.now()}`,
      });
      await buyerProfile.save();
    }
    res.json({ message: "Property purchase initiated", property });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// // Controller function to filter properties based on input
// Controller function to filter properties based on input
exports.filterProperties = async (req, res) => {
  const { location, propertyType, category } = req.body;

  try {
    // Create an array for the OR condition
    const filterConditions = [];

    // If location is provided, add it to the filter
    if (location) {
      filterConditions.push({
        location: { $regex: location, $options: "i" }, // Case-insensitive search
      });
    }

    // If propertyType is provided, add it to the filter
    if (propertyType) {
      filterConditions.push({ type: propertyType });
    }

    // If category is provided, add it to the filter
    if (category) {
      filterConditions.push({ category: category });
    }

    // If no filter conditions are provided, return an error
    if (filterConditions.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one filter criteria is required." });
    }

    // Use the $or operator to check if any of the conditions match
    const properties = await Property.find({ $or: filterConditions })
      .populate("user", "firstName lastName email ")
      .populate("ownerHistory", "firstName lastName email") // Populating user details (name, email)
      .populate({
        path: "RatingAndReview", // Populating the reviews field that holds references to RatingAndReview
        select: "rating review user", // Selecting fields to return (rating, review, and user)
        populate: {
          path: "user", // Populating the user inside each review
          select: "firstName lastName email", // Select the user details (name, email)
        },
      });

    // If no properties are found
    if (properties.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No properties found matching the filter criteria.",
      });
    }

    // Return the fetched properties in the response
    res.status(200).json({
      success: true,
      data: properties,
    });
  } catch (error) {
    // If there's an error, respond with a failure message
    console.error("Error fetching properties:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch properties.",
    });
  }
};

// Controller function to filter properties based on input
// exports.filterProperties = async (req, res) => {
//   const { location, propertyType, category } = req.body;

//   try {
//     // Create a filter object dynamically based on inputs
//     const filter = {};

//     // If location is provided, perform a case-insensitive regex search
//     if (location) filter.location = { $regex: location, $options: "i" }; // Case insensitive search

//     // If propertyType is provided, match the exact type
//     if (propertyType) filter.type = propertyType;

//     // If category is provided, match the exact category
//     if (category) filter.category = category;

//     console.log("Filter applied:", filter);

//     // Fetch properties from the database based on the filter
//     const properties = await Property.find(filter);

//     // If no properties are found
//     if (properties.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No properties found matching the filter criteria.",
//       });
//     }

//     // Return the fetched properties in the response
//     res.status(200).json({
//       success: true,
//       data: properties,
//     });
//   } catch (error) {
//     // If there's an error, respond with a failure message
//     console.error("Error fetching properties:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch properties.",
//     });
//   }
// };
