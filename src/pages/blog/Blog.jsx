import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  FaChevronLeft,
  FaChevronRight,
  FaFire,
  FaClock,
  FaCalendarAlt,
  FaThLarge,
  FaList,
  FaArrowRight,
  FaUserAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";
import Api from "../../service/Api";

// Utility to cleanly decode HTML entities like &amp;, &#039;, &quot;, etc.
const decodeHtml = (html) => {
  if (!html) return "";
  try {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value.replace(/<[^>]+>/g, "").replace(/&nbsp;/gi, " ").trim();
  } catch (e) {
    return html.replace(/<[^>]+>/g, "").replace(/&nbsp;/gi, " ").trim();
  }
};

const Blog = () => {
  const [trendingblog, setTrendingBlog] = useState(null);
  const [blogData, setBlogData] = useState(null);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [seo, setSeo] = useState([]);
  const [blogAd, setBlogAd] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem("blog_view_mode") || "grid";
    } catch {
      return "grid";
    }
  });

  const navigate = useNavigate();
  const carouselRef = useRef(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    try {
      localStorage.setItem("blog_view_mode", mode);
    } catch (e) {
      // Ignore localStorage errors
    }
  };

  useEffect(() => {
    async function run() {
      try {
        const topicsRes = await Api.get(`blogs/topics`);
        setTopics(topicsRes.data);

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
        setIsAtStart(scrollLeft <= 5);
        setIsAtEnd(scrollLeft >= scrollWidth - clientWidth - 5);
      }
    };

    const carousel = carouselRef.current;
    carousel?.addEventListener("scroll", handleScroll);
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
    carouselRef.current?.scrollBy({ left: 160, behavior: "smooth" });
    setIsAtStart(false);
  };

  const scrollToPrevious = () => {
    carouselRef.current?.scrollBy({ left: -160, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Grid Card Component
  const BlogCard = ({ blog }) => {
    const titleClean = decodeHtml(blog.title);
    const descClean = decodeHtml(blog.shortDescription);

    return (
      <div
        onClick={() => navigate(`/blogdetails/${blog.link}`)}
        className="bg-white rounded-xl shadow-2xs hover:shadow-md border border-gray-100 overflow-hidden transition-all duration-300 cursor-pointer group h-full flex flex-col"
      >
        {blog.photo && (
          <div className="w-full h-44 overflow-hidden bg-gray-50 relative">
            <img
              src={blog.photo}
              alt={titleClean}
              className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            {blog.topic && (
              <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                {blog.topic}
              </span>
            )}
          </div>
        )}
        <div className="p-3.5 flex-1 flex flex-col">
          <h3 className="text-sm font-bold text-gray-800 mb-1.5 group-hover:text-green-600 transition-colors duration-300 line-clamp-2">
            {titleClean}
          </h3>
          {descClean && descClean.length > 5 && descClean !== "ss" && (
            <p className="text-gray-600 mb-2.5 text-xs flex-1 line-clamp-2 overflow-hidden leading-relaxed">
              {descClean}
            </p>
          )}
          <div className="flex items-center justify-between text-[11px] text-gray-500 mt-auto pt-2 border-t border-gray-100">
            <div className="flex items-center">
              <FaCalendarAlt className="mr-1 text-gray-400" />
              <span>
                {new Date(blog.updatedAt || blog.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            {blog.readTime && (
              <div className="flex items-center text-gray-400">
                <FaClock className="mr-1 text-[10px]" />
                <span>{blog.readTime}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // List Card Component (Compact Horizontal Layout for Maximum Screen Utilization)
  const BlogListCard = ({ blog }) => {
    const titleClean = decodeHtml(blog.title);
    const descClean = decodeHtml(blog.shortDescription);

    return (
      <div
        onClick={() => navigate(`/blogdetails/${blog.link}`)}
        className="bg-white rounded-lg shadow-2xs hover:shadow-xs border border-gray-200/90 hover:border-green-400 overflow-hidden transition-all duration-200 cursor-pointer group flex items-center gap-3 p-2 sm:p-2.5"
      >
        {blog.photo ? (
          <div className="w-20 sm:w-28 h-16 sm:h-18 flex-shrink-0 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center relative border border-gray-100">
            <img
              src={blog.photo}
              alt={titleClean}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        ) : null}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {blog.topic && (
              <span className="text-[10px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
                {blog.topic}
              </span>
            )}
            {blog.author && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-500">
                <FaUserAlt className="text-[9px] text-gray-400" />
                {blog.author}
              </span>
            )}
            <div className="flex items-center gap-1 text-[10px] text-gray-400 ml-auto sm:ml-0">
              <FaCalendarAlt className="text-[9px]" />
              <span>
                {new Date(blog.updatedAt || blog.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            {blog.readTime && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-medium text-gray-400">
                <FaClock className="text-[9px] text-blue-400" />
                {blog.readTime}
              </span>
            )}
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-200 line-clamp-1 leading-snug">
            {titleClean}
          </h3>
          {descClean && descClean.length > 5 && descClean !== "ss" && (
            <p className="text-gray-500 text-[11px] line-clamp-1 mt-0.5 leading-tight hidden sm:block">
              {descClean}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 hidden md:flex items-center pl-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-600 group-hover:translate-x-1 transition-transform">
            Read <FaArrowRight className="text-[9px]" />
          </span>
        </div>
      </div>
    );
  };

  // In-Feed Ad Banner Component for List View (Slim, Space-Saving Sponsored Banner)
  const FeedAdCard = ({ ad }) => {
    if (!ad) return null;
    const targetUrl = ad.link_name || ad.link || "#";
    const isExternal = targetUrl.startsWith("http");

    const adContent = (
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50/40 to-green-50 border border-green-200/90 rounded-lg p-2 sm:p-2.5 flex items-center justify-between gap-3 shadow-2xs hover:shadow-xs transition-all duration-200 group">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {ad.photo && (
            <div className="w-16 sm:w-20 h-12 sm:h-14 flex-shrink-0 rounded bg-white border border-green-100 overflow-hidden flex items-center justify-center shadow-2xs">
              <img
                src={ad.photo}
                alt="Advertisement"
                className="w-full h-full object-contain p-0.5 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="inline-block bg-green-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wide">
                Sponsored
              </span>
              <span className="text-[10px] text-green-700 font-semibold hidden sm:inline-flex items-center gap-1">
                ExamRally Partner <FaExternalLinkAlt className="text-[8px]" />
              </span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-1">
              Boost Your Preparation with ExamRally Test Series & Study Material
            </p>
            <p className="text-[10px] sm:text-[11px] text-gray-500 line-clamp-1 hidden sm:block">
              Top quality mock tests, live ranking, and expert curated PDF notes.
            </p>
          </div>
        </div>
        <div className="flex-shrink-0">
          <span className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-[10px] sm:text-[11px] font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md shadow-2xs transition-all whitespace-nowrap">
            Explore <FaArrowRight className="text-[8px]" />
          </span>
        </div>
      </div>
    );

    if (isExternal) {
      return (
        <a href={targetUrl} target="_blank" rel="noopener noreferrer" className="block my-1.5">
          {adContent}
        </a>
      );
    }
    return (
      <Link to={targetUrl} className="block my-1.5">
        {adContent}
      </Link>
    );
  };

  // View Mode Switcher Button Group (Compact)
  const ViewModeToggle = () => (
    <div className="flex items-center bg-gray-200/80 p-0.5 rounded-lg border border-gray-300">
      <button
        type="button"
        onClick={() => handleViewModeChange("grid")}
        title="Grid View"
        className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
          viewMode === "grid"
            ? "bg-white text-green-700 shadow-2xs"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        <FaThLarge className="text-[10px]" />
        <span>Grid</span>
      </button>
      <button
        type="button"
        onClick={() => handleViewModeChange("list")}
        title="List View"
        className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
          viewMode === "list"
            ? "bg-white text-green-700 shadow-2xs"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        <FaList className="text-[10px]" />
        <span>List</span>
      </button>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{seo[0]?.seoData?.title || "ExamRally Blog – Bank Exam Tips, Notifications & Study Material"}</title>
        <meta name="description" content={seo[0]?.seoData?.description || "Read expert articles on bank exams, SBI PO, IBPS PO, government jobs, current affairs and exam preparation tips on ExamRally Blog."} />
        <meta name="keywords" content={seo[0]?.seoData?.keywords || "bank exam blog, SBI PO notification, IBPS PO 2025, government exam tips, exam preparation articles"} />
        <link rel="canonical" href="https://examrally.in/blog" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ExamRally" />
        <meta property="og:url" content="https://examrally.in/blog" />
        <meta property="og:title" content={seo[0]?.seoData?.ogTitle || seo[0]?.seoData?.title || "ExamRally Blog"} />
        <meta property="og:description" content={seo[0]?.seoData?.ogDescription || seo[0]?.seoData?.description || "Expert articles on bank exams and government jobs."} />
        <meta property="og:image" content={seo[0]?.seoData?.ogImageUrl || "https://examrally.in/web-app-manifest-512x512.png"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo[0]?.seoData?.ogTitle || "ExamRally Blog"} />
        <meta name="twitter:description" content={seo[0]?.seoData?.ogDescription || "Expert articles on bank exams."} />
        <meta name="twitter:image" content={seo[0]?.seoData?.ogImageUrl || "https://examrally.in/web-app-manifest-512x512.png"} />
      </Helmet>

      <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen">
        <div className={`w-full ${blogAd.length > 0 ? "md:w-4/5" : "md:w-full"} px-3 py-2.5 sm:px-6 sm:py-4`}>
          {/* Topics Carousel (Compact and Space-Efficient) */}
          <div className="relative mb-3 sm:mb-4">
            <div className="flex items-center justify-center">
              <button
                onClick={scrollToPrevious}
                className={`absolute left-0 z-10 p-1 rounded-full bg-white shadow-xs border border-gray-200 ${
                  isAtStart ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100 text-green-700"
                } transition-all`}
                disabled={isAtStart}
                aria-label="Previous topics"
              >
                <FaChevronLeft className="w-3.5 h-3.5" />
              </button>

              <div
                ref={carouselRef}
                className="flex overflow-x-auto gap-2 py-1 scroll-smooth w-full px-7"
                style={{
                  scrollBehavior: "smooth",
                  scrollSnapType: "x mandatory",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                <span
                  className={`py-1 px-3.5 cursor-pointer rounded-full whitespace-nowrap text-xs flex items-center shadow-2xs transition-all duration-200 ${
                    !selectedTopic 
                      ? "bg-green-700 text-white font-semibold shadow-xs" 
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                  onClick={() => handleTopicSelect("")}
                >
                  All Topics
                </span>
                {topics.map((title) => (
                  <span
                    key={title._id}
                    className={`py-1 px-3.5 cursor-pointer rounded-full whitespace-nowrap text-xs flex items-center shadow-2xs transition-all duration-200 ${
                      selectedTopic === title.topic
                        ? "bg-green-700 text-white font-semibold shadow-xs"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                    onClick={() => handleTopicSelect(title.topic)}
                  >
                    {decodeHtml(title.topic)}
                  </span>
                ))}
              </div>

              <button
                onClick={scrollToNext}
                className={`absolute right-0 z-10 p-1 rounded-full bg-white shadow-xs border border-gray-200 ${
                  isAtEnd ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100 text-green-700"
                } transition-all`}
                disabled={isAtEnd}
                aria-label="Next topics"
              >
                <FaChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Trending Articles Section (Compact Header) */}
          {trendingblog && trendingblog.length > 0 && (
            <section className="mb-5 sm:mb-6">
              <div className="flex items-center justify-between mb-2.5 flex-wrap gap-2">
                <div className="flex items-center flex-1 min-w-[180px]">
                  <FaFire className="text-red-500 mr-1.5 text-base" />
                  <h2 className="text-base sm:text-lg font-bold text-gray-800">Trending Articles</h2>
                  <div className="ml-3 flex-1 h-px bg-gradient-to-r from-green-400/60 to-transparent hidden sm:block"></div>
                </div>
                <ViewModeToggle />
              </div>

              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                  {trendingblog.map((blog) => (
                    <BlogCard key={blog._id} blog={blog} />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {trendingblog.map((blog) => (
                    <BlogListCard key={blog._id} blog={blog} />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Recent Articles Section (Compact Header) */}
          <section className="mt-4 sm:mt-5">
            <div className="flex items-center justify-between mb-2.5 flex-wrap gap-2">
              <div className="flex items-center flex-1 min-w-[180px]">
                <FaClock className="text-blue-500 mr-1.5 text-base" />
                <h2 className="text-base sm:text-lg font-bold text-gray-800">Recent Articles</h2>
                <div className="ml-3 flex-1 h-px bg-gradient-to-r from-blue-400/60 to-transparent hidden sm:block"></div>
              </div>
              {/* Only show toggle here if trending was not present */}
              {(!trendingblog || trendingblog.length === 0) && <ViewModeToggle />}
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                {blogData?.map((blog) => (
                  <BlogCard key={blog._id} blog={blog} />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {blogData?.map((blog, idx) => {
                  // Intersect native ad cards every 5 articles in List View for high blog density
                  const showAd = blogAd.length > 0 && idx > 0 && idx % 5 === 0;
                  const adIndex = Math.floor(idx / 5) - 1;
                  const adToRender = blogAd.length > 0 ? blogAd[adIndex % blogAd.length] : null;

                  return (
                    <React.Fragment key={blog._id}>
                      {showAd && adToRender && (
                        <FeedAdCard ad={adToRender} />
                      )}
                      <BlogListCard blog={blog} />
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar Ads (Sticky Desktop Rail) */}
        {blogAd.length > 0 && (
          <div className="w-full md:w-1/5 p-3 md:sticky md:top-0 md:h-screen md:overflow-y-auto">
            <div className="space-y-4">
              {blogAd.map((item) => {
                const targetUrl = item.link_name || item.link || "#";
                const isExt = targetUrl.startsWith("http");
                return (
                  <div key={item._id} className="hover:scale-[1.02] hover:shadow-md transition-all duration-300">
                    {isExt ? (
                      <a href={targetUrl} target="_blank" rel="noopener noreferrer">
                        <img 
                          src={item.photo} 
                          alt="Advertisement" 
                          className="rounded-lg w-full object-cover shadow-sm" 
                        />
                      </a>
                    ) : (
                      <Link to={targetUrl}>
                        <img 
                          src={item.photo} 
                          alt="Advertisement" 
                          className="rounded-lg w-full object-cover shadow-sm" 
                        />
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Blog;
