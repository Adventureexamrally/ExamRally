import DashBoard from "./DashBoard";
import Api from "../../service/Api";
import {
  FaCheckCircle as PassedIcon,
  FaTimesCircle as FailedIcon,
  FaClock as PendingIcon,
  FaSync as RefreshIcon,
  FaFilePdf,
  FaBook,
} from "react-icons/fa";
import React, { useState, useContext, useEffect, useCallback, useMemo } from "react";
import { useUser } from "@clerk/clerk-react";
import { UserContext } from "../../context/UserProvider";

const RecentTestResults = () => {
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // "all" | "live" | "pdf"
  const { user } = useContext(UserContext);

  const fetchResults = useCallback(async () => {
    if (!user?._id) return;
    setLoading(true);
    setError(null);
    try {
      // Fetch both live and PDF results in parallel (same pattern as mobile app)
      const [liveRes, pdfRes] = await Promise.all([
        Api.get(`results/${user._id}`).catch((e) => { console.warn("Live results failed:", e); return { data: [] }; }),
        Api.get(`PDFresults/${user._id}`).catch((e) => { console.warn("PDF results failed:", e); return { data: [] }; }),
      ]);

      const liveResults = (liveRes.data || []).map((r) => ({ ...r, resultType: "live" }));
      const pdfResults = (pdfRes.data || []).map((r) => ({ ...r, resultType: "pdf" }));

      const combined = [...liveResults, ...pdfResults].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });

      setResults(combined);
    } catch (err) {
      console.error("Error fetching results:", err);
      setError("Failed to load test results. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => { fetchResults(); }, [fetchResults]);

  const filtered = useMemo(() => {
    if (activeTab === "all") return results;
    return results.filter((r) => r.resultType === activeTab);
  }, [results, activeTab]);

  const liveCount = useMemo(() => results.filter((r) => r.resultType === "live").length, [results]);
  const pdfCount = useMemo(() => results.filter((r) => r.resultType === "pdf").length, [results]);

  const getStatusBadge = (status = "") => {
    const s = status.toLowerCase();
    const cfg =
      s === "passed" || s === "completed"
        ? { bg: "bg-green-100 text-green-800 border-green-200", Icon: PassedIcon }
        : s === "failed"
          ? { bg: "bg-red-100 text-red-800 border-red-200", Icon: FailedIcon }
          : { bg: "bg-yellow-100 text-yellow-800 border-yellow-200", Icon: PendingIcon };
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${cfg.bg}`}>
        <cfg.Icon className="text-xs" />
        {status || "Pending"}
      </span>
    );
  };

  const getExamName = (result) =>
    result.ExamId?.exam_name ||
    result.ExamId?.title ||
    result.examName ||
    "Untitled Exam";

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "N/A";

  const formatDuration = (s) => {
    if (!s || s <= 0) return "N/A";
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m${sec > 0 ? ` ${sec}s` : ""}`;
  };

  const borderColor = (status = "") => {
    const s = status.toLowerCase();
    if (s === "passed" || s === "completed") return "border-l-4 border-green-500";
    if (s === "failed") return "border-l-4 border-red-500";
    return "border-l-4 border-yellow-500";
  };

  return (
    <div className="flex flex-col md:flex-row">
      <DashBoard handleDrawerToggle={() => setOpen(!open)} open={open} setOpen={setOpen} />

      <div className="flex-1 p-4 md:p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Recent Test Results</h2>
            <p className="text-sm text-gray-500 mt-0.5">All your exam attempts in one place</p>
          </div>
          <button
            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition"
            onClick={fetchResults}
            disabled={loading}
            title="Refresh results"
          >
            <RefreshIcon className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {[
            { key: "all", label: `All (${results.length})` },
            { key: "live", label: `Live Tests (${liveCount})`, Icon: FaBook },
            { key: "pdf", label: `PDF Tests (${pdfCount})`, Icon: FaFilePdf },
          ].map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition ${activeTab === key
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
            >
              {Icon && <Icon className="text-xs" />}
              {label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-60 gap-3">
            <p className="text-red-600 font-medium">{error}</p>
            <button onClick={fetchResults} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
              <RefreshIcon /> Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-60 gap-2 border rounded-xl bg-gray-50">
            <div className="text-4xl">📋</div>
            <p className="text-gray-500 font-medium">No results found</p>
            <p className="text-gray-400 text-sm">
              {activeTab === "all" ? "Complete a test to see results here." : `No ${activeTab === "live" ? "Mock Test" : "PDF"} exam results yet.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((result) => (
              <div
                key={result._id}
                className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${borderColor(result.status)}`}
              >
                <div className="p-4">
                  {/* Type badge + exam name */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      {result.resultType === "pdf" ? (
                        <FaFilePdf className="text-purple-500 flex-shrink-0 text-sm" />
                      ) : (
                        <FaBook className="text-blue-500 flex-shrink-0 text-sm" />
                      )}
                      <h3 className="text-base font-semibold text-gray-800 truncate">
                        {getExamName(result)}
                      </h3>
                    </div>
                    {getStatusBadge(result.status)}
                  </div>

                  <div className="border-t my-3" />

                  {/* Score + Duration */}
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <div className="text-xs text-gray-400 mb-0.5">Score</div>
                      <div className="text-2xl font-bold text-gray-800">
                        {result.o_score ?? 0}
                        {result.ExamId?.total_marks && (
                          <span className="text-sm font-normal text-gray-400"> / {result.ExamId.total_marks}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400 mb-0.5">Duration</div>
                      <div className="text-sm text-gray-600">
                        {result.ExamId?.duration ? formatDuration(result.ExamId.duration) : "N/A"}
                      </div>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <span>📅</span>
                    <span>{formatDate(result.createdAt)}</span>
                    <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-medium ${result.resultType === "pdf"
                        ? "bg-purple-50 text-purple-600"
                        : "bg-blue-50 text-blue-600"
                      }`}>
                      {result.resultType === "pdf" ? "PDF Exam" : "Mock Test"}
                    </span>
                  </div>
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
