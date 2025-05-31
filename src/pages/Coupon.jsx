import React, { useContext, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import Api from '../service/Api';
import { UserContext } from '../context/UserProvider';
import { XMarkIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { toast, ToastContainer } from 'react-toastify';
const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
const Coupon = ({ data, setshowmodel }) => {
  const { isSignedIn } = useUser();
  const { user } = useContext(UserContext);
  const { refreshUser } = useContext(UserContext);

  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [finalPrice, setFinalPrice] = useState(
    data?.discountedAmount || data?.amount || 1998
  );  const [message, setMessage] = useState({ text: '', type: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCouponSection, setShowCouponSection] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
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
      
      const res = await Api.post('/coupons/validate', { couponCode: couponCode.trim().toUpperCase() });
  
      if (res.data.valid) {
        const baseAmount = Number(data.discountedAmount)||Number(data.amount)  || 0;
        const discount = (baseAmount * res.data.discountPercent) / 100;
        const newTotal = baseAmount - discount;
        setFinalPrice(Math.round(newTotal));
        setMessage({ 
          text: `Coupon applied: ${res.data.discountPercent}% OFF`, 
          type: 'success' 
        });
      } else {
        // This block probably never hits since invalid cases trigger catch
        setMessage({ 
          text: res.data.message || 'Invalid coupon code', 
          type: 'error' 
        });
      }
  
    } catch (err) {
      // This block handles invalid/inactive/expired coupons
      const errMsg = err.response?.data?.message || 'Error validating coupon';
      setMessage({ text: errMsg, type: 'error' });
  
      // Reset any previously applied discount if current coupon is rejected
      setDiscountPercent(0);
      setFinalPrice(data.discountedAmount || data?.amount);
    } finally {
      setIsProcessing(false);
    }
  };
  

  const paymentmeth = async (amountToPay) => {
    if (!user?._id) {
      alert('User is not authenticated. Please log in.');
      return; // Exit early if no user ID is available
    }
    try {
      setIsProcessing(true);
      console.log('User ID:', user?._id);
      console.log('User Email:', user?.email);

      const res = await Api.post('/orders/orders', {
        amount: Math.round(amountToPay * 100),  // in paise
        currency: 'INR',
        receipt: `${user?.email}`,
        payment_capture: 1,
        userId: user?._id,
        courseId: data?._id,
        courseName: data?.name || data?.Title || data?.categorys || "Course Name",
        email: user?.email,
        phoneNumber: user?.phoneNumber,
      });

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert('Failed to load Razorpay SDK. Check your connection.');
        return;
      }

      console.log(key);
      

      const options = {
        key: key,
        amount: Math.round(amountToPay * 100),
        currency: 'INR',
        name: data?.name,
        description: 'Course Payment', 
        handler: async function (response) {
          const res = await Api.post('/orders/verify-payment', {
            userId: user._id,
            courseId: data._id,
            courseName: data?.name || data?.Title || data?.categorys || "Course Name",
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            amount: finalPrice,
            expiryDays: data.expiryDays, // ✅ Send expiryDays from client
          });
          console.log(res)
         await refreshUser()
         toast.success('Payment successful!');
          setTimeout(() => {
            setshowmodel(false);
          }, 2000);
        },
        
        prefill: {
          name: user?.firstName,
          email: user?.email,
        },
        notes: {
          user_id: user?._id,
          course_id: data?._id,
          courseName: data?.categorys || data?.Title || data?.name,
        },
        theme: {
          color: '#2E7D32',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on('payment.failed', async function (response) {

        console.error('Payment failed:', response.error.metadata);
        toast.error('Payment failed. Please try again.');
      
        try {
          const errorData = response.error || {};
          const meta = errorData.metadata || {};
          
          console.log(errorData);
          
          await Api.post('/orders/payment-failed', {
            userId: user?._id,
            courseId: data?._id,
            orderId: meta.order_id,
            paymentId:errorData.metadata.payment_id || null,
            reason: errorData.description || errorData.reason || 'Unknown error',
            method: 'razorpay',
          });
          
      
          // alert("Payment failed. Please try again.");
        } catch (err) {
          console.error("Failed to report payment failure:", err);
          toast.error("Payment failed and could not be logged.");
        }
      });
      
      
    } catch (error) {
      console.error('Error during payment:', error);
      alert(error.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-hidden">
      <ToastContainer/>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
        <div className="relative">
          <div className="absolute top-4 right-4">
            <button 
              onClick={() => setshowmodel(false)}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <XMarkIcon className="h-6 w-6 text-gray-100 hover:text-gray-500" />
            </button>
          </div>
          
          <div className="bg-gradient-to-r from-green-600 to-green-800 p-6 text-white">
            <h2 className="text-2xl font-bold">{data?.name ||data?.Title ||data?.categorys}</h2>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-gray-600">Access</p>
              <p className="font-medium">{data?.expiryDays} Days</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600">Original Price</p>
              {data.discountedAmount?
              <p className="text-lg font-bold line-through">₹{data.amount}</p>
              :              <p className="text-lg font-bold ">₹{data.amount}</p>
              }
            </div>
          </div>
{data.discountedAmount&&
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-green-800">Special Offer</p>
                <p className="text-green-700">₹{data.discountedAmount}</p>
              </div>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                {Math.round((1 - data.discountedAmount/data.amount) * 100)}% OFF
              </span>
            </div>
          </div>
}
          {/* Coupon Toggle Section */}
          <div className="mb-4 border-b pb-2 border-green-100">
            <button
              onClick={() => setShowCouponSection(!showCouponSection)}
              className="flex items-center justify-between w-full text-left text-green-600 hover:text-green-800"
            >
              <span className="font-medium">Have a coupon code?</span>
              {showCouponSection ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Collapsible Coupon Section */}
          {showCouponSection && (
            <div className="mb-6 transition-all duration-300 ease-in-out">
              <div className="flex md:flex-row flex-col gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 border border-green-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  onClick={applyCoupon}
                  disabled={isProcessing}
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

          <div className=" border-green-100 pt-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-700">Total Amount</p>
              <div className="text-right">
                {discountPercent > 0 && (
                  <p className="text-sm text-green-600">
                    -{discountPercent}% Discount Applied
                  </p>
                )}
                <p className="text-2xl font-bold text-gray-900">₹{finalPrice}</p>
              </div>
            </div>

            <button
              onClick={() => {
                if (!isSignedIn) navigate('/sign-in');
                else paymentmeth(finalPrice);
              }}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg font-bold hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </div>
        </div>

        <div className="p-4 bg-green-50 text-center text-sm text-green-700 border-t border-green-100">
          <p>Secure payment powered by Razorpay</p>
        </div>
      </div>
    </div>
  );
};

export default Coupon;