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
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-4">
        <div className="flex-shrink-0">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Brand Logo" className="h-9 lg:h-11 w-auto object-contain transition-transform hover:scale-105" />
          </Link>
        </div>

        {/* Center Section (Offer) */}
        <div className="flex-grow flex justify-center overflow-hidden">

          {currentOffer && (
            <Link
              to={currentOffer.offerLink}
              className="flex items-center gap-3 bg-slate-50/80 px-4 py-1.5 rounded-2xl border border-slate-100/50 hover:bg-slate-100 transition-colors max-w-full"
            >
              <img
                src={currentOffer.imageUrl || offerImage}
                className="h-10 w-auto object-contain hidden sm:block"
                alt={currentOffer.offerName}
              />
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 shrink-0">
                <div className="flex items-center gap-1">
                  <motion.span
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-blue-400 text-lg hidden lg:inline"
                  >
                    ✨
                  </motion.span>
                  <h1 className="text-slate-800 text-xs lg:text-sm font-bold truncate max-w-[150px] lg:max-w-none">
                    {currentOffer.offerName}
                  </h1>
                </div>

                {countdown && (
                  <div className="flex items-center bg-[#131656] text-white text-[10px] lg:text-xs px-2.5 py-1 rounded-lg font-bold whitespace-nowrap gap-1.5 shadow-sm shadow-blue-900/20">
                    <span className="text-amber-400 animate-pulse">⚡</span>
                    {countdown}
                  </div>
                )}
              </div>
            </Link>
          )}
        </div>

        {/* Telegram & Sign-in (Right) */}
        <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0 text-sm font-semibold">
          <Link
            to="https://t.me/examrally"
            target="_blank"
            className="hidden md:flex items-center gap-2 text-[#24A1DE] hover:text-[#1a8bc4] transition-colors"
          >
            <i className="bi bi-telegram text-xl"></i>
            <span className="hidden lg:inline">Join Telegram</span>
          </Link>

          <div className="h-8 w-[1px] bg-slate-100 hidden md:block"></div>

          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-[#000080] text-white py-2 px-5 rounded-xl hover:bg-[#000066] transition-all shadow-md shadow-blue-900/10 hover:-translate-y-0.5 whitespace-nowrap">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 hidden sm:inline">Hi,</span>
                <CustomUserMenu />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
