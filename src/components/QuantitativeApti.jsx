import { useState, useEffect } from "react";
import CalculateIcon from "@mui/icons-material/Calculate";
import quantitativeimg from "../assets/images/quantitativeimg.png";

const topics = [
  {
    name: "Simplification",
    questions: [
      { id: 1, text: "What is the simplified value of 15 + 30?" },
      { id: 2, text: "Simplify the expression: 5 * 6 - 10" },
    ],
  },
  {
    name: "Approximation",
    questions: [
      { id: 1, text: "Approximate the value of 23.89 to the nearest ten." },
      { id: 2, text: "What is the approximate value of 8.43 * 7.1?" },
    ],
  },
  {
    name: "Missing Number series",
    questions: [
      { id: 1, text: "Find the missing number: 5, 10, __, 20, 25" },
      { id: 2, text: "Fill in the blank: 12, 24, 48, __, 192" },
    ],
  },
  {
    name: "Wrong Number series",
    questions: [
      { id: 1, text: "Identify the wrong number: 2, 4, 8, 16, 30" },
      { id: 2, text: "Which number does not belong? 10, 15, 20, 22, 30" },
    ],
  },
  {
    name: "Quadratic Equation",
    questions: [
      { id: 1, text: "Solve the quadratic equation: x² - 5x + 6 = 0" },
      { id: 2, text: "Find the roots of: x² + 3x - 4 = 0" },
    ],
  },
  { name: "Number System" },
  { name: "Percentage" },
  { name: "Profit and Loss" },
  { name: "Time, Speed and Distance" },
  { name: "Time and Work" },
  { name: "Average" },
  { name: "Ratio and Proportion" },
  { name: "Mixture and Allegation" },
  { name: "Simple Interest" },
  { name: "Compound Interest" },
  { name: "Ages" },
  { name: "Probability" },
  { name: "Mensuration" },
  { name: "Trains" },
  { name: "Boat and Stream" },
  { name: "Data Sufficiency" },
  { name: "Pie Chart" },
  { name: "Bar Graph" },
  { name: "Line Graph" },
  { name: "Table DI" },
  { name: "Missing Table DI" },
  { name: "Radar Graph" },
  { name: "Caselet" },
  // Add other topics here...
];

const QuantiativeApti = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
  };
const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);
  return (
    <>
    {loading ? (
  <>
    <div className="container">
      <h1 className="p-2 text-green-500 text-center fw-bold">
        <CalculateIcon fontSize="large" className="text-green-500" />
        <span className="placeholder-glow">
          <span className="placeholder col-4 mx-auto"></span>
        </span>
      </h1>
      <div className="row">
        <div className="col-md-6">
          <div className="bg-gray-200 h-[200px]"></div>
        </div>
        <div className="col-md-6">
          <p className="font">
            <span className="placeholder-glow">
              <span className="placeholder col-12 mb-2"></span>
              <span className="placeholder col-12 mb-2"></span>
              <span className="placeholder col-8 mb-2"></span>
              <span className="placeholder col-10 mb-2"></span>
              <span className="placeholder col-6 mb-2"></span>
            </span>
          </p>
          <br />
          <p className="font">
            <span className="placeholder-glow">
              <span className="placeholder col-12 mb-2"></span>
              <span className="placeholder col-10 mb-2"></span>
              <span className="placeholder col-8 mb-2"></span>
              <span className="placeholder col-6 mb-2"></span>
              <span className="placeholder col-12 mb-2"></span>
            </span>
          </p>
        </div>
      </div>
    </div>

    <div className="container-fluid d-flex flex-column flex-md-row">
      <div className="col-12 col-md-4 p-3 bg-light sticky-top overflow-auto max-h-[50vh] scrollbar-hide">
        <h1 className="p-2 text-green-500 text-center fw-bold">
          <CalculateIcon fontSize="large" className="text-green-500" />
          <span className="placeholder-glow">
            <span className="placeholder col-4 mx-auto"></span>
          </span>
        </h1>
        <div className="list-group">
          {[1, 2, 3, 4, 5].map((index) => (
            <div
              key={index}
              className="list-group-item d-flex align-items-center mb-2"
            >
              <div
                style={{ fontSize: '1.5rem' }}
                className="mr-3 bg-gray-200 w-8 h-8 rounded-full"
              ></div>
              <span className="placeholder-glow">
                <span className="placeholder col-8"></span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="col-12 col-md-9 p-4">
        <h3 className="text-center mb-4 fw-bold">
          <span className="placeholder-glow">
            <span className="placeholder col-4 mx-auto"></span>
          </span>
        </h3>
        <div className="text-center">
          <p>
            <span className="placeholder-glow">
              <span className="placeholder col-6 mx-auto"></span>
            </span>
          </p>
        </div>
      </div>
    </div>
  </>
) : (
  <>
    <div className="container">
      <h1 className="p-2 text-green-500 text-center fw-bold">
        <CalculateIcon fontSize="large" className="text-green-500" /> Quantitative Aptitude
      </h1>
      <div className="row">
        <div className="col-md-6">
          <img src={quantitativeimg} alt="quantitative" className="img-fluid" />
        </div>
        <div className="col-md-6">
          <p className="font">
            <span className="text-green font-weight-bold">
              Cracking bank exams
            </span>{' '}
            requires
            <span className="text-green font-weight-bold">
              &nbsp;speed, accuracy, and a strong conceptual foundation in{' '}
            </span>
            <span className="text-green font-weight-bold">
              Quantitative Aptitude
            </span>
            . To help aspirants excel, <span className="text-green font-weight-bold"> Examrally </span>
            brings you <span className="text-green font-weight-bold"> Topic-Wise Mock Tests </span>, designed to match the latest patterns of <span className="text-green font-weight-bold"> IBPS, SBI, RBI, and other banking exams </span>. These tests cover <span className="text-green font-weight-bold"> all question types, difficulty levels, and models </span>, ensuring that you get the most <span className="text-green font-weight-bold"> exam-oriented practice </span> available. Each test follows the <span className="text-green font-weight-bold"> latest trends </span>, offering a <span className="text-green font-weight-bold"> real exam-like interface </span> with <span className="text-green font-weight-bold"> step-by-step solutions </span> to help you master the best shortcut tricks and traditional methods. <span className="text-green font-weight-bold"> With complete topic-wise and sub-topic-wise coverage </span>, these tests are structured to <span className="text-green font-weight-bold"> gradually build your accuracy and confidence </span>. Whether you are solving <span className="text-green font-weight-bold">simplification, number series, data interpretation, or advanced arithmetic </span>, you will find tests categorized into <span className="text-green font-weight-bold"> different difficulty levels</span>—Easy, Moderate, and Difficult—so you can improve step by step.
          </p>
          <br />
          <p className="font">
            What sets Examrally’s
            <span className="text-green font-weight-bold">
              Quantitative Aptitude Mock Tests
            </span>
            apart is the <span className="text-green font-weight-bold">detailed performance tracking </span>that highlights your strengths and weaknesses after each test. This helps you <span className="text-green font-weight-bold"> identify weak areas and improve topic-wise accuracy effectively</span>. By practicing with <span className="text-green font-weight-bold"> real exam-level questions </span>, you enhance both <span className="text-green font-weight-bold">speed and problem-solving skills </span>, giving you an edge over the competition. Whether you’re preparing for <span className="text-green font-weight-bold">Prelims or Mains </span>, these tests ensure you’re <span className="text-green font-weight-bold"> exam-ready with the right strategies and techniques </span>.
          </p>
        </div>
      </div>
    </div>

    <div className="container-fluid d-flex flex-column flex-md-row">
      <div className="col-12 col-md-4 p-3 bg-light sticky-top overflow-auto max-h-[50vh] scrollbar-hide">
        <h1 className="p-2 text-green-500 text-center fw-bold">
          <CalculateIcon fontSize="large" className="text-green-500" /> Quantitative Aptitude
        </h1>
        <div className="list-group">
          {topics.map((topic, index) => (
            <button
              key={index}
              className={`list-group-item d-flex align-items-center mb-2 transition ${selectedTopic?.name === topic.name ? 'bg-green-500 text-white font-extrabold rounded-lg shadow-lg shadow-green-200 scale-105' : ''}`}
              onClick={() => handleTopicClick(topic)}
            >
              <div style={{ fontSize: '1.5rem' }} className="mr-3">{topic.icon}</div>
              <span>{topic.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="col-12 col-md-9 p-4">
        <h3 className="text-center mb-4 fw-bold">Selected Topic</h3>
        {selectedTopic ? (
          <div>
            <h4 className="text-green-500 fw-bold text-center diplay-6 mb-2">{selectedTopic.name}</h4>
            <div className="row">
              {selectedTopic.questions.map((question, index) => (
                <div key={question.id} className="col-12 col-sm-6 col-md-3 mb-4">
                  <div className="card shadow-lg">
                    <div className="card-body">
                      <h5 className="card-title">Question {index + 1}</h5>
                      <p className="card-text">{question.text}</p>
                      <button className="card-text bg-green-500 px-5">Test</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p>Select a topic from the left sidebar to view content.</p>
          </div>
        )}
      </div>
    </div>
  </>
)}
    </>
  );
};

export default QuantiativeApti;
