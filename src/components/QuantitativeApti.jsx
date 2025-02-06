import React from "react";
import CalculateIcon from "@mui/icons-material/Calculate";
import {
  Calculate,
  PieChart,
  Equalizer,
  TrendingUp,
  Speed,
  AccessTime,
  AccountBalanceWallet,
  Money,
  Percent,
  TrendingFlat,
  Numbers,
  Gavel,
  Report,
  ImportExport,
  PersonAdd,
  HowToVote,
  Group,
  DonutSmall,
  BarChart,
  LineStyle,
  TableChart,
  Radar,
} from "@mui/icons-material";
import quantitativeimg from "../assets/images/quantitativeimg.png";
const topics = [
  { name: "Simplification", icon: <Calculate /> },
  { name: "Approximation", icon: <Calculate /> },
  { name: "Missing Number series", icon: <Equalizer /> },
  { name: "Wrong Number series", icon: <Equalizer /> },
  { name: "Quadratic Equation", icon: <TrendingUp /> },
  { name: "Number System", icon: <Numbers /> },
  { name: "Percentage", icon: <Percent /> },
  { name: "Profit and Loss", icon: <Money /> },
  { name: "Time, Speed and Distance", icon: <Speed /> },
  { name: "Time and Work", icon: <AccessTime /> },
  { name: "Average", icon: <Equalizer /> },
  { name: "Ratio and Proportion", icon: <TrendingFlat /> },
  { name: "Mixture and Allegation", icon: <ImportExport /> },
  { name: "Simple Interest", icon: <AccountBalanceWallet /> },
  { name: "Compound Interest", icon: <AccountBalanceWallet /> },
  { name: "Ages", icon: <PersonAdd /> },
  { name: "Probability", icon: <HowToVote /> },
  { name: "Mensuration", icon: <DonutSmall /> },
  { name: "Trains", icon: <Speed /> },
  { name: "Boat and Stream", icon: <Speed /> },
  { name: "Data Sufficiency", icon: <Gavel /> },
  { name: "Pie Chart", icon: <PieChart /> },
  { name: "Bar Graph", icon: <BarChart /> },
  { name: "Line Graph", icon: <LineStyle /> },
  { name: "Table DI", icon: <TableChart /> },
  { name: "Missing Table DI", icon: <TableChart /> },
  { name: "Radar Graph", icon: <Radar /> },
  { name: "Caselet", icon: <Report /> },
];

const QuantiativeApti = () => {
  return (
    <div className="container">
      <h1 className="p-2 text-green-500 text-center fw-bold">
        {" "}
        <CalculateIcon fontSize="large" className="text-green-500" />{" "}
        Quantitative Aptitude Topic-Wise Mock Tests:
      </h1>
      <div className="container">
        <div className="row">
          {/* Left Side: Image */}
          <div className="col-md-6">
            <img
              src={quantitativeimg}
              alt="quantitative"
              className="img-fluid"
            />
          </div>

          {/* Right Side: Content */}
          <div className="col-md-6">
            <p className="font">
              <span className="text-green font-weight-bold">
                Cracking bank exams
              </span>{" "}
              requires 
              <span className="text-green font-weight-bold">
               &nbsp;speed, accuracy, and a strong conceptual foundation in{" "}
              </span>
              <span className="text-green font-weight-bold">
                Quantitative Aptitude
              </span>
              . To help aspirants excel,   <span className="text-green font-weight-bold">  Examrally </span>
               brings you  <span className="text-green font-weight-bold"> Topic-Wise Mock
              Tests </span>, designed to match the latest patterns of <span className="text-green font-weight-bold"> IBPS, SBI, RBI,
              and other banking exams </span>. These tests cover  <span className="text-green font-weight-bold"> all question types,
              difficulty levels, and models </span>, ensuring that you get the most
              <span className="text-green font-weight-bold"> exam-oriented practice </span> available. Each test follows the <span className="text-green font-weight-bold"> latest
              trends </span>, offering a  <span className="text-green font-weight-bold"> real exam-like interface </span> with  <span className="text-green font-weight-bold"> step-by-step
              solutions </span> to help you master the best shortcut tricks and
              traditional methods.  <span className="text-green font-weight-bold"> With complete topic-wise and sub-topic-wise
              coverage </span>, these tests are structured to  <span className="text-green font-weight-bold"> gradually build your
              accuracy and confidence </span>. Whether you are solving  <span className="text-green font-weight-bold">simplification,
              number series, data interpretation, or advanced arithmetic </span>, you
              will find tests categorized into <span className="text-green font-weight-bold"> different difficulty levels</span>—Easy,
              Moderate, and Difficult—so you can improve step by step.
            </p>
            <br />
            <p className="font">
              What sets Examrally’s{" "}
              <span className="text-green font-weight-bold">
                Quantitative Aptitude Mock Tests
              </span>{" "}
              apart is the  <span className="text-green font-weight-bold">detailed performance tracking </span>that highlights your
              strengths and weaknesses after each test. This helps you  <span className="text-green font-weight-bold"> identify
              weak areas and improve topic-wise accuracy effectively</span>. By
              practicing with  <span className="text-green font-weight-bold"> real exam-level questions </span>, you enhance both  <span className="text-green font-weight-bold">speed
              and problem-solving skills </span>, giving you an edge over the
              competition. Whether you’re preparing for  <span className="text-green font-weight-bold">Prelims or Mains </span>, these
              tests ensure you’re  <span className="text-green font-weight-bold"> exam-ready with the right strategies and
              techniques </span>.
            </p>
          </div>
        </div>
      </div>

      <div className="container my-4">
        <h3 className="mb-4 text-center fw-bold">
          Quantitative Aptitude Topics
        </h3>
        <div className="row">
          {topics.map((topic, index) => (
            <div className="col-md-4 col-lg-3 mb-4 " key={index}>
              <div className="card shadow-lg border-light">
                <div className="card-body d-flex align-items-center ">
                  <div className="mr-3">
                    <div style={{ fontSize: "2rem" }} className="fw-bold">{topic.icon}</div>
                  </div>
                  <div>
                    <h5 className="mb-0 text-green-500 font fw-bold">
                      {topic.name}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuantiativeApti;
