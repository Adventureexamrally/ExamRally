import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import YoutubeVideo from "./Youtube/YoutubeVideo";

const featureCards = [
  {
    num: "01",
    badgeBg: "bg-rose-50 text-rose-500 border-rose-100",
    titlePrefix: "Real Exam Interface with ",
    titleHighlight: "Smart Questioning",
    highlightColor: "text-rose-500",
    description:
      "Experience the actual bank exam environment with a user-friendly interface, just like the real exam, with questions of Easy, Moderate and Hard levels.",
    image: "/why-choose/card1-laptop.jpg",
    alt: "Real Exam Interface Laptop",
  },
  {
    num: "02",
    badgeBg: "bg-sky-50 text-sky-600 border-sky-100",
    titlePrefix: "Topic-Wise ",
    titleHighlight: "Mastery",
    highlightColor: "text-sky-600",
    description:
      "Strengthen your weak topics with dedicated Topic Tests for Quantitative Aptitude, Reasoning, English, Computer Awareness, Banking Awareness, Static GK and Insurance Awareness.",
    image: "/why-choose/card2-books.jpg",
    alt: "Topic Wise Mastery Books with Bulb",
  },
  {
    num: "03",
    badgeBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
    titlePrefix: "Prelims & Mains ",
    titleHighlight: "Mock Tests",
    highlightColor: "text-emerald-600",
    description:
      "Go beyond basic practice with high-quality Prelims and Mains Mock Tests designed as per the latest exam pattern. Our tests are carefully structured to match and slightly exceed the real exam difficulty.",
    image: "/why-choose/card3-clipboard.jpg",
    alt: "Prelims and Mains Mock Tests Clipboard",
  },
  {
    num: "04",
    badgeBg: "bg-amber-50 text-amber-600 border-amber-100",
    titlePrefix: "High-Level & ",
    titleHighlight: "New Pattern Questions",
    highlightColor: "text-amber-600",
    description:
      "Stay updated with the latest exam trends with high-level questions and new patterns. We cover previous year questions (2018-2025), expected questions and surprise patterns.",
    image: "/why-choose/card4-chart.jpg",
    alt: "High Level and New Pattern Questions Chart",
  },
  {
    num: "05",
    badgeBg: "bg-purple-50 text-purple-600 border-purple-100",
    titlePrefix: "Budget-Friendly ",
    titleHighlight: "for Every Aspirant",
    highlightColor: "text-purple-600",
    description:
      "Quality preparation shouldn't be expensive. At Examrally, we offer top-notch mock tests at an affordable price, ensuring every student gets access to the best resources without overspending.",
    image: "/why-choose/card5-piggy.jpg",
    alt: "Budget Friendly Pink Piggy Bank with Coin",
  },
  {
    num: "06",
    badgeBg: "bg-teal-50 text-teal-600 border-teal-100",
    titlePrefix: "All India ",
    titleHighlight: "Performance Ranking",
    highlightColor: "text-teal-600",
    description:
      "Know where you stand among thousands of aspirants across India. Our detailed ranking and performance analysis helps you track your progress, identify your strong and weak areas, and stay ahead in the competition.",
    image: "/why-choose/card6-trophy.jpg",
    alt: "All India Performance Ranking Winners Podium and Trophy",
  },
];

export default function Features() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Clean intro animations with clearProps to avoid getting stuck
      gsap.fromTo(
        ".wc-main-title",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", clearProps: "all" }
      );

      gsap.fromTo(
        ".wc-subtitle",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.1, ease: "power2.out", clearProps: "all" }
      );

      gsap.fromTo(
        ".wc-card",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
          delay: 0.15,
          ease: "power2.out",
          clearProps: "all",
        }
      );

      gsap.fromTo(
        ".wc-bottom-banner",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.35, ease: "power2.out", clearProps: "all" }
      );

      // Continuous subtle floating micro-animations on 3D images
      gsap.to(".wc-3d-img", {
        y: -4,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        stagger: 0.2,
        ease: "sine.inOut",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative w-full py-8 sm:py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#f8fbff] via-[#f5f9fc] to-white overflow-hidden"
      >
        {/* Subtle Decorative Background Dot Grids */}
        <div className="absolute top-6 left-6 text-slate-200 pointer-events-none select-none hidden lg:block opacity-50">
          <svg width="70" height="70" fill="currentColor" viewBox="0 0 70 70">
            {[0, 15, 30, 45, 60].map((x) =>
              [0, 15, 30, 45, 60].map((y) => (
                <circle key={`${x}-${y}`} cx={x + 3} cy={y + 3} r="1.8" />
              ))
            )}
          </svg>
        </div>
        <div className="absolute top-8 right-8 text-slate-200 pointer-events-none select-none hidden lg:block opacity-50">
          <svg width="70" height="70" fill="currentColor" viewBox="0 0 70 70">
            {[0, 15, 30, 45, 60].map((x) =>
              [0, 15, 30, 45, 60].map((y) => (
                <circle key={`${x}-${y}`} cx={x + 3} cy={y + 3} r="1.8" />
              ))
            )}
          </svg>
        </div>

        {/* Ambient background glows */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[550px] h-[250px] bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header Section - Compact */}
          <div className="text-center mb-7 sm:mb-9">
            <h2 className="wc-main-title text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center flex-wrap gap-x-2.5 gap-y-1">
              <span>Why Choose</span>
              <span className="relative text-blue-600 inline-block">
                Examrally?
                {/* Yellow curved brush swoosh underline */}
                <svg
                  className="absolute -bottom-2.5 left-0 w-full h-3 overflow-visible pointer-events-none"
                  viewBox="0 0 200 18"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M3 14C55 4 145 3 197 12"
                    stroke="#FBBF24"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
                {/* Radiating Accent Spark Lines */}
                <svg
                  className="absolute -top-3 -right-5 w-5 h-5 overflow-visible pointer-events-none"
                  viewBox="0 0 30 30"
                  fill="none"
                >
                  <path d="M6 18L1 19" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M11 11L7 6" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M19 13L25 10" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </span>
            </h2>

            <p className="wc-subtitle mt-2 text-xs sm:text-sm md:text-base text-slate-500 font-medium max-w-xl mx-auto">
              Your Complete Online Mock Test Platform for Bank &amp; Insurance Exams
            </p>
          </div>

          {/* 6 Feature Cards Grid - Compact & Balanced */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {featureCards.map((card) => (
              <div
                key={card.num}
                className="wc-card group relative bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                style={{ opacity: 1 }}
              >
                {/* Content & 3D Image Row */}
                <div className="flex flex-row items-center justify-between gap-3 h-full">
                  {/* Left Column: Number, Title, Description */}
                  <div className="flex-1 min-w-0 pr-1 flex flex-col justify-center">
                    <span
                      className={`inline-block w-fit px-2.5 py-0.5 rounded-full text-[11px] font-bold border mb-2 ${card.badgeBg}`}
                    >
                      {card.num}
                    </span>

                    <h3 className="text-base sm:text-lg font-bold text-slate-800 leading-snug tracking-tight">
                      {card.titlePrefix}
                      <span className={card.highlightColor}>{card.titleHighlight}</span>
                    </h3>

                    <p className="text-slate-500 text-xs sm:text-[13px] leading-relaxed mt-1.5">
                      {card.description}
                    </p>
                  </div>

                  {/* Right Column: Compact 3D Illustration */}
                  <div className="flex-shrink-0 w-24 sm:w-28 lg:w-32 h-24 sm:h-28 lg:h-32 relative flex items-center justify-center">
                    <img
                      src={card.image}
                      alt={card.alt}
                      className="wc-3d-img w-full h-full object-contain mix-blend-multiply drop-shadow-sm select-none pointer-events-none group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Banner - Compact */}
          <div className="mt-8 sm:mt-10 flex justify-center">
            <div
              className="wc-bottom-banner inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 px-5 sm:px-8 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-sky-50 via-cyan-50 to-blue-50 border border-blue-100 shadow-xs"
              style={{ opacity: 1 }}
            >
              <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs sm:text-sm">
                <span className="text-base sm:text-lg">🚀</span>
                <span>Practice Smarter.</span>
              </div>

              <span className="text-blue-200 hidden sm:inline font-light text-sm">|</span>

              <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs sm:text-sm">
                <span className="text-base sm:text-lg">🎯</span>
                <span>Score Higher.</span>
              </div>

              <span className="text-blue-200 hidden sm:inline font-light text-sm">|</span>

              <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs sm:text-sm">
                <span className="text-base sm:text-lg">📈</span>
                <span>Succeed Faster.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preserve existing YoutubeVideo component */}
      <YoutubeVideo />
    </>
  );
}
