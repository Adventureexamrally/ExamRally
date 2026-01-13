import React, { useContext, useEffect, useState, useMemo, useCallback, memo } from 'react';
import { FaDesktop, FaArrowRight, FaCheck } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Api from '../../service/Api';
import { useUser } from '@clerk/clerk-react';
import PdfCoupon from './pdfCoupon';
import { UserContext } from '../../context/UserProvider';
import { sanitizeHtml } from '../../utils/sanitizeHtml';

// Memoized static sections
const CourseLink = memo(({ to, title }) => (
  <Link
    to={to}
    className="group flex flex-col items-center p-8 cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 w-full max-w-sm border border-slate-200 hover:border-green-300"
  >
    <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
      <FaDesktop className="text-5xl" />
    </div>
    <h1 className="text-xl font-black text-slate-800 mb-2 text-center leading-tight">
      {title}
    </h1>
    <div className="flex items-center text-green-600 mt-3 font-bold">
      <span>Explore Now</span>
      <FaArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-2" />
    </div>
  </Link>
));
CourseLink.displayName = 'CourseLink';

// Memoized feature list
const FeatureItem = memo(({ title, description }) => (
  <li className="flex items-start gap-3">
    <div className="bg-green-100 p-2.5 rounded-xl flex-shrink-0">
      <FaCheck className="text-green-600 text-sm" />
    </div>
    <div>
      <h4 className="font-bold text-slate-800 mb-1">{title}</h4>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </div>
  </li>
));
FeatureItem.displayName = 'FeatureItem';

// Helper functions
const calculateDaysLeft = (expiryDate, currentDate) => {
  const expiry = new Date(expiryDate);
  const timeDiff = expiry - currentDate;
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
};

const formatExpiryDate = (date) => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const calculateDiscount = (original, discounted) => {
  return Math.round((1 - discounted / original) * 100);
};

const PdfCourseHome = () => {
  const { user, utcNow } = useContext(UserContext);
  const [data, setAlldata] = useState(null);
  const navigate = useNavigate();
  const [showmodel, setshowmodel] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const { isSignedIn } = useUser();

  // Fetch data once on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api.get(`pdfcourseDetails`);
        setAlldata(response.data[0]);
      } catch (error) {
        console.error('Failed to fetch PDF course details:', error);
      }
    };

    fetchData();
  }, []);

  // Memoized subscription end date calculator
  const getSubscriptionEndDate = useCallback((months) => {
    const startDate = utcNow;
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + parseInt(months));

    return endDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }, [utcNow]);

  // Memoized enriched plans with subscription info
  const plansWithSubscription = useMemo(() => {
    if (!data?.subscriptions) return [];

    const userSubscriptions = user?.subscriptions || [];

    // Check if user has ANY active PDF subscription
    const activePdfSubscription = userSubscriptions.find(sub =>
      sub.status === 'Active' &&
      (sub.courseName?.includes('PDF Course') || sub.courseName?.includes('Pdf Course'))
    );

    // If user has an active PDF subscription, all plans show as purchased
    if (activePdfSubscription) {
      const expiryDate = activePdfSubscription.expiryDate;
      const daysLeft = expiryDate ? calculateDaysLeft(expiryDate, utcNow) : null;
      const isExpired = daysLeft !== null && daysLeft <= 0;

      return data.subscriptions.map(plan => ({
        ...plan,
        isPurchased: !isExpired,
        daysLeft: !isExpired ? daysLeft : null,
        expiryDate: !isExpired ? expiryDate : null,
        isExpired: isExpired
      }));
    }

    // If no active subscription, show all as not purchased
    return data.subscriptions.map(plan => ({
      ...plan,
      isPurchased: false,
      daysLeft: null,
      expiryDate: null,
      isExpired: false
    }));
  }, [data?.subscriptions, user?.subscriptions, utcNow]);

  // Memoized event handlers
  const handlePlanClick = useCallback((plan) => {
    if (!isSignedIn) {
      navigate('/sign-in');
    } else {
      setSelectedPlan(plan);
      setshowmodel(true);
    }
  }, [isSignedIn, navigate]);

  const handleCloseModal = useCallback(() => {
    setshowmodel(false);
  }, []);

  // Sanitized content (memoized)
  const sanitizedTitle = useMemo(() => sanitizeHtml(data?.title), [data?.title]);
  const sanitizedDescription = useMemo(() => sanitizeHtml(data?.description), [data?.description]);
  const sanitizedSubtitle = useMemo(() => sanitizeHtml(data?.subtitle), [data?.subtitle]);

  // Static features data
  const features = useMemo(() => [
    { title: 'Comprehensive Coverage', description: 'Complete syllabus coverage with detailed explanations' },
    { title: 'Updated Content', description: 'Regularly updated material to match current trends' },
    { title: 'Expert-Curated', description: 'Material prepared by subject matter experts' },
    { title: 'Flexible Learning', description: 'Study at your own pace, anytime anywhere' },
  ], []);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center">
        <h1
          className="text-3xl md:text-5xl font-black text-slate-800 leading-tight"
          dangerouslySetInnerHTML={{ __html: sanitizedTitle }}
        ></h1>
        <p
          className="text-lg text-slate-600 leading-relaxed font-medium text-left"
          dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
        ></p>
      </div>

      {/* Course Options - Memoized */}
      <div className="flex justify-center flex-col md:flex-row items-stretch mb-16 gap-6 mt-2">
        <CourseLink
          to="/pdf-course/Prelims"
          title="365 Days Rally PDF Course Prelims"
        />
        <CourseLink
          to="/pdf-course/Mains"
          title="365 Days Rally PDF Course Mains"
        />
      </div>

      {/* Pricing Section */}
      <div className="mb-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-3">
            Choose Your <span className="text-green-600 italic font-serif">Plan</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
            Select the subscription that fits your preparation needs
          </p>
        </div>

        <div id="pdf-plan" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plansWithSubscription.map((plan) => (
            <div
              key={plan._id || plan.months}
              className="border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl overflow-hidden bg-white transform hover:scale-[1.02] transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-black text-slate-800">
                    {plan.months}-Month Plan
                  </h3>
                  {plan.offerName && (
                    <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                      {plan.offerName}
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-4xl font-black text-green-600">
                      ₹{plan.discountedPrice}
                    </span>
                    <span className="line-through text-slate-400 text-base mb-1">
                      ₹{plan.originalPrice}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-600">
                      Save ₹{plan.originalPrice - plan.discountedPrice}
                    </span>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                      {calculateDiscount(plan.originalPrice, plan.discountedPrice)}% OFF
                    </span>
                  </div>
                </div>

                <div className="mb-4 pb-4 border-b border-slate-100">
                  <p className="text-sm text-slate-600 font-medium">
                    <span className="font-bold text-slate-800">Access:</span> {plan.months} months
                  </p>
                </div>

                {plan.isPurchased && !plan.isExpired ? (
                  <div className="text-center">
                    <button
                      disabled
                      className="w-full bg-slate-200 text-slate-500 font-bold py-3 px-4 rounded-xl shadow-sm cursor-not-allowed flex items-center justify-center"
                    >
                      ✓ Purchased
                    </button>
                    <p className="text-sm text-green-600 mt-3 font-bold flex items-center justify-center gap-1">
                      <i className="bi bi-clock-history"></i> {plan.daysLeft} Days Left
                    </p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      Valid till: {formatExpiryDate(plan.expiryDate)}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => handlePlanClick(plan)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                  >
                    {plan.isExpired ? 'Renew Now' : 'Buy Now'}
                    <FaArrowRight className="ml-2" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showmodel && selectedPlan && (
        <PdfCoupon data={selectedPlan} setshowmodel={handleCloseModal} />
      )}

      {/* Subtitle Section */}
      <div className="my-12 bg-slate-50 rounded-2xl p-8 border border-slate-100">
        <div
          className="text-base text-slate-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: sanitizedSubtitle }}
        ></div>
      </div>

      {/* Additional Info Section - Features */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-10 max-w-4xl mx-auto border border-green-100 shadow-sm">
        <h3 className="text-3xl font-black text-slate-800 mb-8 text-center">
          Why Choose Our <span className="text-green-600 italic font-serif">PDF Course</span>?
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, idx) => (
            <FeatureItem
              key={idx}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default memo(PdfCourseHome);