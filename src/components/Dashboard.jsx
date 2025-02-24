import React from "react";
import sbi from "../assets/logo/sbi.png";
import ibps from "../assets/logo/ibps.png";
import rrb from "../assets/logo/rrb.png"
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
import { RiRobotFill } from "react-icons/ri";

const Dashboard = () => {
  const exams = [
    { name: "RRB PO", image: ibps,link:"rrb-po" },
    { name: "RRB Clerk", image: ibps,link:"rrb-clerk" },
    { name: "IBPS Clerk", image: ibps,link:"ibps-clerk" },
    { name: "IBPS PO", image: ibps,link:"ibps-po" },
    { name: "SBI Clerk", image: sbi,link:"sbi-clerk" },
    { name: "SBI PO", image: sbi,link:"sbi-po" },
  ];
  
  return (
    <div className="bg-gray-100 min-h-screen p-2">
      {/* Trending Links */}
      <div className="mb-1 overflow-hidden">
        <div className="whitespace-nowrap animate-scroll text-sm text-blue-600 flex gap-8">
          <Link to="#" className="hover:underline">Clerk Notification</Link>
          <Link to="#" className="hover:underline">SBI JA Previous Year Cut-off</Link>
          <Link to="#" className="hover:underline">Descriptive Writing Mock Test</Link>
          <Link to="#" className="hover:underline">Current Affairs</Link>
        </div>
      </div>
{/* 
      <div className="h-[30vh] w-full overflow-hidden rounded mb-4">
        <Banner />
      </div> */}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="col-span-full" >
      <Banner  />
      </div>
        {/* Topic Test */}
        <div className="bg-white p-4 rounded-2xl shadow-lg">
          <h3 className="font-bold text-lg mb-3">Topic Test</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            <div className="bg-orange-100 p-3 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <CalculateIcon fontSize="large" className="text-orange-600" />
              <Link to="/quantitativeapti" className="text-sm font-medium text-gray-700">Quantitative Aptitude</Link>
            </div>
            <div className="bg-purple-100 p-3 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <PsychologyIcon fontSize="large" className="text-purple-600" />
              <Link to="/reasoningability" className="text-sm font-medium text-gray-700">Reasoning Ability</Link>
            </div>
            <div className="bg-pink-100 p-3 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <MenuBookIcon fontSize="large" className="text-pink-600" />
              <Link to="/englishlang" className="text-sm font-medium text-gray-700">English Language</Link>
            </div>
            <div className="bg-teal-100 p-3 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <PublicIcon fontSize="large" className="text-teal-600" />
              <Link to="/currentaffairs" className="text-sm font-medium text-gray-700">Current Affairs</Link>
            </div>
            <div className="bg-green-100 p-3 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <ComputerIcon fontSize="large" className="text-green-600" />
              <Link to="/computerawarness" className="text-sm font-medium text-gray-700">Computer Awareness</Link>
            </div>
            <div className="bg-red-100 p-3 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <AccountBalanceIcon fontSize="large" className="text-red-600" />
              <Link to="/bankingawarness" className="text-sm font-medium text-gray-700">Banking Awareness</Link>
            </div>
            <div className="bg-gray-100 p-3 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <LibraryBooksIcon fontSize="large" className="text-gray-600" />
              <Link to="/staticgk" className="text-sm font-medium text-gray-700">Static GK</Link>
            </div>
            <div className="bg-yellow-100 p-3 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <QuizIcon fontSize="large" className="text-yellow-600" />
              <Link to="/insuranceawarness" className="text-sm font-medium text-gray-700">Insurance Awareness</Link>
            </div>
          </div>
        </div>

        {/* Special Mock Test */}
        <div className="bg-white p-4 rounded-2xl shadow-lg"   >
          <h3 className="font-bold text-lg mb-3">Special Mock Test</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            <div className="bg-indigo-100 p-3 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <SpeedIcon fontSize="large" className="text-indigo-600" />
              <Link to="/previouspaper" className="text-sm font-medium text-gray-700">Previous Year Papers</Link>
            </div>
            <div className="bg-gray-100 p-3 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <HelpOutlineIcon fontSize="large" className="text-gray-600" />
              <Link to="/hardlevelreasoning" className="text-sm font-medium text-gray-700">Hard Level Reasoning</Link>
            </div>
            <div className="bg-gray-100 p-3 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <HelpOutlineIcon fontSize="large" className="text-gray-600" />
              <Link to="/hardlevelquants" className="text-sm font-medium text-gray-700">Hard Level Quants</Link>
            </div>
            <div className="bg-yellow-100 p-3 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <EventNoteIcon fontSize="large" className="text-yellow-600" />
              <Link to="/hardleveng" className="text-sm font-medium text-gray-700">Hard Level English</Link>
            </div>
            <div className="bg-red-100 p-3 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <PictureAsPdfIcon fontSize="large" className="text-red-600" />
              <Link to="/descriptive" className="text-sm font-medium text-gray-700">Descriptive</Link>
            </div>
            <div className="bg-blue-100 p-3 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <LibraryBooksIcon fontSize="large" className="text-blue-600" />
              <Link to="/criticalreason" className="text-sm font-medium text-gray-700">Critical Reasoning</Link>
            </div>
          </div>
        </div>

        {/* Others */}
        <div className="bg-white p-4 rounded-2xl shadow-lg">
          <h3 className="font-bold text-lg mb-3">Others</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            <div className="bg-blue-100 p-3 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <StarIcon fontSize="large" className="text-blue-600" />
              <Link to="/hinduedutorial" className="text-sm font-medium text-gray-700">Hindu Editorial</Link>
            </div>
            <div className="bg-purple-100 p-3 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <DiamondIcon fontSize="large" className="text-purple-600" />
              <Link to="#" className="text-sm font-medium text-gray-700">Interview Prep</Link>
            </div>
            <div className="bg-pink-100 p-3 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <CelebrationIcon fontSize="large" className="text-pink-600" />
              <Link to="#" className="text-sm font-medium text-gray-700">Success Stories</Link>
            </div>
            <div className="bg-pink-100 p-3 flex flex-col  items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <EmojiEventsIcon fontSize="large" className="text-pink-600" />
              <Link to="#" className="text-sm font-medium text-gray-700">Special Mocks</Link>
            </div>
            <div className="bg-gray-100 p-3 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <ForumIcon fontSize="large" className="text-gray-600" />
              <Link to="#" className="text-sm font-medium text-gray-700">GD</Link>
            </div>
            <div className="bg-gray-100 p-3 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <MailOutlineIcon fontSize="large" className="text-gray-600" />
              <Link to="#" className="text-sm font-medium text-gray-700">Email & Precis Writing</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Exams */}
      <div className="p-4 rounded-2xl shadow-lg mt-4 bg-white">
  <div className="flex justify-between items-center mb-3 ">
    <h3 className="font-bold text-lg">Top Trending Exams </h3>
    <Link to="#" className="text-blue-600 hover:underline">View More</Link>
  </div>
  <div className="grid grid-cols-3 lg:grid-cols-6 sm:grid-cols-3 gap-5">
  {exams.map((exam, index) => (
    <div
      key={index}
   
    >
      {/* Circular Image at the Top Center with Hover Transition */}
      <div
        className="bg-blue-100 p-3 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap"
      >
        <img
          src={exam.image}
          alt={exam.name}
          className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-2"
        />
      

      {/* Exam Name Below Image */}
      <Link to={exam.link} className="text-sm font-medium text-gray-700">{exam.name}</Link>
      <p ></p>
      </div>
    </div>
  ))}
</div>


</div>


    </div>
  );
};

export default Dashboard;
