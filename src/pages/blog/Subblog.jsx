import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import Api from "../../service/Api";
import { Helmet } from "react-helmet";
import {
  FaChevronRight,
  FaChevronDown,
  FaChevronUp,
  FaCaretDown,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaShare,
  FaClock,
  FaUser,
  FaBell,
  FaArrowRight,
} from "react-icons/fa";
import { MdQuiz } from "react-icons/md";

/* ─────────────────────────────────────────
   7 Curated Theme Color Combinations for Sidebar Widgets (Includes White)
───────────────────────────────────────────*/
const THEME_CONFIGS = {
  emerald: {
    gradient: "from-green-700 to-green-600",
    gradientDark: "from-green-800 to-green-700",
    headerText: "text-white",
    btn: "bg-green-600 hover:bg-green-700 text-white",
    icon: "text-green-500",
    textAccent: "text-green-700",
    priceBox: "bg-green-50/70 border-green-100",
    hoverBg: "hover:bg-green-50 hover:text-green-700",
    border: "border-green-200",
    badge: "bg-green-100 text-green-800",
  },
  blue: {
    gradient: "from-blue-700 via-indigo-600 to-blue-800",
    gradientDark: "from-blue-800 via-indigo-700 to-blue-900",
    headerText: "text-white",
    btn: "bg-blue-600 hover:bg-blue-700 text-white",
    icon: "text-blue-500",
    textAccent: "text-blue-700",
    priceBox: "bg-blue-50/70 border-blue-100",
    hoverBg: "hover:bg-blue-50 hover:text-blue-700",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-800",
  },
  purple: {
    gradient: "from-purple-800 via-purple-700 to-indigo-800",
    gradientDark: "from-purple-900 via-purple-800 to-indigo-900",
    headerText: "text-white",
    btn: "bg-purple-600 hover:bg-purple-700 text-white",
    icon: "text-purple-500",
    textAccent: "text-purple-700",
    priceBox: "bg-purple-50/70 border-purple-100",
    hoverBg: "hover:bg-purple-50 hover:text-purple-700",
    border: "border-purple-200",
    badge: "bg-purple-100 text-purple-800",
  },
  amber: {
    gradient: "from-amber-600 via-orange-600 to-red-600",
    gradientDark: "from-amber-700 via-orange-700 to-red-700",
    headerText: "text-white",
    btn: "bg-orange-600 hover:bg-orange-700 text-white",
    icon: "text-orange-500",
    textAccent: "text-orange-700",
    priceBox: "bg-orange-50/70 border-orange-100",
    hoverBg: "hover:bg-orange-50 hover:text-orange-700",
    border: "border-orange-200",
    badge: "bg-orange-100 text-orange-800",
  },
  rose: {
    gradient: "from-rose-700 via-pink-700 to-rose-800",
    gradientDark: "from-rose-800 via-pink-800 to-rose-900",
    headerText: "text-white",
    btn: "bg-rose-600 hover:bg-rose-700 text-white",
    icon: "text-rose-500",
    textAccent: "text-rose-700",
    priceBox: "bg-rose-50/70 border-rose-100",
    hoverBg: "hover:bg-rose-50 hover:text-rose-700",
    border: "border-rose-200",
    badge: "bg-rose-100 text-rose-800",
  },
  slate: {
    gradient: "from-slate-800 via-gray-800 to-slate-900",
    gradientDark: "from-slate-900 via-gray-900 to-black",
    headerText: "text-white",
    btn: "bg-slate-800 hover:bg-slate-900 text-white",
    icon: "text-slate-600",
    textAccent: "text-slate-800",
    priceBox: "bg-slate-100 border-slate-200",
    hoverBg: "hover:bg-slate-100 hover:text-slate-800",
    border: "border-slate-300",
    badge: "bg-slate-100 text-slate-800",
  },
  white: {
    gradient: "from-white to-gray-50 border-b border-gray-200",
    gradientDark: "from-gray-50 to-gray-100 border-b border-gray-200",
    headerText: "text-gray-900",
    btn: "bg-slate-900 hover:bg-slate-800 text-white shadow-sm",
    icon: "text-slate-700",
    textAccent: "text-slate-900",
    priceBox: "bg-gray-50 border-gray-200 text-gray-900",
    hoverBg: "hover:bg-gray-100 hover:text-gray-900",
    border: "border-gray-200",
    badge: "bg-gray-100 text-gray-800 border border-gray-200",
  },
};

/* ─────────────────────────────────────────
   Curated Themes for Quick Navigation Header Tabs (Supports 4 Design Styles)
───────────────────────────────────────────*/
const QUICK_NAV_THEMES = {
  purple: {
    classicBg: "bg-[#eef6f9] border-[#d6e9f0]",
    classicActive: "text-[#800060] font-bold border-b-[3px] border-[#800060]",
    pillActive: "bg-[#800060] text-white font-bold rounded-full shadow-xs",
    minimalActive: "text-[#800060] font-bold border-b-2 border-[#800060] -mb-[2px]",
    glassActive: "bg-purple-100/90 text-[#800060] font-bold rounded-xl shadow-2xs border border-purple-200",
    topBtn: "bg-[#960064] hover:bg-[#7b0058] text-white",
    dropdownActive: "text-[#800060] bg-purple-50 font-bold",
  },
  emerald: {
    classicBg: "bg-emerald-50/70 border-emerald-200",
    classicActive: "text-green-700 font-bold border-b-[3px] border-green-600",
    pillActive: "bg-green-600 text-white font-bold rounded-full shadow-xs",
    minimalActive: "text-green-700 font-bold border-b-2 border-green-600 -mb-[2px]",
    glassActive: "bg-green-100/90 text-green-800 font-bold rounded-xl shadow-2xs border border-green-200",
    topBtn: "bg-green-700 hover:bg-green-800 text-white",
    dropdownActive: "text-green-700 bg-green-50 font-bold",
  },
  blue: {
    classicBg: "bg-blue-50/70 border-blue-200",
    classicActive: "text-blue-700 font-bold border-b-[3px] border-blue-600",
    pillActive: "bg-blue-600 text-white font-bold rounded-full shadow-xs",
    minimalActive: "text-blue-700 font-bold border-b-2 border-blue-600 -mb-[2px]",
    glassActive: "bg-blue-100/90 text-blue-800 font-bold rounded-xl shadow-2xs border border-blue-200",
    topBtn: "bg-blue-700 hover:bg-blue-800 text-white",
    dropdownActive: "text-blue-700 bg-blue-50 font-bold",
  },
  amber: {
    classicBg: "bg-amber-50/70 border-amber-200",
    classicActive: "text-orange-700 font-bold border-b-[3px] border-orange-600",
    pillActive: "bg-orange-600 text-white font-bold rounded-full shadow-xs",
    minimalActive: "text-orange-700 font-bold border-b-2 border-orange-600 -mb-[2px]",
    glassActive: "bg-orange-100/90 text-orange-800 font-bold rounded-xl shadow-2xs border border-orange-200",
    topBtn: "bg-orange-600 hover:bg-orange-700 text-white",
    dropdownActive: "text-orange-700 bg-orange-50 font-bold",
  },
  rose: {
    classicBg: "bg-rose-50/70 border-rose-200",
    classicActive: "text-rose-700 font-bold border-b-[3px] border-rose-600",
    pillActive: "bg-rose-600 text-white font-bold rounded-full shadow-xs",
    minimalActive: "text-rose-700 font-bold border-b-2 border-rose-600 -mb-[2px]",
    glassActive: "bg-rose-100/90 text-rose-800 font-bold rounded-xl shadow-2xs border border-rose-200",
    topBtn: "bg-rose-700 hover:bg-rose-800 text-white",
    dropdownActive: "text-rose-700 bg-rose-50 font-bold",
  },
  slate: {
    classicBg: "bg-slate-100 border-slate-300",
    classicActive: "text-slate-900 font-bold border-b-[3px] border-slate-900",
    pillActive: "bg-slate-900 text-white font-bold rounded-full shadow-xs",
    minimalActive: "text-slate-900 font-bold border-b-2 border-slate-900 -mb-[2px]",
    glassActive: "bg-slate-200/90 text-slate-900 font-bold rounded-xl shadow-2xs border border-slate-300",
    topBtn: "bg-slate-800 hover:bg-slate-900 text-white",
    dropdownActive: "text-slate-900 bg-slate-100 font-bold",
  },
  white: {
    classicBg: "bg-white border-gray-300 shadow-2xs",
    classicActive: "text-gray-900 font-bold border-b-[3px] border-gray-900",
    pillActive: "bg-slate-900 text-white font-bold rounded-full shadow-xs",
    minimalActive: "text-gray-900 font-bold border-b-2 border-gray-900 -mb-[2px]",
    glassActive: "bg-gray-100 text-gray-900 font-bold rounded-xl shadow-2xs border border-gray-300",
    topBtn: "bg-gray-900 hover:bg-black text-white",
    dropdownActive: "text-gray-900 bg-gray-100 font-bold",
  },
};

/* ─────────────────────────────────────────
   Skeleton Loader
───────────────────────────────────────────*/
const SkeletonLoader = () => (
  <div className="max-w-7xl mx-auto px-4 py-6 animate-pulse">
    <div className="flex gap-6">
      <div className="flex-1 space-y-4">
        <div className="h-3 bg-gray-200 rounded w-2/3" />
        <div className="h-8 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-40 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-4/5" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </div>
      <div className="hidden lg:block w-72 space-y-3 flex-shrink-0">
        <div className="h-6 bg-gray-200 rounded w-1/2" />
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded w-full" />
        ))}
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────
   Mobile Collapsible TOC
───────────────────────────────────────────*/
const MobileTOC = ({ tocItems, scrollToHeading, activeSection }) => {
  const [open, setOpen] = useState(false);
  if (!tocItems || tocItems.length === 0) return null;
  return (
    <div className="lg:hidden fixed bottom-4 right-4 z-40">
      <div className={`bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 ${open ? "w-80 max-h-[28rem]" : "w-auto"}`}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 bg-gradient-to-r from-green-700 to-green-600 text-white text-xs font-bold px-4 py-3 w-full shadow-lg"
        >
          {open ? <FaChevronDown /> : <FaChevronUp />}
          <span>{open ? "Close Article Menu" : `In This Article (${tocItems.length})`}</span>
        </button>
        {open && (
          <ul className="overflow-y-auto max-h-80 divide-y divide-gray-100 p-1 custom-scrollbar">
            {tocItems.map((item, idx) => {
              const isSub = item.level === 3;
              const isActive = activeSection === item.id;
              return (
                <li key={item.id || idx}>
                  <button
                    onClick={() => {
                      scrollToHeading(item.id);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-all rounded-lg ${
                      isSub ? "pl-7 text-[11px]" : "text-xs font-bold"
                    } ${
                      isActive
                        ? "bg-green-50 text-green-700 font-bold border-l-4 border-green-600"
                        : isSub
                        ? "text-gray-600 hover:bg-gray-50 hover:text-green-700"
                        : "text-gray-800 hover:bg-green-50/60 hover:text-green-700"
                    }`}
                  >
                    {isSub ? (
                      <span className="text-green-600 font-bold text-[11px] flex-shrink-0">↳</span>
                    ) : (
                      <span className={`text-[10px] font-bold w-5 flex-shrink-0 ${isActive ? "text-green-700" : "text-gray-400"}`}>
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    )}
                    <span className="line-clamp-1">{item.text}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   Main Subblog Component
───────────────────────────────────────────*/
const Subblog = () => {
  const { link } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [blogAd, setBlogAd] = useState([]);
  const [seo, setSeo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("section-latest-update");

  useEffect(() => {
    setLoading(true);
    run();
  }, [link]);

  async function run() {
    try {
      const [blogRes, adRes, seoRes] = await Promise.allSettled([
        Api.get(`blogs/get/${link}`),
        Api.get(`blog-Ad/getbypage/${link}`),
        Api.get(`/get-Specific-page/${link}`),
      ]);

      if (blogRes.status === "fulfilled" && blogRes.value.data?.length > 0) {
        const b = blogRes.value.data[0];
        setBlog(b);
        try {
          const rel = await Api.get(`blogs/all?topic=${encodeURIComponent(b.topic)}`);
          setRelatedBlogs((rel.data || []).filter((r) => r.link !== b.link).slice(0, 5));
        } catch (_) {}
      }
      if (adRes.status === "fulfilled") setBlogAd(adRes.value.data || []);
      if (seoRes.status === "fulfilled") setSeo(seoRes.value.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: blog?.title?.replace(/<[^>]+>/g, ""), url: window.location.href });
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // Decode HTML entities and strip tags for clean TOC text
  const decodeHtml = (html) => {
    if (!html) return "";
    return html
      .replace(/<[^>]+>/g, "")           // strip tags
      .replace(/&nbsp;/gi, " ")          // non-breaking space
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&[a-z]+;/gi, "")         // strip remaining entities
      .replace(/\s+/g, " ")              // collapse whitespace
      .trim();
  };

  // Pre-clean rich HTML before injecting into DOM
  const cleanHtml = (html) => {
    if (!html) return "";
    return html
      // 1. Wrap tables in scroll container for mobile
      .replace(/<table(\b[^>]*)>/gi, '<div class="table-scroll-wrapper"><table$1>')
      .replace(/<\/table>/gi, "</table></div>")
      // 2. Remove headings that are empty or contain only whitespace/&nbsp;/br
      .replace(/<(h[1-6])\b[^>]*>(\s|&nbsp;|<br\s*\/?>)*<\/\1>/gi, "")
      // 3. Remove paragraphs that are empty or contain only whitespace/&nbsp;/br
      .replace(/<p\b[^>]*>(\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, "")
      // 4. Remove span tags that are empty
      .replace(/<span\b[^>]*>(\s|&nbsp;)*<\/span>/gi, "")
      // 5. Collapse 3+ consecutive <br> into just 2
      .replace(/(<br\s*\/?>(\s|&nbsp;)*){3,}/gi, "<br><br>")
      // 6. Remove empty divs
      .replace(/<div\b[^>]*>(\s|&nbsp;|<br\s*\/?>)*<\/div>/gi, "");
  };

  /* ─────────────────────────────────────────────────────────────
     Intelligent Heading & Subtopic Extraction / Prediction (TOC)
     - Predicts both Titles (H2) and Subtitles (H3) from article body
     - Strips old inline repeated TOC blocks & noise
     - Injects anchor IDs into subtitle HTML for smooth scrolling
  ──────────────────────────────────────────────────────────────*/
  const { tocItems, processedSubtitles } = useMemo(() => {
    if (!blog) return { tocItems: [], processedSubtitles: [] };

    const items = [
      {
        id: "section-latest-update",
        text: "Latest Update & Overview",
        level: 2,
        isMain: true,
      },
    ];

    // 1. Scan all subtitles and content to find headings
    const rawHeadings = [];
    (blog.subtitles || []).forEach((item, sIdx) => {
      const rawHtml = (item.subtitle || "") + " " + (item.content || "");
      const regex = /<(h[2-4])[^>]*>([\s\S]*?)<\/\1>/gi;
      let m;
      while ((m = regex.exec(rawHtml)) !== null) {
        const tag = m[1].toLowerCase();
        const text = decodeHtml(m[2]);
        const norm = text.toLowerCase();
        if (
          text &&
          text.length >= 3 &&
          text.length <= 130 &&
          !norm.includes("table of content") &&
          !norm.includes("table of contents") &&
          !norm.startsWith("click here")
        ) {
          rawHeadings.push({
            tag,
            text,
            norm,
            sIdx,
            index: m.index,
            level: tag === "h2" ? 2 : 3,
            isMain: tag === "h2",
          });
        }
      }
    });

    // Count occurrences so we only inject the ID onto the last (real body) occurrence
    const occurrences = new Map();
    rawHeadings.forEach((h) => {
      occurrences.set(h.norm, (occurrences.get(h.norm) || 0) + 1);
    });

    // Deduplicate by keeping the LAST occurrence (which belongs to the actual body content)
    const lastMap = new Map();
    rawHeadings.forEach((h) => {
      lastMap.set(h.norm, h);
    });

    // Sort by position of the last occurrence in document
    const sortedHeadings = Array.from(lastMap.values()).sort((a, b) => a.index - b.index);

    // Map of norm text -> unique ID
    const headingIdMap = new Map();
    let headingCounter = 0;
    sortedHeadings.forEach((h) => {
      const id = `toc-heading-${headingCounter++}`;
      headingIdMap.set(h.norm, id);
      items.push({
        id,
        text: h.text,
        level: h.level,
        isMain: h.isMain,
      });
    });

    // Fallback: If no headings were found in HTML, use subtitles array directly
    if (sortedHeadings.length === 0 && blog.subtitles && blog.subtitles.length > 0) {
      blog.subtitles.forEach((s, idx) => {
        const clean = decodeHtml(s.subtitle || s.content);
        if (clean && clean.length > 2 && clean !== "ss") {
          const id = `section-${idx + 1}`;
          items.push({
            id,
            text: clean.slice(0, 60),
            level: 2,
            isMain: true,
          });
        }
      });
    }

    // 2. Inject matching IDs into subtitle HTML
    const currentCounts = new Map();
    const processed = (blog.subtitles || []).map((sub) => {
      let cleanSub = cleanHtml(sub.subtitle || "");
      if (headingIdMap.size > 0) {
        cleanSub = cleanSub.replace(
          /<(h[2-4])([^>]*)>([\s\S]*?)<\/\1>/gi,
          (fullMatch, tag, attrs, innerHtml) => {
            const text = decodeHtml(innerHtml);
            const norm = text.toLowerCase();
            const total = occurrences.get(norm) || 0;
            if (total > 0) {
              const current = (currentCounts.get(norm) || 0) + 1;
              currentCounts.set(norm, current);
              // Only inject the ID on the final (last) occurrence in the body
              if (current === total) {
                const id = headingIdMap.get(norm);
                if (id) {
                  const strippedAttrs = attrs.replace(/\sid=(['\"]).*?\1/gi, "");
                  return `<${tag} id="${id}" data-toc-heading="true"${strippedAttrs}>${innerHtml}</${tag}>`;
                }
              }
            }
            return fullMatch;
          }
        );
      }
      return {
        ...sub,
        subtitle: cleanSub,
      };
    });

    return { tocItems: items, processedSubtitles: processed };
  }, [blog]);

  /* Smooth scroll to heading by ID */
  const scrollToHeading = useCallback((id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      const navOffset = 75;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, []);

  /* active TOC tracker via IntersectionObserver */
  useEffect(() => {
    if (!blog || tocItems.length === 0) return;
    const timer = setTimeout(() => {
      const elements = tocItems
        .map((item) => document.getElementById(item.id))
        .filter(Boolean);

      if (elements.length === 0) return;

      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries.filter((e) => e.isIntersecting);
          if (visible.length > 0) {
            visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
            setActiveSection(visible[0].target.id);
          }
        },
        { rootMargin: "-10% 0px -70% 0px", threshold: 0 }
      );

      elements.forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }, 350);

    return () => clearTimeout(timer);
  }, [blog, tocItems]);

  /* ─────────────────────────────────────────
     Quick Navigation Bar State & Handlers
  ───────────────────────────────────────────*/
  const [activeQuickNav, setActiveQuickNav] = useState("");
  const [showQuickNavDropdown, setShowQuickNavDropdown] = useState(false);
  const quickNavDropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        quickNavDropdownRef.current &&
        !quickNavDropdownRef.current.contains(e.target)
      ) {
        setShowQuickNavDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Auto-detect and activate matching Quick Nav tab based on blog title or first tab
  useEffect(() => {
    if (blog?.quickNav?.items?.length > 0 && !activeQuickNav) {
      const titleLower = (blog.title || "").toLowerCase();
      const matched = blog.quickNav.items.find(
        (item) => item.label && titleLower.includes(item.label.toLowerCase())
      );
      if (matched) {
        setActiveQuickNav(matched.label);
      } else {
        setActiveQuickNav(blog.quickNav.items[0]?.label || "");
      }
    }
  }, [blog, activeQuickNav]);

  // Click handler for Quick Nav tabs: smooth scrolls to target anchor, TOC item, or headings
  const handleQuickNavClick = (item) => {
    if (!item?.label) return;
    setActiveQuickNav(item.label);
    const targetLink = (item.link || "").trim();

    // 1. Direct anchor hash scroll (#id)
    if (targetLink.startsWith("#") && targetLink.length > 1) {
      const targetId = targetLink.slice(1);
      const el = document.getElementById(targetId);
      if (el) {
        const navOffset = 75;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navOffset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        return;
      }
    }

    // 2. Full URL or route navigation
    if (targetLink && !targetLink.startsWith("#")) {
      if (targetLink.startsWith("http://") || targetLink.startsWith("https://")) {
        window.open(targetLink, "_blank", "noopener,noreferrer");
      } else {
        navigate(targetLink);
      }
      return;
    }

    // 3. Match against TOC items
    const cleanLabel = item.label.toLowerCase().trim();
    const match = tocItems.find(
      (t) =>
        t.text.toLowerCase().includes(cleanLabel) ||
        cleanLabel.includes(t.text.toLowerCase())
    );
    if (match) {
      scrollToHeading(match.id);
      return;
    }

    // 4. Match against any heading in page content
    const headings = Array.from(
      document.querySelectorAll("h2, h3, h4, th, td strong, h1")
    );
    const matchedHeading = headings.find((h) =>
      (h.textContent || "").toLowerCase().includes(cleanLabel)
    );
    if (matchedHeading) {
      const navOffset = 75;
      const elementPosition = matchedHeading.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  if (loading) return <SkeletonLoader />;
  if (!blog) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500">
      <p className="text-lg font-medium">Blog not found</p>
      <Link to="/blog" className="mt-3 text-green-600 hover:underline text-sm">← Back to Blog</Link>
    </div>
  );

  const cleanTitle = blog.title?.replace(/<[^>]+>/g, "") || "";
  const blogSeo = blog.seoData || {};
  const globalSeo = seo[0]?.seoData || {};
  const seoMeta = {
    title: blogSeo.title || globalSeo.title,
    description: blogSeo.description || globalSeo.description,
    keywords: blogSeo.keywords || globalSeo.keywords,
    canonical: blogSeo.canonical || globalSeo.canonical,
    robots: blogSeo.robots || globalSeo.robots || "index, follow",
    ogType: blogSeo.ogType || globalSeo.ogType || "article",
    ogSiteName: blogSeo.ogSiteName || globalSeo.ogSiteName || "ExamRally",
    ogTitle: blogSeo.ogTitle || globalSeo.ogTitle,
    ogDescription: blogSeo.ogDescription || globalSeo.ogDescription,
    ogImageUrl: blogSeo.ogImageUrl || globalSeo.ogImageUrl,
    twitterCard: blogSeo.twitterCard || globalSeo.twitterCard || "summary_large_image",
    twitterTitle: blogSeo.twitterTitle || globalSeo.twitterTitle,
    twitterDescription: blogSeo.twitterDescription || globalSeo.twitterDescription,
    twitterImage: blogSeo.twitterImage || globalSeo.twitterImage,
  };
  const formattedDate = new Date(blog.updatedAt).toLocaleDateString("en-US", {
    day: "numeric", month: "long", year: "numeric",
  });

  const quickLinks =
    blog.quickLinks && blog.quickLinks.length > 0
      ? blog.quickLinks.filter((q) => q.label && q.label.trim() !== "")
      : [];

  return (
    <>
      <Helmet>
        <title>{seoMeta.title || `${cleanTitle} – ExamRally`}</title>
        <meta name="description" content={seoMeta.description || blog.shortDescription?.replace(/<[^>]+>/g, "")} />
        <meta name="keywords" content={seoMeta.keywords || "bank exam, exam tips, ExamRally"} />
        <link rel="canonical" href={seoMeta.canonical || `https://examrally.in/blogdetails/${link}`} />
        <meta name="robots" content={seoMeta.robots} />
        <meta property="og:type" content={seoMeta.ogType} />
        <meta property="og:site_name" content={seoMeta.ogSiteName} />
        <meta property="og:url" content={seoMeta.canonical || `https://examrally.in/blogdetails/${link}`} />
        <meta property="og:title" content={seoMeta.ogTitle || seoMeta.title || cleanTitle} />
        <meta property="og:description" content={seoMeta.ogDescription || seoMeta.description || blog.shortDescription?.replace(/<[^>]+>/g, "") || ""} />
        <meta property="og:image" content={seoMeta.ogImageUrl || blog.photo || "https://examrally.in/web-app-manifest-512x512.png"} />
        <meta name="twitter:card" content={seoMeta.twitterCard} />
        <meta name="twitter:title" content={seoMeta.twitterTitle || seoMeta.ogTitle || cleanTitle} />
        <meta name="twitter:description" content={seoMeta.twitterDescription || seoMeta.ogDescription || blog.shortDescription?.replace(/<[^>]+>/g, "") || ""} />
        <meta name="twitter:image" content={seoMeta.twitterImage || seoMeta.ogImageUrl || blog.photo || "https://examrally.in/web-app-manifest-512x512.png"} />
      </Helmet>

      <div className="bg-gray-50 min-h-screen">
        <div className=" px-3 sm:px-4 lg:px-6 py-4">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-xs text-gray-500 mb-4 flex-wrap">
            <Link to="/" className="hover:text-green-600 transition-colors">Home</Link>
            <FaChevronRight className="text-gray-400 text-[10px]" />
            <Link to="/blog" className="hover:text-green-600 transition-colors">Blog</Link>
            {blog.topic && (
              <>
                <FaChevronRight className="text-gray-400 text-[10px]" />
                <span className="hover:text-green-600 cursor-pointer" onClick={() => navigate("/blog")}>{blog.topic}</span>
              </>
            )}
            <FaChevronRight className="text-gray-400 text-[10px]" />
            <span className="text-gray-700 font-medium line-clamp-1">{decodeHtml(cleanTitle)}</span>
          </nav>

          {/* Single global style block for rich blog content – injected once */}
          <style>{`
            .blog-rich-section { overflow-x: hidden; word-break: break-word; }

            /* ── Hide empty/whitespace-only tags that cause lone | pipes ── */
            .blog-rich-section h1:empty,
            .blog-rich-section h2:empty,
            .blog-rich-section h3:empty,
            .blog-rich-section h4:empty,
            .blog-rich-section h5:empty,
            .blog-rich-section h6:empty,
            .blog-rich-section p:empty { display: none !important; }

            /* Hide headings/paras that contain ONLY <br> or &nbsp; */
            .blog-rich-section h2 br:only-child,
            .blog-rich-section h3 br:only-child,
            .blog-rich-section p br:only-child { display: none; }
            .blog-rich-section h2:not(:has(*:not(br))):not(:has(text)),
            .blog-rich-section h3:not(:has(*:not(br))):not(:has(text)) { display: none !important; }

            /* ── Headings – Crisp, reduced boldness, refined typography ── */
            .blog-rich-section h1,
            .blog-rich-section h2,
            .blog-rich-section h3,
            .blog-rich-section h4 {
              scroll-margin-top: 5rem !important;
            }
            .blog-rich-section h1 {
              font-size: 1.25rem !important;
              font-weight: 700 !important;
              color: #111827 !important;
              margin: 1.25rem 0 0.6rem 0 !important;
              line-height: 1.35 !important;
            }
            .blog-rich-section h2 {
              font-size: 1.12rem !important;
              font-weight: 600 !important;
              color: #1f2937 !important;
              border-left: none !important;
              padding-left: 0 !important;
              margin: 1.25rem 0 0.5rem 0 !important;
              line-height: 1.4 !important;
              display: block !important;
              text-decoration: none !important;
            }
            .blog-rich-section h3 {
              font-size: 1.02rem !important;
              font-weight: 600 !important;
              color: #166534 !important;
              margin: 1rem 0 0.4rem 0 !important;
              line-height: 1.4 !important;
            }
            .blog-rich-section h4 {
              font-size: 0.95rem !important;
              font-weight: 600 !important;
              color: #1f2937 !important;
              margin: 0.9rem 0 0.35rem 0 !important;
            }
            .blog-rich-section h5, .blog-rich-section h6 {
              font-size: 0.95rem !important;
              font-weight: 600 !important;
              color: #374151 !important;
              margin: 0.75rem 0 0.3rem 0 !important;
            }

            /* Override Bootstrap link/span defaults inside headings */
            .blog-rich-section h1 a, .blog-rich-section h1 span,
            .blog-rich-section h2 a, .blog-rich-section h2 span,
            .blog-rich-section h3 a, .blog-rich-section h3 span {
              color: inherit !important;
              text-decoration: none !important;
              font-size: inherit !important;
              font-weight: inherit !important;
            }

            /* ── Paragraphs & Body Text – Bigger, highly readable fonts ── */
            .blog-rich-section p {
              margin-bottom: 0.85rem;
              font-size: 14.5px !important;
              color: #374151 !important;
              line-height: 1.75 !important;
            }
            .blog-rich-section p * {
              line-height: inherit !important;
            }
            .blog-rich-section span { font-size: inherit; }

            /* ── Tables – Modern Trending Design Pattern ── */
            .blog-rich-section .table-scroll-wrapper {
              overflow-x: auto;
              -webkit-overflow-scrolling: touch;
              margin: 1.5rem 0;
              border-radius: 12px;
              border: 1px solid #cbd5e1;
              box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.05);
              background: #ffffff;
            }
            .blog-rich-section .table-scroll-wrapper::-webkit-scrollbar { height: 6px; }
            .blog-rich-section .table-scroll-wrapper::-webkit-scrollbar-track { background: #f1f5f9; }
            .blog-rich-section .table-scroll-wrapper::-webkit-scrollbar-thumb { background: #16a34a; border-radius: 4px; }
            
            .blog-rich-section table {
              width: max-content !important;
              min-width: 100% !important;
              border-collapse: separate !important;
              border-spacing: 0 !important;
              font-size: 13.5px !important;
              margin: 0 !important;
              background: #ffffff !important;
            }

            /* Table Header (thead tr or first tr ONLY if table has no thead) */
            .blog-rich-section table thead,
            .blog-rich-section table thead tr,
            .blog-rich-section table:not(:has(thead)) > tr:first-child,
            .blog-rich-section table:not(:has(thead)) tbody > tr:first-child {
              background: linear-gradient(135deg, #15803d 0%, #166534 100%) !important;
              color: #ffffff !important;
              font-weight: 700 !important;
            }

            .blog-rich-section table th,
            .blog-rich-section table thead td,
            .blog-rich-section table:not(:has(thead)) > tr:first-child td,
            .blog-rich-section table:not(:has(thead)) tbody > tr:first-child td {
              padding: 12px 16px !important;
              text-align: left !important;
              color: #ffffff !important;
              font-weight: 700 !important;
              font-size: 13.5px !important;
              letter-spacing: 0.3px !important;
              border-bottom: 2px solid #14532d !important;
              border-right: 1px solid rgba(255, 255, 255, 0.15) !important;
              background: transparent !important;
              white-space: nowrap !important;
              word-break: normal !important;
              overflow-wrap: normal !important;
            }

            .blog-rich-section table th:last-child,
            .blog-rich-section table thead td:last-child,
            .blog-rich-section table:not(:has(thead)) > tr:first-child td:last-child,
            .blog-rich-section table:not(:has(thead)) tbody > tr:first-child td:last-child {
              border-right: none !important;
            }

            /* Table Body Rows */
            .blog-rich-section table:has(thead) tbody tr,
            .blog-rich-section table:not(:has(thead)) tbody tr:not(:first-child) {
              border-bottom: 1px solid #e2e8f0 !important;
              transition: background-color 0.15s ease !important;
              background-color: #ffffff !important;
            }

            .blog-rich-section table:has(thead) tbody tr:nth-child(even),
            .blog-rich-section table:not(:has(thead)) tbody tr:not(:first-child):nth-child(even) {
              background-color: #f8fafc !important;
            }

            .blog-rich-section table:has(thead) tbody tr:hover,
            .blog-rich-section table:not(:has(thead)) tbody tr:not(:first-child):hover {
              background-color: #f0fdf4 !important;
            }

            /* Cells */
            .blog-rich-section table td {
              padding: 11px 16px !important;
              color: #374151 !important;
              border-bottom: 1px solid #e2e8f0 !important;
              border-right: 1px solid #f1f5f9 !important;
              vertical-align: middle !important;
              font-size: 13.5px !important;
              line-height: 1.6 !important;
              background: transparent !important;
              white-space: nowrap !important;
              word-break: normal !important;
              overflow-wrap: normal !important;
            }
            .blog-rich-section td:last-child {
              border-right: none !important;
            }

            /* Text & Paragraphs inside table body cells */
            .blog-rich-section tbody td p,
            .blog-rich-section tbody th p {
              margin: 0 !important;
              padding: 0 !important;
              font-size: inherit !important;
              color: inherit !important;
              line-height: inherit !important;
              white-space: nowrap !important;
              word-break: normal !important;
            }
            .blog-rich-section table:has(thead) tbody td strong,
            .blog-rich-section table:has(thead) tbody td b,
            .blog-rich-section table:not(:has(thead)) tbody tr:not(:first-child) td strong,
            .blog-rich-section table:not(:has(thead)) tbody tr:not(:first-child) td b {
              color: #0f172a !important;
              font-weight: 700 !important;
            }

            /* Links inside table cells (Pill action links) */
            .blog-rich-section tbody td a {
              color: #15803d !important;
              font-weight: 600 !important;
              text-decoration: none !important;
              background: #f0fdf4 !important;
              border: 1px solid #bbf7d0 !important;
              padding: 4px 10px !important;
              border-radius: 6px !important;
              display: inline-flex !important;
              align-items: center !important;
              gap: 4px !important;
              transition: all 0.15s ease !important;
            }
            .blog-rich-section tbody td a:hover {
              background: #16a34a !important;
              color: #ffffff !important;
              border-color: #16a34a !important;
              box-shadow: 0 2px 4px rgba(22, 163, 74, 0.2) !important;
            }

            /* ── ABSOLUTE GUARANTEE: All Table Header text, strong, b, span, p must be PURE WHITE ── */
            .blog-rich-section table thead,
            .blog-rich-section table thead tr,
            .blog-rich-section table thead th,
            .blog-rich-section table thead td,
            .blog-rich-section table th,
            .blog-rich-section table:not(:has(thead)) > tr:first-child,
            .blog-rich-section table:not(:has(thead)) > tr:first-child th,
            .blog-rich-section table:not(:has(thead)) > tr:first-child td,
            .blog-rich-section table:not(:has(thead)) tbody > tr:first-child,
            .blog-rich-section table:not(:has(thead)) tbody > tr:first-child th,
            .blog-rich-section table:not(:has(thead)) tbody > tr:first-child td,
            .blog-rich-section table thead *,
            .blog-rich-section table th *,
            .blog-rich-section table thead td *,
            .blog-rich-section table thead td strong,
            .blog-rich-section table thead td b,
            .blog-rich-section table thead td span,
            .blog-rich-section table thead td p,
            .blog-rich-section table thead td a,
            .blog-rich-section table:not(:has(thead)) > tr:first-child *,
            .blog-rich-section table:not(:has(thead)) tbody > tr:first-child *,
            .blog-rich-section table:not(:has(thead)) tbody > tr:first-child td * {
              color: #ffffff !important;
              -webkit-text-fill-color: #ffffff !important;
              font-weight: 700 !important;
              white-space: nowrap !important;
              word-break: normal !important;
            }

            /* ── Lists & Bullets ── */
            .blog-rich-section ul { list-style: disc; padding-left: 1.25rem; margin: 0.6rem 0; }
            .blog-rich-section ol { list-style: decimal; padding-left: 1.25rem; margin: 0.6rem 0; }
            .blog-rich-section li { margin-bottom: 0.4rem; font-size: 14.5px !important; color: #374151 !important; line-height: 1.7 !important; }
            .blog-rich-section li p { display: inline !important; margin: 0 !important; font-size: inherit !important; }
            .blog-rich-section li:empty { display: none !important; }
            .blog-rich-section li:not(:has(*:not(br))):not(:has(text)) { display: none !important; }

            /* ── Inline ── */
            .blog-rich-section a { color: #16a34a !important; text-decoration: underline !important; font-weight: 500; }
            .blog-rich-section a:hover { color: #15803d !important; }
            .blog-rich-section strong, .blog-rich-section b { font-weight: 700 !important; color: #111827 !important; }
            .blog-rich-section em, .blog-rich-section i { font-style: italic !important; }
            .blog-rich-section img { max-width: 100%; height: auto; border-radius: 8px; margin: 0.75rem 0; display: block; }
            .blog-rich-section blockquote {
              border-left: 4px solid #16a34a;
              color: #4b5563; font-style: italic; margin: 1rem 0; background: #f9fafb; padding: 0.75rem 1rem; border-radius: 0 6px 6px 0;
            }

            /* ── Mobile tweaks ── */
            @media (max-width: 640px) {
              .blog-rich-section table { font-size: 13px !important; }
              .blog-rich-section th, .blog-rich-section td { padding: 9px 12px !important; font-size: 13px !important; }
              .blog-rich-section h2 { font-size: 1.15rem !important; }
              .blog-rich-section h3 { font-size: 1.05rem !important; }
              .blog-rich-section p, .blog-rich-section li { font-size: 14px !important; }
            }
          `}</style>

          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row gap-6">

            {/* ── LEFT: Main article ── */}
            <main className="flex-1 min-w-0 overflow-x-hidden">

              {/* Topic badge */}
              {blog.topic && (
                <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-3 border border-green-200">
                  {blog.topic}
                </span>
              )}

              {/* H1 Title - clean, reduced boldness & balanced letter size */}
              <h1 className="text-xl sm:text-2xl lg:text-[26px] font-semibold text-gray-900 leading-snug mb-3 tracking-normal">
                {decodeHtml(blog.title)}
              </h1>

              {/* Short description - hide if placeholder like "ss" */}
              {blog.shortDescription &&
                decodeHtml(blog.shortDescription).length > 5 &&
                decodeHtml(blog.shortDescription) !== "ss" && (
                  <div
                    className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: blog.shortDescription }}
                  />
              )}

              {/* Meta row */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-200">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1"><FaClock className="text-gray-400" />{formattedDate}</span>
                  <span className="flex items-center gap-1"><FaUser className="text-gray-400" />{blog.author || "Examrally Team"}</span>
                  <span className="flex items-center gap-1"><FaClock className="text-gray-400" />{blog.readTime || "10 Min Read"}</span>
                  <button onClick={handleShare} className="flex items-center gap-1 text-green-600 hover:text-green-800 transition-colors">
                    <FaShare /> Share
                  </button>
                </div>

                {/* Top Action Button (e.g. "Download More PDF's Here") */}
                {blog.quickNav?.enabled && blog.quickNav?.topButtonText && (
                  <a
                    href={blog.quickNav.topButtonLink || "#"}
                    target={blog.quickNav.topButtonLink?.startsWith("http") ? "_blank" : undefined}
                    rel={blog.quickNav.topButtonLink?.startsWith("http") ? "noopener noreferrer" : undefined}
                    className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm transform hover:-translate-y-0.5 ${
                      QUICK_NAV_THEMES[blog.quickNav.theme || "purple"]?.topBtn || QUICK_NAV_THEMES.purple.topBtn
                    }`}
                  >
                    <span>{blog.quickNav.topButtonText}</span>
                    <FaExternalLinkAlt className="text-[9px]" />
                  </a>
                )}
              </div>

              {/* Under-Title Quick Navigation Bar (Supports all 4 design styles + 7 themes) */}
              {blog.quickNav?.enabled && blog.quickNav?.items?.length > 0 && (() => {
                const navTheme = QUICK_NAV_THEMES[blog.quickNav.theme || "purple"] || QUICK_NAV_THEMES.purple;
                const design = blog.quickNav.designStyle || "classic_tabs";

                let containerStyle = "";
                let tabBaseStyle = "";
                let activeTabStyle = "";
                let inactiveTabStyle = "";

                if (design === "modern_pills") {
                  containerStyle = "rounded-full bg-slate-100/90 border border-slate-200/90 shadow-2xs px-2 py-1.5 mb-6";
                  tabBaseStyle = "px-4 py-1.5 text-xs sm:text-[13px] rounded-full font-semibold whitespace-nowrap transition-all flex-shrink-0 cursor-pointer";
                  activeTabStyle = navTheme.pillActive;
                  inactiveTabStyle = "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70";
                } else if (design === "minimal_line") {
                  containerStyle = "bg-transparent border-b-2 border-slate-200 rounded-none px-1 py-0 mb-6";
                  tabBaseStyle = "px-3.5 py-2 text-xs sm:text-[13px] font-semibold whitespace-nowrap transition-all flex-shrink-0 cursor-pointer border-b-2 -mb-[2px]";
                  activeTabStyle = navTheme.minimalActive;
                  inactiveTabStyle = "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300";
                } else if (design === "glass_gradient") {
                  containerStyle = "rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs backdrop-blur-md px-3 py-1.5 mb-6";
                  tabBaseStyle = "px-3.5 py-1.5 text-xs sm:text-[13px] rounded-xl font-semibold whitespace-nowrap transition-all flex-shrink-0 cursor-pointer border";
                  activeTabStyle = navTheme.glassActive;
                  inactiveTabStyle = "border-transparent text-slate-600 hover:text-slate-900 hover:bg-white/60";
                } else {
                  // classic_tabs (exact screenshot match: Guidely sky blue bar with bottom underline)
                  containerStyle = `rounded-lg border px-3 py-1 mb-6 ${navTheme.classicBg}`;
                  tabBaseStyle = "px-3 py-1.5 text-xs sm:text-[13px] whitespace-nowrap transition-all flex-shrink-0 cursor-pointer border-b-[3px]";
                  activeTabStyle = `${navTheme.classicActive}`;
                  inactiveTabStyle = "border-transparent text-slate-700 hover:text-slate-950 hover:border-slate-300/40 font-medium";
                }

                return (
                  <div className={`relative transition-all ${containerStyle}`}>
                    <div className="flex items-center justify-between gap-1 sm:gap-2">
                      {/* Horizontal Scrolling Tabs */}
                      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth flex-1 py-0.5">
                        {blog.quickNav.items.map((item, idx) => {
                          const isActive = activeQuickNav === item.label;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleQuickNavClick(item)}
                              className={`${tabBaseStyle} ${isActive ? activeTabStyle : inactiveTabStyle}`}
                            >
                              {item.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Dropdown toggle button (arrow ▼) */}
                      <div className="relative flex-shrink-0" ref={quickNavDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setShowQuickNavDropdown((prev) => !prev)}
                          title="View all quick links"
                          className="px-2 py-1 text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center cursor-pointer"
                        >
                          <FaCaretDown
                            className={`text-xs transition-transform duration-200 ${
                              showQuickNavDropdown ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {/* Dropdown Menu */}
                        {showQuickNavDropdown && (
                          <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 z-50">
                            <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                              Quick Navigation
                            </div>
                            <div className="max-h-60 overflow-y-auto py-1">
                              {blog.quickNav.items.map((item, idx) => {
                                const isActive = activeQuickNav === item.label;
                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                      handleQuickNavClick(item);
                                      setShowQuickNavDropdown(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                                      isActive
                                        ? navTheme.dropdownActive
                                        : "text-gray-700 hover:bg-gray-50"
                                    }`}
                                  >
                                    <span className="truncate">{item.label}</span>
                                    {isActive && <span className="text-[10px] font-bold">●</span>}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Latest Update banner */}
              <div
                id="section-latest-update"
                className=" border border-green-200 rounded-lg p-4 mb-6 scroll-mt-24"
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1">
                    <span className="inline-flex items-center gap-1 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                      <FaBell className="text-[10px]" /> Latest Update
                    </span>
                    <div
                      className="blog-rich-section text-sm sm:text-base text-gray-700 leading-relaxed mt-1"
                      dangerouslySetInnerHTML={{ __html: cleanHtml(blog.description) }}
                    />
                  </div>
                  {blog.officialWebsite && (
                    <a
                      href={blog.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors whitespace-nowrap flex-shrink-0"
                    >
                      Official Website <FaExternalLinkAlt className="text-[10px]" />
                    </a>
                  )}
                </div>
              </div>

              {/* Subtopic & Title Quick Navigation Bar (Predicted Topics) */}
              {/* {tocItems.length > 1 && (
                <div className="bg-white border border-green-100 rounded-xl p-4 mb-6 shadow-sm">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
                      <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                        Article Outline & Subtopics ({tocItems.length})
                      </h3>
                    </div>
                    <span className="text-[11px] text-gray-400 hidden sm:inline">Jump to any section</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tocItems.map((item, idx) => {
                      const isSub = item.level === 3;
                      const isActive = activeSection === item.id;
                      return (
                        <button
                          key={item.id || idx}
                          onClick={() => scrollToHeading(item.id)}
                          className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                            isActive
                              ? "bg-green-600 text-white border-green-600 shadow-sm"
                              : isSub
                              ? "bg-gray-50 hover:bg-green-50 text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-700"
                              : "bg-green-50/70 hover:bg-green-100 text-green-800 border-green-200 font-semibold"
                          }`}
                        >
                          <span
                            className={`font-bold text-[10px] px-1.5 py-0.5 rounded ${
                              isActive
                                ? "bg-green-700 text-white"
                                : isSub
                                ? "bg-gray-200 text-gray-600"
                                : "bg-green-200 text-green-800"
                            }`}
                          >
                            {isSub ? "↳" : String(idx + 1).padStart(2, "0")}
                          </span>
                          <span className="line-clamp-1">{item.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )} */}

              {/* Subtitle sections with predicted headings and injected anchor IDs */}
              {processedSubtitles?.map((item, idx) => (
                <section
                  key={item._id || idx}
                  className="mb-8 scroll-mt-24 bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm"
                  id={`section-${idx + 1}`}
                >
                  {item.subtitle && (
                    <div
                      className="blog-rich-section"
                      dangerouslySetInnerHTML={{
                        __html: item.subtitle,
                      }}
                    />
                  )}
                  {item.content &&
                    decodeHtml(item.content) !== "ss" &&
                    decodeHtml(item.content).length > 2 && (
                      <div
                        className="blog-rich-section mt-4"
                        dangerouslySetInnerHTML={{
                          __html: cleanHtml(item.content),
                        }}
                      />
                    )}
                </section>
              ))}

              {/* Mobile ads */}
              {blogAd.length > 0 && (
                <div className="flex flex-col gap-4 mt-6 lg:hidden">
                  {blogAd.map((item) => (
                    <Link key={item._id} to={item.link_name}>
                      <img src={item.photo} alt="Advertisement" className="rounded-lg w-full object-cover shadow" />
                    </Link>
                  ))}
                </div>
              )}
            </main>

            {/* ── RIGHT: Sticky sidebar ── */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-4 space-y-4 max-h-[calc(100vh-2rem)] overflow-y-auto custom-scrollbar pb-8">

                {/* In This Article (TOC) with both Title and Subtitle Hierarchy */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-green-700 to-green-600 px-3.5 py-2.5 flex items-center justify-between">
                    <h3 className="text-white font-semibold text-xs tracking-wide flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse"></span>
                      In This Article
                    </h3>
                    <span className="text-[10px] font-medium bg-green-800/60 text-green-100 px-2 py-0.5 rounded-full">
                      {tocItems.length} topics
                    </span>
                  </div>
                  <ul className="divide-y divide-gray-100 max-h-[380px] overflow-y-auto custom-scrollbar">
                    {tocItems.map((item, idx) => {
                      const isSub = item.level === 3;
                      const isActive = activeSection === item.id;
                      return (
                        <li key={item.id || idx}>
                          <button
                            onClick={() => scrollToHeading(item.id)}
                            className={`w-full flex items-start gap-2 text-left transition-all ${
                              isSub
                                ? "pl-6 pr-3 py-1.5 text-[11px]"
                                : "px-3.5 py-2 text-[12px]"
                            } ${
                              isActive
                                ? "bg-green-50/90 text-green-700 font-semibold border-l-[3px] border-green-600"
                                : isSub
                                ? "text-gray-500 hover:bg-gray-50 hover:text-green-700 font-normal"
                                : "text-gray-700 hover:bg-green-50/60 hover:text-green-700 font-medium"
                            }`}
                          >
                            {isSub ? (
                              <span className="text-green-600 font-medium text-[10px] mt-0.5 flex-shrink-0">↳</span>
                            ) : (
                              <span className={`text-[10px] font-medium w-4 flex-shrink-0 mt-0.5 ${isActive ? "text-green-700 font-semibold" : "text-gray-400"}`}>
                                {String(idx + 1).padStart(2, "0")}
                              </span>
                            )}
                            <span className="line-clamp-2 leading-snug">{item.text}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Practice widget (Directly below "In This Article") - Do not show by default */}
                {(() => {
                  const pw = blog.practiceWidget;
                  if (!pw || pw.enabled === false) return null;
                  if (!pw.title || pw.title.trim() === "") return null;

                  const title = pw.title;
                  const features = (pw.features && pw.features.length > 0) ? pw.features : [];
                  const btnText = pw.buttonText || "Start Mock Tests Now";
                  const targetLink = pw.link || "/";
                  const theme = THEME_CONFIGS[pw.theme] || THEME_CONFIGS.emerald;

                  return (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
                      <div className={`px-3.5 py-2.5 bg-gradient-to-r ${theme.gradient}`}>
                        <h3 className={`font-semibold text-xs ${theme.headerText || "text-white"}`}>
                          {title}
                        </h3>
                      </div>
                      {features.length > 0 && (
                        <ul className="px-3.5 py-2.5 space-y-1.5">
                          {features.map((feat, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-[11.5px] text-gray-600">
                              <FaCheckCircle className={`${theme.icon} flex-shrink-0 text-xs`} />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className={`px-3.5 pb-3 ${features.length === 0 ? "pt-3" : ""}`}>
                        <Link
                          to={targetLink.startsWith("http") ? { pathname: targetLink } : targetLink}
                          target={targetLink.startsWith("http") ? "_blank" : "_self"}
                          className={`flex items-center justify-center gap-1.5 w-full ${theme.btn} text-xs font-semibold py-2 rounded-lg transition-colors shadow-sm`}
                        >
                          {btnText} <FaArrowRight className="text-[10px]" />
                        </Link>
                      </div>
                    </div>
                  );
                })()}

                {/* Dynamic Package Ad Widget (ExamRally Website Theme) - Only show if enabled and data is available */}
                {(() => {
                  const pkg = blog.packageAd;
                  if (!pkg || pkg.enabled === false || !pkg.title || pkg.title.trim() === "") return null;

                  const theme = THEME_CONFIGS[pkg.theme] || THEME_CONFIGS.emerald;
                  const title = pkg.title;
                  const features = (pkg.features && pkg.features.length > 0) ? pkg.features : [];
                  const origPrice = pkg.originalPrice;
                  const discPrice = pkg.discountedPrice;
                  const targetLink = pkg.link || "/packages";
                  const btnText = pkg.buttonText || "View Package";

                  return (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
                      <div className={`bg-gradient-to-r ${theme.gradient} px-4 py-3`}>
                        <h3 className={`font-bold text-sm leading-snug ${theme.headerText || "text-white"}`}>
                          {title}
                        </h3>
                      </div>
                      <div className="p-4">
                        {features.length > 0 && (
                          <ul className="space-y-2 mb-4 text-xs text-gray-700">
                            {features.map((feat, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <FaCheckCircle className={`${theme.icon} flex-shrink-0 mt-0.5 text-xs`} />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {(origPrice || discPrice) && (
                          <div className={`flex items-baseline justify-center gap-2 mb-3 py-2 ${theme.priceBox} rounded-lg border`}>
                            {origPrice && <span className="text-xs text-gray-400 line-through">₹{origPrice}</span>}
                            {discPrice && <span className={`text-xl font-bold ${theme.textAccent}`}>₹{discPrice}</span>}
                          </div>
                        )}
                        <Link
                          to={targetLink.startsWith("http") ? { pathname: targetLink } : targetLink}
                          target={targetLink.startsWith("http") ? "_blank" : "_self"}
                          className={`flex items-center justify-center gap-2 w-full ${theme.btn} text-xs font-bold py-2.5 rounded-lg transition-colors shadow-sm`}
                        >
                          {btnText} <FaArrowRight />
                        </Link>
                      </div>
                    </div>
                  );
                })()}

                {/* Dynamic Course Ad Widget (ExamRally Website Theme) - Only show if enabled and data is available */}
                {(() => {
                  const crs = blog.courseAd;
                  if (!crs || crs.enabled === false || !crs.title || crs.title.trim() === "") return null;

                  const theme = THEME_CONFIGS[crs.theme] || THEME_CONFIGS.emerald;
                  const title = crs.title;
                  const features = (crs.features && crs.features.length > 0) ? crs.features : [];
                  const targetLink = crs.link || "/pdfcourse";
                  const btnText = crs.buttonText || "Explore Course";

                  return (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
                      <div className={`bg-gradient-to-r ${theme.gradientDark} px-4 py-3`}>
                        <h3 className={`font-bold text-sm leading-snug ${theme.headerText || "text-white"}`}>
                          {title}
                        </h3>
                      </div>
                      <div className="p-4">
                        {features.length > 0 && (
                          <ul className="space-y-2 mb-4 text-xs text-gray-700">
                            {features.map((feat, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <FaCheckCircle className={`${theme.icon} flex-shrink-0 mt-0.5 text-xs`} />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        <Link
                          to={targetLink.startsWith("http") ? { pathname: targetLink } : targetLink}
                          target={targetLink.startsWith("http") ? "_blank" : "_self"}
                          className={`flex items-center justify-center gap-2 w-full ${theme.btn} text-xs font-bold py-2.5 rounded-lg transition-colors shadow-sm`}
                        >
                          {btnText} <FaArrowRight />
                        </Link>
                      </div>
                    </div>
                  );
                })()}

                {/* Related Articles */}
                {relatedBlogs.length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-3.5 py-2.5 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-semibold text-xs text-gray-800">Related Articles</h3>
                      <Link to="/blog" className="text-[11px] text-green-600 hover:underline">View All</Link>
                    </div>
                    <ul className="divide-y divide-gray-100">
                      {relatedBlogs.map((rb) => (
                        <li key={rb._id}>
                          <Link to={`/blogdetails/${rb.link}`} className="flex items-start gap-2 px-3.5 py-2.5 hover:bg-gray-50 transition-colors group">
                            <FaChevronRight className="text-green-500 mt-0.5 flex-shrink-0 text-[9px]" />
                            <div>
                              <p className="text-[12px] font-medium text-gray-700 group-hover:text-green-700 line-clamp-2 leading-snug">
                                {decodeHtml(rb.title)}
                              </p>
                              {/* Only show shortDescription if it has meaningful text */}
                              {rb.shortDescription &&
                                decodeHtml(rb.shortDescription).length > 20 &&
                                decodeHtml(rb.shortDescription) !== "ss" && (
                                  <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2 leading-snug">
                                    {decodeHtml(rb.shortDescription)}
                                  </p>
                              )}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Quick Links - Only show if enabled and data is available */}
                {blog.quickLinksEnabled !== false && quickLinks.length > 0 && (() => {
                  const qlTheme = THEME_CONFIGS[blog.quickLinksTheme] || THEME_CONFIGS.emerald;
                  return (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="px-3.5 py-2.5 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-semibold text-xs text-gray-800">Quick Links</h3>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${qlTheme.badge}`}>
                          Useful Links
                        </span>
                      </div>
                      <ul className="divide-y divide-gray-100">
                        {quickLinks.map((ql) => (
                          <li key={ql.label}>
                            <a
                              href={ql.href}
                              target={ql.href !== "#" ? "_blank" : "_self"}
                              rel="noopener noreferrer"
                              className={`flex items-center justify-between px-3.5 py-2 text-[12px] text-gray-600 ${qlTheme.hoverBg} transition-colors group`}
                            >
                              <span>{ql.label}</span>
                              <FaChevronRight className="text-gray-400 group-hover:translate-x-0.5 text-[9px] transition-transform" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })()}

                {/* Daily Current Affairs Quiz (Dynamically Controlled by Admin) */}
                {(() => {
                  const ca = blog.currentAffairsWidget || {};
                  if (ca.enabled === false) return null;

                  const theme = THEME_CONFIGS[ca.theme] || THEME_CONFIGS.blue;
                  const title = ca.title || "Daily Current Affairs Quiz";
                  const desc = ca.description || "";
                  const badge = ca.badge;
                  const features = Array.isArray(ca.features) ? ca.features : [];
                  const btnText = ca.buttonText || "Attempt Now";
                  const targetLink = ca.link || "/livetest/current-affairs";

                  // Theme background styling for current affairs card
                  const cardBgStyle =
                    ca.theme === "white"
                      ? "bg-white border-gray-200"
                      : ca.theme === "emerald"
                      ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
                      : ca.theme === "purple"
                      ? "bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200"
                      : ca.theme === "amber"
                      ? "bg-gradient-to-br from-amber-50 to-orange-50 border-orange-200"
                      : ca.theme === "rose"
                      ? "bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200"
                      : ca.theme === "slate"
                      ? "bg-gradient-to-br from-slate-100 to-gray-100 border-slate-300"
                      : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200";

                  return (
                    <div className={`rounded-xl border shadow-sm p-3.5 transition-all hover:shadow-md ${cardBgStyle}`}>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <MdQuiz className={`${theme.icon} text-base flex-shrink-0`} />
                          <h3 className="font-semibold text-xs text-gray-800">{title}</h3>
                        </div>
                        {badge && (
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${theme.badge}`}>
                            {badge}
                          </span>
                        )}
                      </div>
                      {desc && <p className="text-[11px] text-gray-500 mb-2">{desc}</p>}
                      {features.length > 0 && (
                        <ul className="space-y-1 mb-2.5">
                          {features.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-1.5 text-[11px] text-gray-600">
                              <FaCheckCircle className={`${theme.icon} text-[10px] flex-shrink-0`} />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <Link
                        to={targetLink.startsWith("http") ? { pathname: targetLink } : targetLink}
                        target={targetLink.startsWith("http") ? "_blank" : "_self"}
                        className={`flex items-center justify-center gap-1.5 w-full ${theme.btn} text-xs font-semibold py-2 rounded-lg transition-colors shadow-xs`}
                      >
                        {btnText} <FaArrowRight className="text-[10px]" />
                      </Link>
                    </div>
                  );
                })()}

                {/* Desktop ad banners (Custom Blog Ad Images + Page Ads) */}
                {(() => {
                  if (blog.adImagesEnabled === false) return null;
                  const directAds = (blog.adImages || []).filter((a) => a.photo && a.photo.trim() !== "");
                  const combinedAds = directAds.length > 0 ? directAds : blogAd;
                  if (!combinedAds || combinedAds.length === 0) return null;

                  return (
                    <div className="space-y-4">
                      {combinedAds.map((item, idx) => {
                        const targetUrl = item.link || item.link_name || "#";
                        const isExt = targetUrl.startsWith("http");
                        return (
                          <div
                            key={item._id || idx}
                            className="hover:scale-[1.02] hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden shadow-sm border border-gray-200"
                          >
                            {isExt ? (
                              <a href={targetUrl} target="_blank" rel="noopener noreferrer">
                                <img src={item.photo} alt="Advertisement" className="w-full object-cover rounded-xl" />
                              </a>
                            ) : (
                              <Link to={targetUrl}>
                                <img src={item.photo} alt="Advertisement" className="w-full object-cover rounded-xl" />
                              </Link>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </aside>
          </div>

          {/* Mobile TOC floating button */}
          <MobileTOC tocItems={tocItems} scrollToHeading={scrollToHeading} activeSection={activeSection} />
        </div>
      </div>
    </>
  );
};

export default Subblog;
