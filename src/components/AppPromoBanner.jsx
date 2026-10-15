import React from "react";
import { FaArrowRight, FaClipboardList, FaFire, FaNewspaper, FaTrophy } from "react-icons/fa";
import googlePlayImg from "../assets/logo/google-play.png";
import { RIGHT_BANNER_THEMES } from "../pages/blog/bannerThemes";

const DEFAULT_FEATURES = [
  "Real Exam Pattern Mock Tests",
  "Daily Speed Quizzes & PYQs",
  "Daily Current Affairs & Analysis",
  "All India Rank & Performance",
];

const FEATURE_ICONS = [
  <FaClipboardList className="text-[10px]" />,
  <FaFire className="text-[10px]" />,
  <FaNewspaper className="text-[10px]" />,
  <FaTrophy className="text-[10px]" />,
];

const AppPromoBanner = ({ bannerData, fallbackTheme }) => {
  // If explicitly disabled in backend, do not render
  if (bannerData?.enabled === false) return null;

  const colorThemeKey = bannerData?.colorTheme || "forest";
  const activeTheme =
    RIGHT_BANNER_THEMES[colorThemeKey] || fallbackTheme || RIGHT_BANNER_THEMES.forest;

  const title = bannerData?.title || "Examrally App";
  const subtitle = bannerData?.subtitle || "Practice anytime, anywhere";
  const badge = bannerData?.badge || "FREE APP";
  const appLogo = bannerData?.appLogo || "/web-app-manifest-512x512.png";
  const buttonLink =
    bannerData?.buttonLink ||
    "https://play.google.com/store/apps/details?id=io.examrally.in&pcampaignid=web_share";
  const buttonText = bannerData?.buttonText || "Install Free App";
  const features =
    bannerData?.features && bannerData.features.length > 0
      ? bannerData.features
      : DEFAULT_FEATURES;

  return (
    <div
      className={`${activeTheme.containerBg} ${activeTheme.border} ${activeTheme.textColor} rounded-2xl border p-4.5 sm:p-5 shadow-lg relative overflow-hidden group`}
    >
      {/* Subtle ambient lighting orb */}
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
      <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-black/20 rounded-full blur-xl pointer-events-none" />

      {/* Header with Brand Mascot / Logo and Active Pulsing Indicator */}
      <div className="relative z-10 flex items-start justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white p-1 shadow-md flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:-rotate-2 transition-transform duration-300 overflow-hidden">
            <img
              src={appLogo}
              alt={title}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-[15px] font-black tracking-tight leading-tight">
                {title}
              </h3>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-[11px] opacity-85 font-medium mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>

        <span
          className={`text-[9.5px] font-black uppercase tracking-wider ${activeTheme.badge} px-2 py-0.5 rounded-full shadow-2xs flex-shrink-0`}
        >
          {badge}
        </span>
      </div>

      {/* Feature Checklist */}
      <div className="relative z-10 space-y-1.5 my-3.5">
        {features.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-colors backdrop-blur-xs"
          >
            <span
              className={`w-5 h-5 rounded-md ${activeTheme.checkmark} flex items-center justify-center text-[10px] flex-shrink-0 shadow-2xs`}
            >
              {FEATURE_ICONS[i % FEATURE_ICONS.length]}
            </span>
            <span className="text-[11.5px] font-semibold text-white leading-tight">
              {item}
            </span>
          </div>
        ))}
      </div>

      {/* Store Badges */}
      <div className="relative z-10 grid gap-2 mb-2.5">
        <a
          href={buttonLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl py-2 px-2.5 shadow-xs transition group/gp backdrop-blur-xs"
        >
          <img
            src={googlePlayImg}
            alt="Google Play"
            className="object-contain w-40 flex-shrink-0 group-hover/gp:scale-105 transition-transform"
          />
        </a>
      </div>

      {/* Theme Dynamic CTA Button */}
      <a
        href={buttonLink}
        target="_blank"
        rel="noopener noreferrer"
        className={`relative z-10 w-full ${activeTheme.button} font-extrabold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all duration-200 group/btn`}
      >
        <span>{buttonText}</span>
        <FaArrowRight className="text-[10px] group-hover/btn:translate-x-1 transition-transform" />
      </a>
    </div>
  );
};

export default AppPromoBanner;
