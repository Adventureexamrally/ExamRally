import { useEffect, useState } from "react";
import Api from "../service/Api";
import "react-toastify/dist/ReactToastify.css";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import logo from '../assets/logo/bg-logo.png'; 

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
    const [isDataFetched, setIsDataFetched] = useState(false);

    const [check,setCheck]=useState(null)
    const [show_name,setShow_name] = useState("")
    const [t_questions,sett_questions]=useState("")
    const { id } = useParams();
    const navigate = useNavigate();
    // exams/getExam/67c5900a09a3bf8c7f605d71
    useEffect(() => {
        Api.get(`results/65a12345b6c78d901e23f456/${id}`)
            .then((res) => {
                if (res.data) {
                    setExamData(res.data);
                    console.log(res.data);
                }
            })
            .catch((err) => console.error("Error fetching data:", err));
    }, [id]);

useEffect(() => {
  // Check if data has already been fetched
  if (!isDataFetched) {
    Api.get(`exams/getExam/${id}`)
      .then((res) => {
        if (res.data) {
          setExamData(res.data);
          setIsDataFetched(true); 
          setShow_name(res.data.show_name) // Mark that data is fetched
          console.error("valueee",res.data.show_name)
          sett_questions(res.data.t_questions)
          console.error("kl",res.data.t_question);
        }
      })
      .catch((err) => console.error("Error fetching data:", err));
  }
}, [id]); 

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
        // if (examData && examData.section && examData.section.length > 0) {
            // Set the current section to the first section
            setCurrentSectionIndex(0);
            
            // Calculate the starting question index (first question of the first section)
            const startingIndex = 0; // First question of the first section
            setClickedQuestionIndex(startingIndex);
    
            // Optionally, reset other states if needed
            setCheck(null);    // Reset any selected question
            setIsClicked(false); // Reset clicked status for the question

             // Reset all tracking states
            setVisitedQuestions([0]); // Clear visited questions
             setMarkedForReview([]); // Clear marked for review
              setAnsmarkforrev([]); // Clear answered and marked for review
            setQuestionTimes({});
            setSelectedOptions([]); // Clear question times
        // }
    
        // You can add any additional logic here (e.g., start the timer, etc.)
    };

    
    const [resultData, setResultData] = useState({
        correct: [],
        incorrect: [],
        skipped: [],
        Not_Attempted: [],
        Attempted: [],
        s_score:[]
    });
    
    useEffect(() => {
        Api.get(`results/65a12345b6c78d901e23f456/${id}`)
            .then((res) => {
                if (res.data) {
                    setExamData(res.data);
                    // Store the section-specific question status arrays
                    const sectionData = res.data.section[currentSectionIndex];
                    if (sectionData) {
                        setResultData({
                            correct: sectionData.correct,
                            incorrect: sectionData.incorrect,
                            skipped: sectionData.skipped,
                            Attempted: sectionData.Attempted,
                            Not_Attempted: sectionData.Not_Attempted,
                            s_score: sectionData.s_score
                        });
                    }
                }
            })
            .catch((err) => console.error("Error fetching data:", err));
    }, [id, currentSectionIndex]);
        
  

        
  

   




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
            console.error("ullae if)")
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
                console.error("Exam is complete!"); // Handle case if this is the last section
                navigate("/"); // Navigate to the homepage
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

    const [questionStatuses, setQuestionStatuses] = useState({});

    // Update question status when an option is selected
    useEffect(() => {
        if (check !== null) {
            const currentQuestion = examData?.section[currentSectionIndex]?.questions?.[selectedLanguage?.toLowerCase()]?.[clickedQuestionIndex - startingIndex];
            if (currentQuestion) {
                const isCorrect = check === currentQuestion.answer;
                setQuestionStatuses(prev => ({
                    ...prev,
                    [clickedQuestionIndex]: {
                        attempted: true,
                        correct: isCorrect
                    }
                }));
            }
        }
    }, [check, clickedQuestionIndex, currentSectionIndex, examData, selectedLanguage]);

    return (
        <div className="p-1 mock-font ">
            <div>
               
                <div className="bg-blue-400 text-white font-bold h-12 w-full flex justify-evenly items-center">
  <h1 className="h3 font-bold mt-3">{show_name}</h1>
  <img src={logo} alt="logo" className="h-10 w-auto bg-white" />
</div>
             
            </div>
            
            <div className="mb-3 mt-1">
            <div className="d-flex justify-content-start align-items-center m-2 flex-wrap">
  {examData?.section?.map((section, index) => (
    <h1 key={index} className="h6 bg-blue-400 p-1 text-white border">
      ✔ {section.name}
    </h1>
  ))}
</div>
   
     




<div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Review Section</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <form>
          <div className="mb-3">
            <label for="userInput" className="form-label">Please descripe it below!!</label>
            <input type="text" className="form-control" id="userInput" placeholder="Enter Review!!"/>
          </div>
        </form>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" className="btn bg-green-400 text-white hover:bg-green-500">Submit</button>
      </div>
    </div>
  </div>
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
                  {t_questions}
                </h3>

                               
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
                                                    style={{ maxHeight: "380px", overflowY: "auto" }}
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
                                            style={{ maxHeight: "380px", overflowY: "auto" }}
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
          }
         if (check && isCorrect) {
            changestyle = {
                backgroundColor: "green", // Correct answer
                color: "white", // Optional, for better contrast
            };
        }
        
        } else {
            // If check is not set, apply the default style
            optionStyle = {};
        }
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
      
      setSelectedOptions(prev => ({
        ...prev,
        [clickedQuestionIndex]: Number(e.target.value)
    }));

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
                                                                className="fw-bold text-wrap mb-2"
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
                                                        <div className="text-center">
                                                        <a href="#" data-bs-toggle="modal" data-bs-target="#exampleModal" className="bg-green-500 p-1 px-2 text-white text-decoration-underline">
                                                             Review
                                                            </a>
                                                        </div>
                                                          
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
                            <h1>{resultData?.s_score}</h1>
                        </div>
                        <div className="d-flex justify-content-between p-1">
                            <h1>Attempted</h1>
                            <h1>{resultData?.Attempted}</h1>
                        </div>
                        <div className="d-flex justify-content-between p-1">
                            <h1>Correct</h1>
                            <h1>{resultData?.correct}</h1>
                        </div>
                        <div className="d-flex justify-content-between p-1">
                            <h1>InCorrect</h1>
                            <h1>{resultData?.incorrect}</h1>
                        </div>
                        <div className="d-flex justify-content-between p-1">
                            <h1>You</h1>
                            <h1>67</h1>
                        </div>                                   

                       

                        <div className="d-flex flex-wrap gap-2 px-3 py-2 text-center">
    {examData?.section[currentSectionIndex]?.questions?.[selectedLanguage?.toLowerCase()]?.map((question, index) => {
        // Calculate the actual question number including previous sections
        const actualQuestionNumber = startingIndex + index + 1;
        const currentQuestion = examData.section[currentSectionIndex].questions[selectedLanguage?.toLowerCase()][index];
        const answer = currentQuestion?.answer;
        
         
        
        let className = "";


       
        if (!isToggled) {
            // Default view - show correct/incorrect/skipped status
           
                if (answer === currentQuestion.selectedOption) {
                    className = "answerImg"; // Correct answer                  
             } else if(currentQuestion?.isVisited == 1 && currentQuestion?.selectedOption == null){
                className = "skipImg";
            }
              else if (answer !== currentQuestion.selectedOption && currentQuestion?.NotVisited == 0)  {
                    className = "notansImg"; // Wrong answer
                }
                
             
              else     {
                className = "notVisitImg"; // Not visited
            }
            
        } else {
            // Re-attempt mode
            if (selectedOptions[startingIndex + index] !== undefined) {
                className = "answerImg";
                if (markedForReview.includes(startingIndex + index)) {
                    className += " mdansmarkedImg";
                }
            } else if (visitedQuestions.includes(startingIndex + index)) {
                className = "notansImg";
            } else {
                className = "notVisitImg";
            }
        }
        
              // if (resultData?.section.isVisited - resultData?.section.Attempted){
        //     className = "skipImg"; // Skipped question - visited but no answer selected
        // }
        return (
            <div key={index}>
                <span
                    onClick={() => {
                        setClickedQuestionIndex(startingIndex + index);
                        // handleNextClick()
                        
                        if (!visitedQuestions.includes(startingIndex + index)) {
                            setVisitedQuestions(prev => [...prev, startingIndex + index]);
                        }
                
             
                     
                    }}
                    className={`fw-bold flex align-items-center justify-content-center ${className}`}
                >
                    {actualQuestionNumber}
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
                <div className="d-flex justify-content-around">
                    {/* Previous Button */}
                    <button
                        className="border-4 border-blue-400 text-blue-400 hover:bg-blue-400 fw-bold p-1 rounded hover:text-white disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-200"
                        onClick={handlePreviousClick} // Ensure this function is defined to handle the logic for going to the previous question
                        disabled={clickedQuestionIndex === startingIndex} // Disable if it's the first question
                    >
                        Previous Ques
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
