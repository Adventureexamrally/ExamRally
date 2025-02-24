import { useState,useEffect } from "react";
const Ibps_Clerk = () => {
        const [activeSection, setActiveSection] = useState(""); // Tracks active section (Prelims/Mains)
          const [selectedTopic, setSelectedTopic] = useState(null); // Selected topic
          const [modalQuestions, setModalQuestions] = useState([]); // Stores questions for modal
          const [timer, setTimer] = useState(600); // Timer (10 min)
          const [isTimerRunning, setIsTimerRunning] = useState(false); // Timer control
          const [modalType, setModalType] = useState(""); // Tracks Prelims or Mains modal
        
          // Question Data (Prelims & Mains)
          const prelimsQuestions = {
            "IBPS Clerk 2025 Prelims Mock Test 1": { questions: [], free: true },
            "IBPS Clerk 2025 Prelims Mock Test 2": { questions: [], free: true },
            "IBPS Clerk 2025 Prelims Mock Test 3": { questions: [], free: true },
            "IBPS Clerk 2025 Prelims Mock Test 4": { questions: [], free: false },
          };
        
          const mainsQuestions = {
            "IBPS Clerk Mains 2025 Mock Test 1": { questions: [], free: false },
            "IBPS Clerk Mains 2025 Mock Test 2": { questions: [], free: false },
            "IBPS Clerk Mains 2025 Mock Test 3": { questions: [], free: false },
          };
        
          // Handle topic selection & set modal questions
          const handleTopicSelect = (topic, type) => {
            setSelectedTopic(topic);
            setModalType(type);
            setModalQuestions(
              type === "prelims" ? prelimsQuestions[topic].questions : mainsQuestions[topic].questions
            );
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
              setTimer((prev) => (prev > 0 ? prev - 1 : 0)); // Prevent negative timer
            }, 1000);
        
            return () => clearInterval(interval);
          }, [timer, isTimerRunning]);
        
  return (

   <div className="container mt-3">
         <div className="row">
                   <div className="col-md-9 staticheader h6 leading-10">
                       <div>
                           <h1 className="leading-8 font h5">
               
        Prepare for <span className="text-green-600">IBPS Clerk (CSA) 2025</span> with high-quality 
        <span className="text-green-600">Prelims</span> and <span className="text-green-600">Mains mock tests</span> designed 
        as per the latest <span className="text-green-600">exam pattern</span>. These tests cover 
        <span className="text-green-600">Reasoning Ability</span>, <span className="text-green-600">Quantitative Aptitude</span>, 
        <span className="text-green-600">English Language</span>, <span className="text-green-600">General Awareness</span>, and 
        <span className="text-green-600">Computer Knowledge</span>, helping you improve 
        <span className="text-green-600">speed</span>, <span className="text-green-600">accuracy</span>, and 
        <span className="text-green-600">time management</span>. The <span className="text-green-600">Prelims mock tests</span> 
        focus on quick problem-solving skills, while the <span className="text-green-600">Mains mock tests</span> prepare 
        you for complex and high-level questions. Each test includes 
        <span className="text-green-600">detailed solutions</span> and 
        <span className="text-green-600">performance analysis</span>, allowing you to track progress and 
        improve weak areas. Practicing with these <span className="text-green-600">exam-level questions</span> 
        will boost your <span className="text-green-600">confidence</span> and maximize your chances of 
        cracking <span className="text-green-600">IBPS Clerk (CSA) 2025</span> with a high score.
        Start your <span className="text-green-600">preparation</span> today and stay ahead in the 
        <span className="text-green-600">competition</span>!

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
                               Rs.119
                               </del>
                               <p className="text-white font-bold h5 font">Discounted Price:</p>
                               <button className="bg-green-500 text-white px-3 py-1 font-bold hover:bg-green-400 rounded-full">
                               Rs.69
                               </button>
                               {/* <p className="text-white font-bold">You Save Money: 80</p> */}
                           </div>
                       </div>
                   </div>
               </div>
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
                <div className="card shadow-lg border-0 rounded-3 transform transition-all duration-300 ease-in-out border-gray-500 hover:scale-105 border-1 ">
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
                      className={`btn mt-2 ${question.free ? "bg-green-500 text-white hover:bg-green-600" : "border-green-500 border-4 text-green-500 hover:bg-green-600 hover:text-white"}`}
                      onClick={() => handleTopicSelect(topic, "prelims")}
                      data-bs-toggle="modal"
                      data-bs-target="#questionsModal"
                    >
                      {question.free ? "Free" : "Take Test"}
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
                      className="btn bg-green-500 text-white mt-2 hover:bg-green-600"
                      onClick={() => handleTopicSelect(topic, "mains")}
                      data-bs-toggle="modal"
                      data-bs-target="#questionsModal"
                    >
                      Take Test
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
               </div>
                            )}

export default Ibps_Clerk