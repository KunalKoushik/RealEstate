import React, { useEffect } from "react";
import abouting from "../assets/images/about.jpg";
import { useDarkMode } from "../components/DarkModeContext";
import Aos from "aos";
import "aos/dist/aos.css";

const About = () => {
  useEffect(() => {
    Aos.init({
      offset: 200,
      easing: "ease-in-sine",
      duration: 400,
      delay: 50,
    });
  }, []);
  const { darkMode, toggleDarkMode } = useDarkMode();
  return (
    <section
      id="about"
      className={`${
        darkMode
          ? "dark bg-black text-white"
          : "light bg-transparent text-black"
      }  w-full m-auto lg:px-40 px-10 py-10 grid lg:grid-cols-2 grid-cols-1 justify-center gap-10 items-center`}
    >
      <div>
        <img
          data-aos="zoom-in"
          src={abouting}
          alt="about image"
          className="rounded-2xl lg:w-[500px] lg:h-[600px]"
        />
      </div>
      <div className="flex flex-col justify-center items-start gap-8 ">
        <h1 data-aos="zoom-in">WHO WE ARE</h1>
        <h1
          data-aos="zoom-in"
          data-aos-delay="200"
          className="text-[40px] font-semibold
        leading-10  "
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod ipsum
          provident labore, exercitationem culpa nisi porro possimum
        </h1>
        <p
          data-aos="zoom-in"
          data-aos-delay="400"
          className="text-xl text-gray-600  text-justify"
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur
          nostrum omnis quo iste excepturi enim quisquam veritatis id
          reprehenderit, minima alias, quam accusamus aut aperiam expedita
          veniam ducimus quidem suscipit! Provident tenetur exercitationem unde,
          consectetur natus optio at laboriosam dignissimos ipsa repudiandae
          consequatur deserunt quam ratione adipisci voluptates corporis nobis
        </p>
        <button
          className="bg-blue-600 dark:bg-blue-700 hover:white dark:hover:bg-black 
            dark:hover:text-white text-lg p-4  text-white font-semibold rounded-xl cursor-pointer transform hover:scale-110
            transition-transform duration-300 "
        >
          Read More
        </button>
      </div>
    </section>
  );
};

export default About;
