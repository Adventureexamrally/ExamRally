import React, { useState, useEffect } from "react";
import axios from "axios";
import Countdown from "react-countdown";
import { useParams, useNavigate } from "react-router-dom";

const Exam = () => {
  const { examId, examResultId } = useParams();
  const navigate = useNavigate();
  const [examData, setExamData] = useState({
    name: "",
    duration: 0,
    endTime: null,
    questions: [], // Initialize questions as an empty array
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch exam data
    const fetchExamData = async () => {
      try {
        // const response = await axios.get(`/api/exams/${examId}/start`);
        setExamData({
            "name": "Sample Exam",
            "duration": 60, // Duration in minutes
            "endTime": "2023-12-31T23:59:59", // End time for the exam
            "questions": [
              {
                "id": 1,
                "text": "What is the capital of France?",
                "options": ["Paris", "London", "Berlin", "Madrid"],
                "correctAnswer": "Paris"
              },
              {
                "id": 2,
                "text": "Which planet is known as the Red Planet?",
                "options": ["Earth", "Mars", "Jupiter", "Saturn"],
                "correctAnswer": "Mars"
              },
              {
                "id": 3,
                "text": "What is 2 + 2?",
                "options": ["3", "4", "5", "6"],
                "correctAnswer": "4"
              },
              {
                "id": 4,
                "text": "Who wrote 'To Kill a Mockingbird'?",
                "options": ["Harper Lee", "Mark Twain", "J.K. Rowling", "Ernest Hemingway"],
                "correctAnswer": "Harper Lee"
              },
              {
                "id": 5,
                "text": "What is the largest ocean on Earth?",
                "options": ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
                "correctAnswer": "Pacific Ocean"
              }
            ]
          });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching exam data:", error);
      }
    };

    fetchExamData();
  }, [examId]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < examData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitExam = async () => {
    try {
      await axios.post(`/api/exams/${examId}/finish`, { answers });
      navigate(`/exam-result/${examResultId}`);
    } catch (error) {
      console.error("Error submitting exam:", error);
    }
  };

  // Ensure examData and questions are loaded before rendering
  if (loading || !examData || !examData.questions) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Get the current question data safely
  const currentQuestionData = examData.questions[currentQuestion] || {};

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Exam Header */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{examData.name}</h1>
        <div className="mt-4">
          <Countdown
            date={examData.endTime}
            onComplete={handleSubmitExam}
            renderer={({ hours, minutes, seconds }) => (
              <div className="text-lg text-gray-700">
                Time Remaining: {hours}h {minutes}m {seconds}s
              </div>
            )}
          />
        </div>
      </div>

      {/* Question Panel */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Question {currentQuestion + 1}
        </h2>
        <div className="text-gray-700 mb-6">
          {currentQuestionData.text || "No question text available."}
        </div>
        <div className="space-y-3">
          {currentQuestionData.options?.map((option, index) => (
            <div key={index} className="flex items-center">
              <input
                type="radio"
                name="answer"
                value={option}
                checked={answers[currentQuestion] === option}
                onChange={() => handleAnswerChange(currentQuestion, option)}
                className="mr-2"
              />
              <span className="text-gray-700">{option}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mb-6">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestion === 0}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={handleNextQuestion}
          disabled={currentQuestion === examData.questions.length - 1}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      {/* Question Palette */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Question Palette</h3>
        <div className="grid grid-cols-5 gap-2">
          {examData.questions.map((question, index) => (
            <button
              key={index}
              className={`p-2 rounded-lg text-center ${
                answers[index]
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setCurrentQuestion(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button
          onClick={handleSubmitExam}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
        >
          Submit Exam
        </button>
      </div>
    </div>
  );
};

export default Exam;