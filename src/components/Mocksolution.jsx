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

    const { id } = useParams();

    useEffect(() => {
        Api.get(`exams/getExam/67c5900a09a3bf8c7f605d71`)
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

    useEffect(() => {
        Api.get(`exams/getExam/${id}`) // Fetch the exam data from your API
            .then((res) => {
                // Transform the data to match your schema
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
                                Incorrect: 0,
                                answer: question.answer,
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

                // Now post the transformed data to your '/results' endpoint
                Api.post(
                    "/results/67c5900a09a3bf8c7f605d71/67c5900a09a3bf8c7f605d71",
                    transformedData
                )
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
            // If it's the last section, finish the test (call your handleSubmitTest function)
            submitExam();
        }
    };

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

        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
            2,
            "0"
        )}:${String(seconds).padStart(2, "0")}`;
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

    const submitExam = () => {
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

        setTotalTime(formattedTotalTime);

        const answersData = selectedOptions.map((selectedOption, index) => {
            const question =
                currentSection?.questions?.[selectedLanguage?.toLowerCase()]?.[index];
            const singleQuestionTime = formatTime(questionTimes[index] || 0);

            const optionsData = question?.options?.map((option, optionIndex) => ({
                option: option,
                index: optionIndex,
                isSelected: optionIndex === selectedOption,
                isCorrect: optionIndex === question?.answer,
            }));

            return {
                question: question?.question,
                options: optionsData,
                correct: question?.answer === selectedOption ? 1 : 0,
                explanation: question?.explanation,
                answer: question?.answer,
                selectedOption,
                isVisited: visitedQuestions?.includes(index) ? 1 : 0,
                q_on_time: singleQuestionTime,
            };
        });

        const totalScore = selectedOptions.reduce((total, option, index) => {
            const currentQuestion =
                currentSection?.questions?.[selectedLanguage?.toLowerCase()]?.[index];
            const plusmark = currentQuestion?.plus_mark || 1;
            const minusmark = currentQuestion?.minus_mark || 0.25;
            const scoreForThisQuestion =
                currentQuestion?.answer === option ? plusmark : -minusmark;
            return total + scoreForThisQuestion;
        }, 0);

        const formattedSections = examData.section.map((section) => ({
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
                english: section.questions.english.map((question, index) => ({
                    question: question?.question,
                    options: answersData[index]?.options || [],
                    correct: answersData[index]?.correct || 0,
                    explanation: question?.explanation || "",
                    selectedOption: answersData[index]?.selectedOption || null,
                    q_on_time: answersData[index]?.q_on_time || "0",
                    isVisited: answersData[index]?.isVisited || 0,
                })),
                hindi: section.questions.hindi.map((question, index) => ({
                    question: question?.question,
                    options: answersData[index]?.options || [],
                    correct: answersData[index]?.correct || 0,
                    explanation: question?.explanation || "",
                    selectedOption: answersData[index]?.selectedOption || null,
                    q_on_time: answersData[index]?.q_on_time || "0",
                    isVisited: answersData[index]?.isVisited || 0,
                })),
                tamil: section.questions.tamil.map((question, index) => ({
                    question: question?.question,
                    options: answersData[index]?.options || [],
                    correct: answersData[index]?.correct || 0,
                    explanation: question?.explanation || "",
                    selectedOption: answersData[index]?.selectedOption || null,
                    q_on_time: answersData[index]?.q_on_time || "0",
                    isVisited: answersData[index]?.isVisited || 0,
                })),
            },
            s_order: section.s_order || 0,
        }));
        console.log("Formatted Sections:", formattedSections);

        Api.put("results/67df97a5a39b42167ed8116f", {
            userId: "67df97a5a39b42167ed8116f",
            ExamId: "67df97a5a39b42167ed8116f",
            section: formattedSections,
            score: totalScore,
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
    };

    // Using useEffect to trigger submitExam when needed
    const [timeminus, settimeminus] = useState(0);
    useEffect(() => {
        const sectionTimeInSeconds =
            examData?.section[currentSectionIndex]?.t_time * 60; // Convert minutes to seconds
        settimeminus(sectionTimeInSeconds); // Reset time when the section changes
    }, [examData, currentSectionIndex]);

    useEffect(() => {
        if (timeminus > 0) {
            const timerInterval = setInterval(() => {
                settimeminus((prevTime) => {
                    const newTime = prevTime - 1;
                    return newTime;
                });
            }, 1000); // Update every second
            return () => clearInterval(timerInterval);
        } else {
            // Automatically call handleSubmitSection when time reaches 0
            handleSubmitSection();
        }
    }, [timeminus]); // Runs whenever timeminus changes

    // Trigger submission on timeLeft = 0 or when exam is submitted
    useEffect(() => {
        if (timeLeft <= 0) {
            submitExam();
        }
    }, [timeLeft]);

    const [sectionSummary, setSectionSummary] = useState(null);

    const showToast = () => {
        toast.success("Test Submitted");
        setShowModal(false);
    };

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
                        <h1>Section Summary</h1>
                        <hr className="m-2" />

                        <div className="d-flex justify-content-between p-1">
                            <h1>Mark</h1>
                            <h1>78</h1>
                        </div>
                        <div className="d-flex justify-content-between p-1">
                            <h1>Attempted</h1>
                            <h1>456</h1>
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
        </div>
    );
};

export default Mocksolution;
