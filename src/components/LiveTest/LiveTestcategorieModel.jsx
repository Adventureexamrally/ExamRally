import React, { useCallback, useContext, useEffect, useState } from "react";
import { BsQuestionSquare } from "react-icons/bs";
import { IoMdLock } from "react-icons/io";
import { MdOutlineAccessTime } from "react-icons/md";
import { FaTachometerAlt } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { UserContext } from "../../context/UserProvider";
import Api from "../../service/Api";
import { fetchUtcNow } from "../../service/timeApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { CircularProgress } from "@mui/material";

const LiveTestcategorieModel = ({ data, topic, activeSection }) => {
  const [showDifficulty, setShowDifficulty] = useState({});
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const { id } = useParams();
  const queryClient = useQueryClient(); // Add this
const [loadingTests, setLoadingTests] = useState({});

  // Fetch UTC time
  const { 
    data: utcNow, 
    isLoading: isUtcLoading, 
    error: utcError 
  } = useQuery({
    queryKey: ['utcNow'],
    queryFn: fetchUtcNow,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch results for all tests
  const fetchResults = async (testId) => {
    try {
      const res = await Api.get(`/results/${user?._id}/${testId}`);
      return res.data;
    } catch (err) {
      // console.error(`Error fetching result for test ${testId}:`, err);
      return null;
    }
  };

  const { 
    data: resultsData = {}, 
    isLoading: isResultsLoading, 
    error: resultsError 
  } = useQuery({
    queryKey: ['testResults', user?._id],
    queryFn: async () => {
      if (!user?._id || !data?.exams) return {};
      
      const results = {};
      await Promise.all(
        data.exams.map(async (test) => {
          const result = await fetchResults(test._id);
          if (result?.status === "completed" || result?.status === "paused") {
            results[test._id] = {
              ...result,
              lastQuestionIndex: result.lastVisitedQuestionIndex,
              selectedOptions: result.selectedOptions,
            };
          }
        })
      );
      return results;
    },
    enabled: !!user?._id && !!data?.exams,
    staleTime: 1000 * 60, // 1 minute cache
    refetchInterval: 1000 * 60,
    refetchIntervalInBackground: true
  });

  // Check enrollment status
  const { 
    data: enrollmentStatus = { isEnrolled: false, expiredate: null }, 
    isLoading: isEnrollmentLoading, 
    error: enrollmentError 
  } = useQuery({
    queryKey: ['enrollmentStatus', user?._id, data?._id, utcNow],
    queryFn: () => {
      if (!utcNow || !data?._id || (!user?.enrolledCourses && !user?.subscriptions)) {
        return { isEnrolled: false, expiredate: null };
      }

      let isEnrolled = false;
      let daysLeft = null;

      const checkExpiry = (course) => {
        const expireDate = new Date(course?.expiryDate);
        const timeDiff = expireDate.getTime() - utcNow.getTime();
        const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (!isNaN(days) && days >= 0 && course?.courseId?.includes(data._id)) {
          daysLeft = days;
          return true;
        }
        return false;
      };

      isEnrolled = 
        user?.enrolledCourses?.some(checkExpiry) || 
        user?.subscriptions?.some(checkExpiry);

      return { isEnrolled, expiredate: daysLeft };
    },
    enabled: !!utcNow && !!data?._id,
  });

  // Combined loading state
  const isLoading = isUtcLoading || isResultsLoading || isEnrollmentLoading;
  const error = utcError || resultsError || enrollmentError;

  // Utility functions for localStorage
  const getTestStatusFromStorage = (testId) => {
    const storedResults = localStorage.getItem('testResults');
    if (!storedResults) return null;
    
    try {
      const results = JSON.parse(storedResults);
      return results[testId] || null;
    } catch (error) {
      console.error('Error parsing stored test results:', error);
      return null;
    }
  };

  const storeTestStatus = (testId, status, lastQuestionIndex = null, selectedOptions = null) => {
    const storedResults = localStorage.getItem('testResults') || '{}';
    
    try {
      const results = JSON.parse(storedResults);
      results[testId] = {
        status,
        lastQuestionIndex,
        selectedOptions,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('testResults', JSON.stringify(results));
    } catch (error) {
      console.error('Error storing test result:', error);
    }
  };

  const isPaidTest = (test) => {
    return test?.result_type?.toLowerCase() === "paid";
  };

  const handleShowLevelClick = (testId) => {
    setShowDifficulty((prevState) => ({
      ...prevState,
      [testId]: true,
    }));
  };

  const openNewWindow = (url) => {
    const width = screen.width;
    const height = screen.height;
    window.open(
      url,
      "_blank",
      `width=${width},height=${height}`
    );
  };

  // Loading skeleton component
  const TestCardSkeleton = () => (
    <div className="card scale-95 shadow-2xl border-1 rounded-3 border-gray-300 h-full w-full">
      <div className="card-body text-center flex flex-col justify-evenly">
        <Skeleton height={30} width="80%" className="mx-auto" />
        <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
        <Skeleton height={40} className="mt-2" />
        
        <div className="flex justify-center items-center gap-4 mt-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <Skeleton width={60} />
              <div className="flex items-center gap-1">
                <Skeleton circle width={20} height={20} />
                <Skeleton width={20} />
              </div>
            </div>
          ))}
        </div>
        
        <hr className="h-px mt-4 bg-gray-200 border-0 dark:bg-gray-700" />
        <Skeleton height={40} className="mt-3" />
      </div>
    </div>
  );

  // Error component
  const ErrorMessage = () => (
    <div className="text-red-500 p-4 text-center">
      Error loading test data. Please try again later.
    </div>
  );

  if (error) {
    return (
      <div className="modal fade show" style={{ display: 'block' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{topic} - {activeSection}</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <ErrorMessage />
            </div>
          </div>
        </div>
      </div>
    );
  }

  
  // Add this function
  // Updated fetchTestStatuses
const fetchTestStatuses = useCallback(async (testId) => {
  if (testId) {
    console.log(`Fetching status for test ${testId}`);
    
    setLoadingTests(prev => ({ ...prev, [testId]: true }));
  }

  try {
    await queryClient.refetchQueries({
      queryKey: ['testResults', user?._id],
      exact: true,
      refetchType: 'active',
    });
  } finally {
    if (testId) {
      setLoadingTests(prev => ({ ...prev, [testId]: false }));
    }
  }
}, [queryClient, user?._id]);


  // Add message listener
  useEffect(() => {
    const handleMessage = (event) => {
      console.warn("Received message in modal:", event.data);
      console.warn("Event origin:", event.origin , "Current origin:", window.location.origin);
      
      if (event.origin !== window.location.origin) return;
      if (event.data.type === 'test-status-updated') {
        fetchTestStatuses(event.data.testId);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [fetchTestStatuses]);

    // Add focus listener
  // useEffect(() => {
  //   const handleFocus = () => fetchTestStatuses();
  //   window.addEventListener("focus", handleFocus);
  //   return () => window.removeEventListener("focus", handleFocus);
  // }, [fetchTestStatuses]);
  
  console.warn("Results Data:", loadingTests);
  return (
    <div
      className="modal fade"
      id="questionsModal"
      tabIndex="-1"
      aria-labelledby="questionsModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {topic} - {activeSection}{" "}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div
            className="modal-body"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            <div className="row">
              <div className="mt-3 bg-slate-50 py-2 px-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 ">
                  {isLoading ? (
                    [1, 2, 3].map((i) => (
                      <div key={i}>
                        <TestCardSkeleton />
                      </div>
                    ))
                  ) : (
                    data?.exams?.map((test, idx) => {
                      if (
                        test.topic_test?.topic === topic &&
                        (activeSection === "All" ||
                          test.topic_test?.sub_menu === activeSection)
                      ) {
                        return (
                          <div key={idx} className="">
                            <div className="card scale-95 shadow-2xl border-1 rounded-3 transform transition-all duration-300 ease-in-out border-gray-300 hover:scale-100 flex flex-col justify-between h-full w-full ">
                              <div className="card-body text-center flex flex-col justify-evenly">
                                <h5 className="card-title font-bold">
                                  {test.exam_name}
                                </h5>
                                <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
                                {!showDifficulty[test._id] ? (
                                  <button
                                    onClick={() => handleShowLevelClick(test._id)}
                                    className="text-white text-base py-2 px-2 rounded mt-2 w-full bg-[#131656] hover:bg-[#0f1245]"
                                  >
                                    Show Level
                                  </button>
                                ) : (
                                  <div className="mt-2 rounded text-sm px-2 py-2 text-center text-white bg-[#131656]">
                                    <p>
                                      <strong>
                                        {test.q_level.toUpperCase()}
                                      </strong>
                                    </p>
                                  </div>
                                )}

                                <div className="flex justify-center items-center gap-4 mt-2">
                                  <div className="flex flex-col items-center">
                                    <p className="font-medium">Questions</p>
                                    <p className="flex items-center gap-1">
                                      <BsQuestionSquare
                                        size={20}
                                        color="orange"
                                      />
                                      {test.section[0].t_question}
                                    </p>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <p className="font-medium">Marks</p>
                                    <p className="flex items-center gap-1">
                                      <FaTachometerAlt size={20} color="green" />
                                      {test.section[0].t_mark}
                                    </p>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <p className="font-medium">Time</p>
                                    <p className="flex items-center gap-1">
                                      <MdOutlineAccessTime
                                        size={20}
                                        color="red"
                                      />
                                      {test.section[0].t_time}
                                    </p>
                                  </div>
                                </div>
                       <hr className="h-px mt-4 bg-gray-200 border-0 dark:bg-gray-700" />
<div className="flex justify-between items-center py-2 px-4 text-center">
  <div className="flex items-center gap-2">
    <i className="bi bi-translate text-gray-500"></i>
    <p className="font-medium text-gray-700">
      <span className="font-semibold text-gray-600">Language</span>: {test.show_language}
    </p>
  </div>
</div>
                                {(!enrollmentStatus.isEnrolled &&
                                  (isPaidTest(test) ||
                                    new Date(test.live_date) > utcNow)) ||
                                (enrollmentStatus.isEnrolled && enrollmentStatus.expiredate < 0) ? (
                                  <button
                                    className="mt-3 py-2 px-4 rounded w-full border-2 border-green-600 text-green-600 cursor-not-allowed"
                                    disabled
                                  >
                                    <div className="flex items-center justify-center font-semibold gap-1">
                                      <IoMdLock />
                                      Locked
                                    </div>
                                  </button>
                                ) : enrollmentStatus.isEnrolled &&
                                  new Date(test.live_date) > utcNow ? (
                                  <div className={`mt-3 fw-bold py-2 px-6 rounded-md text-center transition-all duration-200 
                                    ${
                                      test.show_date 
                                        ? 'border-1 text-green-500 border-red-700 py-0 px-0 text-wrap cursor-not-allowed' 
                                        : 'text-red-400 border-2 border-gray-200 cursor-not-allowed'
                                    }
                                    shadow-md hover:shadow-lg`}>
                                    {test.show_date
                                      ? `Available from ${new Date(test.live_date).toLocaleString('en-US', {
                                          day: 'numeric',
                                          month: 'long',
                                          year: 'numeric',
                                          hour: 'numeric',
                                          minute: 'numeric',
                                          hour12: true,
                                        })}`
                                      : 'Coming Soon'}
                                  </div>
                                ) : (
                                  <button
                                    className={`mt-3 py-2 px-4 rounded w-full transition ${
                                      (resultsData?.[test._id]?.status === "completed" || 
                                      getTestStatusFromStorage(test._id)?.status === "completed")
                                        ? "bg-green-500 text-white hover:bg-green-600"
                                        : (resultsData?.[test._id]?.status === "paused" || 
                                          getTestStatusFromStorage(test._id)?.status === "paused")
                                        ? "bg-green-500 text-white hover:bg-green-600"
                                        : "bg-green-500 text-white hover:bg-green-600"
                                    }`}

                                    onClick={() => {
                                      if (!isSignedIn) {
                                        const backdrop = document.querySelector(".modal-backdrop");
                                        if (backdrop) backdrop.remove();
                                        navigate("/sign-in");
                                        return;
                                      }

                                      const status = resultsData?.[test._id]?.status || 
                                                    getTestStatusFromStorage(test._id)?.status;

                                      if (status === "completed") {
                                        openNewWindow(`/liveresult/${test._id}/${user?._id}`);
                                      } else if (status === "paused") {
                                        openNewWindow(`/mocklivetest/${test._id}/${user?._id}`);
                                      } else {
                                        openNewWindow(`/instruct/${test._id}/${user?._id}`);
                                      }
                                    }}
                                     disabled={loadingTests[test._id]}

                                  >
                                       {loadingTests[test._id] ? (
                                        <>
                                          <CircularProgress size={18} thickness={4} color="inherit" />
                                        </>
                                      ) : (
                                        (resultsData?.[test._id]?.status === "completed" || getTestStatusFromStorage(test._id)?.status === "completed")
                                          ? "View Result"
                                          : (resultsData?.[test._id]?.status === "paused" || getTestStatusFromStorage(test._id)?.status === "paused")
                                            ? "Resume"
                                            : "Take Test"
                                      )}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTestcategorieModel;