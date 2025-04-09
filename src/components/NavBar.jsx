import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo/logo.webp";
import { SignIn, SignedIn, SignedOut, SignInButton, UserButton, SignUp,useUser } from "@clerk/clerk-react";

import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Import the icons

const NavBar = () => {
  const {isSignedIn, user, isLoaded } = useUser();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSubMenu = (index) => {
    setActiveSubMenu(activeSubMenu === index ? null : index);
  };

  return (
    <>

      <nav className="bg-green-600 text-white py-1 font-semibold shadow-md">
        <div className="container mx-auto flex justify-between items-center px-4">
          {/* Logo */}


          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-blue-600 transition duration-300 ">
              Home
            </Link>
            <div
              className="relative group"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button
                onClick={toggleDropdown}
                className="flex items-center hover:text-blue-600 transition duration-300 text-white"
              >
                Exams
                {isDropdownOpen ? (
                  <FaChevronUp className="ml-2 text-sm" />
                ) : (
                  <FaChevronDown className="ml-2 text-sm" />
                )}
              </button>
              {isDropdownOpen && (
                <div className="absolute -left-3 mt-0 p-4 bg-white shadow-lg rounded-lg w-56 z-50">
                  {["Banking & Insurance", "SSC",  "Railway"].map(
                    (item, index) => (
                      <div key={index} className="relative group">
                        <Link
                          to={`/${item.toLowerCase().replace(/ /g, "-")}`}
                          className="block px-4 py-2 text-black hover:bg-blue-100 hover:text-blue-600 transition duration-300"
                          onMouseEnter={() => handleSubMenu(index)}
                          onMouseLeave={() => handleSubMenu(null)}
                        >
                          {item}
                        </Link>
                        {activeSubMenu === index && (
                          <div className="absolute left-full top-0 mt-0 bg-white shadow-lg rounded-lg w-48">
                            <Link
                              to={`/${item.toLowerCase()}-sub1`}
                              className="block px-4 py-2 text-black hover:bg-blue-100 hover:text-blue-600 transition duration-300"
                            >
                              Sub 1
                            </Link>
                            <Link
                              to={`/${item.toLowerCase()}-sub2`}
                              className="block px-4 py-2 text-black hover:bg-blue-100 hover:text-blue-600 transition duration-300"
                            >
                              Sub 2
                            </Link>
                          </div>
                        )}
                        <hr className="border-t border-gray-300" />
                      </div>
                    )
                  )}
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
              to="/combo"
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
              to="/blogs"
              className="hover:text-blue-600 transition duration-300"
            >
              Blogs
            </Link> */}
          </nav>

          {/* "Get App" Button */}
          <button className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-600 hover:text-white transition duration-300">
            Get App
          </button>

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
            <Link
              to="/exams"
              className="block px-4 py-2 hover:bg-blue-700 hover:text-white transition duration-300"
            >
              Exams
            </Link>
            <Link
              to="/subscriptions"
              className="block px-4 py-2 hover:bg-blue-700 hover:text-white transition duration-300"
            >
              Test Series
            </Link>
            <Link
              to="/combo"
              className="block px-4 py-2 hover:bg-blue-700 hover:text-white transition duration-300"
            >
              Free Mock Test
            </Link>
            <Link
              to="/free-pdf"
              className="block px-4 py-2 hover:bg-blue-700 hover:text-white transition duration-300"
            >
              Free PDF
            </Link>
            <Link
              to="/livebatch"
              className="block px-4 py-2 hover:bg-blue-700 hover:text-white transition duration-300"
            >
             Blogs
            </Link>
            <Link
              to="/interviews"
              className="block px-4 py-2 hover:bg-blue-700 hover:text-white transition duration-300"
            >
              Rally Pro
            </Link>
            <Link
              to="/materials"
              className="block px-4 py-2 hover:bg-blue-700 hover:text-white transition duration-300"
            >
             Rally Lifetime
            </Link>
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
                <UserButton />
              </SignedIn>
              <p>{!user ? "":user.firstName}</p>
              <p className=''>  Join Telegram
           </p>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default NavBar;
