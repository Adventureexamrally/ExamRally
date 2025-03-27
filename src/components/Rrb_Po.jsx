import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Rrb_Po = () => {
  const [activeSection, setActiveSection] = useState(""); // Tracks active section (Prelims/Mains)
  const [selectedTopic, setSelectedTopic] = useState(null); // Selected topic
  const [modalQuestions, setModalQuestions] = useState([]); // Stores questions for modal
  const [timer, setTimer] = useState(600); // Timer (10 min)
  const [isTimerRunning, setIsTimerRunning] = useState(false); // Timer control
  const [modalType, setModalType] = useState(""); // Tracks Prelims or Mains modal
  const [showDifficulty, setShowDifficulty] = useState({}); // State to manage difficulty visibility

  // Question Data (Prelims & Mains)
  const prelimsQuestions = {
    "RRB PO 2025 Prelims Mock Test 1": { questions: [], free: false, ques: "10", marks: 5, time: "30 sec", difficulty: "Moderate" },
    "RRB PO 2025 Prelims Mock Test 2": { questions: [], free: false, ques: "10", marks: 5, time: "30 sec", difficulty: "Easy" },
    "RRB PO 2025 Prelims Mock Test 3": { questions: [], free: false, ques: "10", marks: 5, time: "30 sec", difficulty: "Easy" },
    "RRB PO 2025 Prelims Mock Test 4": { questions: [], free: true, ques: "10", marks: 5, time: "30 sec", difficulty: "Easy" },
  };

  const mainsQuestions = {
    "RRB PO Mains 2025 Mock Test 1": { questions: [], free: true, ques: "10", marks: 5, time: "30 sec", difficulty: "Difficult" },
    "RRB PO Mains 2025 Mock Test 2": { questions: [], free: false, ques: "10", marks: 5, time: "30 sec", difficulty: "Easy" },
    "RRB PO Mains 2025 Mock Test 3": { questions: [], free: false, ques: "10", marks: 5, time: "30 sec", difficulty: "Difficult" },
  };

  // Handle topic selection & set modal questions
  const handleTopicSelect = (topic, type) => {
    setSelectedTopic(topic);
    setModalType(type);
    setModalQuestions(type === "prelims" ? prelimsQuestions[topic].questions : mainsQuestions[topic].questions);
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
  const handleUpdatesClick = () => setActiveSection("updates");

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

  // Toggle difficulty display
  const toggleDifficulty = (topic) => {
    setShowDifficulty((prevState) => ({
      ...prevState,
      [topic]: !prevState[topic],
    }));
  };

  const openNewWindow = (url) => {
    const width = screen.width;
    const height = screen.height;
    window.open(url, "_blank", `noopener,noreferrer,width=${width},height=${height}`);
  };

  return (
    <div className="container my-3">
      <div className="row">
        <div className="col-md-9 staticheader h6 leading-10">
          <div>
            <h1 className="leading-8 font h5">
              Prepare for <span className="text-green-500">RRB PO 2025</span> with
              high-quality, exam-level mock tests designed to match the latest
              <span className="text-green-500">exam pattern</span>. This package
              includes
              <span className="text-green-500">
                20 full-length Prelims mock tests
              </span>
              , <span className="text-green-500">Mains mock tests</span>, and
              <span className="text-green-500">Previous Year Papers</span>, ensuring
              comprehensive practice. Each test is structured to enhance
              <span className="text-green-500">speed</span>,
              <span className="text-green-500">accuracy</span>, and
              <span className="text-green-500">problem-solving skills</span>, helping
              you tackle real exam challenges with confidence. With detailed
              <span className="text-green-500">solutions</span> and
              <span className="text-green-500">performance analysis</span>, you can
              track your progress, identify weak areas, and refine your strategy.
              Whether you’re aiming to clear the
              <span className="text-green-500">Prelims</span> or secure a
              <span className="text-green-500">top rank</span> in the
              <span className="text-green-500">Mains</span>, these expert-designed
              mock tests will give you a
              <span className="text-green-500">competitive edge</span>. Start
              practicing today and boost your chances of
              <span className="text-green-500">success</span> in
              <span className="text-green-500">RRB PO 2025</span>!
            </h1>
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
                "Easy ,Moderate and Hard Level Questions",
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
                Rs.129
              </del>
              <p className="text-white font-bold h5 font">Discounted Price:</p>
              <button className="bg-green-500 text-white px-3 py-1 font-bold hover:bg-green-400 rounded-full">
                Rs.69
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Buttons */}
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
          <h3></h3>
          <div className="row">
            {Object.entries(prelimsQuestions).map(([topic, question], index) => (
              <div key={index} className="col-md-3 mb-3">
                <div className="card shadow-lg border-0 rounded-3 transform transition-all duration-300 ease-in-out border-gray-500 hover:scale-105 border-1">
                  <div className="card-body text-center">
                    <h5 className="card-title font fw-bold">{topic}</h5>
                    <div className="text-center">
                      {/* Show Level Button */}
                      <div className="text-center">
                        {!showDifficulty[topic] && (
                          <button
                            onClick={() => toggleDifficulty(topic)}
                            className="text-white py-2 px-2 rounded mt-2 bg-green-500 hover:bg-green-600 w-100"
                            style={{ backgroundColor: "#131656" }}
                          >
                            Show Level
                          </button>
                        )}

                        {/* Display difficulty level */}
                        {showDifficulty[topic] && (
                          <div
                            className="mt-4 text-sm px-2 py-2 text-center text-white"
                            style={{ backgroundColor: "#131656" }}
                          >
                            <p>
                              <strong>{question.difficulty}</strong>
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-center items-center gap-4">
                        <div className="flex flex-col items-center">
                          <p>Quez</p>
                          <p>{question.ques}</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <p>Marks</p>
                          <p>{question.marks}</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <p>Time</p>
                          <p>{question.time}</p>
                        </div>
                      </div>
                      <button
  className={`mt-2 py-2 px-4 rounded ${
    question.free
      ? "bg-green-500 text-white hover:bg-green-600"
      : "border-4 border-green-500 text-green-500 hover:bg-green-600 hover:text-white"
  }`}
  onClick={() => {
    if (question.free) {
      handleTopicSelect(topic, activeSection);
    } else {
      openNewWindow("/instruction");
    }
  }}
  data-bs-toggle="modal"
  data-bs-target={question.free ? "#questionsModal" : ""}
>
  {question.free ? "Lock " : "Take Test"}
</button>

                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mains Topics - Bootstrap Cards */}
      {activeSection === "mains" && (
        <div className="mt-3">
          <h3></h3>
          <div className="row">
            {Object.entries(mainsQuestions).map(([topic, question], index) => (
              <div key={index} className="col-md-3 mb-3">
                <div className="card shadow-lg border-0 rounded-3">
                  <div className="card-body text-center">
                    <h5 className="card-title font fw-bold">{topic}</h5>
                    <div className="flex justify-center items-center gap-4">
                      <div className="flex flex-col items-center">
                        <p>Quez</p>
                        <p>{question.ques}</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <p>Marks</p>
                        <p>{question.marks}</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <p>Time</p>
                        <p>{question.time}</p>
                      </div>
                    </div>
     
                    <button
  className={`mt-2 py-2 px-4 rounded ${
    question.free
      ? "bg-green-500 text-white hover:bg-green-600"
      : "border-4 border-green-500 text-green-500 hover:bg-green-600 hover:text-white"
  }`}
  onClick={() => {
    if (question.free) {
      handleTopicSelect(topic, activeSection);
    } else {
      openNewWindow("/instruction");
    }
  }}
  data-bs-toggle="modal"
  data-bs-target={question.free ? "#questionsModal" : ""}
>
  {question.free ? "Take Test" : "Lock"}
</button>


           
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Rrb_Po;
