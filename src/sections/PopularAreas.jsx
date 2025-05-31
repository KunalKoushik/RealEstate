import React, { useEffect } from "react";
import { useDarkMode } from "../components/DarkModeContext";
import area1 from "../assets/images/area1.jpg";
import area2 from "../assets/images/area2.jpg";
import area3 from "../assets/images/area3.jpg";
import AOS from "aos";
import "aos/dist/aos.css";

const PopularAreas = () => {
  useEffect(() => {
    AOS.init({
      offset: 200,
      duration: 400,
      easing: "ease-in-sine",
      delay: 50,
    });
  }, []);

  const { darkMode } = useDarkMode();

  return (
    <div className={`${darkMode ? "dark bg-black" : "light bg-transparent"}`}>
      <section
        className={`${
          darkMode
            ? "dark bg-gray-800 text-white"
            : "light bg-transparent text-black"
        } lg:w-full w-full h-fit m-auto bg-center bg-cover flex flex-col items-center lg:px-20 px-6 py-20 rounded-xl`}
      >
        {/* Title Section */}
        <div className="w-full flex flex-col items-center">
          <h1 data-aos="zoom-in" className="text-sm font-medium text-gray-500">
            POPULAR AREAS
          </h1>
          <h1
            data-aos="zoom-in"
            className="text-3xl lg:text-5xl font-semibold leading-tight mt-4 text-center"
          >
            Explore the Most Popular Areas
          </h1>
        </div>

        {/* Image Grid + Stats */}
        <div className="grid md:grid-cols-3 grid-cols-1 gap-6 mt-10 w-full">
          {[area1, area2, area3].map((area, index) => (
            <div
              key={index}
              data-aos="zoom-in"
              data-aos-delay="400"
              style={{ backgroundImage: `url(${area})` }}
              className="h-[250px] lg:h-[400px] bg-cover bg-center rounded-xl w-full"
            ></div>
          ))}

          {/* Stats Section - Now Directly Below Images */}
          {[
            "5K ACTIVE LISTINGS",
            "3K SATISFIED CLIENTS",
            "10+ YEARS EXPERIENCE",
          ].map((text, idx) => (
            <div
              key={idx}
              data-aos="slide-up"
              data-aos-delay="100"
              className="flex flex-col items-center text-center mt-4 lg:mt-8"
            >
              <h1 className="text-4xl lg:text-5xl font-semibold">
                {text.split(" ")[0]}
              </h1>
              <h1 className="text-xl lg:text-2xl font-medium">
                {text.split(" ").slice(1).join(" ")}
              </h1>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PopularAreas;
