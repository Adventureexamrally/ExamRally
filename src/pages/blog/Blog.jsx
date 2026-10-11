import React, { useEffect, useState, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaSortAmountDown,
  FaFire,
  FaClock,
  FaCalendarAlt,
  FaThLarge,
  FaList,
  FaArrowRight,
  FaUserAlt,
  FaExternalLinkAlt,
  FaSearch,
  FaCheck,
  FaBell,
  FaTimes,
  FaMobileAlt,
  FaBookOpen,
  FaCompass,
  FaNewspaper,
  FaChartLine,
  FaChartBar,
  FaPenNib,
  FaShieldAlt,
  FaHistory,
  FaCalculator,
  FaBrain,
  FaLaptop,
  FaUniversity,
  FaLanguage,
  FaTrophy,
  FaLayerGroup,
  FaFilter,
  FaAward,
  FaEnvelope,
  FaApple,
  FaGooglePlay,
  FaClipboardList,
  FaCut,
  FaGlobe,
  FaFileAlt,
  FaCheckCircle,
} from "react-icons/fa";
import Api from "../../service/Api";
import logoImg from "../../assets/logo/logo.webp";
import googlePlayImg from "../../assets/logo/google-play.png";
import ibpsLogo from "../../assets/logo/ibps.png";
import sbiLogo from "../../assets/logo/sbi.png";
import rrbLogo from "../../assets/logo/rrb.png";
import {
  LEFT_BANNER_THEMES,
  LEFT_BANNER_DESIGNS,
  RIGHT_BANNER_THEMES,
  RIGHT_BANNER_DESIGNS,
} from "./bannerThemes";

// Utility to cleanly decode HTML entities
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

// Map topics to representative icons
const getTopicIcon = (topicName) => {
  const lower = (topicName || "").toLowerCase();
  if (lower.includes("notification")) return <FaBell className="text-amber-500 text-xs" />;
  if (lower.includes("sucess") || lower.includes("success")) return <FaTrophy className="text-yellow-500 text-xs" />;
  if (lower.includes("current affairs")) return <FaNewspaper className="text-blue-500 text-xs" />;
  if (lower.includes("cutoff") || lower.includes("cut off")) return <FaChartBar className="text-emerald-500 text-xs" />;
  if (lower.includes("analysis")) return <FaChartLine className="text-indigo-500 text-xs" />;
  if (lower.includes("syllabus") || lower.includes("pattern")) return <FaBookOpen className="text-purple-500 text-xs" />;
  if (lower.includes("descriptive")) return <FaPenNib className="text-rose-500 text-xs" />;
  if (lower.includes("lic")) return <FaShieldAlt className="text-blue-600 text-xs" />;
  if (lower.includes("previous") || lower.includes("pyq")) return <FaHistory className="text-teal-500 text-xs" />;
  if (lower.includes("quant") || lower.includes("math")) return <FaCalculator className="text-indigo-600 text-xs" />;
  if (lower.includes("reasoning")) return <FaBrain className="text-purple-600 text-xs" />;
  if (lower.includes("english")) return <FaLanguage className="text-pink-500 text-xs" />;
  if (lower.includes("banking")) return <FaUniversity className="text-sky-600 text-xs" />;
  if (lower.includes("computer")) return <FaLaptop className="text-cyan-600 text-xs" />;
  return <FaLayerGroup className="text-green-600 text-xs" />;
};

// Map category colors
const getCategoryStyle = (topic) => {
  const lower = (topic || "").toLowerCase();
  if (lower.includes("cutoff") || lower.includes("cut off")) {
    return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" };
  }
  if (lower.includes("notification")) {
    return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" };
  }
  if (lower.includes("previous")) {
    return { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" };
  }
  if (lower.includes("reasoning") || lower.includes("quant")) {
    return { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" };
  }
  return { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" };
};

const rankColors = [
  { bg: "bg-red-500", text: "text-white", border: "border-red-600" },
  { bg: "bg-blue-600", text: "text-white", border: "border-blue-700" },
  { bg: "bg-emerald-600", text: "text-white", border: "border-emerald-700" },
  { bg: "bg-amber-500", text: "text-white", border: "border-amber-600" },
];

const POPULAR_TOPICS_LIST = [
  { id: "ibps-po", name: "IBPS PO", iconType: "ibps", color: "text-blue-700", type: "exam" },
  { id: "ibps-clerk", name: "IBPS Clerk", iconType: "ibps", color: "text-green-700", type: "exam" },
  { id: "sbi-po", name: "SBI PO", iconType: "sbi", color: "text-blue-800", type: "exam" },
  { id: "sbi-clerk", name: "SBI Clerk", iconType: "sbi", color: "text-blue-800", type: "exam" },
  { id: "ibps-rrb-po", name: "IBPS RRB PO", iconType: "rrb", color: "text-purple-700", type: "exam" },
  { id: "ibps-rrb-clerk", name: "IBPS RRB Clerk", iconType: "rrb", color: "text-emerald-700", type: "exam" },
  { id: "rbi-assistant", name: "RBI Assistant", iconType: "rbi", color: "text-purple-700", type: "exam" },
  { id: "lic-aao", name: "LIC AAO", iconType: "lic", color: "text-blue-700", type: "exam" },
  { id: "syllabus", name: "Syllabus", iconType: "syllabus", color: "text-purple-700", type: "topic" },
  { id: "exam-pattern", name: "Exam Pattern", iconType: "pattern", color: "text-cyan-700", type: "topic" },
  { id: "cut-off", name: "Cut Off", iconType: "cutoff", color: "text-amber-700", type: "topic" },
  { id: "current-affairs", name: "Current Affairs", iconType: "ca", color: "text-rose-700", type: "topic" },
];

const renderPopularTopicIcon = (item) => {
  if (item.iconType === "ibps") {
    return <img src={ibpsLogo} alt={item.name} className="w-3.5 h-3.5 object-contain" />;
  }
  if (item.iconType === "sbi") {
    return <img src={sbiLogo} alt={item.name} className="w-3.5 h-3.5 object-contain" />;
  }
  if (item.iconType === "rrb") {
    return <img src={rrbLogo} alt={item.name} className="w-3.5 h-3.5 object-contain" />;
  }
  if (item.iconType === "rbi") {
    return <FaUniversity className="text-purple-700 text-xs" />;
  }
  if (item.iconType === "lic") {
    return <FaShieldAlt className="text-blue-700 text-xs" />;
  }
  if (item.iconType === "syllabus") {
    return <FaBookOpen className="text-purple-600 text-xs" />;
  }
  if (item.iconType === "pattern") {
    return <FaClipboardList className="text-cyan-600 text-xs" />;
  }
  if (item.iconType === "cutoff") {
    return <FaCut className="text-amber-500 text-xs" />;
  }
  if (item.iconType === "ca") {
    return <FaGlobe className="text-rose-500 text-xs" />;
  }
  return <FaLayerGroup className="text-green-600 text-xs" />;
};

const renderBlogThumbnail = (blog, titleClean) => {
  const lower = (titleClean + " " + (blog.topic || "")).toLowerCase();
  let bgGradient = "from-sky-700 via-blue-800 to-indigo-950";
  let badgeText = blog.topic || "NOTIFICATION";
  let badgeBg = "bg-amber-400 text-slate-900";
  let icon = <FaBell className="text-amber-300 text-base" />;

  if (lower.includes("cutoff") || lower.includes("cut off")) {
    bgGradient = "from-teal-700 via-emerald-800 to-slate-900";
    badgeText = "CUT OFF";
    badgeBg = "bg-emerald-400 text-emerald-950";
    icon = <FaChartBar className="text-emerald-300 text-base" />;
  } else if (lower.includes("previous") || lower.includes("pyq")) {
    bgGradient = "from-slate-800 via-blue-900 to-indigo-950";
    badgeText = "PREVIOUS YEAR";
    badgeBg = "bg-amber-400 text-slate-900";
    icon = <FaBookOpen className="text-amber-300 text-base" />;
  } else if (lower.includes("weightage") || lower.includes("analysis")) {
    bgGradient = "from-blue-700 via-sky-800 to-slate-900";
    badgeText = "EXAM ANALYSIS";
    badgeBg = "bg-sky-400 text-slate-950";
    icon = <FaChartLine className="text-sky-300 text-base" />;
  } else if (lower.includes("clerk")) {
    bgGradient = "from-indigo-900 via-blue-950 to-slate-950";
    badgeText = "NOTIFICATION";
    badgeBg = "bg-blue-400 text-blue-950";
    icon = <FaAward className="text-yellow-300 text-base" />;
  }

  return (
    <div className={`w-full h-full bg-gradient-to-br ${bgGradient} p-2.5 flex flex-col justify-between relative overflow-hidden select-none`}>
      <div className="flex items-center justify-between z-10">
        <span className={`text-[8.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded shadow-xs ${badgeBg}`}>
          {badgeText}
        </span>
        <div className="opacity-90">{icon}</div>
      </div>
      <p className="text-white text-[10.5px] font-bold line-clamp-2 leading-snug drop-shadow-xs z-10">
        {titleClean}
      </p>
      <div className="absolute -right-3 -bottom-3 w-14 h-14 bg-white/5 rounded-full blur-xs pointer-events-none" />
    </div>
  );
};

const Blog = () => {
  const [trendingblog, setTrendingBlog] = useState([]);
  const [blogData, setBlogData] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [popularExams, setPopularExams] = useState([]);
  const [seo, setSeo] = useState([]);
  const [blogAd, setBlogAd] = useState([]);
  const [heroBanner, setHeroBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sortOption, setSortOption] = useState("latest"); // 'latest' | 'oldest'
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'

  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem("blog_view_mode") || "list";
    } catch {
      return "list";
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
      // Ignore
    }
  };

  // Synchronized active banner themes across the entire blog page
  const activeLeftTheme = useMemo(() => {
    return LEFT_BANNER_THEMES[heroBanner?.leftBanner?.colorTheme] || LEFT_BANNER_THEMES.emerald;
  }, [heroBanner?.leftBanner?.colorTheme]);

  const activeLeftDesign = useMemo(() => {
    return LEFT_BANNER_DESIGNS[heroBanner?.leftBanner?.designStyle] || LEFT_BANNER_DESIGNS.classic;
  }, [heroBanner?.leftBanner?.designStyle]);

  const activeRightTheme = useMemo(() => {
    return RIGHT_BANNER_THEMES[heroBanner?.rightBanner?.colorTheme] || RIGHT_BANNER_THEMES.forest;
  }, [heroBanner?.rightBanner?.colorTheme]);

  const activeRightDesign = useMemo(() => {
    return RIGHT_BANNER_DESIGNS[heroBanner?.rightBanner?.designStyle] || RIGHT_BANNER_DESIGNS.classic;
  }, [heroBanner?.rightBanner?.designStyle]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [topicsRes, trendingRes, blogsRes, seoRes, adRes, examsRes, bannerRes] = await Promise.allSettled([
          Api.get("blogs/topics"),
          Api.get("blogs/all?trending=true"),
          Api.get("blogs/all"),
          Api.get("/get-Specific-page/blog"),
          Api.get("blog-Ad/getbypage/blog"),
          Api.get("/packages/get/active"),
          Api.get("/blog-banner"),
        ]);

        if (topicsRes.status === "fulfilled" && topicsRes.value.data) {
          setTopics(topicsRes.value.data);
        }
        if (trendingRes.status === "fulfilled" && trendingRes.value.data) {
          setTrendingBlog(trendingRes.value.data);
        }
        if (blogsRes.status === "fulfilled" && blogsRes.value.data) {
          setBlogData(blogsRes.value.data);
        }
        if (seoRes.status === "fulfilled" && seoRes.value.data) {
          setSeo(seoRes.value.data);
        }
        if (adRes.status === "fulfilled" && Array.isArray(adRes.value.data)) {
          setBlogAd(adRes.value.data);
        }
        if (examsRes.status === "fulfilled" && examsRes.value.data) {
          setPopularExams(examsRes.value.data);
        }
        if (bannerRes.status === "fulfilled" && bannerRes.value.data) {
          setHeroBanner(bannerRes.value.data);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    }

    fetchData();

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

  const handleTopicSelect = async (topicName) => {
    setSelectedTopic(topicName);
    setSelectedExam(""); // Reset exam filter when topic clicked
    if (!topicName) {
      try {
        const response = await Api.get("blogs/all");
        setBlogData(response.data);
      } catch (err) {
        console.error(err);
      }
      return;
    }

    try {
      const response = await Api.get(`blogs/all?topic=${encodeURIComponent(topicName)}`);
      if (response.data && response.data.length > 0) {
        setBlogData(response.data);
      } else {
        // Fallback filter
        const all = await Api.get("blogs/all");
        const filtered = all.data.filter((b) => (b.topic || "").toLowerCase() === topicName.toLowerCase());
        setBlogData(filtered.length > 0 ? filtered : all.data);
      }
    } catch (error) {
      console.error("Error fetching blogs by topic:", error);
    }
  };

  const handleExamClick = (exam) => {
    const examClean = exam.name.trim();
    if (selectedExam === examClean) {
      setSelectedExam("");
      return;
    }
    setSelectedExam(examClean);
    setSelectedTopic(""); // clear topic filter
  };

  const scrollToNext = () => {
    carouselRef.current?.scrollBy({ left: 220, behavior: "smooth" });
    setIsAtStart(false);
  };

  const scrollToPrevious = () => {
    carouselRef.current?.scrollBy({ left: -220, behavior: "smooth" });
  };

  // Filter and sort blogs
  const filteredAndSortedBlogs = useMemo(() => {
    if (!blogData) return [];
    let list = [...blogData];

    // Filter by selected exam
    if (selectedExam) {
      const query = selectedExam.toLowerCase();
      list = list.filter((b) => {
        const t = (b.title || "").toLowerCase();
        const d = (b.shortDescription || "").toLowerCase();
        const top = (b.topic || "").toLowerCase();
        return t.includes(query) || d.includes(query) || top.includes(query);
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      list = list.filter((b) => {
        const t = (b.title || "").toLowerCase();
        const d = (b.shortDescription || "").toLowerCase();
        const top = (b.topic || "").toLowerCase();
        return t.includes(query) || d.includes(query) || top.includes(query);
      });
    }

    // Sort
    list.sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return sortOption === "latest" ? dateB - dateA : dateA - dateB;
    });

    return list;
  }, [blogData, selectedExam, searchQuery, sortOption]);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      setNewsletterStatus("error");
      return;
    }
    setNewsletterStatus("loading");
    setTimeout(() => {
      setNewsletterStatus("success");
      setNewsletterEmail("");
    }, 800);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Rank badge styling for 4 trending cards
  const rankColors = [
    { bg: "bg-red-500", text: "text-white", border: "border-red-400" },
    { bg: "bg-blue-600", text: "text-white", border: "border-blue-400" },
    { bg: "bg-emerald-600", text: "text-white", border: "border-emerald-400" },
    { bg: "bg-amber-500", text: "text-white", border: "border-amber-400" },
  ];

  return (
    <>
      <Helmet>
        <title>{seo[0]?.seoData?.title || "ExamRally Blog – Bank Exam Tips, Notifications & Study Material"}</title>
        <meta
          name="description"
          content={
            seo[0]?.seoData?.description ||
            "Read expert articles on bank exams, SBI PO, IBPS PO, government jobs, current affairs and exam preparation tips on ExamRally Blog."
          }
        />
        <meta
          name="keywords"
          content={
            seo[0]?.seoData?.keywords ||
            "bank exam blog, SBI PO notification, IBPS PO 2026, government exam tips, exam preparation articles"
          }
        />
        <link rel="canonical" href="https://examrally.in/blog" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ExamRally" />
        <meta property="og:url" content="https://examrally.in/blog" />
        <meta property="og:title" content={seo[0]?.seoData?.ogTitle || seo[0]?.seoData?.title || "ExamRally Blog"} />
        <meta
          property="og:description"
          content={seo[0]?.seoData?.ogDescription || seo[0]?.seoData?.description || "Expert articles on bank exams and government jobs."}
        />
        <meta
          property="og:image"
          content={seo[0]?.seoData?.ogImageUrl || "https://examrally.in/web-app-manifest-512x512.png"}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo[0]?.seoData?.ogTitle || "ExamRally Blog"} />
        <meta name="twitter:description" content={seo[0]?.seoData?.ogDescription || "Expert articles on bank exams."} />
        <meta
          name="twitter:image"
          content={seo[0]?.seoData?.ogImageUrl || "https://examrally.in/web-app-manifest-512x512.png"}
        />
      </Helmet>

      <div className="bg-[#f8fafc] min-h-screen pb-16 font-inter font-sans">
        {/* Top Topic Carousel Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-2xs">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 py-1 sm:py-2 flex items-center gap-2">
            {/* Scroll Previous */}
            <button
              onClick={scrollToPrevious}
              className={`p-1.5 rounded-full bg-white shadow-xs border border-gray-200 flex-shrink-0 transition-all ${isAtStart ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100 text-gray-700"
                }`}
              disabled={isAtStart}
              aria-label="Previous topics"
            >
              <FaChevronLeft className="w-3.5 h-3.5" />
            </button>

            {/* Topics Horizontal List */}
            <div
              ref={carouselRef}
              className="flex overflow-x-auto gap-2 py-1 scroll-smooth w-full no-scrollbar items-center"
              style={{
                scrollBehavior: "smooth",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <button
                onClick={() => handleTopicSelect("")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full whitespace-nowrap text-xs font-semibold transition-all duration-200 ${!selectedTopic && !selectedExam
                  ? "bg-green-700 text-white shadow-xs"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                  }`}
              >
                <FaLayerGroup className="text-xs" />
                <span>All Topics</span>
              </button>

              {topics.map((t) => {
                const topicName = t.topic;
                const isSelected = selectedTopic === topicName;
                return (
                  <button
                    key={t._id}
                    onClick={() => handleTopicSelect(topicName)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full whitespace-nowrap text-xs font-semibold transition-all duration-200 ${isSelected
                      ? "bg-green-700 text-white shadow-xs"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                      }`}
                  >
                    {getTopicIcon(topicName)}
                    <span>{decodeHtml(topicName)}</span>
                  </button>
                );
              })}
            </div>

            {/* Scroll Next */}
            <button
              onClick={scrollToNext}
              className={`p-1.5 rounded-full bg-white shadow-xs border border-gray-200 flex-shrink-0 transition-all ${isAtEnd ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100 text-gray-700"
                }`}
              disabled={isAtEnd}
              aria-label="Next topics"
            >
              <FaChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Search Trigger */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`p-2 rounded-full border transition-all ${isSearchOpen
                  ? "bg-green-700 text-white border-green-700"
                  : "bg-white text-gray-600 hover:text-green-700 border-gray-200 hover:bg-gray-50 shadow-2xs"
                  }`}
                title="Search Articles"
              >
                <FaSearch className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Expandable Search Input */}
          {isSearchOpen && (
            <div className="border-t border-gray-100 bg-gray-50/90 py-2.5 px-4 animate-in fade-in duration-200">
              <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 flex items-center gap-2">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    placeholder="Search articles by title, exam, or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 shadow-2xs"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="text-xs font-semibold text-gray-600 hover:text-gray-900 px-3 py-2"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Main Content Container - Centered with margins on both sides */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 mt-1 sm:mt-3">
          {/* Dual Hero Banners (Left: Bank Exam Mock Test Series | Right: Rally PDF Course) */}
          {heroBanner?.status !== "INACTIVE" && (heroBanner?.leftBanner?.enabled !== false || heroBanner?.rightBanner?.enabled !== false) && (() => {
            const activeLeftTheme = LEFT_BANNER_THEMES[heroBanner?.leftBanner?.colorTheme] || LEFT_BANNER_THEMES.emerald;
            const activeLeftDesign = LEFT_BANNER_DESIGNS[heroBanner?.leftBanner?.designStyle] || LEFT_BANNER_DESIGNS.classic;
            const activeRightTheme = RIGHT_BANNER_THEMES[heroBanner?.rightBanner?.colorTheme] || RIGHT_BANNER_THEMES.forest;
            const activeRightDesign = RIGHT_BANNER_DESIGNS[heroBanner?.rightBanner?.designStyle] || RIGHT_BANNER_DESIGNS.classic;

            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 mb-1">
                {/* Left Banner: Mock Test Series */}
                {heroBanner?.leftBanner?.enabled !== false && (
                  <div
                    className={`${heroBanner?.rightBanner?.enabled === false ? "lg:col-span-12" : "lg:col-span-8 xl:col-span-9"
                      } ${activeLeftTheme.containerBg} ${activeLeftTheme.border} ${activeLeftDesign.wrapperClass} p-3.5 sm:p-4.5 lg:p-5 relative overflow-hidden flex flex-col justify-between`}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-center relative z-10">
                      {/* Left Column: Heading, features & CTA */}
                      <div className={`${heroBanner?.leftBanner?.showTargetExams !== false ? "lg:col-span-7 xl:col-span-7" : "lg:col-span-12"} space-y-2`}>
                        <div className={`inline-block ${activeLeftTheme.badge} text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs`}>
                          {heroBanner?.leftBanner?.badge || "BANK EXAM"}
                        </div>
                        <h1 className={`text-xl sm:text-2xl font-black ${activeLeftTheme.textColor} tracking-tight leading-tight`}>
                          MOCK TEST <span className={activeLeftTheme.titleHighlight}>SERIES</span>
                        </h1>
                        <p className={`${activeLeftTheme.subtitleColor} text-xs font-medium`}>
                          {heroBanner?.leftBanner?.subtitle || "Practice with Real Exam Level Questions"}
                        </p>

                        {/* Features 2-column checklist */}
                        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1 py-0.5 ${activeLeftTheme.featuresColor} text-[11px] font-semibold`}>
                          {(heroBanner?.leftBanner?.features && heroBanner.leftBanner.features.length > 0
                            ? heroBanner.leftBanner.features
                            : [
                              "Prelims & Mains Tests",
                              "Topic-wise & Sectional Tests",
                              "All India Ranking",
                              "Detailed Solutions & Analysis",
                            ]
                          ).map((feat, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                              <span className={`w-3.5 h-3.5 rounded-full ${activeLeftTheme.checkmark} flex items-center justify-center text-[8px] flex-shrink-0`}>
                                ✓
                              </span>
                              <span className="truncate">{feat}</span>
                            </div>
                          ))}
                        </div>

                        {/* CTA Button */}
                        <div className="pt-1.5">
                          <Link
                            to={heroBanner?.leftBanner?.buttonLink || "/subscriptions"}
                            className={`inline-flex items-center gap-1.5 ${activeLeftTheme.button} text-xs font-bold px-4 py-1.5 rounded-full hover:shadow transition-all duration-200`}
                          >
                            <span>{heroBanner?.leftBanner?.buttonText || "Explore Mock Test Series"}</span>
                            <FaArrowRight className="text-[10px]" />
                          </Link>
                        </div>
                      </div>

                      {/* Right Column: Floating Target Bank Exams Showcase Card */}
                      {heroBanner?.leftBanner?.showTargetExams !== false && (
                        <div className="lg:col-span-5 xl:col-span-5 flex justify-center lg:justify-end">
                          <div className={`w-full max-w-sm ${activeLeftTheme.examCardBg} backdrop-blur-xs border ${activeLeftTheme.examCardBorder} rounded-xl p-2.5 sm:p-3 shadow-2xs`}>
                            {/* 8 Exam Logo Grid (2 rows x 4 cols) */}
                            <div className="grid grid-cols-4 gap-1.5 text-center mb-2">
                              <div className="p-1 rounded-md bg-slate-50/90 hover:bg-emerald-50/60 border border-slate-100 transition flex flex-col items-center justify-center">
                                <div className="w-4 h-4 flex items-center justify-center mb-0.5">
                                  <img src={ibpsLogo} alt="IBPS" className="w-3.5 h-3.5 object-contain" />
                                </div>
                                <span className="text-[8.5px] font-bold text-slate-800 leading-tight">IBPS PO</span>
                              </div>

                              <div className="p-1 rounded-md bg-slate-50/90 hover:bg-emerald-50/60 border border-slate-100 transition flex flex-col items-center justify-center">
                                <div className="w-4 h-4 flex items-center justify-center mb-0.5">
                                  <img src={ibpsLogo} alt="IBPS" className="w-3.5 h-3.5 object-contain" />
                                </div>
                                <span className="text-[8.5px] font-bold text-slate-800 leading-tight">IBPS Clerk</span>
                              </div>

                              <div className="p-1 rounded-md bg-slate-50/90 hover:bg-emerald-50/60 border border-slate-100 transition flex flex-col items-center justify-center">
                                <div className="w-4 h-4 flex items-center justify-center mb-0.5">
                                  <img src={sbiLogo} alt="SBI" className="w-3.5 h-3.5 object-contain" />
                                </div>
                                <span className="text-[8.5px] font-bold text-slate-800 leading-tight">SBI PO</span>
                              </div>

                              <div className="p-1 rounded-md bg-slate-50/90 hover:bg-emerald-50/60 border border-slate-100 transition flex flex-col items-center justify-center">
                                <div className="w-4 h-4 flex items-center justify-center mb-0.5">
                                  <img src={sbiLogo} alt="SBI" className="w-3.5 h-3.5 object-contain" />
                                </div>
                                <span className="text-[8.5px] font-bold text-slate-800 leading-tight">SBI Clerk</span>
                              </div>

                              <div className="p-1 rounded-md bg-slate-50/90 hover:bg-emerald-50/60 border border-slate-100 transition flex flex-col items-center justify-center">
                                <div className="w-4 h-4 flex items-center justify-center mb-0.5">
                                  <img src={rrbLogo} alt="RRB" className="w-3.5 h-3.5 object-contain" />
                                </div>
                                <span className="text-[8.5px] font-bold text-slate-800 leading-tight">RRB PO</span>
                              </div>

                              <div className="p-1 rounded-md bg-slate-50/90 hover:bg-emerald-50/60 border border-slate-100 transition flex flex-col items-center justify-center">
                                <div className="w-4 h-4 flex items-center justify-center mb-0.5">
                                  <img src={rrbLogo} alt="RRB" className="w-3.5 h-3.5 object-contain" />
                                </div>
                                <span className="text-[8.5px] font-bold text-slate-800 leading-tight">RRB Clerk</span>
                              </div>

                              <div className="p-1 rounded-md bg-slate-50/90 hover:bg-emerald-50/60 border border-slate-100 transition flex flex-col items-center justify-center">
                                <div className="w-4 h-4 flex items-center justify-center mb-0.5 text-purple-700">
                                  <FaUniversity className="text-[11px]" />
                                </div>
                                <span className="text-[8.5px] font-bold text-slate-800 leading-tight">RBI Asst</span>
                              </div>

                              <div className="p-1 rounded-md bg-slate-50/90 hover:bg-emerald-50/60 border border-slate-100 transition flex flex-col items-center justify-center">
                                <div className="w-4 h-4 flex items-center justify-center mb-0.5 text-blue-700">
                                  <FaShieldAlt className="text-[11px]" />
                                </div>
                                <span className="text-[8.5px] font-bold text-slate-800 leading-tight">LIC AAO</span>
                              </div>
                            </div>

                            {/* 4 Feature Pills in a row */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 pt-1.5 border-t border-slate-100 text-[8px] text-slate-600 font-semibold text-center">
                              <div className="p-1 rounded bg-slate-50 border border-slate-100 flex items-center justify-center gap-1">
                                <FaBookOpen className="text-emerald-600 text-[7px]" />
                                <span className="truncate">Pattern</span>
                              </div>
                              <div className="p-1 rounded bg-slate-50 border border-slate-100 flex items-center justify-center gap-1">
                                <FaLaptop className="text-blue-600 text-[7px]" />
                                <span className="truncate">Interface</span>
                              </div>
                              <div className="p-1 rounded bg-slate-50 border border-slate-100 flex items-center justify-center gap-1">
                                <FaChartBar className="text-green-600 text-[7px]" />
                                <span className="truncate">3 Levels</span>
                              </div>
                              <div className="p-1 rounded bg-slate-50 border border-slate-100 flex items-center justify-center gap-1">
                                <FaPenNib className="text-amber-500 text-[7px]" />
                                <span className="truncate">Solutions</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Right Banner: Rally PDF Course */}
                {heroBanner?.rightBanner?.enabled !== false && (
                  <div
                    className={`${heroBanner?.leftBanner?.enabled === false ? "lg:col-span-12" : "lg:col-span-4 xl:col-span-3"
                      } ${activeRightTheme.containerBg} ${activeRightTheme.border} ${activeRightDesign.wrapperClass} p-3 sm:p-4 ${activeRightTheme.textColor} relative overflow-hidden flex flex-col justify-between`}
                  >
                    {heroBanner?.leftBanner?.enabled === false ? (
                      /* Wide layout when only Right Banner is enabled */
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        <div className="md:col-span-7 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className={`${activeRightTheme.badge} text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider`}>
                              {heroBanner?.rightBanner?.badge || "365 DAYS"}
                            </span>
                            <div className="bg-red-600 text-white font-black px-2 py-0.5 rounded-md text-[11px]">
                              Starts @ ₹{heroBanner?.rightBanner?.priceTag || "365"} Only
                            </div>
                          </div>

                          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                            {heroBanner?.rightBanner?.title || "RALLY PDF COURSE"}
                          </h2>
                          <p className={`${activeRightTheme.featuresColor} text-xs font-medium`}>
                            {heroBanner?.rightBanner?.subtitle || "Complete Preparation for Bank Exams"}
                          </p>

                          <div className="pt-1.5">
                            <Link
                              to={heroBanner?.rightBanner?.buttonLink || "/pdf-course"}
                              className={`inline-flex items-center gap-1.5 ${activeRightTheme.button} font-bold text-xs px-4 py-1.5 rounded-full shadow-xs transition-all duration-200`}
                            >
                              <span>{heroBanner?.rightBanner?.buttonText || "View 365 Days Course"}</span>
                              <FaArrowRight className="text-[10px]" />
                            </Link>
                          </div>
                        </div>

                        <div className="md:col-span-5 bg-white/10 backdrop-blur-xs border border-white/20 rounded-xl p-3">
                          <div className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider mb-2">
                            Course Features Included:
                          </div>
                          <div className={`space-y-1.5 text-[11px] ${activeRightTheme.featuresColor}`}>
                            {(heroBanner?.rightBanner?.features || []).map((feat, i) => (
                              <div key={i} className="flex items-center gap-1.5">
                                <span className={`w-3.5 h-3.5 rounded-full ${activeRightTheme.checkmark} flex items-center justify-center text-[8px] font-black flex-shrink-0`}>
                                  ✓
                                </span>
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Normal 4-col layout matching mockup */
                      <>
                        <div>
                          <div className="mb-1.5">
                            <span className={`${activeRightTheme.badge} text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider`}>
                              {heroBanner?.rightBanner?.badge || "365 DAYS"}
                            </span>
                          </div>

                          <h2 className="text-base sm:text-lg font-black text-white tracking-wide leading-tight">
                            {heroBanner?.rightBanner?.title || "RALLY PDF COURSE"}
                          </h2>
                          <div className={`inline-block ${activeRightTheme.subtitlePill} text-[9px] font-semibold px-2 py-0.5 rounded-full mt-1`}>
                            {heroBanner?.rightBanner?.subtitle || "Complete Preparation for Bank Exams"}
                          </div>

                          {/* Middle row: Checklist on left, 3D books on right */}
                          <div className="flex items-center justify-between gap-2 my-2">
                            <div className={`space-y-1 text-[10px] ${activeRightTheme.featuresColor} flex-1 min-w-0`}>
                              {(heroBanner?.rightBanner?.features && heroBanner.rightBanner.features.length > 0
                                ? heroBanner.rightBanner.features
                                : [
                                  "Daily Study Plan (365 Days)",
                                  "Topic-wise PDFs",
                                  "Questions with Solutions",
                                  "Covers Prelims & Mains",
                                  "Updated as per Pattern",
                                ]
                              ).map((feat, i) => (
                                <div key={i} className="flex items-center gap-1 min-w-0">
                                  <span className={`w-3 h-3 rounded-full ${activeRightTheme.checkmark} flex items-center justify-center text-[7px] font-black flex-shrink-0`}>
                                    ✓
                                  </span>
                                  <span className="font-medium leading-tight truncate">{feat}</span>
                                </div>
                              ))}
                            </div>

                            {/* 3D PDF Books Stack + Starts @ ₹365 Badge */}
                            <div className="relative w-16 sm:w-20 flex-shrink-0 flex items-center justify-center">
                              <img
                                src="/pdf-course-books.png"
                                alt="Rally PDF Course"
                                className="w-full h-16 sm:h-20 object-contain rounded-lg drop-shadow-md"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                              />
                              <div className="absolute -bottom-1 -left-1 bg-red-600 text-white font-black text-center px-1.5 py-0.5 rounded shadow-md border border-white/20 leading-tight">
                                <span className="text-[6px] uppercase block opacity-90 leading-none">Starts @</span>
                                <span className="text-[11px] font-black block leading-tight">₹{heroBanner?.rightBanner?.priceTag || "365"}</span>
                                <span className="text-[5px] uppercase block opacity-90 leading-none">Only</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Button */}
                        <div className="pt-1">
                          <Link
                            to={heroBanner?.rightBanner?.buttonLink || "/pdf-course"}
                            className={`w-full ${activeRightTheme.button} font-bold text-xs py-1.5 rounded-full flex items-center justify-center gap-1.5 shadow-xs transition-all duration-200`}
                          >
                            <span>{heroBanner?.rightBanner?.buttonText || "View 365 Days Course"}</span>
                            <FaArrowRight className="text-[10px]" />
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Two Columns: Left Stream (Trending + Recent) + Right Sidebar (Dedicated Ads & Promos) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-2 items-start">
            {/* Left Column: Trending Articles + Recent Articles */}
            <div className="lg:col-span-8 xl:col-span-9 space-y-6">
              {/* Trending Articles Section */}
              {trendingblog && trendingblog.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-2.5">
                    <FaFire className="text-red-500 text-base" />
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">Trending Articles</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {trendingblog.slice(0, 3).map((blog, idx) => {
                      const titleClean = decodeHtml(blog.title);
                      const rank = rankColors[idx] || rankColors[0];
                      const categoryStyle = getCategoryStyle(blog.topic);

                      return (
                        <div
                          key={blog._id}
                          onClick={() => navigate(`/blogdetails/${blog.link}`)}
                          className="bg-white rounded-xl border border-gray-200/90 hover:border-emerald-500 shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer group flex flex-col overflow-hidden"
                        >
                          {/* Top Graphical Visual with Rank Badge */}
                          <div className="h-28 sm:h-30 bg-slate-100 relative overflow-hidden flex items-center justify-center p-2.5">
                            {blog.photo ? (
                              <img
                                src={blog.photo}
                                alt={titleClean}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = "https://examrally.in/web-app-manifest-512x512.png";
                                }}
                              />
                            ) : (
                              <div className="text-center p-2">
                                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest block mb-1">
                                  {blog.topic || "Exam Update"}
                                </span>
                                <p className="text-slate-800 text-xs font-bold line-clamp-2 leading-snug">
                                  {titleClean}
                                </p>
                              </div>
                            )}

                            {/* Rank Badge Circle */}
                            <div
                              className={`absolute top-2 left-2 w-6 h-6 rounded-full ${rank.bg} ${rank.text} flex items-center justify-center font-black text-xs shadow-md border ${rank.border}`}
                            >
                              {idx + 1}
                            </div>
                          </div>

                          {/* Card Content */}
                          <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between text-[11px] mb-1.5">
                                {blog.topic && (
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}
                                  >
                                    {decodeHtml(blog.topic)}
                                  </span>
                                )}
                                <div className="flex items-center gap-1 text-gray-400 text-[10px]">
                                  <FaCalendarAlt className="text-[9px]" />
                                  <span>
                                    {new Date(blog.updatedAt || blog.createdAt).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </span>
                                </div>
                              </div>

                              <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#16a34a] line-clamp-2 transition-colors duration-200 leading-snug mt-1">
                                {titleClean}
                              </h3>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Recent Articles Stream */}
              <div>
                {/* Header with Sort and Grid/List toggle */}
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2 pb-2 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <FaBookOpen className="text-blue-600 text-lg" />
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900">Recent Articles</h2>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {/* Modern Sort Dropdown */}
                    <div className="relative" ref={sortRef}>
                      <button
                        type="button"
                        onClick={() => setIsSortOpen((prev) => !prev)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border rounded-lg text-xs font-semibold shadow-2xs transition-all cursor-pointer ${
                          isSortOpen
                            ? "border-emerald-500 ring-2 ring-emerald-500/15 text-emerald-700"
                            : "border-gray-200 text-gray-700 hover:text-gray-900 hover:border-gray-300"
                        }`}
                        aria-expanded={isSortOpen}
                        aria-label="Sort articles"
                      >
                        <FaSortAmountDown className="text-emerald-600 text-[11px]" />
                        <span>{sortOption === "latest" ? "Latest First" : "Oldest First"}</span>
                        <FaChevronDown
                          className={`text-[9px] text-gray-400 transition-transform duration-200 ${
                            isSortOpen ? "rotate-180 text-emerald-600" : ""
                          }`}
                        />
                      </button>

                      {isSortOpen && (
                        <div className="absolute right-0 top-full mt-1.5 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-30 animate-in fade-in zoom-in-95">
                          <button
                            type="button"
                            onClick={() => {
                              setSortOption("latest");
                              setIsSortOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors cursor-pointer ${
                              sortOption === "latest"
                                ? "bg-emerald-50 text-emerald-700 font-bold"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                          >
                            <span>Latest First</span>
                            {sortOption === "latest" && (
                              <FaCheck className="text-[10px] text-emerald-600" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSortOption("oldest");
                              setIsSortOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors cursor-pointer ${
                              sortOption === "oldest"
                                ? "bg-emerald-50 text-emerald-700 font-bold"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                          >
                            <span>Oldest First</span>
                            {sortOption === "oldest" && (
                              <FaCheck className="text-[10px] text-emerald-600" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* View Switcher: Grid vs List */}
                    <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => handleViewModeChange("grid")}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all ${viewMode === "grid"
                          ? "bg-blue-600 text-white shadow-xs"
                          : "text-gray-600 hover:text-gray-900"
                          }`}
                      >
                        <FaThLarge className="text-[10px]" />
                        <span>Grid</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleViewModeChange("list")}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all ${viewMode === "list"
                          ? "bg-blue-600 text-white shadow-xs"
                          : "text-gray-600 hover:text-gray-900"
                          }`}
                      >
                        <FaList className="text-[10px]" />
                        <span>List</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Active Filter Indicators */}
                {(selectedTopic || selectedExam || searchQuery) && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2 mb-4 flex items-center justify-between text-xs text-emerald-800">
                    <div className="flex items-center gap-2 flex-wrap">
                      <FaFilter className="text-emerald-600" />
                      <span>
                        Filtered by:{" "}
                        <strong className="font-bold">
                          {selectedExam ? `Exam: ${selectedExam}` : selectedTopic ? `Topic: ${selectedTopic}` : `"${searchQuery}"`}
                        </strong>
                      </span>
                      <span className="text-emerald-600">({filteredAndSortedBlogs.length} results)</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedTopic("");
                        setSelectedExam("");
                        setSearchQuery("");
                        handleTopicSelect("");
                      }}
                      className="font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 hover:underline"
                    >
                      Clear Filter <FaTimes className="text-[10px]" />
                    </button>
                  </div>
                )}

                {/* Article List or Grid */}
                {filteredAndSortedBlogs.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <p className="text-gray-500 text-sm">No articles found matching your criteria.</p>
                    <button
                      onClick={() => {
                        setSelectedTopic("");
                        setSelectedExam("");
                        setSearchQuery("");
                        handleTopicSelect("");
                      }}
                      className="mt-3 text-xs font-bold text-green-700 hover:underline"
                    >
                      View All Articles
                    </button>
                  </div>
                ) : viewMode === "list" ? (
                  <div className="space-y-3">
                    {filteredAndSortedBlogs.map((blog, idx) => {
                      const titleClean = decodeHtml(blog.title);
                      const descClean = decodeHtml(blog.shortDescription);
                      const categoryStyle = getCategoryStyle(blog.topic);

                      return (
                        <div
                          key={blog._id}
                          onClick={() => navigate(`/blogdetails/${blog.link}`)}
                          className="bg-white rounded-xl border border-gray-200/90 hover:border-emerald-500 shadow-2xs hover:shadow-xs p-3 sm:p-3.5 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 transition-all duration-200 group cursor-pointer"
                        >
                          {/* Thumbnail */}
                          <div className="w-full sm:w-40 sm:min-w-[155px] h-28 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 relative border border-gray-100 flex items-center justify-center bg-slate-100">
                            {blog.photo ? (
                              <img
                                src={blog.photo}
                                alt={titleClean}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = "https://examrally.in/web-app-manifest-512x512.png";
                                }}
                              />
                            ) : (
                              renderBlogThumbnail(blog, titleClean)
                            )}
                          </div>

                          {/* Article Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {blog.topic && (
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}
                                >
                                  {decodeHtml(blog.topic)}
                                </span>
                              )}
                              <div className="flex items-center gap-1 text-[11px] text-gray-400">
                                <FaCalendarAlt className="text-[9px]" />
                                <span>
                                  {new Date(blog.updatedAt || blog.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>

                            <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#16a34a] line-clamp-2 transition-colors duration-200 leading-snug">
                              {titleClean}
                            </h3>

                            {descClean && descClean.length > 5 && descClean !== "ss" && (
                              <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                                {descClean}
                              </p>
                            )}
                          </div>

                          {/* Read More Button */}
                          <div className="flex-shrink-0 sm:self-center">
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:text-[#16a34a] group-hover:translate-x-1 transition-all">
                              Read More <FaArrowRight className="text-[10px]" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredAndSortedBlogs.map((blog) => {
                      const titleClean = decodeHtml(blog.title);
                      const descClean = decodeHtml(blog.shortDescription);
                      const categoryStyle = getCategoryStyle(blog.topic);

                      return (
                        <div
                          key={blog._id}
                          onClick={() => navigate(`/blogdetails/${blog.link}`)}
                          className="bg-white rounded-xl border border-gray-200/90 hover:border-emerald-500 shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer group flex flex-col overflow-hidden"
                        >
                          <div className="w-full h-40 overflow-hidden bg-slate-100 relative">
                            {blog.photo ? (
                              <img
                                src={blog.photo}
                                alt={titleClean}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = "https://examrally.in/web-app-manifest-512x512.png";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center p-3 text-center">
                                <p className="text-slate-800 text-xs font-bold line-clamp-2">{titleClean}</p>
                              </div>
                            )}
                            {blog.topic && (
                              <span
                                className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs ${categoryStyle.bg} ${categoryStyle.text}`}
                              >
                                {decodeHtml(blog.topic)}
                              </span>
                            )}
                          </div>

                          <div className="p-3.5 flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-green-600 transition-colors duration-200 line-clamp-2">
                                {titleClean}
                              </h3>
                              {descClean && descClean.length > 5 && descClean !== "ss" && (
                                <p className="text-xs text-gray-500 line-clamp-2 mt-1.5 leading-relaxed">
                                  {descClean}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2.5 mt-2 border-t border-gray-100">
                              <div className="flex items-center gap-1">
                                <FaCalendarAlt className="text-[9px]" />
                                <span>
                                  {new Date(blog.updatedAt || blog.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                              <span className="font-bold text-blue-600 group-hover:text-green-600">
                                Read →
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Sidebar (Dedicated Full Right Column for Ads & Promos) */}
            <div className="lg:col-span-4 xl:col-span-3 space-y-5">

              {/* Card 1: Examrally Mobile App (Styled with Banner Theme & Project Design) */}
              <div className={`${activeRightTheme.containerBg} ${activeRightTheme.border} ${activeRightTheme.textColor} rounded-2xl border p-4.5 sm:p-5 shadow-lg relative overflow-hidden group`}>
                {/* Subtle ambient lighting orb */}
                <div className="absolute -top-10 -right-10 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-black/20 rounded-full blur-xl pointer-events-none" />

                {/* Header with Original Brand Logo and Active Pulsing Indicator */}
                <div className="relative z-10 flex items-start justify-between gap-3 mb-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-white p-1 shadow-md flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:-rotate-2 transition-transform duration-300 overflow-hidden">
                      <img src="/web-app-manifest-512x512.png" alt="Examrally App" className="w-full h-full object-contain rounded-lg" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-[15px] font-black tracking-tight leading-tight">
                          Examrally App
                        </h3>
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                      </div>
                      <p className="text-[11px] opacity-85 font-medium mt-0.5">
                        Practice anytime, anywhere
                      </p>
                    </div>
                  </div>

                  <span className={`text-[9.5px] font-black uppercase tracking-wider ${activeRightTheme.badge} px-2 py-0.5 rounded-full shadow-2xs flex-shrink-0`}>
                    FREE APP
                  </span>
                </div>

                {/* Feature Checklist - Clean vertical rows to guarantee NO TEXT TRUNCATION */}
                <div className="relative z-10 space-y-1.5 my-3.5">
                  {[
                    { icon: <FaClipboardList className="text-[10px]" />, label: "Real Exam Pattern Mock Tests" },
                    { icon: <FaFire className="text-[10px]" />, label: "Daily Speed Quizzes & PYQs" },
                    { icon: <FaNewspaper className="text-[10px]" />, label: "Daily Current Affairs & Analysis" },
                    { icon: <FaTrophy className="text-[10px]" />, label: "All India Rank & Performance" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-colors backdrop-blur-xs"
                    >
                      <span className={`w-5 h-5 rounded-md ${activeRightTheme.checkmark} flex items-center justify-center text-[10px] flex-shrink-0 shadow-2xs`}>
                        {item.icon}
                      </span>
                      <span className="text-[11.5px] font-semibold text-white leading-tight">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Store Badges side-by-side */}
                <div className="relative z-10 grid gap-2 mb-2.5 ">
                  <a
                    href="https://play.google.com/store/apps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl py-2 px-2.5 shadow-xs transition group/gp backdrop-blur-xs"
                  >
                    <img src={googlePlayImg} alt="Google Play" className=" object-contain w-40  flex-shrink-0 group-hover/gp:scale-110 transition-transform" />
                    <div className="text-left leading-none min-w-0">
                      {/* <span className="text-[7.5px] uppercase tracking-wider block opacity-75">GET IT ON</span> */}
                      {/* <span className="text-[10.5px] font-black">Google Play</span> */}
                    </div>
                  </a>

                
                </div>

                {/* Theme Dynamic CTA Button */}
                <a
                  href="https://play.google.com/store/apps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`relative z-10 w-full ${activeRightTheme.button} font-extrabold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all duration-200 group/btn`}
                >
                  <span>Install Free App</span>
                  <FaArrowRight className="text-[10px] group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* Card 2: Popular Topics (Styled with Left Banner Theme & Project Design) */}
              {/* <div className={`${activeLeftTheme.containerBg} ${activeLeftTheme.border} rounded-2xl border p-5 shadow-xs transition-all duration-300`}>
                <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-gray-200/60">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-lg ${activeLeftTheme.badge} flex items-center justify-center text-xs shadow-2xs`}>
                      <FaCompass />
                    </span>
                    <h3 className={`text-sm sm:text-base font-extrabold ${activeLeftTheme.textColor}`}>
                      Popular Topics
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedTopic("");
                      setSelectedExam("");
                      setSearchQuery("");
                      handleTopicSelect("");
                    }}
                    className={`text-xs font-bold ${activeLeftTheme.titleHighlight} hover:underline flex items-center gap-1`}
                  >
                    View All →
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {POPULAR_TOPICS_LIST.map((item) => {
                    const isSelected =
                      item.type === "exam"
                        ? selectedExam.toLowerCase() === item.name.toLowerCase()
                        : selectedTopic.toLowerCase() === item.name.toLowerCase();

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (item.type === "exam") {
                            if (selectedExam.toLowerCase() === item.name.toLowerCase()) {
                              setSelectedExam("");
                            } else {
                              setSelectedExam(item.name);
                              setSelectedTopic("");
                            }
                          } else {
                            if (selectedTopic.toLowerCase() === item.name.toLowerCase()) {
                              handleTopicSelect("");
                            } else {
                              handleTopicSelect(item.name);
                              setSelectedExam("");
                            }
                          }
                        }}
                        className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-left border transition-all duration-200 ${
                          isSelected
                            ? `${activeLeftTheme.badge} shadow-xs ring-1 ring-offset-1`
                            : "bg-white/95 hover:bg-white border-slate-200/80 hover:border-emerald-400 text-slate-800 shadow-2xs"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 shadow-2xs ${
                          isSelected ? "bg-white/20 text-white" : "bg-slate-50 border border-slate-200/80"
                        }`}>
                          {renderPopularTopicIcon(item)}
                        </div>
                        <span className={`text-xs font-bold truncate leading-tight ${isSelected ? "text-white" : "text-slate-800"}`}>
                          {item.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {(selectedExam || selectedTopic) && (
                  <button
                    onClick={() => {
                      setSelectedExam("");
                      setSelectedTopic("");
                      handleTopicSelect("");
                    }}
                    className="w-full mt-3 py-1.5 text-xs font-bold text-gray-500 hover:text-red-600 border border-dashed border-gray-300 rounded-lg transition-colors"
                  >
                    Reset Filter ×
                  </button>
                )}
              </div> */}

              {/* Card 3: Sponsored Ads */}
              {blogAd && blogAd.length > 0 && (
                <div className="space-y-4">
                  {blogAd.map((item) => {
                    const targetUrl = item.link_name || item.link || "#";
                    const isExt = targetUrl.startsWith("http");

                    const adContent = (
                      <div className="rounded-2xl overflow-hidden border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                        <img
                          src={item.photo}
                          alt="Advertisement"
                          className="w-full object-cover"
                        />
                      </div>
                    );

                    return isExt ? (
                      <a key={item._id} href={targetUrl} target="_blank" rel="noopener noreferrer" className="block">
                        {adContent}
                      </a>
                    ) : (
                      <Link key={item._id} to={targetUrl} className="block">
                        {adContent}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
