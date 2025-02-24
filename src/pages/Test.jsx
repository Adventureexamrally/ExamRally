import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    nextQuestion,
    prevQuestion,
    selectOption,
    markVisited,
    markForReview,
    submitTest,
    updateTime,
} from "../slice/testSlice";

import questions from "../data/questions";  // Assuming questions are stored locally

const Test = () => {

    
    useEffect(() => {
        // Disable Right Click
        document.addEventListener("contextmenu", (event) => event.preventDefault());
     
        // Disable DevTools Shortcuts
        document.addEventListener("keydown", (event) => {
          if (event.ctrlKey && ["u", "s", "i", "j"].includes(event.key)) {
            event.preventDefault();
          }
          if (event.key === "F12") {
            event.preventDefault();
          }
        });
    
        return () => {
          document.removeEventListener("contextmenu", (event) => event.preventDefault());
          document.removeEventListener("keydown", (event) => event.preventDefault());
        };
      }, []);
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.test);

    const { currentQuestionIndex, selectedOptions, visitedQuestions, isSubmitted, timeLeft } = useSelector((state) => state.test);

    const currentQuestion = questions[currentQuestionIndex] || {};
    const commonData = currentQuestion.common_data;
    const questionData = currentQuestion.data || {};

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [section2ClickCount, setSection2ClickCount] = useState(0);
    const [section3ClickCount, setSection3ClickCount] = useState(0);

    // Mark question as visited
    useEffect(() => {
        if (!visitedQuestions.includes(currentQuestionIndex)) {
            dispatch(markVisited(currentQuestionIndex));
        }
    }, [currentQuestionIndex, visitedQuestions, dispatch]);

    // Timer Logic (Unifying time management logic)
    useEffect(() => {
        if (timeLeft === 0) {
            dispatch(submitTest());
        } else {
            const timer = setInterval(() => {
                dispatch(updateTime());
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft, dispatch]);

    // Handle Timer for Local UI
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    const toggleTimer = () => {
        if (timeLeft > 0) {
            dispatch(updateTime());
        }
    };

    const handleNextClick = () => {
        // Increment the counters for both Section 2 and Section 3 separately
        setSection2ClickCount(prev => prev + 1); // Increment Section 2 click count

        if (section2ClickCount >= 2) {  // After 3rd click on Next
            setIsSidebarOpen(true);  // Show the sidebar (Section 2)
        }

        // Increment Section 3 click count for popup visibility
        if (section2ClickCount >= 2) {
            setSection3ClickCount(prev => prev + 1);
        }

        if (section3ClickCount >= 2) { // After 3 clicks for Section 3 popup
            // Implement your popup behavior here for Section 3 (e.g. showing another component)
            // alert("Section 3 Popup"); // For now, it shows an alert as an example
        }

        dispatch(nextQuestion());  // Proceed to next question
    };

    return (
        <>
            {/* Header */}
       
          

            {/* Main Content */}
            <div className="container-fluid">
                <div className="row">
                    {/* Section 1: Question Content */}
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
                                        <p className="badge text-bg-secondary">QN: TIME {formatTime(timeLeft)}</p>&nbsp;
                                        <p className="text-success">+01.00 <span className="text-danger">-00.25</span></p>
                                    </div>
                                </div>

                                {/* Question & Common Data */}
                                <div className="row">
                                    {/* Section 1.1: Common Data */}
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

                                    {/* Section 1.2: Question Data */}
                                    <div className={commonData && Object.keys(commonData).length > 0 ? "col-md-6" : "col-md-12"}>
                                        <div className="mb-3">
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

                                {/* Section 3: Navigation Buttons */}
                                <div className="d-flex justify-content-between mt-4">
                                        {/* <button
                                            onClick={() => dispatch(prevQuestion())}
                                            disabled={currentQuestionIndex === 0}
                                            className="btn btn-secondary"
                                        >
                                            Previous
                                        </button> */}
                                    {/* <button
    onClick={() => {
        // Mark the question as reviewed and for next question
        dispatch(markVisited(currentQuestionIndex));  // Mark question as visited
        dispatch(markForReview({ questionIndex: currentQuestionIndex }));  // Mark for review
        dispatch(nextQuestion());  // Move to next question
    }}
    disabled={currentQuestionIndex === questions.length - 1}
    className="btn btn-secondary"
>
    Mark for Review & Next
</button> */}


                    <button
                        onClick={() => dispatch(selectOption({ questionIndex: currentQuestionIndex, optionIndex: null }))} 
                        disabled={selectedOptions[currentQuestionIndex] === undefined}
                        className="btn btn-secondary"
                    >
                        Clear Response
                    </button>

                   


                                    {currentQuestionIndex < questions.length - 1 ? (
                                        <button
                                            onClick={handleNextClick}
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

                    {/* Section 2: Sidebar with Question Status */}
                    <div
                        className={`bg-light p-4 shadow-sm vh-100 end-0 overflow-auto transition ${isSidebarOpen ? "d-block col-md-4 col-lg-3" : "d-none d-lg-block col-lg-3"}`}
                    >
                        <h1 className="mb-3"> Time-Left: <span className="badge text-bg-secondary">{formatTime(timeLeft)}</span></h1>
                        {/* Question Status Section */}
                        <div className="container mt-3">
                            <div className="row align-items-center">
                                <div className="col-md-6">
                                    <div className="smanswerImg"></div>
                                    <p>Answered</p>
                                </div>
                                <div className="col-md-6">
                                    <div className="smnotansImg"></div>
                                    <p>Not Answered</p>
                                </div>
                            </div>
                        </div>

                        <div className="container mt-3">
                            <div className="row align-items-center">
                                <div className="col-md-6">
                                    <div className="smnotVisitImg"></div>
                                    <p>Not Visited</p>
                                </div>
                                <div className="col-md-6">
                                    <div className="smmarkedImg"></div>
                                    <p>Marked for Review</p>
                                </div>
                            </div>
                            <div className="col flex text-center mt-1">
                                <div className="smansmarkedImg"></div>
                                <p>Answered & Marked for Review</p>
                            </div>
                        </div>

                        {/* Question Status Indicators */}
                        <div>
                            <p className="my-2 text-center bg-gray-200">English Language</p>
                        </div>

                        {/* Question Number Navigation */}
                        <div className="mt-3">
                            <div className="d-flex flex-wrap gap-2 px-3 py-2" style={{ maxHeight: "200px", overflowY: "auto", backgroundColor: "rgb(166 220 247)" }}>
                                {questions.map((_, index) => (
                                    <span
                                        key={index}
                                        onClick={() => dispatch(markVisited(index))}
                                        className={`fw-bold text-center ${selectedOptions[index] !== undefined ? "answerImg" : visitedQuestions.includes(index) ? "notansImg" : "notVisitImg"}`}
                                    >
                                        {index + 1}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Close Button (Only for Small & Medium Screens) */}
                        <button
                            className="btn btn-danger w-100 mt-3 d-lg-none "
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
