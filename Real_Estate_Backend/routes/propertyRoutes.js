const { auth } = require("../middlewares/auth")
// createproperty

const express = require("express");
const {countTotalProperties,
    createProperty,
    getAllProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,buyProperty,
    getUserProperties,
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
router.get("/getAllPropertiesCount", countTotalProperties);
router.get("/getAllProperties", getAllProperties);
router.get("/getPropertyById:id", getPropertyById);
router.put("/updateProperty", updateProperty);
router.delete("/deleteProperty", deleteProperty);

router.get('/user/properties',auth, getUserProperties);
router.post('/buy/:propertyId', auth,buyProperty);

module.exports = router;