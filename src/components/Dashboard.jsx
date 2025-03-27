import sbi from "../assets/logo/sbi.png";
import ibps from "../assets/logo/ibps.png";
// import rrb from "../assets/logo/rrb.png";
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
// import { RiRobotFill } from "react-icons/ri";
import Api from "../service/Api";
import { useState } from "react";
import { useEffect } from "react";
import Packagename from "./Packagename";
import { useRef } from "react";
import LiveTest from "./LiveTest";

const Dashboard = () => {
  const IMG_URL = import.meta.env.VITE_APP_IMG_BASE_URL;
  const [packages, setPackages] = useState([]);
  console.log(packages);

  const exams = [
    { name: "RRB PO", image: ibps, link: "rrb-po" },
    { name: "RRB Clerk", image: ibps, link: "rrb-clerk" },
    { name: "IBPS Clerk", image: ibps, link: "ibps-clerk" },
    { name: "IBPS PO", image: ibps, link: "ibps-po" },
    { name: "SBI Clerk", image: sbi, link: "sbi-clerk" },
    { name: "SBI PO", image: sbi, link: "sbi-po" },
  ];

  const fetchPakages = async () => {
    try {
      const response = await Api.get("/packages/get/active");
      setPackages(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPakages();
  }, []);

  // const [scrollPosition, setScrollPosition] = useState(0);
  // console.log(scrollPosition);


  const itemsPerView = 3; // Adjust based on screen size
  const totalItems = packages.length;
  const fg= Math.ceil(totalItems / itemsPerView) - 1;

  // const handleLeftClick = () => {
  //   setScrollPosition((prev) => Math.max(prev - 1, 0));
  // };

  // const handleRightClick = () => {
  //   setScrollPosition((prev) => Math.min(prev + 1, maxScroll));
  // };
  const scrollContainerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.clientWidth;
      const scrollWidth = scrollContainerRef.current.scrollWidth;
      setMaxScroll(scrollWidth - containerWidth);
    }
  }, [packages]);

  const handleLeftClick = () => {
    if (scrollContainerRef.current) {
      const newPosition = Math.max(scrollPosition - 200, 0);
      scrollContainerRef.current.scrollTo({ left: newPosition, behavior: "smooth" });
      setScrollPosition(newPosition);
    }
  };

  const handleRightClick = () => {
    if (scrollContainerRef.current) {
      const newPosition = Math.min(scrollPosition + 200, maxScroll);
      scrollContainerRef.current.scrollTo({ left: newPosition, behavior: "smooth" });
      setScrollPosition(newPosition);
    }
  };
  return (
    <div className="bg-gray-100 min-h-screen p-2">
      {/* Trending Links */}
      <div className="mb-1 overflow-hidden">
        <div className="whitespace-nowrap animate-scroll text-sm text-blue-600 flex gap-8">
          <Link to="#" className="hover:underline">
            Clerk Notification
          </Link>
          <Link to="#" className="hover:underline">
            SBI JA Previous Year Cut-off
          </Link>
          <Link to="#" className="hover:underline">
            Descriptive Writing Mock Test
          </Link>
          <Link to="#" className="hover:underline">
            Current Affairs
          </Link>
        </div>
      </div>
      {/* 
      <div className="h-[30vh] w-full overflow-hidden rounded mb-4">
        <Banner />
      </div> */}

      {/* Main Content */}
        
      <LiveTest/>

      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-full">
          <Banner />
        </div>
        {/* Topic Test 
        <div className="bg-white p-4 rounded-2xl shadow-lg">
          <h3 className="font-bold text-lg mb-3">Topic Test</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            <div className="bg-orange-100 p-3 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <CalculateIcon fontSize="large" className="text-orange-600" />
              <Link
                to="/quantitativeapti"
                className="text-sm font-medium text-gray-700"
              >
                Quantitative Aptitude
              </Link>
            </div>
            <div className="bg-purple-100 p-3 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <PsychologyIcon fontSize="large" className="text-purple-600" />
              <Link
                to="/reasoningability"
                className="text-sm font-medium text-gray-700"
              >
                Reasoning Ability
              </Link>
            </div>
            <div className="bg-pink-100 p-3 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <MenuBookIcon fontSize="large" className="text-pink-600" />
              <Link
                to="/englishlang"
                className="text-sm font-medium text-gray-700"
              >
                English Language
              </Link>
            </div>
            <div className="bg-teal-100 p-3 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <PublicIcon fontSize="large" className="text-teal-600" />
              <Link
                to="/currentaffairs"
                className="text-sm font-medium text-gray-700"
              >
                Current Affairs
              </Link>
            </div>
            <div className="bg-green-100 p-3 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <ComputerIcon fontSize="large" className="text-green-600" />
              <Link
                to="/computerawarness"
                className="text-sm font-medium text-gray-700"
              >
                Computer Awareness
              </Link>
            </div>
            <div className="bg-red-100 p-3 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <AccountBalanceIcon fontSize="large" className="text-red-600" />
              <Link
                to="/bankingawarness"
                className="text-sm font-medium text-gray-700"
              >
                Banking Awareness
              </Link>
            </div>
            <div className="bg-gray-100 p-3 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <LibraryBooksIcon fontSize="large" className="text-gray-600" />
              <Link
                to="/staticgk"
                className="text-sm font-medium text-gray-700"
              >
                Static GK
              </Link>
            </div>
            <div className="bg-yellow-100 p-3 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <QuizIcon fontSize="large" className="text-yellow-600" />
              <Link
                to="/insuranceawarness"
                className="text-sm font-medium text-gray-700"
              >
                Insurance Awareness
              </Link>
            </div>
          </div>
        </div>

        {/* Special Mock Test 
        <div className="bg-white p-4 rounded-2xl shadow-lg">
          <h3 className="font-bold text-lg mb-3">Special Mock Test</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            <div className="bg-indigo-100 p-3 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <SpeedIcon fontSize="large" className="text-indigo-600" />
              <Link
                to="/previouspaper"
                className="text-sm font-medium text-gray-700"
              >
                Previous Year Papers
              </Link>
            </div>
            <div className="bg-gray-100 p-3 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <HelpOutlineIcon fontSize="large" className="text-gray-600" />
              <Link
                to="/hardlevelreasoning"
                className="text-sm font-medium text-gray-700"
              >
                Hard Level Reasoning
              </Link>
            </div>
            <div className="bg-gray-100 p-3 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <HelpOutlineIcon fontSize="large" className="text-gray-600" />
              <Link
                to="/hardlevelquants"
                className="text-sm font-medium text-gray-700"
              >
                Hard Level Quants
              </Link>
            </div>
            <div className="bg-yellow-100 p-3 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <EventNoteIcon fontSize="large" className="text-yellow-600" />
              <Link
                to="/hardleveng"
                className="text-sm font-medium text-gray-700"
              >
                Hard Level English
              </Link>
            </div>
            <div className="bg-red-100 p-3 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <PictureAsPdfIcon fontSize="large" className="text-red-600" />
              <Link
                to="/descriptive"
                className="text-sm font-medium text-gray-700"
              >
                Descriptive
              </Link>
            </div>
            <div className="bg-blue-100 p-3 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <LibraryBooksIcon fontSize="large" className="text-blue-600" />
              <Link
                to="/criticalreason"
                className="text-sm font-medium text-gray-700"
              >
                Critical Reasoning
              </Link>
            </div>
          </div>
        </div>

        {/* Others 
        <div className="bg-white p-4 rounded-2xl shadow-lg">
          <h3 className="font-bold text-lg mb-3">Others</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            <div className="bg-blue-100 p-3 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <StarIcon fontSize="large" className="text-blue-600" />
              <Link
                to="/hinduedutorial"
                className="text-sm font-medium text-gray-700"
              >
                Hindu Editorial
              </Link>
            </div>
            <div className="bg-purple-100 p-3 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <DiamondIcon fontSize="large" className="text-purple-600" />
              <Link to="#" className="text-sm font-medium text-gray-700">
                Interview Prep
              </Link>
            </div>
            <div className="bg-pink-100 p-3 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <CelebrationIcon fontSize="large" className="text-pink-600" />
              <Link to="#" className="text-sm font-medium text-gray-700">
                Success Stories
              </Link>
            </div>
            <div className="bg-pink-100 p-3 flex flex-col  items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <EmojiEventsIcon fontSize="large" className="text-pink-600" />
              <Link to="#" className="text-sm font-medium text-gray-700">
                Special Mocks
              </Link>
            </div>
            <div className="bg-gray-100 p-3 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <ForumIcon fontSize="large" className="text-gray-600" />
              <Link to="#" className="text-sm font-medium text-gray-700">
                GD
              </Link>
            </div>
            <div className="bg-gray-100 p-3 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-wrap">
              <MailOutlineIcon fontSize="large" className="text-gray-600" />
              <Link to="#" className="text-sm font-medium text-gray-700">
                Email & Precis Writing
              </Link>
            </div>
          </div>
        </div>
      </div> */}

      {/* Upcoming Exams */}
      <div className="p-4 rounded-2xl shadow-lg mt-4 bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg">Top Trending Exams</h3>
        <Link to="#" className="text-blue-600 hover:underline">
          View More
        </Link>
      </div>

      {/* Carousel Container */}
      <div className="relative py-3 overflow-hidden">
      {/* Left Button */}
      {scrollPosition > 0 && (
        <button
          onClick={handleLeftClick}
          className="absolute top-1/2 left-0 p-3 bg-blue-500 text-white rounded-full transform -translate-y-1/2 z-10 shadow-lg"
        >
          <i className="bi bi-chevron-left"></i>
        </button>
      )}

      {/* Exams Wrapper */}
      <div className="overflow-hidden" ref={scrollContainerRef}>
        <div className="flex space-x-5 sm:space-x-3 md:space-x-5 lg:space-x-8 transition-transform duration-300 ease-in-out">
          {packages.map((exam, index) => (
            <div key={index} className="flex-shrink-0 w-1/2 sm:w-1/3 md:w-1/5 lg:w-1/6">
              <Link to={`/top-trending-exams/${exam.link_name}`} className="text-sm font-medium text-gray-700">
                <div className="bg-blue-100 p-4 flex flex-col items-center rounded-2xl text-center hover:scale-110 hover:shadow-lg transition-transform duration-300">
                  <img
                    src={`${IMG_URL}${exam.photo}`}
                    alt={exam.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-2"
                  />
                  <p>{exam.name}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Right Button */}
      {scrollPosition < maxScroll && (
        <button
          onClick={handleRightClick}
          className="absolute top-1/2 right-0 p-3 bg-blue-500 text-white rounded-full transform -translate-y-1/2 z-10 shadow-lg"
        >
          <i className="bi bi-chevron-right"></i>
        </button>
      )}
    </div>
    </div>
    </div>
  );
};

export default Dashboard;