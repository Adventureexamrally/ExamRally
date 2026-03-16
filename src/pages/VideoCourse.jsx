import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Api from "../service/Api";

const VideoCourse = () => {
  const [seo, setSeo] = useState([]);
  const [ad, setAD] = useState([]);
  const [grouptopic, setGroupTopic] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [courses, setCourses] = useState([]);
  const carouselRef = useRef();
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  // Data fetching
  useEffect(() => {
    async function run() {
      const response2 = await Api.get(`/get-Specific-page/video-course`);
      setSeo(response2.data);
      const response3 = await Api.get(`/blog-Ad/getbypage/video-course`);
      setAD(response3.data);
    }
    run();
  }, []);

  useEffect(() => {
    const fetchGroupsAndCourses = async () => {
      try {
        const groupResponse = await Api.get("video-courses/groups");
        setGroupTopic(groupResponse.data);
        const courseResponse = await Api.get("video-courses/video-course/main-page");
        setCourses(courseResponse.data);
        // const courselink=await Api.get("topic-test/livetest/getall")
        // console.log("courselink",courselink.data.link_name);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchGroupsAndCourses();
  }, []);

  // Carousel scroll handlers
  const scrollToPrevious = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };
  const scrollToNext = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };
  const checkScroll = () => {
    if (carouselRef.current) {
      setIsAtStart(carouselRef.current.scrollLeft === 0);
      setIsAtEnd(
        Math.ceil(carouselRef.current.scrollLeft + carouselRef.current.offsetWidth) >=
        carouselRef.current.scrollWidth
      );
    }
  };
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.addEventListener("scroll", checkScroll);
      checkScroll();
      return () => carouselRef.current?.removeEventListener("scroll", checkScroll);
    }
  }, []);

  const handleTopicSelect = (topic) => setSelectedTopic(topic);

  // Filtering
  const filteredCourses = selectedTopic
    ? courses.filter((course) => course.group === selectedTopic)
    : courses;

  return (
    <>
      <Helmet>
        <title>{seo[0]?.seoData?.title || "Video courses"}</title>
        <meta name="description" content={seo[0]?.seoData?.description} />
        <meta name="keywords" content={seo[0]?.seoData?.keywords} />
        <meta property="og:title" content={seo[0]?.seoData?.ogTitle} />
        <meta property="og:description" content={seo[0]?.seoData?.ogDescription} />
        <meta property="og:url" content={seo[0]?.seoData?.ogImageUrl} />
      </Helmet>
      <section className="py-2">
        <h2 className="text-3xl m-2 font-extrabold text-center text-green-600">Video Courses</h2>
      </section>

      {/* Topic Carousel */}
      <div className="relative border-b border-gray-200 py-4 mb-10 bg-gray-50">
        <div className="container mx-auto px-2 sm:px-4 flex items-center">
          <button
            onClick={scrollToPrevious}
            className={`absolute left-2 z-10 p-2 rounded-full bg-white shadow transition-all top-1/2 -translate-y-1/2
             ${isAtStart ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100"}`}
            disabled={isAtStart}
            aria-label="Scroll Left"
          >
            <FaChevronLeft className="w-5 h-5 text-green-700" />
          </button>
          <div
            ref={carouselRef}
            className="flex overflow-x-auto gap-3 pb-1 px-14 sm:px-24 no-scrollbar scroll-smooth w-full select-none"
            style={{
              scrollSnapType: "x mandatory",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <span
              className={`py-2 px-6 mx-0.5 cursor-pointer rounded-full whitespace-nowrap flex items-center shadow
                transition-all duration-200 text-sm sm:text-base ${
                  !selectedTopic
                    ? "bg-gradient-to-r from-green-600 to-green-800 text-white font-semibold"
                    : "text-gray-700 bg-white border hover:bg-gray-100"
                }`}
              onClick={() => handleTopicSelect(null)}
            >
              All Topics
            </span>
            {grouptopic.map((title) => (
              <span
                key={title._id}
                className={`py-2 px-6 mx-0.5 cursor-pointer rounded-full whitespace-nowrap flex items-center shadow
                  transition-all duration-200 text-sm sm:text-base ${
                    selectedTopic === title.topic
                      ? "bg-gradient-to-r from-green-600 to-green-800 text-white font-semibold"
                      : "text-gray-700 bg-white border hover:bg-gray-100"
                  }`}
                onClick={() => handleTopicSelect(title.topic)}
              >
                {title.topic}
              </span>
            ))}
          </div>
          <button
            onClick={scrollToNext}
            className={`absolute right-2 z-10 p-2 rounded-full bg-white shadow transition-all top-1/2 -translate-y-1/2
             ${isAtEnd ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100"}`}
            disabled={isAtEnd}
            aria-label="Scroll Right"
          >
            <FaChevronRight className="w-5 h-5 text-green-700" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto flex flex-col md:flex-row gap-4 mb-10 px-2 sm:px-0">
        {/* Courses grid */}
   <main className="flex-1 min-w-0">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {filteredCourses.length > 0 ? (
      filteredCourses.map((course) => (
        <article
          key={course._id}
          className="p-4 border border-gray-200 rounded-xl shadow hover:shadow-xl transition-shadow duration-200 bg-white flex flex-col"
        >
          <div className="flex-1 flex flex-col sm:flex-row gap-4 justify-between items-center">
            {/* Course Info */}
            <div className="flex-1 w-full">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                {course.title}
              </h3>
              <Link 
                to={`/videocourse/${course.subject}/${course._id}`}
                className="inline-block mt-2" // Added for better button alignment
              >
                <button 
                  className="text-white font-semibold py-2 px-5 rounded bg-green-500 hover:bg-green-700 transition-colors w-full sm:w-auto"
                  aria-label={`View ${course.title} course`}
                >
                  View Course
                </button>
              </Link>
            </div>
            
            {/* Logo & Author */}
            <div className="flex flex-col items-center mt-3 sm:mt-0 w-full sm:w-24">
              <img
                src={course.logo || "/placeholder.png"}
                alt={`${course.title} logo` || "Course logo"}
                className="w-20 h-20 object-contain bg-gray-100 border rounded"
                loading="lazy"
                width="80"
                height="80"
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                By {course.author_data?.[0]?.name || "Unknown Author"}
              </p>
            </div>
          </div>
        </article>
      ))
    ) : (
      <div className="col-span-full text-center py-12 text-lg text-gray-500">
        No courses found.
      </div>
    )}
  </div>
</main>
        {/* Sidebar Ads (only md and up) */}
        {ad.length > 0 && (
          <aside className="hidden md:block md:w-64">
            <h4 className="font-semibold text-gray-600 mb-2 text-center">Sponsored</h4>
            {ad.map((item) => (
              <div key={item._id} className="m-4 hover:scale-105 hover:shadow-lg transition-transform duration-300">
                <Link to={item.link_name}>
                  <img src={item.photo} alt="Ad" className="rounded-md shadow" />
                </Link>
              </div>
            ))}
          </aside>
        )}
      </div>
    </>
  );
};

export default VideoCourse;
