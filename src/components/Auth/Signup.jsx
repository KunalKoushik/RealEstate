import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../DarkModeContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import Aos from "aos";
import "aos/dist/aos.css";

const Signup = () => {
  const navigate = useNavigate();
  useEffect(() => {
    Aos.init({
      offset: 200,
      easing: "ease-in-sine",
      duration: 800,
      delay: 50,
    });
  }, []);
const [loading, setLoading] = useState(false); // State to handle loading state
  const { darkMode } = useDarkMode();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "", // New field for confirm password
    aadhaarNumber: "",
    accountType: "Client",
    gender: "",
    dateOfBirth: "",
    about: "null",
    contactNumber: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility
  const [error, setError] = useState(""); // State to handle validation errors

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    // Validate password and confirm password
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(""); // Clear any previous errors
    console.log("Form submitted", formData);

    try {
      // Step 1: Send OTP to the user's email
      const otpResponse = await axios.post(
        "http://localhost:4000/api/v1/auth/send-otp",
        {
          email: formData.email, // Send the email to fetch the OTP
        },
        {
          headers: {
            "Content-Type": "application/json", // Specify the content type
          },
        }
      );

      if (otpResponse.data.success) {
        const emailedotp = otpResponse.data.otp; // Get the OTP from the response
        // Navigate to the verifyotp route and pass formData and OTP as state
        navigate("/verifyotp", { state: { formData } });
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error during OTP sending:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div
      className={`flex mt-14 md:mt-0 justify-center items-center p-4 transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <div
        data-aos="zoom-in"
        className={`shadow-lg mt-15 mb-5 rounded-lg p-6 w-full max-w-2xl transition-colors duration-300 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 md:grid md:grid-cols-2"
        >
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            required
            onChange={handleChange}
            className={`p-2 border rounded-md bg-transparent ${
              darkMode ? "placeholder-gray-400" : "placeholder-gray-600"
            }`}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            required
            onChange={handleChange}
            className={`p-2 border rounded-md bg-transparent ${
              darkMode ? "placeholder-gray-400" : "placeholder-gray-600"
            }`}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
            className={`p-2 border rounded-md bg-transparent ${
              darkMode ? "placeholder-gray-400" : "placeholder-gray-600"
            }`}
          />

          {/* Password Field */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
              className={`p-2 border rounded-md bg-transparent w-full ${
                darkMode ? "placeholder-gray-400" : "placeholder-gray-600"
              }`}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <FaEye
                  className={`${darkMode ? "text-white" : "text-black"}`}
                />
              ) : (
                <FaEyeSlash
                  className={`${darkMode ? "text-white" : "text-black"}`}
                />
              )}
            </button>
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              onChange={handleChange}
              className={`p-2 border rounded-md bg-transparent w-full ${
                darkMode ? "placeholder-gray-400" : "placeholder-gray-600"
              }`}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? (
                <FaEye
                  className={`${darkMode ? "text-white" : "text-black"}`}
                />
              ) : (
                <FaEyeSlash
                  className={`${darkMode ? "text-white" : "text-black"}`}
                />
              )}
            </button>
          </div>

          <input
            type="text"
            name="aadhaarNumber"
            placeholder="Aadhaar Number"
            required
            maxLength="12"
            onChange={handleChange}
            className={`p-2 border rounded-md bg-transparent ${
              darkMode ? "placeholder-gray-400" : "placeholder-gray-600"
            }`}
          />
          <select
            name="accountType"
            required
            defaultValue="Client"
            onChange={handleChange}
            className="p-2 border rounded-md bg-transparent"
          >
            <option value="Client">Client</option>
          </select>
          <select
            name="gender"
            required
            onChange={handleChange}
            className="p-2 border rounded-md bg-transparent"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="date"
            name="dateOfBirth"
            required
            onChange={handleChange}
            className="p-2 border rounded-md bg-transparent"
          />
          {/* <textarea name="about" placeholder="About Yourself" required onChange={handleChange} className={`p-2 border rounded-md bg-transparent ${darkMode ? 'placeholder-gray-400' : 'placeholder-gray-600'}`}></textarea> */}
          <input
            type="tel"
            name="contactNumber"
            placeholder="Contact Number"
            required
            onChange={handleChange}
            className={`p-2 border rounded-md bg-transparent ${
              darkMode ? "placeholder-gray-400" : "placeholder-gray-600"
            }`}
          />

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-center col-span-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 col-span-2"
          >
            
            {loading ? "Please wait..." : "SignUp"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
