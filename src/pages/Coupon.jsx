import React, { useContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import Api from '../service/Api';
import { UserContext } from '../context/UserProvider';
import { XMarkIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { toast, ToastContainer } from 'react-toastify';
import { fetchUtcNow } from '../service/timeApi';

const Coupon = ({ data, setshowmodel }) => {
  const { isSignedIn } = useUser();
  const { user, refreshUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [finalPrice, setFinalPrice] = useState(data?.discountedAmount || data?.amount || 0);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCouponSection, setShowCouponSection] = useState(false);
  const [utcNow, setUtcNow] = useState(null);

  // Fetch server time for coupon validation
  useEffect(() => {
    const fetchTime = async () => {
      try {
        const globalDate = await fetchUtcNow();
        setUtcNow(globalDate);
      } catch (error) {
        console.error("Failed to fetch UTC time:", error);
        setUtcNow(new Date()); // Fallback to client time
      }
    };
    fetchTime();
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => {
        console.error('Failed to load Razorpay script');
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setMessage({ text: 'Please enter a coupon code', type: 'error' });
      return;
    }

    try {
      setIsProcessing(true);
      setMessage({ text: '', type: '' });

      const res = await Api.post('/coupons/validate', {
        couponCode: couponCode.trim().toUpperCase(),
        currentDate: utcNow?.toISOString() || new Date().toISOString()
      });

      if (res.data.valid) {
        const baseAmount = Number(data.discountedAmount) || Number(data.amount) || 0;
        const discount = (baseAmount * res.data.discountPercent) / 100;
        const newTotal = Math.max(0, baseAmount - discount); // Ensure price doesn't go negative
        
        setDiscountPercent(res.data.discountPercent);
        setFinalPrice(Math.round(newTotal));
        setMessage({
          text: `Coupon applied: ${res.data.discountPercent}% OFF`,
          type: 'success'
        });
      } else {
        throw new Error(res.data.message || 'Invalid coupon code');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Error validating coupon';
      setMessage({ text: errMsg, type: 'error' });
      resetCoupon();
    } finally {
      setIsProcessing(false);
    }
  };

  const resetCoupon = () => {
    setDiscountPercent(0);
    setFinalPrice(data.discountedAmount || data?.amount || 0);
    setCouponCode('');
  };

  const handlePayment = async () => {
    if (!isSignedIn) {
      navigate('/sign-in');
      return;
    }

    if (!user?._id) {
      toast.error('User authentication failed. Please try again.');
      return;
    }

    try {
      setIsProcessing(true);

      // Create order
      const orderResponse = await Api.post('/orders/orders', {
        amount: Math.round(finalPrice * 100), // in paise
        currency: 'INR',
        receipt: user?.email || `course-${data._id || Date.now()}`,
        payment_capture: 1,
        userId: user._id,
        courseId: data._id,
        courseName: data?.name || data?.Title || data?.categorys || "Course",
        email: user?.email,
        phoneNumber: user?.phoneNumber,
        coupon: discountPercent > 0 ? couponCode : null,
        notes: {
          courseId: data._id,
          courseName: data?.name || data?.Title,
          couponCode: discountPercent > 0 ? couponCode : null,
          expiryDays: data.expiryDays
        }
      });

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Payment service unavailable. Please try again later.');
      }

      // Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: Math.round(finalPrice * 100),
        currency: 'INR',
        name: data?.name || "Course Purchase",
        description: `Purchase: ${data?.name || "Course"}`,
        order_id: orderResponse.data?.order_id,
        handler: async function (response) {
          try {
            if (!response.razorpay_payment_id) {
              throw new Error('Payment verification failed');
            }

            // Verify payment
            await Api.post('/orders/verify-payment', {
              userId: user._id,
              courseId: data._id,
              courseName: data?.name || data?.Title,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              coupon: discountPercent > 0 ? couponCode : null,
              amount: finalPrice,
              expiryDays: data.expiryDays
            });

            await refreshUser();
            toast.success('Payment successful! Access granted.');
            setTimeout(() => setshowmodel(false), 2000);
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user?.firstName || '',
          email: user?.email || '',
          contact: user?.phoneNumber || ''
        },
        theme: {
          color: '#2E7D32'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on('payment.failed', async (response) => {
        console.error('Payment failed:', response.error);
        toast.error('Payment failed. Please try again.');

        try {
          await Api.post('/orders/payment-failed', {
            userId: user._id,
            courseId: data._id,
            orderId: response.error.metadata?.order_id,
            paymentId: response.error.metadata?.payment_id,
            reason: response.error.description || 'Payment failed',
            amount: finalPrice
          });
        } catch (err) {
          console.error('Failed to log payment failure:', err);
        }
      });

    } catch (error) {
      console.error('Payment error:', error);
      toast.error(
        error.response?.data?.message || 
        error.message || 
        'Payment processing failed'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate discount percentage for display
  const calculateDiscountPercentage = () => {
    if (!data?.amount || !data?.discountedAmount) return 0;
    return Math.round((1 - data.discountedAmount / data.amount) * 100);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <ToastContainer position="top-center" autoClose={5000} />
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="relative">
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setshowmodel(false)}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              disabled={isProcessing}
            >
              <XMarkIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          <div className="bg-gradient-to-r from-green-600 to-green-800 p-6 text-white">
            <h2 className="text-2xl font-bold">
              {data?.name || data?.Title || data?.categorys || "Course"}
            </h2>
            <p className="opacity-90">
              {data?.expiryDays ? `${data.expiryDays} Days Access` : "Lifetime Access"}
            </p>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-grow">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-gray-600">Access Period</p>
              <p className="font-medium">
                {data?.expiryDays ? `${data.expiryDays} Days` : "Lifetime"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-600">Original Price</p>
              <p className={`text-lg font-bold ${data?.discountedAmount ? "line-through" : ""}`}>
                ₹{data?.amount || 0}
              </p>
            </div>
          </div>

          {data?.discountedAmount && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-green-800">Special Offer</p>
                  <p className="text-green-700">₹{data.discountedAmount}</p>
                </div>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                  {calculateDiscountPercentage()}% OFF
                </span>
              </div>
            </div>
          )}

          {/* Coupon Section */}
          <div className="mb-4 border-b pb-2 border-green-100">
            <button
              onClick={() => setShowCouponSection(!showCouponSection)}
              className="flex items-center justify-between w-full text-left text-green-600 hover:text-green-800"
              disabled={isProcessing}
            >
              <span className="font-medium">Have a coupon code?</span>
              {showCouponSection ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {showCouponSection && (
            <div className="mb-6 transition-all duration-300 ease-in-out">
              <div className="flex md:flex-row flex-col gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 border border-green-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={isProcessing}
                />
                <button
                  onClick={applyCoupon}
                  disabled={isProcessing || !couponCode.trim()}
                  className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Applying...' : 'Apply'}
                </button>
              </div>

              {message.text && (
                <p className={`text-sm mt-1 ${
                  message.type === 'success' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {message.text}
                </p>
              )}
            </div>
          )}

          {/* Payment Summary */}
          <div className="border-t border-green-100 pt-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-700">Total Amount</p>
              <div className="text-right">
                {discountPercent > 0 && (
                  <p className="text-sm text-green-600">
                    -{discountPercent}% Discount Applied
                  </p>
                )}
                <p className="text-2xl font-bold text-gray-900">
                  ₹{finalPrice.toLocaleString()}
                </p>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg font-bold hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-green-50 text-center text-sm text-green-700 border-t border-green-100">
          <p>Secure payment powered by Razorpay</p>
        </div>
      </div>
    </div>
  );
};

export default Coupon;