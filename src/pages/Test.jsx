import { useContext, useEffect, useRef, useState, useMemo ,useCallback} from "react";
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
import { useSelector, useDispatch } from "react-redux";
import {
  setExamData,
  setLoading,
  setError,
  updateNavigation,
  setSelectedOption,
  setAllSelectedOptions,
  markVisited,
  toggleMarkForReview,
  setTimeminus,
  tickTimeminus,
  updateQuestionTime,
  setAllQuestionTimes,
  updateSectionTime as updateSectionTimeAction,
  markSectionSubmitted,
  setSectionSummaryData,
  setSubmitted,
  setIsPaused,
  setExamStartTime as setExamStartTimeAction,
  tickQuestionTime,
  resetTestState
} from "../slice/testSlice";
import { setResults } from "../slice/userSlice";

const Test = () => {
  // Helper to handle both "MM:SS", strings, and raw numbers gracefully
  const parseQuestionTime = (val) => {
    if (val == null || val === "0" || val === 0) return 0;
    if (typeof val === "number") return val;
    if (typeof val === "string" && val.includes(":")) {
      const parts = val.split(":");
      if (parts.length === 2) {
        return (
          (parseInt(parts[0], 10) || 0) * 60 + (parseInt(parts[1], 10) || 0)
        );
      }
    }
    // Fallback for string numbers
    return parseInt(val, 10) || 0;
  };

  const dispatch = useDispatch();
  const testState = useSelector((state) => state.test);
  const isSavingRef = useRef(false);

  const {
    examData,
    currentSectionIndex,
    clickedQuestionIndex,
    visitedQuestions,
    markedForReview,
    ansmarkforrev,
    selectedOptions: reduxSelectedOptions,
    timeminus,
    questionTimes,
    sectionTimes,
    submittedSections: reduxSubmittedSections,
    sectionSummaryData,
    isSubmitted,
    isPaused,
    examStartTime,
    status: examStatus,
  } = testState;

  // Redux-aware Proxy Functions to replace old local state setters
  const setCurrentSectionIndex = (index) => {
    dispatch(updateNavigation({ sectionIndex: index }));
  };

  const setClickedQuestionIndex = (index) => {
    dispatch(updateNavigation({ questionIndex: index }));
  };

  const setExamStartTime = (time) => {
    dispatch(setExamStartTimeAction(time));
  };

  const setSelectedOptions = (update) => {
    if (typeof update === "function") {
      dispatch(setAllSelectedOptions(update(reduxSelectedOptions)));
    } else {
      dispatch(setAllSelectedOptions(update));
    }
  };

  const setVisitedQuestions = (update) => {
    if (typeof update === "function") {
      const next = update(visitedQuestions);
      if (next.length > visitedQuestions.length) {
        dispatch(markVisited(next[next.length - 1]));
      }
    } else {
      // Direct set not common, but can be added if needed
    }
  };

  const setMarkedForReview = (update) => {
    if (typeof update === "function") {
      // Toggle logic usually used for mark for review
      dispatch(toggleMarkForReview(clickedQuestionIndex));
    }
  };

  // Adapt Redux state (Arrays) to local needs (Sets/etc if necessary)
  const submittedSections = useMemo(() => new Set(reduxSubmittedSections), [reduxSubmittedSections]);
  const selectedOptions = reduxSelectedOptions;

  const [totalQuestions, setTotalQuestions] = useState(0);
  const questionTime = questionTimes[clickedQuestionIndex] || 0;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentSectionStartTimeRef = useRef(new Date());

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
      setDisplayLanguage(selectedLanguage);
    }
  }, [currentSectionIndex, examData, selectedLanguage]);

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
          acc + (section.questions?.[selectedLanguage?.toLowerCase()]?.length || 0),
        0
      ) || 0;

  // Mark a question as visited when clicked
  useEffect(() => {
    if (!visitedQuestions.includes(clickedQuestionIndex)) {
      setVisitedQuestions((prev) => [...prev, clickedQuestionIndex]);
    }
  }, [clickedQuestionIndex]);

  const handleQuestionClick = (index) => {
    dispatch(updateNavigation({ questionIndex: index }));
  };

  const handleOptionChange = (index) => {
    setSelectedOptions((prev) => {
      const updatedOptions = [...prev];
      updatedOptions[clickedQuestionIndex] = index;
      dispatch(setSelectedOption({ index: clickedQuestionIndex, option: index }));
      return updatedOptions;
    });
  };

  const handleClearResponse = () => {
    setSelectedOptions((prev) => {
      const updatedOptions = [...prev];
      updatedOptions[clickedQuestionIndex] = null;
      dispatch(setSelectedOption({ index: clickedQuestionIndex, option: null }));
      return updatedOptions;
    });
  };

  const [questionStartTime, setQuestionStartTime] = useState(new Date());

  useEffect(() => {
    if (!examStartTime) {
      dispatch(setExamStartTimeAction(new Date().toISOString()));
    }
  }, [examStartTime, dispatch]);

  useEffect(() => {
    if (questionStartTime && !isPaused) {
      const now = new Date();
      const timeSpent = Math.floor((now - questionStartTime) / 1000);
      if (timeSpent > 0) {
        dispatch(updateQuestionTime({
          index: clickedQuestionIndex,
          time: timeSpent
        }));
      }
      setQuestionStartTime(new Date());
    }
  }, [clickedQuestionIndex, isPaused]);

  useEffect(() => {
    const fetchData = async () => {
      if (user?._id && id) {
        let transformedSections = [];
        try {
          const res = await Api.get(`exams/getExam/${id}`);
          if (!res.data) {
            console.error("❌ No exam data returned");
            setIsDataFetched(true);
            return;
          }

          // RESET state if it's a DIFFERENT exam than the one in Redux
          const reduxExamId = String(examData?._id || "");
          if (reduxExamId && reduxExamId !== String(id)) {
            console.log("🔄 Switching exam, resetting Redux state...");
            dispatch(resetTestState());
          }

          transformedSections = (res.data.section || []).map((section) => ({
            ...section,
            questions: {
              english: (section.questions?.english || []).map(q => ({ ...q, q_on_time: String(q.q_on_time || "00:00") })),
              hindi: (section.questions?.hindi || []).map(q => ({ ...q, q_on_time: String(q.q_on_time || "00:00") })),
              tamil: (section.questions?.tamil || []).map(q => ({ ...q, q_on_time: String(q.q_on_time || "00:00") })),
            }
          }));

          dispatch(setExamData({ ...res.data, section: transformedSections }));
          setTotalQuestions(res.data.t_questions || 0);
          setShow_name(res.data.show_name);
          sett_questions(res.data.t_questions);

          try {
            const existingResult = await Api.get(`results/${user._id}/${id}`);
            if (existingResult.data) {
              const state = existingResult.data;
              const questionTimesFromDB = {};
              let absoluteIndex = 0;
              if (state.selectedOptions && state.selectedOptions.length > 0) {
                const flatOptions = state.selectedOptions;
                dispatch(setAllSelectedOptions(flatOptions));
                
                // Still need a lightweight loop if we need to track questionTimes, visited, markforreview
                state.section.forEach((section) => {
                  const qs = section.questions?.[selectedLanguage?.toLowerCase()] || [];
                  qs.forEach((q) => {
                    questionTimesFromDB[absoluteIndex] = parseQuestionTime(q.q_on_time);
                    if (q.isVisited === 1) dispatch(markVisited(absoluteIndex));
                    if (q.markforreview === 1) dispatch(toggleMarkForReview(absoluteIndex));
                    absoluteIndex++;
                  });
                });
              } else {
                state.section.forEach((section) => {
                  const qs = section.questions?.[selectedLanguage?.toLowerCase()] || [];
                  qs.forEach((q) => {
                    questionTimesFromDB[absoluteIndex] = parseQuestionTime(q.q_on_time);
                    if (q.selectedOption !== null && q.selectedOption !== undefined && q.selectedOption !== "") {
                      dispatch(setSelectedOption({ index: absoluteIndex, option: q.selectedOption }));
                    }
                    if (q.isVisited === 1) dispatch(markVisited(absoluteIndex));
                    if (q.markforreview === 1) dispatch(toggleMarkForReview(absoluteIndex));
                    absoluteIndex++;
                  });
                });
              }
              dispatch(setAllQuestionTimes(questionTimesFromDB));
              setResultData(state);

              const resumeSubmission = {
                formattedSections: state.section,
                totalScore: state.o_score || 0,
                timeTakenInSeconds: state.timeTakenInSeconds || 0,
                status: state.status || "started"
              };
              setExamDataSubmission(resumeSubmission);

              // if (state.status === "paused") dispatch(setIsPaused(true));
              if (state.status === "paused") {
                console.log("Test was paused in DB, auto-resuming...");
                dispatch(setIsPaused(false));
                updateSectionTime(null, "started");
              }
              if (state.pausedDuration != null) pausedDurationRef.current = state.pausedDuration;
              const savedSectionIndex = state.sectionIndex !== undefined ? state.sectionIndex : state.currentSectionIndex;
              const savedQuestionIndex = state.currentQuestionIndex !== undefined ? state.currentQuestionIndex : state.clickedQuestionIndex;

              if (savedSectionIndex !== undefined && savedSectionIndex < res.data.section.length) {
                dispatch(updateNavigation({
                  sectionIndex: savedSectionIndex,
                  questionIndex: savedQuestionIndex || 0
                }));
              } else {
                dispatch(updateNavigation({ sectionIndex: 0, questionIndex: 0 }));
              }
              console.log("✅ Resume data loaded successfully");
              setIsDataFetched(true);
              return;
            }
          } catch (e) {
            console.error("⚠️ Results fetch failed (common if new test):", e);
          }

          // Initial state for new exam
          const initialOptions = Array(res.data.t_questions).fill(null);
          dispatch(setAllSelectedOptions(initialOptions));

          const initialSubmission = {
            formattedSections: transformedSections,
            totalScore: 0,
            timeTakenInSeconds: 0,
            formattedTotalTime: "00:00:00",
            status: "started"
          };
          setExamDataSubmission(initialSubmission);
          setResultData({ section: transformedSections.map(s => ({ ...s, timeTaken: 0 })) });

          await Api.post(`/results/${user._id}/${id}`, {
            ...res.data,
            section: transformedSections,
            status: "started"
          });
          console.log("✅ New exam result initialized");
        } catch (error) {
          console.error("🔥 Init error:", error);
          // FALLBACK: allow loading with default empty resultData to prevent permanent spinner
          if (transformedSections.length > 0) {
            setResultData({ section: transformedSections.map(s => ({ ...s, timeTaken: 0 })) });
          }
        } finally {
          setIsDataFetched(true);
        }
      }
    };
    fetchData();
  }, [id, user?._id]);
  const handleAutoResume = useCallback(() => {
    if (!isPaused) return;
    console.log("🚀 Automatically resuming test from visibility/focus...");
    dispatch(setIsPaused(false));
    // setPauseCount(0);
    // setQuestionStartTime(new Date());

    // // Update DB to status "started"
    // updateSectionTime(null, "started");
  }, [isPaused, dispatch]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        handleAutoResume();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleAutoResume);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleAutoResume);
    };
  }, [handleAutoResume]);
  const handleMarkForReview = () => {
    if (!markedForReview.includes(clickedQuestionIndex)) {
      setMarkedForReview((prev) => [...prev, clickedQuestionIndex]);
    }
    handleNextClick();
  };

  const [showModal, setShowModal] = useState(false);

  // (Removed legacy handleNextClick)
  const handleNextClick = () => {
    updateSectionTime();

    if (
      examData &&
      examData?.section?.[currentSectionIndex] &&
      examData?.section?.[currentSectionIndex].questions?.[
      selectedLanguage?.toLowerCase()
      ]
    ) {
      const totalQuestions =
        examData?.section?.[currentSectionIndex].questions[
          selectedLanguage?.toLowerCase()
        ]?.length;

      if (clickedQuestionIndex < startingIndex + totalQuestions - 1) {
        dispatch(updateNavigation({ questionIndex: clickedQuestionIndex + 1 }));
      } else {
        dispatch(updateNavigation({ questionIndex: startingIndex }));
      }
    }
  };

  // Persisted in Redux

  // Persisted in Redux
  const sectionTimerRef = useRef(null);        // stable interval for section countdown
  const pauseStartRef = useRef(null);           // timestamp when pause began
  const pausedDurationRef = useRef(0);          // total seconds paused this session
  const [timerKey, setTimerKey] = useState(0);  // incremented to (re)start the countdown interval

  const datatime = examData?.duration ?? 0;


  const [examDataSubmission, setExamDataSubmission] = useState(null); // Define examDataSubmission state


  useEffect(() => {
    if (!id) return;
    const initialOptions = Array(totalQuestions).fill(null);
    dispatch(setAllSelectedOptions(initialOptions));
  }, [id, totalQuestions, dispatch]);

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
    dispatch(setSelectedOption({ index: questionIndex, option: newSelectedOption }));
  };

  // Your submitExam function with the necessary modifications
  const handleSubmitSection = () => {
    const now = new Date();
    const questionsForSection =
      examData?.section?.[currentSectionIndex]?.questions?.[
      selectedLanguage?.toLowerCase()
      ] || [];
    const sectionStartIndex = startingIndex;
    const sectionEndIndex = sectionStartIndex + questionsForSection.length - 1;

    // ─── 2) If we were actually on a question in *this* section, save its time ───
    // Save current question time if running (Handled by live tick, cleanup local)
    if (questionStartTime && clickedQuestionIndex !== null) {
      setQuestionStartTime(null);
    }

    // Stop question timer and clear interval
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Clear the current questionStartTime
    setQuestionStartTime(null);

    // Make sure you pause visually as well
    dispatch(setIsPaused(true));

    console.log("Handling section submission...");

    // ✅ Save section-level time
    const timeSpent = Math.floor(
      (now - currentSectionStartTimeRef.current) / 1000
    );
    dispatch(updateSectionTimeAction({
      index: currentSectionIndex,
      time: timeSpent
    }));
    currentSectionStartTimeRef.current = new Date(); // Reset for next section

    // Reset timer for accuracy
    currentSectionStartTimeRef.current = new Date();
    const currentSection = examData?.section?.[currentSectionIndex];
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
    const updatedSummary = sectionSummaryData.filter(
      (data) => data.sectionName !== sectionSummary.sectionName
    );
    dispatch(setSectionSummaryData([...updatedSummary, sectionSummary]));

    updateSectionTime();
    // Display modal
    setShowModal(true);
    console.log("Modal shown:", showModal);

    // If modal is shown, and you're ready to go to the next section or submit the exam
    if (showModal) {
      console.log("Modal is shown, checking for next section or submission.");

      if (currentSectionIndex < examData.section.length - 1) {
        console.log("Moving to the next section.");
        // Move to the first question of the next section
        const nextIdx = currentSectionIndex + 1;
        const nextStartingIndex = examData?.section
          ?.slice(0, nextIdx)
          .reduce(
            (acc, section) =>
              acc +
              (section.questions?.[selectedLanguage?.toLowerCase()]?.length || 0),
            0
          );
        dispatch(updateNavigation({ sectionIndex: nextIdx, questionIndex: nextStartingIndex }));
      } else {
        console.log("Submitting the exam.");
        finishTestAndOpenResult();
      }
    }
  };

  // Using useEffect to trigger submitExam when needed
  const lastPoolRef = useRef(null);
  // const [isPaused, setIsPaused] = useState(false);
  const [pauseCount, setPauseCount] = useState(0);
  const [resultData, setResultData] = useState(null);
  const [timeTakenFromDB, settimeTakenFromDB] = useState();

  const [dataid, setDataid] = useState(null); // State to store the data

  console.log("timetakenfromdb:", timeTakenFromDB);

  useEffect(() => {
    if (!examData || !resultData) return;

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
    const isFirstRender = lastPoolRef.current === "";
    const hasPoolChanged = !isFirstRender && lastPoolRef.current !== poolIdentifier;

    // Treat timeminus=null as uninitialized, meaning 0 time taken locally
    const isUninitialized = timeminus === null && totalSectionTime > 0;
    const reduxTimeTaken = isUninitialized ? 0 : Math.max(0, totalSectionTime - (timeminus || 0));

    const dbHasMoreProgress = timeTakenForPool > reduxTimeTaken;

    if (hasPoolChanged || isUninitialized || dbHasMoreProgress) {
      lastPoolRef.current = poolIdentifier;
      settimeTakenFromDB(timeTakenForPool); // Keep for backwards compatibility if needed elsewhere

      const remainingTime = Math.max(
        0,
        Math.min(totalSectionTime, totalSectionTime - timeTakenForPool)
      );
      dispatch(setTimeminus(remainingTime));
      setTimerKey(k => k + 1);
    } else if (isFirstRender) {
      lastPoolRef.current = poolIdentifier;
      settimeTakenFromDB(timeTakenForPool);
    }
  }, [examData, currentSectionIndex, resultData]);

  const prepareSubmissionData = (explicitEndTime) => {
    if (!examData) return null;

    const endTime = explicitEndTime || new Date();
    const currentSection = examData?.section?.[currentSectionIndex];

    // Build absolute answers data
    const answersData = selectedOptions.map((selectedOption, index) => {
      let sectionIndex = 0;
      let questionIndexInSection = 0;
      let count = 0;
      let activeSectionObj = null;

      examData.section.forEach((section, sIndex) => {
        const questions = section.questions[selectedLanguage.toLowerCase()] || [];
        if (index >= count && index < count + questions.length) {
          sectionIndex = sIndex;
          questionIndexInSection = index - count;
          activeSectionObj = section;
        }
        count += questions.length;
      });

      if (!activeSectionObj) return null;
      const question = activeSectionObj.questions[selectedLanguage.toLowerCase()][questionIndexInSection];

      const optionsData = (question?.options || []).map((option, optIdx) => ({
        option,
        index: optIdx,
        isSelected: optIdx === selectedOption,
        isCorrect: optIdx === question?.answer,
      }));

      const isVisited = visitedQuestions.includes(index) ? 1 : 0;
      const questionScore = selectedOption !== null
        ? selectedOption === question.answer
          ? activeSectionObj.plus_mark
          : -activeSectionObj.minus_mark
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
        NotVisited: isVisited ? 0 : 1,
        q_on_time: formatTime(questionTimes[index] || 0),
        score: questionScore,
      };
    }).filter(Boolean);

    // Build formatted sections
    let cumulativeTimeTaken = 0;
    const formattedSections = examData.section.map((section, sectionIdx) => {
      const sectionQuestions = section.questions?.[selectedLanguage?.toLowerCase()] || [];
      const sectionStartIndex = examData.section
        .slice(0, sectionIdx)
        .reduce((acc, s) => acc + (s.questions?.[selectedLanguage?.toLowerCase()]?.length || 0), 0);
      const sectionEndIndex = sectionStartIndex + sectionQuestions.length;

      const sectionAnswers = answersData.slice(sectionStartIndex, sectionEndIndex);
      const sectionAnswered = sectionAnswers.filter(q => q.selectedOption !== null).length;
      const sectionVisited = sectionAnswers.filter(q => q.isVisited === 1).length;
      const sectionCorrect = sectionAnswers.filter(q => q.correct).length;
      const sectionScore = sectionAnswers.reduce((sum, q) => sum + q.score, 0);

      // Section timing
      let sectionTimeTaken = 0;
      const isActiveGroupMember = (currentSection?.is_sub_section && section.is_sub_section && currentSection.group_name === section.group_name);

      if (sectionIdx === currentSectionIndex || isActiveGroupMember) {
        // Active section: calculate current elapsed
        const groupTime = (currentSection?.is_sub_section && currentSection?.group_name)
          ? examData.section.filter(s => s.is_sub_section && s.group_name === currentSection.group_name).reduce((sum, s) => sum + (Number(s.t_time) || 0), 0) * 60
          : (Number(currentSection?.t_time) || 0) * 60;

        const currentGroupTimeTaken = Math.max(0, groupTime - timeminus);

        if (section.is_sub_section) {
          const groupIndices = examData.section
            .map((s, i) => (s.is_sub_section && s.group_name === section.group_name ? i : -1))
            .filter(i => i !== -1);
          sectionTimeTaken = groupIndices[0] === sectionIdx ? currentGroupTimeTaken : 0;
        } else {
          sectionTimeTaken = currentGroupTimeTaken;
        }
      } else {
        sectionTimeTaken = resultData?.section?.[sectionIdx]?.timeTaken || 0;
      }

      // Add to total
      if (section.is_sub_section) {
        const groupIndices = examData.section.map((s, i) => (s.is_sub_section && s.group_name === section.group_name ? i : -1)).filter(i => i !== -1);
        if (groupIndices[0] === sectionIdx) cumulativeTimeTaken += sectionTimeTaken;
      } else {
        cumulativeTimeTaken += sectionTimeTaken;
      }

      return {
        ...section,
        isVisited: sectionVisited,
        NotVisited: sectionQuestions.length - sectionVisited,
        questions: {
          english: section.questions.english.map((q, i) => sectionAnswers[i] || q), // Simplified placeholder for now
          hindi: section.questions.hindi?.map((q, i) => sectionAnswers[i] || q) || [],
          tamil: section.questions.tamil?.map((q, i) => sectionAnswers[i] || q) || [],
        },
        s_score: sectionScore,
        correct: sectionCorrect,
        incorrect: sectionAnswered - sectionCorrect,
        Attempted: sectionAnswered,
        Not_Attempted: sectionQuestions.length - sectionAnswered,
        timeTaken: sectionTimeTaken,
      };
    });

    return {
      formattedSections,
      totalScore: formattedSections.reduce((sum, s) => sum + (s.s_score || 0), 0),
      timeTakenInSeconds: cumulativeTimeTaken,
      formattedTotalTime: formatTime(cumulativeTimeTaken),
      endTime,
    };
  };

  const updateSectionTime = (passedData, overrideStatus) => {
    const submissionData = passedData || prepareSubmissionData();
    if (!submissionData || timeminus === null) return Promise.resolve();

    const {
      formattedSections = [],
      totalScore = 0,
      formattedTotalTime = "00:00:00",
      timeTakenInSeconds = 0,
      endTime = new Date(),
    } = submissionData;

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
      const secData = examData?.section?.[idx];

      // Update individual questions q_on_time from Redux
      const updateQuestions = (qs, startIndex) => {
        if (!qs) return [];
        return qs.map((q, qIdx) => ({
          ...q,
          q_on_time: formatTime(questionTimes[startIndex + qIdx] || 0)
        }));
      };

      // Calculate starting index for this section to map to absolute Redux keys
      const sectionStartIndex = examData?.section
        ?.slice(0, idx)
        .reduce((acc, s) => acc + (s.questions?.[selectedLanguage?.toLowerCase()]?.length || 0), 0) || 0;

      const updatedQs = {
        english: updateQuestions(section.questions?.english, sectionStartIndex),
        hindi: updateQuestions(section.questions?.hindi, sectionStartIndex),
        tamil: updateQuestions(section.questions?.tamil, sectionStartIndex),
      };

      let baseSection = { ...section, questions: updatedQs };

      const isCurrentGroup = (currentSec?.is_sub_section && secData?.is_sub_section && currentSec.group_name === secData.group_name);

      if (isCumulativePool && isCurrentGroup) {
        const groupIndices = examData.section
          .map((s, i) => (s.is_sub_section && s.group_name === currentSec.group_name ? i : -1))
          .filter(i => i !== -1);
        const firstGroupIdx = groupIndices[0];

        if (idx === firstGroupIdx) {
          return { ...baseSection, timeTaken: actualTimeTaken };
        }
        return { ...baseSection, timeTaken: 0 };
      }

      if (idx === currentSectionIndex) {
        return { ...baseSection, timeTaken: actualTimeTaken };
      }

      // Preserve existing timeTaken for other groups/sections
      return { ...baseSection, timeTaken: section.timeTaken || 0 };
    });

    if (user?._id) {
      if (isSavingRef.current && overrideStatus !== "completed") {
        console.warn("⏳ Save already in progress, skipping auto-save...");
        return Promise.resolve();
      }
      isSavingRef.current = true;

      const currentPauseElapsed = pauseStartRef.current ? Math.floor((Date.now() - pauseStartRef.current) / 1000) : 0;

      const statusToSend = (isSubmitted || overrideStatus === "completed") 
        ? "completed" 
        : (overrideStatus || (isPaused ? "paused" : "started"));

      return Api.post(`results/${user._id}/${id}`, {
        ExamId: id,
        section: updatedSections,
        score: totalScore,
        totalTime: formattedTotalTime,
        timeTakenInSeconds: timeTakenInSecondsUpdated,
        takenAt: examStartTime,
        submittedAt: endTime,
        status: statusToSend,
        sectionTimes,
        selectedOptions: testState.selectedOptions,
        sectionIndex: currentSectionIndex,
        currentSectionIndex: currentSectionIndex, // Send both for compatibility
        currentQuestionIndex: clickedQuestionIndex,
        pausedDuration: (pausedDurationRef.current || 0) + currentPauseElapsed,
      })
        .then((res) => {
          console.log(`Auto-save successful (status: ${statusToSend}):`, res.data);
          
          dispatch(setResults({
            [id]: {
              status: statusToSend,
              lastQuestionIndex: clickedQuestionIndex,
              selectedOptions: testState.selectedOptions,
            }
          }));

          return res.data;
        })
        .catch((err) => {
          console.error("Auto-save failed:", err);
          throw err;
        })
        .finally(() => {
          isSavingRef.current = false;
        });
    }
    return Promise.resolve();
  };

  // Aggressive auto-save useEffect removed to prevent 500 error version conflicts



  const [timerEnded, setTimerEnded] = useState(false);
  // Handled by timeminus watcher

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
      dispatch(tickTimeminus());
      // Logic for timer ending is now handled in a separate useEffect watching timeminus
    }, 1000);

    return () => clearInterval(sectionTimerRef.current);
  }, [isPaused, timerKey, dispatch]); // Added missing bracket for the first useEffect

  useEffect(() => {
    if (timeminus !== null && timeminus <= 0 && !isSubmitted && examData) {
      if (sectionTimerRef.current) clearInterval(sectionTimerRef.current);
      handleTimerEnd();
    }
  }, [timeminus, isSubmitted, examData]);

  const handleTimerEnd = async () => {
    // Save current question time if running (Handled by live tick, cleanup local)
    if (questionStartTime !== null && clickedQuestionIndex !== null) {
      setQuestionStartTime(null);
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setQuestionStartTime(null);
    dispatch(setIsPaused(true));

    // Save section-level time
    const now = new Date();
    const timeSpent = Math.floor((now - currentSectionStartTimeRef.current) / 1000);
    dispatch(updateSectionTimeAction({ index: currentSectionIndex, time: timeSpent }));
    currentSectionStartTimeRef.current = new Date();

    // Directly trigger completion bypassing manual modal
    await handleSectionCompletion(true);
  };

  const submitExam = async (explicitStatus) => {
    console.log("submitExam called with status:", explicitStatus);

    if (explicitStatus === "completed") {
      dispatch(setSubmitted(true));
    }

    // Save current active timing before final submission
    const now = new Date();
    const timeSpent = Math.floor((now - currentSectionStartTimeRef.current) / 1000);
    dispatch(updateSectionTimeAction({ index: currentSectionIndex, time: timeSpent }));
    currentSectionStartTimeRef.current = now;

    const submissionData = prepareSubmissionData(now);
    return await updateSectionTime(submissionData, explicitStatus);
  };

  const handlePauseResume = () => {
    if (isPaused) {
      // 🟢 RESUME LOGIC
      dispatch(setIsPaused(false));
      setPauseCount(0);
      setQuestionStartTime(new Date());

      // Update DB to status "running" (use explicit "started" or "running" depending on backend expectations, usually "started")
      updateSectionTime(null, "started");
      return;
    }

    // 🔴 PAUSE LOGIC
    dispatch(setIsPaused(true));
    setPauseCount(pauseCount + 1);

    const now = new Date();

    // ✅ Save current question time (Live tick already updated state, just cleanup local)
    if (questionStartTime && clickedQuestionIndex !== null) {
      setQuestionStartTime(null);
      if (timerRef.current) clearInterval(timerRef.current);
    }

    // ✅ Save section time
    const timeSpent = Math.floor(
      (now - currentSectionStartTimeRef.current) / 1000
    );
    console.log("Time spent in current section (seconds):", timeSpent);

    // ✅ Safely update the sectionTimes state
    // ✅ Safely update the sectionTimes state
    dispatch(updateSectionTimeAction({
      index: currentSectionIndex,
      time: timeSpent
    }));
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
        try {
          await submitExam("paused");
          await new Promise((resolve) => setTimeout(resolve, 500));
          closeAndNotifyParent();
        } catch (err) {
          console.error("Submission error during quit:", err);
          closeAndNotifyParent(); // Try to close anyway
        }
      } else {
        dispatch(setIsPaused(false));
        setPauseCount(0);

        // ⏳ Resuming: questionStartTime resets
        setQuestionStartTime(new Date());

        // Timer interval is restarted by the isPaused useEffect
      }
    });
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
    dispatch(setIsPaused(false));
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
      groupMembers.forEach(({ i }) => {
        updatedSubmitted.add(i);
        dispatch(markSectionSubmitted(i));
      });

      // Find the first section AFTER this group
      const lastGroupMemberIdx = Math.max(...groupMembers.map(({ i }) => i));
      const nextIndex = lastGroupMemberIdx + 1;

      if (nextIndex < examData?.section?.length) {
        const newStartingIndex = examData.section
          .slice(0, nextIndex)
          .reduce((acc, s) => acc + (s.questions?.[selectedLanguage?.toLowerCase()]?.length || 0), 0);

        dispatch(updateNavigation({
          sectionIndex: nextIndex,
          questionIndex: newStartingIndex
        }));
        return;
      } else {
        // Last group in exam finished via timer — submit exam
        await finishTestAndOpenResult();
        return;
      }
    }

    // Normal completion (Modal "Move to next" OR mid-group switch)
    updatedSubmitted.add(currentSectionIndex);
    dispatch(markSectionSubmitted(currentSectionIndex));

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
        const newStartingIndex = examData.section
          .slice(0, nextIndex)
          .reduce((acc, s) => acc + (s.questions?.[selectedLanguage?.toLowerCase()]?.length || 0), 0);

        dispatch(updateNavigation({
          sectionIndex: nextIndex,
          questionIndex: newStartingIndex
        }));
        return;
      }
      // All sub-sections done — fall through
    }

    // ✅ ADVANCE TO NEXT SECTION / GROUP (or submit exam if last)
    if (currentSectionIndex < examData?.section?.length - 1) {
      const nextIndex = currentSectionIndex + 1;
      const newStartingIndex = examData.section
        .slice(0, nextIndex)
        .reduce((acc, s) => acc + (s.questions?.[selectedLanguage?.toLowerCase()]?.length || 0), 0);

      dispatch(updateNavigation({
        sectionIndex: nextIndex,
        questionIndex: newStartingIndex
      }));
    } else {
      // Last section — submit exam and navigate to results
      await finishTestAndOpenResult();
    }
  };

  // ✅ Previous question handler — does NOT cross section boundaries
  const handlePreviousClick = () => {
    if (clickedQuestionIndex <= 0) return;

    if (
      examData &&
      examData?.section?.[currentSectionIndex] &&
      examData?.section?.[currentSectionIndex].questions?.[selectedLanguage?.toLowerCase()]
    ) {
      if (clickedQuestionIndex > startingIndex) {
        dispatch(updateNavigation({ questionIndex: clickedQuestionIndex - 1 }));
        // setQuestionTime(0); // This should also be in Redux or handled by updateNavigation
      }
    }
  };

  // Calculate starting index for the current section
  const quantsSection = examData?.section?.[currentSectionIndex];

  const isLastQuestion =
    clickedQuestionIndex ===
    quantsSection?.questions?.[selectedLanguage?.toLowerCase()]?.length - 1;



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

      examData?.section?.[currentSectionIndex]?.questions?.[
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
    // Resume timer logic handled by Redux
    const existingTime = questionTimes?.[clickedQuestionIndex] || 0;
    console.log(`⏳ Resuming question ${clickedQuestionIndex} from ${existingTime}s`);
  };

  const finishTestAndOpenResult = async () => {
    try {
      console.log("🏁 Closing test and opening results...");
      // Ensure we have a final save with "completed" status
      await submitExam("completed");

      // Build the result URL
      const resultUrl = `${window.location.origin}/result/${id}/${user?._id}`;

      // 1. Notify parent via postMessage (legacy/fallback)
      if (window.opener) {
        window.opener.postMessage({
          type: 'test-status-updated',
          testId: id
        }, window.location.origin);
      }

      // 2. Broadcast via BroadcastChannel for robust cross-tab sync
      const channel = new BroadcastChannel('exam-status-channel');
      channel.postMessage({ type: 'test-status-updated', testId: id });
      channel.close();

      window.open(resultUrl, '_blank');

        // Close the current test window
      setTimeout(() => {
        window.close();
      }, 300);
    } catch (error) {
      console.error("Error finishing test:", error);
      alert('Failed to submit the exam. Please try again.');
    }
  };

  const closeAndNotifyParent = () => {
    if (window.opener) {
      console.log("Notifying parent via postMessage");
      window.opener.postMessage({
        type: 'test-status-updated',
        testId: id
      }, window.location.origin);
    }

    // Also broadcast via BroadcastChannel for robust cross-tab sync
    const channel = new BroadcastChannel('exam-status-channel');
    channel.postMessage({ type: 'test-status-updated', testId: id });
    channel.close();

    setTimeout(() => {
      window.close();
    }, 300);
  };

  // When question changes
  // 💡 When question changes
  useEffect(() => {
    // 2️⃣ Clear previous timer
    if (timerRef.current) clearInterval(timerRef.current);

    if (isPaused) return;

    console.log("q", questionTimes, clickedQuestionIndex);

    // LIVE INCREMENT moved to Redux tick or simpler local tick dispatched to Redux
    timerRef.current = setInterval(() => {
      dispatch(tickQuestionTime({ index: clickedQuestionIndex }));
    }, 1000);

    // 5️⃣ Track previous index for next time
    setPreviousQuestionIndex(clickedQuestionIndex);

    return () => clearInterval(timerRef.current);
  }, [clickedQuestionIndex, isPaused]);


  // Debug Logger
  useEffect(() => {
    if (examData || isDataFetched) {
      console.log("📊 TEST STATE:", {
        isDataFetched,
        hasExamData: !!examData,
        sections: examData?.section?.length,
        currentIdx: currentSectionIndex,
        isPaused,
        timeminus,
        urlId: id
      });
    }
  }, [isDataFetched, examData, currentSectionIndex, isPaused, timeminus, id]);

  console.log("currentTime:", questionTime);

  if (!isDataFetched || !examData || !resultData) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-600 font-medium font-mock">Initializing exam session...</p>
      </div>
    );
  }

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

export default Test; 

