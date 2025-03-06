import img from "../assets/images/trophy.jpg"; // Corrected image import
import ambition from '../assets/images/ambition.png'
import checklist from '../assets/images/checklist.png'
import mark from '../assets/images/mark.png'
import score from '../assets/images/score.png'
import target from '../assets/images/target.png'
import resilience from '../assets/images/resilience.png'
import studying from '../assets/images/studying.png'
import version from '../assets/images/version.png'


const ResultPage = () => {
  return (
    <div className="container font">
      <h1 className="text-center">IBPS PO Mains Sectional 2024 Quantitative Aptitude (Set-1) New</h1>
      <div className="row mb-4">
        <div className="col-md-3 d-flex justify-content-center align-items-center">
          <img src={img} alt="Trophy" style={{ height: "200px" }} className="rounded-lg" />
        </div>
        <div className="col-md-9 d-flex flex-column justify-content-center font-serif">
          <p className="h2 text-green-500">
            <strong>Oh No!!!</strong>
          </p>
          <p className="h2 text-green-500">Adventure Web</p>
          <p>You have not reached the desired cut-off Range!</p>
          <p><strong>Your Score: -0.5 | Cut-off: 8</strong></p>
          <p>Practice more to get the desired cut-off!</p>
        </div>
      </div>

      {/* Information Grid Section */}
      <div className="row d-flex justify-content-center align-items-center" >
  <div className="col-md-1 flex-item shadow-md rounded ">
    <img src={checklist} alt="Score" style={{ height: '50px' }} />
    <p>Score</p>
    <p>7.4</p>
  </div>

  <div className="col-md-1 flex-item shadow-md rounded">
    <img src={ambition} alt="Attempted" style={{ height: '50px' }} />
    <p>Attempted</p>
    <p>8.4</p>
  </div>

  <div className="col-md-1 flex-item shadow-md rounded">
    <img src={mark} alt="Correct" style={{ height: '50px' }} />
    <p>Correct</p>
    <p>6.4</p>
  </div>

  <div className="col-md-1 flex-item shadow-md rounded">
    <img src={version} alt="Incorrect" style={{ height: '50px' }} />
    <p>Incorrect</p>
    <p>0.74</p>
  </div>

  <div className="col-md-1 flex-item shadow-md rounded">
    <img src={resilience} alt="Skipped" style={{ height: '50px' }} />
    <p>Skipped</p>
    <p>80.4</p>
  </div>

  <div className="col-md-1 flex-item shadow-md rounded">
    <img src={studying} alt="Unseen" style={{ height: '50px' }} />
    <p>Unseen</p>
    <p>00.4</p>
  </div>

  <div className="col-md-1 flex-item shadow-md rounded">
    <img src={target} alt="Accuracy" style={{ height: '50px' }} />
    <p>Accuracy</p>
    <p>04.4</p>
  </div>
</div>

<div>
  <div className='flex justify-center my-4'>
    <button className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400'>View Analysis</button>
    &nbsp;&nbsp;
    <button className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400'>View Solution</button>
  </div>
</div>

<div>
  <h1>Sectional Summary</h1>
  <div class="table-responsive">
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Section Name</th>
          <th scope="col">Attempted</th>
          <th scope="col">Correct</th>
          <th scope="col">Incorrect</th>
          <th scope="col">Skipped</th>
          <th scope="col">Accuracy</th>
          <th scope="col">Score</th>
          <th scope="col">Time</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">BPS PO Mains Sectional 2024 Quantitative Aptitude (Set-1) New</th>
          <td>1</td>
          <td>2.3</td>
          <td>6.8</td>
          <td>5.8</td>
          <td>3.8</td>
          <td>8.89</td>
          <td>10:30</td>
        </tr>
        <tr>
          <th scope="row">Overall</th>
          <td>5.8</td>
          <td>3.8</td>
          <td>8.89</td>
          <td>1</td>
          <td>2.3</td>
          <td>6.8</td>
          <td>1:30</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>


    </div>
  );
};

export default ResultPage;
