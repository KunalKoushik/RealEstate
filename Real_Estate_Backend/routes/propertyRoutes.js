const { auth } = require("../middlewares/auth")
// createproperty

const express = require("express");
const {
    createProperty,
    getAllProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,buyProperty,
    filterProperties } = require("../controllers/PropertyController")
const router = express.Router();


// test route 
router.get("/test", async (req, res) => {
    res.json({
        success: true,
        message: "test route is working"
    })
});

router.post('/filter', filterProperties); // POST request to filter properties

// Route to send OTP

router.post("/createProperty", auth, createProperty);
router.get("/getAllProperties", getAllProperties);
router.get("/getPropertyById:id", getPropertyById);
router.put("/updateProperty", updateProperty);
router.delete("/deleteProperty", deleteProperty);

router.post('/buy/:propertyId', auth,buyProperty);

module.exports = router;