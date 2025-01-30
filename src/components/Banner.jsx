import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import one from "../assets/images/1.jpg";
import two from "../assets/images/2.jpg";
import three from "../assets/images/3.jpg";
import banner from "../assets/images/banner.png";


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

  const slides = [
    { image: banner, title: "Welcome to Our Platform", description: "Join us for amazing opportunities." },
    { image: banner, title: "Transform Your Career", description: "Explore a variety of courses to boost your career." },
    { image: banner, title: "Get Started Today", description: "Begin your journey with us and unlock endless potential." },
  ];

  return (
    <div className="bg-gray-100 flex justify-center items-center rounded-md py-1">
      <div className="w-full rounded-md">
        <Slider {...settings}>
          {slides.map((slide, index) => (
            <div key={index} className="relative">
              <div className="w-full h-[150px] sm:h-[180px] md:h-[200px] lg:h-[220px] xl:h-[250px] overflow-hidden rounded-md shadow-lg">
                <img
                  src={slide.image}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-fill z-20"
                />
              </div>
              {/* <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 px-4 text-center text-white rounded-md">
                <h2 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold">{slide.title}</h2>
                <p className="text-xs sm:text-sm md:text-base">{slide.description}</p>
              </div> */}
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Banner;
