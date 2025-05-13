import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { FaChevronLeft, FaChevronRight, FaFire, FaClock, FaCalendarAlt } from "react-icons/fa";
import Api from "../../service/Api";

const Blog = () => {
  const [trendingblog, setTrendingBlog] = useState(null);
  const [blogData, setBlogData] = useState(null);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [seo, setSeo] = useState([]);
  const [blogAd, setBlogAd] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const carouselRef = React.useRef(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  useEffect(() => {
    async function run() {
      try {
        const topics = await Api.get(`blogs/topics`);
        setTopics(topics.data);

        const response = await Api.get(`blogs/all?trending=true`);
        setTrendingBlog(response.data);

        const response2 = await Api.get(`blogs/all`);
        setBlogData(response2.data);

        const response3 = await Api.get(`/get-Specific-page/blog`);
        setSeo(response3.data);

        const ad = await Api.get(`blog-Ad/getbypage/blog`);
        setBlogAd(ad.data);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    }

    run();

    const handleScroll = () => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        setIsAtStart(scrollLeft === 0);
        setIsAtEnd(scrollLeft === scrollWidth - clientWidth);
      }
    };

    const carousel = carouselRef.current;
    carousel?.addEventListener("scroll", handleScroll);

    // Initial scroll check
    handleScroll();

    return () => {
      carousel?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleTopicSelect = async (topicId) => {
    setSelectedTopic(topicId);
    try {
      const response = await Api.get(`blogs/all?topic=${topicId}`);
      if (response.data?.length > 0) {
        setBlogData(response.data);
      } else {
        handleTopicSelect("");
      }
    } catch (error) {
      console.error("Error fetching blogs by topic:", error);
    }
  };

  const scrollToNext = () => {
    carouselRef.current?.scrollBy({ left: 150, behavior: "smooth" });
  };

  const scrollToPrevious = () => {
    carouselRef.current?.scrollBy({ left: -150, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Blog card component for consistent styling
  const BlogCard = ({ blog }) => (
    <div
      onClick={() => navigate(`/blogdetails/${blog.link}`)}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group h-full flex flex-col"
    >
      {blog.photo && (
        <div className="w-full h-48 overflow-hidden">
          <img
            src={blog.photo}
            alt={blog.title}
            className="w-full h-full object-contain bg-gray-100 p-2 group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-4 flex-1 flex flex-col">
        <h3
          className="text-lg font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-300"
          dangerouslySetInnerHTML={{ __html: blog.title }}
        />
        <p
          className="text-gray-600 mb-3 text-sm flex-1 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: blog.shortDescription }}
        />
        <div className="flex items-center text-xs text-gray-500 mt-auto">
          <FaCalendarAlt className="mr-1" />
          <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{seo[0]?.seoData?.title}</title>
        <meta name="description" content={seo[0]?.seoData?.description} />
        <meta name="keywords" content={seo[0]?.seoData?.keywords} />
        <meta property="og:title" content={seo[0]?.seoData?.ogTitle} />
        <meta property="og:description" content={seo[0]?.seoData?.ogDescription} />
        <meta property="og:url" content={seo[0]?.seoData?.ogImageUrl} />
      </Helmet>

      <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen">
        <div className={`w-full ${blogAd.length > 0 ? "md:w-4/5" : "md:w-full"} p-4 md:p-8`}>
          {/* Topics Carousel */}
          <div className="relative mb-12">
            <div className="flex items-center justify-center">
              <button
                onClick={scrollToPrevious}
                className={`absolute left-0 z-10 p-2 rounded-full bg-white shadow-md ${isAtStart ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"} transition-all`}
                disabled={isAtStart}
              >
                <FaChevronLeft className="w-5 h-5 text-green-700" />
              </button>

              <div
                ref={carouselRef}
                className="flex overflow-x-auto gap-4 pb-4 scroll-smooth w-full px-8"
                style={{
                  scrollBehavior: "smooth",
                  scrollSnapType: "x mandatory",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                <span
                  className={`py-2 px-6 cursor-pointer rounded-full whitespace-nowrap flex items-center shadow-sm transition-all duration-300 ${
                    !selectedTopic 
                      ? "bg-gradient-to-r from-green-600 to-green-800 text-white font-medium" 
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                  onClick={() => handleTopicSelect("")}
                >
                  All Topics
                </span>
                {topics.map((title) => (
                  <span
                    key={title._id}
                    className={`py-2 px-6 cursor-pointer rounded-full whitespace-nowrap flex items-center shadow-sm transition-all duration-300 ${
                      selectedTopic === title.topic
                        ? "bg-gradient-to-r from-green-600 to-green-800 text-white font-medium"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                    onClick={() => handleTopicSelect(title.topic)}
                  >
                    {title.topic}
                  </span>
                ))}
              </div>

              <button
                onClick={scrollToNext}
                className={`absolute right-0 z-10 p-2 rounded-full bg-white shadow-md ${isAtEnd ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"} transition-all`}
                disabled={isAtEnd}
              >
                <FaChevronRight className="w-5 h-5 text-green-700" />
              </button>
            </div>
          </div>

          {/* Trending Articles Section */}
          <section className="mb-16">
            <div className="flex items-center mb-6">
              <FaFire className="text-red-500 mr-2 text-xl" />
              <h2 className="text-2xl font-bold text-gray-800">Trending Articles</h2>
              <div className="ml-4 flex-1 h-px bg-gradient-to-r from-green-400 to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {trendingblog?.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          </section>

          {/* Recent Articles Section */}
          <section>
            <div className="flex items-center mb-6">
              <FaClock className="text-blue-500 mr-2 text-xl" />
              <h2 className="text-2xl font-bold text-gray-800">Recent Articles</h2>
              <div className="ml-4 flex-1 h-px bg-gradient-to-r from-blue-400 to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {blogData?.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Ads */}
        {blogAd.length > 0 && (
          <div className="w-full md:w-1/5 p-4 md:sticky md:top-0 md:h-screen md:overflow-y-auto">
            <div className="space-y-6">
              {blogAd.map((item) => (
                <div key={item._id} className="hover:scale-[1.02] hover:shadow-lg transition-all duration-300">
                  <Link to={item.link_name}>
                    <img 
                      src={item.photo} 
                      alt="Advertisement" 
                      className="rounded-lg w-full object-cover shadow-md" 
                    />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Blog;
