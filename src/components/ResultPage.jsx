import { useContext, useEffect, useState } from 'react';
import Api from "../service/Api";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import ResultAnimation from '../animationeffect/ResultAnimation';
import { UserContext } from '../context/UserProvider';
import Percentile from './Percentile';
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaChartLine, 
  FaBullseye, 
  FaClipboardCheck,
  FaUser,
  FaUsers,
  FaTrophy,
  FaClock,
  FaBook,
  FaTable
} from 'react-icons/fa';
import { 
  MdQuestionAnswer, 
  MdOutlineSkipNext,
  MdScore,
  MdCompare
} from "react-icons/md";
import { AiOutlineClockCircle } from "react-icons/ai";
import { GiRank3 } from "react-icons/gi";

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


  if (!resultData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700 mb-4 md:mb-0">{show_name}</h1>
        <Link to={`/mocksolution/${id}`}>
          <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center">
            <FaClipboardCheck className="mr-2" />
            View Solution
          </button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Mark Scored */}
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <MdScore size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Mark Scored</p>
              <p className="text-xl font-bold">{overallScore}</p>
            </div>
          </div>
        </div>

        {/* Answered */}
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <MdQuestionAnswer size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Answered</p>
              <p className="text-xl font-bold">{totalAnswered}</p>
            </div>
          </div>
        </div>

        {/* Correct */}
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-emerald-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-emerald-100 text-emerald-600 mr-4">
              <FaCheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Correct</p>
              <p className="text-xl font-bold">{totalCorrect}</p>
            </div>
          </div>
        </div>

        {/* Wrong */}
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
              <FaTimesCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Wrong</p>
              <p className="text-xl font-bold">{totalWrong}</p>
            </div>
          </div>
        </div>

        {/* Skipped */}
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <MdOutlineSkipNext size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Skipped</p>
              <p className="text-xl font-bold">{totalSkipped}</p>
            </div>
          </div>
        </div>

        {/* Percentile */}
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <GiRank3 size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Percentile</p>
              <p className="text-xl font-bold">{percentile}%</p>
            </div>
          </div>
        </div>

        {/* Accuracy */}
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-indigo-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
              <FaBullseye size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Accuracy</p>
              <p className="text-xl font-bold">{isNaN(totalAccuracy) ? 0 : totalAccuracy}%</p>
            </div>
          </div>
        </div>

        {/* Time Taken */}
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-cyan-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-cyan-100 text-cyan-600 mr-4">
              <AiOutlineClockCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Time Taken</p>
              <p className="text-xl font-bold">
                {Math.floor(totalTimeTaken / 60)}m {totalTimeTaken % 60}s
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cutoff Status */}
      <div className="mb-8">
        {overallScore >= totalCutOff ? (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg">
            <div className="flex items-center">
              <FaCheckCircle className="mr-2" />
              <p className="font-medium">Cutoff Cleared: {overallScore} / {totalCutOff}</p>
            </div>
          </div>
        ) : (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
            <div className="flex items-center">
              <FaTimesCircle className="mr-2" />
              <p className="font-medium">Cutoff Not Reached: {overallScore} / {totalCutOff}</p>
            </div>
          </div>
        )}
      </div>

      {/* Section Summary */}
<div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-blue-100">
  <div className="flex items-center mb-6">
    <FaTable className="text-blue-600 mr-2" />
    <h2 className="text-xl font-bold text-blue-800">Sectional Summary</h2>
  </div>
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-blue-200">
      <thead className="bg-blue-50">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-md font-medium fw-bold text-blue-700  tracking-wider">Section Name</th>
          <th scope="col" className="px-6 py-3 text-left text-md font-medium fw-bold text-blue-700  tracking-wider">Score</th>
          <th scope="col" className="px-6 py-3 text-left text-md font-medium fw-bold text-blue-700  tracking-wider">Answered</th>
            <th scope="col" className="px-6 py-3 text-left text-md font-medium fw-bold text-blue-700  tracking-wider">Not Answered</th>
          <th scope="col" className="px-6 py-3 text-left text-md font-medium fw-bold text-blue-700  tracking-wider">Correct</th>
          <th scope="col" className="px-6 py-3 text-left text-md font-medium fw-bold text-blue-700  tracking-wider">Wrong</th>
          <th scope="col" className="px-6 py-3 text-left text-md font-medium fw-bold text-blue-700  tracking-wider">Time Taken</th>
          <th scope="col" className="px-6 py-3 text-left text-md font-medium fw-bold text-blue-700  tracking-wider">Accuracy</th>
          <th scope="col" className="px-6 py-3 text-left text-md font-medium fw-bold text-blue-700  tracking-wider">Rank</th>
          <th scope="col" className="px-6 py-3 text-left text-md font-medium fw-bold text-blue-700  tracking-wider">Percentile</th>
                <th scope="col" className="px-6 py-3 text-left text-md font-medium fw-bold text-blue-700  tracking-wider">Visited</th>
                <th scope="col" className="px-6 py-3 text-left text-md font-medium fw-bold text-blue-700  tracking-wider">Not Visited</th>
                <th scope="col" className="px-6 py-3 text-left text-md font-medium fw-bold text-blue-700  tracking-wider">Cutoff</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-blue-100">
        {sectionData.map((sect, index) => (
          <tr key={index} className={index % 2 === 0 ? 'bg-white hover:bg-blue-50' : 'bg-blue-50 hover:bg-blue-100'}>
            <td className="px-6 py-4 whitespace-nowrap text-md fw-bold font-medium text-blue-900">{sect.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-800">{sect.s_score}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-800">{sect.Attempted}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-800">{sect.Not_Attempted}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-800">{sect.correct}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-800">{sect.incorrect}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-800">
              {Math.floor(sect.timeTaken / 60)}m {sect.timeTaken % 60}s
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-800">
              {typeof sect.s_accuracy === 'number' ? `${sect.s_accuracy.toFixed(2)}%` : 'N/A'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-800">{sect.rank}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-800">{sect.percentile}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-800">{sect.isVisited}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-800">{sect.NotVisited}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-800">{sect.cutoff_mark}</td></tr>
        ))}
        <tr className="">
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">Overall</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">{overallScore}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">{totalAnswered}</td>
           <th className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">{totalNotAnswered}</th>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">{totalCorrect}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">{totalWrong}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">
            {Math.floor(totalTimeTaken / 60)}m {totalTimeTaken % 60}s
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">{isNaN(totalAccuracy) ? 0 : totalAccuracy}%</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">{Rank}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">{percentile}%</td>
          <th className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">{totalVisited}</th>
          <th className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">{totalNotVisited}</th>
          <th className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">{totalCutOff}</th>

        </tr>
      </tbody>
    </table>
  </div>
</div>

      {/* Comparison Section */}
<div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-purple-100">
  <div className="flex items-center mb-6">
    <MdCompare className="text-purple-600 mr-2" />
    <h2 className="text-xl font-bold text-purple-800">Comparison With Toppers</h2>
  </div>
  
  <div className="flex flex-wrap gap-2 mb-6">
    {sectionData.map((sect) => (
      <button
        key={sect.name}
        onClick={() => setSelectedComparisonSection(sect.name)}
        className={`px-4 py-2 rounded-md transition ${selectedComparisonSection === sect.name 
          ? 'bg-purple-600 text-white' 
          : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
      >
        {sect.name}
      </button>
    ))}
  </div>
  
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-purple-200">
      <thead className="bg-purple-50">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-md fw-bold font-medium text-purple-700  tracking-wider">Category</th>
          <th scope="col" className="px-6 py-3 text-left text-md fw-bold font-medium text-purple-700  tracking-wider">Score</th>
          <th scope="col" className="px-6 py-3 text-left text-md fw-bold font-medium text-purple-700  tracking-wider">Answered</th>
          <th scope="col" className="px-6 py-3 text-left text-md fw-bold font-medium text-purple-700  tracking-wider">Not answered</th>
          <th scope="col" className="px-6 py-3 text-left text-md fw-bold font-medium text-purple-700  tracking-wider">Correct</th>
          <th scope="col" className="px-6 py-3 text-left text-md fw-bold font-medium text-purple-700  tracking-wider">Wrong</th>
          <th scope="col" className="px-6 py-3 text-left text-md fw-bold font-medium text-purple-700  tracking-wider">Time</th>
          <th scope="col" className="px-6 py-3 text-left text-md fw-bold font-medium text-purple-700  tracking-wider">Accuracy</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-purple-100">
        {(() => {
          const stats = getComparisonStats(selectedComparisonSection);
          return [
            { label: 'You', icon: <FaUser className="text-purple-600" />, ...stats.you },
            { label: 'Average', icon: <FaUsers className="text-purple-500" />, ...stats.average },
            { label: 'Topper', icon: <FaTrophy className="text-yellow-500" />, ...stats.topper }
          ].map((row, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? 'bg-white hover:bg-purple-50' : 'bg-purple-50 hover:bg-purple-100'}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-2">
                    {row.icon}
                  </div>
                  <div className="text-md fw-bold font-medium text-purple-900">{row.label}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800">{isNaN(row.score) ? 0 : row.score}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800">{isNaN(row.answered) ? 0 : row.answered}</td>
               <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800">{isNaN(row.notAnswered) ? 0 :row.notAnswered}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800">{isNaN(row.correct) ? 0 : row.correct}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800">{isNaN(row.wrong) ? 0 : row.wrong}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800">
                {isNaN(row.time)
                  ? "0"
                  : `${String(Math.floor(row.time / 60)).padStart(2, '0')}m ${String(row.time % 60).padStart(2, '0')}s`}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800">
{!isNaN(Number(row.accuracy)) && row.accuracy !== null
  ? `${Number(row.accuracy).toFixed(2)}%`
  : "0.00%"}

              </td>
            </tr>
          ));
        })()}
      </tbody>
    </table>
  </div>
</div>

      {/* Time Management */}
<div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-green-100">
  <div className="flex items-center mb-6">
    <FaClock className="text-green-600 mr-2" />
    <h2 className="text-xl font-bold text-green-800">Time Management</h2>
  </div>
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-green-200">
      <thead className="bg-green-50">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-md font-medium fw-bold text-green-700  tracking-wider">Section</th>
          <th scope="col" className="px-6 py-3 text-left text-md fw-bold font-medium text-green-700  tracking-wider">Answered/Marks</th>
                          <th scope="col" className="px-6 py-3 text-left text-md fw-bold font-medium text-green-700  tracking-wider">Not Answered/Marks</th>
          <th scope="col" className="px-6 py-3 text-left text-md fw-bold font-medium text-green-700  tracking-wider">Correct/Marks</th>
          <th scope="col" className="px-6 py-3 text-left text-md fw-bold font-medium text-green-700  tracking-wider">Wrong/-ve Marks</th>
          <th scope="col" className="px-6 py-3 text-left text-md fw-bold font-medium text-green-700  tracking-wider">Total Mark Scored / Negative MarK</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-green-100">
        {section.map((sect, index) => {
          const correctMarks = sect.correct * sect.plus_mark;
          const wrongMarks = sect.incorrect * sect.minus_mark;
              const notAnsweredMarks = 0; // usually 0
          const attemptedMarks = correctMarks - wrongMarks;
          
          return (
            <tr key={index} className={index % 2 === 0 ? 'bg-white hover:bg-green-50' : 'bg-green-50 hover:bg-green-100'}>
              <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-green-900 fw-bold">{sect.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-800">
                {sect.Attempted} / {(sect.Attempted * section[0]?.plus_mark).toFixed(0)}
              </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-800">
          {sect.Not_Attempted} / {notAnsweredMarks.toFixed(2)}
        </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-800">
                {sect.correct} / {correctMarks.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-800">
                {sect.incorrect} / -{wrongMarks.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-800">
                {sect.s_score.toFixed(2)} / -{wrongMarks.toFixed(2)}
              </td>
            </tr>
          );
        })}
        <tr className="">
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-900">Overall</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-900">
            {totalAnswered} / {(totalAnswered * section[0]?.plus_mark).toFixed(0)}
          </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-900">
                {totalNotAnswered} / 0
              </td>

          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-900">
            {totalCorrect} / {(totalCorrect * section[0]?.plus_mark).toFixed(2)}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-900">
            {totalWrong} / -{(totalWrong * section[0]?.minus_mark).toFixed(2)}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-900">
            {overallScore.toFixed(2)} / -{(totalWrong * section[0]?.minus_mark).toFixed(2)}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

      {/* Performance Graph */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-6">
          <FaChartLine className="text-blue-500 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">Performance Analysis</h2>
        </div>
        <div className="h-80">
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

      {/* Scoring Blueprint */}
<div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-indigo-100">
  <div className="flex items-center mb-6">
    <FaBook className="text-indigo-600 mr-2" />
    <h2 className="text-xl font-bold text-indigo-800">Scoring Blueprint</h2>
  </div>
  
  <div className="flex flex-wrap gap-2 mb-6">
    {sectionData.map((sect, index) => (
      <button
        key={index}
        onClick={() => handleSectionClick(sect.name)}
        className={`px-4 py-2 rounded-md transition ${selectedTopic === sect.name 
          ? 'bg-indigo-600 text-white' 
          : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
      >
        {sect.name}
      </button>
    ))}
  </div>
  
  {selectedBlueprint && (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-indigo-200">
        <thead className="bg-indigo-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-md fw-bold font-medium text-indigo-700  tracking-wider">Order of Selection</th>
            <th scope="col" className="px-6 py-3 text-left text-md fw-bold font-medium text-indigo-700  tracking-wider">Topic</th>
            <th scope="col" className="px-6 py-3 text-left text-md fw-bold font-medium text-indigo-700  tracking-wider">Time Taken (Min*)</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-indigo-100">
          {selectedBlueprint.map((item, index) => (
            <tr key={item._id} className={index % 2 === 0 ? 'bg-white hover:bg-indigo-50' : 'bg-indigo-50 hover:bg-indigo-100'}>
              <td className="px-6 py-4 whitespace-nowrap text-md text-indigo-800 fw-bold">{item.subject}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-800">{item.topic}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-800">{item.tak_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>

      {/* Percentile Analysis */}
      <div className="mb-8">
        <Percentile alluserDetails={alluserDetails} overallScore={overallScore} initialPercentile={percentile} totelmark={totelmark}/>
      </div>

      {/* Result Animation */}
      <div>
        <ResultAnimation/>
      </div>
    </div>
  );
};

export default ResultPage;
