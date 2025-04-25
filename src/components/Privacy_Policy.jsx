import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Api from "../service/Api";
import AOS from "aos";
import "aos/dist/aos.css";
import { ImCheckmark2 } from "react-icons/im";
import { MdOutlineAccessTime } from "react-icons/md";
import { BsQuestionSquare } from "react-icons/bs";
import { IoMdLock } from "react-icons/io";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { Helmet } from "react-helmet";
import { BsSpeedometer2 } from "react-icons/bs";
import { UserContext } from "../context/UserProvider";
import { useUser } from "@clerk/clerk-react";

const Packagename = () => {
  const [data, setData] = useState({});
  const [faqs, setFaqs] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const exams = data?.exams || [];
  const subTitles = data?.sub_titles || [];
  const { isSignedIn } = useUser();
  
  // State management
  const [activeSection, setActiveSection] = useState("prelims");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [modalQuestions, setModalQuestions] = useState([]);
  const [timer, setTimer] = useState(600);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [modalType, setModalType] = useState("");
  const [showDifficulty, setShowDifficulty] = useState({});
  const [seo, setSeo] = useState([]);
  const [ad, setAD] = useState([]);
  const [payment, setPayment] = useState("");
  const [responseId, setResponseId] = useState("");
  const [responseState, setResponseState] = useState([]);
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const { user } = useContext(UserContext);

  // Fetch package data
  useEffect(() => {
    const fetchPackageData = async () => {
      try {
        setLoading(true);
        const res = await Api.get(`packages/package-content/${id}`);
        const packageData = res.data.data[0];
        setData(packageData);
        setFaqs(packageData.faqs || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching package data:", error);
        setLoading(false);
      }
    };

    fetchPackageData();
    run();
  }, [id]);

  // Check enrollment status
  useEffect(() => {
    if (!user || !data?._id) return;
    
    const enrolled = user?.enrolledCourses?.some(course =>
      course?.courseId?.includes(data?._id)
    );
    setIsEnrolled(!!enrolled);
  }, [user, data?._id]);

  // Initialize AOS animations
  useEffect(() => {
    AOS.init({
      duration: 2000,
    });
    AOS.refresh();
  }, []);

  // Timer effect
  useEffect(() => {
    if (!isTimerRunning || timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, isTimerRunning]);

  // Additional data fetching
  const run = async () => {
    try {
      const [response2, response3] = await Promise.all([
        Api.get(`/get-Specific-page/${id}`),
        Api.get(`/blog-Ad/getbypage/${id}`)
      ]);
      setSeo(response2.data);
      setAD(response3.data);
    } catch (error) {
      console.error("Error fetching additional data:", error);
    }
  };

  // Handlers
  const handleTopicSelect = (section, testType) => {
    setSelectedTopic(section.name);
    setModalType(testType);
    setModalQuestions(section.questions || []);
    setIsTimerRunning(true);
    setTimer(600);
  };

  const handleShowLevelClick = (testId) => {
    setShowDifficulty(prevState => ({
      ...prevState,
      [testId]: !prevState[testId]
    }));
  };

  const openNewWindow = (url) => {
    const width = window.screen.width;
    const height = window.screen.height;
    window.open(
      url,
      "_blank",
      `noopener,noreferrer,width=${width},height=${height}`
    );
  };

  const handleAccordionToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const resetTimer = () => {
    setTimer(600);
    setIsTimerRunning(false);
  };

  const handlePrelimsClick = () => {
    setActiveSection("prelims");
    resetTimer();
  };

  const handleMainsClick = () => {
    setActiveSection("mains");
    resetTimer();
  };

  const handleUpdatesClick = () => {
    setActiveSection("PYQ");
    resetTimer();
  };

  // Helper function to check if a test is paid
  const isPaidTest = (test) => {
    return test?.result_type?.toLowerCase() === "paid";
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <>
      <Helmet>
        <title>{data?.title || "Package Details"}</title>
        <meta name="description" content={data?.description || ""} />
      </Helmet>

      <div className="row">
        <div>
          <h1
            className="leading-8 font h5"
            dangerouslySetInnerHTML={{ __html: data.description || "" }}
          />
        </div>
      </div>

      <div className="row p-3 bg-light">
        <div className="col-md-2">
          <button
            className={`btn w-100 mb-2 text-white ${
              activeSection === "prelims"
                ? "bg-[#131656] hover:bg-[#131656]"
                : "bg-green-500 hover:bg-green-600"
            }`}
            onClick={handlePrelimsClick}
            style={{ fontFamily: "helvetica, Arial, sans-serif" }}
          >
            Prelims
          </button>
        </div>
        {data?.exams?.some(exam => exam.test_type === "Mains") && (
          <div className="col-md-2">
            <button
              className={`btn w-100 mb-2 text-white ${
                activeSection === "mains"
                  ? "bg-[#131656] hover:bg-[#131656]"
                  : "bg-green-500 hover:bg-green-600"
              }`}
              onClick={handleMainsClick}
              style={{ fontFamily: "helvetica, Arial, sans-serif" }}
            >
              Mains
            </button>
          </div>
        )}
        {data?.exams?.some(exam => exam.test_type === "PYQ") && (
          <div className="col-md-2">
            <button
              className={`btn w-100 mb-2 text-white ${
                activeSection === "PYQ"
                  ? "bg-[#131656] hover:bg-[#131656]"
                  : "bg-green-500 hover:bg-green-600"
              }`}
              onClick={handleUpdatesClick}
              style={{ fontFamily: "helvetica, Arial, sans-serif" }}
            >
              PYQ
            </button>
          </div>
        )}
      </div>

      {activeSection === "prelims" && (
        <div className="mt-3 bg-slate-50 py-2 px-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2">
            {data?.exams?.map(
              (test, idx) =>
                test.test_type === "Prelims" && (
                  <div key={idx} className="">
                    <div className="card scale-95 shadow-2xl border-1 rounded-3 transform transition-all duration-300 ease-in-out border-gray-300 hover:scale-100 flex flex-col justify-between h-full w-full">
                      <div className="card-body text-center flex flex-col justify-evenly">
                        <h5 className="card-title font-bold">
                          {test.exam_name}
                        </h5>
                        <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />

                        {!showDifficulty[test._id] ? (
                          <button
                            onClick={() => handleShowLevelClick(test._id)}
                            className="text-white py-2 px-2 rounded mt-2 w-full bg-[#131656] hover:bg-[#0f1245]"
                          >
                            Show Level
                          </button>
                        ) : (
                          <div className="mt-2 text-sm rounded px-2 py-2 text-center text-white bg-[#131656]">
                            <p>
                              <strong>
                                {test.q_level?.toUpperCase() || "N/A"}
                              </strong>
                            </p>
                          </div>
                        )}

                        <div className="flex justify-around items-center gap-4 mt-2">
                          <div className="flex flex-col items-center">
                            <p className="font-medium">Questions</p>
                            <p className="flex items-center gap-1">
                              <BsQuestionSquare size={20} color="orange" />
                              {test.t_questions || 0}
                            </p>
                          </div>
                          <div className="flex flex-col items-center">
                            <p className="font-medium">Marks</p>
                            <p className="flex items-center gap-1">
                              <BsSpeedometer2 size={20} color="green" />
                              {test.t_marks || 0}
                            </p>
                          </div>
                          <div className="flex flex-col items-center">
                            <p className="font-medium">Time</p>
                            <p className="flex items-center gap-1">
                              <MdOutlineAccessTime size={20} color="red" />
                              {test.duration || "N/A"}
                            </p>
                          </div>
                        </div>
                        <hr className="h-px mt-3 bg-gray-200 border-0 dark:bg-gray-700" />

                        {new Date(test.live_date) > new Date() ? (
                          <div className="mt-3 text-red-500 font-semibold py-2 px-4 border-1 border-red-500 rounded">
                            Coming Soon
                          </div>
                        ) : (
                          <button
                            className={`mt-3 py-2 px-4 rounded w-full transition ${
                              resultData?.[test._id]?.status === "completed"
                                ? "bg-green-500 text-white hover:bg-green-600"
                                : resultData?.[test._id]?.status === "paused"
                                ? "bg-green-500 text-white hover:bg-green-600"
                                : (isEnrolled && !isPaidTest(test))
                                ? "bg-green-500 text-white hover:bg-green-600"
                                : "border-2 border-green-500 text-green-500 hover:bg-green-600 hover:text-white"
                            }`}
                            onClick={() => {
                              if (!isSignedIn) {
                                navigate('/sign-in');
                                return;
                              }
                              
                              if (resultData?.[test._id]?.status === "completed") {
                                openNewWindow(`/result/${test._id}`);
                              } 
                              else if (resultData?.[test._id]?.status === "paused") {
                                openNewWindow(`/mocktest/${test._id}`);
                              }
                              else if ((isEnrolled && !isPaidTest(test))) {
                                openNewWindow(`/instruction/${test._id}`);
                              } else if (isPaidTest(test)) {
                                handleTopicSelect(test.section?.[0] || {}, "prelims");
                              } else {
                                openNewWindow(`/instruction/${test._id}`);
                              }
                            }}
                            disabled={new Date(test.live_date) > new Date()}
                          >
                            {resultData?.[test._id]?.status === "completed" 
                              ? "View Result"
                              : resultData?.[test._id]?.status === "paused"
                              ? "Resume"
                              : (isEnrolled && !isPaidTest(test))
                              ? "Take Test"
                              : isPaidTest(test) ? (
                                <div className="flex items-center justify-center font-semibold gap-1">
                                  <IoMdLock />
                                  Lock
                                </div>
                              ) : (
                                "Take Test"
                              )
                            }
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
      )}

      {/* Add other sections (Mains, PYQ) as needed */}
    </>
  );
};

export default Packagename;