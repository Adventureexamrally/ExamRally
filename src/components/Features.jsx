import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import YoutubeVideo from "./Youtube/YoutubeVideo";

const featureCards = [
  {
    num: "01",
    badgeBg: "bg-[#ffe5ec] text-[#e11d48] border-[#fecdd3]",
    cardBg: "bg-gradient-to-br from-white via-[#fffbfc] to-[#fff1f4] border-[#ffe4e6]",
    titleFirst: "Real Exam Interface with",
    titleHighlight: "Smart Questioning",
    highlightColor: "text-[#e11d48]",
    description:
      "Experience the actual bank exam environment with a user-friendly interface, just like the real exam, with questions of Easy, Moderate and Hard levels.",
    image: "/why-choose/card1-laptop.png?v=3",
    alt: "Real Exam Interface with Smart Questioning",
  },
  {
    num: "02",
    badgeBg: "bg-[#e0f2fe] text-[#0284c7] border-[#bae6fd]",
    cardBg: "bg-gradient-to-br from-white via-[#fbfdff] to-[#f0f7ff] border-[#e0f2fe]",
    titleFirst: "Topic-Wise",
    titleHighlight: "Mastery",
    highlightColor: "text-[#0284c7]",
    description:
      "Strengthen your weak topics with dedicated Topic Tests for Quantitative Aptitude, Reasoning, English, Computer Awareness, Banking Awareness, Static GK and Insurance Awareness.",
    image: "/why-choose/card2-books.png?v=3",
    alt: "Topic-Wise Mastery",
  },
  {
    num: "03",
    badgeBg: "bg-[#dcfce7] text-[#16a34a] border-[#bbf7d0]",
    cardBg: "bg-gradient-to-br from-white via-[#fbfdfb] to-[#f0fbf3] border-[#dcfce7]",
    titleFirst: "Prelims & Mains",
    titleHighlight: "Mock Tests",
    highlightColor: "text-[#16a34a]",
    description:
      "Go beyond basic practice with high-quality Prelims and Mains Mock Tests designed as per the latest exam pattern. Our tests are carefully structured to match and slightly exceed the real exam difficulty.",
    image: "/why-choose/card3-clipboard.png?v=3",
    alt: "Prelims & Mains Mock Tests",
  },
  {
    num: "04",
    badgeBg: "bg-[#fef3c7] text-[#d97706] border-[#fde68a]",
    cardBg: "bg-gradient-to-br from-white via-[#fffdfa] to-[#fef8e7] border-[#fef3c7]",
    titleFirst: "High-Level &",
    titleHighlight: "New Pattern Questions",
    highlightColor: "text-[#d97706]",
    description:
      "Stay updated with the latest exam trends with high-level questions and new patterns. We cover previous year questions (2018-2025), expected questions and surprise patterns.",
    image: "/why-choose/card4-chart.png?v=3",
    alt: "High-Level & New Pattern Questions",
  },
  {
    num: "05",
    badgeBg: "bg-[#f3e8ff] text-[#9333ea] border-[#e9d5ff]",
    cardBg: "bg-gradient-to-br from-white via-[#fdfbff] to-[#f7f0ff] border-[#f3e8ff]",
    titleFirst: "Budget-Friendly",
    titleHighlight: "for Every Aspirant",
    highlightColor: "text-[#9333ea]",
    description:
      "Quality preparation shouldn't be expensive. At Examrally, we offer top-notch mock tests at an affordable price, ensuring every student gets access to the best resources without overspending.",
    image: "/why-choose/card5-piggy.png?v=3",
    alt: "Budget-Friendly for Every Aspirant",
  },
  {
    num: "06",
    badgeBg: "bg-[#ccfbf1] text-[#0d9488] border-[#99f6e4]",
    cardBg: "bg-gradient-to-br from-white via-[#fbfeff] to-[#f0faf8] border-[#ccfbf1]",
    titleFirst: "All India",
    titleHighlight: "Performance Ranking",
    highlightColor: "text-[#0d9488]",
    description:
      "Know where you stand among thousands of aspirants across India. Our detailed ranking and performance analysis helps you track your progress, identify your strong and weak areas, and stay ahead in the competition.",
    image: "/why-choose/card6-trophy.png?v=3",
    alt: "All India Performance Ranking",
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

      // Continuous subtle floating micro-animations on exact extracted 3D graphics
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
        className="relative w-full py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#f8fbff] via-[#f5f9fc] to-white overflow-hidden"
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
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[650px] h-[300px] bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1420px] mx-auto relative z-10">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="wc-main-title text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center flex-wrap gap-x-3 gap-y-1">
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
                    strokeWidth="4.5"
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

            <p className="wc-subtitle mt-2.5 text-xs sm:text-sm md:text-base text-slate-500 font-medium max-w-xl mx-auto">
              Your Complete Online Mock Test Platform for Bank &amp; Insurance Exams
            </p>
          </div>

          {/* 6 Feature Cards Grid - Fixed Horizontal Alignment */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
            {featureCards.map((card) => (
              <div
                key={card.num}
                className={`wc-card group relative rounded-3xl p-5 sm:p-6 border shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden ${card.cardBg}`}
                style={{ opacity: 1 }}
              >
                {/* 1. TOP: Badge and Title (Spans full width across card top) */}
                <div>
                  <span
                    className={`inline-block w-fit px-2.5 py-0.5 rounded-full text-xs font-bold border mb-2.5 ${card.badgeBg}`}
                  >
                    {card.num}
                  </span>

                  <h3 className="text-base sm:text-lg lg:text-[19px] font-bold text-slate-900 leading-snug tracking-tight">
                    {card.titleFirst}{" "}
                    <span className={card.highlightColor}>{card.titleHighlight}</span>
                  </h3>
                </div>

                {/* 2. BOTTOM: Description on Left, 3D Image on Right */}
                <div className="mt-3.5 flex flex-row items-center justify-between gap-3">
                  <p className="text-slate-500 text-xs sm:text-[13.5px] leading-relaxed flex-1 min-w-0 pr-1">
                    {card.description}
                  </p>

                  <div className="flex-shrink-0 w-28 sm:w-32 lg:w-36 h-28 sm:h-32 lg:h-36 relative flex items-center justify-end">
                    <img
                      src={card.image}
                      alt={card.alt}
                      className="wc-3d-img w-full h-full object-contain object-right drop-shadow-xs select-none pointer-events-none group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Banner - Kept commented out as requested */}
          {/* <div className="mt-8 sm:mt-10 flex justify-center"> ... </div> */}
        </div>
      </section>

      {/* Preserve existing YoutubeVideo component */}
      <YoutubeVideo />
    </>
  );
}
