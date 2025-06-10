import { useState, useEffect, useRef } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiYoutube,
  FiPlay,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import Api from "../../service/Api";
import YouTube from "react-youtube";
import { motion, AnimatePresence } from "framer-motion";

export default function PremiumVideoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const playerRef = useRef(null);

  // Check mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch YouTube videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await Api.get("uploads/videos");
        setVideos(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching videos:", error);
        setIsLoading(false);
      }
    };
    fetchVideos();
  }, []);

  // YouTube player state handlers
  const onPlayerReady = (event) => {
    playerRef.current = event.target;
  };

  const onPlayerStateChange = (event) => {
    // 1 = playing, 2 = paused
    setIsPlaying(event.data === 1);
  };

  // Auto-rotate videos every 8 seconds if not hovered/playing
  useEffect(() => {
    if (videos.length <= 1) return;

    const interval = setInterval(() => {
      if (!isHovered && !isPlaying && !isMobile) {
        nextVideo();
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [isHovered, isPlaying, videos.length, isMobile]);

  const nextVideo = () => {
    setCurrentIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
    setIsPlaying(false);
  };

  const prevVideo = () => {
    setCurrentIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
    setIsPlaying(false);
  };

  // YouTube player options
  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 0,
      modestbranding: 1,
      rel: 0,
      controls: 1,
      showinfo: 0,
      fs: 1,
    },
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!videos.length) {
    return (
      <div className="text-center py-16 px-4">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-100 to-green-50 rounded-full mb-6 shadow-lg">
          <FiYoutube className="w-12 h-12 text-green-600" />
        </div>
        <h3 className="text-2xl font-medium text-gray-800 mb-3">
          No videos available
        </h3>
        <p className="text-gray-600 max-w-md mx-auto text-lg">
          We'll be adding new educational content soon. Check back later!
        </p>
        <Link
          to="https://www.youtube.com/@examrally_banking"
          className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
        >
          <FiYoutube className="w-5 h-5 mr-2" />
          Visit our YouTube channel
        </Link>
      </div>
    );
  }

  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="relative mb-12 md:mb-16 text-center">
        <div className="absolute -top-6 md:-top-8 left-1/2 transform -translate-x-1/2 w-16 md:w-24 h-1 md:h-1.5 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3 md:mb-4 relative inline-block">
          <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-900">
            Premium
          </span>
          <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-green-600 ml-2">
            Video Lessons
          </span>
          <span className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-2 md:h-3 bg-green-50 z-0 rounded-full"></span>
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Master banking concepts with our curated video lessons taught by
          industry experts
        </p>
      </div>

      {/* Main Carousel */}
      <div
        className="relative group"
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
      >
        {/* Video Carousel */}
        <div className="relative overflow-hidden rounded-xl md:rounded-3xl shadow-xl md:shadow-2xl bg-black aspect-video w-full max-w-6xl mx-auto border-2  md:border-4 border-white/10">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <YouTube
                videoId={getYoutubeId(videos[currentIndex]?.youtubeUrl)}
                opts={opts}
                className="w-full h-full"
                containerClassName="w-full h-full"
                onReady={onPlayerReady}
                onStateChange={onPlayerStateChange}
              />
            </motion.div>
          </AnimatePresence>

          {/* Video Info Overlay - Hidden when playing */}
          <div className="relative">
            {!isPlaying && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 md:p-8 pt-12 md:pt-16 transition-opacity duration-300">
                <div className="flex flex-col sm:flex-row items-start sm:items-end sm:gap-5 justify-between gap-3 md:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-1 md:mb-2">
                      <span className="inline-flex items-center px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs font-medium bg-green-600/20 text-green-400">
                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full mr-1.5 md:mr-2 animate-pulse"></span>
                        PREMIUM CONTENT
                      </span>
                    </div>
                    <h3 className="text-lg md:text-2xl lg:text-3xl font-bold text-white leading-tight line-clamp-2">
                      {videos[currentIndex]?.title}
                    </h3>
                  </div>
                  <Link
                    to="https://www.youtube.com/@examrally_banking"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 md:ml-4 inline-flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white transition-all duration-300 flex-shrink-0 shadow-lg hover:shadow-xl hover:scale-105"
                    aria-label="Visit our YouTube channel"
                  >
                    <FiYoutube className="w-5 h-5 md:w-6 md:h-6" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Arrows - Always visible on mobile */}
        {videos.length > 1 && (
          <>
            <button
              onClick={prevVideo}
              className={`absolute left-2 md:left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white p-2 md:p-4 rounded-full transition-all duration-300 ${
                isMobile
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100 focus:opacity-100"
              } shadow-lg md:shadow-xl hover:shadow-2xl hover:scale-105 z-20`}
              aria-label="Previous video"
            >
              <FiChevronLeft className="w-5 h-5 md:w-7 md:h-7" />
            </button>
            <button
              onClick={nextVideo}
              className={`absolute right-2 md:right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white p-2 md:p-4 rounded-full transition-all duration-300 ${
                isMobile
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100 focus:opacity-100"
              } shadow-lg md:shadow-xl hover:shadow-2xl hover:scale-105 z-20`}
              aria-label="Next video"
            >
              <FiChevronRight className="w-5 h-5 md:w-7 md:h-7" />
            </button>
          </>
        )}

        {/* Progress Indicator */}
        {videos.length > 1 && !isPlaying && (
          <div className="absolute bottom-3 md:bottom-6 left-1/2 transform -translate-x-1/2 z-20 w-[90%] md:w-3/4 max-w-xl">
            <div className="h-1.5 md:h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${((currentIndex + 1) / videos.length) * 100}%`,
                }}
                transition={{
                  duration: isHovered || isMobile ? 0.3 : 7.5,
                  ease: isHovered || isMobile ? "easeOut" : "linear",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Video Thumbnail Scroller */}
      {videos.length > 1 && (
        <div className="mt-8 md:mt-12 px-1 md:px-2">
          <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4 flex items-center">
            <span className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full mr-2"></span>
            More Videos
          </h3>
          <div className="relative">
            <div className="flex overflow-x-auto pb-4 -mx-2 scrollbar-hide snap-x snap-mandatory">
              <div className="flex space-x-3 md:space-x-4 px-2">
                {videos.map((video, index) => (
                  <motion.div
                    key={video._id || index}
                    onClick={() => setCurrentIndex(index)}
                    whileHover={{ y: isMobile ? 0 : -5 }}
                    className={`flex-shrink-0 relative cursor-pointer transition-all duration-300 rounded-lg md:rounded-xl overflow-hidden shadow-md md:shadow-lg group ${
                      index === currentIndex
                        ? "ring-2 md:ring-3 ring-green-500 scale-[1.02] md:scale-105"
                        : "ring-1 ring-gray-200 hover:ring-2 hover:ring-green-400"
                    }`}
                    style={{ width: "200px", scrollSnapAlign: "start" }}
                  >
                    <div className="relative aspect-video bg-gray-800">
                      <img
                        src={`https://img.youtube.com/vi/${getYoutubeId(
                          video.youtubeUrl
                        )}/mqdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div
                          className={`${
                            index === currentIndex
                              ? "bg-green-600"
                              : "bg-black/80"
                          } w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-md`}
                        >
                          <FiPlay className="w-3 h-3 md:w-4 md:h-4 text-white ml-0.5" />
                          {/* <span className="sr-only">Playing</span> */}
                        </div>
                      </div>
                    </div>
                    <div className="p-2 md:p-3 bg-white">
                      <h4 className="font-medium md:font-semibold text-gray-900 line-clamp-2 text-xs md:text-sm leading-tight">
                        {video.title}
                      </h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="mt-10 md:mt-16 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="inline-block"
        >
          <Link
            to="https://www.youtube.com/@examrally_banking"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 md:px-10 md:py-5 border border-transparent text-base md:text-xl font-semibold rounded-full shadow-lg md:shadow-xl text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-300 hover:shadow-xl md:hover:shadow-2xl hover:scale-[1.02]"
          >
            <FiYoutube className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" />
            Subscribe to Our Channel
          </Link>
        </motion.div>
        <p className="mt-4 md:mt-6 text-gray-600 text-sm md:text-base">
          Get notified when we upload new premium educational content
        </p>
      </div>
    </section>
  );
}

// Helper function to extract YouTube ID from URL
function getYoutubeId(url) {
  if (!url) return "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : "";
}
