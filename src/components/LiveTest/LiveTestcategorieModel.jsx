import React, { useContext, useState, useEffect } from "react";
import { BsQuestionSquare } from "react-icons/bs";
import { ImCheckmark2 } from "react-icons/im";
import { IoMdLock } from "react-icons/io";
import { MdOutlineAccessTime } from "react-icons/md";
import { FaTachometerAlt } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { UserContext } from "../../context/UserProvider";
import Api from "../../service/Api";
import axios from "axios";
import { fetchUtcNow } from "../../service/timeApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const LiveTestcategorieModel = ({ data, topic, activeSection }) => {
  const [showDifficulty, setShowDifficulty] = useState({});
  const [expiredate, setExpirydate] = useState();
  const queryClient = useQueryClient();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const { id } = useParams();

  // Fetch UTC time
  const { data: utcNow } = useQuery({
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
      console.error(`Error fetching result for test ${testId}:`, err);
      return null;
    }
  };

  const { data: resultsData } = useQuery({
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
    initialData: {},
  });

  // Check enrollment status
  const { data: enrollmentStatus } = useQuery({
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
    initialData: { isEnrolled: false, expiredate: null },
  });

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
      `noopener,noreferrer,width=${width},height=${height}`
    );
  };

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
                  {data?.exams?.map((test, idx) => {
                    if (
                      test.topic_test?.topic === topic &&
                      (activeSection === "All" ||
                        test.topic_test?.sub_menu === activeSection)
                    ) {
                      return (
                        <div key={idx} className="">
                          <div className="card scale-95 shadow-2xl border-1 rounded-3 transform transition-all duration-300 ease-in-out border-gray-300 hover:scale-100 flex flex-col justify-between h-full w-full ">
                            <div className="card-body text-center flex flex-col justify-evenly">
                              <h5 className="card-title font-bold text-">
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
                                      ? 'border-1 text-green-500 border-red-700  py-0 px-0 text-wrap cursor-not-allowed' 
                                      : 'text-red-400  border-2 border-gray-200 cursor-not-allowed'
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
                                >
                                  {(resultsData?.[test._id]?.status === "completed" || 
                                    getTestStatusFromStorage(test._id)?.status === "completed")
                                    ? "View Result"
                                    : (resultsData?.[test._id]?.status === "paused" || 
                                       getTestStatusFromStorage(test._id)?.status === "paused")
                                    ? "Resume"
                                    : "Take Test"}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
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