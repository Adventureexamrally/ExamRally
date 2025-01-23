import React from "react";
import Slider from "react-slick";

// Import slick-carousel CSS
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import one from "../assets/images/1.jpg";
import two from "../assets/images/2.jpg";

import three from "../assets/images/3.jpg";

const Banner = () => {
  // Slick slider settings
  const settings = {
    dots: true, // Enable dots for navigation
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // Auto-slide images
    autoplaySpeed: 3000, // Delay between slides
  };
  const slide = 'https://via.placeholder.com/1500x600/4f8aff/fff?text=Slide+2'
  return (
    <div className="bg-slate-200 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="relative">
          {/* Carousel */}
          <Slider {...settings}>
            <div className="relative">
              <img
                src={one}
                alt="Slide 1"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <h2 className="text-4xl font-bold">Welcome to Our Platform</h2>
                <p className="mt-4 text-lg">
                  Join us for amazing opportunities.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src={two}
                alt="Slide 2"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <h2 className="text-4xl font-bold">Transform Your Career</h2>
                <p className="mt-4 text-lg">
                  Explore a variety of courses to boost your career.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src={three}
                alt="Slide 3"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <h2 className="text-4xl font-bold">Get Started Today</h2>
                <p className="mt-4 text-lg">
                  Begin your journey with us and unlock endless potential.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src={three}
                alt="Slide 3"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <h2 className="text-4xl font-bold">Get Started Today</h2>
                <p className="mt-4 text-lg">
                  Begin your journey with us and unlock endless potential.
                </p>
              </div>
            </div>
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Banner;
