import React, { useContext, useEffect, useState, useMemo } from "react";
import Api from "../service/Api";
import { useParams, Link, useNavigate } from "react-router-dom";
import SubvideoModal from "./SubvideoModal";
import Coupon from "./Coupon";
import { UserContext } from "../context/UserProvider";
import { useUser } from "@clerk/clerk-react";
import {
  FaUserTie,
  FaAward,
  FaClock,
  FaCheckCircle,
  FaPlayCircle,
  FaLock,
  FaTag
} from "react-icons/fa";
import { MdOutlineOndemandVideo, MdSecurity, MdQuiz } from "react-icons/md";

const Subvideocourse = () => {
  const { id, sub } = useParams();
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const { user, utcNow } = useContext(UserContext);

  const [courseData, setCourseData] = useState(null);
  const [subtopic, setSubtopic] = useState(null);
  const [ad, setAD] = useState([]);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [showCouponModal, setShowCouponModal] = useState(false);

  // Load Initial Data
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const [topicRes, courseRes] = await Promise.all([
          Api.get(`topic-test/test-sub-topic/${sub}`),
          Api.get(`video-courses/video-course/main-page/${id}`),
        ]);
        setSubtopic(topicRes.data);
        setCourseData(courseRes.data);
        console.log("Course Data Loaded:", courseRes.data);
      } catch (error) {
        console.error("Failed to fetch course data:", error);
      }
    };

    const fetchAds = async () => {
      try {
        const adRes = await Api.get(`/blog-Ad/getbypage/video-course`);
        setAD(adRes.data);
      } catch (error) {
        console.error("Failed to fetch ads:", error);
      }
    };

    fetchCourseData();
    fetchAds();
  }, [id, sub]);

  // Enrollment & Expiry Check
  const { isEnrolled, expireDays } = useMemo(() => {
    if (!courseData || !utcNow || (!user?.enrolledCourses && !user?.subscriptions)) {
      return { isEnrolled: false, expireDays: null };
    }

    const checkExpiry = (course) => {
      const expireDate = new Date(course?.expiryDate);
      const timeDiff = expireDate.getTime() - utcNow.getTime();
      const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      if (!isNaN(daysLeft) && daysLeft >= 0 && course?.courseId?.includes(courseData._id)) {
        return daysLeft;
      }
      return null;
    };

    let days = null;
    const enrolledFromCourses = user?.enrolledCourses?.find(checkExpiry);
    const enrolledFromSubscriptions = user?.subscriptions?.find(checkExpiry);

    if (enrolledFromCourses) days = checkExpiry(enrolledFromCourses);
    if (enrolledFromSubscriptions) days = checkExpiry(enrolledFromSubscriptions);

    return {
      isEnrolled: days !== null,
      expireDays: days
    };
  }, [user, courseData, utcNow]);


  if (!courseData) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-xl font-medium text-gray-500 animate-pulse">Loading course details...</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 min-h-screen pb-12 font-sans text-slate-900">
      {/* Hero Header */}
      <div className="bg-white pt-8 pb-10 border-b border-emerald-50 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="max-w-4xl">
            <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {courseData.subject || "Video Course"}
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight text-slate-900 tracking-tight">
              {courseData.title}
            </h1>
            <div className="flex flex-wrap gap-3 text-sm font-medium text-slate-600">
              <span className="bg-slate-100 px-4 py-1.5 rounded-full flex items-center gap-2 border border-slate-200 hover:bg-slate-200 transition-colors">
                <FaUserTie className="text-slate-500" /> {courseData.author_data?.[0]?.name || "Expert Instructor"}
              </span>
              <span className="bg-slate-100 px-4 py-1.5 rounded-full flex items-center gap-2 border border-slate-200 hover:bg-slate-200 transition-colors">
                <MdOutlineOndemandVideo className="text-slate-500" /> Video Course
              </span>
              <span className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full border border-emerald-100 flex items-center gap-2">
                <MdQuiz className="text-emerald-500" /> {subtopic?.length || 0} Modules
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Main Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Highlights Section */}
            <HighlightsSection highlights={courseData.course_highlight} />

            {/* Curriculum Section */}
            <CurriculumSection
              subtopics={subtopic}
              courseData={courseData}
              onViewVideo={(videos) => {
                setCurrentVideo(videos);
                setModalOpen(true);
              }}
            />

            {/* Instructor Section */}
            <InstructorSection authors={courseData.author_data} />

          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">

              <PricingSidebar
                courseData={courseData}
                isEnrolled={isEnrolled}
                expireDays={expireDays}
                isSignedIn={isSignedIn}
                onBuy={() => {
                  if (!isSignedIn) navigate('/sign-in');
                  else setShowCouponModal(true);
                }}
              />

              {/* Ads Section */}
              {ad.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Sponsored</div>
                  {ad.map((item) => (
                    <a key={item._id} href={item.link_name} target="_blank" rel="noopener noreferrer" className="block mb-4 last:mb-0 group">
                      <img src={item.photo} alt="Ad" className="w-full rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300" />
                    </a>
                  ))}
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      {/* Modals */}
      <SubvideoModal
        videos={currentVideo}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        data={courseData}
      />

      {showCouponModal && (
        <Coupon data={courseData} setshowmodel={setShowCouponModal} />
      )}
    </div>
  );
};

// --- Sub-Components ---

const HighlightsSection = ({ highlights }) => {
  if (!highlights?.length) return null;
  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-emerald-50 p-8 relative overflow-hidden group hover:shadow-md transition-shadow duration-300">
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
      <h2 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2 relative z-10">
        <span className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600">
          <FaAward />
        </span>
        Course Highlights
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {highlights.map((item) => (
          <div key={item._id} className="text-center p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-yellow-200 hover:bg-yellow-50/50 transition-all duration-300 group/item">
            <div className="w-12 h-12 mx-auto mb-3 object-contain p-2 bg-white rounded-xl shadow-sm group-hover/item:scale-110 transition-transform">
              <img src={item.logo} alt={item.title} className="w-full h-full object-contain" />
            </div>
            
            <h3 className="font-bold text-slate-800 text-xs mb-1 group-hover/item:text-yellow-800 transition-colors">{item.title}</h3>
            <p className="text-xs text-slate-500">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const CurriculumSection = ({ subtopics, courseData, onViewVideo }) => {
  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Curriculum</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">{courseData.subject}</p>
        </div>
        <div className="text-xs font-bold bg-slate-200 text-slate-600 px-3 py-1 rounded-full">
          {subtopics?.length || 0} Topics
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {subtopics?.map((sub, idx) => (
          <div key={idx} className="p-6 hover:bg-slate-50/50 transition-colors">
            <div className="font-bold text-slate-800 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm">
                <MdQuiz />
              </span>
              {sub.name || "Module " + (idx + 1)}
            </div>
            <div className="grid gap-3 pl-11">
              {sub.topics?.map((topic, tIdx) => (
                <div key={tIdx} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:border-blue-200 hover:shadow-md hover:shadow-blue-50 transition-all group cursor-pointer"
                  onClick={() => onViewVideo(courseData.video_courses?.filter(v => v.topic === topic.name))}>
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {tIdx + 1}
                    </div>
                    <span className="font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">{topic.name}</span>
                  </div>
                  <button
                    className="text-xs font-bold text-blue-600 flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all"
                  >
                    <FaPlayCircle /> <span className="hidden sm:inline">Play Video</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        {!subtopics?.length && (
          <div className="p-12 text-center text-slate-400 italic">No curriculum topics found.</div>
        )}
      </div>
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
        Your Instructor
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
              Expert instructor with years of experience in guiding students to success. Master the concepts with clear explanations and practical examples.
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

const PricingSidebar = ({ courseData, isEnrolled, expireDays, isSignedIn, onBuy }) => {
  const discount = courseData.amount - courseData.discountedAmount;

  return (
    <div className="bg-white rounded-[2rem] shadow-xl border border-emerald-100 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-green-500"></div>
      <div className="p-6 sm:p-8">
        {!isEnrolled ? (
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
              <div className="text-sm text-emerald-600 mt-1 font-medium bg-white/50 inline-block px-3 py-1 rounded-full mt-2">
                Expires in {expireDays} days
              </div>
            )}
          </div>
        )}

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
