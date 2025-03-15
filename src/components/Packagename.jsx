import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Api from '../service/Api';

const Packagename = () => {
  const [data, setData] = useState({});
  const { id } = useParams();

  useEffect(() => {
    // Fetching data based on the id from the URL params
    Api.get(`packages/package-content/${id}`).then((res) => {
      console.log(res.data);
      setData(res.data); // Setting the response data to state
    });
  }, [id]);

  // Extracting the package content and exams information
  const packageContent = data?.package_content?.[0] || {}; // Assuming there is only one item in package_content array
  const exams = data?.exams?.[0] || {}; // Assuming there is only one exam object
  const subTitles = packageContent?.sub_titles || []; // Accessing sub_titles or default to an empty array
  
  console.log(subTitles); 
  

  const [activeSection, setActiveSection] = useState(""); // Tracks active section (Prelims/Mains/Previous Year Questions)
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
    window.open(url, "_blank", `noopener,noreferrer,width=${width},height=${height}`);
  };
 
  const [faqs, setFaqs] = useState([]);  // Store FAQ data
  const [activeIndex, setActiveIndex] = useState(null); // Track active index for opening and closing

  useEffect(() => {
    // Fetching data based on the id from the URL params
    Api.get(`packages/package-content/${id}`)
      .then((res) => {
        console.log(res.data);
        // Setting the FAQ data from the response
        setFaqs(res.data?.package_content?.[0]?.faqs || []);
        console.log(res.data?.package_content?.[0]?.faqs); // Extracting and logging the FAQs
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [id]);  // Effect will run whenever 'id' changes

  const handleAccordionToggle = (index) => {
    // Toggle the active index (open/close the panel)
    if (activeIndex === index) {
      setActiveIndex(null); // Close the panel if it's already open
    } else {
      setActiveIndex(index); // Open the panel if it's not open
    }
  };



  return (
    <div className='container mt-1'>
       <div className="row">
        <div className="col-md-9 staticheader h6 leading-10">
          <div>
          <h1 className="leading-8 font h5" dangerouslySetInnerHTML={{ __html: exams.description }} />            
          </div>
        </div>

        <div className="col-md-3">
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
              <span className="text-xl font-semibold mb-3 font">Features</span>
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
                <li key={index} className="flex items-center gap-2 font">
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
                <del className="text-red-400 font">Package Price:</del>
              </p>
              <del className="bg-red-500 text-white rounded p-1 mb-2">
                Rs.{exams?.amount || 0} 
              </del>
              <p className="text-white font-bold h5 font">Discounted Price:</p>
              <button className="bg-green-500 text-white px-3 py-1 font-bold hover:bg-green-400 rounded-full">
                Rs.{exams?.discountedAmount || 0} 
              </button>
            </div>
          </div>
        </div>
      </div> 

      <div className="row p-3 bg-light">
        <div className="col-md-4">
          <button
            className="btn bg-green-500 w-100 mb-2 text-white hover:bg-green-600"
            onClick={handlePrelimsClick}
          >
            Prelims
          </button>
        </div>
        <div className="col-md-4">
          <button
            className="btn bg-green-500 w-100 mb-2 text-white hover:bg-green-600"
            onClick={handleMainsClick}
          >
            Mains
          </button>
        </div>
        <div className="col-md-4">
          <button
            className="btn bg-green-500 w-100 mb-2 text-white hover:bg-green-600"
            onClick={handleUpdatesClick}
          >
            Previous Year Question Paper
          </button>
        </div>
      </div>

      {/* Prelims Topics - Bootstrap Cards */}
      {activeSection === "prelims" && (
        <div className="mt-3">
          <div className="row">
            {data?.exams?.map((exam, index) =>
              exam.exams.map((test, idx) => (
                test.test_type === "Prelims" && (
                  <div key={idx} className="col-md-3 mb-3">
                    <div className="card shadow-lg border-0 rounded-3 transform transition-all duration-300 ease-in-out border-gray-500 hover:scale-105 border-1">
                      <div className="card-body text-center">
                        <h5 className="card-title font fw-bold">{test.exam_name}</h5>
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
                          onClick={() => handleTopicSelect(test.section[0], "prelims")}
                        >
                          {test.status === "true" ? "Take Test" : "Lock"}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              ))
            )}
          </div>
        </div>
      )}

      {/* Mains Topics - Bootstrap Cards */}
      {activeSection === "mains" && (
        <div className="mt-3">
          <div className="row">
            {data?.exams?.map((exam, index) =>
              exam.exams.map((test, idx) => (
                test.test_type === "Mains" && (
                  <div key={idx} className="col-md-3 mb-3">
                    <div className="card shadow-lg border-0 rounded-3 transform transition-all duration-300 ease-in-out">
                      <div className="card-body text-center">
                        <h5 className="card-title font fw-bold">{test.exam_name}</h5>
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
                          className={`mt-2 py-2 px-4 rounded ${
                            test.status === "true"
                              ? "bg-green-500 text-white hover:bg-green-600"
                              : "border-4 border-green-500 text-green-500 hover:bg-green-600 hover:text-white"
                          }`}
                          onClick={() => handleTopicSelect(test.section[0], "mains")}
                        >
                          {test.status === "true" ? "Take Test" : "Lock"}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              ))
            )}
          </div>
        </div>
      )}

      {/* Previous Year Question Paper */}
      {activeSection === "PYQ" && (
        <div className="mt-3">
          <div className="row">
            {data?.exams?.map((exam, index) =>
              exam.exams.map((test, idx) => (
                test.test_type === "PYQ" && (
                  <div key={idx} className="col-md-3 mb-3">
                    <div className="card shadow-lg border-0 rounded-3 transform transition-all duration-300 ease-in-out">
                      <div className="card-body text-center">
                        <h5 className="card-title font fw-bold">{test.exam_name}</h5>
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
                          className={`mt-2 py-2 px-4 rounded ${
                            test.status === "true"
                              ? "bg-green-500 text-white hover:bg-green-600"
                              : "border-4 border-green-500 text-green-500 hover:bg-green-600 hover:text-white"
                          }`}
                          onClick={() => handleTopicSelect(test.section[0], "mains")}
                        >
                          {test.result_type=== " " ? "Take Test" : "Lock"}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              ))
            )}
          </div>
        </div>
      )}

      
    <div className='my-2'>
    {subTitles.map((subTitle) => (
      <div key={subTitle._id}>
      <ul className="list-none">
  <li>
    <h3 className="fw-bold font">{subTitle.title}</h3>
  </li>
  <li>
    <div dangerouslySetInnerHTML={{ __html: subTitle.description }} className="font ml-3"></div>
  </li>
</ul>

      </div>
    ))}
  </div>

<h1 className='text-center fw-bold text-green-500 h4 font my-2'>Frequently Asked Question</h1>

 <div className="space-y-4">
      {faqs.length > 0 ? (
        faqs.map((faq, index) => (
          <div key={faq.id} className="border-b border-gray-200">
         <div key={faq.id} className="border-b border-gray-200">
  <div
    className={`flex justify-between text-green-500 rounded my-2 w-full text-left py-2 px-5 font-medium text-lg transition-all ease-in-out duration-300 ${
      activeIndex === index ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-green-100'
    }`}
    onClick={() => handleAccordionToggle(index)}
  >
   <div className="flex" style={{ justifyContent: 'space-between', width: '100%' }}>
  <span>{faq.question}</span>
  <span>
    {activeIndex === index ? (
      <i className="bi bi-arrow-up h4"></i>
    ) : (
      <i className="bi bi-arrow-down h4"></i>
    )}
  </span>
</div>
  </div>
</div>

            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out
                ${activeIndex === index ? 'max-h-40' : 'max-h-0'}`}
            >
              <p className="px-5 py-2 text-gray-700 ml-3">{faq.answer}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">Loading FAQs...</p> // Show a loading message if no FAQs are available
      )}
    </div>




    </div>
  );
};

export default Packagename;
