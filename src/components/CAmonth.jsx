import React, { useState, useEffect, useContext, useCallback } from "react";
import Api from "../service/Api";
import { useNavigate } from "react-router-dom";
import { FaChevronUp, FaChevronDown, FaCloudDownloadAlt } from "react-icons/fa";
import { UserContext } from "../context/UserProvider";

const CAmonth = ({ course }) => {
  const [CA, setCA] = useState([]);
  const navigate = useNavigate();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const { user, utcNow } = useContext(UserContext);
  const [resultData, setResultData] = useState({});
  const [expiredate, setExpirydate] = useState(null);
  console.log("isEnrolled", isEnrolled);

  // Get test status from localStorage
  const getTestStatusFromStorage = useCallback((examId) => {
    try {
      const storedData = localStorage.getItem(`test-${examId}`);
      return storedData ? JSON.parse(storedData) : null;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return null;
    }
  }, []);

  // Check if user is signed in
  const isSignedIn = !!user?._id;

  // Fetch UTC time
  // Fetch CA data
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const response = await Api.get("topic-test/getAffairs/all");
        if (isMounted) {
          setCA(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Check enrollment and fetch results
  useEffect(() => {
    if (!user?._id || !CA.length || !utcNow) return;

    let isMounted = true;
    const allExamIds = [];

    // Flatten all exam IDs
    CA.forEach((ca) => {
      ca.currentAffair?.week?.forEach((week) => {
        week?.model?.forEach((modelItem) => {
          modelItem?.exams?.forEach((examId) => {
            if (examId && !allExamIds.includes(examId)) {
              allExamIds.push(examId);
            }
          });
        });
      });
    });

    // Check enrollment status
    const checkEnrollment = () => {
      const checkExpiry = (course) => {
        if (!course?.expiryDate) return false;
        const expireDate = new Date(course.expiryDate);
        const timeDiff = expireDate.getTime() - utcNow.getTime();
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (!isNaN(daysLeft)) {
          setExpirydate(daysLeft);
          return daysLeft >= 0;
        }
        return false;
      };

      const enrolledFromCourses =
        user.enrolledCourses?.some(checkExpiry) || false;
      const enrolledFromSubscriptions =
        user.subscriptions?.some(checkExpiry) || false;

      return enrolledFromCourses || enrolledFromSubscriptions;
    };

    setIsEnrolled(checkEnrollment());

    // Fetch results for each exam
    const fetchResults = async () => {
      const results = {};
      for (const examId of allExamIds) {
        try {
          const res = await Api.get(`/results/${user._id}/${examId}`);
          if (
            res.data?.status === "completed" ||
            res.data?.status === "paused"
          ) {
            results[examId] = {
              ...res.data,
              lastQuestionIndex: res.data.lastVisitedQuestionIndex,
              selectedOptions: res.data.selectedOptions,
            };
          }
        } catch (err) {
          console.error(`Error fetching result for exam ${examId}:`, err);
        }
      }
      if (isMounted) {
        setResultData(results);
      }
    };

    fetchResults();
    return () => {
      isMounted = false;
    };
  }, [user, CA, utcNow]);

  const openNewWindow = useCallback((url) => {
    const width = window.screen.width;
    const height = window.screen.height;
    window.open(
      url,
      "_blank",
      `noopener,noreferrer,width=${width},height=${height}`
    );
  }, []);

  const toggleWeek = useCallback((weekTitle) => {
    setExpandedWeeks((prev) => ({
      ...prev,
      [weekTitle]: !prev[weekTitle],
    }));
  }, []);

  if (!CA.length) {
    return <div className="mt-5 p-4">Loading current affairs...</div>;
  }

  return (
    <div className="mt-5 p-4">
      {CA.map((ca) => (
        <div
          key={ca.currentAffair.month}
          className="mb-4 p-3 rounded-lg shadow-md"
        >
          <h2 className="text-xl font-semibold mb-2 text-indigo-700">
            Month: {ca.currentAffair.month}
          </h2>
          {ca.currentAffair.week.map((week) => (
            <div key={week.title} className="mb-2 border rounded-md">
              <div
                className="p-3 cursor-pointer flex justify-between items-center"
                onClick={() => toggleWeek(week.title)}
              >
                <span className="font-medium text-gray-800">{week.title}</span>
                <span>
                  {expandedWeeks[week.title] ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </span>
              </div>
              {expandedWeeks[week.title] && (
                <div className="p-3 bg-gray-100">
                  <div className="flex flex-wrap justify-center items-center gap-4">
                    {week.model.map((model) => {
                      const examId = model.exams?.[0];
                      const testStatus =
                        resultData[examId]?.status ||
                        getTestStatusFromStorage(examId)?.status;

                      return (
                        <div
                          key={model.show_name}
                          className="p-3 rounded-md shadow-md hover:shadow-lg bg-white border-1"
                        >
                          <h3 className="font-semibold mb-2 text-center py-3">
                            {model.show_name}
                          </h3>
                          <div className="flex flex-col items-center gap-2">
                            <div className="flex flex-row justify-center gap-4">
                              {model.pdfLink ? (
                                <a
                                  href={model.pdfLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white py-2 px-4 rounded-lg text-sm text-center font-semibold transition-colors duration-300"
                                >
                                  <FaCloudDownloadAlt className="m-1 text-sm" />{" "}
                                  PDF
                                </a>
                              ) : (
                                <button
                                  disabled
                                  className="flex items-center justify-center bg-gray-200 text-gray-500 py-2 px-4 rounded-lg text-sm text-center font-semibold cursor-not-allowed"
                                >
                                  <FaCloudDownloadAlt className="m-1" /> PDF
                                </button>
                              )}

                              {isEnrolled && model.pdfLink ? (
                                <button
                                  className={`py-2 px-4 rounded transition w-full ${
                                    testStatus === "completed"
                                      ? "bg-green-500 text-white hover:bg-green-600"
                                      : testStatus === "paused"
                                      ? "bg-yellow-500 text-white hover:bg-yellow-600"
                                      : "bg-blue-500 text-white hover:bg-blue-600"
                                  }`}
                                  onClick={() => {
                                    if (!isSignedIn) {
                                      navigate("/sign-in");
                                      return;
                                    }

                                    if (testStatus === "completed") {
                                      openNewWindow(
                                        `/liveresult/${examId}/${user._id}`
                                      );
                                    } else if (testStatus === "paused") {
                                      openNewWindow(
                                        `/mocklivetest/${examId}/${user._id}`
                                      );
                                    } else {
                                      openNewWindow(
                                        `/instruct/${examId}/${user._id}`
                                      );
                                    }
                                  }}
                                >
                                  {testStatus === "completed"
                                    ? "View Result"
                                    : testStatus === "paused"
                                    ? "Resume"
                                    : "Take Test"}
                                </button>
                              ) : (
                                <button
                                  disabled
                                  className="py-2 px-4 rounded w-full bg-gray-300 text-gray-500 cursor-not-allowed"
                                >
                                  Test Disabled
                                </button>
                              )}
                            </div>

                            {!model.pdfLink && (
                              <p className="text-red-500 text-sm font-medium text-center mt-2">
                                PDF not available — test is currently disabled
                                until the content is uploaded.
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CAmonth;
