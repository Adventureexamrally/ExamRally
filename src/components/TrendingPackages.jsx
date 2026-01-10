import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Api from '../service/Api';
import { useUser } from '@clerk/clerk-react';
import { UserContext } from '../context/UserProvider';
import PackageCoupon from '../pages/PackageCoupon';
import { FaCheckCircle, FaClock, FaExclamationTriangle, FaBolt } from 'react-icons/fa';

const TrendingPackages = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const { user, utcNow } = useContext(UserContext);
  const [trending, setTrending] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [data, setData] = useState([]);
  const [packagesWithEnrollment, setPackagesWithEnrollment] = useState([]);

  useEffect(() => {
    Api.get('group-packages/get-all-active')
      .then((res) => {
        const responseData = res.data.data || [];
        setTrending(responseData);
        setData(responseData);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handlePackageSelect = (pkg) => {
    if (!isSignedIn) {
      navigate('/sign-in');
    } else {
      setSelectedPackage(pkg);
      setShowModal(true);
    }
  };

  useEffect(() => {
    if (!data.length) return;
    if (user && (Array.isArray(user.enrolledCourses) || Array.isArray(user.subscriptions))) {
      const allCourses = [...(user.enrolledCourses || []), ...(user.subscriptions || [])];
      const updatedPackages = data.map(item => {
        const packageName = item.name?.trim().toLowerCase();
        const matchedCourse = allCourses.find(
          course => String(course.courseName || '').trim().toLowerCase() === packageName
        );
        let enrolled = false, daysLeft = null, expired = false;
        if (matchedCourse) {
          enrolled = true;
          const expiryDate = new Date(matchedCourse.expiryDate);
          const timeDiff = expiryDate - utcNow;
          daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
          if (daysLeft <= 0) { enrolled = false; expired = true; }
        }
        return { ...item, enrolled, daysLeft, expired };
      });
      setPackagesWithEnrollment(updatedPackages);
    } else {
      setPackagesWithEnrollment(data);
    }
  }, [user, data, utcNow]);

  return (
    <div className="my-10 p-8 rounded-[2rem] border border-green-100 bg-white shadow-sm relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-60"></div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-800 tracking-tight">
            Trending <span className="text-green-600 italic font-serif font-medium">Packages</span>
          </h1>
          {/* <p className="text-slate-400 text-sm font-medium mt-1">Our most popular 365-day banking prep bundles</p> */}
        </div>
        <Link to='/All-Packages' className="group flex items-center gap-2 bg-green-50 text-green-700 px-6 py-2.5 rounded-xl font-bold text-sm transition-all hover:bg-green-600 hover:text-white">
          View All Library
          <FaBolt className="text-[10px] group-hover:animate-pulse" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {packagesWithEnrollment.slice(0, 4).map((pkg, index) => (
          <div key={index} className="group relative bg-white border border-slate-100 p-6 rounded-3xl transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-100 hover:-translate-y-2 flex flex-col h-full">
            
            {/* Package Title */}
            <div className="mb-6">
              <h2 className="text-xl font-black text-slate-800 leading-tight min-h-[3rem] line-clamp-2">
                {pkg.name}
              </h2>
              <div className="w-12 h-1 bg-green-500 rounded-full mt-2"></div>
            </div>

            {/* Scrollable Features Section */}
            <div className="flex-grow mb-6 pr-2 overflow-y-auto max-h-[180px] custom-scrollbar">
              <div className="space-y-3">
                {pkg.feature.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <FaCheckCircle className="text-green-500 text-sm mt-1 shrink-0" />
                    <p className="text-slate-600 text-sm font-medium leading-snug">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing & CTA Section */}
            <div className="mt-auto pt-6 border-t border-slate-50">
              <div className="flex justify-between items-end mb-4">
                <div className="flex flex-col">
                  <span className="text-slate-300 line-through text-xs font-bold">Rs. {pkg.price}</span>
                  <span className="text-2xl font-black text-slate-800">Rs.{pkg.discountPrice}</span>
                </div>
                <div className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-tighter">
                  Save ₹{pkg.price - pkg.discountPrice}
                </div>
              </div>

              <button
                className={`w-full py-3.5 rounded-2xl font-bold text-sm shadow-lg transition-all duration-300 ${
                  pkg.enrolled && !pkg.expired 
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                  : "bg-green-600 text-white hover:bg-green-700 hover:shadow-green-200"
                }`}
                onClick={() => handlePackageSelect(pkg)}
                disabled={pkg.enrolled && !pkg.expired}
              >
                {pkg.enrolled && !pkg.expired ? "Already Enrolled" : "Enroll Now"}
              </button>

              {/* Status Indicator */}
              <div className="mt-4 text-center">
                {pkg.enrolled && !pkg.expired ? (
                  <div className="flex items-center justify-center gap-1.5 text-red-500 animate-pulse">
                    <FaClock className="text-xs" />
                    <span className="text-xs font-bold uppercase tracking-widest">{pkg.daysLeft} Days Left</span>
                  </div>
                ) : pkg.expired ? (
                  <div className="flex items-center justify-center gap-1.5 text-orange-500">
                    <FaExclamationTriangle className="text-xs" />
                    <span className="text-xs font-bold uppercase tracking-widest">Expired - Renew</span>
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Limited Access</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #10b981;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #059669;
        }
      `}</style>

      {showModal && selectedPackage && (
        <PackageCoupon pkg={selectedPackage} setShowModal={setShowModal} />
      )}
    </div>
  );
};

export default TrendingPackages;