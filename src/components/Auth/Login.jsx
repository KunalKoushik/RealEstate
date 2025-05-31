import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { useDarkMode } from "../DarkModeContext";
import Cookies from "js-cookie"; // Import js-cookie to manage cookies
import { jwtDecode } from "jwt-decode";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Aos from "aos";
import "aos/dist/aos.css";
import axios from "axios"; // Import axios for API calls

const Login = () => {
  const navigate = useNavigate(); // Hook for navigation
  useEffect(() => {
    Aos.init({
      offset: 200,
      easing: "ease-in-sine",
      duration: 800,
      delay: 50,
    });
  }, []);



  const { darkMode } = useDarkMode();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    accountType: "Client", // Default account type
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(""); // State to handle error messages
  const [loading, setLoading] = useState(false); // State to handle loading state

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setError(""); // Clear previous errors

    try {
      // Call the backend login API
      const response = await axios.post("http://localhost:4000/api/v1/auth/login", {
        email: formData.email,
        password: formData.password,
        accountType: formData.accountType,
      });

      if (response.data.success) {
        // Login successful
        const {token , user} = response.data;
        
        //store token in local storage
        localStorage.setItem("token",token);
        localStorage.setItem("userId",user._id);
        //store user details in local storage
        localStorage.setItem("user",JSON.stringify(user));
        
        navigate("/"); // Navigate to the home page or dashboard
      } else {
        // Login failed
        setError(response.data.message || "Invalid email or password.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div
      data-aos="zoom-in"
      className={`flex justify-center items-center p-4 transition-colors mt-4 duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <div
        className={`shadow-lg mt-10 rounded-lg p-6 w-full max-w-lg transition-colors duration-300 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                <FaEye className={`${darkMode ? "text-white" : "text-black"}`} />
              ) : (
                <FaEyeSlash
                  className={`${darkMode ? "text-white" : "text-black"}`}
                />
              )}
            </button>
          </div>
          <select
            name="accountType"
            required
            onChange={handleChange}
            className="p-2 border rounded-md bg-transparent"
          >
            <option value="Client">Client</option>
            <option value="Admin">Admin</option>
          </select>

          {/* Error Message */}
          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading} // Disable button during loading
            className="col-span-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;