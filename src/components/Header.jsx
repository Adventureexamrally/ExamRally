import React, { useContext, useEffect, useState } from "react";
import logo from "../assets/logo/logo.png";
import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useUser,
} from "@clerk/clerk-react";
import CustomUserMenu from "./CustomUserButton";
import offerImage from "../assets/images/offer.png";
import Api from "../service/Api";
import { motion } from "framer-motion";
import { UserContext } from "../context/UserProvider";

const Header = () => {
  const { isSignedIn } = useUser();
  const [currentOffer, setCurrentOffer] = useState(null);
  const [countdown, setCountdown] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const response = await Api.get("offers/active");
        setCurrentOffer(response.data[0]);
        console.warn("Offer data:", response.data[0]);
      } catch (error) {
        console.error("Error fetching offer:", error);
      }
    };
    fetchOffer();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime((prev) => new Date(prev.getTime() + 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!currentOffer) return;

    const end = new Date(currentOffer.endDateTime);
    const start = new Date(currentOffer.startDateTime);
    const now = currentTime;

    if (now < start) {
      setCountdown("");
      return;
    }

    if (now > end) {
      setCountdown("");
      setCurrentOffer(null);
      return;
    }

    const timeDiff = end - now;
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
  }, [currentTime, currentOffer]);

  return (
    <header className="bg-white shadow-md">
      <div className="container-fluid mx-auto px-4 py-3 flex flex-wrap items-center justify-around">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Link to="/">
            <img src={logo} alt="Brand Logo" className="h-10 cursor-pointer" />
          </Link>
        </div>

        {/* Center search bar placeholder */}
        <div className="flex-1 max-w-md mx-auto hidden lg:block ">
          <div className="relative">
            {/* Future search bar placeholder */}
          </div>
        </div>

        {/* Offer and Telegram/Sign-In */}
        <div className="flex items-center space-x-4">
          {/* Always show Offer if it exists */}
          {currentOffer && (
            <Link
              to={currentOffer.offerLink}
              className="flex flex-col md:flex-row items-center lg:space-x-2"
            >
              <img
                src={currentOffer.imageUrl || offerImage}
                className="h-14 w-20 object-contain blink"
                alt={currentOffer.offerName}
              />
              <div className="text-center lg:text-left">
                <div className="d-flex">
                  <motion.span
                    animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1.2, 1] }}
                    transition={{
                      repeat: Infinity,
                      repeatType: "loop",
                      duration: 1,
                      ease: "easeInOut",
                      times: [0, 0.25, 0.75, 1],
                    }}
                    className="ml-2 text-blue-400 inline-block text-xl origin-center"
                  >
                    ✨
                  </motion.span>
                  <h1 className="text-green text-sm lg:text-lg font-semibold">
                    {currentOffer.offerName}
                  </h1>
                  <motion.span
                    animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1.2, 1] }}
                    transition={{
                      repeat: Infinity,
                      repeatType: "loop",
                      duration: 1,
                      ease: "easeInOut",
                      times: [0, 0.25, 0.75, 1],
                    }}
                    className="text-blue-400 inline-block text-xl origin-center"
                  >
                    ✨
                  </motion.span>
                </div>
                {countdown && (
                  <div className="bg-gradient-to-r from-purple-500 to-amber-600 p-0.5 rounded-lg animate-gradient-x">
                    <p className="text-white bg-[#131656] text-xs lg:text-sm px-3 py-1 rounded-[0.25rem] font-semibold text-center">
                      ⚡ Ends Soon: {countdown}
                    </p>
                  </div>
                )}
              </div>
            </Link>
          )}

          {/* Telegram & Sign-in */}
          <div className="hidden md:flex lg:flex items-center space-x-3">
            <Link
              to="https://t.me/examrally"
              target="_blank"
              className="flex items-center space-x-1 text-[#24A1DE]"
            >
              <i className="bi bi-telegram text-2xl"></i>
              <span>Join Telegram</span>
            </Link>

            <SignedOut>
              <SignInButton className="bg-[#000080] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
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
