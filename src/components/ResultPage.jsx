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
import { useNavigate, useParams } from "react-router-dom";
import { Link , } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


const ResultPage = () => {
  const [resultData, setResultData] = useState(null);
  const {id} = useParams()
  
  useEffect(() => {
    Api.get(`results/65a12345b6c78d901e23f456/${id}`)
      .then(res => setResultData(res.data))
      .catch(error => console.error("Error fetching data:", error.message));
  }, [id]);
 
  if (!resultData) {
    return <div>Loading...</div>;
  }

  const { score, Attempted, timeTaken, Accuracy, section ,cutoff_mark, } = resultData;

  let overallScore = 0;
  let totalAnswered = 0;
  let totalNotAnswered = 0;
  let totalCorrect = 0;
  let totalWrong = 0;
  let totalTimeTaken = 0;
  let totalNotVisited = 0;
  let totalCutOff = 0;
  let totalQRE =0;
  let totalCorrectWrong=0;

  section.forEach(sect => {
    overallScore += sect.score;
    totalAnswered += Attempted;
    totalNotAnswered += sect.t_question - Attempted;
    totalCorrect += sect.questions.english.filter(q => q.correct === q.selectedOption).length;
    totalWrong += sect.questions.english.filter(q => q.correct !== q.selectedOption).length;
    totalTimeTaken += sect.t_time;
    totalNotVisited += sect.questions.english.filter(q => q.selectedOption === undefined).length;
    totalCutOff += sect.cutoff_mark
    totalQRE =sect.questions.english.filter(q => q.correct === q.selectedOption).length-sect.questions.english.filter(q => q.correct !== q.selectedOption).length;
    totalCorrectWrong += totalQRE
  });


  
  // const accuracy = Attempted > 0 ? ((  q.correct/ Attempted) * 100).toFixed(2) : "N/A";

  const data = section.map((sect) => ({
    name: sect.name,
    score: sect.score,
    answered: sect.t_question - (sect.t_question - Attempted), // or just Attempted if it is section specific.
    notAnswered: sect.t_question - (sect.t_question - Attempted),
    correct: sect.questions.english.filter(q => q.correct === q.selectedOption).length,
    wrong: sect.questions.english.filter(q => q.correct !== q.selectedOption).length,
    timeTaken: sect.t_time,
  }));

  

  return (
    <div className="container font my-4">
      <div className="d-flex justify-content-between">
        <h1 className="display-5">Result</h1>
        <button className=" text-white font-bold py-2 px-4 rounded bg-green-500 hover:bg-green-400">
          View Solution
        </button>
      </div>

      {/* Information Grid Section */}
      <div className="row d-flex justify-content-center align-items-start">
  {/* Mark Scored */}
  <div className="col-lg-3 col-md-4 col-sm-6 flex-item shadow-md rounded mb-3 d-flex justify-content-start align-items-center p-3">
    <img src={checklist} alt="Score" style={{ height: "50px", marginRight: "10px" }} />
    <div>
      <p className="mb-0">Mark Scored</p>
      <p className="mb-0">{score}</p>
    </div>
  </div>

  {/* Attempted */}
  <div className="col-lg-3 col-md-4 col-sm-6 flex-item shadow-md rounded mb-3 d-flex justify-content-start align-items-center p-3">
    <img src={ambition} alt="Attempted" style={{ height: "50px", marginRight: "10px" }} />
    <div>
      <p className="mb-0">Attempted</p>
      <p className="mb-0">{Attempted}</p>
    </div>
  </div>

  {/* Answered */}
  <div className="col-lg-3 col-md-4 col-sm-6 flex-item shadow-md rounded mb-3 d-flex justify-content-start align-items-center p-3">
    <img src={answer} alt="Answered" style={{ height: "50px", marginRight: "10px" }} />
    <div>
      <p className="mb-0">Answered</p>
      <p className="mb-0">{Attempted}</p>
    </div>
  </div>

  {/* Correct */}
  <div className="col-lg-3 col-md-4 col-sm-6 flex-item shadow-md rounded mb-3 d-flex justify-content-start align-items-center p-3">
    <img src={mark} alt="Correct" style={{ height: "50px", marginRight: "10px" }} />
    <div>
      <p className="mb-0">Correct</p>
      {/* <p className="mb-0">{section[0].questions.english.filter(q => q.correct === q.selectedOption).length}</p> */}
    </div>
  </div>

  {/* Wrong */}
  <div className="col-lg-3 col-md-4 col-sm-6 flex-item shadow-md rounded mb-3 d-flex justify-content-start align-items-center p-3">
    <img src={version} alt="Incorrect" style={{ height: "50px", marginRight: "10px" }} />
    <div>
      <p className="mb-0">Wrong</p>
      {/* <p className="mb-0">{section[0].questions.english.filter(q => q.correct !== q.selectedOption).length}</p> */}
    </div>
  </div>

  {/* Skipped */}
  <div className="col-lg-3 col-md-4 col-sm-6 flex-item shadow-md rounded mb-3 d-flex justify-content-start align-items-center p-3">
    <img src={resilience} alt="Skipped" style={{ height: "50px", marginRight: "10px" }} />
    <div>
      <p className="mb-0">Skipped</p>
      {/* <p className="mb-0">{section[0].questions.english.filter(q => q.selectedOption === undefined).length}</p> */}
    </div>
  </div>

  {/* Percentile */}
  <div className="col-lg-3 col-md-4 col-sm-6 flex-item shadow-md rounded mb-3 d-flex justify-content-start align-items-center p-3">
    <img src={studying} alt="Unseen" style={{ height: "50px", marginRight: "10px" }} />
    <div>
      <p className="mb-0">Percentile</p>
      <p className="mb-0">{Accuracy}</p>
    </div>
  </div>

  {/* Accuracy */}
  <div className="col-lg-3 col-md-4 col-sm-6 flex-item shadow-md rounded mb-3 d-flex justify-content-start align-items-center p-3">
    <img src={target} alt="Accuracy" style={{ height: "50px", marginRight: "10px" }} />
    <div>
      <p className="mb-0">Accuracy</p>
      <p className="mb-0">{Accuracy}</p>
    </div>
  </div>

  {/* Time Taken */}
  <div className="col-lg-3 col-md-4 col-sm-6 flex-item shadow-md rounded mb-3 d-flex justify-content-start align-items-center p-3">
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
                  <td>{sect.score}</td>
                  <td>{Attempted}</td>
                  <td>{sect.t_question - Attempted}</td>
                  <td>{sect.questions.english.filter(q => q.correct === q.selectedOption).length}</td>
                  <td>{sect.questions.english.filter(q => q.correct !== q.selectedOption).length}</td>
                  <td>{sect.t_time}</td>
                  <td>{((sect.questions.english.filter(q => q.correct !== q.selectedOption).length / Attempted) * 100).toFixed(2)}%</td>
                  <td>1</td> {/* Rank placeholder */}
                  <td>90</td> {/* Percentile placeholder */}
                  <td>{sect.questions.english.filter(q => q.selectedOption === undefined).length}</td>
                  <td>{sect.cutoff_mark}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th>Overall</th>
                <th>{overallScore}</th>
                <th>{totalAnswered}</th>
                <th>{totalNotAnswered}</th>
                <th>{totalCorrect}</th>
                <th>{totalWrong}</th>
                <th>{totalTimeTaken}</th>
                <th>{((totalCorrect / totalAnswered) * 100).toFixed(2)}%</th>
                <th>1</th>
                <th>90</th>
                <th>{totalNotVisited}</th>
                <th>{totalCutOff}</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="flex justify-center my-4">
      {/* <Link to='/result'>
        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400">
          View Analysis
        </button>
        </Link> */}
        &nbsp;&nbsp;
        <Link to='/mocksolution'>
  <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400">
    View Solution
  </button>
</Link>
      </div>

      <div className="flex justify-end space-x-4">
  <p className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400">
    Cutoff Cleared :5
  </p>
  <p className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400">
    Cutoff Missed :5
  </p>
</div>
<div>
      <h1>Comparison With Toppers
      </h1>
    <div className='mt-4'>
      <button className="bg-green-500 text-white px-4 py-2  hover:bg-green-400">
    Quantitative Aptitude
  </button>
  <button className=" px-4 py-2 ">
    Reasoning Ability
  </button>
  <button className=" px-4 py-2 ">
    English Learning
  </button></div>
      
      <div className="d-flex justify-content-center align-items-center p-4">
      <div className="container">
        <table className="table table-bordered table-striped table-responsive">
          <thead>
            <tr>
              <th>{" "}</th>
              <th>Score</th>
              <th>Answered</th>
              <th>Not answered</th>
              <th>Correct</th>
              <th>Wrong</th>
              <th>Time</th>
              <th>Accuracy</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>You</td>
              <td>100</td>
              <td>10</td>
              <td>90</td>
              <td>5</td>
              <td>5</td>
              <td>10:00</td>
              <td>90%</td>
            </tr>
            <tr>
              <td>Average</td>
              <td>100</td>
              <td>10</td>
              <td>90</td>
              <td>5</td>
              <td>5</td>
              <td>10:00</td>
              <td>90%</td>
            </tr>
            <tr>
              <td>Topper</td>
              <td>100</td>
              <td>10</td>
              <td>90</td>
              <td>5</td>
              <td>5</td>
              <td>10:00</td>
              <td>90%</td>
            </tr>
          </tbody>
        </table>
      </div>
      </div>
    </div>


    <div>
      <h1>Time Management
      </h1>
   
      <div className='d-flex justify-content-center align-items-center p-4'>
      <div className="container">
          <table className="table table-bordered table-striped table-responsive">
            <thead>
              <tr>
                <th scope="col">Section</th>
               
                <th scope="col">Answered/Marks</th>
                <th scope="col">Not Answered/Marks</th>
                <th scope="col">Correct/Marks</th>
                <th scope="col">Wrong/-ve Marks</th>
                <th scope='col'>Total Mark Scored / Negative 
                MarK </th>
              </tr>
            </thead>
            <tbody>
              {section.map((sect, index) => (
                <tr key={index}>
                  <th scope="row">{sect.name}</th>
                  <td>{Attempted}</td>
                  <td>{sect.t_question - Attempted}</td>
                  <td>{sect.questions.english.filter(q => q.correct === q.selectedOption).length}</td>
                  <td>{sect.questions.english.filter(q => q.correct !== q.selectedOption).length}</td>
                  <td>{totalQRE =sect.questions.english.filter(q => q.correct === q.selectedOption).length-sect.questions.english.filter(q => q.correct !== q.selectedOption).length}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th>Overall</th>
              
                <th>{totalAnswered}</th>
                <th>{totalNotAnswered}</th>
                <th>{totalCorrect}</th>
                <th>{totalWrong}</th>  
                <th>{totalCorrectWrong}</th>
              </tr>
            </tfoot>
          </table>
        </div>
        </div>
    </div>

    <h1>Bar Charts</h1>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      
      <BarChart width={800} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="score" name="Score" fill="#8884d8"/>
        <Bar dataKey="answered" name="Answered" fill="#82ca9d" />
        <Bar dataKey="notAnswered" name="Not Answered" fill="#ffc658" />
        <Bar dataKey="correct" name="Correct" fill="#0088FE" />
        <Bar dataKey="wrong" name="Wrong" fill="#FF8042" />
        <Bar dataKey="timeTaken" name="Time Taken" fill="#a0522d" />
      </BarChart>
    </div>


 
    </div>
  );
};

export default ResultPage;
