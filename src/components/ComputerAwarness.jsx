import React from "react";
import compuimg from "../assets/images/computerawarness.png";
import ComputerIcon from "@mui/icons-material/Computer";

// Array of topics with icons
const topics = [
  { name: "Computer History & Inventions", icon: "bi-lightbulb" },
  { name: "Input & Output Devices", icon: "bi-laptop" },
  { name: "Components & Storage Devices", icon: "bi-hdd" },
  { name: "Programming Languages", icon: "bi-code" },
  { name: "Microsoft Windows & MS Office", icon: "bi-windows" },
  { name: "MS Word, PowerPoint & Excel", icon: "bi-file-earmark-text" },
  {
    name: "File Extensions & Keyboard Shortcuts",
    icon: "bi-file-earmark-code",
  },
  { name: "Networking & Internet", icon: "bi-router" },
  { name: "Cybersecurity & Computer Viruses", icon: "bi-shield-lock" },
  { name: "Database & RDBMS Basics", icon: "bi-database" },
  { name: "Logic Gates & Digital Circuits", icon: "bi-puzzle" },
  { name: "Data Communication & Networking", icon: "bi-cloud" },
];

const ComputerAwareness = () => {
  return (
    <div className="container py-5">
       <h1 className="p-2 text-green-500 text-center fw-bold">
        {" "}
        <ComputerIcon fontSize="large" className="text-green-500" />{" "}
        Computer Awarness
      </h1>
      <div className="row mt-4">
        {/* Left Side: Image */}
        <div className="col-md-6">
          <img
            src={compuimg}
            alt="Computer Awareness"
            className="img-fluid rounded shadow"
          />
        </div>

        {/* Right Side: Content */}
        <div className="col-md-6 mt-4 font fw-bold">
          <h2>
            <span className="text-green font-weight-bold">
              {" "}
              Computer Awareness
            </span>
            is a crucial section in{" "}
            <span className="text-green font-weight-bold">
              IBPS, SBI, RBI, and other bank exams,
            </span>{" "}
            testing candidates on{" "}
            <span className="text-green font-weight-bold">
              {" "}
              basic computer knowledge helpful for banking{" "}
            </span>
            . To help aspirants excel,{" "}
            <span className="text-green font-weight-bold">Examrally</span>{" "}
            presents{" "}
            <span className="text-green font-weight-bold">
              Topic-Wise Mock Tests
            </span>
            , covering all important topics based on the{" "}
            <span className="text-green font-weight-bold">
              {" "}
              latest exam trends
            </span>
            . These tests ensure that you get{" "}
            <span className="text-green font-weight-bold">
              complete exam-oriented practice
            </span>{" "}
            with a real{" "}
            <span className="text-green font-weight-bold">
              {" "}
              exam-like interface{" "}
            </span>{" "}
            and{" "}
            <span className="text-green font-weight-bold">
              {" "}
              detailed explanations{" "}
            </span>{" "}
            for better understanding.
          </h2>

          <h3 className="mt-3">
            Our structured{" "}
            <span className="text-green font-weight-bold">
              topic-wise tests
            </span>{" "}
            cover everything from  <span className="text-green font-weight-bold">computer fundamentals to networking, MS
            Office, databases etc..</span>,. Questions are categorized into  <span className="text-green font-weight-bold">different
            difficulty levels</span>—Easy, Moderate, and Difficult—helping you <span className="text-green font-weight-bold"> build
            knowledge progressively</span>. The  <span className="text-green font-weight-bold">detailed performance tracking</span> after
            each test highlights your  <span className="text-green font-weight-bold">strengths and weaknesses</span>, enabling focused
            improvement.
          </h3>
        </div>
      </div>

      {/* Topics List */}
      <div className="mt-4">
        <div className="row">
          {topics.map((topic, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="card shadow">
                <div className="card-body text-center">
                  <i
                    className={`bi ${topic.icon} display-4`}
                    style={{ fontSize: "40px" }}
                  ></i>
                  <h5 className="card-title mt-3 text-green-500 fw-bold">{topic.name}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComputerAwareness;
