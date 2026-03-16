import React from 'react';
import { FaCompress, FaExpand } from 'react-icons/fa';

const ExamHeader = ({
    logo,
    show_name,
    timeminus,
    formatTime,
    isFullscreen,
    toggleFullScreen,
    toggleMenu
}) => {
    return (
        <div className="bg-[#3476bb] text-white w-full flex justify-between items-center px-4 py-2 shadow-sm">
            {/* Left Section: Logo & Show Name */}
            <div className="flex items-center gap-3">
                <img
                    src={logo}
                    alt="logo"
                    className="h-10 w-auto bg-white rounded p-0.5"
                />
                <h1 className="font-bold text-base md:text-xl truncate max-w-[150px] md:max-w-none">
                    {show_name}
                </h1>
            </div>

            {/* Right Section: Time & Fullscreen Controls */}
            <div className="flex items-center gap-3 md:gap-4">
                {/* Refined Time Display */}
                <div className="flex items-center gap-2 bg-gray-100 text-slate-800 px-3 py-1.5 rounded-md shadow-inner">
                    <span className="text-xs md:text-sm font-semibold uppercase tracking-wide text-slate-500 hidden sm:inline">
                        Time Left:
                    </span>
                    <span className="text-sm md:text-base font-bold font-mono">
                        {formatTime(timeminus)}
                    </span>
                </div>

                {/* Fullscreen Toggle Button */}
                <button
                    onClick={toggleFullScreen}
                    className="bg-white/20 hover:bg-white/30 transition-colors p-2 rounded-full cursor-pointer text-white flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/50"
                    aria-label="Toggle Fullscreen"
                    title="Toggle Fullscreen"
                >
                    {isFullscreen ? <FaCompress size={16} /> : <FaExpand size={16} />}
                </button>

                {/* Mobile Menu Toggle Button */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden bg-white/20 hover:bg-white/30 transition-colors p-2 rounded-md text-white flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/50"
                    aria-label="Toggle Question Palette"
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
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ExamHeader;
