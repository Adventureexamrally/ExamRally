import React, { useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import Api from "../service/Api";
import { UserContext } from "../context/UserProvider";
import {
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  GiftIcon,
  CreditCardIcon,
  AcademicCapIcon
} from "@heroicons/react/24/outline";
import { FaCoins, FaCheckCircle, FaPercentage } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { fetchUtcNow } from "../service/timeApi";

const PackageCoupon = ({ pkg, setShowModal }) => {
  const { isSignedIn } = useUser();
  const { user, refreshUser, utcNow } = useContext(UserContext);
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [finalPrice, setFinalPrice] = useState(
    pkg.discountPrice || pkg.discountedAmount || pkg.price || pkg.amount || 0
  );
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCouponSection, setShowCouponSection] = useState(false);
  const [accessDuration, setAccessDuration] = useState("");
  const [useCoins, setUseCoins] = useState(false);
  const [settings, setSettings] = useState(null);

  // Fetch settings for coin discount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await Api.get("/referral/settings");
        setSettings(res.data);
      } catch (err) {
        console.error("Error fetching settings", err);
      }
    };
    fetchSettings();
  }, []);


  // Calculate access duration
  useEffect(() => {
    if (pkg.duration || pkg.expiryDays) {
      setAccessDuration(`${pkg.duration || pkg.expiryDays} Days`);
    }
  }, [pkg.duration, pkg.expiryDays]);



  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => {
        console.error("Failed to load Razorpay script");
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setMessage({ text: "Please enter a coupon code", type: "error" });
      return;
    }

    try {
      setIsProcessing(true);
      setMessage({ text: "", type: "" });

      const res = await Api.post("/coupons/validate", {
        couponCode: couponCode.trim().toUpperCase(),
        currentDate: utcNow?.toISOString() || new Date().toISOString(),
      });

      if (res.data?.valid) {
        const baseAmount = Number(pkg.discountPrice || pkg.discountedAmount || pkg.price || pkg.amount);
        const discount = (baseAmount * res.data.discountPercent) / 100;
        const newTotal = Math.max(0, baseAmount - discount); // Ensure price doesn't go negative

        setDiscountPercent(res.data.discountPercent);
        setFinalPrice(Math.round(newTotal));
        setMessage({
          text: `Success! ${res.data.discountPercent}% OFF coupon applied`,
          type: "success",
        });
      } else {
        throw new Error(res.data?.message || "Invalid coupon code");
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Error validating coupon";
      setMessage({ text: errMsg, type: "error" });
      resetCoupon();
    } finally {
      setIsProcessing(false);
    }
  };

  const resetCoupon = () => {
    setDiscountPercent(0);
    setFinalPrice(pkg.discountPrice || pkg.discountedAmount || pkg.price || pkg.amount);
    setCouponCode("");
  };

  const handlePayment = async () => {
    if (!isSignedIn) {
      navigate("/sign-in");
      return;
    }

    if (!user?._id) {
      toast.error("User authentication failed.");
      return;
    }

    try {
      setIsProcessing(true);

      // Validate courses
      // if (!pkg.coursesIncluded || !Array.isArray(pkg.coursesIncluded)) {
      //   throw new Error("Invalid courses data");
      // }

      // For Group Packages, we send the package ID itself
      const courseIdPayload = [pkg._id];

      const orderResponse = await Api.post("/orders/orders", {
        amount: Math.round(displayPriceBeforeCoins * 100), // Original amount AFTER coupon but BEFORE coins
        currency: "INR",
        receipt: user?.email || `package-${pkg._id || Date.now()}`,
        payment_capture: 1,
        userId: user._id,
        courseId: courseIdPayload, // Send Group Package ID
        courseName: pkg?.name || pkg.subscriptionType || "Course Package",
        email: user?.email,
        phoneNumber: user?.phoneNumber,
        coupon: discountPercent > 0 ? couponCode : null,
        useCoins: useCoins,
        coinsToUse: displayCoinDiscount,
        notes: {
          userId: user?._id,
          email: user?.email,
          phoneNumber: user?.phoneNumber,
          packageId: pkg._id,
          packageName: pkg.name,
          couponCode: discountPercent > 0 ? couponCode : null,
          subscriptions: !!pkg.subscriptionType,
          expiryDays: pkg.expiryDays || pkg.duration,
        },
      });

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error("Payment service unavailable.");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: Math.round(displayFinalPrice * 100),
        currency: "INR",
        name: "Exam Rally",
        description: `Package Purchase: ${pkg.name || "Course Package"}`,
        image: "https://examrally.in/favicon.svg",
        order_id: orderResponse.data?.order_id,
        handler: async function (response) {
          try {
            if (!response.razorpay_payment_id) {
              throw new Error("Payment verification failed");
            }

            const verifyRes = await Api.post("/orders/verify-payment", {
              userId: user._id,
              courseId: [pkg._id], // Send Group Package ID
              courseName: pkg.name || pkg.subscriptionType,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              coupon: discountPercent > 0 ? couponCode : null,
              amount: displayFinalPrice,
              expiryDays: pkg.expiryDays || pkg.duration,
              subscriptions: !!pkg.subscriptionType,
            });

            await refreshUser();
            toast.success("Payment successful! Welcome to the package.");
            setTimeout(() => setShowModal(false), 2000);
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("Payment verification failed.");
          }
        },
        prefill: {
          name: user?.fullName || "",
          email: user?.email || "",
          contact: user?.phoneNumber || "",
        },
        theme: { color: "#131656" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", async (response) => {
        console.error("Payment failed:", response.error);
        toast.error("Payment failed. Please try again.");

        try {
          await Api.post("/orders/payment-failed", {
            userId: user._id,
            courseId: pkg._id,
            orderId: response.error.metadata?.order_id,
            paymentId: response.error.metadata?.payment_id,
            reason: response.error.description || "Payment failed",
            amount: displayFinalPrice,
          });
        } catch (err) {
          console.error("Failed to log payment failure:", err);
        }
      });
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Payment processing failed"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate discount and final price with coins
  const calculateFinalPrice = () => {
    let baseAmount = Number(pkg.discountPrice || pkg.discountedAmount || pkg.price || pkg.amount || 0);

    // Apply coupon discount first
    if (discountPercent > 0) {
      const couponDiscount = (baseAmount * discountPercent) / 100;
      baseAmount = Math.max(0, baseAmount - couponDiscount);
    }

    let coinDiscount = 0;
    if (useCoins && user?.coins > 0 && settings?.maxCoinPaymentPercentage) {
      const maxAllowedDiscount = baseAmount * (settings.maxCoinPaymentPercentage / 100);
      coinDiscount = Math.min(user.coins, maxAllowedDiscount);
    }

    return {
      finalPrice: Math.round(baseAmount - coinDiscount),
      coinDiscount: Math.round(coinDiscount),
      priceBeforeCoins: Math.round(baseAmount)
    };
  };

  const { finalPrice: displayFinalPrice, coinDiscount: displayCoinDiscount, priceBeforeCoins: displayPriceBeforeCoins } = calculateFinalPrice();

  // Calculate discount percentage for display
  const calculateDiscountPercentage = () => {
    const original = pkg.price || pkg.amount;
    const discounted = pkg.discountPrice || pkg.discountedAmount;
    if (!original || !discounted) return 0;
    return Math.round((1 - discounted / original) * 100);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 sm:p-6"
      >
        <ToastContainer position="top-right" autoClose={5000} theme="colored" />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden border border-slate-100"
        >
          {/* Header with Premium Gradient */}
          <div className="relative h-44 flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-700 to-[#131656]">
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all z-10 text-white"
              disabled={isProcessing}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>

            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <AcademicCapIcon className="h-4 w-4 text-green-300" />
                <span className="px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider border border-white/20">
                  {pkg?.coursesIncluded?.length || 0} courses included
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider border border-white/20">
                  {accessDuration || "Lifetime"}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black leading-tight drop-shadow-sm line-clamp-2">
                {pkg?.name || pkg.subscriptionType || "Course Package"}
              </h2>
            </div>
          </div>

          <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar flex-grow">
            {/* Price Overview */}
            <div className="flex items-end justify-between mb-8 pb-6 border-b border-slate-100">
              <div className="space-y-1">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Base Investment</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-slate-300 line-through decoration-blue-500/30">
                    ₹{pkg.price || pkg.amount || 0}
                  </span>
                  <span className="text-3xl font-black text-green-700">
                    ₹{pkg.discountPrice || pkg.discountedAmount}
                  </span>
                </div>
              </div>
              <div className="bg-emerald-50 px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-emerald-100/50">
                <FaPercentage className="text-emerald-500 text-xs" />
                <span className="text-emerald-700 font-bold text-sm">
                  {calculateDiscountPercentage()}% OFF
                </span>
              </div>
            </div>

            {/* Premium Coupon Section */}
            <div className="mb-6 space-y-4">
              <button
                onClick={() => setShowCouponSection(!showCouponSection)}
                className="flex items-center justify-between w-full group transition-all"
                disabled={isProcessing}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                    <GiftIcon className="h-5 w-5" />
                  </div>
                  <span className="font-bold text-slate-700 group-hover:text-green-600 transition-colors">Apply Coupon</span>
                </div>
                {showCouponSection ? <ChevronUpIcon className="h-5 w-5 text-slate-400" /> : <ChevronDownIcon className="h-5 w-5 text-slate-400 font-bold" />}
              </button>

              <AnimatePresence>
                {showCouponSection && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-slate-50 p-4 rounded-2xl space-y-3 border border-slate-100">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="PROMOCODE"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          className="flex-1 bg-white border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all font-mono font-bold text-slate-700 placeholder:text-slate-300 uppercase"
                          disabled={isProcessing}
                        />
                        <button
                          onClick={applyCoupon}
                          disabled={isProcessing || !couponCode.trim()}
                          className="bg-green-600 shadow-lg shadow-green-100 text-white px-6 py-3 rounded-xl hover:bg-green-700 font-bold transition-all disabled:opacity-50"
                        >
                          {isProcessing ? "..." : "Apply"}
                        </button>
                      </div>
                      {message.text && (
                        <motion.p
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          className={`text-xs font-bold flex items-center gap-1.5 ${message.type === "success" ? "text-emerald-600" : "text-rose-500"}`}
                        >
                          {message.type === "success" ? <FaCheckCircle className="text-emerald-500" /> : null}
                          {message.text}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* High-End Coin Toggle */}
            {user?.coins > 0 && settings?.maxCoinPaymentPercentage && (
              <div className="mb-8 overflow-hidden rounded-2xl border border-blue-100/50 bg-gradient-to-br from-blue-50/50 to-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-amber-400 blur-md opacity-20"></div>
                      <div className="relative bg-teal-50 p-2.5 rounded-full border border-teal-100">
                        <FaCoins className="text-amber-500 h-5 w-5 animate-pulse" />
                      </div>
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-800 flex items-center gap-2">
                        Referral Rewards
                        <span className="px-2 py-0.5 rounded-md bg-green-500 text-[10px] text-white font-black animate-bounce uppercase tracking-tighter">Use Coins</span>
                      </p>
                      <p className="text-xs text-slate-500 font-medium">Balance: <span className="text-amber-600 font-bold">{user.coins} Coins</span></p>
                    </div>
                  </div>

                  <button
                    onClick={() => !isProcessing && setUseCoins(!useCoins)}
                    className={`relative w-14 h-8 rounded-full transition-all duration-300 p-1 flex items-center ${useCoins ? "bg-green-600 ring-4 ring-green-50" : "bg-slate-200 ring-4 ring-slate-50"}`}
                    disabled={isProcessing}
                  >
                    <motion.div
                      layout
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className={`w-6 h-6 bg-white rounded-full shadow-md ${useCoins ? "ml-6" : "ml-0"}`}
                    />
                  </button>
                </div>

                <AnimatePresence>
                  {useCoins && displayCoinDiscount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-3 rounded-xl bg-white border border-green-100 text-sm font-bold text-green-700 flex justify-between items-center shadow-sm"
                    >
                      <span className="flex items-center gap-2 tracking-tight">✨ Coin Discount Applied</span>
                      <span className="text-green-600">-₹{displayCoinDiscount}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!useCoins && user.coins > 0 && (
                  <p className="text-[10px] text-blue-400 mt-3 font-bold uppercase tracking-widest text-center">
                    Instantly save up to ₹{Math.round((Number(pkg.discountPrice || pkg.discountedAmount || pkg.price || pkg.amount || 0)) * (settings.maxCoinPaymentPercentage / 100))} with coins
                  </p>
                )}
              </div>
            )}

            {/* Grand Total Card */}
            <div className="bg-green-600 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-white/20 transition-all duration-700"></div>

              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center text-green-100 text-xs font-bold tracking-widest uppercase">
                  <span>Grand Total</span>
                  <div className="flex items-center gap-2">
                    <CreditCardIcon className="h-4 w-4" />
                    <span className="normal-case">Safe Checkout</span>
                  </div>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black tracking-tighter">₹{displayFinalPrice.toLocaleString()}</span>
                  {(discountPercent > 0 || (useCoins && displayCoinDiscount > 0)) && (
                    <span className="text-white text-[10px] font-black bg-white/20 px-2 py-1 rounded-lg border border-white/30">
                      SAVING REACHED
                    </span>
                  )}
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-[#131656] text-white h-16 rounded-2xl font-black text-lg hover:bg-blue-950 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 group/btn mt-4 overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite] group-hover:animate-none"></div>
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      verifying...
                    </span>
                  ) : (
                    <>
                      Pay ₹{displayFinalPrice.toLocaleString()} Securely
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="group-hover/btn:translate-x-1 transition-transform"
                      >
                        →
                      </motion.span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-4">
            <img src="https://static.razorpay.com/static/combined/payments-icons.png" alt="Payment Methods" className="h-4 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all" />
            <span className="h-3 w-[1px] bg-slate-200"></span>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest text-center">Secure SSL Encrypted Gateway</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PackageCoupon;