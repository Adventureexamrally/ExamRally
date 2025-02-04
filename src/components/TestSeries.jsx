import react from "react";

const data = {
  name: "Moct test Start Now!!",
  topic: "-Contact...",
  questions: [
    { id: 1, difficulty: "Easy", ques: "10", marks: 5, time: "30 seconds" },
    { id: 2, difficulty: "Moderate", ques: "10", marks: 5, time: "30 seconds" },
    { id: 3, difficulty: "Difficult", ques: "10", marks: 5, time: "30 seconds" },
    { id: 4, difficulty: "Moderate", ques: "10", marks: 5, time: "30 seconds" },
    { id: 5, difficulty: "Easy", ques: "10", marks: 5, time: "30 seconds" },
    { id: 6, difficulty: "Difficult", ques: "10", marks: 5, time: "30 seconds" },
    { id: 7, difficulty: "Easy", ques: "10", marks: 5, time: "30 seconds" },
    { id: 8, difficulty: "Moderate", ques: "10", marks: 5, time: "30 seconds" },
    { id: 9, difficulty: "Difficult", ques: "10", marks: 5, time: "30 seconds" },
    { id: 10, difficulty: "Easy", ques: "10", marks: 5, time: "30 seconds" },
  ],
};

function TestSeries() {
    return (
      <div className="mx-auto">
        <div className=" from-indigo-300 to-teal-400">
        <marquee className="text-3xl font-semibold mb-2 text-white  bg-green-400 py-2 px-4 mt-2">
  {data.name}
</marquee>

          {/* <h2 className="text-xl text-black mb-10">{data.topic}</h2> */}
  
          <div className="bg-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4 rounded-lg shadow-lg">
            {data.questions.map((question) => (
        <div
        key={question.id}
        className={`bg-white border-1 shadow-xl rounded-lg p-2 flex flex-col justify-between relative mt-4 transform transition-all duration-300 ease-in-out border-gray-500 hover:scale-105 ${question.id === 1 ? "bg-green-100" : ""}`} // Apply green background to the card for question.id === 1
      >
        <div className="absolute top-[-12px] right-[-12px] bg-green-500 text-white text-xs font-bold rounded-full px-3 py-1">
          {question.id}
        </div>
        <p className="mt-1 text-center text-gray-700">Topic : </p>
      
        <h3 className="text-2xl font-bold text-center text-gray-900 mt-1">Question {question.id}</h3>
        <div>
          <div
            className={`mt-4 text-sm px-2 py-1 text-center text-white ${
              question.difficulty === "Easy"
                ? "bg-green-400"
                : question.difficulty === "Moderate"
                ? "bg-yellow-400"
                : "bg-red-400"
            }`}
          >
            <p>
              <strong>{question.difficulty}</strong>
            </p>
          </div>
      
          <div className="flex justify-center items-center gap-4">
            <div className="flex flex-col items-center">
              <p>Question</p>
              <p>{question.ques}</p>
            </div>
            <div className="flex flex-col items-center">
              <p>Mark</p>
              <p>{question.marks}</p>
            </div>
            <div className="flex flex-col items-center">
              <p>Time</p>
              <p>{question.time}</p>
            </div>
          </div>
        </div>
      
        <div className="mt-2 flex justify-center">
          {/* Button with dynamic color */}
          <button
            className={`py-1 px-1 rounded ${question.id === 1 ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"} text-white`}
          >
            {question.id === 1 ? "Start" : "Buy Now"}
          </button>
        </div>
      </div>
      
            ))}
          </div>
        </div>
      </div>
    );
  }
  

export default TestSeries;
