const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  getFavoriteProperties,
  toggleFavoriteProperty,
  getPurchaseHistory
} = require("../controllers/profileController");

// Get user profile
router.get("/", auth, getProfile);

// Update profile
router.put("/", auth, updateProfile);

// Upload profile picture
router.post("/picture", auth, uploadProfilePicture);

// Get favorite properties
router.get("/favorites", auth, getFavoriteProperties);

// Toggle favorite property
router.post("/favorites/:propertyId", auth, toggleFavoriteProperty);

// Get purchase history
router.get("/purchases", auth, getPurchaseHistory);

module.exports = router;