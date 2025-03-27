import { useEffect, useState } from "react";
import Api from "../service/Api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useParams } from "react-router-dom";

const Mocksolution = () => {
    const [examData, setExamData] = useState(null);
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [clickedQuestionIndex, setClickedQuestionIndex] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [visitedQuestions, setVisitedQuestions] = useState([]);
    const [markedForReview, setMarkedForReview] = useState([]);
    const [ansmarkforrev, setAnsmarkforrev] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const location = useLocation();
    const selectedLanguage = location.state?.language || "English";
    // Fetch exam data
    const [isToggled, setIsToggled] = useState(false);

    const [check,setCheck]=useState(null)


    // exams/getExam/67c5900a09a3bf8c7f605d71
    useEffect(() => {
        Api.get(`results/65a12345b6c78d901e23f456/67c5900a09a3bf8c7f605d71`)
            .then((res) => {
                if (res.data) {
                    setExamData(res.data);
                    console.log(res.data);
                }
            })
            .catch((err) => console.error("Error fetching data:", err));
    }, []);

    const startingIndex =
        examData?.section
            ?.slice(0, currentSectionIndex)
            .reduce(
                (acc, section) =>
                    acc + section.questions?.[selectedLanguage?.toLowerCase()]?.length,
                0
            ) || 0;

    // Mark a question as visited when clicked
    useEffect(() => {
        if (!visitedQuestions.includes(clickedQuestionIndex)) {
            setVisitedQuestions((prev) => [...prev, clickedQuestionIndex]);
        }
    }, [clickedQuestionIndex]);

    const handleQuestionClick = (index) => {
        setClickedQuestionIndex(index);
    };

    // Function to handle toggle change
    const handleToggleChange = () => {
        console.error("Hello");
    
        // Toggle the state
        setIsToggled(!isToggled);
    
        // Reset to the first question (starting from the first section and question)
        if (examData && examData.section && examData.section.length > 0) {
            // Set the current section to the first section
            setCurrentSectionIndex(0);
            
            // Calculate the starting question index (first question of the first section)
            const startingIndex = 0; // First question of the first section
            setClickedQuestionIndex(startingIndex);
    
            // Optionally, reset other states if needed
            setCheck(null);    // Reset any selected question
            setIsClicked(false); // Reset clicked status for the question
        }
    
        // You can add any additional logic here (e.g., start the timer, etc.)
    };
    




    const [questionStartTime, setQuestionStartTime] = useState(new Date());
    const [questionTimes, setQuestionTimes] = useState({}); // Object to track each question's time
    const [isClicked, setIsClicked] = useState(false); // State to track if the radio button was clicked



    // Update question time when user switches questions


    const handleNextClick = () => {
        // Get the current section's total question count based on selected language
        const currentSection = examData?.section[currentSectionIndex];
        const questions = currentSection?.questions?.[selectedLanguage?.toLowerCase()] || [];
    
        // Check if there's a next question in the current section
        if (!examData || !currentSection || questions.length === 0) {
            console.log("No questions available in the current section.");
            return;
        }
    
        // Check if we've completed all questions in the current section
        if (clickedQuestionIndex < startingIndex + questions.length - 1) {
            // Move to the next question in the current section
            setClickedQuestionIndex(clickedQuestionIndex + 1);
        } else {
            // If we've completed the last question in the current section, move to the next section
            if (currentSectionIndex < examData.section.length - 1) {
                setCurrentSectionIndex(currentSectionIndex + 1); // Move to the next section
                setClickedQuestionIndex(0); 
                  // Calculate the starting question index for the next section
            const newStartingIndex = examData?.section
            ?.slice(0, currentSectionIndex + 1) // All previous sections
            .reduce(
              (acc, section) =>
                acc + section.questions?.[selectedLanguage?.toLowerCase()]?.length, // Sum of questions per section
              0
            );
  
          // Set the clicked question index to the first question of the next section
          setClickedQuestionIndex(newStartingIndex);// Reset the question index for the new section
            } else {
                console.log("Exam is complete!"); // Handle case if this is the last section
            }
        }
    
        // Reset the state for question selection and clicked status
        setCheck(null);
        setIsClicked(false);
    };
    
    
    

    const [examStartTime, setExamStartTime] = useState(null);
    const [totalTime, setTotalTime] = useState("");

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


    // Using useEffect to trigger submitExam when needed
    const [timeminus, settimeminus] = useState(0);
    useEffect(() => {
        const sectionTimeInSeconds =
            examData?.section[currentSectionIndex]?.t_time * 60; // Convert minutes to seconds
        settimeminus(sectionTimeInSeconds); // Reset time when the section changes
    }, [examData, currentSectionIndex]);



    const [sectionSummary, setSectionSummary] = useState(null);

   

    // Calculate starting index for the current section
    const quantsSection = examData?.section?.[currentSectionIndex];
    const isLastQuestion =
        clickedQuestionIndex ===
        quantsSection?.questions?.[selectedLanguage?.toLowerCase()]?.length - 1;

    const handlePreviousClick = () => {
        if (clickedQuestionIndex > startingIndex) {
            setClickedQuestionIndex((prevIndex) => prevIndex - 1);
        }
    };

    

    console.log(examData);

    return (
        <div className="container-fluid mock-font ">
            <div>
                <p className="text-lg">Selected Language: {selectedLanguage}</p>


                {/* Toast Container */}
                <ToastContainer />
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="h4">Reading Ability! English Language!!</span>
                <div className="text-center fs-6 p-2">
                    <h1>
                        Exam Name Show &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                        &nbsp; &nbsp;
                    </h1>
                </div>
            </div>
            <div className="row">
                {/* Question Panel */}
                <div className="col-lg-9 col-md-8 p-4">
                    {!isSubmitted ? (
                        <>
                            <div className="d-flex  justify-between">
                           <h3>
                  Question No: {clickedQuestionIndex + 1}/
                  {examData?.t_questions}
                </h3>

                                <h1>
                                    <span className="border p-1">
                                        &nbsp;Marks&nbsp;
                                        <span>
                                            +
                                            {examData?.section &&
                                                examData.section[currentSectionIndex]
                                                ? examData.section[currentSectionIndex].plus_mark
                                                : "No plus marks"}
                                        </span>
                                        &nbsp;
                                        <span>
                                            -
                                            {examData?.section &&
                                                examData.section[currentSectionIndex]
                                                ? examData.section[currentSectionIndex].minus_mark
                                                : "No minus marks"}
                                        </span>
                                    </span>{" "}
                                    <span className="border px-2 p-1">Correct</span>&nbsp;
                                    <span className="border px-2 p-1">In Correct</span>
                                    &nbsp;&nbsp;
                                    <span className="border px-2 p-1">Time : {examData?.section[currentSectionIndex]?.questions?.[
                                        selectedLanguage?.toLowerCase()
                                    ]?.[clickedQuestionIndex - startingIndex]?.q_on_time}</span>

                                </h1>
                                <div className="flex justify-center items-center ">
                                    <p>Re-Attempt   &nbsp;&nbsp;</p>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        {/* Hidden checkbox that will control the slider */}
                                        <input
                                            type="checkbox"
                                            checked={isToggled}
                                            onChange={handleToggleChange}
                                            className="sr-only"
                                        />
                                        {/* Slider container */}
                                        <div className={`w-14 h-7 rounded-full transition-all duration-300 ease-in-out ${isToggled ? "bg-green-500" : " bg-gray-200"}`}>
                                            {/* Slider knob */}
                                            <div
                                                className={`m-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ease-in-out ${isToggled ? "translate-x-7 bg-green-600" : "bg-gray-400"
                                                    }`}
                                            ></div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            {examData?.section[currentSectionIndex] ? (
                                <div className="row">
                                    <div className="row">
                                        {/* Left side for Common Data */}
                                        {examData.section[currentSectionIndex]?.questions?.[
                                            selectedLanguage?.toLowerCase()
                                        ]?.[clickedQuestionIndex - startingIndex]?.common_data && (
                                                <div
                                                    className="col-lg-6 col-md-6"
                                                    style={{ maxHeight: "420px", overflowY: "auto" }}
                                                >
                                                    <h5>Common Data:</h5>

                                                    <div
                                                        className="fw-bold text-wrap"
                                                        style={{
                                                            whiteSpace: "normal",
                                                            wordWrap: "break-word",
                                                        }}
                                                        dangerouslySetInnerHTML={{
                                                            __html:
                                                                examData.section[currentSectionIndex]
                                                                    ?.questions?.[
                                                                    selectedLanguage?.toLowerCase()
                                                                ]?.[clickedQuestionIndex - startingIndex]
                                                                    ?.common_data || "No common data available",
                                                        }}
                                                    />
                                                </div>
                                            )}

                                        {/* Right side for Question */}
                                        <div
                                            className={`${examData.section[currentSectionIndex]?.questions?.[
                                                selectedLanguage?.toLowerCase()
                                            ]?.[clickedQuestionIndex - startingIndex]?.common_data
                                                ? "col-lg-6 col-md-6"
                                                : "col-lg-12 col-md-12" // Make it full width when no common data
                                                }`}
                                            style={{ maxHeight: "420px", overflowY: "auto" }}
                                        >
                                            <h5>Question:</h5>

                                            <div
                                                className="fw-bold text-wrap"
                                                style={{
                                                    whiteSpace: "normal",
                                                    wordWrap: "break-word",
                                                }}
                                                dangerouslySetInnerHTML={{
                                                    __html:
                                                        examData.section[currentSectionIndex]?.questions?.[
                                                            selectedLanguage?.toLowerCase()
                                                        ]?.[clickedQuestionIndex - startingIndex]?.question || "No question available",
                                                }}
                                            />

                                            <h5>Options:</h5>

                                            {
    examData.section[currentSectionIndex]?.questions?.[
        selectedLanguage?.toLowerCase()
    ]?.[clickedQuestionIndex - startingIndex]?.options?.map((option, index) => {
        // Get the previously selected option from the API or state
        const selectedOption =
            examData.section[currentSectionIndex]?.questions?.[
                selectedLanguage?.toLowerCase()
            ]?.[clickedQuestionIndex - startingIndex]?.selectedOption;

        const answer =
            examData.section[currentSectionIndex]?.questions?.[
                selectedLanguage?.toLowerCase()
            ]?.[clickedQuestionIndex - startingIndex]?.answer;

        const isSelected = selectedOption === index; // Check if this option is selected
        const isCorrect = answer === index; // Check if this option is correct

        // Default option style
        let optionStyle = {};

   

        // If the selected option is incorrect, highlight it in red
        if (isSelected && !isCorrect) {
            optionStyle = {
                backgroundColor: "red", // Incorrect answer
                color: "white", // Optional, for better contrast
            };
            console.log('Incorrect Option Style:', optionStyle);
        }

        // If the selected option is correct, highlight it in green
        if (isSelected && isCorrect) {
            optionStyle = {
                backgroundColor: "green", // Correct answer
                color: "white", // Optional, for better contrast
            };
            console.log('Correct Option Style:', optionStyle);
        }

        // Always show the correct option in green if the user selected the wrong one
        if (!isSelected && isCorrect) {
            optionStyle = {
                backgroundColor: "green", // Correct answer
                color: "white", // Optional, for better contrast
            };
            console.log('Correct Option (User Incorrect) Style:', optionStyle);
        }


        // const iscorret = check === index;
        let changestyle = {}; // Default empty style

        if (check) {
            
          // If check has a value, check if it's an incorrect answer
          if (check === index && !isCorrect) {
            changestyle = {
              backgroundColor: 'red', // Incorrect answer
              color: 'white', // White text for contrast
            };
            console.log('Incorrect Option Style:', changestyle); // Log the incorrect style
            console.error("check",check,!isCorrect)
          }
         if (check && isCorrect) {
            changestyle = {
                backgroundColor: "green", // Correct answer
                color: "white", // Optional, for better contrast
            };
            console.log('Correct Option Style:', optionStyle);console.error("check",check,isCorrect)
        }
        
        } else {
          console.log('No value selected.'); // Log when no option is selected
        }
        
        console.error(check)
        // const isDisabled = !isToggled || (isSelected && !isToggled); 
        

        return (
            <div
  key={index}
  style={isToggled ? changestyle : optionStyle} // Apply styles based on toggle state
  className="rounded-lg m-2 p-1"
>
  <input
    type="radio"
    id={`option-${index}`}
    name="exam-option"
    value={index}
    checked={check === index}
    onChange={(e) => {
      setCheck(Number(e.target.value)); // Set the selected value
      setIsClicked(true); // Mark that the user clicked the option
      console.error("value", e.target.value); // Log the selected value
    }}
    disabled={!isToggled || isClicked} // Disable if toggle is off or if it's clicked already
  />
  
  <label
    htmlFor={`option-${index}`}
    dangerouslySetInnerHTML={{
      __html: option || "No option available",
    }}
  />
</div>

        );
    })
}
{check != null && examData?.section?.[currentSectionIndex]?.questions?.[selectedLanguage?.toLowerCase()]?.[clickedQuestionIndex - startingIndex]?.explanation ? (
    <>
        <h5 className="text-3xl font-semibold mt-4 mb-4">Explanation:</h5>
        <div
            className="fw-bold text-wrap"
            style={{
                whiteSpace: "normal",
                wordWrap: "break-word",
            }}
            dangerouslySetInnerHTML={{
                __html:
                    examData.section[currentSectionIndex]?.questions[
                        selectedLanguage?.toLowerCase()
                    ]?.[clickedQuestionIndex - startingIndex]?.explanation,
            }}
        />
    </>
) : check != null ? (
    <p>No explanation available</p>
) : null}

                                            {/* Explanation Section Below Options */}
                                            <div>
                                                {!isToggled && (
                                                    <>
                                                        <h5 className="text-3xl font-semibold mt-4 mb-4">Explanation:</h5>
                                                        {examData?.section?.[currentSectionIndex]?.questions?.[
                                                            selectedLanguage?.toLowerCase()
                                                        ]?.[clickedQuestionIndex - startingIndex]?.explanation ? (
                                                            <div
                                                                className="fw-bold text-wrap"
                                                                style={{
                                                                    whiteSpace: "normal",
                                                                    wordWrap: "break-word",
                                                                }}
                                                                dangerouslySetInnerHTML={{
                                                                    __html:
                                                                        examData.section[currentSectionIndex]?.questions[
                                                                            selectedLanguage?.toLowerCase()
                                                                        ]?.[clickedQuestionIndex - startingIndex]?.explanation,
                                                                }}
                                                            />
                                                        ) : (
                                                            <p>No explanation available</p>
                                                        )}
                                                    </>
                                                )}
                                            </div>
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
                <div
                    className="bg-light  shadow-sm col-lg-3"
                    style={{ maxHeight: "450px", overflowY: "auto" }}
                >
                    <div className="container mt-3">
                        <h1>Section Summary</h1>
                        <hr className="m-2" />

                        <div className="d-flex justify-content-between p-1">
                            <h1>Mark</h1>
                            <h1>{examData?.score}</h1>
                        </div>
                        <div className="d-flex justify-content-between p-1">
                            <h1>Attempted</h1>
                            <h1>{examData?.Attempted}</h1>
                        </div>
                        <div className="d-flex justify-content-between p-1">
                            <h1>Correct</h1>
                            <h1>6</h1>
                        </div>
                        <div className="d-flex justify-content-between p-1">
                            <h1>InCorrect</h1>
                            <h1>7</h1>
                        </div>
                        <div className="d-flex justify-content-between p-1">
                            <h1>You</h1>
                            <h1>67</h1>
                        </div>                                   

                        <div className="d-flex flex-wrap gap-2 px-3 py-2 text-center">
                            {examData?.section[currentSectionIndex]?.questions?.[selectedLanguage?.toLowerCase()]?.map((_, index) => {
                                const fullIndex = startingIndex + index; // Correct question index

                                // Access the current section and question data
                                const currentQuestion = examData.section[currentSectionIndex].questions[selectedLanguage?.toLowerCase()][fullIndex];
                                console.log(currentQuestion);

                                // Initialize className variable to store the dynamically set class
                                let className = "";

                                // Determine the class based on whether the question is answered, visited, or skipped
                                if (selectedOptions[fullIndex] !== undefined) {
                                    className = "answerImg"; // Class for answered questions
                                    if (markedForReview.includes(fullIndex)) {
                                        className += " mdansmarkedImg"; // Add marked class if it's marked for review
                                    }
                                } else if (visitedQuestions.includes(fullIndex)) {
                                    className = "notansImg"; // Class for visited but not answered questions
                                } else {
                                    className = "notVisitImg"; // Class for unvisited questions
                                }

                                // If the question is skipped, change its class
                                if (currentQuestion?.isSkipped) {
                                    className = "skippedImg"; // Custom class for skipped questions (you can adjust as needed)
                                }

                                // If the question is marked for review, add a specific class
                                if (currentQuestion?.isMarkedForReview) {
                                    className += " reviewed mdmarkedImg"; // Additional class for questions marked for review
                                }

                                return (
                                    <div key={fullIndex}>
                                        {/* Question number with click functionality */}
                                        <span
                                            onClick={() => {
                                                console.log("Clicked question index:", fullIndex);
                                                setClickedQuestionIndex(fullIndex); // Set clicked question index
                                            }}
                                            className={`fw-bold flex align-items-center justify-content-center ${className}`}
                                        >
                                            {fullIndex + 1}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="container mt-3 bg-gray-100">
                            <div className="container mt-3">
                                <div className="row align-items-center">
                                    <div className="col-md-6">
                                        <div className="smanswerImg"></div>
                                        <p>Correct</p>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="smnotansImg"></div>
                                        <p>Wrong</p>
                                    </div>
                                </div>
                            </div>

                            <div className="container mt-3">
                                <div className="row align-items-center">
                                    <div className="col-md-6">
                                        <div className="smnotVisitImg"></div>
                                        <p>Unseen</p>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="smskipimg"></div>
                                        <p>Skipped</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Buttons */}
            <div className="fixed-bottom bg-white p-3">
                <div className="d-flex justify-content-center">
                    {/* Previous Button */}
                    <button
                        className="border-4 border-blue-400 text-blue-400 hover:bg-blue-400 fw-bold p-1 rounded hover:text-white disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-200"
                        onClick={handlePreviousClick} // Ensure this function is defined to handle the logic for going to the previous question
                        disabled={clickedQuestionIndex === startingIndex} // Disable if it's the first question
                    >
                        Previous
                    </button>
                    &nbsp; &nbsp;
                    {/* Next Button */}

                    <button
                        onClick={handleNextClick}
                        className="border-4 border-blue-400 text-blue-400 hover:bg-blue-400 fw-bold p-1 rounded hover:text-white disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-200"
                    >
                        Next
                    </button>

                </div>
            </div>
        </div >
    );
};

export default Mocksolution;
