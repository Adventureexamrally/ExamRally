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
  const [analysisData, setAnalysisData] = useState(null);
  const { id } = useParams();
  const [selectedBlueprint, setSelectedBlueprint] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [sectionData, setSectionData] = useState([]);
  const [selectedComparisonSection, setSelectedComparisonSection] = useState('');

  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!user?._id) return;

    Api.get(`results/resultWithAnalysis/${user._id}/${id}`)
      .then(res => {
        console.log("result Data",res.data);
        
        setResultData(res.data.result);
        setAnalysisData({
          overall: res.data.overallStats,
          sections: res.data.sectionStats,
          comparison: res.data.comparisonData,
          rank: res.data.rank,
          totalUsers: res.data.totalUsers,
          percentile: res.data.percentile,
          allScores: res.data.allScores,
          exam: res.data.examDetails
        });
        setSectionData(res.data.sectionStats);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, [id, user]);

  useEffect(() => {
    if (sectionData && sectionData.length > 0) {
      const defaultSection = sectionData[0];
      setSelectedTopic(defaultSection.name);
      setSelectedBlueprint(defaultSection.s_blueprint);
      setSelectedComparisonSection(defaultSection.name);
    }
  }, [sectionData]);

  if (!resultData || !analysisData) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-green-500 fw-bold" style={{ width: '3rem', height: '3rem' }} role="status"></div>
      </div>
    );
  }

  const { overall, sections, comparison, rank, percentile, exam, allScores,totalUsers } = analysisData;

  // Prepare chart data
  const chartData = [
    {
      name: "s_score",
      ...sections.reduce((acc, sect, index) => ({
        ...acc,
        [`section${index + 1}`]: sect.s_score || 0
      }), {})
    },
    {
      name: "Attempted",
      ...sections.reduce((acc, sect, index) => ({
        ...acc,
        [`section${index + 1}`]: sect.Attempted || 0
      }), {})
    },
    {
      name: "Not_Attempted",
      ...sections.reduce((acc, sect, index) => ({
        ...acc,
        [`section${index + 1}`]: sect.Not_Attempted || 0
      }), {})
    },
    {
      name: "Correct",
      ...sections.reduce((acc, sect, index) => ({
        ...acc,
        [`section${index + 1}`]: sect.correct || 0
      }), {})
    },
    {
      name: "Incorrect",
      ...sections.reduce((acc, sect, index) => ({
        ...acc,
        [`section${index + 1}`]: sect.incorrect || 0
      }), {})
    }
  ];

  const handleSectionClick = (sectionName) => {
    const selectedSection = sectionData.find(sect => sect.name === sectionName);
    if (selectedSection) {
      setSelectedTopic(sectionName);
      setSelectedBlueprint(selectedSection.s_blueprint);
    }
  };

  const getComparisonStats = (sectionName) => {
    return comparison[sectionName] || {
      you: {},
      average: {},
      topper: {}
    };
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700 mb-4 md:mb-0">{exam.show_name}</h1>
        <Link to={`/mocksolution/${id}/${user?._id}`}>
          <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center">
            <FaClipboardCheck className="mr-2" />
            View Solution
          </button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Rank */}
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <MdOutlineSkipNext size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Rank</p>
              <p className="text-xl font-bold">{rank}/{totalUsers}</p>
            </div>
          </div>
        </div>

        {/* Mark Scored */}
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <MdScore size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Mark Scored</p>
              <p className="text-xl font-bold">{overall.totalScore}</p>
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
              <p className="text-xl font-bold">{overall.totalAnswered}</p>
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
              <p className="text-xl font-bold">{overall.totalCorrect}</p>
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
              <p className="text-xl font-bold">{overall.totalWrong}</p>
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
              <p className="text-xl font-bold">{overall.totalAccuracy}%</p>
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
                {Math.floor(overall.totalTimeTaken / 60)}m {overall.totalTimeTaken % 60}s
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cutoff Status */}
      <div className="mb-8">
        {overall.totalScore >= exam.cutoff_mark ? (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg">
            <div className="flex items-center">
              <FaCheckCircle className="mr-2" />
              <p className="font-medium">Cutoff Cleared: {overall.totalScore} / {exam.cutoff_mark}</p>
            </div>
          </div>
        ) : (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
            <div className="flex items-center">
              <FaTimesCircle className="mr-2" />
              <p className="font-medium">Cutoff Not Reached:  {overall.totalScore} / {exam.cutoff_mark}</p>
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
              {sections.map((sect, index) => (
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-800">{sect.cutoff_mark}</td>
                </tr>
              ))}
              <tr className="">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">Overall</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">{overall.totalScore}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">{overall.totalAnswered}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">{overall.totalNotAnswered}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">{overall.totalCorrect}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">{overall.totalWrong}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">
                  {Math.floor(overall.totalTimeTaken / 60)}m {overall.totalTimeTaken % 60}s
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">{overall.totalAccuracy}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">{rank}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">{percentile}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">{overall.totalVisited}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">{overall.totalNotVisited}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">{exam.cutoff_mark}</td>
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
          {sections.map((sect) => (
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800">{row.score || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800">{row.Attempted || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800">{row.Not_Attempted || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800">{row.correct || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800">{row.incorrect || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800">
                      {row.timeTaken ? `${Math.floor(row.timeTaken / 60)}m ${row.timeTaken % 60}s` : "0m 0s"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800">
                      {row.s_accuracy ? `${Number(row.s_accuracy).toFixed(2)}%` : "0.00%"}
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
              {sections.map((sect, index) => {
                const correctMarks = sect.correct * sect.plus_mark;
                const wrongMarks = sect.incorrect * sect.minus_mark;
                const notAnsweredMarks = 0;
                
                return (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white hover:bg-green-50' : 'bg-green-50 hover:bg-green-100'}>
                    <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-green-900 fw-bold">{sect.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-800">
                      {sect.Attempted} / {(sect.Attempted * sect.plus_mark).toFixed(0)}
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
                  {overall.totalAnswered} / {(overall.totalAnswered * sections[0]?.plus_mark).toFixed(0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-900">
                  {overall.totalNotAnswered} / 0
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-900">
                  {overall.totalCorrect} / {(overall.totalCorrect * sections[0]?.plus_mark).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-900">
                  {overall.totalWrong} / -{(overall.totalWrong * sections[0]?.minus_mark).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-900">
                  {overall.totalScore.toFixed(2)} / -{(overall.totalWrong * sections[0]?.minus_mark).toFixed(2)}
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
              {sections.map((sect, index) => (
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
          {sections.map((sect, index) => (
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
                    <td className="px-6 py-4 whitespace-nowrap text-md text-indigo-800 fw-bold">   {index + 1}</td>
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
        <Percentile allScores={allScores} overallScore={overall.totalScore} initialPercentile={percentile} totelmark={overall.totelmark}/>
      </div>

      {/* Result Animation */}
      <div>
        <ResultAnimation/>
      </div>
    </div>
  );
};

export default ResultPage;