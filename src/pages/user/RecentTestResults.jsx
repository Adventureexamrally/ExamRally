import DashBoard from "./DashBoard";
import Api from "../../service/Api";
import {
  FaCheckCircle as PassedIcon,
  FaTimesCircle as FailedIcon,
  FaClock as PendingIcon,
  FaSync as RefreshIcon,
  FaInfoCircle as InfoIcon,
  FaChartBar as AnalyticsIcon,
} from "react-icons/fa";
import React, { useState, useContext, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { UserContext } from "../../context/UserProvider";

const RecentTestResults = () => {
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const fetchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await Api.get(`results/${user._id}`);
      setResults(response.data);
      console.log("f", response.data);
    } catch (error) {
      console.error("Error fetching results:", error);
      setError("Failed to load test results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const getStatusIcon = (status) => {
    const iconStyle = "inline-block mr-1";
    switch (status.toLowerCase()) {
      case "passed":
        return <PassedIcon className={`${iconStyle} text-green-500`} />;
      case "failed":
        return <FailedIcon className={`${iconStyle} text-red-500`} />;
      default:
        return <PendingIcon className={`${iconStyle} text-yellow-500`} />;
    }
  };

  const getStatusBadge = (status) => {
    let colorClasses;
    const statusLower = status.toLowerCase();

    if (statusLower === "passed")
      colorClasses = "bg-green-100 text-green-800 border-green-200";
    else if (statusLower === "failed")
      colorClasses = "bg-red-100 text-red-800 border-red-200";
    else colorClasses = "bg-yellow-100 text-yellow-800 border-yellow-200";

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${colorClasses}`}
      >
        {getStatusIcon(status)}
        {status}
      </span>
    );
  };

  const handleRefresh = () => {
    fetchResults();
  };

  const handleViewDetails = (resultId) => {
    console.log("View details for result:", resultId);
  };

  if (error) {
    return (
      <div className="flex flex-col md:flex-row">
        <DashBoard
          handleDrawerToggle={handleDrawerToggle}
          open={open}
          setOpen={setOpen}
        />
        <div className="flex-1 p-4 flex flex-col items-center justify-center h-[80vh]">
          <div className="text-red-600 text-lg font-medium mb-4">{error}</div>
          <button
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={fetchResults}
          >
            <RefreshIcon className="mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row">
      <DashBoard
        handleDrawerToggle={handleDrawerToggle}
        open={open}
        setOpen={setOpen}
      />
      <div className="flex-1 p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Recent Test Results</h2>
          <button
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
            onClick={handleRefresh}
            disabled={loading}
            title="Refresh results"
          >
            <RefreshIcon className={`${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : results.length === 0 ? (
          <div className="border rounded-lg text-center py-8">
            <div className="text-gray-500 text-lg">
              No test results available
            </div>
            <button
              className="flex items-center mx-auto mt-4 px-4 py-2 text-blue-600 hover:text-blue-800"
              onClick={fetchResults}
            >
              <RefreshIcon className="mr-2" />
              Refresh
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((result) => (
              <div
                key={result._id}
                className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                  result.status.toLowerCase() === "passed"
                    ? "border-l-4 border-green-500"
                    : result.status.toLowerCase() === "failed"
                    ? "border-l-4 border-red-500"
                    : "border-l-4 border-yellow-500"
                }`}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium">
                      {result.ExamId?.exam_name || "Untitled Exam"}
                    </h3>
                    {getStatusBadge(result.status)}
                  </div>

                  <div className="border-t my-3"></div>

                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <div className="text-sm text-gray-500">Score:</div>
                      <div className="text-xl font-bold">
                        {result.o_score ?? "N/A"}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-gray-500">Duration:</div>
                      <div className="text-sm">
                        {result.ExamId?.duration
                          ? `${result.ExamId?.duration} mins`
                          : "N/A"}
                      </div>
                    </div>
                  </div>

                  {/* <div className="mt-4 flex justify-between">
                    <button 
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                      onClick={() => handleViewDetails(result._id)}
                    >
                      <InfoIcon className="mr-1" />
                      Details
                    </button>
                    <button 
                      className="flex items-center text-sm text-purple-600 hover:text-purple-800"
                    >
                      <AnalyticsIcon className="mr-1" />
                      Analytics
                    </button>
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentTestResults;
