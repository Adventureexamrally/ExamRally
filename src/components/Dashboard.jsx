import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import Api from "../service/Api";
import { FaChevronLeft, FaChevronRight, FaFireAlt } from "react-icons/fa";
import LiveTest from "./LiveTest/LiveTest";
import TrendingPackages from "./TrendingPackages";
import Archivements from "./Archivements";
import PdfCourseAd from "./PdfCourseAd";

const Dashboard = () => {
  const [packages, setPackages] = useState([]);
  const [scrollLinks, setScrollLinks] = useState([]);
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Fetching Packages (Trending Exams)
  const fetchPakages = async () => {
    try {
      const response = await Api.get("/packages/get/active");
      setPackages(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetching Top Ticker Links
  const fetchScrollLinks = async () => {
    try {
      const response = await Api.get("/links/all");
      if (response.status === 200) {
        const allLinks = response.data.reduce((acc, entry) => acc.concat(entry.links), []);
        setScrollLinks(allLinks);
      }
    } catch (error) {
      console.error("Error fetching scroll links:", error);
      setScrollLinks([]);
    }
  };

  useEffect(() => {
    fetchPakages();
    fetchScrollLinks();
  }, []);

  // Check scroll position to show/hide buttons
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [packages]);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="bg-slate-50/50 min-h-screen pb-10">
      {/* 1. NEWS TICKER (Scrolling Links) */}
      <div className="bg-white border-b border-emerald-50 py-2 shadow-sm overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 flex items-center">
          {/* Label - Fixed in place */}
          <div className="flex-shrink-0 bg-green-600 text-white text-[10px] font-black px-3 py-1 rounded-md mr-4 uppercase tracking-[0.2em] flex items-center gap-1.5 z-10 shadow-sm">
            <FaFireAlt className="animate-pulse" /> Trending
          </div>

          {/* Ticker Container */}
          <div className="relative flex-grow overflow-hidden">
            <div className="ticker-wrapper flex items-center">
              {/* We duplicate the list. 
                   The animation moves from 0 to -50%. 
                   Since the second half is identical to the first, 
                   it snaps back to 0 seamlessly.
                */}
              <div className="ticker-content flex gap-12 items-center">
                {[...scrollLinks, ...scrollLinks, ...scrollLinks].map((link, index) => (
                  <Link
                    key={index}
                    to={link.linkUrl}
                    className="text-sm font-bold text-slate-600 hover:text-green-600 transition-colors flex items-center gap-4 whitespace-nowrap"
                  >
                    {link.linkName}
                    <span className="text-green-200 font-normal">|</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10 mt-2">
        {/* <PdfCourseAd /> */}

        <LiveTest />

        {/* 2. TOP TRENDING EXAMS (Carousel) */}
        <section className="bg-white p-6 sm:p-10 rounded-[2.5rem] border border-green-100 shadow-sm relative">
          <div className="flex justify-between items-end mb-8 relative z-10">
            <div>
              <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                Top Trending <span className="text-green-600 italic font-serif font-medium">Exams</span>
              </h3>
              <p className="text-slate-400 text-sm font-medium mt-1">Select your goal to start practicing</p>
            </div>
          </div>

          <div className="group relative">
            {/* Left Navigation Button */}
            {canScrollLeft && (
              <button
                onClick={() => handleScroll('left')}
                className="absolute -left-5 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white shadow-xl text-green-600 z-20 border border-green-50 hover:bg-green-500 hover:text-white transition-all duration-300"
              >
                <FaChevronLeft size={18} />
              </button>
            )}

            {/* Carousel Wrapper */}
            <div
              className="flex gap-6 overflow-x-auto scroll-smooth py-4 no-scrollbar"
              ref={scrollContainerRef}
              onScroll={checkScroll}
            >
              {packages.map((exam, index) => (
                <div key={index} className="flex-shrink-0 w-[140px] sm:w-[190px]">
                  <Link to={`/top-trending-exams/${exam.link_name}`}>
                    <div className="bg-white border border-slate-100 p-6 rounded-3xl text-center transition-all duration-300 hover:border-green-200 hover:shadow-2xl hover:shadow-green-100/50 hover:-translate-y-2 group/card">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-green-50 rounded-2xl opacity-0 group-hover/card:opacity-100 scale-110 transition-all duration-300"></div>
                        <img
                          src={exam.photo}
                          alt={exam.name}
                          className="relative z-10 w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-slate-700 font-bold text-sm tracking-tight leading-tight group-hover/card:text-emerald-700">
                        {exam.name}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Right Navigation Button */}
            {canScrollRight && (
              <button
                onClick={() => handleScroll('right')}
                className="absolute -right-5 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white shadow-xl text-green-600 z-20 border border-green-50 hover:bg-green-500 hover:text-white transition-all duration-300"
              >
                <FaChevronRight size={18} />
              </button>
            )}
          </div>
        </section>

        <TrendingPackages />
        <Archivements />
      </div>

      {/* Injected Styles for Ticker and Scrollbars */}
      <style jsx>{`
        .ticker-wrapper {
            display: flex;
            width: max-content; /* Critical: allows content to define width beyond 100% */
            animation: ticker-loop 30s linear infinite;
        }

        .ticker-wrapper:hover {
            animation-play-state: paused;
        }

        @keyframes ticker-loop {
            0% {
                transform: translateX(0);
            }
            100% {
                /* We move by 1/3 because we duplicated the array 3 times 
                   to ensure no white space on extra wide screens */
                transform: translateX(-33.33%);
            }
        }

        .ticker-content {
            display: flex;
            flex-shrink: 0;
        }
    `}</style>
    </div>
  );
};

export default Dashboard;