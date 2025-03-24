import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Api from "../service/Api";

const Banner = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const [slides, setSlides] = useState([]);

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
        <Slider {...settings}>
          {slides.map((slide, index) => (
            <div key={index} className="relative">
              <div className="w-full h-[150px] sm:h-[180px] md:h-[200px] lg:h-[220px] xl:h-[250px] overflow-hidden rounded-md shadow-lg">
                <img
                  src={slide.photo}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full "  // Adjusted object-fit property
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Banner;
