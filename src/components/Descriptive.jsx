import { useState,useEffect } from "react";


const Despcriptive = () => {

 const [activeSection, setActiveSection] = useState(""); // Tracks active section (Prelims/Mains)
        const [selectedTopic, setSelectedTopic] = useState(null); // Selected topic
        const [modalQuestions, setModalQuestions] = useState([]); // Stores questions for modal
        const [timer, setTimer] = useState(600); // Timer (10 min)
        const [isTimerRunning, setIsTimerRunning] = useState(false); // Timer control
        const [modalType, setModalType] = useState(""); // Tracks Prelims or Mains modal
      
        // Question Data (Prelims & Mains)
        const prelimsQuestions = {
          "IBPS PO Mains 2025 Descriptive Test 1": [
            "A is sitting two places left of B. Who is sitting next to A?",
            "Five people are sitting in a circular arrangement. Who is facing whom?",
            "What is the position of X in the row of ten people?"
          ],
          "IBPS PO Mains 2025 Descriptive Test 2": [
            "All cats are dogs. Some dogs are birds. What follows?",
            "No apple is a banana. Some bananas are mangoes. Conclusion?",
            "Some boys are students. All students are girls. Conclusion?"
          ],
          "IBPS PO Mains 2025 Descriptive Test 3": [
            "If A > B, B = C, and C < D, what is the relation between A and D?",
            "Which of the following inequalities is always true?",
            "Solve: P ≥ Q > R = S < T"
          ],
        };
      
        const mainsQuestions = {
          "Banking Awareness Questions asked in 2024 Mains Exams": [
            "If all pens are books and some books are tables, what conclusion follows?",
            "Statement: A is taller than B but shorter than C. Who is the tallest?",
            "If 'Apple' is coded as 'XZRMP', how is 'Mango' coded?"
          ],
          "Banking Awareness Questions asked in 2023 Mains Exams": [
            "Step 1: XYZ → ABC. Step 2: ABC → DEF. What is the final output?",
            "What pattern follows in the given number arrangement?",
            "Find the missing step in the output series."
          ],
          "Banking Awareness Questions asked in 2022 Mains Exams": [
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
    <div className="container">
      <h1 className="font h2 text-center mt-2 text-green-500">Descriptive Test</h1>
      <div className="row">
  <div className="col-md-9 staticheader h6 leading-10">
    <div>
    <h1 className='leading-8 font h5'>
    The <span className="text-green-600">Descriptive Test</span> in Bank Mains exams like <span className="text-green-600">IBPS PO</span>, <span className="text-green-600">SBI PO</span>, and other bank exams  
    assesses your <span className="text-green-600">writing skills</span>, <span className="text-green-600">grammar</span>, and <span className="text-green-600">clarity of expression</span> through <span className="text-green-600">Essay Writing</span> and  
    <span className="text-green-600">Letter Writing</span>. Essays require a well-structured approach with a clear <span className="text-green-600">introduction</span>,  
    <span className="text-green-600">main points</span>, and <span className="text-green-600">conclusion</span>. Letter writing includes <span className="text-green-600">formal</span> and <span className="text-green-600">informal letters</span>, such as  
    writing to a <span className="text-green-600">bank manager</span>, <span className="text-green-600">editor</span>, or for <span className="text-green-600">complaints</span>, where proper structure and <span className="text-green-600">professional tone</span> are crucial.  
    To score well, focus on <span className="text-green-600">clarity</span>, <span className="text-green-600">coherence</span>, and <span className="text-green-600">relevant content</span>, while improving your <span className="text-green-600">grammar</span> and <span className="text-green-600">vocabulary</span>.  
    Regular <span className="text-green-600">practice</span> and reading <span className="text-green-600">editorials</span> will help you perform effectively in this section and secure crucial marks in Bank Mains exams.  
</h1>


    </div>
  </div>
  
  <div className="col-md-3 ">
    <div
      className="relative flex flex-col p-4 w-full bg-cover rounded-xl shadow-inner hoverstyle"
      style={{
        backgroundImage: `radial-gradient(at 88% 40%, rgb(11, 204, 75) 0px, transparent 85%),
                          radial-gradient(at 49% 30%, hsla(240, 15%, 9%, 1) 0px, transparent 85%),
                          radial-gradient(at 14% 26%, hsla(240, 15%, 9%, 1) 0px, transparent 85%),
                          radial-gradient(at 0% 64%, rgb(11, 153, 41) 0px, transparent 85%),
                          radial-gradient(at 41% 94%, rgb(34, 214, 109) 0px, transparent 85%),
                          radial-gradient(at 100% 99%, rgb(10, 202, 74) 0px, transparent 85%)`
      }}
    >
      <div className="absolute inset-0 z-[-10] border-2 border-white rounded-xl"></div>
      <div className="text-white flex justify-between">
        <span className="text-xl font-semibold mb-3 font">Features</span>
      </div>
      <hr className="border-t border-gray-600" />
      <ul className="space-y-2">
        {[
          "Questions Based on Previous Year Exams",
          "Exam Level Interface",
          "Sample Answer PDF",
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
        <del className="bg-red-500 text-white rounded p-1 mb-2">Rs.149</del>
        <p className="text-white font-bold h5 font">Discounted Price:</p>
        <button className="bg-green-500 text-white px-3 py-1 font-bold hover:bg-green-400 rounded-full">
          Rs.149
        </button>
        {/* <p className="text-white font-bold">You Save Money: 80</p> */}
      </div>
    </div>
  </div>
</div>
    
<div className="row p-3 bg-light">
        <div className="col-md-4">
          <button className="btn bg-green-500 w-100 mb-2 text-white hover:bg-green-600" onClick={handlePrelimsClick}>
          IBPS PO
          </button>
        </div>
        {/* <div className="col-md-4">
          <button className="btn bg-green-500 w-100 mb-2 text-white hover:bg-green-600" onClick={handleMainsClick}>
          Memory Based Question
          </button>
        </div> */}
        {/* <div className="col-md-4">
          <button className="btn bg-green-500 w-100 mb-2 text-white hover:bg-green-600" onClick={handleUpdatesClick}>
            2025 Updates on Banking
          </button>
        </div> */}
      </div>

      {/* Prelims Topics - Bootstrap Cards */}
      {activeSection === "prelims" && (
        <div className="mt-3">
          <h3>Topics:</h3>
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
          <h3>Memory Based Question:</h3>
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
                        <button className="btn bg-green-500 btn-sm mt-2 text-white hover:bg-green-600">Take Test</button>
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

export default Despcriptive;
