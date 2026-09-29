import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

const PdfCourseAd = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro animations with fromTo and clearProps to guarantee visibility
      gsap.fromTo(
        ".pca-badge",
        { opacity: 0, y: -12, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.7)", clearProps: "all" }
      );

      gsap.fromTo(
        ".pca-title-line",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, delay: 0.1, ease: "power3.out", clearProps: "all" }
      );

      gsap.fromTo(
        ".pca-cta-btn",
        { opacity: 0, scale: 0.88, x: 20 },
        { opacity: 1, scale: 1, x: 0, duration: 0.7, delay: 0.25, ease: "back.out(1.5)", clearProps: "all" }
      );

      gsap.fromTo(
        ".pca-feature-item",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, delay: 0.35, ease: "power2.out", clearProps: "all" }
      );

      // Continuous arrow nudge
      gsap.to(".pca-btn-arrow", {
        x: 4,
        duration: 1.1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Subtle pulse on crown
      gsap.to(".pca-crown-icon", {
        rotate: 8,
        duration: 1.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full my-4">
      <div className="relative bg-white border border-slate-200/80 rounded-[2rem] p-6 sm:p-8 lg:p-10 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
        {/* Subtle Decorative Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-50 rounded-full blur-3xl pointer-events-none opacity-70" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-green-50 rounded-full blur-3xl pointer-events-none opacity-60" />

        <div className="relative z-10 space-y-6 lg:space-y-8">
          {/* Top Badge: BEST BANKING BUNDLE 2026 */}
          <div>
            <div className="pca-badge inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-bold text-xs tracking-wider uppercase shadow-xs">
              <svg
                className="pca-crown-icon w-4 h-4 text-emerald-700"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V17H19V19Z" />
              </svg>
              <span>BEST BANKING BUNDLE 2026</span>
            </div>
          </div>

          {/* Main Title & Action Button Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h2 className="pca-title-line text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none">
                365-Days{" "}
                <span className="bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-700 bg-clip-text text-transparent">
                  Rally
                </span>
              </h2>
              <h2 className="pca-title-line text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight mt-1 sm:mt-2">
                PDF Course
              </h2>
            </div>

            {/* Glowing Emerald CTA Button */}
            <div className="pca-cta-btn flex-shrink-0">
              <Link
                to="/pdf-course"
                className="group relative inline-flex items-center gap-3.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#047857] via-[#059669] to-[#047857] hover:from-[#059669] hover:to-[#10b981] text-white shadow-xl shadow-emerald-700/25 border border-emerald-400/40 hover:scale-[1.03] active:scale-95 transition-all duration-300"
              >
                {/* Glow highlight */}
                <span className="absolute inset-0 rounded-full bg-white/15 opacity-0 group-hover:opacity-100 transition-opacity" />

                <span className="text-base sm:text-lg font-bold tracking-tight">
                  View{" "}
                  <span className="">PDF</span>{" "}
                  Course
                </span>

                {/* White circle with right arrow */}
                <div className="pca-btn-arrow w-8 h-8 rounded-full bg-white text-emerald-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
              </Link>
            </div>
          </div>

          {/* Key Exam Features: Formatted in 2 Clean Rows */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            {/* ROW 1: 4 Key Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
              {/* Feature 1: Prelims & Mains */}
              <div className="pca-feature-item flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/60 border border-slate-100 hover:bg-white hover:shadow-xs transition-all">
                <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0 text-rose-600">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 leading-tight">Prelims &amp; Mains</h4>
                  <p className="text-xs text-slate-500 font-medium">Exact Exam Level Questions</p>
                </div>
              </div>

              {/* Feature 2: Section-wise & Topic-wise */}
              <div className="pca-feature-item flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/60 border border-slate-100 hover:bg-white hover:shadow-xs transition-all">
                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0 text-purple-600">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" strokeWidth="2.5" />
                    <line x1="16" y1="17" x2="8" y2="17" strokeWidth="2.5" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 leading-tight">Section &amp; Topic Wise</h4>
                  <p className="text-xs text-slate-500 font-medium">Targeted Concept Questions</p>
                </div>
              </div>

              {/* Feature 3: Based on 2018 to 2025 */}
              <div className="pca-feature-item flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/60 border border-slate-100 hover:bg-white hover:shadow-xs transition-all">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-600">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2.5" />
                    <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2.5" />
                    <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
                    <circle cx="8" cy="14" r="1.5" fill="currentColor" />
                    <circle cx="12" cy="14" r="1.5" fill="currentColor" />
                    <circle cx="16" cy="14" r="1.5" fill="currentColor" />
                    <circle cx="8" cy="18" r="1.5" fill="currentColor" />
                    <circle cx="12" cy="18" r="1.5" fill="currentColor" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 leading-tight">Based on 2018 to 2025</h4>
                  <p className="text-xs text-slate-500 font-medium">IBPS &amp; SBI Exam Questions</p>
                </div>
              </div>

              {/* Feature 4: All India Rank */}
              <div className="pca-feature-item flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/60 border border-slate-100 hover:bg-white hover:shadow-xs transition-all">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 text-amber-600">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2" />
                    <path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" />
                    <path d="M4 22h16" strokeWidth="2.5" />
                    <path d="M10 14.66V17c0 .55-.45 1-1 1H7" />
                    <path d="M14 14.66V17c0 .55.45 1 1 1h2" />
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" fill="#FEF3C7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 leading-tight">All India Rank</h4>
                  <p className="text-xs text-slate-500 font-medium">Live National Leaderboard</p>
                </div>
              </div>
            </div>

            {/* ROW 2: New Pattern Questions, Detailed Analysis and Solutions, Real Exam Interface */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
              {/* Feature 5: New Pattern Questions */}
              <div className="pca-feature-item flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/60 border border-slate-100 hover:bg-white hover:shadow-xs transition-all">
                <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0 text-orange-600">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 leading-tight">New Pattern Questions</h4>
                  <p className="text-xs text-slate-500 font-medium">Expected &amp; Surprise Trends</p>
                </div>
              </div>

              {/* Feature 6: Detailed Analysis and Solutions */}
              <div className="pca-feature-item flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/60 border border-slate-100 hover:bg-white hover:shadow-xs transition-all">
                <div className="w-9 h-9 rounded-xl bg-yellow-50 flex items-center justify-center flex-shrink-0 text-yellow-600">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18h6" strokeWidth="2.5" />
                    <path d="M10 22h4" strokeWidth="2.5" />
                    <path d="M12 2a7 7 0 0 0-7 7c0 3 2 5.5 3 7h8c1-1.5 3-4 3-7a7 7 0 0 0-7-7z" fill="#FEF9C3" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 leading-tight">Detailed Analysis &amp; Solutions</h4>
                  <p className="text-xs text-slate-500 font-medium">Step-by-Step Explanations</p>
                </div>
              </div>

              {/* Feature 7: Real Exam Interface */}
              <div className="pca-feature-item flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/60 border border-slate-100 hover:bg-white hover:shadow-xs transition-all">
                <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0 text-sky-600">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" strokeWidth="2.5" />
                    <line x1="12" y1="17" x2="12" y2="21" strokeWidth="2.5" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 leading-tight">Real Exam Interface</h4>
                  <p className="text-xs text-slate-500 font-medium">Actual Bank Exam Simulation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfCourseAd;