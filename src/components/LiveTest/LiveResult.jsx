import { useContext, useEffect, useState } from "react";
import Api from "../../service/Api";
import { useLocation, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";
import { UserContext } from "../../context/UserProvider";
import {
  FaSpellCheck,
  FaKeyboard,
  FaRegFileWord,
  FaSearch,
  FaStar,
  FaAlignLeft,
} from "react-icons/fa";
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
  FaTable,
} from "react-icons/fa";
import {
  MdQuestionAnswer,
  MdOutlineSkipNext,
  MdScore,
  MdCompare,
} from "react-icons/md";
import { AiOutlineClockCircle } from "react-icons/ai";
import { GiRank3 } from "react-icons/gi";
import ResultAnimation from "../../animationeffect/ResultAnimation";

const LiveResult = () => {
  const [resultData, setResultData] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const { id } = useParams();
  const [selectedBlueprint, setSelectedBlueprint] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [sectionData, setSectionData] = useState([]);
  const [examData, setExamData] = useState(null);
  const [show_name, setShow_name] = useState("");
  const [topictype, setTopictype] = useState([]);

  const { user } = useContext(UserContext);

  // Function to calculate descriptive scores based on t_mark
  const calculateDescriptiveScore = (scoreData, sectionMarks) => {
    if (!scoreData || !sectionMarks) return null;

    const totalMarks = sectionMarks;
    
    // Calculate individual scores based on total marks
    const spellingScore = (scoreData.spellingScore / 35) * (totalMarks * 0.35);
    const grammarScore = (scoreData.grammarScore / 35) * (totalMarks * 0.35);
    const wordCountScore = (scoreData.wordCountScore / 20) * (totalMarks * 0.20);
    const keywordScore = (scoreData.keywordScore / 10) * (totalMarks * 0.10);

    const totalScore = spellingScore + grammarScore + wordCountScore + keywordScore;
  console.log("Calculated Scores:", {
      spellingScore,
      grammarScore,
      wordCountScore,
      keywordScore,
      totalScore,
    });
    return {
      spellingScore: Math.round(spellingScore * 100) / 100,
      grammarScore: Math.round(grammarScore * 100) / 100,
      wordCountScore: Math.round(wordCountScore * 100) / 100,
      keywordScore: Math.round(keywordScore * 100) / 100,
      totalScore: Math.round(totalScore * 100) / 100,
      totalMarks: totalMarks,
      originalScores: scoreData // Keep original scores for reference
    };
  };

  useEffect(() => {
    if (!user?._id) return;

    // Single API call to get all result data
    Api.get(`results/resultWithAnalysis/${user._id}/${id}`)
      .then(res => {
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
        setShow_name(res.data.examDetails.show_name);

        // Fetch exam details separately for topic type
        Api.get(`exams/getExam/${id}`)
          .then((res) => {
            if (res.data) {
              setExamData(res.data);
              setTopictype(res.data.topic_test.subject);
            }
          })
          .catch((err) => console.error("Error fetching exam data:", err));
      })
      .catch(error => {
        console.error("Error fetching result analysis:", error);
      });
  }, [id, user]);

  useEffect(() => {
    if (sectionData && sectionData.length > 0) {
      const defaultSection = sectionData[0];
      setSelectedTopic(defaultSection.name);
      setSelectedBlueprint(defaultSection.s_blueprint);
    }
  }, [sectionData]);

  if (!resultData || !analysisData) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-green-500 fw-bold" style={{ width: '3rem', height: '3rem' }} role="status"></div>
      </div>
    );
  }

  const { overall, sections, comparison, rank, totalUsers, percentile, exam } = analysisData;

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

  const location = useLocation();
  const selectedLanguage = location.state?.language || "English";

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0"),
    ].join(":");
  }

  return (
    <>
      {String(topictype).toLowerCase().includes("descriptive")  ? (
        <div className="container mx-auto px-4 py-6">
          <div>
            <h1 className="text-2xl font-bold text-green-500 mb-4 md:mb-0">
              {show_name}
            </h1>
          </div>

          {resultData?.section?.length > 0 ? (
            resultData.section.map((sec, index) => {
              // Get section marks (t_mark) for this section
              const sectionMarks = sec.t_mark || 10; // Default to 10 if not available
              
              return (
                <div key={index} className="mb-4">
                  <div className="bg-green-500 flex justify-between items-center p-3 rounded-md">
                    <h2 className="text-white font-medium">
                      Section {index + 1} ({sec.name}): Total Marks - {sectionMarks}
                    </h2>
                    <h2 className="text-white font-semibold">
                      Time Taken – {formatTime(sec.timeTaken ?? 0)}
                    </h2>
                  </div>

                  <div className="ml-4 mt-2 space-y-2">
                    {sec.questions?.[selectedLanguage?.toLowerCase()]?.map(
                      (question, qIndex) => (
                        <div key={qIndex}>
                        <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200 mt-4 shadow-lg">
  <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full text-sm font-bold flex-shrink-0">
    {index + 1}.{qIndex + 1}
  </span>
  <p className="text-gray-800 font-medium flex-1 leading-relaxed"  dangerouslySetInnerHTML={{
                              __html: question.question,
                            }}/>
</div>
                          {/* Descriptive Answer Section */}
                          {question.descriptive?.map((item, dIndex) => {
                            // Calculate scores based on section marks
                            const calculatedScores = item.scoreData 
                              ? calculateDescriptiveScore(item.scoreData, sectionMarks)
                              : null;

                            return (
                              <div key={dIndex} className="mt-4">

                                   <h2 className="font-semibold text-green-500 text-xl mt-3 font">
                                  Your Answer:
                                </h2>

                                <p className="p-4">
                                  <strong className="text-blue-800">Your Text:</strong>{" "}
                                  &nbsp; &nbsp; &nbsp; {item.text?.[0] || "No answer provided"}
                                </p>
                                {calculatedScores && item.text?.[0] && (
                                  <div className="flex flex-wrap gap-4 justify-center w-full max-w-5xl">
                                    {/* Spelling */}
                                    <div className="w-full sm:w-64 bg-white rounded-lg shadow-md p-4">
                                      <div className="flex items-center mb-2">
                                        <FaSpellCheck className="text-blue-800 mr-2" />
                                        <h4 className="text-md font-semibold text-gray-800">
                                          Spelling Score
                                        </h4>
                                      </div>
                                      <div className="text-xl font-bold text-blue-800">
                                        {calculatedScores.spellingScore}/{(sectionMarks * 0.35)}
                                      </div>
                                    
                                    </div>

                                    {/* Grammar */}
                                    <div className="w-full sm:w-64 bg-white rounded-lg shadow-md p-4">
                                      <div className="flex items-center mb-2">
                                        <FaKeyboard className="text-blue-800 mr-2" />
                                        <h4 className="text-md font-semibold text-gray-800">
                                          Grammar Score
                                        </h4> 
                                      </div>
                                      <div className="text-xl font-bold text-blue-800">
                                        {calculatedScores.grammarScore}/{(sectionMarks * 0.35)}
                                      </div>
                                   
                                      </div>

                                    {/* Word Count */}
                                    <div className="w-full sm:w-64 bg-white rounded-lg shadow-md p-4">
                                      <div className="flex items-center mb-2">
                                        <FaAlignLeft className="text-blue-800 mr-2" />
                                        <h4 className="text-md font-semibold text-gray-800">
                                          Word Count Score
                                        </h4>
                                      </div>
                                      <div className="text-xl font-bold text-blue-800">
                                        {calculatedScores.wordCountScore}/{(sectionMarks * 0.20)}
                                      </div>
                                   
                                    </div>

                                    {/* Keywords */}
                                    <div className="w-full sm:w-64 bg-white rounded-lg shadow-md p-4">
                                      <div className="flex items-center mb-2">
                                        <FaSearch className="text-blue-800 mr-2" />
                                        <h4 className="text-md font-semibold text-gray-800">
                                          Keyword Score
                                        </h4>
                                      </div>
                                      <div className="text-xl font-bold text-blue-800">
                                        {calculatedScores.keywordScore}/{(sectionMarks * 0.10)}
                                      </div>
                                   
                                    </div>

                                    {/* Total Words */}
                                    <div className="w-full sm:w-64 bg-white rounded-lg shadow-md p-4">
                                      <div className="flex items-center mb-2">
                                        <FaRegFileWord className="text-blue-800 mr-2" />
                                        <h4 className="text-md font-semibold text-gray-800">
                                          Total Words
                                        </h4>
                                      </div>
                                      <div className="text-xl font-bold text-blue-800">
                                        {item.scoreData.totalWords || 0}/{item.scoreData.expectedWordCount || 0}
                                      </div>
                                    </div>

                                    {/* Total Score */}
                                    <div className="w-full sm:w-64 bg-white rounded-lg shadow-md p-4">
                                      <div className="flex items-center mb-2">
                                        <FaStar className="text-green-400 mr-2" />
                                        <h4 className="text-md font-semibold text-gray-800">
                                          Total Score
                                        </h4>
                                        <FaStar className="text-green-400 ml-2" />
                                      </div>
                                      <div className="text-xl font-bold text-blue-800">
                                        {calculatedScores.totalScore}/{sectionMarks}
                                      </div>
                                     
                                    </div>
                                  </div>
                                )}

                             

                                {/* Score Breakdown */}
                                <div className="space-y-6 mt-4">
                                  {item.corrections?.map((correction, idx) => (
                                    <div
                                      key={idx}
                                      className="relative p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                                    >
                                     <div className="relative z-10 bg-gray-50 rounded-lg p-5 border-l-4 border-blue-500">
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      <span className="font-semibold text-gray-700">AI Improved Answer :- </span>
    </div>
    
    <div className="flex flex-col gap-2 pl-6">
      <div className="flex flex-col sm:flex-row gap-2">
    
        <span className="text-gray-800 font-medium flex-1">
          {correction.corrected || "N/A"}
        </span>
      </div>
    </div>
  </div>
</div>
                                    </div>
                                  ))}
                                    <ResultAnimation/>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p>No Descriptive data Available.</p>
          )}
        </div>
      ) : (
        // ... (rest of your existing MCQ code remains the same)
          <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-bold text-green-700 mb-4 md:mb-0">
              {show_name}
            </h1>
            <Link to={`/livesolution/${id}/${user?._id}`}>
              <button className="bg-green-600 hover:bg-green-700 text-white fw-bold  font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center">
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

            {/* Skipped */}
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                  <MdOutlineSkipNext size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Skipped</p>
                  <p className="text-xl font-bold">{overall.totalSkipped}</p>
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
                  <p className="text-xl font-bold">
                    {overall.totalAccuracy}%
                  </p>
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
                  <p className="font-medium">
                    Cutoff Cleared: {overall.totalScore} / {exam.cutoff_mark}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
                <div className="flex items-center">
                  <FaTimesCircle className="mr-2" />
                  <p className="font-medium">
                    Cutoff Not Reached: {overall.totalScore} / {exam.cutoff_mark}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-blue-100">
            <div className="flex items-center mb-6">
              <FaTable className="text-blue-600 mr-2" />
              <h2 className="text-xl font-bold text-blue-800">
                Sectional Summary
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-blue-200">
                <thead className="bg-blue-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-sm fw-bold font-medium text-blue-700 tracking-wider">
                      Section Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-sm fw-bold font-medium text-blue-700 tracking-wider">
                      Score
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-sm fw-bold font-medium text-blue-700 tracking-wider">
                      Answered
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-sm fw-bold font-medium text-blue-700 tracking-wider">
                      Not Answered
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-sm fw-bold font-medium text-blue-700 tracking-wider">
                      Correct
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-sm fw-bold font-medium text-blue-700 tracking-wider">
                      Wrong
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-sm fw-bold font-medium text-blue-700 tracking-wider">
                      Time Taken
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-sm fw-bold font-medium text-blue-700 tracking-wider">
                      Accuracy
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-sm fw-bold font-medium text-blue-700 tracking-wider">
                      Rank
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-sm fw-bold font-medium text-blue-700 tracking-wider">
                      Percentile
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-sm fw-bold font-medium text-blue-700 tracking-wider">
                      Visited
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-sm fw-bold font-medium text-blue-700 tracking-wider">
                      Not Visited
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-sm fw-bold font-medium text-blue-700 tracking-wider">
                      Cutoff
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-blue-100">
                  {sections.map((sect, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white hover:bg-blue-50" : "bg-blue-50 hover:bg-blue-100"}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm fw-bold font-medium text-blue-900">
                        {sect.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-800">
                        {sect.s_score}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-800">
                        {sect.Attempted}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-800">
                        {sect.Not_Attempted}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-800">
                        {sect.correct}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-800">
                        {sect.incorrect}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-800">
                        {Math.floor(sect.timeTaken / 60)}m {sect.timeTaken % 60}s
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-800">
                        {typeof sect.s_accuracy === "number" ? `${sect.s_accuracy.toFixed(2)}%` : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-800">
                        {sect.rank}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-800">
                        {sect.percentile}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-800">
                        {sect.isVisited}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-800">
                        {sect.NotVisited}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-800">
                        {sect.cutoff_mark}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance Graph */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center mb-6">
              <FaChartLine className="text-blue-500 mr-2" />
              <h2 className="text-xl font-bold text-gray-800">
                Performance Analysis
              </h2>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis
                    ticks={[5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]}
                  />
                  <Tooltip />
                  <Legend />
                  {sections.map((sect, index) => (
                    <Line
                      key={index}
                      type="monotone"
                      dataKey={`section${index + 1}`}
                      name={sect.name}
                      stroke={
                        index === 0
                          ? "#15803d"
                          : index === 1
                            ? "#1d4ed8"
                            : index === 2
                              ? "#6d28d9"
                              : `#${Math.floor(Math.random() * 16777215).toString(16)}`
                      }
                      strokeWidth={2}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <ResultAnimation />
          </div>
        </div>
      )}
    </>
  );
};

export default LiveResult;