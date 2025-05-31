import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../../src/components/DarkModeContext";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Aos from "aos";
import "aos/dist/aos.css";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

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
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:4000/api/v1/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      console.log(response);
      if (response.data.success) {
        const { token, user } = response.data;
        console.log(user.accountType);

        // Store token in cookies (for Admin.js to detect)
        Cookies.set("cookie", token);

        // Optional: also store in localStorage if needed
        localStorage.setItem("token", token);
        localStorage.setItem("userId", user._id);
        localStorage.setItem("user", JSON.stringify(user));

        // Redirect based on role
        if (user.accountType === "Admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else {
        setError(response.data.message || "Invalid email or password.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      data-aos="zoom-in"
      className={`flex justify-center items-center p-4 transition-colors mt-8 duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <div
        className={`shadow-lg mt-10 rounded-lg p-6 w-full max-w-lg transition-colors duration-300 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Admin Login</h2>
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
                <FaEyeSlash className={`${darkMode ? "text-white" : "text-black"}`} />
              )}
            </button>
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
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
