import React, { useState, useRef, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { FaCog, FaSignOutAlt, FaUserCircle, FaChevronDown } from 'react-icons/fa';
import { Avatar } from '@mui/material';

const CustomUserMenu = () => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMenuItemClick = () => {
    setOpen(false);
  };

const handleSignOut = async () => {
  handleMenuItemClick();
  localStorage.clear(); // ✅ Clear all localStorage data
  await signOut();      // ✅ Ensure signOut waits until clear is done
};


  const handleOpenProfile = () => {
    handleMenuItemClick();
    openUserProfile();
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setOpen(!open)} 
        className="flex items-center space-x-2 focus:outline-none"
        aria-label="User menu"
        aria-expanded={open}
      >
        <span className="hidden md:inline-block font-medium text-gray-700">{user.firstName}</span>
        <div className="relative">
          <img 
            src={user.imageUrl} 
            alt="User avatar" 
            className="h-9 w-9 rounded-full border-2 border-white hover:border-blue-100 transition-all duration-200"
          />
      
        </div>
      </button>

      <div 
        className={`absolute right-0 mt-2 w-max bg-white rounded-lg shadow-xl z-50 overflow-hidden transition-all duration-200 origin-top-right ${open ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}
        style={{ transformOrigin: 'top right' }}
      >
        {open && (
          <>
            <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <Link 
                to="/profile" 
                onClick={handleMenuItemClick}
                className="hover:opacity-90 transition-opacity"
              >
                <Avatar
                  alt={user?.firstName}
                  src={user?.imageUrl}
                  sx={{ width: 50, height: 50 }}
                  className="border-2 border-white shadow-sm"
                />
              </Link>
              <div className="ml-3 overflow-hidden">
                <h1 className='text-md font-semibold text-gray-800 truncate'>
                  {user?.firstName + " " + user?.lastName}
                </h1>
                <p className='text-sm text-gray-600 truncate'>
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>

            <div className="py-1">
              <Link 
                to="/profile" 
                onClick={handleMenuItemClick}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-150"
              >
                <FaUserCircle className="mr-3 text-gray-500" />
                <span>My Profile</span>
              </Link>
              
              <button
                onClick={handleOpenProfile}
                className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-150"
              >
                <FaCog className="mr-3 text-gray-500" />
                <span>Manage Account</span>
              </button>
              
              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-150"
              >
                <FaSignOutAlt className="mr-3 text-gray-500" />
                <span>Sign Out</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomUserMenu;