import { useContext, useEffect, useRef, useState } from "react";
import Api from "../service/Api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import logo from '../assets/logo/sample-logo.png';
import Swal from 'sweetalert2'
import { FaChevronLeft, FaChevronRight, FaCompress, FaExpand, FaInfoCircle } from "react-icons/fa";
import { UserContext } from "../context/UserProvider";
const Test = () => {
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

  const { user } = useContext(UserContext);

  const location = useLocation();
  const selectedLanguage = location.state?.language || "English";
  // Fetch exam data

  const { id } = useParams();
  const navigate = useNavigate();
  // Prevent page refresh on F5 and refresh button click
  // Prevent page refresh on F5, Ctrl+R, and Ctrl+Shift+R
  window.addEventListener('beforeunload', function (e) {
    // Customize the confirmation message
    var confirmationMessage = 'Are you sure you want to leave?';

    // Standard for most browsers
    e.returnValue = confirmationMessage;

    // For some browsers
    return confirmationMessage;
  });

  // Prevent F5, Ctrl+R, Ctrl+Shift+R key presses
  window.addEventListener('keydown', function (e) {
    // Check if F5 or Ctrl+R or Ctrl+Shift+R is pressed
    if ((e.key === 'F5') || (e.ctrlKey && e.key === 'r') || (e.ctrlKey && e.shiftKey && e.key === 'R')) {
      e.preventDefault();  // Prevent F5, Ctrl+R, or Ctrl+Shift+R
    }
  });

  const toggleMenu = () => {
    setIsMobileMenuOpen(prevState => !prevState);
  };

  const [closeSideBar, setCloseSideBar] = useState(false)
  const toggleMenu2 = () => {
    setCloseSideBar(!closeSideBar);
  };

  const [isDataFetched, setIsDataFetched] = useState(false);
  const [show_name, setShow_name] = useState("")
  const [t_questions, sett_questions] = useState("")
  useEffect(() => {
    // Check if data has already been fetched
    if (!isDataFetched) {
      Api.get(`exams/getExam/${id}`)
        .then((res) => {
          if (res.data) {
            setExamData(res.data);
            setIsDataFetched(true);
            setShow_name(res.data.show_name)
            sett_questions(res.data.t_questions) // Mark that data is fetched
            console.log("kl", res.data.show_name);
          }
        })
        .catch((err) => console.error("Error fetching data:", err));
    }
  }, [id]);  // Only trigger when `id` changes


  // In the useEffect that fetches exam state
useEffect(() => {
  if (user?._id && id) {
    Api.get(`results/${user?._id}/${id}`)
      .then(response => {
        if (response.data) {
          const state = response.data;
          const initialOptions = Array(t_questions).fill(null);
          let lastVisitedIndex = 0;
          let visitedQuestionsList = [];
          let markedForReviewList = [];
          let absoluteIndexCounter = 0;

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
                if (question.isVisited === 1) {
                  visitedQuestionsList.push(absoluteIndex);
                  lastVisitedIndex = absoluteIndex; // Track most recently visited
                }

                // Track marked for review
                if (question.markforreview === 1 || question.ansmarkforrev === 1) {
                  markedForReviewList.push(absoluteIndex);
                }
              });
            });
          }

          setSelectedOptions(initialOptions);
          setVisitedQuestions(visitedQuestionsList);
          setMarkedForReview(markedForReviewList);
          setCurrentSectionIndex(state.currentSectionIndex || 0);
          
          // // Show the last visited question, or first question if none visited
          // setClickedQuestionIndex(visitedQuestionsList.length > -1 ? lastVisitedIndex : 0);
          if (visitedQuestionsList.length > 0) {
        setClickedQuestionIndex(visitedQuestionsList[0]  || lastVisitedIndex); // First visited question
      } else {
        setClickedQuestionIndex(lastVisitedIndex); // Default to first question
        setVisitedQuestions([0]);  // Mark it as visited
      }
        }
      })
      
      .catch(error => console.error('Error fetching exam state:', error));
  }
}, [id, user?._id, t_questions, selectedLanguage]);  


  const questionRef = useRef(null);
  const commonDataRef = useRef(null);
  const sidebarRef = useRef(null);

  const toastId = useRef(null); // Keep track of toast ID

  useEffect(() => {
    const handleWheel = (e, ref) => {
      e.preventDefault(); // Prevent mouse wheel scrolling

      // Only show toast if no toast is currently active
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.info("Scrolling with the mouse wheel is disabled. Use the scrollbar instead.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          theme: "colored",
        });
      }
    };

    // Attach event listeners to all scrollable elements
    const questionElement = questionRef.current;
    const commonDataElement = commonDataRef.current;
    const sidebarElement = sidebarRef.current;

    if (questionElement) {
      questionElement.addEventListener('wheel', (e) => handleWheel(e, questionRef), { passive: false });
    }

    if (commonDataElement) {
      commonDataElement.addEventListener('wheel', (e) => handleWheel(e, commonDataRef), { passive: false });
    }

    if (sidebarElement) {
      sidebarElement.addEventListener('wheel', (e) => handleWheel(e, sidebarRef), { passive: false });
    }

    return () => {
      if (questionElement) {
        questionElement.removeEventListener('wheel', (e) => handleWheel(e, questionRef));
      }

      if (commonDataElement) {
        commonDataElement.removeEventListener('wheel', (e) => handleWheel(e, commonDataRef));
      }

      if (sidebarElement) {
        sidebarElement.removeEventListener('wheel', (e) => handleWheel(e, sidebarRef));
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
      
      // Update the database with the new selection
      Api.post(`results/${user?._id}/${id}`, {
        selectedOptions: updatedOptions,
        currentQuestionIndex: clickedQuestionIndex,
        sectionIndex: currentSectionIndex
      });
      
      return updatedOptions;
    });
  
   


    let mark = 0;

    // Check if the selected option matches the correct answer
    if (correctAnswerIndex === index) {
      mark = 1.0; // Correct answer gets 1 mark
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
      ansmarkforrev: ansmarkforrev.includes(clickedQuestionIndex),
    };
  };

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

  // API get method

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the exam data from your API
        const res = await Api.get(`exams/getExam/${id}`);
        console.log(res);

        // Transform the data
        const transformedData = {
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
              })),
            },
            s_order: section.s_order || 0,
          })),
          score: res.data.score || 0,
          Attempted: res.data.Attempted || 0,
          timeTaken: res.data.timeTaken || 60,
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
        const postResponse = await Api.post(`/results/${user?._id}/${id}`, transformedData);
        console.log("Data posted successfully:", postResponse);

      } catch (error) {
        console.error("Error occurred:", error.message);
        // Handle error (show error message, etc.)
      }
    };

    // Call the async function inside useEffect
    fetchData();
  }, [id]);  // Ensure to add 'id' as a dependency for the effect


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


  const handleNextClick = () => {
    if (
      examData &&
      examData.section[currentSectionIndex] &&
      examData.section[currentSectionIndex].questions?.[selectedLanguage?.toLowerCase()]
    ) {
      const totalQuestions = examData.section[currentSectionIndex].questions[selectedLanguage?.toLowerCase()]?.length;

      if (clickedQuestionIndex < startingIndex + totalQuestions - 1) {
        // Save current question time before moving to next
        setQuestionTimes(prevTimes => ({
          ...prevTimes,
          [clickedQuestionIndex]: questionTime
        }));
        setClickedQuestionIndex(clickedQuestionIndex + 1);
        setQuestionTime(0);
      } else {
        // If it's the last question, reset to the first question
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
  const questionTimerRef = useState(null)

  // let questionTimerInterval;

  useEffect(() => {
    // setQuestionTime(0);
    setQuestionTimerActive(true);
    // Reset time when switching questions
    if (questionTimerActive && !isPaused) {

      questionTimerRef.current = setInterval(() => {
        setQuestionTime((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(questionTimerRef.current); // Cleanup interval on unmount
  }, [questionTimerActive, isPaused]);

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

  const [examDataSubmission, setExamDataSubmission] = useState(null);  // Define examDataSubmission state

  // useEffect(() => {

  const [selectedOptions, setSelectedOptions] = useState(Array(totalQuestions).fill(null));

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
    console.log('selectedOptions:', selectedOptions); // Log the selectedOptions to verify
  
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
  
      console.log('Saving selected options:', combinedData);
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
    console.log("Handling section submission...");


    const currentSection = examData?.section[currentSectionIndex];
    console.log("Current Section:", currentSection);

    if (!currentSection) {
      console.log("No current section found. Exiting function.");
      return;
    }

    // Get the questions for the current section and selected language
    const questions = currentSection.questions?.[selectedLanguage?.toLowerCase()];
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

    // Store section summary
    setSectionSummaryData((prevData) => {
      const newData = [...prevData, sectionSummary];
      console.log("Updated Section Summary Data:", newData);
      return newData;
    });

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
              acc + section.questions?.[selectedLanguage?.toLowerCase()]?.length,
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



  const submitExam = () => {
    console.log("submitExam called");

    if (!examData || !examData.section || !examData.section[currentSectionIndex]) {
      console.error("Exam data or section not available");
      return;
    }

    const currentSection = examData.section[currentSectionIndex];
    const endTime = new Date();
    const timeTakenInSeconds = Math.floor((endTime - examStartTime) / 1000);
    const formattedTotalTime = formatTime(timeTakenInSeconds);

    setTotalTime(formattedTotalTime);
    if (!currentSection) return;

    const questions = currentSection.questions?.[selectedLanguage?.toLowerCase()];
    if (!questions) return;

    const totalQuestions = questions.length;

    // Calculate answered and unanswered
    const answeredQuestions = selectedOptions
      .slice(startingIndex, startingIndex + totalQuestions)
      .filter(option => option !== null).length;

    const notAnsweredQuestions = totalQuestions - answeredQuestions;

    const visitedQuestionsCount = visitedQuestions.filter(
      index => index >= startingIndex && index < startingIndex + totalQuestions
    );

    const notVisitedQuestions = Array.from({ length: totalQuestions }, (_, index) =>
      !visitedQuestionsCount.includes(index + startingIndex) ? index + startingIndex : null
    ).filter(index => index !== null);

    const sectionSummary = {
      visitedQuestionsCount: visitedQuestionsCount.length > 0 ? visitedQuestionsCount[0] : null,
      notVisitedQuestions: notVisitedQuestions.length > 0 ? notVisitedQuestions[0] : null,
    };

    setSectionSummaryData(prevData => [...prevData, sectionSummary]);

    const reviewedQuestions = markedForReview.filter(
      index => index >= startingIndex && index < startingIndex + totalQuestions
    ).length;

    const answersData = selectedOptions.map((selectedOption, index) => {
      const question = currentSection?.questions?.[selectedLanguage?.toLowerCase()]?.[index];
      const singleQuestionTime = formatTime(questionTimes[index] || 0);

      const optionsData = question?.options?.map((option, optionIndex) => ({
        option: option,
        index: optionIndex,
        isSelected: optionIndex === selectedOption,
        isCorrect: optionIndex === question?.answer,
      }));

      const isVisited = visitedQuestions?.includes(index) ? 1 : 0;
      const notVisited = isVisited === 1 ? 0 : 1;

      console.error("isVisited:", isVisited);  // Nested array: [ [0, 1, 0, 1, 0, 1, 0, 1], [0, 1, 2, 3, 4, 5, 6, 7] ]
      console.error("notVisited:", notVisited);



      const questionScore = selectedOption !== undefined
        ? (selectedOption === question?.answer
          ? question?.plus_mark
          : -question?.minus_mark)
        : 0;

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

    const totalScore = answersData.reduce((total, answerData) => total + answerData.score, 0);

    const formattedSections = examData.section.map((section, sectionIndex) => {
      const sectionQuestions = section.questions?.[selectedLanguage?.toLowerCase()];
      if (!sectionQuestions) return null;

      const sectionStartIndex = examData.section
        .slice(0, sectionIndex)
        .reduce((acc, s) => acc + (s.questions?.[selectedLanguage?.toLowerCase()]?.length || 0), 0);
      const sectionEndIndex = sectionStartIndex + sectionQuestions.length;

      const sectionAnswered = selectedOptions
        .slice(sectionStartIndex, sectionEndIndex)
        .filter(option => option !== undefined && option !== null).length;

      const sectionNotAnswered = sectionQuestions.length - sectionAnswered;

      const sectionVisited = visitedQuestions
        .filter(index => index >= sectionStartIndex && index < sectionEndIndex).length;

      const sectionAnswersData = sectionQuestions.map((question, questionIndex) => {
        const absoluteIndex = sectionStartIndex + questionIndex;
        const selectedOption = selectedOptions[absoluteIndex];
        const isVisited = visitedQuestions.includes(absoluteIndex) ? 1 : 0;
        const notVisited = isVisited ? 0 : 1;
        const questionScore = selectedOption !== undefined
          ? (selectedOption === question.answer ? section.plus_mark : -section.minus_mark)
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
          score: questionScore
        };
      });

      const correctCount = sectionAnswersData.filter(q => q.correct === 1).length;
      const attemptedCount = sectionAnswersData.filter(q => q.selectedOption !== undefined).length;
      const incorrectCount = sectionAnswered - correctCount;
      const sectionScore = (correctCount*1)-(incorrectCount*0.25);
      const secaccuracy = sectionAnswered > 0 ? (correctCount / sectionAnswered) * 100 : 0;
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
        s_blueprint: section.s_blueprint.map(bp => ({
          subject: bp.subject,
          topic: bp.topic,
          tak_time: bp.tak_time
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
            q_on_time: answersData[sectionStartIndex + index]?.q_on_time || "0",
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
            q_on_time: answersData[sectionStartIndex + index]?.q_on_time || "0",
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
            q_on_time: answersData[sectionStartIndex + index]?.q_on_time || "0",
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
        skipped: skippedQuestions
      };
    }).filter(Boolean);

    const totalStats = formattedSections.reduce((acc, section) => ({
      visitedCount: acc.visitedCount + (section.isVisited || 0),
      notVisitedCount: acc.notVisitedCount + (section.NotVisited || 0),
      answeredCount: acc.answeredCount + (section.Attempted || 0),
      notAnsweredCount: acc.notAnsweredCount + (section.Not_Attempted || 0)
    }), {
      visitedCount: 0,
      notVisitedCount: 0,
      answeredCount: 0,
      notAnsweredCount: 0
    });

    setExamDataSubmission({
      formattedSections,
      totalScore: formattedSections.reduce((sum, section) => sum + (section.s_score || 0), 0),
      timeTakenInSeconds,
      totalcheck: {
        visitedQuestionsCount: totalStats.visitedCount,
        notVisitedQuestions: totalStats.notVisitedCount,
        answeredQuestions: totalStats.answeredCount,
        notAnsweredQuestions: totalStats.notAnsweredCount
      },
      endTime
    });
  };






  const [dataid, setDataid] = useState(null); // State to store the data

  useEffect(() => {
    // Fetch the data when the component mounts or when `id` changes
    Api.get(`results/${user?._id}/${id}`)
      .then(response => {
        // Set the fetched data to state
        setDataid(response.data._id);
        console.error("test", response.data._id); // Log the _id from the fetched data
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [id]);

  
 

  useEffect(() => {
    if (!examDataSubmission) return; // Prevent running if there's no new data to submit.

    const { formattedSections, totalScore, formattedTotalTime, timeTakenInSeconds, endTime } = examDataSubmission;

    // API call with the necessary data
    Api.post(`results/${user?._id}/${id}`, {
      ExamId: `${id}`,
      section: formattedSections,
      // Now this will work since formattedSections is part of examDataSubmission
      score: totalScore,           // totalScore is also included
      totalTime: formattedTotalTime,
      timeTakenInSeconds: timeTakenInSeconds,
      takenAt: examStartTime,
      submittedAt: endTime,
      status: isPaused ? "paused" : "completed", 
    })
      .then((res) => {
        console.log("Response Data-sample:", res.data);

      })
      .catch((err) => {
        console.error("Error submitting marks:", err);
      });
  }, [
    examDataSubmission,  // Trigger whenever data to submit changes
    selectedOptions,     // Trigger when selected options change
    id,                  // Trigger when ID changes (if needed)
  ]);


  // Using useEffect to trigger submitExam when needed
  const [timeminus, settimeminus] = useState(0);
  // const [isPaused, setIsPaused] = useState(false);
  const [pauseCount, setPauseCount] = useState(0);


  useEffect(() => {
    const sectionTimeInSeconds = examData?.section[currentSectionIndex]?.t_time * 60; // Convert minutes to seconds
    settimeminus(sectionTimeInSeconds); // Reset time when the section changes
  }, [examData, currentSectionIndex]);






  useEffect(() => {
    if (timeminus > 0 && !isPaused) {
      const timerInterval = setInterval(() => {
        settimeminus((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime === 0) {
            handleSubmitSection()
          }
          return newTime;
        });
      }, 1000); // Update every second
      return () => clearInterval(timerInterval);
    }
  }, [timeminus, isPaused]); // Runs whenever timeminus changes
     const handlePauseResume = () => {
    if (pauseCount < 1) {
      clearInterval(questionTimerRef.current);
      setIsPaused(true);
      setPauseCount(pauseCount + 1);
      const currentState = {
        clickedQuestionIndex,
        selectedOptions,
        visitedQuestions,
        markedForReview,
        currentSectionIndex
      };
      // localStorage.setItem(`examState_${id}`, JSON.stringify(currentState));
  
      Swal.fire({
        title: "Pause Exam",
        text: "Do you want to quit the exam?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, Quit",
        cancelButtonText: "No, Resume",
        position: 'center',
        width: '100vw',
        height: '100vh',
        padding: '100',
        customClass: {
          container: 'swal-full-screen',
          popup: 'swal-popup-full-height',
        },
      }).then(async(result) => {
        if (result.isConfirmed) {
          setIsPaused(true);
           
          await submitExam();
          // Get active packages and find matching package
          Api.get('packages/get/active')
            .then((packagesRes) => {
              const activePackages = packagesRes.data;
              const matchingPackage = activePackages.find(pkg => pkg.exams.includes(id));
              if (matchingPackage) {
                navigate(`/top-trending-exams/${matchingPackage.link_name}`);
              } else {
                navigate('/top-trending-exams');
              }
            })
            .catch(() => {
              navigate('/top-trending-exams');
            });
        } else {
          setIsPaused(false);
          setPauseCount(0);
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
  const handleSectionCompletion = async () => {
    console.log("handleSectionCompletion called");

    if (true) {
      console.log("Section is complete");
      console.log(currentSectionIndex)
      console.log(examData?.section?.length - 1)
      // Move to the next section if there's another one
      if (currentSectionIndex < examData?.section?.length - 1) {
        setShowModal(false)
        console.log(`Current section index: ${currentSectionIndex}`);
        console.log(`Total sections: ${examData?.section?.length}`);
        setCurrentSectionIndex(currentSectionIndex + 1);
        setQuestionTime(0)
        // Calculate the starting index for the new section
        const newStartingIndex = examData?.section
          ?.slice(0, currentSectionIndex + 1)
          .reduce(
            (acc, section) =>
              acc + (section.questions?.[selectedLanguage?.toLowerCase()]?.length || 0),
            0
          );

        // Set clicked question to first question of new section
        setClickedQuestionIndex(newStartingIndex);
        console.log(`Moving to the next section. New index: ${currentSectionIndex + 1}`);
      } else {
        // If last section is complete, navigate to result
        console.log("Last section complete. Navigating to results.");
        toast.success("Test Completed! Moving to result.");
        submitExam();
        navigate(`/result/${id}`);
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
      setIsPaused(true);  // Pause the timer
    } else {
      setIsRunning((prev) => !prev);  // Toggle play/pause
      setIsPaused(false);  // Ensure it's not paused when restarting
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };





  const [isFullscreen, setIsFullscreen] = useState(false);

  // Function to toggle fullscreen mode
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      // If not in fullscreen, enter fullscreen
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) { // Firefox
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
        document.documentElement.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      // If in fullscreen, exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) { // Chrome, Safari
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

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

      examData?.section[currentSectionIndex]?.questions?.[selectedLanguage?.toLowerCase()]?.forEach((_, index) => {
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
  }, [selectedOptions, visitedQuestions, markedForReview, examData, currentSectionIndex, selectedLanguage, startingIndex]);


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



  return (
    <div className="mock-font p-1">
      <div>
        <div className="bg-blue-400 text-white font-bold h-12 w-full flex justify-around items-center">

          <h1 className="h3 font-bold mt-3 text-sm md:text-xl">{show_name}</h1>
          <img src={logo} alt="logo" className="h-10 w-auto bg-white" />
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
                    <h1 className="modal-title fs-5 text-green-500" id="staticBackdropLabel">
                      Section Submit
                    </h1>

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
                        {currentSectionIndex === examData?.section?.length - 1 ? 'Submit' : 'Next Section'}
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



      <div className="d-flex justify-content-start align-items-center m-2 flex-wrap">
      {examData?.section?.map((section, index) => {
    // Calculate the starting index for this section
    const startingIndex = examData.section
      .slice(0, index)
      .reduce((acc, sec) => acc + (sec?.questions?.[selectedLanguage?.toLowerCase()]?.length || 0), 0);

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
      <div key={index} className="m-1">
        <h1
          className={`h6 p-1 text-white border d-inline-flex align-items-center 
            ${currentSectionIndex === index
              ? 'bg-blue-400 border-3 border-blue-500 fw-bold'
              : 'bg-gray-400'}`}
        >
          ✔ {section.name}
          <div className="relative group ml-2 d-inline-block">
            <FaInfoCircle className="cursor-pointer text-white" />
            <div className="absolute z-50 hidden group-hover:block bg-white text-dark border rounded p-2 shadow-md mt-1 
  min-w-[220px]     w-fit md:max-w-xs md:w-max
  left-1/2 -translate-x-1/2
  ">
              <div className="mt-2 flex align-items-center">
                <div className="smanswerImg text-white fw-bold flex align-items-center justify-content-center">{sectionCounts.answered}</div>
                <p className="ml-2 text-start text-lg-center mb-0">Answered</p>
              </div>
              <div className="mt-2 flex align-items-center">
                <div className="smnotansImg text-white fw-bold flex align-items-center justify-content-center">{sectionCounts.notAnswered}</div>
                <p className="ml-2 text-start text-lg-center mb-0">Not Answered</p>
              </div>
              <div className="mt-2 flex align-items-center">
                <div className="smnotVisitImg fw-bold flex align-items-center justify-content-center">{sectionCounts.notVisited}</div>
                <p className="ml-2 text-start text-lg-center mb-0">Not Visited</p>
              </div>
              <div className="mt-2 flex align-items-center">
                <div className="smmarkedImg text-white fw-bold flex align-items-center justify-content-center">{sectionCounts.markedForReviewCount}</div>
                <p className="ml-2 text-start text-lg-center">Marked for Review</p>
              </div>
              <div className="mt-2 flex align-items-center">
                <div className="smansmarkedImg text-white fw-bold flex align-items-center justify-content-center">{sectionCounts.answeredAndMarked}</div>
                <p className="ml-3 text-start text-lg-center mb-0">Answered & Marked for Review</p>
              </div>
            </div>
          </div>
        </h1>
      </div>
    );
  })}
    </div>

 
      {/* Mobile Hamburger Menu */ }
      < button
        onClick={toggleMenu}
        className="md:hidden text-black p-2"
      >
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

      <div className="row mb-24">
        {/* Question Panel */}
        <div className={`p-4 ${closeSideBar ? 'col-lg-12 col-md-12' : 'col-lg-9 col-md-8 '}`}>

          {!isSubmitted ? (
            <>
              <div className="d-flex  justify-between">
                <h3>
                  Question No: {clickedQuestionIndex + 1}/
                  {t_questions}
                </h3>

                <h1>
                  {" "}
                  <span className="border px-2 p-1">
                    Qn Time:{formatTime(questionTime)}
                  </span>
                  &nbsp;Marks&nbsp;
                  <span className="text-success">
                    +
                    {examData?.section && examData.section[currentSectionIndex]
                      ? examData.section[currentSectionIndex].plus_mark
                      : "No plus marks"}
                  </span>
                  &nbsp;
                  <span className="text-danger">
                    -
                    {examData?.section && examData.section[currentSectionIndex]
                      ? examData.section[currentSectionIndex].minus_mark
                      : "No minus marks"}
                  </span>
                </h1>
              </div>
              {examData?.section[currentSectionIndex] ? (
                <div className="row" >
                  <div className="row">
                    {/* Left side for Common Data */}
                    {examData.section[currentSectionIndex]?.questions?.[
                      selectedLanguage?.toLowerCase()
                    ]?.[clickedQuestionIndex - startingIndex]?.common_data && (
                        <div
                          ref={commonDataRef}
                          className="col-lg-6 col-md-6"
                          style={{ maxHeight: "380px", overflowY: "auto" }}
                        >

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
                      ref={questionRef}
                      className="col-lg-6 col-md-6"
                      style={{ maxHeight: "420px", overflowY: "auto" }}
                    >
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
                            ]?.[clickedQuestionIndex - startingIndex]
                              ?.question || "No question available",
                        }}
                      />


                      {examData.section[currentSectionIndex]?.questions?.[
                        selectedLanguage?.toLowerCase()
                      ]?.[clickedQuestionIndex - startingIndex]?.options ? (
                        <div>
                          {examData.section[currentSectionIndex]?.questions?.[
                            selectedLanguage?.toLowerCase()
                          ]?.[
                            clickedQuestionIndex - startingIndex
                          ]?.options.map((option, index) => (
                            <div key={index}>
                              <input
                                type="radio"
                                id={`option-${index}`}
                                name="exam-option"
                                value={index}
                                checked={
                                  selectedOptions[clickedQuestionIndex] ===
                                  index
                                }
                                onChange={() => {
                                  console.log("Selected Option Index:", index);
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
        <div className="col-9 col-md-4 col-lg-3 md:flex"  >
          <div className="md:flex hidden items-center">
            <div className={` fixed top-1/2 ${closeSideBar ? 'right-0' : ''} bg-gray-600 h-14 w-5 rounded-s-md flex justify-center items-center cursor-pointer`} onClick={toggleMenu2}>
              <FaChevronRight className={`w-2 h-5 text-white transition-transform duration-300 ${closeSideBar ? 'absalute left-0 rotate-180' : ''}`} />
            </div>
          </div>


          <div
            ref={sidebarRef}
            className={`ml-5 mb-14 pb-14 bg-light transform transition-transform duration-300
    ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
    ${closeSideBar ? 'md:translate-x-full md:w-0' : 'md:translate-x-0'}
    fixed top-14 right-0 z-40 md:static shadow-sm md:block`}
            style={{
              maxHeight: '450px',
              overflowY: 'auto',
            }}
          >

            {isMobileMenuOpen &&
              <button
                onClick={toggleMenu}
                className="md:hidden text-black p-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  {/* // Close icon (X) when the menu is open */}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />

                </svg>
              </button>
            }
            <div className="container mt-3">
              <h1 className=" bg-blue-400 text-center text-white p-2 ">
                Time Left:{formatTime(timeminus)}
              </h1>
              <center>
                <button
                  onClick={handlePauseResume}
                  className={`px-4 py-2 rounded-lg font-semibold transition duration-300 mt-2 ${isPaused ? "bg-green-500 hover:bg-green-600 text-white" : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                >Pause
                  {isPaused}
                </button>
              </center>

              <div className="container mt-3">
                <div className="row align-items-center">
                  <div className="mt-2 col-12 col-lg-6 d-flex flex-lg-column flex-row align-items-center">
                    <div className="smanswerImg text-white fw-bold flex align-items-center justify-content-center">{answeredCount}</div>
                    <p className="ml-2 text-start text-lg-center mb-0">Answered</p>
                  </div>
                  <div className="mt-2 col-12 col-lg-6 d-flex flex-lg-column flex-row align-items-center">
                    <div className="smnotansImg text-white fw-bold flex align-items-center justify-content-center">{notAnsweredCount}</div>
                    <p className="ml-2 text-start text-lg-center mb-0">Not Answered </p>
                  </div>
                </div>
              </div>
              <div className="container mb-3">
                <div className="row">
                  <div className=" mt-2 col-12 col-lg-6 d-flex flex-lg-column flex-row align-items-center">
                    <div className="smnotVisitImg fw-bold flex align-items-center justify-content-center">{notVisitedCount}</div>
                    <p className="ml-2 text-start text-lg-center mb-0">Not Visited </p>
                  </div>
                  <div className="mt-2 col-12 col-lg-6 d-flex flex-lg-column flex-row align-items-center">
                    <div className="smmarkedImg text-white fw-bold flex align-items-center justify-content-center">{markedForReviewCount}</div>
                    <p className="ml-2 text-start text-lg-center">Marked for Review</p>
                  </div>
                </div>
                <div className="col-12 col-lg-6 d-flex flex-lg-column flex-row align-items-center">
                  <div className="smansmarkedImg text-white fw-bold flex align-items-center justify-content-center">{answeredAndMarkedCount}</div>
                  <p className="ml-3 text-start text-lg-center mb-0">Answered & Marked for Review</p>
                </div>
                {/* <div className="col-12 flex text-center mt-1">
                <div className="smansmarkedImg"></div>
                <p className="ml-2 mb-0">Answered & Marked for Review</p>
              </div> */}
              </div>
              <div className="d-flex flex-wrap gap-2 px-3 py-2 text-center">
                {examData?.section[currentSectionIndex]?.questions?.[
                  selectedLanguage?.toLowerCase()
                ]?.map((_, index) => {
                  const fullIndex = startingIndex + index; // Correct question index

                  // Access the current section from the examData
                  const currentSection = examData.section[currentSectionIndex];
                  const timeFormatted = formatTime(timeLeft); // Format the remaining time for the current section

                  // Set className based on question status
                  let className = "";
                  if (selectedOptions[fullIndex] !== null) {
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
      </div>


  {/* Footer Buttons */ }
  <div className="fixed-bottom bg-white p-3">
    <div className="d-flex justify-content-between border-8">
      {/* Left side - Mark for Review and Clear Response */}
      <div className="d-flex">
        <button
          onClick={handleMarkForReview}
          className="btn bg-blue-300 fw-bold hover:bg-blue-200 text-sm md:text-lg"
        >
          Mark for Review
        </button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <button
          onClick={handleClearResponse}
          className="btn bg-blue-300 fw-bold hover:bg-blue-200 text-sm md:text-lg"
        >
          Clear Response
        </button>
      </div>

      {/* Right side - Save & Next and Submit Section */}
      <div className="d-flex justify-content-end">
        {examData?.section?.[currentSectionIndex]?.questions?.[selectedLanguage?.toLowerCase()]?.length > 0 && (
          <button
            onClick={handleNextClick}
            className="btn bg-blue-500 text-white fw-bold hover:bg-blue-700"
          >
            Save & Next
          </button>
        )}
        &nbsp;&nbsp;&nbsp;&nbsp;
        <button
          className="btn bg-blue-500 text-white fw-bold hover:bg-blue-700"
          onClick={handleSubmitSection}
          data-bs-toggle="modal"
          data-bs-target="#staticBackdrop"
        >
          {currentSectionIndex === examData?.section?.length - 1
            ? "Submit Test"
            : "Submit Section"}
        </button>
      </div>

    </div>
  </div>
    </div >
  );
};

export default Test;

