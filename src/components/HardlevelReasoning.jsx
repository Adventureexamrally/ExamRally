import { useEffect } from 'react';
import { useState } from 'react';

const HardlevelReasoning = () => {
    const [activeSection, setActiveSection] = useState(""); // Tracks active section (Prelims/Mains)
      const [selectedTopic, setSelectedTopic] = useState(null); // Selected topic
      const [modalQuestions, setModalQuestions] = useState([]); // Stores questions for modal
      const [timer, setTimer] = useState(600); // Timer (10 min)
      const [isTimerRunning, setIsTimerRunning] = useState(false); // Timer control
      const [modalType, setModalType] = useState(""); // Tracks Prelims or Mains modal
    
      // Question Data (Prelims & Mains)
      const prelimsQuestions = {
        "Circular Arrangement": [
          "Circular Arrangement with blood relation",
          "Circumference based Circular Arrangement",
          "Unknown Circular Arrangement with single variable"
        ],
        "Linear Arrangement": [
          "Linear arrangement with Two variable",
          "Linear arrangement with Vacant",
          "Linear arrangement with Coded &amp; income"
        ],
        "Parallel Row Arrangement": [
          "Parallel Row Arrangement with Two variable",
          "Parallel Row Arrangement with bidirectional",
          "Parallel Row Arrangement with Blood relation"
        ],
      };
    
      const mainsQuestions = {
        "Circular Arrangement": [
            "Circular arrangement-movement based",
            "Circular linear arrangement",
            "Multiple factor based Circular Arrangement"
        ],
        "Linear Arrangement": [
            "Linear arrangement with Movement",
            "Linear arrangement with Multiple & factor based",
            "Linear arrangement with Distance based"
        ],
        "Parallel Row Arrangement": [
            "Three parallel row Arrangement",
            "Parallel Row Arrangement with Distance based",
            "Four Parallel Row Arrangement",
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
    

        const [loading, setLoading] = useState(true);
        
          useEffect(() => {
            // Simulate data fetching
            setTimeout(() => {
              setLoading(false);
            }, 500);
          }, []);
      
  return (

    <>
      {loading ? (
      <div className="container mt-1 bg-gray-100 p-3 rounded-lg">
      <div className="row">
      <span className="placeholder col-4 mx-auto rounded-md p-2"></span>
        <div className="col-md-9">
          <p className="placeholder-glow">
            {/* <span className="placeholder col-12 mb-2 p-5 rounded-md"></span> */}
            <span className="placeholder col-12 mt-20 mb-2 rounded-md"></span>
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
      </div>
      <div className="mt-3">
        <div className="row">
          {[1, 2, 3].map((index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="card shadow-md border-0 rounded-3 bg-gray-100">
                <div className="card-body text-center">
                  <p className="placeholder-glow">
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
    </div>
        ) : (
    <div>

      <div className="container py-1">
      <h1 className="p-2 text-green-500 text-center fw-bold">
     
      <h1>Hard Level Reasoning</h1>
      </h1>
      <div className="row">
  <div className="col-md-9 staticheader h6 leading-10">
    <div>
   <h1 className='leading-8'>
   High-level reasoning questions are a game-changer in bank mains exams. They test
your ability to think critically, make quick decisions, and solve problems under
pressure. Since reasoning plays a huge role in overall exam performance, practicing
tough questions is a must. That’s why we at Examrally have put together a
dedicated package of  <span className="text-green-500 font-bold">hard-level reasoning questions for bank mains exams.</span>.
These aren’t just random tough questions—we’ve carefully selected and designed
them based on <span className="text-green-500 font-bold"> previous year bank exams,</span>
covering every type of model that
appears in<span className="text-green-500 font-bold">IBPS PO, SBI PO, RBI Grade B, and other bank mains exams.</span> 
<span className="text-green-500 font-bold">expected high-difficulty reasoning
questions,</span>helping you sharpen your skills and boost your confidence for the real
exam. If you’re looking for<span className="text-green-500 font-bold">the best reasoning practice for bank mains,</span>
our
package is tailored to give you an edge in the competition. </h1>
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
          "Covers All Topics",
          "Detailed Explanations",
          "New pattern questions","Three different level of questions: Easy, Moderate and Difficult",
          "Previous Year Questions for better understanding of exact exam level",
          "Expected New type questions",
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
        <del className="bg-red-500 text-white rounded p-1 mb-2">Rs.199</del>
        <p className="text-white font-bold h5 font">Discounted Price:</p>
        <button className="bg-green-500 text-white px-3 py-1 font-bold hover:bg-green-400 rounded-full">
          Rs.79
        </button>
        <p className="text-white font-bold">You Save Money:120</p>
      </div>
    </div>
  </div>
</div>

      {/* Sidebar Buttons */}
      <div className="row p-3 bg-light">
        <div className="col-md-4">
          <button 
          className={`btn w-100 mb-2 text-white ${
            activeSection === "prelims" ? "bg-[#131656] hover:bg-[#131656]" : "bg-green-500 hover:bg-green-600"
          }`}
          onClick={handlePrelimsClick}>
          High Level
          </button>
        </div>
        <div className="col-md-4">
          <button 
         className={`btn w-100 mb-2 text-white ${
          activeSection === "mains" ? "bg-[#131656] hover:bg-[#131656]" : "bg-green-500 hover:bg-green-600"
        }`}
           onClick={handleMainsClick}>
          Extreme High Level
          </button>
        </div>
        {/* <div className="col-md-4">
          <button className="btn bg-green-500 w-100 mb-2 text-white hover:bg-green-600" onClick={handleUpdatesClick}>
            Previous Year Questions
          </button>
        </div> */}
      </div>

      {/* Prelims Topics - Bootstrap Cards */}
      {activeSection === "prelims" && (
        <div className="mt-3">
          <h3>High Level Topics:</h3>
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
          <h3>Extreme High-Level Topics:</h3>
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
    </div>
        )};
    </>
  )
}

export default HardlevelReasoning
