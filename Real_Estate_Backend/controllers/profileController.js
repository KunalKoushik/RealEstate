const User = require("../models/User");
const Property = require("../models/PropertySchema");
const Profile = require("../models/Profile");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const profile = await Profile.findOne({ user: userId })
      .populate({
        path: "favorites",
        select: "title price images location bedrooms washrooms totalArea",
        populate: {
          path: "user",
          select: "firstName lastName"
        }
      })
      .populate({
        path: "purchaseHistory.property",
        select: "title price images location",
        populate: {
          path: "user",
          select: "firstName lastName"
        }
      });

    if (!profile) {
      // Create a profile if it doesn't exist
      const newProfile = await Profile.createForUser(userId);
      return res.status(200).json({
        success: true,
        profile: newProfile
      });
    }

    res.status(200).json({
      success: true,
      profile
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message
    });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    // Prevent updating certain fields
    delete updates.user;
    delete updates.favorites;
    delete updates.purchaseHistory;
    delete updates.createdAt;
    delete updates.updatedAt;

    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message
    });
  }
};

// Upload profile picture
exports.uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    
    if (!req.files || !req.files.image) {
      return res.status(400).json({
        success: false,
        message: "Image file is required"
      });
    }

    const image = req.files.image;
    const uploadDetails = await uploadImageToCloudinary(
      image,
      "profile-pictures"
    );

    if (!uploadDetails || !uploadDetails.secure_url) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload image"
      });
    }

    // Update profile with new picture
    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      { profilePicture: uploadDetails.secure_url },
      { new: true }
    );

    // Also update user's image reference
    await User.findByIdAndUpdate(userId, {
      image: uploadDetails.secure_url
    });

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      profile,
      imageUrl: uploadDetails.secure_url
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload profile picture",
      error: error.message
    });
  }
};

// Get favorite properties
exports.getFavoriteProperties = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const profile = await Profile.findOne({ user: userId })
      .populate({
        path: "favorites",
        select: "title price images location bedrooms washrooms totalArea status",
        populate: {
          path: "user",
          select: "firstName lastName"
        }
      });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    res.status(200).json({
      success: true,
      favorites: profile.favorites
    });
  } catch (error) {
    console.error("Error fetching favorite properties:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch favorite properties",
      error: error.message
    });
  }
};

// Toggle favorite property
exports.toggleFavoriteProperty = async (req, res) => {
  try {
    const userId = req.user.id;
    const propertyId = req.params.propertyId;

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }

    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    const isFavorite = profile.favorites.includes(propertyId);
    
    if (isFavorite) {
      // Remove from favorites
      profile.favorites.pull(propertyId);
    } else {
      // Add to favorites
      profile.favorites.push(propertyId);
    }

    await profile.save();

    res.status(200).json({
      success: true,
      message: isFavorite ? "Property removed from favorites" : "Property added to favorites",
      isFavorite: !isFavorite
    });
  } catch (error) {
    console.error("Error toggling favorite property:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle favorite property",
      error: error.message
    });
  }
};

// Get purchase history
exports.getPurchaseHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const profile = await Profile.findOne({ user: userId })
      .populate({
        path: "purchaseHistory.property",
        select: "title price images location status",
        populate: {
          path: "user",
          select: "firstName lastName"
        }
      });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    res.status(200).json({
      success: true,
      purchaseHistory: profile.purchaseHistory
    });
  } catch (error) {
    console.error("Error fetching purchase history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch purchase history",
      error: error.message
    });
  }
};
