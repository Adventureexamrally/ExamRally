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
      <nav className="bg-green-600 text-white font-semibold shadow-md py-2">
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
            {/* <Link
              to="/pdf-course"
              className="hover:text-blue-600 transition duration-300"
            >
              PDF Course
            </Link> */}
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

      {/* <Link
      to='/homelivetest'
      className="hover:text-blue-600 transition duration-300"
    >
      Live Test 
    </Link>
       {liveTests.length > 0 && (
    <span className=" text-xs text-[#131656] rounded blink">New</span>
  )} */}

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
          <button onClick={toggleMenu} className="md:hidden text-black">
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
          <div className="md:hidden bg-green-200 text-black py-4 space-y-4">
            <Link
              to="/"
              className="block px-4 py-2 hover:bg-blue-700 hover:text-white transition duration-300"
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
              <button className="flex px-4 py-2 w-full hover:bg-blue-700 hover:text-white transition duration-300">
                Exams
                {isDropdownOpen ? (
                  <FaChevronUp className="ml-2 mt-2 text-sm" />
                ) : (
                  <FaChevronDown className="ml-2 mt-2 text-sm" />
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
                      className="block px-4 py-2 w-full text-black hover:bg-blue-100 hover:text-blue-600 transition duration-300"
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
              className="block px-4 py-2 hover:bg-blue-700 hover:text-white transition duration-300"
            >
              Test Series
            </Link>
            <Link
              to="/All-Packages"
              className="block px-4 py-2 hover:bg-blue-700 hover:text-white transition duration-300"
            >
              Packages
            </Link>
            <Link
              to="/free-pdf"
              className="block px-4 py-2 hover:bg-blue-700 hover:text-white transition duration-300"
            >
              Free PDF
            </Link>
            {/* <Link
              to="/pdf-course"
              className="block px-4 py-2 hover:bg-blue-700 hover:text-white transition duration-300"
            >
              PDF Course
            </Link> */}
            <Link
              to="/blog"
              className="block px-4 py-2 hover:bg-blue-700 hover:text-white transition duration-300"
            >
              Blogs
            </Link>
            <Link
              to="/rally-pro"
              className="block px-4 py-2 hover:bg-blue-700 hover:text-white transition duration-300"
            >
              Rally Pro
            </Link>
            <Link
              to="/rally-super-pro"
              className="block px-4 py-2 hover:bg-blue-700 hover:text-white transition duration-300"
            >
              Rally Super Pro
            </Link>

      {/* <Link
      to='/homelivetest'
      className="block px-4 py-2 transition duration-300 flex items-center gap-2 hover:bg-blue-700 hover:text-white"
    >
      Live Test 

         {liveTests.length > 0 && (
    <span className=" text-xs text-[#131656] rounded blink hover:text-white">New</span>
  )}
      </Link> */}

            {/* <Link
              to="/video-course"
              className="block px-4 py-2 hover:bg-blue-700 hover:text-white transition duration-300"
            >
              Video Course
            </Link> */}

            {/* <Link
              to="/blogs"
              className="block px-4 py-2 hover:bg-blue-700 hover:text-white transition duration-300"
            >
              Blogs
            </Link> */}
            <hr />
            {/* Login/Register Buttons in Mobile Menu */}
            <div className="flex flex-col space-y-2 px-4">
              {/* <button
              type="button"
              className="w-full px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition"
            >
              Login
            </button>
            <button
              type="button"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Register
            </button> */}

              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                {/* <UserButton /> */}
                <CustomUserMenu />
              </SignedIn>
              <p>{!user ? "" : user.firstName}</p>
              <Link target="_blank" to="https://t.me/examrally">
                {" "}
                <i
                  className="bi bi-telegram text-2xl"
                  style={{ color: "	#24A1DE" }}
                >
                  {" "}
                </i>
                Join Telegram{" "}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default NavBar;
