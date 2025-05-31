import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios"; // Import axios for API calls

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { formData } = location.state || {}; // Access formData passed from the Signup component

  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // Array to store OTP digits
  const [error, setError] = useState(""); // State to handle error messages
  const [loading, setLoading] = useState(false); // State to handle loading state

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return; // Allow only numeric input
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus to the next input field
    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  // Handle Backspace key press
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move focus to the previous input field
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    const enteredOtp = otp.join(""); // Combine OTP digits into a single string

    if (enteredOtp.length !== 6) {
      setError("Please enter a 6-digit OTP.");
      return;
    }

    setLoading(true); // Start loading
    setError(""); // Clear previous errors

    try {
      // validate otp
      const SignUpdata = { ...formData, enteredOtp };
      // Step 2: If OTP is valid, proceed with signup
      const signupResponse = await axios.post(
        "http://localhost:4000/api/v1/auth/signup",
        {
          ...formData, // Send the form data
          otp: enteredOtp, // Include the OTP in the signup request
        },
        {
          headers: {
            "Content-Type": "application/json", // Specify the content type
          },
        }
      );

      if (signupResponse.data.success) {
        // Navigate to the home page on successful signup
        navigate("/account");
      } else {
        setError("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during OTP verification or signup:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">
          OTP Verification
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Please enter the 6-digit OTP sent to your email.
        </p>

        {/* OTP Input Fields */}
        <div className="flex justify-center space-x-4 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)} // Handle Backspace key
              className="w-12 h-12 text-center text-2xl border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          ))}
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Verify Button */}
        <button
          onClick={verifyOtp}
          disabled={loading} // Disable button during loading
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 disabled:bg-blue-300"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
};

export default VerifyOtp;
