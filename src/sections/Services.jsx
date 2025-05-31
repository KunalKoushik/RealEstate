import React, { useEffect } from "react";
import { service } from "../components/export";
import { useDarkMode } from "../components/DarkModeContext";
import AOS from "aos";
import "aos/dist/aos.css";

const Services = () => {
  useEffect(() => {
    AOS.init({
      duration: 400,
      delay: 50,
      offset: 100,
      easing: "ease-in-sine",
    });
  }, []);
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <div
      className={`${
        darkMode ? "dark bg-black " : "light bg-transparent "
      } pb-20`}
    >
      <section
        id="services"
        className={`${
          darkMode ? "dark bg-gray-800 text-white" : "light bg-transparent text-black "
        } w-full h-fit m-auto rounded-xl flex 
      flex-col items-start justify-center lg:px-20 px-6`}
      >
        <div className="flex  flex-col justify-center items-start gap-4">
          <h1 data-aos="zoom-in" className="text-blue-500 ">
            OUR SERVICES
          </h1>
          <h1
            data-aos="zoom-in"
            className="text-[40px] font-semibold leading-10"
          >
            Top real estate <br /> services available
          </h1>
        </div>
        <div id="service-box" className="grid lg:grid-cols-3 grid-cols-1 justify-center 
        items-center gap-8">
          {
            service.map((item,index)=>(
              <div data-aos="zoom-in" data-aos-delay="200" key={index} className="
              h-[350px] px-8 py-10 flex flex-col justify-center items-start gap-4 rounded-xl border-b-[5px] 
              border-blue-600 hover:bg-blue-300 cursor-pointer">
                <div className="p-6 rounded-full bg-blue-200">
                  <item.icon className="blue-red-600 size-10 transform hover:scale-110 transition-transform duration-300 cursor-pointer"/>

                </div>
                <h1 className="text-[22px] font-semibold">{item.title}</h1>
                <p className="text-lg text-slate-700">{item.desc}</p>
                <button className="border-b-2 border-blue-600 text-blue-600 font-semibold p-0 ">READ MORE</button>
              </div>
            ))
          }
        </div>
      </section>
    </div>
  );
};

export default Services;
