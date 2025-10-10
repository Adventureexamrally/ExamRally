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
  console.log(sectionMarks);
              
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
                        <div className="flex items-start gap-3 p-4 bg-[#131656] rounded-lg border border-gray-200 mt-4 shadow-lg">
  <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full text-sm font-bold flex-shrink-0">
    {index + 1}.{qIndex + 1}
  </span>
  <p className="text-white font-medium flex-1 leading-relaxed"  dangerouslySetInnerHTML={{
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
        <p>Loading...</p>
      )}
    </>
  );
};

export default LiveResult;