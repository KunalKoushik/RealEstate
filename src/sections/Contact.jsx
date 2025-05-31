import React from "react";
import { useEffect } from "react";
import { useDarkMode } from "../components/DarkModeContext";

import AOS from "aos";
import "aos/dist/aos.css";

const Contact = () => {
  useEffect(() => {
    AOS.init({
      duration: 400,
      delay: 50,
      offset: 200,
      easing: "ease-in-sine",
    });
  }, []);
  const { darkMode, toggleDarkMode } = useDarkMode();
  return (
    <div
      className={`${
        darkMode
          ? "dark bg-black text-white"
          : "light bg-transparent text-black"
      }`}
    >
      <section
        id="contact"
        className={`${
          darkMode ? "dark bg-gray-800 " : "light bg-blue-100 "
        } w-full h-fit m-auto rounded-xl grid lg:grid-cols-2 
      grid-cols-1 justify-center items-center 1g:px-36 px-6 py-20 gap-10`}
      >
        <div
          data-aos="zoom-in"
          className="bg-white rounded-2xl p-20 flex flex-col justify-center items-center gap-4 rounded-x1"
        >
          <h1 className="text-2xl font-semibold">Send us a message today</h1>
          <input
            type="text"
            placeholder="Enter your full name here"
            className="w-full px-6 
          py-3 rounded-xl border-2 border-gray-200"
          />

          <input
            type="email"
            placeholder="Enter your valid Email"
            className="w-full px-6 
          py-3 rounded-xl border-2 border-gray-200"
          />

          <input
            type="number"
            placeholder="Enter your valid mobile number"
            className="w-full px-6 
          py-3 rounded-xl border-2 border-gray-200"
          />

          <textarea
            name=""
            className="w-full px-6 
          py-3 rounded-xl border-2 border-gray-200"
            cols="30"
            rows="5"
            placeholder="Enter your message here..."
          ></textarea>
          <button
            className="bg-blue-600 dark:bg-blue-700 hover:white dark:hover:bg-black px-8 py-3
            dark:hover:text-white w-full text-md p-4 text-white font-semibold rounded-xl cursor-pointer transform hover:scale-105
            transition-transform duration-300 "
          >
            SEND EMAIL
          </button>
        </div>

        <div className="w-[90%] flex flex-col justify-center items-start gap-8 lg:p-20 p-6">
          <h1
            data-aos="zoom-in"
            data-aos-delay="200"
            className="text-blue-500 text-2xl"
          >
            REACH US
          </h1>
          <h1
            data-aos="zoom-in"
            data-aos-delay="400"
            className="text-[40px] font-semibold leading-10 "
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam
            odio ipsum fuga officiis mollitia corporis.
          </h1>
          <button
            className="bg-blue-600 hover:white dark:hover:bg-black px-8 py-3
            dark:hover:text-white text-md p-4 text-white font-semibold rounded-xl cursor-pointer transform hover:scale-105
            transition-transform duration-300 "
          >
            SEND EMAIL
          </button>
        </div>
      </section>
    </div>
  );
};

export default Contact;
