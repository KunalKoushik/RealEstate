import React, { useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import { useNavigate } from "react-router-dom";
import { FaXmark, FaBuilding, FaEnvelope, FaStar } from "react-icons/fa6";
import {
  FaBars,
  FaConciergeBell,
  FaHome,
  FaInfoCircle,
  FaPhoneAlt,
  FaUserCircle,
} from "react-icons/fa";
import logo from "../assets/images/logo.png";
import { useDarkMode } from "./DarkModeContext";


const Header = () => {
  const navigate = useNavigate(); // Call useNavigate at the top level
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSignupClick = () => {
    console.log("Signup clicked"); // Debugging line
    navigate("/account"); // Use navigate inside a function
  };

  // Navigation items
  const navItem = [
    { link: "Home", path: "home", icon: <FaHome /> },
    { link: "About", path: "about", icon: <FaInfoCircle /> },
    { link: "Properties", path: "properties", icon: <FaBuilding /> },
    { link: "Services", path: "services", icon: <FaConciergeBell /> },
    { link: "Contact", path: "contact", icon: <FaEnvelope /> },
    { link: "Testimonials", path: "testimonials", icon: <FaStar /> },
  ];

  return (
    <header
      className={`${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      } fixed w-full top-0 z-50 shadow-md transition-colors duration-300`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo with Color Inversion */}

        <img
          onClick={() => navigate("/")}
          src={logo}
          alt="Logo"
          className={`h-10 transition-all duration-300 ${
            darkMode ? "invert" : ""
          }`}
        />

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex space-x-6">
          {navItem.map((item, index) => (
            <li key={index}>
              <ScrollLink
                to={item.path}
                spy={true}
                smooth={true}
                offset={-100}
                duration={500}
                className="cursor-pointer text-lg font-medium hover:text-blue-600 transition"
                onClick={() => navigate("/")}
              >
                {item.link}
                
              </ScrollLink>
            </li>
          ))}
        </ul>

        {/* Right Section (Icons) */}
        <div className="hidden lg:flex space-x-4">
          <FaPhoneAlt className="text-blue-600 size-5 cursor-pointer hover:scale-110 transition-transform duration-300" />
          <FaUserCircle
            onClick={handleSignupClick} // Pass the function to onClick
            className="size-6 cursor-pointer hover:scale-110 transition-transform duration-300"
          />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-2xl hover:text-blue-600 transition-transform duration-300 hover:scale-110"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <FaXmark /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`lg:hidden fixed top-0 left-0 w-1/3 h-screen ${
          darkMode ? "bg-gray-900" : "bg-white"
        } z-50 flex flex-col items-center justify-center transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="absolute top-6 right-6 text-2xl hover:text-blue-500 transition"
          onClick={closeMenu}
        >
          <FaXmark />
        </button>
        <ul className="flex flex-col space-y-6">
          {navItem.map((item, index) => (
            <li key={index} className="w-full">
              <ScrollLink
                to={item.path}
                spy={true}
                smooth={true}
                offset={-100}
                duration={500}
                className={`cursor-pointer text-lg ${
                  darkMode ? "text-white" : "text-black"
                } hover:text-blue-500 flex items-center gap-4 px-6 py-3 hover:bg-gray-700 w-full transition-all`}
                onClick={closeMenu}
              >
                {item.icon} {item.link}
              </ScrollLink>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Header;
