import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { useDarkMode } from "../components/DarkModeContext";
import AOS from "aos";
import "aos/dist/aos.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

const Clients = () => {
  const [reviews, setReviews] = useState([]);
  const { darkMode } = useDarkMode();

  useEffect(() => {
    AOS.init({
      duration: 400,
      delay: 50,
      offset: 200,
      easing: "ease-in-sine",
    });

    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/review/allRatingsReviews"
        );
        setReviews(response.data.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div
      className={`${
        darkMode
          ? "dark bg-black text-white"
          : "light bg-transparent text-slate-600"
      }`}
    >
      <section
        id="testimonials"
        className="w-full h-fit m-auto bg-cover bg-center rounded-xl flex justify-center flex-col items-start lg:px-10 px-6 py-10 gap-20"
      >
        <div className="flex flex-col justify-center items-start gap-4">
          <h1 data-aos="zoom-in" className="text-blue-500">
            OUR CLIENTS
          </h1>
          <h1
            data-aos="zoom-in"
            className="text-[40px] font-semibold leading-10"
          >
            What Our Clients <br /> are saying about us
          </h1>
        </div>

        <div id="clients-box" className="w-full">
          {reviews && reviews.length > 0 ? (
            <Swiper
              slidesPerView={1}
              spaceBetween={30}
              pagination={{
                clickable: true,
              }}
              navigation
              breakpoints={{
                640: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 40,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 50,
                },
              }}
              modules={[Pagination, Navigation]}
              className="mySwiper"
            >
              {reviews.map((review, index) => (
                <SwiperSlide key={index}>
                  <div
                    data-aos="zoom-in"
                    data-aos-delay="200"
                    className={`${
                      darkMode
                        ? "dark bg-black text-white hover:bg-gray-900"
                        : "light bg-transparent hover:bg-blue-200 text-slate-600"
                    } cursor-pointer p-12 flex flex-col justify-center items-center gap-6 rounded-xl w-full`}
                  >
                    <div className="flex justify-start items-center w-full gap-4">
                      <img
                        src={review.user.image || "/path/to/default/image.jpg"}
                        alt="User"
                        className="w-[70px] transform hover:scale-110 transition-transform duration-300"
                      />
                      <div className="flex flex-col justify-center items-start gap-1">
                        <h1 className="text-xl font-semibold">
                          {review.user.firstName} {review.user.lastName}
                        </h1>
                        <h1 className="font-semibold">{review.review}</h1>
                      </div>
                    </div>
                    <p className="text-md text-justify">{review.review}</p>
                    <div className="flex justify-start items-start gap-2 w-full">
                      {[...Array(review.rating)].map((_, starIndex) => (
                        <FaStar
                          key={starIndex}
                          className="size-4 text-yellow-400"
                        />
                      ))}
                      {[...Array(5 - review.rating)].map((_, starIndex) => (
                        <FaStar
                          key={starIndex}
                          className="size-4 text-gray-400"
                        />
                      ))}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Clients;
