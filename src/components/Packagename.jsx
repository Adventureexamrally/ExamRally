import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Api from "../service/Api";
import AOS from "aos";
import "aos/dist/aos.css";
// import { CiCircleQuestion } from "react-icons/ci";
import { ImCheckmark2 } from "react-icons/im";
import { MdOutlineAccessTime } from "react-icons/md";
import { BsQuestionSquare } from "react-icons/bs";
import { IoMdLock } from "react-icons/io";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

const Packagename = () => {
  const [data, setData] = useState({});
  const [faqs, setFaqs] = useState([]);
  const { id } = useParams();

  const navigate = useNavigate();
  // Extracting the package content and exams information
  // const packageContent = data?.package_content?.[0] || {}; // Assuming there is only one item in package_content array
  const exams = data?.exams || {};
  console.log("VAR", exams);
  // Assuming there is only one exam object
  const subTitles = data?.sub_titles || [];

  // console.log(subTitles);

  const [activeSection, setActiveSection] = useState("prelims"); // Tracks active section (Prelims/Mains/Previous Year Questions)
  const [selectedTopic, setSelectedTopic] = useState(null); // Selected topic
  const [modalQuestions, setModalQuestions] = useState([]); // Stores questions for modal
  const [timer, setTimer] = useState(600); // Timer (10 min)
  const [isTimerRunning, setIsTimerRunning] = useState(false); // Timer control
  const [modalType, setModalType] = useState(""); // Tracks Prelims or Mains modal
  const [showDifficulty, setShowDifficulty] = useState({}); // State to manage difficulty visibility

  // Handle topic selection & set modal questions
  const handleTopicSelect = (section, testType) => {
    setSelectedTopic(section.name);
    setModalType(testType);
    setModalQuestions(section.questions); // Set questions for the selected section
    setIsTimerRunning(true);
    setTimer(600); // Reset Timer on topic change
  };
  useEffect(() => {
    // Fetching data based on the id from the URL params
    Api.get(`packages/package-content/${id}`).then((res) => {
      console.log(res.data);
      setData(res.data.data[0]);
      setFaqs(res.data.data[0].faqs);
      console.log(res.data);
    });
  }, [id]);
  console.log(faqs);
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

  console.log(data);

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

  // useEffect(() => {
  //   // Fetching data based on the id from the URL params
  //   Api.get(`packages/package-content/${id}`)
  //     .then((res) => {
  //       console.log(res.data);
  //       // Setting the FAQ data from the response
  //       setFaqs(res.data?.package_content?.[0]?.faqs || []);
  //       console.log(res.data?.package_content?.[0]?.faqs); // Extracting and logging the FAQs
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching data:', error);
  //     });
  // }, [id]);  // Effect will run whenever 'id' changes

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

  useEffect(() => {
    AOS.init({
      duration: 2000,
    });
    AOS.refresh();
  }, []);
  console.log(data);
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
          <div className="row">
            <div className="col-md-9">
              <div>
                <h1
                  className="leading-8 font h5"
                  dangerouslySetInnerHTML={{ __html: data.description }}
                />
              </div>
            </div>

            <div className="col-md-3 mt-3">
              <div
                className="relative flex flex-col p-4 w-full bg-cover rounded-lg shadow-inner 
              hover:shadow-[0_0_15px_rgba(11,204,75,0.6)] transition duration-300"
                style={{
                  backgroundImage: `radial-gradient(at 88% 40%, rgb(11, 204, 75) 0px, transparent 85%),
                                  radial-gradient(at 49% 30%, hsla(240, 15%, 9%, 1) 0px, transparent 85%),
                                  radial-gradient(at 14% 26%, hsla(240, 15%, 9%, 1) 0px, transparent 85%),
                                  radial-gradient(at 0% 64%, rgb(11, 153, 41) 0px, transparent 85%),
                                  radial-gradient(at 41% 94%, rgb(34, 214, 109) 0px, transparent 85%),
                                  radial-gradient(at 100% 99%, rgb(10, 202, 74) 0px, transparent 85%)`,
                }}
              >
                <div className="absolute inset-0 z-[-10] border-2 border-white rounded-xl"></div>
                <div className="text-white flex justify-between">
                  <span
                    className="text-lg  mb-3 "
                    style={{ fontFamily: "helvetica, Arial, sans-serif" }}
                  >
                    Features
                  </span>
                </div>
                <hr className="border-t border-gray-600" />
                {/* <ul className="space-y-2">
                {[
                  "Exact Exam level Questions",
                  "Step by Step Explanation",
                  "Detailed Analysis",
                  "30+ Mock Test",
                  "All India Rank",
                  "New pattern and Updated Questions",
                  "Easy, Moderate and Hard Level Questions",
                ].map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 "
                    style={{ fontFamily: "helvetica, Arial, sans-serif" }}
                  >
                    <span className="flex justify-center items-center w-4 h-4 bg-green-500 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="w-3 h-3 text-white"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </span>
                    <span className="text-white text-sm">{item}</span>
                  </li>
                ))}
              </ul>  */}

                <div className="text-center">
                  <p>
                    {" "}
                    <img
                      src={data.featurePhoto}
                      alt="Image"
                      className="w-1/2 mx-auto"
                    />
                  </p>
                  <p>
                    <del
                      className="text-red-400"
                      style={{ fontFamily: "helvetica, Arial, sans-serif" }}
                    >
                      Package Price:
                    </del>
                  </p>
                  <del
                    className="bg-red-500 text-white rounded p-1 mb-2"
                    style={{ fontFamily: "helvetica, Arial, sans-serif" }}
                  >
                    Rs.{data.amount}
                  </del>
                  <p
                    className="text-white font-bold h5 "
                    style={{ fontFamily: "helvetica, Arial, sans-serif" }}
                  >
                    Discounted Price:
                  </p>
                  <button className="bg-green-500 text-white px-3 py-1 font-bold hover:bg-green-400 rounded-full">
                    Rs.{data.discountedAmount}
                  </button>
                </div>
              </div>
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

          {/* Prelims Topics - Bootstrap Cards */}
          {/* {activeSection === "prelims" && (
          <div className="mt-3">
            <div className="row">
              {data?.exams?.map(
                (test, idx) =>
                  test.test_type === "Prelims" && (
                    <div key={idx} className="col-md-3 mb-3">
                      <div className="card shadow-lg border-0 rounded-3 transform transition-all duration-300 ease-in-out border-gray-500 hover:scale-105 border-1">
                        <div className="card-body text-center">
                          <h5
                            className="card-title fw-bold"
                            style={{
                              fontFamily: "helvetica, Arial, sans-serif",
                            }}
                          >
                            {test.exam_name}
                          </h5>
                          <div className="text-center">
                            Show Level Button
                            {!showDifficulty[test._id] && (
                              <button
                                onClick={() => handleShowLevelClick(test._id)} // Show difficulty for the specific test
                                className="text-white py-2 px-2 rounded mt-2 bg-green-500 hover:bg-green-600 w-100"
                                style={{ backgroundColor: "#131656" }}
                              >
                                Show Level
                              </button>
                            )}
  
                            Display difficulty level
                            {showDifficulty[test._id] && (
                              <div
                                className="mt-4 text-sm px-2 py-2 text-center text-white"
                                style={{ backgroundColor: "#131656" }}
                              >
                                <p>
                                  <strong>{test.q_level}</strong>
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="flex justify-center items-center gap-4">
                            <div className="flex flex-col items-center">
                              <p>Questions</p>
                              <p>{test.section[0].t_question}</p>
                            </div>
                            <div className="flex flex-col items-center">
                              <p>Marks</p>
                              <p>{test.section[0].t_mark}</p>
                            </div>
                            <div className="flex flex-col items-center">
                              <p>Time</p>
                              <p>{test.section[0].t_time}</p>
                            </div>
                          </div>
  
                          <button
                            className={`mt-2 py-2 px-4 rounded ${
                              test.status === "true"
                                ? "bg-green-500 text-white hover:bg-green-600"
                                : "border-4 border-green-500 text-green-500 hover:bg-green-600 hover:text-white"
                            }`}
                            onClick={() => {
                              if (test.status === "true") {
                                navigate(`/instruction/${test._id}`); // Redirects to instruction page
                              } else {
                                handleTopicSelect(test.section[0], "prelims"); // Keeps the original function for locked state
                              }
                            }}
                          >
                            {test.status === "true" ? "Take Test" : "Lock"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
        )} */}

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
                                onClick={() => handleShowLevelClick(test._id)}
                                className="text-white py-2 px-2 rounded mt-2 w-full bg-[#131656] hover:bg-[#0f1245]"
                              >
                                Show Level
                              </button>
                            ) : (
                              <div className="mt-2 text-sm rounded px-2 py-2 text-center text-white bg-[#131656]">
                                <p>
                                  <strong>{test.q_level.toUpperCase()}</strong>
                                </p>
                              </div>
                            )}

                            {/* Test Info Section */}
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

                            {/* Take Test / Lock Button */}
                            <button
                              className={`mt-3 py-2 px-4 rounded w-full transition ${
                                test.status === "true"
                                  ? "bg-green-500 text-white hover:bg-green-600"
                                  : "border-2 border-green-500 text-green-500 hover:bg-green-600 hover:text-white"
                              }`}
                              onClick={() => {
                                if (test.status === "true") {
                                  openNewWindow (`/instruction/${test._id}`);
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
                                onClick={() => handleShowLevelClick(test._id)}
                                className="text-white py-2 px-2 rounded mt-2 w-full bg-[#131656] hover:bg-[#0f1245]"
                              >
                                Show Level
                              </button>
                            ) : (
                              <div className="mt-2 rounded text-sm px-2 py-2 text-center text-white bg-[#131656]">
                                <p>
                                  <strong>{test.q_level.toUpperCase()}</strong>
                                </p>
                              </div>
                            )}

                            {/* Test Info Section */}
                            <div className="flex justify-center items-center gap-4 mt-2">
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
                            <hr className="h-px mt-4 bg-gray-200 border-0 dark:bg-gray-700" />
                            {/* Take Test / Lock Button */}
                            <button
                              className={`mt-3 py-2 px-4 rounded w-full transition ${
                                test.status === "true"
                                  ? "bg-green-500 text-white hover:bg-green-600"
                                  : "border-1 border-green-500 text-green-500 hover:bg-green-600 hover:text-white"
                              }`}
                              onClick={() => {
                                if (test.status === "true") {
                                  openNewWindow (`/instruction/${test._id}`);
                                } else {
                                  handleTopicSelect(test.section[0], "mains");
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
                                onClick={() => handleShowLevelClick(test._id)}
                                className="text-white py-2 px-2 rounded mt-2 w-full bg-[#131656] hover:bg-[#0f1245]"
                              >
                                Show Level
                              </button>
                            ) : (
                              <div className="mt-2 rounded text-sm px-2 py-2 text-center text-white bg-[#131656]">
                                <p>
                                  <strong>{test.q_level.toUpperCase()}</strong>
                                </p>
                              </div>
                            )}

                            {/* Test Info Section */}
                            <div className="flex justify-center items-center gap-4 mt-2">
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
                            <hr className="h-px mt-4 bg-gray-200 border-0 dark:bg-gray-700" />
                            {/* Take Test / Lock Button */}
                            <button
                              className={`mt-3 py-2 px-4 rounded w-full transition ${
                                test.status === "true"
                                  ? "bg-green-500 text-white hover:bg-green-600"
                                  : "border-1 border-green-500 text-green-500 hover:bg-green-600 hover:text-white"
                              }`}
                              onClick={() => {
                                if (test.status === "true") {
                                  openNewWindow (`/instruction/${test._id}`);
                                } else {
                                  handleTopicSelect(test.section[0], "PYQ");
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
                    )
                )}
              </div>
            </div>
          )}

          <div className="my-2">
            {subTitles.map((subTitle) => (
              <div key={subTitle._id}>
                <ul className="list-none">
                  <li>
                    <h3 className="fw-bold font">{subTitle.title}</h3>
                  </li>
                  <li>
                    <div
                      dangerouslySetInnerHTML={{ __html: subTitle.description }}
                      className="font ml-3"
                    ></div>
                  </li>
                </ul>
              </div>
            ))}
          </div>

          <h1 className="text-center fw-bold text-green-800 h4 font py-4 bg-green-200 my-4 rounded-sm">
            Frequently Asked Question
          </h1>

          <div className="space-y-4">
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
      )}
    </>
  );
};

export default Packagename;
