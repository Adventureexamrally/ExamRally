import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Rally_bro from "./Rally_pro";
import Rallysuper_Pro from "./Rallysuper_Pro";
import Examimglist from "./Examimglist";
import { ThreeDots } from "react-loader-spinner";

const data = {
  name: "Moct test Start Now!!",
  topic: "",
  questions: [
    { id: 1, difficulty: "Easy", ques: "10", marks: 5, time: "30 sec" },
    { id: 2, difficulty: "Moderate", ques: "10", marks: 5, time: "30 sec" },
    { id: 3, difficulty: "Difficult", ques: "10", marks: 5, time: "30 sec" },
    { id: 4, difficulty: "Moderate", ques: "10", marks: 5, time: "30 sec" },
    { id: 5, difficulty: "Easy", ques: "10", marks: 5, time: "30 sec" },
    { id: 6, difficulty: "Difficult", ques: "10", marks: 5, time: "30 sec" },
    { id: 7, difficulty: "Easy", ques: "10", marks: 5, time: "30 sec" },
    { id: 8, difficulty: "Moderate", ques: "10", marks: 5, time: "30 sec" },
    { id: 9, difficulty: "Difficult", ques: "10", marks: 5, time: "30 sec" },
    { id: 10, difficulty: "Easy", ques: "10", marks: 5, time: "30 sec" },
  ],
};

function TestSeries() {
  // State to track the visibility of difficulty for each question
  const [showDifficulty, setShowDifficulty] = useState(
    data.questions.reduce((acc, question) => {
      acc[question.id] = false; // initially difficulty is hidden
      return acc;
    }, {})
  );

  // Toggle function to show/hide difficulty
  const toggleDifficulty = (questionId) => {
    setShowDifficulty((prevState) => ({
      ...prevState,
      [questionId]: !prevState[questionId], // toggle the visibility
    }));
  };

 
  const openNewWindow = (url) => {
    const width = screen.width;
    const height = screen.height;
    window.open(url, "_blank", `noopener,noreferrer,width=${width},height=${height}`);
  };

 const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setLoading(false);
    },500);
  }, []);

  
  return (
<>
<div className="container mt-4">
<div className="row">
        <div className="col-md-6">
          <Rally_bro />
        </div>
        <div className="col-md-6">
          <Rallysuper_Pro />
        </div>
      </div>
  {loading ? (
    <div className="container">
      <p className="placeholder-glow bg-gray-200">
        <span className="placeholder col-12 text-center text-2xl font-bold mt-2 font text-white"></span>
      </p>
      <div className="row">
        <div className="col-md-6">
          <div className="p-4 border rounded shadow bg-gray-200">
            <p className="placeholder-glow">
              <span className="placeholder col-12 mb-2"></span>
              <span className="placeholder col-12 mb-2"></span>
              <span className="placeholder col-12 mb-2"></span>
              <span className="placeholder col-12 mb-2"></span>
              <span className="placeholder col-6 mx-auto"></span>
            </p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="p-4 border rounded shadow bg-gray-200">
            <p className="placeholder-glow">
              <span className="placeholder col-12 mb-2"></span>
              <span className="placeholder col-12 mb-2"></span>
              <span className="placeholder col-12 mb-2"></span>
              <span className="placeholder col-12 mb-2"></span>
              <span className="placeholder col-6 mx-auto"></span>
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4 rounded-lg shadow-lg">
        {[1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className="bg-gray-200 border-1 shadow-xl rounded-lg p-4 flex flex-col justify-between relative mt-4 transform transition-all duration-300 ease-in-out border-gray-500 hover:scale-105"
          >
            <p className="placeholder-glow">
              <span className="placeholder col-8 mb-2 mx-auto"></span>
              <span className="placeholder col-6 mb-2 mx-auto"></span>
              <span className="placeholder col-6 mb-2 mx-auto"></span>
              <span className="placeholder col-12 mb-2"></span>
              <span className="placeholder col-12"></span>
            </p>
          </div>
        ))}
      </div>
      <div className="p-4 border rounded shadow mt-4 bg-gray-200">
        <p className="placeholder-glow">
          <span className="placeholder col-12 mb-2"></span>
          <span className="placeholder col-12 mb-2"></span>
          <span className="placeholder col-12 mb-2"></span>
          <span className="placeholder col-12 mb-2"></span>
          <span className="placeholder col-6 mx-auto"></span>
        </p>
      </div>
    </div>
  ) : ( 
    <div className="container">
      <div className="text-center text-2xl font-bold mt-2 font bg-green-500 text-white">
        Most Accurate & Best Online Test Series for Bank Exams – Full-Length &amp;
        Topic-Wise Mock Tests
      </div>
    
      <Examimglist />
    </div>
  )} 
</div>
    </>
  );
}

export default TestSeries;
