import  { useState, useEffect } from "react";

const CriticalReason = () => {
  const [activeSection, setActiveSection] = useState(""); // State to track active section
  const [selectedTopic, setSelectedTopic] = useState(""); // State to track selected topic for subtopics
  const [timer, setTimer] = useState(600); // Timer in seconds, starting at 10 minutes (600 seconds)
  const [isTimerRunning, setIsTimerRunning] = useState(false); // State to check if the timer is running

  // Handle the topic button click to show topics
  const handleTopicClick = () => {
    setActiveSection("topics");
  };

  // Handle the memory-based questions button click
  const handleMemoryBasedClick = () => {
    setActiveSection("questions");
    setSelectedTopic(null);
  };

  const handlestatementClick = () => {
    setActiveSection("statement");
    setSelectedTopic(null);
  };

  // Handle the updates button click for 2025 updates
  const handleUpdates2025Click = () => {
    setActiveSection("updates");
    setSelectedTopic(null);
  };
  const handleCourseClick = () => {
    setActiveSection("Course");
    setSelectedTopic(null);
  };
  // Handle the topic selection and start the timer
  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setIsTimerRunning(true); // Start the timer when a topic is selected
    setTimer(600); // Reset the timer to 10 minutes each time a topic is selected
  };

  // Handle the subtopic selection to show subtopics (no timer needed here)
  const handleSubtopicSelect = () => {
    // No changes needed for the subtopic selection
  };

  // List of topics
  const topics = [
    "Statement and Assumption Mock Test 1",
    "Statement and Assumption Mock Test 2",
    "Statement and Assumption Mock Test 3",
    " Statement and Assumption Mock Test 4",
    " Statement and Assumption Mock Test 5",
    " Statement and Assumption Mock Test 6",
    " Statement and Assumption Mock Test 7",
    " Statement and Assumption Mock Test 8",
    " Statement and Assumption Mock Test 9",
    "  Statement and Assumption Mock Test 10",
    " Statement and Assumption Mock Test 11",
    " Statement and Assumption Mock Test 12",
    " Statement and Assumption Mock Test 13",
    " Statement and Assumption Mock Test 14",
    "Statement and Assumption Mock Test 15",
    " Statement and Assumption Mock Test 16",
    "Statement and Assumption Mock Test 17",
    "Statement and Assumption Mock Test 18",
    "Statement and Assumption Mock Test 19",
    "Statement and Assumption Mock Test 20",
  ];

  // Subtopics for each main topic
  const subtopics = {
    "Statement and Assumption Mock Test 1": [
      "What is the quantity?",
      "What is evaluation?",
      "Important Banks in History?",
    ],
    "Statement and Assumption Mock Test 2": [
      "Monetary Authority?",
      "Issuer of Currency?",
      "Regulator of Banks?",
    ],
    "Statement and Assumption Mock Test 3": [
      "Types of Monetary Policy?",
      "Tools of Monetary Policy?",
      "Impact on Inflation?",
    ],
  };

  // Memory-based questions for 2024 and 2023
  const questions2023 = [
    "Cause and Effect Mock Test 1",
    "Cause and Effect Mock Test 2",
    "Cause and Effect Mock Test 3",
    "Cause and Effect Mock Test 4",
    "Cause and Effect Mock Test 5",
    "Cause and Effect Mock Test 6",
    "Cause and Effect Mock Test 7",
    "Cause and Effect Mock Test 8",
    "Cause and Effect Mock Test 9",
    "Cause and Effect Mock Test 10",
    "Cause and Effect Mock Test 11",
    "Cause and Effect Mock Test 12",
  ];

  const questions2024 = [
    "Statement and Conclusion Mock test 1",
    "Statement and Conclusion Mock test 2",
    "Statement and Conclusion Mock test 3",
    "Statement and Conclusion Mock test 4",
    "Statement and Conclusion Mock test 5",
    "Statement and Conclusion Mock test 6",
  ];
  const Course = [
    "Course of Action Mock Test 1",
   " Course of Action Mock Test 2",
   " Course of Action Mock Test 3",
    "Course of Action Mock Test 4",
   " Course of Action Mock Test 5",
   "Course of Action Mock Test 6",
   " Course of Action Mock Test 7",
   " Course of Action Mock Test 8",
   " Course of Action Mock Test 9",
   " Course of Action Mock Test 10",
  ];

  // Countdown Timer Effect with console.log
  useEffect(() => {
    if (timer === 0 || !isTimerRunning) return; // Stop timer when it reaches zero or timer is paused

    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        const newTimer = prevTimer - 1;
        return newTimer;
      });
    }, 1000);

    // Cleanup interval on component unmount or timer reaching zero
    return () => clearInterval(interval);
  }, [timer, isTimerRunning]); // Dependency on `timer` and `isTimerRunning`

  // Format the timer to MM:SS
  const formatTimer = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <>
      <div className="container">
        <div>
          <div className="row mt-3">
            <div className="col-md-9 staticheader">
              <p className="font mt-2 h4 leading-8">
                <h1 className="text-green-500 font font-bold ">
                  Critical Reason
                </h1>
                <br />
                Master Banking Awareness with our expertly designed package
                covering key topics like RBI functions, monetary policy, digital
                banking, financial inclusion, government schemes, and more. This
                package is carefully structured to keep you updated with the
                latest banking trends, making it ideal for exams like
                <span className="text-green-500 fw-bold">
                  IBPS PO, IBPS Clerk, RRB PO, RRB Clerk, SBI PO, SBI Clerk, RBI
                  Grade B, and other banking & insurance exams
                </span>
                . With well-structured quizzes, mock tests, and clear
                explanations, you can strengthen your concepts and boost your
                exam performance. Build a solid foundation in banking knowledge
                and gain a competitive edge in your exam preparation.
              </p>
            </div>

            <div className="col-md-3">
              <div
                className="relative flex flex-col p-4 w-full bg-cover rounded-xl shadow-inner hoverstyle"
                style={{
                  backgroundImage: `
                    radial-gradient(at 88% 40%, rgb(11, 204, 75) 0px, transparent 85%),
                    radial-gradient(at 49% 30%, hsla(240, 15%, 9%, 1) 0px, transparent 85%),
                    radial-gradient(at 14% 26%, hsla(240, 15%, 9%, 1) 0px, transparent 85%),
                    radial-gradient(at 0% 64%, rgb(11, 153, 41) 0px, transparent 85%),
                    radial-gradient(at 41% 94%, rgb(34, 214, 109) 0px, transparent 85%),
                    radial-gradient(at 100% 99%, rgb(10, 202, 74) 0px, transparent 85%)
                  `,
                }}
              >
                <div className="absolute inset-0 z-[-10] border-2 border-white rounded-xl"></div>
                <div className="text-white flex justify-between">
                  <span className="text-xl font-semibold font mb-3">
                    Features
                  </span>
                </div>
                <hr className="border-t border-gray-600" />
                <ul className="space-y-2">
                  {[
                    "Covers All Topics",
                    "Exam-Level Questions Based on the Latest Pattern",
                    "Detailed Explanations",
                    "Previous Years’ Questions",
                    "Timely Updates on Banking Changes",
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
                    Rs.149
                  </del>
                  <p className="text-white font h5">Discounted Price:</p>
                  <button className="bg-green-500 text-white px-3 py-1 font-bold hover:bg-green-400 rounded-full">
                    Rs.69
                  </button>
                  <p className="text-white font-bold">You Save Money: 80</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid">
          <div className="row">
         
            <div className="col-md-3 bg-light p-3">
              <h5 className="font text-center mb-2">Critical Reason</h5>
              <button
                className="btn bg-green-500 text-white font hover:bg-green-400 mb-2 w-100"
                onClick={handleTopicClick}
              >
                Statement and Assumption
              </button>
              <button
                className="btn bg-green-500 text-white font hover:bg-green-400 mb-2 w-100"
                onClick={handleMemoryBasedClick}
              >
                Cause and Effect
              </button>
              <button
                className="btn bg-green-500 text-white font hover:bg-green-400 mb-2 w-100"
                onClick={handlestatementClick}
              >
                Statement and Conclusion
              </button>
             
              <button
                className="btn bg-green-500 text-white font hover:bg-green-400 mb-2 w-100"
                onClick={handleCourseClick}
              >
                Course of Action
              </button>
            </div>

            {/* Main Content Area */}
            <div className="col-md-6 p-3">
              {/* Display Topics */}
              {activeSection === "topics" && (
                <div>
                  <h3>Topics:</h3>
                  <ul className="flex flex-wrap gap-2">
                    {topics.map((topic, index) => (
                      <li key={index}>
                        <button
                          className="px-4 py-2 bg-green-300 rounded mb-2 hover:bg-green-400 hover:text-white transition"
                          onClick={() => handleTopicSelect(topic)}
                        >
                          {topic}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Display Memory-based Questions */}
              {activeSection === "questions" && (
                <div>
                

                  <h4>2023 Mains Exams:</h4>
                  <ul>
                    {questions2023.map((question, index) => (
                      <li key={index}>{question}</li>
                    ))}
                  </ul>
                </div>
              )}


{activeSection === "statement" && (
                <div>
                  <h3>Banking Awareness Questions Asked:</h3>
                  <h4>2024 Mains Exams:</h4>
                  <ul>
                    {questions2024.map((question, index) => (
                      <li key={index}>{question}</li>
                    ))}
                  </ul>

                
                </div>
              )}

{activeSection === "Course" && (
                <div>
         <h1>Course Mock Test</h1>
                  <ul>
                    {Course.map((question, index) => (
                      <li key={index}>{question}</li>
                    ))}
                  </ul>

                
                </div>
              )}

              {/* Display 2025 Banking Updates */}
              {activeSection === "updates" && (
                <div>
                  <h3>2025 Banking Updates:</h3>
                  <p>2025 Banking rates Updates Quiz 1</p>
                </div>
              )}
            </div>

            {/* Right Sidebar - Display Subtopics */}
            <div className="col-md-3 bg-light p-3">
              {selectedTopic && (
                <div>
                  <h4 className="font">{selectedTopic}</h4>
                  <ul>
                    <div className="row">
                      <div className="col-md-12 text-center mt-3">
                        <p className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset mb-2">
                          {formatTimer(timer)}
                        </p>
                      </div>
                    </div>
                    {subtopics[selectedTopic]?.map((subtopic, index) => (
                      <li className="card" key={index}>
                        {subtopic}
                        <button
                          className="py-2 bg-green-500 rounded"
                          onClick={handleSubtopicSelect}
                        >
                          View Answer
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CriticalReason;
