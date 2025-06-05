import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Custom arrows from React Icons

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Api from "../service/Api";

const Banner = () => {
  const [slides, setSlides] = useState([]);

  const settings = {
    dots: true,
    infinite: slides.length > 1, // Disable infinite if only 1 slide
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: slides.length > 1, // Disable autoplay if only 1 slide
    autoplaySpeed: 3000,
    prevArrow: <FaChevronLeft className="slick-prev w-2 h-5 text-black" />,
    nextArrow: <FaChevronRight className="slick-next w-2 h-5 text-black" />,
  };

  useEffect(() => {
    Api.get("banner/get/active")
      .then((response) => {
        setSlides(response.data);
        console.log("Fetched slides:", response.data);
      })
      .catch((error) => console.error("Error fetching slides:", error));
  }, []);



  return (
    <div className="bg-gray-100 flex justify-center items-center rounded-md py-1">
      <div className="w-full rounded-md">
        {slides.length === 0 ? (
          <div className="w-full h-[150px] bg-gray-200 flex items-center justify-center">
            <p>No banners available</p>
          </div>
        ) : slides.length === 1 ? (
          <div className="relative">
            <div className="w-full h-[150px] sm:h-[180px] md:h-[200px] lg:h-[220px] xl:h-[250px] overflow-hidden rounded-md shadow-lg">
              <img
                src={slides[0].photo}
                alt="Slide 1"
                className="w-full h-full"
              />
            </div>
          </div>
        ) : (
          <Slider {...settings}>
            {slides.map((slide, index) => (
              <div key={index} className="relative">
                <div className="w-full h-[150px] sm:h-[180px] md:h-[200px] lg:h-[220px] xl:h-[250px] overflow-hidden rounded-md shadow-lg">
                  <img
                    src={slide.photo}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full"
                  />
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
