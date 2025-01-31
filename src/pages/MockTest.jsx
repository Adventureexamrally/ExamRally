import React, { useState, useEffect } from "react";

const questions = [
    {
        id: 1,
        question: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        answer: 2,
    },
    {
        id: 2,
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Venus"],
        answer: 1,
    },
    {
        id: 3,
        question: "What is the largest mammal?",
        options: ["Elephant", "Blue Whale", "Giraffe", "Great White Shark"],
        answer: 1,
    },
    {
        id: 4,
        question: "Who wrote 'Hamlet'?",
        options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
        answer: 1,
    },
    {
        id: 5,
        question: "What is the speed of light?",
        options: ["300,000 km/s", "150,000 km/s", "120,000 km/s", "200,000 km/s"],
        answer: 0,
    },
];

const MockTest = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [visitedQuestions, setVisitedQuestions] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(3600); // 5 minutes in seconds

    const currentQuestion = questions[currentQuestionIndex] || {};

    useEffect(() => {
        if (!visitedQuestions.includes(currentQuestionIndex)) {
            setVisitedQuestions((prev) => [...prev, currentQuestionIndex]);
        }
    }, [currentQuestionIndex]);

    // Timer Logic
    useEffect(() => {
        if (timeLeft === 0) {
            handleSubmit();
        }
        const timer = setInterval(() => {
            setTimeLeft((prev) => Math.max(prev - 1,0));
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleOptionSelect = (optionIndex) => {
        setSelectedOptions({
            ...selectedOptions,
            [currentQuestionIndex]: optionIndex,
        });
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
    };

    const calculateScore = () => {
        return questions.reduce((score, question, index) => {
            if (selectedOptions[index] === question.answer) {
                return score + 1;
            }
            return score;
        }, 0);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    return (
        <div className="bg-gray-100 min-h-screen flex">
            {/* Sidebar */}
            <div className="w-1/4 bg-white shadow-md p-4">
                <h2 className="text-lg font-semibold mb-4">Test Status</h2>
                <p>
                    <span className="font-bold">Visited:</span> {visitedQuestions.length}/{questions.length}
                </p>
                <p>
                    <span className="font-bold">Answered:</span>{" "}
                    {Object.keys(selectedOptions).length}/{questions.length}
                </p>
                <p>
                    <span className="font-bold">Unanswered:</span>{" "}
                    {questions.length - Object.keys(selectedOptions).length}
                </p>
                <div className="mt-4">
                    <h3 className="text-md font-bold">Questions:</h3>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                        {questions.map((_, index) => {
                            // Base button class
                            let buttonClass = "px-3 py-2 text-xs font-bold rounded";

                            // Check if the question is answered
                            if (selectedOptions[index] !== undefined) {
                                buttonClass += " bg-green-300 text-white"; // Answered question
                            } else if (visitedQuestions.includes(index)) {
                                buttonClass += " bg-yellow-300 text-black"; // Visited but unanswered
                            } else {
                                buttonClass += " bg-gray-200 text-black"; // Not visited
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => setCurrentQuestionIndex(index)}
                                    className={buttonClass}
                                >
                                    {index + 1}
                                </button>
                            );
                        })}
                    </div>

                </div>
            </div>

            {/* Main Content */}
            <div className="w-3/4 bg-gray-100 p-6">
                {!isSubmitted ? (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-2xl font-bold">Mock Test</h1>
                            <div className="bg-gray-200 px-4 py-2 rounded text-lg">
                                Time Left: {formatTime(timeLeft)}
                            </div>
                        </div>
                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-lg font-semibold mb-4">
                                Question {currentQuestionIndex + 1}/{questions.length}
                            </h2>
                            <p className="text-gray-700">{currentQuestion.question || "Question not available"}</p>
                            <div className="mt-4 space-y-2">
                                {currentQuestion.options?.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleOptionSelect(index)}
                                        className={`block w-full text-left px-4 py-2 border rounded-lg ${selectedOptions[currentQuestionIndex] === index
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                            }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                            <div className="flex justify-between items-center mt-6">
                                <button
                                    onClick={handlePrevious}
                                    disabled={currentQuestionIndex === 0}
                                    className={`px-4 py-2 rounded-lg ${currentQuestionIndex === 0
                                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                            : "bg-blue-500 text-white hover:bg-blue-600"
                                        }`}
                                >
                                    Previous
                                </button>
                                {currentQuestionIndex < questions.length - 1 ? (
                                    <button
                                        onClick={handleNext}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSubmit}
                                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                    >
                                        Submit
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Test Completed!</h1>
                        <p className="text-lg">
                            Your score is{" "}
                            <span className="font-bold text-blue-500">
                                {calculateScore()}/{questions.length}
                            </span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MockTest;
