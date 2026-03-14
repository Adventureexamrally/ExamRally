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
  useClerk,
} from "@clerk/clerk-react";

import { FaChevronDown, FaChevronUp, FaChevronRight } from "react-icons/fa"; // Import the icons
import { Avatar } from "@mui/material";
import User from "./User";
import Api from "../service/Api";
import CustomUserMenu from "./CustomUserButton";

const NavBar = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [bannedModalVisible, setBannedModalVisible] = useState(false);

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

  // Capture referral code from URL (?ref=CODE) as soon as possible
  useEffect(() => {
    const urlRef = new URLSearchParams(window.location.search).get("ref");
    if (urlRef) {
      console.log("Captured referral code from URL:", urlRef);
      sessionStorage.setItem("referralCode", urlRef);
    }
  }, []);

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
          referralCode: sessionStorage.getItem("referralCode") || undefined,
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

          localStorage.setItem(`user_synced_${user.id}`, "true");
          // Clear referral code from session after successful sync
          sessionStorage.removeItem("referralCode");
        } catch (error) {
          console.error("Error sending user data:", error);
          if (error.response && error.response.status === 403) {
            setBannedModalVisible(true);
            signOut();
          }
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
      {/* Banned User Modal */}
      {bannedModalVisible && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 99999,
        }}>
          <div style={{
            background: '#fff', borderRadius: '16px', padding: '40px 32px',
            maxWidth: '420px', width: '90%', textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>🚫</div>
            <h2 style={{ color: '#ef4444', margin: '0 0 12px', fontSize: '24px', fontWeight: 700 }}>
              Account Suspended
            </h2>
            <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.6', margin: '0 0 28px' }}>
              Your account has been banned.<br />
              Please contact the administrator for assistance.
            </p>
            <button
              onClick={() => setBannedModalVisible(false)}
              style={{
                backgroundColor: '#ef4444', color: '#fff',
                border: 'none', borderRadius: '8px',
                padding: '12px 32px', fontSize: '15px',
                fontWeight: 600, cursor: 'pointer', width: '100%',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <nav className="bg-green-600 text-white font-semibold shadow-md relative z-30 border-t border-green-500/30">
        <div className="max-w-[1440px] mx-auto flex justify-between items-center px-4 sm:px-6 h-12 lg:h-14">
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-4 xl:gap-8 text-sm xl:text-[15px] whitespace-nowrap h-full">
            <Link
              to="/"
              className="hover:text-green-100 transition duration-300 h-full flex items-center px-1 border-b-2 border-transparent hover:border-white/30"
            >
              Home
            </Link>
            <div
              className="relative group h-full flex items-center"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => {
                setIsDropdownOpen(false);
                setActiveSubMenu(null);
              }}
            >
              <button className="flex items-center hover:text-green-100 transition duration-300 text-white h-full px-1 border-b-2 border-transparent group-hover:border-white/30">
                Exams
                <FaChevronDown className={`ml-2 text-[10px] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full -left-4 p-4 bg-white shadow-xl rounded-b-xl w-64 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div
                    className="relative group"
                    onMouseEnter={() => setActiveSubMenu(0)}
                    onMouseLeave={() => setActiveSubMenu(null)}
                  >
                    <Link
                      to="/subscriptions"
                      className="flex items-center justify-between px-4 py-3 text-slate-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-all font-bold"
                    >
                      Banking & Insurance
                      <FaChevronRight className="text-[10px] opacity-30" />
                    </Link>

                    {activeSubMenu === 0 && (
                      <div className="absolute left-full top-0 ml-1 bg-white shadow-xl rounded-xl w-56 z-50 py-2 border border-slate-50 animate-in fade-in slide-in-from-left-2 duration-200">
                        {packages.map((item, index) => (
                          <Link
                            key={index}
                            to={`/top-trending-exams/${item.link_name}`}
                            className="block px-5 py-2.5 text-slate-600 hover:bg-green-50 hover:text-green-700 transition-colors text-sm font-medium"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/subscriptions"
              className="hover:text-green-100 transition duration-300 h-full flex items-center px-1 border-b-2 border-transparent hover:border-white/30"
            >
              Test Series
            </Link>
            <Link
              to="/All-Packages"
              className="hover:text-green-100 transition duration-300 h-full flex items-center px-1 border-b-2 border-transparent hover:border-white/30"
            >
              Packages
            </Link>
            <Link
              to="/free-pdf"
              className="hover:text-green-100 transition duration-300 h-full flex items-center px-1 border-b-2 border-transparent hover:border-white/30"
            >
              Free PDF
            </Link>
            <Link
              to="/pdf-course"
              className="hover:text-green-100 transition duration-300 h-full flex items-center px-1 border-b-2 border-transparent hover:border-white/30"
            >
              PDF Course
            </Link>
            <Link
              to="/video-course"
              className="hover:text-green-100 transition duration-300 h-full flex items-center px-1 border-b-2 border-transparent hover:border-white/30"
            >
              Video Course
            </Link>
            <Link
              to="/blog"
              className="hover:text-green-100 transition duration-300 h-full flex items-center px-1 border-b-2 border-transparent hover:border-white/30"
            >
              Blogs
            </Link>
            <Link
              to="/rally-pro"
              className="hover:text-green-100 transition duration-300 h-full flex items-center px-1 border-b-2 border-transparent hover:border-white/30"
            >
              Rally Pro
            </Link>
            <Link
              to="/rally-super-pro"
              className="hover:text-green-100 transition duration-300 h-full flex items-center px-1 border-b-2 border-transparent hover:border-white/30"
            >
              Rally Super Pro
            </Link>

            <Link
              to='/homelivetest'
              className="hover:text-green-100 transition duration-300 h-full flex items-center px-1 border-b-2 border-transparent hover:border-white/30 gap-1.5"
            >
              Live Test
              {liveTests.length > 0 && (
                <span className="bg-white text-green-700 text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider animate-pulse">
                  Live
                </span>
              )}
            </Link>
            <Link
              to="/forum"
              className="hover:text-green-100 transition duration-300 h-full flex items-center px-1 border-b-2 border-transparent hover:border-white/30"
            >
              Forum
            </Link>
          </nav>

          {/* "Get App" Button */}
          <Link
            to="https://play.google.com/store/apps/details?id=io.examrally.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png"
              alt="Get it on Google Play"
              className="h-8 w-auto hover:brightness-110 transition-all active:scale-95"
            />
          </Link>

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
            <Link
              to="/pdf-course"
              className="block px-6 py-3 font-semibold hover:bg-green-50 hover:text-green-700 transition duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              PDF Course
            </Link>
            <Link
              to="/video-course"
              className="block px-6 py-3 font-semibold hover:bg-green-50 hover:text-green-700 transition duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Video Course
            </Link>
            <Link
              to="/blog"
              className="block px-6 py-3 font-semibold hover:bg-green-50 hover:text-green-700 transition duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blogs
            </Link>

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
            <Link
            to="/forum"
            className="block px-6 py-3 font-semibold hover:bg-green-50 hover:text-green-700 transition duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
            >
              Forum
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
