import { useEffect, useState } from "react";
import Api from "../service/Api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useParams } from "react-router-dom";

const Test = () => {
  const [examData, setExamData] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [clickedQuestionIndex, setClickedQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [visitedQuestions, setVisitedQuestions] = useState([]);
  const [markedForReview, setMarkedForReview] = useState([]);
  const [ansmarkforrev,setAnsmarkforrev] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const location = useLocation();
  const selectedLanguage = location.state?.language || "English";
  // Fetch exam data

  const {id}=useParams();
console.log(id)
  useEffect(() => {
    Api.get(`exams/getExam/${id}`)
      .then((res) => {
        if (res.data) {
          setExamData(res.data);
          console.log(res.data);
          
        }
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const startingIndex = examData?.section
    ?.slice(0, currentSectionIndex)
    .reduce((acc, section) => acc + section.questions?.[selectedLanguage?.toLowerCase()]?.length, 0) || 0;

  // Mark a question as visited when clicked
  useEffect(() => {
    if (!visitedQuestions.includes(clickedQuestionIndex)) {
      setVisitedQuestions((prev) => [...prev, clickedQuestionIndex]);
    }
  }, [clickedQuestionIndex]);

  const handleQuestionClick = (index) => {
    setClickedQuestionIndex(index);
  };

  const handleOptionChange = (index) => {
    setSelectedOptions((prev) => {
      const updatedOptions = [...prev];
      updatedOptions[clickedQuestionIndex] = index; // Store the selected option for the clicked question
      return updatedOptions;
    });

    // Get the correct answer for the clicked question
    const currentQuestion = examData?.section[currentSectionIndex]?.questions[clickedQuestionIndex - startingIndex];
    const correctAnswerIndex = currentQuestion?.answer;

    let mark = 0;

    // Check if the selected option matches the correct answer
    if (correctAnswerIndex === index) {
      mark = 1.00; // Correct answer gets 1 mark
      console.log("Correct Answer", correctAnswerIndex === index);
    } else {
      mark = -0.25; // Incorrect answer gets -0.25 mark
    }

    // Send the selected option along with the question data to the API
    const currentQuestionData = {
      question: currentQuestion?.question,
      options: currentQuestion?.options,
      correctOption: currentQuestion?.answer,
      selectedOption: currentQuestion?.options[index], // Store the selected option
      isVisited: visitedQuestions.includes(clickedQuestionIndex), // Mark the question as visited
      markforreview: markedForReview.includes(clickedQuestionIndex),
      ansmarkforrev:ansmarkforrev.includes(clickedQuestionIndex)
    };
  
  }



const [questionStartTime, setQuestionStartTime] = useState(new Date());
const [questionTimes, setQuestionTimes] = useState({}); // Object to track each question's time

useEffect(() => {
  if (!examStartTime) {
    setExamStartTime(new Date()); // Store when the exam starts
  }
}, []);


// Update question time when user switches questions
useEffect(() => {
  if (questionStartTime) {
    const now = new Date();
    const timeSpent = Math.floor((now - questionStartTime) / 1000); // Time spent in seconds

    setQuestionTimes((prev) => ({
      ...prev,
      [currentSectionIndex]: (prev[currentSectionIndex] || 0) + timeSpent,
    }));
    
    setQuestionStartTime(new Date()); // Reset time for next question
  }
}, [currentSectionIndex]); // Runs when the user changes questions


  const handleSubmitTest = () => {
    setIsSubmitted(true); // Trigger the post call for total marks
  };
  const handleClearResponse = () => {
    setSelectedOptions((prev) => {
      const updatedOptions = [...prev];
      updatedOptions[clickedQuestionIndex] = undefined;
      return updatedOptions;
    });
  };

  const handleMarkForReview = () => {
    if (!markedForReview.includes(clickedQuestionIndex)) {
      setMarkedForReview((prev) => [...prev, clickedQuestionIndex]);
    }
    handleNextClick();
  };


  const [showModal, setShowModal] = useState(false);
  const [sectionSummaryData, setSectionSummaryData] = useState([]);
  
  const handleSubmitSection = () => {
    const currentSection = examData?.section[currentSectionIndex];
    if (!currentSection) return;

    // Get the questions for the current section and selected language
    const questions = currentSection.questions?.[selectedLanguage?.toLowerCase()];
    if (!questions) return;  // If no questions for the selected language, return early.

    // Total questions in the current section
    const totalQuestions = questions.length;

    // Calculate answered and unanswered questions
    const answeredQuestions = selectedOptions
      .slice(startingIndex, startingIndex + totalQuestions)
      .filter((option) => option !== undefined).length;

    const notAnsweredQuestions = totalQuestions - answeredQuestions;

    // Calculate visited and not visited questions
    const visitedQuestionsCount = visitedQuestions.filter(
      (index) => index >= startingIndex && index < startingIndex + totalQuestions
    ).length;

    const notVisitedQuestions = totalQuestions - visitedQuestionsCount;

    // Calculate marked for review questions
    const reviewedQuestions = markedForReview.filter(
      (index) => index >= startingIndex && index < startingIndex + totalQuestions
    ).length;

    // Set the section summary
    const sectionSummary = {
      sectionName: currentSection.name, // Add the section name
      answeredQuestions,
      notAnsweredQuestions,
      visitedQuestionsCount,
      notVisitedQuestions,
      reviewedQuestions,
      totalQuestions,
    };

    // Store section summary
    setSectionSummaryData((prevData) => [...prevData, sectionSummary]);

    // Display modal
    setShowModal(true);

    if (currentSectionIndex < examData.section.length - 1) {
      setCurrentSectionIndex((prev) => prev + 1);

      // Move to the first question of the next section
      const newStartingIndex = examData?.section
        ?.slice(0, currentSectionIndex + 1)
        .reduce((acc, section) => acc + section.questions?.[selectedLanguage?.toLowerCase()]?.length, 0);

      setClickedQuestionIndex(newStartingIndex);
    } else {
      // If it's the last section, finish the test (call your handleSubmitTest function)
      submitExam();
    }
  };

  const handleNextClick = () => {
    if (
      examData &&
      examData.section[currentSectionIndex] &&
      clickedQuestionIndex < startingIndex + examData.section[currentSectionIndex].questions?.[selectedLanguage?.toLowerCase()]?.length - 1
    ) {
      setClickedQuestionIndex(clickedQuestionIndex + 1);
    }
  };
  const [examStartTime, setExamStartTime] = useState(null);
const [totalTime, setTotalTime] = useState('');

useEffect(() => {
  // Set exam start time when the component mounts
  if (!examStartTime) {
    setExamStartTime(new Date());
  }
}, []);

  const [questionTime, setQuestionTime] = useState(0);
  const [questionTimerActive, setQuestionTimerActive] = useState(false);

  let questionTimerInterval;

  useEffect(() => {
    // Reset time when switching questions
    setQuestionTime(0);
    setQuestionTimerActive(true);

    questionTimerInterval = setInterval(() => {
      setQuestionTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(questionTimerInterval);
  }, [clickedQuestionIndex]);

  const datatime = examData?.duration ?? 0;
  const [timeLeft, setTimeLeft] = useState(datatime * 60);

  
  const formatTime = (durationInSeconds) => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };


  useEffect(() => {
    setTimeLeft(datatime * 60); // Reset when duration changes
  }, [datatime]);

useEffect(() => {
  if (timeLeft <= 0) {
    // Automatically submit the exam when time is up
    submitExam();
    return; // Stop further actions if time is up
  }

  const timer = setInterval(() => {
    setTimeLeft((prevTime) => Math.max(prevTime - 1, 0));
  }, 1000);

  return () => clearInterval(timer); // Cleanup on unmount
}, [timeLeft]);

// Second useEffect: Exam Submission when time is up or when manually triggered
const submitExam = () => {
  console.log("Submit Exam function called");

  // Check if exam data and section exist
  if (!examData || !examData.section || !examData.section[currentSectionIndex]) {
    console.error("Exam data or section not available");
    return;
  }

  console.log("Exam data and section found");

  const currentSection = examData.section[currentSectionIndex];
  console.log("Current Section:", currentSection);

  const endTime = new Date();
  console.log("End time:", endTime);

  const timeTakenInSeconds = Math.floor((endTime - examStartTime) / 1000);
  console.log("Time taken in seconds:", timeTakenInSeconds);

  const formattedTotalTime = formatTime(timeTakenInSeconds);
  console.log("Formatted total time:", formattedTotalTime);

  // Update total time
  setTotalTime(formattedTotalTime);

  // Prepare answers data
// Prepare answers data with all question options
const answersData = selectedOptions.map((selectedOption, index) => {
  const question = currentSection?.questions?.[selectedLanguage?.toLowerCase()]?.[index];

  console.log(`Processing question ${index + 1}:`, question);

  const singleQuestionTime = formatTime(questionTimes[index] || 0);
  console.log(`Time taken for question ${index + 1}:`, singleQuestionTime);

  // Ensure that each option is fully captured
  const optionsData = question?.options?.map((option, optionIndex) => ({
    option: option,  // Include the option text/label
    index: optionIndex,  // Include the option index
    isSelected: optionIndex === selectedOption,  // Flag to mark if it's selected
    isCorrect: optionIndex === question?.answer,  // Flag if the option is the correct one
  }));

  return {
    question: question?.question,
    options: optionsData,  // Store all options data
    plusmark: question?.plus_mark,
    minusmark: question?.minus_mark,
    answer: question?.answer,
    selectedOption: question?.options[selectedOption]?.index,  // Still store the selected option index
    correct: question?.answer === selectedOption ? 1 : 0,  // Check if answer is correct
    explanation: question?.explanation,
    isVisited: visitedQuestions?.includes(index) ? 1 : 0,  // Fixed visited logic
    q_on_time: singleQuestionTime,
  };
});

console.log("Processed answers data:", answersData);


  console.log("Processed answers data:", answersData);

  // Calculate total score
  const totalScore = selectedOptions.reduce((total, option, index) => {
    const currentQuestion = currentSection?.questions?.[selectedLanguage?.toLowerCase()]?.[index];
    console.log(`Calculating score for question ${index + 1}:`, currentQuestion);

    const plusmark = currentQuestion?.plus_mark || 1;
    console.log(`Plus mark for question ${index + 1}:`, plusmark);

    const minusmark = currentQuestion?.minus_mark || 0.25;
    console.log(`Minus mark for question ${index + 1}:`, minusmark);

    const scoreForThisQuestion = currentQuestion?.answer === option ? plusmark : -minusmark;
    console.log(`Score for question ${index + 1}:`, scoreForThisQuestion);

    return total + scoreForThisQuestion;
  }, 0);

  console.log("Total calculated score:", totalScore);

  // Submit the data using API call
  Api.post("results/", {
    userId: "67c5900a09a3bf8c7f605d71",  // Replace with actual userId
    ExamId: "67c5900a09a3bf8c7f605d71",  // Replace with actual examId
    answers: answersData,
    score: totalScore,
    timeTaken: formattedTotalTime,  // Ensure this is updated correctly
    attempted: selectedOptions.length,
    takenAt: examStartTime,
    submittedAt: endTime,
  })
    .then((res) => {
      console.log("Marks submitted successfully");
      console.log("Response Data:", res.data);

      // Format the response
      const formattedResponse = {
        userId: "yourUserId",  // Replace with actual userId
        ExamId: "yourExamId",  // Replace with actual examId
        answers: selectedOptions.map((selectedOption, index) => {
          const question = currentSection?.questions?.[selectedLanguage?.toLowerCase()]?.[index];
          return {
            question: question?.question,
            selectedOption: question?.options[selectedOption],
            correctOption: question?.answer,
          };
        }),
        score: totalScore,
        totalTime: formattedTotalTime,
        timeTakenInSeconds: timeTakenInSeconds,
        takenAt: examStartTime,
        submittedAt: endTime,
      };

      console.log("Formatted Response:", formattedResponse);
    })
    .catch((err) => {
      console.error("Error submitting marks:", err);
    });
};


// Using useEffect to trigger submitExam when needed


const [timeminus, settimeminus] = useState(0);

// Set initial time when section changes
useEffect(() => {
  const sectionTimeInSeconds = examData?.section[currentSectionIndex]?.t_time * 60; // Convert minutes to seconds
  console.log("Section time in seconds:", sectionTimeInSeconds);
  settimeminus(sectionTimeInSeconds); // Reset time when the section changes
}, [examData, currentSectionIndex]);

// Start the countdown timer
useEffect(() => {
  if (timeminus > 0) {
    const timerInterval = setInterval(() => {
      settimeminus((prevTime) => {
        const newTime = prevTime - 1;
        // console.log("Time left:", formatTime(newTime)); // Log the time in HH:MM:SS format
        return newTime;
      });
    }, 1000); // Update every second

    // Cleanup interval on component unmount or when timeLeft reaches 0
    return () => clearInterval(timerInterval);
  } else {
    // Automatically call handleSubmitSection when time reaches 0
    handleSubmitSection();
  }
}, [timeminus]);  // Runs whenever timeminus changes

// Trigger submission on timeLeft = 0 or when exam is submitted
useEffect(() => {
  if (timeLeft <= 0) {
    submitExam();
  }
}, [timeLeft]);


const [sectionSummary, setSectionSummary] = useState(null);

const showToast = () => {
  toast.success("Test Submitted");
setShowModal(false)
};

// Calculate starting index for the current section
const quantsSection = examData?.section?.[currentSectionIndex];
const isLastQuestion = 
  clickedQuestionIndex === quantsSection?.questions?.[selectedLanguage?.toLowerCase()]?.length - 1;
// console.log(isLastQuestion)
// console.log(quantsSection?.questions?.[selectedLanguage?.toLowerCase()]?.length); 
  return (
    <div className="container-fluid mock-font ">
        <div>
        <p className="text-lg">Selected Language: {selectedLanguage}</p>


  <div>
 

      {/* Modal for showing section summary */}
      {showModal && (
      <div
      className="modal"
      tabIndex="-1"
      id="staticBackdrop"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
      style={{
        display: 'block',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        minHeight: '100vh',
      }}
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="staticBackdropLabel">
              Section Submit
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => setShowModal(false)}
            ></button>
          </div>
          <div className="modal-body">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>Section Name</th>
                    <th>Total Ques</th>
                    <th>Answered</th>
                    <th>Not Answered</th>
                    <th>Visited Questions</th>
                    <th>Not Visited Questions</th>
                    <th>Marked for Review</th>
                  </tr>
                </thead>
                <tbody>
                  {sectionSummaryData.map((summary, index) => (
                    <tr key={index}>
                      <td>{summary.sectionName}</td>
                      <td>{summary.totalQuestions}</td>
                      <td>{summary.answeredQuestions}</td>
                      <td>{summary.notAnsweredQuestions}</td>
                      <td>{summary.visitedQuestionsCount}</td>
                      <td>{summary.notVisitedQuestions}</td>
                      <td>{summary.reviewedQuestions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="modal-footer">
            <div className="d-flex justify-content-center w-100">
              <button
                type="button"
                className="btn btn-success"
                data-bs-dismiss="modal"
                onClick={showToast} // Show toast when clicking "Submit"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
      )}
    </div>
      {/* Toast Container */}
      <ToastContainer />
    </div>
      <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="h4">Reading Ability! English Language!!</span>
                <div className="badge bg-warning fs-6 p-2">
                <div className="badge bg-warning fs-6 p-2">
          <h1>Time-Left: {formatTime(timeLeft)}</h1>
     

        </div>
                </div>
              </div>
      <div className="row">
    
        {/* Question Panel */}
        <div className="col-lg-9 col-md-8 p-4">
          {!isSubmitted ? (
            <>
            <div className="d-flex  justify-between">

          
            <h3>Question No: {clickedQuestionIndex + 1}/{examData?.t_questions}</h3>

<h1> <span className="border px-2 p-1">Qn Time:{formatTime(questionTime)}</span>
&nbsp;Marks&nbsp;
<span className="text-success">
  +{examData?.section && examData.section[currentSectionIndex]
    ? examData.section[currentSectionIndex].plus_mark
    : 'No plus marks'}
</span>
&nbsp;
<span className="text-danger">
  -{examData?.section && examData.section[currentSectionIndex]
    ? examData.section[currentSectionIndex].minus_mark
    : 'No minus marks'}
</span>
</h1>
              </div>
              {examData?.section[currentSectionIndex] ? (
                <div className="row">
               
               <div className="row">
  {/* Left side for Common Data */}
  {examData.section[currentSectionIndex]?.questions?.[selectedLanguage?.toLowerCase()]?.[clickedQuestionIndex - startingIndex]?.common_data && (
    <div className="col-lg-6 col-md-6" style={{ maxHeight: "420px", overflowY: "auto" }}>
      <h5>Common Data:</h5>
      
   

      <div
        className="fw-bold text-wrap"
        style={{
          whiteSpace: "normal",
          wordWrap: "break-word",
        }}
        dangerouslySetInnerHTML={{
          __html: examData.section[currentSectionIndex]?.questions?.[selectedLanguage?.toLowerCase()]?.[clickedQuestionIndex - startingIndex]?.common_data || "No common data available",
        }}
      />
    </div>
  )}

  {/* Right side for Question */}
  <div className="col-lg-6 col-md-6" style={{ maxHeight: "420px", overflowY: "auto" }}>
    <h5>Question:</h5>

    
    <div
      className="fw-bold text-wrap"
      style={{
        whiteSpace: "normal",
        wordWrap: "break-word",
      }}
      dangerouslySetInnerHTML={{
        __html: examData.section[currentSectionIndex]?.questions?.[selectedLanguage?.toLowerCase()]?.[clickedQuestionIndex - startingIndex]?.question || "No question available",
      }}
    />

    <h5>Options:</h5>

    {examData.section[currentSectionIndex]?.questions?.[selectedLanguage?.toLowerCase()]?.[clickedQuestionIndex - startingIndex]?.options ? (
      <div>
        {examData.section[currentSectionIndex]?.questions?.[selectedLanguage?.toLowerCase()]?.[clickedQuestionIndex - startingIndex]?.options.map((option, index) => (
          <div key={index}>
            <input
              type="radio"
              id={`option-${index}`}
              name="exam-option"
              value={index}
              checked={selectedOptions[clickedQuestionIndex] === index}
              onChange={() => {
                console.log('Selected Option Index:', index);
                handleOptionChange(index);
              }}
            />
            
            <label
              htmlFor={`option-${index}`}
              dangerouslySetInnerHTML={{
                __html: option || "No option available",
              }}
            />
          </div>
        ))}
      </div>
    ) : (
      <p>No options available</p>
    )}
  </div>
</div>


                </div>
              ) : (
                <p>No section data available</p>
              )}
            </>
          ) : (
            <div className="text-center">
              <h1 className="display-6 text-success">Test Completed!</h1>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="bg-light  shadow-sm col-lg-3" style={{ maxHeight: "450px", overflowY: "auto" }}>
        <div className="container mt-3">
      <h1 className=" bg-blue-400 text-center text-white p-2 ">Time Left:{formatTime(timeminus)}</h1>
      
    

          

      <div className="d-flex flex-wrap gap-2 px-3 py-2 text-center">

        {examData?.section[currentSectionIndex]?.questions?.[selectedLanguage?.toLowerCase()]?.map((_, index) => {
          const fullIndex = startingIndex + index; // Correct question index

          // Access the current section from the examData
          const currentSection = examData.section[currentSectionIndex];
          const timeFormatted = formatTime(timeLeft); // Format the remaining time for the current section

          // Set className based on question status
          let className = "";
          if (selectedOptions[fullIndex] !== undefined) {
            className = "answerImg"; 
            if (markedForReview.includes(fullIndex)) {
              className += " mdansmarkedImg";
            }
        
          } else if (visitedQuestions.includes(fullIndex)) {
            className = "notansImg"; // Visited but not answered
          } else {
            className = "notVisitImg"; // Not visited
          }

          // Mark for review
          if (markedForReview.includes(fullIndex)) {
            className += " reviewed mdmarkedImg";
          }
          

          return (

            <div key={fullIndex}>
              {/* Show countdown timer */}

              {/* Question number with click functionality */}
              <span
                onClick={() => {
                  console.log("Clicked question index:", fullIndex);
                  setClickedQuestionIndex(fullIndex);
                }}
                className={`fw-bold flex align-items-center justify-content-center ${className}`}
              >
                {fullIndex + 1}
              </span>
            </div>
          );
        })}
      </div>
    </div>

        </div>
      </div>

      {/* Footer Buttons */}
      <div className="fixed-bottom bg-white p-3">
        <div className="d-flex justify-content-between">
          <button onClick={handleClearResponse} className="btn bg-blue-300 fw-bold">
            Clear Response
          </button>
          <button onClick={handleMarkForReview} className="btn bg-blue-300 fw-bold">
            Mark for Review
          </button>
      
          {examData?.section?.[currentSectionIndex]?.questions?.[selectedLanguage?.toLowerCase()]?.length > 0 &&
  clickedQuestionIndex !==
    startingIndex +
      (examData?.section?.[currentSectionIndex]?.questions?.[selectedLanguage?.toLowerCase()]?.length || 0) - 1 && (
    <button onClick={handleNextClick} className="btn bg-blue-500 text-white fw-bold">
      Save & Next
    </button>
)}


          <button className="btn bg-blue-500 text-white fw-bold" onClick={handleSubmitSection}    data-bs-toggle="modal"
        data-bs-target="#staticBackdrop">
            {currentSectionIndex === examData?.section?.length - 1 ? "Submit Test" : "Submit Section"}
          </button>
         
        </div>
      </div>
    </div>
  );
};

export default Test;


// https://github.com/Manikandan-5/usertodo.git