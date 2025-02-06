import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    nextQuestion,
    prevQuestion,
    selectOption,
    markVisited,
    submitTest,
    updateTime,
} from "../slice/testSlice";
import questions from "../data/questions"; // Assuming questions are stored locally


const Test = () => {
    
    const dispatch = useDispatch();
    const { currentQuestionIndex, selectedOptions, visitedQuestions, isSubmitted, timeLeft } = useSelector((state) => state.test);

    const currentQuestion = questions[currentQuestionIndex] || {};
    const commonData = currentQuestion.common_data;
    const questionData = currentQuestion.data || {};

    // Sidebar toggle state (for small & medium devices)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Mark question as visited
    useEffect(() => {
        if (!visitedQuestions.includes(currentQuestionIndex)) {
            dispatch(markVisited(currentQuestionIndex));
        }
    }, [currentQuestionIndex, visitedQuestions, dispatch]);

    // Timer Logic
    useEffect(() => {
        if (timeLeft === 0) {
            dispatch(submitTest());
        }
        const timer = setInterval(() => {
            dispatch(updateTime());
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, dispatch]);

    // const formatTime = (time) => {
    //     const minutes = Math.floor(time / 60);
    //     const seconds = time % 60;
    //     return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    // };
    const [time, setTime] = useState(3600); // 60 minutes in seconds
    const [isRunning, setIsRunning] = useState(true); // Default to play mode

    useEffect(() => {
        let interval;
        if (isRunning && time > 0) {
            interval = setInterval(() => {
                setTime((prevTime) => {
                    return prevTime - 1;
                });
            }, 1000);
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isRunning, time]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    const toggleTimer = () => {
        if (time > 0) {
            setIsRunning((prev) => !prev);
        }
    };

    return (
        <>
   <div className="flex justify-between items-center headerdiv p-2 text-white">
    <p>IBPS Clerk Memory Based Test (Test-1)</p>
    <div className="flex items-center gap-4">
        <h1 className="border p-1"> Time-Left : <p  className="badge text-bg-secondary"> {formatTime(time)}</p></h1>
        <button onClick={toggleTimer} className="bg-white text-primary px-4 py-1 rounded">
            {isRunning ? "Pause" : "Play"}
        </button>
    </div>
</div>

        <div className="container-fluid">
            <div className="row">
                {/* Main Content */}
                <div className={`p-4 ${isSidebarOpen ? "col-lg-9 col-md-8" : "col-lg-9 col-md-12"}`}>
                    {!isSubmitted ? (
                        <>
                           <div className="d-flex justify-content-between align-items-center">
  <span className="h4">Reading Ability! English Language!!</span>
  <div className="badge bg-warning fs-6 p-2">
    Time Left: {formatTime(timeLeft)}
  </div>
</div>

<div className="d-flex justify-content-between align-items-center">
  <div>
    <p className="mb-1 fw-bold">Question {currentQuestionIndex + 1}/{questions.length}</p>
  </div>
  <div className="flex">
    <p className="badge text-bg-secondary">QN: TIME {formatTime(time)}</p>&nbsp;
    <p className="text-success">+10.00 <span className="text-danger">-25.00</span></p>
  </div>
</div>

                            {/* Questions Section */}
                            <div className="row">
                                {/* Common Data */}
                                {commonData && Object.keys(commonData).length > 0 && (
                                   <div className="col-md-6">
                                   <div className="mb-3">
                                       <div className="card-body" style={{ maxHeight: "200px", overflowY: "auto" }}>
                                           <h5 className="card-title">Common Data</h5>
                                           <p className="card-text">{commonData.ques || "No common data available"}</p>
                                           <div className="mt-3">
                                               {commonData.option?.map((option, index) => (
                                                   <p key={index} className="mt-2">{option}</p>
                                               ))}
                                           </div>
                                       </div>
                                   </div>
                               </div>
                               
                                )}

                                {/* Question Data */}
                                <div className={commonData && Object.keys(commonData).length > 0 ? "col-md-6" : "col-md-12"}>
                                    <div className="mb-3 ">
                                        <div className="card-body" style={{ maxHeight: "200px", overflowY: "auto" }}>
                                            <h5 className="card-title">Question</h5>
                                            <p className="card-text">{questionData.ques || "No data available"}</p>
                                            <div className="mt-3">
                                                {questionData.option?.map((option, index) => (
                                                    <label key={index} className="w-100 d-block mb-2 p-2 bg-transparent">
                                                        <input
                                                            type="radio"
                                                            name={`question-${currentQuestionIndex}`}
                                                            value={index}
                                                            checked={selectedOptions[currentQuestionIndex] === index}
                                                            onChange={() => dispatch(selectOption({ questionIndex: currentQuestionIndex, optionIndex: index }))}
                                                            className="me-2"
                                                        />
                                                        {option}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Buttons */}
                            <div className="d-flex justify-content-between mt-4">
                                <button
                                    onClick={() => dispatch(prevQuestion())}
                                    disabled={currentQuestionIndex === 0}
                                    className="btn btn-secondary"
                                >
                                    Previous
                                </button>

                                {currentQuestionIndex < questions.length - 1 ? (
                                    <button
                                        onClick={() => dispatch(nextQuestion())}
                                        className="btn btn-primary"
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => dispatch(submitTest())}
                                        className="btn btn-success"
                                    >
                                        Submit
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="text-center">
                            <h1 className="display-6 text-success">Test Completed!</h1>
                        </div>
                    )} 
                </div>

                {/* Sidebar */}
                <div
                    className={`bg-light p-4 shadow-sm vh-100 end-0 overflow-auto transition ${
                        isSidebarOpen ? "d-block col-md-4 col-lg-3" : "d-none d-lg-block col-lg-3"
                    }`}
                >
                          <h1 className=""> Time-Left : <p  className="badge text-bg-secondary"> {formatTime(time)}</p></h1>

                          <div className="container mt-3">
  <div className="row align-items-center">
    <div className="col-md-6">
     <div className="smanswerImg">

     </div>
      <p> Answered</p>
    </div>
    <div className="col-md-6">
      <div className="smnotansImg">

      </div>
      <p>Not Answered</p>
    </div>
  </div>
</div>
<div className="container mt-3">
  <div className="row align-items-center">
    <div className="col-md-6">
     <div className="smnotVisitImg">

     </div>
      <p>Not Visited</p>
    </div>
    <div className="col-md-6">
<div className="smmarkedImg">
    
</div>
      <p>Markfor Review</p>
    </div>
  </div>
  <div className="col flex text-center mt-1">
<div className="smansmarkedImg">
    
</div>
      <p>&nbsp;Answered & Marked for Review</p>
    </div>
</div>
<div>
  <p className="my-2 text-center bg-gray-200">English Language</p>  
</div>
                    {/* <p><strong>Visited:</strong> {visitedQuestions.length}/{questions.length}</p>
                    <p><strong>Answered:</strong> {Object.keys(selectedOptions).length}/{questions.length}</p>
                    <p><strong>Unanswered:</strong> {questions.length - Object.keys(selectedOptions).length}</p> */}

                    <div className="mt-3">
                      
                        <div className="d-flex flex-wrap gap-2  px-3 py-2" style={{ maxHeight: "200px", overflowY: "auto",backgroundColor:"rgb(166 220 247)" }}>
                            {questions.map((_, index) => (
                                <span
                                    key={index}
                                    onClick={() => dispatch(markVisited(index))}
                                    className={` fw-bold text-center ${
                                        selectedOptions[index] !== undefined ? "answerImg" :
                                        visitedQuestions.includes(index) ? "notansImg" : "notVisitImg"
                                    }`}
                                >
                                    {index + 1}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Close Button (Only for Small & Medium Screens) */}
                    <button
                        className="btn btn-danger w-100 mt-3 d-lg-none"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        Close Status
                    </button>
                </div>

                {/* Toggle Button for Small & Medium Devices */}
                {!isSidebarOpen && (
                    <button
                        className="btn btn-primary position-fixed bottom-0 end-0 m-3 d-lg-none"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        Show Status
                    </button>
                )}
            </div>
        </div>
        </>
    );
};

export default Test;
