import { useEffect, useState } from "react";
import Api from "../service/Api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import logo from '../assets/logo/sample-logo.png';
import Swal from 'sweetalert2'
const Test = () => {
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

  const { id } = useParams();
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


const [isDataFetched, setIsDataFetched] = useState(false);
const [show_name,setShow_name] = useState("")
const [t_questions,sett_questions]=useState("")
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
          console.log("kl",res.data.show_name);
        }
      })
      .catch((err) => console.error("Error fetching data:", err));
  }
}, [id]);  // Only trigger when `id` changes


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

  const handleOptionChange = (index) => {
    setSelectedOptions((prev) => {
      const updatedOptions = [...prev];
      updatedOptions[clickedQuestionIndex] = index; // Store the selected option for the clicked question
      return updatedOptions;
    });

    // Get the correct answer for the clicked question
    const currentQuestion =
      examData?.section[currentSectionIndex]?.questions[
        clickedQuestionIndex - startingIndex
      ];
    const correctAnswerIndex = currentQuestion?.answer;

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
    Api.get(`exams/getExam/${id}`) // Fetch the exam data from your API
      .then((res) => {
         console.log(res)
        const transformedData = {
     // Example ExamId, set accordingly
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
                Incorrect:0,
                answer: question.answer,
                common_data:question.common_data,
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
                Incorrect:0,
                answer: question.answer,
                common_data:question.common_data,
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
                Incorrect:0,
                answer: question.answer,
                common_data:question.common_data,
                explanation: question.explanation,
                selectedOption: question.selectedOption,
                isVisited:0,
                NotVisited:0,
                q_on_time:0,
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
        console.log(transformedData)

        // Now post the transformed data to your '/results' endpoint
        Api.post(`/results/65a12345b6c78d901e23f456/${id}`, transformedData)
          .then((response) => {
            console.log("Data posted successfully:", response);

          })
          .catch((error) => {
            console.error("Error posting data:", error.message);
            // Handle error (show error message, etc.)
          });
      })
      .catch((err) => {
        console.error("Error fetching exam data:", err);
        // Handle the fetch error (e.g., show error message)
      });
  }, []);

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

  // const handleSubmitSection = () => {
  //   const currentSection = examData?.section[currentSectionIndex];
  //   if (!currentSection) return;

  //   // Get the questions for the current section and selected language
  //   const questions =
  //     currentSection.questions?.[selectedLanguage?.toLowerCase()];
  //   if (!questions) return; // If no questions for the selected language, return early.

  //   // Total questions in the current section
  //   const totalQuestions = questions.length;

  //   // Calculate answered and unanswered questions
  //   const answeredQuestions = selectedOptions
  //     .slice(startingIndex, startingIndex + totalQuestions)
  //     .filter((option) => option !== undefined).length;

  //   const notAnsweredQuestions = totalQuestions - answeredQuestions;

  //   // Calculate visited and not visited questions
  //   const visitedQuestionsCount = visitedQuestions.filter(
  //     (index) =>
  //       index >= startingIndex && index < startingIndex + totalQuestions
  //   ).length;

  //   const notVisitedQuestions = totalQuestions - visitedQuestionsCount;

  //   // Calculate marked for review questions
  //   const reviewedQuestions = markedForReview.filter(
  //     (index) =>
  //       index >= startingIndex && index < startingIndex + totalQuestions
  //   ).length;

  //   // Set the section summary
  //   const sectionSummary = {
  //     sectionName: currentSection.name, // Add the section name
  //     answeredQuestions,
  //     notAnsweredQuestions,
  //     visitedQuestionsCount,
  //     notVisitedQuestions,
  //     reviewedQuestions,
  //     totalQuestions,
  //   };

  //   // Store section summary
  //   setSectionSummaryData((prevData) => [...prevData, sectionSummary]);

  //   // Display modal
  //   setShowModal(true);

  //   if (currentSectionIndex < examData.section.length - 1) {
  //     setCurrentSectionIndex((prev) => prev + 1);

  //     // Move to the first question of the next section
  //     const newStartingIndex = examData?.section
  //       ?.slice(0, currentSectionIndex + 1)
  //       .reduce(
  //         (acc, section) =>
  //           acc + section.questions?.[selectedLanguage?.toLowerCase()]?.length,
  //         0
  //       );

  //     setClickedQuestionIndex(newStartingIndex);
  //   } else {
  //   console.log("submitting exam else condition");

  //     submitExam();


  //   }
  // };

  const handleNextClick = () => {
    if (
      examData &&
      examData.section[currentSectionIndex] &&
      clickedQuestionIndex <
        startingIndex +
          examData.section[currentSectionIndex].questions?.[
            selectedLanguage?.toLowerCase()
          ]?.length -
          1
    ) {
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

  useEffect(() => {
    if (timeLeft <= 0) {
      // Automatically submit the exam when time is up
      // console.log('time left')
      // submitExam();
      return; // Stop further actions if time is up
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => Math.max(prevTime - 1, 0));
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, [timeLeft]);
  const [examDataSubmission, setExamDataSubmission] = useState(null);  // Define examDataSubmission state

  useEffect(() => {
    if (!id) return; // Ensure id is available before proceeding

    const storedSelectedOptions = localStorage.getItem(`selectedOptions_${id}`);
    if (storedSelectedOptions) {
      const parsedOptions = JSON.parse(storedSelectedOptions);
      setSelectedOptions(parsedOptions.filter(option => option !== null && option !== ""));
    }
  }, [id]); // Runs when `id` changes

  // Save selected options to localStorage whenever they are updated
  useEffect(() => {
    if (!id) return; // Ensure id is available before proceeding

    if (selectedOptions.length > 0) {
      const validOptions = selectedOptions.filter(option => option !== null && option !== "");
      localStorage.setItem(`selectedOptions_${id}`, JSON.stringify(validOptions));
    } else {
      localStorage.removeItem(`selectedOptions_${id}`);
    }
  }, [selectedOptions, id]); // Runs when `selectedOptions` or `id` changes

  // Function to update selected options
  const updateSelectedOption = (newSelectedOption, index) => {
    const updatedSelectedOptions = [...selectedOptions];

    if (newSelectedOption !== null && newSelectedOption !== "") {
      updatedSelectedOptions[index] = newSelectedOption;
    } else {
      updatedSelectedOptions[index] = null;
    }

    setSelectedOptions(updatedSelectedOptions);
  };

  // Your submitExam function with the necessary modifications
  const handleSubmitSection = () => {
    const currentSection = examData?.section[currentSectionIndex];
    if (!currentSection) return;
  
    // Get the questions for the current section and selected language
    const questions =
      currentSection.questions?.[selectedLanguage?.toLowerCase()];
    if (!questions) return; // If no questions for the selected language, return early.
  
    // Total questions in the current section
    const totalQuestions = questions.length;
  
    // Calculate answered and unanswered questions
    const answeredQuestions = selectedOptions
      .slice(startingIndex, startingIndex + totalQuestions)
      .filter((option) => option !== undefined).length;
  
    const notAnsweredQuestions = totalQuestions - answeredQuestions;
  
    // Calculate visited and not visited questions
    const visitedQuestionsCount = visitedQuestions.filter(
      (index) =>
        index >= startingIndex && index < startingIndex + totalQuestions
    ).length;
  
    const notVisitedQuestions = totalQuestions - visitedQuestionsCount;
  
    // Calculate marked for review questions
    const reviewedQuestions = markedForReview.filter(
      (index) =>
        index >= startingIndex && index < startingIndex + totalQuestions
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
  
    // If modal is shown, and you're ready to go to the next section or submit the exam
    if (showModal) { // You can check if the modal is shown
      if (currentSectionIndex < examData.section.length - 1) {
        setCurrentSectionIndex((prev) => prev + 1);
  
        // Move to the first question of the next section
        const newStartingIndex = examData?.section
          ?.slice(0, currentSectionIndex + 1)
          .reduce(
            (acc, section) =>
              acc + section.questions?.[selectedLanguage?.toLowerCase()]?.length,
            0
          );
  
        setClickedQuestionIndex(newStartingIndex);
      } else {
        console.log("submitting exam else condition");
  
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
  
    // Get the questions for the current section and selected language
    const questions =
      currentSection.questions?.[selectedLanguage?.toLowerCase()];
    if (!questions) return; // If no questions for the selected language, return early.
  
    // Total questions in the current section
    const totalQuestions = questions.length;
  
    // Calculate answered and unanswered questions
    const answeredQuestions = selectedOptions
      .slice(startingIndex, startingIndex + totalQuestions)
      .filter((option) => option !== undefined).length;
  
    const notAnsweredQuestions = totalQuestions - answeredQuestions;
  
    // Calculate visited and not visited questions for the current section
    const visitedQuestionsCount = visitedQuestions.filter(
      (index) =>
        index >= startingIndex && index < startingIndex + totalQuestions
    ).length;
  
    console.log("visit", visitedQuestionsCount);
  
    const notVisitedQuestions = totalQuestions - visitedQuestionsCount;
    console.log("notvisit", notVisitedQuestions);
  
    // Calculate marked for review questions
    const reviewedQuestions = markedForReview.filter(
      (index) =>
        index >= startingIndex && index < startingIndex + totalQuestions
    ).length;
  
    // Processing selected answers
    const answersData = selectedOptions.map((selectedOption, index) => {
      const question = currentSection?.questions?.[selectedLanguage?.toLowerCase()]?.[index];
      const singleQuestionTime = formatTime(questionTimes[index] || 0);
  
      const optionsData = question?.options?.map((option, optionIndex) => ({
        option: option,
        index: optionIndex,
        isSelected: optionIndex === selectedOption,
        isCorrect: optionIndex === question?.answer,
      }));
  
      // Fixing the visited and not visited logic
      const isVisited = visitedQuestions?.includes(index) ? 1 : 0;
      const notVisited = isVisited === 1 ? 0 : 1; // 'notVisited' is the inverse of 'isVisited'
  
      return {
        question: question?.question,
        options: optionsData,
        correct: question?.answer === selectedOption ? 1 : 0,
        explanation: question?.explanation,
        answer: question?.answer,
        common_data:question?.common_data,
        selectedOption: question?.selectedOption || selectedOption,
        isVisited: isVisited,
        NotVisited: notVisited,
        q_on_time: singleQuestionTime,
      };
    });
  
    // Calculating total score
    const totalScore = selectedOptions.reduce((total, option, index) => {
      const currentQuestion = currentSection?.questions?.[selectedLanguage?.toLowerCase()]?.[index];
      const plusmark = currentQuestion?.plus_mark || 1;
      const minusmark = currentQuestion?.minus_mark || 0.25;
      const scoreForThisQuestion = currentQuestion?.answer === option ? plusmark : -minusmark;
      return total + scoreForThisQuestion;
    }, 0);
  
    // Formatting sections data for API submission
    const formattedSections = examData.section.map((section) => ({
      name: section.name,
      t_question: section.t_question,
      t_time: section.t_time,
      t_mark: section.t_mark,
      plus_mark: section.plus_mark,
      minus_mark: section.minus_mark,
      cutoff_mark: section.cutoff_mark,
      isVisited: visitedQuestionsCount,
      NotVisited: notVisitedQuestions,
      Answer:answeredQuestions,
      NotAnswer:notAnsweredQuestions,
      s_blueprint: section.s_blueprint.map((blueprint) => ({
        subject: blueprint.subject,
        topic: blueprint.topic,
        tak_time: blueprint.tak_time,
      })),
      questions: {
        english: section.questions.english.map((question, index) => ({
          question: question?.question,
          options: question.options || [],
          answer:question?.answer,
          common_data:question?.common_data,
          correct: answersData[index]?.correct || 0,
          explanation: question?.explanation || "",
          selectedOption: answersData[index]?.selectedOption,
          q_on_time: answersData[index]?.q_on_time || "0",
          isVisited: answersData[index]?.isVisited,
          NotVisited: answersData[index]?.NotVisited,
        })),
        hindi: section.questions.hindi.map((question, index) => ({
          question: question?.question,
          options: question.options || [],
          answer:question?.answer,
          common_data:question?.common_data,
          correct: answersData[index]?.correct || 0,
          explanation: question?.explanation || "",
          selectedOption: answersData[index]?.selectedOption,
          q_on_time: answersData[index]?.q_on_time || "0",
          isVisited: answersData[index]?.isVisited,
          NotVisited: answersData[index]?.NotVisited,
        })),
        tamil: section.questions.tamil.map((question, index) => ({
          question: question?.question,
          options: question.options || [],
          answer:question?.answer,
          common_data:question?.common_data,
          correct: answersData[index]?.correct || 0,
          explanation: question?.explanation || "",
          selectedOption: answersData[index]?.selectedOption,
          q_on_time: answersData[index]?.q_on_time || "0",
          isVisited: answersData[index]?.isVisited,
          NotVisited: answersData[index]?.NotVisited,
        })),
      },
      s_order: section.s_order || 0,
    }));
  
    // Include visited and not visited totals in totalcheck
    const totalcheck = {
      visitedQuestionsCount,
      notVisitedQuestions,
    };
  
    // Update the state that triggers the API call
    setExamDataSubmission({
      formattedSections, // Ensure formattedSections is part of examDataSubmission
      totalScore, // Ensure totalScore is part of examDataSubmission
      timeTakenInSeconds,
      totalcheck, // Include visited and not visited totals
      endTime,
    });
  };
  
  
  const [dataid, setDataid] = useState(null); // State to store the data

  useEffect(() => {
    // Fetch the data when the component mounts or when `id` changes
    Api.get(`results/65a12345b6c78d901e23f456/${id}`)
      .then(response => {
        // Set the fetched data to state
        setDataid(response.data._id);
        console.error("test",response.data._id); // Log the _id from the fetched data
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [id]);

  useEffect(() => {
    if (!examDataSubmission) return; // Prevent running if there's no new data to submit.
  
    const { formattedSections, totalScore, formattedTotalTime, timeTakenInSeconds, endTime } = examDataSubmission;
  
    // API call with the necessary data
    Api.post(`results/65a12345b6c78d901e23f456/${id}`, {
      ExamId: `${id}`,
      section: formattedSections, 
       // Now this will work since formattedSections is part of examDataSubmission
      score: totalScore,           // totalScore is also included
      totalTime: formattedTotalTime,
      timeTakenInSeconds: timeTakenInSeconds,
      takenAt: examStartTime,
      submittedAt: endTime,
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
    if (timeminus > 0  && !isPaused) {
      const timerInterval = setInterval(() => {
        settimeminus((prevTime) => {
          const newTime = prevTime - 1;
          return newTime;
        });
      }, 1000); // Update every second
      return () => clearInterval(timerInterval);
    } 
  }, [timeminus, isPaused]); // Runs whenever timeminus changes
  const handlePauseResume = () => {
    if (pauseCount < 1) {
      clearInterval(questionTimerRef.current);
      setIsPaused(true); // Pause the timer
      setPauseCount(pauseCount + 1);
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
        height: '100vh', // Direct height setting - important
        padding: '100',
        customClass: {
          container: 'swal-full-screen',
          popup: 'swal-popup-full-height', // Target the popup
        },
        //  Remove didOpen -  setting height directly
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/top-trending-exams/rrb-po";
        } else {
          setIsPaused(false);
          setPauseCount(0);
        }
      });
  };}
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



  const navigate = useNavigate();
  // Function to show the toast and move to the next section (or result if last section)
  const handleSectionCompletion = async () => {
    console.log("handleSectionCompletion called");
  
    if (true) {
      console.log("Section is complete");
  console.log(currentSectionIndex)
  console.log(examData?.section?.length-1)
      // Move to the next section if there's another one
      if (currentSectionIndex < examData?.section?.length - 1) {
        setShowModal(false)
        console.log(`Current section index: ${currentSectionIndex}`);
        console.log(`Total sections: ${examData?.section?.length}`);
        setCurrentSectionIndex(currentSectionIndex + 1);
        console.log(`Moving to the next section. New index: ${currentSectionIndex + 1}`);
      } else {
        // If last section is complete, navigate to result
        console.log("Last section complete. Navigating to results.");
        toast.success("Test Completed! Moving to result.");
       await submitExam();
        navigate(`/result`);
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
  
  return (
    <div className="mock-font p-1">
      <div>
      <div className="bg-blue-400 text-white font-bold h-12 w-full flex justify-evenly items-center">
  <h1 className="h3 font-bold mt-3">{show_name}</h1>
  <img src={logo} alt="logo" className="h-10 w-auto" />
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
     


      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="h4">Reading Ability! English Language!!</span>
        <div className="badge bg-warning fs-6 p-2">
        
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
                      className="col-lg-6 col-md-6"
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
                            ]?.[clickedQuestionIndex - startingIndex]
                              ?.question || "No question available",
                        }}
                      />

                      <h5>Options:</h5>

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
        <div
          className="bg-light  shadow-sm col-lg-3"
          style={{ maxHeight: "450px", overflowY: "auto" }}
        >
          <div className="container mt-3">
            <h1 className=" bg-blue-400 text-center text-white p-2 ">
              Time Left:{formatTime(timeminus)}
            </h1>
            <button
  onClick={handlePauseResume}
  className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ml-24 mt-2 ${
    isPaused ? "bg-green-500 hover:bg-green-600 text-white" : "bg-red-500 hover:bg-red-600 text-white"
  }`}
>Pause
  {isPaused}
</button>

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
      <div className="d-flex justify-content-between border border-8">
  {/* Left side - Mark for Review and Clear Response */}
  <div className="d-flex">
    <button
      onClick={handleMarkForReview}
      className="btn bg-blue-300 fw-bold hover:bg-blue-200"
    >
      Mark for Review
    </button>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <button
      onClick={handleClearResponse}
      className="btn bg-blue-300 fw-bold hover:bg-blue-200"
    >
      Clear Response
    </button>
  </div>

  {/* Right side - Save & Next and Submit Section */}
  <div className="d-flex justify-content-end">
    {examData?.section?.[currentSectionIndex]?.questions?.[selectedLanguage?.toLowerCase()]?.length > 0 &&
      clickedQuestionIndex !==
        startingIndex +
          (examData?.section?.[currentSectionIndex]?.questions?.[selectedLanguage?.toLowerCase()]?.length || 0) - 1 && (
        <button
          onClick={handleNextClick}
          className="btn bg-blue-500 text-white fw-bold hover:bg-blue-700"
        >
          Save & Next
        </button>
      )}
    &nbsp;&nbsp;&nbsp;&nbsp;
    &nbsp;&nbsp;&nbsp;&nbsp;
    &nbsp;&nbsp;&nbsp;&nbsp;
    &nbsp;&nbsp;&nbsp;&nbsp;
    &nbsp;&nbsp;&nbsp;&nbsp;
    &nbsp;&nbsp;&nbsp;&nbsp;
    &nbsp;&nbsp;&nbsp;&nbsp;
    &nbsp;&nbsp;&nbsp;&nbsp;
    &nbsp;&nbsp;&nbsp;&nbsp;
    &nbsp;&nbsp;&nbsp;&nbsp;
    <button
      className="btn bg-blue-500 text-white fw-bold hover:bg-blue-700"
      onClick={handleSubmitSection}
      data-bs-toggle="modal"
      data-bs-target="#staticBackdrop"
    >
      {currentSectionIndex === examData?.section?.length - 1
        ? "Submit Test"
        : "Submit Sections"}
    </button>
  </div>
</div>
</div>
    </div>
  );
};

export default Test;

