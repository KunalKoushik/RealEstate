const express = require("express");
const router = express.Router();

// Controllers
const { getAllUsers,
    getUserById,
    toggleUserActivation,
    deleteUser,
    getAllProperties,
    getPropertyById,
    verifyProperty,
    updateProperty,
    deleteProperty,
    getAllPurchases,
    getPurchaseById,
    getAdminStats } = require("../controllers/AdminControllers");



// USER MANAGEMENT
router.get("/users", getAllUsers);
router.get("/user/:id", getUserById);
router.put("/user/:id/activate", toggleUserActivation);
router.delete("/user/:id", deleteUser);

// PROPERTY MANAGEMENT
router.get("/properties", getAllProperties);
router.get("/property/:id", getPropertyById);
router.put("/property/:id/verify", verifyProperty);
router.put("/property/:id", updateProperty);
router.delete("/property/:id", deleteProperty);

// PURCHASE MONITORING
router.get("/purchases", getAllPurchases);
router.get("/purchase/:id", getPurchaseById);

// DASHBOARD STATS
router.get("/stats", getAdminStats);

module.exports = router;
