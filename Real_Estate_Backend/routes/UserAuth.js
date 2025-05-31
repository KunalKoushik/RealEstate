const express = require("express");
const {signup,login, logout, sendOTP} =require("../controllers/UserController");
const router = express.Router();


// test route 
router.get("/test", async (req,res)=>{
res.json({
    success: true,
    message: "test route is working"
})
});


// Route to send OTP

router.post("/send-otp", sendOTP);
// Route to validate OTP
router.post("/signup",signup)
router.post("/logout", logout)
router.post("/login",login)

module.exports = router;