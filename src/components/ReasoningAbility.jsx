import { useState, useEffect } from "react";
import PsychologyIcon from "@mui/icons-material/Psychology";
import { Link } from "react-router-dom";

const ReasoningAbility = () => {
  const [activeSection, setActiveSection] = useState(""); // Tracks active section (Prelims/Mains)
  const [selectedTopic, setSelectedTopic] = useState(null); // Selected topic
  const [modalQuestions, setModalQuestions] = useState([]); // Stores questions for modal
  const [timer, setTimer] = useState(600); // Timer (10 min)
  const [isTimerRunning, setIsTimerRunning] = useState(false); // Timer control
  const [modalType, setModalType] = useState(""); // Tracks Prelims or Mains modal

  // Question Data (Prelims & Mains)
  const prelimsQuestions = {
    "Seating Arrangement": [
      "A is sitting two places left of B. Who is sitting next to A?",
      "Five people are sitting in a circular arrangement. Who is facing whom?",
      "What is the position of X in the row of ten people?"
    ],
    "Syllogism": [
      "All cats are dogs. Some dogs are birds. What follows?",
      "No apple is a banana. Some bananas are mangoes. Conclusion?",
      "Some boys are students. All students are girls. Conclusion?"
    ],
    "Inequality": [
      "If A > B, B = C, and C < D, what is the relation between A and D?",
      "Which of the following inequalities is always true?",
      "Solve: P ≥ Q > R = S < T"
    ],
  };

  const mainsQuestions = {
    "Logical Reasoning": [
      "If all pens are books and some books are tables, what conclusion follows?",
      "Statement: A is taller than B but shorter than C. Who is the tallest?",
      "If 'Apple' is coded as 'XZRMP', how is 'Mango' coded?"
    ],
    "Input-Output": [
      "Step 1: XYZ → ABC. Step 2: ABC → DEF. What is the final output?",
      "What pattern follows in the given number arrangement?",
      "Find the missing step in the output series."
    ],
    "Data Sufficiency": [
      "Is X greater than Y? (i) X = 5Y (ii) Y = 3",
      "Can we determine the total age of three brothers? Given (i) & (ii).",
      "Does A earn more than B? (i) A = 2B (ii) B = C + 3"
    ],
  };

  // Handle topic selection & set modal questions
  const handleTopicSelect = (topic, type) => {
    setSelectedTopic(topic);
    setModalType(type);
    setModalQuestions(type === "prelims" ? prelimsQuestions[topic] : mainsQuestions[topic]);
    setIsTimerRunning(true);
    setTimer(600); // Reset Timer
  };

  // Sidebar button handlers
  const handlePrelimsClick = () => setActiveSection("prelims");
  const handleMainsClick = () => setActiveSection("mains");
  const handleUpdatesClick = () => setActiveSection("updates");

  // Timer Effect
  useEffect(() => {
    if (!isTimerRunning || timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, isTimerRunning]);

  // Format timer (MM:SS)
  const formatTimer = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="container py-4">
      {/* Header */}

      <h1 className="text-center fw-bold text-green-600">
        <PsychologyIcon fontSize="large" className="text-green-600 me-2" />
        Reasoning Ability
      </h1>
 <div className="row mt-3">
            <div className="col-md-9 staticheader">
              <p className="font mt-2 h5 leading-8">
                <h1 className="text-green-500 font font-bold ">Reasoning Ability</h1>
                <br />
                The Reasoning Ability Topic-Wise Test is designed to help aspirants preparing for
IBPS PO, IBPS Clerk, SBI PO, SBI Clerk, RRB PO, RRB Clerk, other banking and
Insurance exams master logical reasoning and problem-solving skills. This package
includes new pattern questions, three difficulty levels (Easy, Moderate, and Difficult),
and detailed explanations to enhance conceptual clarity. It covers all important topics
such as Puzzles, Seating Arrangements, Syllogisms, Inequalities, Blood
Relations,
Coding-Decoding, Input-Output, Direction Sense and More. Additionally,  <span className="text-green-500 font font-bold "> previous
year questions </span>provide insights into the exact exam level, while expected new-type
questions help candidates stay ahead of the competition. With an exam-oriented
approach, this package is ideal for both Prelims and Mains, ensuring improved
accuracy and speed in solving reasoning questions. </p>
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
                  <span className="text-xl font-semibold font mb-3">Features</span>
                </div>
                <hr className="border-t border-gray-600" />
                <ul className="space-y-2">
                  {[
                    'Exact Exam Level Questions',
                    'New Pattern Questions',
                    'Detailed Solution',
                    'Covered All Models',
                    'Clerk to RBI Grade B level Questions',
                    "Real Exam Interface",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2 font">
                      <span className="flex justify-center items-center w-4 h-4 bg-green-500 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 text-white">
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
                    <del className="text-red-400 font">Original Price:</del>
                  </p>
                  <del className="bg-red-500 text-white rounded p-1 mb-2">Rs.299</del>
                  <p className="text-white font h5">Discounted Price:</p>
                  <button className="bg-green-500 text-white px-3 py-1 font-bold hover:bg-green-400 rounded-full">
                    Rs.89
                  </button>
                  <p className="text-white font-bold">You Save Money: 210</p>
                </div>
              </div>
            </div>
          </div>
  
      {/* Sidebar Buttons */}
      <div className="row p-3 bg-light">
        <div className="col-md-4">
          <button className="btn bg-green-500 w-100 mb-2 text-white hover:bg-green-600" onClick={handlePrelimsClick}>
            Prelims
          </button>
        </div>
        <div className="col-md-4">
          <button className="btn bg-green-500 w-100 mb-2 text-white hover:bg-green-600" onClick={handleMainsClick}>
            Mains
          </button>
        </div>
        <div className="col-md-4">
          <button className="btn bg-green-500 w-100 mb-2 text-white hover:bg-green-600" onClick={handleUpdatesClick}>
            Previous Year Questions
          </button>
        </div>
      </div>

      {/* Prelims Topics - Bootstrap Cards */}
      {activeSection === "prelims" && (
        <div className="mt-3">
          <h3></h3>
          <div className="row">
            {Object.keys(prelimsQuestions).map((topic, index) => (
              <div key={index} className="col-md-4 mb-3">
                <div className="card shadow-lg border-0 rounded-3">
                  <div className="card-body text-center">
                    <h5 className="card-title">{topic}</h5>
                    <button
                      className="btn bg-green-500 text-white mt-2 hover:bg-green-600"
                      onClick={() => handleTopicSelect(topic, "prelims")}
                      data-bs-toggle="modal"
                      data-bs-target="#questionsModal"
                    >
                      View Questions
                    </button>
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
            {Object.keys(mainsQuestions).map((topic, index) => (
              <div key={index} className="col-md-4 mb-3">
                <div className="card shadow-lg border-0 rounded-3">
                  <div className="card-body text-center">
                    <h5 className="card-title">{topic}</h5>
                    <button
                      className="btn bg-green-500 text-white mt-2 hover:bg-green-600"
                      onClick={() => handleTopicSelect(topic, "mains")}
                      data-bs-toggle="modal"
                      data-bs-target="#questionsModal"
                    >
                      View Questions
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Questions Modal */}
      <div className="modal fade" id="questionsModal" tabIndex="-1" aria-labelledby="questionsModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{selectedTopic} - {modalType === "prelims" ? "Prelims" : "Mains"}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {/* <h6>Time Remaining: <strong>{formatTimer(timer)}</strong></h6> */}
              <div className="row">
                {modalQuestions.map((question, index) => (
                  <div key={index} className="col-md-4 mb-3">
                    <div className="card shadow-lg border-0 rounded-3">
                      <div className="card-body">
                        <h6 className="card-title">{question}</h6>
                        <a href="/instruction">
  <button className="btn bg-green-500 btn-sm mt-2 text-white hover:bg-green-600">
    Take Test
  </button>
</a>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReasoningAbility;
