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
import axios from "axios";
import Api from "../service/Api";
const Test = () => {
  const dispatch = useDispatch();
  const { loading, error, currentQuestionIndex, selectedOptions, visitedQuestions, isSubmitted, timeLeft, markedForReview } = useSelector((state) => state.test);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [examData, setExamData] = useState(null);
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState("00:00:00");
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0); // Track current section index

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const startCountdown = (initialTime) => {
    let timeLeft = initialTime * 60;
    setTimerActive(true);

    const timerInterval = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        setTimerActive(false);
        setTimeRemaining("00:00:00");
        dispatch(submitTest());
      } else {
        timeLeft -= 1;
        const formattedTime = formatTime(timeLeft);
        setTimeRemaining(formattedTime);
        dispatch(updateTime());
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  };

  useEffect(() => {
    Api
      .get("exams/getExam/67ac50d70a6d138318229387")
      .then((res) => {
        if (res.data) {
          setExamData(res.data);
          console.log(res.data);
          const timeInMinutes = res.data.section[0]?.t_time || 0;
          startCountdown(timeInMinutes);
        }
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  useEffect(() => {
    if (examData && currentQuestionIndex !== null) {
      dispatch(markVisited(currentQuestionIndex)); // Mark the current question as visited
    }
  }, [currentQuestionIndex, examData, dispatch]);

  const handleQuestionClick = (index) => {
    dispatch(nextQuestion(index)); // Set the current question when clicked
  };

  const handleNextClick = () => {
    dispatch(nextQuestion()); // Proceed to next question
  };

  const handleClearResponse = () => {
    dispatch(selectOption({ questionIndex: currentQuestionIndex }));
  };

  const handleMarkForReview = () => {
    dispatch(markForReview(currentQuestionIndex));
    dispatch(nextQuestion());
  };

  const handleSubmitTest = () => {
    dispatch(submitTest());
  };

  const handleNextSection = () => {
    if (currentSectionIndex < examData.section.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  const quantsSection = examData?.section?.[currentSectionIndex];

  return (
    <div className="container-fluid mock-font">
      <div className="row">
        <div className="col-lg-9 col-md-8 p-4">
          {!isSubmitted ? (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="h4">Reading Ability! English Language!!</span>
                <div className="badge bg-warning fs-6 p-2">
                  Time-Left: <span className="badge text-bg-secondary">{timeRemaining}</span>
                </div>
              </div>

              {examData ? (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2>{examData.exam_name} - {examData.test_name}</h2>
                    <p>
                      Marks <span className="text-white bg-green-400 rounded p-1">+ {examData.section[0].plus_mark}</span>
                      &nbsp;<span className="text-white bg-red-500 rounded p-1">- {examData.section[0].minus_mark}</span>
                    </p>
                  </div>
                  <p><strong>Duration:</strong> {examData.duration} min</p>
                  <p><strong>Difficulty Level:</strong> {examData.q_level}</p>
                  <p><strong>Test Type: </strong> {examData.test_type}</p>
                  <h3>Question No : {currentQuestionIndex + 1}</h3>
                  {quantsSection ? (
                    <div className="row">
                      <div className="col-lg-6 col-md-6" style={{ maxHeight: "350px", overflowY: "auto" }}>
                        <div className="fw-bold text-wrap" style={{ whiteSpace: "normal", wordWrap: "break-word" }} dangerouslySetInnerHTML={{ __html: quantsSection.questions[currentQuestionIndex]?.common_data || "No common data available" }} />
                      </div>

                      <div className="col-lg-6 col-md-6" style={{ maxHeight: "350px", overflowY: "auto" }}>
                        {quantsSection?.questions?.[currentQuestionIndex] ? (
                          <div className="p-3 mb-3">
                            <p><strong>Question:</strong></p>
                            <div className="fw-bold text-wrap" style={{ whiteSpace: "normal", wordWrap: "break-word" }} dangerouslySetInnerHTML={{ __html: quantsSection.questions[currentQuestionIndex]?.question || "No question available" }} />
                            <p><strong>Options:</strong></p>
                            <ul>
                              {quantsSection.questions[currentQuestionIndex]?.options?.map((option, optIndex) => (
                                <li key={optIndex} style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
                                  <label className="fw-bold flex">
                                    <input type="radio" name="option" checked={selectedOptions[currentQuestionIndex] === optIndex} onChange={() => dispatch(selectOption({ questionIndex: currentQuestionIndex, optionIndex: optIndex }))} />
                                    &nbsp;
                                    <span style={{ whiteSpace: "normal", wordWrap: "break-word" }} dangerouslySetInnerHTML={{ __html: option }} />
                                  </label>
                                </li>
                              )) || <li>No options available</li>}
                            </ul>
                          </div>
                        ) : (
                          <p>Loading question...</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p>No quants section available</p>
                  )}
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </>
          ) : (
            <div className="text-center">
              <h1 className="display-6 text-success">Test Completed!</h1>
              <button onClick={handleSubmitTest} className="btn btn-success mt-4">
                Submit Test
              </button>
            </div>
          )}
        </div>

        {/* Sidebar: Question Status */}
        <div className={`bg-light p-4 shadow-sm vh-100 end-0 overflow-auto transition ${isSidebarOpen ? "d-block col-md-4 col-lg-3" : "d-none d-lg-block col-lg-3"}`}>
          <div className="badge bg-blue-300 fs-6 p-2">
            Time-Left: <span className="badge bg-blue-500">{timeRemaining}</span>
          </div>

          <div className="container mt-3">
            <div className="d-flex flex-wrap gap-2 px-3 py-2 text-center" style={{ maxHeight: "400px", overflowY: "auto", backgroundColor: "rgb(166 220 247)" }}>
              {examData?.section?.[currentSectionIndex]?.questions.map((_, index) => (
                <span
                  key={index}
                  onClick={() => {
                    handleQuestionClick(index); // This will set the currentQuestionIndex to the clicked index
                    dispatch(markVisited(index)); // Mark the question as visited
                  }}
                  className={`fw-bold flex align-items-center justify-content-center
                    ${selectedOptions[index] !== undefined ? "answerImg" : visitedQuestions.includes(index) ? "notansImg" : "notVisitImg"}
                    ${markedForReview.includes(index) ? "reviewed smmarkedImg" : ""}`}
                >
                  {index + 1}
                </span>
              ))}
            </div>
          </div>
          <button className="btn btn-danger w-100 mt-3 d-lg-none" onClick={() => setIsSidebarOpen(false)}>
            Close Status
          </button>
        </div>

        {/* Toggle Button for Small Screens */}
        {!isSidebarOpen && (
          <button className="btn btn-primary position-fixed bottom-0 end-0 m-3 d-lg-none" onClick={() => setIsSidebarOpen(true)}>
            Show Status
          </button>
        )}
      </div>

      <div className="fixed-bottom bg-white p-3">
        <div className="d-flex justify-content-between align-items-center mt-2 flex-column flex-sm-row">
          <button onClick={handleClearResponse} className="btn bg-blue-300 hover:bg-blue-500 fw-bold mb-2 mb-sm-0 w-sm-auto">
            Clear Response
          </button>

          <button onClick={handleMarkForReview} className="btn bg-blue-300 fw-bold hover:bg-blue-500 mb-2 mb-sm-0 w-sm-auto">
            Mark for Review
          </button>

          <button onClick={handleNextClick} className="btn bg-blue-500 text-white hover:bg-blue-400 fw-bold mb-2 mb-sm-0 w-50 w-sm-auto">
            Save & Next
          </button>

          <div className="pl-2 w-sm-auto col">
            <button className="btn bg-blue-500 hover:bg-blue-400 text-white w-50 font fw-bold ml-16" onClick={handleNextSection}>
              Next Section
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
