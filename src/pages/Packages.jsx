import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Api from '../service/Api';
import { useUser } from '@clerk/clerk-react';
import { UserContext } from '../context/UserProvider';
import PackageCoupon from './PackageCoupon';

const Packages = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const { user } = useContext(UserContext);
  const [trending, setTrending] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    Api.get('group-packages/get-all-active')
      .then((res) => {
        console.log('API response:', res.data);
        setTrending(res.data.data || []);
      })
      .catch((err) => {
        console.error('Failed to fetch trending packages:', err);
      });
  }, []);

//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       const script = document.createElement('script');
//       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//  const paymentmeth = async (discountPrice, name, coursesIncluded) => {
//   try {
//     console.log('Initiating payment method...');
//     console.log('Received params:', { discountPrice, name, coursesIncluded });

//     const amountInPaise = discountPrice * 100;
//     console.log('Amount in paise:', amountInPaise);

//     const res = await Api.post('/orders/orders', {
//       amount: amountInPaise,
//       currency: 'INR',
//       receipt: `${user?.email}`,
//       payment_capture: 1,
//     });

//     console.log('Order created successfully:', res.data);

//     const scriptLoaded = await loadRazorpayScript();
//     console.log('Razorpay script loaded:', scriptLoaded);

//     if (!scriptLoaded) {
//       alert('Failed to load Razorpay SDK. Please check your internet connection.');
//       console.warn('Razorpay SDK not loaded');
//       return;
//     }

//     const options = {
//       key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//       amount: amountInPaise,
//       currency: 'INR',
//       name: name,
//       description: 'Course Package Purchase',
//       handler: function (response) {
//         console.log('Payment successful:', response);
//       },
//       prefill: {
//         name: user?.firstName,
//         email: user?.email,
//       },
//       notes: {
//         user_id: user?._id,
//         course_id:  JSON.stringify(coursesIncluded), // 💡 Fix: Convert array to JSON string
//         courseName: name,
//       },
//       theme: {
//         color: '#F4C430',
//       },
//     };

//     console.log('Razorpay options configured:', options);

//     const rzp = new window.Razorpay(options);
//     console.log('Razorpay instance created');

//     rzp.open();
//     console.log('Razorpay checkout opened');

//     rzp.on('payment.failed', function (response) {
//       console.error('Payment failed:', response.error);
//       alert('Payment failed. Please try again.');
//     });

//   } catch (error) {
//     console.error('Error during payment:', error);
//     alert(error.message || 'An unexpected error occurred');
//   }
// };

const handlePackageSelect = (pkg) => {
  if (!isSignedIn) {
    navigate('/sign-in');
  } else {
    setSelectedPackage(pkg);
    setShowModal(true);
  }
};

  return (
    <div className="my-7 p-6 rounded-2xl shadow-xl bg-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-green-800 font">Trending Packages</h1>
      </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-2">
        {trending.slice(0, 4).map((pkg, index) => (
  <div key={index} className="group">
  <div className="bg-white border-2 border-green-100 p-6 rounded-2xl hover:scale-[1.02] hover:shadow-lg transition-all duration-300 flex flex-col overflow-y-auto" 
      >
    {/* Hide scrollbar for Chrome/Safari/Opera */}
   

    {/* Header */}
    <div className="mb-4">
      <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">{pkg.name}</h2>
      <div className="w-120 mt-1 h-1 bg-green-500 rounded-full"></div>
    </div>
    
    {/* Features List */}
  <div className="flex-grow space-y-1 mb-2 overflow-y-auto h-[200px]" style={{ 
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
}}>  
  <style jsx>{`
    div::-webkit-scrollbar {
      display: none;
    }
  `}</style>
  {pkg.feature.map((item, index) => (
    <div key={index} className="flex items-start gap-3">
      <div className="mt-1 text-green-500">
        <i className="bi bi-check-circle-fill"></i>
      </div>
      <p className="text-gray-700">{item}</p>
    </div>
  ))}
</div>
    
    {/* Pricing Section */}
    <div className="mt-auto text-center bg-green-50 rounded-xl p-2 border border-blue-100">
      <div className="mb-2">
        <del className="text-gray-500 font-medium">Rs. {pkg.price}</del>
        <span className="ml-2 bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">
          Save Rs. {pkg.price - pkg.discountPrice}
        </span>
      </div>
      
      
      <button
        className=" bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 font-bold hover:from-green-600 hover:to-green-700 rounded-lg shadow-md transition-all duration-300"
        onClick={() => handlePackageSelect(pkg)}
      >
         Rs. {pkg.discountPrice}
      </button>
      
      <p className="text-xs text-gray-500 mt-2">
        Limited time offer
      </p>
    </div>
  </div>
</div>
        ))}
              {showModal && selectedPackage && (
                    <PackageCoupon 
                      pkg={selectedPackage} 
                      setShowModal={setShowModal}
                    />
                  )}
      </div>
      {showModal && selectedPackage && (
            <PackageCoupon 
              pkg={selectedPackage} 
              setShowModal={setShowModal}
            />
          )}
    </div>
  );
};

export default Packages;
