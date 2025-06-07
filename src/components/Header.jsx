import React, { useEffect, useState } from 'react';
import logo from "../assets/logo/logo.png";
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/clerk-react";
import CustomUserMenu from './CustomUserButton';
import Api from '../service/Api';
import { motion } from 'framer-motion';
import PopupModal from './PopupModal';

const Header = () => {
  const { isSignedIn, isLoaded } = useUser();
  const [offer, setOffer] = useState(null);
  const [countdown, setCountdown] = useState("");
  const [showPopupModal, setShowPopupModal] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);

  // Fetch offer on mount
  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const response = await Api.get('offers');
        const activeOffer = response.data[0];
        if (activeOffer) {
          setOffer(activeOffer);
        }
      } catch (error) {
        console.error('Error fetching offer:', error);
      }
    };
    fetchOffer();
  }, []);

  // Update countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (!offer) return;

      const now = new Date();
      const start = new Date(offer.startDateTime);
      const end = new Date(offer.endDateTime);

      if (now < start || now > end) {
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
    }, 1000);

    return () => clearInterval(interval);
  }, [offer]);

  // Read popup state from localStorage on initial render
  useEffect(() => {
    console.log("Initial mount: Clerk loaded?", isLoaded, "Signed in?", isSignedIn);

    if (!isLoaded) return;

    const hasPopupBeenShown = localStorage.getItem('hasShownPopup');

    if (isSignedIn && hasPopupBeenShown !== 'true') {
      console.log("Showing popup for signed-in user");
      setShowPopupModal(true);
      localStorage.setItem('hasShownPopup', 'true');
    }
  }, [isSignedIn, isLoaded]);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between">

        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Link to="/">
            <img src={logo} alt="Brand Logo" className="h-10 cursor-pointer" />
          </Link>
        </div>

        {/* Search Bar */}
        <div className="hidden lg:flex flex-1 justify-center max-w-lg">
          <div className="relative w-full">
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

        {/* Offer or Telegram + Signin */}
        <div className="flex items-center space-x-4">
          {offer ? (
            <Link to={offer.offerLink} className="flex items-center space-x-2">
              <img src={offer.imageUrl} alt={offer.offerName} className="h-14 w-20 object-contain blink" />
              <div>
                <div className="flex items-center space-x-1">
                  <motion.span
                    animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="text-blue-400 text-xl"
                  >
                    ✨
                  </motion.span>
                  <span className="text-green-600 font-semibold text-sm lg:text-lg">
                    {offer.offerName}
                  </span>
                  <motion.span
                    animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="text-blue-400 text-xl"
                  >
                    ✨
                  </motion.span>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-amber-600 p-0.5 rounded-lg mt-1">
                  <p className="text-white bg-[#131656] text-xs lg:text-sm px-3 py-1 rounded font-semibold text-center">
                    ⚡ Ends Soon: {countdown}
                  </p>
                </div>
              </div>
            </Link>
          ) : (
            <Link to="https://t.me/examrally" className="flex items-center space-x-2 text-[#24A1DE]">
              <i className="bi bi-telegram text-2xl"></i>
              <span className="font-medium">Join Telegram</span>
            </Link>
          )}

          {/* Sign-in / User Menu */}
          <SignedOut>
            <SignInButton className="bg-[#000080] text-white py-2 px-4 rounded-lg shadow hover:bg-blue-900">
              Sign In
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <CustomUserMenu />
            {showPopupModal && <PopupModal onClose={() => setShowPopupModal(false)} />}
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Header;
