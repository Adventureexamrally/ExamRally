import img from "../assets/images/trophy.jpg"; // Corrected image import
import ambition from "../assets/images/ambition.png";
import checklist from "../assets/images/checklist.png";
import mark from "../assets/images/mark.png";
import score from "../assets/images/score.png";
import target from "../assets/images/target.png";
import resilience from "../assets/images/resilience.png";
import studying from "../assets/images/studying.png";
import version from "../assets/images/version.png";
import answer from "../assets/images/answer.png";

const ResultPage = () => {
  return (
    <div className="container font my-4">
      <div className="d-flex justify-content-between">
        <h1 className="display-5">Prilims Data</h1>
        <button className=" text-white font-bold py-2 px-4 rounded bg-green-500 hover:bg-green-400">
          View Solution
        </button>
      </div>
      <div className="row mb-4">
        <div className="col-md-3 d-flex justify-content-center align-items-center">
          <img
            src={img}
            alt="Trophy"
            style={{ height: "200px" }}
            className="rounded-lg"
          />
        </div>
        <div className="col-md-9 d-flex flex-column justify-content-center font-serif">
          <p className="h2 text-green-500">
            <strong>Oh No!!!</strong>
          </p>
          <p className="h2 text-green-500">Adventure Web</p>
          <p>You have not reached the desired cut-off Range!</p>
          <p>
            <strong>Your Score: -0.5 | Cut-off: 8</strong>
          </p>
          <p>Practice more to get the desired cut-off!</p>
        </div>
      </div>

      {/* Information Grid Section */}
      <div className="row d-flex justify-content-center align-items-center">
  {/* First Item */}
  <div className="col flex-item shadow-md rounded mb-3 d-flex justify-content-start align-items-center p-3">
    <img
      src={checklist}
      alt="Score"
      style={{ height: "50px", marginRight: "10px" }}
    />
    <div>
      <p className="mb-0">Mark Scored</p>
      <p className="mb-0">7.4</p>
    </div>
  </div>

  {/* Second Item */}
  <div className="col flex-item shadow-md rounded mb-3 d-flex justify-content-start align-items-center p-3">
    <img
      src={ambition}
      alt="Attempted"
      style={{ height: "50px", marginRight: "10px" }}
    />
    <div>
      <p className="mb-0">Rank</p>
      <p className="mb-0">8.4/154</p>
    </div>
  </div>

  {/* Third Item */}
  <div className="col flex-item shadow-md rounded mb-3 d-flex justify-content-start align-items-center p-3">
    <img
      src={answer}
      alt="Attempted"
      style={{ height: "50px", marginRight: "10px" }}
    />
    <div>
      <p className="mb-0">Answered</p>
      <p className="mb-0">8.4/154</p>
    </div>
  </div>

  {/* Fourth Item */}
  <div className="col flex-item shadow-md rounded mb-3 d-flex justify-content-start align-items-center p-3">
    <img
      src={mark}
      alt="Correct"
      style={{ height: "50px", marginRight: "10px" }}
    />
    <div>
      <p className="mb-0">Correct</p>
      <p className="mb-0">6.4</p>
    </div>
  </div>

  {/* Fifth Item */}
  <div className="col flex-item shadow-md rounded mb-3 d-flex justify-content-start align-items-center p-3">
    <img
      src={version}
      alt="Incorrect"
      style={{ height: "50px", marginRight: "10px" }}
    />
    <div>
      <p className="mb-0">Wrong</p>
      <p className="mb-0">0.74</p>
    </div>
  </div>

  {/* Sixth Item */}
  <div className="col flex-item rounded shadow-md mb-3 d-flex justify-content-start align-items-center p-3">
    <img
      src={resilience}
      alt="Skipped"
      style={{ height: "50px", marginRight: "10px" }}
    />
    <div>
      <p className="mb-0">Skipped</p>
      <p className="mb-0">80.4</p>
    </div>
  </div>

  {/* Seventh Item */}
  <div className="col flex-item rounded mb-3 shadow-md d-flex justify-content-start align-items-center p-3">
    <img
      src={studying}
      alt="Unseen"
      style={{ height: "50px", marginRight: "10px" }}
    />
    <div>
      <p className="mb-0">Percentile</p>
      <p className="mb-0">00.4</p>
    </div>
  </div>

  {/* Eighth Item */}
  <div className="col flex-item rounded mb-3 d-flex shadow-md justify-content-start align-items-center p-3">
    <img
      src={target}
      alt="Accuracy"
      style={{ height: "50px", marginRight: "10px" }}
    />
    <div>
      <p className="mb-0">Accuracy</p>
      <p className="mb-0">04.4</p>
    </div>
  </div>

  {/* Ninth Item */}
  <div className="col flex-item rounded mb-3 d-flex shadow-md justify-content-start align-items-center p-3">
    <img
      src={ambition}
      alt="Attempted"
      style={{ height: "50px", marginRight: "10px" }}
    />
    <div>
      <p className="mb-0">Time Taken</p>
      <p className="mb-0">8.4/154</p>
    </div>
  </div>
</div>


      <div>
        <div className="flex justify-center my-4">
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400">
            View Analysis
          </button>
          &nbsp;&nbsp;
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400">
            View Solution
          </button>
        </div>
      </div>

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
              <tr>
                <th scope="row">
                  BPS PO Mains Sectional 2024 Quantitative Aptitude (Set-1) New
                </th>
                <td>1</td>
                <td>2.3</td>
                <td>6.8</td>
                <td>5.8</td>
                <td>2.3</td>
                <td>6.8</td>
                <td>1:30</td>
                <td>2.3</td>
                <td>3.8</td>
                <td>8.89</td>
                <td>10:30</td>
              </tr>
              <tr>
                <th scope="row">Overall(100)</th>
                <td>5.8</td>
                <td>3.8</td>
                <td>8.89</td>
                <td>1</td>
                <td>4</td>
                <td>2.3</td>
                <td>6.8</td>
                <td>2.3</td>
                <td>6.8</td>
                <td>1:30</td>
                <td>1:30</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400">Cutoff Cleared</button>&nbsp;&nbsp;
      <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400">Cutoff Missed</button>
    </div>
  );
};

export default ResultPage;
