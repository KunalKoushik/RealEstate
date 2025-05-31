import React from 'react';
import { useDarkMode } from './DarkModeContext';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaBuilding, FaMobile, FaFax, FaArrowUp, FaMoon, FaSun } from 'react-icons/fa';
import { IoMdMail } from 'react-icons/io';
import prop7 from "../assets/images/prop7.jpg";
import prop8 from "../assets/images/prop8.jpg";
import { Link } from 'react-scroll';
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from 'react';

const Footer = () => {
  useEffect(() => {
      AOS.init({
        duration: 400,
        delay: 10,
        offset: 200,
        easing: "ease-in-sine",
      });
    }, []);

  const { darkMode, toggleDarkMode } = useDarkMode(); // Fixed: Added toggleDarkMode

  return (
    <>
      <footer data-aos="zoom-in" className={`${darkMode ? 'dark bg-black' : 'light bg-gray-800'} w-full lg:px-20 px-10 py-20 grid lg:grid-cols-3 grid-cols-1 gap-10 justify-center items-start`}>
        {/* About Us Section */}
        <div className="flex flex-col justify-center items-start gap-5">
          <h1 className="text-white text-2xl font-semibold">About Us</h1>
          <p className="text-white text-justify">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quisquam, fugiat quo. Repudiandae quisquam necessitatibus nulla dolorem accusamus modi ea impedit.
          </p>
          <div id="social-icon" className="flex justify-start gap-4 mt-4 items-center">
            {[FaFacebook, FaInstagram, FaTwitter, FaYoutube].map((Icon, index) => (
              <div key={index} className="p-3 rounded-xl bg-white hover:bg-red-600 hover:text-white cursor-pointer transform hover:scale-110 transition-transform duration-300">
                <Icon className="size-5" />
              </div>
            ))}
          </div>
          <h1 className="text-white">© Real Estate, All rights reserved</h1>
        </div>

        {/* Contact Us Section */}
        <div className="flex flex-col justify-center items-center gap-5">
          <h1 className="text-2xl text-white font-semibold">Contact Us</h1>
          <div className="flex self-start justify-center items-center gap-3">
            <FaBuilding className="text-white size-10 lg:size-20" />
            <p className="text-slate-200">Here mention your address. Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          </div>
          <div className="flex self-start justify-center items-center gap-3">
            <FaMobile className="text-white size-7" />
            <p className="text-slate-200">+91 5241637485</p>
          </div>
          <div className="flex self-start justify-center items-center gap-3">
            <FaFax className="text-white size-10" />
            <p className="text-slate-200">8596 5234</p>
          </div>
          <div className="flex self-start justify-center items-center gap-3">
            <IoMdMail className="text-white size-10" />
            <p className="text-slate-200">demomail@gmail.com</p>
          </div>
        </div>

        {/* Latest Properties Section */}
        <div className="flex flex-col items-start justify-center gap-5">
          <h1 className="text-white text-2xl font-semibold">Latest Properties</h1>
          <div className="grid lg:grid-cols-1 grid-cols-2 gap-13">
            {[prop7, prop8].map((image, index) => (
              <div key={index} className="flex flex-col lg:flex-row justify-center items-center gap-4">
                <img src={image} className="w-[120px] rounded-lg transform hover:scale-110 cursor-pointer transition-transform duration-300" alt="Property" />
                <div className="lg:flex lg:flex-col">
                  <h1 className="text-white text-lg">Villa with amazing view</h1>
                  <p className="text-white">$238.98</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <div className="bg-blue-600 cursor-pointer rounded-full p-4 hover:bg-black fixed lg:bottom-12 bottom-6 right-6">
        <Link to="hero" spy={true} offset={-100} smooth={true}>
          <FaArrowUp className="text-white font-bold size-6" />
        </Link>
      </div>

      {/* Dark Mode Toggle Button */}
      <div>
        <button
          className="flex items-center p-4 fixed lg:top-52 right-6 top-26 rounded-full bg-cyan-500"
          onClick={toggleDarkMode} // Fixed: Now this works correctly
        >
          {darkMode ? <FaMoon size={25} className="text-black" /> : <FaSun size={25} className="text-black" />}
        </button>
      </div>
    </>
  );
};

export default Footer;
