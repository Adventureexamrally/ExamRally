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
import { useDispatch } from "react-redux";
import { setResults } from "../../slice/userSlice";

const DescriptiveTest = () => {
  const dispatch = useDispatch();
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
  const [destimer, setDestimer] = useState()
  const [popupType, setPopupType] = useState('section');
  // Initialize descriptiveData when examData is available

  const location = useLocation();
  const selectedLanguage = location.state?.language || "English";
  const [previousQuestionIndex, setPreviousQuestionIndex] =
    useState(clickedQuestionIndex);
  const timerRef = useRef(null);
  const pausedDurationRef = useRef(0);
  // Fetch exam data
  // const [selectedLanguage, setselectedLanguage] = useState(currentLanguage);
  const [displayLanguage, setDisplayLanguage] = useState(null);

  useEffect(() => {
    const sectionName = examData?.section?.[currentSectionIndex]?.name
      ?.toLowerCase()
      .trim();
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
  const [duration, setDuration] = useState(0);
  const [t_questions, sett_questions] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id || !id) return;

      try {
        // 1. Fetch Exam Data
        const examRes = await Api.get(`exams/getExam/${id}`);
        if (!examRes.data) return;

        const resData = examRes.data;
        setShow_name(resData.show_name);
        setDestimer(resData.duration);
        sett_questions(resData.t_questions);
        setTotalQuestions(resData.t_questions || 0);

        // Transform exam data for local state
        const transformedData = {
          ...resData,
          section: resData.section.map((section) => ({
            ...section,
            questions: {
              english: (section.questions?.english || []).map(q => ({ ...q, q_on_time: String(q.q_on_time || "0") })),
              hindi: (section.questions?.hindi || []).map(q => ({ ...q, q_on_time: String(q.q_on_time || "0") })),
              tamil: (section.questions?.tamil || []).map(q => ({ ...q, q_on_time: String(q.q_on_time || "0") })),
            }
          }))
        };
        setExamData(transformedData);

        // 2. Fetch Existing Result
        let existingResult = null;
        try {
          const resultRes = await Api.get(`results/${user._id}/${id}`);
          existingResult = resultRes.data;
        } catch (e) {
          console.log("No existing result found, will initialize new one.");
        }

        const initialOptions = Array(resData.t_questions).fill(null);

        if (existingResult) {
          // 3a. Rehydrate Progress
          setResultData(existingResult);
          
          // Sync with Redux
          if (existingResult.status) {
            dispatch(setResults({
              [id]: {
                status: existingResult.status,
                lastQuestionIndex: existingResult.currentQuestionIndex,
                selectedOptions: existingResult.selectedOptions,
              }
            }));
          }

          const questionTimesFromDB = {};
          
          // Rehydrate descriptive data
          const descriptiveArray = existingResult.section.map((section) => {
            const descriptiveQuestion = section.questions?.[selectedLanguage?.toLowerCase()]?.[0]?.descriptive?.[0];
            return {
              text: [descriptiveQuestion?.text?.[0] || ""],
              corrections: descriptiveQuestion?.corrections || [],
              scoreBreakdown: descriptiveQuestion?.scoreBreakdown || [],
              scoreData: descriptiveQuestion?.scoreData || [],
              expectedWordCount: [descriptiveQuestion?.wordCount || 0],
              keywords: descriptiveQuestion?.keywords || [],
              date: [new Date().toISOString()],
            };
          });
          setDescriptiveData(descriptiveArray);

          // Hydrate selected options from flat array (priority)
          if (existingResult.selectedOptions && existingResult.selectedOptions.length > 0) {
            existingResult.selectedOptions.forEach((opt, idx) => {
              if (opt !== null && opt !== undefined && idx < initialOptions.length) {
                initialOptions[idx] = opt;
              }
            });
          }

          // Hydrate status-specific fields (visited, marked, times)
          let visitedList = [];
          let markedList = [];
          let currentAbsIdx = 0;

          existingResult.section.forEach((section) => {
            const questions = section.questions?.[selectedLanguage?.toLowerCase()] || [];
            questions.forEach((question) => {
              const globalIdx = currentAbsIdx++;

              // Sync question times
              const parts = (question.q_on_time || "0:0").toString().split(':');
              const mins = Number(parts[0]) || 0;
              const secs = Number(parts[1]) || 0;
              questionTimesFromDB[globalIdx] = mins * 60 + secs;

              // Visited/Marked status
              if (question.isVisited === 1) visitedList.push(globalIdx);
              if (question.markforreview === 1 || question.ansmarkforrev === 1) markedList.push(globalIdx);

              // Fallback for options if root array was empty or missing
              if ((!existingResult.selectedOptions || existingResult.selectedOptions.length === 0) && 
                  question.selectedOption !== undefined && question.selectedOption !== null && question.selectedOption !== "") {
                initialOptions[globalIdx] = question.selectedOption;
              }
            });
          });

          setQuestionTimes(questionTimesFromDB);
          setSelectedOptions(initialOptions);
          setVisitedQuestions(visitedList.length > 0 ? visitedList : [0]);
          setMarkedForReview(markedList);
          setCurrentSectionIndex(existingResult.currentSectionIndex || 0);
          setClickedQuestionIndex(existingResult.currentQuestionIndex || 0);
          
          if (existingResult.pausedDuration != null) pausedDurationRef.current = existingResult.pausedDuration;
          
          setIsDataFetched(true);

        } else {
          // 3b. Initialize New Result
          setSelectedOptions(initialOptions);
          setVisitedQuestions([0]);
          
          await Api.post(`/results/${user._id}/${id}`, {
            ...transformedData,
            status: "started"
          });
          console.log("New exam result initialized");
          setIsDataFetched(true);
        }

      } catch (error) {
        console.error("Initialization error:", error);
      }
    };

    fetchData();
  }, [id, user?._id]);

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



  // Modify handleOptionChange to update database
  const handleOptionChange = async (index) => {
    setSelectedOptions((prev) => {
      const updatedOptions = [...prev];
      updatedOptions[clickedQuestionIndex] = index;
      // Find current section
      const currentSection = examData.section[currentSectionIndex];
      // Find relative question index
      const relativeIndex = clickedQuestionIndex - startingIndex;
      const currentQuestion =
        currentSection.questions[selectedLanguage.toLowerCase()][relativeIndex];

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
        mark,
      }).then(() => {
        dispatch(setResults({
          [id]: {
            status: "paused",
            lastQuestionIndex: clickedQuestionIndex,
            selectedOptions: updatedOptions,
          }
        }));
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

  // At the top of your component
  const [activeTimer, setActiveTimer] = useState(null); // 'question' or 'section'

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    console.log("Timer setup for:", activeTimer);
    // ... timer setup code ...

    return () => {
      console.log("Cleaning up timer");
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [clickedQuestionIndex]);

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



  const calculateAllSectionsData = () => {
    if (!examData?.section) return [];

    return examData.section.map((section, sectionIndex) => {
      const questions = section?.questions?.[selectedLanguage?.toLowerCase()] || [];
      const sectionStartingIndex = examData.section
        .slice(0, sectionIndex)
        .reduce(
          (acc, sec) =>
            acc + (sec.questions?.[selectedLanguage?.toLowerCase()]?.length || 0),
          0
        );

      // Calculate answered questions for descriptive answers
      const answeredQuestions = questions.reduce((count, q, index) => {
        const fullIndex = sectionStartingIndex + index;
        const hasAnswer = descriptiveData?.[fullIndex]?.text?.[0]?.trim() !== "" &&
          descriptiveData?.[fullIndex]?.text?.[0] !== undefined;
        return count + (hasAnswer ? 1 : 0);
      }, 0);

      // Calculate visited questions
      const visitedQuestionsCount = questions.reduce((count, q, index) => {
        const fullIndex = sectionStartingIndex + index;
        const wasVisited = visitedQuestions.includes(fullIndex);
        return count + (wasVisited ? 1 : 0);
      }, 0);

      // Calculate marked for review
      const reviewedQuestions = questions.reduce((count, q, index) => {
        const fullIndex = sectionStartingIndex + index;
        const isMarked = markedForReview.includes(fullIndex);
        return count + (isMarked ? 1 : 0);
      }, 0);

      return {
        sectionName: section?.name || `Section ${sectionIndex + 1}`,
        totalQuestions: questions.length,
        answeredQuestions,
        notAnsweredQuestions: questions.length - answeredQuestions,
        visitedQuestionsCount,
        notVisitedQuestions: questions.length - visitedQuestionsCount,
        reviewedQuestions,
      };
    });
  };

  // For "Submit Test" button - Show ALL sections
  const handleSubmitTest = () => {
    handleDescriptiveTest();
    updateSectionTime();
    setPopupType('test'); // Set to test type

    // Calculate ALL sections data
    const allSectionsData = calculateAllSectionsData();
    setSectionSummaryData(allSectionsData);
    setShowModal(true);
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

    // Save current descriptive answer
    handleDescriptiveTest();

    if (!examData || !examData.section) return;

    const currentSectionQuestions =
      examData.section[currentSectionIndex]?.questions?.[
      selectedLanguage?.toLowerCase()
      ] || [];

    const isLastQuestionInSection =
      clickedQuestionIndex - startingIndex >=
      currentSectionQuestions.length - 1;

    if (isLastQuestionInSection) {
      // If it's the last question in the current section
      if (currentSectionIndex < examData.section.length - 1) {
        // Move to next section
        const nextSectionIndex = currentSectionIndex + 1;
        const nextSectionStartingIndex = examData.section
          .slice(0, nextSectionIndex)
          .reduce(
            (acc, section) =>
              acc +
              (section.questions?.[selectedLanguage?.toLowerCase()]?.length ||
                0),
            0
          );

        setCurrentSectionIndex(nextSectionIndex);
        setClickedQuestionIndex(nextSectionStartingIndex);
      } else {
        //   // If it's the last question of the last section, stay on this question
        //   // Or you could wrap around to the first question
        //   setClickedQuestionIndex(0);
        //   setCurrentSectionIndex(0);
        // handleSectionCompletion(); // REMOVED: Prevent premature submission on 'Next' click
        console.log("Last question of last section reached.");
        Swal.fire({
          title: "Finish Test?",
          text: "This is the last question. Would you like to submit your test?",
          icon: "info",
          showCancelButton: true,
          confirmButtonText: "Submit Test",
          cancelButtonText: "Stay & Review"
        }).then((result) => {
          if (result.isConfirmed) {
            handleSubmitTest();
          }
        });
      }
    } else {
      // Move to next question in current section
      setClickedQuestionIndex(clickedQuestionIndex + 1);
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
    handleDescriptiveTest();
    updateSectionTime();
    // Only set to 'section' if not already set to 'timeExpired'
    setPopupType((prev) => (prev === "timeExpired" ? prev : "section"));

    // Calculate ONLY current section data
    const currentSection = examData?.section[currentSectionIndex];
    const questions = currentSection?.questions?.[selectedLanguage?.toLowerCase()] || [];

    const currentSectionData = {
      sectionName: currentSection?.name || `Section ${currentSectionIndex + 1}`,
      totalQuestions: questions.length,
      answeredQuestions: questions.reduce((count, q, index) => {
        const fullIndex = startingIndex + index;
        const hasAnswer = descriptiveData?.[fullIndex]?.text?.[0]?.trim() !== "" &&
          descriptiveData?.[fullIndex]?.text?.[0] !== undefined;
        return count + (hasAnswer ? 1 : 0);
      }, 0),
      notAnsweredQuestions: questions.reduce((count, q, index) => {
        const fullIndex = startingIndex + index;
        const hasAnswer = descriptiveData?.[fullIndex]?.text?.[0]?.trim() !== "" &&
          descriptiveData?.[fullIndex]?.text?.[0] !== undefined;
        return count + (hasAnswer ? 0 : 1);
      }, 0),
      visitedQuestionsCount: questions.reduce((count, q, index) => {
        const fullIndex = startingIndex + index;
        const wasVisited = visitedQuestions.includes(fullIndex);
        return count + (wasVisited ? 1 : 0);
      }, 0),
      notVisitedQuestions: questions.reduce((count, q, index) => {
        const fullIndex = startingIndex + index;
        const wasVisited = visitedQuestions.includes(fullIndex);
        return count + (wasVisited ? 0 : 1);
      }, 0),
      reviewedQuestions: questions.reduce((count, q, index) => {
        const fullIndex = startingIndex + index;
        const isMarked = markedForReview.includes(fullIndex);
        return count + (isMarked ? 1 : 0);
      }, 0),
    };

    setSectionSummaryData([currentSectionData]);
    setShowModal(true);
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
  }, [id, user?._id, totalQuestions]); // Add totalQuestions to dependency array for correct initialization

  const getFormattedSections = (opts = selectedOptions, visited = visitedQuestions) => {
    if (!examData?.section) return { formattedSections: [], totalScore: 0, endTime: new Date() };

    const endTime = new Date();
    const answersData = opts.map((selectedOption, index) => {
      let sectionIndex = 0;
      let questionIndexInSection = 0;
      let currentSection = null;
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

      if (!currentSection) return null;

      const question = currentSection.questions[selectedLanguage.toLowerCase()][questionIndexInSection];
      const singleQuestionTime = formatTime(questionTimes[index] || 0);

      const optionsData = (question?.options || []).map((option, optionIndex) => ({
        option: option,
        index: optionIndex,
        isSelected: optionIndex === selectedOption,
        isCorrect: optionIndex === question?.answer,
      }));

      const isVisited = visited?.includes(index) ? 1 : 0;
      const notVisited = isVisited === 1 ? 0 : 1;

      const questionScore = selectedOption !== null
        ? selectedOption === question.answer
          ? currentSection.plus_mark
          : -currentSection.minus_mark
        : 0;

      return {
        question: question?.question,
        options: optionsData,
        correct: question?.answer === selectedOption ? 1 : 0,
        explanation: question?.explanation || "",
        answer: question?.answer,
        common_data: question?.common_data || "",
        selectedOption: selectedOption,
        isVisited: isVisited,
        NotVisited: notVisited,
        q_on_time: singleQuestionTime,
        score: questionScore,
        descriptive: descriptiveData[index] || [],
      };
    }).filter(Boolean);

    const totalScore = answersData.reduce((total, ad) => total + ad.score, 0);

    const formattedSections = examData.section.map((section, sectionIndex) => {
      const sectionQuestions = section.questions?.[selectedLanguage?.toLowerCase()] || [];
      const sectionStartIndex = examData.section.slice(0, sectionIndex).reduce((acc, s) => acc + (s.questions?.[selectedLanguage?.toLowerCase()]?.length || 0), 0);
      const sectionEndIndex = sectionStartIndex + sectionQuestions.length;

      const sectionAnswered = opts.slice(sectionStartIndex, sectionEndIndex).filter((option) => option !== null).length;
      const sectionVisited = visited.filter((idx) => idx >= sectionStartIndex && idx < sectionEndIndex).length;

      const sectionAnswersData = answersData.slice(sectionStartIndex, sectionEndIndex);
      const correctCount = sectionAnswersData.filter((q) => q.correct === 1).length;
      const incorrectCount = sectionAnswered - correctCount;
      const sectionScore = (correctCount * section.plus_mark) - (incorrectCount * section.minus_mark);
      const secaccuracy = sectionAnswered > 0 ? (correctCount / sectionAnswered) * 100 : 0;

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
          english: section.questions.english.map((q, i) => answersData[sectionStartIndex + i]),
          hindi: section.questions.hindi.map((q, i) => answersData[sectionStartIndex + i]),
          tamil: section.questions.tamil.map((q, i) => answersData[sectionStartIndex + i]),
        },
        s_order: section.s_order || 0,
        s_score: sectionScore,
        correct: correctCount,
        incorrect: incorrectCount,
        Attempted: sectionAnswered,
        Not_Attempted: sectionQuestions.length - sectionAnswered,
        s_accuracy: secaccuracy,
        skipped: sectionVisited - sectionAnswered,
        timeTaken: (() => {
          const time1 = resultData?.section?.[sectionIndex]?.timeTaken || 0;
          const time2 = sectionTimes?.[sectionIndex] || 0;
          return time1 + time2;
        })()
      };
    });

    const totalStats = formattedSections.reduce((acc, sec) => ({
      visitedCount: acc.visitedCount + (sec.isVisited || 0),
      answeredCount: acc.answeredCount + (sec.Attempted || 0),
    }), { visitedCount: 0, answeredCount: 0 });

    return {
      formattedSections,
      totalScore,
      endTime,
      totalcheck: {
        visitedQuestionsCount: totalStats.visitedCount,
        answeredQuestions: totalStats.answeredCount,
      }
    };
  };

  useEffect(() => {
    const totalSectionTime =
      destimer * 60;
    // Get time taken from resultData
    const timeTaken =
      resultData?.section?.[currentSectionIndex]?.timeTaken || 0;
    // Store timeTaken in an array at the index of currentSectionIndex
    settimeTakenFromDB(timeTaken);

    // Calculate remaining time
    const remainingTime = totalSectionTime - timeTaken;

    // Set remaining time
    settimeminus(remainingTime);
  }, [examData, currentSectionIndex, resultData]);

  const updateSectionTime = (explicitStatus = null) => {
    if (!examData?.section || timeTakenFromDB == null) return;

    const {
      formattedSections,
      totalScore,
      endTime,
    } = getFormattedSections();

    const totalTimeInSeconds = destimer * 60 || 0;
    const actualTimeTaken = totalTimeInSeconds - timeminus;
    
    // Total exam timeTaken calculation
    let cumulativeTimeTaken = 0;
    examData?.section?.forEach((sec, idx) => {
      if (idx === currentSectionIndex) {
        cumulativeTimeTaken += actualTimeTaken;
      } else {
        cumulativeTimeTaken += Math.max(0, resultData?.section?.[idx]?.timeTaken || 0);
      }
    });

    const timeTakenInSecondsUpdated = cumulativeTimeTaken;

    const updatedSections = formattedSections.map((section, idx) => {
      if (idx === currentSectionIndex) {
        return { ...section, timeTaken: actualTimeTaken };
      }
      return section;
    });

    if (user?._id) {
      return Api.post(`results/${user._id}/${id}`, {
        ExamId: id,
        section: updatedSections,
        score: totalScore,
        totalTime: formatTime(timeTakenInSecondsUpdated),
        timeTakenInSeconds: timeTakenInSecondsUpdated,
        takenAt: examStartTime,
        submittedAt: endTime,
        status: (isSubmitted || explicitStatus === "completed") ? "completed" : (explicitStatus || (isPaused ? "paused" : "started")), 
        sectionTimes,
        selectedOptions: selectedOptions,
        currentSectionIndex: currentSectionIndex,
        currentQuestionIndex: clickedQuestionIndex,
        pausedDuration: pausedDurationRef.current || 0,
      })
        .then((res) => {
          console.log("Submitted:", res.data);
          dispatch(setResults({
            [id]: {
              status: (isSubmitted || explicitStatus === "completed") ? "completed" : (explicitStatus || (isPaused ? "paused" : "started")),
              lastQuestionIndex: clickedQuestionIndex,
              selectedOptions: selectedOptions,
            }
          }));
          return res.data;
        })
        .catch((err) => {
          console.error("Error submitting:", err);
          throw err;
        });
    }
    return Promise.resolve();
  };

  useEffect(() => {
    updateSectionTime();
  }, [timeTakenFromDB]);



  // In your timers, make sure they call handleTimerEnd
  useEffect(() => {
    if (timeminus > 0 && !isPaused) {
      const timerInterval = setInterval(() => {
        settimeminus((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime === 0) {
            clearInterval(timerInterval);
            handleTimerEnd(); // Call the time expiry handler
          }
          return newTime;
        });
      }, 1000);
      return () => clearInterval(timerInterval);
    }
  }, [timeminus, isPaused]);

  // Add this useEffect to handle auto-submission when time expires
  useEffect(() => {
    let autoSubmitTimer;

    if (showModal && popupType === 'timeExpired') {
      // Set a timer to automatically submit after 5 seconds
      autoSubmitTimer = setTimeout(async () => {
        console.log("⏰ Auto-submitting due to time expiry...");
        await submitExam();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setShowModal(false);
        setIsSubmitted(true);
        finishTestAndOpenResult();
      }, 5000); // 5 seconds delay
    }

    // Cleanup the timer if component unmounts or modal closes
    return () => {
      if (autoSubmitTimer) {
        clearTimeout(autoSubmitTimer);
      }
    };
  }, [showModal, popupType]);

  // Also update your handleTimerEnd function to ensure it sets the correct popup type
  const handleTimerEnd = async () => {
    handleDescriptiveTest();
    updateSectionTime();
    setPopupType('timeExpired'); // Make sure this is set correctly

    // Calculate ALL sections data
    const allSectionsData = calculateAllSectionsData();
    setSectionSummaryData(allSectionsData);
    setShowModal(true);
  };
  const getKeywords = (questionIndex = clickedQuestionIndex) => {
    // Find which section and question this belongs to
    let currentSectionIndex = 0;
    let relativeQuestionIndex = 0;
    let count = 0;

    examData.section.forEach((section, sectionIdx) => {
      const questions = section.questions?.[selectedLanguage?.toLowerCase()] || [];
      if (questionIndex >= count && questionIndex < count + questions.length) {
        currentSectionIndex = sectionIdx;
        relativeQuestionIndex = questionIndex - count;
      }
      count += questions.length;
    });

    const keywordString = examData?.section?.[currentSectionIndex]?.questions?.[
      selectedLanguage?.toLowerCase()
    ]?.[relativeQuestionIndex]?.keywords;

    if (typeof keywordString === "string") {
      return keywordString.split(",").map((k) => k.trim().toLowerCase());
    }
    return [];
  };

  // ✅ Check grammar for the current section's text
  // Update your checkGrammar function
  const checkGrammar = async (text, questionIndex = clickedQuestionIndex) => {
    try {
      if (typeof text !== "string") {
        console.warn("Invalid text input for grammar check:", text);
        return {
          corrections: [],
          scoreBreakdown: null,
          scoreData: calculateScore("", [], questionIndex),
        };
      }

      const textToCheck = text.trim();
      if (!textToCheck) {
        return {
          corrections: [],
          scoreBreakdown: null,
          scoreData: calculateScore("", [], questionIndex),
        };
      }

      // ✅ Call your backend (/chat)
      const response = await Api.post("/chat", {
        message: textToCheck,
        questionIndex: questionIndex // Send question index for context
      });

      const correctedText = response?.data?.reply || textToCheck;

      // Parse corrections from API response
      const corrections = [];

      // If API returns detailed corrections
      if (response?.data?.corrections && Array.isArray(response.data.corrections)) {
        corrections.push(...response.data.corrections);
      }
      // If only full text correction is available
      else if (correctedText !== textToCheck) {
        corrections.push({
          original: textToCheck,
          corrected: correctedText,
          type: "comprehensive_correction",
          message: "Text needs improvement"
        });
      }

      const scoreData = calculateScore(textToCheck, corrections, questionIndex);

      console.log(`✅ Grammar Check Results for Q${questionIndex + 1}:`);
      console.log("Original Text:", textToCheck);
      console.log("Corrected Text:", correctedText);
      console.log("Corrections Found:", corrections.length);
      console.log("Score Data:", scoreData);

      const scoreBreakdown = corrections.map((issue, index) => ({
        id: `${questionIndex}-${index}`,
        message: issue.message || "Suggested improvement",
        suggestion: issue.corrected || issue.suggestion || correctedText,
        context: issue.original || textToCheck,
        type: issue.type || "grammar",
        severity: issue.severity || "medium"
      }));

      return {
        corrections,
        scoreBreakdown: scoreBreakdown.length > 0 ? scoreBreakdown : null,
        scoreData,
        correctedText,
      };
    } catch (error) {
      console.error(`❌ Grammar check failed for Q${questionIndex + 1}:`, error);

      const fallbackScoreData = calculateScore(text?.toString() || "", [], questionIndex);

      return {
        corrections: [],
        scoreBreakdown: null,
        scoreData: fallbackScoreData,
        correctedText: text?.toString() || "",
        error: error.message,
      };
    }
  };

  // Grammar check function
  // const calculateScore = async (issues) => {
  //   const keywords = getKeywords();
  //   const expectedWordCount =
  //     examData?.section?.[currentSectionIndex]?.questions?.[
  //       selectedLanguage?.toLowerCase()
  //     ]?.[0]?.words_limit || 100;

  //   const currentText =
  //     descriptiveData?.[currentSectionIndex]?.text?.[0] || "";

  //   let spellingErrors = 0;
  //   let grammarErrors = 0;

  //   // Count spelling vs grammar issues
  //   issues.forEach((issue) => {
  //     const category = issue.TopCategoryIdDescription?.toLowerCase() || "";
  //     if (category.includes("capitalization") || category.includes("spelling")) {
  //       spellingErrors++;
  //     } else {
  //       grammarErrors++;
  //     }
  //   });

  // //   // Word count
  //   const totalWords = currentText.trim().split(/\s+/).filter(Boolean).length;

  //   // Score calculations
  //   const spellingScore = spellingErrors === 0 ? 35 : Math.max(0, 35 - spellingErrors * 2);
  //   const grammarScore = grammarErrors === 0 ? 35 : Math.max(0, 35 - grammarErrors * 2);
  //   const wordCountScore = Math.round(Math.min((totalWords / expectedWordCount) * 20, 20));

  //   // Keyword match score
  //   let matchedKeywords = 0;
  //   const lowerText = currentText.toLowerCase();
  //   keywords.forEach((kw) => {
  //     if (lowerText.includes(kw)) matchedKeywords++;
  //   });
  //   const keywordScore = keywords.length > 0 ? (matchedKeywords / keywords.length) * 10 : 0;

  //   // Total score
  //   const totalScore = spellingScore + grammarScore + wordCountScore + keywordScore;

  //   const scoreData = {
  //     spellingScore,
  //     grammarScore,
  //     wordCountScore,
  //     keywordScore,
  //     totalScore: Math.round(totalScore),
  //     totalWords,
  //   };

  //   setScoreData(scoreData);

  //   if (currentSectionIndex === examData?.section?.length - 1) {
  //     await submitExam(descriptiveData.map(d => d.text?.[0] || ""), issues, scoreData, keywords, expectedWordCount);
  //   }

  //   // Debug logs
  //   console.log("✅ Score Data:", scoreData);
  //   console.log("Text:", currentText);
  //   console.log("Issues:", issues);
  //   console.log("Keywords:", keywords);
  //   console.log("Expected Word Count:", expectedWordCount);

  // };

  const calculateScore = (text, corrections = [], questionIndex = clickedQuestionIndex) => {
    const textToScore = typeof text === "string" ? text : "";
    const keywords = getKeywords(questionIndex);

    // Get SECTION data
    const sectionData = examData?.section?.[currentSectionIndex];
    const totalMarks = sectionData?.t_mark || 10;

    // Get QUESTION data
    const questionData = sectionData?.questions?.[
      selectedLanguage?.toLowerCase()
    ]?.[questionIndex - startingIndex];

    const expectedWordCount = questionData?.words_limit || 100;

    // Count errors from corrections
    const validCorrections = Array.isArray(corrections) ? corrections : [];
    let spellingErrors = 0;
    let grammarErrors = 0;
    let punctuationErrors = 0;

    validCorrections.forEach(issue => {
      const type = issue.type?.toLowerCase() || "";
      if (type.includes('spelling')) spellingErrors++;
      else if (type.includes('punctuation')) punctuationErrors++;
      else grammarErrors++;
    });

    // Word count calculation
    const wordCount = textToScore.trim().split(/\s+/).filter(w => w.trim().length > 0).length;

    // **Get scoring weights from SECTION configuration**
    // You can store these in your section data structure
    const scoringWeights = sectionData?.scoring_weights || {
      spelling: 0.35,    // 35%
      grammar: 0.35,     // 35%
      keyword: 0.10,     // 10%
      wordCount: 0.20    // 20%
    };

    const spellingWeight = totalMarks * scoringWeights.spelling;
    const grammarWeight = totalMarks * scoringWeights.grammar;
    const keywordWeight = totalMarks * scoringWeights.keyword;
    const wordCountWeight = totalMarks * scoringWeights.wordCount;

    // Calculate scores
    const maxErrors = Math.max(5, Math.floor(totalMarks / 2));

    const spellingScore = Math.max(0, spellingWeight - (spellingErrors / maxErrors) * spellingWeight);
    const grammarScore = Math.max(0, grammarWeight - (grammarErrors / maxErrors) * grammarWeight);
    const punctuationScore = 0;

    const wordCountScore = Math.max(0, Math.min(wordCountWeight, (wordCount / expectedWordCount) * wordCountWeight));

    const matchedKeywords = keywords.filter(kw => textToScore.toLowerCase().includes(kw.toLowerCase())).length;
    const keywordScore = keywords.length > 0 ? (matchedKeywords / keywords.length) * keywordWeight : keywordWeight;

    const totalScore = Math.min(totalMarks, spellingScore + grammarScore + punctuationScore + wordCountScore + keywordScore);

    return {
      spellingScore: Math.round(spellingScore * 100) / 100,
      grammarScore: Math.round(grammarScore * 100) / 100,
      punctuationScore: Math.round(punctuationScore * 100) / 100,
      wordCountScore: Math.round(wordCountScore * 100) / 100,
      keywordScore: Math.round(keywordScore * 100) / 100,
      totalScore: Math.round(totalScore * 100) / 100,
      totalWords: wordCount,
      spellingErrors,
      grammarErrors,
      punctuationErrors,
      matchedKeywords,
      keywordCount: keywords.length,
      expectedWordCount,
      totalMarks,
      corrections: validCorrections,
    };
  };
  const submitExam = async (explicitStatus = null) => {
    const res = await updateSectionTime(explicitStatus);
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
      setQuestionTimes((prev) => ({
        ...prev,
        [clickedQuestionIndex]:
          (prev[clickedQuestionIndex] || 0) + questionTime,
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
    for (let i = 0; i < examData?.section?.length; i++) {
      await handleDescriptiveTest(i);
    }

    const { formattedSections, totalScore, endTime } = getFormattedSections();

    const timeTakenInSeconds = Math.floor((endTime - examStartTime) / 1000);
    const formattedTotalTime = formatTime(timeTakenInSeconds);

    setTotalTime(formattedTotalTime);

    setExamDataSubmission({
      formattedSections,
      totalScore,
      timeTakenInSeconds,
      endTime,
    });
  };

  // Add debounce for auto grammar check
  const [typingTimeout, setTypingTimeout] = useState(null);

  useEffect(() => {
    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [typingTimeout]);

  const handleChangeWithAutoCheck = (e) => {
    const inputText = e.target.value;
    const wordsArray = inputText.trim().split(/\s+/).filter(Boolean);
    const currentCount = wordsArray.length;

    setWordCounto(currentCount);

    const limitReached =
      (countType === "decrement" && currentCount >= words) ||
      (countType === "increment" && currentCount >= words);
    setLimitReached(limitReached);

    let finalText = inputText;
    if (countType === "decrement" && currentCount > words) {
      finalText = wordsArray.slice(0, words).join(" ");
    }

    setDescriptiveData((prev) => {
      const updated = [...prev];

      if (!updated[clickedQuestionIndex]) {
        updated[clickedQuestionIndex] = {
          text: [""],
          corrections: [],
          scoreBreakdown: null,
          scoreData: [],
          keywords: [],
          wordCount: 0,
        };
      }

      updated[clickedQuestionIndex] = {
        ...updated[clickedQuestionIndex],
        text: [finalText],
        wordCount: currentCount,
      };

      return updated;
    });

    // Auto grammar check after user stops typing for 2 seconds
    if (typingTimeout) clearTimeout(typingTimeout);

    const newTimeout = setTimeout(() => {
      if (finalText.trim().length > 10) { // Only check if meaningful text exists
        handleDescriptiveTest(clickedQuestionIndex);
      }
    }, 2000);

    setTypingTimeout(newTimeout);
  };
  const handleDescriptiveTest = async (questionIndex = clickedQuestionIndex) => {
    try {
      const currentText = descriptiveData?.[questionIndex]?.text?.[0] || "";

      // Skip empty text
      if (!currentText.trim()) {
        console.log(`⏩ Skipping grammar check for Q${questionIndex + 1} - empty text`);
        return {
          corrections: [],
          scoreData: calculateScore("", [], questionIndex),
          scoreBreakdown: null
        };
      }

      console.log(`🔍 Checking grammar for Q${questionIndex + 1}...`);

      const { corrections, scoreData, scoreBreakdown, correctedText } = await checkGrammar(currentText, questionIndex);

      let newDataSnapshot;
      // Update state immutably
      setDescriptiveData(prev => {
        const newData = [...prev];

        // Initialize question data if it doesn't exist
        if (!newData[questionIndex]) {
          newData[questionIndex] = {
            text: [""],
            corrections: [],
            scoreBreakdown: null,
            scoreData: null,
            keywords: [],
            wordCount: 0
          };
        }

        // Update the specific question's data
        newData[questionIndex] = {
          ...newData[questionIndex],
          text: [currentText],
          corrections,
          scoreBreakdown,
          scoreData,
          correctedText: correctedText || currentText,
          wordCount: scoreData?.totalWords || 0,
          lastChecked: new Date().toISOString()
        };

        newDataSnapshot = newData;
        return newData;
      });

      // Update corrections and score data if it's the current question
      if (questionIndex === clickedQuestionIndex) {
        setCorrections(corrections);
        setScoreData(scoreData);
        setScoreBreakdown(scoreBreakdown);
      }

      // Auto-save descriptive data to backend
      if (user?._id && id && newDataSnapshot) {
        Api.post(`results/${user._id}/${id}`, {
          descriptiveData: newDataSnapshot,
          status: "paused" // intermittent save
        }).then(() => {
          dispatch(setResults({
            [id]: {
              status: "paused",
            }
          }));
        }).catch(err => console.error("Auto-save failed", err));
      }

      console.log(`✅ Grammar check completed for Q${questionIndex + 1}`);
      console.log(`📊 Score: ${scoreData?.totalScore}/100`);
      console.log(`📝 Corrections: ${corrections.length}`);

      return { corrections, scoreData, scoreBreakdown, correctedText };
    } catch (error) {
      console.error(`❌ Error in question ${questionIndex + 1} descriptive test:`, error);
      return null;
    }
  };
  const handlePauseResume = () => {
    if (pauseCount < 1) {
      // ✅ IMMEDIATELY pause all timers first
      setIsPaused(true);

      // Clear question timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // Clear descriptive timer
      if (descriptiveTimerRef.current) {
        clearInterval(descriptiveTimerRef.current);
        descriptiveTimerRef.current = null;
      }

      const now = new Date();

      // ✅ Save current question time BEFORE showing popup
      if (questionStartTime && clickedQuestionIndex !== null) {
        const secondsSpent = Math.floor((now - questionStartTime) / 1000);
        setQuestionTimes((prev) => ({
          ...prev,
          [clickedQuestionIndex]: (prev[clickedQuestionIndex] || 0) + secondsSpent,
        }));
        setQuestionStartTime(null);
      }

      // ✅ Save section time
      const timeSpent = Math.floor((now - currentSectionStartTimeRef.current) / 1000);
      setSectionTimes((prev) => ({
        ...prev,
        [currentSectionIndex]: (prev[currentSectionIndex] || 0) + timeSpent,
      }));
      currentSectionStartTimeRef.current = now;

      // ✅ Store ALL current state including descriptive data AND descriptive timer
      const currentState = {
        clickedQuestionIndex,
        selectedOptions,
        visitedQuestions,
        markedForReview,
        currentSectionIndex,
        descriptiveData: JSON.parse(JSON.stringify(descriptiveData)), // Deep copy
        questionTimes: JSON.parse(JSON.stringify(questionTimes)),
        questionTime, // Current question's accumulated time
        descriptiveTimeLeft, // ✅ CRITICAL: Save current descriptive timer value
        sectionTimes: JSON.parse(JSON.stringify(sectionTimes)),
        pauseTime: now.toISOString(), // When pause was clicked
      };

      localStorage.setItem(`examState_${id}`, JSON.stringify(currentState));
      console.log("⏸️ Exam paused at:", now, "Question:", clickedQuestionIndex, "Descriptive time left:", descriptiveTimeLeft);

      // Now show the confirmation dialog
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
        customClass: {
          container: "swal-full-screen",
          popup: "swal-popup-full-height",
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          // User chose to quit
          console.log("🚪 User chose to quit");
          await submitExam("paused");
          await new Promise((resolve) => setTimeout(resolve, 1000));
          closeAndNotifyParent();
        } else {
          // User chose to resume
          console.log("🔄 Resuming exam...");
          await resumeExam();
        }
      });
    }
  };

  // New resume function
  const resumeExam = async () => {
    console.log("🔄 Starting resume process...");

    // Restore state from localStorage
    const savedState = localStorage.getItem(`examState_${id}`);
    if (savedState) {
      const state = JSON.parse(savedState);
      console.log("📋 Restoring state:", state);

      // Restore all question states
      setClickedQuestionIndex(state.clickedQuestionIndex);
      setSelectedOptions(state.selectedOptions);
      setVisitedQuestions(state.visitedQuestions);
      setMarkedForReview(state.markedForReview);
      setCurrentSectionIndex(state.currentSectionIndex);
      setDescriptiveData(state.descriptiveData || []);
      setQuestionTimes(state.questionTimes || {});
      setQuestionTime(state.questionTime || 0);

      // ✅ CRITICAL FIX: Restore the descriptive timer from saved state
      if (state.descriptiveTimeLeft) {
        setDescriptiveTimeLeft(state.descriptiveTimeLeft);
      } else {
        // Fallback to initial time if not found in saved state
        setDescriptiveTimeLeft(destimer * 60);
      }

      setSectionTimes(state.sectionTimes || {});
    }

    // Reset pause state
    setIsPaused(false);
    setPauseCount(0);

    const now = new Date();
    setQuestionStartTime(now);
    currentSectionStartTimeRef.current = now;

    // Restart question timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setQuestionTime((prev) => prev + 1);
    }, 1000);

    // ✅ CRITICAL FIX: Restart descriptive timer properly
    const isDescriptiveQuestion =
      examData?.section?.[currentSectionIndex]?.questions?.[
        selectedLanguage?.toLowerCase()
      ]?.[clickedQuestionIndex - startingIndex]?.question_type === "descriptive";

    if (isDescriptiveQuestion) {
      console.log("🕒 Restarting descriptive timer from:", descriptiveTimeLeft, "seconds");

      // Clear any existing descriptive timer
      if (descriptiveTimerRef.current) {
        clearInterval(descriptiveTimerRef.current);
        descriptiveTimerRef.current = null;
      }

      // Start new descriptive timer from the saved time
      descriptiveTimerRef.current = setInterval(() => {
        setDescriptiveTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(descriptiveTimerRef.current);
            descriptiveTimerRef.current = null;
            handleTimerEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    console.log("✅ Exam resumed successfully");
    console.log(`⏳ Question ${clickedQuestionIndex + 1} time: ${questionTime}s`);
    console.log(`📝 Descriptive time left: ${formatTime(descriptiveTimeLeft)}`);
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
  useEffect(() => {
    if (examData) {
      const initialDescriptiveData = [];
      examData.section.forEach((section, sectionIndex) => {
        const questions = section.questions?.[selectedLanguage?.toLowerCase()] || [];
        questions.forEach((question, questionIndex) => {
          const fullIndex = examData.section
            .slice(0, sectionIndex)
            .reduce((acc, sec) =>
              acc + (sec.questions?.[selectedLanguage?.toLowerCase()]?.length || 0), 0) + questionIndex;

          initialDescriptiveData[fullIndex] = {
            text: [""],
            corrections: [],
            scoreBreakdown: null,
            scoreData: [],
            keywords: [],
            wordCount: 0,
          };
        });
      });
      setDescriptiveData(initialDescriptiveData);
    }
  }, [examData, selectedLanguage]);
  const handleChange = (e) => {
    const inputText = e.target.value;
    const wordsArray = inputText.trim().split(/\s+/).filter(Boolean);
    const currentCount = wordsArray.length;

    setWordCounto(currentCount);

    const limitReached =
      (countType === "decrement" && currentCount >= words) ||
      (countType === "increment" && currentCount >= words);
    setLimitReached(limitReached);

    let finalText = inputText;
    if (countType === "decrement" && currentCount > words) {
      finalText = wordsArray.slice(0, words).join(" ");
    }

    setDescriptiveData((prev) => {
      const updated = [...prev];

      // Use clickedQuestionIndex to store data per question
      if (!updated[clickedQuestionIndex]) {
        updated[clickedQuestionIndex] = {
          text: [""],
          corrections: [],
          scoreBreakdown: null,
          scoreData: [],
          keywords: [],
          wordCount: 0,
        };
      }

      updated[clickedQuestionIndex] = {
        ...updated[clickedQuestionIndex],
        text: [finalText],
        wordCount: currentCount,
      };

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
  const handleSectionCompletion = async () => {
    // This function is only for normal flow (when time hasn't expired)
    // Remove time check from here since popup will handle it differently
    handleDescriptiveTest();
    console.log("handleSectionCompletion called");
    await setIsPaused(false);

    setShowModal(false);
    // setIsSubmitted(true); // REMOVED: This causes premature "Test Completed" UI

    if (currentSectionIndex < examData?.section?.length - 1) {
      // Move to next section (only for normal flow)
      console.log(`Moving to next section. Current: ${currentSectionIndex}`);
      setCurrentSectionIndex(currentSectionIndex + 1);
      setQuestionTime(0);

      const newStartingIndex = examData?.section
        ?.slice(0, currentSectionIndex + 1)
        .reduce(
          (acc, section) =>
            acc +
            (section.questions?.[selectedLanguage?.toLowerCase()]?.length || 0),
          0
        );

      setClickedQuestionIndex(newStartingIndex);
    } else {
      // Last section submit
      console.log("Last section complete. Submitting exam.");
      await submitExam();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      finishTestAndOpenResult();
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
  const renderTextarea = () => (
    <>
      <textarea
        value={descriptiveData?.[clickedQuestionIndex]?.text?.[0] || ""}
        onChange={handleChangeWithAutoCheck} // Use the new handler
        onKeyDown={preventShortcuts}
        onCopy={(e) => e.preventDefault()}
        onCut={(e) => e.preventDefault()}
        onPaste={(e) => e.preventDefault()}
        disabled={limitReached}
        placeholder="Enter your answer here..."
        rows="6"
        cols="100"
        style={{
          width: "100%",
          height: "350px",
          padding: "10px",
          fontSize: "1rem",
          borderRadius: "8px",
          border: "1px solid #ccc",
          resize: "none",
          backgroundColor: limitReached ? "#f5f5f5" : "#fff",
        }}
      />
      <div className="mt-3 d-flex justify-content-between align-items-center">
        <div className="fw-bold text-right" style={{ color: limitReached ? "red" : "#555" }}>
          {limitReached
            ? "Word limit reached"
            : countType === "decrement"
              ? `Words remaining: ${Math.max(words - wordCounto, 0)} / ${words}`
              : `Words used: ${wordCounto} / ${words}`}
        </div>


      </div>
    </>
  );

  // const formatTime = (time) => {
  //   const minutes = Math.floor(time / 60);
  //   const seconds = time % 60;
  //   return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  // };

  const [descriptiveTimeLeft, setDescriptiveTimeLeft] = useState(30 * 60);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Use useRef for the timer
  const descriptiveTimerRef = useRef(null);

  useEffect(() => {
    const isDescriptiveQuestion =
      examData?.section?.[currentSectionIndex]?.questions?.[
        selectedLanguage?.toLowerCase()
      ]?.[clickedQuestionIndex - startingIndex]?.question_type === "descriptive";

    // Only start timer if not paused and it's a descriptive question
    if (isDescriptiveQuestion && !isPaused) {
      // Don't reset timer if we're resuming - use existing descriptiveTimeLeft
      if (!descriptiveTimerRef.current) {
        console.log("🕒 Starting descriptive timer from:", descriptiveTimeLeft, "seconds");

        descriptiveTimerRef.current = setInterval(() => {
          setDescriptiveTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(descriptiveTimerRef.current);
              descriptiveTimerRef.current = null;
              handleTimerEnd();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } else {
      // If not descriptive question or paused, clear the timer
      if (descriptiveTimerRef.current) {
        clearInterval(descriptiveTimerRef.current);
        descriptiveTimerRef.current = null;
      }
    }

    // Cleanup on component unmount or when leaving descriptive mode
    return () => {
      if (descriptiveTimerRef.current && !isPaused) {
        clearInterval(descriptiveTimerRef.current);
        descriptiveTimerRef.current = null;
      }
    };
  }, [currentSectionIndex, clickedQuestionIndex, examData, selectedLanguage, isPaused]);

  // Initialize descriptive timer when component mounts
  useEffect(() => {
    const savedState = localStorage.getItem(`examState_${id}`);
    if (savedState) {
      const state = JSON.parse(savedState);
      // Restore descriptive time from saved state
      if (state.descriptiveTimeLeft) {
        setDescriptiveTimeLeft(state.descriptiveTimeLeft);
      } else {
        setDescriptiveTimeLeft(destimer * 60);
      }
    } else {
      // Fresh start
      setDescriptiveTimeLeft(destimer * 60);
    }
  }, [id, destimer]);

  // // Add this useEffect to handle the countdown
  // useEffect(() => {
  //   if (examData?.section?.[currentSectionIndex]?.questions?.[selectedLanguage?.toLowerCase()]?.[clickedQuestionIndex - startingIndex]?.question_type === "descriptive") {
  //     const timer = setInterval(() => {
  //       setDescriptiveTimeLeft(prev => {
  //         if (prev <= 0) {
  //           clearInterval(timer);
  //           handleSubmitSection(); // Auto-submit when time runs out
  //           return 0;
  //         }
  //         return prev - 1;
  //       });
  //     }, 1000);

  //     return () => clearInterval(timer);
  //   }
  // }, [currentSectionIndex, clickedQuestionIndex, descriptiveTimeLeft]);

  //   useEffect(() => {
  //     const compositetime = examData?.duration * 60;
  //     console.log("Composite time:", compositetime);
  //     setDuration(compositetime);
  //   }, [examData, currentSectionIndex, duration, descriptiveTimeLeft]);
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
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
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

      examData?.section?.forEach((section, sectionIndex) => {
        const questions = section?.questions?.[selectedLanguage?.toLowerCase()] || [];

        questions?.forEach((question, questionIndex) => {
          const fullIndex = examData.section
            .slice(0, sectionIndex)
            .reduce(
              (acc, sec) =>
                acc + (sec.questions?.[selectedLanguage?.toLowerCase()]?.length || 0),
              0
            ) + questionIndex;

          // Multiple ways to check for descriptive answer
          let hasAnswer = false;

          // Method 1: Check nested structure
          if (descriptiveData?.[sectionIndex]?.questions?.[questionIndex]?.text?.[0]) {
            hasAnswer = descriptiveData[sectionIndex].questions[questionIndex].text[0].trim() !== "";
          }
          // Method 2: Check flat structure
          else if (descriptiveData?.[sectionIndex]?.text?.[questionIndex]) {
            hasAnswer = descriptiveData[sectionIndex].text[questionIndex].trim() !== "";
          }
          // Method 3: Check by question ID if available
          else if (question._id && descriptiveData?.[question._id]) {
            hasAnswer = descriptiveData[question._id].text?.trim() !== "";
          }

          const isVisited = visitedQuestions.includes(fullIndex);
          const isMarked = markedForReview.includes(fullIndex);

          if (isMarked && hasAnswer) {
            answeredAndMarked++;
          } else if (isMarked && !hasAnswer) {
            markedForReviewCount++;
          } else if (hasAnswer) {
            answered++;
          } else if (isVisited && !hasAnswer) {
            notAnswered++;
          } else {
            notVisited++;
          }
        });
      });

      setAnsweredCount(answered);
      setNotAnsweredCount(notAnswered);
      setNotVisitedCount(notVisited);
      setMarkedForReviewCount(markedForReviewCount);
      setAnsweredAndMarkedCount(answeredAndMarked);
    };

    calculateCounts();
  }, [
    descriptiveData,
    visitedQuestions,
    markedForReview,
    examData,
    selectedLanguage,
  ]);

  // Helper function to check if descriptive answer exists
  const hasDescriptiveAnswer = (sectionIndex, questionIndex) => {
    if (!descriptiveData) return false;

    // Try different possible data structures
    return (
      // Nested structure: descriptiveData[sectionIndex].questions[questionIndex].text[0]
      (descriptiveData[sectionIndex]?.questions?.[questionIndex]?.text?.[0]?.trim() !== "" &&
        descriptiveData[sectionIndex]?.questions?.[questionIndex]?.text?.[0] !== undefined) ||

      // Flat structure: descriptiveData[sectionIndex].text[questionIndex]
      (descriptiveData[sectionIndex]?.text?.[questionIndex]?.trim() !== "" &&
        descriptiveData[sectionIndex]?.text?.[questionIndex] !== undefined) ||

      // Direct structure: descriptiveData[questionId]
      (examData?.section?.[sectionIndex]?.questions?.[selectedLanguage?.toLowerCase()]?.[questionIndex]?._id &&
        descriptiveData[examData.section[sectionIndex].questions[selectedLanguage.toLowerCase()][questionIndex]._id]?.text?.trim() !== "")
    );
  };

  const getSectionCounts = (
    section,
    sectionIndex,
    visitedQuestions,
    markedForReview,
    selectedLanguage
  ) => {
    let answered = 0;
    let notAnswered = 0;
    let notVisited = 0;
    let markedForReviewCount = 0;
    let answeredAndMarked = 0;

    const questions = section?.questions?.[selectedLanguage?.toLowerCase()] || [];
    const startingIndex = examData.section
      .slice(0, sectionIndex)
      .reduce(
        (acc, sec) =>
          acc + (sec.questions?.[selectedLanguage?.toLowerCase()]?.length || 0),
        0
      );

    questions?.forEach((question, questionIndex) => {
      const fullIndex = startingIndex + questionIndex;

      const hasAnswer = hasDescriptiveAnswer(sectionIndex, questionIndex);
      const isVisited = visitedQuestions.includes(fullIndex);
      const isMarked = markedForReview.includes(fullIndex);

      if (isMarked && hasAnswer) {
        answeredAndMarked++;
      } else if (isMarked && !hasAnswer) {
        markedForReviewCount++;
      } else if (hasAnswer) {
        answered++;
      } else if (isVisited && !hasAnswer) {
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

    console.log(
      `⏳ Resuming question ${clickedQuestionIndex} from ${existingTime}s`
    );
  };

  const finishTestAndOpenResult = async () => {
    try {
      await submitExam("completed");

      // Build the result URL
      const resultUrl = `${window.location.origin}/liveresult/${id}/${user?._id}`;

      // 1. Notify parent via postMessage (legacy/fallback)
      if (window.opener) {
        console.log("Notifying parent via postMessage");
        window.opener.postMessage(
          {
            type: "test-status-updated",
            testId: id,
          },
          window.location.origin
        );
      }

      // 2. Broadcast via BroadcastChannel for robust cross-tab sync
      const channel = new BroadcastChannel('exam-status-channel');
      channel.postMessage({ type: 'test-status-updated', testId: id });
      channel.close();

      window.open(resultUrl, "_blank");

      // Allow time for message to send before closing
      setTimeout(() => {
        window.close();
      }, 300);
    } catch (error) {
      console.error("Error finishing test:", error);
      window.location.href = `${window.location.origin}/liveresult/${id}/${user?._id}`;
    }
  };

  useEffect(() => {
    // Timer interval setup
    timerRef.current = setInterval(() => {
      setQuestionTime((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const now = new Date();

    // 1️⃣ Save time for previous question
    if (previousQuestionIndex !== null && questionStartTime) {
      const secondsSpent = Math.floor((now - questionStartTime) / 1000);
      setQuestionTimes((prev) => ({
        ...prev,
        [previousQuestionIndex]:
          (prev[previousQuestionIndex] || 0) + secondsSpent,
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
      setQuestionTime((prev) => prev + 1);
    }, 1000);

    // 5️⃣ Track previous index for next time
    setPreviousQuestionIndex(clickedQuestionIndex);

    return () => clearInterval(timerRef.current);
  }, [clickedQuestionIndex]);

  const closeAndNotifyParent = () => {
    if (window.opener) {
      console.log("Notifying parent via postMessage");
      window.opener.postMessage(
        {
          type: "test-status-updated",
          testId: id,
        },
        window.location.origin
      );
    }

    // Also broadcast via BroadcastChannel for robust cross-tab sync
    const channel = new BroadcastChannel('exam-status-channel');
    channel.postMessage({ type: 'test-status-updated', testId: id });
    channel.close();

    setTimeout(() => {
      window.close();
    }, 300);
  };
  return (
    <div className="mock-font " ref={commonDataRef}>
      <div>
        <div className="bg-[#3476bb] text-white font-bold h-12 w-full flex justify-around items-center">
          {/* Show Name */}
          <h1 className="mt-3 text-sm md:text-xl font-bold">{show_name}</h1>

          {/* Logo */}
          <img src={logo} alt="logo" className="h-10 w-auto bg-white" />

          <h1 className="text-center text-black bg-gray-100 p-2">
            Time Left des: {formatTime(descriptiveTimeLeft)}
          </h1>

          {/* Fullscreen Toggle Button */}
          <button
            onClick={toggleFullScreen}
            className="ml-8 bg-gray-600 p-2 rounded-full cursor-pointer text-white"
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>
        </div>

        {/* <p className="text-lg">Selected Language: {selectedLanguage}</p> */}

        <div>
          {/* Modal for showing section summary */}
          {showModal && (
            <div className="modal" tabIndex="-1" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
              <div className="modal-dialog modal-xl">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5 text-green-500">
                      {popupType === 'timeExpired'
                        ? 'Time Finished - Complete Test Summary'
                        : popupType === 'test'
                          ? 'Complete Test Summary'
                          : 'Section Summary'}
                    </h1>
                    <button type="button" className="btn-close" onClick={popupmodal}></button>
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

                          {/* {(popupType === 'timeExpired' || popupType === 'test') && sectionSummaryData.length > 1 && (
                            <tr className="table-info fw-bold">
                              <td>Total</td>
                              <td>{sectionSummaryData.reduce((sum, section) => sum + section.totalQuestions, 0)}</td>
                              <td>{sectionSummaryData.reduce((sum, section) => sum + section.answeredQuestions, 0)}</td>
                              <td>{sectionSummaryData.reduce((sum, section) => sum + section.notAnsweredQuestions, 0)}</td>
                              <td>{sectionSummaryData.reduce((sum, section) => sum + section.visitedQuestionsCount, 0)}</td>
                              <td>{sectionSummaryData.reduce((sum, section) => sum + section.notVisitedQuestions, 0)}</td>
                              <td>{sectionSummaryData.reduce((sum, section) => sum + section.reviewedQuestions, 0)}</td>
                            </tr>
                          )} */}
                        </tbody>
                      </table>
                    </div>

                    {/* {popupType === 'timeExpired' && (
                      <div className="alert alert-warning text-center">
                        <strong>Time has finished!</strong>
                        <br />
                        Automatically submitting in 2 seconds...
                        <div className="mt-2">
                          <div className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      </div>
                    )} */}
                  </div>
                  <div className="modal-footer">
                    <div className="d-flex justify-content-center w-100">
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={async () => {
                          setShowModal(false);

                          if (popupType === 'timeExpired' || popupType === 'test') {
                            // Time finished or Submit Test - go directly to result
                  setIsPaused(true);
          await submitExam("paused");
                            await new Promise((resolve) => setTimeout(resolve, 1000));
                            setIsSubmitted(true); // ADDED: Set isSubmitted only when last section is complete
                            finishTestAndOpenResult();
                          } else {
                            // Normal section submit - use existing logic
                            handleSectionCompletion();
                          }
                        }}
                      >
                        {popupType === 'timeExpired' || popupType === 'test' || currentSectionIndex === examData?.section?.length - 1
                          ? 'Submit'
                          : 'Next Section'}
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
                      ${currentSectionIndex === index
                    ? " font-medium underline"
                    : ""
                  }`}
                onClick={() => {
                  const newStartingIndex = examData.section
                    .slice(0, index)
                    .reduce(
                      (acc, sec) =>
                        acc +
                        (sec?.questions?.[selectedLanguage?.toLowerCase()]
                          ?.length || 0),
                      0
                    );
                  setCurrentSectionIndex(index);
                  setClickedQuestionIndex(newStartingIndex);
                }}
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
                    examData.section?.[currentSectionIndex]?.name
                      ?.toLowerCase()
                      .trim() !== "english language" && (
                      <div className="flex items-center mx-2">
                        <select
                          value={displayLanguage || selectedLanguage}
                          onChange={(e) => setDisplayLanguage(e.target.value)}
                          className="border rounded p-1"
                        >
                          {examData?.bilingual_status ? (
                            <>
                              {examData?.english_status && (
                                <option value="English">English</option>
                              )}
                              {examData?.hindi_status && (
                                <option value="Hindi">Hindi</option>
                              )}
                            </>
                          ) : (
                            <>
                              {examData?.english_status && (
                                <option value="English">English</option>
                              )}
                              {examData?.hindi_status && (
                                <option value="Hindi">Hindi</option>
                              )}
                              {examData?.tamil_status && (
                                <option value="Tamil">Tamil</option>
                              )}
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
                (() => {
                  const currentQuestion =
                    examData.section[currentSectionIndex]?.questions?.[
                    (displayLanguage || selectedLanguage)?.toLowerCase()
                    ]?.[clickedQuestionIndex - startingIndex];

                  const hasCommonData = !!currentQuestion?.common_data;
                  const hasQuestion = !!currentQuestion?.question;

                  const showSplitLayout = hasCommonData && hasQuestion;

                  return (
                    <div className="flex flex-col md:flex-row p-0">
                      {/* ✅ CASE 1: Split layout when both commonData & question exist */}
                      {showSplitLayout ? (
                        <>
                          {/* LEFT - common data */}
                          <div
                            className="md:w-1/2 p-3 pb-5 md:border-r border-gray-300"
                            style={{
                              height: "calc(100vh - 150px)",
                              overflowY: "auto",
                            }}
                          >
                            <div
                              className="text-wrap"
                              style={{
                                whiteSpace: "normal",
                                wordWrap: "break-word",
                              }}
                              dangerouslySetInnerHTML={{
                                __html: currentQuestion?.common_data,
                              }}
                            />
                          </div>

                          {/* RIGHT - question + textarea */}
                          <div
                            className="md:w-1/2 p-3 pb-5"
                            style={{
                              height: "calc(100vh - 150px)",
                              overflowY: "auto",
                            }}
                          >
                            <div
                              className="text-wrap mb-2"
                              style={{
                                whiteSpace: "normal",
                                wordWrap: "break-word",
                              }}
                              dangerouslySetInnerHTML={{
                                __html: currentQuestion?.question,
                              }}
                            />

                            {/* Textarea */}
                            {renderTextarea()}
                          </div>
                        </>
                      ) : (
                        // ✅ CASE 2: Stacked full-width layout (when not both are present)
                        <div
                          className="w-full p-3 pb-5"
                          style={{
                            height: "calc(100vh - 150px)",
                            overflowY: "auto",
                          }}
                        >
                          {/* Common Data */}
                          {hasCommonData && (
                            <div
                              className="text-wrap mb-4"
                              style={{
                                whiteSpace: "normal",
                                wordWrap: "break-word",
                              }}
                              dangerouslySetInnerHTML={{
                                __html: currentQuestion?.common_data,
                              }}
                            />
                          )}

                          {/* Question (if available) */}
                          {hasQuestion && (
                            <div
                              className="text-wrap mb-4"
                              style={{
                                whiteSpace: "normal",
                                wordWrap: "break-word",
                              }}
                              dangerouslySetInnerHTML={{
                                __html: currentQuestion?.question,
                              }}
                            />
                          )}

                          {/* ✅ Textarea always shown */}
                          {renderTextarea()}
                        </div>
                      )}
                    </div>
                  );
                })()
              ) : (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ height: "100vh" }}
                >
                  <div
                    className="spinner-border text-primary"
                    role="status"
                    style={{ width: "3rem", height: "3rem" }}
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
        ${isMobileMenuOpen ? "translate-x-0  w-3/4 " : "translate-x-full "}
        ${closeSideBar
              ? "md:translate-x-full md:w-0 border-0"
              : "md:translate-x-0 md:w-1/4"
            }
 ${isFullscreen
              ? "h-[87vh] md:h-[87vh]"
              : "h-[80vh] sm:h-[82vh] md:h-[85vh] lg:h-[85vh] xl:h-[85vh]"
            } fixed top-14 right-0 z-40 md:static shadow-sm md:block h-[79vh]`}
          style={{
            height: "calc(100vh - 150px)", // Adjust 150px to your header/footer height
            overflowY: "auto",
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
            <div className="w-fulll flex items-center justify-center space-x-4 p-2 bg-[#3476bb]">
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
            {examData?.section?.[currentSectionIndex]?.questions?.[
              selectedLanguage?.toLowerCase()
            ]?.[clickedQuestionIndex - startingIndex] && (
                <h1 className="text-center text-black bg-gray-100 p-2">
                  Time Left: {formatTime(descriptiveTimeLeft)}
                </h1>
              )}

            <center>
              <button
                onClick={handlePauseResume}
                className={`px-4 py-2 rounded-lg font-semibold transition duration-300 mt-2 ${isPaused
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

                let className = "";

                // Check if the question has been answered (for descriptive questions)
                // Now checking by question index (fullIndex) instead of section index
                const hasAnswer =
                  descriptiveData?.[fullIndex]?.text?.[0]?.trim() !== "" &&
                  descriptiveData?.[fullIndex]?.text?.[0] !== undefined;

                if (hasAnswer) {
                  className = "answerImg";
                  if (markedForReview.includes(fullIndex)) {
                    className += " mdansmarkedImg";
                  }
                } else if (visitedQuestions.includes(fullIndex)) {
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
                <span className="hidden md:block">Mark for Review & Next</span>
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
            {examData?.section?.length > 0 && (
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
                className="btn bg-blue-500 text-white hover:bg-blue-700 mt-2 md:mt-0 px-7 text-sm md:text-sm"
                onClick={currentSectionIndex === examData?.section?.length - 1 ? handleSubmitTest : handleSubmitSection}
              // Removed data-bs-toggle and data-bs-target to prevent Bootstrap/React modal conflict
              >
                {currentSectionIndex === examData?.section?.length - 1 ? "Submit Test" : "Submit Section"}
              </button>
            </center>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DescriptiveTest;
