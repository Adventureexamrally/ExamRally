import React, { useEffect, useState, useMemo } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import {
  FaChevronLeft,
  FaChevronRight,
  FaArrowRight,
  FaBookOpen,
  FaChartLine,
  FaLaptop,
  FaPenNib,
} from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Api from "../service/Api";
import {
  LEFT_BANNER_THEMES,
  LEFT_BANNER_DESIGNS,
  RIGHT_BANNER_THEMES,
  RIGHT_BANNER_DESIGNS,
} from "../pages/blog/bannerThemes";

const CustomPrevArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Previous slide"
      className="!absolute !left-3 sm:!left-4 !top-1/2 !-translate-y-1/2 !z-30 !w-8 !h-8 sm:!w-9 sm:!h-9 !rounded-full !bg-white/90 hover:!bg-white !text-gray-800 !shadow-md !flex !items-center !justify-center !transition-all hover:!scale-110 active:!scale-95 !border !border-slate-200/80 !p-0 !min-h-0 !min-w-0"
    >
      <FaChevronLeft className="text-xs sm:text-sm text-slate-700 pointer-events-none" />
    </button>
  );
};

const CustomNextArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Next slide"
      className="!absolute !right-3 sm:!right-4 !top-1/2 !-translate-y-1/2 !z-30 !w-8 !h-8 sm:!w-9 sm:!h-9 !rounded-full !bg-white/90 hover:!bg-white !text-gray-800 !shadow-md !flex !items-center !justify-center !transition-all hover:!scale-110 active:!scale-95 !border !border-slate-200/80 !p-0 !min-h-0 !min-w-0"
    >
      <FaChevronRight className="text-xs sm:text-sm text-slate-700 pointer-events-none" />
    </button>
  );
};

/**
 * Universal Banner Component
 * @param {string} mode - "auto" | "slider" | "blog"
 * @param {boolean} enabled - Toggle display (if false, returns null)
 * @param {string} className - Optional container styling
 */
const Banner = ({ mode = "auto", enabled = true, className = "" }) => {
  const [slides, setSlides] = useState([]);
  const [blogBanner, setBlogBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    Promise.allSettled([
      Api.get("banner/get/active"),
      Api.get("/blog-banner"),
    ])
      .then(([slidesRes, blogRes]) => {
        if (!isMounted) return;

        if (slidesRes.status === "fulfilled" && Array.isArray(slidesRes.value?.data)) {
          setSlides(slidesRes.value.data);
        }
        if (blogRes.status === "fulfilled" && blogRes.value?.data) {
          setBlogBanner(blogRes.value.data);
        }
      })
      .catch((err) => {
        console.error("Banner fetch error:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [enabled]);

  // Dynamic Theme Tokens for Blog Mode
  const activeLeftTheme = useMemo(() => {
    return (
      LEFT_BANNER_THEMES[blogBanner?.leftBanner?.colorTheme] ||
      LEFT_BANNER_THEMES.emerald
    );
  }, [blogBanner?.leftBanner?.colorTheme]);

  const activeLeftDesign = useMemo(() => {
    return (
      LEFT_BANNER_DESIGNS[blogBanner?.leftBanner?.designStyle] ||
      LEFT_BANNER_DESIGNS.classic
    );
  }, [blogBanner?.leftBanner?.designStyle]);

  const activeRightTheme = useMemo(() => {
    return (
      RIGHT_BANNER_THEMES[blogBanner?.rightBanner?.colorTheme] ||
      RIGHT_BANNER_THEMES.forest
    );
  }, [blogBanner?.rightBanner?.colorTheme]);

  const activeRightDesign = useMemo(() => {
    return (
      RIGHT_BANNER_DESIGNS[blogBanner?.rightBanner?.designStyle] ||
      RIGHT_BANNER_DESIGNS.classic
    );
  }, [blogBanner?.rightBanner?.designStyle]);

  // If globally disabled via prop, auto-hide
  if (!enabled) return null;

  // Compact, responsive loading skeleton (no more 100vh jarring layout)
  if (loading) {
    return (
      <div className={`w-full py-2 ${className}`}>
        <div className="w-full h-36 sm:h-44 md:h-52 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse rounded-2xl border border-gray-200/80" />
      </div>
    );
  }

  // Determine which banner format to render
  const isBlogBannerActive =
    blogBanner &&
    blogBanner.status !== "INACTIVE" &&
    (blogBanner.leftBanner?.enabled !== false ||
      blogBanner.rightBanner?.enabled !== false);

  const shouldRenderBlog =
    mode === "blog" || (mode === "auto" && isBlogBannerActive && slides.length === 0);

  // ==========================================
  // 1. DUAL BLOG BANNER MODE
  // ==========================================
  if (shouldRenderBlog && isBlogBannerActive) {
    const isLeftEnabled = blogBanner.leftBanner?.enabled !== false;
    const isRightEnabled = blogBanner.rightBanner?.enabled !== false;

    if (!isLeftEnabled && !isRightEnabled) return null;

    return (
      <div className={`w-full ${className}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
          {/* Left Banner: Mock Test Series */}
          {isLeftEnabled && (
            <div
              className={`${
                !isRightEnabled ? "lg:col-span-12" : "lg:col-span-8 xl:col-span-9"
              } ${activeLeftTheme.containerBg} ${activeLeftTheme.border} ${
                activeLeftDesign.wrapperClass
              } p-3 sm:p-4 relative overflow-hidden flex flex-col justify-between`}
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div
                  className={`${
                    blogBanner.leftBanner?.showTargetExams !== false
                      ? "md:col-span-7"
                      : "md:col-span-12"
                  } space-y-1.5`}
                >
                  <span
                    className={`inline-block ${activeLeftTheme.badge} text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs`}
                  >
                    {blogBanner.leftBanner?.badge || "BANK EXAM"}
                  </span>

                  <h2 className={`text-lg sm:text-xl font-black ${activeLeftTheme.textColor} tracking-tight`}>
                    {blogBanner.leftBanner?.title || "MOCK TEST SERIES"}
                  </h2>
                  <p className={`text-xs ${activeLeftTheme.subtitleColor} font-medium`}>
                    {blogBanner.leftBanner?.subtitle || "Practice with Real Exam Level Questions"}
                  </p>

                  {/* Bullet points */}
                  <div className="grid grid-cols-2 gap-1.5 my-1.5">
                    {(blogBanner.leftBanner?.features || []).map((feat, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-1.5 text-[11px] font-semibold ${activeLeftTheme.featuresColor}`}
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded-full ${activeLeftTheme.checkmark} flex items-center justify-center text-[8px] flex-shrink-0 font-bold`}
                        >
                          ✓
                        </span>
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Button */}
                  <div className="pt-1">
                    <Link
                      to={blogBanner.leftBanner?.buttonLink || "/subscriptions"}
                      className={`inline-flex items-center gap-1.5 ${activeLeftTheme.button} font-bold text-xs px-4 py-1.5 rounded-full shadow-xs transition-all`}
                    >
                      <span>{blogBanner.leftBanner?.buttonText || "Explore Mock Test Series"}</span>
                      <FaArrowRight className="text-[9px]" />
                    </Link>
                  </div>
                </div>

                {/* Target Bank Exams Companion */}
                {blogBanner.leftBanner?.showTargetExams !== false && (
                  <div
                    className={`md:col-span-5 ${activeLeftTheme.examCardBg} border ${activeLeftTheme.examCardBorder} rounded-xl p-2.5 shadow-2xs`}
                  >
                    <div className="text-[10px] font-bold uppercase mb-1.5 flex items-center justify-between">
                      <span className={activeLeftTheme.textColor}>
                        {blogBanner.leftBanner?.targetExamsTitle || "Target Bank Exams"}
                      </span>
                      <span
                        className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded ${activeLeftTheme.badge}`}
                      >
                        {blogBanner.leftBanner?.targetExamsBadge || "Live Tests"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1">
                      {(blogBanner.leftBanner?.targetExamsList || [
                        "IBPS PO",
                        "IBPS Clerk",
                        "SBI PO",
                        "SBI Clerk",
                        "RRB PO",
                        "RRB Clerk",
                      ])
                        .slice(0, 6)
                        .map((exam, i) => (
                          <div
                            key={i}
                            className="text-center py-1 px-1.5 rounded text-[10px] font-bold bg-slate-50 border border-slate-200/60 text-slate-700 truncate"
                          >
                            {exam}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Right Banner: Rally PDF Course */}
          {isRightEnabled && (
            <div
              className={`${
                !isLeftEnabled ? "lg:col-span-12" : "lg:col-span-4 xl:col-span-3"
              } ${activeRightTheme.containerBg} ${activeRightTheme.border} ${
                activeRightDesign.wrapperClass
              } p-3 sm:p-4 ${activeRightTheme.textColor} relative overflow-hidden flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span
                    className={`${activeRightTheme.badge} text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider`}
                  >
                    {blogBanner.rightBanner?.badge || "365 DAYS"}
                  </span>
                  <div className="bg-red-600 text-white font-black px-1.5 py-0.5 rounded text-[10px]">
                    ₹{blogBanner.rightBanner?.priceTag || "365"}
                  </div>
                </div>

                <h2 className="text-base font-black text-white tracking-wide leading-tight">
                  {blogBanner.rightBanner?.title || "RALLY PDF COURSE"}
                </h2>
                <p className={`${activeRightTheme.featuresColor} text-[11px] font-medium mt-0.5`}>
                  {blogBanner.rightBanner?.subtitle || "Complete Preparation for Bank Exams"}
                </p>

                <div className={`space-y-1 text-[10px] ${activeRightTheme.featuresColor} my-2`}>
                  {(blogBanner.rightBanner?.features || []).slice(0, 4).map((feat, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span
                        className={`w-3 h-3 rounded-full ${activeRightTheme.checkmark} flex items-center justify-center text-[7px] font-black flex-shrink-0`}
                      >
                        ✓
                      </span>
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-1">
                <Link
                  to={blogBanner.rightBanner?.buttonLink || "/pdf-course"}
                  className={`block text-center ${activeRightTheme.button} font-bold text-xs py-1.5 rounded-full shadow-xs transition-all`}
                >
                  {blogBanner.rightBanner?.buttonText || "View 365 Days Course"} →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. SLIDER / IMAGE BANNER MODE
  // ==========================================
  if (slides.length === 0) {
    // If no slides are active and blog mode is not active, cleanly auto-hide
    return null;
  }

  const sliderSettings = {
    dots: slides.length > 1,
    infinite: slides.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: slides.length > 1,
    autoplaySpeed: 3800,
    pauseOnHover: true,
    adaptiveHeight: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    appendDots: (dots) => (
      <div className="!bottom-2.5 sm:!bottom-3 !z-20 !flex !justify-center !w-full pointer-events-none">
        <ul className="flex items-center gap-1.5 m-0 px-2 py-1 bg-black/40 backdrop-blur-xs rounded-full list-none shadow-xs pointer-events-auto">
          {dots}
        </ul>
      </div>
    ),
    customPaging: () => (
      <span className="banner-nav-dot block rounded-full transition-all duration-300" />
    ),
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Scoped CSS for seamless banner height and arrow/dot aesthetics */}
      <style>{`
        .banner-slider .slick-slide {
          height: auto !important;
        }
        .banner-slider .slick-slide > div {
          height: auto !important;
          line-height: normal !important;
        }
        .banner-slider .slick-list {
          transition: height 350ms cubic-bezier(0.4, 0, 0.2, 1) !important;
          overflow: hidden !important;
        }
        .banner-slider .slick-dots {
          bottom: 10px !important;
          display: flex !important;
          justify-content: center !important;
        }
        .banner-slider .slick-dots li {
          width: auto !important;
          height: auto !important;
          margin: 0 2px !important;
          padding: 0 !important;
          display: inline-flex !important;
          align-items: center !important;
        }
        .banner-slider .slick-dots li .banner-nav-dot {
          width: 6px;
          height: 6px;
          background: rgba(255, 255, 255, 0.5);
        }
        .banner-slider .slick-dots li.slick-active .banner-nav-dot {
          width: 18px;
          background: #ffffff;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        .banner-slider .slick-dots li button {
          padding: 0 !important;
          width: auto !important;
          height: auto !important;
          background: transparent !important;
          border: 0 !important;
        }
        .banner-slider .slick-dots li button:before {
          display: none !important;
        }
        .banner-slider .slick-prev,
        .banner-slider .slick-next {
          width: 36px !important;
          height: 36px !important;
          padding: 0 !important;
          border-radius: 9999px !important;
        }
        .banner-slider .slick-prev:before,
        .banner-slider .slick-next:before {
          display: none !important;
        }
      `}</style>

      {(() => {
        const renderSlideBody = (slide, index) => {
          const isDynamic =
            slide.bannerType === "dynamic" ||
            (!slide.photo && (slide.badge || slide.features?.length > 0));

          if (isDynamic) {
            const theme = LEFT_BANNER_THEMES[slide.colorTheme] || LEFT_BANNER_THEMES.emerald;
            const design = LEFT_BANNER_DESIGNS[slide.designStyle] || LEFT_BANNER_DESIGNS.classic;
            const showTargetExams = slide.showTargetExams !== false;

            return (
              <div
                className={`w-full ${theme.containerBg} ${theme.border} ${design.wrapperClass} p-4 sm:p-6 md:p-8 relative overflow-hidden flex flex-col justify-between`}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className={`${showTargetExams ? "md:col-span-7" : "md:col-span-12"} space-y-2`}>
                    {slide.badge && (
                      <div className="pt-0.5 pb-1">
                        <span
                          className={`inline-block ${theme.badge} text-[10px] sm:text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs leading-tight`}
                        >
                          {slide.badge}
                        </span>
                      </div>
                    )}

                    <h2
                      className={`text-xl sm:text-2xl md:text-3xl font-black ${theme.textColor} tracking-tight leading-tight`}
                    >
                      {slide.title || "MOCK TEST SERIES"}
                    </h2>

                    {slide.subtitle && (
                      <p className={`text-xs sm:text-sm ${theme.subtitleColor} font-medium`}>
                        {slide.subtitle}
                      </p>
                    )}

                    {/* Features checklist */}
                    {Array.isArray(slide.features) && slide.features.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 my-2 sm:my-3">
                        {slide.features.map((feat, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold ${theme.featuresColor}`}
                          >
                            <span
                              className={`w-3.5 h-3.5 rounded-full ${theme.checkmark} flex items-center justify-center text-[8px] flex-shrink-0 font-bold`}
                            >
                              ✓
                            </span>
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Pricing Highlight */}
                    {(slide.showPricing || slide.priceTag) && (
                      <div className="flex flex-wrap items-center gap-2.5 pt-1.5 pb-0.5">
                        <div className="inline-flex items-baseline gap-2 px-3 py-1.5 rounded-xl bg-white/95 border border-slate-200/90 shadow-2xs">
                          {slide.originalPrice && (
                            <span className="text-xs sm:text-sm line-through text-slate-400 font-bold">
                              {slide.originalPrice.startsWith("₹") || slide.originalPrice.startsWith("Rs")
                                ? slide.originalPrice
                                : `₹${slide.originalPrice}`}
                            </span>
                          )}
                          <span className={`text-xl sm:text-2xl md:text-3xl font-black ${theme.titleHighlight || theme.textColor} tracking-tight`}>
                            {slide.priceTag.startsWith("₹") || slide.priceTag.startsWith("Rs")
                              ? slide.priceTag
                              : `₹${slide.priceTag}`}
                          </span>
                          {slide.priceSubtext && (
                            <span className={`text-[11px] sm:text-xs font-bold ${theme.subtitleColor}`}>
                              {slide.priceSubtext}
                            </span>
                          )}
                        </div>
                        {slide.discountText && (
                          <span className="text-[10px] sm:text-[11px] font-black px-2.5 py-1 rounded-full bg-red-600 text-white uppercase tracking-wider shadow-xs">
                            {slide.discountText}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Button */}
                    <div className="pt-1.5">
                      <Link
                        to={slide.buttonLink || slide.link || "/subscriptions"}
                        className={`inline-flex items-center gap-2 ${theme.button} font-bold text-xs sm:text-sm px-5 py-2 sm:py-2.5 rounded-full shadow-sm hover:scale-[1.02] active:scale-95 transition-all`}
                      >
                        <span>{slide.buttonText || "Explore Mock Test Series"}</span>
                        <FaArrowRight className="text-[10px]" />
                      </Link>
                    </div>
                  </div>

                  {/* Companion: Target Bank Exams and/or Price List */}
                  {(showTargetExams || (slide.showPriceList && slide.priceList?.length > 0)) && (
                    <div
                      className={`md:col-span-5 ${theme.examCardBg} border ${theme.examCardBorder} rounded-2xl p-3.5 sm:p-4 shadow-sm space-y-3`}
                    >
                      {/* Price List Section */}
                      {slide.showPriceList && Array.isArray(slide.priceList) && slide.priceList.length > 0 && (
                        <div>
                          <div className="text-[10px] sm:text-xs font-bold uppercase mb-2 flex items-center justify-between">
                            <span className={theme.textColor}>
                              {slide.priceListTitle || "Special Price Plans"}
                            </span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${theme.badge}`}>
                              {slide.priceListBadge || "Limited Offer"}
                            </span>
                          </div>

                          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-0.5">
                            {slide.priceList.map((plan, pIdx) => (
                              <Link
                                key={pIdx}
                                to={plan.link || slide.buttonLink || "/subscriptions"}
                                className="flex items-center justify-between p-2.5 rounded-xl bg-white/95 hover:bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all group/plan text-slate-800"
                              >
                                <div className="flex-1 min-w-0 pr-2">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-xs truncate text-slate-900">
                                      {plan.planName || `Plan ${pIdx + 1}`}
                                    </span>
                                    {plan.badge && (
                                      <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200 uppercase">
                                        {plan.badge}
                                      </span>
                                    )}
                                  </div>
                                  {plan.validity && (
                                    <span className="text-[10px] text-slate-500 font-medium block">
                                      {plan.validity}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <div className="text-right">
                                    {plan.originalPrice && (
                                      <span className="text-[10px] line-through text-slate-400 block leading-none font-semibold">
                                        {plan.originalPrice.startsWith("₹") || plan.originalPrice.startsWith("Rs")
                                          ? plan.originalPrice
                                          : `₹${plan.originalPrice}`}
                                      </span>
                                    )}
                                    <span className="text-sm font-black text-emerald-700 leading-tight">
                                      {plan.price
                                        ? (plan.price.startsWith("₹") || plan.price.startsWith("Rs") ? plan.price : `₹${plan.price}`)
                                        : "FREE"}
                                    </span>
                                  </div>
                                  <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover/plan:bg-emerald-600 group-hover/plan:text-white transition-colors text-xs font-bold">
                                    →
                                  </span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Target Bank Exams Section */}
                      {showTargetExams && (
                        <div className={slide.showPriceList && slide.priceList?.length > 0 ? "pt-2 border-t border-slate-200/50" : ""}>
                          <div className="text-[10px] sm:text-xs font-bold uppercase mb-2 flex items-center justify-between">
                            <span className={theme.textColor}>
                              {slide.targetExamsTitle || "Target Bank Exams"}
                            </span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${theme.badge}`}>
                              {slide.targetExamsBadge || "Live Tests"}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-1.5">
                            {(slide.targetExamsList || [
                              "IBPS PO",
                              "IBPS Clerk",
                              "SBI PO",
                              "SBI Clerk",
                              "RRB PO",
                              "RRB Clerk",
                            ])
                              .slice(0, slide.showPriceList && slide.priceList?.length > 0 ? 6 : 14)
                              .map((exam, i) => (
                                <div
                                  key={i}
                                  className="text-center py-1.5 px-2 rounded-lg text-[10.5px] font-bold bg-slate-50 border border-slate-200/70 text-slate-700 truncate shadow-2xs"
                                >
                                  {exam}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          }

          // Image slide
          return (
            <a
              href={slide.link || "#"}
              target={slide.link?.startsWith("http") ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="block w-full outline-none focus:outline-none leading-none"
            >
              <img
                src={slide.photo}
                alt={slide.title || `Slide ${index + 1}`}
                className="w-full h-auto block select-none pointer-events-none mx-auto"
                loading={index === 0 ? "eager" : "lazy"}
                onLoad={() => {
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new Event("resize"));
                  }
                }}
              />
            </a>
          );
        };

        if (slides.length === 1) {
          return (
            <div className="relative w-full overflow-hidden rounded-2xl shadow-sm border border-slate-200/90 group bg-slate-50">
              {renderSlideBody(slides[0], 0)}
            </div>
          );
        }

        return (
          <div className="relative w-full overflow-hidden rounded-2xl shadow-sm border border-slate-200/90 bg-slate-50 banner-slider group">
            <Slider {...sliderSettings}>
              {slides.map((slide, index) => (
                <div key={slide._id || index} className="relative outline-none select-none">
                  {renderSlideBody(slide, index)}
                </div>
              ))}
            </Slider>
          </div>
        );
      })()}
    </div>
  );
};

export default Banner;
