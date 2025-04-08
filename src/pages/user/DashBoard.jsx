import { Avatar } from '@mui/material';
import React, { useState } from 'react';
import { FaBook, FaCarAlt, FaClipboardList, FaGift, FaHistory, FaLaptop, FaReceipt, FaRegBookmark, FaShoppingBasket, FaShoppingCart, FaUser } from 'react-icons/fa';  // Import the FaUser icon
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import { FiMoreHorizontal, FiMoreVertical } from 'react-icons/fi';


const drawerWidth = 240;

export default function DashBoard({ handleDrawerToggle, open, setOpen }) {
  // State to track the active link
  const [activeLink, setActiveLink] = useState('profile');

  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
  };

  return (
    <div className="flex md:h-screen relative">

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 p-3 h-full w-72 shadow-lg bg-white transition-transform transform sm:relative sm:block ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 z-10`}
      >

        {/* Drawer content */}
        <div className="flex items-center justify-between p-4 sm:hidden">
          <button
            onClick={handleDrawerToggle}
            className="text-green-700 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className='flex items-center justify-start space-x-4 my-2 px-2'>
          {/* Profile Image and Link */}
          <div>
            <Link to="/profile">
              <Avatar alt="Kiruthika T" src="/user.jpeg" sx={{ width: 50, height: 50 }} />
            </Link>
          </div>

          {/* Profile Information */}
          <div>
            <h1 className='text-md font-semibold text-gray-800'>Kiruthika T</h1>
            <p className='text-sm text-gray-600'>kiruthi@gmail.com</p>
          </div>
        </div>

        {/* Divider */}
        <hr className='mx-4 my-4 border-gray-300' />
        <div className="space-y-2">
          {/* My Profile Link */}
          <Link
            to="/profile"
            onClick={() => handleLinkClick('profile')}
            className={`px-4 grid grid-cols-[50px,auto] border-1 hover:border-green-500 py-2 text-left relative w-full group ${activeLink === 'profile' ? 'text-green-500 border-green-500' : 'text-black hover:text-green-500'}`}
          >
            <FaUser className="m-1" /> My Profile
            <span className={`absolute bottom-0 left-0 w-0 h-[2px] bg-green-500 transition-all ${activeLink === 'profile' ? 'border-1 border-green-500 w-60' : 'group-hover:w-full'} `}></span>

          </Link>

          {/* Recent Test Result Link */}
          <Link
            to="/profile/recent-test-results"
            onClick={() => handleLinkClick('recent-test')}
            className={`px-4 grid grid-cols-[50px,auto] py-2 text-left border-1 hover:border-green-500 relative w-full group ${activeLink === 'recent-test' ? 'text-green-500 border-green-500' : 'text-black hover:text-green-500'}`}
          >
            <FaClipboardList className="m-1" /> Recent Test Result
            <span className={`absolute bottom-0 left-0 w-0 h-[2px] bg-green-500 transition-all ${activeLink === 'recent-test' ? 'border-1 border-green-500 w-60' : 'group-hover:w-full'} `}></span>

          </Link>



          {/* Purchase History Link */}
          <Link
            to="/profile/purchase-history"
            onClick={() => handleLinkClick('purchase-history')}
            className={`px-4 grid grid-cols-[50px,auto] py-2 text-left border-1 hover:border-green-500 relative w-full group ${activeLink === 'purchase-history' ? 'text-green-500 border-green-500' : 'text-black hover:text-green-500'}`}
          >
            <FaShoppingCart className="m-1" /> Purchase History
            <span className={`absolute bottom-0 left-0 w-0 h-[2px] bg-green-500 transition-all ${activeLink === 'purchase-history' ? 'border-1 border-green-500 w-60' : 'group-hover:w-full'} `}></span>
          </Link>

          {/* Order History Link */}
          <Link
            to="/profile/order-history"
            onClick={() => handleLinkClick('order-history')}
            className={`px-4 grid grid-cols-[50px,auto] py-2 text-left border-1 hover:border-green-500 relative w-full group ${activeLink === 'order-history' ? 'text-green-500 border-green-500' : 'text-black hover:text-green-500'}`}
          >
            <FaRegBookmark className="m-1" /> Order History
            <span className={`absolute bottom-0 left-0 w-0 h-[2px] bg-green-500 transition-all ${activeLink === 'order-history' ? 'border-1 border-green-500 w-60' : 'group-hover:w-full'} `}></span>
          </Link>

          {/* Refer and Earn Link */}
          <Link
            to="/profile/refer-and-earn"
            onClick={() => handleLinkClick('refer-and-earn')}
            className={`px-4 grid grid-cols-[50px,auto] py-2 text-left border-1 hover:border-green-500 relative w-full group ${activeLink === 'refer-and-earn' ? 'text-green-500 border-green-500' : 'text-black hover:text-green-500'}`}
          >
            <FaGift className="m-1" /> Refer and Earn
            <span className={`absolute bottom-0 left-0 w-0 h-[2px] bg-green-500 transition-all ${activeLink === 'refer-and-earn' ? 'border-1 border-green-500  w-60' : 'group-hover:w-full'} `}></span>
          </Link>

          {/* Active Devices and Browser Link */}
          <Link
            to="/profile/active-devices-browser"
            onClick={() => handleLinkClick('active-devices-browser')}
            className={`px-4 grid grid-cols-[50px,auto] py-2 text-left border-1 hover:border-green-500 relative w-full group ${activeLink === 'active-devices-browser' ? 'text-green-500 border-green-500' : 'text-black hover:text-green-500'}`}
          >
            <FaLaptop className="m-1" /> Active Devices & Browser
            <span className={`absolute bottom-0 left-0 w-0 h-[2px] bg-green-500 transition-all ${activeLink === 'active-devices-browser' ? 'border-1 border-green-500  w-60' : 'group-hover:w-full'} `}></span>
          </Link>
        </div>
      </div>

      {/* mobile view bar icon */}
      <div className="m-4 md:hidden w-full text-end">
        <button
          onClick={handleDrawerToggle}
          className="text-green-700 focus:outline-none"
        >
          <FiMoreVertical className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
