import React, { useState, useEffect } from "react"; // Import useState correctly
import { useDarkMode } from "../components/DarkModeContext";
import Login from "../components/Auth/Login";
import Signup from "../components/Auth/Signup";
import Aos from "aos";
import "aos/dist/aos.css";
const CreateAccount = () => {
  const [showLogin, setShowLogin] = useState(true); // Correct usage of useState
  useEffect(() => {
    Aos.init({
      offset: 200,
      easing: "ease-in-sine",
      duration: 400,
      delay: 50,
    });
  }, [showLogin]);

  return (
    <div
      data-aos="zoom-in"
      className=" mx-auto border-gray-300 rounded-lg shadow-xl"
    >
      <div className="border-gray-300 shadow-2xl p-4  ">
        <div>
          {showLogin ? <Login /> : <Signup />} {/* Use showLogin directly */}
          <div className="flex justify-center flex-col items-center">
            <p className="m-auto">
              {showLogin
                ? "Don't have an Account?"
                : "Already have an account?"}{" "}
              {/* Conditional text */}
            </p>
            <button
              className=" w-lg py-2 rounded-md bg-gradient-to-r from-blue-400 to-blue-600
            text-white font-semibold transition-transform duration-200 hover:scale-95 
            active:scale-110"
              // Toggle showLogin state
              onClick={() => setShowLogin(!showLogin)}
            >
              {showLogin ? "Create Account" : "Login"}{" "}
              {/* Conditional button text */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateAccount;
