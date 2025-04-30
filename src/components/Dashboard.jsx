import { Link } from "react-router-dom";
import Banner from "./Banner";
// import { RiRobotFill } from "react-icons/ri";
import Api from "../service/Api";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import LiveTest from "./LiveTest/LiveTest";
import TrendingPackages from "./TrendingPackages";
import Archivements from "./Archivements";

const Dashboard = () => {
  const IMG_URL = import.meta.env.VITE_APP_IMG_BASE_URL;
  const [packages, setPackages] = useState([]);
  console.log(packages);


  const fetchPakages = async () => {
    try {
      const response = await Api.get("/packages/get/active");
      console.log("ji", response.data)
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
  const fg = Math.ceil(totalItems / itemsPerView) - 1;

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

      <LiveTest />


      {/* Upcoming Exams */}
      <div className="p-4 rounded-2xl shadow-lg mt-4 bg-white" id="Top Trending Exams">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg">Top Trending Exams</h3>
          <Link to="#"  className="border-1 h-10 border-blue-500 text-blue-500 rounded-full px-4 py-2 text-sm font-semibold transition duration-200 hover:text-white hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-600"
          >
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
      <TrendingPackages />
          <Archivements/>
    </div>
  );
};

export default Dashboard;