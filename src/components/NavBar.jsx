import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo/logo.webp";
import {
  SignIn,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  SignUp,
  useUser,
} from "@clerk/clerk-react";

import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Import the icons
import { Avatar } from "@mui/material";
import User from "./User";
import Api from "../service/Api";
import CustomUserMenu from "./CustomUserButton";

const NavBar = () => {
  const { isSignedIn, user, isLoaded } = useUser();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [packages, setPackages] = useState([]);

  const fetchPakages = async () => {
    try {
      const response = await Api.get("/packages/get/active");
      console.log("ji", response.data);
      setPackages(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPakages();
  }, []);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSubMenu = (index) => {
    setActiveSubMenu(activeSubMenu === index ? null : index);
  };

  useEffect(() => {
    const sendUserData = async () => {
      if (isLoaded && isSignedIn && user) {
        const userAlreadySynced = localStorage.getItem(
          `user_synced_${user.id}`
        );

        if (userAlreadySynced) {
          console.log("User already synced");
          return;
        }

        const userData = {
          userId: user.id,
          username: user.username || "N/A",
          firstName: user.firstName || "N/A",
          lastName: user.lastName || "N/A",
          email: user.primaryEmailAddress?.emailAddress || "N/A",
          phoneNumber: user.phoneNumbers?.[0]?.phoneNumber || "N/A",
          profilePicture: user.imageUrl,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          customFields: {
            address: user.publicMetadata?.address || "N/A",
            city: user.publicMetadata?.city || "N/A",
            state: user.publicMetadata?.state || "N/A",
            country: user.publicMetadata?.country || "N/A",
            postalCode: user.publicMetadata?.postalCode || "N/A",
            bio: user.publicMetadata?.bio || "N/A",
            dateOfBirth: user.publicMetadata?.dateOfBirth || "N/A",
          },
        };

        try {
          // Check if user is logging in or signing up
          if (userData.userId) {
            // If the user ID exists, it's a login, call the /auth/login endpoint
            await Api.post("/auth/login", userData); // Call login API here
            console.log("User logged in:", userData);
          } else {
            // If the user ID doesn't exist, it's a new signup, call /auth/signup
            await Api.post("/auth/signup", userData); // Call signup API here
            console.log("User signed up:", userData);
          }

          // Mark as synced so it doesn't re-send next time
          localStorage.setItem(`user_synced_${user.id}`, "true");
        } catch (error) {
          console.error("Error sending user data:", error);
        }
      }
    };

    sendUserData();
  }, [isLoaded, isSignedIn, user]);


  const [liveTests, setLiveTests] = useState([]);

  useEffect(() => {
    Api.get('exams/live-test')
      .then(response => {
        const filteredTests = response.data.liveTest.filter(test => test.livetest === true);
        setLiveTests(filteredTests);
      })
      .catch(error => {
        console.error('Error fetching live test data:', error);
      });
  }, []);

  return (
    <>
      <nav className="bg-green-600 text-white font-semibold shadow-md py-2 relative z-50">
        <div className="container mx-auto flex justify-between items-center px-4">
          {/* Logo */}

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex space-x-6">
            <Link
              to="/"
              className="hover:text-blue-600 transition duration-300 "
            >
              Home
            </Link>
            <div
              className="relative group"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => {
                setIsDropdownOpen(false);
                setActiveSubMenu(null);
              }}
            >
              <button className="flex items-center hover:text-blue-600 transition duration-300 text-white">
                Exams
                {isDropdownOpen ? (
                  <FaChevronUp className="ml-2 text-sm" />
                ) : (
                  <FaChevronDown className="ml-2 text-sm" />
                )}
              </button>

              {isDropdownOpen && (
                <div className="absolute -left-3 mt-0 p-4 bg-white shadow-lg rounded-lg w-56 z-50">
                  <div
                    className="relative group"
                    onMouseEnter={() => setActiveSubMenu(0)}
                    onMouseLeave={() => setActiveSubMenu(null)}
                  >
                    <Link
                      to="/subscriptions"
                      className="block px-4 py-2 text-black hover:bg-blue-100 hover:text-blue-600 transition duration-300"
                    >
                      Banking & Insurance
                    </Link>

                    {activeSubMenu === 0 && (
                      <div className="absolute left-full top-0 mt-0 bg-white shadow-lg rounded-lg w-48 z-50">
                        {packages.map((item, index) => (
                          <Link
                            key={index}
                            to={`/top-trending-exams/${item.link_name}`}
                            className="block px-4 py-2 text-black hover:bg-blue-100 hover:text-blue-600 transition duration-300"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                    <hr className="border-t border-gray-300" />
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/subscriptions"
              className="hover:text-blue-600 transition duration-300"
            >
              Test Series
            </Link>
            <Link
              to="/All-Packages"
              className="hover:text-blue-600 transition duration-300"
            >
              Packages
            </Link>
            <Link
              to="/free-pdf"
              className="hover:text-blue-600 transition duration-300"
            >
              Free PDF
            </Link>
            <Link
              to="/pdf-course"
              className="hover:text-blue-600 transition duration-300"
            >
              PDF Course
            </Link>
            <Link
              to="/blog"
              className="hover:text-blue-600 transition duration-300"
            >
              Blogs
            </Link>
            <Link
              to="/rally-pro"
              className="hover:text-blue-600 transition duration-300"
            >
              Rally Pro
            </Link>
            <Link
              to="/rally-super-pro"
              className="hover:text-blue-600 transition duration-300"
            >
              Rally Super Pro
            </Link>

            <Link
              to='/homelivetest'
              className="hover:text-blue-600 transition duration-300 flex items-center gap-1"
            >
              Live Test
              {liveTests.length > 0 && (
                <span className="ml-1 bg-[#7E57C2] text-white text-xs px-1 py-0.5 rounded-full animate-pulse">
                  New
                </span>
              )}
            </Link>



            {/* <Link
              to="/video-course"
              className="hover:text-blue-600 transition duration-300"
            >
              Video Course
            </Link> */}
            {/* <Link
              to="/blogs"
              className="hover:text-blue-600 transition duration-300"
            >
              Blogs
            </Link> */}
          </nav>

          {/* "Get App" Button */}
          <Link
            to="https://play.google.com/store/apps/details?id=io.examrally.in"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className=" text-white rounded hover:transform hover:scale-105 transition duration-300 flex items-center gap-3">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png"
                alt="Get it on Google Play"
                className="h-10 w-auto px-5"
              />
            </button>
          </Link>

          {/* <Link to="/profile"><Avatar alt="Remy Sharp" src="user.jpeg" /></Link>  */}
          {/* <User /> */}

          {/* Mobile Hamburger Menu */}
          <button onClick={toggleMenu} className="md:hidden text-white hover:text-green-100 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white text-slate-800 py-4 space-y-2 border-t border-green-500 absolute top-full left-0 w-full shadow-xl z-50 max-h-[90vh] overflow-y-auto">
            <Link
              to="/"
              className="block px-6 py-3 font-semibold hover:bg-green-50 hover:text-green-700 transition duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <div className="relative group z-50">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between w-full px-6 py-3 font-semibold hover:bg-green-50 hover:text-green-700 transition duration-300"
              >
                <span>Exams</span>
                {isDropdownOpen ? (
                  <FaChevronUp className="text-sm" />
                ) : (
                  <FaChevronDown className="text-sm" />
                )}
              </button>

              {isDropdownOpen && (
                <div className="bg-slate-50 py-2">
                  <Link
                    to="/subscriptions"
                    className="block px-8 py-2.5 text-sm font-medium text-slate-600 hover:text-green-700 hover:bg-green-100 transition duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Banking & Insurance
                  </Link>
                  {/* Add more sub-items here if needed, mirroring desktop */}
                </div>
              )}
            </div>

            <Link
              to="/subscriptions"
              className="block px-6 py-3 font-semibold hover:bg-green-50 hover:text-green-700 transition duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Test Series
            </Link>
            <Link
              to="/All-Packages"
              className="block px-6 py-3 font-semibold hover:bg-green-50 hover:text-green-700 transition duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Packages
            </Link>
            <Link
              to="/free-pdf"
              className="block px-6 py-3 font-semibold hover:bg-green-50 hover:text-green-700 transition duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Free PDF
            </Link>
            {/* <Link
              to="/pdf-course"
              className="block px-6 py-3 font-semibold hover:bg-green-50 hover:text-green-700 transition duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              PDF Course
            </Link> */}
            <Link
              to="/blog"
              className="block px-6 py-3 font-semibold hover:bg-green-50 hover:text-green-700 transition duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blogs
            </Link>
            {/* <Link
              to="/rally-pro"
              className="block px-6 py-3 font-semibold hover:bg-green-50 hover:text-green-700 transition duration-300"
               onClick={() => setIsMobileMenuOpen(false)}
            >
              Rally Pro
            </Link> */}
            {/* <Link
              to="/rally-super-pro"
              className="block px-6 py-3 font-semibold hover:bg-green-50 hover:text-green-700 transition duration-300"
               onClick={() => setIsMobileMenuOpen(false)}
            >
              Rally Super Pro
            </Link> */}

            <Link
              to='/homelivetest'
              className="px-6 py-3 font-semibold hover:bg-green-50 hover:text-green-700 transition duration-300 flex items-center justify-between"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>Live Test</span>
              {liveTests.length > 0 && (
                <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">New</span>
              )}
            </Link>

            <div className="border-t border-slate-100 pt-4 pb-2 px-6 space-y-4">
              <div className="flex flex-col gap-3">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="w-full bg-green-600 text-white font-bold py-3 rounded-xl shadow-md hover:bg-green-700 transition-colors">Sign In</button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <div className="w-full flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                    <span className="font-bold text-slate-700 truncate mr-2">{user?.firstName}</span>
                    <CustomUserMenu />
                  </div>
                </SignedIn>
              </div>

              <Link target="_blank" to="https://t.me/examrally" className="flex items-center justify-center gap-2 w-full bg-[#24A1DE]/10 text-[#24A1DE] font-bold py-3 rounded-xl hover:bg-[#24A1DE]/20 transition-colors">
                <i className="bi bi-telegram text-xl"></i>
                Join Telegram
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default NavBar;
