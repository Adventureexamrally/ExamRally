import React from "react";
import sbi from "../assets/logo/sbi.png";
import ibps from "../assets/logo/ibps.png";
import CalculateIcon from "@mui/icons-material/Calculate";
import PsychologyIcon from "@mui/icons-material/Psychology";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PublicIcon from "@mui/icons-material/Public";
import ComputerIcon from "@mui/icons-material/Computer";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
// import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SpeedIcon from "@mui/icons-material/Speed";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import QuizIcon from "@mui/icons-material/Quiz";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import EventNoteIcon from "@mui/icons-material/EventNote";
import StarIcon from "@mui/icons-material/Star";
import DiamondIcon from "@mui/icons-material/Diamond";
import CelebrationIcon from "@mui/icons-material/Celebration";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ForumIcon from "@mui/icons-material/Forum";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { Link } from "react-router-dom";
import Banner from "./Banner";

const Dashboard = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-4">
      {/* Trending Links */}
      <div className="mb-4 overflow-hidden">
        <div className="whitespace-nowrap animate-scroll text-sm text-blue-600 flex gap-8">
          <a href="#" className="hover:underline">Clerk Notification</a>
          <a href="#" className="hover:underline">SBI JA Previous Year Cut-off</a>
          <a href="#" className="hover:underline">Descriptive Writing Mock Test</a>
          <a href="#" className="hover:underline">Current Affairs</a>
        </div>
      </div>
      <Banner />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Topic Test */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold text-lg mb-3">Topic Test</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-orange-100 p-2 rounded text-center hover:scale-105 transition-all">
              <CalculateIcon fontSize="large" className="text-orange-600" />
              <a href="#" className="block mt-2">Quantitative Aptitude</a>
            </div>
            <div className="bg-purple-100 p-2 rounded text-center hover:scale-105 transition-all">
              <PsychologyIcon fontSize="large" className="text-purple-600" />
              <Link to="/mocktest" className="block mt-2">Reasoning Ability</Link>
            </div>
            <div className="bg-pink-100 p-2 rounded text-center hover:scale-105 transition-all">
              <MenuBookIcon fontSize="large" className="text-pink-600" />
              <a href="#" className="block mt-2">English Language</a>
            </div>
            <div className="bg-teal-100 p-2 rounded text-center hover:scale-105 transition-all">
              <PublicIcon fontSize="large" className="text-teal-600" />
              <a href="#" className="block mt-2">Current Affairs</a>
            </div>
            <div className="bg-green-100 p-2 rounded text-center hover:scale-105 transition-all">
              <ComputerIcon fontSize="large" className="text-green-600" />
              <a href="#" className="block mt-2">Computer Awareness</a>
            </div>
            <div className="bg-red-100 p-2 rounded text-center hover:scale-105 transition-all">
              <AccountBalanceIcon fontSize="large" className="text-red-600" />
              <a href="#" className="block mt-2">Banking Awareness</a>
            </div>
            <div className="bg-gray-100 p-2 rounded text-center hover:scale-105 transition-all">
              <LibraryBooksIcon fontSize="large" className="text-gray-600" />
              <a href="#" className="block mt-2">Static GK</a>
            </div>
            <div className="bg-yellow-100 p-2 rounded text-center hover:scale-105 transition-all">
              <QuizIcon fontSize="large" className="text-yellow-600" />
              <a href="#" className="block mt-2">Insurance Awareness</a>
            </div>
          </div>
        </div>

        {/* Special Mock Test */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold text-lg mb-3">Special Mock Test</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-indigo-100 p-2 rounded text-center hover:scale-105 transition-all">
              <SpeedIcon fontSize="large" className="text-indigo-600" />
              <a href="#" className="block mt-2">Previous Year Papers</a>
            </div>
            <div className="bg-gray-100 p-2 rounded text-center hover:scale-105 transition-all">
              <HelpOutlineIcon fontSize="large" className="text-gray-600" />
              <a href="#" className="block mt-2">Tough Reasoning Sets</a>
            </div>
            <div className="bg-yellow-100 p-2 rounded text-center hover:scale-105 transition-all">
              <EventNoteIcon fontSize="large" className="text-yellow-600" />
              <a href="#" className="block mt-2">Tough English Sets</a>
            </div>
            <div className="bg-red-100 p-2 rounded text-center hover:scale-105 transition-all">
              <PictureAsPdfIcon fontSize="large" className="text-red-600" />
              <a href="#" className="block mt-2">Descriptive Test</a>
            </div>
            <div className="bg-blue-100 p-2 rounded text-center hover:scale-105 transition-all">
              <LibraryBooksIcon fontSize="large" className="text-blue-600" />
              <a href="#" className="block mt-2">Critical Reasoning</a>
            </div>
          </div>
        </div>

        {/* Others */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold text-lg mb-3">Others</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-blue-100 p-2 rounded text-center hover:scale-105 transition-all">
              <StarIcon fontSize="large" className="text-blue-600" />
              <a href="#" className="block mt-2">Hindu Editorial</a>
            </div>
            <div className="bg-purple-100 p-2 rounded text-center hover:scale-105 transition-all">
              <DiamondIcon fontSize="large" className="text-purple-600" />
              <a href="#" className="block mt-2">Interview Prep</a>
            </div>
            <div className="bg-pink-100 p-2 rounded text-center hover:scale-105 transition-all">
              <CelebrationIcon fontSize="large" className="text-pink-600" />
              <a href="#" className="block mt-2">Success Stories</a>
            </div>
            <div className="bg-pink-100 p-2 rounded text-center hover:scale-105 transition-all">
              <EmojiEventsIcon fontSize="large" className="text-pink-600" />
              <a href="#" className="block mt-2">Special Mocks</a>
            </div>
            <div className="bg-gray-100 p-2 rounded text-center hover:scale-105 transition-all">
              <ForumIcon fontSize="large" className="text-gray-600" />
              <a href="#" className="block mt-2">GD</a>
            </div>
            <div className="bg-gray-100 p-2 rounded text-center hover:scale-105 transition-all">
              <MailOutlineIcon fontSize="large" className="text-gray-600" />
              <a href="#" className="block mt-2">Email & Precis Writing</a>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Exams */}
      <div className="bg-white p-4 rounded shadow mt-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg">Top Trending Exams</h3>
          <a href="#" className="text-blue-600 hover:underline">View More</a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          <div className="bg-blue-100 p-4 rounded flex flex-col items-center hover:scale-105 transition-all">
            <img
              src={sbi}
              alt="SBI Logo"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-2"
            />
            <p className="font-medium">RRB PO</p>
          </div>
          <div className="bg-blue-100 p-4 rounded flex flex-col items-center hover:scale-105 transition-all">
            <img
              src={ibps}
              alt="IBPS Logo"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-2"
            />
            <p className="font-medium">IBPS Clerk</p>
          </div>
          <div className="bg-blue-100 p-4 rounded flex flex-col items-center hover:scale-105 transition-all">
            <img
              src={sbi}
              alt="SBI Clerk"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-2"
            />
            <p className="font-medium">SBI Clerk</p>
          </div>
          <div className="bg-blue-100 p-4 rounded flex flex-col items-center hover:scale-105 transition-all">
            <img
              src={ibps}
              alt="IBPS PO"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-2"
            />
            <p className="font-medium">SBI PO</p>
          </div>
        </div>
      </div>

      {/* Promotional Banner */}
      <div className="mt-4">
        <div className="bg-gradient-to-r from-purple-700 via-purple-500 to-purple-700 text-white p-6 rounded shadow text-center">
          <h2 className="text-3xl font-bold mb-3">
            <CelebrationIcon className="mr-2" fontSize="large" /> New Year Special Offer
          </h2>
          <p className="text-lg">GA Hustle Batch by Aditya Sir</p>
          <p className="mt-1">Complete Banking Awareness & Current Affairs Batch</p>
          <p className="mt-3 text-yellow-300 font-bold text-2xl">
            ₹539 <span className="text-sm text-white">with code NEWYEAR</span>
          </p>
          <button className="mt-3 bg-yellow-400 hover:bg-yellow-500 text-black py-2 px-4 rounded">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
