import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    nextQuestion,
    prevQuestion,
    selectOption,
    markVisited,
    submitTest,
    updateTime,
} from "./slice/testSlice";
import questions from "./data/questions"; // Assuming questions are stored locally
import { fetchQuestions } from "./slice/questionSlice";

const Test_redux = () => {
    const dispatch = useDispatch();
    const { questions, loading, error } = useSelector((state) => state.questions);

    const { currentQuestionIndex, selectedOptions, visitedQuestions, isSubmitted, timeLeft } = useSelector((state) => state.test);

    const currentQuestion = questions[currentQuestionIndex] || {};

    // Mark question as visited
   useEffect(() => {
    if (!visitedQuestions.includes(currentQuestionIndex)) {
        dispatch(markVisited(currentQuestionIndex));
    }
}, [currentQuestionIndex, visitedQuestions, dispatch]);

useEffect(() => {
        dispatch(fetchQuestions());
    }, [dispatch]);
    // Timer Logic
    useEffect(() => {
        if (timeLeft === 0) {
            dispatch(submitTest());
        }
        const timer = setInterval(() => {
            dispatch(updateTime());
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, dispatch]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };
    if (loading) return <h3>Loading questions...</h3>;
    if (error) return <h3 style={{ color: "red" }}>Error: {error}</h3>;
    return (
        <div className="bg-gray-100 min-h-screen flex flex-row-reverse">
            {/* Sidebar */}
            <div className="w-1/4 bg-white shadow-md p-4">
                <h2 className="text-lg font-semibold mb-4">Test Status</h2>
                <p>
                    <span className="font-bold">Visited:</span> {visitedQuestions.length}/{questions.length}
                </p>
                <p>
                    <span className="font-bold">Answered:</span> {Object.keys(selectedOptions).length}/{questions.length}
                </p>
                <p>
                    <span className="font-bold">Unanswered:</span> {questions.length - Object.keys(selectedOptions).length}
                </p>
                <div className="mt-4">
                    <h3 className="text-md font-bold">Questions:</h3>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                        {questions.map((_, index) => {
                            let buttonClass = "px-3 py-2 text-xs font-bold rounded";

                            if (selectedOptions[index] !== undefined) {
                                buttonClass += " bg-green-300 text-white text-center"; // Answered
                            } else if (visitedQuestions.includes(index)) {
                                buttonClass += " bg-red-500 text-black text-center"; // Visited
                            } else {
                                buttonClass += " bg-gray-200 text-black text-center"; // Not visited
                            }

                            return (
                                <span
                                    key={index}
                                    onClick={() => dispatch(markVisited(index))}
                                    className={buttonClass}
                                >
                                    {index + 1}
                                </span>
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
                                        onClick={() => dispatch(selectOption({ questionIndex: currentQuestionIndex, optionIndex: index }))}
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
                                    onClick={() => dispatch(prevQuestion())}
                                    disabled={currentQuestionIndex === 0}
                                    className="px-4 py-2 bg-gray-300 text-gray-600 cursor-not-allowed rounded-lg"
                                >
                                    Previous
                                </button>
                                {currentQuestionIndex < questions.length - 1 ? (
                                    <button
                                        onClick={() => dispatch(nextQuestion())}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => dispatch(submitTest())}
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
                    </div>
                )}
            </div>
        </div>
    );
};

export default Test_redux;
