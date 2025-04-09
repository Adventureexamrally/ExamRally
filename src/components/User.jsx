import { Avatar } from '@mui/material';
import React, { useState } from 'react';
import { FaUserCircle, FaCog, FaSignOutAlt } from 'react-icons/fa'; // You can use icons like these
import { Link } from 'react-router-dom';

const User = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        // Implement logout logic here
        alert('Logged out');
    };

    return (
        <>
            {/* Profile Button */}
            < div className="relative" >
                <button
                    onClick={toggleDropdown}
                    className="text-white flex items-center space-x-2 hover:bg-green-700 p-2 rounded-full"
                >
                    {/* <FaUserCircle size={24} /> Profile icon */}
                    <Avatar alt="Remy Sharp" src="/user.jpeg" />
                </button>

                {/* Dropdown Menu */}
                {
                    isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10">
                            <ul>
                                <li>
                                    <Link
                                    to="/profile"
                                        className="block px-4 py-2 text-gray-700 hover:bg-green-100"
                                    >
                                        <FaUserCircle className="inline-block mr-2" />
                                        View Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/settings"
                                        className="block px-4 py-2 text-gray-700 hover:bg-green-100"
                                    >
                                        <FaCog className="inline-block mr-2" />
                                        Settings
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-100"
                                    >
                                        <FaSignOutAlt className="inline-block mr-2" />
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )
                }
            </div >

        </>
    );
};

export default User;
