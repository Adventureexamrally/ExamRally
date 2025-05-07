import React, { useEffect, useState } from 'react';
import { FaDesktop, FaArrowRight, FaCheck, FaStar } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Api from '../../service/Api';
import { useUser } from '@clerk/clerk-react';
import PdfCoupon from './pdfCoupon';

const PdfCourseHome = () => {
  const [data, setAlldata] = useState([]);
  const navigate = useNavigate();
      const [showmodel,setshowmodel]=useState(false)
      const [selectedPlan, setSelectedPlan] = useState(null);

    const { isSignedIn } = useUser();


  useEffect(() => {
    run();
  }, []);

  const run = async () => {
    const response = await Api.get(`pdfcourseDetails`);
    setAlldata(response.data[0]);
  };

  const getSubscriptionEndDate = (months) => {
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + parseInt(months));
    return endDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleBuyNow = (plan) => {
    // Add your buy now logic here
    console.log('Buying plan:', plan);
    // navigate('/checkout', { state: { plan } });
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 
          dangerouslySetInnerHTML={{ __html: data?.title }}
        ></h1>
        <p 
          dangerouslySetInnerHTML={{ __html: data?.description }}
        ></p>
      </div>

      {/* Course Options */}
      <div className="flex justify-center flex-col md:flex-row items-center mb-16 gap-6">
        <Link
          to={'/pdf-course/Prelims'}
          className="group flex flex-col items-center p-8 cursor-pointer bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 w-full max-w-sm border-4 border-green-50 hover:border-green-200"
        >
          <div className="bg-green-50 text-green-600 p-5 rounded-full mb-4 group-hover:bg-green-100 transition-colors duration-300">
            <FaDesktop className="text-4xl" />
          </div>
          <h1 className="text-xl font-semibold text-gray-800 mb-2 text-center">
            365 Days Rally PDF Course Prelims
          </h1>
          <div className="flex items-center text-green-600 mt-2 font-medium">
            <span>Explore Now</span>
            <FaArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </Link>

        <Link
          to={'/pdf-course/Mains'}
          className="group flex flex-col items-center p-8 cursor-pointer bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 w-full max-w-sm border-4 border-green-50 hover:border-green-200"
        >
          <div className="bg-green-50 text-green-600 p-5 rounded-full mb-4 group-hover:bg-green-100 transition-colors duration-300">
            <FaDesktop className="text-4xl" />
          </div>
          <h1 className="text-xl font-semibold text-gray-800 mb-2 text-center">
            365 Days Rally PDF Course Mains
          </h1>
          <div className="flex items-center text-green-600 mt-2 font-medium">
            <span>Explore Now</span>
            <FaArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </Link>
      </div>

      {/* Pricing Section */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Choose Your Plan
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select the subscription that fits your preparation needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {data?.subscriptions?.map((plan, idx) => (
            <div 
              key={idx} 
              className={`border rounded-xl shadow-lg overflow-hidden bg-white transform hover:scale-[1.02] transition-transform duration-300`}
            >
 
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {plan.months}-Month Plan
                  </h3>
                  {plan.offerName && (
                    <span className="bg-gradient-to-r from-green-400 to-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {plan.offerName}
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-3xl font-bold text-green-600">
                      ₹{plan.discountedPrice}
                    </span>
                    <span className="line-through text-gray-500 text-sm">
                      ₹{plan.originalPrice}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">
                      Save ₹{plan.originalPrice - plan.discountedPrice}
                    </span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      {Math.round(
                        (1 - plan.discountedPrice / plan.originalPrice) * 100
                      )}% OFF
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Purchase and get validity till </span> {getSubscriptionEndDate(plan.months)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Access:</span> {plan.months} months
                  </p>
                </div>

                <button
  onClick={() => {
    if (!isSignedIn) {
      navigate('/sign-in');
    }    else {
        setSelectedPlan(plan); // set plan for modal
        setshowmodel(true);      }
  }}                  className={`w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700
                   text-white font-medium py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center`}
                >
                  Buy Now
                  <FaArrowRight className="ml-2" />
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
      {showmodel && selectedPlan &&(<PdfCoupon data={selectedPlan} setshowmodel ={setshowmodel}/>)}

      <div className="my-12">
        <p 
        
          dangerouslySetInnerHTML={{ __html: data?.subtitle }}
        ></p>
      </div>

      {/* Additional Info Section */}
      <div className="bg-green-50 rounded-xl p-8 max-w-4xl mx-auto border border-green-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Why Choose Our PDF Course?</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <li className="flex items-start">
            <div className="bg-green-100 p-2 rounded-full mr-3">
              <FaCheck className="text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Comprehensive Coverage</h4>
              <p className="text-gray-600 text-sm">Complete syllabus coverage with detailed explanations</p>
            </div>
          </li>
          <li className="flex items-start">
            <div className="bg-green-100 p-2 rounded-full mr-3">
              <FaCheck className="text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Updated Content</h4>
              <p className="text-gray-600 text-sm">Regularly updated material to match current trends</p>
            </div>
          </li>
          <li className="flex items-start">
            <div className="bg-green-100 p-2 rounded-full mr-3">
              <FaCheck className="text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Expert-Curated</h4>
              <p className="text-gray-600 text-sm">Material prepared by subject matter experts</p>
            </div>
          </li>
          <li className="flex items-start">
            <div className="bg-green-100 p-2 rounded-full mr-3">
              <FaCheck className="text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Flexible Learning</h4>
              <p className="text-gray-600 text-sm">Study at your own pace, anytime anywhere</p>
            </div>
          </li>
        </ul>
      </div>

     
    </div>
  );
};

export default PdfCourseHome;