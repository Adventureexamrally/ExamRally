import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Api from "../service/Api";

const Banner = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    Api.get("banner/get/active")
      .then((response) => {
        setSlides(response.data);
      })
      .catch((error) => {
        console.error("Error fetching slides:", error);
      })
      .finally(() => {
        setLoading(false); // Set loading to false after fetch completes
      });
  }, []);

  const settings = {
    dots: true,
    infinite: slides.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: slides.length > 1,
    autoplaySpeed: 3000,
    prevArrow: <FaChevronLeft className="slick-prev w-2 h-5 text-black" />,
    nextArrow: <FaChevronRight className="slick-next w-2 h-5 text-black" />,
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center rounded-md py-1">
      <div className="w-full rounded-md">
        {loading ? (
        <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: '100vh' }} // Full viewport height
              >
                <div
                  className="spinner-border text-green-500 fw-bold "
                  role="status"
                  style={{ width: '3rem', height: '3rem' }}
                >
                 
                </div>
              </div>
        ) : slides.length === 0 ? (
          <div className="w-full h-[150px] bg-gray-200 flex items-center justify-center">
            <p>No banners available</p>
          </div>
        ) : slides.length === 1 ? (
          <div className="relative">
            <div className="w-full h-[150px] sm:h-[180px] md:h-[200px] lg:h-[220px] xl:h-[250px] overflow-hidden rounded-md shadow-lg">
              <a href={slides[0].link}>
                <img
                  src={slides[0].photo}
                  alt="Slide 1"
                  className="w-full h-full"
                />
              </a>
            </div>
          </div>
        ) : (
          <Slider {...settings}>
            {slides.map((slide, index) => (
              <div key={index} className="relative">
                <div className="w-full h-[150px] sm:h-[180px] md:h-[200px] lg:h-[220px] xl:h-[250px] overflow-hidden rounded-md shadow-lg">
                  <a href={slide.link}>
                    <img
                      src={slide.photo}
                      alt={`Slide ${index + 1}`}
                      className="w-full h-full"
                    />
                  </a>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

export default Banner;
