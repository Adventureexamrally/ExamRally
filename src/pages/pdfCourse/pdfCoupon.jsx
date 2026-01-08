import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useContext,
} from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import {
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { UserContext } from "../../context/UserProvider";
import Api from "../../service/Api";
import { toast, ToastContainer } from "react-toastify";

const PdfCoupon = ({ data, setshowmodel }) => {
  const { isSignedIn } = useUser();
  const { user, refreshUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCouponSection, setShowCouponSection] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Calculate derived values
  const basePrice = useMemo(
    () => Number(data.discountedPrice) || 0,
    [data.discountedPrice]
  );
  const finalPrice = useMemo(() => {
    const discount = (basePrice * discountPercent) / 100;
    return Math.round(basePrice - discount);
  }, [basePrice, discountPercent]);

  const discountPercentageOff = useMemo(
    () => Math.round((1 - basePrice / data.originalPrice) * 100),
    [basePrice, data.originalPrice]
  );

  // Load Razorpay script on component mount
  useEffect(() => {
    const loadRazorpayScript = async () => {
      if (window.Razorpay) {
        setRazorpayLoaded(true);
        return;
      }

      try {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;

        script.onload = () => setRazorpayLoaded(true);
        script.onerror = () => {
          console.error("Failed to load Razorpay SDK");
          toast.error(
            "Payment gateway failed to load. Please refresh the page."
          );
        };

        document.body.appendChild(script);
      } catch (error) {
        console.error("Error loading Razorpay:", error);
      }
    };

    loadRazorpayScript();

    return () => {
      // Cleanup if needed
    };
  }, []);

  // Validate coupon code
  const applyCoupon = useCallback(async () => {
    const trimmedCode = couponCode.trim().toUpperCase();

    if (!trimmedCode) {
      setMessage({ text: "Please enter a coupon code", type: "error" });
      return;
    }

    setIsProcessing(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await Api.post("/coupons/validate", {
        couponCode: trimmedCode,
      });

      if (res.data?.valid) {
        setDiscountPercent(res.data.discountPercent);
        setMessage({
          text: `Coupon applied: ${res.data.discountPercent}% OFF`,
          type: "success",
        });
      } else {
        setMessage({
          text: res.data?.message || "Invalid coupon code",
          type: "error",
        });
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "Error validating coupon";

      setMessage({ text: errorMsg, type: "error" });
      setDiscountPercent(0);
    } finally {
      setIsProcessing(false);
    }
  }, [couponCode]);

  // Handle payment
  const handlePayment = useCallback(async () => {
    if (!isSignedIn) {
      navigate("/sign-in");
      return;
    }

    if (!user?._id) {
      toast.error("User not authenticated. Please log in again.");
      return;
    }

    if (!razorpayLoaded) {
      toast.error("Payment system is loading. Please wait a moment.");
      return;
    }

    setIsProcessing(true);

    try {
      const orderResponse = await Api.post("/orders/orders", {
        amount: Math.round(finalPrice * 100),
        currency: "INR",
        receipt: `pdf_course_${user._id}`,
        payment_capture: 1,
        userId: user._id,
        courseId: data?._id,
        courseName: "Pdf Course",
        email: user.email,
        phoneNumber: user.phoneNumber,
      });
      console.log(orderResponse);

      const orderId = orderResponse.data?.order_id;
      if (!orderId) {
        throw new Error("Failed to create order");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: Math.round(finalPrice * 100),
        currency: "INR",
        name: data?.name || "PDF Course",
        description: "Course Payment",
        order_id: orderId,
        handler: async function (response) {
          try {
            // Save subscription and payment details
            await Promise.all([
              Api.post("/orders/save-subscription", {
                userId: user._id,
                courseId: data?._id,
                courseName: "PDF Course",
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                amount: finalPrice,
                expiryDays: data.months*30,
                subscriptions: true,
                subscriptionId: data._id,
              }),
              Api.post("/pdf-subscriptions", {
                userId: user._id,
                plan: {
                  subscriptionId: data._id,
                  months: data.months,
                  originalPrice: data.originalPrice,
                  discountedPrice: data.discountedPrice,
                  offerName: data.offerName,
                },
                paymentId: response.razorpay_payment_id,
                expiryDate: data.expiryDays,
              }),
            ]);

            await refreshUser();
            toast.success(
              "Payment successful! Your access has been activated."
            );

            setTimeout(() => {
              setshowmodel(false);
            }, 1500);
          } catch (error) {
            console.error("Failed to save subscription:", error);
            toast.error(
              "Payment successful but subscription not saved. Contact support."
            );
          }
        },
        prefill: {
          name: user.firstName || user.email?.split("@")[0],
          email: user.email,
          contact: user.phoneNumber || "",
        },
        notes: {
          user_id: user._id,
          course_id: data?._id,
          course_name: "PDF Course",
          coupon_code: couponCode || "none",
          discount_percent: discountPercent,
        },
        theme: {
          color: "#2E7D32",
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", async function (response) {
        console.error("Payment failed:", response.error);

        try {
          await Api.post("/orders/payment-failed", {
            userId: user._id,
            courseId: data?.months,
            orderId: response.error.metadata?.order_id,
            paymentId: response.error.metadata?.payment_id,
            reason: response.error.description || response.error.reason,
            error_code: response.error.code,
            method: "razorpay",
            coupon_code: couponCode,
          });

          toast.error(
            `Payment failed: ${
              response.error.description || "Please try again"
            }`
          );
        } catch (err) {
          console.error("Failed to log payment failure:", err);
          toast.error("Payment failed. Please try again.");
        }
      });

      rzp.open();
    } catch (error) {
      console.error("Payment initialization error:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Payment initialization failed";
      toast.error(errorMsg);
      setIsProcessing(false);
    }
  }, [
    isSignedIn,
    user,
    razorpayLoaded,
    finalPrice,
    data,
    navigate,
    refreshUser,
    setshowmodel,
    couponCode,
    discountPercent,
  ]);

  // Handle Enter key in coupon input
  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !isProcessing) {
        applyCoupon();
      }
    },
    [applyCoupon, isProcessing]
  );

  if (!data) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-hidden">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />

      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="relative">
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => setshowmodel(false)}
              disabled={isProcessing}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
              aria-label="Close modal"
            >
              <XMarkIcon className="h-6 w-6 text-gray-600 hover:text-gray-800" />
            </button>
          </div>

          <div className="bg-gradient-to-r from-green-600 to-green-800 p-6 text-white">
            <h2 className="text-2xl font-bold">PDF Course</h2>
            <p className="text-green-100 mt-1">
              Unlock {data.months} months of access
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-grow">
          {/* Plan Details */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-gray-600 text-sm">Access Duration</p>
              <p className="font-medium text-lg">{data.months} Months</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600 text-sm">Original Price</p>
              <p className="text-lg font-bold line-through">
                ₹{data.originalPrice}
              </p>
            </div>
          </div>

          {/* Offer Banner */}
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-r-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-green-800">Special Offer</p>
                <p className="text-green-700 text-xl font-bold">
                  ₹{data.discountedPrice}
                </p>
              </div>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {discountPercentageOff}% OFF
              </span>
            </div>
          </div>

          {/* Coupon Section */}
          <div className="mb-6">
            <button
              onClick={() => setShowCouponSection(!showCouponSection)}
              className="flex items-center justify-between w-full text-left text-green-600 hover:text-green-800 mb-2"
              disabled={isProcessing}
            >
              <span className="font-medium">Have a coupon code?</span>
              {showCouponSection ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </button>

            {showCouponSection && (
              <div className="transition-all duration-300 ease-in-out">
                <div className="flex md:flex-row flex-col gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) =>
                      setCouponCode(e.target.value.toUpperCase())
                    }
                    onKeyPress={handleKeyPress}
                    disabled={isProcessing}
                    className="flex-1 border border-green-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={isProcessing || !couponCode.trim()}
                    className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
                  >
                    {isProcessing ? "Applying..." : "Apply"}
                  </button>
                </div>

                {message.text && (
                  <div
                    className={`mt-2 p-2 rounded text-sm ${
                      message.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {message.text}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Total and Payment Button */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-700 font-medium">Total Amount</p>
              <div className="text-right">
                {discountPercent > 0 && (
                  <p className="text-sm text-green-600 mb-1">
                    -{discountPercent}% Discount Applied
                  </p>
                )}
                <p className="text-2xl font-bold text-gray-900">
                  ₹{finalPrice}
                </p>
                {discountPercent > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    You save ₹{basePrice - finalPrice}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing || !razorpayLoaded}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg font-bold hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isProcessing ? "Processing..." : "Proceed to Payment"}
            </button>

            <p className="text-center text-xs text-gray-500 mt-3">
              By proceeding, you agree to our Terms of Service
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-green-50 text-center text-sm text-green-700 border-t border-green-100">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p>Secure payment powered by Razorpay</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PdfCoupon);
