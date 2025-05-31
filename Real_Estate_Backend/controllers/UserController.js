const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const User = require("../models/User");
require("dotenv").config();

// Signup route handler
exports.signup = async (req, res) => {
  try {
    // Get data from request body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      aadhaarNumber,
      gender,
      dateOfBirth,
      about,
      otp,
    } = req.body;

    // Check if all required fields are provided
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !aadhaarNumber ||
      !gender ||
      !dateOfBirth ||
      !about ||
      !contactNumber ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { aadhaarNumber }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({
          success: false,
          message: "Email already exists.",
        });
      }
     
      if (existingUser.aadhaarNumber === aadhaarNumber) {
        return res.status(400).json({
          success: false,
          message: "Aadhaar number already exists.",
        });
      }
    }

    // Validate Aadhaar Number (12 digits)
    if (!/^\d{12}$/.test(aadhaarNumber)) {
      return res.status(400).json({
        success: false,
        message: "Aadhaar number must be 12 digits long.",
      });
    }

    // Validate Contact Number (10 digits)
    if (!/^\d{10}$/.test(contactNumber)) {
      return res.status(400).json({
        success: false,
        message: "Contact number must be 10 digits long.",
      });
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and Confirm Password do not match. Please try again.",
      });
    }

    // Find the most recent OTP for the email
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    if (response.length === 0 || otp !== response[0].otp) {
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
        otp : otp + response[0].otp,
        
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      aadhaarNumber,
      password: hashedPassword,
      accountType,
      gender,
      dateOfBirth,
      about,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    return res.status(200).json({
      success: true,
      user,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);

    // Handle duplicate key error (e.g., duplicate username, email, or Aadhaar number)
    if (error.code === 11000) {
      const key = Object.keys(error.keyPattern)[0]; // Get the duplicate key (e.g., "username" or "email")
      return res.status(400).json({
        success: false,
        message: `${key} already exists.`,
      });
    }

    return res.status(500).json({
      success: false,
      message: "User cannot be registered, please try again later",
    });
  }
};

// login controller
exports.login = async (req, res) => {
  try {
    // Get email and password from request body
    const { email, password } = req.body;

    // Check if email or password is missing
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    // If user not found
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered. Please sign up to continue.",
      });
    }

    // Compare password
    if (await bcrypt.compare(password, user.password)) {
      // Generate JWT token
      const token = jwt.sign(
        { email: user.email, id: user._id, accountType: user.accountType },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      // Save token to user document
      user.token = token;
      user.password = undefined;

      // Set cookie and return response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("cookie", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "User login successful",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Login failed. Please try again later.",
    });
  }
};

// send otp controller
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const checkUserPresent = await User.findOne({ email });

    if (checkUserPresent) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Generate OTP
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    console.log("OTP Generated:", otp);

    // Ensure OTP is unique
    let result = await OTP.findOne({ otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });
      result = await OTP.findOne({ otp });
    }

    // Save OTP in DB
    const otpPayload = { email, otp };

    try {
      const otpBody = await OTP.create(otpPayload);
      console.log("OTP saved to DB:", otpBody);
    } catch (err) {
      console.error("Error saving OTP:", err);
      return res.status(500).json({
        success: false,
        message: "Error saving OTP to database",
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp, // Remove this in production for security
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      success: false,
      message: "Message sending problem - Server Error",
    });
  }
};


// Controller for Changing Password
exports.changePassword = async (req, res) => {
  try {
    // Get user data from req.user
    const userDetails = await User.findById(req.user.id);

    // Get old password, new password, and confirm new password from req.body
    const { oldPassword, newPassword } = req.body;

    // Validate old password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );
    if (!isPasswordMatch) {
      // If old password does not match, return a 401 (Unauthorized) error
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" });
    }

    // Update password
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    );

    // Send notification email
    try {
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        "Password for your account has been updated",
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      );
      console.log("Email sent successfully:", emailResponse.response);
    } catch (error) {
      // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while sending email:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      });
    }

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred while updating password:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    });
  }
};
//  logout controller
exports.logout = async (req, res) => {
  try {
    // Clear the cookie that stores the authentication token
    res.clearCookie("token", {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: "None",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error(" Error in logout:", error);
    return res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
    });
  }
};
