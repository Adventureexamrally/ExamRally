import React from "react";
import abilityimg from '../assets/images/ability.png';
import PsychologyIcon from "@mui/icons-material/Psychology";


const topics = [
  { name: "Linear Arrangement", icon: <i className="bi bi-arrow-down-up" /> }, // Linear arrangement icon
  { name: "Circular Arrangement", icon: <i className="bi bi-arrow-repeat" /> }, // Circular arrangement icon
  { name: "Parallel Row Arrangement", icon: <i className="bi bi-grid-3x3-gap" /> }, // Grid icon for arrangement
  { name: "Square Arrangement", icon: <i className="bi bi-square" /> }, // Square icon
  { name: "Unknown Linear Arrangement", icon: <i className="bi bi-question-circle" /> }, // Question circle for unknown
  { name: "Box Puzzle", icon: <i className="bi bi-box" /> }, // Box icon
  { name: "Floor Puzzle", icon: <i className="bi bi-house-door" /> }, // House door icon for floor puzzle
  { name: "Floor and Flat Puzzle", icon: <i className="bi bi-house" /> }, // House icon
  { name: "Day Puzzle", icon: <i className="bi bi-sun" /> }, // Sun icon for day puzzle
  { name: "Year Puzzle", icon: <i className="bi bi-calendar" /> }, // Calendar icon for year puzzle
  { name: "Sequence Puzzle", icon: <i className="bi bi-list-ol" /> }, // List icon for sequence puzzle
  { name: "Designation Puzzle", icon: <i className="bi bi-person-badge" /> }, // Person badge icon
  { name: "Table Puzzle", icon: <i className="bi bi-table" /> }, // Table icon
  { name: "Syllogism", icon: <i className="bi bi-people" /> }, // People icon for syllogism
  { name: "Inequality", icon: <i className="bi bi-slash-square" /> }, // Slash square icon
  { name: "Blood relation", icon: <i className="bi bi-heart" /> }, // Heart icon for blood relations
  { name: "Coding and decoding", icon: <i className="bi bi-code" /> }, // Code icon
  { name: "Order and ranking", icon: <i className="bi bi-sort-alpha-down" /> }, // Sort icon for order/ranking
  { name: "Miscellaneous", icon: <i className="bi bi-list" /> }, // List icon for miscellaneous
  { name: "Direction Sense", icon: <i className="bi bi-compass" /> }, // Compass icon
  { name: "Number series", icon: <i className="bi bi-calculator" /> }, // Calculator icon for number series
  { name: "Alphabet Series", icon: <i className="bi bi-fonts" /> }, // Fonts icon for alphabet series
  { name: "Alphanumeric Series", icon: <i className="bi bi-type" /> }, // Type icon for alphanumeric
  { name: "Input Output", icon: <i className="bi bi-arrow-left-right" /> }, // Arrow for input/output
  { name: "Data Sufficiency", icon: <i className="bi bi-check-circle" /> } // Check circle for data sufficiency
];

const ReasoningAbility = () => {
  return (
    <div className="container py-5">
      <h1 className="text-center fw-bold font display-6 text-green-500">
      <PsychologyIcon fontSize="large" className="text-green-600 me-2 fs-1 " />
      Reasoning Ability:
      </h1>
      <p className="fs-5 mb-4 font">
        Reasoning Ability is a <span className="text-green font-weight-bold">scoring yet challenging section</span> in <span className="text-green font-weight-bold">IBPS, SBI, 
        RBI, and other bank exams</span>, requiring logical thinking, pattern recognition, 
        and quick decision-making. To help aspirants master this section, <span className="text-green font-weight-bold">Examrally</span> presents <span className="text-green font-weight-bold">Topic-Wise Mock Tests</span>, covering all important reasoning topics, 
        models, and difficulty levels that frequently appear in <span className="text-green font-weight-bold">Prelims and Mains</span>. 
        These tests are designed as per the <span className="text-green font-weight-bold">latest exam trends</span>, ensuring that you 
        practice <span className="text-green font-weight-bold">exam-oriented questions</span> in a <span className="text-green font-weight-bold">real test-like interface</span>.
      </p>

      <div className="row align-items-center">
        {/* Left Side: Image */}
        <div className="col-md-6">
          <img
            src={abilityimg}
            alt="Reasoning Ability"
            className="img-fluid rounded shadow"
          />
        </div>

        {/* Right Side: Content */}
        <div className="col-md-6">
          <p className="fs-5 mb-4 font">
            With <span className="text-green font-weight-bold">complete topic and sub-topic coverage</span>, our tests include <span className="text-green font-weight-bold">puzzles, 
            seating arrangement, syllogism, inequalities, blood relations, coding-decoding, 
            and more</span>. Each test is structured with <span className="text-green font-weight-bold">different difficulty levels</span>—Easy, 
            Moderate, and Difficult—so that you can <span className="text-green font-weight-bold">build problem-solving speed step by 
            step</span>. The <span className="text-green font-weight-bold">step-by-step solutions</span> help you understand the best logical approaches, 
            improving your accuracy and time management.
          </p>

          <p className="fs-5 font">
            What makes <span className="text-green font-weight-bold">Examrally’s Reasoning Ability Mock Tests</span> unique is the <span className="text-green font-weight-bold">detailed 
            performance tracking</span> after each test. This feature helps you <span className="text-green font-weight-bold">analyze weak areas, 
            identify mistakes, and refine your strategies</span> for better accuracy. Whether you 
            struggle with <span className="text-green font-weight-bold">complex puzzles or tricky logical reasoning questions</span>, our 
            topic-wise tests ensure that you gain <span className="text-green font-weight-bold">confidence and mastery</span> in every concept 
            before the actual exam.
          </p>
        </div>
      </div>
      <h1 className="text-green font-weight-bold mt-5 text-center">Start your Mock Tests and take your bank exam preparation to the next level!</h1>

      {/* Displaying the topics in Bootstrap cards */}
      <div className="row mt-4">
        {topics.map((topic, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div className="card shadow-lg">
              <div className="card-body d-flex align-items-center">
                <div className="me-3" style={{ fontSize: "2rem" }}>
                  {topic.icon}
                </div>
                <h5 className="card-title text-green-500 font fw-bold">{topic.name}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ReasoningAbility;
