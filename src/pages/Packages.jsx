import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Api from '../service/Api';
import { useUser } from '@clerk/clerk-react';
import { UserContext } from '../context/UserProvider';
import PackageCoupon from './PackageCoupon';


const Packages = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const { user, utcNow } = useContext(UserContext);  // get utcNow here
  const [trending, setTrending] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    Api.get('group-packages/get-all-active')
      .then((res) => {
        const responseData = res.data.data || [];
        setTrending(responseData);
        setData(responseData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // Handle Package Selection
  const handlePackageSelect = (pkg) => {
    if (!isSignedIn) {
      navigate('/sign-in');
    } else {
      setSelectedPackage(pkg);
      setShowModal(true);
    }
  };

  const [packagesWithEnrollment, setPackagesWithEnrollment] = useState([]);
  const [duration,setDuration]=useState([])
    
 

useEffect(() => {
  if (!data.length) return;

  if (user && (Array.isArray(user.enrolledCourses) || Array.isArray(user.subscriptions))) {
    const allCourses = [
      ...(user.enrolledCourses || []),
      ...(user.subscriptions || []),
    ];

    const updatedPackages = data.map(item => {
      const packageName = item.name?.trim().toLowerCase();
      const matchedCourse = allCourses.find(
        course => course.courseName?.trim().toLowerCase() === packageName
      );

      let enrolled = false;
      let daysLeft = null;
      let expired = false;

      if (matchedCourse) {
        enrolled = true;
        const expiryDate = new Date(matchedCourse.expiryDate);
        const timeDiff = expiryDate - utcNow;
        daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (daysLeft <= 0) {
          enrolled = false; // let user re-purchase if expired
          expired = true;
        }
      }

      return {
        ...item,
        enrolled,
        daysLeft,
        expired,
      };
    });

    setPackagesWithEnrollment(updatedPackages);
  } else {
    // User not signed in, just show all packages without enrollment info
    setPackagesWithEnrollment(data);
  }
}, [user, data, utcNow]);

  return (
    <div className="my-7 p-6 rounded-2xl shadow-xl bg-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-green-800">Trending Packages</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-2">
        {packagesWithEnrollment.map((pkg, index) => (
          <div key={index} className="group">
            <div className="bg-white border-2 border-green-100 p-6 rounded-2xl hover:scale-[1.02] hover:shadow-lg transition-all duration-300 flex flex-col overflow-y-auto">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">{pkg.name}</h2>
                <div className="w-120 mt-1 h-1 bg-green-500 rounded-full"></div>
              </div>

              <div className="flex-grow space-y-1 mb-2 overflow-y-auto h-[200px]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                {pkg.feature.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="mt-1 text-green-500">
                      <i className="bi bi-check-circle-fill"></i>
                    </div>
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-auto text-center bg-green-50 rounded-xl p-2 border border-blue-100">
                <div className="mb-2">
                  <del className="text-gray-500 font-medium">Rs. {pkg.price}</del>
                  <span className="ml-2 bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">
                    Save Rs. {pkg.price - pkg.discountPrice}
                  </span>
                </div>
<button
  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 font-bold hover:from-green-600 hover:to-green-700 rounded-lg shadow-md transition-all duration-300"
  onClick={() => handlePackageSelect(pkg)}
  // allow repurchase if expired
    disabled={pkg.enrolled && !pkg.expired}
>
  {pkg.enrolled && !pkg.expired
    ? "Purchased"
    : `Rs.${pkg.discountPrice}`}
</button>

{pkg.enrolled && !pkg.expired ? (
  <p className="text-md text-red-500 mt-2 font blink">
    <i className="bi bi-clock-history"></i> {pkg.daysLeft} - Days Left
  </p>
) : pkg.expired ? (
  <p className="text-md text-orange-500 mt-2 font">
    <i className="bi bi-exclamation-triangle-fill"></i> Expired - Repurchase
  </p>
) : (
  <p className="text-md text-gray-500 mt-2 font">
    <i className="bi bi-clock-history"></i> Limited Time Offer
  </p>
)}

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

export default Packages;
