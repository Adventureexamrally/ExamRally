import React, { useEffect, useState } from 'react';
import logo from "../assets/logo/logo.png";
import { Link } from 'react-router-dom';
import { SignIn, SignedIn, SignedOut, SignInButton, UserButton, SignUp, useUser } from "@clerk/clerk-react";
import CustomUserMenu from './CustomUserButton';
import offer from '../assets/images/offer.png'
import Api from '../service/Api';
import { motion } from 'framer-motion';

const Header = () => {

  const { isSignedIn, user, isLoaded } = useUser();
  const [currentTime, setCurrentTime] = useState("");

  const [offer, setOffer] = useState(null);
  const [countdown, setCountdown] = useState("");
  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const response = await Api.get('offers');
        setOffer(response.data[0]); // Directly use response.data instead of calling .json()
        console.log("Offer data:", response.data[0]);
      } catch (error) {
        console.error('Error fetching offer:', error);
      }
    };
    fetchOffer();
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
      if (offer) {
        const end = new Date(offer.endDateTime);
        const start = new Date(offer.startDateTime);
        const now = new Date();
        // Check if current time is before start time
        if (now < start) {
          setCountdown("");
          return;
        }

        // Check if current time is past end time
        if (now > end) {
          setCountdown("");
          setOffer(null);
          return;
        }

        const timeDiff = end - now;
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    };

    const countdownInterval = setInterval(updateCountdown, 1000);
    return () => clearInterval(countdownInterval);
  }, [offer]);

  // if (!user) {
  //   return <div>Loading user info...</div>;
  // }
  // console.log(user)
  return (
    <header className="bg-white shadow-md">
    <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-around">
      
      {/* Left: Logo */}
      <div className="flex items-center space-x-3">
        <Link to="/">
          <img src={logo} alt="Brand Logo" className="h-10 cursor-pointer" />
        </Link>
      </div>
  
      {/* Center: Search bar (hidden on small screens) */}
      <div className="flex-1 max-w-md mx-auto hidden lg:block ">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full py-2 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-800 text-white px-4 py-1 rounded-lg"
          >
            Search
          </button>
        </div>
      </div>
  
      {/* Offer and Telegram/Sign-in */}
      <div className="flex items-center space-x-4">
        {/* Offer display */}
        {offer && new Date() >= new Date(offer.startDateTime) && (
          <Link to={offer.offerLink} className="flex flex-col md:flex-row items-center lg:space-x-2">
            <img
              src={offer.imageUrl}
              className="h-14 w-20 object-contain blink"
              alt={offer.offerName}
            />
            <div className="text-center lg:text-left">
              <div className="d-flex">
               
                <motion.span
  animate={{ 
    rotate: [0, 15, -15, 0],
    scale: [1, 1.2, 1.2, 1]
  }}
  transition={{
    repeat: Infinity,
    repeatType: "loop",
    duration: 1.,
    ease: "easeInOut",
    times: [0, 0.25, 0.75, 1]
  }}
  className="ml-2 text-blue-400 inline-block text-xl origin-center"
>
  ✨
</motion.span>
              <h1 className="text-green text-sm lg:text-lg font-semibold">{offer.offerName}  </h1>
              <motion.span
  animate={{ 
    rotate: [0, 15, -15, 0],
    scale: [1, 1.2, 1.2, 1]
  }}
  transition={{
    repeat: Infinity,
    repeatType: "loop",
    duration: 1.,
    ease: "easeInOut",
    times: [0, 0.25, 0.75, 1]
  }}
  className="text-blue-400 inline-block text-xl origin-center"
>
  ✨
</motion.span>
                                  
                                     
              </div>
            <div className="bg-gradient-to-r from-purple-500 to-amber-600 p-0.5 rounded-lg animate-gradient-x">
  <p className="text-white bg-[#131656] text-xs lg:text-sm px-3 py-1 rounded-[0.25rem] font-semibold text-center">
    ⚡ Ends Soon: {countdown}
  </p>
</div>
            </div>
           
          </Link>
        )}
  
        {/* Right Side Items: Telegram and Signin - hidden on small screens */}
        <div className="hidden lg:flex items-center space-x-3">
          <Link to="https://t.me/examrally" className="flex items-center space-x-1 text-[#24A1DE]">
            <i className="bi bi-telegram text-2xl"></i>
            <span>Join Telegram</span>
          </Link>
  
          <SignedOut>
          <SignInButton className="bg-[#000080]  text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
  Sign In
</SignInButton>
          </SignedOut>
          <SignedIn>
            <CustomUserMenu />
          </SignedIn>
        </div>
      </div>
    </div>
  </header>
  
  );
};

export default Header;