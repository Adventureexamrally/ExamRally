import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Api from "../service/Api";
import { Helmet } from "react-helmet";

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

  const [activeSection, setActiveSection] = useState(""); // Tracks active section (Prelims/Mains/Previous Year Questions)
  const [selectedTopic, setSelectedTopic] = useState(null); // Selected topic
  const [modalQuestions, setModalQuestions] = useState([]); // Stores questions for modal
  const [timer, setTimer] = useState(600); // Timer (10 min)
  const [isTimerRunning, setIsTimerRunning] = useState(false); // Timer control
  const [modalType, setModalType] = useState(""); // Tracks Prelims or Mains modal
  const [showDifficulty, setShowDifficulty] = useState({}); // State to manage difficulty visibility
  const [seo, setSeo] = useState([])
      const [ad, setAD] = useState([])
  

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

    run()

  }, [id]);

  async function run() {
    const response2 = await Api.get(`/get-Specific-page/${id}`);
    setSeo(response2.data);
    console.log(response2.data);

    const response3 = await Api.get(`/blog-Ad/getbypage/${id}`);
    setAD(response3.data)
    console.log(response3.data);
  }

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
  console.log(data);
  console.log(seo);

  return (
    <>
      <Helmet>
        {/* { seo.length > 0 && seo.map((seo)=>(
                        <> */}
        <title>{seo[0]?.seoData?.title}</title>
        <meta name="description" content={seo[0]?.seoData?.description} />
        <meta name="keywords" content={seo[0]?.seoData?.keywords} />
        <meta property="og:title" content={seo[0]?.seoData?.ogTitle} />
        <meta property="og:description" content={seo[0]?.seoData?.ogDescription} />
        <meta property="og:url" content={seo[0]?.seoData?.ogImageUrl} />
        {/* </>
                    ))} */}

      </Helmet>
      <div className="flex flex-col md:flex-row">
        <div className='container w-full md:w-4/5'>

          <div>
            {loading ? (
              <div className="container mt-1 bg-gray-100 p-3 rounded-lg"> {/* Added light gray background and padding */}
                <div className="row">
                  <div className="col-md-9">
                    <p className="placeholder-glow">
                      <span className="placeholder col-12 bg-gray-200 rounded-md"></span> {/* Added mild gray to placeholder */}
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
                <div className="row p-3 bg-gray-100 rounded-lg mt-2"> {/* Added light gray background and rounded corners */}
                  <div className="col-md-4">
                    <p className="placeholder-glow">
                      <span className="placeholder col-12 bg-gray-200 rounded-md"></span> {/* Added mild gray to placeholder */}
                    </p>
                  </div>
                  <div className="col-md-4">
                    <p className="placeholder-glow">
                      <span className="placeholder col-12 bg-gray-200 rounded-md"></span> {/* Added mild gray to placeholder */}
                    </p>
                  </div>
                  <div className="col-md-4">
                    <p className="placeholder-glow">
                      <span className="placeholder col-12 bg-gray-200 rounded-md"></span> {/* Added mild gray to placeholder */}
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="row">
                    {[1, 2, 3, 4].map((index) => (
                      <div key={index} className="col-md-3 mb-3">
                        <div className="card shadow-md border-0 rounded-3 bg-gray-100"> {/* Added light gray background */}
                          <div className="card-body text-center">
                            <p className="placeholder-glow">
                              <span className="placeholder col-8 mb-2 rounded-md"></span>
                              <span className="placeholder col-6 mb-2 rounded-md"></span>
                              <span className="placeholder col-6 mb-2 rounded-md"></span>
                              <span className="placeholder col-6 mb-2 rounded-md"></span>
                              <span className="placeholder col-12 rounded-md"></span>
                            </p>
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
                            <span className="placeholder col-6 bg-gray-200 rounded-md"></span> {/* Added mild gray to placeholder */}
                          </p>
                        </li>
                        <li>
                          <p className="placeholder-glow">
                            <span className="placeholder col-12 bg-gray-200 rounded-md"></span> {/* Added mild gray to placeholder */}
                          </p>
                        </li>
                      </ul>
                    </div>
                  ))}
                </div>
                <h1 className="text-center fw-bold text-gray-500 h4 font my-2"> {/* Mild gray text */}
                  <p className="placeholder-glow">
                    <span className="placeholder col-6 mx-auto bg-gray-200 rounded-md"></span> {/* Added mild gray to placeholder */}
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


                </div>

                <div className="row p-3 bg-light">
                  <div className="col-md-4">

                    <button
                      className={`btn w-100 mb-2 text-white ${activeSection === "prelims" ? "bg-[#131656] hover:bg-[#131656]" : "bg-green-500 hover:bg-green-600"
                        }`}
                      onClick={handlePrelimsClick}
                      // disabled={activeSection && activeSection !== "prelims"}
                      style={{ fontFamily: "helvetica, Arial, sans-serif" }}
                    >
                      Prelims
                    </button>
                  </div>
                  <div className="col-md-4">
                    <button
                      className={`btn w-100 mb-2 text-white ${activeSection === "mains" ? "bg-[#131656] hover:bg-[#131656]" : "bg-green-500 hover:bg-green-600"
                        }`}
                      onClick={handleMainsClick}
                      // disabled={activeSection && activeSection !== "mains"}
                      style={{ fontFamily: "helvetica, Arial, sans-serif" }}
                    >
                      Mains
                    </button>
                  </div>
                  <div className="col-md-4">
                    <button
                      className={`btn w-100 mb-2 text-white ${activeSection === "PYQ" ? "bg-[#131656] hover:bg-[#131656]" : "bg-green-500 hover:bg-green-600"
                        }`}
                      onClick={handleUpdatesClick}
                      // disabled={activeSection && activeSection !== "PYQ"}
                      style={{ fontFamily: "helvetica, Arial, sans-serif" }}
                    >
                      Previous Year Question Paper
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

                {activeSection === "prelims" && (
                  <div className="mt-3">
                    <div className="row">
                      {data?.exams?.map(
                        (test, idx) =>
                          test.test_type === "Prelims" && (
                            <div key={idx} className="col-md-3 mb-3">
                              <div
                                className="card shadow-lg border-0 rounded-3 transform transition-all duration-300 ease-in-out border-gray-500 hover:scale-105 border-1 flex flex-col justify-between h-full min-h-[320px]"
                              >
                                <div className="card-body text-center flex flex-col justify-between h-full">
                                  <h5 className="card-title font-bold text-lg">
                                    {test.exam_name}
                                  </h5>

                                  {/* Show Level Button */}
                                  {!showDifficulty[test._id] ? (
                                    <button
                                      onClick={() => handleShowLevelClick(test._id)}
                                      className="text-white py-2 px-2 rounded mt-2 w-full bg-[#131656] hover:bg-[#0f1245]"
                                    >
                                      Show Level
                                    </button>
                                  ) : (
                                    <div className="mt-4 text-sm px-2 py-2 text-center text-white bg-[#131656]">
                                      <p>
                                        <strong>{test.q_level}</strong>
                                      </p>
                                    </div>
                                  )}

                                  {/* Test Info Section */}
                                  <div className="flex justify-center items-center gap-4 mt-2">
                                    <div className="flex flex-col items-center">
                                      <p className="font-medium">Questions</p>
                                      <p>{test.section[0].t_question}</p>
                                    </div>
                                    <div className="flex flex-col items-center">
                                      <p className="font-medium">Marks</p>
                                      <p>{test.section[0].t_mark}</p>
                                    </div>
                                    <div className="flex flex-col items-center">
                                      <p className="font-medium">Time</p>
                                      <p>{test.section[0].t_time}</p>
                                    </div>
                                  </div>

                                  {/* Take Test / Lock Button */}
                                  <button
                                    className={`mt-3 py-2 px-4 rounded w-full transition ${test.status === "true"
                                      ? "bg-green-500 text-white hover:bg-green-600"
                                      : "border-2 border-green-500 text-green-500 hover:bg-green-600 hover:text-white"
                                      }`}
                                    onClick={() => {
                                      if (test.status === "true") {
                                        navigate(`/instruction/${test._id}`);
                                      } else {
                                        handleTopicSelect(test.section[0], "prelims");
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
                )}


                {/* Mains Topics - Bootstrap Cards */}
                {activeSection === "mains" && (
                  <div className="mt-3">
                    <div className="row">
                      {data?.exams?.map(
                        (test, idx) =>
                          test.test_type === "Mains" && (
                            <div key={idx} className="col-md-3 mb-3">
                              <div className="card shadow-lg border-0 rounded-3 transform transition-all duration-300 ease-in-out">
                                <div className="card-body text-center">
                                  <h5
                                    className="card-title  fw-bold"
                                    style={{
                                      fontFamily: "helvetica, Arial, sans-serif",
                                    }}
                                  >
                                    {test.exam_name}
                                  </h5>
                                  <div className="text-center">
                                    {/* Show Level Button */}
                                    {!showDifficulty[test._id] && (
                                      <button
                                        onClick={() => handleShowLevelClick(test._id)} // Show difficulty for the specific test
                                        className="text-white py-2 px-2 rounded mt-2 bg-green-500 hover:bg-green-600 w-100"
                                        style={{ backgroundColor: "#131656" }}
                                      >
                                        Show Level
                                      </button>
                                    )}

                                    {/* Display difficulty level */}
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
                                      <p>Ques</p>
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
                                    className={`mt-2 py-2 px-4 rounded ${test.status === "true"
                                      ? "bg-green-500 text-white hover:bg-green-600"
                                      : "border-4 border-green-500 text-green-500 hover:bg-green-600 hover:text-white"
                                      }`}
                                    onClick={() =>
                                      handleTopicSelect(test.section[0], "mains")
                                    }
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
                )}

                {/* Previous Year Question Paper */}
                {activeSection === "PYQ" && (
                  <div className="mt-3">
                    <div className="row">
                      {data?.exams?.map(
                        (test, idx) =>
                          test.test_type === "PYQ" && (
                            <div key={idx} className="col-md-3 mb-3">
                              <div className="card shadow-lg border-0 rounded-3 transform transition-all duration-300 ease-in-out">
                                <div className="card-body text-center">
                                  <h5 className="card-title font fw-bold">
                                    {test.exam_name}
                                  </h5>
                                  <div className="text-center">
                                    {/* Show Level Button */}
                                    {!showDifficulty[test.id] && (
                                      <button
                                        onClick={() => handleShowLevelClick(test.id)} // Show difficulty for the specific test
                                        className="text-white py-2 px-2 rounded mt-2 bg-green-500 hover:bg-green-600 w-100"
                                        style={{ backgroundColor: "#131656" }}
                                      >
                                        Show Level
                                      </button>
                                    )}

                                    {/* Display difficulty level */}
                                    {showDifficulty[test.id] && (
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
                                      <p>Ques</p>
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
                                    className={`mt-2 py-2 px-4 rounded ${test.status === "true"
                                      ? "bg-green-500 text-white hover:bg-green-600"
                                      : "border-4 border-green-500 text-green-500 hover:bg-green-600 hover:text-white"
                                      }`}
                                    onClick={() =>
                                      handleTopicSelect(test.section[0], "mains")
                                    }
                                  >
                                    {test.result_type === " " ? "Take Test" : "Lock"}
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

                <h1 className="text-center fw-bold text-green-500 h4 font my-2">
                  Frequently Asked Question
                </h1>

                <div className="space-y-4">
                  {faqs.length > 0 ? (
                    faqs.map((faq, index) => (
                      <div key={faq.id} className="border-b border-gray-200">
                        <div key={faq.id} className="border-b border-gray-200">
                          <div
                            className={`flex justify-between text-green-500 rounded my-2 w-full text-left py-2 px-5 font-medium text-lg transition-all ease-in-out duration-300 ${activeIndex === index
                              ? "bg-green-500 text-white"
                              : "bg-gray-100 hover:bg-green-100"
                              }`}
                            onClick={() => handleAccordionToggle(index)}
                          >
                            <div
                              className="flex"
                              style={{ justifyContent: "space-between", width: "100%" }}
                            >
                              <span dangerouslySetInnerHTML={{ __html: faq.question }} />
                              <span>
                                {activeIndex === index ? (
                                  <i className="bi bi-arrow-up fs-2 fw-bolder"></i>
                                ) : (
                                  <i className="bi bi-arrow-down fs-2 fw-bolder"></i>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`overflow-hidden transition-all duration-500 ease-in-out
                  ${activeIndex === index ? "max-h-40" : "max-h-0"}`}
                        >
                          <p
                            className="px-5 py-2 text-gray-700 ml-3"
                            dangerouslySetInnerHTML={{ __html: faq.answer }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">Loading FAQs...</p> // Show a loading message if no FAQs are available
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="w-fill md:w-1/5">

          {ad.length > 0 &&
            <div>
              <div className=" mt-3">
                <div
                  className="relative flex flex-col p-4 w-full bg-cover rounded-xl shadow-inner hoverstyle"
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
                      className="text-xl font-semibold mb-3 "
                      style={{ fontFamily: "helvetica, Arial, sans-serif" }}
                    >
                      Features
                    </span>
                  </div>
                  <hr className="border-t border-gray-600" />
                  <ul className="space-y-2">
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
                  </ul>

                  <div className="text-center">
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
              {ad.map((item) => (
                <div className='m-4 hover:scale-105 hover:shadow-lg transition-transform duration-300'>
                  <Link to={item.link_name}>
                    <img src={item.photo} alt="Not Found" className='rounded-md' /></Link >
                </div>
              ))}
            </div>
          }
        </div>
      </div>
    </>
  );
};

export default Packagename;
