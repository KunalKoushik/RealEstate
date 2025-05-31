const User = require("../models/User");



exports.adminLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out successfully" });
  });
};


// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).populate("profile");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Get specific user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("profile");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user" });
  }
};

// Activate/Deactivate user
exports.toggleUserActivation = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({ message: `User ${user.isActive ? "activated" : "deactivated"}` });
  } catch (err) {
    res.status(500).json({ message: "Failed to toggle user activation" });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};



// 🏠 Property Management


const Property = require("../models/PropertySchema");

// Get all properties
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({}).populate("user");
    res.status(200).json(properties);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch properties" });
  }
};

// Get single property by ID
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate("user");
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.status(200).json(property);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch property" });
  }
};

// Mark property as verified
exports.verifyProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    property.isVerified = true;
    await property.save();

    res.status(200).json({ message: "Property verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to verify property" });
  }
};

// Update property details
exports.updateProperty = async (req, res) => {
  try {
    const updated = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Property not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update property" });
  }
};

// Delete property
exports.deleteProperty = async (req, res) => {
  try {
    const deleted = await Property.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Property not found" });
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete property" });
  }
};


// Update purchase status

const Profile = require("../models/Profile");


// Get all purchases (aggregated from all profiles)
exports.getAllPurchases = async (req, res) => {
  try {
    const profiles = await Profile.find({}).populate("user purchaseHistory.property");

    const allPurchases = profiles.flatMap(profile =>
      profile.purchaseHistory.map(purchase => ({
        user: profile.user,
        property: purchase.property,
        purchaseDate: purchase.purchaseDate,
        amountPaid: purchase.amountPaid,
        transactionId: purchase.transactionId
      }))
    );

    res.status(200).json(allPurchases);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch purchases" });
  }
};

// Get single purchase by ID (search through purchaseHistory._id)
exports.getPurchaseById = async (req, res) => {
  try {
    const profiles = await Profile.find({}).populate("user purchaseHistory.property");

    for (let profile of profiles) {
      const purchase = profile.purchaseHistory.id(req.params.id);
      if (purchase) {
        return res.status(200).json({
          user: profile.user,
          property: purchase.property,
          purchaseDate: purchase.purchaseDate,
          amountPaid: purchase.amountPaid,
          transactionId: purchase.transactionId
        });
      }
    }

    res.status(404).json({ message: "Purchase not found" });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch purchase" });
  }
};


// Admin stats


exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProperties = await Property.countDocuments();
    const totalVerifiedProperties = await Property.countDocuments({ isVerified: true });
    const totalPurchases = await Purchase.countDocuments();

    res.status(200).json({
      totalUsers,
      totalProperties,
      totalVerifiedProperties,
      totalPurchases
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

