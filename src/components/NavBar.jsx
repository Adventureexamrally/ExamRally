import React, { useState } from "react";
import { Link } from "react-router-dom";
const NavBar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMenu = () => {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    };
  
    return (
      <nav className="bg-blue-600 text-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-4">
          {/* Logo */}
          <h1 className="text-2xl font-bold">Examrally</h1>
  
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/exams" className="hover:underline">Exams</Link>
            <Link to="/subscriptions" className="hover:underline">Subscriptions</Link>
            <Link to="/combo" className="hover:underline">Combo</Link>
            <Link to="/testseries" className="hover:underline">Test Series</Link>
            <Link to="/livebatch" className="hover:underline">Live Batch</Link>
            <Link to="/interviews" className="hover:underline">Interviews</Link>
            <Link to="/materials" className="hover:underline">Materials</Link>
            <Link to="/blogs" className="hover:underline">Blogs</Link>
          </nav>
  
          {/* "Get App" Button */}
          <button className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200">
            Get App
          </button>
  
          {/* Mobile Hamburger Menu */}
          <button onClick={toggleMenu} className="md:hidden text-white">
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
          <div className="md:hidden bg-blue-600 text-white py-4 space-y-4">
            <Link to="/" className="block px-4 py-2 hover:bg-blue-700">Home</Link>
            <Link to="/exams" className="block px-4 py-2 hover:bg-blue-700">Exams</Link>
            <Link to="/subscriptions" className="block px-4 py-2 hover:bg-blue-700">Subscriptions</Link>
            <Link to="/combo" className="block px-4 py-2 hover:bg-blue-700">Combo</Link>
            <Link to="/testseries" className="block px-4 py-2 hover:bg-blue-700">Test Series</Link>
            <Link to="/livebatch" className="block px-4 py-2 hover:bg-blue-700">Live Batch</Link>
            <Link to="/interviews" className="block px-4 py-2 hover:bg-blue-700">Interviews</Link>
            <Link to="/materials" className="block px-4 py-2 hover:bg-blue-700">Materials</Link>
            <Link to="/blogs" className="block px-4 py-2 hover:bg-blue-700">Blogs</Link>
          </div>
        )}
      </nav>
    );
};

export default NavBar;
