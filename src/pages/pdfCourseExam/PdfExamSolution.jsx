import { useContext, useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import logo from '../../assets/logo/bg-logo.png';
import { FaChevronRight, FaInfoCircle, FaCompress, FaExpand, } from "react-icons/fa";
import Api from "../../service/Api";
import { UserContext } from "../../context/UserProvider";
import { Avatar } from "@mui/material";

const PdfExamSolution = () => {
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

    const [isToggled, setIsToggled] = useState(false);
    const [isDataFetched, setIsDataFetched] = useState(false);

    const [check, setCheck] = useState(null)
    const [show_name, setShow_name] = useState("")
    const [exam_name, setExam_name] = useState("")
    const [test_type, setTest_type] = useState("")
    const [test_name, setTest_name] = useState("")
    const [description, setDescription] = useState("")
    const [t_questions, sett_questions] = useState("")
    const [showReportForm, setShowReportForm] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    // exams/getExam/67c5900a09a3bf8c7f605d71
    const { user } = useContext(UserContext);
    const startingIndex = examData?.section
        ?.slice(0, currentSectionIndex)
        .reduce(
            (acc, section) =>
                acc + section.questions?.[selectedLanguage?.toLowerCase()]?.length,
            0
        ) || 0;

    // Reset clickedQuestionIndex when section changes
    useEffect(() => {
        setClickedQuestionIndex(startingIndex);
    }, [currentSectionIndex, startingIndex]);

    const fetchMergedExamData = async (userId, examId) => {
        try {
            const [examRes, resultRes] = await Promise.all([
                Api.get(`pdf-exams/getExam/${examId}`),
                Api.get(`PDFresults/${userId}/${examId}`),
            ]);

            const exam = examRes.data;
            const result = resultRes.data;

            // Update state variables
            setShow_name(exam.show_name);
            setExam_name(exam.exam_name);
            setTest_type(exam.test_type);
            setTest_name(exam.test_name);
            setDescription(exam.description);
            sett_questions(exam.t_questions);

            // Create mapping of result sections by name
            const resultSectionsMap = new Map();
            (result?.section || []).forEach(sec => {
                if (sec.name) {
                    resultSectionsMap.set(sec.name, sec);
                }
            });

            // Merge sections by matching name
            const mergedSections = (exam?.section || []).map(examSec => {
                // Find matching result section by name
                const resultSec = resultSectionsMap.get(examSec.name) || {};

                // Helper function to merge questions by index for a specific language
                const mergeQuestionsByLang = (lang) => {
                    return (examSec?.questions?.[lang] || []).map((q, qIndex) => {
                        const resultQ = (resultSec?.questions?.[lang] || [])[qIndex] || {};
                        return {
                            ...q,
                            selectedOption: resultQ.selectedOption ?? null,
                            isVisited: resultQ.isVisited ?? 0,
                            NotVisited: resultQ.NotVisited ?? 0,
                            q_on_time: resultQ.q_on_time ?? null,
                        };
                    });
                };

                return {
                    ...examSec,
                    s_blueprint: resultSec.s_blueprint || examSec.s_blueprint || [],
                    questions: {
                        english: mergeQuestionsByLang('english'),
                        hindi: mergeQuestionsByLang('hindi'),
                        tamil: mergeQuestionsByLang('tamil'),
                    },
                    s_score: resultSec.s_score ?? 0,
                    correct: resultSec.correct ?? 0,
                    incorrect: resultSec.incorrect ?? 0,
                    Attempted: resultSec.Attempted ?? 0,
                    Not_Attempted: resultSec.Not_Attempted ?? 0,
                    s_accuracy: resultSec.s_accuracy ?? 0,
                    timeTaken: resultSec.timeTaken ?? 0,
                    s_order: examSec.s_order,  // Keep original section order
                };
            });

            // Create final merged exam data
            const examData = {
                bilingual_status: exam.bilingual_status,
                english_status: exam.english_status,
                hindi_status: exam.hindi_status,
                tamil_status: exam.tamil_status,
                show_name: exam.show_name || exam.exam_name || "",
                userId: result.userId,
                ExamId: result.ExamId,
                section: mergedSections,
                descriptive: result?.descriptive || [],
                o_accuracy: result?.o_accuracy ?? 0,
                o_score: result?.o_score ?? 0,
                Rank: result?.Rank ?? null,
                Percentile: result?.Percentile ?? null,
                takenAt: result?.takenAt ?? null,
                submittedAt: result?.submittedAt ?? null,
                status: result?.status || "not started",
                timeTakenInSeconds: result?.timeTakenInSeconds ?? 0,
                createdAt: result?.createdAt,
                updatedAt: result?.updatedAt,
            };

            return examData;
        } catch (error) {
            console.error("Error merging exam and result:", error);
            throw error;
        }
    };
    useEffect(() => {
        if (!user?._id && !id) return;

        const loadExam = async () => {
            const data = await fetchMergedExamData(user?._id, id);
            console.log("examdata", data);

            setExamData(data);
        };

        loadExam();
    }, [user?._id, id]);

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
        s_score: [],
        unseen: []
    });

    // Change the initial state to store all sections' data
    const [resultsBySection, setResultsBySection] = useState([]);

    // Update the useEffect that fetches results
    // useEffect(() => {
    //     if (!user?._id) return;

    //     Api.get(`results/${user?._id}/${id}`)
    //         .then((res) => {
    //             if (res.data) {
    //                 setExamsData(res.data);
    //                 // Store results for all sections
    //                 setResultsBySection(res.data.section.map(section => ({
    //                     correct: section.correct,
    //                     incorrect: section.incorrect,
    //                     skipped: section.skipped,
    //                     Attempted: section.Attempted,
    //                     Not_Attempted: section.Not_Attempted,
    //                     s_score: section.s_score,
    //                     unseen: section.NotVisited
    //                 })));

    //                 // Also set current section's data
    //                 const currentSectionData = res.data.section[currentSectionIndex];
    //                 if (currentSectionData) {
    //                     setResultData({
    //                         correct: currentSectionData.correct,
    //                         incorrect: currentSectionData.incorrect,
    //                         skipped: currentSectionData.skipped,
    //                         Attempted: currentSectionData.Attempted,
    //                         Not_Attempted: currentSectionData.Not_Attempted,
    //                         s_score: currentSectionData.s_score,
    //                         unseen: currentSectionData.NotVisited
    //                     });
    //                 }
    //             }
    //         })
    //         .catch((err) => console.error("Error fetching data:", err));
    // }, [id, user]);


    // Update this when section changes
    useEffect(() => {
        if (resultsBySection[currentSectionIndex]) {
            setResultData(resultsBySection[currentSectionIndex]);
        }
    }, [currentSectionIndex, resultsBySection]);











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
                navigate(-1); // Navigate to the result page
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
        startingIndex + (quantsSection?.questions?.[selectedLanguage?.toLowerCase()]?.length || 0) - 1;
    const isLastSection = currentSectionIndex === (examData?.section?.length || 0) - 1;

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
    const [closeSideBar, setCloseSideBar] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMobileMenuOpen(prevState => !prevState);
    };

    const toggleMenu2 = () => {
        setCloseSideBar(!closeSideBar);
    };

    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (examData?.section?.[currentSectionIndex]?.questions) {
            setReady(true);
        }
    }, [examData, currentSectionIndex]);


    const reasons = [
        "Incorrect Question",
        "Incorrect Answer",
        "Incorrect Solution",
        "Incorrect Options",
        "Incomplete Question",
        "Incomplete Solution",
        "Translation Error",
        "others",
    ];

    const [selectedReasons, setSelectedReasons] = useState([]);
    const [comment, setComment] = useState("");

    const handleCheckboxChange = (reason) => {
        if (selectedReasons.includes(reason)) {
            setSelectedReasons(selectedReasons.filter((r) => r !== reason));
        } else {
            setSelectedReasons([...selectedReasons, reason]);
        }
    };

    const handleSubmit = async () => {
        const payload = {
            userId: user?._id,
            examId: id,
            userName: user?.firstName,
            emailId: user?.email,
            examName: exam_name,
            testType: test_type,
            testName: test_name,
            Description: description,
            sectionId: examData?.section[currentSectionIndex]?._id,
            sectionName: examData?.section[currentSectionIndex]?.name,
            questionId: examData?.section[currentSectionIndex]?.questions?.[selectedLanguage?.toLowerCase()]?.[clickedQuestionIndex - startingIndex]?._id,
            questionIndex: clickedQuestionIndex,
            reasons: selectedReasons,
            comment: selectedReasons.includes("others") ? comment : "",
        };

        try {
            await Api.post("reports/report-question", payload);
            alert("Report submitted!");
            setSelectedReasons([]);
            setComment("");
            console.log("dd", payload);

        } catch (error) {
            console.error(error);
            alert("Submission failed.");
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

    return (
        <div className="p-1 mock-font ">
            <div>

                <div className="bg-[#3476bb] text-white w-full flex justify-between items-center px-4 py-2 shadow-sm">
                    {/* Left Section: Logo & Show Name */}
                    <div className="flex items-center gap-3">
                        <img
                            src={logo}
                            alt="logo"
                            className="h-10 w-auto bg-white rounded p-0.5"
                        />
                        <h1 className="font-bold text-base md:text-xl truncate max-w-[150px] md:max-w-none">
                            {show_name}
                        </h1>
                    </div>

                    {/* Right Section: Time & Fullscreen Controls */}
                    <div className="flex items-center gap-3 md:gap-4">

                        {/* Refined Time Display */}
                        {/* <div className="flex items-center gap-2 bg-gray-100 text-slate-800 px-3 py-1.5 rounded-md shadow-inner">
      <span className="text-xs md:text-sm font-semibold uppercase tracking-wide text-slate-500 hidden sm:inline">
        Time Left:
      </span>
      <span className="text-sm md:text-base font-bold font-mono">
        {formatTime(timeminus)}
      </span>
    </div> */}

                        {/* Fullscreen Toggle Button */}
                        <button
                            onClick={toggleFullScreen}
                            className="bg-white/20 hover:bg-white/30 transition-colors p-2 rounded-full cursor-pointer text-white flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/50"
                            aria-label="Toggle Fullscreen"
                            title="Toggle Fullscreen"
                        >
                            {isFullscreen ? <FaCompress size={16} /> : <FaExpand size={16} />}
                        </button>
                    </div>
                </div>

            </div>

            <div>
                <div className="d-flex justify-content-start align-items-center flex-wrap bg-gray-100 gap-2 p-2">
                    {(() => {
                        const formattedSections = [];
                        let currentGroupName = null;
                        let combinedSection = null;

                        (examData?.section || []).forEach((section, index) => {
                            if (section.is_sub_section && section.group_name) {
                                if (section.group_name !== currentGroupName) {
                                    if (combinedSection) formattedSections.push(combinedSection);
                                    currentGroupName = section.group_name;
                                    combinedSection = {
                                        ...section,
                                        name: section.group_name,
                                        isGroup: true,
                                        originalSections: [{ ...section, originalIndex: index }],
                                        t_question: Number(section.t_question) || 0,
                                        t_time: Number(section.t_time) || 0,
                                        t_mark: Number(section.t_mark) || 0,
                                        originalIndex: index
                                    };
                                } else {
                                    combinedSection.originalSections.push({ ...section, originalIndex: index });
                                    combinedSection.t_question += Number(section.t_question) || 0;
                                    combinedSection.t_time += Number(section.t_time) || 0;
                                    combinedSection.t_mark += Number(section.t_mark) || 0;
                                }
                            } else {
                                if (combinedSection) {
                                    formattedSections.push(combinedSection);
                                    combinedSection = null;
                                    currentGroupName = null;
                                }
                                formattedSections.push({ ...section, isGroup: false, originalIndex: index });
                            }
                        });
                        if (combinedSection) formattedSections.push(combinedSection);

                        return formattedSections.map((group, groupIndex) => {
                            // Calculate aggregate stats for the group tooltip
                            let groupCorrect = 0, groupIncorrect = 0, groupUnseen = 0, groupSkipped = 0;
                            const isActiveGroup = group.isGroup
                                ? group.originalSections.some(s => s.originalIndex === currentSectionIndex)
                                : group.originalIndex === currentSectionIndex;

                            if (group.isGroup) {
                                group.originalSections.forEach(s => {
                                    const sectionResults = resultsBySection[s.originalIndex] || {};
                                    groupCorrect += sectionResults.correct || 0;
                                    groupIncorrect += sectionResults.incorrect || 0;
                                    groupUnseen += sectionResults.unseen || 0;
                                    groupSkipped += sectionResults.skipped || 0;
                                });
                            } else {
                                const sectionResults = resultsBySection[group.originalIndex] || {};
                                groupCorrect = sectionResults.correct || 0;
                                groupIncorrect = sectionResults.incorrect || 0;
                                groupUnseen = sectionResults.unseen || 0;
                                groupSkipped = sectionResults.skipped || 0;
                            }

                            return (
                                <div key={groupIndex} className="d-inline-flex flex-column align-items-start border-r-2 border-gray-300 pr-2">
                                    <h1
                                        className={`h6 p-2 text-blue-400 d-inline-flex align-items-center cursor-pointer hover:bg-blue-50 rounded transition-colors
                                            ${isActiveGroup ? ' font-medium bg-blue-100' : ''}`}
                                        onClick={() => setCurrentSectionIndex(group.isGroup ? group.originalSections[0].originalIndex : group.originalIndex)}
                                    >
                                        <span className={isActiveGroup ? "border-b-2 border-blue-500 pb-1" : ""}>
                                            {group.name}
                                        </span>
                                        <div className="relative group ml-2 d-inline-block">
                                            <FaInfoCircle className="cursor-pointer text-blue-400" />
                                            <div className="absolute z-50 hidden group-hover:block bg-white text-dark border rounded p-2 shadow-md mt-1 
                                                min-w-[220px] w-fit left-1/2 -translate-x-1/2">
                                                <div className="mt-2 flex align-items-center">
                                                    <div className="smanswerImg mx-2 text-white fw-bold flex align-items-center justify-content-center">
                                                        {groupCorrect}
                                                    </div>
                                                    <p>Correct</p>
                                                </div>
                                                <div className="mt-2 flex align-items-center">
                                                    <div className="smnotansImg mx-2 text-white fw-bold flex align-items-center justify-content-center">
                                                        {groupIncorrect}
                                                    </div>
                                                    <p>Wrong</p>
                                                </div>
                                                <div className="mt-2 flex align-items-center">
                                                    <div className="smnotVisitImg mx-2 text-black fw-bold flex align-items-center justify-content-center">
                                                        {groupUnseen}
                                                    </div>
                                                    <p>Unseen</p>
                                                </div>
                                                <div className="mt-2 flex align-items-center">
                                                    <div className="smskipimg mx-2 text-white fw-bold flex align-items-center justify-content-center">
                                                        {groupSkipped}
                                                    </div>
                                                    <p>Skipped</p>
                                                </div>
                                            </div>
                                        </div>
                                    </h1>

                                    {/* Render Sub-sections if this is an active group */}
                                    {isActiveGroup && group.isGroup && group.originalSections.length > 1 && (
                                        <div className="d-flex w-100 pl-2 gap-2 mt-2">
                                            {group.originalSections.map((subSection) => (
                                                <div
                                                    key={subSection.originalIndex}
                                                    className={`text-sm p-1 cursor-pointer rounded transition-colors ${currentSectionIndex === subSection.originalIndex ? 'bg-blue-200 text-blue-800 font-bold' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                                                    onClick={() => setCurrentSectionIndex(subSection.originalIndex)}
                                                >
                                                    {subSection.name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        });
                    })()}
                </div>

                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                                        <input type="text" className="form-control" id="userInput" placeholder="Enter Review!!" />
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
            {/* Mobile Hamburger Menu */}
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
            <div className="flex">
                {/* Question Panel */}
                <div className={` ${closeSideBar ? 'md:w-full' : 'md:w-4/5'}`}>
                    {!isSubmitted ? (
                        <>
                            <div className="flex flex-wrap items-center justify-between bg-[#f1f3f6] border-1 p-2 border-gray-300 gap-4">
                                {/* Question No Card */}
                                <div className="bg-white border rounded-lg px-4 py-2 shadow-sm min-w-[120px]">
                                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-0.5">QUESTION NO.</div>
                                    <div className="text-lg font-extrabold text-slate-800">
                                        {clickedQuestionIndex + 1} / {t_questions}
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-6">
                                    {/* Language Select */}
                                    {examData &&
                                        examData.section?.[currentSectionIndex]?.name?.toLowerCase().trim() !== "english language" && (
                                            <div className="flex items-center">
                                                <select
                                                    value={displayLanguage || selectedLanguage}
                                                    onChange={(e) => setDisplayLanguage(e.target.value)}
                                                    className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer shadow-sm min-w-[110px]"
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

                                    {/* Time Spent */}
                                    <div className="flex flex-col items-end">
                                        <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-0.5">TIME SPENT</div>
                                        <div className="text-lg font-bold text-[#3476bb] font-mono leading-none">
                                            {examData?.section[currentSectionIndex]?.questions?.[
                                                selectedLanguage?.toLowerCase()
                                            ]?.[clickedQuestionIndex - startingIndex]?.q_on_time}
                                        </div>
                                    </div>

                                    {/* Re-attempt Toggle */}
                                    <div className="bg-white/60 border border-slate-200 rounded-full px-4 py-1.5 flex items-center gap-3 shadow-inner">
                                        <span className="text-xs font-bold text-slate-600 tracking-wide uppercase">RE-ATTEMPT</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={isToggled}
                                                onChange={handleToggleChange}
                                                className="sr-only"
                                            />
                                            <div className={`w-11 h-6 rounded-full transition-all duration-300 ease-in-out ${isToggled ? "bg-[#3476bb]" : "bg-slate-300"}`}>
                                                <div
                                                    className={`m-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ease-in-out ${isToggled ? "translate-x-5" : ""}`}
                                                ></div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {examData?.section[currentSectionIndex] ? (
                                <div className="flex flex-col md:flex-row pb-5" >
                                    {/* Left side for Common Data */}
                                    {examData.section[currentSectionIndex]?.questions?.[
                                        selectedLanguage?.toLowerCase()
                                    ]?.[clickedQuestionIndex - startingIndex]?.common_data && (
                                            <div
                                                className="md:w-[50%] p-4 sm:h-[70vh] md:h-[75vh] lg:h-[73vh] xl:h-[75vh] 2xl:h-[80vh] md:border-r border-gray-200 bg-slate-50/30"
                                                style={{
                                                    height: 'calc(100vh - 150px)',
                                                    overflowY: 'auto'
                                                }}
                                            >
                                                
                                                <div
                                                    className=" text-wrap"
                                                    style={{
                                                        whiteSpace: "normal",
                                                        wordWrap: "break-word",
                                                        // fontSize: "1.05rem"
                                                    }}
                                                    dangerouslySetInnerHTML={{
                                                        __html:
                                                            examData.section[currentSectionIndex]
                                                                ?.questions?.[
                                                                (displayLanguage || selectedLanguage)?.toLowerCase()
                                                            ]?.[clickedQuestionIndex - startingIndex]
                                                                ?.common_data || "No common data available",
                                                    }}
                                                />
                                            </div>
                                        )}

                                    {/* Right side for Question */}
                                    <div
                                        className="w-full p-4 md:p-6 mb-24 md:mb-0 bg-white"
                                        style={{
                                            height: 'calc(100vh - 150px)',
                                            overflowY: 'auto'
                                        }}
                                    >
                                        <div className="max-w-4xl mx-auto w-full">
                                            {/* Question Display */}
                                            <div
                                                className="max-w-none text-slate-900 mb-8 leading-relaxed"
                                                style={{
                                                    whiteSpace: "normal",
                                                    wordWrap: "break-word",
                                                }}
                                                dangerouslySetInnerHTML={{
                                                    __html:
                                                        examData.section[currentSectionIndex]?.questions?.[
                                                            (displayLanguage || selectedLanguage)?.toLowerCase()
                                                        ]?.[clickedQuestionIndex - startingIndex]?.question || "No question available",
                                                }}
                                            />

                                            {/* Options Grid */}
                                            <div className="space-y-4 mb-8">
                                                {examData?.section[currentSectionIndex]?.questions?.[
                                                    selectedLanguage?.toLowerCase()
                                                ]?.[clickedQuestionIndex - startingIndex]?.options?.map((option, index) => {
                                                    const question = examData.section[currentSectionIndex]?.questions?.[
                                                        (displayLanguage || selectedLanguage)?.toLowerCase()
                                                    ]?.[clickedQuestionIndex - startingIndex];

                                                    const selectedOption = question?.selectedOption;
                                                    const answer = question?.answer;
                                                    const isSelected = selectedOption === index;
                                                    const isCorrect = answer === index;

                                                    // Determine visual state
                                                    let stateClass = "border-slate-200 hover:border-blue-400 hover:bg-blue-50/30";
                                                    let icon = null;

                                                    if (!isToggled) {
                                                        // Results Mode
                                                        if (isCorrect) {
                                                            stateClass = "border-green-500 bg-green-50/50 ring-1 ring-green-500 ring-offset-0";
                                                            icon = (
                                                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                                                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                </div>
                                                            );
                                                        } else if (isSelected && !isCorrect) {
                                                            stateClass = "border-red-500 bg-red-50/50 ring-1 ring-red-500 ring-offset-0";
                                                            icon = (
                                                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                                                                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                </div>
                                                            );
                                                        }
                                                    } else {
                                                        // Re-attempt mode
                                                        if (check === index) {
                                                            if (isCorrect) {
                                                                stateClass = "border-green-500 bg-green-50/50 ring-1 ring-green-500 ring-offset-0";
                                                                icon = (
                                                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                                                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                    </div>
                                                                );
                                                            } else {
                                                                stateClass = "border-red-500 bg-red-50/50 ring-1 ring-red-500 ring-offset-0";
                                                                icon = (
                                                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                                                                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                                                                        </svg>
                                                                    </div>
                                                                );
                                                            }
                                                        } else if (check !== null && isCorrect) {
                                                            stateClass = "border-green-500 bg-green-50/30";
                                                            icon = (
                                                                <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-green-500 flex items-center justify-center opacity-70">
                                                                    <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                </div>
                                                            );
                                                        }
                                                    }

                                                    return (
                                                        <div
                                                            key={index}
                                                            className={`
                                                                relative flex items-center p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer group
                                                                ${stateClass}
                                                                ${(!isToggled || isClicked) ? 'cursor-default' : ''}
                                                            `}
                                                            onClick={() => {
                                                                if (isToggled && !isClicked) {
                                                                    setCheck(index);
                                                                    setIsClicked(true);
                                                                    setSelectedOptions(prev => ({
                                                                        ...prev,
                                                                        [clickedQuestionIndex]: index
                                                                    }));
                                                                }
                                                            }}
                                                        >
                                                            <div className="flex items-start gap-4 w-full">
                                                                {/* Option Marker/Radio replacement */}
                                                                <div className={`
                                                                    flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold
                                                                    ${isSelected || (check === index) 
                                                                        ? 'bg-blue-600 border-blue-600 text-white' 
                                                                        : 'border-slate-300 text-slate-500 group-hover:border-blue-400 group-hover:text-blue-600'}
                                                                    ${isCorrect && !isToggled ? 'bg-green-600 border-green-600 text-white' : ''}
                                                                    ${isSelected && !isCorrect && !isToggled ? 'bg-red-600 border-red-600 text-white' : ''}
                                                                `}>
                                                                    {String.fromCharCode(65 + index)}
                                                                </div>

                                                                {/* Option Content */}
                                                                <div 
                                                                    className="flex-grow text-slate-700"
                                                                    dangerouslySetInnerHTML={{ __html: option || "No option available" }} 
                                                                />

                                                                {/* Result Icon */}
                                                                {icon}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            {/* Modernized Explanation Section */}
                                            {(check != null || !isToggled) && (
                                                <div className="mt-8 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
                                                    <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                                                        <div className="bg-slate-100 px-6 py-3 border-b border-slate-200 flex items-center gap-2">
                                                            <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
                                                            <h5 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Solution & Explanation</h5>
                                                        </div>
                                                        <div className="p-6">
                                                            {examData?.section?.[currentSectionIndex]?.questions?.[
                                                                (displayLanguage || selectedLanguage)?.toLowerCase()
                                                            ]?.[clickedQuestionIndex - startingIndex]?.explanation ? (
                                                                <div
                                                                    className="prose prose-slate max-w-none text-slate-700 leading-relaxed"
                                                                    style={{
                                                                        whiteSpace: "normal",
                                                                        wordWrap: "break-word",
                                                                    }}
                                                                    dangerouslySetInnerHTML={{
                                                                        __html:
                                                                            examData.section[currentSectionIndex]?.questions[
                                                                                (displayLanguage || selectedLanguage)?.toLowerCase()
                                                                            ]?.[clickedQuestionIndex - startingIndex]?.explanation,
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div className="flex items-center gap-3 text-slate-500 italic py-4">
                                                                    <FaInfoCircle className="w-5 h-5 opacity-50" />
                                                                    <p>Detailed explanation for this question is currently being updated.</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Modernized Report Section */}
                                                    {!isToggled && (
                                                        <div className="mt-8 flex flex-col items-center gap-4 pb-20">
                                                            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                                                            <p className="text-sm text-slate-500">Found an issue with this question?</p>
                                                            <button
                                                                className="group flex items-center gap-2 bg-white text-red-600 border-2 border-red-100 px-6 py-2.5 rounded-full font-semibold hover:bg-red-50 hover:border-red-200 transition-all active:scale-95 shadow-sm"
                                                                onClick={() => setShowReportForm(true)}
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                                </svg>
                                                                Report Issue
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Modernized Report Modal */}
                                            {showReportForm && (
                                                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
                                                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
                                                        <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                                                            <div>
                                                                <h2 className="text-xl font-bold text-slate-800">Report Question</h2>
                                                                <p className="text-sm text-slate-500 mt-0.5">Help us maintain quality content</p>
                                                            </div>
                                                            <button
                                                                onClick={() => setShowReportForm(false)}
                                                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-400 transition-colors"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                        
                                                        <div className="p-8">
                                                            <p className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wider">Reason for reporting</p>
                                                            <div className="grid grid-cols-1 gap-3">
                                                                {reasons.map((reason) => (
                                                                    <label 
                                                                        key={reason}
                                                                        className={`
                                                                            flex items-center p-3 rounded-xl border-2 transition-all cursor-pointer
                                                                            ${selectedReasons.includes(reason) 
                                                                                ? 'border-blue-500 bg-blue-50/50 text-blue-700' 
                                                                                : 'border-slate-100 hover:border-slate-200 text-slate-600'}
                                                                        `}
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            className="hidden"
                                                                            checked={selectedReasons.includes(reason)}
                                                                            onChange={() => handleCheckboxChange(reason)}
                                                                        />
                                                                        <div className={`w-5 h-5 rounded-md border-2 mr-3 flex items-center justify-center transition-all ${selectedReasons.includes(reason) ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                                                                            {selectedReasons.includes(reason) && (
                                                                                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                                                </svg>
                                                                            )}
                                                                        </div>
                                                                        <span className="font-medium capitalize">{reason}</span>
                                                                    </label>
                                                                ))}
                                                            </div>

                                                            {selectedReasons.includes("others") && (
                                                                <div className="mt-4 animate-in slide-in-from-top-2">
                                                                    <textarea
                                                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-slate-700 focus:border-blue-500 focus:outline-none transition-colors"
                                                                        placeholder="Please provide more details..."
                                                                        rows="3"
                                                                        value={comment}
                                                                        onChange={(e) => setComment(e.target.value)}
                                                                    />
                                                                </div>
                                                            )}

                                                            <div className="grid grid-cols-2 gap-4 mt-8">
                                                                <button
                                                                    className="px-6 py-3 rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                                                                    onClick={() => setShowReportForm(false)}
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    className="px-6 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                                                                    disabled={selectedReasons.length === 0}
                                                                    onClick={() => {
                                                                        handleSubmit();
                                                                        setShowReportForm(false);
                                                                    }}
                                                                >
                                                                    Submit Report
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>


                                        <div className="md:flex hidden items-center">
                                            {/* <div
                                                className={`fixed top-1/2 ${closeSideBar ? 'right-0' : ''} bg-gray-600 h-14 w-5 md:mr-2 rounded-s-md flex justify-center items-center cursor-pointer`}
                                                onClick={toggleMenu2}
                                            >
                                                <FaChevronRight
                                                    className={`w-2 h-5 text-white transition-transform duration-300 ${closeSideBar ? 'absalute left-0 rotate-180' : ''}`}
                                                />
                                            </div> */}
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
                    className={` pb-7 h-[80vh] sm:h-[82vh] md:h-[85vh] lg:h-[85vh] xl:h-[85vh] bg-light transform transition-transform duration-300 border
        ${isMobileMenuOpen ? 'translate-x-0  w-3/4 ' : 'translate-x-full '}
        ${closeSideBar ? 'md:translate-x-full md:w-0 border-0' : 'md:translate-x-0 md:w-1/4'}
        fixed top-14 right-0 z-40 md:static shadow-sm md:block `}
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
                    <div className="container mt-3">
                        <h1>Section Summary</h1>
                        <hr className="m-2" />
                        <div className="w-full flex items-center justify-center space-x-4 p-2 bg-[#3476bb]">
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
                        <div className="d-flex justify-content-between p-1">
                            <h1>Mark</h1>
                            <h1>{examData?.section[currentSectionIndex]?.s_score}</h1>
                        </div>
                        <div className="d-flex justify-content-between p-1">
                            <h1>Attempted</h1>
                            <h1>{examData?.section[currentSectionIndex]?.Attempted}</h1>
                        </div>
                        <div className="d-flex justify-content-between p-1">
                            <h1>Correct</h1>
                            <h1>{examData?.section[currentSectionIndex]?.correct}</h1>
                        </div>
                        <div className="d-flex justify-content-between p-1">
                            <h1>InCorrect</h1>
                            <h1>{examData?.section[currentSectionIndex]?.incorrect}</h1>
                        </div>




                        <div className="d-flex flex-wrap gap-2 px-1 py-2 text-center justify-center">
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
                                    } else if (currentQuestion?.isVisited == 1 && currentQuestion?.selectedOption == null) {
                                        className = "skipImg";
                                    }
                                    else if (answer !== currentQuestion.selectedOption && currentQuestion?.NotVisited == 0) {
                                        className = "notansImg"; // Wrong answer
                                    }


                                    else {
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

                                                setCheck(null);
                                                setIsClicked(false);

                                            }}
                                            className={`fw-bold flex align-items-center justify-content-center ${className}`}
                                        >
                                            {actualQuestionNumber}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        {/* 
                        <div className="mt-3 bg-gray-100">
                            <div className="container mt-3">
                                <div className="row align-items-center">
                                    <div className="col-6">
                                        <div className="smanswerImg  text-white fw-bold flex align-items-center justify-content-center">{resultData?.correct}</div>
                                        <p>Correct</p>
                                    </div>
                                    <div className="col-6">
                                        <div className="smnotansImg  text-white fw-bold flex align-items-center justify-content-center">{resultData?.incorrect}</div>
                                        <p>Wrong</p>
                                    </div>
                                </div>
                            </div>

                            <div className="container mt-3">
                                <div className="row align-items-center">
                                    <div className="col-6">
                                        <div className="smnotVisitImg  text-black fw-bold flex align-items-center justify-content-center">{resultData?.unseen}</div>
                                        <p>Unseen</p>
                                    </div>
                                    <div className="col-6">
                                        <div className="smskipimg  text-white fw-bold flex align-items-center justify-content-center">{resultData.skipped}</div>
                                        <p>Skipped</p>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>


            {/* Footer Buttons */}
            <div className="fixed bottom-0 w-full bg-white px-6 py-1 border-t border-slate-200 z-[60] shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* Previous Button */}
                    <button
                        className="flex items-center gap-2 px-3 py-1 text-sm font-bold text-slate-400 uppercase  tracking-widest hover:text-slate-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        onClick={handlePreviousClick}
                        disabled={clickedQuestionIndex === startingIndex}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                        </svg>
                        PREVIOUS
                    </button>

                    {/* Next Button */}
                    <button
                        onClick={handleNextClick}
                        className="flex items-center gap-3 px-3 py-2.5 bg-[#3476bb] text-white text-sm font-black uppercase tracking-widest rounded-lg hover:bg-[#2a5e95] transition-all active:scale-95 shadow-lg shadow-blue-100 disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed"
                    >
                        {isLastQuestion && isLastSection ? "BACK TO RESULT" : "NEXT QUESTION"}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7-7 7M3 12h18" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PdfExamSolution;
