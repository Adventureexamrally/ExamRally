import React, { useEffect, useState } from "react";
import { SignUp } from "@clerk/clerk-react";
import { useLocation } from "react-router-dom";
import { FaMobileAlt, FaExternalLinkAlt } from "react-icons/fa";

const SignUpPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const referralCode = query.get("ref");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      if (/android/i.test(userAgent)) return true;
      if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) return true;
      return false;
    };
    setIsMobile(checkMobile());
  }, []);

  const openInApp = () => {
    const deepLink = `examrally://sign-up?ref=${referralCode || ""}`;
    window.location.href = deepLink;
    
    // Fallback timer: If app doesn't open in 2 seconds, maybe prompt to download?
    // For now, we trust the button does its job if the app is installed.
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] py-12 px-4 bg-gray-50">
      {isMobile && referralCode && (
        <div className="w-full max-w-md mb-8 animate-bounce-subtle">
          <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl p-5 shadow-xl text-white">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <FaMobileAlt className="text-2xl" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">Have the App?</h3>
                <p className="text-white/80 text-sm">Open this referral directly in the Examrally app for a better experience.</p>
              </div>
            </div>
            <button
              onClick={openInApp}
              className="w-full mt-4 bg-white text-green-600 font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-inner hover:bg-gray-50 transition-colors"
            >
              <FaExternalLinkAlt size={14} />
              Open in Examrally App
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <SignUp 
          routing="path" 
          path="/sign-up" 
          signInUrl="/sign-in"
          fallbackRedirectUrl="/"
        />
      </div>
      
      {!isMobile && referralCode && (
        <div className="mt-6 text-center text-gray-400 text-sm">
          Referral Code Applied: <span className="font-mono font-bold text-green-600">{referralCode}</span>
        </div>
      )}
    </div>
  );
};

export default SignUpPage;
