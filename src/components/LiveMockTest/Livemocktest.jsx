import { useContext, useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import logo from "../../assets/logo/sample-logo.png";
import Swal from "sweetalert2";
import {
  FaChevronLeft,
  FaChevronRight,
  FaCompress,
  FaExpand,
  FaInfoCircle,
} from "react-icons/fa";
import { UserContext } from "../../context/UserProvider";
import Api from "../../service/Api";
import { Avatar } from "@mui/material";
import axios from "axios";
const Livemocktest = () => {
  const [examData, setExamData] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [clickedQuestionIndex, setClickedQuestionIndex] = useState(0);
  // const [selectedOptions, setSelectedOptions] = useState([]);
  const [visitedQuestions, setVisitedQuestions] = useState([]);
  const [markedForReview, setMarkedForReview] = useState([]);
  const [ansmarkforrev, setAnsmarkforrev] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sectionTimes, setSectionTimes] = useState({});
  const currentSectionStartTimeRef = useRef(new Date()); // Add this at top with other hooks
  const [text, setText] = useState([]);
  const [scoreData, setScoreData] = useState({});
  const [corrections, setCorrections] = useState([]);
  const [scoreBreakdown, setScoreBreakdown] = useState(null);
  const { user } = useContext(UserContext);
  const [wordCount, setWordCount] = useState(0);
  const [descriptiveData, setDescriptiveData] = useState([]);
  const location = useLocation();
  const  selectedLanguage= location.state?.language || "English";
  const [previousQuestionIndex, setPreviousQuestionIndex] = useState(clickedQuestionIndex);
const timerRef = useRef(null);
  // Fetch exam data
// const [selectedLanguage, setselectedLanguage] = useState(currentLanguage);
const [displayLanguage, setDisplayLanguage] = useState(null);

useEffect(() => {
  const sectionName = examData?.section?.[currentSectionIndex]?.name?.toLowerCase().trim();
  if (sectionName === "english language") {
    setDisplayLanguage("English");
  } else {
    setDisplayLanguage(displayLanguage); // fallback to selectedLanguage
  }
}, [currentSectionIndex, examData]);

  const { id } = useParams();
  const navigate = useNavigate();
  // Prevent page refresh on F5 and refresh button click
  // Prevent page refresh on F5, Ctrl+R, and Ctrl+Shift+R
  // window.addEventListener("beforeunload", function (e) {
  //   // Customize the confirmation message
  //   var confirmationMessage = "Are you sure you want to leave?";

  //   // Standard for most browsers
  //   e.returnValue = confirmationMessage;

  //   // For some browsers
  //   return confirmationMessage;
  // });

  // Prevent F5, Ctrl+R, Ctrl+Shift+R key presses
  window.addEventListener("keydown", function (e) {
    // Check if F5 or Ctrl+R or Ctrl+Shift+R is pressed
    if (
      e.key === "F5" ||
      (e.ctrlKey && e.key === "r") ||
      (e.ctrlKey && e.shiftKey && e.key === "R")
    ) {
      e.preventDefault(); // Prevent F5, Ctrl+R, or Ctrl+Shift+R
    }
  });

  const toggleMenu = () => {
    setIsMobileMenuOpen((prevState) => !prevState);
  };

  const [closeSideBar, setCloseSideBar] = useState(false);
  const toggleMenu2 = () => {
    setCloseSideBar(!closeSideBar);
  };

  const [isDataFetched, setIsDataFetched] = useState(false);
  const [show_name, setShow_name] = useState("");
  const [t_questions, sett_questions] = useState("");
  useEffect(() => {
    // Check if data has already been fetched
    if (!isDataFetched) {
      Api.get(`exams/getExam/${id}`)
        .then((res) => {
          if (res.data) {
            setExamData(res.data);
            console.log("res.data", res.data);
            setIsDataFetched(true);
            setShow_name(res.data.show_name);
            sett_questions(res.data.t_questions); // Mark that data is fetched
            console.log("kl", res.data.show_name);
          }
        })
        .catch((err) => console.error("Error fetching data:", err));
    }
  }, [id]); // Only trigger when `id` changes

  const [getresult, setGetresult] = useState([]);
  // In the useEffect that fetches exam state
  useEffect(() => {
    if (user?._id && id) {
      Api.get(`results/${user?._id}/${id}`)
        .then(response => {
          if (response.data) {
            const state = response.data;
            setGetresult(state)
            console.error("hello",state);
            const initialOptions = Array(t_questions).fill(null);
            // let lastVisitedIndex = 0;
            // let visitedQuestionsList = [];
            let markedForReviewList = [];
            let absoluteIndexCounter = 0;
  // Parse question times from backend
          const questionTimesFromDB = {};
          let absoluteIndex = 0;
          
          state.section.forEach((section) => {
            const questions = section.questions?.[selectedLanguage?.toLowerCase()] || [];
            console.log("Questions:", questions);
            
            questions.forEach((question) => {
              if (question.q_on_time) {
                console.log("Question time:", question.q_on_time);
                
                // Parse time string "minutes:seconds" to total seconds
                const [minutes, seconds] = question.q_on_time.split(':').map(Number);
                questionTimesFromDB[absoluteIndex] = minutes * 60 + seconds;
              }
              absoluteIndex++;
            });
          });
          console.log("Question times from DB:", questionTimesFromDB);
          
          setQuestionTimes(questionTimesFromDB);
            if (state.section) {
              state.section.forEach((section) => {
                const questions = section.questions?.[selectedLanguage?.toLowerCase()] || [];
                questions.forEach((question, questionIndex) => {
                  const absoluteIndex = absoluteIndexCounter++;

                  // Set selected option if exists
                  if (question.selectedOption !== undefined && question.selectedOption !== null) {
                    initialOptions[absoluteIndex] = question.selectedOption;
                  }

                  // Track visited questions
                  // if (question.isVisited === 1) {
                  //   visitedQuestionsList.push(absoluteIndex);
                  //   lastVisitedIndex = absoluteIndex; // Track most recently visited
                  // }

                  // Track marked for review
                  // if (question.markforreview === 1 || question.ansmarkforrev === 1) {
                  //   markedForReviewList.push(absoluteIndex);
                  // }
                });
              });
            }

            setSelectedOptions(initialOptions);
            // setVisitedQuestions(visitedQuestionsList);
            // setMarkedForReview(markedForReviewList);
            // setCurrentSectionIndex(state.currentSectionIndex || 0);

            // // Show the last visited question, or first question if none visited
            // setClickedQuestionIndex(visitedQuestionsList.length > -1 ? lastVisitedIndex : 0);
        //     if (visitedQuestionsList.length > 0) {
        //   setClickedQuestionIndex(visitedQuestionsList[0]   || lastVisitedIndex); // First visited question
        // } else {
        //   setClickedQuestionIndex(lastVisitedIndex); // Default to first question
        //   setVisitedQuestions([0]);  // Mark it as visited
        // }
          }
        })

        .catch(error => console.error('Error fetching exam state:', error));
    }
  }, [id, user?._id, t_questions]);

  const commonDataRef = useRef(null);

  const toastId = useRef(null); // Keep track of toast ID

  useEffect(() => {
    const handleWheel = (e, ref) => {
      e.preventDefault(); // Prevent mouse wheel scrolling

      // Only show toast if no toast is currently active
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.info(
          "Scrolling with the mouse wheel is disabled. Use the scrollbar instead.",
          {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            theme: "colored",
          }
        );
      }
    };

    // Attach event listeners to all scrollable elements
    const commonDataElement = commonDataRef.current;

    if (commonDataElement) {
      commonDataElement.addEventListener(
        "wheel",
        (e) => handleWheel(e, commonDataRef),
        { passive: false }
      );
    }

    return () => {
      if (commonDataElement) {
        commonDataElement.removeEventListener("wheel", (e) =>
          handleWheel(e, commonDataRef)
        );
      }
    };
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

  useEffect(() => {
    const savedState = localStorage.getItem(`examState_${id}`);
    console.warn(savedState)
    if (savedState) {
      const state = JSON.parse(savedState);
      setClickedQuestionIndex(state.clickedQuestionIndex);
      setSelectedOptions(state.selectedOptions);
      setVisitedQuestions(state.visitedQuestions);
      setMarkedForReview(state.markedForReview);
      setCurrentSectionIndex(state.currentSectionIndex);
    }
  }, [id]);

  // Modify handleOptionChange to update database
  const handleOptionChange = async (index) => {
    setSelectedOptions((prev) => {
      const updatedOptions = [...prev];
      updatedOptions[clickedQuestionIndex] = index;
      // Find current section
      const currentSection = examData.section[currentSectionIndex];
      // Find relative question index
      const relativeIndex = clickedQuestionIndex - startingIndex;
      const currentQuestion = currentSection.questions[selectedLanguage.toLowerCase()][relativeIndex];

      // Use section-specific marks
      const plus_mark = currentSection.plus_mark;
      const minus_mark = currentSection.minus_mark;

      let mark = 0;
      if (currentQuestion.answer === index) {
        mark = plus_mark;
      } else {
        mark = -minus_mark;
      }

      // Update the database with the new selection
      const result=Api.post(`results/${user?._id}/${id}`, {
        selectedOptions: updatedOptions,
        currentQuestionIndex: clickedQuestionIndex,
        sectionIndex: currentSectionIndex,
        mark
      });
console.log("handle option change result",result);

      return updatedOptions;
    });

    // let mark = 0;

    // Check if the selected option matches the correct answer
    // if (correctAnswerIndex === index) {
    //   mark = 1.0; // Correct answer gets 1 mark
    //   console.log("Correct Answer", correctAnswerIndex === index);
    // } else {
    //   mark = -0.25; // Incorrect answer gets -0.25 mark
    // }

    // Send the selected option along with the question data to the API
    // const currentQuestionData = {
    //   question: currentQuestion?.question,
    //   options: currentQuestion?.options,
    //   correctOption: currentQuestion?.answer,
    //   selectedOption: currentQuestion?.options[index], // Store the selected option
    //   isVisited: visitedQuestions.includes(clickedQuestionIndex), // Mark the question as visited
    //   markforreview: markedForReview.includes(clickedQuestionIndex),
    //   ansmarkforrev: ansmarkforrev.includes(clickedQuestionIndex),
    // };
  };

  const [questionStartTime, setQuestionStartTime] = useState(new Date());
  const [questionTimes, setQuestionTimes] = useState({}); // Object to track each question's time

  useEffect(() => {
    if (!examStartTime) {
      setExamStartTime(new Date()); // Store when the exam starts
    }
  }, []);

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

  // 2. Update section time tracking useEffect - REPLACE THIS SECTION
  useEffect(() => {
    const handleSectionTiming = () => {
      const now = new Date();
      const prevSectionIndex = currentSectionIndex - 1;

      if (prevSectionIndex >= 0) {
        const timeSpent = Math.floor(
          (now - currentSectionStartTimeRef.current) / 1000
        );

        setSectionTimes((prev) => ({
          ...prev,
          [prevSectionIndex]: (prev[prevSectionIndex] || 0) + timeSpent,
        }));
      }

      // Reset timer for new section
      currentSectionStartTimeRef.current = new Date();
    };

    handleSectionTiming();
  }, [currentSectionIndex]);

  // 3. Add cleanup effect for final section timing - ADD THIS NEW EFFECT
  useEffect(() => {
    return () => {
      const now = new Date();
      const timeSpent = Math.floor(
        (now - currentSectionStartTimeRef.current) / 1000
      );

      setSectionTimes((prev) => ({
        ...prev,
        [currentSectionIndex]: (prev[currentSectionIndex] || 0) + timeSpent,
      }));
    };
  }, [currentSectionIndex]);

  // 4. Update initial data load useEffect - MODIFY THIS EXISTING EFFECT
  useEffect(() => {
    if (examData) {
      const initialTimes = {};
      examData.section.forEach((_, index) => {
        initialTimes[index] = 0;
      });
      setSectionTimes(initialTimes);
      currentSectionStartTimeRef.current = new Date(); // Initialize ref here
    }
  }, [examData]);

  // API get method

  useEffect(() => {
    const fetchData = async () => {
      if (user?._id) {
        try {
          // Fetch the exam data from your API
          const res = await Api.get(`exams/getExam/${id}`);
          console.log(res);

          // Transform the data
          const transformedData = {
            bilingual_status:res.data.bilingual_status,
            english_status:res.data.english_status,
            hindi_status:res.data.hindi_status,
            tamil_status:res.data.tamil_status,
            section: res.data.section.map((section) => ({
              name: section.name,
              t_question: section.t_question,
              t_time: section.t_time,
              t_mark: section.t_mark,
              plus_mark: section.plus_mark,
              minus_mark: section.minus_mark,
              cutoff_mark: section.cutoff_mark,
              s_blueprint: section.s_blueprint.map((blueprint) => ({
                subject: blueprint.subject,
                topic: blueprint.topic,
                tak_time: blueprint.tak_time,
              })),
              questions: {
                english: section.questions.english.map((question) => ({
                  question: question.question,
                  options: question.options,
                  correct: question.correct,
                  Incorrect: 0,
                  answer: question.answer,
                  common_data: question.common_data,
                  explanation: question.explanation,
                  selectedOption: question.selectedOption,
                  keywords: question.keywords,
                  words_limit: question.words_limit,
                  question_type: question.question_type,
                  isVisited: 0,
                  NotVisited: 0,
                  q_on_time: 0,
                })),
                hindi: section.questions.hindi.map((question) => ({
                  question: question.question,
                  options: question.options,
                  correct: question.correct,
                  Incorrect: 0,
                  answer: question.answer,
                  common_data: question.common_data,
                  explanation: question.explanation,
                  selectedOption: question.selectedOption,
                  keywords: question.keywords,
                  words_limit: question.words_limit,
                  question_type: question.question_type,
                  isVisited: 0,
                  NotVisited: 0,
                  q_on_time: 0,
                })),
                tamil: section.questions.tamil.map((question) => ({
                  question: question.question,
                  options: question.options,
                  correct: question.correct,
                  Incorrect: 0,
                  answer: question.answer,
                  common_data: question.common_data,
                  explanation: question.explanation,
                  selectedOption: question.selectedOption,
                  keywords: question.keywords,
                  question_type: question.question_type,
                  words_limit: question.words_limit,
                  isVisited: 0,
                  NotVisited: 0,
                  q_on_time: 0,
                })),
              },
              s_order: section.s_order || 0,
            })),
            score: res.data.score || 0,
            Attempted: res.data.Attempted || 0,
            // timeTaken: res.data.timeTaken || 60,
            Accuracy: res.data.Accuracy || 0,
            takenAt: res.data.takenAt || new Date(),
            submittedAt: res.data.submittedAt || new Date(),
          };

          // Set the transformed data to state
          setExamData(transformedData);
          console.log(transformedData);

          // Set totalQuestions from the response
          setTotalQuestions(res.data.t_questions || 0);

          // Initialize selectedOptions with null for all questions
          const initialOptions = Array(res.data.t_questions).fill(null);
          setSelectedOptions(initialOptions);

          // Now post the transformed data to your '/results' endpoint
          const postResponse = await Api.post(
            `/results/${user?._id}/${id}`,
            transformedData
          );
          console.log("Data posted successfully:", postResponse);
        } catch (error) {
          console.error("Error occurred:", error.message);
          // Handle error (show error message, etc.)
        }
      }
    };

    // Call the async function inside useEffect
    fetchData();
  }, [id]); // Ensure to add 'id' as a dependency for the effect

  const handleSubmitTest = () => {
    updateSectionTime();
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

  // const handleNextClick = () => {
  //   updateSectionTime();
  //   if (
  //     examData &&
  //     examData.section[currentSectionIndex] &&
  //     examData.section[currentSectionIndex].questions?.[
  //       selectedLanguage?.toLowerCase()
  //     ]
  //   ) {
  //     const totalQuestions =
  //       examData.section[currentSectionIndex].questions[
  //         selectedLanguage?.toLowerCase()
  //       ]?.length;

  //     if (clickedQuestionIndex < startingIndex + totalQuestions - 1) {
  //       // Save current question time before moving to next
  //       setQuestionTimes((prevTimes) => ({
  //         ...prevTimes,
  //         [clickedQuestionIndex]: questionTime,
  //       }));
  //       setClickedQuestionIndex(clickedQuestionIndex + 1);
  //       setQuestionTime(0);
  //     } else {
  //       // If it's the last question, reset to the first question
  //       setClickedQuestionIndex(startingIndex);
  //     }
  //   }
  // };
const handleNextClick = () => {
  updateSectionTime();

  if (
    examData &&
    examData.section[currentSectionIndex] &&
    examData.section[currentSectionIndex].questions?.[
      selectedLanguage?.toLowerCase()
    ]
  ) {
    const totalQuestions =
      examData.section[currentSectionIndex].questions[
        selectedLanguage?.toLowerCase()
      ]?.length;

    if (clickedQuestionIndex < startingIndex + totalQuestions - 1) {
      setClickedQuestionIndex(clickedQuestionIndex + 1);
    } else {
      setClickedQuestionIndex(startingIndex);
    }
  }
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
  const [isPaused, setIsPaused] = useState(false);
  const questionTimerRef = useState(null);

  // let questionTimerInterval;

  // useEffect(() => {
  //   // setQuestionTime(0);
  //   setQuestionTimerActive(true);
  //   // Reset time when switching questions
  //   if (questionTimerActive && !isPaused) {
  //     questionTimerRef.current = setInterval(() => {
  //       setQuestionTime((prev) => prev + 1);
  //     }, 1000);
  //   }

  //   return () => clearInterval(questionTimerRef.current); // Cleanup interval on unmount
  // }, [questionTimerActive, isPaused]);

  const datatime = examData?.duration ?? 0;
  const [timeLeft, setTimeLeft] = useState(datatime * 60);

  // const formatTime = (durationInSeconds) => {
  //   const hours = Math.floor(durationInSeconds / 3600);
  //   const minutes = Math.floor((durationInSeconds % 3600) / 60);
  //   const seconds = durationInSeconds % 60;

  //   return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2, "0")}`;
  // };

  useEffect(() => {
    setTimeLeft(datatime * 60); // Reset when duration changes
  }, [datatime]);

  const [examDataSubmission, setExamDataSubmission] = useState(null); // Define examDataSubmission state

  // useEffect(() => {

  const [selectedOptions, setSelectedOptions] = useState(
    Array(totalQuestions).fill(null)
  );

  // useEffect(() => {
  //   console.log('selectedOptions:', selectedOptions); // Log the selectedOptions to verify

  //   if (!id) return;

  //   const storedSelectedOptions = localStorage.getItem(`selectedOptions_${id}`);
  //   if (storedSelectedOptions) {
  //     try {
  //       const parsedOptions = JSON.parse(storedSelectedOptions);
  //       setSelectedOptions(parsedOptions);
  //     } catch (e) {
  //       console.error('Error parsing stored selected options:', e);
  //       // Initialize with null for all questions if parsing fails
  //       const initialOptions = Array(totalQuestions).fill(null);
  //       setSelectedOptions(initialOptions);
  //     }
  //   } else {
  //     // Initialize with null for all questions if no data in localStorage
  //     const initialOptions = Array(totalQuestions).fill(null);
  //     setSelectedOptions(initialOptions);
  //   }
  // }, [id, totalQuestions]);

  // useEffect(() => {
  //   if (!id) return;

  //   if (selectedOptions.length > 0) {
  //     // Store selected options along with question number
  //     const combinedData = selectedOptions.map((selectedOption, index) => ({
  //       questionNumber: index,
  //       selectedOption: selectedOption, // Could be null or the selected value
  //     }));

  //     // Save combined data to localStorage
  //     localStorage.setItem(`selectedOptions_${id}`, JSON.stringify(combinedData));
  //   } else {
  //     // Remove the stored data from localStorage if no selections
  //     localStorage.removeItem(`selectedOptions_${id}`);
  //   }
  // }, [selectedOptions, id]);

  useEffect(() => {
    if (!id) return;
    const initialOptions = Array(totalQuestions).fill(null);
    setSelectedOptions(initialOptions);
  }, [id, totalQuestions]);

  useEffect(() => {
    if (!id) return;

    if (selectedOptions.length > 0) {
      const combinedData = selectedOptions.map((selectedOption, index) => ({
        questionNumber: index,
        selectedOption: selectedOption, // Could be null or the selected value
      }));
    }
  }, [selectedOptions, id]);

  // Function to update selected option for a specific question
  const updateSelectedOption = (newSelectedOption, questionIndex) => {
    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions[questionIndex] = newSelectedOption; // Update specific question's selectedOption
    setSelectedOptions(updatedSelectedOptions);
  };

  // Your submitExam function with the necessary modifications
const handleSubmitSection = () => {
  const now = new Date();
  const questionsForSection =
    examData?.section[currentSectionIndex]?.questions?.[
      selectedLanguage?.toLowerCase()
    ] || [];
  const sectionStartIndex = startingIndex;
  const sectionEndIndex = sectionStartIndex + questionsForSection.length - 1;

  // ─── 2) If we were actually on a question in *this* section, save its time ───
  if (
    questionStartTime !== null &&
    clickedQuestionIndex !== null &&
    clickedQuestionIndex >= sectionStartIndex &&
    clickedQuestionIndex <= sectionEndIndex
  ) {
    const now = new Date();
    const secondsSpent = Math.floor((now.getTime() - questionStartTime.getTime()) / 1000);
    setQuestionTimes((prev) => ({
      ...prev,
      [clickedQuestionIndex]: (prev[clickedQuestionIndex] || 0) + secondsSpent,
    }));
  }

  // Stop question timer and clear interval
if (timerRef.current) {
  clearInterval(timerRef.current);
  timerRef.current = null;
}

// Clear the current questionStartTime
setQuestionStartTime(null);

// Make sure you pause visually as well
setIsPaused(true);


  // ─── 3) Always clear the question start time so we don’t double‑count ───
  setQuestionStartTime(null);
  console.log("Handling section submission...");
  setIsPaused(true); // ⏸️ Pause the timer

  // ✅ Save section-level time
  const timeSpent = Math.floor(
    (now - currentSectionStartTimeRef.current) / 1000
  );
  setSectionTimes((prev) => ({
    ...prev,
    [currentSectionIndex]: (prev[currentSectionIndex] || 0) + timeSpent,
  }));
  currentSectionStartTimeRef.current = new Date(); // Reset for next section

    // Reset timer for accuracy
    currentSectionStartTimeRef.current = new Date();
    const currentSection = examData?.section[currentSectionIndex];
    console.log("Current Section:", currentSection);

    if (!currentSection) {
      console.log("No current section found. Exiting function.");
      return;
    }

    // Get the questions for the current section and selected language
    const questions =
      currentSection.questions?.[selectedLanguage?.toLowerCase()];
    console.log("Questions for the selected language:", questions);

    if (!questions) {
      console.log("No questions for the selected language. Exiting function.");
      return; // If no questions for the selected language, return early.
    }

    // Total questions in the current section
    const totalQuestions = questions.length;
    console.log("Total Questions in Section:", totalQuestions);

    // Calculate answered and unanswered questions
    const answeredQuestions = selectedOptions
      .slice(startingIndex, startingIndex + totalQuestions)
      .filter((option) => option !== null).length;
    console.log("Answered Questions Count:", answeredQuestions);

    const notAnsweredQuestions = totalQuestions - answeredQuestions;
    console.log("Not Answered Questions Count:", notAnsweredQuestions);

    // Calculate visited and not visited questions
    const visitedQuestionsCount = visitedQuestions.filter(
      (index) =>
        index >= startingIndex && index < startingIndex + totalQuestions
    ).length;
    console.log("Visited Questions Count:", visitedQuestionsCount);

    const notVisitedQuestions = totalQuestions - visitedQuestionsCount;
    console.log("Not Visited Questions Count:", notVisitedQuestions);

    // Calculate marked for review questions
    const reviewedQuestions = markedForReview.filter(
      (index) =>
        index >= startingIndex && index < startingIndex + totalQuestions
    ).length;
    console.log("Reviewed Questions Count:", reviewedQuestions);

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
    console.log("Section Summary:", sectionSummary);
    console.log(questionTimes);

    // Store section summary
    setSectionSummaryData((prevData) => {
      const updatedData = prevData.filter(
        (data) => data.sectionName !== sectionSummary.sectionName
      );
      return [...updatedData, sectionSummary];
    });
    
    updateSectionTime();
    // Display modal
    setShowModal(true);
    console.log("Modal shown:", showModal);

    // If modal is shown, and you're ready to go to the next section or submit the exam
    if (showModal) {
      console.log("Modal is shown, checking for next section or submission.");

      if (currentSectionIndex < examData.section.length - 1) {
        console.log("Moving to the next section.");
        setCurrentSectionIndex((prev) => prev + 1);

        // Move to the first question of the next section
        const newStartingIndex = examData?.section
          ?.slice(0, currentSectionIndex + 1)
          .reduce(
            (acc, section) =>
              acc +
              section.questions?.[selectedLanguage?.toLowerCase()]?.length,
            0
          );
        console.log("New Starting Index for Next Section:", newStartingIndex);

        setClickedQuestionIndex(newStartingIndex);
      } else {
        console.log("Submitting the exam.");
        submitExam();
      }
    }
  };

  // Using useEffect to trigger submitExam when needed
  const [timeminus, settimeminus] = useState(0);
  // const [isPaused, setIsPaused] = useState(false);
  const [pauseCount, setPauseCount] = useState(0);
  const [resultData, setResultData] = useState(null);
  const [timeTakenFromDB, settimeTakenFromDB] = useState();

  const [dataid, setDataid] = useState(null); // State to store the data

  useEffect(() => {
    // Fetch the data when the component mounts or when `id` changes
    if (user?._id) {
      Api.get(`results/${user?._id}/${id}`)
        .then((response) => {
          // Set the fetched data to state
          setDataid(response.data._id);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [id]);
  console.log("timetakenfromdb:", timeTakenFromDB);

  useEffect(() => {
    const totalSectionTime =
      examData?.section[currentSectionIndex]?.t_time * 60;

    // Get time taken from resultData
    const timeTaken =
      resultData?.section?.[currentSectionIndex]?.timeTaken || 0;

    console.log("Time taken from DB:", timeTaken);

    // Store timeTaken in an array at the index of currentSectionIndex
    settimeTakenFromDB(timeTaken);

    // Calculate remaining time
    const remainingTime = totalSectionTime - timeTaken;

    // Set remaining time
    settimeminus(remainingTime);
  }, [examData, currentSectionIndex, resultData]);

  const updateSectionTime = () => {
    if (!examDataSubmission || timeTakenFromDB.length === 0) return;

    const {
      formattedSections,
      totalScore,
      formattedTotalTime,
      timeTakenInSeconds,
      endTime,
    } = examDataSubmission;

    const totalTimeInSeconds =
      examData?.section[currentSectionIndex]?.t_time * 60 || 0;
    const actualTimeTaken = totalTimeInSeconds - timeminus;
    const timeTakenInSecondsUpdated =
    (resultData?.timeTakenInSeconds ?? 0) + timeTakenInSeconds;
  
    const previousTimeTaken =
      resultData?.section?.[currentSectionIndex]?.timeTaken || 0;
    console.log("currentSectionIndex:", currentSectionIndex);

    console.log("Previous time taken for section:", previousTimeTaken);

    const finalTimeTaken = actualTimeTaken ; 

    console.log("Final time taken for section:", finalTimeTaken);
    console.warn(formattedSections)

    const updatedSections = formattedSections.map((section, idx) => {
      if (idx === currentSectionIndex) {
        return {
          ...section,
          timeTaken: finalTimeTaken,
        };
      }
      return section;
    });
    console.warn(updatedSections)

    if (user?._id) {
      Api.post(`results/${user._id}/${id}`, {
        ExamId: id,
        section: updatedSections,
        score: totalScore,
        totalTime: formattedTotalTime,
        timeTakenInSeconds: timeTakenInSecondsUpdated,
        takenAt: examStartTime,
        submittedAt: endTime,
        status: isPaused ? "paused" : "completed",
        sectionTimes, // Optional: make sure this matches backend schema
      })
        .then((res) => {
          console.log("Submitted:", res.data);
        })
        .catch((err) => {
          console.error("Error submitting:", err);
        });
    }
  };

  useEffect(() => {
    updateSectionTime();
  }, [
    examDataSubmission,
    selectedOptions,
    id,
    currentSectionIndex,
    sectionTimes,
    timeminus,
    examData,
    isPaused,
    timeTakenFromDB,
  ]);

  useEffect(() => {
    if (!user?._id || !id) return;
    if (user?._id) {
      Api.get(`results/${user?._id}/${id}`)
        .then((response) => {
          setResultData(response.data);
          console.log("Result Data:", response.data);
          const descriptiveArray = response.data.section.map(
            (section, index) => {
              const descriptiveQuestion =
                section.questions?.[selectedLanguage?.toLowerCase()]?.[0]
                  ?.descriptive?.[0];

              return {
                text: [descriptiveQuestion?.text?.[0] || ""],
                // corrections: [],
                // scoreBreakdown: [],
                // scoreData: [],
                // expectedWordCount: [descriptiveQuestion?.wordCount || 0],
                // keywords: descriptiveQuestion?.keywords || [],
                // date: [new Date().toISOString()],
              };
            }
          );

          setDescriptiveData(descriptiveArray);
          console.log("Descriptive Data:", descriptiveText);
        })
        .catch((error) => {
          console.error("Error fetching result data:", error);
        });
    }
  }, [user?._id, id]);

 useEffect(() => {
    if (timeminus > 0 && !isPaused) {
      const timerInterval = setInterval(() => {
        settimeminus((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime === 0) {
            clearInterval(timerInterval); // Stop the timer immediately
            handleTimerEnd(); // Call an async handler
          }
          return newTime;
        });
      }, 1000);
      return () => clearInterval(timerInterval);
    }
  }, [timeminus, isPaused]);
  
 const handleTimerEnd = async () => {
  handleSubmitSection(); // 1. Submits the section
  await new Promise(resolve => setTimeout(resolve, 1000)); // 3. Waits 1 second
  handleSectionCompletion(); // 4. Calls this after 1 second
};


  const getKeywords = () => {
    const keywordString =
      examData?.section?.[currentSectionIndex]?.questions?.[
        selectedLanguage?.toLowerCase()
      ]?.[0]?.keywords;

    if (typeof keywordString === "string") {
      return keywordString.split(",").map((k) => k.trim().toLowerCase());
    }
    return [];
  };


  // ✅ Check grammar for the current section's text
const checkGrammar = async (currentText) => {
  try {
    const textToCheck = currentText?.trim();

    if (!textToCheck) {
      console.warn("⚠️ No text provided for grammar check.");
      return {
        corrections: [],
        scoreBreakdown: {},
        scoreData: {},
      };
    }

    console.log("🔍 Checking grammar for text:", textToCheck);

    const response = await axios.post(
      "https://ginger4.p.rapidapi.com/correction",
      textToCheck,
      {
        params: {
          lang: "US",
          generateRecommendations: "false",
          flagInfomralLanguage: "true",
        },
        headers: {
          "x-rapidapi-key": "c48ef5be6emsh80d02bf4327c670p1ee925jsna0386eb081e7",
          "x-rapidapi-host": "ginger4.p.rapidapi.com",
          "Content-Type": "text/plain",
        },
      }
    );

    const issues = response?.data?.GingerTheDocumentResult?.Corrections || [];
    console.log("✅ Grammar issues found:", issues);

    // Update local state
    setCorrections(issues);
    const scoreData = calculateScore(issues); // This should return a score breakdown object
    const scoreBreakdown = issues?.[0]?.Suggestions || [];

    setScoreBreakdown(scoreBreakdown);

    // Return structured data for use in the caller
    return {
      corrections: issues,
      scoreBreakdown,
      scoreData,
    };
  } catch (error) {
    console.error("❌ Grammar check failed:", error?.response?.data || error.message);
    return {
      corrections: [],
      scoreBreakdown: {},
      scoreData: {},
    };
  }
};

  // Grammar check function
const calculateScore = async (issues) => {
  const keywords = getKeywords();
  const expectedWordCount =
    examData?.section?.[currentSectionIndex]?.questions?.[
      selectedLanguage?.toLowerCase()
    ]?.[0]?.words_limit || 100;

  const currentText =
    descriptiveData?.[currentSectionIndex]?.text?.[0] || "";

  let spellingErrors = 0;
  let grammarErrors = 0;

  // Count spelling vs grammar issues
  issues.forEach((issue) => {
    const category = issue.TopCategoryIdDescription?.toLowerCase() || "";
    if (category.includes("capitalization") || category.includes("spelling")) {
      spellingErrors++;
    } else {
      grammarErrors++;
    }
  });

  // Word count
  const totalWords = currentText.trim().split(/\s+/).filter(Boolean).length;

  // Score calculations
  const spellingScore = spellingErrors === 0 ? 35 : Math.max(0, 35 - spellingErrors * 2);
  const grammarScore = grammarErrors === 0 ? 35 : Math.max(0, 35 - grammarErrors * 2);
  const wordCountScore = Math.round(Math.min((totalWords / expectedWordCount) * 20, 20));

  // Keyword match score
  let matchedKeywords = 0;
  const lowerText = currentText.toLowerCase();
  keywords.forEach((kw) => {
    if (lowerText.includes(kw)) matchedKeywords++;
  });
  const keywordScore = keywords.length > 0 ? (matchedKeywords / keywords.length) * 10 : 0;

  // Total score
  const totalScore = spellingScore + grammarScore + wordCountScore + keywordScore;

  const scoreData = {
    spellingScore,
    grammarScore,
    wordCountScore,
    keywordScore,
    totalScore: Math.round(totalScore),
    totalWords,
  };

  setScoreData(scoreData);

  if (currentSectionIndex === examData?.section?.length - 1) {
    await submitExam(descriptiveData.map(d => d.text?.[0] || ""), issues, scoreData, keywords, expectedWordCount);
  }

  // Debug logs
  console.log("✅ Score Data:", scoreData);
  console.log("Text:", currentText);
  console.log("Issues:", issues);
  console.log("Keywords:", keywords);
  console.log("Expected Word Count:", expectedWordCount);
};

  const submitExam = () => {
    updateSectionTime()
    console.log("submitExam called");
    const now = new Date();
    const timeSpent = Math.floor(
      (now - currentSectionStartTimeRef.current) / 1000
    );

    setSectionTimes((prev) => {
      const previousTime = prev[currentSectionIndex] || 0;

      // Only update if the new timeSpent is greater than previousTime
      const shouldUpdate = timeSpent > previousTime;
      const updatedTime = shouldUpdate ? timeSpent : previousTime;

      const updated = {
        ...prev,
        [currentSectionIndex]: updatedTime,
      };
  setQuestionTimes(prev => ({
    ...prev,
    [clickedQuestionIndex]: (prev[clickedQuestionIndex] || 0) + questionTime
  }));
      console.warn(
        `Section ${currentSectionIndex}: previous = ${previousTime}, new = ${timeSpent}, saved = ${updatedTime}`
      );

      // Optional: Show the full updated object
      console.warn("All updated section times:", updated);

      return updated;
    });

    if (
      !examData ||
      !examData.section ||
      !examData.section[currentSectionIndex]
    ) {
      console.error("Exam data or section not available");
      return;
    }

    const currentSection = examData.section[currentSectionIndex];
    const endTime = new Date();
    const timeTakenInSeconds = Math.floor((endTime - examStartTime) / 1000);
    const formattedTotalTime = formatTime(timeTakenInSeconds);

    const formattime = now;

    console.log("check this ", formattime);

    setTotalTime(formattedTotalTime);
    if (!currentSection) return;

    const questions =
      currentSection.questions?.[selectedLanguage?.toLowerCase()];
    if (!questions) return;

    const totalQuestions = questions.length;

    // Calculate answered and unanswered
    const answeredQuestions = selectedOptions
      .slice(startingIndex, startingIndex + totalQuestions)
      .filter((option) => option !== null).length;

    const notAnsweredQuestions = totalQuestions - answeredQuestions;

    const visitedQuestionsCount = visitedQuestions.filter(
      (index) =>
        index >= startingIndex && index < startingIndex + totalQuestions
    );

    const notVisitedQuestions = Array.from(
      { length: totalQuestions },
      (_, index) =>
        !visitedQuestionsCount.includes(index + startingIndex)
          ? index + startingIndex
          : null
    ).filter((index) => index !== null);

    const sectionSummary = {
      visitedQuestionsCount:
        visitedQuestionsCount.length > 0 ? visitedQuestionsCount[0] : null,
      notVisitedQuestions:
        notVisitedQuestions.length > 0 ? notVisitedQuestions[0] : null,
    };

    // setSectionSummaryData((prevData) => [...prevData, sectionSummary]);

    const reviewedQuestions = markedForReview.filter(
      (index) =>
        index >= startingIndex && index < startingIndex + totalQuestions
    ).length;

    const answersData = selectedOptions.map((selectedOption, index) => {
        // Find which section this question belongs to
    let sectionIndex = 0;
    let questionIndexInSection = 0;
    let currentSection;

        // Find the section and relative index for this question
    let count = 0;
    examData.section.forEach((section, sIndex) => {
      const questions = section.questions[selectedLanguage.toLowerCase()] || [];
      if (index >= count && index < count + questions.length) {
        sectionIndex = sIndex;
        questionIndexInSection = index - count;
        currentSection = section;
      }
      count += questions.length;
    });

    const question = currentSection.questions[selectedLanguage.toLowerCase()][questionIndexInSection];

      // const question =currentSection?.questions?.[selectedLanguage?.toLowerCase()]?.[index];
      const singleQuestionTime = formatTime(questionTimes[index] || 0);

      const optionsData = question?.options?.map((option, optionIndex) => ({
        option: option,
        index: optionIndex,
        isSelected: optionIndex === selectedOption,
        isCorrect: optionIndex === question?.answer,
      }));

      const isVisited = visitedQuestions?.includes(index) ? 1 : 0;
      const notVisited = isVisited === 1 ? 0 : 1;

      // const questionScore =
      //   selectedOption !== undefined
      //     ? selectedOption === question?.answer
      //       ? question?.plus_mark
      //       : -question?.minus_mark
      //     : 0;

          // Use section-specific marks
    const questionScore = selectedOption !== null
      ? selectedOption === question.answer
        ? currentSection.plus_mark
        : -currentSection.minus_mark
      : 0;
console.log("ques score",questionScore);

      return {
        question: question?.question,
        options: optionsData,
        correct: question?.answer === selectedOption,
        explanation: question?.explanation,
        answer: question?.answer,
        common_data: question?.common_data,
        selectedOption: selectedOption,
        isVisited: isVisited,
        NotVisited: notVisited,
        q_on_time: singleQuestionTime,
        score: questionScore,
        descriptive: descriptiveData[index] || [],
      };
    });
console.log("answers dataaaaa",answersData);

    const totalScore = answersData.reduce(
      (total, answerData) => total + answerData.score,
      0
    );

    const formattedSections = examData.section
      .map((section, sectionIndex) => {
        const sectionQuestions =
          section.questions?.[selectedLanguage?.toLowerCase()];
        if (!sectionQuestions) return null;

        const sectionStartIndex = examData.section
          .slice(0, sectionIndex)
          .reduce(
            (acc, s) =>
              acc +
              (s.questions?.[selectedLanguage?.toLowerCase()]?.length || 0),
            0
          );
        const sectionEndIndex = sectionStartIndex + sectionQuestions.length;

        const sectionAnswered = selectedOptions
          .slice(sectionStartIndex, sectionEndIndex)
          .filter((option) => option !== undefined && option !== null).length;

        const sectionNotAnswered = sectionQuestions.length - sectionAnswered;

        const sectionVisited = visitedQuestions.filter(
          (index) => index >= sectionStartIndex && index < sectionEndIndex
        ).length;

        const sectionAnswersData = sectionQuestions.map(
          (question, questionIndex) => {
            const absoluteIndex = sectionStartIndex + questionIndex;
            const selectedOption = selectedOptions[absoluteIndex];
            const isVisited = visitedQuestions.includes(absoluteIndex) ? 1 : 0;
            const notVisited = isVisited ? 0 : 1;
            const questionScore = selectedOption !== undefined
              ? selectedOption === question.answer
                ? section.plus_mark
                : -section.minus_mark
              : 0;

            return {
              
              descriptive: descriptiveData[absoluteIndex],
              question: question.question,
              options: question.options || [],
              answer: question.answer,
              common_data: question.common_data,
              correct: question.answer === selectedOption ? 1 : 0,
              explanation: question.explanation || "",
              selectedOption: selectedOption,
              q_on_time: formatTime(questionTimes[absoluteIndex] || 0),
              isVisited: isVisited,
              NotVisited: notVisited,
              score: questionScore,
            };
          }
        );
console.log("section answers data",sectionAnswersData);

        const correctCount = sectionAnswersData.filter(
  (q) => q.correct === 1
).length;

const attemptedCount = sectionAnswersData.filter(
  (q) => q.selectedOption !== undefined
).length;

const incorrectCount = sectionAnswered - correctCount;

// Use section-specific marks instead of hardcoded values
const sectionScore = 
  (correctCount * section.plus_mark) - 
  (incorrectCount * section.minus_mark);

const secaccuracy =
  sectionAnswered > 0 ? (correctCount / sectionAnswered) * 100 : 0;

console.log("Section Accuracy:", secaccuracy.toFixed(2) + "%");

const skippedQuestions = sectionVisited - sectionAnswered;

        return {
          name: section.name,
          t_question: section.t_question,
          t_time: section.t_time,
          t_mark: section.t_mark,
          plus_mark: section.plus_mark,
          minus_mark: section.minus_mark,
          cutoff_mark: section.cutoff_mark,
          isVisited: sectionVisited,
          NotVisited: sectionQuestions.length - sectionVisited,
          s_blueprint: section.s_blueprint.map((bp) => ({
            subject: bp.subject,
            topic: bp.topic,
            tak_time: bp.tak_time,
          })),
          questions: {
            english: section.questions.english.map((question, index) => ({
              question: question?.question,
              options: question.options || [],
              answer: question?.answer,
              common_data: question?.common_data,
              correct: answersData[sectionStartIndex + index]?.correct || 0,
              explanation: question?.explanation || "",
              selectedOption:
                answersData[sectionStartIndex + index]?.selectedOption,
              q_on_time:
                answersData[sectionStartIndex + index]?.q_on_time || "0",
              isVisited: answersData[sectionStartIndex + index]?.isVisited,
              NotVisited: answersData[sectionStartIndex + index]?.NotVisited,
              score: answersData[sectionStartIndex + index]?.score,
            })),
            hindi: section.questions.hindi.map((question, index) => ({
              question: question?.question,
              options: question.options || [],
              answer: question?.answer,
              common_data: question?.common_data,
              correct: answersData[sectionStartIndex + index]?.correct || 0,
              explanation: question?.explanation || "",
              selectedOption:
                answersData[sectionStartIndex + index]?.selectedOption,
              q_on_time:
                answersData[sectionStartIndex + index]?.q_on_time || "0",
              isVisited: answersData[sectionStartIndex + index]?.isVisited,
              NotVisited: answersData[sectionStartIndex + index]?.NotVisited,
              score: answersData[sectionStartIndex + index]?.score,
              descriptive: descriptiveData[sectionIndex],
            })),
            tamil: section.questions.tamil.map((question, index) => ({
              question: question?.question,
              options: question.options || [],
              answer: question?.answer,
              common_data: question?.common_data,
              correct: answersData[sectionStartIndex + index]?.correct || 0,
              explanation: question?.explanation || "",
              selectedOption:
                answersData[sectionStartIndex + index]?.selectedOption,
              q_on_time:
                answersData[sectionStartIndex + index]?.q_on_time || "0",
              isVisited: answersData[sectionStartIndex + index]?.isVisited,
              NotVisited: answersData[sectionStartIndex + index]?.NotVisited,
              score: answersData[sectionStartIndex + index]?.score,
              descriptive: descriptiveData[sectionIndex],
            })),
          },

          s_order: section.s_order || 0,
          s_score: sectionScore,
          correct: correctCount,
          incorrect: incorrectCount,
          Attempted: sectionAnswered,
          Not_Attempted: sectionNotAnswered,
          visitedQuestionsCount: sectionSummary.visitedQuestionsCount,
          notVisitedQuestions: sectionSummary.notVisitedQuestions,
          s_accuracy: secaccuracy,
          skipped: skippedQuestions,
          timeTaken: (() => {
            const time1 = resultData?.section?.[sectionIndex]?.timeTaken;
            const time2 = sectionTimes?.[sectionIndex];
        
            if (typeof time1 === 'number' && typeof time2 === 'number') {
              return time1 + time2;
            }
        
            return time1 ?? time2 ?? 0;
          })()
      
        };
      })
      .filter(Boolean);

    const totalStats = formattedSections.reduce(
      (acc, section) => ({
        visitedCount: acc.visitedCount + (section.isVisited || 0),
        notVisitedCount: acc.notVisitedCount + (section.NotVisited || 0),
        answeredCount: acc.answeredCount + (section.Attempted || 0),
        notAnsweredCount: acc.notAnsweredCount + (section.Not_Attempted || 0),
      }),
      {
        visitedCount: 0,
        notVisitedCount: 0,
        answeredCount: 0,
        notAnsweredCount: 0,
      }
    );

    setExamDataSubmission({
      formattedSections,
      totalScore: formattedSections.reduce(
        (sum, section) => sum + (section.s_score || 0),
        0
      ),
      timeTakenInSeconds,
      totalcheck: {
        visitedQuestionsCount: totalStats.visitedCount,
        notVisitedQuestions: totalStats.notVisitedCount,
        answeredQuestions: totalStats.answeredCount,
        notAnsweredQuestions: totalStats.notAnsweredCount,
      },
      endTime,
    });
  };

  const handleDescriptiveTest = async () => {
  console.warn("▶ Function started: handleDescriptiveTest");

  const prevText = descriptiveData?.[currentSectionIndex]?.text?.[0] || "";
  console.warn("📌 Previous text retrieved:", prevText);

  const currentText = descriptiveData?.[currentSectionIndex]?.text?.[0] || "";
  console.warn("📌 Current text retrieved:", currentText);
console.log("0",scoreData)
  // Run first grammar check
  const grammarResult = await checkGrammar(currentText);
  console.warn("✅ Grammar check results received",grammarResult);

  const corrections = grammarResult?.corrections || [];
  const scoreBreakdown = grammarResult?.scoreBreakdown || {};
  // const scoreData = grammarResult?.scoreData || {};
  
  console.warn("🔧 Corrections:", corrections);
  console.warn("📊 Score Breakdown:", scoreBreakdown);
  console.warn("📈 Score Data:", scoreData[currentSectionIndex]);

  const keywords = getKeywords(currentText);
  console.warn("🔑 Extracted keywords:", keywords);

  const expectedWordCount = examData?.section?.[currentSectionIndex]?.questions?.[selectedLanguage?.toLowerCase()]?.[0]?.words_limit;
  console.warn("🔢 Expected word count:", expectedWordCount);

  const currentDescriptiveData = {
    corrections: Array.isArray(corrections) ? corrections : [],
    scoreBreakdown: Object.entries(scoreBreakdown).map(([metric, value]) => ({ metric, value })),
    scoreData: scoreData,
    expectedWordCount: [expectedWordCount],
    keywords: keywords,
    date: [new Date().toISOString()],
    text: [currentText],
  };

  console.warn("📦 Constructed currentDescriptiveData:", currentDescriptiveData);

  // Update state
  setDescriptiveData((prev) => {
    console.warn("🛠 Updating descriptiveData state...");
    const updated = [...prev];
    updated[currentSectionIndex] = {
      ...updated[currentSectionIndex],
      ...currentDescriptiveData,
    };
    console.warn("🆕 Updated descriptiveData at index", currentSectionIndex, ":", updated[currentSectionIndex]);
    return updated;
  });

  console.warn("🕒 Scheduling second grammar check after delay...");

  setTimeout(async () => {
    const newText = currentText;
    console.warn("⏰ Timeout triggered. Rechecking grammar...");

    if (prevText !== newText) {
      console.warn("✏️ Text has changed. Running grammar check again...");
      await checkGrammar(newText);
    } else {
      console.warn("🔁 Text hasn't changed. Running grammar check anyway...");
      await checkGrammar(currentText);
    }
  }, 200);
};


const handlePauseResume = () => {
  if (pauseCount < 1) {
    clearInterval(questionTimerRef.current);
    setIsPaused(true);
    setPauseCount(pauseCount + 1);

    const now = new Date();

    // ✅ Save current question time
    if (questionStartTime && clickedQuestionIndex !== null) {
      const secondsSpent = Math.floor((now - questionStartTime) / 1000);
      setQuestionTimes((prev) => ({
        ...prev,
        [clickedQuestionIndex]: (prev[clickedQuestionIndex] || 0) + secondsSpent,
      }));
      setQuestionStartTime(null);
      if (timerRef.current) clearInterval(timerRef.current);
    }

    // ✅ Save section time
    const timeSpent = Math.floor(
      (now - currentSectionStartTimeRef.current) / 1000
    );
 // ✅ Safely update the sectionTimes state
      setSectionTimes((prev) => {
        console.log("Previous state (prev):", prev);

        const currentTime = prev[currentSectionIndex] || 0;
        console.log(
          `Current time for section [${currentSectionIndex}]:`,
          currentTime
        );

        const updatedTime = currentTime + timeSpent;
        console.log(
          `Updated time for section [${currentSectionIndex}]:`,
          updatedTime
        );

        const previous = {
          ...prev,
          [currentSectionIndex]: updatedTime,
        };
        console.log("Updated sectionTimes object to return:", previous);

        return previous;
      });
    currentSectionStartTimeRef.current = now;

    // ✅ Store current exam state
    const currentState = {
      clickedQuestionIndex,
      selectedOptions,
      visitedQuestions,
      markedForReview,
      currentSectionIndex,
    };
    localStorage.setItem(`examState_${id}`, JSON.stringify(currentState));

    Swal.fire({
      title: "Pause Exam",
      text: "Do you want to quit the exam?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Quit",
      cancelButtonText: "No, Resume",
      position: "center",
      width: "100vw",
      height: "100vh",
      padding: "100",
      customClass: {
        container: "swal-full-screen",
        popup: "swal-popup-full-height",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsPaused(true);
        await submitExam();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        window.close();
      } else {
          setIsPaused(false);
          setPauseCount(0);

          // ⏳ Get updated time for current question from state AFTER pause update
          setQuestionTimes((prev) => {
            const updatedTime = prev?.[clickedQuestionIndex] || 0;
            setQuestionTime(updatedTime); // 👈 resume from latest
            setQuestionStartTime(new Date()); // reset base time for further tracking

            // 🔁 Restart interval
            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = setInterval(() => {
              setQuestionTime((prev) => prev + 1);
            }, 1000);

            return prev; // Important: preserve state
          });
        }

    });
  }
};

  const [words, setWords] = useState(); // default word limit
  const [countType, setCountType] = useState(" ");
  const [wordCounto, setWordCounto] = useState(0);
  const [limitReached, setLimitReached] = useState(false);

  useEffect(() => {
    const selectedQuestion =
      examData?.section?.[currentSectionIndex]?.questions?.[
        selectedLanguage?.toLowerCase()
      ]?.[0];

    if (selectedQuestion) {
      setWords(Number(selectedQuestion.words_limit));
      setCountType(selectedQuestion.count_type?.toLowerCase());
    }
  }, [examData, currentSectionIndex, selectedLanguage]);
  // console.log("Set Text Value", "", text[currentSectionIndex]);

  const handleChange = (e) => {
    let inputText = e.target.value;
    let wordsArray = inputText.trim().split(/\s+/).filter(Boolean);

    const currentCount = wordsArray.length;
    setWordCounto(currentCount);

    const limitReached =
      (countType === "decrement" && currentCount >= words) ||
      (countType === "increment" && currentCount >= words);
    setLimitReached(limitReached);

    if (countType === "decrement" && currentCount > words) {
      wordsArray = wordsArray.slice(0, words);
      inputText = wordsArray.join(" ");
    }

    // const updatedText = [...text];
    // updatedText[currentSectionIndex] = inputText;
    // setText(updatedText);

   setDescriptiveData((prev) => {
  const updated = [...prev];

  // If the index is undefined, initialize it
  if (!updated[currentSectionIndex]) {
    updated[currentSectionIndex] = {};
  }

  updated[currentSectionIndex] = {
    ...updated[currentSectionIndex],
    text: [inputText],
  };

  // console.warn("Updated descriptiveData at index", currentSectionIndex, updated[currentSectionIndex]);

  return updated;
});

  };

  const preventShortcuts = (e) => {
    if (
      (e.ctrlKey || e.metaKey) &&
      ["c", "v", "x", "a", "z", "y"].includes(e.key.toLowerCase())
    ) {
      e.preventDefault();
    }
  };

  // Trigger submission on timeLeft = 0 or when exam is submitted
  // useEffect(() => {
  //   if (timeLeft <= 0) {
  // console.log("2 time called in time")
  // submitExam();
  //   }
  // }, [timeLeft]);

  const [sectionSummary, setSectionSummary] = useState(null);

  // const [currentSectionIndex, setCurrentSectionIndex] = useState(0); // Tracks the current section
  // To check if the section is complete
  // const navigate = useNavigate(); // For programmatic navigation

  // Function to show the toast and move to the next section (or result if last section)

  const closeAndNotifyParent = () => {
  if (window.opener) {
    console.log("Closing the window and notifying parent");
    window.opener.postMessage('test-status-updated', window.location.origin);
    
    // Allow time for message to send before closing
    setTimeout(() => {
      window.close();
    }, 500);
  } else {
    console.log("Closing the window without parent notification");
    navigate('/homelivetest');
  }
};

  const handleSectionCompletion = async () => {
    handleDescriptiveTest();
    console.log("handleSectionCompletion called");
    setIsPaused(false);

    if (true) {
      console.log("Section is complete");
      console.log(currentSectionIndex);
      console.log(examData?.section?.length - 1);
      // Move to the next section if there's another one
      if (currentSectionIndex < examData?.section?.length - 1) {
        setShowModal(false);
        console.log(`Current section index: ${currentSectionIndex}`);
        console.log(`Total sections: ${examData?.section?.length}`);
        setCurrentSectionIndex(currentSectionIndex + 1);
        setQuestionTime(0);
        // Calculate the starting index for the new section
        const newStartingIndex = examData?.section
          ?.slice(0, currentSectionIndex + 1)
          .reduce(
            (acc, section) =>
              acc +
              (section.questions?.[selectedLanguage?.toLowerCase()]?.length ||
                0),
            0
          );

        // Set clicked question to first question of new section
        setClickedQuestionIndex(newStartingIndex);
        console.log(
          `Moving to the next section. New index: ${currentSectionIndex + 1}`
        );
      } else {
        // If last section is complete, navigate to result
        console.log("Last section complete. Navigating to results.");
    
        await submitExam();
        await new Promise((resolve) => setTimeout(resolve, 1000)); // wait 1 second
        // navigate(`/liveresult/${id}/${user?._id}`);
        closeAndNotifyParent();
      }
    }
  };

  // Calculate starting index for the current section
  const quantsSection = examData?.section?.[currentSectionIndex];

  const isLastQuestion =
    clickedQuestionIndex ===
    quantsSection?.questions?.[selectedLanguage?.toLowerCase()]?.length - 1;

  // const [timeLeft, setTimeLeft] = useState(60); // Example starting time
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (!isRunning) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

  const toggleTimer = () => {
    if (isRunning && !isPaused) {
      setIsPaused(true); // Pause the timer
    } else {
      setIsRunning((prev) => !prev); // Toggle play/pause
      setIsPaused(false); // Ensure it's not paused when restarting
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

 const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      const docEl = document.documentElement;

      if (docEl.requestFullscreen) {
        docEl.requestFullscreen();
      } else if (docEl.mozRequestFullScreen) {
        docEl.mozRequestFullScreen();
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      } else if (docEl.msRequestFullscreen) {
        docEl.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, []);

  // 🔸 Attempt to auto-enter fullscreen on mount
  useEffect(() => {
    toggleFullScreen(); // This will only work if browser allows
  }, []);

  const [answeredCount, setAnsweredCount] = useState(0);
  const [notAnsweredCount, setNotAnsweredCount] = useState(0);
  const [notVisitedCount, setNotVisitedCount] = useState(0);
  const [markedForReviewCount, setMarkedForReviewCount] = useState(0);
  const [answeredAndMarkedCount, setAnsweredAndMarkedCount] = useState(0);

  useEffect(() => {
    const calculateCounts = () => {
      let answered = 0;
      let notAnswered = 0;
      let notVisited = 0;
      let markedForReviewCount = 0;
      let answeredAndMarked = 0;

      examData?.section[currentSectionIndex]?.questions?.[
        selectedLanguage?.toLowerCase()
      ]?.forEach((_, index) => {
        const fullIndex = startingIndex + index;

        const isAnswered = selectedOptions[fullIndex] !== null;
        const isVisited = visitedQuestions.includes(fullIndex);
        const isMarked = markedForReview.includes(fullIndex);

        if (isMarked && isAnswered) {
          answeredAndMarked++; // ✅ Answered + Marked
        } else if (isMarked && !isAnswered) {
          markedForReviewCount++; // ✅ Just Marked
        } else if (isAnswered) {
          answered++; // ✅ Only Answered
        } else if (isVisited) {
          notAnswered++; // ✅ Visited but Not Answered
        } else {
          notVisited++; // ✅ Not Visited at all
        }
      });

      setAnsweredCount(answered);
      setNotAnsweredCount(notAnswered);
      setNotVisitedCount(notVisited);
      setMarkedForReviewCount(markedForReviewCount);
      setAnsweredAndMarkedCount(answeredAndMarked);
    };

    calculateCounts();
  }, [
    selectedOptions,
    visitedQuestions,
    markedForReview,
    examData,
    currentSectionIndex,
    selectedLanguage,
    startingIndex,
  ]);

  const getSectionCounts = (
    section,
    selectedOptions,
    visitedQuestions,
    markedForReview,
    selectedLanguage,
    startingIndex
  ) => {
    let answered = 0;
    let notAnswered = 0;
    let notVisited = 0;
    let markedForReviewCount = 0;
    let answeredAndMarked = 0;

    const questions = section?.questions?.[selectedLanguage?.toLowerCase()];

    questions?.forEach((_, index) => {
      const fullIndex = startingIndex + index;

      const isAnswered = selectedOptions[fullIndex] !== null;
      const isVisited = visitedQuestions.includes(fullIndex);
      const isMarked = markedForReview.includes(fullIndex);

      if (isMarked && isAnswered) {
        answeredAndMarked++;
      } else if (isMarked && !isAnswered) {
        markedForReviewCount++;
      } else if (isAnswered) {
        answered++;
      } else if (isVisited) {
        notAnswered++;
      } else {
        notVisited++;
      }
    });

    return {
      answered,
      notAnswered,
      notVisited,
      markedForReviewCount,
      answeredAndMarked,
    };
  };

  const popupmodal = () => {
    setIsPaused(false);
    setShowModal(false);
     const existingTime = questionTimes?.[clickedQuestionIndex] || 0;
  setQuestionTime(existingTime);
  setQuestionStartTime(new Date());

  if (timerRef.current) clearInterval(timerRef.current);

  timerRef.current = setInterval(() => {
    setQuestionTime((prev) => prev + 1);
  }, 1000);

  console.log(`⏳ Resuming question ${clickedQuestionIndex} from ${existingTime}s`);
  };

  const finishTestAndOpenResult = async () => {
  try {
    // await submitExam();
    
    // Build the result URL
    const resultUrl = `${window.location.origin}/liveresult/${id}/${user?._id}`;
    
    // Open result in a new window without _blank target
    // const resultWindow = window.open('', '_self');
    
    // resultWindow.location.href = resultUrl;
        window.open(resultUrl, '_blank');

    // Close the current test window
    window.close();
  } catch (error) {
    console.error("Error finishing test:", error);
    alert('Failed to submit the exam. Please try again.');
  }
};

useEffect(() => {
  const now = new Date();

  // 1️⃣ Save time for previous question
  if (previousQuestionIndex !== null && questionStartTime) {
    const secondsSpent = Math.floor((now - questionStartTime) / 1000);
    setQuestionTimes(prev => ({
      ...prev,
      [previousQuestionIndex]: (prev[previousQuestionIndex] || 0) + secondsSpent,
    }));
  }

  // 2️⃣ Clear previous timer
  if (timerRef.current) clearInterval(timerRef.current);
console.log("q",questionTimes,clickedQuestionIndex);

  // 3️⃣ Start timer for current question
  const existingTime = questionTimes?.[clickedQuestionIndex] || 0;
  console.log("Existing time for question:", existingTime);
  
  setQuestionTime(existingTime);
  setQuestionStartTime(now);
console.log(questionTime);

  // 4️⃣ Live increment every second
  timerRef.current = setInterval(() => {
    setQuestionTime(prev => prev + 1);
  }, 1000);

  // 5️⃣ Track previous index for next time
  setPreviousQuestionIndex(clickedQuestionIndex);

  return () => clearInterval(timerRef.current);
}, [clickedQuestionIndex]);

console.log(questionTime);

  return (
    <div className="mock-font " ref={commonDataRef}>
      <div>
        <div className="bg-blue-400 text-white font-bold h-12 w-full flex justify-around items-center">
          <h1 className="h3 font-bold mt-3 text-sm md:text-xl">{show_name}</h1>
          <img src={logo} alt="logo" className="h-10 w-auto bg-white" />
               <h1 className=" text-center text-black bg-gray-100 p-2">
              Time Left:{formatTime(timeminus)}
            </h1>
          {/* Fullscreen Toggle Button */}
          <button
            onClick={toggleFullScreen}
            className="ml-8 bg-gray-600 p-2 rounded-full cursor-pointer text-white"
          >
            {/* Show the appropriate icon based on fullscreen state */}
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
        {/* <p className="text-lg">Selected Language: {selectedLanguage}</p> */}

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
                display: "block",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                minHeight: "100vh",
              }}
            >
              <div className="modal-dialog modal-xl">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1
                      className="modal-title fs-5 text-green-500"
                      id="staticBackdropLabel"
                    >
                      Section Submit
                    </h1>
                    <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={popupmodal} // Manually hide the modal
            ></button>
                  </div>
                  <div className="modal-body">
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead className="table-success text-white">
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
                              <td className="fw-bold">{summary.sectionName}</td>
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
                        onClick={handleSectionCompletion} // Check completion and move to next section
                      >
                        {currentSectionIndex === examData?.section?.length - 1
                          ? "Submit"
                          : "Next Section"}
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

      <div className="d-flex justify-content-start align-items-center flex-wrap bg-gray-100 gap-2">
        {examData?.section?.map((section, index) => {
          // Calculate the starting index for this section
          const startingIndex = examData.section
            .slice(0, index)
            .reduce(
              (acc, sec) =>
                acc +
                (sec?.questions?.[selectedLanguage?.toLowerCase()]?.length ||
                  0),
              0
            );

          // Get counts using fixed starting index
          const sectionCounts = getSectionCounts(
            section,
            selectedOptions,
            visitedQuestions,
            markedForReview,
            selectedLanguage,
            startingIndex
          );

          return (
            <div key={index}>
              <h1
                className={`h6 p-2 text-blue-400 d-inline-flex align-items-center  border-r-2 border-gray-300
                      ${
                        currentSectionIndex === index
                          ? " font-medium underline"
                          : ""
                      }`}
              >
                {section.name}
                <div className="relative group ml-2 d-inline-block">
                  <FaInfoCircle className="cursor-pointer text-blue-400" />
                  <div
                    className="absolute z-50 hidden group-hover:block bg-white text-dark border rounded p-2 shadow-md mt-1 
  min-w-[220px]     w-fit md:max-w-xs md:w-max
  left-1/2 -translate-x-1/2
  "
                  >
                    <div className="mt-2 flex align-items-center">
                      <div className="smanswerImg text-white fw-bold flex align-items-center justify-content-center">
                        {sectionCounts.answered}
                      </div>
                      <p className="ml-2 text-start text-lg-center mb-0">
                        Answered
                      </p>
                    </div>
                    <div className="mt-2 flex align-items-center">
                      <div className="smnotansImg text-white fw-bold flex align-items-center justify-content-center">
                        {sectionCounts.notAnswered}
                      </div>
                      <p className="ml-2 text-start text-lg-center mb-0">
                        Not Answered
                      </p>
                    </div>
                    <div className="mt-2 flex align-items-center">
                      <div className="smnotVisitImg fw-bold flex align-items-center justify-content-center">
                        {sectionCounts.notVisited}
                      </div>
                      <p className="ml-2 text-start text-lg-center mb-0">
                        Not Visited
                      </p>
                    </div>
                    <div className="mt-2 flex align-items-center">
                      <div className="smmarkedImg text-white fw-bold flex align-items-center justify-content-center">
                        {sectionCounts.markedForReviewCount}
                      </div>
                      <p className="ml-2 text-start text-lg-center">
                        Marked for Review
                      </p>
                    </div>
                    <div className="mt-2 flex align-items-center">
                      <div className="smansmarkedImg text-white fw-bold flex align-items-center justify-content-center">
                        {sectionCounts.answeredAndMarked}
                      </div>
                      <p className="ml-3 text-start text-lg-center mb-0">
                        Answered & Marked for Review
                      </p>
                    </div>
                  </div>
                </div>
              </h1>
            </div>
          );
        })}
      </div>

      {/* Mobile Hamburger Menu */}
      <button onClick={toggleMenu} className="md:hidden text-black p-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          {/* // Hamburger icon when the menu is closed */}
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <div className="flex ">
        {/* Question Panel */}
        <div className={` ${closeSideBar ? "md:w-full" : "md:w-4/5"}`}>
          {!isSubmitted ? (
            <>
              <div className="flex justify-between flex-col md:flex-row p-2 bg-gray-100 border-1 border-gray-300 font-extralight text-[14px]">
                <h3>
                  Question No: {clickedQuestionIndex + 1}/{t_questions}
                </h3>

                <h1 className="flex flex-wrap md:flex-row">
                                    {/* Language dropdown added here */}
                {examData &&
                  examData.section?.[currentSectionIndex]?.name?.toLowerCase().trim() !== "english language" && (
                    <div className="flex items-center mx-2">
                      <select
                        value={displayLanguage || selectedLanguage}
                        onChange={(e) => setDisplayLanguage(e.target.value)}
                        className="border rounded p-1"
                      >
                        {examData?.bilingual_status ? (
                          <>
                            {examData?.english_status && <option value="English">English</option>}
                            {examData?.hindi_status && <option value="Hindi">Hindi</option>}
                          </>
                        ) : (
                          <>
                            {examData?.english_status && <option value="English">English</option>}
                            {examData?.hindi_status && <option value="Hindi">Hindi</option>}
                            {examData?.tamil_status && <option value="Tamil">Tamil</option>}
                          </>
                        )}
                      </select>
                    </div>
                )}


                  <span className="border-1 border-gray-300 rounded-sm px-3 py-1 bg-white ">
                    Qn Time : {formatTime(questionTime)}
                  </span>
                  <span className="font-normal m-1">
                    &nbsp;&nbsp;&nbsp;&nbsp;<b>Marks : </b>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <span className="text-success">
                      +
                      {examData?.section &&
                      examData.section[currentSectionIndex]
                        ? examData.section[currentSectionIndex].plus_mark
                        : "No plus marks"}
                    </span>
                    &nbsp;<span className="text-gray-400">|</span>&nbsp;
                    <span className="text-danger">
                      -
                      {examData?.section &&
                      examData.section[currentSectionIndex]
                        ? examData.section[currentSectionIndex].minus_mark
                        : "No minus marks"}
                    </span>
                  </span>
                </h1>
              </div>

              {examData?.section[currentSectionIndex] ? (
                <div className="flex flex-col md:flex-row p-0">
                  {/* Left side for Common Data */}
                  {examData.section[currentSectionIndex]?.questions?.[
                    selectedLanguage?.toLowerCase()
                  ]?.[clickedQuestionIndex - startingIndex]?.common_data && (
                    <div
                    className={`md:w-[50%] p-3  pb-5 md:border-r border-gray-300
                  ${isFullscreen
                        ? 'h-[80vh] md:h-[80vh]'
                        : '    sm:h-[70vh] md:h-[75vh] lg:h-[73vh] xl:h-[75vh] 2xl:h-[80vh]'
                      }`
                    }
                      style={{
    height: 'calc(100vh - 150px)', // Adjust 150px to your header/footer height
    overflowY: 'auto'
  }}
                  >
                      <div
                        className="text-wrap"
                        style={{ whiteSpace: "normal", wordWrap: "break-word" }}
                        dangerouslySetInnerHTML={{
                          __html:
                            examData.section[currentSectionIndex]?.questions?.[
                             (displayLanguage|| selectedLanguage)?.toLowerCase()
                            ]?.[clickedQuestionIndex - startingIndex]
                              ?.common_data || "No common data available",
                        }}
                      />
                    </div>
                  )}

                  {/* Right side for Question */}
                  <div
                    className={`   ${isFullscreen
                      ? 'h-[80vh] md:h-[80vh]'
                      : '    sm:h-[70vh] md:h-[75vh] lg:h-[73vh] xl:h-[75vh] 2xl:h-[80vh]'
                      } mb-24 md:mb-2 p-3 pb-5 flex flex-col md:flex-row justify-between ${examData.section[currentSectionIndex]?.questions?.[
                        selectedLanguage?.toLowerCase()
                      ]?.[clickedQuestionIndex - startingIndex]?.common_data
                        ? "md:w-[50%]"
                        : "md:w-full" // Make it full width when no common data
                      }`}   style={{
    height: 'calc(100vh - 150px)', // Adjust 150px to your header/footer height
    overflowY: 'auto'
  }}
  
                  >
                    <div>
                      <div
                        className="text-wrap mb-2"
                        style={{ whiteSpace: "normal", wordWrap: "break-word" }}
                        dangerouslySetInnerHTML={{
                          __html:
                            examData.section[currentSectionIndex]?.questions?.[
                               (displayLanguage|| selectedLanguage)?.toLowerCase()
                            ]?.[clickedQuestionIndex - startingIndex]
                              ?.question || "No question available",
                        }}
                      />

                      {examData.section[currentSectionIndex]?.questions?.[
                        selectedLanguage?.toLowerCase()
                      ]?.[clickedQuestionIndex - startingIndex]?.options ? (
                        <div>
                          {examData.section[currentSectionIndex]?.questions?.[
                            (displayLanguage|| selectedLanguage)?.toLowerCase()
                          ]?.[
                            clickedQuestionIndex - startingIndex
                          ]?.options.map((option, index) => (
                            <div key={index} className="p-1 rounded-lg m-2 ">
                             <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
  <input
    type="radio"
    className="p-5"
    id={`option-${index}`}
    name="exam-option"
    value={index}
    checked={selectedOptions[clickedQuestionIndex] === index}
    onChange={() => {
      console.log("Selected Option Index:", index);
      handleOptionChange(index);
    }}
    style={{
      accentColor: "#3B82F6",
      width: "1.2rem",
      height: "1.2rem",
      marginRight: "8px",
      marginTop: "0px" // Remove vertical offset
    }}
  />
  <label
    htmlFor={`option-${index}`}
    dangerouslySetInnerHTML={{
      __html: option || "No option available",
    }}
  />
</div>

                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>No options available</p>
                      )}
                    </div>
                    <div className="md:flex hidden items-center">
                      <div
                        className={`fixed top-1/2 ${
                          closeSideBar ? "right-0" : ""
                        } bg-gray-600 h-14 w-5 rounded-s-md flex justify-center items-center cursor-pointer`}
                        onClick={toggleMenu2}
                      >
                        <FaChevronRight
                          className={`w-2 h-5 text-white transition-transform duration-300 ${
                            closeSideBar ? "absalute left-0 rotate-180" : ""
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: '100vh' }} // Full viewport height
              >
                <div
                  className="spinner-border text-primary"
                  role="status"
                  style={{ width: '3rem', height: '3rem' }}
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
              
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
          className={`mb-14 pb-7 bg-light transform transition-transform duration-300  border
        ${isMobileMenuOpen ? 'translate-x-0  w-3/4 ' : 'translate-x-full '}
        ${closeSideBar ? 'md:translate-x-full md:w-0 border-0' : 'md:translate-x-0 md:w-1/4'}
 ${isFullscreen
              ? 'h-[87vh] md:h-[87vh]'
              : 'h-[80vh] sm:h-[82vh] md:h-[85vh] lg:h-[85vh] xl:h-[85vh]'
            } fixed top-14 right-0 z-40 md:static shadow-sm md:block h-[79vh]`}
            style={{
    height: 'calc(100vh - 150px)', // Adjust 150px to your header/footer height
    overflowY: 'auto'
  }}
        >
          {isMobileMenuOpen && (
            <button onClick={toggleMenu} className="md:hidden text-black p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          <div className="container">
            <div className="w-fulll flex items-center justify-center space-x-4 p-2 bg-blue-400">
              {/* Profile Image and Link */}
              <div>
                <Avatar
                  alt={user?.firstName}
                  src={user?.profilePicture}
                  sx={{ width: 30, height: 30 }}
                />
              </div>

              {/* Profile Information */}
              <div>
                <h1 className=" text-white text-wrap break-words">
                  {user?.firstName + user?.lastName}
                </h1>
              </div>
            </div>
            <h1 className=" text-center text-black bg-gray-100 p-2">
              Time Left:{formatTime(timeminus)}
            </h1>
            <center>
              <button
                onClick={handlePauseResume}
                className={`px-4 py-2 rounded-lg font-semibold transition duration-300 mt-2 ${
                  isPaused
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-red-500 hover:bg-red-600 text-white"
                }`}
              >
                Pause
              </button>
            </center>

            <div className="container mt-3">
              <div className="row align-items-center">
                <div className="mt-2 col-12 col-lg-6 d-flex flex-lg-column flex-row align-items-center">
                  <div className="smanswerImg text-white fw-bold flex align-items-center justify-content-center">
                    {answeredCount}
                  </div>
                  <p className="ml-2 text-start text-lg-center mb-0">
                    Answered
                  </p>
                </div>
                <div className="mt-2 col-12 col-lg-6 d-flex flex-lg-column flex-row align-items-center">
                  <div className="smnotansImg text-white fw-bold flex align-items-center justify-content-center">
                    {notAnsweredCount}
                  </div>
                  <p className="ml-2 text-start text-lg-center mb-0">
                    Not Answered
                  </p>
                </div>
              </div>
            </div>

            <div className="container mb-3">
              <div className="row">
                <div className="mt-2 col-12 col-lg-6 d-flex flex-lg-column flex-row align-items-center">
                  <div className="smnotVisitImg fw-bold flex align-items-center justify-content-center">
                    {notVisitedCount}
                  </div>
                  <p className="ml-2 text-start text-lg-center mb-0">
                    Not Visited
                  </p>
                </div>
                <div className="mt-2 col-12 col-lg-6 d-flex flex-lg-column flex-row align-items-center">
                  <div className="smmarkedImg text-white fw-bold flex align-items-center justify-content-center">
                    {markedForReviewCount}
                  </div>
                  <p className="ml-2 text-start text-lg-center">
                    Marked for Review
                  </p>
                </div>
              </div>
              <div className="col-12 col-lg-6 d-flex flex-lg-column flex-row align-items-center">
                <div className="smansmarkedImg text-white fw-bold flex align-items-center justify-content-center">
                  {answeredAndMarkedCount}
                </div>
                <p className="ml-3 text-start text-lg-center mb-0">
                  Answered & Marked for Review
                </p>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2 px-1 py-2 text-center justify-center">
              {examData?.section[currentSectionIndex]?.questions?.[
                selectedLanguage?.toLowerCase()
              ]?.map((_, index) => {
                const fullIndex = startingIndex + index;
                const currentSection = examData.section[currentSectionIndex];
                const timeFormatted = formatTime(timeLeft);

                let className = "";
                if (selectedOptions[fullIndex] !== null) {
                  className = "answerImg";
                  if (markedForReview.includes(fullIndex)) {
                    className += " mdansmarkedImg";
                  }if (selectedOptions[fullIndex] == null) {
                    className="notansImg";
                  }
                }
                 else if (visitedQuestions.includes(fullIndex)) {
                  className = "notansImg";
                } else {
                  className = "notVisitImg";
                }

                if (markedForReview.includes(fullIndex)) {
                  className += " reviewed mdmarkedImg";
                }

                return (
                  <div key={fullIndex}>
                    <span
                      onClick={() => {
                        console.log("Clicked question index:", fullIndex);
                        setClickedQuestionIndex(fullIndex);
                        // setQuestionTime(0);
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
      <div className="fixed bottom-0 left-0 w-full bg-gray-100 p-2 border-t border-gray-200 z-50">
        <div className="flex justify-between flex-col md:flex-row w-full">
          <div className="flex justify-between  md:w-3/4 m-1">
            {/* Left side - Mark for Review and Clear Response */}
            <div className="d-flex">
              <button
                onClick={handleMarkForReview}
                className="btn bg-blue-300  hover:bg-blue-400 text-sm md:text-sm"
              >
                <span className="block md:hidden">Mark & Next</span>
                <span className="hidden md:block">Mark for Review</span>
              </button>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <button
                onClick={handleClearResponse}
                className="btn bg-blue-300  hover:bg-blue-400 text-sm md:text-sm"
              >
                <span className="block md:hidden">Clear</span>
                <span className="hidden md:block"> Clear Response</span>
              </button>
            </div>
            {examData?.section?.[currentSectionIndex]?.questions?.[
              selectedLanguage?.toLowerCase()
            ]?.length > 0 && (
              <button
                onClick={handleNextClick}
                className="btn bg-blue-500 text-white  hover:bg-blue-700 text-sm md:text-sm"
              >
                <span className="block md:hidden">Save</span>
                <span className="hidden md:block"> Save & Next</span>
              </button>
            )}
          </div>
          {/* Right side - Save & Next and Submit Section */}
          <div className="flex justify-center md:w-[20%]">
            <center>
              <button
                className="btn bg-blue-500 text-white  hover:bg-blue-700 mt-2 md:mt-0 px-7 text-sm md:text-sm"
                onClick={handleSubmitSection}
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"
              >
                {currentSectionIndex === examData?.section?.length - 1
                  ? "Submit Test"
                  : "Submit Section"}
              </button>
            </center>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Livemocktest;
