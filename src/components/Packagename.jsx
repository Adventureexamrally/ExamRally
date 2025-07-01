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
import Coupon from "../pages/Coupon";
import { fetchUtcNow } from "../service/timeApi";

const Packagename = () => {
  const [data, setData] = useState({});
  const [faqs, setFaqs] = useState([]);
  const [showmodel, setshowmodel] = useState(false);

  const { id } = useParams();

  const navigate = useNavigate();
  // Extracting the package content and exams information
  // const packageContent = data?.package_content?.[0] || {}; // Assuming there is only one item in package_content array
  const exams = data?.exams || {};
  // console.log("VAR", exams);
  // Assuming there is only one exam object
  const subTitles = data?.sub_titles || [];

  const { isSignedIn } = useUser();
  // console.log(subTitles);

  const [activeSection, setActiveSection] = useState("prelims"); // Tracks active section (Prelims/Mains/Previous Year Questions)
  const [selectedTopic, setSelectedTopic] = useState(null); // Selected topic
  const [modalQuestions, setModalQuestions] = useState([]); // Stores questions for modal
  const [timer, setTimer] = useState(600); // Timer (10 min)
  const [isTimerRunning, setIsTimerRunning] = useState(false); // Timer control
  const [modalType, setModalType] = useState(""); // Tracks Prelims or Mains modal
  const [showDifficulty, setShowDifficulty] = useState({}); // State to manage difficulty visibility
  const [seo, setSeo] = useState([]);
  const [ad, setAD] = useState([]);
  const [payment, setPayment] = useState("");
  const [responseId, setResponseId] = useState("");
  const [responseState, setResponseState] = useState([]);

  // Handle topic selection & set modal questions
  const handleTopicSelect = (section, testType) => {
    setSelectedTopic(section.name);
    setModalType(testType);
    setModalQuestions(section.questions); // Set questions for the selected section
    setIsTimerRunning(true);
    setTimer(600); // Reset Timer on topic change
  };

  const [resultData, setResultData] = useState(null);

  const { user } = useContext(UserContext);
  // console.log(user)
const fetchPackageContent = async () => {
  try {
    const res = await Api.get(`packages/package-content/${id}`);
    const packageData = res.data.data[0];

    setData(packageData);
    setFaqs(packageData.faqs);

    // Reset result data before fetching new results
    setResultData({});

    // If user exists, fetch results
    if (user?._id && packageData?.exams?.length > 0) {
      const resultPromises = packageData.exams.map(async (test) => {
        try {
          const resultRes = await Api.get(`/results/${user._id}/${test._id}`);
          return {
            testId: test._id,
            result: resultRes.data
          };
        } catch (err) {
          console.error("Error fetching result for test:", test._id, err);
          return null;
        }
      });

      const results = await Promise.all(resultPromises);
      results.forEach(item => {
        if (item && (item.result?.status === "completed" || item.result?.status === "paused")) {
          setResultData(prev => ({
            ...prev,
            [item.testId]: {
              ...item.result,
              lastQuestionIndex: item.result.lastVisitedQuestionIndex,
              selectedOptions: item.result.selectedOptions,
            },
          }));
        }
      });
    }

    if (typeof run === "function") {
      run();
    }

  } catch (err) {
    console.error("Error fetching package content:", err);
  }
};

// Make sure to call fetchPackageContent when component mounts and when user changes
useEffect(() => {
  fetchPackageContent();
}, [id, user?._id]);  // Add dependencies here
  useEffect(() => {
fetchPackageContent()

  if (id && user?._id) {
    fetchPackageContent();
  }

}, [id, user?._id]); // re-run on route change or new user
useEffect(() => {
  console.log("ResultData updated:", resultData);
  // You can add other logic here to respond to resultData changes
}, [JSON.stringify(resultData)]);

// useEffect(() => {
//   const handleVisibilityChange = async () => {
//     if (document.visibilityState === "visible") {
//       console.log("User returned to tab");
//       if (user?._id && id) {
//         try {
//           let shouldReload = false;

//           const res = await Api.get(`packages/package-content/${id}`);
//           const freshPackageData = res.data.data[0];

//           console.log("Package Content:", res.data);
//           console.log("wednesday", freshPackageData);

//           setData(freshPackageData);
//           setFaqs(freshPackageData.faqs);

//           if (freshPackageData?.exams?.length > 0) {
//             for (const test of freshPackageData.exams) {
//               const resultRes = await Api.get(`/results/${user._id}/${test._id}`);
//               const result = resultRes.data;

//               if (result?.status === "completed" || result?.status === "paused") {
//                 shouldReload = true;
//                 setResultData((prev) => ({
//                   ...prev,
//                   [test._id]: {
//                     ...result,
//                     lastQuestionIndex: result.lastVisitedQuestionIndex,
//                     selectedOptions: result.selectedOptions,
//                   },
//                 }));
//               }
//             }
//           }

//           if (shouldReload) {
//             window.location.reload();
//           }
//         } catch (err) {
//           console.error("Error fetching result for tests:", err);
//         }
//       }
//     }
//   };

//   document.addEventListener("visibilitychange", handleVisibilityChange);
//   return () => {
//     document.removeEventListener("visibilitychange", handleVisibilityChange);
//   };
// }, [user?._id, id]);


  // Fetch test result
  // Api.get(`/results/65a12345b6c78d901e23f456/67d1af373fb78ae2c1ff2d77`)

  async function run() {
    const response2 = await Api.get(`/get-Specific-page/${id}`);
    setSeo(response2.data);
    // console.log(response2.data);

    const response3 = await Api.get(`/blog-Ad/getbypage/${id}`);
    setAD(response3.data);
    // console.log(response3.data);
  }

  // console.log(faqs);
  // Sidebar button handlers
  const handlePrelimsClick = () => {
    setActiveSection("prelims");
    resetTimer();
  };
  const handleMainsClick = () => {
    setActiveSection("mains");
    resetTimer();
  };
  const handleUpdatesClick = () => setActiveSection("PYQ");

  // Reset Timer when switching sections
  const resetTimer = () => {
    setTimer(600);
    setIsTimerRunning(false);
  };

  // Timer Effect
  useEffect(() => {
    if (!isTimerRunning || timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0)); // Prevent negative timer
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, isTimerRunning]);

  // console.log(data);

  // Show difficulty level for the specific test
  const handleShowLevelClick = (testId) => {
    setShowDifficulty((prevState) => ({
      ...prevState,
      [testId]: true, // Mark the test's difficulty as shown
    }));
  };

  const openNewWindow = (url) => {
    const width = screen.width;
    const height = screen.height;
    window.open(
      url,
      "_blank",
      `noopener,noreferrer,width=${width},height=${height}`
    );
  };

  // Store FAQ data
  const [activeIndex, setActiveIndex] = useState(null); // Track active index for opening and closing


  const handleAccordionToggle = (index) => {
    // Toggle the active index (open/close the panel)
    if (activeIndex === index) {
      setActiveIndex(null); // Close the panel if it's already open
    } else {
      setActiveIndex(index); // Open the panel if it's not open
    }
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  // console.log(data);
  // console.log(seo);

  useEffect(() => {
    AOS.init({
      duration: 2000,
    });
    AOS.refresh();
  }, []);
  // console.log(data);
  const [isEnrolled, setIsEnrolled] = useState(false);
        const [expiredate, setExpirydate] = useState();
  
  const status = true;

  const [utcNow, setUtcNow] = useState(null);
  
// 1. Fetch UTC time from server
 useEffect(() => {
    fetchUtcNow()
      .then(globalDate => {
        setUtcNow(globalDate);
        console.warn("Server UTC Date:", globalDate.toISOString());
      })
      .catch(error => {
        console.error("Failed to fetch UTC time:", error);
        // handle error as needed
      });
  }, [utcNow]);


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
      setExpirydate(daysLeft); // Set days left
      return true;
    }

    return false;
  };

  const enrolledFromCourses = user?.enrolledCourses?.some(checkExpiry);
  const enrolledFromSubscriptions = user?.subscriptions?.some(checkExpiry);

  setIsEnrolled(enrolledFromCourses || enrolledFromSubscriptions);
}, [user, data, utcNow,isEnrolled,expiredate]);

  console.log("check", user?.enrolledCourses);

  // if (isEnrolled) {
  //   console.log("Hii");
  // } else if (status) {
  //   console.log("bye");
  // }

  //  const loadRazorpayScript = () => {
  //     return new Promise((resolve) => {
  //       const script = document.createElement("script");
  //       script.src = "https://checkout.razorpay.com/v1/checkout.js";
  //       console.log(script.src);
  //       script.onload = () => {
  //         resolve(true);
  //       };
  //       script.onerror = () => {
  //         resolve(false);
  //       };
  //       document.body.appendChild(script);
  //     });
  //   };

  //   const paymentmeth = async (discountedAmount) => {
  //     console.log("Join Payment");
  //     try {
  //       console.log("Join Payment Inner");
  //       const res = await Api.post("/orders/orders", {
  //         amount: discountedAmount * 100,
  //         currency: "INR",
  //         receipt: `${user?.email}`,
  //       payment_capture: 1
  //       });
  //       console.log("data show that ", res.data);
  //       console.log("Order response:", res.data);

  //       // Load Razorpay script
  //       const scriptLoaded = await loadRazorpayScript();
  //       if (!scriptLoaded) {
  //         alert(
  //           "Failed to load Razorpay SDK. Please check your internet connection."
  //         );
  //         return;
  //       }
  //       const options = {
  //         key: import.meta.env.VITE_RAZORPAY_KEY_ID,
  //         amount: discountedAmount * 100,
  //         currency: "INR",
  //         name: data?.name,
  //         description: "Test Payment",
  //         handler: function (response) {
  //           setResponseId(response.razorpay_payment_id);
  //         },
  //         prefill: {
  //           name: user?.firstName,
  //           email: user?.email,
  //         },
  //         theme: {
  //           color: "#F4C430",
  //         },
  //         notes: {
  //           user_id: user?._id,
  //           course_id: data?._id,
  //           courseName: data?.categorys,
  //         },
  //       };
  // console.log("ji".options)
  //       const paymentObject = new window.Razorpay(options);
  //       paymentObject.open();
  //       const rzp = new window.Razorpay(options);
  //       rzp.open();

  //       rzp.on("payment.failed", function (response) {
  //         console.error("Payment failed", response.error);
  //         alert("Payment failed. Please try again.");
  //       });
  //       console.log("ji".options)
  //     } catch (error) {
  //       console.error("Error during payment:", error);
  //       alert(error.message);
  //     }
  //   };

  const isPaidTest = (test) => {
    return test?.result_type?.toLowerCase() === "paid";
  };
useEffect(() => {
  window.addEventListener("focus", fetchPackageContent);
  return () => {
    window.removeEventListener("focus", fetchPackageContent);
  };
}, []);
// In the component where you take the test (mocktest/instruction pages)
useEffect(() => {
  return () => {
    // This will run when component unmounts (when you navigate back)
    if (window.opener) {
      window.opener.postMessage('refresh-needed', '*');
    }
  };
}, []);

  // Utility functions for localStorage
const getTestStatusFromStorage = (testId) => {
  const storedResults = localStorage.getItem('testResults');
  if (!storedResults) return null;
  
  try {
    const results = JSON.parse(storedResults);
    return results[testId] || null;
  } catch (error) {
    console.error('Error parsing stored test results:', error);
    return null;
  }
};

const storeTestStatus = (testId, status, lastQuestionIndex = null, selectedOptions = null) => {
  const storedResults = localStorage.getItem('testResults') || '{}';
  
  try {
    const results = JSON.parse(storedResults);
    results[testId] = {
      status,
      lastQuestionIndex,
      selectedOptions,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('testResults', JSON.stringify(results));
  } catch (error) {
    console.error('Error storing test result:', error);
  }
};

useEffect(() => {
  if (user?._id) {
    data?.exams?.forEach((test) => {
      // First try to get from API
      Api.get(`/results/${user?._id}/${test._id}`)
        .then((res) => {
          if (res.data?.status === "completed" || res.data?.status === "paused") {
            setResultData((prev) => ({
              ...prev,
              [test._id]: {
                ...res.data,
                lastQuestionIndex: res.data.lastVisitedQuestionIndex,
                selectedOptions: res.data.selectedOptions,
              },
            }));
            // Also store in localStorage
            storeTestStatus(
              test._id,
              res.data.status,
              res.data.lastVisitedQuestionIndex,
              res.data.selectedOptions
            );
          }
        })
        .catch((err) => {
          console.error("Error fetching result:", err);
          // If API fails, check localStorage
          const storedStatus = getTestStatusFromStorage(test._id);
          if (storedStatus) {
            setResultData((prev) => ({
              ...prev,
              [test._id]: {
                status: storedStatus.status,
                lastVisitedQuestionIndex: storedStatus.lastQuestionIndex,
                selectedOptions: storedStatus.selectedOptions,
              },
            }));
          }
        });
    });
  }
}, [data?.exams, user?._id]);


// And in your main component add this effect:
useEffect(() => {
  const handleMessage = (event) => {
    if (event.data === 'refresh-needed') {
      forceRefresh();
    }
  };

  window.addEventListener('message', handleMessage);
  return () => window.removeEventListener('message', handleMessage);
}, []);


  return (
    <>
      {loading ? (
        <div className="container mt-1 bg-gray-100 p-3 rounded-lg">
          <div className="row">
            <div className="col-md-9">
              <p className="placeholder-glow">
                <span className="placeholder col-12 mb-2 p-5 rounded-md"></span>
                <span className="placeholder col-12 mb-2 rounded-md"></span>
                <span className="placeholder col-12 mb-2 rounded-md"></span>
                <span className="placeholder col-12 mb-2 rounded-md"></span>
                <span className="placeholder col-12 mb-2 rounded-md"></span>
                <span className="placeholder col-12 mb-2 rounded-md"></span>
                <span className="placeholder col-12 mb-2 rounded-md"></span>
                <span className="placeholder col-12 mb-2 rounded-md"></span>
                <span className="placeholder col-12 mb-2 rounded-md"></span>
              </p>
            </div>
            <div className="col-md-3">
              <div className="relative flex flex-col p-4 w-full bg-gray-200 rounded-xl">
                <p className="placeholder-glow">
                  <span className="placeholder col-12 mb-2 rounded-md"></span>
                  <span className="placeholder col-12 mb-2 rounded-md"></span>
                  <span className="placeholder col-12 mb-2 rounded-md"></span>
                  <span className="placeholder col-12 mb-2 rounded-md"></span>
                  <span className="placeholder col-12 mb-2 rounded-md"></span>
                  <span className="placeholder col-12 mb-2 rounded-md"></span>
                  <span className="placeholder col-12 mb-2 rounded-md"></span>
                  <span className="placeholder col-12 mb-2 rounded-md"></span>
                  <span className="placeholder col-6 mx-auto rounded-md"></span>
                </p>
              </div>
            </div>
          </div>
          <div className="row p-3 bg-gray-100 rounded-lg mt-2">
            <div className="col-md-4">
              <div className="placeholder-glow">
                <span className="placeholder col-12 bg-gray-400 rounded-md p-3 font-bold"></span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="placeholder-glow">
                <span className="placeholder col-12 bg-gray-400 rounded-md p-3 font-bold"></span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="placeholder-glow">
                <span className="placeholder col-12 bg-gray-400 rounded-md p-3 font-bold"></span>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="row">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="col-md-3 mb-3">
                  <div className="card shadow-md border-0 rounded-3 bg-gray-100">
                    <div className="card-body text-center">
                      <p className="placeholder-glow">
                        <span className="placeholder col-8 mb-2 rounded-md"></span>
                        <span className="placeholder col-6 mb-2 rounded-md"></span>
                        <span className="placeholder col-6 mb-2 rounded-md"></span>
                        <span className="placeholder col-6 mb-2 rounded-md"></span>
                        <span className="placeholder col-12 rounded-md"></span>
                      </p>
                      <div className="placeholder-glow mt-3">
                        <span className="placeholder col-6 mx-auto rounded-md p-2"></span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="my-2">
            {[1, 2, 3].map((index) => (
              <div key={index}>
                <ul className="list-none">
                  <li>
                    <p className="placeholder-glow">
                      <span className="placeholder col-6 bg-gray-200 rounded-md"></span>
                    </p>
                  </li>
                  <li>
                    <p className="placeholder-glow">
                      <span className="placeholder col-12 bg-gray-200 rounded-md"></span>
                    </p>
                  </li>
                </ul>
              </div>
            ))}
          </div>
          <h1 className="text-center fw-bold text-gray-500 h4 font my-2">
            <p className="placeholder-glow">
              <span className="placeholder col-6 mx-auto bg-gray-200 rounded-md"></span>
            </p>
          </h1>
          <div className="space-y-4">
            {[1, 2, 3].map((index) => (
              <div key={index} className="border-b border-gray-200">
                <p className="placeholder-glow">
                  <span className="placeholder col-12 mb-2 rounded-md"></span>
                  <span className="placeholder col-10 rounded-md"></span>
                </p>
              </div>
            ))}
          </div>

          <div className="my-2">
            {[1, 2, 3].map((index) => (
              <div key={index}>
                <ul className="list-none">
                  <li>
                    <p className="placeholder-glow">
                      <span className="placeholder col-6 bg-gray-200 rounded-md"></span>
                    </p>
                  </li>
                  <li>
                    <p className="placeholder-glow">
                      <span className="placeholder col-12 bg-gray-200 rounded-md"></span>
                    </p>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="container mt-2">
          <Helmet>
            {/* { seo.length > 0 && seo.map((seo)=>(
                        <> */}
            <title>{seo[0]?.seoData?.title}</title>
            <meta name="description" content={seo[0]?.seoData?.description} />
            <meta name="keywords" content={seo[0]?.seoData?.keywords} />
            <meta property="og:title" content={seo[0]?.seoData?.ogTitle} />
            <meta
              property="og:description"
              content={seo[0]?.seoData?.ogDescription}
            />
            <meta property="og:url" content={seo[0]?.seoData?.ogImageUrl} />
            {/* </>
                    ))} */}
          </Helmet>
          <div className="flex flex-col md:flex-row">
            <div className="container w-full md:w-4/5">
              <div className="row">
                <div>
                  <h1
                    className="leading-8 font h5"
                    dangerouslySetInnerHTML={{ __html: data.description }}
                  />
                </div>
              </div>

              <div className="row p-3 bg-light">
                {/* <div className="col-md-2">
              <button
                className={`btn w-100 mb-2 text-white ${
                  activeSection === "All"
                    ? "bg-[#131656] hover:bg-[#131656]"
                    : "bg-green-500 hover:bg-green-600"
                }`}
                onClick={() => setActiveSection("All")}
                // disabled={activeSection && activeSection !== "prelims"}
                style={{ fontFamily: "helvetica, Arial, sans-serif" }}
              >
                All
              </button>
                 </div> */}
                <div className="col-md-2">
                  <button
                    className={`btn w-100 mb-2 text-white ${
                      activeSection === "prelims"
                        ? "bg-[#131656] hover:bg-[#131656]"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                    onClick={handlePrelimsClick}
                    // disabled={activeSection && activeSection !== "prelims"}
                    style={{ fontFamily: "helvetica, Arial, sans-serif" }}
                  >
                    Prelims
                  </button>
                </div>
                <div className="col-md-2">
                  <button
                    className={`btn w-100 mb-2 text-white ${
                      activeSection === "mains"
                        ? "bg-[#131656] hover:bg-[#131656]"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                    onClick={handleMainsClick}
                    // disabled={activeSection && activeSection !== "mains"}
                    style={{ fontFamily: "helvetica, Arial, sans-serif" }}
                  >
                    Mains
                  </button>
                </div>
                <div className="col-md-2">
                  <button
                    className={`btn w-100 mb-2 text-white ${
                      activeSection === "PYQ"
                        ? "bg-[#131656] hover:bg-[#131656]"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                    onClick={handleUpdatesClick}
                    // disabled={activeSection && activeSection !== "PYQ"}
                    style={{ fontFamily: "helvetica, Arial, sans-serif" }}
                  >
                    PYQ
                  </button>
                </div>
              </div>

              {/* {activeSection === "All" && (
            <div className="mt-3 bg-slate-50 py-2 px-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 ">
                {data?.exams?.map((test, idx) => (
                  <div key={idx} className="">
                    <div className="card scale-95 shadow-2xl border-1 rounded-3 transform transition-all duration-300 ease-in-out border-gray-300 hover:scale-100 flex flex-col justify-between h-full w-full ">
                      <div className="card-body text-center flex flex-col justify-evenly">
                        <h5 className="card-title font-bold text-">
                          {test.exam_name}
                        </h5>
                        <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
                       
                        {!showDifficulty[test._id] ? (
                          <button
                            onClick={() => handleShowLevelClick(test._id)}
                            className="text-white text-sm py-2 px-2 rounded my-2 w-full bg-[#131656] hover:bg-[#0f1245]"
                          >
                            Show Level
                          </button>
                        ) : (
                          <div className="text-sm  my-2 px-2 py-2 rounded text-center text-white bg-[#131656]">
                            <p>
                              <strong>{test.q_level.toUpperCase()}</strong>
                            </p>
                          </div>
                        )}

                  
                        <div className="flex justify-around items-center gap-4 mt-2">
                          <div className="flex flex-col items-center">
                            <p className="font-medium">Questions</p>
                            <p className="flex items-center gap-1">
                              <BsQuestionSquare size={20} color="orange" />
                              {test.section[0].t_question}
                            </p>
                          </div>
                          <div className="flex flex-col items-center">
                            <p className="font-medium">Marks</p>
                            <p className="flex items-center gap-1">
                              {" "}
                              <ImCheckmark2 size={20} color="green" />
                              {test.section[0].t_mark}
                            </p>
                          </div>
                          <div className="flex flex-col items-center">
                            <p className="font-medium">Time</p>
                            <p className="flex items-center gap-1">
                              {" "}
                              <MdOutlineAccessTime size={20} color="red" />
                              {test.section[0].t_time}
                            </p>

      
                          </div>
                        </div>
                        <hr className="h-px mt-3 bg-gray-200 border-0 dark:bg-gray-700" />

                       
                        <button
                          className={`mt-3 py-2 px-4 rounded w-full transition ${
                            test.status === "true"
                              ? "bg-green-500 text-white hover:bg-green-600"
                              : "border-1 border-green-500 text-green-500 hover:bg-green-600 hover:text-white"
                          }`}
                          onClick={() => {
                            if (test.status === "true") {
                              navigate(`/instruction/${test._id}`);
                            } else {
                              handleTopicSelect(test.section[0], "prelims");
                            }
                          }}
                        >
                          {test.status === "true" ? (
                            "Take Test"
                          ) : (
                            <div className="flex items-center justify-center font-semibold gap-1">
                              <IoMdLock />
                              Lock
                            </div>
                          )}
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          )} */}
              {activeSection === "prelims" && (
                <div className="mt-3 bg-slate-50 py-2 px-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 ">
                    {data?.exams?.map(
                      (test, idx) =>
                        test.test_type === "Prelims" && (
                          <div key={idx} className="">
                            <div className="card scale-95 shadow-2xl border-1 rounded-3 transform transition-all duration-300 ease-in-out border-gray-300 hover:scale-100 flex flex-col justify-between h-full w-full ">
                              <div className="card-body text-center flex flex-col justify-evenly">
                                <h5 className="card-title font-bold text-">
                                  {test.exam_name}
                                </h5>
                                <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />

                                {/* Show Level Button */}
                                {!showDifficulty[test._id] ? (
                                  <button
                                    onClick={() =>
                                      handleShowLevelClick(test._id)
                                    }
                                    className="text-white py-2 px-2 rounded mt-2 w-full bg-[#131656] hover:bg-[#0f1245]"
                                  >
                                    Show Level
                                  </button>
                                ) : (
                                  <div className="mt-2 text-sm rounded px-2 py-2 text-center text-white bg-[#131656]">
                                    <p>
                                      <strong>
                                        {test.q_level.toUpperCase()}
                                      </strong>
                                    </p>
                                  </div>
                                )}

                                {/* Test Info Section */}
                                <div className="flex justify-around items-center gap-4 mt-2">
                                  <div className="flex flex-col items-center">
                                    <p className="font-medium">Quez</p>
                                    <p className="flex items-center gap-1">
                                      <BsQuestionSquare
                                        size={20}
                                        color="orange"
                                      />
                                      {test.t_questions}
                                    </p>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <p className="font-medium">Marks</p>
                                    <p className="flex items-center gap-1">
                                      {" "}
                                      <BsSpeedometer2 size={20} color="green" />
                                      {test.t_marks}
                                    </p>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <p className="font-medium">Time</p>
                                    <p className="flex items-center gap-1">
                                      {" "}
                                      <MdOutlineAccessTime
                                        size={20}
                                        color="red"
                                      />
                                      {test.duration} Min
                                    </p>
                                  </div>
                                </div>
                                <hr className="h-px mt-3 bg-gray-200 border-0 dark:bg-gray-700" />

                                {/* Check if the current date is greater than or equal to live_date */}

                        {(!isEnrolled && (isPaidTest(test) || (utcNow && new Date(test.live_date) > utcNow))) || 
(isEnrolled && expiredate !== undefined && expiredate < 0) ? (
  // 🔒 Locked if:
  // - Not enrolled AND (test is paid OR not live), OR
  // - Enrolled BUT course is expired
  <button
    className="mt-3 py-2 px-4 rounded w-full border-2 border-green-600 text-green-600 cursor-not-allowed"
    disabled
  >
    <div className="flex items-center justify-center font-semibold gap-1">
      <IoMdLock />
      Locked
    </div>
  </button>
) : !utcNow || (isEnrolled && expiredate === undefined) ? (
  // ⏳ Loading state while checking enrollment/expiry
  <button
    className="mt-3 py-2 px-4 rounded w-full bg-gray-300 text-gray-600 cursor-not-allowed"
    disabled
  >
    Loading...
  </button>
) : isEnrolled && new Date(test.live_date) > utcNow ? (
  // 🚧 Coming Soon: Enrolled, but test not yet live
  <div className={`mt-3 fw-bold py-2 px-6 rounded-md text-center transition-all duration-200 
    ${
      test.show_date 
        ? 'border-1 text-green-500 border-red-700 py-0 px-0 text-wrap cursor-not-allowed' 
        : 'text-red-400 border-2 border-gray-200 cursor-not-allowed'
    }
    shadow-md hover:shadow-lg`}>
    {test.show_date
      ? `Available from ${new Date(test.live_date).toLocaleString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        })}`
      : 'Coming Soon'}
  </div>
) : (
  // ✅ Actionable: Enrolled and test is live
  <button
    className={`mt-3 py-2 px-4 rounded w-full transition ${
      (resultData?.[test._id]?.status === "completed" || 
       getTestStatusFromStorage(test._id)?.status === "completed")
        ? "bg-green-500 text-white hover:bg-green-600"
        : (resultData?.[test._id]?.status === "paused" || 
           getTestStatusFromStorage(test._id)?.status === "paused")
        ? "bg-green-500 text-white hover:bg-green-600"
        : "bg-green-500 text-white hover:bg-green-600"
    }`}
    onClick={() => {
      if (!isSignedIn) {
        const backdrop = document.querySelector(".modal-backdrop");
        if (backdrop) backdrop.remove();
        navigate("/sign-in");
        return;
      }

      const status = resultData?.[test._id]?.status || 
                    getTestStatusFromStorage(test._id)?.status;

      if (status === "completed") {
        openNewWindow(`/result/${test._id}/${user?._id}`);
      } else if (status === "paused") {
        openNewWindow(`/mocktest/${test._id}/${user?._id}`);
      } else {
        openNewWindow(`/instruction/${test._id}/${user?._id}`);
      }
    }}
  >
    {resultData === undefined && getTestStatusFromStorage(test._id) === undefined ? (
      "Loading..." // Show loading while checking test status
    ) : (resultData?.[test._id]?.status === "completed" || 
        getTestStatusFromStorage(test._id)?.status === "completed")
      ? "View Result"
      : (resultData?.[test._id]?.status === "paused" || 
         getTestStatusFromStorage(test._id)?.status === "paused")
      ? "Resume"
      : "Take Test"}
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

              {/* Mains Topics - Bootstrap Cards */}
              {activeSection === "mains" && (
                <div className="mt-3 bg-slate-50 py-2 px-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 ">
                    {data?.exams?.map(
                      (test, idx) =>
                        test.test_type === "Mains" && (
                          <div key={idx} className="">
                            <div className="card scale-95 shadow-2xl border-1 rounded-3 transform transition-all duration-300 ease-in-out border-gray-300 hover:scale-100 flex flex-col justify-between h-full w-full ">
                              <div className="card-body text-center flex flex-col justify-evenly">
                                <h5 className="card-title font-bold text-">
                                  {test.exam_name}
                                </h5>
                                <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
                                {/* Show Level Button */}
                                {!showDifficulty[test._id] ? (
                                  <button
                                    onClick={() =>
                                      handleShowLevelClick(test._id)
                                    }
                                    className="text-white py-2 px-2 rounded mt-2 w-full bg-[#131656] hover:bg-[#0f1245]"
                                  >
                                    Show Level
                                  </button>
                                ) : (
                                  <div className="mt-2 rounded text-sm px-2 py-2 text-center text-white bg-[#131656]">
                                    <p>
                                      <strong>
                                        {test.q_level.toUpperCase()}
                                      </strong>
                                    </p>
                                  </div>
                                )}

                                {/* Test Info Section */}
                                <div className="flex justify-around items-center gap-4 mt-2">
                                  <div className="flex flex-col items-center">
                                    <p className="font-medium">Quez</p>
                                    <p className="flex items-center gap-1">
                                      <BsQuestionSquare
                                        size={20}
                                        color="orange"
                                      />
                                      {test.t_questions}
                                    </p>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <p className="font-medium">Marks</p>
                                    <p className="flex items-center gap-1">
                                      {" "}
                                      <BsSpeedometer2 size={20} color="green" />
                                      {test.t_marks}
                                    </p>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <p className="font-medium">Time</p>
                                    <p className="flex items-center gap-1">
                                      {" "}
                                      <MdOutlineAccessTime
                                        size={20}
                                        color="red"
                                      />
                                      {test.duration} Min
                                    </p>
                                  </div>
                                </div>
                                <hr className="h-px mt-4 bg-gray-200 border-0 dark:bg-gray-700" />
                                {/* Check if the current date is greater than or equal to live_date */}

                                    {(!isEnrolled && (isPaidTest(test) || (utcNow && new Date(test.live_date) > utcNow))) || 
(isEnrolled && expiredate !== undefined && expiredate < 0) ? (
  // 🔒 Locked if:
  // - Not enrolled AND (test is paid OR not live), OR
  // - Enrolled BUT course is expired
  <button
    className="mt-3 py-2 px-4 rounded w-full border-2 border-green-600 text-green-600 cursor-not-allowed"
    disabled
  >
    <div className="flex items-center justify-center font-semibold gap-1">
      <IoMdLock />
      Locked
    </div>
  </button>
) : !utcNow || (isEnrolled && expiredate === undefined) ? (
  // ⏳ Loading state while checking enrollment/expiry
  <button
    className="mt-3 py-2 px-4 rounded w-full bg-gray-300 text-gray-600 cursor-not-allowed"
    disabled
  >
    Loading...
  </button>
) : isEnrolled && new Date(test.live_date) > utcNow ? (
  // 🚧 Coming Soon: Enrolled, but test not yet live
  <div className={`mt-3 fw-bold py-2 px-6 rounded-md text-center transition-all duration-200 
    ${
      test.show_date 
        ? 'border-1 text-green-500 border-red-700 py-0 px-0 text-wrap cursor-not-allowed' 
        : 'text-red-400 border-2 border-gray-200 cursor-not-allowed'
    }
    shadow-md hover:shadow-lg`}>
    {test.show_date
      ? `Available from ${new Date(test.live_date).toLocaleString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        })}`
      : 'Coming Soon'}
  </div>
) : (
  // ✅ Actionable: Enrolled and test is live
  <button
    className={`mt-3 py-2 px-4 rounded w-full transition ${
      (resultData?.[test._id]?.status === "completed" || 
       getTestStatusFromStorage(test._id)?.status === "completed")
        ? "bg-green-500 text-white hover:bg-green-600"
        : (resultData?.[test._id]?.status === "paused" || 
           getTestStatusFromStorage(test._id)?.status === "paused")
        ? "bg-green-500 text-white hover:bg-green-600"
        : "bg-green-500 text-white hover:bg-green-600"
    }`}
    onClick={() => {
      if (!isSignedIn) {
        const backdrop = document.querySelector(".modal-backdrop");
        if (backdrop) backdrop.remove();
        navigate("/sign-in");
        return;
      }

      const status = resultData?.[test._id]?.status || 
                    getTestStatusFromStorage(test._id)?.status;

      if (status === "completed") {
        openNewWindow(`/result/${test._id}/${user?._id}`);
      } else if (status === "paused") {
        openNewWindow(`/mocktest/${test._id}/${user?._id}`);
      } else {
        openNewWindow(`/instruction/${test._id}/${user?._id}`);
      }
    }}
  >
    {resultData === undefined && getTestStatusFromStorage(test._id) === undefined ? (
      "Loading..." // Show loading while checking test status
    ) : (resultData?.[test._id]?.status === "completed" || 
        getTestStatusFromStorage(test._id)?.status === "completed")
      ? "View Result"
      : (resultData?.[test._id]?.status === "paused" || 
         getTestStatusFromStorage(test._id)?.status === "paused")
      ? "Resume"
      : "Take Test"}
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

              {/* Previous Year Question Paper */}
              {activeSection === "PYQ" && (
                <div className="mt-3 bg-slate-50 py-2 px-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 ">
                    {data?.exams?.map(
                      (test, idx) =>
                        test.test_type === "PYQ" && (
                          <div key={idx} className="">
                            <div className="card scale-95 shadow-2xl border-1 rounded-3 transform transition-all duration-300 ease-in-out border-gray-300 hover:scale-100 flex flex-col justify-between h-full w-full ">
                              <div className="card-body text-center flex flex-col justify-evenly">
                                <h5 className="card-title font-bold text-">
                                  {test.exam_name}
                                </h5>
                                <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
                                {/* Show Level Button */}
                                {!showDifficulty[test._id] ? (
                                  <button
                                    onClick={() =>
                                      handleShowLevelClick(test._id)
                                    }
                                    className="text-white py-2 px-2 rounded mt-2 w-full bg-[#131656] hover:bg-[#0f1245]"
                                  >
                                    Show Level
                                  </button>
                                ) : (
                                  <div className="mt-2 rounded text-sm px-2 py-2 text-center text-white bg-[#131656]">
                                    <p>
                                      <strong>
                                        {test.q_level.toUpperCase()}
                                      </strong>
                                    </p>
                                  </div>
                                )}

                                {/* Test Info Section */}
                                <div className="flex justify-around items-center gap-4 mt-2">
                                  <div className="flex flex-col items-center">
                                    <p className="font-medium">Quez</p>
                                    <p className="flex items-center gap-1">
                                      <BsQuestionSquare
                                        size={20}
                                        color="orange"
                                      />
                                      {test.t_questions}
                                    </p>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <p className="font-medium">Marks</p>
                                    <p className="flex items-center gap-1">
                                      {" "}
                                      <BsSpeedometer2 size={20} color="green" />
                                      {test.t_marks}
                                    </p>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <p className="font-medium">Time</p>
                                    <p className="flex items-center gap-1">
                                      {" "}
                                      <MdOutlineAccessTime
                                        size={20}
                                        color="red"
                                      />
                                      {test.duration} Min
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr className="h-px mt-4 bg-gray-200 border-0 dark:bg-gray-700" />
                            {/* Check if the current date is greater than or equal to live_date */}

                                 {(!isEnrolled && (isPaidTest(test) || (utcNow && new Date(test.live_date) > utcNow))) || 
(isEnrolled && expiredate !== undefined && expiredate < 0) ? (
  // 🔒 Locked if:
  // - Not enrolled AND (test is paid OR not live), OR
  // - Enrolled BUT course is expired
  <button
    className="mt-3 py-2 px-4 rounded w-full border-2 border-green-600 text-green-600 cursor-not-allowed"
    disabled
  >
    <div className="flex items-center justify-center font-semibold gap-1">
      <IoMdLock />
      Locked
    </div>
  </button>
) : !utcNow || (isEnrolled && expiredate === undefined) ? (
  // ⏳ Loading state while checking enrollment/expiry
  <button
    className="mt-3 py-2 px-4 rounded w-full bg-gray-300 text-gray-600 cursor-not-allowed"
    disabled
  >
    Loading...
  </button>
) : isEnrolled && new Date(test.live_date) > utcNow ? (
  // 🚧 Coming Soon: Enrolled, but test not yet live
  <div className={`mt-3 fw-bold py-2 px-6 rounded-md text-center transition-all duration-200 
    ${
      test.show_date 
        ? 'border-1 text-green-500 border-red-700 py-0 px-0 text-wrap cursor-not-allowed' 
        : 'text-red-400 border-2 border-gray-200 cursor-not-allowed'
    }
    shadow-md hover:shadow-lg`}>
    {test.show_date
      ? `Available from ${new Date(test.live_date).toLocaleString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        })}`
      : 'Coming Soon'}
  </div>
) : (
  // ✅ Actionable: Enrolled and test is live
  <button
    className={`mt-3 py-2 px-4 rounded w-full transition ${
      (resultData?.[test._id]?.status === "completed" || 
       getTestStatusFromStorage(test._id)?.status === "completed")
        ? "bg-green-500 text-white hover:bg-green-600"
        : (resultData?.[test._id]?.status === "paused" || 
           getTestStatusFromStorage(test._id)?.status === "paused")
        ? "bg-green-500 text-white hover:bg-green-600"
        : "bg-green-500 text-white hover:bg-green-600"
    }`}
    onClick={() => {
      if (!isSignedIn) {
        const backdrop = document.querySelector(".modal-backdrop");
        if (backdrop) backdrop.remove();
        navigate("/sign-in");
        return;
      }

      const status = resultData?.[test._id]?.status || 
                    getTestStatusFromStorage(test._id)?.status;

      if (status === "completed") {
        openNewWindow(`/result/${test._id}/${user?._id}`);
      } else if (status === "paused") {
        openNewWindow(`/mocktest/${test._id}/${user?._id}`);
      } else {
        openNewWindow(`/instruction/${test._id}/${user?._id}`);
      }
    }}
  >
    {resultData === undefined && getTestStatusFromStorage(test._id) === undefined ? (
      "Loading..." // Show loading while checking test status
    ) : (resultData?.[test._id]?.status === "completed" || 
        getTestStatusFromStorage(test._id)?.status === "completed")
      ? "View Result"
      : (resultData?.[test._id]?.status === "paused" || 
         getTestStatusFromStorage(test._id)?.status === "paused")
      ? "Resume"
      : "Take Test"}
  </button>
)}
                          </div>
                        )
                    )}
                  </div>
                </div>
              )}

              <div className="my-2">
                {subTitles.map((subTitle) => (
                  <div key={subTitle._id} className="my-3 space-y-2">
                    <ul className="list-none">
                      <li>
                        {/* <h3 className="fw-bold font">{subTitle.title}</h3> */}
                        <div
                          dangerouslySetInnerHTML={{
                            __html: subTitle.title,
                          }}
                          className="ml-3 leading-8 text-base"
                        ></div>
                      </li>
                      <li>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: subTitle.description,
                          }}
                          className=" ml-3 leading-8 text-base"
                        ></div>
                      </li>
                    </ul>
                  </div>
                ))}
              </div>

              <h1 className="text-center fw-bold text-green-800 h4 font py-4 bg-green-200 my-4 rounded-sm">
                Frequently Asked Question
              </h1>

              <div className="space-y-4 mb-4">
                {faqs.length > 0 ? (
                  faqs.map((faq, index) => (
                    <div
                      key={faq.id}
                      className="border rounded-lg overflow-hidden shadow-sm "
                    >
                      <button
                        className={`flex items-center justify-between w-full p-4 text-left transition-colors duration-200 ${
                          activeIndex === index
                            ? "bg-green-100 text-green-700"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => handleAccordionToggle(index)}
                      >
                        <span
                          className="font-medium flex items-center "
                          dangerouslySetInnerHTML={{ __html: faq.question }}
                        />
                        <span className="text-lg">
                          {activeIndex === index ? (
                            <FaChevronUp />
                          ) : (
                            <FaChevronDown />
                          )}
                        </span>
                      </button>
                      <div
                        className={`transition-max-h duration-300 ease-in-out overflow-hidden ${
                          activeIndex === index ? "max-h-96 p-4" : "max-h-0 p-0"
                        }`}
                      >
                        <p
                          className="text-gray-600"
                          dangerouslySetInnerHTML={{ __html: faq.answer }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-400">
                    Loading FAQs...
                  </div>
                )}
              </div>
            </div>

            {/* advertiswment part */}
            <div className="w-fill md:w-1/5 m-1">
              <div>
              

    <div className="relative flex flex-col w-full bg-cover rounded-xl shadow-md border-2">
                <div className="absolute inset-0 z-[-10] border-2 rounded-xl "></div>
  <div className="bg-white border-2 border-green-100 p-6 rounded-2xl hover:scale-[1.02] hover:shadow-lg transition-all duration-300 flex flex-col overflow-y-auto">

               <div className="mb-4">
      <h2 className="text-xl font-bold text-gray-800 mb-2 text-center" >Features</h2>
      <div className="w-120 mt-1 h-1 bg-green-500 rounded-full"></div>
    </div>
    
              
<div className="flex-grow space-y-1 mb-2 overflow-y-auto h-[200px]" style={{ 
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
}}>  
  <style jsx>{`
    div::-webkit-scrollbar {
      display: none;
    }
  `}</style>
 {data?.feature?.map((item, index) => (
  <div key={index} className="flex items-start gap-3">
    <div className="mt-1 text-green-500">
      <i className="bi bi-check-circle-fill"></i>
    </div>
    <p className="text-gray-700">{item}</p>
  </div>
))}

</div>
               
                {/* <img src={data.featurePhoto} alt="" /> */}
                      <div className="mt-auto text-center bg-green-50 rounded-xl p-2 border border-blue-100">
      <div className="mb-2">
        <del className="text-gray-500 font-medium">       Rs.{data.amount}</del>
        <p className="ml-2 bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">
         You Save Money: Rs. {data.amount - data.discountedAmount}
        </p>
      </div>
      
      
      <button
        
         className={`px-3 py-1 font-bold rounded-full ${
    isEnrolled 
      ? "bg-[#000080] text-white cursor-not-allowed" // disabled style
      : "bg-green-500 text-gray-50 hover:bg-green-400"
  }`}
  onClick={() => {
    if (!isSignedIn) {
      navigate('/sign-in');
    } else if (isEnrolled) {
      // Do nothing or show a message if needed, since already purchased
      console.log("Already enrolled");
    } else {
      setshowmodel(true);
    }
  }}
     
      >
      
       {expiredate
                        ? isEnrolled
                          ? "Purchased"
                          : `Rs.${data.discountedAmount}`
                        : `Rs.${data.discountedAmount}`}
                    </button>

                    {expiredate ? (
                      <p className="text-md text-red-500 mt-2 font blink">
                        <i className="bi bi-clock-history"></i> {expiredate} -
                        Days Left
                      </p>
                    ) : (
                      <p className="text-md text-gray-500 mt-2 font">
                        <i className="bi bi-clock-history"></i> Limited Time
                        offer
                      </p>
                    )}
    </div>
      </div>
              </div>
                  {showmodel && (
                    <Coupon data={data} setshowmodel={setshowmodel} />
                  )}
              

                
                {ad.length > 0 &&
                  ad.map((item, index) => (
                    <div
                      key={index}
                      className="m-4 hover:scale-105 hover:shadow-lg transition-transform duration-300"
                    >
                      <Link to={item.link_name}>
                        <img
                          src={item.photo}
                          alt="Not Found"
                          className="rounded-md"
                        />
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Packagename;
