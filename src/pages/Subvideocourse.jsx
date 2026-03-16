import React, { useContext, useEffect, useState } from "react";
import Api from "../service/Api";
import { useParams, Link, useNavigate } from "react-router-dom";
import SubvideoModal from "./SubvideoModal";
import Coupon from "./Coupon";
import { UserContext } from "../context/UserProvider";
import { useUser } from "@clerk/clerk-react";
import { FaUserTie, FaAward, FaCheckCircle } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";

const Subvideocourse = () => {
  const { id, sub } = useParams();
  const navigate = useNavigate();
  const { isSignedIn } = useUser(); // Get signed-in status directly from Clerk
  const [courseData, setCourseData] = useState(null);
  const [subtopic, setSubtopic] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [ad, setAD] = useState([]);
  const { user, utcNow, isFetchingUser } = useContext(UserContext);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [expireDate, setExpireDate] = useState(null);
  const [data, setData] = useState({}); // Placeholder for Coupon
  const [error, setError] = useState(null); // Added error state
  const [activeFilter, setActiveFilter] = useState("All"); // Filter state

  // Fetch ad data
  useEffect(() => {
    async function run() {
      try {
        const response = await Api.get(`/blog-Ad/getbypage/video-course`);
        setAD(response.data);
      } catch (err) {
        console.error("Failed to load ads", err);
      }
    }
    run();
  }, []);

  // Fetch course data and subtopics
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topicRes, courseRes] = await Promise.all([
          Api.get(`topic-test/test-sub-topic/${sub}`),
          Api.get(`video-courses/video-course/main-page/${id}`),
        ]);
        setSubtopic(topicRes.data);
        setCourseData(courseRes.data);
        console.log("courseData", courseRes.data);
        setData(courseRes.data); // For Coupon Modal
      } catch (error) {
        console.error("Failed to fetch course data:", error);
        setError("Failed to load course data. Please try again later.");
      }
    };
    fetchData();
  }, [id, sub]);

  // Check if the course is enrolled or purchased
  useEffect(() => {
    if (!utcNow || (!user?.enrolledCourses && !user?.subscriptions)) return;

    const checkExpiry = (course) => {
      const expireDate = new Date(course?.expiryDate);
      const timeDiff = expireDate.getTime() - utcNow.getTime();
      const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // 1 day in ms

      if (
        !isNaN(daysLeft) &&
        daysLeft >= 0 &&
        course?.courseId?.includes(data._id)
      ) {
        setExpireDate(daysLeft); // Set days left
        return true;
      }

      return false;
    };

    const enrolledFromCourses = user?.enrolledCourses?.some(checkExpiry);
    const enrolledFromSubscriptions = user?.subscriptions?.some(checkExpiry);

    setIsEnrolled(enrolledFromCourses || enrolledFromSubscriptions);
  }, [user, data, utcNow]);

  // Loading state
  if (error) {
    return (
      <div className="text-center mt-10 text-red-500">
        <p>{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!courseData) {
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  }


  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left Content (4/5 width on md and up) */}
        <div className="w-full md:w-4/5">
          {/* Author Info */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            {/* Author Info */}
            <div className="w-full ">
              <h1 className="text-3xl font-bold mb-6 text-[#131656]">{courseData.title}</h1>
              <InstructorSection authors={courseData.author_data} />
            </div>
            {/* Right side: Course Logo */}

          </div>

          {/* Course Highlights */}
          <HighlightsSection highlights={courseData.course_highlight} />

          {/* Subtopics */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold bg-green-500 my-2 py-2 px-3 text-white rounded-lg">
              {courseData.subject}
            </h2>

            {/* Filter Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-lg">
              {["All", "Prelims", "Mains"].map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeFilter === type
                    ? "bg-white text-green-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {subtopic?.map((sub, idx) =>
              sub.topics
                ?.filter((topic) => {
                  if (activeFilter === "All") return true;

                  const type = topic.examType || "Prelims";
                  // Show if type matches filter OR if type is "Both" (unless filter is "All", handled above)
                  return type === activeFilter || type === "Both";
                })
                .map((topic, index) => (
                  <div key={`${idx}-${index}`} className="card scale-95 shadow-2xl border rounded-md hover:scale-100 transition duration-300">
                    <div className="card-body text-center p-4">
                      <h5 className="card-title font-semibold">{topic.name}</h5>
                      <button
                        className="mt-3 py-2 px-4 rounded w-full transition bg-green-500 text-white hover:bg-green-600"
                        onClick={() => {
                          // const video = courseData.video_courses?.filter(v => v.topic === topic.name);
                          // setCurrentVideo(video);
                          // setModalOpen(true);
                          // Open in new tab
                          window.open(`/videoplayer/${id}/${encodeURIComponent(topic.name)}`, '_blank');
                        }}
                      >
                        View Videos
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Right Sidebar (1/5 width on md and up) */}
        <div className="w-full md:w-1/5 space-y-6">
          {/* Features Box */}
          <PricingSidebar
            courseData={courseData}
            isEnrolled={isEnrolled}
            expireDays={expireDate}
            isSignedIn={isSignedIn}
            isLoading={isFetchingUser}
            onBuy={() => {
              if (!isSignedIn) navigate('/sign-in');
              else setShowModal(true);
            }}
          />

          {/* Coupon Modal */}
          {showModal && <Coupon data={courseData} setshowmodel={setShowModal} />}

          {/* Sponsored Ads */}
          {ad.length > 0 && (
            <div className="bg-white border p-4 rounded-xl shadow-md">
              <h4 className="font-semibold text-gray-600 mb-2 text-center">Sponsored</h4>
              {ad.map((item) => (
                <div key={item._id} className="mb-4 hover:scale-105 transition-transform duration-300">
                  <Link to={item.link_name}>
                    <img src={item.photo} alt="Ad" className="rounded-md shadow" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Video Modal */}
      <SubvideoModal
        videos={currentVideo}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        data={courseData}
      />
    </div>
  );
};

const HighlightsSection = ({ highlights }) => {
  if (!highlights?.length) return null;

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 p-6 relative overflow-hidden">
      {/* Subtle green background decoration */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50 rounded-full blur-2xl opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-36 h-36 bg-green-50 rounded-full blur-2xl opacity-60"></div>

      {/* Header */}
      <div className="relative z-10 mb-5 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
          <FaAward className="text-emerald-600 text-sm" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Highlights</h2>
        {/* <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full ml-auto">
          {highlights.length} items
        </span> */}
      </div>

      {/* Compact grid */}
      <div className="relative z-10 grid grid-cols-2 gap-3">
        {highlights.map((item) => (
          <div
            key={item._id}
            className="bg-white border border-emerald-100 rounded-xl p-3 hover:border-emerald-300 hover:shadow-sm transition-all"
          >
            {/* Image + Title row */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <img
                  src={item.logo}
                  alt={item.title}
                  className="w-5 h-5 object-contain"
                />
              </div>
              <h3 className="font-semibold text-slate-800 text-sm leading-tight line-clamp-2">
                {item.title}
              </h3>
            </div>

            {/* Description below */}
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Optional: View more link if needed */}
      {/* {highlights.length > 4 && (
        <button className="relative z-10 w-full mt-3 text-xs text-emerald-600 font-medium flex items-center justify-center gap-1 py-2 hover:bg-emerald-50 rounded-lg transition-colors">
          View all {highlights.length} highlights
          <span>→</span>
        </button>
      )} */}
    </div>
  );
};

const InstructorSection = ({ authors }) => {
  if (!authors?.length) return null;
  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
      <h2 className="text-xl font-extrabold text-slate-900 mb-8 flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
          <FaUserTie />
        </span>
        Your Educator
      </h2>
      {authors.map((author) => (
        <div key={author._id} className="flex flex-col sm:flex-row gap-8 items-start">
          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-200 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <img
              src={author.image}
              alt={author.name}
              className="relative w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
            />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-2xl font-bold text-slate-800">{author.name}</h3>
              {author.designation && (
                <span className="inline-block bg-slate-100 text-slate-600 text-xs px-2.5 py-0.5 rounded-md font-bold mt-1 uppercase tracking-wide">
                  {author.designation}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {author.description?.map((desc, i) => (
                <span key={i} className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full font-medium border border-emerald-100">
                  {desc.title}
                </span>
              ))}
            </div>

            <p className="text-slate-500 text-sm leading-relaxed">
              Expert educator with years of experience in guiding students to success. Master the concepts with clear explanations and practical examples.
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

const PricingSidebar = ({ courseData, isEnrolled, expireDays, isSignedIn, onBuy, isLoading }) => {
  const discount = courseData.amount - courseData.discountedAmount;

  return (
    <div className="bg-white rounded-[2rem] shadow-xl border border-emerald-100 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-green-500"></div>
      <div className="p-6 sm:p-8">

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mb-2"></div>
            <p className="text-slate-500 font-medium text-sm">Checking status...</p>
          </div>
        ) : !isEnrolled ? (
          <div className="text-center mb-8">
            <div className="text-slate-400 line-through text-sm font-medium">MRP: ₹{courseData.amount}</div>
            <div className="flex items-baseline justify-center gap-1 my-1">
              <span className="text-2xl font-bold text-slate-900">₹</span>
              <span className="text-5xl font-extrabold text-slate-900 tracking-tight">{courseData.discountedAmount}</span>
            </div>
            <div className="inline-block bg-red-50 text-red-600 text-xs font-bold px-3 py-1 rounded-full mt-2">
              Save ₹{discount} today
            </div>
          </div>
        ) : (
          <div className="text-center mb-8 bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-emerald-500 mx-auto shadow-sm mb-3 text-xl">
              <FaCheckCircle />
            </div>
            <div className="text-emerald-800 font-bold text-lg">
              Active Subscription
            </div>
            {expireDays && (
              <div className="text-sm text-emerald-600 font-medium bg-white/50 inline-block px-3 py-1 rounded-full mt-2">
                Expires in {expireDays} days
              </div>
            )}
          </div>
        )}

        {!isLoading && (
          <button
            onClick={onBuy}
            disabled={isEnrolled}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl shadow-green-100 transition-all transform hover:-translate-y-1 active:translate-y-0 ${isEnrolled
              ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
              : "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white"
              }`}
          >
            {isEnrolled ? "Continue Learning" : "Enroll Now"}
          </button>
        )}

        <div className="mt-8 space-y-4">
          <div className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">What's included</div>
          {courseData.feature?.map((item, index) => (
            <div key={index} className="flex items-start gap-3 text-sm text-slate-600 font-medium group">
              <FaCheckCircle className="text-emerald-500 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
              <span>{item}</span>
            </div>
          ))}
          <div className="h-px bg-slate-100 my-4"></div>
          <div className="flex items-center justify-center gap-4 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            <MdSecurity className="text-slate-400 text-xl" />
            <span className="text-xs text-slate-400 font-semibold">100% Secure Payment</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subvideocourse;
