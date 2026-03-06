import { useContext, useEffect, useRef, useState } from "react";
import Api from "../service/Api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import logo from "../assets/logo/sample-logo.png";
import Swal from "sweetalert2";
import ExamHeader from "../components/Test/ExamHeader";
import SectionSummaryModal from "../components/Test/SectionSummaryModal";
import SectionTabBar from "../components/Test/SectionTabBar";
import QuestionViewer from "../components/Test/QuestionViewer";
import QuestionPalette from "../components/Test/QuestionPalette";
import ExamFooter from "../components/Test/ExamFooter";
import { formatTime, getSectionCounts } from "../components/Test/testUtils";
import { FaCompress, FaExpand, FaInfoCircle, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { UserContext } from "../context/UserProvider";
import { Avatar } from "@mui/material";

const Test = () => {
  const [examData, setExamData] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [clickedQuestionIndex, setClickedQuestionIndex] = useState(0);
  const [visitedQuestions, setVisitedQuestions] = useState([]);
  const [markedForReview, setMarkedForReview] = useState([]);
  const [ansmarkforrev, setAnsmarkforrev] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sectionTimes, setSectionTimes] = useState({});
  // Track which section indices have been submitted (can't go back)
  const [submittedSections, setSubmittedSections] = useState(new Set());
  const currentSectionStartTimeRef = useRef(new Date()); // Add this at top with other hooks

  const [previousQuestionIndex, setPreviousQuestionIndex] = useState(clickedQuestionIndex);
  const timerRef = useRef(null);


  const { user } = useContext(UserContext);

  const location = useLocation();
  const selectedLanguage = location.state?.language || "English";

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
            console.error("hello", state);
            const initialOptions = Array(t_questions).fill(null);
            // let lastVisitedIndex = 0;
            // let visitedQuestionsList = [];
            let markedForReviewList = [];
            let absoluteIndexCounter = 0;
            // Parse question times from backend
            const questionTimesFromDB = {};
            let absoluteIndex = 0;

            // Helper to handle both "MM:SS", strings, and raw numbers gracefully
            const parseQuestionTime = (val) => {
              if (val == null || val === "0" || val === 0) return 0;
              if (typeof val === "number") return val;
              if (typeof val === "string" && val.includes(":")) {
                const parts = val.split(':');
                if (parts.length === 2) {
                  return (parseInt(parts[0], 10) || 0) * 60 + (parseInt(parts[1], 10) || 0);
                }
              }
              // Fallback for string numbers
              return parseInt(val, 10) || 0;
            };

            state.section.forEach((section) => {
              const questions = section.questions?.[selectedLanguage?.toLowerCase()] || [];
              console.log("Questions:", questions);

              questions.forEach((question) => {
                if (question.q_on_time) {
                  questionTimesFromDB[absoluteIndex] = parseQuestionTime(question.q_on_time);
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
    console.warn(savedState);
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
      const result = Api.post(`results/${user?._id}/${id}`, {
        selectedOptions: updatedOptions,
        currentQuestionIndex: clickedQuestionIndex,
        sectionIndex: currentSectionIndex,
        mark
      });
      console.log("handle option change result", result);

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
            bilingual_status: res.data.bilingual_status,
            english_status: res.data.english_status,
            hindi_status: res.data.hindi_status,
            tamil_status: res.data.tamil_status,
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
                  isVisited: 0,
                  NotVisited: 0,
                  q_on_time: 0,
                  plus_mark: question.plus_mark,
                  minus_mark: question.minus_mark,
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
                  isVisited: 0,
                  NotVisited: 0,
                  q_on_time: 0,
                  plus_mark: question.plus_mark,
                  minus_mark: question.minus_mark,
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
                  isVisited: 0,
                  NotVisited: 0,
                  q_on_time: 0,
                  plus_mark: question.plus_mark,
                  minus_mark: question.minus_mark,
                })),
              },
              s_order: section.s_order || 0,
              // ✅ REQUIRED for section grouping to work
              is_sub_section: section.is_sub_section ?? false,
              group_name: section.group_name ?? "",
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
  const sectionTimerRef = useRef(null);        // stable interval for section countdown
  const pauseStartRef = useRef(null);           // timestamp when pause began
  const pausedDurationRef = useRef(0);          // total seconds paused this session
  const [timerKey, setTimerKey] = useState(0);  // incremented to (re)start the countdown interval
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
  const lastPoolRef = useRef(null);
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
    if (!examData) return;

    const currentSection = examData?.section?.[currentSectionIndex];
    let totalSectionTime = 0;
    let timeTakenForPool = 0;
    let poolIdentifier = "";

    if (currentSection?.is_sub_section) {
      // ✅ CUMULATIVE POOL: sum t_time for ALL sub-sections in the SAME group
      const groupName = currentSection.group_name || "";
      poolIdentifier = `group-pool-${groupName}`;
      let firstGroupSectionIdx = -1;
      examData.section.forEach((s, idx) => {
        if (s.is_sub_section && s.group_name === groupName) {
          totalSectionTime += (Number(s.t_time) || 0) * 60;
          if (firstGroupSectionIdx === -1) firstGroupSectionIdx = idx;
        }
      });
      timeTakenForPool = Math.max(
        0,
        resultData?.section?.[firstGroupSectionIdx]?.timeTaken || 0
      );
    } else {
      // ✅ NORMAL SECTION: use just this section's t_time
      poolIdentifier = `normal-section-${currentSectionIndex}`;
      totalSectionTime = (Number(currentSection?.t_time) || 0) * 60;
      timeTakenForPool = Math.max(
        0,
        resultData?.section?.[currentSectionIndex]?.timeTaken || 0
      );
    }

    // Reset if the pool has changed OR the DB progress has updated (on resume)
    const hasPoolChanged = lastPoolRef.current !== poolIdentifier;

    if (hasPoolChanged || (timeTakenFromDB !== timeTakenForPool) || (timeminus === 0 && totalSectionTime > 0)) {
      lastPoolRef.current = poolIdentifier;
      settimeTakenFromDB(timeTakenForPool);

      const remainingTime = Math.max(
        0,
        Math.min(totalSectionTime, totalSectionTime - timeTakenForPool)
      );
      settimeminus(remainingTime);
      setTimerKey(k => k + 1);
    }
  }, [examData, currentSectionIndex, resultData]);

  const updateSectionTime = () => {
    if (!examDataSubmission) return;

    const {
      formattedSections,
      totalScore,
      formattedTotalTime,
      timeTakenInSeconds,
      endTime,
    } = examDataSubmission;

    const currentSec = examData?.section?.[currentSectionIndex];
    let totalTimeInSeconds = 0;
    let isCumulativePool = false;

    if (currentSec?.is_sub_section) {
      isCumulativePool = true;
      const groupName = currentSec.group_name || "";
      totalTimeInSeconds = examData.section
        .filter(s => s.is_sub_section && s.group_name === groupName)
        .reduce((sum, s) => sum + (Number(s.t_time) || 0), 0) * 60;
    } else {
      totalTimeInSeconds = (Number(currentSec?.t_time) || 0) * 60;
    }

    // actualTimeTaken = how many seconds of the group/section time have elapsed
    const actualTimeTaken = Math.max(0, totalTimeInSeconds - timeminus);

    // Total exam timeTaken calculation uses the same logic we put in handleSubmitSection
    let cumulativeTimeTaken = 0;
    examData?.section?.forEach((sec, idx) => {
      if (sec.is_sub_section) {
        const groupName = sec.group_name || "";
        const groupIndices = examData.section
          .map((s, i) => (s.is_sub_section && s.group_name === groupName ? i : -1))
          .filter(i => i !== -1);
        if (groupIndices[0] !== idx) return; // skip if not the first section of this group
      }

      const isActiveSection = idx === currentSectionIndex || (currentSec?.is_sub_section && sec.is_sub_section && currentSec.group_name === sec.group_name);
      if (isActiveSection) {
        cumulativeTimeTaken += actualTimeTaken;
      } else {
        cumulativeTimeTaken += Math.max(0, resultData?.section?.[idx]?.timeTaken || 0);
      }
    });

    const timeTakenInSecondsUpdated = cumulativeTimeTaken;

    const updatedSections = formattedSections.map((section, idx) => {
      const sec = examData?.section?.[idx];

      if (isCumulativePool) {
        // Store pool elapsed time ONLY on the FIRST sub-section of this specific group.
        const groupName = sec?.group_name || "";
        const groupIndices = examData.section
          .map((s, i) => (s.is_sub_section && s.group_name === groupName ? i : -1))
          .filter(i => i !== -1);
        const firstGroupIdx = groupIndices[0];

        if (idx === firstGroupIdx) {
          return { ...section, timeTaken: actualTimeTaken };
        }
        // Other sections in the same group: keep their timeTaken as 0
        if (sec?.is_sub_section && sec?.group_name === groupName) {
          return { ...section, timeTaken: 0 };
        }
        return section;
      }

      if (idx === currentSectionIndex) {
        return { ...section, timeTaken: actualTimeTaken };
      }
      return section;
    });

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
        sectionTimes,
        pausedDuration: pausedDurationRef.current || 0, // total seconds paused
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
    Api.get(`results/${user._id}/${id}`)
      .then((response) => {
        setResultData(response.data);
        if (response.data && response.data.pausedDuration != null) {
          pausedDurationRef.current = response.data.pausedDuration;
        }
      })
      .catch((error) => {
        // 404 = no prior attempt, which is normal for first-time exam takers
        if (error?.response?.status === 404) {
          setResultData(null);
        } else {
          console.error("Error fetching result data:", error);
        }
      });
  }, [user?._id, id]);

  const [timerEnded, setTimerEnded] = useState(false);
  useEffect(() => {
    if (timerEnded) {
      handleTimerEnd();
      setTimerEnded(false);
    }
  }, [timerEnded]);

  // Stable section countdown — re-starts only when isPaused or timerKey changes
  useEffect(() => {
    if (sectionTimerRef.current) clearInterval(sectionTimerRef.current);

    if (isPaused) {
      pauseStartRef.current = Date.now();
      return;
    }

    // Accumulate paused duration on resume
    if (pauseStartRef.current) {
      const elapsed = Math.floor((Date.now() - pauseStartRef.current) / 1000);
      pausedDurationRef.current = (pausedDurationRef.current || 0) + elapsed;
      pauseStartRef.current = null;
    }

    // Don't start if nothing is left
    // (timeminus is read via functional updater so no stale closure)
    sectionTimerRef.current = setInterval(() => {
      settimeminus(prev => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(sectionTimerRef.current);
          setTimerEnded(true);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(sectionTimerRef.current);
  }, [isPaused, timerKey]); // timerKey fires when timeminus is freshly initialized

  const handleTimerEnd = async () => {
    handleSubmitSection();
    await new Promise(resolve => setTimeout(resolve, 1000));
    handleSectionCompletion(true); // Pass true to indicate timer ended
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

      console.warn(
        `Section ${currentSectionIndex}: previous = ${previousTime}, new = ${timeSpent}, saved = ${updatedTime}`
      );

      // Optional: Show the full updated object
      console.warn("All updated section times:", updated);

      return updated;
    });
    setQuestionTimes(prev => ({
      ...prev,
      [clickedQuestionIndex]: (prev[clickedQuestionIndex] || 0) + questionTime
    }));

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

    // Accumulate total time taken across ALL sections (including the just-finished one)
    // We can't just use (endTime - examStartTime) because it resets on pause/resume.
    let cumulativeTimeTaken = 0;

    // ✅ GROUP-AWARE: if the active section belongs to a group, sum t_time for the whole group
    let currentSectionTotalTime = 0;
    if (currentSection?.is_sub_section && currentSection?.group_name) {
      currentSectionTotalTime = examData.section
        .filter(s => s.is_sub_section && s.group_name === currentSection.group_name)
        .reduce((sum, s) => sum + (Number(s.t_time) || 0), 0) * 60;
    } else {
      currentSectionTotalTime = (Number(currentSection?.t_time) || 0) * 60;
    }
    const currentActiveTimeTaken = Math.max(0, currentSectionTotalTime - timeminus);

    // Sum all prior sections from DB + current active one.
    // For grouped sections, count their time only ONCE (at the first section of the group).
    examData.section.forEach((sec, idx) => {
      if (sec.is_sub_section) {
        const groupIndices = examData.section
          .map((s, i) => (s.is_sub_section && s.group_name === sec.group_name ? i : -1))
          .filter(i => i !== -1);
        if (groupIndices[0] !== idx) return; // skip non-first group members
      }

      if (idx === currentSectionIndex || (currentSection?.is_sub_section && currentSection?.group_name === sec.group_name)) {
        cumulativeTimeTaken += currentActiveTimeTaken;
      } else {
        cumulativeTimeTaken += Math.max(0, resultData?.section?.[idx]?.timeTaken || 0);
      }
    });

    const timeTakenInSeconds = cumulativeTimeTaken;
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
      console.log("ques score", questionScore);

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
      };
    });
    console.log("answers dataaaaa", answersData);

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
        console.log("section answers data", sectionAnswersData);

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
          group_name: section.group_name || "",
          is_sub_section: section.is_sub_section || false,
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
              selectedOption: answersData[sectionStartIndex + index]?.selectedOption,
              q_on_time: formatTime(questionTimes[sectionStartIndex + index] || 0),
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
              selectedOption: answersData[sectionStartIndex + index]?.selectedOption,
              q_on_time: formatTime(questionTimes[sectionStartIndex + index] || 0),
              isVisited: answersData[sectionStartIndex + index]?.isVisited,
              NotVisited: answersData[sectionStartIndex + index]?.NotVisited,
              score: answersData[sectionStartIndex + index]?.score,
            })),
            tamil: section.questions.tamil.map((question, index) => ({
              question: question?.question,
              options: question.options || [],
              answer: question?.answer,
              common_data: question?.common_data,
              correct: answersData[sectionStartIndex + index]?.correct || 0,
              explanation: question?.explanation || "",
              selectedOption: answersData[sectionStartIndex + index]?.selectedOption,
              q_on_time: formatTime(questionTimes[sectionStartIndex + index] || 0),
              isVisited: answersData[sectionStartIndex + index]?.isVisited,
              NotVisited: answersData[sectionStartIndex + index]?.NotVisited,
              score: answersData[sectionStartIndex + index]?.score,
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
      console.log("Time spent in current section (seconds):", timeSpent);

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
      }); currentSectionStartTimeRef.current = now;

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
  const handleSectionCompletion = async (isTimerEnd = false) => {
    setIsPaused(false);
    setShowModal(false);

    const currentSection = examData?.section?.[currentSectionIndex];
    let updatedSubmitted = new Set([...submittedSections, currentSectionIndex]);

    if (isTimerEnd && currentSection?.is_sub_section) {
      // ✅ TIMER ENDED: Skip all remaining sub-sections in this specific group
      const groupName = currentSection.group_name || "";
      const groupMembers = examData.section
        .map((s, i) => ({ s, i }))
        .filter(({ s }) => s.is_sub_section && s.group_name === groupName);

      // Mark ALL group members as submitted
      groupMembers.forEach(({ i }) => updatedSubmitted.add(i));
      setSubmittedSections(updatedSubmitted);

      // Find the first section AFTER this group
      const lastGroupMemberIdx = Math.max(...groupMembers.map(({ i }) => i));
      const nextIndex = lastGroupMemberIdx + 1;

      if (nextIndex < examData?.section?.length) {
        setCurrentSectionIndex(nextIndex);
        const newStartingIndex = examData.section
          .slice(0, nextIndex)
          .reduce((acc, s) => acc + (s.questions?.[selectedLanguage?.toLowerCase()]?.length || 0), 0);
        setClickedQuestionIndex(newStartingIndex);
        return;
      } else {
        // Last group in exam finished via timer — submit exam
        await submitExam();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        navigate(`/result/${id}/${user?._id}`);
        return;
      }
    }

    // Normal completion (Modal "Move to next" OR mid-group switch)
    setSubmittedSections(updatedSubmitted);

    // ✅ GROUP-SPECIFIC POOL: check if there are more unsubmitted sub-sections in the same group
    if (currentSection?.is_sub_section) {
      const groupName = currentSection.group_name || "";
      const groupMembers = examData.section
        .map((s, i) => ({ s, i }))
        .filter(({ s }) => s.is_sub_section && s.group_name === groupName);

      const nextGroupMember = groupMembers.find(({ i }) => !updatedSubmitted.has(i));

      if (nextGroupMember) {
        // ✅ More sub-sections remain in this group — switch freely
        const nextIndex = nextGroupMember.i;
        setCurrentSectionIndex(nextIndex);
        const newStartingIndex = examData.section
          .slice(0, nextIndex)
          .reduce((acc, s) => acc + (s.questions?.[selectedLanguage?.toLowerCase()]?.length || 0), 0);
        setClickedQuestionIndex(newStartingIndex);
        return;
      }
      // All sub-sections done — fall through
    }

    // ✅ ADVANCE TO NEXT SECTION / GROUP (or submit exam if last)
    if (currentSectionIndex < examData?.section?.length - 1) {
      const nextIndex = currentSectionIndex + 1;
      setCurrentSectionIndex(nextIndex);
      const newStartingIndex = examData.section
        .slice(0, nextIndex)
        .reduce((acc, s) => acc + (s.questions?.[selectedLanguage?.toLowerCase()]?.length || 0), 0);
      setClickedQuestionIndex(newStartingIndex);
    } else {
      // Last section — submit exam and navigate to results
      await submitExam();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate(`/result/${id}/${user?._id}`);
    }
  };

  // ✅ Previous question handler — does NOT cross section boundaries
  const handlePreviousClick = () => {
    if (clickedQuestionIndex <= 0) return;

    if (
      examData &&
      examData.section[currentSectionIndex] &&
      examData.section[currentSectionIndex].questions?.[selectedLanguage?.toLowerCase()]
    ) {
      if (clickedQuestionIndex > startingIndex) {
        setClickedQuestionIndex(clickedQuestionIndex - 1);
        setQuestionTime(0);
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

  // getSectionCounts moved to testUtils.js

  const popupmodal = () => {
    setIsPaused(false);
    setShowModal(false);
    // Resume timer for current question
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
      const resultUrl = `${window.location.origin}/result/${id}/${user?._id}`;

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

  // When question changes
  // 💡 When question changes
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
    console.log("q", questionTimes, clickedQuestionIndex);

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
    <div className="mock-font" ref={commonDataRef}>
      <div>
        <ExamHeader
          logo={logo}
          show_name={show_name}
          timeminus={timeminus}
          formatTime={formatTime}
          isFullscreen={isFullscreen}
          toggleFullScreen={toggleFullScreen}
          toggleMenu={toggleMenu}
        />

        <SectionSummaryModal
          showModal={showModal}
          sectionSummaryData={sectionSummaryData}
          popupmodal={popupmodal}
          handleSectionCompletion={handleSectionCompletion}
          currentSectionIndex={currentSectionIndex}
          examData={examData}
        />
      </div>

      <ToastContainer />

      <div className="w-full">
        <SectionTabBar
          examData={examData}
          currentSectionIndex={currentSectionIndex}
          selectedLanguage={selectedLanguage}
          selectedOptions={selectedOptions}
          visitedQuestions={visitedQuestions}
          markedForReview={markedForReview}
          submittedSections={submittedSections}
          displayLanguage={displayLanguage}
          setDisplayLanguage={setDisplayLanguage}
          setCurrentSectionIndex={setCurrentSectionIndex}
          setClickedQuestionIndex={setClickedQuestionIndex}
          toast={toast}
        />
      </div>

      <div className="flex">
        <div className={closeSideBar ? "md:w-full" : "md:w-4/5"}>
          <QuestionViewer
            examData={examData}
            currentSectionIndex={currentSectionIndex}
            clickedQuestionIndex={clickedQuestionIndex}
            startingIndex={startingIndex}
            selectedLanguage={selectedLanguage}
            displayLanguage={displayLanguage}
            isFullscreen={isFullscreen}
            closeSideBar={closeSideBar}
            toggleMenu2={toggleMenu2}
            selectedOptions={selectedOptions}
            handleOptionChange={handleOptionChange}
            isSubmitted={isSubmitted}
            questionTime={questionTime}
            formatTime={formatTime}
            t_questions={t_questions}
          />
        </div>

        <QuestionPalette
          isMobileMenuOpen={isMobileMenuOpen}
          closeSideBar={closeSideBar}
          isFullscreen={isFullscreen}
          toggleMenu={toggleMenu}
          user={user}
          timeminus={timeminus}
          formatTime={formatTime}
          handlePauseResume={handlePauseResume}
          isPaused={isPaused}
          answeredCount={answeredCount}
          notAnsweredCount={notAnsweredCount}
          notVisitedCount={notVisitedCount}
          markedForReviewCount={markedForReviewCount}
          answeredAndMarkedCount={answeredAndMarkedCount}
          examData={examData}
          currentSectionIndex={currentSectionIndex}
          selectedLanguage={selectedLanguage}
          startingIndex={startingIndex}
          selectedOptions={selectedOptions}
          markedForReview={markedForReview}
          visitedQuestions={visitedQuestions}
          setClickedQuestionIndex={setClickedQuestionIndex}
        />
      </div>

      <ExamFooter
        handlePreviousClick={handlePreviousClick}
        clickedQuestionIndex={clickedQuestionIndex}
        startingIndex={startingIndex}
        handleMarkForReview={handleMarkForReview}
        handleClearResponse={handleClearResponse}
        examData={examData}
        currentSectionIndex={currentSectionIndex}
        selectedLanguage={selectedLanguage}
        handleNextClick={handleNextClick}
        handleSubmitSection={handleSubmitSection}
      />
    </div>
  );
};

export default Test; // test 2
