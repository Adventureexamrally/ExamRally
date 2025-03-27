import { useEffect, useState } from 'react';
import Api from "../service/Api";
import checklist from "../assets/images/checklist.png";
import ambition from "../assets/images/ambition.png";
import mark from "../assets/images/mark.png";
import score from "../assets/images/score.png";
import target from "../assets/images/target.png";
import resilience from "../assets/images/resilience.png";
import studying from "../assets/images/studying.png";
import version from "../assets/images/version.png";
import answer from "../assets/images/answer.png";
import { Link } from 'react-router-dom';

const ResultPage = () => {
  const [resultData, setResultData] = useState(null);

  useEffect(() => {
    Api.get("/results/67e3ef252736bfbb799937d7/67e3ef252736bfbb799937d7")
      .then(res => setResultData(res.data))
     
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  if (!resultData) {
    return <div>Loading...</div>;
  }

  const { score, Attempted, timeTaken, Accuracy, section, takenAt, submittedAt } = resultData;

  return (
    <div className="container font my-4">
      <div className="d-flex justify-content-between">
        <h1 className="display-5">Prilims Data</h1>
        <button className=" text-white font-bold py-2 px-4 rounded bg-green-500 hover:bg-green-400">
          View Solution
        </button>
      </div>

      {/* Information Grid Section */}
      <div className="row d-flex justify-content-center align-items-center">
        <div className="col flex-item shadow-md rounded mb-3 d-flex justify-content-start align-items-center p-3">
          <img src={checklist} alt="Score" style={{ height: "50px", marginRight: "10px" }} />
          <div>
            <p className="mb-0">Mark Scored</p>
            <p className="mb-0">{score}</p>
          </div>
        </div>

        <div className="col flex-item shadow-md rounded mb-3 d-flex justify-content-start align-items-center p-3">
          <img src={ambition} alt="Attempted" style={{ height: "50px", marginRight: "10px" }} />
          <div>
            <p className="mb-0">Attempted</p>
            <p className="mb-0">{Attempted}</p>
          </div>
        </div>

        <div className="col flex-item shadow-md rounded mb-3 d-flex justify-content-start align-items-center p-3">
          <img src={answer} alt="Answered" style={{ height: "50px", marginRight: "10px" }} />
          <div>
            <p className="mb-0">Answered</p>
            <p className="mb-0">{Attempted}</p>
          </div>
        </div>

        <div className="col flex-item shadow-md rounded mb-3 d-flex justify-content-start align-items-center p-3">
          <img src={mark} alt="Correct" style={{ height: "50px", marginRight: "10px" }} />
          <div>
            <p className="mb-0">Correct</p>
            {/* <p className="mb-0">{section[0].questions.english.filter(q => q.correct === q.selectedOption).length}</p> */}
          </div>
        </div>

        <div className="col flex-item shadow-md rounded mb-3 d-flex justify-content-start align-items-center p-3">
          <img src={version} alt="Incorrect" style={{ height: "50px", marginRight: "10px" }} />
          <div>
            <p className="mb-0">Wrong</p>
            {/* <p className="mb-0">{section[0].questions.english.filter(q => q.correct !== q.selectedOption).length}</p> */}
          </div>
        </div>

        <div className="col flex-item shadow-md rounded mb-3 d-flex justify-content-start align-items-center p-3">
          <img src={resilience} alt="Skipped" style={{ height: "50px", marginRight: "10px" }} />
          <div>
            <p className="mb-0">Skipped</p>
            {/* <p className="mb-0">{section[0].questions.english.filter(q => q.selectedOption === undefined).length}</p> */}
          </div>
        </div>

        <div className="col flex-item shadow-md rounded mb-3 d-flex justify-content-start align-items-center p-3">
          <img src={studying} alt="Unseen" style={{ height: "50px", marginRight: "10px" }} />
          <div>
            <p className="mb-0">Percentile</p>
            <p className="mb-0">{Accuracy}</p>
          </div>
        </div>

        <div className="col flex-item shadow-md rounded mb-3 d-flex justify-content-start align-items-center p-3">
          <img src={target} alt="Accuracy" style={{ height: "50px", marginRight: "10px" }} />
          <div>
            <p className="mb-0">Accuracy</p>
            <p className="mb-0">{Accuracy}</p>
          </div>
        </div>

        <div className="col flex-item shadow-md rounded mb-3 d-flex justify-content-start align-items-center p-3">
          <img src={ambition} alt="Time Taken" style={{ height: "50px", marginRight: "10px" }} />
          <div>
            <p className="mb-0">Time Taken</p>
            <p className="mb-0">{timeTaken}</p>
          </div>
        </div>
      </div>

      {/* Section Summary */}
      <div>
        <h1>Sectional Summary</h1>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Section Name</th>
                <th scope="col">Score</th>
                <th scope="col">Answered</th>
                <th scope="col">Not Answered</th>
                <th scope="col">Correct</th>
                <th scope="col">Wrong</th>
                <th scope="col">Time Taken</th>
                <th scope="col">Accuracy</th>
                <th scope="col">Rank</th>
                <th scope="col">Percentile</th>
                <th scope="col">Not Visited</th>
                <th scope="col">Cutoff</th>
              </tr>
            </thead>
            <tbody>
              {section.map((sect, index) => (
                <tr key={index}>
                  <th scope="row">{sect.name}</th>
                  <td>{score}</td>
                  <td>{Attempted}</td>
                  <td>{sect.t_question - Attempted}</td>
                  <td>{sect.questions.english.filter(q => q.correct === q.selectedOption).length}</td>
                  <td>{sect.questions.english.filter(q => q.correct !== q.selectedOption).length}</td>
                  <td>{timeTaken}</td>
                  <td>{Accuracy}</td>
                  <td>1</td> {/* Rank placeholder */}
                  <td>90</td> {/* Percentile placeholder */}
                  <td>{sect.questions.english.filter(q => q.selectedOption === undefined).length}</td>
                  <td>{sect.cutoff_mark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center my-4">
        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400">
          View Analysis
        </button>
        &nbsp;&nbsp;
        <Link to='/mocksolution'>
  <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400">
    View Solution
  </button>
</Link>
      </div>

      <div>
        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400">
          Cutoff Cleared
        </button>
        &nbsp;&nbsp;
        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400">
          Cutoff Missed
        </button>
      </div>
    </div>
  );
};

export default ResultPage;
