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
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import ResultAnimation from '../animationeffect/ResultAnimation';
import { UserContext } from '../context/UserProvider';
import Percentile from './Percentile';

const ResultPage = () => {
  const [resultData, setResultData] = useState(null);
  const { id } = useParams();
  const [selectedBlueprint, setSelectedBlueprint] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [sectionData, setSectionData] = useState([]);
  const [examData, setExamData] = useState(null);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [show_name,setShow_name] = useState("")
const [alluserDetails,setAllUserDetails]=useState([])
const [Rank,SetRank]=useState(0)
const [percentile,setpercentile]=useState(0)
const [selectedComparisonSection, setSelectedComparisonSection] = useState('');



     const { user } = useContext(UserContext);
 console.log(user);
 
 useEffect(() => {
  if (!user?._id && id) return; // Don't run if user is not loaded yet

  Api.get(`results/${user?._id}/${id}`)
    .then(res => {
      setResultData(res.data);
      console.log(res.data);
      if (res.data && res.data.section && Array.isArray(res.data.section)) {
        setSectionData(res.data.section); // Store the section data
      }
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });

  Api.get(`results/getresultByExam/${id}`)
    .then(res => {
      setAllUserDetails(res.data);
      console.log(res.data);

      if (user && res.data.length > 0) {
        // Find the current user result
        const currentUserResult = res.data.find(item => item.userId === user._id);
        
        if (currentUserResult) {
          const myRank = res.data.findIndex(item => item.userId === user._id) + 1; // Rank of the user (1-based index)
          SetRank(myRank)
          const overallRank = res.data.length; // Total users in the exam
          console.log(myRank, overallRank);
          
          // Calculate percentile using the given formula
          const calculatedPercentile = (100 - ((myRank / overallRank) * 100)).toFixed(2);
          console.log(calculatedPercentile);
          
          setpercentile(calculatedPercentile);

          // Sectional Rank and Percentile
         
        }
      }
      if (user && res.data.length > 0) {
        const currentUserResult = res.data.find(item => item.userId === user._id);
        const myRank = res.data.findIndex(item => item.userId === user._id) + 1;
        SetRank(myRank);
      
        const overallRank = res.data.length;
        const calculatedPercentile = (100 - ((myRank / overallRank) * 100)).toFixed(2);
        setpercentile(calculatedPercentile);
      
        // Sectional Rank and Percentile Calculation
        const sectionStats = [];
      
        if (currentUserResult?.section) {
          currentUserResult.section.forEach((currentSection, sectionIndex) => {
            const sectionName = currentSection.name;
      
            // Collect all scores for this section
            const scoresForThisSection = res.data.map(result => {
              const found = result.section.find(s => s.name === sectionName);
              return {
                userId: result.userId,
                score: found?.s_score || 0,
              };
            });
      
            // Sort descending
            const sortedScores = scoresForThisSection.sort((a, b) => b.score - a.score);
      
            // Find current user's rank in this section
            const rank = sortedScores.findIndex(s => s.userId === user._id) + 1;
            const percentile = (100 - ((rank / sortedScores.length) * 100)).toFixed(2);
      
            sectionStats.push({ name: sectionName, rank, percentile });
          });
        }
      
        // Append this info to your section data
        const updatedSectionData = currentUserResult.section.map(section => {
          const stat = sectionStats.find(s => s.name === section.name);
          return {
            ...section,
            rank: stat?.rank || '-',
            percentile: stat?.percentile || '-',
          };
        });
      
        setSectionData(updatedSectionData);
      }
      
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });

    
  if (!isDataFetched) {
    Api.get(`exams/getExam/${id}`)
      .then((res) => {
        if (res.data) {
          setExamData(res.data);
          setIsDataFetched(true); 
          setShow_name(res.data.show_name) // Mark that data is fetched
        }
      })
      .catch((err) => console.error("Error fetching data:", err));
  }
}, [id, user]);

  useEffect(() => {
    // Step 2: Set the default section (e.g., first section or any other logic you want)
    if (sectionData && sectionData.length > 0) {
      const defaultSection = sectionData[0];
      setSelectedTopic(defaultSection.name);
      setSelectedBlueprint(defaultSection.s_blueprint);
      
    // 👇 Set default for comparison section
    setSelectedComparisonSection(defaultSection.name);
    }
    console.log(sectionData);
    
  }, [sectionData]);


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
  let totelmark=0

  section.forEach(sect => {
    overallScore += sect.s_score;
    totalAnswered += sect.Attempted;
    totalNotAnswered += sect.Not_Attempted;
    totalCorrect += sect.correct;
    totalWrong += sect.incorrect;
    totalTimeTaken += sect.timeTaken;
    totalVisited += sect.isVisited;
    totalNotVisited +=sect.NotVisited;
    totalCutOff += sect.cutoff_mark
    totalQRE =sect.questions.english.filter(q => q.correct === q.selectedOption).length-sect.questions.english.filter(q => q.correct !== q.selectedOption).length;
    totalCorrectWrong += totalQRE;
    totalSkipped += sect.skipped;
    totalAccuracy =  ((totalCorrect / totalAnswered) * 100).toFixed(2);
    totelmark+=sect.t_mark

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
// At the top of your component with other useState hooks



console.log(alluserDetails);
const getComparisonStats = (sectionName) => {
  const you = resultData.section.find(sect => sect.name === sectionName);
  
  const sectionStats = {
    you: {
      score: you?.s_score || 0,
      answered: you?.Attempted || 0,
      notAnswered: you?.Not_Attempted || 0,
      correct: you?.correct || 0,
      wrong: you?.incorrect || 0,
      time: you?.timeTaken || 0,
      accuracy: you?.s_accuracy || 0,
    },
    average: {
      score: 0,
      answered: 0,
      notAnswered: 0,
      correct: 0,
      wrong: 0,
      time: 0,
      accuracy: 0,
    },
    topper: {
      score: 0,
      answered: 0,
      notAnswered: 0,
      correct: 0,
      wrong: 0,
      time: 0,
      accuracy: 0,
    }
  };

  const scores = [];

  alluserDetails.forEach(userResult => {
    const section = userResult.section?.find(sect => sect.name === sectionName);
    if (section) {
      scores.push(section);

      sectionStats.average.score += section.s_score;
      sectionStats.average.answered += section.Attempted;
      sectionStats.average.notAnswered += section.Not_Attempted;
      sectionStats.average.correct += section.correct;
      sectionStats.average.wrong += section.incorrect;
      sectionStats.average.time += section.timeTaken;
      sectionStats.average.accuracy += section.s_accuracy;
    }
  });

  const totalUsers = scores.length;

  if (totalUsers > 0) {
    sectionStats.average.score = (sectionStats.average.score / totalUsers).toFixed(2);
    sectionStats.average.answered = Math.round(sectionStats.average.answered / totalUsers);
    sectionStats.average.notAnswered = Math.round(sectionStats.average.notAnswered / totalUsers);
    sectionStats.average.correct = Math.round(sectionStats.average.correct / totalUsers);
    sectionStats.average.wrong = Math.round(sectionStats.average.wrong / totalUsers);
    sectionStats.average.time = (sectionStats.average.time / totalUsers).toFixed(2);
    sectionStats.average.accuracy = (sectionStats.average.accuracy / totalUsers).toFixed(2);

    // Get Topper (max score)
    const topper = scores.reduce((prev, current) => (prev.s_score > current.s_score ? prev : current));
    console.log(topper);
    
    sectionStats.topper = {
      score: topper?.s_score || 0,
      answered: topper?.Attempted || 0,
      notAnswered: topper?.Not_Attempted || 0,
      correct: topper?.correct || 0,
      wrong: topper?.incorrect || 0,
      time: topper?.timeTaken || 0,
      accuracy: topper?.s_accuracy || 0
    };
  }

  return sectionStats;
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
      <p className="mb-0">{percentile }%</p>
    </div>
  </div>

  {/* Accuracy */}
  <div className="col-lg-3 col-md-4 col-sm-6 flex-item shadow-md rounded mb-3 d-flex justify-content-start align-items-center p-3">
  <img src={target} alt="Accuracy" style={{ height: "50px", marginRight: "10px" }} />
  <div>
    <p className="mb-0 font-semibold">Accuracy</p>
    <p className="mb-0">{isNaN(totalAccuracy) ? 0 : totalAccuracy}%</p>
  </div>
</div>


  {/* Time Taken */}
  <div className="col-lg-3 col-md-4 col-sm-6 flex-item shadow-md rounded mb-3 d-flex justify-content-start align-items-center p-3">
    <img src={ambition} alt="Time Taken" style={{ height: "50px", marginRight: "10px" }} />
    <div>
      <p className="mb-0 font-semibold">Time Taken</p>
      <p className="mb-0">
  {Math.floor(totalTimeTaken / 60)}m {totalTimeTaken % 60}s
</p>    </div>
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
                <td>{Math.floor(sect.timeTaken / 60)}m {sect.timeTaken % 60}s</td>
                <td>
  {typeof sect.s_accuracy === 'number'
    ? `${sect.s_accuracy.toFixed(2)}%`
    : 'N/A'}
</td>
                <td>{sect.rank}</td>
                <td>{sect.percentile}%</td>
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
                <th>  {Math.floor(totalTimeTaken / 60)}m {totalTimeTaken % 60}s</th>
                <th>{isNaN(totalAccuracy) ? 0 : totalAccuracy}</th>
                <th>{Rank}</th>
                <th>{percentile}</th>
                <th>{totalVisited}</th>
                <th>{totalNotVisited}</th>
                <th>{totalCutOff}</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      
      <div className="flex justify-end space-x-4 mt-4">
  {overallScore >= totalCutOff ? (
    <p className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400">
      Cutoff Cleared : {overallScore} / {totalCutOff}
    </p>
  ) : (
    <p className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400">
      Cutoff Not Reached : {overallScore} / {totalCutOff}
    </p>
  )}
</div>
<div>
      <h1 className='font-semibold'>Comparison With Toppers
      </h1>
      <div className='mt-4 space-x-2'>
  {sectionData.map((sect) => (
    <button
      key={sect.name}
      onClick={() => setSelectedComparisonSection(sect.name)}
      className={`px-4 py-2 rounded ${selectedComparisonSection === sect.name ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
    >
      {sect.name}
    </button>
  ))}
</div>
      <div className="table-responsive">
        <table className="table table-bordered table-striped ">
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
  {(() => {
    const stats = getComparisonStats(selectedComparisonSection);
    const rows = ['you', 'average', 'topper'];

    return rows.map((label, idx) => {
      const row = stats[label];
      const labelText = label === 'you' ? 'You' : label.charAt(0).toUpperCase() + label.slice(1);

      return (
        <tr key={idx}>
          <td>{labelText}</td>
          <td>{row.score}</td>
          <td>{row.answered}</td>
          <td>{row.notAnswered}</td>
          <td>{row.correct}</td>
          <td>{row.wrong}</td>
          <td>
  {String(Math.floor(row.time / 60)).padStart(2, '0')}m {String(row.time % 60).padStart(2, '0')}s
</td>          <td>
  {typeof row.accuracy === "number"
    ? `${row.accuracy.toFixed(2)}%`
    : `${row.accuracy}%` }
</td>
        </tr>
      );
    });
  })()}
</tbody>

        </table>
      </div>
    </div>
    <div>
      <h1 className='font-semibold'>Time Management
      </h1>
   
      <div className="table-responsive">
          <table className="table table-bordered table-striped ">
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
  {section.map((sect, index) => {
    const correctMarks = sect.correct * sect.plus_mark;
    const wrongMarks = sect.incorrect * sect.minus_mark;
    const notAnsweredMarks = 0; // usually 0
    const attemptedMarks = correctMarks - wrongMarks;
    
    return (
      <tr key={index}>
        <th scope="row">{sect.name}</th>

        {/* Answered / Marks */}
        <td>
          {sect.Attempted} / {attemptedMarks.toFixed(2)}
        </td>

        {/* Not Answered / Marks */}
        <td>
          {sect.Not_Attempted} / {notAnsweredMarks.toFixed(2)}
        </td>

        {/* Correct / Marks */}
        <td>
          {sect.correct} / {correctMarks.toFixed(2)}
        </td>

        {/* Wrong / Negative Marks */}
        <td>
          {sect.incorrect} / -{wrongMarks.toFixed(2)}
        </td>

        {/* Total Marks Scored / Negative Marks */}
        <td>
          {sect.s_score.toFixed(2)} / -{wrongMarks.toFixed(2)}
        </td>
      </tr>
    );
  })}
</tbody>

<tfoot>
  <tr>
    <th>Overall</th>
    <th>{totalAnswered} / {(totalCorrect * section[0]?.plus_mark - totalWrong * section[0]?.minus_mark).toFixed(2)}</th>
    <th>{totalNotAnswered} / 0</th>
    <th>{totalCorrect} / {(totalCorrect * section[0]?.plus_mark).toFixed(2)}</th>
    <th>{totalWrong} / -{(totalWrong * section[0]?.minus_mark).toFixed(2)}</th>
    <th>{overallScore.toFixed(2)} / -{(totalWrong * section[0]?.minus_mark).toFixed(2)}</th>
  </tr>
</tfoot>
          </table>
        </div>
    </div>
    <h1 className='font-semibold'>Line Graph</h1>
      

<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
  <div style={{ width: '100%', maxWidth: '900px', height: '400px' }}>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
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
    </ResponsiveContainer>
  </div>
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

<div>
  <Percentile alluserDetails={alluserDetails} overallScore={overallScore} initialPercentile={percentile} totelmark={totelmark}/>
</div>

      <div>
        <ResultAnimation/>
      </div>
    </div>
  );
};

export default ResultPage;
