import { useContext, useEffect, useState } from 'react';
import Api from "../service/Api";
import checklist from "../assets/images/test.png";
import ambition from "../assets/images/waste.png";
import mark from "../assets/images/check-mark.png";
import score from "../assets/images/score.png";
import target from "../assets/images/target.png";
import resilience from "../assets/images/resilience.png";
import studying from "../assets/images/progressive.png";
import version from "../assets/images/shape.png";
import answer from "../assets/images/information.png";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import ResultAnimation from '../animationeffect/ResultAnimation';
import { UserContext } from '../context/UserProvider';

const ResultPage = () => {
  const [resultData, setResultData] = useState(null);
  const { id } = useParams();
  const [value, setValue] = useState(50);
  const [selectedBlueprint, setSelectedBlueprint] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [sectionData, setSectionData] = useState([]);
  const [examData, setExamData] = useState(null);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [show_name,setShow_name] = useState("")

     const { user } = useContext(UserContext);
 console.log(user);
 

  useEffect(() => {
    if (!user?._id) return; // Don't run if user is not loaded yet
    Api.get(`results/${user?._id}/${id}`)
      .then(res => {
        setResultData(res.data);
        console.log(res.data);
        if (res.data && res.data.section && Array.isArray(res.data.section)) {
          setSectionData(res.data.section); // Store the section data
        }
        // Assuming 'percentile' exists in the response and it should be the initial value for the range slider
        if (res.data && res.data.Percentile) {
          setValue(res.data.Percentile);  // Set slider value based on percentile
       
     
      }})
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, [id, user]);

  useEffect(() => {
    // Step 2: Set the default section (e.g., first section or any other logic you want)
    if (sectionData && sectionData.length > 0) {
      const defaultSection = sectionData[0];
      setSelectedTopic(defaultSection.name);
      setSelectedBlueprint(defaultSection.s_blueprint);
    }
  }, [sectionData]);


useEffect(() => {
  // Check if data has already been fetched
  if (!isDataFetched) {
    Api.get(`exams/getExam/${id}`)
      .then((res) => {
        if (res.data) {
          setExamData(res.data);
          setIsDataFetched(true); 
          setShow_name(res.data.show_name) // Mark that data is fetched
          console.error("valueee",res.data.show_name)
        }
      })
      .catch((err) => console.error("Error fetching data:", err));
  }
}, [id]); 

  if (!resultData) {
    return <div>Loading...</div>;
  }

  const { score,correct,s_accuracy, incorrect,skipped, Attempted,Not_Attempted,NotVisited,isVisited, timeTaken, Accuracy, section ,cutoff_mark, } = resultData;

  let overallScore = 0;
  let totalAnswered = 0;
  let totalNotAnswered = 0;
  let totalCorrect = 0;
  let totalWrong = 0;
  let totalTimeTaken = 0;
  let totalVisited=0;
  let totalNotVisited = 0;
  let totalCutOff = 0;
  let totalQRE =0;
  let totalCorrectWrong=0;
  let totalSkipped=0;
  let totalAccuracy=0;

  section.forEach(sect => {
    overallScore += sect.s_score;
    totalAnswered += sect.Attempted;
    totalNotAnswered += sect.Not_Attempted;
    totalCorrect += sect.correct;
    totalWrong += sect.incorrect;
    totalTimeTaken += sect.t_time;
    totalVisited += sect.isVisited;
    totalNotVisited +=sect.NotVisited;
    totalCutOff += sect.cutoff_mark
    totalQRE =sect.questions.english.filter(q => q.correct === q.selectedOption).length-sect.questions.english.filter(q => q.correct !== q.selectedOption).length;
    totalCorrectWrong += totalQRE;
    totalSkipped += sect.skipped;
    totalAccuracy =  ((totalCorrect / totalAnswered) * 100).toFixed(2);
  });

  const chartData = [
    {
      name: "s_score",
      ...section.reduce((acc, sect, index) => ({
        ...acc,
        [`section${index + 1}`]: sect.s_score || 0
      }), {})
    },
    {
      name: "Attempted",
      ...section.reduce((acc, sect, index) => ({
        ...acc,
        [`section${index + 1}`]: sect.Attempted || 0
      }), {})
    },
    {
      name: "Not_Attempted",
      ...section.reduce((acc, sect, index) => ({
        ...acc,
        [`section${index + 1}`]: sect.Not_Attempted || 0
      }), {})
    },
    {
      name: "Correct",
      ...section.reduce((acc, sect, index) => ({
        ...acc,
        [`section${index + 1}`]: sect.correct || 0
      }), {})
    },
    {
      name: "Incorrect",
      ...section.reduce((acc, sect, index) => ({
        ...acc,
        [`section${index + 1}`]: sect.incorrect || 0
      }), {})
    }
  ];
 // Runs only once when sectionData is available

  // Step 3: Update the selected section
  const handleSectionClick = (sectionName) => {
    console.log('Section clicked:', sectionName);

    const selectedSection = sectionData.find(sect => sect.name === sectionName);
    console.log('Selected section:', selectedSection);

    if (selectedSection) {
      console.log('Setting selectedTopic:', sectionName);
      setSelectedTopic(sectionName);
      console.log('Setting selectedBlueprint:', selectedSection.s_blueprint);
      setSelectedBlueprint(selectedSection.s_blueprint);
    } else {
      console.log('No section found for name:', sectionName);
    }
  };

  const handleSliderChange = (event) => {
    setValue(event.target.value);
  };


  return (
    <div className="container font my-4">
      <div className="d-flex justify-content-between">
      <h5 className='h4 text-green-600'>{show_name}</h5>
        <div className="flex justify-center my-4">
      <Link to={`/mocksolution/${id}`}>
  <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400">
    View Solution
  </button>
</Link>
      </div>
      </div>

      <div className="row d-flex justify-content-center align-items-start">
  {/* Mark Scored */}
  <div className="col-lg-3 col-md-4 col-sm-6 flex-item shadow-md rounded mb-3 d-flex justify-content-start align-items-center p-3">
    <img src={checklist} alt="Score" style={{ height: "50px", marginRight: "10px" }} />
    <div>
      <p className="mb-0 font-semibold">Mark Scored</p>
      <p className="mb-0">{overallScore}</p>
    </div>
  </div>

  {/* Attempted */}
  {/* <div className="col-lg-3 col-md-4 col-sm-6 flex-item shadow-md rounded mb-3 d-flex justify-content-start align-items-center p-3">
    <img src={ambition} alt="Attempted" style={{ height: "50px", marginRight: "10px" }} />
    <div>
      <p className="mb-0">Attempted</p>
      <p className="mb-0">{Attempted}</p>
    </div>
  </div> */}

  {/* Answered */}
  <div className="col-lg-3 col-md-4 col-sm-6 flex-item shadow-md rounded mb-3 d-flex justify-content-start align-items-center p-3">
    <img src={answer} alt="Answered" style={{ height: "50px", marginRight: "10px" }} />
    <div>
      <p className="mb-0 font-semibold">Answered</p>
      <p className="mb-0">{totalAnswered}</p>
    </div>
  </div>

  {/* Correct */}
  <div className="col-lg-3 col-md-4 col-sm-6 flex-item shadow-md rounded mb-3 d-flex justify-content-start align-items-center p-3">
    <img src={mark} alt="Correct" style={{ height: "50px", marginRight: "10px" }} />
    <div>
      <p className="mb-0 font-semibold">Correct</p>
      {totalCorrect}
    </div>
  </div>

  {/* Wrong */}
  <div className="col-lg-3 col-md-4 col-sm-6 flex-item shadow-md rounded mb-3 d-flex justify-content-start align-items-center p-3">
    <img src={version} alt="Incorrect" style={{ height: "50px", marginRight: "10px" }} />
    <div>
      <p className="mb-0 font-semibold">Wrong</p>
      {totalWrong}
    </div>
  </div>

  {/* Skipped */}
  <div className="col-lg-3 col-md-4 col-sm-6 flex-item shadow-md rounded mb-3 d-flex justify-content-start align-items-center p-3">
    <img src={resilience} alt="Skipped" style={{ height: "50px", marginRight: "10px" }} />
    <div>
      <p className="mb-0 font-semibold">Skipped</p>
      {totalSkipped}
    </div>
  </div>

  {/* Percentile */}
  <div className="col-lg-3 col-md-4 col-sm-6 flex-item shadow-md rounded mb-3 d-flex justify-content-start align-items-center p-3">
    <img src={studying} alt="Unseen" style={{ height: "50px", marginRight: "10px" }} />
    <div>
      <p className="mb-0 font-semibold">Percentile</p>
      <p className="mb-0">{Accuracy}%</p>
    </div>
  </div>

  {/* Accuracy */}
  <div className="col-lg-3 col-md-4 col-sm-6 flex-item shadow-md rounded mb-3 d-flex justify-content-start align-items-center p-3">
    <img src={target} alt="Accuracy" style={{ height: "50px", marginRight: "10px" }} />
    <div>
      <p className="mb-0 font-semibold">Accuracy</p>
      <p className="mb-0">{totalAccuracy}%</p>
    </div>
  </div>

  {/* Time Taken */}
  <div className="col-lg-3 col-md-4 col-sm-6 flex-item shadow-md rounded mb-3 d-flex justify-content-start align-items-center p-3">
    <img src={ambition} alt="Time Taken" style={{ height: "50px", marginRight: "10px" }} />
    <div>
      <p className="mb-0 font-semibold">Time Taken</p>
      <p className="mb-0">{totalTimeTaken}</p>
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
                <th scope="col">Visited</th>
                <th scope="col">Not Visited</th>
                <th scope="col">Cutoff</th>
              </tr>
            </thead>
            <tbody>
              {sectionData.map((sect, index) => (
                <tr key={index}>
                <th scope="row">{sect.name}</th>
                <td>{sect.s_score}</td>
                <td>{sect.Attempted}</td>
                <td>{sect.Not_Attempted}</td>
                <td>{sect.correct}</td>
                <td>{sect.incorrect}</td>
                <td>{sect.t_time}</td>
                <td>{sect.s_accuracy}%</td>
                <td>1</td> {/* Rank placeholder */}
                <td>90</td> {/* Percentile placeholder */}
                <td>{sect.isVisited}</td>
                <td>{sect.NotVisited}</td>
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
                <th>{totalAccuracy}%</th>
                <th>1</th>
                <th>90</th>
                <th>{totalVisited}</th>
                <th>{totalNotVisited}</th>
                <th>{totalCutOff}</th>
              </tr>
            </tfoot>
          </table>
        </div>
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
      <h1 className='font-semibold'>Comparison With Toppers
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
      <h1 className='font-semibold'>Time Management
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
                  <td>{sect.Attempted}</td>
                  <td>{sect.Not_Attempted}</td>
                  <td>{sect.correct}</td>
                  <td>{sect.incorrect}</td>
                  <td>{}</td>
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
    <h1 className='font-semibold'>Line Graph</h1>
      
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
  <LineChart
    width={900}
    height={400}
    data={chartData}
    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis ticks={[5,10,15,20,25,30,35,40,45,50,55,60]} />
    <Tooltip />
    <Legend />
    {section.map((sect, index) => (
      <Line 
        key={index}
        type="monotone" 
        dataKey={`section${index + 1}`} 
        name={sect.name} 
        stroke={index === 0 ? "#15803d" : index === 1 ? "#1d4ed8" : index === 2 ? "#6d28d9" : `#${Math.floor(Math.random()*16777215).toString(16)}`} 
        strokeWidth={2}
      />
    ))}
  </LineChart>
</div>
      {/* Section buttons */}
      <h1 className='bg-blue-100 text-blue-600 p-2 h4 text-center fw-bold'>Scoring Blueprint</h1>

      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mt-2">


        {sectionData.map((sect, index) => (
          <div key={index} className="flex-shrink-0">
            <button
              type="button"
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md w-full md:w-auto"
              onClick={() => handleSectionClick(sect.name)}
            >
              {sect.name}
            </button>
          </div>
        ))}
      </div>

      {/* Blueprint */}
      {selectedBlueprint && (
        <div className="m-2">
          <h2 className='mb-2 fw-bold'>Blueprint for {selectedTopic} :-</h2>
          <table className="table table-bordered table-striped table-responsive">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Topic</th>
                <th>Time Taken (Min*)</th>
              </tr>
            </thead>
            <tbody>
              {selectedBlueprint.map((item, index) => (
                <tr key={item._id}>
                  <td>{item.subject}</td>
                  <td>{item.topic}</td>
                  <td>{item.tak_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


     
<div className='p-2'>
        <label
          htmlFor="default-range"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Percentile
        </label>
        <div className="relative">
          <input
            id="default-range"
            type="range"
            value={value}
            min="0"
            max="100"
            step="5"
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 mt-8"
            disabled
          />
          <span
            className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-green-500  px-3 p-1 text-sm font-medium text-white"
            style={{ left: `${(value / 100) * 100}%` }}
          >
             <p><strong>Percentile:</strong> {resultData?.Percentile || 'Loading...'}</p>
             <p><strong>Score:</strong> {overallScore || 'Loading...'}</p>
          </span>
        </div>

        <div className="relative">
          <div className="flex justify-between text-xs">
            {/* Custom marks (0, 5, 10, 15, ..., 100) */}
            {[...Array(21)].map((_, index) => {
              const markValue = index * 5;
              return (
                <div key={markValue} className="flex flex-col items-center">
                  <div className="h-2 w-0.5 bg-gray-600 dark:bg-gray-300 mt-1" />
                  <span>{markValue}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
      <div>
        <ResultAnimation/>
      </div>
    </div>
  );
};

export default ResultPage;
