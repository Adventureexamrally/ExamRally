import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Api from '../service/Api';
import { useUser } from '@clerk/clerk-react';
import { UserContext } from '../context/UserProvider';
import PackageCoupon from '../pages/PackageCoupon';

const TrendingPackages = () => {
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
    <div className="my-7 p-6 rounded-2xl shadow-xl bg-white" >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Trending Packages</h1>
        <Link to='/All-Packages'  className="border-1 h-10 border-blue-500 text-blue-500 rounded-full px-3 md:px-4 py-2 text-sm font-semibold transition duration-200 hover:text-white hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-600">
                    View More
                </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-2">
        {trending.slice(0, 4).map((pkg, index) => (
          <div key={index} className="group">
            <div className="bg-gray-100 border border-blue-500 p-6 rounded-2xl hover:scale-105 hover:shadow-2xl transition-all duration-300">
              <h2 className="text-lg font-medium text-gray-700 mb-2">{pkg.name}</h2>
              {/* Recommended Upload Size: 600 x 600 px (portrait ratio, high enough resolution for most use cases) 
    Aspect Ratio: 2:3 (portrait) */}
<img 
  src={pkg.image} 
  alt="pkg" 
  style={{
    width: '100%',
    maxWidth: '300px',  // or whatever width you need
    aspectRatio: '1 / 1',
    objectFit: 'contain',
    height: 'auto'
  }} 
/>

              {/* <img src={pkg.image} alt={pkg.name} /> */}
              <div className="text-center mt-2">
              <del className=" text-green-700 font-semibold rounded px-3 py-1 inline-block mb-2">
              Rs. {pkg.price}</del>

                <button
                  className="bg-green-500 text-white px-3 py-1 font-bold hover:bg-green-400 rounded-full"
                  onClick={() => handlePackageSelect(pkg)}

                >
                  Rs. {pkg.discountPrice}
                </button>

                <p className="text-green-500 font-bold">
                  You Save: Rs. {pkg.price - pkg.discountPrice}
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
      
    </div>
  );
};

export default TrendingPackages;
