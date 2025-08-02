import React, { useContext, useEffect, useState } from "react";
import Api from "../service/Api";
import { useParams, Link, useNavigate } from "react-router-dom";
import SubvideoModal from "./SubvideoModal";
import Coupon from "./Coupon";
import { UserContext } from "../context/UserProvider";
import { useUser } from "@clerk/clerk-react";

const Subvideocourse = () => {
  const { id, sub } = useParams();
  const navigate = useNavigate();
  const { isSignedIn } = useUser(); // Get signed-in status directly from Clerk
  const [courseData, setCourseData] = useState(null);
  const [subtopic, setSubtopic] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [ad, setAD] = useState([]);
  const { user, utcNow } = useContext(UserContext);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showModel, setShowModel] = useState(false);
  
    const [showModal, setShowModal] = useState(false);
  const [expireDate, setExpireDate] = useState(null);
  const [data, setData] = useState({}); // Placeholder for Coupon

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
          <div className="w-full md:w-2/3">
  <h1 className="text-3xl font-bold mb-6 text-[#131656]">{courseData.title}</h1>
  
  {courseData.author_data?.map((author) => (
    <div key={author._id} className="flex flex-col md:flex-row gap-6 mb-8 p-6 bg-white rounded-lg shadow-md">
      {/* Author Image */}
      <div className="flex-shrink-0 mx-auto md:mx-0">
        <img
          src={author.image}
          alt={author.name}
          className="w-40 h-40 object-cover rounded-lg border-2 border-[#131656]"
        />
      </div>
      
      {/* Author Details */}
      <div className="flex-grow">
        <div className="mb-4">
          <p className="text-lg font-semibold text-[#131656]">
            <span className="font-bold text-green-600">Author:</span> {author.name}
          </p>
        </div>
        
        {/* Designation and Description */}
        <div className="flex flex-wrap gap-3">
          {author.designation && (
            <span className="px-3 py-1 bg-[#0000FF] text-white text-sm font-medium rounded-full">
              {author.designation}
            </span>
          )}
          
          {author.description?.map((desc, i) => (
            <span 
              key={i} 
              className="px-3 py-1 bg-[#0000FF] text-white text-sm font-medium rounded-full"
            >
              {desc.title}
            </span>
          ))}
        </div>
        
        {/* Additional author information can go here */}
      </div>
    </div>
  ))}
</div>
            {/* Right side: Course Logo */}
        
          </div>

          {/* Course Highlights */}
          <h2 className="text-2xl font-semibold mb-4 bg-green-500 p-2 text-white rounded">
            Course Highlights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-2">
            {courseData.course_highlight?.map((highlight) => (
              <div key={highlight._id} className="bg-white rounded-lg shadow-md border p-4 text-center">
                <h3 className="text-xl font-semibold mb-2">{highlight.title}</h3>
                <img
                  src={highlight.logo}
                  alt="Course Highlight"
                  className="w-full h-20 object-contain rounded-md mb-4"
                />
                <p className="text-sm text-gray-800">{highlight.description}</p>
              </div>
            ))}
          </div>

          {/* Subtopics */}
          <h2 className="text-2xl font-semibold mb-4 bg-green-500 p-2 text-white rounded">
            {courseData.subject}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {subtopic?.map((sub, idx) =>
              sub.topics?.map((topic, index) => (
                <div key={`${idx}-${index}`} className="card scale-95 shadow-2xl border rounded-md hover:scale-100 transition duration-300">
                  <div className="card-body text-center p-4">
                    <h5 className="card-title font-semibold">{topic.name}</h5>
                    <button
                      className="mt-3 py-2 px-4 rounded w-full transition bg-green-500 text-white hover:bg-green-600"
                      onClick={() => {
                        const video = courseData.video_courses?.filter(v => v.topic === topic.name);
                        setCurrentVideo(video);
                        setModalOpen(true);
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
          <div className="bg-white border border-green-100 p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">Features</h2>
            <div className="w-20 h-1 bg-green-500 mx-auto rounded-full mb-4" />
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {courseData.feature?.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <i className="bi bi-check-circle-fill text-green-500 mt-1" />
                  <p className="text-gray-700 text-sm">{item}</p>
                </div>
              ))}
            </div>

            {/* Price Section */}
            <div className="mt-4 text-center bg-green-50 rounded-xl p-3 border border-blue-100">
              <del className="text-gray-500 font-medium">Rs.{courseData.amount}</del>
              <p className="text-red-600 text-sm font-bold mt-1">
                You Save: Rs.{courseData.amount - courseData.discountedAmount}
              </p>

              <button
        
         className={`px-3 py-1 font-bold rounded-full ${
    isEnrolled 
      ? "bg-[#000080] text-white cursor-not-allowed" // disabled style
      : "bg-green-500 text-gray-50 hover:bg-green-400"
  }`}
  onClick={() => {
    if (!isSignedIn) {
      navigate('/sign-in');
    }  else {
      setShowModal(true);
    }
  }}
     
      >
      
       {expireDate
                        ? isEnrolled
                          ? "Purchased"
                          : `Rs.${data.discountedAmount}`
                        : `Rs.${data.discountedAmount}`}
                    </button>

              <p className="text-sm text-gray-600 mt-2">
                <i className="bi bi-clock-history"></i>{" "}
                {expireDate ? `${expireDate} - Days Left` : "Limited Time Offer"}
              </p>
            </div>
          </div>

          {/* Coupon Modal */}
          {showModal && <Coupon data={courseData}  setshowmodel={setShowModal} />}

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

export default Subvideocourse;
