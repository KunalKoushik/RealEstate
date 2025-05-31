import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Axios to make API calls
import { useDarkMode } from "../components/DarkModeContext";
import AOS from "aos";
import { MdSpaceDashboard } from "react-icons/md";
import {
  FaBath,
  FaShareAlt,
  FaBed,
  FaUserCircle,
  FaMapMarkerAlt,
  FaVideo,
  FaCamera,
  FaHeart,
} from "react-icons/fa";
import "aos/dist/aos.css"; // Importing AOS for animations
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const Properties = () => {
  const [properties, setProperties] = useState([]); // State to store properties data
  const navigate = useNavigate();
  const formatPrice = (price) => {
    if (!price) return "₹0";

    // Convert to number in case it's a string
    const num = Number(price);

    if (num >= 10000000) {
      // 1 crore or more
      const croreValue = num / 10000000;
      // Trim trailing zeros and unnecessary decimal points
      return `₹${
        croreValue % 1 === 0
          ? croreValue.toFixed(0)
          : croreValue.toFixed(2).replace(/\.?0+$/, "")
      } Cr`;
    } else if (num >= 1000) {
      // 1 thousand or more
      const thousandValue = num / 1000;
      // Trim trailing zeros and unnecessary decimal points
      return `₹${
        thousandValue % 1 === 0
          ? thousandValue.toFixed(0)
          : thousandValue.toFixed(2).replace(/\.?0+$/, "")
      }k`;
    } else {
      // For numbers less than 1000, just display as is without decimal places
      return `₹${num.toFixed(0)}`;
    }
  };
  useEffect(() => {
    // Initialize AOS animations
    AOS.init({
      offset: 200,
      duration: 400,
      easing: "ease-in-sine",
      delay: 50,
    });

    // Fetch data from the API
    const fetchProperties = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/property/getAllProperties"
        );
        setProperties(response.data.properties); // Set the fetched properties in the state
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []);

  const { darkMode } = useDarkMode();

  return (
    <div>
      <div
        className={`${
          darkMode
            ? "dark bg-black text-white"
            : "light bg-transparent text-black"
        }`}
      >
        <section
          id="properties"
          className="m-auto px-6 py-20 w-[98%] flex flex-col justify-center items-start gap-10"
        >
          <div className="flex w-full justify-between">
            <div className="flex flex-col justify-center items-start gap-4">
              <h1 data-aos="zoom-in">PROPERTIES</h1>
              <h1 data-aos="zoom-in" className="text-4xl font-semibold">
                Explore the Latest
              </h1>
            </div>
            <button
              onClick={() => navigate("/properties")}
              className="bg-blue-300 font-semibold p-2 cursor-pointer h-fit rounded-md shadow-amber-700"
            >
              {"Explore More.. →"}
            </button>
          </div>

          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={10}
            slidesPerView={3}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 50 },
            }}
            className="w-full -z-10 "
          >
            {properties.map((item) => (
              <SwiperSlide key={item._id}>
                <div
                  data-aos="zoom-in"
                  data-aos-delay="200"
                  className="rounded-xl border "
                >
                  <div
                    id="image-box"
                    className="bg-cover bg-center h-[250px] rounded-xl p-4 flex flex-col justify-between items-end"
                    style={{
                      backgroundImage: `url(${
                        item.images || "https://via.placeholder.com/400x250"
                      })`,
                    }} // Default image if no image available
                  >
                    <div
                      id="top"
                      className="flex justify-between items-end w-full"
                    >
                      <div>
                        <button className="px-3 py-1 bg-blue-700 hover:bg-white hover:text-black text-white rounded-full text-[13px]">
                          Featured
                        </button>
                      </div>
                      <div className="flex justify-between items-center gap-3">
                        <button className="px-3 py-1 bg-blue-700 hover:bg-white hover:text-black text-white rounded-full text-[13px]">
                          {item.status}
                        </button>
                      </div>
                    </div>
                    <div
                      id="bottom"
                      className="flex justify-between items-end w-full"
                    >
                      <div className="flex justify-start items-center gap-2">
                        <FaMapMarkerAlt className="size-4 text-white" />
                        <h1 className="text-white">{item.location}</h1>
                      </div>
                      <div className="flex justify-center items-center gap-4">
                        <FaVideo className="size-4 text-white " />
                        <FaCamera className="size-4 text-white " />
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-3 flex flex-col justify-center items-start gap-2 w-full">
                    <h1 className="text-xl font-semibold">{item.title}</h1>
                    <h1 className="text-2xl text-blue-600 font-bold">
                      {formatPrice(item.price)}
                    </h1>
                    <p>
                      {item.description
                        ? item.description.trim().substring(0, 50) +
                          (item.description.length > 50 ? "..." : "")
                        : "No description available"}
                    </p>

                    <div
                      id="icons"
                      className="flex justify-center items-start gap-4"
                    >
                      <div className="flex justify-center items-center gap-2">
                        <FaBath className="size-5 text-blue-400" />
                        <h1>{item.washrooms}</h1>
                      </div>
                      <div className="flex justify-center items-center gap-2">
                        <FaBed className="size-5 text-blue-400" />
                        <h1>{item.bedrooms}</h1>
                      </div>
                      <div className="flex justify-center items-center gap-2">
                        <MdSpaceDashboard className="size-5 text-blue-400" />
                        <h1>{item.totalArea} sqft</h1>
                      </div>
                    </div>

                    <div
                      id="owner-info"
                      className="flex justify-between items-center w-full mt-2"
                    >
                      <div className="flex justify-center items-center gap-2">
                        <FaUserCircle className="size-5 text-blue-400" />
                        <h1>
                          {item.user.firstName} {item.user.lastName}
                        </h1>
                      </div>
                      <div className="flex justify-center items-center gap-4">
                        <div className="p-2 border-2 border-gray-200 hover:bg-black cursor-pointer transform hover:scale-110 transition-transform duration-300">
                          <FaShareAlt className="size-4 text-blue-400" />
                        </div>

                        <div className="p-2 border-2 border-gray-200 hover:bg-black cursor-pointer transform hover:scale-110 transition-transform duration-300">
                          <FaHeart className="size-4 text-blue-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      </div>
    </div>
  );
};

export default Properties;
